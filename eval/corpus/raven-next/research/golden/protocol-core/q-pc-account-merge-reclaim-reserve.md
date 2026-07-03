---
id: q-pc-account-merge-reclaim-reserve
q: "How does account merge work, what must I clear first, and can I use it to reclaim locked base-reserve XLM?"
category: protocol-core
subcategory: accounts-operations
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains AccountMerge sends the source account native XLM balance to a destination and removes the source account.", weight: 5 }
  - { claim: "States the account must have no blocking subentries such as trustlines, offers, data entries, sponsorship relationships, or signers as applicable.", weight: 4 }
  - { claim: "Explains merging can reclaim the account minimum balance/base reserve only after ledger-entry constraints are cleared.", weight: 4 }
should_have:
  - { claim: "Warns account merge is destructive and source account no longer exists afterward.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT say AccountMerge can transfer issued assets or ignore trustlines/offers.", weight: 5 }
  - { claim: "Do NOT recommend merging custodial/exchange accounts the user does not control.", weight: 4 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#account-merge
  - https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/account-merge
  - https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering#minimum-balance
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against official AccountMerge operation/result-code docs and base-reserve docs. Sponsorship/signers/data-entry edge cases should get Phase 3 scrutiny, but the core answer is stable."
---

## Reference answer (gospel)

`AccountMerge` closes the source account: it transfers the source account's native XLM balance to a different destination account and removes the source from the ledger [1]. It is the way to reclaim the XLM locked as the account's own minimum balance, but only after the account no longer has blocking ledger state. Official result codes fail the merge if the destination does not exist, the source has `AUTH_IMMUTABLE`, the source still has trustlines and/or offers, the source sequence number is too high, or the destination cannot receive the balance while satisfying liabilities [2]. In practice, clear trustlines, offers, data entries, extra signers, and sponsorship relationships before merging; then merge only to an account you control. AccountMerge does not transfer issued-asset balances and is destructive: the source account no longer exists afterward [1][2].

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the operation definition and failure modes are in the official operation/reference docs. Scout is acceptable as a secondary protocol lookup.

## Edge / traps

Do not tell users to merge a custodial/exchange account they do not control. Do not say AccountMerge carries trustline assets with it; non-XLM balances/trustlines must be handled or removed first. The reserve is reclaimed only if the account can be deleted cleanly.
