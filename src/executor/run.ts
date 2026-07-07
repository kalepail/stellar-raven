/**
 * Execute runner — wires @cloudflare/codemode's DynamicWorkerExecutor
 * (research/codemode.md §2) to the sandbox surface from providers.ts.
 *
 * WORKER-ONLY MODULE: `@cloudflare/codemode`'s main entry imports
 * `cloudflare:workers`, so this file must only be imported from src/server.ts
 * (never from src/mcp/tools.ts, which unit tests load under plain Node).
 * The import works fine inside the Worker — verified against 0.4.2 — so we
 * use the shipped executor rather than a hand-rolled loader: it already does
 * module synthesis, console capture, per-namespace Proxy dispatch, JSON+
 * binary codec, eager isolate disposal, and `globalOutbound: null`.
 *
 * Sandbox contract per call:
 *  - fresh isolate via env.LOADER.load() (one-shot; billing note PLAN §1)
 *  - globalOutbound: null → fetch()/connect() throw (secrets stay host-side)
 *  - 60s wall-clock timeout inside the sandbox
 *  - result = the value returned by the model's async arrow function
 *  - console.* buffered and returned as logs
 *
 * Output hygiene (PLAN §4): per-call results are already redacted in the
 * providers; the FINAL result + logs are redacted again and truncated to
 * ~6k tokens with an actionable footer before crossing the tool boundary.
 * Known limitation: codemode's executor doesn't expose Worker `limits`
 * ({cpuMs, subRequests}) — we rely on its timeout + plan defaults.
 */
import { tracing } from "cloudflare:workers";
import { DynamicWorkerExecutor } from "@cloudflare/codemode";
import superSpecJson from "../../specs/super-spec.json";
import bundleJson from "../skills/bundle.json";
import { getCatalog } from "../catalog/load.ts";
import { buildSandbox, type SandboxProvider } from "./providers.ts";
import {
  createSpecSandboxCode,
  sandboxResponseText,
  serializeSpecForSandbox
} from "./spec-sandbox.ts";
import type { SkillBundle } from "../skills/store.ts";
import { redactSecrets, secretsFromEnv } from "../policy/redact.ts";
import { truncateForModel } from "../policy/truncate.ts";
import { shapeLogs } from "./shape-logs.ts";

export type ExecuteOutcome =
  | { ok: true; result: string; truncated: boolean; logs: string[] }
  | { ok: false; error: string; logs: string[] };

export type ExecuteRunner = (code: string) => Promise<ExecuteOutcome>;

export type SpecSearchOutcome =
  | { ok: true; result: string }
  | { ok: false; error: string };

export type SpecSearchRunner = (code: string) => Promise<SpecSearchOutcome>;

const EXECUTE_TIMEOUT_MS = 60_000;

/**
 * Mirror @cloudflare/codemode's withGlobalsHint (dist/index.js): a sandbox
 * `ReferenceError` usually means the model invented a global — append the real
 * sandbox globals so the retry is informed instead of another guess. The
 * global names are derived from the wired provider set (never hard-coded) so
 * they cannot drift from what the sandbox actually exposes. Applied before
 * redaction/truncation so those still run last. Deviates from upstream's
 * wording by one clause — "and standard JavaScript" — because
 * EXECUTE_DESCRIPTION's globals rule includes it; without the clause the two
 * surfaces contradict on whether builtins (console, Promise, Math…) exist.
 */
function withGlobalsHint(message: string, providers: SandboxProvider[]): string {
  if (!/\bis not defined\b/.test(message)) return message;
  return `${message} (the only globals available in the sandbox are: ${providers
    .map((p) => p.name)
    .join(", ")}, and standard JavaScript)`;
}

export function createExecuteRunner(env: Env): ExecuteRunner {
  const executor = new DynamicWorkerExecutor({
    loader: env.LOADER,
    globalOutbound: null, // default, pinned explicitly: sandbox has NO network
    timeout: EXECUTE_TIMEOUT_MS
  });
  const secrets = secretsFromEnv(env as unknown as Record<string, unknown>);

  return async (code: string): Promise<ExecuteOutcome> => {
    // Providers are rebuilt per run so the skill-read flag is run-scoped
    // (never leaks across concurrent executes); the expensive derivations
    // (catalog view, resolved spec) are cached module-level in providers.ts.
    // The flag is ADVICE-ONLY: it may change the truncation footer's wording,
    // never the token budget or which result bytes are kept.
    let skillRead = false;
    // Count of skill.run dispatches this run (attempted, whatever the
    // outcome) — stamped on the codemode.execute span below so runnable-skill
    // usage is visible in the trace waterfall; per-run outcomes live in the
    // skill_run log events the host dispatch emits (design §8).
    let skillRuns = 0;
    const providers = buildSandbox(getCatalog(), bundleJson as SkillBundle, env, {
      superSpec: superSpecJson,
      onSkillRead: () => {
        skillRead = true;
      },
      onSkillRun: () => {
        skillRuns += 1;
      }
    });
    // Custom span because the Worker Loader isolate is NOT auto-instrumented
    // (research/observability-cloudflare.md §2) — without it the sandbox run
    // is invisible in the trace waterfall between the handler span and the
    // adapter fetch spans. No-op when tracing is off/unsampled; ends on throw.
    const outcome = await tracing.enterSpan("codemode.execute", async (span) => {
      span.setAttribute("code.chars", code.length);
      const result = await executor.execute(code, providers);
      span.setAttribute("sandbox.ok", result.error === undefined);
      span.setAttribute("sandbox.logLines", result.logs?.length ?? 0);
      span.setAttribute("sandbox.skillRead", skillRead);
      span.setAttribute("sandbox.skillRun", skillRuns);
      return result;
    });
    const logs = shapeLogs(outcome.logs, secrets);
    if (outcome.error !== undefined) {
      const hinted = withGlobalsHint(outcome.error, providers);
      return { ok: false, error: redactSecrets(hinted, secrets), logs };
    }
    const { text, truncated } = truncateForModel(redactSecrets(outcome.result, secrets), undefined, {
      skillSectionAdvice: skillRead
    });
    return { ok: true, result: text, truncated, logs };
  };
}

// Serialized once per isolate — each search call injects ~180KB of spec JSON
// into its sandbox source (upstream re-stringifies per call; identical bytes).
let cachedSerializedSpec: string | undefined;
function getSerializedSpec(): string {
  cachedSerializedSpec ??= serializeSpecForSandbox(superSpecJson);
  return cachedSerializedSpec;
}

/**
 * The code-shaped spec-search runner — NOT registered as a top-level tool
 * since ADR-0001 (research/decisions/0001-search-tool-shape.md): the shipped
 * `search` is the host-side ranked query, and discovery-in-code lives inside
 * `execute` (codemode.spec()/search/catalog). Kept so a code-shaped tool can
 * be re-exposed for future A/Bs (eval/qa/run-qa.mjs --search-tool).
 *
 * Mirrors openApiMcpServer's search tool:
 * LLM code wrapped by createSpecSandboxCode (codemode.spec() over the super
 * spec, in-sandbox truncation), executed in a fresh Dynamic Worker with NO
 * providers (search is read-only over spec data; no service calls, no
 * secrets), result passed through sandboxResponseText host-side. Logs are
 * deliberately dropped — upstream's search ignores them too.
 */
export function createSpecSearchRunner(env: Env): SpecSearchRunner {
  const executor = new DynamicWorkerExecutor({
    loader: env.LOADER,
    globalOutbound: null, // no network in the search sandbox either
    timeout: EXECUTE_TIMEOUT_MS
  });

  return async (code: string): Promise<SpecSearchOutcome> => {
    const outcome = await tracing.enterSpan("codemode.spec_search", async (span) => {
      span.setAttribute("code.chars", code.length);
      const result = await executor.execute(createSpecSandboxCode(code, getSerializedSpec()), []);
      span.setAttribute("sandbox.ok", result.error === undefined);
      return result;
    });
    if (outcome.error !== undefined) {
      return { ok: false, error: outcome.error };
    }
    return { ok: true, result: sandboxResponseText(outcome.result) };
  };
}
