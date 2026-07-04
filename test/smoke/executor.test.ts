/**
 * Offline smoke of src/executor/run.ts at the REAL worker boundary (Solo
 * todo 833) — the pieces plain-Node tests cannot touch: `cloudflare:workers`
 * tracing, `@cloudflare/codemode`'s DynamicWorkerExecutor, and a genuine
 * Dynamic Worker isolate via the LOADER binding.
 *
 * Offline is ENFORCED, not assumed: the lane's miniflare `outboundService`
 * (test/smoke/vitest.config.ts) turns any un-stubbed host-side fetch into a
 * 503. Sandbox-side there is no network at all (globalOutbound: null —
 * asserted below). The single vi.stubGlobal'd fetch exists to produce a real
 * { ok: true } envelope so the guard's payload-read trap can be exercised at
 * the true boundary. The live counterpart (test/live/run-live-execute.mjs)
 * still owns real-traffic coverage.
 */
import { env } from "cloudflare:test";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createExecuteRunner, createSpecSearchRunner } from "../../src/executor/run";

// The cast bridges OAUTH_PROVIDER: workos.ts augments the global Env with
// it (injected at runtime by workers-oauth-provider), but the runners never
// touch it and the test env legitimately lacks it.
const run = createExecuteRunner(env as unknown as Env);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("execute runner (real Dynamic Worker isolate)", () => {
  it("runs model code in a fresh isolate and returns its result", async () => {
    const outcome = await run("async (codemode) => 1 + 1");
    expect(outcome.ok).toBe(true);
    if (outcome.ok) expect(outcome.result).toBe("2");
  });

  it("sandbox has NO network: fetch() rejects (globalOutbound: null)", async () => {
    const outcome = await run(`async () => {
      try {
        await fetch("https://example.com");
        return { fetched: true };
      } catch (e) {
        return { fetched: false, message: String(e && e.message) };
      }
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as { fetched: boolean; message: string };
      expect(parsed.fetched).toBe(false);
      expect(parsed.message.length).toBeGreaterThan(0);
    }
  });

  it("refuses a deny-listed op in-sandbox with a { kind: 'denied' } envelope", async () => {
    const outcome = await run(`async () => {
      const r = await scout.submitPartnerListing({});
      return { ok: r.ok, kind: r.ok ? null : r.error.kind };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(JSON.parse(outcome.result)).toEqual({ ok: false, kind: "denied" });
    }
  });

  it("guards a FAILED envelope: r.data warns undefined, writes go through", async () => {
    // The denied op produces the { ok: false } envelope entirely offline.
    const outcome = await run(`async () => {
      const r = await scout.submitPartnerListing({});
      const dataIsUndefined = r.data === undefined; // logs the [envelope] warning
      r.note = "write-through ok"; // decorating the envelope stays legal
      return { dataIsUndefined, note: r.note };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(JSON.parse(outcome.result)).toEqual({ dataIsUndefined: true, note: "write-through ok" });
      expect(outcome.logs.join("\n")).toContain("[envelope] scout.submitPartnerListing");
    }
  });

  it("guards a SUCCESSFUL envelope: payload reads on the envelope throw a r.data.* pointer", async () => {
    // One stubbed upstream response → a real { ok: true, data } envelope
    // through the actual lumenloop adapter + guard prelude, no live traffic.
    // Host-side adapters run in this isolate, so the global stub reaches them.
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
      expect(url.href).toBe("https://api.lumenloop.com/v1/tools/search_directory");
      return Response.json({
        success: true,
        data: { count: 1, projects: [{ slug: "smoke-project" }] },
        meta: { tool: "search_directory", format: "json" }
      });
    });
    const outcome = await run(`async () => {
      const dir = await lumenloop.search_directory({ query: "smoke" });
      let payloadReadError = "";
      try {
        dir.projects; // wrong level — must throw a pointer at dir.data.projects
      } catch (e) {
        payloadReadError = String(e && e.message);
      }
      return { ok: dir.ok, viaData: dir.data.count, payloadReadError };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        ok: boolean;
        viaData: number;
        payloadReadError: string;
      };
      expect(parsed.ok).toBe(true);
      expect(parsed.viaData).toBe(1);
      expect(parsed.payloadReadError).toContain("r.data.projects");
    }
  });

  it("guards a skill.read result: reading .data throws a pointer to top-level content", async () => {
    const outcome = await run(`async () => {
      const skill = await codemode.skill.read("skills.lumenloop.stellar-project-dossier");
      let dataReadError = "";
      try {
        skill.data; // wrong shape — skill content is top-level, not under .data
      } catch (e) {
        dataReadError = String(e && e.message);
      }
      return { ok: skill.ok, hasContent: typeof skill.content === "string", dataReadError };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        ok: boolean;
        hasContent: boolean;
        dataReadError: string;
      };
      expect(parsed.ok).toBe(true);
      expect(parsed.hasContent).toBe(true);
      expect(parsed.dataReadError).toContain("top level");
    }
  });

  it("appends the sandbox globals hint to an 'is not defined' error", async () => {
    const outcome = await run(`async () => { return nope.doThing(); }`);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toMatch(/is not defined/);
      expect(outcome.error).toContain("the only globals available in the sandbox are:");
      expect(outcome.error).toContain("lumenloop");
      expect(outcome.error).toContain("codemode");
    }
  });

  it("leaves a non-ReferenceError message unchanged (no globals hint)", async () => {
    const outcome = await run(`async () => { throw new Error("plain-boom"); }`);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toContain("plain-boom");
      expect(outcome.error).not.toContain("the only globals available");
    }
  });

  it("in-sandbox discovery works offline: codemode.search + catalog() + skill.read", async () => {
    const outcome = await run(`async () => {
      const found = await codemode.search("search directory");
      const catalog = await codemode.catalog();
      const skill = await codemode.skill.read("skills.lumenloop.stellar-project-dossier");
      return {
        topHit: found.ok ? found.hits[0]?.id ?? null : null,
        catalogHasDenied: catalog.entries.some((e) => e.policy.allow === false),
        skillOk: skill.ok === true && skill.availableSections.length > 0
      };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        topHit: string | null;
        catalogHasDenied: boolean;
        skillOk: boolean;
      };
      expect(parsed.topHit).toBe("lumenloop.search_directory");
      expect(parsed.catalogHasDenied).toBe(true);
      expect(parsed.skillOk).toBe(true);
    }
  });

  it("captures console output as shaped logs", async () => {
    const outcome = await run(`async () => {
      console.log("smoke line one");
      console.error("smoke line two");
      return "done";
    }`);
    expect(outcome.ok).toBe(true);
    const joined = outcome.logs.join("\n");
    expect(joined).toContain("smoke line one");
    expect(joined).toContain("smoke line two");
  });

  it("surfaces sandbox throws as { ok: false } with the error text", async () => {
    const outcome = await run(`async () => { throw new Error("smoke-kaboom"); }`);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.error).toContain("smoke-kaboom");
  });
});

describe("spec-search runner (kept for A/Bs, ADR-0001)", () => {
  it("evaluates codemode.spec() queries in a no-provider sandbox", async () => {
    const runSearch = createSpecSearchRunner(env as unknown as Env); // same OAUTH_PROVIDER bridge as above
    const outcome = await runSearch(`async () => {
      const spec = await codemode.spec();
      return { services: Object.keys(spec).length };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as { services: number };
      expect(parsed.services).toBeGreaterThan(0);
    }
  });
});
