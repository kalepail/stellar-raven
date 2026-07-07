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
import fxGetProject from "../fixtures/skill-runners/lumenloop.get_project.ts";
import fxScf from "../fixtures/skill-runners/lumenloop.get_scf_submissions.ts";
import fxContent from "../fixtures/skill-runners/lumenloop.find_content_about_project.ts";
import fxSimilar from "../fixtures/skill-runners/lumenloop.find_similar_projects_semantic.ts";
import fxSemantic from "../fixtures/skill-runners/lumenloop.search_content_semantic.ts";
import fxListDocs from "../fixtures/skill-runners/lumenloop.list_documents.ts";

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

  it("a build-excluded op has NO sandbox fn — calling it fails loudly (ADR-0003)", async () => {
    const outcome = await run(`async () => {
      try {
        await scout.submitPartnerListing({});
        return { threw: false };
      } catch (e) {
        return { threw: true, message: String(e && e.message) };
      }
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as { threw: boolean; message: string };
      expect(parsed.threw).toBe(true); // unknown name — nothing uncallable exists
    }
  });

  it("guards a FAILED envelope: r.data warns undefined, writes go through", async () => {
    // An arg-validation refusal produces the { ok: false } envelope entirely offline.
    const outcome = await run(`async () => {
      const r = await lumenloop.search_directory({ limit: 2 }); // missing required query
      const dataIsUndefined = r.data === undefined; // logs the [envelope] warning
      r.note = "write-through ok"; // decorating the envelope stays legal
      return { dataIsUndefined, note: r.note };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(JSON.parse(outcome.result)).toEqual({ dataIsUndefined: true, note: "write-through ok" });
      expect(outcome.logs.join("\n")).toContain("[envelope] lumenloop.search_directory");
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
        allCallable: catalog.entries.every((e) => !("policy" in e)), // ADR-0003: no policy layer
        skillOk: skill.ok === true && skill.availableSections.length > 0
      };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        topHit: string | null;
        allCallable: boolean;
        skillOk: boolean;
      };
      expect(parsed.topHit).toBe("lumenloop.search_directory");
      expect(parsed.allCallable).toBe(true);
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

describe("codemode.skill.run at the real worker boundary (design §12 smoke)", () => {
  /**
   * Route the host-side lumenloop adapter to the LIVE-CAPTURED runner
   * fixtures (test/fixtures/skill-runners/, production 2026-07-06) by tool
   * name — the run crosses the true chain: sandbox prelude → provider RPC →
   * runSkill → recording sub-facade → adapter fetch. This lane is offline by
   * design (miniflare outboundService), so the standing guard against LIVE
   * upstream payload drift is the wrangler-dev/live lane (rollout step 6,
   * §11 row 18 refresh discipline); this smoke pins the full dispatch path
   * and envelope semantics at the workerd boundary.
   */
  const stubLumenloop = (routes: Record<string, unknown>) => {
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
      expect(url.pathname.startsWith("/v1/tools/")).toBe(true);
      const tool = url.pathname.slice("/v1/tools/".length);
      const data = routes[tool];
      if (data === undefined) {
        return Response.json(
          { success: false, error: `smoke stub: unstubbed lumenloop tool "${tool}"` },
          { status: 500 }
        );
      }
      return Response.json({ success: true, data, meta: { tool, format: "json" } });
    });
  };

  it("dossier run: service envelope, all sections non-null, host `calls` ledger all ok, guard traps live", async () => {
    stubLumenloop({
      // the compact probe and the fan-out fetch both route here — the probe
      // only checks ok, so serving the full row twice is shape-safe
      get_project: fxGetProject.data,
      get_scf_submissions: fxScf.data,
      find_content_about_project: fxContent.data,
      find_similar_projects_semantic: fxSimilar.data
    });
    const outcome = await run(`async () => {
      const r = await codemode.skill.run("skills.lumenloop.stellar-project-dossier", { project: "blend" });
      let envelopeTrap = "";
      try {
        r.profile; // payload read on the envelope — must throw an r.data.* pointer
      } catch (e) {
        envelopeTrap = String(e && e.message);
      }
      return {
        ok: r.ok,
        slug: r.data.slug,
        resolvedBy: r.data.resolvedBy,
        sectionsNonNull: [r.data.profile, r.data.scf, r.data.content, r.data.similar].every((s) => s !== null),
        calls: r.data.calls.map((c) => ({ op: c.op, ok: c.ok })),
        envelopeTrap
      };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        ok: boolean;
        slug: string;
        resolvedBy: string;
        sectionsNonNull: boolean;
        calls: { op: string; ok: boolean }[];
        envelopeTrap: string;
      };
      expect(parsed.ok).toBe(true);
      expect(parsed.slug).toBe("blend");
      expect(parsed.resolvedBy).toBe("input-slug");
      expect(parsed.sectionsNonNull).toBe(true);
      // compact probe + 4-way fan-out, every constituent ok
      expect(parsed.calls).toHaveLength(5);
      for (const c of parsed.calls) {
        expect(c.op).toMatch(/^lumenloop\./);
        expect(c.ok).toBe(true);
      }
      expect(parsed.envelopeTrap).toContain("r.data.profile");
    }
  });

  it("digest run (theme mode): window framing, items + upcoming projected, both calls ledgered ok", async () => {
    stubLumenloop({
      search_content_semantic: fxSemantic.data,
      list_documents: fxListDocs.data
    });
    const outcome = await run(`async () => {
      const r = await codemode.skill.run("skills.lumenloop.stellar-ecosystem-digest", { subject: "RWA tokenization" });
      return {
        ok: r.ok,
        window: r.data.window,
        softEmpty: r.data.softEmpty,
        itemCount: r.data.items === null ? null : r.data.items.length,
        upcomingCount: r.data.upcomingEvents === null ? null : r.data.upcomingEvents.length,
        calls: r.data.calls.map((c) => ({ op: c.op, ok: c.ok }))
      };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as {
        ok: boolean;
        window: { dateStart: string; dateEnd: string };
        softEmpty: boolean;
        itemCount: number | null;
        upcomingCount: number | null;
        calls: { op: string; ok: boolean }[];
      };
      expect(parsed.ok).toBe(true);
      expect(parsed.window.dateStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(parsed.window.dateEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(parsed.softEmpty).toBe(false);
      expect(parsed.itemCount).toBeGreaterThan(0);
      expect(parsed.upcomingCount).toBeGreaterThan(0);
      expect(parsed.calls.map((c) => c.op).sort()).toEqual([
        "lumenloop.list_documents",
        "lumenloop.search_content_semantic"
      ]);
      expect(parsed.calls.every((c) => c.ok)).toBe(true);
    }
  });

  it("unknown runnable name fails AS DATA naming the runnable set + nearest suggestion (no fetch needed)", async () => {
    const outcome = await run(`async () => {
      const r = await codemode.skill.run("skills.lumenloop.stellar-project-dosier", { project: "blend" });
      const dataIsUndefined = r.data === undefined; // ok:false envelope — logs the [envelope] warning
      return { ok: r.ok, message: r.error.message, dataIsUndefined };
    }`);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      const parsed = JSON.parse(outcome.result) as { ok: boolean; message: string; dataIsUndefined: boolean };
      expect(parsed.ok).toBe(false);
      expect(parsed.message).toContain('unknown runnable skill "skills.lumenloop.stellar-project-dosier"');
      expect(parsed.message).toContain("skills.lumenloop.stellar-project-dossier");
      expect(parsed.message).toContain("skills.lumenloop.stellar-ecosystem-digest");
      expect(parsed.message).toContain('Did you mean "skills.lumenloop.stellar-project-dossier"?');
      expect(parsed.dataIsUndefined).toBe(true);
    }
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
