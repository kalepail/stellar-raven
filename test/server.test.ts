/**
 * Unit tests for tool registration — no running worker needed.
 *
 * Wires the registered McpServer to an in-memory MCP client (both from
 * @modelcontextprotocol/sdk, already a dependency) and asserts the two
 * tools exist with the expected schemas and stub behavior.
 *
 * CHANGED for ADR-0001 (research/decisions/0001-search-tool-shape.md,
 * Solo todo 803): the shipped `search` is the host-side ranked query
 * ({query, kind?, service?, limit?}); the code-shaped {code} search is no
 * longer a top-level tool — that discovery path lives inside `execute`'s
 * sandbox (codemode.spec()/search/catalog, covered by spec-sandbox.test.ts
 * and executor-providers.test.ts).
 */
import { describe, expect, it, beforeAll } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { registerTools, SEARCH_KINDS, type RegisterToolsOptions } from "../src/mcp/tools";

type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema & { enum?: string[] }>;
  required?: string[];
};

let client: Client;

async function connectedClient(options: RegisterToolsOptions = {}): Promise<Client> {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerTools(server, options);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const c = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([server.connect(serverTransport), c.connect(clientTransport)]);
  return c;
}

beforeAll(async () => {
  client = await connectedClient();
});

describe("tool registration", () => {
  it("registers exactly the search and execute tools", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(["execute", "search"]);
  });

  it("search is the host-side ranked query: { query, kind?, service?, limit? }", async () => {
    const { tools } = await client.listTools();
    const search = tools.find((t) => t.name === "search");
    expect(search).toBeDefined();
    const schema = search!.inputSchema as JsonSchema;
    expect(schema.type).toBe("object");
    expect(Object.keys(schema.properties ?? {}).sort()).toEqual([
      "kind",
      "limit",
      "query",
      "service"
    ]);
    expect(schema.required).toEqual(["query"]);
    expect(schema.properties?.query?.type).toBe("string");
    expect(schema.properties?.kind?.enum).toEqual([...SEARCH_KINDS]);
    expect(schema.properties?.service?.type).toBe("string");
    expect(schema.properties?.limit?.type).toBe("integer");
    // The temporary A/B-candidate framing is gone (ADR-0001: this IS the tool).
    expect(search!.description).not.toMatch(/TEMPORARY|A\/B candidate/);
    // …and the description points at execute's in-sandbox discovery affordances.
    expect(search!.description).toContain("codemode.search");
    expect(search!.description).toContain("codemode.catalog()");
    expect(search!.description).toContain("codemode.spec()");
  });

  it("execute has the expected input schema", async () => {
    const { tools } = await client.listTools();
    const execute = tools.find((t) => t.name === "execute");
    expect(execute).toBeDefined();
    const schema = execute!.inputSchema as JsonSchema;
    expect(schema.type).toBe("object");
    expect(Object.keys(schema.properties ?? {})).toEqual(["code"]);
    expect(schema.required).toEqual(["code"]);
    expect(schema.properties?.code?.type).toBe("string");
    // execute mirrors upstream REQUEST_TYPES: spec + calls in one sandbox.
    expect(execute!.description).toContain("codemode.spec()");
  });
});

describe("search behavior (host-side ranked)", () => {
  it("returns real ranked hits + a nextSteps hint", async () => {
    const result = await client.callTool({
      name: "search",
      arguments: { query: "search directory" }
    });
    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as {
      hits: Array<{ id: string; score: number; signature?: string }>;
      nextSteps: string;
    };
    expect(structured.hits.length).toBeGreaterThan(0);
    expect(structured.hits[0]?.id).toBe("lumenloop.search_directory");
    expect(structured.hits[0]?.signature).toContain("SearchDirectoryInput");
    expect(structured.nextSteps).toMatch(/execute/i);
  });

  it("skill hits cross the tool boundary with availableSections (todo 812)", async () => {
    const result = await client.callTool({
      name: "search",
      arguments: { query: "skills.lumenloop.stellar-project-dossier", kind: "skill" }
    });
    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as {
      hits: Array<{ id: string; kind: string; availableSections?: string[] }>;
    };
    const hit = structured.hits.find((h) => h.id === "skills.lumenloop.stellar-project-dossier");
    expect(hit).toBeDefined();
    expect(hit!.kind).toBe("skill");
    expect(hit!.availableSections!.length).toBeGreaterThan(0);
    // The hint teaches sectioned reads, not whole-skill reads.
    const { nextSteps } = result.structuredContent as { nextSteps: string };
    expect(nextSteps).toContain("availableSections");
    expect(nextSteps).toContain("codemode.skill.read");
  });

  it("returns an empty-hits result with guidance for a no-match query", async () => {
    // Truly zero-overlap tokens: since the M1 tiered backfill, any single
    // matched token (even a prefix overlap like "nonexistent" ~ "no") fills
    // an otherwise-empty page instead of returning [].
    const result = await client.callTool({
      name: "search",
      arguments: { query: "zzzzqqqq zzqqzzqq" }
    });
    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as {
      hits: unknown[];
      nextSteps: string;
    };
    expect(structured.hits).toEqual([]);
    expect(structured.nextSteps).toMatch(/no hits/i);
  });

  it("rejects an invalid kind value", async () => {
    const result = await client.callTool({
      name: "search",
      arguments: { query: "test", kind: "nonsense" }
    });
    // SDK surfaces input validation failures as isError results.
    expect(result.isError).toBe(true);
  });
});

describe("execute behavior", () => {
  it("without an injected runner returns unavailable as data (isError), never a throw", async () => {
    const result = await client.callTool({
      name: "execute",
      arguments: { code: "async () => 1" }
    });
    expect(result.isError).toBe(true);
    const content = result.content as Array<{ type: string; text?: string }>;
    expect(content[0]?.type).toBe("text");
    expect(content[0]?.text).toMatch(/sandbox runner is not wired/i);
  });

  it("delegates to the injected runner and renders result + logs", async () => {
    const execClient = await connectedClient({
      runExecute: async (code) => ({
        ok: true,
        result: JSON.stringify({ echoed: code.length }),
        truncated: false,
        logs: ["hello from sandbox"]
      })
    });
    const result = await execClient.callTool({
      name: "execute",
      arguments: { code: "async () => 1" }
    });
    expect(result.isError).toBeFalsy();
    const text = (result.content as Array<{ text: string }>)[0]?.text ?? "";
    expect(text).toContain('{"echoed":13}');
    expect(text).toContain("--- console (1 lines) ---");
    expect(text).toContain("hello from sandbox");
  });

  it("budgets the logs block so console output cannot bypass the result cap", async () => {
    // shapeLogs' structural caps still admit ~200k chars of logs; the tool
    // boundary must clip the joined block to the same ~6k-token budget the
    // result gets, with the logs-specific footer.
    const execClient = await connectedClient({
      runExecute: async () => ({
        ok: true,
        result: '{"fine":true}',
        truncated: false,
        logs: Array.from({ length: 100 }, () => "x".repeat(2_000))
      })
    });
    const result = await execClient.callTool({
      name: "execute",
      arguments: { code: "async () => 1" }
    });
    expect(result.isError).toBeFalsy();
    const text = (result.content as Array<{ text: string }>)[0]?.text ?? "";
    expect(text).toContain('{"fine":true}');
    expect(text).toContain("--- console (100 lines) ---");
    expect(text.length).toBeLessThan(30_000); // result + clipped logs, not ~200k
    expect(text).toContain("log counts and previews");
  });

  it("budgets error text so a thrown payload cannot bypass the result cap", async () => {
    // Error text is model-authored (`throw new Error(bigPayload)`) — without
    // its own budget it would be the third smuggling channel after result
    // and logs.
    const execClient = await connectedClient({
      runExecute: async () => ({ ok: false, error: "x".repeat(100_000), logs: [] })
    });
    const result = await execClient.callTool({
      name: "execute",
      arguments: { code: "async () => { throw new Error('big') }" }
    });
    expect(result.isError).toBe(true);
    const text = (result.content as Array<{ text: string }>)[0]?.text ?? "";
    expect(text.length).toBeLessThan(30_000); // not ~100k
    expect(text).toContain("--- TRUNCATED ---");
  });

  it("renders runner errors as isError data with logs", async () => {
    const execClient = await connectedClient({
      runExecute: async () => ({ ok: false, error: "fetch is not allowed", logs: ["[error] boom"] })
    });
    const result = await execClient.callTool({
      name: "execute",
      arguments: { code: "async () => fetch('https://x')" }
    });
    expect(result.isError).toBe(true);
    const text = (result.content as Array<{ text: string }>)[0]?.text ?? "";
    expect(text).toContain("Execution failed: fetch is not allowed");
    expect(text).toContain("[error] boom");
  });
});
