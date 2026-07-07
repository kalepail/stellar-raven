# ADR-0003: Build-time exposure filtering — the manifest IS the exposed surface

- Status: accepted (2026-07-04); supersedes the deny-list/see-but-not-call half of
  [ADR-0002](./0002-skills-retirement-twin-dedup.md)
- Decision rule (user): consumers get useful, forward-only tooling and services — never
  information about what the gateway *cannot* do. Cleanup and filtering belong upstream of
  clients, agents, and MCP: at build time. The knowledge of *why* something is excluded lives
  in build-script data + ADRs (prose for future build agents), not in runtime entries.
- Driver: Solo todo 836.

## Context

ADR-0002 (2026-07-03) retired the 7 Lumenloop API-onboarding skills and de-duplicated the 14
`lumenloop.skill.*` metadata twins as **deny-list-as-data**: the entries stayed in the manifest
with `policy.allow: false` + a denyReason, `search` filtered them before scoring, the executor
refused calls, and `codemode.catalog()` showed them "see-but-not-call" on the theory that policy
transparency lets sandbox code filter denied ops.

On 2026-07-04 a live agent, asked "what tools does this MCP expose?", enumerated
`codemode.catalog()` and reported the retired `lumenloop-api.*` skills (billing, keys, connect,
query, research) as live surface, alongside the denied write ops. The `policy.allow: false`
marker was in the data it read — **the distinction did not survive summarization**. See-but-not-call
fails at its most common consumer: an agent answering "what can you do?". Visible-but-unusable
entries are a confusion generator, not transparency.

The twin machinery had also metastasized: a deny-policy block and twin emission in
`build-catalog.mjs`, a back-compat read alias in `src/skills/store.ts`, a denied-entry filter in
`src/catalog/search.ts`, a deny/metered guard in `src/policy/guard.ts`, call-time refusal +
policy-visible catalog view in `src/executor/providers.ts`, x-policy copying + 19 denied paths in
`build-super-spec.mjs`, and twin-aware grading (rule v2, todo 816) across `eval/lib/grade.mjs`,
`eval/run-routing.mjs`, and `eval/self-test.mjs` — all managing entries with no reason to exist
in the model-facing world.

## Decision

**An entry is either exposed (emitted, callable/readable) or it does not exist to consumers.**

1. **`scripts/build-catalog.mjs` filters at build time.** The old policy functions became
   exclusion filters; excluded surfaces are never emitted:
   - `lumenloop.request_research` (metered paid call — PLAN §8 off-by-default; excluded by
     name AND by the metered flag so an upstream re-pricing cannot silently expose it) and any
     account-mutation op (`LUMENLOOP_ACCOUNT_OP_RE`);
   - the 3 scout write/side-effecting ops (`POST /api/feedback`, `/api/partners/submit-listing`,
     `/api/partners/assistant`);
   - the 7 retired onboarding skills (no skill entry, no sections; bodies stay in the mirror as
     the description-harvest source);
   - all 14 Lumenloop-API-served skill metadata entries (each duplicates a canonical `skills.*`
     mirror entry — the `lumenloop.skill.*` twin namespace is dead).
   Every exclusion list carries a fail-loud drift guard (`assertRetirementNamesResolve`,
   `assertLumenloopExclusionsResolve`, `assertScoutExclusionsResolve`,
   `assertLumenloopSkillsMirrored`) so an upstream rename/removal/addition breaks the build
   instead of silently changing the surface. The build log names everything it filtered.

2. **The `policy`, `cost`, and `auth` entry fields are gone.** With no denied entries possible,
   `policy` was a constant; `cost` (always "free" post-filtering) and `auth` had no consumer
   outside the dying deny machinery. The manifest schema is now: id, service, kind, description,
   keywords?, inputSchema, outputSchema, transport, provenance.

3. **The runtime deny layer is deleted.** `guard()` validates args, nothing else. `search`,
   `catalog()`, `spec()`, `describe`, and `skill.read` need no exposure filter — the manifest is
   pre-filtered by construction. The `store.ts` `lumenloop.skill.*` read alias (back-compat) is
   deleted: unknown ids fail exact-match with a nearest-id suggestion.

4. **The envelope error kind is two-way**: `"error" | "soft-empty"`. `"denied"` is gone from
   `AdapterErrorKind`, rendered signatures, and both MCP tool descriptions — nothing callable can
   be policy-refused at runtime. (Forward-only contract change; clients relying on "denied" break.)

5. **The super spec contains exactly the manifest's operations** (56 paths: 53 service ops + 3
   synthetic skills ops; previously 75 with 19 denied). x-policy/x-cost/x-auth are gone;
   `x-execute` is on every path. The lumenloop account/billing/discovery API surface is no longer
   described "for honesty" — the spec describes only what code can call. A completeness assert
   guards the reverse direction (every manifest operation appears in the spec).

6. **Eval grading moved to rule v3 (`v3-manifest-exposed`).** The v2 twin-identity layer is
   deleted; a hit's service label is exactly its own, and cross-service tolerance is expressed
   only via `expected_any`. This was NOT a grading no-op: v2 credited `skills.lumenloop.*`
   playbook hits to lumenloop-expected cases. Legacy strict re-baselined 222/288/318 →
   203/265/303 (n=338): of 37 changed cases, 35 had byte-identical top hits (pure
   grading-severity change; the playbook tolerance is the accept-either lane's job — 74.0% top1)
   and the 2 real ranking changes were both improvements (keyword document-frequency denominators
   shifted when excluded ops left the per-service op sets). Skills lane unchanged 18/23.

## Consequences

| Measure | ADR-0002 (2026-07-03) | ADR-0003 (2026-07-04) |
|---|---|---|
| Manifest entries | 299 (25 denied) | **274 (0 denied — field gone)** |
| Skill entries | 39 (21 denied) | **18 (all readable)** |
| Operations | 57 (4 denied) | **53 (all callable)** |
| Super-spec paths | 75 (19 denied) | **56 (all callable)** |
| `codemode.catalog()` | all entries, policy visible | exposed entries only |
| Runtime policy checks | deny + metered + args | **args only** |

- **2026-07-04 follow-up (same mechanism, applied further; the table above is the decision-time
  record):** the post-ship audit found dead-end read-halves and description leaks, all removed —
  `scout.getFeedbackSchema` (schema feeder for the excluded feedback write),
  `lumenloop.research_result` + `lumenloop.list_my_research` (read half of the non-exposed paid
  research lane). Excluded-endpoint clauses are scrubbed from exposed scout descriptions
  (`SCOUT_DESCRIPTION_SCRUBS`), retired-skill cross-references are scrubbed from emitted skill
  text AND the Worker bundle (which no longer ships retired-skill bytes at all), the exclusion
  data is consolidated in `scripts/exposure.mjs` shared by every emitter, and
  `assertNoNonExposedRefs` fails the build on any emitted reference to a non-exposed surface.
  Counts moved 274→**271** entries, 53→**50** service ops (lumenloop 18, scout 20,
  stellarDocs 12), 56→**53** super-spec paths.
- Enabling `lumenloop.request_research` later is a deliberate feature: remove the exclusion at
  build time (all three research ops — the trigger and its read half `research_result` /
  `list_my_research` — travel together) AND build the budget-gate + dedup runtime (PLAN §8) in
  the same change.
- ADR-0002's "Reads are unaffected" line was already stale before this change (reads were
  policy-gated in the shipped code); under ADR-0003 the question is moot — there is nothing
  denied to read.
- Correction discipline for future exclusions: add the surface to the relevant exclusion data in
  `scripts/exposure.mjs` with a comment naming the reason, extend the drift guard if the list is
  keyed on upstream names, rebuild (`build-catalog` → `build-super-spec` → `build-op-classes`),
  and record the decision in an ADR/Solo todo. Never reintroduce runtime allow/deny.

## Revisit triggers

- A genuine need for *runtime-conditional* exposure (e.g. per-auth-tier catalogs) — that would be
  a new, deliberate design, not a revival of the deny-list.
- Lumenloop re-prices or splits `request_research` — the named exclusion + metered flag both
  guard it; enabling it is the PLAN §8 budget-gate feature.
- The upstream skill source adds machine-readable audience/transport metadata (sk-005) — the
  retirement list could become a mechanical filter.
