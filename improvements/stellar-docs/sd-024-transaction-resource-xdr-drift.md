---
id: sd-024
service: stellar-docs
status: reported-upstream
discovered: 2026-07-11
upstreamTitle: Update transaction resource fields and enforcement phases
evidence:
  - current transaction-resource documentation/indexed prose uses readBytes and refundableFee
  - Protocol 23/CAP-66 XDR exposes diskReadBytes and SorobanTransactionDataExt naming; the stale example also uses refundableFee
  - exact @stellar/stellar-base 15.0.0 repro reaches TransactionBuilder.build serialization with undefined diskReadBytes after correcting the independently broken ext union
  - Solo scratchpad 575 GT-47 blind process 3334
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2596
  - independent Docs-team audit 2026-07-14 executed the example, corrected the failure mechanism and P23 attribution, found the second ext-union break and a refundableFee residual, and treated the broader enforcement rewrite as optional: https://gist.githubusercontent.com/ElliotFriend/3b3641b929b4408a834b85bcb4e75449/raw/a90e6b453ee3505ef2525b4428eaa75752e3ae08/raven-audit-rebuttal.md
  - corrected runtime scope posted and read back 2026-07-15: https://github.com/stellar/stellar-docs/issues/2596#issuecomment-4981955606
---

## Finding

The transaction-resource documentation contains a runtime-broken JavaScript
example and retired XDR field names from before Protocol 23/CAP-66. Its
`ExtensionPoint` value is not a `SorobanTransactionDataExt` union and fails
first; after that is fixed, `readBytes` leaves `diskReadBytes` undefined and
fails at `TransactionBuilder.build()` serialization. Another page still uses
`refundableFee` as current XDR terminology.

## Recommendation

Fix both executable-example breaks (`SorobanTransactionDataExt` and
`diskReadBytes`) and replace the remaining `refundableFee` terminology. Treat a
broader enforcement-phase rewrite as optional unless a concrete wrong sentence
is identified.
