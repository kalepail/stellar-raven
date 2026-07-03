---
id: q-crp-oz-rwa-erc3643-trex
q: "Does Stellar have an ERC-3643 or T-REX-style regulated-token standard through OpenZeppelin Stellar RWA contracts, and how does identity-registry logic fit?"
category: compliance-rwa-payments
subcategory: regulated-token-standards
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_repos]
acceptable_cards: [stellar_docs_mcp, scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Identifies SEP-0057 as a draft Stellar T-REX / regulated-token proposal authored by OpenZeppelin contributors and based on ERC-3643 concepts, not an already-final protocol primitive.", weight: 5 }
  - { claim: "Explains that concrete identity-registry/API claims must be tied to the current SEP/repository/docs and should not rely on stale or invented function names.", weight: 5 }
  - { claim: "Explains identity/role/allowlist registries are compliance-enforcement patterns for regulated tokens, not legal compliance by themselves.", weight: 4 }
should_have:
  - { claim: "Mentions Stellar-native regulated asset tools may include authorization flags, SEP-8 approval-server patterns, SAC/Soroban token interfaces, or OZ contract libraries depending on design.", weight: 3 }
  - { claim: "Flags freshness because contract libraries and APIs can change quickly.", weight: 2 }
nice_to_have:
  - { claim: "Mentions migration/compatibility differences between EVM standards and Soroban contracts.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Stellar natively implements ERC-3643/T-REX as a protocol standard unless verified by current primary sources.", weight: 5 }
  - { claim: "Do NOT invent OpenZeppelin Stellar function names such as `add_identity` or profiles/roles without citing the current library.", weight: 5 }
must_cite:
  - "Current OpenZeppelin Stellar contracts docs/repository and any Stellar docs for regulated-asset patterns."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0057.md"
  - "https://github.com/orgs/stellar/discussions/1814"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/README.md"
  - "https://developers.stellar.org/docs/tokens/control-asset-access"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 VERIFIED against the SEP-0057 source: status Draft, title 'T-REX (Token for Regulated EXchanges)', authors OpenZeppelin + Boyan Barakov/Ozgun Ozerk/Dennis O'Connell, last updated 2026-06-11, explicitly based on ERC-3643. Real trait fns include mint/forced_transfer/set_address_frozen/set_compliance/set_identity_verifier/verify_identity/recovery_target -- so the must_avoid example 'add_identity' is correctly an INVENTED name (not in the spec). Draft + freshness keep confidence medium; re-check status/API names before treating function-level details as stable."
---

## Reference answer (gospel)

Yes, but with an important status caveat: Stellar has a draft SEP-0057, "T-REX (Token for Regulated EXchanges)", authored by OpenZeppelin contributors. It adapts the ERC-3643/T-REX regulated-token idea to Stellar/Soroban and describes permissioned tokens for RWAs such as securities, real estate, and other regulated instruments. It is not the same as Ethereum ERC-3643 running natively on Stellar, and the Stellar Protocol repository lists SEP-0057 as Draft.

The correct high-level model is a regulated token plus modular compliance and identity components. SEP-0057 describes identity verification, investor profiles, claim topics/issuers, freezing, recovery, compliance hooks, and access-control/governance concepts. Raven should avoid promising exact production APIs such as `add_identity`, profiles, or roles unless those exact names are present in the current SEP or the current OpenZeppelin Stellar implementation. The durable answer is about the draft standard and compliance architecture, not a stable copy-paste API.

For many issuers, Stellar-native regulated-asset tools still include classic authorization flags, clawback, SEP-8 approval-server patterns, and SAC/Soroban token interfaces. Identity registries and allowlists can enforce transfer policy, but they do not by themselves satisfy securities law, investor accreditation, disclosure, custody, or transfer-agent obligations.

## Why these cards (routing rationale)

`scout_repos` is appropriate because the question asks about current library/standard implementation status. `stellar_docs_mcp` and primary GitHub sources are required to verify SEP-0057 status and avoid stale API hallucinations.

## Edge / traps

Do not project EVM ERC-3643/T-REX assumptions onto Stellar without primary-source confirmation. Do not treat a draft SEP as final, and do not turn compliance-enforcement code into legal compliance advice.
