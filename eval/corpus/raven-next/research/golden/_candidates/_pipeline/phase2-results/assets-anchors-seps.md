# Phase 2 results: assets-anchors-seps

Date: 2026-06-29

## Files answered

- `research/golden/assets-anchors-seps/q-aas-burn-clawback-redemption-mechanics.md`
- `research/golden/assets-anchors-seps/q-aas-claim-received-claimable-balances.md`
- `research/golden/assets-anchors-seps/q-aas-claimable-balance-reclaim.md`
- `research/golden/assets-anchors-seps/q-aas-claimable-predicates-expiry-reserves.md`
- `research/golden/assets-anchors-seps/q-aas-issuer-fees-supply-cap-freeze.md`
- `research/golden/assets-anchors-seps/q-aas-list-token-on-exchanges-aggregators.md`
- `research/golden/assets-anchors-seps/q-aas-publish-asset-metadata-toml.md`
- `research/golden/assets-anchors-seps/q-aas-sep30-recoverable-wallets.md`
- `research/golden/assets-anchors-seps/q-aas-trusted-asset-list-whitelist.md`
- `research/golden/assets-anchors-seps/q-aas-trustline-limit-lifecycle.md`

## Confidence distribution

- High: 8
- Medium: 2
- Low: 0

Medium-confidence files:

- `q-aas-list-token-on-exchanges-aggregators.md` because venue-specific listing policies and aggregator behavior are freshness-sensitive.
- `q-aas-issuer-fees-supply-cap-freeze.md` has high confidence on flags/freeze/clawback, but the negative transfer-fee claim is inferred from classic asset operation semantics rather than a single explicit "no fee hook" statement.

## Sources/classes used

- Official Stellar docs MCP / developers.stellar.org: assets, SAC, control asset access, claimable balances, Horizon claimable-balance endpoints, operation result codes, Wallet SDK SEP-30 docs, base reserves.
- Primary protocol specs: CAP-23, CAP-35, SEP-1, SEP-30, SEP-42 in `stellar/stellar-protocol`.
- Stellar Light Scout HTTP: `/api/research` for SEP-1/SEP-42 and `/api/projects/search` for current wallet/explorer ecosystem context.
- Parallel web fetch: close reads of official docs, GitHub specs, Stellar Asset Lists catalog, npm package, and StellarExpert asset-list page.
- Local ecosystem skill references: `ecosystem-skills/INDEX.md`, `ecosystem-skills/skills/stellar-dev/assets/SKILL.md`, and targeted endpoint guidance from `ecosystem-skills/skills/stellar-light/stellar-scout/SKILL.md`.

## Unverified caveats for Phase 3

- Listing and visibility questions should not gate on any one exchange, wallet, explorer, or aggregator policy unless Phase 3 verifies that venue's current dated listing docs.
- `q-aas-issuer-fees-supply-cap-freeze.md`: Phase 3 may want to add an explicit primary quote or a narrowly scoped empirical SDK/protocol check for "no classic asset transfer-tax hook."
- Claimable-balance discovery wording uses Horizon as the practical discovery API; Phase 3 can decide whether to mention RPC ledger-entry reads as an alternative in the rubric.
- SEP-30 is still marked Draft in the spec, while official Wallet SDK docs document it as the recovery flow; Phase 3 should preserve that nuance if status matters.
