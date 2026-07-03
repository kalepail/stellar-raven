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
import type { AuthRequest, ClientInfo, OAuthHelpers } from "@cloudflare/workers-oauth-provider";

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
      return landingPage();
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
      return consentPage(oauthReq, client, csrfToken, `/authorize${url.search}`);
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

/**
 * Shared page shell. The whole visual system lives in these three helpers so
 * the landing + consent pages read as one product. Everything here is
 * CSP-safe under PAGE_HEADERS: inline <style> (style-src 'unsafe-inline'),
 * inline <svg> marks (not img-src), system fonts (font-src 'none'), and
 * CSS-only motion — no scripts, no external assets.
 *
 * Design: "raven codemode" — a monospace-as-display type voice (the product
 * is model-written code that runs), on warm near-white, with a single
 * indigo→teal iridescence spent only on the signature element (the code
 * caret, the consent connector, the primary button).
 */
const MONO = `ui-monospace,"SF Mono",SFMono-Regular,"JetBrains Mono",Menlo,Consolas,monospace`;

/** Four-point stellar spark in the raven gradient. Unique gradId per use. */
function ravenMark(gradId: string, size: number): string {
  return (
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">` +
    `<defs><linearGradient id="${gradId}" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">` +
    `<stop stop-color="#4B3BE4"/><stop offset="1" stop-color="#13B8A6"/></linearGradient></defs>` +
    `<path d="M12 1.5 14.6 9.4 22.5 12 14.6 14.6 12 22.5 9.4 14.6 1.5 12 9.4 9.4Z" fill="url(#${gradId})"/></svg>`
  );
}

const PAGE_STYLES =
  `*{box-sizing:border-box}` +
  `html{-webkit-text-size-adjust:100%}` +
  `body{margin:0;min-height:100vh;display:flex;flex-direction:column;background:#FBFAF8;color:#15161B;` +
  `font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.55;` +
  `background-image:radial-gradient(115% 80% at 100% 0%,rgba(75,59,228,.05),transparent 60%),` +
  `radial-gradient(90% 70% at 0% 100%,rgba(19,184,166,.05),transparent 55%);background-attachment:fixed}` +
  `.topbar{display:flex;align-items:center;padding:20px 24px}` +
  `.wordmark{display:flex;align-items:center;gap:.45rem;font-family:${MONO};font-size:13px;letter-spacing:.01em}` +
  `.wordmark b{font-weight:600}.wordmark .sep{color:#CFCCC3}.wordmark span{color:#6B6F7A}` +
  `main{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:4px 24px 56px}` +
  `.stage{width:100%;max-width:520px}.stage-wide{max-width:640px}` +
  `.eyebrow{font-family:${MONO};font-size:11px;letter-spacing:.17em;text-transform:uppercase;color:#6B6F7A;margin:0}` +
  `h1{font-size:clamp(26px,4.6vw,34px);line-height:1.16;letter-spacing:-.021em;font-weight:640;margin:.55rem 0 0}` +
  `.lede{color:#4C505A;font-size:15px;margin:.7rem 0 0}` +
  `code.k{font-family:${MONO};font-size:.85em;background:rgba(20,22,27,.05);border:1px solid #E9E7E1;` +
  `padding:1px 6px;border-radius:6px;color:#15161B;white-space:nowrap}` +
  `.card{background:#fff;border:1px solid #E9E7E1;border-radius:14px;` +
  `box-shadow:0 1px 0 rgba(20,22,27,.02),0 14px 34px -20px rgba(20,22,27,.22)}` +
  `.btn{display:flex;width:100%;align-items:center;justify-content:center;gap:.5rem;padding:13px 18px;border:0;` +
  `border-radius:11px;font:inherit;font-weight:600;font-size:15px;color:#fff;cursor:pointer;` +
  `background:linear-gradient(115deg,#4B3BE4,#13B8A6);box-shadow:0 10px 22px -10px rgba(75,59,228,.55);` +
  `transition:filter .12s ease,box-shadow .12s ease,transform .12s ease}` +
  `.btn:hover{filter:brightness(1.05);box-shadow:0 14px 28px -10px rgba(75,59,228,.6)}` +
  `.btn:active{transform:translateY(1px)}.btn:focus-visible{outline:2px solid #4B3BE4;outline-offset:3px}` +
  `.btn svg{margin-top:1px}` +
  /* consent: connection motif */
  `.conn{display:flex;align-items:center;justify-content:center;margin:2px 0 22px}` +
  `.node{width:58px;height:58px;border-radius:17px;display:flex;align-items:center;justify-content:center;` +
  `background:#fff;border:1px solid #E9E7E1;box-shadow:0 10px 22px -16px rgba(20,22,27,.45)}` +
  `.node.client{font-family:${MONO};font-weight:600;font-size:23px;color:#15161B}` +
  `.wire{position:relative;width:46px;height:2px;background:linear-gradient(90deg,#4B3BE4,#13B8A6)}` +
  `.wire::after{content:"";position:absolute;top:50%;left:50%;width:8px;height:8px;border-radius:50%;` +
  `transform:translate(-50%,-50%);background:#fff;border:2px solid #13B8A6}` +
  `.panel-h{font-family:${MONO};font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:#6B6F7A;` +
  `padding:16px 20px 4px}` +
  `.scopes{list-style:none;margin:0;padding:0 20px}` +
  `.scopes li{display:flex;gap:11px;align-items:flex-start;padding:12px 0;border-top:1px solid #F0EEE8}` +
  `.scopes li:first-child{border-top:0}.tick{flex:none;margin-top:1px}` +
  `.scope-code{font-family:${MONO};font-size:12px;color:#4B3BE4;background:rgba(75,59,228,.07);` +
  `border:1px solid rgba(75,59,228,.16);padding:1px 7px;border-radius:6px}` +
  `.scope-desc{font-size:13.5px;color:#6B6F7A;margin-top:5px}` +
  `.act{padding:16px 20px 20px}` +
  `.note{display:flex;gap:9px;align-items:flex-start;font-size:12.5px;color:#6B6F7A;margin:14px 0 0}` +
  `.note svg{flex:none;margin-top:1px}` +
  /* landing: code panel */
  `.code{margin-top:22px;background:#15171E;border:1px solid #262A34;border-radius:14px;overflow:hidden;` +
  `box-shadow:0 26px 54px -28px rgba(20,22,27,.55)}` +
  `.code-bar{display:flex;align-items:center;gap:7px;padding:11px 15px;border-bottom:1px solid #262A34}` +
  `.dot{width:11px;height:11px;border-radius:50%}` +
  `.code-title{margin-left:auto;font-family:${MONO};font-size:11px;color:#6D7585}` +
  `pre{margin:0;padding:16px 18px;overflow-x:auto;font-family:${MONO};font-size:12.5px;line-height:1.75;color:#C9CEDA}` +
  `.t-com{color:#5C6474}.t-fn{color:#7EE0D0}.t-str{color:#E7B98A}.t-key{color:#9B8CFF}.t-punc{color:#8A93A3}` +
  `.caret{display:inline-block;width:7px;height:1.05em;vertical-align:-2px;margin-left:1px;` +
  `background:#13B8A6;animation:blink 1.1s steps(1) infinite}` +
  `@keyframes blink{50%{opacity:0}}` +
  `.feats{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}` +
  `.feat{flex:1 1 160px;border:1px solid #E9E7E1;border-radius:11px;padding:12px 14px;background:rgba(255,255,255,.6)}` +
  `.feat b{display:block;font-size:13px}.feat span{font-size:12px;color:#6B6F7A}` +
  `.connect{margin-top:24px}` +
  `.kv{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px;font-size:13px}` +
  `.kv>i{font-style:normal;font-family:${MONO};font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;` +
  `color:#8E9199;width:74px}` +
  `footer{padding:16px 24px 26px;text-align:center;font-family:${MONO};font-size:11px;color:#9A9DA6;letter-spacing:.01em}` +
  `@media (prefers-reduced-motion:reduce){.caret{animation:none}.btn{transition:none}}`;

function renderPage(title: string, main: string): string {
  return (
    `<!doctype html><html lang="en"><head>` +
    `<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>` +
    `<title>${title}</title><style>${PAGE_STYLES}</style></head><body>` +
    `<div class="topbar"><div class="wordmark">${ravenMark("rgMark", 18)}` +
    `<b>raven</b><span class="sep">/</span><span>codemode</span></div></div>` +
    `<main>${main}</main>` +
    `<footer>agents.stellar.buzz &middot; one MCP endpoint over the Stellar catalog</footer>` +
    `</body></html>`
  );
}

/** Plain-English gloss for scopes we know; unknown scopes show the code alone. */
const SCOPE_GLOSS: Record<string, string> = {
  mcp: "Run search and execute against the Stellar service catalog on your behalf."
};

const TICK =
  `<svg class="tick" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">` +
  `<path d="M13 4.5 6.5 11 3 7.5" fill="none" stroke="#13B8A6" stroke-width="2" ` +
  `stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARROW =
  `<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">` +
  `<path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="#fff" stroke-width="1.7" ` +
  `stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SHIELD =
  `<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">` +
  `<path d="M8 1.5 13 3.3v4.2c0 3-2.1 5.5-5 6.9-2.9-1.4-5-3.9-5-6.9V3.3L8 1.5Z" ` +
  `fill="none" stroke="#B9BCC4" stroke-width="1.3" stroke-linejoin="round"/></svg>`;

function consentPage(
  oauthReq: AuthRequest,
  client: ClientInfo | null,
  csrfToken: string,
  formAction: string
): Response {
  const clientName = escapeHtml(client?.clientName?.trim() || oauthReq.clientId || "Unknown MCP client");
  const initial = escapeHtml(
    (client?.clientName?.trim() || oauthReq.clientId || "?").charAt(0).toUpperCase()
  );
  const scopes = oauthReq.scope.length ? oauthReq.scope : ["(no scopes requested)"];
  const scopeItems = scopes
    .map((s) => {
      const gloss = SCOPE_GLOSS[s];
      return (
        `<li>${TICK}<div><code class="scope-code">${escapeHtml(s)}</code>` +
        (gloss ? `<div class="scope-desc">${escapeHtml(gloss)}</div>` : ``) +
        `</div></li>`
      );
    })
    .join("");
  const main =
    `<div class="stage">` +
    `<div class="conn"><div class="node client">${initial}</div>` +
    `<div class="wire"></div><div class="node">${ravenMark("rgNode", 30)}</div></div>` +
    `<p class="eyebrow" style="text-align:center">Authorize connection</p>` +
    `<h1 style="text-align:center">${clientName} wants to connect</h1>` +
    `<p class="lede" style="text-align:center">It will access <b>stellar-raven-codemode</b> as you, ` +
    `once you sign in with WorkOS.</p>` +
    `<div class="card" style="margin-top:22px">` +
    `<div class="panel-h">This connection grants</div>` +
    `<ul class="scopes">${scopeItems}</ul>` +
    `<div class="act"><form method="post" action="${escapeHtml(formAction)}">` +
    `<input type="hidden" name="csrf_token" value="${escapeHtml(csrfToken)}"/>` +
    `<button class="btn" type="submit">Approve and continue ${ARROW}</button></form>` +
    `<p class="note">${SHIELD}<span>Only continue if you started this connection. ` +
    `Approving redirects you to WorkOS AuthKit to sign in — your password never reaches this server.` +
    `</span></p></div></div></div>`;
  return html(renderPage("Authorize &middot; raven codemode", main), {
    "set-cookie": setCookie(CONSENT_CSRF_COOKIE, csrfToken)
  });
}

function landingPage(): Response {
  const sample =
    `<span class="t-com">// the model discovers, then writes the JS that runs</span>\n` +
    `<span class="t-fn">search</span>(<span class="t-str">"swap 100 XLM to USDC on soroswap"</span>)\n\n` +
    `<span class="t-fn">execute</span>(<span class="t-str">&#96;\n` +
    `  const quote = await scout.soroswap.quote({ ... });\n` +
    `  return quote.envelope;\n` +
    `&#96;</span>)\n\n` +
    `<span class="t-punc">&rarr;</span> { <span class="t-key">ok</span>: <span class="t-key">true</span>, ` +
    `<span class="t-key">source</span>: <span class="t-str">"scout"</span>, ` +
    `<span class="t-key">data</span>: { &hellip; } }<span class="caret"></span>`;
  const main =
    `<div class="stage stage-wide">` +
    `<p class="eyebrow">Remote MCP server</p>` +
    `<h1>The Stellar toolbox,<br/>handed to your agent.</h1>` +
    `<p class="lede">Connect an MCP client for two tools: <code class="k">search</code> to discover ` +
    `across Lumenloop, Stellar Light/Scout, the Stellar docs, and a curated library of ecosystem ` +
    `skills, and <code class="k">execute</code> to run ` +
    `model-written JavaScript in a sandbox with no network.</p>` +
    `<div class="code"><div class="code-bar">` +
    `<span class="dot" style="background:#FF5F57"></span>` +
    `<span class="dot" style="background:#FEBC2E"></span>` +
    `<span class="dot" style="background:#28C840"></span>` +
    `<span class="code-title">agent &rarr; /mcp</span></div>` +
    `<pre>${sample}</pre></div>` +
    `<div class="feats">` +
    `<div class="feat"><b>Unified catalog</b><span>Ops, docs &amp; skills, one manifest</span></div>` +
    `<div class="feat"><b>Sandboxed execute</b><span>No network egress</span></div>` +
    `<div class="feat"><b>OAuth 2.1</b><span>WorkOS AuthKit sign-in</span></div></div>` +
    `<div class="connect"><p class="eyebrow">Connect</p>` +
    `<div class="kv"><i>Endpoint</i><code class="k">https://agents.stellar.buzz/mcp</code></div>` +
    `<div class="kv"><i>Discovery</i><code class="k">/.well-known/oauth-authorization-server</code></div>` +
    `</div></div>`;
  return html(renderPage("stellar-raven-codemode", main));
}

const PAGE_HEADERS: Record<string, string> = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "no-store",
  // Consent page hardening: no scripts, no framing, no base tricks.
  // (No `form-action` — Chromium can block the POST/redirect chain with it;
  // the CSRF token + bound state cookie protect the form instead.)
  "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'",
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff"
};

function html(body: string, headers: Record<string, string> = {}): Response {
  return new Response(body, { headers: { ...PAGE_HEADERS, ...headers } });
}

function text(body: string, status: number, headers: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", ...headers }
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
