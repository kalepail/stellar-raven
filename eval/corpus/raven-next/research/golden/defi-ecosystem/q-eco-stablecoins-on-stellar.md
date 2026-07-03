---
id: q-eco-stablecoins-on-stellar
q: "Which stablecoins are issued or live on Stellar?"
category: defi-ecosystem
subcategory: stablecoins
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [lumenloop_search_content_semantic]
acceptable_cards: [scout_research, scout_projects, perplexity_search]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Names real Stellar stablecoins: Circle's USDC and EURC, and PayPal's PYUSD (launched on Stellar in Sep 2025).", weight: 5 }
should_have:
  - { claim: "Characterizes the stablecoin set as issuer-led dollars (USDC/EURC/PYUSD), with regional anchors (e.g. ClickPesa's TZS) and BENJI as a quasi-stable RWA.", weight: 3 }
nice_to_have:
  - { claim: "Notes algorithmic stablecoins are absent on Stellar.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim a major algorithmic stablecoin is live on Stellar, or invent a stablecoin/issuer not in the source data.", weight: 5 }
  - { claim: "Do NOT misattribute issuers (USDC/EURC=Circle, PYUSD=PayPal).", weight: 3 }
must_cite:
  - "A dated source for each named stablecoin."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/press/paypal-pyusd-is-now-available-on-stellar
  - https://www.circle.com/multi-chain-usdc/stellar
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "VERIFIED issuers against dossier primary sources: Circle USDC + EURC; PayPal PYUSD (launched on Stellar Sep 18 2025); regional anchors like ClickPesa TZS; BENJI as quasi-stable RWA share. Algorithmic stablecoins are absent on Stellar. Freshness:quarterly — new issuers can appear, so flag the list is time-bounded. Stablecoin coverage → lumenloop_search_content_semantic."
---

## Reference answer (gospel)

The Stellar stablecoin set is **issuer-led fiat dollars**, not crypto-native/algorithmic [1][2]:
- **USDC** and **EURC** — by **Circle** (native multi-chain USDC/EURC on Stellar) [2].
- **PYUSD** — **PayPal USD**, launched on Stellar **September 18, 2025** [1].
- **Regional anchors** — e.g. **TZS** (Tanzanian shilling) by **ClickPesa**.
- **BENJI** — a quasi-stable RWA (Franklin Templeton money-market share), adjacent to stablecoins.

**No major algorithmic stablecoin is live on Stellar** — the stablecoin story is fiat-backed,
institution-issued dollars. (Freshness: new issuers can appear; treat this list as time-bounded.)

Sources: [1] stellar.org PYUSD launch; [2] circle.com USDC on Stellar.

## Why these cards (routing rationale)

Stablecoin coverage → `lumenloop_search_content_semantic`; research/directory acceptable.

## Edge / traps

Correct issuer attribution (USDC/EURC=Circle, PYUSD=PayPal); don't claim an algorithmic stable is live
or invent an issuer.
