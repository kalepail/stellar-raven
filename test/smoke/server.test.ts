/**
 * Offline smoke of src/server.ts — the ASSEMBLED router (Solo todo 833).
 * Its building blocks (gate.ts bypass logic, provider options, site pages)
 * are unit-tested in plain Node; what plain Node cannot exercise is this
 * file's dispatch wiring: bypass-before-provider ordering, the hostname
 * second factor at the URL level, the discovery-alias rewrite into the
 * provider, and defaultHandler routing. SELF drives the real `main` worker
 * from wrangler.jsonc, so a route-assembly regression fails here instead of
 * shipping green.
 *
 * Auth values are the test-only fakes from test/smoke/vitest.config.ts.
 * Requests to /mcp go through the FULL stack — McpServer construction,
 * tool registration, streamable HTTP — so the admin-bypass case doubles as
 * an initialize smoke (server info + instructions present).
 */
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

const PUBLIC = "https://raven.stellar.buzz";
const LOCAL = "http://localhost";

function initializeBody(): string {
  return JSON.stringify({
    jsonrpc: "2.0",
    id: 0,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "smoke-test", version: "0.0.0" }
    }
  });
}

async function postInitialize(url: string, headers: Record<string, string> = {}): Promise<Response> {
  return SELF.fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...headers
    },
    body: initializeBody()
  });
}

/** Streamable HTTP responses arrive as SSE — take the last `data:` payload. */
async function lastEventJson(res: Response): Promise<{ result?: { serverInfo?: { name?: string }; instructions?: string } }> {
  const text = await res.text();
  const data = text
    .split("\n")
    .filter((l) => l.startsWith("data:"))
    .map((l) => l.slice(5).trim());
  return JSON.parse(data[data.length - 1] ?? text) as ReturnType<typeof JSON.parse>;
}

describe("defaultHandler routes", () => {
  it("GET /health returns the service heartbeat", async () => {
    const res = await SELF.fetch(`${PUBLIC}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", service: "stellar-raven-codemode" });
  });

  it("GET / serves the landing page", async () => {
    const res = await SELF.fetch(`${PUBLIC}/`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("unknown paths fall through to 404", async () => {
    const res = await SELF.fetch(`${PUBLIC}/definitely-not-a-route`);
    expect(res.status).toBe(404);
  });
});

describe("/mcp auth dispatch", () => {
  it("anonymous requests on the public hostname get 401 + WWW-Authenticate", async () => {
    const res = await postInitialize(`${PUBLIC}/mcp`);
    expect(res.status).toBe(401);
    expect(res.headers.get("www-authenticate")).toBeTruthy();
  });

  it("a wrong admin token is NOT a bypass — falls through to the provider's 401", async () => {
    const res = await postInitialize(`${PUBLIC}/mcp`, {
      Authorization: "Bearer not-the-admin-token"
    });
    expect(res.status).toBe(401);
  });

  it("the admin token reaches the real MCP server: initialize returns info + instructions", async () => {
    const res = await postInitialize(`${PUBLIC}/mcp`, {
      Authorization: "Bearer smoke-test-admin-token"
    });
    expect(res.status).toBe(200);
    const init = await lastEventJson(res);
    expect(init.result?.serverInfo?.name).toBe("stellar-raven-codemode");
    // The workflow + envelope contract rides in via instructions.
    expect(init.result?.instructions).toContain("r.data.projects");
  });

  it("dev bypass honors DEV_ALLOW_UNAUTHENTICATED on localhost…", async () => {
    const res = await postInitialize(`${LOCAL}/mcp`);
    expect(res.status).toBe(200);
    const init = await lastEventJson(res);
    expect(init.result?.serverInfo?.name).toBe("stellar-raven-codemode");
  });

  it("…but the same var is inert on the public hostname (second factor)", async () => {
    // Same env, same path, only the hostname differs — must NOT bypass.
    const res = await postInitialize(`${PUBLIC}/mcp`);
    expect(res.status).toBe(401);
  });
});

describe("/demo routes", () => {
  it("GET /demo serves the locked playground page with the demo header set", async () => {
    const res = await SELF.fetch(`${PUBLIC}/demo`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
    expect(res.headers.get("content-security-policy")).toContain("connect-src 'self'");
    // No demo cookie on the public hostname → locked state.
    expect(await res.text()).toContain("/demo/login");
  });

  it("GET /demo/ (trailing slash) is the same page; HEAD works too", async () => {
    const slash = await SELF.fetch(`${PUBLIC}/demo/`);
    expect(slash.status).toBe(200);
    const head = await SELF.fetch(`${PUBLIC}/demo`, { method: "HEAD" });
    expect(head.status).toBe(200);
    expect(head.headers.get("content-type")).toContain("text/html");
  });

  it("GET /demo on localhost takes the dev bypass → authenticated chat UI", async () => {
    const res = await SELF.fetch(`${LOCAL}/demo`);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("composer-form");
  });

  it("wrong methods on matched demo paths → 405 with Allow", async () => {
    const page = await SELF.fetch(`${PUBLIC}/demo`, { method: "DELETE" });
    expect(page.status).toBe(405);
    expect(page.headers.get("allow")).toBe("GET, HEAD");
    const login = await SELF.fetch(`${PUBLIC}/demo/login`, { method: "POST" });
    expect(login.status).toBe(405);
    const chat = await SELF.fetch(`${PUBLIC}/demo/chat`);
    expect(chat.status).toBe(405);
    expect(chat.headers.get("allow")).toBe("POST");
  });

  it("non-exact /demo* paths fall through to the provider 404 (/demolition)", async () => {
    expect((await SELF.fetch(`${PUBLIC}/demolition`)).status).toBe(404);
    expect((await SELF.fetch(`${PUBLIC}/demo/other`)).status).toBe(404);
  });

  it("GET /demo/login parks state and 302s to WorkOS with the binding cookie", async () => {
    const res = await SELF.fetch(`${PUBLIC}/demo/login`, { redirect: "manual" });
    expect(res.status).toBe(302);
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.origin).toBe("https://api.workos.com");
    expect(location.searchParams.get("state")).toBeTruthy();
    expect(res.headers.get("set-cookie")).toContain("__Host-MCP_STATE=");
  });

  it("POST /demo/chat: cross-origin → 403 before anything else", async () => {
    // Wrong Origin, and absent Origin, both fail the same-origin requirement.
    const wrong = await SELF.fetch(`${PUBLIC}/demo/chat`, {
      method: "POST",
      headers: { origin: "https://evil.example", "content-type": "application/json" },
      body: "{}"
    });
    expect(wrong.status).toBe(403);
    const absent = await SELF.fetch(`${PUBLIC}/demo/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}"
    });
    expect(absent.status).toBe(403);
    const crossSite = await SELF.fetch(`${PUBLIC}/demo/chat`, {
      method: "POST",
      headers: {
        origin: PUBLIC,
        "sec-fetch-site": "cross-site",
        "content-type": "application/json"
      },
      body: "{}"
    });
    expect(crossSite.status).toBe(403);
  });

  it("POST /demo/chat: same-origin but no session cookie → 401", async () => {
    const res = await SELF.fetch(`${PUBLIC}/demo/chat`, {
      method: "POST",
      headers: { origin: PUBLIC, "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] })
    });
    expect(res.status).toBe(401);
  });

  it("POST /demo/chat: dev bypass on localhost reaches body validation (400 pre-model)", async () => {
    // Malformed body fails AFTER auth but BEFORE the throttle (no slot
    // burned) and BEFORE any AI binding call — proves the gauntlet order
    // without spending a model turn.
    const res = await SELF.fetch(`${LOCAL}/demo/chat`, {
      method: "POST",
      headers: { origin: LOCAL, "content-type": "application/json" },
      body: JSON.stringify({ messages: [] })
    });
    expect(res.status).toBe(400);
  });
});

describe("discovery alias rewrite", () => {
  it("OIDC discovery path serves the RFC 8414 metadata", async () => {
    const res = await SELF.fetch(`${PUBLIC}/.well-known/openid-configuration`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { issuer?: string; authorization_endpoint?: string };
    expect(body.issuer).toBeTruthy();
    expect(body.authorization_endpoint).toContain("/authorize");
  });

  it("path-suffixed RFC 8414 form aliases onto the exact-path endpoint", async () => {
    const res = await SELF.fetch(`${PUBLIC}/.well-known/oauth-authorization-server/mcp`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { issuer?: string };
    expect(body.issuer).toBeTruthy();
  });
});
