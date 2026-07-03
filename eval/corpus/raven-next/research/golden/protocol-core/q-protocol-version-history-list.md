---
id: q-protocol-version-history-list
q: "Walk me through Stellar's protocol upgrade history from Protocol 19 through the latest version, with the headline feature of each."
category: protocol-core
subcategory: protocol-version-history
axes: [tool-targeted, ecosystem-spectrum, edge-governance]
query_type: list
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Protocol 19 (2022) introduced generalized transaction preconditions / timelocks (CAP-0021).", weight: 3 }
  - { claim: "Protocol 20 introduced Soroban smart contracts (CAP-0046 series), live on Mainnet 2024-02-20.", weight: 4 }
  - { claim: "Protocol 21 added secp256r1/passkey verification (CAP-0051) and TTL extension.", weight: 3 }
  - { claim: "Protocol 22 added BLS12-381 host functions (CAP-0059) and contract constructors (CAP-0058).", weight: 3 }
  - { claim: "Protocol 23 ('Whisk') added parallel smart-contract execution (CAP-0063) and live/archival state separation (CAP-0062).", weight: 4 }
  - { claim: "Identifies the latest activated version as Protocol 26 ('Yardstick', Soroban cost-model tuning) as of the 2026-06-29 snapshot, with Protocol 27 (CAP-0071) queued.", weight: 4 }
should_have:
  - { claim: "Notes Protocol 24 was a stability/corrective upgrade fixing Whisk's state-archival bug.", weight: 2 }
  - { claim: "Notes Protocol 25 ('X-Ray') added BN254 and Poseidon/Poseidon2 host functions (ZK groundwork).", weight: 2 }
  - { claim: "Flags the tail end (latest version / queued version) as freshness-sensitive against a live source.", weight: 2 }
nice_to_have:
  - { claim: "Mentions the alphabetic codename cadence (Whisk, X-Ray, Yardstick).", weight: 1 }
must_avoid:
  - { claim: "Do NOT mis-pair a feature with the wrong protocol (e.g. BLS12-381 at P20, parallel execution at P21, Soroban at P22).", weight: 5 }
  - { claim: "Do NOT invent protocol versions or CAP numbers not in the history.", weight: 4 }
  - { claim: "Do NOT present the latest version as fixed truth without a freshness caveat.", weight: 3 }
must_cite:
  - "The stellar.org/protocol-upgrades page and/or stellar.expert protocol-history, plus per-version upgrade guides."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.expert/explorer/public/protocol-history
  - https://stellar.org/blog/developers/introducing-whisk-stellar-protocol-23
  - https://stellar.org/blog/foundation-news/yardstick-stellar-protocol-26
  - https://github.com/stellar/stellar-protocol/tree/master/core
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness item #3 + the big list. Feature->version mapping is the high-value gate; tail is freshness-sensitive (confidence medium). Dates RE-VERIFIED 2026-06-29 against primary (SDF upgrade guides + developers.stellar.org Software Versions): P20 2024-02-20, P21 2024-06-18, P22 2024-12-05, P23 Whisk 2025-09-03, P24 2025-10-22, P25 X-Ray 2026-01-22, P26 Yardstick 2026-05-06. P27 'Zipper' (CAP-0071) queued: Testnet 2026-06-18, Mainnet vote 2026-07-08 (still future). Tail must stay freshness-gated."
---

## Reference answer (gospel)

Stellar protocol history from P19 to the 2026-06-29 snapshot (headline feature → CAP → Mainnet date):

- **Protocol 19** (2022-06-08) — generalized transaction preconditions / timebounds & extra signers
  (**CAP-0021**); also signed-payload signer (CAP-0040) [4].
- **Protocol 20 "Soroban"** (2024-02-20) — Wasm smart contracts, via the **CAP-0046 series**
  (CAP-0046-01…-12) [1][4].
- **Protocol 21** (2024-06-18) — **secp256r1** verification for passkeys (**CAP-0051**) + extend-TTL
  (CAP-0053) [4].
- **Protocol 22** (2024-12-05) — **BLS12-381** host functions (**CAP-0059**) + contract constructors
  (CAP-0058) [4].
- **Protocol 23 "Whisk"** (2025-09-03) — parallel smart-contract execution (**CAP-0063**) + live/archival
  state separation (**CAP-0062**); unified Classic+Soroban events (CAP-0067) [2][4].
- **Protocol 24** (2025-10-22) — corrective/stability upgrade fixing Whisk's state-archival
  inconsistency [1].
- **Protocol 25 "X-Ray"** (2026-01-22) — **BN254** (CAP-0074) and **Poseidon/Poseidon2** (CAP-0075)
  host functions — ZK groundwork [4].
- **Protocol 26 "Yardstick"** (2026-05-06) — latest activated; protocol config settings, checked i256
  arithmetic, v2 TTL host functions, additional BN254 host functions, SAC + strkey host functions [3].
- **Protocol 27** (CAP-0071) — queued; v27.0.0 released, on Testnet 2026-06-18, Mainnet vote pending.

**Freshness:** the latest/queued versions move at each upgrade vote — confirm the tail against a live
source [1]. Codename cadence is alphabetic (Whisk → X-Ray → Yardstick).

Sources: [1] stellar.expert protocol-history / stellar.org protocol-upgrades; [2] stellar.org "Introducing
Whisk"; [3] stellar.org "Yardstick, Stellar Protocol 26"; [4] stellar/stellar-protocol `core/` CAPs.

## Why these cards (routing rationale)

Multi-version history list → `stellar_docs_mcp` + `scout_research`; general-web acceptable for the latest
dated confirmation. Deep-research is over-escalation.

## Edge / traps

The dominant trap is feature↔version mis-pairing (Soroban=P20, BLS=P22/CAP-0059, parallel=P23/CAP-0063,
ZK host fns=P25). The tail (latest/queued version) must be flagged freshness-sensitive.
