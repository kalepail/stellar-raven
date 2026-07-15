---
id: sd-016
service: stellar-docs
status: reported-upstream
discovered: 2026-07-10
upstreamTitle: Make network limit tables dated and source-linked
evidence:
  - current Networks and Fees pages state 100 smart-contract transactions per ledger
  - live CONFIG_SETTING_CONTRACT_EXECUTION_LANES reports ledgerMaxTxCount 2000, last modified at ledger 60993066
  - live Testnet Horizon reports max_tx_set_size 200 while the Networks table states 100 operations per ledger
  - live recheck 2026-07-14T20:00Z: Mainnet execution-lanes XDR still decodes to ledger_max_tx_count 2000; latest Testnet ledger reports max_tx_set_size 200; rendered Networks page still says 100 and 1 respectively
  - Solo scratchpad 575 GT-32 primary 3281 and independent blind 3284
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2612
  - independent Docs-team audit 2026-07-14 reproduced the live values and found a third stale Testnet-operations value in docs/learn/glossary.mdx; it also confirmed the repo has no established as-of-date convention yet: https://gist.githubusercontent.com/ElliotFriend/3b3641b929b4408a834b85bcb4e75449/raw/a90e6b453ee3505ef2525b4428eaa75752e3ae08/raven-audit-rebuttal.md
---

## Finding

Official network-capacity tables contain hand-maintained current scalars that
have drifted from live network configuration. The most material example is the
documented 100 smart-contract transactions per ledger versus the current live
execution-lanes setting of 2,000. Testnet's documented classic-operation value
also differs from the live ledger field.

## Evidence

At 2026-07-14T20:00Z, `getLedgerEntries` for
`CONFIG_SETTING_CONTRACT_EXECUTION_LANES` returned last-modified ledger 60993066
and XDR decoding to `ledger_max_tx_count: 2000`. The latest Testnet Horizon ledger
reported `max_tx_set_size: 200`. The rendered Networks table still showed Mainnet
“Max 100” smart-contract transactions and Testnet `100` classic operations / `1`
smart-contract transaction; the glossary also still states 100 Testnet operations.

## Recommendation

Label current network-limit scalars with a source ledger/as-of timestamp and
link the RPC/ledger read that operators can repeat. Where maintainable, check
the hand-maintained value against a dated network-specific fixture in CI.
Explain that resource budgets can constrain effective throughput below the
count ceiling, and avoid presenting a validator-controlled setting as a
permanent protocol constant. Do not require the page to generate live tables
at request time. Apply the same correction to the glossary; the as-of/source
label establishes a new convention rather than copying an existing one.
