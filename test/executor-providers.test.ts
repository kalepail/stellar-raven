/**
 * Sandbox-surface tests — the providers `execute` wires into the Dynamic
 * Worker, exercised directly (pure Node; the isolate itself is covered by
 * the live integration script test/live/run-live-execute.mjs).
 */
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, type Catalog } from "../src/catalog/search.ts";
import { buildSandbox } from "../src/executor/providers.ts";
import type { FetchLike } from "../src/adapters/types.ts";
import type { SkillBundle } from "../src/skills/store.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog: Catalog = loadManifest(
  JSON.parse(readFileSync(join(ROOT, "catalog", "manifest.json"), "utf8"))
);
const bundle: SkillBundle = JSON.parse(
  readFileSync(join(ROOT, "src", "skills", "bundle.json"), "utf8")
);

const env = {
  LUMENLOOP_API_KEY: "test-key-not-real-1234",
  ALGOLIA_APPLICATION_ID: "TESTAPPID",
  ALGOLIA_API_KEY: "test-algolia-key-1234"
};

type Sandbox = ReturnType<typeof buildSandbox>;
function fnsOf(providers: Sandbox, name: string) {
  const p = providers.find((x) => x.name === name);
  if (!p) throw new Error(`missing provider ${name}`);
  return p.fns;
}

describe("sandbox surface shape", () => {
  const providers = buildSandbox(catalog, bundle, env);

  it("exposes exactly the three service namespaces plus codemode", () => {
    expect(providers.map((p) => p.name).sort()).toEqual([
      "codemode",
      "lumenloop",
      "scout",
      "stellarDocs"
    ]);
  });

  it("exposes one fn per operation entry, named by the id's terminal segment", () => {
    const ops = catalog.entries.filter((e) => e.kind === "operation");
    let counted = 0;
    for (const e of ops) {
      const name = e.id.split(".").pop()!;
      expect(fnsOf(providers, e.service)[name], `missing ${e.id}`).toBeTypeOf("function");
      counted += 1;
    }
    expect(counted).toBe(ops.length); // 21 + 24 + 12
    // skills are NOT callable operations
    expect(providers.find((p) => p.name === "skills")).toBeUndefined();
  });

  it("codemode has spec, search, catalog, describe, skill_read + the skill prelude", () => {
    const codemode = providers.find((p) => p.name === "codemode")!;
    expect(Object.keys(codemode.fns).sort()).toEqual([
      "catalog",
      "describe",
      "search",
      "skill_read",
      "spec"
    ]);
    expect(codemode.prelude).toContain("codemode.skill =");
  });
});

describe("dispatch behavior (error-as-data, policy, parallelism)", () => {
  it("denied ops are refused from the surface with kind 'denied' (no fetch happens)", async () => {
    let fetched = 0;
    const fetchImpl: FetchLike = async () => {
      fetched += 1;
      return new Response("{}", { status: 200 });
    };
    const providers = buildSandbox(catalog, bundle, env, { fetchImpl });
    const r = (await fnsOf(providers, "scout").submitPartnerListing!({
      orgName: "Acme",
      contactEmail: "a@b.co"
    })) as { ok: boolean; error: { kind: string } };
    expect(r.ok).toBe(false);
    expect(r.error.kind).toBe("denied");
    expect(fetched).toBe(0);
  });

  it("invalid args are refused before any network call", async () => {
    let fetched = 0;
    const fetchImpl: FetchLike = async () => {
      fetched += 1;
      return new Response("{}", { status: 200 });
    };
    const providers = buildSandbox(catalog, bundle, env, { fetchImpl });
    const r = (await fnsOf(providers, "lumenloop").search_directory!({ limit: 2 })) as {
      ok: boolean;
      error: { kind: string; message: string };
    };
    expect(r.ok).toBe(false);
    expect(r.error.message).toContain("no call was made");
    expect(fetched).toBe(0);
  });

  it("runs independent calls concurrently (Promise.all fan-out is safe)", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const fetchImpl: FetchLike = async (url) => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((r) => setTimeout(r, 20));
      inFlight -= 1;
      const body = url.includes("algolia")
        ? JSON.stringify({ hits: [{ url: "https://developers.stellar.org/docs/x", hierarchy: {} }], nbHits: 1, page: 0, nbPages: 1, hitsPerPage: 5 })
        : JSON.stringify({ success: true, data: { count: 0, projects: [] }, error: null, meta: { format: "json" } });
      return new Response(body, { status: 200, headers: { "content-type": "application/json" } });
    };
    const providers = buildSandbox(catalog, bundle, env, { fetchImpl });
    const [a, b, c] = (await Promise.all([
      fnsOf(providers, "lumenloop").search_directory!({ query: "x" }),
      fnsOf(providers, "scout").getStatus!({}),
      fnsOf(providers, "stellarDocs").search_docs!({ query: "fees" })
    ])) as { ok: boolean }[];
    expect(a!.ok && b!.ok && c!.ok).toBe(true);
    expect(maxInFlight).toBeGreaterThanOrEqual(2); // truly overlapping, no shared-state serialization
  });

  it("redacts accidental secret echoes in adapter results", async () => {
    const fetchImpl: FetchLike = async () =>
      new Response(
        JSON.stringify({
          success: true,
          data: { note: "echo test-key-not-real-1234 end" },
          error: null,
          meta: { format: "json" }
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    const providers = buildSandbox(catalog, bundle, env, { fetchImpl });
    const r = await fnsOf(providers, "lumenloop").get_categories!({});
    expect(JSON.stringify(r)).not.toContain("test-key-not-real-1234");
    expect(JSON.stringify(r)).toContain("[REDACTED]");
  });
});

// Mimic codemode's generated evaluate() scope: one mutable namespace object
// per provider (own-property get/set — same observable behavior as the
// generated Proxy, whose get trap checks own properties first and whose
// default set trap lands on the target), then run the concatenated
// preludes over them exactly as the executor module does. Shared by the
// envelope-guard and skill.read-guard suites so the scope reconstruction
// cannot drift from itself.
function guardedNamespaces(fetchImpl?: FetchLike) {
  const providers = buildSandbox(catalog, bundle, env, fetchImpl ? { fetchImpl } : undefined);
  const ns: Record<string, Record<string, unknown>> = {};
  for (const p of providers) ns[p.name] = { ...p.fns };
  const preludes = providers.map((p) => p.prelude ?? "").join("\n");
  new Function(...Object.keys(ns), preludes)(...Object.values(ns));
  return ns as Record<string, Record<string, (args?: unknown) => Promise<unknown>>>;
}

describe("envelope guard prelude (fail-loud wrong-level access)", () => {

  const directoryFetch: FetchLike = async () =>
    new Response(
      JSON.stringify({
        success: true,
        data: { count: 1, projects: [{ slug: "soroswap" }] },
        error: null,
        meta: { format: "json" }
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );

  it("ok envelope: payload-key access on the envelope throws a pointer to .data, correct access untouched", async () => {
    const ns = guardedNamespaces(directoryFetch);
    const r = (await ns.lumenloop!.search_directory!({ query: "soroswap" })) as {
      ok: boolean;
      data: { count: number; projects: { slug: string }[] };
    };
    expect(r.ok).toBe(true);
    expect(r.data.projects[0]!.slug).toBe("soroswap"); // correct path untouched
    expect(() => (r as Record<string, unknown>).projects).toThrow(/use r\.data\.projects/);
    expect(() => (r as Record<string, unknown>).count).toThrow(/use r\.data\.count/);
  });

  it("payload meta is trapped too: r.meta on a scout-shaped envelope points at r.data.meta", async () => {
    // scout payloads carry their own meta{} — it lives at r.data.meta now
    // that the envelope has no meta of its own.
    const scoutFetch: FetchLike = async () =>
      new Response(JSON.stringify({ projects: [], meta: { total: 0 } }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    const ns = guardedNamespaces(scoutFetch);
    const r = (await ns.scout!.searchProjects!({ q: "soroswap" })) as Record<string, unknown>;
    expect(() => r.meta).toThrow(/use r\.data\.meta/);
  });

  it("error envelope: r.data is undefined (no throw) with ONE deduped [envelope] warning; .error stays readable", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const envelopeLines = () =>
      logSpy.mock.calls.map((c) => String(c[0])).filter((l) => l.startsWith("[envelope]"));
    try {
      const ns = guardedNamespaces();
      const r = (await ns.scout!.submitPartnerListing!({
        orgName: "Acme",
        contactEmail: "a@b.co"
      })) as { ok: boolean; data?: unknown; error: { kind: string } };
      expect(r.ok).toBe(false);
      expect(r.error.kind).toBe("denied"); // legit failure introspection untouched
      expect(r.data).toBeUndefined(); // no throw
      expect(envelopeLines()).toHaveLength(1);
      expect(envelopeLines()[0]).toContain("scout.submitPartnerListing");
      expect(envelopeLines()[0]).toContain('error.kind="denied"');
      expect(envelopeLines()[0]).toContain("Branch on r.ok and read r.error.");
      // second read of the same op+kind: deduped, no new line
      expect(r.data).toBeUndefined();
      expect(envelopeLines()).toHaveLength(1);
      // a different op/kind warns once more
      const r2 = (await ns.lumenloop!.search_directory!({ limit: 2 })) as {
        ok: boolean;
        data?: unknown;
      };
      expect(r2.ok).toBe(false); // invalid args → guard refusal
      expect(r2.data).toBeUndefined();
      expect(envelopeLines()).toHaveLength(2);
      expect(envelopeLines()[1]).toContain("lumenloop.search_directory");
    } finally {
      logSpy.mockRestore();
    }
  });

  it("traps are non-enumerable: keys/JSON/structured clone (Workers RPC serialization) stay clean", async () => {
    const ns = guardedNamespaces(directoryFetch);
    const r = (await ns.lumenloop!.search_directory!({ query: "soroswap" })) as object;
    expect(Object.keys(r).sort()).toEqual(["data", "ok"]);
    expect(JSON.stringify(r)).toContain('"count":1'); // stringify never hits a trap
    // A script returning the raw envelope must still serialize across RPC.
    expect(() => structuredClone(r)).not.toThrow();
    expect((structuredClone(r) as { data: { count: number } }).data.count).toBe(1);
  });

  it("codemode discovery fns are not guarded — their own shapes (hits at top level) stay accessible", async () => {
    const ns = guardedNamespaces();
    const r = (await ns.codemode!.search!("stellar docs search")) as {
      ok: boolean;
      hits: unknown[];
    };
    expect(r.ok).toBe(true);
    expect(r.hits.length).toBeGreaterThan(0); // no trap on top-level hits
  });

  describe("write-through (decorating the envelope is allowed)", () => {
    it("writing a trapped key self-replaces: reads back, enumerable, survives JSON/structuredClone; payload untouched", async () => {
      const ns = guardedNamespaces(directoryFetch);
      const r = (await ns.lumenloop!.search_directory!({ query: "soroswap" })) as Record<
        string,
        unknown
      > & { data: { count: number } };
      expect(() => r.count).toThrow(/use r\.data\.count/); // read-before-write still throws
      r.count = 99; // does not throw
      expect(r.count).toBe(99); // reads back
      expect(Object.keys(r).sort()).toEqual(["count", "data", "ok"]); // enumerable now
      expect(JSON.parse(JSON.stringify(r)).count).toBe(99);
      expect((structuredClone(r) as unknown as { count: number }).count).toBe(99);
      expect(r.data.count).toBe(1); // the payload is NOT written through to
      expect(() => r.projects).toThrow(/use r\.data\.projects/); // other traps intact
    });

    it("Object.assign onto the envelope works via the setters", async () => {
      const ns = guardedNamespaces(directoryFetch);
      const r = (await ns.lumenloop!.search_directory!({ query: "soroswap" })) as Record<
        string,
        unknown
      >;
      Object.assign(r, { count: 5, projects: ["x"] });
      expect(r.count).toBe(5);
      expect(r.projects).toEqual(["x"]);
    });

    it("delete on a trapped key succeeds, then reads plain undefined (no throw)", async () => {
      const ns = guardedNamespaces(directoryFetch);
      const r = (await ns.lumenloop!.search_directory!({ query: "soroswap" })) as Record<
        string,
        unknown
      >;
      expect(delete r.projects).toBe(true);
      expect(r.projects).toBeUndefined();
    });

    it("a frozen envelope throws loudly on write (no silent no-op)", async () => {
      const ns = guardedNamespaces(directoryFetch);
      const r = (await ns.lumenloop!.search_directory!({ query: "soroswap" })) as Record<
        string,
        unknown
      >;
      Object.freeze(r);
      expect(() => {
        r.count = 1;
      }).toThrow(TypeError);
    });

    it("ok:false envelope: r.data = null writes through with one warning; later reads are warn-free; r.error untouched", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const envelopeLines = () =>
        logSpy.mock.calls.map((c) => String(c[0])).filter((l) => l.startsWith("[envelope]"));
      try {
        const ns = guardedNamespaces();
        const r = (await ns.scout!.submitPartnerListing!({
          orgName: "Acme",
          contactEmail: "a@b.co"
        })) as Record<string, unknown> & { error: { kind: string } };
        r.data = null; // succeeds
        expect(envelopeLines()).toHaveLength(1); // the unchecked write warned once
        expect(envelopeLines()[0]).toContain("scout.submitPartnerListing");
        expect(r.data).toBeNull(); // subsequent reads return the written value…
        expect(r.data).toBeNull();
        expect(envelopeLines()).toHaveLength(1); // …warn-free
        expect(r.error.kind).toBe("denied"); // error untouched
      } finally {
        logSpy.mockRestore();
      }
    });

    it("untrapped-key writes are plain data properties (no setter involved)", async () => {
      const ns = guardedNamespaces(directoryFetch);
      const r = (await ns.lumenloop!.search_directory!({ query: "soroswap" })) as Record<
        string,
        unknown
      >;
      r.note = "x";
      expect(r.note).toBe("x");
      const desc = Object.getOwnPropertyDescriptor(r, "note");
      expect(desc?.writable).toBe(true);
      expect(desc?.enumerable).toBe(true);
    });
  });
});

describe("skill.read result-shape guard (.data points at top-level content)", () => {
  // Shared generated-scope reconstruction (module-level guardedNamespaces),
  // narrowed to the codemode namespace this suite drives.
  function guardedCodemode() {
    return guardedNamespaces().codemode as unknown as {
      skill: { read: (name: string, opts?: unknown) => Promise<Record<string, unknown>> };
    };
  }
  const SKILL_ID = "skills.lumenloop.stellar-project-dossier";

  it("ok whole-read: .data throws a pointer to content/sections; content/id/availableSections read fine", async () => {
    const codemode = guardedCodemode();
    const r = (await codemode.skill.read(SKILL_ID)) as {
      ok: boolean;
      content: string;
      availableSections: string[];
    };
    expect(r.ok).toBe(true);
    expect(r.content).toContain("#"); // top-level content untouched
    expect(Array.isArray(r.availableSections)).toBe(true);
    expect(() => (r as Record<string, unknown>).data).toThrow(/skill content sits at the top level/);
    expect(() => (r as Record<string, unknown>).data).toThrow(/use r\.content .* or r\.sections/);
  });

  it("ok section-read: .sections reads fine, .data still throws the corrective pointer", async () => {
    const codemode = guardedCodemode();
    const whole = (await codemode.skill.read(SKILL_ID)) as { availableSections: string[] };
    const key = whole.availableSections[0]!;
    const r = (await codemode.skill.read(SKILL_ID, { sections: [key] })) as {
      ok: boolean;
      sections: unknown[];
    };
    expect(r.ok).toBe(true);
    expect(Array.isArray(r.sections)).toBe(true);
    expect(() => (r as Record<string, unknown>).data).toThrow(/\.data/);
  });

  it("the .data trap is non-enumerable: keys/JSON stay clean (no phantom key)", async () => {
    const codemode = guardedCodemode();
    const r = (await codemode.skill.read(SKILL_ID)) as object;
    expect(Object.keys(r)).not.toContain("data");
    expect(JSON.stringify(r)).not.toContain('"data"');
  });

  it("write-through: assigning .data self-replaces and reads back (decorating the result is legal)", async () => {
    const codemode = guardedCodemode();
    const r = (await codemode.skill.read(SKILL_ID)) as Record<string, unknown>;
    expect(() => r.data).toThrow(/\.data/); // read-before-write still throws
    r.data = 123; // does not throw
    expect(r.data).toBe(123);
    expect(Object.keys(r)).toContain("data"); // enumerable now
  });

  it("failed read routes through the envelope guard: r.data undefined + one [envelope] warning naming the call", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      const codemode = guardedCodemode();
      const r = (await codemode.skill.read("skills.definitely.not-a-skill")) as {
        ok: boolean;
        data?: unknown;
        error: { kind: string };
      };
      expect(r.ok).toBe(false);
      expect(r.error.kind).toBe("error");
      expect(r.data).toBeUndefined(); // no bespoke .data trap on failed reads
      const lines = logSpy.mock.calls
        .map((c) => String(c[0]))
        .filter((l) => l.startsWith("[envelope]"));
      expect(lines).toHaveLength(1);
      expect(lines[0]).toContain("codemode.skill.read");
      expect(lines[0]).toContain("Branch on r.ok and read r.error.");
    } finally {
      logSpy.mockRestore();
    }
  });
});

describe("codemode fns", () => {
  const providers = buildSandbox(catalog, bundle, env);
  const codemode = fnsOf(providers, "codemode");

  it("search accepts a bare string or options and never returns denied entries", async () => {
    const r = (await codemode.search!("stellar docs search")) as {
      ok: boolean;
      hits: { id: string }[];
    };
    expect(r.ok).toBe(true);
    expect(r.hits.length).toBeGreaterThan(0);
    const r2 = (await codemode.search!({ query: "partner listing", service: "scout", limit: 20 })) as {
      hits: { id: string }[];
    };
    expect(r2.hits.some((h) => h.id === "scout.submitPartnerListing")).toBe(false);
  });

  it("catalog() returns the full manifest view — denied entries visible with reasons, host transport stripped", async () => {
    const view = (await codemode.catalog!()) as {
      entries: { id: string; policy: { allow: boolean; denyReason: string | null }; transport?: unknown }[];
    };
    expect(view.entries.length).toBe(catalog.entries.length); // 374 incl. denied
    const denied = view.entries.filter((e) => !e.policy.allow);
    expect(denied.length).toBeGreaterThanOrEqual(4);
    expect(denied.every((e) => typeof e.policy.denyReason === "string")).toBe(true);
    expect(view.entries.every((e) => !("transport" in e) && !("provenance" in e))).toBe(true);
  });

  it("describe is exact-match only", async () => {
    const hit = (await codemode.describe!("lumenloop.search_directory")) as {
      ok: boolean;
      signature?: string;
    };
    expect(hit.ok).toBe(true);
    expect(hit.signature).toContain("lumenloop.search_directory(");
    const miss = (await codemode.describe!("lumenloop.searchDirectory")) as {
      ok: boolean;
      error: { message: string };
    };
    expect(miss.ok).toBe(false);
    expect(miss.error.message).toContain("exact-match");
  });

  it("spec() returns the super spec with $refs resolved inline (upstream REQUEST_TYPES mirror)", async () => {
    const superSpec = {
      openapi: "3.1.0",
      paths: {
        "/scout/getThing": {
          get: { operationId: "scout.getThing", parameters: [{ $ref: "#/components/parameters/q" }] }
        }
      },
      components: { parameters: { q: { name: "q", in: "query" } } }
    };
    const withSpec = buildSandbox(catalog, bundle, env, { superSpec });
    const spec = (await fnsOf(withSpec, "codemode").spec!()) as typeof superSpec;
    expect(spec.paths["/scout/getThing"]!.get.parameters[0]).toEqual({ name: "q", in: "query" });
    // Lazily resolved once, then cached — same object back on the second call.
    expect(await fnsOf(withSpec, "codemode").spec!()).toBe(spec);
  });

  it("spec() without a wired super spec answers with the standard failure envelope", async () => {
    const r = (await codemode.spec!()) as {
      ok: boolean;
      error: { service: string; kind: string; message: string };
    };
    expect(r.ok).toBe(false);
    expect(r.error.kind).toBe("error");
    expect(r.error.service).toBe("codemode");
    expect(r.error.message).toMatch(/super spec is not wired/i);
  });

  it("skill_read serves bundled content", async () => {
    const r = (await codemode.skill_read!("skills.lumenloop.stellar-project-dossier", {})) as {
      ok: boolean;
      content?: string;
    };
    expect(r.ok).toBe(true);
    expect(r.content).toContain("#");
  });

  it("skill_read fires the onSkillRead hook on successful reads only (advice-only signal)", async () => {
    let fired = 0;
    const providers = buildSandbox(catalog, bundle, env, {
      onSkillRead: () => {
        fired += 1;
      }
    });
    const fns = fnsOf(providers, "codemode");
    await fns.skill_read!("skills.definitely.not-a-skill", {});
    expect(fired).toBe(0); // failed read: no signal
    await fns.search!("skill content");
    expect(fired).toBe(0); // discovery is not a skill read
    await fns.skill_read!("skills.lumenloop.stellar-project-dossier", {});
    expect(fired).toBe(1);
  });
});
