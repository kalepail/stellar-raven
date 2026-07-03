# Phase 3 results: soroban-b

Date: 2026-06-29
Owner: gp3-skeptic-soroban-b
Slice rule: `category == "soroban"`, odd zero-based indexes in the Soroban-only worklist.

## Files reviewed

- `research/golden/soroban/q-sor-build-target-wasm32v1.md`
- `research/golden/soroban/q-sor-require-auth-propagation.md`
- `research/golden/soroban/q-sor-contract-trustlines-c-address.md`
- `research/golden/soroban/q-sor-ttl-defaults-extend.md`
- `research/golden/soroban/q-sor-force-fast-archival-localnet.md`
- `research/golden/soroban/q-sor-evm-to-soroban-porting.md`
- `research/golden/soroban/q-sor-contract-as-claimable-arbiter.md`
- `research/golden/soroban/q-sor-sac-introspection.md`
- `research/golden/soroban/q-sor-testing-negative-auth-events.md`
- `research/golden/soroban/q-sor-classic-dex-from-contract.md`
- `research/golden/soroban/q-sor-deploy-invoke-from-js-sdk.md`
- `research/golden/soroban/q-sor-x-ray-bn254-sdk-gap.md`
- `research/golden/soroban/q-sor-doc-timestamping-manage-data.md`

All owned files were set to `status: reviewed` with `authored.reviewed: 2026-06-29`.

## Defects fixed

- Added missing inline official-doc citations to `q-sor-require-auth-propagation.md` for cross-contract authorization trees and `Env::authorize_as_current_contract`.
- Grounded `q-sor-contract-trustlines-c-address.md` in the current SAC integration guide for Protocol 26/Yardstick `trust` behavior, including account authorization and reserve caveats.
- Tightened `q-sor-deploy-invoke-from-js-sdk.md` around current JS SDK reality: verified `@stellar/stellar-sdk` 16.0.1 and `stellar/js-stellar-sdk` expose `contract.Client.deploy`/`AssembledTransaction` ergonomics around `Operation.createCustomContract` with `wasmHash`, `salt`, and `constructorArgs`; kept raw helper names version-sensitive.
- Corrected `q-sor-x-ray-bn254-sdk-gap.md` so it no longer implies current SDK support is absent across the board. Current docs link BN254/Poseidon SDK resources, while exact guest APIs remain version-sensitive. Added the Software Versions source for Protocol 25 Mainnet activation.

## Sources and checks used

- Local Stellar CLI 25.2.0: `stellar contract build --help`, `stellar contract deploy --help`, `stellar contract invoke --help`.
- Official Stellar docs: Rust build target/setup, state archival, SAC docs, SAC integration guide, contract authorization, smart-contract overview, transaction docs, software versions, ZK docs.
- CAPs from `stellar/stellar-protocol`: `cap-0074.md` and `cap-0075.md`.
- Current JS SDK package/repo: `npm view @stellar/stellar-sdk`, `npm pack @stellar/stellar-sdk`, `stellar/js-stellar-sdk`.
- Scout HTTP research endpoint for SAC/trustline-related routing sanity.
- Local YAML parse pass over the 13 owned files.

## Residual risks / unvalidated items

- `q-sor-force-fast-archival-localnet.md` intentionally avoids exact quickstart/stellar-core archival flag names because they are version-sensitive; the durable rubric requires caveating flag drift.
- `q-sor-x-ray-bn254-sdk-gap.md` still carries medium confidence because BN254/Poseidon guest API names are moving across SDK releases. The CAP-level signatures and Protocol 25 status were verified.
- `npm run test:schema` passed. `npm run test:golden` failed the migration-count checks because these phase files are net-new/untracked relative to the existing compiled corpus; owned frontmatter parsed cleanly.
