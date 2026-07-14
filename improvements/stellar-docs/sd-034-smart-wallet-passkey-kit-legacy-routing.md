---
id: sd-034
service: stellar-docs
status: reported-upstream
discovered: 2026-07-11
evidence:
  - current developers.stellar.org smart-wallet guide routes builders to Passkey Kit
  - current kalepail/passkey-kit README calls the package a legacy precursor, directs new projects to smart-account-kit, labels the code unaudited demo material, and warns against securing real value
  - current kalepail/smart-account-kit and OpenZeppelin Stellar account documentation establish the successor SDK and underlying account-contract path
  - Solo scratchpad 575 GT-56 sealed blind process 3398, independently reconciled with primary process 3394 only after its 12-row seal
  - 2026-07-14 combined review request on the green successor PR: https://github.com/stellar/stellar-docs/pull/2367#issuecomment-4971409358
---

## Finding

The current Stellar smart-wallet guide still routes a greenfield reader to
Passkey Kit without carrying the package owner's current safety and successor
notice. Passkey Kit's own repository now calls it the legacy precursor to Smart
Account Kit, labels its code unaudited demo material, and warns not to use it to
secure real value. Current Smart Account Kit and OpenZeppelin account sources
provide the maintained successor path.

This is related to, but not a duplicate of, `sd-027`. That finding concerns the
discontinued LaunchTube submitter, its replacement, and the separate indexing
role. This finding concerns which smart-account SDK/contracts the core guide
recommends and whether the legacy SDK's explicit safety warning reaches the
reader.

## Evidence

GT-56's external-only blind lane checked the current guide, both Kalepail
repositories, package metadata, and OpenZeppelin account documentation before
reading the existing golden or primary report. Its sealed result and the
independent primary audit agreed on the greenfield successor and audit-scope
boundary. The direct reproduction URLs are:

- https://developers.stellar.org/docs/build/guides/contract-accounts/smart-wallets
- https://github.com/kalepail/passkey-kit
- https://github.com/kalepail/smart-account-kit
- https://docs.openzeppelin.com/stellar-contracts/accounts/smart-account

## Recommendation

Update the smart-wallet guide to route new projects to Smart Account Kit plus
the relevant versioned OpenZeppelin Stellar account contracts. Mark Passkey Kit
as legacy and reproduce its unaudited-demo/no-real-value warning wherever the
old path remains for historical users. Add a dated migration note and a small
role table for SDK, signer/verifier/context/policy contracts, submitter/relayer,
and indexer. State audit scope per exact artifact/release rather than implying
the whole application stack inherits an OpenZeppelin audit.
