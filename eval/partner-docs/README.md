# Partner-doc retrieval diagnostic

This todo-910 lane measures whether a fixed, code-allowlisted set of public partner Markdown
pages contains facts that Raven's current sources do not retrieve on the same question. It is a
diagnostic source-admission instrument, not the headline QA eval and not a production routing map.

Run against the existing Solo-managed local Raven process:

```sh
npm run eval:partner-docs -- --raven-url http://localhost:8787/mcp
```

The harness makes only read-only GETs to URLs declared in `cases.json`. Code-owned validation
restricts Alchemy to `https://www.alchemy.com/docs/**/*.md` or admitted `llms.txt` files and
OpenZeppelin to MDX below the `OpenZeppelin/docs` Stellar/Relayer content roots. Redirect targets,
content type, UTF-8 decoding, and a 256 KiB per-document cap are enforced. It never connects to a
partner MCP server and never calls an API described by the fetched documentation.

Measured OpenZeppelin case URLs are commit-pinned; each result records `resolvedCommit` alongside
the body SHA-256. Any Raven baseline error makes the retrieval gate `inconclusive` rather than
silently shrinking the comparison denominator.

## 2026-07-10 baseline

Canonical diagnostic run: `2026-07-10T03:15:21.411Z`, local Raven at `7cf6213`, eight cases / 64
fact groups. Current-Raven arm used one fixed relevant operation or mirrored skill per case;
candidate arm fetched one admitted first-party Markdown/MDX page. Both arms were scored with the
same literal fact-group matcher.

| Case | Current Raven | Candidate docs |
| --- | ---: | ---: |
| `alchemy-stellar-data-overview` | 0/8 | 8/8 |
| `alchemy-stellar-transfers` | 1/8 | 8/8 |
| `alchemy-stellar-balances` | 0/8 | 7/8 |
| `alchemy-stellar-rpc-quickstart` | 5/8 | 8/8 |
| `openzeppelin-stellar-suite` | 1/8 | 8/8 |
| `openzeppelin-smart-account` | 0/8 | 8/8 |
| `openzeppelin-stellar-rwa` | 0/8 | 8/8 |
| `openzeppelin-stellar-relayer` | 0/8 | 8/8 |
| **Total** | **7/64 (10.9%)** | **63/64 (98.4%)** |

Candidate fetches had zero errors, redirects outside the allowlist, prompt-signal matches, or
content-type violations. Median document fetch was 46.0 ms and p95 was 172.4 ms in this single
local run. The retrieval-admission threshold passed (+87.5 percentage points, eight wins, zero
regressions).

This is deliberately not a ship result. The cases were derived from the candidate pages, Raven's
arm did not get an answering agent or multi-query recovery, one run does not establish reliability,
and the narrow prompt-signal scanner is not a security proof. The paired end-to-end QA, resilience,
drift, and security gates in `research/partner-doc-source-onboarding.md` remain unrun, so the harness
reports `headlineQaGate: not-run` and `shipDecision: do-not-ship-runtime-adapter`.

## Case cohorts and the phase-1 floor

Every case carries a `caseType`. `page-derived` marks the 2026-07-09 cohort, written by reading the
candidate page — the weakness the ship gate calls out by name. `paraphrase`, `negative`, and
`conflict` mark **independent** cases, whose information need came from somewhere other than the
candidate page; each records that origin in `provenance` so a reviewer can check the claim instead
of trusting it.

Phase 1 asks for at least four independent cases. That floor is now enforced in
`summarize()` (`PHASE1_MIN_INDEPENDENT_CASES`), not just written down here: a suite that has not
been expanded reports `fail`, and page-derived cases cannot backfill the count. `npm test` also
asserts the committed suite stays above the floor and keeps all three independent kinds present.

## 2026-07-31 expansion and candidate re-measurement

Four independent cases were added, taking the suite to 12 cases / 96 fact groups:

| Case | Kind | Why it is independent |
| --- | --- | --- |
| `alchemy-stellar-nfts-filter-exclusivity` | negative | The correct answer is a refusal — `contractId` and `assetCode`/`assetIssuer` are mutually exclusive — that no Stellar-side source states. |
| `alchemy-data-api-versus-rpc-product-split` | conflict | The two-product conflation this lane's design doc warns about: different host, auth scheme, and protocol. |
| `openzeppelin-fee-abstraction-token-fees` | paraphrase | A dapp-team capability question about a package none of the three mirrored skills document. |
| `openzeppelin-sponsored-fee-token-scope-conflict` | conflict | Two first-party OpenZeppelin surfaces with different scopes; answering from either alone is wrong. |

Candidate-arm run `2026-07-31T14:26:33.718Z`, 15 documents / 144,396 bytes fetched:

| Cohort | Candidate docs |
| --- | ---: |
| Eight page-derived cases | 63/64 (98.4%) |
| Four independent cases | 32/32 (100%) |
| **Total** | **95/96 (99.0%)** |

Zero fetch errors, zero allowlist violations, zero prompt-signal matches. Median document fetch
47.3 ms, p95 480 ms — measured over a larger and more multi-page document set than the eight-case
run above, so the two p95 figures are not comparable.

The page-derived cohort reproduced its 2026-07-10 score **exactly**, 21 days later, with every
pinned and unpinned URL still resolving. That is a stability observation about the sources, not
evidence for shipping.

**This run does not advance the gate.** No local Raven was available, so the baseline arm did not
run: `baselineCases: 0` and the gate is `inconclusive` by design, never a silently shrunken
comparison. Phase 1 stays unmet until someone re-runs the paired arms with
`--raven-url` over all 12 cases. Phases 2–4 remain unrun.

One limitation worth stating plainly: a literal fact matcher can only show that both sides of a
`conflict` case are *retrievable*. Whether an answering agent keeps them apart — rather than
merging them into one synthetic claim — is exactly what phase 3 measures, and this harness cannot
stand in for it.
