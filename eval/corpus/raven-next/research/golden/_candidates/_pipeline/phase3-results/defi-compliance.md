# Phase 3 adversarial results: DeFi / compliance / tokenomics / SCF

Reviewed by Solo process `gp3-skeptic-defi-compliance` on 2026-06-29.

## Files reviewed

- `research/golden/defi-ecosystem/q-defi-arbitrage-pathpayment-bots.md`
- `research/golden/defi-ecosystem/q-defi-market-making-kelp.md`
- `research/golden/defi-ecosystem/q-defi-sdex-offer-lifecycle.md`
- `research/golden/defi-ecosystem/q-defi-provide-liquidity-impermanent-loss.md`
- `research/golden/defi-ecosystem/q-defi-named-newer-protocols.md`
- `research/golden/defi-ecosystem/q-defi-flash-loans.md`
- `research/golden/defi-ecosystem/q-defi-oracles-chainlink-band.md`
- `research/golden/defi-ecosystem/q-defi-chainlink-ccip-vs-cctp.md`
- `research/golden/defi-ecosystem/q-defi-bridge-evm-to-stellar-axelar.md`
- `research/golden/defi-ecosystem/q-defi-build-staking-for-own-token.md`
- `research/golden/defi-ecosystem/q-defi-nft-standards-projects.md`
- `research/golden/compliance-rwa-payments/q-crp-anchors-by-corridor.md`
- `research/golden/compliance-rwa-payments/q-crp-become-an-anchor-licensing.md`
- `research/golden/compliance-rwa-payments/q-crp-regional-offramp-mobilemoney.md`
- `research/golden/compliance-rwa-payments/q-crp-ecommerce-payment-processor.md`
- `research/golden/compliance-rwa-payments/q-crp-remittance-founder-advisory.md`
- `research/golden/compliance-rwa-payments/q-crp-tokenize-personal-rwa.md`
- `research/golden/compliance-rwa-payments/q-crp-export-tx-history-taxes.md`
- `research/golden/compliance-rwa-payments/q-crp-sdp-operation.md`
- `research/golden/compliance-rwa-payments/q-crp-oz-rwa-erc3643-trex.md`
- `research/golden/compliance-rwa-payments/q-crp-custodial-vs-noncustodial-wallets.md`
- `research/golden/history-org-tokenomics/q-hot-sdf-xlm-holdings-sales.md`
- `research/golden/history-org-tokenomics/q-hot-sdf-transparency-wallets-reports.md`
- `research/golden/history-org-tokenomics/q-hot-fee-pool-burn-deflation.md`
- `research/golden/history-org-tokenomics/q-hot-roadmap-2026.md`
- `research/golden/scf-grants-builders/q-scf-submission-lifecycle-deadlines.md`
- `research/golden/scf-grants-builders/q-scf-nontechnical-participation.md`
- `research/golden/scf-grants-builders/q-scf-ecosystem-listing-partner-jobs.md`

All files in this slice now have `status: reviewed` and `authored.reviewed: 2026-06-29`.

## Defects fixed

- Replaced dead source URL in `q-hot-fee-pool-burn-deflation.md`: `https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/lumens` returned 404, so it was replaced with the live official asset/lumen reference `https://developers.stellar.org/docs/tokens/anatomy-of-an-asset`.

## Sources and checks used

- Bulk citation integrity sweep over all unique `sources` URLs in the owned slice with `curl -L --max-time 15`.
- Scout project/research APIs:
  - `https://stellarlight.xyz/api/projects/search?q=OrbitCDP&limit=5`
  - `https://stellarlight.xyz/api/projects/search?q=Zenex&limit=5`
  - `https://stellarlight.xyz/api/research?q=FxDAO%20Stellar%20Soroban&limit=5`
  - `https://stellarlight.xyz/api/research?q=JST%20Stellar%20market%20maker&limit=5`
  - `https://stellarlight.xyz/api/projects/search?q=Reflector&limit=5`
- GitHub CLI: `gh repo view stellar-deprecated/kelp --json nameWithOwner,isArchived,pushedAt,latestRelease,description,url`.
- Live web spot checks for Chainlink CCIP Directory, Circle CCTP/Stellar material, SCF awards/current round, and SEP-0057 status.
- Local rubric/card review against `research/golden/_meta/CARDS.md` and the Phase 3 ban policy.

## Residual risks / unvalidated items

- Fresh provider, corridor, APY/TVL, wallet, SCF round, and roadmap details remain time-sensitive. The reviewed rubrics correctly require dated current sources rather than fixed numeric claims.
- `https://www.cointracker.io/integrations/stellar` returned 403 to curl during the bulk sweep; the file already records this and does not rely on curl-only availability.
- SDP recipient account-type support remains intentionally conservative: the rubric forbids claims about C-address, muxed, sponsored, or arbitrary custodial destinations unless current SDP docs/source explicitly support them.
- Chainlink Data Feeds/CCIP availability and CCTP supported domains should be re-checked at answer time. The reviewed rubrics require provider-primary dated evidence and avoid asserting unsupported Chainlink-on-Stellar status.
- Emerging protocol/entity rows such as FxDAO, OrbitCDP, Zenex, Slender, XycLoans, and NFT projects should be treated as current-directory evidence, not production-safety endorsements.
