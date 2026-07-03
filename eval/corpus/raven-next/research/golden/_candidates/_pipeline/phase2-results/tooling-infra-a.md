# Phase 2 results - tooling-infra-a

Batch: `tooling-infra-a` from `research/golden/_candidates/_pipeline/phase2-batches.json`
Date: 2026-06-29

## Files answered

- `research/golden/tooling-infra/q-ti-bindings-to-nextjs-integration.md` - high
- `research/golden/tooling-infra/q-ti-block-explorer-basics.md` - high
- `research/golden/tooling-infra/q-ti-channel-accounts-throughput.md` - medium
- `research/golden/tooling-infra/q-ti-classic-submission-errors.md` - high
- `research/golden/tooling-infra/q-ti-cli-rust-windows-troubleshooting.md` - medium
- `research/golden/tooling-infra/q-ti-compute-token-lp-market-data.md` - high
- `research/golden/tooling-infra/q-ti-connect-wallet-button-code.md` - medium
- `research/golden/tooling-infra/q-ti-contract-verification-explorers.md` - medium
- `research/golden/tooling-infra/q-ti-custodial-account-generation-c-address.md` - high
- `research/golden/tooling-infra/q-ti-enumerate-all-contracts.md` - high

## Confidence distribution

- high: 6
- medium: 4
- low: 0

## Sources/classes used

- Official Stellar developer docs via Stellar Docs MCP: TypeScript bindings/frontend guide, Freighter signing, fees/resource metering, Horizon error handling/result codes, CLI setup, Lab, Horizon resources, liquidity pools, Hubble, Horizon-to-RPC migration, C-account/SAC transfer model, contract state/archive docs.
- Primary protocol specs/repos via `gh`: SEP-55 build verification, SEP-46 metadata, SEP-48 contract interface/spec, JS SDK/Freighter/Wallets Kit release metadata.
- Stellar Light Scout HTTP checks: explorer/project discovery and contract-verification corpus search.
- Direct URL verification with `curl`: developers.stellar.org pages, GitHub SEP URLs, StellarExpert, StellarChain.

## Unverified caveats for Phase 3

- `q-ti-channel-accounts-throughput`: multi-provider submission guidance is inferred from immutable signed-envelope/hash behavior and documented duplicate/pending semantics; run an empirical two-provider broadcast test if this becomes a hard acceptance target.
- `q-ti-cli-rust-windows-troubleshooting`: Windows/MSVC/WSL error strings were not reproduced locally; Phase 3 should verify exact current remediation commands on a Windows or WSL environment if needed.
- `q-ti-connect-wallet-button-code`: exact Wallets Kit modal customization APIs should be checked against current project docs/source because official Stellar docs only list Wallets Kit support at a high level.
- `q-ti-contract-verification-explorers`: exact StellarExpert/StellarChain badge semantics and xBull/LOBSTR listing rules are product-specific and were not fully verified from primary docs; keep the rubric focused on not overclaiming.
- `q-ti-enumerate-all-contracts`: the BigQuery SQL is intentionally schema-shaped, not runnable; Phase 3 should inspect the live Hubble schema before requiring exact column names.
