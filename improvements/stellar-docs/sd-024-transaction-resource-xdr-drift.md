---
id: sd-024
service: stellar-docs
status: fixed-upstream
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
  - resolved by https://github.com/stellar/stellar-docs/pull/2655, merged to main 2026-07-30 at c933da4873e8f4c395956e7d638e9675aa9df02c; issue 2596 closed the same day
  - author-side live recheck 2026-07-31: the stellar-transaction SorobanTransactionData block now matches stellar-xdr@curr exactly (ext union first, then resources, then int64 resourceFee) and declares uint32 diskReadBytes with SorobanResourcesExtV0 present; refundableFee and bare readBytes are gone from every affected page; create-restoration-footprint-js now builds xdr.SorobanTransactionDataExt(0) with diskReadBytes and no ExtensionPoint; the fees page names txSOROBAN_INVALID for pre-execution rejection and describes apply-time reconciliation separately
  - independent adversarial reviewer (gpt-5.6-sol xhigh, Solo 4137, 2026-07-31) went further than a text check and executed the example against @stellar/stellar-base 15.0.0: the old ExtensionPoint form throws "union name undefined, not SorobanTransactionDataExt", the corrected ext with readBytes then throws "invalid u32 value", and the shipped field set builds a 176-byte XDR — so both original failures are reproduced and both are fixed: solo://proj/49/scratchpad/sol-review-2026-07-3--746
  - scope note: the optional "distinguish transaction-only limits from ledger-wide aggregates" half was NOT shipped and is not a blocker — this finding expressly made it optional absent a concrete wrong sentence, and none was ever cited
  - RETIREMENT BLOCKED: dated live result + commit-pinned snapshot not yet posted on issue 2596; eval/qa/corpus/battery/soroban/q-soroban-resource-limits.json cites this file path as rootCause provenance
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
