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
import { createMcpHandler } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools, SERVER_INSTRUCTIONS } from "./mcp/tools";
import { createExecuteRunner, type ExecuteRunner } from "./executor/run";
import {
  allowDevUnauthenticated,
  isAdminAuthorized,
  isAuthServerMetadataAlias,
  oauthProviderOptions,
  rewritePath
} from "./auth/gate";
import { logEvent } from "./observability";

const SERVER_INFO = { name: "stellar-raven-codemode", version: "0.1.0" };

// One runner per isolate (providers + catalog + spec are env-stable); each
// `execute` call still gets its own fresh Dynamic Worker via LOADER.load().
let cachedRunner: ExecuteRunner | undefined;
function getRunner(env: Env): ExecuteRunner {
  cachedRunner ??= createExecuteRunner(env);
  return cachedRunner;
}

// Stateless: fresh McpServer per request (research/codemode.md §6). Used
// both as the provider's /mcp apiHandler (token already validated there)
// and directly for the two bypasses.
const mcpHandler = {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Response | Promise<Response> {
    // instructions surfaces in the client's system prompt at initialize time
    // (per-session, unlike tool descriptions which models skim once) — the
    // workflow + result-envelope contract lives there too.
    const server = new McpServer(SERVER_INFO, { instructions: SERVER_INSTRUCTIONS });
    registerTools(server, { runExecute: getRunner(env) });
    return createMcpHandler(server, { route: "/mcp" })(request, env, ctx);
  }
};

const oauthProvider = new OAuthProvider(oauthProviderOptions(mcpHandler));

function isMcpPath(url: URL): boolean {
  return url.pathname === "/mcp" || url.pathname.startsWith("/mcp/");
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
        return mcpHandler.fetch(request, env, ctx);
      }
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
