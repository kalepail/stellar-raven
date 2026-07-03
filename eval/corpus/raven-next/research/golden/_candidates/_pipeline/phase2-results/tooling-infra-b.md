# Phase 2 Results — tooling-infra-b

Batch: `tooling-infra-b`  
Worker: Solo process `gp-p2-tooling-b` / `2854`  
Completed: 2026-06-29

## Files Answered

- `research/golden/tooling-infra/q-ti-enumerate-holders-airdrop.md` — high
- `research/golden/tooling-infra/q-ti-fetch-all-balances-classic-sac.md` — high
- `research/golden/tooling-infra/q-ti-find-export-secret-key.md` — high
- `research/golden/tooling-infra/q-ti-freighter-localhost-not-detected.md` — medium
- `research/golden/tooling-infra/q-ti-friendbot-ratelimit-alternatives.md` — high
- `research/golden/tooling-infra/q-ti-historical-events-beyond-retention.md` — medium
- `research/golden/tooling-infra/q-ti-historical-pointintime-balances.md` — high
- `research/golden/tooling-infra/q-ti-java-sdk-wallet-feebump.md` — medium
- `research/golden/tooling-infra/q-ti-launchtube-mercury.md` — high

## Confidence Distribution

- High: 6
- Medium: 3
- Low: 0

## Sources / Classes Used

- Stellar Docs MCP / developers.stellar.org: Horizon account/pagination/retention, Hubble BigQuery, RPC retention/data-lake, SAC/token interface, Friendbot/Quickstart, Freighter API, fee-bump transactions, passkey prerequisites.
- Stellar Light Scout: Mercury project resolution and LaunchTube/Mercury/passkey-kit research corpus check.
- GitHub: `lightsail-network/java-stellar-sdk` release/source inspection for current Java SDK artifact/version and `FeeBumpTransaction` API; `stellar/launchtube` as service repo pointer.
- Project dossier: `research/golden/_dossiers/tooling-infra.md` for domain framing and source routing.
- Relevant skills: `data`, `dapp`, `standards`, `soroban`.

## Unverified / Phase 3 Caveats

- `q-ti-freighter-localhost-not-detected`: exact localhost/secure-context behavior may vary by current Freighter extension/browser release. Phase 3 should reproduce or check current Freighter docs/issues if the rubric needs a precise cause beyond supported `@stellar/freighter-api` usage and browser-origin troubleshooting.
- `q-ti-historical-events-beyond-retention`: event topic/CAP-67 detail is intentionally conservative. Phase 3 should verify the current CAP/spec before making `topic[0]=name` a hard requirement.
- `q-ti-java-sdk-wallet-feebump`: freshness-sensitive. Verified via GitHub on 2026-06-29: latest release `3.1.0` published 2026-06-12, while source has `4.0.0-beta0`. Phase 3 should check Maven Central/Javadoc before final assembly.
- `q-ti-enumerate-holders-airdrop` and `q-ti-historical-pointintime-balances`: exact Hubble SQL/table names were not hard-coded because schemas can evolve; rubrics gate on source class and reconstruction method.
