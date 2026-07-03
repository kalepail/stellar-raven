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
