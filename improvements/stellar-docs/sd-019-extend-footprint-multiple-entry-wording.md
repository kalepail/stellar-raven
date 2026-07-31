---
id: sd-019
service: stellar-docs
status: fixed-upstream
discovered: 2026-07-11
upstreamTitle: Correct multi-entry ExtendFootprintTTLOp guidance
evidence:
  - extend-persistent-entry-js guide says different entries require separate transactions
  - current ExtendFootprintTTLOpFrame iterates every read-only footprint entry
  - one operation applies one extendTo offset across multiple footprint keys
  - Solo scratchpad 575 GT-42 blind process 3315
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2597
  - resolved by https://github.com/stellar/stellar-docs/pull/2655, merged to main 2026-07-30 at c933da4873e8f4c395956e7d638e9675aa9df02c; issue 2597 closed the same day
  - author-side live recheck 2026-07-31 of https://developers.stellar.org/docs/build/guides/archival/extend-persistent-entry-js — no sentence claiming different entries need separate transactions survives; the extendContractAndPersistentEntry example passes three keys (persistent entry, contract.getFootprint(), contract-code entry) to one setReadOnly([...]) under a single extendFootprintTtl, and the page states "That shared extendTo is the one real constraint"; TTL is redefined as ledgers remaining with liveUntilLedger named as the absolute cutoff, plus a diskReadBytes batching caveat
  - independent adversarial reviewer (gpt-5.6-sol xhigh, Solo 4137, 2026-07-31) re-derived the trigger from the finding rather than the reporter's greps and confirmed every recommendation sub-item shipped, pinned at docs commit c933da48 lines 211-276: solo://proj/49/scratchpad/sol-review-2026-07-3--746
  - RETIREMENT BLOCKED, not evidence-blocked: the dated live result and commit-pinned snapshot still have to be posted on issue 2597, and test/improvements-file-issue.test.ts references this exact path as its fixture
---

## Finding

The JavaScript persistent-entry extension guide says a single
`ExtendFootprintTTLOp` cannot extend multiple ledger entries together. Current
Core instead iterates all entries in the read-only footprint. The real
constraint is one Soroban operation per transaction and one shared `extendTo`
offset, not one ledger key per operation.

## Recommendation

Correct the guide and add an example with two read-only footprint keys extended
to the same relative offset. State that entries requiring different target
offsets need separate operations/transactions.
