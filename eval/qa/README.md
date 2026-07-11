# Golden Q→A answer-accuracy eval — the headline instrument

Measures what the routing evals (`eval/run-routing.mjs`, `eval/agentic/`) can't: does an agent
driving this MCP server end-to-end (**search → execute → answer**) produce a **factually
correct, current, non-fabricated answer** to a real Stellar-ecosystem question?

The battery is **owned**: one hand-authored JSON file per case under `eval/qa/corpus/battery/`,
484 cases, edited directly and reviewed like code. Provenance is first-class (`truth` block per
case), gospel changes are CI-linted at the moment of change, and the compiled artifacts are
generated + byte-pinned. History — the vendored-corpus/override era, rubric evolution, and the
run archaeology through 2026-07-10 — lives in
[`research/audits/2026-07-qa-history.md`](../../research/audits/2026-07-qa-history.md); the
migration proof is [`reviewed/2026-07-super-corpus-migration.md`](./reviewed/2026-07-super-corpus-migration.md).

## Directory / lane map

```
eval/qa/
  corpus/
    battery/<category>/<id>.json    # THE corpus — one hand-owned JSON per case, 10 category dirs
    live/live-cases.json            # frozen contract live-data-canonical-v2 (10 cases)
    live/live-digest-supplement-cases.json  # frozen contract live-digest-supplement-v2 (2 cases)
    migration-ledger.json           # permanent losslessness ledger (dispositions per source id)
  cases.json  sample.json           # GENERATED battery + stratified sample-30 (CI byte-pinned)
  consistency-register.json         # cross-question contradiction register + numericInvariants
  compile-qa.mjs  judge.mjs  evidence-pack.mjs  run-qa.mjs  lint-corpus.mjs  register-helper.mjs  lib.mjs
  results/                          # local-only run evidence (gitignored)
  reviewed/                         # dated committed review records
```

Categories (= directory names = `tags.category`): `protocol-core`, `soroban`, `tooling-infra`,
`assets-anchors-seps`, `defi-ecosystem`, `scf-grants-builders`, `compliance-rwa-payments`,
`history-org-tokenomics`, `retail-consumer`, `edge-behavior`.

Lanes never merge: the main battery, the canonical live-10, and the opt-in digest-supplement-2
are separate scopes with separate denominators (`eval/EVALS.md`). The live contracts are frozen
whole-file contracts — `eval/self-test.mjs` asserts contract name, ordered membership, and
`caseContentDigest`; changing live case content requires a version bump and digest update.

## Case schema (`corpus/battery/<category>/<id>.json`)

```jsonc
{
  "id": "q-sor-build-target-wasm32v1",   // == filename; q-* kebab; stable forever
  "question": "…",
  "surface": ["stellarDocs.search_sdk_cli_tools_docs"],  // advisory op/skill ids; NEVER judge/
                                          // agent-visible; non-empty unless service == "none"
  "golden": {                             // EXACTLY what the judge sees. Nothing else.
    "answer": "…",
    "keyFacts": ["…"],                    // 1–5 atomic must-appear facts (pinned migration
                                          // exceptions at 6–7 listed in compile-qa.mjs)
    "avoid": ["…"],                       // concrete wrong-content traps (phrasing linted)
    "notes": "…"                          // optional; rendered under the GRADER NOTES heading
  },
  "tags": {                               // machine branching / stratification only
    "category": "soroban",                // must equal the parent directory
    "service": "stellarDocs",             // stellarDocs | scout | lumenloop | skills | none
    "freshness": "scheduled",             // stable | scheduled | live
    "trap": "paid-bait"                   // optional; value IS judge-visible (interpolated)
  },
  "truth": {                              // judge-blind provenance, first-class
    "domain": "real-world",               // real-world | corpus-grounded | mixed
    "status": "confirmed",                // confirmed | disputed | unverifiable | mixed
    "asOf": "2026-07-11",                 // required when freshness != stable OR status != confirmed
    "reverifyBy": "2026-10-01",           // required when freshness == scheduled; CI stale gate
    "sources": [{ "class": "A", "ref": "https://…" }],  // classes A–F per golden-truth
    "corroboration": [                    // claim rows; required-when rules below; verdicts:
      { "claim": "…", "verdict": "confirmed",  // confirmed | confirmed-as-of | disputed |
                                               // unverifiable | corpus-only | contradicted
        "evidence": [{ "class": "A", "ref": "…", "observedAt": "…" }] }
    ],
    "verified": {                         // LATEST verification event only — git holds the rest
      "date": "2026-07-11", "by": "…", "evidence": ["solo://…"],
      "rootCause": ["improvements/…"]     // required when the event CHANGED gospel;
    },                                    // "freshness-drift" is an allowed explicit value
    "origin": "raven-next q-sor-build-target-wasm32v1"  // lineage; or "authored YYYY-MM"
  }
}
```

Who consumes what (condensed):

| Field | Consumers |
|---|---|
| `question`, `golden.*`, `tags.trap`, `tags.freshness` | **judge-facing** — the prompt renders exactly these (plus the evidence pack); any change is a gospel change under the CI lint |
| `golden.keyFacts` / `golden.avoid` | judge `missingFacts` / `wrongClaims` drivers; numeric-invariant + avoid-phrasing lint |
| `surface` | lint (ids must be manifest-exposed), coverage floors — never rendered to judge or agent |
| `tags.service` | deterministic sampler strata, per-service reporting |
| `tags.freshness` | judge leniency block and evidence-pack gate (both test `!== "stable"`); `scheduled` requires `truth.asOf` + `truth.reverifyBy`; `live` means behavioral golden |
| `truth.*` | judge-blind: gospel-change lint, corroboration lint, stale gate, ledger cross-checks, triage signals copied into result rows (`truth.status`/`asOf`) |

Corroboration **required-when** (lint-enforced): `truth.status ∈ {disputed, unverifiable}` ⇒
rows required; a case named by a register `numericInvariants` entry ⇒ a row covering that
invariant; numeric/version/date keyFacts on `real-world` cases ⇒ a covering row (error for
authored cases, warn for migration-carried debt). `contradicted` is legal only for claims
mirrored in `golden.avoid`. Negative-claim detection is heuristic (warn); the hard bar for
negative claims is the golden-truth skill and review gates.

The compile enforces: filename == id, directory == category, unique ids, closed enums, keyFacts
1–5 (pinned migration exceptions aside), non-empty class-labeled sources, `asOf`/`reverifyBy`
required-when rules, ledger and register cross-checks. Trap enum: `out-of-scope | injection |
paid-bait | fabrication-bait | scam-check | speculation | cant-do | ambiguous` (one legacy
`governance` case tolerated pending relabel).

Every gospel change (question, `golden.*`, judge-facing tags) goes through the
[`golden-truth` skill](../../.agents/skills/golden-truth/SKILL.md); rounds are orchestrated by
[`run-evals`](../../.agents/skills/run-evals/SKILL.md).

## Commands

```sh
# Compile the battery → cases.json + sample.json (deterministic, byte-identical re-runs; no flags)
npm run eval:qa:compile

# Judge self-test (no server): scored fixtures + the 15 pinned promptSha256 fixtures
npm run eval:qa:selftest

# Corpus lint (deterministic, offline)
npm run eval:qa:lint                       # surface/manifest, numeric invariants, avoid phrasing,
                                           #   corroboration required-when, ledger checks
npm run eval:qa:lint -- --stale            # + FAIL on any truth.reverifyBy past due
npm run eval:qa:lint -- --coverage         # + per-op/skill/category floor report (warn)
npm run eval:qa:lint -- --enforce-floors   # coverage floors as errors (P4-close gate)
npm run eval:qa:lint -- --since <ref>      # + gospel-change guard vs that ref (auto merge-base in CI)

# Consistency-register member hashes: stamp/auto-reopen clusters whose case files changed
npm run eval:qa:register                   # --seed to baseline, --check for CI-style dry run

# Run the battery (boot the server first; see below)
node eval/qa/run-qa.mjs --variant A --sample 30 --port 8788
node eval/qa/run-qa.mjs --cases eval/qa/corpus/live/live-cases.json --port 8788
node eval/qa/run-qa.mjs --cases eval/qa/corpus/live/live-digest-supplement-cases.json --port 8788
npm run eval:plan -- eval/qa/results/<stamp>-variantA.json    # plan regrade, offline
```

Server for live lanes: reuse the Solo `dev` process when it exists; otherwise
`npx wrangler dev --port 8788 --host localhost` — `--host localhost` is REQUIRED (custom-domain
routes otherwise rewrite request.url and every request 401s).

`run-qa.mjs` flags: `--ids a,b,c` (smoke), `--no-judge` (collect only), `--model` /
`--judge-model` (defaults `claude-sonnet-5`), `--cases <path>`, `--surface per-operation`
(+`--server-revision`) for the isolated 50-operation architecture instrument
(`compare-architecture-ab.mjs`). Variant A = the shipped `search` (ADR-0001); B requires a
build exposing a code-shaped tool plus `--search-tool`. Results land in
`eval/qa/results/<stamp>-variant<X>.json` (local-only): rows carry `truth.status`/`truth.asOf`
for triage, the verdict's `{rubric, packVersion, promptSha256}` stamps, and the evidence-pack
hash/size.

## CI contract

Every push/PR (`.github/workflows/ci.yml`):

- **Byte-pins**: the generated-artifacts step recompiles and byte-diffs `eval/qa/cases.json`
  AND `eval/qa/sample.json`. Never hand-edit them.
- **`eval:qa:lint -- --stale`**: all deterministic lint lanes; any past-due `truth.reverifyBy`
  fails. In CI the **gospel-change guard** is automatically diff-aware against the merge base:
  a change to `question`, `golden.*`, `tags.freshness`, or `tags.trap` fails unless
  `truth.verified` changed in the same diff with non-empty `evidence` + `rootCause` (score-only
  rationales rejected; `freshness-drift` allowed). Local/pre-push equivalent for Solo lanes:
  `npm run eval:qa:lint -- --since <ref>`.
- **`eval:qa:selftest`**: judge fixtures incl. the 15 pinned promptSha256 hashes.
- `eval:selftest` asserts the live v2 contracts (name, ordered membership, content digest).

The daily refresh workflow (`refresh.yml`) also runs `lint-corpus --stale`, so a `reverifyBy`
date passing fires within 24 h, not on the next unrelated PR. Remedies are auditable either
way: re-verify (update `verified` + `asOf` + a new `reverifyBy`) or an explicit dated extension
with rootCause. The stale queue is owned by the
[`truth-maintenance`](../../.agents/skills/truth-maintenance/SKILL.md) skill; authors set
`reverifyBy` quarter-granular and staggered so the queue drips instead of cliffing.

## Judging rubric and score comparability

`judge.mjs` grades factual agreement with the golden answer + keyFacts, one headless
`claude -p --model claude-sonnet-5` call per grade. Scores: **correct** (all or all-but-trivial
keyFacts present, no wrong claims), **partial** (core right; omissions alone cap here),
**wrong** (core incorrect, an `avoid` item present, fabrications, or — trap cases — playing
along), **error** (the judge itself failed; never a grade of the candidate).

Style, length, and citation format are ignored. Beyond-golden specifics are "unverified", not
wrong. Avoid items bind only on answer-visible content; support-relative avoid phrasing is
advisory (and linted). Cases with `tags.freshness != "stable"` get the freshness-leniency block
and a deterministic bounded **source-basis evidence pack** built from the saved execute results
(`evidence-pack.mjs`, pack `p3`); sourced drift from the golden snapshot is tolerated, confident
unsourced contradiction is not.

**Comparability rules:**

- Current tuple: **rubric `v2.4` / pack `p3`** (exported as `JUDGE_RUBRIC` / `PACK_VERSION`;
  short changelog in the `judge.mjs` header). Compare stored rows only when rubric, packVersion,
  and prompt/pack-hash semantics match — otherwise re-judge the saved `rows[].answer` under the
  target tuple first (cheap; feed back through `judgeCase` with the row's transcript).
- **A rubric bump is required** for any change to grading semantics: judge prompt text, score
  meanings, avoid/freshness/trap handling. A pack bump is required for evidence-pack
  serialization/selection changes. Cosmetic refactors that keep `buildJudgePrompt` output
  byte-identical (provable via the promptSha256 fixtures) need no bump.
- **Noise floor**: per-row any-flip rate **23.3%** across three identical v2.4/p3 re-judge
  passes (pairwise score disagreement 15.6%). Isolated single-run score movement at or below
  that scale is variance until confirmed by live transcript review or a repeated mechanism.
  Read `wrong` counts before `correct` counts; compare variants on the same sample.
- **Denominator note**: the owned 484-case battery is the baseline denominator as of the
  2026-07-11 re-anchor. The approximately 469-case pre-rebuild aggregate baselines are archival
  (see the history doc); per-id comparisons remain valid for continuing cases (same rubric).

## Current baseline of record

The 2026-07-11 post-rebuild baseline is recorded in
[`reviewed/2026-07-super-corpus-baseline.md`](./reviewed/2026-07-super-corpus-baseline.md).
It ran the designed deterministic headline sample-30 plus the separately denominated canonical
live-10 and digest-2 contracts with `claude-sonnet-5` answering and judging under v2.4/p3.
Results stamps: `2026-07-11T15-36-44-variantA.json`,
`2026-07-11T15-50-19-variantA.json`, and `2026-07-11T15-52-51-variantA.json`.
Raw results were 8C/18P/4W, 8C/2P/0W, and 2C/0P/0W respectively; live review calibrated the
canonical lane to 9C/1P/0W. Results JSONs remain local-only evidence.

The most recent checkpoint against this baseline is the 2026-07-11 tier-interleave round
([`reviewed/2026-07-11-tier-interleave-round.md`](./reviewed/2026-07-11-tier-interleave-round.md),
stamps `2026-07-11T21-44-47-variantA.json` headline, `2026-07-11T21-55-31-variantA.json` canonical
live-10, `2026-07-11T21-59-10-variantA.json` digest-2; same v2.4/p3 + `claude-sonnet-5` contract and
the same 30 sample ids). Raw were 12C/14P/4W, 10C/0P/0W, and 0C/2P/0W; reviewed (re-judging every
flip) were 12C/14P/4W, 10C, and 2C — 5 confirmed stable gains and 2 confirmed regressions vs the
baseline headline. The super-corpus baseline above remains the baseline of record; the tier-interleave
round is a checkpoint, not a re-baseline.

## Known limitations

- **Judge variance.** One Sonnet call per grade, temperature not pinned; apply the noise floor
  before chasing single-run movement.
- **Freshness drift.** `scheduled` goldens age; the stale gate bounds how long, but expect a
  small floor of judge-vs-live disagreements — inspect `wrong` rationales before reading them
  as regressions.
- **Pack bounds.** The evidence pack is bounded, rank-based, and extracted from already-capped
  transcript text; absence from the pack is not proof of absence. Treat surprising `wrong`
  verdicts on long live/freshness transcripts as suspect until transcript-reviewed. Packs can
  contain scraped content — the judge treats them as evidence, never instructions.
- **Sequential runner.** One agent + one judge call at a time; a 30-case run is ~20–35 min.
- **Cross-surface result bytes.** Search result bodies are not retained while execute bodies
  are; compare arms on usage tokens, not captured result characters.
