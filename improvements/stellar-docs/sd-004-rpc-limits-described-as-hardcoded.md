---
id: sd-004
service: stellar-docs
status: reported-upstream
discovered: 2026-07-03
evidence:
  - developers.stellar.org method pages (getTransactions, getEvents, getLedgers) fetched 2026-07-03
  - stellar/stellar-rpc cmd/stellar-rpc/internal/config/options.go (same day)
  - Solo project 49, todo 828, scratchpad 521 (golden-truth deep-verification round)
  - live re-verified 2026-07-06 (eval round todo 846): the indexed RPC Structure→Pagination page still says the getEvents limit is "hardcoded in Stellar-RPC for performance reasons"; the method pages remain unindexed (sd-003) so their wording could not be re-fetched via search, but the sibling indexed page shows the same unfixed pattern
  - upstream issue filed 2026-07-07: https://github.com/stellar/stellar-docs/issues/2567
  - pending upstream PR https://github.com/stellar/stellar-docs/pull/2572 tracked 2026-07-09 at head eb676939424ea6b783729de6e94fbf93665b12e6: branch wording now describes configurable defaults, but the PR remains open/review-required/merge-blocked; production proof is unavailable, so issue #2567 remains open
---

## Finding

The RPC method reference pages describe pagination limits as "hardcoded in
Stellar-RPC for performance reasons" (getTransactions and getLedgers 1–200,
getEvents 1–10000), but in the stellar-rpc source every one of these limits is
an operator-configurable option — `--max-transactions-limit` /
`--default-transactions-limit`, `--max-events-limit` / `--default-events-limit`,
`--max-ledgers-limit` / `--default-ledgers-limit`, settable via CLI/TOML/env —
whose SHIPPED DEFAULTS are the documented numbers (the only validation is
default ≤ max, with no absolute ceiling). By contrast Horizon's 200 IS a true
compile-time constant (`stellar/stellar-horizon`
`internal/db2/page_query.go: MaxPageSize = 200`), so the same word describes
two different things across adjacent doc pages.

## Evidence

Docs (2026-07-03): "The limit for getTransactions can range from 1 to 200 - an
upper limit that is hardcoded in Stellar-RPC for performance reasons."
Source (same day): `options.go` — `Name: "max-transactions-limit" ...
DefaultValue: uint(200)`, `Name: "default-transactions-limit" ...
DefaultValue: uint(50)`; handlers are constructed from
`cfg.MaxTransactionsLimit` / `cfg.DefaultTransactionsLimit`. Same pattern for
events (10000/100) and ledgers (200/50).

## Consequence

Consumers (and this repo's eval golden, before correction) repeat "hardcoded"
as a source-level fact; self-hosted operators reading the docs won't discover
they can raise the caps; and a technically-precise answer ("configurable,
defaults 200/50") reads as contradicting the official docs.

## Recommendation

Reword the method pages: "the default configuration caps this at 200
(operators can adjust via `--max-transactions-limit`); public providers
typically run the defaults." One sentence per method page fixes it; keeping
"hardcoded" only where it is true (Horizon) preserves the useful distinction.
