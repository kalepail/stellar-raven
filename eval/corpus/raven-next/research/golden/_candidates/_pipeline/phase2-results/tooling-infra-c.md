# Phase 2 results: tooling-infra-c

Worker: `gp-p2-tooling-c`  
Date: 2026-06-29

## Files answered

- `research/golden/tooling-infra/q-ti-multisig-recover-lobstr-vault.md`
- `research/golden/tooling-infra/q-ti-openzeppelin-relayer.md`
- `research/golden/tooling-infra/q-ti-parse-raw-ledger-data.md`
- `research/golden/tooling-infra/q-ti-provision-wallet-per-user.md`
- `research/golden/tooling-infra/q-ti-rpc-gettransactions-pagination-xdr.md`
- `research/golden/tooling-infra/q-ti-run-tune-own-horizon.md`
- `research/golden/tooling-infra/q-ti-scaffold-stellar.md`
- `research/golden/tooling-infra/q-ti-sdk-package-rename.md`
- `research/golden/tooling-infra/q-ti-secret-key-custody-backend.md`

All nine assigned files were moved from `draft` to `answered`, with `authored.phase2: 2026-06-29`, finalized rubrics, verified source URLs, and filled reference-answer / routing / traps sections.

## Confidence distribution

- High: 7
- Medium: 2
- Low: 0

Medium-confidence files:

- `q-ti-openzeppelin-relayer`: Stellar/OpenZeppelin Relayer is freshness-sensitive; exact managed-service availability and funding/top-up workflow should be rechecked against current OpenZeppelin stable docs in Phase 3.
- `q-ti-run-tune-own-horizon`: Horizon admin-guide guidance is verified, but the specific "v24 removed non-history data" phrasing was not verified from a dated primary release note in this pass.

## Sources/classes used

- Stellar Docs MCP / developers.stellar.org:
  - Set Options, signer weights, account fields, SEP-30 recovery.
  - OpenZeppelin Relayer / Stellar Channels Service.
  - Ingest SDK, ledger backends, RPC data lake integration, Horizon-to-RPC migration.
  - RPC and Horizon pagination.
  - Horizon admin guide: prerequisites, ingestion, ingestion filtering, monitoring.
  - Scaffold Stellar docs and CLI plugin list.
  - Account creation, custody models, Change Trust, Lab/Friendbot, muxed accounts.
- Stellar Light Scout:
  - OpenZeppelin project/repo discovery and Scaffold Stellar ecosystem metadata.
- GitHub / registries / empirical checks:
  - `github.com/OpenZeppelin/openzeppelin-relayer`
  - `github.com/stellar-scaffold/cli`
  - `gh api repos/stellar/go-stellar-sdk/releases/latest`
  - `npm view @stellar/stellar-sdk version dist-tags`
  - `npm view stellar-sdk version deprecated`
  - `go list -m -versions github.com/stellar/go-stellar-sdk`
  - Local `stellar --version`, `stellar scaffold --help`, and `stellar tx new set-options --help`.

## Unverified caveats for Phase 3

- Confirm OpenZeppelin Relayer production/managed-service status, Stellar stable-doc version, and the exact relayer funding/top-up UI/API with current OpenZeppelin primary docs.
- Find a dated primary Horizon v24 release note or source diff for the claim that v24 removed "non-history data"; if unavailable, keep the current caveat and avoid gating on that claim.
- If Phase 3 wants product-specific LOBSTR Vault recovery behavior, verify it from LOBSTR primary support/docs. The on-chain Stellar signer/threshold recovery mechanics are verified from primary Stellar docs.
- For `q-ti-rpc-gettransactions-pagination-xdr`, verify any exact current `getTransactions` limit against the current RPC method/provider docs before asserting a number; the prompt's 200 limit was corrected as Horizon-specific.
