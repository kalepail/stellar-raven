---
id: sd-008
service: stellar-docs
status: verified
discovered: 2026-07-09
evidence:
  - live Horizon first-activation boundary rechecked 2026-07-09: ledger 63386818 closed at 2026-07-08T17:00:05Z under Protocol 26; ledger 63386819 closed at 17:00:10Z under Protocol 27
  - developers.stellar.org Software Versions fetched 2026-07-09 still heads Protocol 27 as "Testnet, June 18, 2026" and Protocol 26 as "Mainnet, May 6, 2026"
  - stellar/rs-soroban-sdk latest release API rechecked 2026-07-09: v27.0.0, prerelease false, published 2026-07-08T19:48:45Z; the P27 table still lists Smart Contract Rust SDK and Stellar CLI as TBD
  - Solo project 49, todo 831 and truth-maintenance scratchpad 567 independent corroboration matrices
  - eval/qa/results/2026-07-09T19-25-25-variantA.json (8-case post-vote P27 smoke: 0 correct / 3 partial / 5 wrong; every verdict manually reviewed)
probe:
  type: http-text
  url: https://developers.stellar.org/docs/networks/software-versions
  expect:
    status: 200
    contains:
      - Protocol 27 (Testnet, June 18, 2026)
      - Protocol 26 (Mainnet, May 6, 2026)
---

## Finding

The Software Versions page still presents Protocol 27 as Testnet-only and Protocol 26 as the
latest Mainnet section after Stellar Mainnet activated Protocol 27. It also leaves the P27 Smart
Contract Rust SDK and Stellar CLI rows as `TBD` after stable v27.0.0 releases became available.

This is not a network ambiguity. The adjacent live Horizon ledgers show the exact transition:
ledger 63386818 closed under Protocol 26 at 2026-07-08 17:00:05 UTC, and ledger 63386819 closed
under Protocol 27 at 17:00:10 UTC. Independent RPC/protocol-history checks agree.

## Evidence

On 2026-07-09, `https://horizon.stellar.org/` reported `current_protocol_version: 27`, and
`https://horizon.stellar.org/ledgers/63386819` reported `protocol_version: 27`. The official SDF
Zipper upgrade guide had scheduled the Mainnet vote for July 8, matching the observed boundary.

The live Software Versions page still rendered headings for `Protocol 27 (Testnet, June 18,
2026)` and `Protocol 26 (Mainnet, May 6, 2026)`, with no P27 Mainnet section. Its P27 table listed
the Smart Contract Rust SDK and Stellar CLI as `TBD`, while the GitHub release APIs returned stable
`rs-soroban-sdk v27.0.0` and `stellar-cli v27.0.0` releases.

The lag created expired golden traps across the QA corpus: a current, network-grounded answer that
correctly said P27 was live would have been punished by several stale `avoid` clauses. Those local
goldens were corrected through the `golden-truth` workflow; the upstream page remains the source of
future agent confusion.

A focused eight-case QA smoke after the local correction measured the consumer impact. Five answers
were wrong and three partial. Docs-backed answers repeatedly called Protocol 26 current, treated the
July 8 vote as unconfirmed, omitted the P27 history tail, or denied that CAP-0071 delegation was a
protocol feature; the two partial release answers found v27 facts but missed either activation or
the live release tag. The one SDK/CLI answer that recovered both stable v27.0.0 versions still lacked
the durable release-feed freshness caveat. Manual review found no judge artifacts in the eight
verdicts: this is upstream truth/discoverability drift plus downstream synthesis, not a score-only
regression.

## Recommendation

Add a `Protocol 27 (Mainnet, July 8, 2026)` section (or update the existing P27 heading so both
Testnet and Mainnet activation dates are explicit), populate the stable Rust SDK and CLI versions,
and keep Testnet-vs-Mainnet support rows unambiguous. If the page intentionally tracks a curated
support matrix rather than the newest patch release, say so and link the live GitHub release feeds.
