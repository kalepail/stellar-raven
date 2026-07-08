/**
 * Worker entry — stateless remote MCP server (PLAN §1).
 *
 * A fresh McpServer is created per request and served over streamable HTTP at
 * /mcp via `createMcpHandler` from agents/mcp (research/codemode.md §6).
 * No Durable Objects; no session state.
 *
 * Auth (PLAN §7 phase 8, research/auth-workos.md): /mcp is wrapped by
 * @cloudflare/workers-oauth-provider — this server is its own OAuth 2.1
 * authorization server (opaque tokens in OAUTH_KV; /token, /register, and
 * the .well-known discovery docs come from the lib), with WorkOS AuthKit as
 * the upstream IdP behind /authorize + /callback (src/auth/workos.ts).
 * Two bypasses, checked BEFORE the provider (src/auth/gate.ts):
 *  1. admin — MCP_ADMIN_TOKEN secret via bearer/X-MCP-Admin-Token header;
 *  2. local dev — DEV_ALLOW_UNAUTHENTICATED=true from `.dev.vars` only, AND
 *     only on a loopback hostname (a deployed var is inert on the public domain).
 */
import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { createMcpHandler, getMcpAuthContext } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools, SERVER_INSTRUCTIONS } from "./mcp/tools";
import type { ExecuteRunner } from "./executor/run";
import { modelBoundaryMaxTokensFromEnv } from "./policy/truncate";
import {
  allowDevUnauthenticated,
  isAdminAuthorized,
  isAuthServerMetadataAlias,
  oauthProviderOptions,
  rewritePath
} from "./auth/gate";
import { demoLoginRedirect } from "./auth/workos";
import { verifyDemoCookie } from "./demo/auth";
import { DEMO_PAGE_HEADERS, demoPage } from "./demo/page";
import { logEvent } from "./observability";

const SERVER_INFO = { name: "stellar-raven-codemode", version: "0.1.0" };
const DEV_LOCAL_ARTIFACT_OWNER = "dev-local";

// One runner per isolate (providers + catalog + spec are env-stable); each
// `execute` call still gets its own fresh Dynamic Worker via LOADER.load().
let cachedRunner: ExecuteRunner | undefined;
let cachedRunnerMaxTokens: number | undefined;
let executeRunnerModule: Promise<typeof import("./executor/run")> | undefined;
async function getRunner(env: Env): Promise<ExecuteRunner> {
  const modelBoundaryMaxTokens = modelBoundaryMaxTokensFromEnv(env as unknown as Record<string, unknown>);
  if (!cachedRunner || cachedRunnerMaxTokens !== modelBoundaryMaxTokens) {
    const { createExecuteRunner } = await (executeRunnerModule ??= import("./executor/run"));
    cachedRunner = createExecuteRunner(env, { modelBoundaryMaxTokens });
    cachedRunnerMaxTokens = modelBoundaryMaxTokens;
  }
  return cachedRunner;
}

function oauthArtifactOwner(): string | undefined {
  const subject = getMcpAuthContext()?.props.subject;
  return typeof subject === "string" && subject.length > 0 ? subject : undefined;
}

export function resolveArtifactOwner(
  oauthSubject: string | undefined,
  devBypassFired: boolean
): string | undefined {
  if (oauthSubject) return oauthSubject;
  return devBypassFired ? DEV_LOCAL_ARTIFACT_OWNER : undefined;
}

// Stateless: fresh McpServer per request (research/codemode.md §6). Used
// both as the provider's /mcp apiHandler (token already validated there)
// and directly for the two bypasses.
const mcpHandler = {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
    opts: { devBypassFired?: boolean } = {}
  ): Promise<Response> {
    // instructions surfaces in the client's system prompt at initialize time
    // (per-session, unlike tool descriptions which models skim once) — the
    // workflow + result-envelope contract lives there too.
    const server = new McpServer(SERVER_INFO, { instructions: SERVER_INSTRUCTIONS });
    const requestId = crypto.randomUUID();
    const rayId = request.headers.get("cf-ray") ?? undefined;
    const runner = await getRunner(env);
    registerTools(server, {
      runExecute: (code, callContext) => runner(code, callContext),
      executeContext: () => ({
        artifactOwner: resolveArtifactOwner(oauthArtifactOwner(), opts.devBypassFired === true),
        requestId,
        rayId
      }),
      modelBoundaryMaxTokens: modelBoundaryMaxTokensFromEnv(env as unknown as Record<string, unknown>)
    });
    return createMcpHandler(server, { route: "/mcp" })(request, env, ctx);
  }
};

const oauthProvider = new OAuthProvider(oauthProviderOptions(mcpHandler));

function isMcpPath(url: URL): boolean {
  return url.pathname === "/mcp" || url.pathname.startsWith("/mcp/");
}

// Exact paths only (review finding 6: no startsWith that would catch
// /playgrounds) — anything else under /playground* falls through to the
// provider's defaultHandler 404. The legacy /demo{,/} page URL is matched too,
// solely so handlePlaygroundRoute can 301 it to /playground.
function isPlaygroundPath(url: URL): boolean {
  return (
    url.pathname === "/playground" ||
    url.pathname === "/playground/" ||
    url.pathname === "/playground/login" ||
    url.pathname === "/playground/chat" ||
    url.pathname === "/demo" ||
    url.pathname === "/demo/"
  );
}

/**
 * /playground routes — a browser surface gated by the signed demo cookie (plus
 * the same loopback dev bypass /mcp honors), never by the OAuth provider.
 * Matched paths with an unsupported method get 405 here; only unmatched paths
 * fall through to the provider. The retired /demo{,/} URL 301s to /playground.
 */
async function handlePlaygroundRoute(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL
): Promise<Response> {
  const isRead = request.method === "GET" || request.method === "HEAD";

  // Retired page URL — permanent redirect to the current /playground path.
  // Relative Location (RFC 7231 §7.1.2): same-origin, and avoids reconstructing
  // the host/port from the request URL.
  if (url.pathname === "/demo" || url.pathname === "/demo/") {
    return new Response(null, { status: 301, headers: { location: "/playground" } });
  }

  if (url.pathname === "/playground" || url.pathname === "/playground/") {
    if (!isRead) return methodNotAllowed("GET, HEAD");
    // No cookie present → verify returns null without needing the secret.
    const subject = await verifyDemoCookie(env.MCP_SERVER_SECRET, request.headers.get("cookie"));
    const authenticated = subject !== null || allowDevUnauthenticated(env, url.hostname);
    return new Response(demoPage({ authenticated }), { headers: DEMO_PAGE_HEADERS });
  }

  if (url.pathname === "/playground/login") {
    // GET only (not HEAD): the redirect parks single-use state in KV — probe
    // requests must not mint state.
    if (request.method !== "GET") return methodNotAllowed("GET");
    return demoLoginRedirect(request, env);
  }

  // /playground/chat — handleDemoChat owns the full gauntlet (method, origin,
  // auth, throttle, body) and answers 405 for non-POST itself.
  const { handleDemoChat } = await import("./demo/chat");
  return handleDemoChat(request, env, ctx);
}

function methodNotAllowed(allow: string): Response {
  return Response.json(
    { error: "method_not_allowed", hint: `Allowed: ${allow}` },
    { status: 405, headers: { allow, "cache-control": "no-store" } }
  );
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    // Bypasses skip the provider entirely and hit the MCP handler directly.
    if (isMcpPath(url)) {
      if (await isAdminAuthorized(request, env)) {
        logEvent("mcp_request", { auth: "admin", method: request.method });
        return mcpHandler.fetch(request, env, ctx);
      }
      if (allowDevUnauthenticated(env, url.hostname)) {
        logEvent("mcp_request", { auth: "dev-bypass", method: request.method });
        return mcpHandler.fetch(request, env, ctx, { devBypassFired: true });
      }
    }

    // /playground — cookie-gated browser surface, intercepted BEFORE the
    // provider (it knows nothing about these routes).
    if (isPlaygroundPath(url)) {
      return handlePlaygroundRoute(request, env, ctx, url);
    }

    // Discovery aliases (path-suffixed RFC 8414 + OIDC-discovery paths) →
    // the lib's exact-path RFC 8414 endpoint (see gate.ts).
    if (isAuthServerMetadataAlias(url)) {
      return oauthProvider.fetch(rewritePath(request, "/.well-known/oauth-authorization-server"), env, ctx);
    }

    // Everything else — /mcp (token-checked), /token, /register, the
    // .well-known docs, and the defaultHandler (/, /health, /authorize,
    // /callback, 404) — belongs to the provider.
    const response = await oauthProvider.fetch(request, env, ctx);
    if (isMcpPath(url)) {
      // 401 = rejected token/anonymous; anything else = OAuth-authenticated.
      logEvent("mcp_request", { auth: "oauth", method: request.method, status: response.status });
    }
    return response;
  }
} satisfies ExportedHandler<Env>;
