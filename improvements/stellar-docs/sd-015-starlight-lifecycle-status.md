---
id: sd-015
service: stellar-docs
status: fixed-upstream
discovered: 2026-07-10
upstreamTitle: Label Starlight as archived experimental prior art
evidence:
  - current Stellar glossary Starlight entry
  - archived stellar-deprecated/starlight repository and experimental README
  - 2021/2022 SDF Starlight experiment posts
  - Solo scratchpad 575 GT-29 primary 3276 and independent blind 3278
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2591
  - fixed upstream by https://github.com/stellar/stellar-docs/pull/2620 (merged 2026-07-16); issue https://github.com/stellar/stellar-docs/issues/2591 closed completed
  - live recheck 2026-07-27: the glossary Starlight entry reads "An experimental layer 2 payment channel protocol ... The project is no longer maintained, and its repository has been archived since April 2024"
---

## Finding

The current glossary describes Starlight in present tense as Stellar's Layer 2
protocol without surfacing that the SDF reference implementation is archived,
experimental, and documented for local/Testnet use. A concise definition is
not itself a production-deployment claim, but consumers predictably promote it
into one when no lifecycle qualifier or canonical archive link is adjacent.

## Recommendation

Add an explicit dated lifecycle note: Starlight is historical payment-channel
research/protocol work; the SDF reference implementation is archived and must
not be treated as maintained production Mainnet infrastructure. Link the
archived repository and CAP-0021/CAP-0040 as protocol primitives, and direct
readers to project-specific primary deployment evidence for any current
payment-channel, commit-chain, or rollup implementation.
