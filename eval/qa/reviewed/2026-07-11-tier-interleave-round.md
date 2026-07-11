# 2026-07-11 tier-interleave round — post-c8a3b4d answer-quality checkpoint

The first answer-quality checkpoint after the bounded tier interleave (commit `bb25276`,
`TIER_INTERLEAVE_MARGIN` 1.6, consumer-side mitigation for `sls-051`). It is a **composite
post-`c8a3b4d` observational checkpoint**: the interval `c8a3b4d..d6e443c` contains BOTH the Scout
1.7.15 / Docs drift absorb (`6cf5bbf`) AND the tier interleave (`bb25276`) plus `d6e443c`
(improvements-only, `sls-051`), and answering/judge stochasticity. Nothing is attributed to
`bb25276` beyond its deterministic routing evidence except on the three predeclared affected ids
(`q-crp-become-an-anchor-licensing`, `q-sor-build-target-wasm32v1`, `q-sor-scval-conversion`).
Measured per-id against the 2026-07 super-corpus baseline of record; that baseline document is not
edited.

## What ran

Runner revision `d6e443c11cf6009f001015edc125e74baa878a0f` (branch `eval-round-2026-07-11b`).
Answering and judging both used the unaltered `claude-sonnet-5` defaults under rubric `v2.4` /
evidence pack `p3`, against the existing Solo dev process 2948 on `localhost:8787` (MCP initialize
readiness probe 200 before and re-probed 200 after every lane; served manifest
`generatedAt 2026-07-11T18:51:42`). Sample membership: `eval/qa/sample.json`
sha256 `bdd732870cde369a2439646e2987c9e5629fc2128dc4f80d0974767294ccbf26` — the same 30 ids as the
baseline, so per-id comparison is valid.

| Lane | Contract / selection | Results stamp | Raw result | Recorded model cost |
|---|---|---|---|---|
| Headline | deterministic owned-battery sample 30, variant A | `2026-07-11T21-44-47-variantA.json` | 12C / 14P / 4W / 0E | $17.98 (agent $13.32 + judge $4.66) |
| Canonical live | `live-data-canonical-v2`, frozen 10 | `2026-07-11T21-55-31-variantA.json` | 10C / 0P / 0W / 0E | $4.89 (agent $3.25 + judge $1.64) |
| Digest supplement | `live-digest-supplement-v2`, frozen 2 | `2026-07-11T21-59-10-variantA.json` | 0C / 2P / 0W / 0E | $1.46 |
| Routing gate | legacy 338 + skills + extended + overlay | `routing-2026-07-11T21-12-22-776Z.json` | GATE PASS | free |
| Agentic | 30-case routing sample × low/medium (60 runs) | `agentic-2026-07-11-post-interleave.json` (run `wf_cbfb579a-c35`) | 60/60 rows, 0 err | unmetered (call-count) |

Budget ledger: observed QA dollars **$24.33** total (headline $17.98 + canonical $4.89 + digest
$1.46; each lane under its cap of $25/$8/$2). Unmetered work (the fixed $15 allowance, tracked by
call count): agentic 60 Workflow runs + 0 retries; judge selftest 7 `judgeCase` calls; re-judges
13 of the 20 cap; live re-execution 5 free production `execute` probes; independent round reviewer
1 agent. Results JSONs remain local-only evidence (gitignored).

## Routing gate

`GATE PASS` at `bb25276`'s landing numbers (baseline `routing-2026-07-11T18-53-06-914Z.json`), no
rebaseline:

- legacy 338: top-1 **215** (63.6%) / top-3 **273** (80.8%) / top-5 **304** (89.9%); accept-either 79.3 / 93.5 / 98.5
- extended 122: **79** (64.8%) / **101** (82.8%) / **107** (87.7%); accept-either 91.0 / 97.5 / 100.0
- skills 23: **18** (78.3%) top-1 (at floor) / 22 (95.7%) top-3/5

## Headline result — raw

“Pass rate” is strict `correct / total`.

| Scope | Correct | Partial | Wrong | Error | n | Strict |
|---|---:|---:|---:|---:|---:|---:|
| Overall | 12 | 14 | 4 | 0 | 30 | 40.0% |
| stellarDocs | 6 | 7 | 2 | 0 | 15 | 40.0% |
| scout | 2 | 4 | 2 | 0 | 8 | 25.0% |
| lumenloop | 3 | 1 | 0 | 0 | 4 | 75.0% |
| skills | 1 | 1 | 0 | 0 | 2 | 50.0% |
| none | 0 | 1 | 0 | 0 | 1 | 0.0% |

| Category | Correct | Partial | Wrong | n |
|---|---:|---:|---:|---:|
| assets-anchors-seps | 4 | 0 | 0 | 4 |
| compliance-rwa-payments | 0 | 3 | 0 | 3 |
| defi-ecosystem | 1 | 1 | 1 | 3 |
| edge-behavior | 0 | 1 | 1 | 2 |
| history-org-tokenomics | 1 | 1 | 0 | 2 |
| protocol-core | 2 | 0 | 1 | 3 |
| retail-consumer | 0 | 2 | 1 | 3 |
| scf-grants-builders | 1 | 2 | 0 | 3 |
| soroban | 1 | 3 | 0 | 4 |
| tooling-infra | 2 | 1 | 0 | 3 |

Baseline was 8C / 18P / 4W (stamp `2026-07-11T15-36-44`). Raw headline moved +4 correct, −4
partial, wrong count unchanged at 4 (composition changed: `q-hist-quantum-preparedness-plan` left
the wrong set, `q-aas-list-token-on-exchanges-aggregators` entered it).

## Headline result — reviewed

Every flipped verdict was re-judged once on identical saved input (13 re-judges, cap 20). Two
run-level flips are **judge variance** (verdict flips on identical input → monitor-only): the run's
`q-ti-explain-repo-payload-status` correct re-judged **partial**, and the run's
`q-scf-rfps-hackathons-live` partial re-judged **correct**. They offset, so the reviewed headline is
also **12C / 14P / 4W** with `q-scf-rfps-hackathons-live` correct and `q-ti-explain-repo-payload-status`
partial. Confirmed against baseline: **5 stable gains** (1 W→C + 4 P→C) and **2 stable regressions**
(1 C→P, 1 P→W). The 40.0% raw strict rate is not a full-corpus estimate; it is this designed
30-id sample, and the confirmed movement is the reviewed reading.

## Per-id transition matrix vs baseline `2026-07-11T15-36-44` (8C/18P/4W)

| id | baseline | this run | re-judge | disposition |
|---|---|---|---|---|
| q-hist-quantum-preparedness-plan | W | **C** | correct | CONFIRMED gain — baseline "denied plan existence" overturned; agent retrieved June-9-2026 QPP + Stage-1 framing |
| q-asset-rwa-tokenized-freshness | P | **C** | correct | CONFIRMED gain — dated sourced figures, arithmetic now consistent |
| q-eco-stellar-rwa-stablecoin-volume | P | **C** | correct | CONFIRMED gain — stock/flow separation, dated Q1-2026 report |
| q-pc-muxed-accounts | P | **C** | correct | CONFIRMED gain — now includes Soroban-invocation source restriction |
| q-ti-cli-rust-windows-troubleshooting | P | **C** | correct | CONFIRMED gain — all 6 keyFacts incl no-mainnet-Friendbot |
| q-ti-explain-repo-payload-status | P | C | **partial** | VARIANCE — re-judge partial; really P→P; monitor |
| q-scf-rfps-hackathons-live | C | P | **correct** | VARIANCE — re-judge correct; really C→C; monitor |
| q-aas-list-token-on-exchanges-aggregators | P | **W** | wrong | CONFIRMED regression — real overclaim (auto aggregator listing) hits avoid; monitor |
| q-jutsu-what-is-a-memo | C | **P** | partial | CONFIRMED regression — omits "use exactly the memo the service supplies" |
| q-defi-streaming-payments-prior-art | W | W | (live) | STABLE wrong — sls-024 recurrence (below) |
| q-edge-noinfo-sep-9999 | W | W | (live) | STABLE wrong — trap; agent pins ~0001–0050 ceiling; monitor |
| q-protocol-27-cap-0071 | W | W | (live) | STABLE wrong — CAP-0072 misattribution; monitor |
| (18 other unlisted ids) | — | no change | — | correct→correct / partial→partial (the 3 W→W rows above are also no-change; 21 no-change total) |

Any-flip count 9/30 (30%). The committed 23.3% per-row any-flip noise floor is a judge-instability
caution, not a significance threshold; it is used here only to justify re-judging flips, never to
claim or dismiss a delta.

## Live-lane behavioral results

- Canonical live-10: **10C / 0P / 0W** raw and reviewed (all 10 re-checked; the two baseline
  partials both improved — `q-live-zk-repos-current` P→C is a genuine synthesis gain, using
  categorical dated groupings instead of the baseline's rigid #1 / Groth16 overclaim, re-judge
  stable; `q-live-oracle-repo-triage` was a calibrated-correct judge artifact in the baseline and is
  now raw + stable correct). Baseline calibrated was 9C/1P; this round is 10C.
- Digest-2: raw **0C / 2P**, reviewed **2C / 0P**. Both partials were judge variance: on identical
  re-judge both scored **correct**, the specific fabricated-date sub-claims (a Reflector-DAO/USTRY
  2026-06-28 proposal; a 2026-07-09 date on a `date:null` Space item) downgraded to
  unverified-not-wrong extras. Reported separately; never merged into the canonical denominator.

Raw per-lane breakdown (both lanes 0 error): canonical live-10 by service — scout 7C, lumenloop
2C, none 1C; by category — scf-grants-builders 4C, tooling-infra 3C, defi-ecosystem 2C,
edge-behavior 1C. Digest-2 by service — lumenloop 0C/2P; by category — defi-ecosystem 0C/2P. (The
headline category table above omits the always-zero Error column for width; error is 0 in every
lane, confirmed in each JSON `summary.overall.error`.)

## Wrong / partial triage (live-verified)

| Case | Lane | Raw | Live re-execution / re-judge | Root cause |
|---|---|---|---|---|
| q-defi-streaming-payments-prior-art | headline | wrong | Live `scout.searchProjects` returned Fluxity `status:Live`, `verificationLevel:Unverified`, `statusAsOf`/`statusBasis`/`statusSourceUrl` null, `supportedNetworks:[]`, `scfTotalAwardedUSD:82750` rounds [18,21]; all 19 streaming projects `Live`. Agent promoted label→deployment maturity. | **Upstream `sls-024` recurrence** (Scout lifecycle-label lacks deployment basis) |
| q-protocol-27-cap-0071 | headline | wrong | Live `searchResearch` surfaced `cap-0071.md` = "Authentication delegation and address-bound Soroban credentials" (golden's attribution) and `cap-0072.md` = "Contract signers" (different). Agent said "delegation sub-CAP is CAP-0072 … does the substantive work" and never confirmed P27-live. Data was available; agent misread. | Agent failure: CAP misattribution + missing freshness confirmation |
| q-edge-noinfo-sep-9999 | headline | wrong | Correctly found no SEP-9999 but asserted "real SEPs run roughly 0001–0050", hitting the must-avoid ceiling trap. Re-judge stable wrong. | Agent failure: trap handling / stale-ceiling overclaim |
| q-aas-list-token-on-exchanges-aggregators | headline | wrong | Claimed "explorers and aggregators surface an asset automatically once it exists on-chain with a trustline count and stellar.toml"; contradicts "each venue applies its own listing policy" and hits avoid #1. Omits home_domain / holder-trustline prerequisites. Re-judge stable wrong. | Agent failure: automatic-listing overclaim |
| q-jutsu-what-is-a-memo | headline | partial | Defines memo + custodial routing but omits the safety instruction to use exactly the memo the receiving service supplies. Re-judge stable partial. | Agent failure: safety-caveat omission |
| (12 other raw partials) | headline | partial | The remaining 12 of the 14 raw partials (excluding jutsu above and scf-rfps, which is matrix-handled as variance→correct): agent-identity, crp-become-anchor, crp-remittance, defi-liquid-staking, edge-1xlm, hot-sdf, raph-offramp, scf-current-hackathons, sor-build, sor-scval, soroban-no-std, ti-stellar-lab. Same completeness/synthesis-omission class as the baseline's 18 partials — each omits a different specific fact (as-of framing, BytesN enforcement, PRNG behavior, business-control architecture, snapshot metadata, plaintext-key/trustline security, etc.). | Agent failure: diffuse completeness/synthesis omission |

## Completeness/synthesis-omission pattern

The baseline's completeness/synthesis-omission pattern persists across many unrelated cases (>2),
so it clears the acting bar. The prose-surface inventory was run before proposing any wording
change (runtime guards / `codemode.*` error strings, truncation footers, adapter hints, `search`
`nextSteps`, tool descriptions + `SERVER_INSTRUCTIONS`, catalog descriptions). Disposition: the
pattern is diffuse — each case omits a different specific fact — so no single mechanism or prose
surface targets it, and a blanket "be more complete" nudge would be unmeasurable clutter that
violates the measure-prose-like-code and anti-overfitting rules. Recorded as a standing
answering-model characteristic (monitor-only); **no prose change filed**.

## Agentic lane — new row-level baseline of record

General diagnostic; **no causal claim about `bb25276`** (the committed 30-case agentic sample is the
routing-cases sample and contains none of the interleave-recovered extended cases). Run
`wf_cbfb579a-c35`, artifact `eval/agentic/results/agentic-2026-07-11-post-interleave.json`
(gitignored), Sonnet 5 at low + medium effort, case hash `6f810545…`. Completeness gate: **60/60
unique id×effort rows, all 30 ids at both efforts, 0 errors, 0 retries.**

| scope | low pri/any | medium pri/any |
|---|---|---|
| stellarDocs (12) | 100 / 100 | 100 / 100 |
| scout (10) | 50 / 70 | 90 / 100 |
| lumenloop (8) | 50 / 50 | 50 / 62.5 |
| **overall (30)** | **70.0 / 76.7** | **83.3 / 90.0** |

Comparison is aggregate-only against the labeled history in `eval/agentic/README.md` (no comparable
July 6/9 row-level artifact exists). Versus the July 6 full artifact (low 73.3/80, med 73.3/80):
medium primary rose to 83.3 and lumenloop-medium recovered from 12.5 (July 6) to 50 — recorded as
observational, not causally attributed, because the interval is composite. This artifact becomes the
new row-level baseline.

## Findings filed

- **`sls-024` updated** (not a new finding): appended this round's live-confirmed recurrence
  (stamp `2026-07-11T21-44-47-variantA.json`). The recurrence sharpens the recommendation — the
  provenance/deployment-scope fields the finding asks for (`statusAsOf`, `statusBasis`,
  `statusSourceUrl`, `supportedNetworks`) now exist in the response schema but are unpopulated for
  Fluxity, so the actionable ask is to POPULATE them per record, not merely expose them.
- **Zero new findings.** Nothing new surfaced. Re-checked, with live re-execution: the 4 wrongs
  (1 upstream recurrence, 3 agent failures), both digest fabricated-date sub-claims (both flipped to
  correct/unverified-not-wrong on re-judge — no stable data gap), the 3 predeclared `bb25276`-affected
  ids (all P→P from completeness omissions, not misrouting — docs reachable in-lane, routing gate at
  `bb25276` numbers, so no QA-level `sls-051` recurrence), and the diffuse completeness pattern (agent
  characteristic, not upstream). No eval-side golden defect was established, so no gospel changed.

## Monitor-only list

- `q-ti-explain-repo-payload-status` and `q-scf-rfps-hackathons-live` — single-verdict variance flips.
- `q-aas-list-token-on-exchanges-aggregators` — new agent automatic-listing overclaim (single case).
- `q-protocol-27-cap-0071` — agent CAP-0072 misattribution (single case).
- `q-edge-noinfo-sep-9999` — agent stale-SEP-ceiling trap failure (same-case recurrence, not 2+ unrelated).
- Diffuse completeness/synthesis-omission across ~11 partials — standing answering-model characteristic.

## Composite-attribution caveat

The interval `c8a3b4d..d6e443c` bundles the Scout 1.7.15 / Docs drift absorb, the `bb25276` tier
interleave, and `d6e443c` improvements-only, on top of answering/judge stochasticity. The only
deterministic `bb25276` evidence is the routing gate (unchanged at its landing numbers). Answer-quality
movement here is not attributed to any single commit; the three predeclared affected ids stayed
partial for completeness reasons unrelated to routing.

## What this establishes

The owned 484-case corpus retains a reproducible measurement contract (v2.4/p3, `claude-sonnet-5`
answering + judge). This checkpoint shows the headline sample stronger than the baseline on the same
30 ids — 5 confirmed stable gains (including one baseline wrong genuinely overturned) against 2
confirmed regressions — while the execute-grounding contracts are at their strongest yet (canonical
live 10/10, digest calibrated 2/2). The remaining wrongs are one upstream lifecycle-label recurrence
(`sls-024`, now schema-present-but-unpopulated) and three isolated agent-synthesis failures. Future
deltas should keep comparing the same sample ids and v2.4/p3 tuple, re-judge every flip before
believing it, and read wrong-count movement before aggregate correct-count movement.

## Independent review

An independent adversarial reviewer (gpt-5.6-sol, high effort, read-only; Solo process 3448) verified
this round against the raw artifacts, including independently re-running the production
`scout.searchProjects({ q: "streaming recurring payments" })` probe (confirmed 19/19 `Live` and
Fluxity's exact fields) and recomputing every lane's counts, the transition matrix, budget arithmetic,
and the 60-row agentic completeness gate. Verdict: **APPROVE-WITH-FIXES**; all measured outcomes
verified with no overclaim, lane merge, or `bb25276` answer-quality attribution. Three record-only
count/completeness defects were raised and are now fixed in this document: the transition-table
catch-all (21 → 18 unlisted ids), the partial-triage catch-all (11 → 12 other raw partials), and the
missing live-10/digest raw per-service/category breakdown + zero-Error note. Non-blocking residual
risk: the 13 identical-input re-judge return values live in the Solo round scratchpad and local logs
only (not a persisted machine-readable artifact), so their exact scores are internally consistent and
were reconciled against the result rows, but are not independently replay-verifiable without spending
on a lane the budget prohibits.
