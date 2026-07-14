---
id: sls-052
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-12
evidence:
  - live re-check 2026-07-14: OpenAPI x-routing contains named-role, repo-health, and SDF-organization vocabulary on the relevant operations; resolving PR https://github.com/Stellar-Light/stellarlight/pull/508
  - routing A/B at the Scout 1.7.16 absorb (GitHub issue #21; solo://proj/49/scratchpad/drift-issue-21-scout--605, counts verified by independent adversarial review in scratchpad 606): with the gateway scoring x-routing as a separately-weighted field per upstream's convention (blend 1.0, cap 128 — the strongest setting short of description concatenation), 30 of the 50 scout-expected legacy cases lost at the bare absorb stay unrecovered (lever recovers 20); scout-scope top-1 falls 67→37 of 95 and the extended-lane scout scope falls 22→4 of 25 while docs routing improves; per-case list in the scratchpad
  - representative unrecovered families, each with the winning entry and the best scout rank/score from eval/results/routing-2026-07-12T21-12-46-662Z.json — getLeaderboard on repo-health phrasing ("which leaderboard projects have open issues": best scout score 176 vs 335 winner), searchResearch on SDF-organizational phrasing ("SDF enterprise fund", "SDF mandate buckets": 162–246 vs 188–206 winners), getBuilders on stack+role phrasing ("Rust Soroban devs": 369 vs 449 docs winner)
  - the moved x-routing keywords[] lists were verified live 2026-07-12 (stellarlight.xyz/api/openapi.json, spec 1.7.16) — none of the failing question families' distinctive vocabulary (open issues/repo health; enterprise fund/mandate/organizational structure; per-stack role synonyms beyond "rust"/"soroban") appears in the corresponding operation's x-routing block
  - 2026-07-13 live re-check against Stellar Light 1.7.18: getBuilders now carries role/seniority/stack vocabulary, getLeaderboard carries open-issue/repo-health vocabulary, and searchResearch carries SDF enterprise-fund/mandate/org vocabulary; local scoring on the regenerated manifest moved the SDF query from scout.searchResearch rank 2 score 172 to rank 1 score 193 and raised the experienced-Rust-builder score from 183 to 193; the existing routing baseline passed without re-baselining
---

## Finding

The 1.7.16 structural fix (sls-051) moved routing vocabulary out of operation
descriptions into the machine-readable `x-routing` extension, and the design
works: scored as a separately-weighted field, it recovers 20 of the 50 scout
routing losses a bare description-only absorb causes, while all 22
docs/lumenloop capture-relief wins hold. But 30 of the 50 stay lost at every
weighting the consumer can defend — a substantial curation gap, not a design
gap: the question families the old prose descriptions caught have no
representation in the corresponding operation's `x-routing` vocabulary, so no
weighting scheme can route them without re-fattening descriptions — exactly
what 1.7.16 was built to avoid.

Measured at the strongest defensible consumer setting (full description-tier
weight for x-routing matches, 128-token cap, no frequency filtering), the gap
families are:

- `getLeaderboard`: repository-health phrasings — "open issues", "issue
  tracker", "maintenance", "activity" appear in questions but not in its
  keywords/useWhen.
- `searchResearch`: SDF-organizational phrasings — "enterprise fund",
  "mandate", "organizational structure", "chief scientist" style questions
  route to generic content search instead.
- `getBuilders`: stack+role phrasings beyond the two seeded tokens — the
  keywords list carries "rust"/"soroban" but questions combining stack with
  seniority/role vocabulary still lose to Soroban docs operations.

## Evidence

Reproducible by any consumer: fetch the live 1.7.16 `x-routing` blocks for
the three operations, tokenize them alongside the failing question families
above, and observe zero distinctive-token overlap. Full per-case table (all
30 unrecovered legacy losses; the three families above are the clearest
vocabulary gaps, the remainder mix vocabulary gaps with genuinely ambiguous
cross-service labels) in solo://proj/49/scratchpad/drift-issue-21-scout--605;
ranked result dump in eval/results/routing-2026-07-12T21-12-46-662Z.json.

Live re-check on 2026-07-13 after Scout 1.7.18 confirmed that the three named
curation gaps were fixed upstream. The live `x-routing` blocks now include:

- `getLeaderboard`: open issues, issue tracker/backlog, repo/repository health,
  maintenance, commits, and matching `useWhen` guidance;
- `searchResearch`: SDF/Stellar Development Foundation, enterprise fund,
  mandate, organizational structure, leadership, chief scientist, roadmap, and
  grants-program vocabulary;
- `getBuilders`: developers/devs/engineers/contributors, experienced/senior,
  frontend/backend, TypeScript/JavaScript, smart-contract developer, and
  stack-plus-role `useWhen` guidance.

Against the regenerated catalog, "What is the SDF enterprise fund and what is
its mandate?" moved `scout.searchResearch` from rank 2 (score 172) to rank 1
(193), while "Who are experienced Rust Soroban devs I could work with?" kept
`scout.getBuilders` at rank 1 and raised its score from 183 to 193. The full
routing gate passed the existing baseline; no re-baseline was used. The broader
ambiguous cross-service losses noted in the original A/B are not claimed fixed
by this targeted vocabulary resolution.

## Recommendation

Extend the per-operation `x-routing.keywords`/`useWhen` lists with the
missing question-family vocabulary (repo-health terms on `getLeaderboard`,
SDF-organizational terms on `searchResearch`, role/seniority terms on
`getBuilders`). This is additive curation inside the structure 1.7.16 already
built — no description growth, no capture risk, and upstream's existing
contract CI (description length + capture probes) continues to hold the
sls-015/sls-051 line. A useful guard for curation completeness: assert that
each operation's x-routing block covers the vocabulary of the question set
that operation is expected to win, the inverse of the existing
capture-prevention probes.
