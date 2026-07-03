---
id: q-hist-visa-stablecoin-settlement
q: "Did Visa add Stellar to its stablecoin settlement platform?"
category: history-org-tokenomics
subcategory: partnerships
axes: [ecosystem-spectrum, edge-governance]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: "monthly"

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search, scout_research]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Visa expanded its stablecoin-settlement platform to include the Stellar network.", weight: 5 }
should_have:
  - { claim: "The expansion added support for stablecoins such as USDC/EURC (and others like USDG/PYUSD) on Stellar.", weight: 2 }
  - { claim: "This occurred in 2025 (Visa added Stellar alongside another chain such as Avalanche).", weight: 2 }
  - { claim: "Flags that the partnership scope/run-rate is recent and a current source should confirm details.", weight: 2 }
nice_to_have:
  - { claim: "Related: Wirex went live with Visa stablecoin settlement on Stellar (late 2025).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Visa settles on Ripple/XRP instead of Stellar for this program, or deny Visa added Stellar.", weight: 4 }
  - { claim: "Do NOT assert a precise settlement run-rate figure with false confidence and no date / source.", weight: 2 }
must_cite:
  - "A reputable dated source on Visa adding Stellar to stablecoin settlement (Visa or news)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21581.html
  - https://stellar.org/press/wirex-and-stellar-go-live-with-dual-stablecoin-visa-settlement-in-usdc-and-eurc-for-7-million-users
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified 2026-06-22 against Visa newsroom: July 31, 2025 Visa added Stellar + Avalanche, plus USDG/PYUSD (via Paxos) and EURC. Wirex went live Nov 18, 2025 (USDC/EURC, 7M+ users). Run-rate ~$4.6B across all chains is SDF year-in-review (caveat). Confidence raised to high on the core fact."
---

## Reference answer (gospel)

- Yes — **Visa expanded its stablecoin-settlement platform to include the Stellar network**, announced **July 31, 2025** [1].
- The same expansion added **Avalanche** (alongside already-supported Ethereum/Solana), the **EURC** euro stablecoin, and — via a Paxos partnership — **USDG** and **PYUSD**; USDC was already supported [1].
- Related: **Wirex went live with dual-stablecoin (USDC/EURC) Visa settlement on Stellar (Nov 18, 2025)** for 7M+ users [2].
- Freshness caveat: settlement run-rate figures (e.g. ~$4.6B across all chains, per SDF) are recent — cite a dated source.
- Trap to avoid: claiming Visa settles on **Ripple/XRP** for this program, or denying Visa added Stellar [1].

- [1] usa.visa.com/about-visa/newsroom/press-releases.releaseId.21581.html
- [2] stellar.org/press/wirex-and-stellar-go-live-with-dual-stablecoin-visa-settlement...

## Why these cards (routing rationale)

Recent Visa partnership news → recency-aware `perplexity_search` / `parallel_search`; `scout_research`
acceptable for the SDF year-in-review.

## Edge / traps

Traps: putting Visa's settlement on Ripple; asserting a stale precise run-rate without a date.
