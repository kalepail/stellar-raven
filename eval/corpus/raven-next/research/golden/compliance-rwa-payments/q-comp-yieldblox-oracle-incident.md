---
id: q-comp-yieldblox-oracle-incident
q: "What happened in the YieldBlox/Reflector oracle-manipulation incident, roughly how much was lost/recovered, and what are the design lessons?"
category: compliance-rwa-payments
subcategory: incidents
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_research]
acceptable_cards: [scout_projects, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "A Feb 2026 (around Feb 21–22) oracle-manipulation incident hit a YieldBlox/Blend (V2) pool via USTRY/Reflector pricing.", weight: 5 }
  - { claim: "The loss was roughly ~$10M (reports vary, ~$10.2M–$10.86M).", weight: 4 }
  - { claim: "A portion (~$7.2M–$7.5M / ~48M XLM) was frozen by Stellar Tier-1 validators.", weight: 3 }
  - { claim: "The lesson is defensive oracle consumption (sanity/staleness checks, liquidity-aware pricing) and thin-liquidity / manipulable-price risk.", weight: 4 }
should_have:
  - { claim: "Ties USTRY (an Etherfuse US-Treasury Stablebond) priced on illiquid SDEX into the Reflector VWAP oracle as the manipulation vector; attacker borrowed ~61M XLM + ~1M USDC.", weight: 3 }
  - { claim: "Frames it as a pool-operator/oracle-config failure, NOT a Blend V2 core-contract or Stellar-protocol flaw.", weight: 2 }
nice_to_have:
  - { claim: "Notes reports differ and figures should be reconciled across dated sources.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert one exact dollar figure as settled fact — give an approximate range and reconcile across sources.", weight: 5 }
  - { claim: "Do NOT invent incident details (cause, amounts, parties) not in the sources.", weight: 4 }
must_cite:
  - "A dated Scout / news source for the incident and the loss/recovery figures."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.halborn.com/blog/post/explained-the-yieldblox-hack-february-2026
  - https://blocksec.com/blog/yieldblox-dao-incident-on-stellar-oracle-misconfiguration-enabled-a-10m-drain
  - https://protos.com/yieldblox-lending-pool-hit-by-10m-hack-on-stellar/
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed; rubric correctly gates on the approximate-range/reconcile discipline, not one exact figure. Freshness:true; figures approximate. RECONCILED across dated sources (2026-02): loss ~$10.2M (range to ~$10.86M; some say $10.8M); ~48,069,094 XLM (~$7.2M–$7.5M) frozen by Tier-1 validators ~Feb 22; date Feb 21–22 (~00:25 UTC Feb 22). Vector: USTRY (Etherfuse US-Treasury Stablebond) pumped ~$1.06→~$106 on illiquid SDEX, poisoning Reflector's VWAP feed; attacker borrowed ~61.25M XLM + ~1M USDC. Pool-operator/oracle config failure, NOT a Blend V2 core or Stellar-protocol flaw; Script3 to compensate depositors. Don't gate on one exact $."
---

## Reference answer (gospel)

- Around **Feb 21–22, 2026** (~00:25 UTC Feb 22), an **oracle-manipulation** incident hit a **YieldBlox /
  Blend V2** lending pool [1][3].
- The attacker pushed **USTRY** (an **Etherfuse US-Treasury Stablebond**) from **~$1.06 to ~$106** on the
  **illiquid SDEX** order book, which **poisoned the Reflector VWAP oracle** the pool relied on; against
  the inflated collateral they **borrowed ~61.25M XLM + ~1M USDC** [1][2].
- **Loss ~$10M** — reports vary, **~$10.2M up to ~$10.86M** [1][2][3].
- **~48M XLM (~$7.2M–$7.5M) was frozen** by Stellar **Tier-1 validators**; Script3 (YieldBlox dev)
  said affected depositors would be compensated [1][3].
- This was a **pool-operator / oracle-config failure, not a Blend V2 core-contract or Stellar-protocol
  flaw** [2]. The lesson: **defensive oracle consumption** (sanity/staleness checks, liquidity-aware
  pricing) and **thin-liquidity manipulation risk**.

Present figures as **approximate** and **reconciled across dated sources** — do not assert one exact number.

Sources: [1] Halborn; [2] BlockSec; [3] Protos.

## Why these cards (routing rationale)

An ecosystem incident writeup → **`scout_research`** (with `scout_projects` / `parallel_search`
acceptable). Deep-research tier is governance-forbidden.

## Edge / traps

The trap is **asserting one exact dollar figure as settled fact** (the reports diverge) or
**inventing** incident details. Both are `must_avoid`; the answer should be range-with-reconciliation.
