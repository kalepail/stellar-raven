/**
 * Auth gate — the two bypasses plus the OAuthProvider wiring options
 * (research/auth-workos.md).
 *
 * Everything at /mcp is WorkOS-backed OAuth EXCEPT:
 *  1. Admin token — `MCP_ADMIN_TOKEN` secret presented as
 *     `Authorization: Bearer` or `X-MCP-Admin-Token`, compared as SHA-256
 *     digests with a timing-safe equality check. Unset secret → bypass off.
 *  2. Local dev — `DEV_ALLOW_UNAUTHENTICATED=true` AND the request hostname is
 *     local (localhost / 127.0.0.1 / ::1). wrangler dev serves on localhost so
 *     local dev keeps working; the local-host gate is a second factor so a
 *     mistakenly-deployed var does NOTHING on the public domain
 *     (agents.stellar.buzz). Still set ONLY in `.dev.vars`.
 *
 * Pure module: no cloudflare:workers import (the OAuthProvider class itself
 * imports it, so `new OAuthProvider(...)` lives in src/server.ts; tests
 * construct one from these same options with `cloudflare:workers` aliased —
 * see vitest.config.ts). Unit-tested in test/auth.test.ts.
 */
import type { OAuthProviderOptions } from "@cloudflare/workers-oauth-provider";
import { WorkOSAuthHandler } from "./workos";
import { timingSafeEqualBytes } from "./timing";

// Re-export from the leaf module (src/auth/timing.ts) — existing importers
// (tests) keep this path; demo code imports the leaf directly to avoid a
// module cycle through workos.ts.
export { timingSafeEqualBytes };

const DAY_SECONDS = 24 * 60 * 60;
/** Our opaque access tokens live 90 days (prior-art default; refresh works too). */
export const ACCESS_TOKEN_TTL_SECONDS = 90 * DAY_SECONDS;
/** Dynamically registered MCP clients live a year. */
export const CLIENT_REGISTRATION_TTL_SECONDS = 365 * DAY_SECONDS;

/** The single scope this server understands. */
export const MCP_SCOPE = "mcp";

/**
 * Options for `new OAuthProvider(...)` — exported (rather than the instance)
 * so plain-Node tests can build a provider around a stub /mcp handler and
 * assert the real emitted behavior (401 + WWW-Authenticate, discovery docs).
 */
export function oauthProviderOptions(
  mcpHandler: ExportedHandler<Env> & { fetch: NonNullable<ExportedHandler<Env>["fetch"]> }
): OAuthProviderOptions<Env> {
  return {
    apiHandlers: { "/mcp": mcpHandler },
    defaultHandler: WorkOSAuthHandler,
    authorizeEndpoint: "/authorize",
    tokenEndpoint: "/token",
    clientRegistrationEndpoint: "/register",
    accessTokenTTL: ACCESS_TOKEN_TTL_SECONDS,
    clientRegistrationTTL: CLIENT_REGISTRATION_TTL_SECONDS,
    scopesSupported: [MCP_SCOPE],
    // OAuth 2.1 posture: S256 PKCE only.
    allowPlainPKCE: false,
    // CIMD (URL-based client_ids — no dynamic-registration round trip). Also
    // needs the `global_fetch_strictly_public` compat flag (wrangler.jsonc);
    // the provider gates on BOTH before advertising/serving it.
    clientIdMetadataDocumentEnabled: true,
    // RFC 9728 protected-resource metadata — how Claude/Cursor connectors
    // discover that /mcp is OAuth-protected and where to authorize.
    resourceMetadata: {
      scopes_supported: [MCP_SCOPE],
      resource_name: "stellar-raven-codemode MCP"
    }
  };
}

/**
 * Admin bypass: does the request carry the MCP_ADMIN_TOKEN secret?
 * Accepts `Authorization: Bearer <token>` or `X-MCP-Admin-Token: <token>`.
 * Always false when the secret is unset (e.g. never-configured deploys).
 */
export async function isAdminAuthorized(
  request: Request,
  env: Pick<Env, "MCP_ADMIN_TOKEN">
): Promise<boolean> {
  const configured: string | undefined = env.MCP_ADMIN_TOKEN;
  if (!configured) return false;
  const authorization = request.headers.get("authorization") ?? "";
  const bearer = authorization.toLowerCase().startsWith("bearer ") ? authorization.slice(7).trim() : "";
  const presented = bearer || request.headers.get("x-mcp-admin-token") || "";
  if (!presented) return false;
  const [expected, actual] = await Promise.all([sha256Bytes(configured), sha256Bytes(presented)]);
  return timingSafeEqualBytes(expected, actual);
}

/** Loopback hostnames wrangler dev binds to (URL.hostname forms). */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

/**
 * Local-dev bypass: the var must be the exact string "true" (only ever set via
 * `.dev.vars`) AND the request must be to a loopback hostname. The hostname
 * gate is a hard second factor — a var mistakenly deployed to production does
 * nothing, because agents.stellar.buzz is not a local host.
 */
export function allowDevUnauthenticated(
  env: Partial<Pick<Env, "DEV_ALLOW_UNAUTHENTICATED">>,
  hostname: string
): boolean {
  if (env.DEV_ALLOW_UNAUTHENTICATED !== "true") return false;
  return LOCAL_HOSTS.has(hostname.toLowerCase());
}

async function sha256Bytes(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

/**
 * workers-oauth-provider 0.8.1 serves RFC 8414 metadata only at the EXACT
 * path `/.well-known/oauth-authorization-server` (verified in its dist).
 * Two families of client requests are aliased onto that path:
 *  1. the RFC 8414 §3.1 path-suffixed form (`.../oauth-authorization-server/mcp`)
 *     — our issuer has no path component, so only non-conforming clients that
 *     wrongly append the resource path send this;
 *  2. OIDC discovery `/.well-known/openid-configuration` (exact + suffixed) —
 *     RFC 8414 §5 lets an OAuth-only AS publish its metadata there too, and
 *     the MCP spec (2025-11-25) requires clients to support both mechanisms;
 *     some clients probe only this one (spec-compliance review in
 *     research/auth-workos.md).
 * (The RFC 9728 `/.well-known/oauth-protected-resource/mcp` form IS handled
 * natively by the lib — no alias needed there.)
 */
export function isAuthServerMetadataAlias(url: URL): boolean {
  return (
    url.pathname.startsWith("/.well-known/oauth-authorization-server/") ||
    url.pathname === "/.well-known/openid-configuration" ||
    url.pathname.startsWith("/.well-known/openid-configuration/")
  );
}

export function rewritePath(request: Request, pathname: string): Request {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url.toString(), request);
}
