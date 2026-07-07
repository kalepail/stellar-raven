/**
 * Runner module contract (research/skill-run-design.md §2) — the shape every
 * `codemode.skill.run` runner exports and the only module a runner may import.
 *
 * Runners are first-party, repo-committed TypeScript executed HOST-side at the
 * adapter trust tier (design §2/§7 — no isolate; the sandbox contains
 * model-authored code, and runners are not that). Their entire capability
 * surface is the `OpsFacade` parameter: one wrapped closure per emitted
 * catalog operation, narrowed by `runSkill` (src/skills/run.ts) to the
 * runner's declared `ops` before the runner ever sees it. No secrets
 * parameter exists and none may be added — adapters hold the keys host-side.
 *
 * Import discipline (design §12 lint, enforced by test): a runner module's
 * import specifiers are ⊆ {"./types.ts"} — no helper modules, each runner is
 * self-contained. This file must stay types-only and node-clean so the
 * catalog builder and the eval composition analyzer can load runner modules
 * under plain `node` type stripping (no cloudflare:workers anywhere in the
 * dependency cone).
 */
import type { AdapterResult } from "../../adapters/types.ts";

/**
 * Re-exported so runner modules can type their envelopes while honoring the
 * §12 import lint (specifiers ⊆ {"./types.ts"}).
 */
export type { AdapterResult };

/**
 * The facade `runSkill` hands a runner: service namespace → operation fn,
 * mirroring the sandbox surface (`ops.lumenloop.get_project(args)`), each fn
 * the SAME guard → adapter → redact closure the sandbox namespaces use, plus
 * the host-owned call-ledger recording wrapper. Every call resolves — never
 * throws — to the service-call envelope.
 */
export type OpsFacade = Record<
  string,
  Record<string, (args?: unknown) => Promise<AdapterResult>>
>;

export type SkillRunner = {
  /**
   * Exact catalog operation ids this runner may call — allowlist-as-data for
   * the sub-facade, the build-time drift guard (design §5), the plan grader,
   * and the live-drift classifier. A call to an undeclared op has no facade
   * fn and fails loudly (a runner bug, surfaced as an error envelope).
   */
  ops: string[];
  /**
   * JSON Schema for `skill.run` input, authored inside the bounded
   * src/policy/validate.ts dialect (design §4 note: no oneOf, no $ref).
   * `default` values are documentation only — validateArgs ignores
   * annotation keywords and nothing injects them; each runner materializes
   * its own defaults in the first lines of `run()`.
   */
  inputSchema: Record<string, unknown>;
  /**
   * JSON Schema for the `data` payload — the contract, the §12 test oracle,
   * and the signature source. It declares `calls`, but runners never author
   * that key: runSkill attaches it from the host-owned ledger, overwriting
   * anything runner-set (design §6 — runner code never owns the audit trail).
   */
  outputSchema: Record<string, unknown>;
  /**
   * The mechanized data-gathering core. Expected conditions — ambiguity,
   * soft-empty anchors, constituent errors — come back as DATA (either the
   * output payload with degraded sections or an { ok: false, error } service
   * envelope); a thrown exception is a runner bug and is caught by runSkill.
   */
  run(input: Record<string, unknown>, ops: OpsFacade): Promise<unknown>;
};
