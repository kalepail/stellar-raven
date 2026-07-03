# Phase 2 results - soroban-a

Date: 2026-06-29
Worker: gp-p2-soroban-a

## Files answered

- `research/golden/soroban/q-sor-bindings-from-wasm-no-address.md` - answered, confidence medium
- `research/golden/soroban/q-sor-build-target-wasm32v1.md` - answered, confidence high
- `research/golden/soroban/q-sor-classic-dex-from-contract.md` - answered, confidence high
- `research/golden/soroban/q-sor-confidential-tokens.md` - answered, confidence medium
- `research/golden/soroban/q-sor-contract-as-claimable-arbiter.md` - answered, confidence high
- `research/golden/soroban/q-sor-contract-trustlines-c-address.md` - answered, confidence high
- `research/golden/soroban/q-sor-decode-hosterror-codes.md` - answered, confidence medium
- `research/golden/soroban/q-sor-deploy-invoke-from-js-sdk.md` - answered, confidence medium
- `research/golden/soroban/q-sor-doc-timestamping-manage-data.md` - answered, confidence high

## Confidence distribution

- High: 5
- Medium: 4
- Low: 0

## Sources/classes used

- Stellar Docs MCP / developers.stellar.org official docs: smart-contract overview, Rust dialect/setup, Hello World build/bindings, fully typed contracts, SDK invoke/signing flows, Soroban transaction XDR, SAC, C-account transfers, authorization, debugging errors, testing, Manage Data, account subentries, memos.
- Local empirical CLI checks: `stellar 25.2.0`, `stellar contract build --help`, `stellar contract bindings typescript --help`, `stellar contract deploy --help`, `stellar contract invoke --help`, `stellar tx simulate --help`, `stellar contract asset --help`.
- Project dossier: `research/golden/_dossiers/soroban.md`.
- Mirrored ecosystem skills: `ecosystem-skills/skills/stellar-dev/soroban/SKILL.md`, `ecosystem-skills/skills/stellar-dev/dapp/SKILL.md`, `ecosystem-skills/skills/stellar-dev/zk-proofs/SKILL.md`, `ecosystem-skills/skills/stellar-light/stellar-scout/*`, and OpenZeppelin Stellar setup/develop/upgrade skills.
- Scout live checks: `/api/status`, `/api/research?q=Soroban+Stellar+Asset+Contract+trustline+contract+address`, `/api/research?q=Soroban+confidential+tokens+zero+knowledge+BN254+Poseidon`.
- Protocol/CAP primary sources where needed: CAP-0059 and CAP-0074.

## Unverified caveats for Phase 3

- `q-sor-bindings-from-wasm-no-address`: raw JS SDK deployment helper names and constructor-arg call shapes should be checked against the current `@stellar/stellar-sdk` package types if Phase 3 wants to freeze exact `createCustomContract` syntax. CLI bindings/deploy behavior was verified locally.
- `q-sor-confidential-tokens`: privacy/ZK status is intentionally medium-confidence. Verify current mainnet protocol/software and SDK support for BN254/Poseidon/CAP-0075 before strengthening claims beyond "primitives/status-sensitive, confidential-token implementation in progress."
- `q-sor-decode-hosterror-codes`: common test fixes are directionally verified from docs/skills, but exact SDK import paths for ledger timestamp helpers and custom-auth behavior should be compiled in a tiny current-SDK test if Phase 3 wants line-level accuracy.
- `q-sor-deploy-invoke-from-js-sdk`: official docs verify the simulate/assemble/sign/submit flow, but raw helper names such as `Operation.createCustomContract` are version-sensitive and should be rechecked against installed docs/types.

## Scope note

Only the `soroban-a` batch files and this result note were authored by this worker. Existing unrelated modified/untracked workspace files were not touched.
