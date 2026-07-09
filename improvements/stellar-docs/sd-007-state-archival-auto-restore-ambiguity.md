---
id: sd-007
service: stellar-docs
status: reported-upstream
discovered: 2026-07-07
evidence:
  - developers.stellar.org state-archival page fetched 2026-07-07
  - developers.stellar.org choosing-the-right-storage page fetched 2026-07-07
  - stellar/stellar-protocol core/cap-0066.md at 1b1c22e02fc0cec6fff1175c2d7d08ad83a828e1
  - stellar/stellar-core InvokeHostFunctionOpFrame.cpp and InvokeHostFunctionTests.cpp at d6f2546791774d0b2cd925b8a4026adf967a92a3
  - Solo project 49, todo 870 eval-review follow-up
  - upstream issue filed 2026-07-07: https://github.com/stellar/stellar-docs/issues/2568
recurrences:
  - date: 2026-07-08
    evidence: improvements probe re-hit; state-archival page still contains both "Contract Data Automatic Restoration" and the underqualified "will fail immediately" wording
  - date: 2026-07-09
    evidence: `npm run improvements:probes` re-hit; state-archival page still returns status 200 and contains both "Contract Data Automatic Restoration" and the underqualified "will fail immediately" wording
probe:
  type: http-text
  url: https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival
  expect:
    status: 200
    contains:
      - Contract Data Automatic Restoration
      - will fail immediately
---

## Finding

The state-archival docs now correctly describe Protocol 23 automatic
restoration, but adjacent sections/pages still contain pre-Protocol-23 or
underqualified wording that can lead readers to conclude that archived
Persistent/Instance entries always require a separate `RestoreFootprintOp`.

The clear current-truth section says archived `Persistent` or `Instance`
entries can be automatically restored before a host function runs when included
in the transaction restore list, and that a manually built transaction without
the needed restore list will fail. The same page later says a Soroban
transaction with an archived Persistent key in its footprint "will fail
immediately" before contract execution, without qualifying that this is only
true when the entry is not declared for auto-restore. The storage-choice page
also says Persistent entries can be restored using `RestoreFootprintOp` but
does not mention the Protocol 23 auto-restore path.

## Evidence

Docs (2026-07-07): state-archival "Contract Data Automatic Restoration" says
"Starting in Protocol 23 ... archived `Persistent` or `Instance` contract
entries can be automatically restored before a host function runs, but only if
they're included in the transaction's restore list."

Docs (same page): "A Soroban transaction that has a key to an archived
Persistent entry in the footprint will fail immediately during the apply stage
prior to contract execution." This is stale/ambiguous unless qualified as
"without the archived entry listed for auto-restore."

Docs (choosing-the-right-storage): "For persistent storage, when the TTL reaches
zero, the entry is moved to the archival storage. It can then be restored when
needed using the `RestoreFootprintOp` operation." This omits the P23
`InvokeHostFunctionOp` auto-restore path.

CAP/source: CAP-0066 says it introduces automatic restoration via
`InvokeHostFunctionOp`, where any archived key present in the footprint is
automatically restored, and specifies the archived entries vector. Current
stellar-core source and tests exercise both contract-instance and persistent
entry auto-restore through `InvokeHostFunctionOp`.

## Consequence

This produced an eval judge artifact in
`eval/qa/results/2026-07-07T19-58-35-variantA.json` for
`q-soroban-storage-types`: the candidate copied the current state-archival
snippet that Instance storage is auto-restored via Invoke, while the judge
treated RestoreFootprintOp as required.

## Recommendation

On the state-archival page, qualify the "will fail immediately" section with
"unless the archived entries are included in the transaction restore list /
`SorobanResourcesExtV0.archivedSorobanEntries` for Protocol 23+ auto-restore."
On the storage-choice page, update the Persistent-storage section to mention
that Protocol 23+ `InvokeHostFunctionOp` can auto-restore archived
Persistent/Instance entries when simulation/transaction construction includes
the restore list, while `RestoreFootprintOp` remains the manual/rare fallback.
