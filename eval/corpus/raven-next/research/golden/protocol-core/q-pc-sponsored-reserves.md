---
id: q-pc-sponsored-reserves
q: "How do sponsored reserves work so an app can pay a user account and trustline reserves, how do num_sponsored and revoke-sponsorship behave, and can a 0-XLM sponsored account receive or transfer assets?"
category: protocol-core
subcategory: accounts-sponsored-reserves
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains sponsorship lets one account sponsor the minimum-balance reserve for another account or ledger entry.", weight: 5 }
  - { claim: "Names BeginSponsoringFutureReserves and EndSponsoringFutureReserves as the operation pair for future reserves.", weight: 4 }
  - { claim: "Explains num_sponsored/num_sponsoring track sponsored entries and sponsoring obligations.", weight: 4 }
  - { claim: "Explains sponsorship can reduce the user XLM reserve burden but does not remove fees, authorization, trustline, or signer requirements.", weight: 4 }
should_have:
  - { claim: "Mentions RevokeSponsorship and that revocation/transfer requires valid authorization and reserve sufficiency.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT say sponsorship mints XLM or lets accounts bypass all minimum balance/fee rules.", weight: 5 }
  - { claim: "Do NOT claim a sponsored 0-XLM account can always transfer assets without fees or authorization.", weight: 5 }
must_cite:
  - "At least one primary Stellar source such as developers.stellar.org, stellar-core docs, or the stellar-protocol repository."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/guides/transactions/sponsored-reserves"
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#revoke-sponsorship"
  - "https://developers.stellar.org/docs/learn/fundamentals/lumens#minimum-balance"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against Stellar Docs. 0-XLM account behavior depends on whether another account pays fees and whether required trustlines/authorization already exist."
---

## Reference answer (gospel)

Sponsored reserves let one account take on the minimum-balance reserve burden for another account or ledger entry; they do not mint XLM or remove authorization, fee, signer, trustline, or issuer-control rules. The canonical operation pattern is a sponsorship "sandwich": the sponsor starts with `BeginSponsoringFutureReserves`, the sponsored account creates the entry, and the sponsored account ends with `EndSponsoringFutureReserves`. Source: https://developers.stellar.org/docs/build/guides/transactions/sponsored-reserves

The minimum-balance effect is tracked through account fields: the sponsored account's `numSponsored` offsets subentries that would otherwise raise its minimum balance, while the sponsor's `numSponsoring` records the reserve obligations it has taken on. The docs give the sponsored-reserve minimum balance formula as `(2 base reserves + numSubEntries + numSponsoring - numSponsored) * baseReserve + liabilities.selling`. Source: https://developers.stellar.org/docs/build/guides/transactions/sponsored-reserves#effect-on-minimum-balance

`RevokeSponsorship` can remove or transfer sponsorship of existing ledger entries and signers, with behavior depending on the source account and requiring valid authorization/reserve sufficiency. A fully sponsored account with no spendable XLM may hold a sponsored trustline and receive that asset if issuer authorization permits it, but it still needs fees paid by some transaction source or fee-bump sponsor to submit transfers, and it cannot bypass trustline/authorization requirements. Sources: https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#revoke-sponsorship and https://developers.stellar.org/docs/learn/fundamentals/lumens#minimum-balance

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer is operation-level and formula-level protocol documentation. `scout_research` is acceptable corroboration, but the final answer should cite the operation guide and list-of-operations docs.

## Edge / traps

The key trap is treating sponsorship as free XLM. It only shifts reserve responsibility. Another trap is saying "0-XLM accounts can always transfer assets"; a transaction still needs a fee source/signatures, and assets still require the relevant trustline and issuer authorization.
