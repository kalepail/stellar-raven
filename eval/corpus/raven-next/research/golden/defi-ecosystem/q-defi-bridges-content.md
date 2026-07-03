---
id: q-defi-bridges-content
q: "What cross-chain bridging options exist for moving assets in and out of Stellar?"
category: defi-ecosystem
subcategory: bridge
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_search_content_semantic]
acceptable_cards: [scout_projects, lumenloop_find_similar_projects_semantic, scout_research, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Surfaces real Stellar bridging options, centered on Allbridge (the multi-chain workhorse bridge for Stellar).", weight: 5 }
should_have:
  - { claim: "Mentions related cross-chain mechanisms (e.g. Axelar / General Message Passing (GMP), Starbridge research, or an intent-based cross-chain payments network like Rozo) where relevant.", weight: 3 }
nice_to_have:
  - { claim: "Lists chains Stellar bridges connect to (e.g. Ethereum, Solana, Polygon, and via Allbridge Core also Base, Arbitrum, OP Mainnet).", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate a bridge protocol or partnership not present in the corpus.", weight: 5 }
must_cite:
  - "Each named bridge/mechanism carries a source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/allbridge-launch-connects-stellar-network-to-ethereum-solana-and-polygon
  - https://developers.stellar.org/docs/tools/infra-tools/cross-chain
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "GROUNDED: Allbridge confirmed as the multi-chain workhorse bridge for Stellar (dossier primary source: stellar.org Allbridge launch press, July 2023). General Message Passing (GMP) documented on developers.stellar.org cross-chain page; Starbridge was an SDF research project (trust-minimized Stellar-Ethereum). Topic-coverage → lumenloop_search_content_semantic. Don't fabricate bridges. REVIEWED 2026-06-29: re-confirmed Allbridge live on Scout (Allbridge Core, native USDC/stablecoin cross-chain to Ethereum/Solana/Polygon/Base/Arbitrum/OP). Both sources: URLs 200. Verified AXELAR is real on Stellar (OtterSec audit of axelarnetwork/axelar-amplifier-stellar) — folded in as the concrete GMP provider, replacing the unverified Celo/XRPL-specific chain claim with the live-confirmed Allbridge Core chain set. Corrected Rozo: it is its own intent-based cross-chain stablecoin payments network (rozo.ai), NOT a layer 'inside Soroswap' — softened to avoid that misattribution."
---

## Reference answer (gospel)

Cross-chain options for moving assets in/out of Stellar [1][2]:
- **Allbridge** — the multi-chain workhorse bridge; via **Allbridge Core**, Stellar joined for native
  USDC/stablecoin cross-chain swaps (no token wrapping) to chains like **Ethereum, Solana, Polygon,
  Base, Arbitrum, OP Mainnet** [1].
- **General Message Passing (GMP)** — documented on Stellar's cross-chain infra page as the protocol
  for smart contracts on different chains to communicate [2]; **Axelar** provides a GMP implementation
  on Stellar (Axelar Amplifier for Soroban).
- **Starbridge** — an SDF research project for a **trust-minimized Stellar-Ethereum** bridge.
- Also relevant: **Rozo** — an intent-based cross-chain stablecoin payments network (Rozo Intent Pay
  lets a payer pay from any chain/token while the merchant settles on Stellar).

Source: [1] stellar.org Allbridge launch press; [2] developers.stellar.org cross-chain.

## Why these cards (routing rationale)

"What bridging options exist" topic coverage → `lumenloop_search_content_semantic`; directory/similar
acceptable.

## Edge / traps

Don't fabricate a bridge or partnership not in the corpus.
