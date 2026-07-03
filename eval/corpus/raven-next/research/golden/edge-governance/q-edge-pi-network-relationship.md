---
id: q-edge-pi-network-relationship
q: Is Pi Network the same as, built on, or partnered with Stellar, does it use SCP, and can I use Stellar tools against a Pi account?
category: edge-governance
subcategory: edge-nonstellar-pi
axes:
  - edge-governance
  - ecosystem-spectrum
query_type: comparison
difficulty: medium
freshness_sensitive: true
freshness_horizon: yearly
expected_cards:
  - perplexity_search
acceptable_cards:
  - parallel_search
  - parallel_extract
  - scout_research
forbidden_cards: []
expected_service: perplexity
should_fire: true
must_have:
  - claim: "States that Pi Network is a separate network/project, not Stellar mainnet and not a Stellar asset/account."
    weight: 5
  - claim: "Distinguishes Pi use of SCP-derived consensus language from being operated by SDF or compatible with Stellar tooling."
    weight: 4
  - claim: "Says Stellar tools such as Friendbot, Stellar SDK calls, claimable balances, and Stellar multisig do not operate on Pi accounts/endpoints."
    weight: 4
should_have:
  - claim: "Notes that any claimed SDF partnership or direct affiliation must be verified against primary sources."
    weight: 3
nice_to_have: []
must_avoid:
  - claim: "Do NOT claim Pi accounts are Stellar G-accounts or that Pi balances can be managed with Stellar SDK/Friendbot."
    weight: 5
  - claim: "Do NOT provide Pi wallet support, price advice, or instructions to claim Pi as if it were Stellar."
    weight: 4
must_cite:
  - At least one dated primary or reputable source for Pi/Stellar relationship claims.
must_not_use_tier: []
pass_threshold: 0.75
weight_profile: standard
sources:
  - https://minepi.com/white-paper/
  - https://stellar.org/learn/stellar-consensus-protocol
  - https://stellar.org/connect
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: medium
notes: Snapshot 2026-06-29. Verified Pi's own white paper references SCP, but no primary SDF source found indicating Pi is a Stellar asset, Stellar mainnet account system, or SDF-operated partner network.
---

## Reference answer (gospel)

Pi Network is a separate project/network, not Stellar mainnet and not a Stellar asset. Pi's own white paper references the Stellar Consensus Protocol and David Mazieres, but using SCP-derived consensus language does not make Pi accounts Stellar G-accounts or make Pi compatible with Stellar SDK, Friendbot, claimable balances, Stellar multisig, Horizon/RPC endpoints, or Stellar block explorers. Stellar's SCP page explains SCP as Stellar's consensus model; it does not make every SCP-inspired network part of Stellar.

A Raven answer should scope this as a relationship/fact-check: unless a current primary SDF or Pi source says otherwise, do not claim an SDF partnership or operational affiliation. For Pi wallet, Pi balance, Pi KYC, Pi price, or Pi claiming issues, redirect to Pi's own support channels; those are not Stellar support tasks.

## Why these cards (routing rationale)

`perplexity_search` is expected because the relationship/affiliation claim is freshness-sensitive and partly outside the Stellar corpus. `parallel_search` or `parallel_extract` can verify the Pi white paper; `scout_research` can corroborate Stellar-side SCP facts.

## Edge / traps

The common wrong answer treats SCP as network compatibility. Another wrong answer gives Pi wallet or price support as if Pi were a Stellar asset.
