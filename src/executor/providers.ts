/**
 * Sandbox surface — the namespaced globals LLM code sees inside `execute`
 * (PLAN §1). Pure module: no cloudflare:workers import, fully unit-testable;
 * src/executor/run.ts feeds these providers to codemode's
 * DynamicWorkerExecutor, whose ResolvedProvider type they match structurally.
 *
 * Surface shape (decision, todo 798): one global per service exposing one
 * async fn PER OPERATION, named exactly by the catalog id's terminal segment —
 * `lumenloop.search_directory(args)`, `scout.getStatus()`,
 * `stellarDocs.search_docs(args)`. Chosen over a generic `call("id", args)`
 * because (a) it is exactly the callable line `search` already renders in
 * every operation hit's signature, so the model copies verbatim instead of
 * translating, and (b) codemode's per-namespace Proxy dispatch makes wrong
 * names fail loudly ("Tool not found") rather than fuzzy-resolving —
 * exact-match ids end to end.
 *
 * Every fn: guard (arg-validation) → adapter → redaction, and
 * ALWAYS returns a value ({ok:...} envelope) — never throws to the sandbox.
 * Calls hold no shared mutable state, so Promise.all fan-out is safe: each
 * dispatch is an independent host RPC. A sandbox-side prelude
 * (envelopeGuardPrelude below) guards the envelope: fail-loud on wrong-level
 * payload reads (`r.projects` throws "use r.data.projects"), warn-once +
 * undefined on failed-envelope data access, and writes are write-through.
 *
 * The `codemode` global adds mid-script discovery + skills:
 *   codemode.spec()                   — the unified super spec
 *     (specs/super-spec.json) with $refs resolved inline — the SAME document
 *     the code-shaped `search` tool queries, so execute mirrors upstream
 *     openApiMcpServer's REQUEST_TYPES (spec + calls in one sandbox). Upstream
 *     injects the spec into the execute sandbox source; ours crosses the
 *     provider RPC instead (a source-injected `const codemode` would shadow
 *     this provider global) — same resolved document either way.
 *   codemode.search(queryOrOpts)      — host-side searchCatalog (ranked)
 *   codemode.catalog()                — the FULL catalog as plain data for
 *     arbitrary code-grep discovery (spec-as-data pattern; strict superset of
 *     the fixed scorer). Everything in it is callable/readable — exposure is
 *     filtered at build time (ADR-0003). Host-only transport/provenance
 *     detail is stripped.
 *   codemode.describe(id)             — one entry's docs + signature, exact id
 *   codemode.skill.read(name, {sections?}) — bundled skill content
 * (`skill.read` needs a sandbox-side prelude: nested objects can't cross the
 * Proxy dispatch, so the prelude assigns `codemode.skill` wrapping the flat
 * `skill_read` dispatch fn — codemode's documented prelude mechanism.)
 */
import type { Catalog, CatalogEntry } from "../catalog/types.ts";
import { searchCatalog, renderSignature } from "../catalog/search.ts";
import { lastIdSegment, VALID_IDENT } from "../catalog/id.ts";
import { callService } from "../adapters/index.ts";
import type { AdapterEnv, FetchLike } from "../adapters/types.ts";
import { guard } from "../policy/guard.ts";
import { redactSecrets, secretsFromEnv } from "../policy/redact.ts";
import { readSkill, type SkillBundle } from "../skills/store.ts";
import { resolveSpecRefs } from "./spec-sandbox.ts";
import { logEvent } from "../observability.ts";

/** Structurally identical to @cloudflare/codemode's ResolvedProvider. */
export type SandboxProvider = {
  name: string;
  fns: Record<string, (...args: unknown[]) => Promise<unknown>>;
  prelude?: string;
};

/**
 * Skill namespace + result-shape guard. `codemode.skill.read` returns skill
 * content at the TOP LEVEL ({ ok, id, content | sections, availableSections,
 * notice? }) — NOT under `.data` like the service-call envelope. Reading
 * `.data` on an ok read is the one observed failure mode (agents copy the
 * `r.data.X` service pattern and get a bare TypeError with no corrective
 * path), so we plant a non-enumerable `.data` trap inside the sandbox exactly
 * like envelopeGuardPrelude: GET throws the corrective pointer to
 * content/sections; SET self-replaces (write-through — decorating the result
 * stays legal). A FAILED read ({ ok:false, error }) routes through the shared
 * `__guardEnvelope` so `.data` there warns-once-and-undefined identically to
 * every other failed envelope — one consistent story for `.data` misuse.
 * (__guardEnvelope is declared by the service prelude and shared via the
 * concatenated sandbox scope; buildProviders only attaches that prelude when
 * at least one operation entry exists, so a skills-only/empty-operation
 * catalog would leave it undeclared — the typeof fallback keeps skill.read
 * self-contained there, degrading to the pre-guard behavior instead of a
 * ReferenceError. The inlined trap descriptor below must stay in lock-step
 * with __trap in envelopeGuardPrelude: same non-enumerable get-throws /
 * set-write-through contract, or skill results and service envelopes
 * decorate inconsistently.)
 */
const SKILL_PRELUDE = [
  "    codemode.skill = {",
  "      read: async (name, opts) => {",
  "        const raw = await codemode.skill_read(name, opts);",
  '        const r = typeof __guardEnvelope === "function" ? __guardEnvelope(raw, "codemode.skill.read") : raw;',
  '        if (r && typeof r === "object" && r.ok === true) {',
  "          const msg = 'codemode.skill.read result: \".data\" is the service-call envelope shape — skill content sits at the top level: use r.content (whole read) or r.sections (section read); other fields: id, availableSections, notice';",
  '          try { Object.defineProperty(r, "data", {',
  "            enumerable: false, configurable: true,",
  "            get() { throw new Error(msg); },",
  '            set(value) { Object.defineProperty(this, "data", { value, writable: true, enumerable: true, configurable: true }); }',
  "          }); } catch {}",
  "        }",
  "        return r;",
  "      }",
  "    };"
].join("\n");

/**
 * Sandbox-side envelope guard: fail-loud on wrong-level payload reads,
 * warn-once + undefined on failed-envelope data access, writes are
 * write-through. The single observed LLM failure mode with the result
 * envelope is reading payload fields one level too shallow (`r.projects`
 * instead of `r.data.projects`), which yields `undefined` and — after a
 * defensive `|| []` — masquerades as a legitimate empty result.
 *
 * The guard wraps every service fn in a prelude (codemode's documented
 * mechanism: preludes run after the per-namespace Proxy inits in the same
 * scope, and property assignment lands on the Proxy target, which the get
 * trap checks first — same trick as SKILL_PRELUDE). Each wrapped result gets
 * NON-ENUMERABLE accessor pairs planted on the envelope:
 *   - ok:true  → one pair per top-level key of `data`: GET throws
 *     "use r.data.projects" instead of returning undefined; SET self-replaces
 *     with a plain data property (write-through — decorating the envelope
 *     before returning it is a legitimate pattern, not a wrong-level read).
 *   - ok:false → a pair on `data`: GET returns undefined and console.logs
 *     ONE deduped `[envelope]` warning naming the actual service error
 *     (kind/message/hint); SET warns once too, then writes through — a model
 *     assigning r.data on a failed envelope without checking r.ok should see
 *     the real error. `r.error` on ok:true stays a plain undefined, so the
 *     `if (r.error)` guard pattern keeps working.
 *
 * Non-enumerable accessors — deliberately NOT a Proxy around the envelope
 * (Proxies DataCloneError under Workers RPC v8 serialization) — keep every
 * legitimate pattern untouched: Object.keys / spread / JSON / structured
 * clone all read enumerable-only (so a script returning the raw envelope
 * still serializes across the Workers RPC boundary), and `await` never trips
 * over a `then` trap. Only direct wrong-level property access trips a trap.
 * The write-through SET is NOT try/caught: on a frozen envelope it must
 * throw loudly at the write, not silently no-op and then throw on read.
 * Applies to service namespaces only — codemode.* discovery fns return
 * their own shapes (hits/total at the top level) by design.
 */
function envelopeGuardPrelude(opsByService: Map<string, string[]>): string {
  const wiring = [...opsByService.entries()].map(
    ([svc, ops]) =>
      `    for (const __op of ${JSON.stringify(ops)}) {\n` +
      `      const __orig = ${svc}[__op];\n` +
      `      ${svc}[__op] = async (...__a) => __guardEnvelope(await __orig(...__a), "${svc}." + __op);\n` +
      `    }`
  );
  return [
    "    const __warned = new Set();",
    "    const __guardEnvelope = (r, call) => {",
    '      if (r === null || typeof r !== "object" || typeof r.ok !== "boolean") return r;',
    "      const __trap = (key, desc) => {",
    "        try { Object.defineProperty(r, key, { ...desc, enumerable: false, configurable: true }); } catch {}",
    "      };",
    '      if (r.ok && r.data && typeof r.data === "object" && !Array.isArray(r.data)) {',
    "        for (const key of Object.keys(r.data)) {",
    '          if (key === "ok" || key === "data" || key === "error" || key === "then" || key === "toJSON") continue;',
    '          const msg = call + \' result: ".\' + key + \'" is on the data payload, not the envelope — use r.data.\' + key + " (every call resolves to { ok: true, data } | { ok: false, error })";',
    "          __trap(key, {",
    "            get() { throw new Error(msg); },",
    "            set(value) { Object.defineProperty(this, key, { value, writable: true, enumerable: true, configurable: true }); }",
    "          });",
    "        }",
    "      } else if (!r.ok) {",
    "        const e = r.error || {};",
    "        const __warnOnce = () => {",
    "          const k = call + '|' + e.kind;",
    "          if (__warned.has(k)) return;",
    "          __warned.add(k);",
    "          console.log('[envelope] ' + call + ' returned { ok: false } — r.data is undefined. error.kind=\"' + e.kind + '\": ' + e.message + (e.hint ? ' (hint: ' + e.hint + ')' : '') + (e.kind === 'soft-empty' ? ' — soft-empty is routine, not evidence of absence.' : '') + ' Branch on r.ok and read r.error.');",
    "        };",
    '        __trap("data", {',
    "          get() { __warnOnce(); return undefined; },",
    '          set(value) { __warnOnce(); Object.defineProperty(this, "data", { value, writable: true, enumerable: true, configurable: true }); }',
    "        });",
    "      }",
    "      return r;",
    "    };",
    ...wiring
  ].join("\n");
}

export function buildProviders(
  catalog: Catalog,
  env: AdapterEnv,
  deps?: { fetchImpl?: FetchLike }
): SandboxProvider[] {
  const secrets = secretsFromEnv(env as Record<string, unknown>);
  const fetchImpl = deps?.fetchImpl;

  // --- service namespaces: one fn per operation entry ---------------------
  const byService = new Map<string, Record<string, (...args: unknown[]) => Promise<unknown>>>();
  for (const entry of catalog.entries) {
    if (entry.kind !== "operation") continue;
    const name = lastIdSegment(entry.id);
    // loadManifest (catalog/search.ts) already THROWS on an invalid ident, so a
    // real manifest can't reach here with a bad one; this stays as a belt for
    // hand-built test catalogs that skip loadManifest.
    if (!VALID_IDENT.test(entry.service) || !VALID_IDENT.test(name)) continue;
    let fns = byService.get(entry.service);
    if (!fns) {
      fns = {};
      byService.set(entry.service, fns);
    }
    fns[name] = async (args?: unknown) => {
      const t0 = Date.now();
      const refused = guard(entry, args); // arg validation only (ADR-0003)
      if (refused) {
        // guard only ever returns the error variant; narrow for the compiler.
        logEvent("op", {
          id: entry.id,
          outcome: refused.ok ? "ok" : refused.error.kind,
          ms: Date.now() - t0
        });
        return refused;
      }
      const result = await callService(
        entry,
        (args ?? {}) as Record<string, unknown>,
        env,
        fetchImpl
      );
      logEvent("op", {
        id: entry.id,
        outcome: result.ok ? "ok" : result.error.kind,
        ms: Date.now() - t0
      });
      return redactSecrets(result, secrets);
    };
  }

  const providers: SandboxProvider[] = [...byService.entries()].map(([name, fns]) => ({
    name,
    fns
  }));

  // One combined guard prelude (helper + wiring for every service namespace)
  // carried by the first provider: codemode concatenates all preludes after
  // ALL proxy inits, so any prelude may reference every namespace const, but
  // the helper must be declared exactly once in that shared scope.
  if (providers.length > 0) {
    const opsByService = new Map(
      providers.map((p) => [p.name, Object.keys(p.fns)] as const)
    );
    providers[0]!.prelude = envelopeGuardPrelude(opsByService);
  }

  return providers;
}

/** codemode.search input: a bare query string or search options. */
type SearchArg = string | { query?: unknown; kind?: unknown; service?: unknown; limit?: unknown };

/**
 * Sandbox-facing projection of one catalog entry for `codemode.catalog()`:
 * everything the model may reason over, nothing host-only (transport carries
 * base URLs / Algolia mappings / env-var names; provenance is refresh
 * bookkeeping). Every entry is callable/readable — exposure is filtered at
 * build time (ADR-0003), so there is no policy to show.
 */
function catalogEntryView(entry: CatalogEntry) {
  return {
    id: entry.id,
    service: entry.service,
    kind: entry.kind,
    description: entry.description,
    inputSchema: entry.inputSchema,
    outputSchema: entry.outputSchema
  };
}

// Module-level caches so buildCodemodeProvider can be called PER EXECUTE RUN
// (run.ts rebuilds it to get a per-run skill-read flag — see onSkillRead)
// without redoing the expensive derivations: keyed on the source objects,
// which are module-singleton JSON imports in the Worker.
const catalogViewCache = new WeakMap<Catalog, unknown>();
const resolvedSpecCache = new WeakMap<object, unknown>();

export function buildCodemodeProvider(
  catalog: Catalog,
  bundle: SkillBundle,
  superSpec?: unknown,
  hooks?: {
    /**
     * Fired when skill_read successfully returns skill content. ADVICE-ONLY
     * signal: run.ts uses it to append section-read advice to the truncation
     * footer — it must never affect which result bytes are kept.
     */
    onSkillRead?: () => void;
  }
): SandboxProvider {
  // Derived once per catalog object, shared across runs (read-only data).
  let catalogView = catalogViewCache.get(catalog);
  if (!catalogView) {
    catalogView = {
      version: catalog.version,
      generatedAt: catalog.generatedAt,
      entries: catalog.entries.map(catalogEntryView)
    };
    catalogViewCache.set(catalog, catalogView);
  }
  return {
    name: "codemode",
    prelude: SKILL_PRELUDE,
    fns: {
      spec: async () => {
        if (superSpec === undefined) {
          return {
            ok: false,
            error: {
              service: "codemode",
              kind: "error",
              message:
                "the unified super spec is not wired on this server instance — use codemode.catalog() / codemode.search instead"
            }
          };
        }
        // $refs resolved lazily on first use, then cached per spec object
        // (mirrors the search sandbox's lazy `__resolvedSpec ??= …`).
        if (typeof superSpec !== "object" || superSpec === null) return resolveSpecRefs(superSpec);
        let resolved = resolvedSpecCache.get(superSpec);
        if (resolved === undefined) {
          resolved = resolveSpecRefs(superSpec);
          resolvedSpecCache.set(superSpec, resolved);
        }
        return resolved;
      },

      catalog: async () => catalogView,

      search: async (arg?: unknown) => {
        const t0 = Date.now();
        const opts = (typeof arg === "string" ? { query: arg } : (arg ?? {})) as Exclude<
          SearchArg,
          string
        >;
        if (typeof opts.query !== "string" || opts.query.length === 0) {
          return {
            ok: false,
            error: {
              service: "codemode",
              kind: "error",
              message: 'codemode.search needs a query: search("intent phrase") or search({ query, kind?, service?, limit? })'
            }
          };
        }
        const hits = searchCatalog(catalog, {
          query: opts.query,
          kind: opts.kind as never,
          service: typeof opts.service === "string" ? opts.service : undefined,
          limit: typeof opts.limit === "number" ? opts.limit : undefined
        });
        logEvent("search", {
          source: "codemode",
          query: opts.query,
          kind: typeof opts.kind === "string" ? opts.kind : null,
          service: typeof opts.service === "string" ? opts.service : null,
          hits: hits.length,
          top: hits.slice(0, 3).map((h) => h.id),
          responseChars: JSON.stringify(hits).length,
          ms: Date.now() - t0
        });
        return { ok: true, hits, total: hits.length };
      },

      describe: async (id?: unknown) => {
        if (typeof id !== "string" || id.length === 0) {
          return {
            ok: false,
            error: { service: "codemode", kind: "error", message: "codemode.describe needs an exact catalog id string" }
          };
        }
        const entry = catalog.entries.find((e) => e.id === id);
        if (!entry) {
          return {
            ok: false,
            error: {
              service: "codemode",
              kind: "error",
              message: `unknown id "${id}" — ids are exact-match; discover them with codemode.search first`
            }
          };
        }
        const signature = renderSignature(entry);
        return {
          ok: true,
          id: entry.id,
          service: entry.service,
          kind: entry.kind,
          description: entry.description,
          ...(signature ? { signature } : {})
        };
      },

      skill_read: async (name?: unknown, opts?: unknown) => {
        const r = readSkill(catalog, bundle, name, opts);
        if (r.ok) hooks?.onSkillRead?.();
        return r;
      }
    }
  };
}

/** The full provider set `execute` wires into the sandbox. */
export function buildSandbox(
  catalog: Catalog,
  bundle: SkillBundle,
  env: AdapterEnv,
  deps?: {
    fetchImpl?: FetchLike;
    superSpec?: unknown;
    onSkillRead?: () => void;
  }
): SandboxProvider[] {
  return [
    ...buildProviders(catalog, env, deps),
    buildCodemodeProvider(catalog, bundle, deps?.superSpec, {
      onSkillRead: deps?.onSkillRead
    })
  ];
}
