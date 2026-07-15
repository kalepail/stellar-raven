---
id: sd-018
service: stellar-docs
status: reported-upstream
discovered: 2026-07-11
upstreamTitle: Document the SAC and CAP-67 asset event schema
evidence:
  - token-interface page presents generic SEP-41 transfer/mint topic shapes
  - released/current rs-soroban-env appends sep0011_asset to direct SAC events; transfer has four topics, while mint/burn/clawback have three topics with the asset last
  - current host test_transfer_with_issuer passed and asserts the asset-appended shape
  - Solo scratchpad 575 GT-42 primary 3308 and blind 3315
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2593
  - independent Docs-team audit 2026-07-14 corrected the event shapes and history, identified muxed transfer/mint data maps, found existing transfer coverage, and traced stale generated comments to rs-soroban-sdk token.rs: https://gist.githubusercontent.com/ElliotFriend/3b3641b929b4408a834b85bcb4e75449/raw/a90e6b453ee3505ef2525b4428eaa75752e3ae08/raven-audit-rebuttal.md
  - corrected implementation scope posted and read back 2026-07-15: https://github.com/stellar/stellar-docs/issues/2593#issuecomment-4981955633
---

## Finding

The generic token-interface event documentation does not clearly distinguish
custom SEP-41 events from current SAC events. Direct SAC transfer has four
topics (`transfer`, from, to, asset); mint, burn, and clawback each have three,
with the SEP-11 asset string last. Muxed transfer/mint destinations also move
amount and muxed id into a data map.

The trailing asset topic predates CAP-67. CAP-67 removed the admin topic from
mint/clawback, added muxed payloads, and unified Classic events. Existing
payment guidance already documents SAC transfer's fourth topic, so the gap is
one consolidated, accurate schema—not total absence.

## Recommendation

Add an event-schema table distinguishing custom SEP-41 from current SAC/CAP-67
transfer, mint, burn, and clawback events, including topic counts and data
payloads. Explain that direct SAC and Classic
unified events share the SAC schema and require transaction/operation metadata
to distinguish their path. Cross-link existing payment/event-indexing guidance.
Correct the same stale mint/clawback comments in `rs-soroban-sdk` `token.rs` or
the Docs copies will drift again.
