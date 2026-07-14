---
id: sd-020
service: stellar-docs
status: verified
discovered: 2026-07-11
upstreamTitle: Update SAC executable identity and admin introspection terminology
evidence:
  - current SAC docs retain obsolete contract-ID/executable XDR terminology
  - current stellar-xdr uses ENVELOPE_TYPE_CONTRACT_ID with nested FROM_ASSET and CONTRACT_EXECUTABLE_STELLAR_ASSET
  - current JS Client.from detects SAC from SCContractInstance executable
  - live SAC simulation confirms public name identity and mutable C-address admin
  - live recheck 2026-07-14: stellar-transaction.mdx still shows CONTRACT_EXECUTABLE_TOKEN and CONTRACT_ID_FROM_ASSET while current stellar-xdr names CONTRACT_EXECUTABLE_STELLAR_ASSET and ENVELOPE_TYPE_CONTRACT_ID/FROM_ASSET
  - Solo scratchpad 575 GT-43 primary 3311 and blind 3320
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
