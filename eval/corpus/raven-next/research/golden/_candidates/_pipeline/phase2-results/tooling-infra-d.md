# Phase 2 Results — tooling-infra-d

Date: 2026-06-29
Worker: gp-p2-tooling-d
Batch: `tooling-infra-d`

## Files Answered

- `research/golden/tooling-infra/q-ti-secret-key-vs-mnemonic-derivation.md` — high
- `research/golden/tooling-infra/q-ti-self-host-core-rpc-full-history.md` — medium
- `research/golden/tooling-infra/q-ti-self-host-retention-backfill.md` — high
- `research/golden/tooling-infra/q-ti-stellar-lab-usage-and-new-ui.md` — medium
- `research/golden/tooling-infra/q-ti-testnet-mainnet-migration.md` — high
- `research/golden/tooling-infra/q-ti-testnet-usdc-faucet.md` — medium
- `research/golden/tooling-infra/q-ti-tx-too-late-resubmit.md` — high
- `research/golden/tooling-infra/q-ti-video-tutorials.md` — medium
- `research/golden/tooling-infra/q-ti-xdr-decode-in-code.md` — high

## Confidence Distribution

- High: 5
- Medium: 4
- Low: 0

## Sources / Classes Used

- Stellar Docs MCP / developers.stellar.org primary docs:
  - Stellar Lab, Saved Keypairs, Quickstart + Lab, CLI, RPC, RPC data lake, RPC providers, Horizon ingestion, Horizon filtering, result codes, XDR format, x402 quickstart, asset issuance, SDP, SEP-1/network configuration.
- Stellar protocol / GitHub:
  - `stellar/stellar-protocol` SEP-0005 and SEP-0052 via `gh api`.
  - `stellar/js-stellar-sdk` and `stellar/stellar-rpc` repository URLs via `gh api`.
- Empirical/local checks:
  - `stellar --version`
  - `stellar keys generate --help`
  - `stellar contract id asset --help`
- Scout / Stellar Light:
  - `stellarlight.xyz/api/research` for official docs/video/testnet-USDC routing.
  - `stellarlight.xyz/api/repos/search` for XDR/parser ecosystem references.
- Web/current source awareness:
  - Official YouTube/developer-meeting URLs used for video routing; exact AV recommendations intentionally left medium-confidence without LumenLoop AV passage output.

## Unverified Caveats for Phase 3

- `q-ti-self-host-core-rpc-full-history`: re-open the live RPC Providers table and confirm exact RPC Archive checkmarks before asserting a provider list. The answered file avoids freezing provider names as must-have claims.
- `q-ti-stellar-lab-usage-and-new-ui`: UI placement can drift; Phase 3 should browser-check Lab if exact button placement matters. The answer gates durable workflow rather than pixel/button positions.
- `q-ti-testnet-usdc-faucet`: Circle faucet availability and current Stellar Testnet USDC issuer should be rechecked live if Phase 3 wants a hard issuer-address gate.
- `q-ti-video-tutorials`: Scout returned official docs/developer-meeting material but not an AV-ranked playlist. Phase 3 should use LumenLoop AV passage tooling for exact official video/timestamp recommendations if available.
- `q-ti-secret-key-vs-mnemonic-derivation`: local CLI was `stellar 25.2.0`; Phase 3 may compare current published CLI help if the repo expects CLI 27 wording.

## Verification

- Local assigned-file completeness check passed: all 9 files have `status: answered`, `authored.phase2: 2026-06-29`, non-empty HTTP sources, and filled Reference/Why/Edge sections.
- No files outside the assigned batch and this result report were intentionally edited.
