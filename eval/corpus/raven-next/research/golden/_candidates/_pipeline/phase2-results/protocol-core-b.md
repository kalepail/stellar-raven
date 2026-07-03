# Phase 2 results — protocol-core-b

Date: 2026-06-29
Owner process: `gp-p2-protocol-b`
Batch: `protocol-core-b`

## Files answered

- `research/golden/protocol-core/q-pc-practical-fee-setting.md` — confidence: high
- `research/golden/protocol-core/q-pc-protocol-upgrade-timing.md` — confidence: medium
- `research/golden/protocol-core/q-pc-quantum-preparedness-dormant.md` — confidence: medium
- `research/golden/protocol-core/q-pc-scp-message-types-overlay.md` — confidence: high
- `research/golden/protocol-core/q-pc-sequence-numbers-ordering-replace.md` — confidence: high
- `research/golden/protocol-core/q-pc-sponsored-reserves.md` — confidence: high
- `research/golden/protocol-core/q-pc-surge-griefing-threat-model.md` — confidence: high
- `research/golden/protocol-core/q-pc-tx-finality-failure-semantics.md` — confidence: high

## Confidence distribution

- high: 6
- medium: 2
- low: 0

## Source classes used

- Stellar Docs MCP / developers.stellar.org: fees and metering, fee stats, fee-bump transactions, transaction lifecycle, operation/result codes, sponsored reserves, network upgrades, Software Versions, RPC `getTransaction`.
- Stellar protocol GitHub / XDR: `stellar/stellar-xdr` `Stellar-SCP.x` and `Stellar-overlay.x`; `stellar/stellar-protocol` CAP-0071.
- Stellar.org dated announcement/blog: Protocol 27 Zipper upgrade guide; Quantum Preparedness Plan.
- Stellar Light Scout: used as a freshness/discovery cross-check for the Quantum Preparedness Plan.
- General web/Parallel CLI: used only for source discovery around the fresh QPP item; final cited facts use primary sources.

## Phase 3 caveats

- Protocol 27 timing is freshness-sensitive. Re-check the July 8, 2026 Mainnet vote and Software Versions page if Phase 3 runs after that date.
- The Quantum Preparedness Plan is currently a dated SDF roadmap, not a final CAP with deterministic dormant-account eligibility criteria. Phase 3 should attack any dormant-account wording for over-specificity.
- SCP/XDR links currently point at GitHub `main`; Phase 3 may pin commit SHAs if immutable citation policy requires it.
- Surge-pricing threat model intentionally avoids exploit procedure detail. Phase 3 should verify whether a Soroban-specific resource-fee citation should be added for contract-heavy enterprise cases.
