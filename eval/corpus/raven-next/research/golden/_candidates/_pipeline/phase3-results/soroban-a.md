# Phase 3 results: soroban-a

Date: 2026-06-29

## Files reviewed

Owned slice: `soroban` category files at even zero-based indexes in the soroban-only `phase1-worklist.json`.

- `research/golden/soroban/q-sor-native-xlm-sac-address.md`
- `research/golden/soroban/q-sor-scval-conversion.md`
- `research/golden/soroban/q-sor-msg-sender-equivalent.md`
- `research/golden/soroban/q-sor-sep41-transfer-vs-transferfrom.md`
- `research/golden/soroban/q-sor-p23-auto-restore-extendto.md`
- `research/golden/soroban/q-sor-nft-mint-on-soroban.md`
- `research/golden/soroban/q-sor-recurring-escrow-patterns.md`
- `research/golden/soroban/q-sor-freeze-account-allowance.md`
- `research/golden/soroban/q-sor-bindings-from-wasm-no-address.md`
- `research/golden/soroban/q-sor-decode-hosterror-codes.md`
- `research/golden/soroban/q-sor-reflector-integration-code.md`
- `research/golden/soroban/q-sor-stale-spec-after-upgrade.md`
- `research/golden/soroban/q-sor-confidential-tokens.md`
- `research/golden/soroban/q-sor-index-sac-vs-sep41-events.md`

All 14 files were set to `status: reviewed` and `authored.reviewed: 2026-06-29` after review.

## Defects fixed

- `q-sor-p23-auto-restore-extendto.md`: tightened Protocol 23 auto-restore wording. Current docs say archived persistent/instance entries are auto-restored for `InvokeHostFunctionOp` only when included in the transaction restore list, usually populated by RPC simulation. The previous wording over-implied that merely appearing in a footprint was sufficient.
- `q-sor-nft-mint-on-soroban.md`: added SEP-39 as a source and caveated the classic-asset NFT branch as draft/informational interoperability guidance, not a mandatory protocol NFT standard.
- `q-sor-reflector-integration-code.md`: refreshed Reflector ID guidance. README sample ID remains valid as a sample, but the live SPA bundle also embedded `CBQSUF57OYX4RIMCZV62DKN6JFOTEKPHIZASMJYOUOCNHGNG2P3XQLSE` on 2026-06-29; the rubric now requires live oracle-page/project-doc verification instead of copying a single sample ID.
- `q-sor-confidential-tokens.md`: updated ZK primitive status. CAP-0059 is Final/Protocol 22, and CAP-0074/CAP-0075 are Final/Protocol 25 in `stellar-protocol`; the answer still requires target network/SDK verification before promising deployability.

## Sources and tools used

- Required local docs: `AGENTS.md`, golden pipeline plan/Phase 3 brief, `research/golden/README.md`, `_template.md`, `_meta/CARDS.md`, and `phase1-worklist.json`.
- Stellar Docs MCP searches for SAC/native asset derivation, Protocol 23 archival, TypeScript bindings, token events, and classic NFT metadata.
- Local Stellar CLI: `stellar 25.2.0`, `stellar contract id asset`, `stellar contract deploy --help`, and `stellar contract bindings typescript --help`.
- Empirical SAC derivation with local CLI:
  - native testnet: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`
  - native mainnet: `CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA`
  - testnet USDC docs issuer: `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`
  - mainnet Circle USDC docs issuer: `CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75`
- Official repos/docs: `stellar/stellar-protocol` SEP-40, SEP-41, SEP-39, CAP-59, CAP-67, CAP-74, CAP-75; `reflector-network/reflector-contract`; OpenZeppelin Stellar Contracts docs/repo; developers.stellar.org.
- Scout HTTP check: `https://stellarlight.xyz/api/research?q=Reflector%20lastprice%20Asset%20Stellar%20Address%20Beam%20Pulse&limit=5`.
- Current JS SDK package check: `npm view @stellar/stellar-sdk version exports` and `npm pack @stellar/stellar-sdk@16.0.1` for exported helpers and low-level operation names.

## Residual risks / unvalidated items

- `q-sor-reflector-integration-code.md`: Reflector live oracle listings are JS-rendered and can change. The rubric now treats contract IDs as freshness-sensitive and requires checking the selected network/page at answer time.
- `q-sor-bindings-from-wasm-no-address.md`, `q-sor-stale-spec-after-upgrade.md`, and `q-sor-decode-hosterror-codes.md`: exact JS/Rust helper names can drift by SDK version; the durable guidance is correct, but answers should cite the current SDK/CLI when naming APIs.
- `q-sor-confidential-tokens.md`: protocol CAP status was verified, but target-network activation and SDK readiness should still be checked at answer time for BN254/Poseidon-dependent deployments.
- Validation attempted: `npm run test:golden` failed because the current worktree has net-new uncompiled golden markdown files, causing migration count mismatch against the compiled 395-question corpus. This is broader than the owned slice.
