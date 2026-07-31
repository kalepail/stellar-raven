---
id: sd-020
service: stellar-docs
status: fixed-upstream
discovered: 2026-07-11
upstreamTitle: Update SAC executable identity and admin introspection terminology
evidence:
  - current SAC docs retain obsolete contract-ID/executable XDR terminology
  - current stellar-xdr uses ENVELOPE_TYPE_CONTRACT_ID with nested FROM_ASSET and CONTRACT_EXECUTABLE_STELLAR_ASSET
  - current JS Client.from detects SAC from SCContractInstance executable
  - live SAC simulation confirms public name identity and mutable C-address admin
  - live recheck 2026-07-14: stellar-transaction.mdx still shows CONTRACT_EXECUTABLE_TOKEN and CONTRACT_ID_FROM_ASSET while current stellar-xdr names CONTRACT_EXECUTABLE_STELLAR_ASSET and ENVELOPE_TYPE_CONTRACT_ID/FROM_ASSET
  - Solo scratchpad 575 GT-43 primary 3311 and blind 3320
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2613
  - resolved by https://github.com/stellar/stellar-docs/pull/2655, merged to main 2026-07-30 at c933da4873e8f4c395956e7d638e9675aa9df02c; issue 2613 closed the same day
  - author-side live recheck 2026-07-31: stellar-transaction now shows CONTRACT_EXECUTABLE_STELLAR_ASSET (3), CONTRACT_ID_PREIMAGE_FROM_ASSET (2) and ENVELOPE_TYPE_CONTRACT_ID, with zero occurrences of CONTRACT_EXECUTABLE_TOKEN or CONTRACT_ID_FROM_ASSET; https://developers.stellar.org/docs/tokens/stellar-asset-contract now identifies a SAC from SCContractInstance.executable, gates name()/symbol() on that verification, states there is no generic SEP-41 asset()/issuer() accessor, calls the issuer the *initial* administrator with authority mutable via set_admin, and warns that a contract-address hash and current admin do not prove provenance
  - independent normative corroboration 2026-07-31: stellar-xdr@curr Stellar-contract.x enumerates CONTRACT_EXECUTABLE_STELLAR_ASSET = 1, so the docs now match the canonical XDR rather than merely having changed
  - independent adversarial reviewer (gpt-5.6-sol xhigh, Solo 4137, 2026-07-31) confirmed every recommendation item shipped, pinned at docs c933da48 and stellar-xdr 911c9356: solo://proj/49/scratchpad/sol-review-2026-07-3--746
  - RETIREMENT BLOCKED: dated live result + commit-pinned snapshot not yet posted on issue 2613; eval/qa/corpus/battery/soroban/q-sor-sac-introspection.json cites this file path as rootCause provenance
---

## Finding

SAC documentation and derived guidance retain design-era XDR names and omit the
current executable-based identification path. They also encourage issuer/admin
collapse even though the issuer is only initial administrator and `set_admin`
can move authority. The built-in public `name()` identity boundary is not
explained alongside the absence of a generic SEP-41 `asset()`/`issuer()` method.

## Evidence

The current `stellar-transaction.mdx` example still declares
`CONTRACT_EXECUTABLE_TOKEN` and describes `CONTRACT_ID_FROM_ASSET`. Current
`stellar-xdr` instead uses `CONTRACT_EXECUTABLE_STELLAR_ASSET` and nests
`FROM_ASSET` under `ENVELOPE_TYPE_CONTRACT_ID`. Current client code identifies a
SAC from its `SCContractInstance.executable`, while SAC admin authority remains
mutable after initial creation.

## Recommendation

Update the derivation/introspection guide to current XDR enums, show
`SCContractInstance.executable == STELLAR_ASSET`, document `name()`/`symbol()`
identity after SAC verification, distinguish initial issuer from mutable
administrator, and state the provenance limits of C-address hashes/admin values.
