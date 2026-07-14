---
id: sd-025
service: stellar-docs
status: reported-upstream
discovered: 2026-07-11
evidence:
  - Horizon-to-RPC migration guidance describes unified classic-asset events as near-future
  - CAP-0067 is Final for Protocol 23
  - Mainnet and Testnet report Protocol 27
  - Solo scratchpad 575 GT-49 primary 3335 and blind 3341
  - 2026-07-14 follow-up on the prior events-doc issue for the still-stale migration wording: https://github.com/stellar/stellar-docs/issues/1585#issuecomment-4971409187
---

## Finding

The migration guide retains pre-CAP-67 future-tense language for classic
asset events even though Unified Asset Events shipped in Protocol 23 and the
live networks are now on Protocol 27. The same page is frequently used as the
authoritative endpoint-mapping source, so the stale warning propagates into
migration plans and golden answers.

## Recommendation

Replace the future-tense warning with current CAP-67 behavior and explicitly
separate unified event availability from Horizon resources that still lack a
direct RPC equivalent.
