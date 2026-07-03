# Phase 3 results — tooling-infra + assets-anchors-seps

Date: 2026-06-29  
Owner slice: every `phase1-worklist.json` file with category `tooling-infra` or `assets-anchors-seps`.

## Files reviewed

Reviewed and stamped `status: reviewed`, `authored.reviewed: 2026-06-29`:

- `research/golden/tooling-infra/q-ti-cli-rust-windows-troubleshooting.md`
- `research/golden/tooling-infra/q-ti-friendbot-ratelimit-alternatives.md`
- `research/golden/tooling-infra/q-ti-testnet-usdc-faucet.md`
- `research/golden/tooling-infra/q-ti-rpc-gettransactions-pagination-xdr.md`
- `research/golden/tooling-infra/q-ti-xdr-decode-in-code.md`
- `research/golden/tooling-infra/q-ti-parse-raw-ledger-data.md`
- `research/golden/tooling-infra/q-ti-self-host-core-rpc-full-history.md`
- `research/golden/tooling-infra/q-ti-run-tune-own-horizon.md`
- `research/golden/tooling-infra/q-ti-self-host-retention-backfill.md`
- `research/golden/tooling-infra/q-ti-stellar-lab-usage-and-new-ui.md`
- `research/golden/tooling-infra/q-ti-compute-token-lp-market-data.md`
- `research/golden/tooling-infra/q-ti-historical-pointintime-balances.md`
- `research/golden/tooling-infra/q-ti-enumerate-holders-airdrop.md`
- `research/golden/tooling-infra/q-ti-fetch-all-balances-classic-sac.md`
- `research/golden/tooling-infra/q-ti-enumerate-all-contracts.md`
- `research/golden/tooling-infra/q-ti-historical-events-beyond-retention.md`
- `research/golden/tooling-infra/q-ti-video-tutorials.md`
- `research/golden/tooling-infra/q-ti-java-sdk-wallet-feebump.md`
- `research/golden/tooling-infra/q-ti-channel-accounts-throughput.md`
- `research/golden/tooling-infra/q-ti-tx-too-late-resubmit.md`
- `research/golden/tooling-infra/q-ti-classic-submission-errors.md`
- `research/golden/tooling-infra/q-ti-freighter-localhost-not-detected.md`
- `research/golden/tooling-infra/q-ti-connect-wallet-button-code.md`
- `research/golden/tooling-infra/q-ti-bindings-to-nextjs-integration.md`
- `research/golden/tooling-infra/q-ti-scaffold-stellar.md`
- `research/golden/tooling-infra/q-ti-secret-key-custody-backend.md`
- `research/golden/tooling-infra/q-ti-secret-key-vs-mnemonic-derivation.md`
- `research/golden/tooling-infra/q-ti-find-export-secret-key.md`
- `research/golden/tooling-infra/q-ti-custodial-account-generation-c-address.md`
- `research/golden/tooling-infra/q-ti-provision-wallet-per-user.md`
- `research/golden/tooling-infra/q-ti-multisig-recover-lobstr-vault.md`
- `research/golden/tooling-infra/q-ti-contract-verification-explorers.md`
- `research/golden/tooling-infra/q-ti-sdk-package-rename.md`
- `research/golden/tooling-infra/q-ti-launchtube-mercury.md`
- `research/golden/tooling-infra/q-ti-openzeppelin-relayer.md`
- `research/golden/tooling-infra/q-ti-testnet-mainnet-migration.md`
- `research/golden/tooling-infra/q-ti-block-explorer-basics.md`
- `research/golden/assets-anchors-seps/q-aas-publish-asset-metadata-toml.md`
- `research/golden/assets-anchors-seps/q-aas-claimable-balance-reclaim.md`
- `research/golden/assets-anchors-seps/q-aas-claim-received-claimable-balances.md`
- `research/golden/assets-anchors-seps/q-aas-claimable-predicates-expiry-reserves.md`
- `research/golden/assets-anchors-seps/q-aas-trustline-limit-lifecycle.md`
- `research/golden/assets-anchors-seps/q-aas-sep30-recoverable-wallets.md`
- `research/golden/assets-anchors-seps/q-aas-list-token-on-exchanges-aggregators.md`
- `research/golden/assets-anchors-seps/q-aas-issuer-fees-supply-cap-freeze.md`
- `research/golden/assets-anchors-seps/q-aas-burn-clawback-redemption-mechanics.md`
- `research/golden/assets-anchors-seps/q-aas-trusted-asset-list-whitelist.md`

## Defects fixed

- `q-ti-run-tune-own-horizon`: moved the unverified Horizon v24/non-history-data assertion from `must_have` to `should_have`. The file already lacked a primary release note, so it should not be a hard gate. Kept the `must_avoid` requiring a dated primary source before asserting exact v24 behavior.
- `q-ti-java-sdk-wallet-feebump`: corrected the version snapshot. Maven Central reports `network.lightsail:stellar-sdk` latest/release metadata as `4.0.0-beta0`, while GitHub's latest release tag is `3.1.0`; the rubric now requires source-specific dated wording instead of implying one universal latest.
- `q-ti-openzeppelin-relayer`: added the SDF x402 source and clarified that Phase 3 verified SDF docs for Testnet/Mainnet x402 facilitator availability, while exact managed-service funding UI/API remains a residual current-doc check.
- `q-ti-rpc-gettransactions-pagination-xdr`: resolved the stale Phase 3 note. Official docs verify Horizon's 1-200 pagination limit and RPC `getEvents` 1-10000/default 100; no universal `getTransactions` numeric limit was hard-gated.
- `q-ti-self-host-core-rpc-full-history`: resolved the stale Phase 3 note with the current Providers table: RPC Archive currently applies only to `getLedgers`, and exact provider checkmarks are freshness-sensitive.
- `q-ti-freighter-localhost-not-detected`: verified current `@stellar/freighter-api` package metadata and rewrote the note as a browser-policy residual rather than a Phase 3 TODO.
- Rewrote remaining stale Phase 3 TODO-style notes in `q-ti-friendbot-ratelimit-alternatives`, `q-ti-bindings-to-nextjs-integration`, `q-ti-video-tutorials`, and `q-aas-list-token-on-exchanges-aggregators` into final residual-risk language.

## Sources and empirical checks used

- Stellar Docs MCP / Algolia for Rust `wasm32v1-none`, OpenZeppelin Relayer/x402, and official docs discovery.
- Official Stellar docs URLs in the candidate frontmatter; all 135 unique frontmatter source URLs in the owned slice were checked with `curl -L --max-time 12` and returned 2xx/3xx.
- `npm view @stellar/stellar-sdk`, `npm view stellar-sdk`, `npm view @stellar/freighter-api`, and `npm view @creit.tech/stellar-wallets-kit`.
- `go list -m -versions github.com/stellar/go` and `github.com/stellar/go-stellar-sdk`.
- `gh repo view` / `gh api` for `stellar/go`, `stellar/go-stellar-sdk`, and `lightsail-network/java-stellar-sdk`, including the current `FeeBumpTransaction.java` API names.
- Maven Central metadata for `network.lightsail:stellar-sdk`.
- Scout API: `https://stellarlight.xyz/api/research?q=Mercury%20Launchtube%20Stellar&limit=5`.
- Official Stellar RPC Providers page, confirming the 2026-06-12 table and `getLedgers`-only archive note.

## Residual risks / unvalidated items

- No live Testnet transaction submission was run for multi-provider fanout, channel-account throughput, Java fee-bump construction, or claimable-balance claiming. The rubrics rely on primary docs and SDK/repo source for those mechanics.
- Browser-extension behavior for Freighter on localhost was not reproduced in Chrome; the candidate now treats secure-context behavior as release/browser dependent.
- Exact StellarExpert/StellarChain verified-badge rules and xBull/LOBSTR listing policies remain product-specific residuals; the candidate avoids hard-gating those beyond dated source citation.
- OpenZeppelin managed-service funding/top-up UI/API details remain freshness-sensitive and should be verified against current OpenZeppelin stable docs at answer time.
- Official video recommendations remain best-effort unless LumenLoop AV or the current official YouTube channel search is available in the answering lane.

## Validation

- Slice status check: `ok 47 reviewed files`.
- Source integrity check: `135` unique frontmatter URLs, `0` bad responses.
- `npm run test:golden -- --help` was not useful as a slice validator; it ran the repository migration check and failed because the broader uncompiled candidate corpus count does not match `compiled/golden.json`, which is outside this slice.
