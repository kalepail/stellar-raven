---
id: sd-030
service: stellar-docs
status: reported-upstream
discovered: 2026-07-11
upstreamTitle: Disclose recoverable browser storage for Lab saved keypairs
evidence:
  - Lab Saved Keypairs docs inspected 2026-07-11 restrict the feature to Testnet and Futurenet and say never Mainnet
  - current stellar/laboratory source stores saved keypairs in browser localStorage using reversible XOR/base64 obfuscation with a public constant; its source warns not to use this for sensitive data
  - current Laboratory tests persist the S-secret value in the saved object
  - current localStorageSavedKeypairs.get retains a backwards-compatible plain-JSON parse path, so pre-September-2025 saves remain literal plaintext until re-saved
  - Solo scratchpad 575 GT-54 primary process 3383 and pre-read-locked blind process 3386
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2605
  - independent Docs-team audit 2026-07-14 corrected the current storage mechanism while confirming the secret remains recoverable and legacy plaintext persists: https://gist.githubusercontent.com/ElliotFriend/3b3641b929b4408a834b85bcb4e75449/raw/a90e6b453ee3505ef2525b4428eaa75752e3ae08/raven-audit-rebuttal.md
  - corrected storage-boundary evidence posted and read back 2026-07-15: https://github.com/stellar/stellar-docs/issues/2605#issuecomment-4981955585
---

## Finding

Stellar Lab documentation does not make the Saved Keypairs storage and offline
boundary prominent enough for a secret-bearing browser tool. Current Laboratory
source stores saved keypair objects in browser `localStorage` behind reversible
XOR/base64 obfuscation using a public constant, not encryption. Its compatibility
reader also accepts old plain JSON, so pre-September-2025 saves can remain literal
plaintext until re-saved.
The Saved Keypairs page correctly restricts use to Testnet/Futurenet and says
never Mainnet, but it does not state the concrete storage property: the secret
is recoverable browser storage, not encrypted custody.

## Evidence

Both GT-54 verification lanes reviewed the current Lab docs and source. The
pre-read-locked blind lane independently confirmed the browser-storage boundary
before reading the primary report. The later Docs-team audit checked current
Laboratory source and corrected the mechanism to reversible obfuscation plus a
legacy plaintext-read path. No secret was generated, pasted, saved or transmitted
during verification.

This is a docs-content gap rather than a claim that local browser storage is a
remote service. It is also separate from wallet/hardware/external-signature
flows, which avoid placing a production seed in Lab.

## Recommendation

Add one warning beside the existing Saved Keypairs network restriction: an
`S...` secret is recoverable from browser `localStorage`; current obfuscation is
not encryption, and older saves may remain plaintext. Keep the existing
Testnet/Futurenet-only and never-Mainnet guidance.
