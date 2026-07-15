---
id: sd-035
service: stellar-docs
status: reported-upstream
discovered: 2026-07-11
upstreamTitle: Replace legacy Wallets Kit v1 references in current tutorials
evidence:
  - re-verified 2026-07-14: docs/build/apps/example-application-tutorial/overview.mdx installs the legacy dotted npm package @creit.tech/stellar-wallets-kit (line 199) and lists it in Vite ssr.noExternal (line 254)
  - re-verified 2026-07-15: the former Spanish dapp-frontend translation no longer exists on main, so its stale Wallets Kit section is resolved by removal; the English Example Application tutorial still contains the legacy package scope
  - re-verified 2026-07-14: the English docs/build/apps/dapp-frontend.mdx has no @creit, allowAllModules, or StellarWalletsKit reference; the former tools/developer-tools/wallets page is link-out only and is not evidence for this finding
  - current maintainer sources: JSR lists @creit-tech/stellar-wallets-kit 2.5.0 as latest (published 2026-06-29), and the current kit README/init guide uses static StellarWalletsKit.init with defaultModules
  - independent Fable review in Solo scratchpad 639 re-ran the sources and identified the original tools/wallets claim as false while confirming these tutorial/translation residuals
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2609
  - narrowed residual posted and read back 2026-07-15: https://github.com/stellar/stellar-docs/issues/2609#issuecomment-4982273197
---

## Finding

One current Docs tutorial surface still teaches the legacy Wallets Kit v1 package.
The English Example Application tutorial installs
`@creit.tech/stellar-wallets-kit` and includes that legacy scope in its Vite SSR
configuration. The former Spanish `dapp-frontend` translation, which also used
the v1 constructor API, is no longer present on `main` and is not an active residual.

The current maintained package is the JSR v2 package
`@creit-tech/stellar-wallets-kit` (latest 2.5.0). Its current initialization
guidance uses static `StellarWalletsKit.init(...)` with `defaultModules()` or
explicitly selected modules. The English `dapp-frontend` source no longer has a
Wallets Kit example, so the Spanish page is also an untranslated obsolete
section rather than a current English counterpart.

## Evidence

Live source re-check on 2026-07-14:

- https://github.com/stellar/stellar-docs/blob/main/docs/build/apps/example-application-tutorial/overview.mdx#L195-L203
- https://github.com/stellar/stellar-docs/blob/main/docs/build/apps/example-application-tutorial/overview.mdx#L252-L257
- https://github.com/stellar/stellar-docs/blob/main/docs/build/apps/dapp-frontend.mdx
- https://jsr.io/@creit-tech/stellar-wallets-kit
- https://github.com/Creit-Tech/Stellar-Wallets-Kit/blob/main/README.md
- https://github.com/Creit-Tech/Stellar-Wallets-Kit/blob/main/docs/files/how-to/init.md

The Wallet Integration page at
https://developers.stellar.org/docs/tools/developer-tools/wallets was separately
checked. It only links to the maintained Kit site and contains no package or
API example; it is deliberately excluded from this finding.

## Recommendation

Update the Example Application tutorial's dependency and Vite configuration to
the current supported Wallets Kit path. A retained example should use the JSR v2
package and static initialization with `defaultModules()` or explicitly selected
modules; if the tutorial must remain a v1 historical example, label it clearly as
legacy and pin that version rather than presenting it as current integration guidance.
