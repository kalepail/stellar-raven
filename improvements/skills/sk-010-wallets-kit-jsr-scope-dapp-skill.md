---
id: sk-010
service: skills
status: fixed-upstream
discovered: 2026-07-11
evidence:
  - stellar/stellar-dev-skill commit c2f3c0728c32044ed8b6d696767c3aed71b4e32d dapp SKILL.md installs and imports @creit.tech/stellar-wallets-kit
  - premise correction 2026-07-27: the dotted npm scope @creit.tech/stellar-wallets-kit is NOT v1-only; the npm registry serves dist-tag latest 2.5.0 (published 2026-06-29), so the defect was the v1 constructor/allowAllModules API and an unpinned install, not the package scope itself
  - the same dapp skill uses the legacy new StellarWalletsKit constructor and allowAllModules API
  - current Wallets Kit maintainer documentation prefers JSR @creit-tech/stellar-wallets-kit and static StellarWalletsKit.init with configured/default modules
  - local pinned mirror ecosystem-skills/skills/stellar-dev/dapp/SKILL.md reproduces the upstream source bytes; Solo scratchpad 575 GT-56 process 3398 records the owner split
  - upstream issue filed 2026-07-13: https://github.com/stellar/stellar-dev-skill/issues/56
  - upstream issue https://github.com/stellar/stellar-dev-skill/issues/56 closed completed 2026-07-21 with no closure rationale comment; verified by live source read rather than closure alone
  - live recheck 2026-07-27: skills/dapp/SKILL.md on stellar/stellar-dev-skill main installs via "npx jsr add @creit-tech/stellar-wallets-kit", uses static StellarWalletsKit.init({ modules: defaultModules() }) and authModal(), and carries a dated "Migrating from v1?" note; the local ecosystem-skills mirror is still pinned to the pre-fix commit and is tracked as repo-side mirror drift, not as this finding
---

## Finding

The official `stellar/stellar-dev-skill` dapp skill embedded a stale Stellar
Wallets Kit integration. At pinned upstream commit
`c2f3c0728c32044ed8b6d696767c3aed71b4e32d`, its multi-wallet example used the
v1 API — `new StellarWalletsKit(...)` with `allowAllModules()` — against an
unpinned `@creit.tech/stellar-wallets-kit` install.

An earlier version of this record described that npm scope as "legacy" and
v1-only. That was wrong, and the docs maintainer corrected it on
stellar/stellar-docs#2609: the dotted npm scope still publishes v2 (registry
dist-tag `latest` is 2.5.0, published 2026-06-29). The real defect was the
combination of v1-era example code and an unpinned install that resolves to v2.
The kit maintainer's current guidance does prefer the JSR scope
`@creit-tech/stellar-wallets-kit` and static `StellarWalletsKit.init(...)`, and
notes npm updates will eventually stop, but npm parity holds today.

## Evidence

The repo's pinned mirror reproduces the upstream `stellar-dev-skill` source and
records the exact source commit in `ecosystem-skills/MANIFEST.json`. The stale
commands occur in `ecosystem-skills/skills/stellar-dev/dapp/SKILL.md` under
Recommended Dependencies and Stellar Wallets Kit (Multi-Wallet). Current owner
evidence is:

- https://github.com/stellar/stellar-dev-skill/blob/c2f3c0728c32044ed8b6d696767c3aed71b4e32d/skills/dapp/SKILL.md
- https://stellarwalletskit.dev/installation.html
- https://github.com/Creit-Tech/Stellar-Wallets-Kit
- https://jsr.io/@creit-tech/stellar-wallets-kit

The docs-owned copy is tracked separately in `sd-035`; this finding targets only
the upstream skill repository. The local mirror must not be edited as a fix.

## Recommendation

Update the dapp skill to the current v2 static-init API, and prefer the JSR
distribution per the kit maintainer's guidance. Teach `defaultModules()` versus
explicitly configured optional modules and their prerequisites, and add a dated
migration note covering the v1 to v2 API change (not a scope change: the npm
scope still serves v2, but an unpinned install against v1 example code breaks). Add a source check or test that compiles the Wallets Kit snippet
against the documented current package so embedded dependency drift is caught
before the next skill release.
