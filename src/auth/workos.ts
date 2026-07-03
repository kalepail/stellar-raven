/**
 * WorkOS AuthKit handler — the OAuthProvider `defaultHandler`
 * (research/auth-workos.md).
 *
 * This server IS its own OAuth 2.1 authorization server:
 * @cloudflare/workers-oauth-provider implements /token, /register, PKCE, and
 * opaque-token storage in OAUTH_KV. WorkOS is only the upstream IdP that
 * authenticates the human — MCP clients never talk to WorkOS. No WorkOS SDK:
 * the whole hop is a redirect to /user_management/authorize plus one POST to
 * /user_management/authenticate.
 *
 * Identity hygiene (prior art ADR-0016 lesson): the WorkOS access token is
 * dropped right after the code exchange — never stored, never in props. The
 * only identity that moves forward is `subject`, a peppered hash of the
 * WorkOS user id (colon-free hex; the provider's opaque tokens use `:` as a
 * separator, so the userId must not contain one).
 *
 * Confused-deputy defences (we are an OAuth proxy — server to the MCP
 * client, client to WorkOS):
 *  1. Consent page — GET /authorize NAMES the requesting client and its
 *     scopes; only the explicit POST approval parks state and redirects to
 *     WorkOS, so cached WorkOS consent can't be ridden silently.
 *  2. Double-submit CSRF cookie on the consent form itself.
 *  3. Browser-binding cookie for the WorkOS round trip — /callback requires
 *     the cookie to match the value parked in KV alongside the state.
 *
 * `redirect_uri` is always `${origin}/callback` (origin-derived, no env
 * switch) so one code path serves local wrangler dev and production.
 *
 * Pure module: no cloudflare:workers import (type-only provider imports) —
 * unit-testable under plain Node (test/auth.test.ts).
 */
import type { AuthRequest, OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import {
  CONSENT_HEADERS,
  LANDING_HEADERS,
  ROBOTS_HEADERS,
  SITEMAP_HEADERS,
  consentPage,
  landingPage,
  robotsTxt,
  sitemapXml
} from "../site";
import { OG_PNG_BASE64 } from "../og";

// env.OAUTH_PROVIDER is injected by OAuthProvider before it invokes the
// default handler; wrangler types can't see it, so declare it here.
declare global {
  interface Env {
    OAUTH_PROVIDER: OAuthHelpers;
  }
}

const WORKOS_AUTHORIZE_URL = "https://api.workos.com/user_management/authorize";
const WORKOS_AUTHENTICATE_URL = "https://api.workos.com/user_management/authenticate";

/** Parked /authorize requests expire from OAUTH_KV after 10 minutes. */
export const LOGIN_STATE_TTL_SECONDS = 10 * 60;

/** Consent-form double-submit CSRF cookie (GET sets, POST validates + clears). */
const CONSENT_CSRF_COOKIE = "__Host-MCP_CONSENT_CSRF";
/** Browser-binding cookie for the WorkOS round trip (POST sets, /callback validates + clears). */
const STATE_BINDING_COOKIE = "__Host-MCP_STATE";
const COOKIE_ATTRS = "HttpOnly; Secure; Path=/; SameSite=Lax";

/** Shape parked in KV under `login:${state}`: parsed request + bound cookie secret. */
type ParkedLogin = {
  oauthReq: AuthRequest;
  binding: string;
};

type WorkOSAuthenticateResponse = {
  user?: { id?: string };
};

export const WorkOSAuthHandler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const provider = env.OAUTH_PROVIDER;

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(landingPage(), { headers: LANDING_HEADERS });
    }

    if (request.method === "GET" && url.pathname === "/og.png") {
      return ogImageResponse();
    }

    if (request.method === "GET" && url.pathname === "/robots.txt") {
      return new Response(robotsTxt(), { headers: ROBOTS_HEADERS });
    }

    if (request.method === "GET" && url.pathname === "/sitemap.xml") {
      return new Response(sitemapXml(), { headers: SITEMAP_HEADERS });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "ok", service: "stellar-raven-codemode" });
    }

    if (url.pathname === "/authorize" && request.method === "GET") {
      const oauthReq = await parseAuthRequest(provider, request);
      if (!oauthReq) return text("Invalid authorization request", 400);
      const client = await provider.lookupClient(oauthReq.clientId);
      // Double-submit CSRF: random token goes into both a cookie and a
      // hidden form field; POST requires them to match.
      const csrfToken = crypto.randomUUID();
      const body = consentPage({
        clientName: client?.clientName?.trim() || oauthReq.clientId || "Unknown MCP client",
        scopes: oauthReq.scope,
        csrfToken,
        formAction: `/authorize${url.search}`
      });
      return new Response(body, {
        headers: { ...CONSENT_HEADERS, "set-cookie": setCookie(CONSENT_CSRF_COOKIE, csrfToken) }
      });
    }

    if (url.pathname === "/authorize" && request.method === "POST") {
      const oauthReq = await parseAuthRequest(provider, request);
      if (!oauthReq) return text("Invalid authorization request", 400);

      const form = await request.formData();
      const fromForm = form.get("csrf_token");
      const fromCookie = readCookie(request, CONSENT_CSRF_COOKIE);
      if (typeof fromForm !== "string" || !fromCookie || fromForm !== fromCookie) {
        return text("CSRF token mismatch", 400, { "set-cookie": clearCookie(CONSENT_CSRF_COOKIE) });
      }

      // Park the parsed request for /callback; the binding secret ties the
      // WorkOS round trip to this browser.
      const state = crypto.randomUUID();
      const binding = crypto.randomUUID();
      await env.OAUTH_KV.put(
        `login:${state}`,
        JSON.stringify({ oauthReq, binding } satisfies ParkedLogin),
        { expirationTtl: LOGIN_STATE_TTL_SECONDS }
      );

      const authorize = new URL(WORKOS_AUTHORIZE_URL);
      authorize.searchParams.set("response_type", "code");
      authorize.searchParams.set("client_id", env.WORKOS_CLIENT_ID);
      authorize.searchParams.set("redirect_uri", `${url.origin}/callback`);
      authorize.searchParams.set("provider", "authkit");
      authorize.searchParams.set("state", state);

      const headers = new Headers({ location: authorize.toString() });
      headers.append("set-cookie", setCookie(STATE_BINDING_COOKIE, binding));
      headers.append("set-cookie", clearCookie(CONSENT_CSRF_COOKIE));
      return new Response(null, { status: 302, headers });
    }

    if (url.pathname === "/callback" && request.method === "GET") {
      return completeCallback(request, env, provider, url);
    }

    return Response.json(
      { error: "not found", hint: "MCP endpoint is POST /mcp (OAuth or admin token required)" },
      { status: 404 }
    );
  }
} satisfies ExportedHandler<Env>;

async function completeCallback(
  request: Request,
  env: Env,
  provider: OAuthHelpers,
  url: URL
): Promise<Response> {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return text("Missing code/state", 400);

  const stored = await env.OAUTH_KV.get(`login:${state}`);
  if (!stored) {
    return text("Invalid or expired state", 400, { "set-cookie": clearCookie(STATE_BINDING_COOKIE) });
  }
  const parked = JSON.parse(stored) as ParkedLogin;
  const presented = readCookie(request, STATE_BINDING_COOKIE);
  // Single-use: delete the parked state before any exchange, match or not.
  await env.OAUTH_KV.delete(`login:${state}`);
  if (!presented || presented !== parked.binding) {
    return text("State binding mismatch", 400, { "set-cookie": clearCookie(STATE_BINDING_COOKIE) });
  }

  const workosResponse = await fetch(WORKOS_AUTHENTICATE_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(workosAuthenticateBody(env, code))
  });
  if (!workosResponse.ok) {
    // Status only — never log the body (may echo request fields).
    console.warn(`WorkOS authenticate failed: HTTP ${workosResponse.status}`);
    return text("WorkOS authentication failed", 502, { "set-cookie": clearCookie(STATE_BINDING_COOKIE) });
  }
  const auth = (await workosResponse.json()) as WorkOSAuthenticateResponse;
  const workosUserId = auth.user?.id;
  if (!workosUserId) {
    console.warn("WorkOS authenticate response missing user id");
    return text("WorkOS authentication failed", 502, { "set-cookie": clearCookie(STATE_BINDING_COOKIE) });
  }

  // WorkOS token dropped here; only the peppered subject hash moves forward.
  const subject = await deriveSubject(workosUserId, env.MCP_SERVER_SECRET);
  const scopes = parked.oauthReq.scope ?? [];
  const { redirectTo } = await provider.completeAuthorization({
    request: parked.oauthReq,
    userId: subject,
    scope: scopes,
    metadata: { via: "workos-authkit" },
    props: { subject, scopes }
  });

  return new Response(null, {
    status: 302,
    headers: { location: redirectTo, "set-cookie": clearCookie(STATE_BINDING_COOKIE) }
  });
}

/**
 * Body for POST /user_management/authenticate — pure so tests can assert the
 * exact WorkOS contract without a network. client_secret is the WorkOS API
 * key (that's WorkOS's naming, not ours).
 */
export function workosAuthenticateBody(
  env: Pick<Env, "WORKOS_CLIENT_ID" | "WORKOS_API_KEY">,
  code: string
): Record<string, string> {
  return {
    client_id: env.WORKOS_CLIENT_ID,
    client_secret: env.WORKOS_API_KEY,
    grant_type: "authorization_code",
    code
  };
}

/** Stable pseudonymous user id: hex(SHA-256(`${workosUserId}:${serverSecret}`)). */
export function deriveSubject(workosUserId: string, serverSecret: string): Promise<string> {
  // A missing secret would pepper every subject with the literal "undefined"
  // (silent pepper loss → trivially reversible pseudonyms). Fail loudly instead.
  if (!serverSecret) {
    throw new Error("MCP_SERVER_SECRET is unset — cannot derive a peppered subject");
  }
  return sha256Hex(`${workosUserId}:${serverSecret}`);
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function parseAuthRequest(provider: OAuthHelpers, request: Request): Promise<AuthRequest | null> {
  try {
    return await provider.parseAuthRequest(request);
  } catch {
    return null;
  }
}

function readCookie(request: Request, name: string): string | null {
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${name}=`)) return trimmed.slice(name.length + 1);
  }
  return null;
}

function setCookie(name: string, value: string): string {
  return `${name}=${value}; ${COOKIE_ATTRS}; Max-Age=${LOGIN_STATE_TTL_SECONDS}`;
}

function clearCookie(name: string): string {
  return `${name}=; ${COOKIE_ATTRS}; Max-Age=0`;
}

function text(body: string, status: number, headers: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", ...headers }
  });
}

// Decoded once per isolate (the ~200KB base64 is a module constant): undefined
// = not yet decoded, null = no image bundled, else the PNG bytes.
let ogPngBytes: Uint8Array | null | undefined;

/** Serve the social-preview image (base64 PNG in ../og). 404 until generated. */
function ogImageResponse(): Response {
  if (ogPngBytes === undefined) {
    ogPngBytes = OG_PNG_BASE64
      ? Uint8Array.from(atob(OG_PNG_BASE64), (c) => c.charCodeAt(0))
      : null;
  }
  if (!ogPngBytes) return text("not found", 404);
  return new Response(ogPngBytes, {
    headers: { "content-type": "image/png", "cache-control": "public, max-age=86400" }
  });
}
