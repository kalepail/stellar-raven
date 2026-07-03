# Phase 4 final report — golden answer assembly

Date: 2026-06-29

Phase 4 assembled the Jitsu net-new candidate batch into the golden corpus. The Phase 3 dependency
gate was `done`; Phase 4 set `gp_phase4=running`, validated the new files, repaired compiler-facing
claim formatting in five reviewed files, regenerated the generated golden artifacts under the
`golden-files` lock, and verified the resulting corpus.

## Counts

Total net-new candidates in `phase1-worklist.json`: **144**

| Disposition | Count |
|---|---:|
| RESEARCH | 127 |
| DECLINE | 17 |
| FOLD | 0 |
| DROP | 0 |

All 144 promoted files are present under `research/golden/<category>/` and have `status: reviewed`.

| Category | RESEARCH | DECLINE | Total |
|---|---:|---:|---:|
| assets-anchors-seps | 10 | 0 | 10 |
| compliance-rwa-payments | 10 | 0 | 10 |
| defi-ecosystem | 11 | 0 | 11 |
| edge-governance | 8 | 17 | 25 |
| history-org-tokenomics | 4 | 0 | 4 |
| protocol-core | 17 | 0 | 17 |
| scf-grants-builders | 3 | 0 | 3 |
| soroban | 27 | 0 | 27 |
| tooling-infra | 37 | 0 | 37 |

Generated corpus totals after assembly:

| Artifact | Count |
|---|---:|
| `research/golden/_meta/CATALOG.md` | 539 questions |
| `research/golden/compiled/golden.json` | 539 questions |
| `research/golden/compiled/golden.json` | 539 questions |

## Confidence

| Confidence | Count |
|---|---:|
| high | 90 |
| medium | 54 |
| low | 0 |

Medium-confidence items are concentrated where current external state can move: compliance/payment
providers, DeFi project status, Soroban SDK/protocol readiness, and tooling package/provider behavior.

## Freshness-sensitive set

Freshness-sensitive net-new files: **51**

| Horizon | Count |
|---|---:|
| daily | 1 |
| weekly | 4 |
| monthly | 8 |
| quarterly | 16 |
| yearly | 5 |
| protocol-release | 4 |
| docs-release | 13 |

Freshness-sensitive areas called out by Phase 3 remain intentionally date-bound: protocol votes and
releases, SCF rounds/deadlines, live contract IDs, package/API helper names, provider feature tables,
OpenZeppelin Relayer/x402 details, Chainlink/CCTP availability, and project-specific listing policies.

## FOLD patches

No worklist rows had `disposition: FOLD`, so Phase 4 has no rubric patch proposals to apply or
present for human review.

## Repairs made

Five reviewed files used block-style `claim:` values that the existing migration/compiler parser did
not extract. Phase 4 converted those claim strings to the compiler-compatible quoted form without
changing their wording:

- `research/golden/history-org-tokenomics/q-hot-roadmap-2026.md`
- `research/golden/history-org-tokenomics/q-hot-sdf-transparency-wallets-reports.md`
- `research/golden/history-org-tokenomics/q-hot-sdf-xlm-holdings-sales.md`
- `research/golden/scf-grants-builders/q-scf-nontechnical-participation.md`
- `research/golden/scf-grants-builders/q-scf-submission-lifecycle-deadlines.md`

Phase 4 also updated `src/golden/migrate.check.ts` so the migration test derives the current markdown
corpus count instead of hardcoding the previous 395-question corpus size.

## Validation

Phase 4 validation checks:

- Custom schema/card/status validation: **539 total golden files**, **144 worklist files**, 0 errors,
  0 warnings.
- `node research/golden/_meta/build-index.mjs`: passed; wrote 539-question catalog.
- `node research/golden/_meta/compile.mjs`: passed; compiled 539-question `golden.json`.
- `npx tsx src/golden/migrate.ts --write`: passed; wrote 539-question `golden.json`.
- `npm run test:golden`: passed.
- `npm run test:phase3`: passed.

## Recommended next actions

1. Review the large generated diffs for `research/golden/_meta/CATALOG.md`,
   `research/golden/compiled/golden.json`, and `research/golden/compiled/golden.json`.
2. Spot-check the 54 medium-confidence cases before relying on them as stable ground truth, especially
   the provider/project/status-sensitive groups.
3. Re-run the eval harness against the refreshed 539-question `golden.json` once the human is ready
   to measure Raven against the expanded corpus.
4. Commit only after reviewing the golden batch separately from unrelated worktree changes already
   present outside the Phase 4 scope.
