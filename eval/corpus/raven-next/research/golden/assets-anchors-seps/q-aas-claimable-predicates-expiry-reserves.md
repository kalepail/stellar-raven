---
id: q-aas-claimable-predicates-expiry-reserves
q: "How do Stellar claimable-balance predicates, expiry, multi-claimant patterns, cancellation/reclaim patterns, and reserve costs work — e.g. if I list myself as a claimant, can I reclaim the balance anytime?"
category: assets-anchors-seps
subcategory: claimable-balances
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that claimants are paired with predicates and a claimant can claim only while its predicate is true.", weight: 5 }
  - { claim: "Covers time-based predicates for before/after absolute or relative time and how they can model expiry or reclaim windows.", weight: 4 }
  - { claim: "Mentions each claimable balance consumes reserve while it exists.", weight: 4 }
should_have:
  - { claim: "Explains multi-claimant designs such as recipient can claim before a deadline and sender can reclaim after a deadline.", weight: 3 }
  - { claim: "Notes that reclaim/cancel is implemented as a claimant path, not a special unilateral cancellation by the creator.", weight: 3 }
nice_to_have:
  - { claim: "Mentions predicate composition such as AND/OR/NOT if supported by the referenced operation docs.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim claimable balances expire automatically without a claim/reclaim operation removing them.", weight: 5 }
  - { claim: "Do NOT say the creator can always claw back or cancel a claimable balance at will.", weight: 5 }
  - { claim: "Do NOT conflate claimable-balance predicates with asset issuer clawback flags.", weight: 4 }
  - { claim: "Do NOT omit reserve cost when asked about many or long-lived claimable balances.", weight: 3 }
must_cite:
  - "Official Stellar claimable balance docs or operation reference."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/guides/transactions/claimable-balances"
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#create-claimable-balance"
  - "https://developers.stellar.org/docs/learn/fundamentals/lumens#base-reserves"
  - "https://github.com/stellar/stellar-protocol/blob/master/core/cap-0023.md"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified predicate types, reserve-per-claimant wording, and non-automatic expiry semantics against CAP-23 and the build/guides claimable-balances page (live 2026-06-29). Folded in q-aas-claimable-balance-reclaim: added must_avoid on at-will creator reclaim and on conflating predicates with issuer clawback flags, plus the self-as-claimant probe."
---

## Reference answer (gospel)

A claimable balance contains an amount, an asset, a creator, and up to 10 claimants. Each claimant is an account plus a `ClaimPredicate`; that claimant can claim only when its predicate is true. Supported predicate shapes include unconditional, AND, OR, NOT, before absolute time, and before relative time. The docs also show after-time windows by negating a before-time predicate.

Expiry is not automatic deletion. A common expiring-payment design is: recipient claimant can claim before a deadline; sender/creator claimant can claim after the deadline. After the deadline, someone still has to submit the claim operation from the reclaim claimant to consume the entry. If no predicate ever becomes usable by a real claimant, the claimable balance can be stranded.

If you list yourself (the sender/creator) as a claimant, that does NOT give you an at-will reclaim right: you can only claim when your own predicate evaluates true, and listing yourself never overrides another claimant's predicate. A claimable balance is not a custodial balance the creator can pull back at will, and the predicate set — not an issuer clawback flag — is the control surface. (Issuer clawback under CAP-35 is a separate regulated-asset feature, not the creator's ordinary reclaim mechanism.)

Reserve matters for high-volume or long-lived designs. Creating a claimable balance increases the creator's minimum balance by one base reserve per claimant, and the Stellar lumens docs describe claimable balances as ledger entries that require a base reserve per claimant. The reserve is released when the entry is consumed.

## Why these cards (routing rationale)

Predicate/reserve semantics are protocol docs, so `stellar_docs_mcp` is primary. Scout is acceptable only as corroboration over the same docs/CAP.

## Edge / traps

Do not imply automatic expiration clears ledger state; encode the intended reclaim path explicitly. Do not omit reserve cost when many balances or many claimants are involved. Do not tell a creator who lists themselves as a claimant that they can reclaim "anytime" — they are bound by their own predicate — and do not conflate this with issuer clawback flags.
