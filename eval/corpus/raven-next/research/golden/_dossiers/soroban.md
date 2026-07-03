# Task Run Results

**Run ID:** trun_04740bf111ed4e89b6a8a36aa66bea46
**Status:** ✅ completed
**Processor:** pro
**Created:** 2026-06-22T17:25:54.496376Z
**Modified:** 2026-06-22T17:33:32.444027Z

## Output

# SOROBAN Reference Dossier: Stellar's Smart-Contract Platform (2026-06-22)

## Executive Summary

- **Soroban Launch on Mainnet (Feb 20, 2024, Protocol 20)**: Soroban went live on Stellar mainnet with Protocol 20 on February 20, 2024, with the SDF committing a $100M adoption fund noted by the Stellar Development Foundation in March 2024 stellar.org press release. Two years on, the protocol has shipped seven major version upgrades (P20-26 plus the Protocol 27 "Zipper" mainnet vote scheduled July 8, 2026) and has matured from preview to production-ready. Decision: treat Soroban production-stable as of 2026 Q2; use the latest SDK (v26.x) and CLI (v27.x).

- **Current SDK/CLI Versions (June 2026)**: `soroban-sdk` v26.1.0 (released June 8, 2026) ships support for CAP-71, CAP-73, CAP-78, CAP-79, CAP-80, CAP-82; `stellar-cli` v27.0.0 (released June 17, 2026) defaults to Protocol 27 with `AddressV2` auth entries and `--auth-mode` non-root signing [79], [98]. Decision: pin the two most recent SDK majors per the SDF support policy and run the latest CLI.

- **Wasm Execution Plus Three Storage Tiers**: Contracts are Rust libraries compiled to Wasm32 target (`wasm32v1-none`), restricted to 64 KB per contract, with three storage classes whose rent behavior differs sharply: Persistent (archives on TTL=0, restorable), Temporary (deleted on TTL=0, cheap), Instance (attached to contract instance, loaded on each call) [6]. Decision: put user balances in Persistent, transient swap math in Temporary, configuration in Instance, and run `extend_ttl()` proactively to avoid eviction.

- **Three-Part Fee Decomposition**: CAP-0046 splits Soroban fees into `inclusionFeeBid` (prioritization, non-refundable), `competitiveResourcesFee` (instructions + ledger I/O + propagation, non-refundable), and `refundableResourcesFee` (based on actual usage, returned) [8], [50]. Decision: always run `simulateTransaction` (RPC) to capture the refundable portion and reduce effective costs.

- **Authorization Lifted Into the Host (CAP-0058, CAP-0071-01/-02)**: `require_auth`/`require_auth_for_args` are the canonical primitives; custom-account contracts implement `__check_auth(signature_payload, signatures, auth_context)`; Protocol 27 introduces `SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES` via `delegate_account_auth` and binds the payload to the address using `SOROBAN_CREDENTIALS_ADDRESS_V2` [16], [88]. Decision: design session keys / multisig accounts around Protocol 27's delegation path rather than rolling your own replay-resistant signer.

- **Parallelism Roadmap Aiming at 5,000 TPS**: Protocol 23 (Whisk, June 10, 2025) added live-state prioritization (CAP-0062), parallelism-friendly scheduling (CAP-0063), and a Wasm module cache (CAP-0065); Stellar Core v22.1.0/v22.3.0 added parallel dissemination and background signature verification; the SDF target is 5,000 TPS [67], [64]. Observations reveal: throughput gains are real but partial, with end-to-end pipelining still in development.

- **Native ZK Primitives Land in Protocol 25 (X-Ray) - BN254 and Poseidon**: X-Ray activation: January 22, 2026. CAP-0074 adds `bn254_g1_add`, `bn254_g1_mul`, `bn254_multi_pairing_check`, curve-membership checks, Fp/Fr encode/decode, and projective-to-affine helpers. CAP-0075 exposes `poseidon` and `poseidon2` permutations for ZK-friendly hashing [84], [83], [45]. CAP-0059 (P22) earlier delivered BLS12-381 `bls12_381_*` host functions. Decision: build ZK verifier contracts directly with native ZK host functions and skip the heavy EVM-style precompile emulation.

- **SAC Bridges Classic Assets via CAP-46-6 / SEP-41, Expanded by P26 Yardstick**: The Stellar Asset Contract is a built-in implementation of CAP-46-6 SEP-41 that exposes classic assets (`G...` issuers) to smart contracts; address-bound `Address::Account` balances live in trustlines (i64), `Address::Contract` balances live in contract storage (i128) [26], [28]. Protocol 26 Yardstick (May 6, 2026) activates CAP-73 enabling the SAC `trust` function so contracts can create G-account trustlines directly [76]. Decision: prefer SAC for token launches and let complex/regulatory logic live in SEP-41 or ERC-3643 contract tokens.

- **CAP-0077 "Quorum Freeze" on Soroban Entries (Protocol 26)**: Validators can now freeze Soroban contract code, contract data, account, and trustline entries (issuer and pool trustlines excluded) via `CONFIG_SETTING_FROZEN_LEDGER_KEYS`. Any Soroban tx whose footprint touches a frozen key is rejected [78]. Decision: monitor frozen-key announcements before signing time-sensitive contract interactions.

- **OpenZeppelin Mature Library for Soroban (since 2025)**: OpenZeppelin's `stellar-contracts` repo (public, ~190 stars in v26 era) ships a `stellar-token-contract` suite for SEP-41 fungible tokens with extensions (mintable, burnable, capped, pausable, upgradeable, access-control) along with relayer, monitor, and contract-wizard tooling [51], [52], [54]. Recommendation: use OZ `stellar-token-contract` as the default base for new SEP-41 tokens.

- **Security Audit Bank Has Decisive Track Record**: Over 40 Soroban audits have been funded under the Audit Bank with more than $3M deployed; an Inferara-curated "Soroban Security Portal" catalogs vulnerability classes (storage growth, `Vec`/`Map` input handling, oracle/replay issues); Veridise published a 2025 checklist that has become the de-facto pre-audit baseline [71], [56], [58]. Recommendation: budget a Veridise/Certora-style audit before any token-gated authorization or oracle-bearing launch.

## 1. Soroban Execution Model: Wasm, Rust, no_allocator, and the SDK

Soroban is a Wasm execution environment embedded directly inside Stellar Core. The Stellar data-structures documentation states: "These contracts are programs written in the Rust language and compiled as WebAssembly (Wasm) for deployment" [1]. Performance hinges on two Wasm-specific design choices: the binary is parsed once into a "parsed module" cache (CAP-0065), and execution uses a deterministic interpreter so consensus is trivial. The Stellar main blurb states Wasm was chosen "for high performance, cost efficiency, and the reduction of critical bugs and exploits" [2].

Function entries must be `pub`, take `&Env` (representing the Soroban host interface) as their first argument, return `Result<T, E>` (where `E: Into<Error>`), and have a name not exceeding 32 characters. Storage types `Vec`, `Map`, `Bytes`, `BytesN`, and `Symbol` are SDK-provided wrappers because there is no allocator [3]. Supported scalar types include `u128`, `i128`, `u64`, `i64`, `u32`, `i32`, and `bool`; floating point is not supported. The build target is `wasm32v1-none` and Rust v1.84.0+ is required.

Key build details:

- **Build command**: `stellar contract build` wraps `cargo build --target wasm32v1-none --release`.
- **Compilation constraint**: must use `#![no_std]` to avoid pulling in `std`.
- **Contract size cap**: maximum compile output is **64 KB**, a hard consensus limit [3], [40].
- **Optimization**: use `stellar contract build --optimize` (replaces deprecated `stellar contract optimize`).

Implication: heavy logic must be modularized across multiple contracts and composed via cross-contract calls rather than a single fat binary. Recommendation: enable the latest CLI's "spec shaking" feature (`v25.2.0+` for experimental, on by default in `v26.0.0-rc.1`) to reduce final WASM size.

Case study: the `soroban-sdk` Crates.io registry shows the SDK has shipped dozens of point releases through v21.7.x and v22-v26 major trains [12]. This rapid cadence reflects aggressive feature intake from open CAPs while preserving Wasm determinism.

## 2. Contract Structure and Soroban SDK Macros

A Soroban contract is a Rust library crate. The five primary annotations exported from `soroban_sdk` are:

| Macro | Purpose | Notes |
|---|---|---|
| `#[contract]` | Marks a type as the contract struct | Required for spec emission |
| `#[contractimpl]` | Marks the impl block exposing callable functions | Generates the spec JSON; emits `__check_auth` for account contracts |
| `#[contracttype]` | Allows custom enum/struct types to cross the host boundary | Generates SCVal XDR encode/decode |
| `#[contractevent]` | Marks an event-topic `enum` to produce stable topics | Used for indexed event filtering |
| `#[contractmeta]` | Appends key=value metadata to the WASM custom section | Convenience for `version`, `description`, etc. |

Source: [91], [3].

The functional surface splits into three areas: **Host functions** (e.g., `env.storage()`, `env.crypto()`, `env.events()`, `env.invoke_contract()`), **client bindings** (generated with `stellar contract bindings`), and **test utilities** (`Env::default()`, `Env::mock_all_auths()`). Spec shaking (default-on in `v26`) prunes unused exports/methods from the WASM.

Implication: macro misuse is a recurrent vulnerability source. CVE-2026-26267 was logged against `soroban-sdk < 22.0.10 / 23.5.2 / 25.1.1` for a logic bug in `#[contractimpl]` processing [92]; another, CVE-2026-24889, flagged `Bytes::slice`, `Vec::slice`, and `Prng::gen_range` for arithmetic overflow prior to the corresponding patch releases [81]. Recommendation: pin SDK versions and stay on one of the two most recent "supported with critical security fixes" majors per [39].

## 3. Storage Types, TTL, and State Archival

The SDK exposes three storage classes via `env.storage()`:

| Storage Type | Cheapest? | Behavior on TTL=0 | TTL extension | Loaded? |
|---|---|---|---|---|
| **Temporary** | Yes | Permanently deleted; cannot be restored | `extend_ttl()` | Per call |
| **Persistent** | No | Archived automatically (CAP-0066); restorable via footprint or `RestoreFootprintOp` | `extend_ttl()` | Per call |
| **Instance** | No | Archived automatically; tied to contract instance | `extend_ttl()` / `extend_ttl_for_contract_instance()` | **Every contract call** |

Source: [6], [7].

TTL is the count of ledgers remaining in the `liveUntilLedger` field; expiry occurs when `current_ledger > liveUntilLedger`. CAP-0066 (Protocol 23) enables `InvokeHostFunction` to auto-restore archived Persistent/Instance entries that appear in the transaction's restore footprint. The value `max_ttl()` is a network parameter; use it to size extensions.

Implication: the choice of storage tier is a cost-versus-resilience decision. Storing unbounded user data in Instance is a denial-of-service pattern because every invocation deserializes it; storing unbounded append-only data in a single Persistent key risks hitting the ledger-entry size limit [58].

Recommendation:
1. Use Temporary for AMM quote math, partial fills, and pricing snapshots.
2. Use Persistent for balances, allowances, and ownership records.
3. Use Instance for admin configuration and per-contract flags.
4. Always include `extend_ttl()` in any administrative routine, sized by `max_ttl()`.

Case study: a typical Soroban token design uses `Persistent` for `(address, seq)->balance` mappings, `Instance` for `admin`, `decimals`, and `name`, and `Temporary` for ephemeral `allowance` expiries [26].

## 4. Authorization: require_auth, __check_auth, and Custom Accounts

Authorization and authentication are explicitly distinguished: "Authorization is the process of judging which operations should or should not be allowed to occur; it is about judging permission. Authentication is the process of confirming identity" [16].

The Soroban Authorization Framework relies on three mechanisms:
1. **Contract-specific authorization**: per-function, per-authorization `require_auth()` / `require_auth_for_args`.
2. **Account abstraction / custom accounts**: `Address::Contract` accounts implement the contract trait with `__check_auth`.
3. **Host-managed signature payload**: a canonical `SorobanAuthorization` hash, plus a nonce/ledger sequence for replay prevention.

When a contract calls `require_auth(addr)`, the host validates the embedded signatures against a transaction-provided `SorobanCredentials` payload. Custom accounts instead implement `__check_auth(signature_payload: Hash<32>, signatures: Vec<AccSignature>, auth_context: Vec<Context>) -> ()`; the host invokes it once per authorization batch returning `()` to approve or panic to reject [89], [17].

Protocol 27 Zipper (CAP-0071-01 / CAP-0071-02) adds two new flows:

| Item | Purpose |
|---|---|
| `SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES` | Bundle delegated signers into one auth entry; supports `delegate_account_auth` and `get_delegated_signers_for_current_auth_check` host functions |
| `SOROBAN_CREDENTIALS_ADDRESS_V2` | Address-bound signature preventing cross-account replay when keys are shared; replaces the original `SOROBAN_CREDENTIALS_ADDRESS` in Protocol 28 |

Source: [88], [87].

Implication: session keys and multisig are simpler to build on Protocol 27's delegation path than to handcraft a replay-preventing signer. Recommendation: design custom accounts on the `__check_auth` path, then migrate them to `SOROBAN_CREDENTIALS_ADDRESS_V2` ahead of P28 deprecation.

Case study: `leighmcculloch/soroban-webauthn` demonstrates a Webauthn-backed account abstraction contract using Ed25519 signatures and the `__check_auth` flow [19]. It is a clean template for passkey-driven wallets without a traditional Stellar keypair.

## 5. Cross-Contract Calls

A cross-contract call invokes a function on another deployed contract by its `ContractAddress`. Two styles are documented [33]:

- **Manual call**: use `env.invoke_contract::<ReturnVal>(&contract_id, symbol_short!("fn"), args)` and capture a typed return.
- **Generated client**: use `stellar contract bindings` (or `contractimport!` macro) to generate a Rust client typed by the target contract's spec; call methods directly.

Implications:
- Authorization is re-validated at each call boundary unless explicitly preserved via `require_auth` on the inner contract.
- Footprints must include all storage entries that may be accessed in the call chain; mis-specifying the footprint causes runtime `HostError`.
- Sandboxing: cross-contract calls are bounded by the same instruction/memory limits as the original invocation.

Recommendation: prefer generated clients over manual `invoke_contract` calls to keep an upstream contract's spec changes type-checked at build time.

Case study: the official `soroban-examples` repo includes a `cross_contract_calls` example showing a token contract calling an AMM contract where authorization is delegated through `require_auth` chains [32].

## 6. Events

`env.events().publish(topic1, topic2, ..., data)` emits a contract event recorded in the transaction's meta. The first topics (up to four indexed `Symbol`-valued topics) are filterable. Events are accessible via Stellar RPC's `getEvents` method for up to **7 days** retention [36], [38].

Protocol 23's CAP-0067 unified events between classic Stellar ops and Soroban contracts, plus introduced M-account support and removed admin topics from mint events [67]. The SDK's `#[contractevent]` macro (v21.x+) makes events type-safe: events are defined as enum variants with explicit `topics` payloads.

Implication: a stable event schema is now a public API. Recommendation:
1. Index the highest-stability topic first (a `Symbol` constant) so off-chain indexers can subscribe.
2. Encode `Address` and `Vec`/`Map` values using the SDK's `IntoVal` to guarantee spec compatibility.

Case study: `soroban-examples/events/src/lib.rs` issues a `("COUNTER", "increment")`-indexed increment event that is consumable by the simulator CLI's `stellar events` watch command [37].

## 7. Fees and Resource Metering

Soroban fees follow CAP-0046 [8], [46]:

| Fee Component | Source | Refundable? |
|---|---|---|
| `inclusionFeeBid` | User bid in tx envelope (`tx.fee`) | No |
| `competitiveResourcesFee` | `instructions * rate`, `bytes * rate`, `size * rate` | No |
| `refundableResourcesFee` | Actual on-chain usage | **Yes**, post-consensus |

Limits (per tx / per ledger) are network-configurable and include:
- `txMaxInstructions` / `ledgerMaxInstructions` - CPU instruction meter.
- `txMaxReadEntries` / `txMaxWriteEntries` and the byte-summed counters - Ledger I/O.
- `txMemoryLimit` - Wasm memory cap (no fee, hard ceiling).
- `feeContractEvents1KB` - per-kilobyte fee for event bytes, `ledgerMaxEventSizeBytes` ceiling.
- `feeHistorical1KB`, `tx_max_fee` for older operation styles.

Empirical reference values (per the dev guide): 1 KB of contract event data costs a few STROOPs; the historical-storage flat rate is approximately `17,859 STROOPs per 1KB` (1,624 base + 16,235 entry fee). Recommended pre-flight is `simulateTransaction` (RPC), which returns the `resourceFee` needed plus the post-execution `refundableFee`.

Implication: resource limits are non-trivial gates; mispricing in a contract means runtime `TransactionFailed` rather than a soft error. Recommendation:
1. Run `stellar tx simulate <hash>` (RPC) for every contract invocation in production pipelines.
2. Set the inclusion bid comfortably above zero, since the `competitiveResourcesFee` is the actual gating fee.
3. Use `tx.simulateTransaction` in tests to compute realistic budgets.

Case study: a tutorial reference computes that 1 KB of historical storage costs 17,859 STROOPs, of which 1,624 is base and 16,235 is by-size [97]. Combined with typical `round_up(instructions * feeRatePerInstructionsIncrement / 10000)`, the math is reproducible and audit-friendly.

## 8. Stellar CLI Workflow (stellar-cli / soroban-cli)

The official client is `stellar` (formerly `soroban`), a single Rust binary that handles accounts, contracts, transactions, networks, events, and bindings [21].

| Subcommand | Purpose | Notable flags |
|---|---|---|
| `stellar contract init <name>` | Scaffold a Cargo workspace project | Creates `Cargo.toml` + sample contract |
| `stellar contract build` | Compile Rust to `wasm32v1-none` release | `--optimize` enables wasm-opt |
| `stellar contract upload` | Upload WASM (replaces deprecated `install`) | Returns a WASM hash |
| `stellar contract deploy` | Instantiate a contract from a WASM | `--wasm`, `--wasm-hash`, `--salt`, `--alias` (save id), `--optimize` |
| `stellar contract invoke` | Call a function | `--id`, `--source`, `--network`, args after `--` |
| `stellar contract bindings` | Generate Rust/JS/Python typed clients | Per spec JSON |
| `stellar contract restore` | Restore archived persistent entries | Operates per-entry |
| `stellar contract info hash` | Print WASM hash of a deployed contract | Useful for upgrades |
| `stellar events` | Stream events from a network | Topic filters, `--cursor` |
| `stellar tx` | Build, simulate, sign, submit transactions | `--simulate` |

Source: [21]. P26 era default version is `stellar-cli v25.2.0` ([98]); the latest is v27.0.0 (June 17, 2026) which adds Protocol 27 `AddressV2` auth entries and `--auth-mode` non-root signing, optimizes WASM output by default, and adds `stellar contract info hash`.

Implication: `stellar events` plus `stellar contract invoke --simulate` is a complete read/debug loop for local development. Recommendation:
1. Always commit a generated `stellar contract deploy --alias <NAME>` script for reproducible deployments.
2. Use `stellar contract bindings` (e.g., Rust, Python) to keep typed clients in sync with spec evolution.

Case study: the v25.2.0 release added auto-build on deploy and self-describing events drawn from contract specs, removing a long-standing manual step that previously was "compile here, copy WASM there" [22].

## 9. Deployment and Upgrades (WASM Replacement)

Contracts are deployed via the `InvokeHostFunctionOp` (CAP-46), which packs four op variants [23]:

| Op variant | Purpose |
|---|---|
| `HOST_FUNCTION_TYPE_INVOKE_CONTRACT` | Calls a deployed contract fn |
| `HOST_FUNCTION_TYPE_UPLOAD_CONTRACT_WASM` | Uploads Wasm blob keyed by SHA-256 hash |
| `HOST_FUNCTION_TYPE_CREATE_CONTRACT` | Deploys an instance from a Wasm hash or built-in token contract |
| (Hosted in subsequent protocol updates) | `HOST_FUNCTION_TYPE_UPDATE_CONTRACT` for Wasm bytecode replacement |

Constraints on `InvokeHostFunctionOp` transactions: `MEMO_NONE` is required and the transaction source account must not be a muxed account.

Implication: upgrades are bytecode-replacement operations; the contract address is derived from the deploy-time `ContractIDPreimage` (a salted hash of the deployer + WASM hash), so the WASM hash is the *upgrade handle*. Recommendation: maintain a transparent mapping from contract id to current and historical WASM hashes; pin salt and instance storage layout in docs.

Case study: the SDK's `C...` contract address is the deployer address hashed with the WASM hash and salt, making a deterministic address the safe deploy mode [89]. For upgradeable logic, the canonical Soroban pattern is in-place WASM replacement: the contract stores its own WASM hash and calls `env.deployer().update_current_contract_wasm(new_hash)` behind an admin-gated `upgrade` function (address is preserved). A proxy pattern (storage in a "data" contract, code in an "impl" contract, admin-gated pointer) is an alternative.

## 10. Stellar Asset Contract (SAC): Bridging Classic Assets

The Stellar Asset Contract is a built-in contract that wraps a Stellar classic asset (issuer + code) into a SEP-41 interface. Source: [26], [28]. Key properties:

- **Standard compliance**: implements **CAP-46-6** "Smart Contract Standardized Asset" and the **SEP-41 Token Interface**.
- **Balance storage** (Protocol 23+ unified asset events, CAP-0067): `Address::Account` lives in trustlines as **i64**; `Address::Contract` lives in contract storage as **i128**.
- **Admin**: defaults to the asset issuer `G...`; can be rotated to a smart contract for on-chain policy.
- **Authorization**: respects issuer flags `AUTH_REQUIRED_FLAG`, `AUTH_REVOCABLE_FLAG`, `AUTH_CLAWBACK_ENABLED_FLAG`, `AUTH_IMMUTABLE_FLAG`.

Protocol 26 Yardstick (May 6, 2026) adds CAP-73: the SAC `trust` function lets contracts programmatically open trustlines for G-accounts, simplifying reward-distribution flows where the contract would otherwise rely on the recipient to pre-open [76].

Other protocol advancements through 2025-2026:
- **Protocol 22 (Nov 2024)**: CAP-0058 constructors (`__constructor` lifecycle), **CAP-0059 BLS12-381 host functions** (`bls12_381_g1_add`, `bls12_381_g1_mul`, `bls12_381_g2_add`, `bls12_381_g2_mul`, `bls12_381_pairing_check`, `bls12_381_hash_to_g1`, `bls12_381_hash_to_g2`, `bls12_381_fr_from_u256` and metered variants) [41].
- **Protocol 23 (June 2025, "Whisk")**: CAP-0062 live-state prioritization; CAP-0063 parallelism-friendly scheduling; CAP-0065 Wasm module cache; CAP-0066 InvokeHostFunction auto-restore; CAP-0067 unified asset events; CAP-0068 executable-fetcher host fn [67].
- **Protocol 24 (October 22, 2025)**: stability-only fix for a state-archival bug, no XDR/SDK-required changes [66].
- **Protocol 25 "X-Ray" (January 22, 2026)**: CAP-0074 BN254 host functions, CAP-0075 Poseidon/Poseidon2 hash functions; first ZK-friendly primitives on-chain [84], [83].
- **Protocol 26 "Yardstick" (May 6, 2026)**: CAP-0073 SAC trust, CAP-0077 quorum freeze (Soroban-only entries freezable), CAP-0082 checked 256-bit integer arithmetic host functions [76].
- **Protocol 27 "Stellar Zipper" (Testnet June 18, 2026 / Mainnet vote July 8, 2026)**: CAP-0071-01 auth delegation for custom accounts, CAP-0071-02 `SOROBAN_CREDENTIALS_ADDRESS_V2` [88].

Implication: classic assets and smart-contract tokens are not competing; SAC is the bridge. Tokens needing flexible logic (vesting, hooks, fee-on-transfer) are better expressed as SEP-41 contract tokens or ERC-3643 (regulatory), not as classical Stellar Assets [28].

Case study: **Soroswap** is positioned as the first DEX aggregator on Stellar's Soroban soroswap.finance, anchoring the SEP-41 contract-token liquidity. **Blend** popularized a "lending super-app" model on Soroban with SAC collateral, demonstrating SAC's central role in DeFi composition.

## 11. Security Patterns and Common Vulnerability Classes

The Soroban security landscape has matured quickly. Two reference compendia have emerged: Veridise (auditor) checklist [58] and the Inferara-curated Soroban Security Portal [56]. Recurring vulnerability categories:

| Class | Concrete issue | Mitigation |
|---|---|---|
| Type conversion DoS | Unbounded `Vec`/`Map` inputs convert to `Val`; failure to reconvert halts execution | Validate lengths and types at function entry |
| Instance storage DoS | Growing Instance maps load every call until ledger entry size is hit | Cap key fan-out; move user data to Persistent |
| Single-key Persistent blowup | One Persistent key accumulating array entries | Sharded nesting or external index |
| Auth-context confusion | Authorizing an op through partial contexts (e.g., `require_auth_for_args(transfer_from, from, to)`) without nonce | Use full arg-context and nonces; rely on host-provided nonces |
| TTL eviction / front-run | Adversary restores an entry close to `TTL=0` and prices it out | Pre-emptively extend TTL by `max_ttl()` slices |
| Oracle / replay | External price feeds or signature reuse | Use time-bound oracles and `__check_auth` per-context nonces |
| Float / overflow | SDK CVE-2026-24889 in `Bytes::slice`, `Vec::slice`, `Prng::gen_range` | Upgrade SDK; use checked arithmetic |
| Macro bugs | CVE-2026-26267 in `#[contractimpl]` prior to 22.0.10 / 23.5.2 / 25.1.1 | Pin patched SDK version |

Sources: [58], [40], [56].

Security primitives and additional tooling:
- **Soroban Security Audit Bank**: SDF-managed program; over **40 audits** funded with **>$3M deployed** as of May 2025 [71].
- **Soroban Security Detector SDK**: OpenZeppelin-shipped static analyzer surfaced in the Stellar developer docs [54].
- **Scout** and **Soroban fuzzers** referenced by Certora and other auditors [59].

Implication: the most common Soroban audit findings are DoS via Instance storage and misuse of `Vec`/`Map` input boundaries rather than re-entrancy-style issues. Note: Soroban contract calls are inherently re-entrancy-resistant because cross-contract re-entry into the *same* contract is disallowed by the host. Recommendation: include a static-analysis stage (`scout`, OZ detector) plus property-based fuzzing (`proptest`, `arbitrary`) in CI before requesting a formal audit.

Case study: Quarkslab's audit of Airswift noted that "drawing from our audit of Airswift's SCF, we discuss part of Soroban's security model and showcase common vulnerabilities" with examples around TTL-management and exact-amount transfer semantics, patterns that subsequently informed multiple downstream audit checklists [60].

## 12. Recent Developments: Protocol Changes Affecting Soroban (2025-2026)

### 12a. Parallel Execution Milestones

| Version | CAP/Change | Effect |
|---|---|---|
| Stellar Core v22.1.0 (Jul 16, 2025) | `BACKGROUND_OVERLAY_PROCESSING` default-on | Parallel transaction dissemination via dedicated thread pools |
| Stellar Core v22.3.0 | `EXPERIMENTAL_BACKGROUND_TX_SIG_VERIFICATION` | Background signature verification |
| Protocol 23 (June 10, 2025) | CAP-0062, 0063, 0065 | Live-state prioritization; parallelism-ready scheduling; Wasm cache for CPU efficiency |
| Ongoing (2026) | "Road to 5000 TPS" | Theoretical end-state: pipelined (consensus on `N+1` while executing `N`) |

Sources: [61], [64], [67], [68].

Implication: Soroban's deterministic footprint declaration lets validators schedule non-overlapping transactions concurrently. Recommendation: design contracts with minimal footprint footprint-per-invocation to maximize parallelism benefits.

### 12b. BLS12-381, BN254, and Poseidon

| Protocol | CAP | Host functions added |
|---|---|---|
| P22 (Nov 2024) | CAP-0059 | `bls12_381_g1_add`, `bls12_381_g1_mul`, `bls12_381_g2_add`, `bls12_381_g2_mul`, `bls12_381_pairing_check`, `bls12_381_hash_to_g1`, `bls12_381_hash_to_g2`, `bls12_381_fr_from_u256` (plus metered variants) |
| P25 (Jan 22, 2026) - X-Ray | CAP-0074 | `bn254_g1_add`, `bn254_g1_mul`, `bn254_multi_pairing_check`, plus encode/decode, on-curve checks, Fp/Fr conversions |
| P25 (Jan 22, 2026) - X-Ray | CAP-0075 | `poseidon` and `poseidon2` permutation primitives |
| P27 (planned Jul 8, 2026) | CAP-0071-01 | `delegate_account_auth`, `get_delegated_signers_for_current_auth_check` |

Source: [84], [41], [88], [83], [45].

Implication: building "no-EVM-required" ZK verification contracts is now reasonable: a Noir- or Circom- generated proof can be verified on Stellar natively rather than via Solidity precompiles. Recommendation: use these primitives for compliance-forward privacy (selective disclosure of identity attributes) and as cross-chain message bridges.

### 12c. Fee / Limit Changes

Protocol 24 was a stability upgrade, P25 reorganized metering around BN254 and Poseidon costs, and P26 expanded frozen-key networks. CAP-0077 introduced the freeze mechanism; CAP-0082 brought checked 256-bit integer arithmetic to prevent overflow aborts [76]. Soroban's competitive-resources fee market is unchanged in structure but the limit constants have been retuned over time.

Recommendation: re-validate fee budgets after major protocol upgrades because `*Max` constants shift.

### 12d. SDK and Tooling Maturity

| Component | Version (June 2026) | Notable 2026 additions |
|---|---|---|
| `soroban-sdk` | v26.1.0 | CAP-71 auth delegation, CAP-73 SAC `trust`, CAP-78 limited TTL, CAP-79 muxed strkey, CAP-80 BN254 MSM, CAP-82 checked 256-bit |
| `stellar-cli` | v27.0.0 | Protocol 27 `AddressV2` auth, `--auth-mode`, default wasm-opt, `stellar contract info hash` |
| OpenZeppelin stellar-contracts | Active maintenance | Tokens, Access, Governance, Relayer, Monitor, Fee-Abstraction, UIKit |
| Soroban examples | Active maintenance | Hello, Auth, Cross-call, Events, Custom Account, Token, Single-Offer DEX |

Sources: [79], [98], [96].

Implication: tooling has caught up - generated clients, simulated transactions, and security analysis are CLI-first. Recommendation: standardize on `stellar contract bindings` and `stellar tx simulate` in CI.

## 13. OpenZeppelin Stellar Contracts

[51] library adds a mature, audit-friendly layer atop the SDK. The full suite per OpenZeppelin's documentation [52]:

| Module | Purpose |
|---|---|
| Accounts | Account-abstraction primitives (incl. signature verification) |
| Stellar token-contract | SEP-41 tokens with mintable, burnable, capped, pausable, upgradeable, access-control extensions |
| Access control / Governance | Owner/role-based authorization; proposal/vote flow |
| Utilities | Merkle proofs, signature verification |
| Developer libraries | Helpers for testing, deployment, specs |
| Relayer / Monitor | Companion services for meta-transaction submission and on-chain event monitoring |
| UIKit / UI Builder / Role Manager | Front-end scaffolds |

A separate "Soroban Security Detector SDK" is highlighted in [54] for static analysis.

Implication: building an SEP-41 token from scratch is rarely justified - the OZ base offers audit-reused code paths and integrates with the OZ "Contract Wizard" approach for Stellar/Soroban [55]. Recommendation: import OZ `stellar-token-contract` as the default base for new SEP-41 tokens and audit only deltas.

Case study: OpenZeppelin's Stellar launch is tracked in the SDF blog and developer docs, treating it as a "Web3 standards under the OpenZeppelin quality" objective consistent with its Ethereum/Solana history [51].

## 14. Synthesis: Comparing the Axes of Soroban Design

Across all sections, three cross-cutting dimensions emerge:

1. **Determinism versus flexibility**: Soroban enforces deterministic footprints, fixed random sources, and bounded instructions to preserve Stellar's consensus property; OpenZeppelin adds configurable authorization to that base. Trade-off: every contract must declare its state footprint up front, limiting free-form patterns but enabling safe pipelining toward 5,000 TPS.

2. **State continuity versus cost**: Storage cost dominates operational expenditure. Persistent with a Wasm-module cache reload is the most expensive path; Temporary is cheapest but loses guarantees; Instance loads every call. The right pick depends on liveness requirements and attack surface.

3. **Centralized liveness versus decentralization**: Protocol's quorum freeze (CAP-0077), auth delegation (CAP-0071), and constructor lifecycle (CAP-0058) all push power toward ecosystem coordinators (DAOs, Issuer-controlled contracts). The trade-off is operational responsiveness against validator-based censorship.

The most striking divergence in the field is between classic Stellar Assets and the SEP-41 contract-token model: SAC wins on simplicity and Storoban interoperability, while SEP-41 contract tokens win on programmatic logic, but the P26 Yardstick SAC trust function narrows the gap.

A second divergence is the rationale for parallel execution. Some ecosystem actors (SDF, validators) invest in core-level parallelism (background dissemination, Wasm cache) while others invest in caller-side parallelism (footprint batching, off-chain batchers). The winning pattern will likely combine both.

A third tension exists in **state archival**: SDF's auto-restore for archived entries (CAP-0066) pushes eviction cost back to the user, while Quarkslab and Veridise flag eviction as a real DoS vector. The right pattern is to extend TTL aggressively, treat auctions for "restores" as anti-patterns, and pre-budget TTL extensions into admin operations.

## Key Takeaways for Strategy:
- Build with the current SDK/CLI (v26.1.0 / v27.0.0) to get CAP-0071, CAP-0074, CAP-0075, CAP-0082 features natively.
- Default to OpenZeppelin tokens, then layer SEP-41 extensions only as needed.
- Use SAC for canonical assets; reserve SEP-41 / ERC-3643 for programmable token logic.
- Always simulate (`stellar tx simulate`); always extend TTL on critical entries; always run a security audit before any token-gated authorization.

## 15. 30 Most Important Soroban Developer Questions

1. **Q**: What language/format do Soroban contracts use?
   **A**: Rust, compiled to Wasm target `wasm32v1-none`, maximum 64 KB binary.
   **Source**: [3].

2. **Q**: When did Soroban launch on mainnet?
   **A**: February 20, 2024 with Protocol 20.
   **Source**: Stellar launch press release.

3. **Q**: What's the maximum size of a Soroban contract?
   **A**: 64 KB compiled Wasm binary.
   **Source**: [3].

4. **Q**: Name Soroban's three storage types.
   **A**: Persistent, Temporary, Instance.
   **Source**: [6].

5. **Q**: What happens to a Persistent entry when TTL reaches zero?
   **A**: It is automatically archived and can be restored via `RestoreFootprintOp` (or auto-restored in P23+ `InvokeHostFunction` per CAP-0066).
   **Source**: [7].

6. **Q**: What happens to a Temporary entry when TTL reaches zero?
   **A**: It is permanently deleted.
   **Source**: [6].

7. **Q**: What is the difference between Instance and Persistent storage?
   **A**: Instance storage is tied to the contract instance and is loaded on every invocation; Persistent storage entries are loaded on demand per footprint.
   **Source**: [6].

8. **Q**: What function is the canonical authorization gate?
   **A**: `Address::require_auth()` and `Address::require_auth_for_args(args)`.
   **Source**: [16].

9. **Q**: What is `__check_auth` and when is it called?
   **A**: `__check_auth(signature_payload, signatures, auth_context)` is special-cased and called by the Soroban host every time `require_auth` is called on a custom-account contract.
   **Source**: [89].

10. **Q**: What are Soroban events?
    **A**: Records emitted from a contract via `env.events().publish(topics, data)`, stored in transaction meta, queryable via RPC `getEvents` for 7 days.
    **Source**: [36].

11. **Q**: What CLI command builds a contract?
    **A**: `stellar contract build` (optionally with `--optimize`).
    **Source**: [21].

12. **Q**: What CLI command deploys a contract?
    **A**: `stellar contract deploy --wasm <file>` (or `--wasm-hash` for an existing upload).
    **Source**: [21].

13. **Q**: How do you replace an existing contract's code?
    **A**: Use a transaction's `InvokeHostFunctionOp` variant for `update_contract` (current op name in `InvokeHostFunction`) that points to a new Wasm hash for the same `ContractAddress`.
    **Source**: [23].

14. **Q**: What is the SAC standard?
    **A**: CAP-46-6 implementation of SEP-41, wrapping a classic Stellar asset into a contract-callable token.
    **Source**: [26].

15. **Q**: Where do contract tokens store balances vs. classic trustline balances?
    **A**: Classic balances for `Address::Account` are in trustlines (i64); contract balances for `Address::Contract` are in contract storage (i128).
    **Source**: [26].

16. **Q**: What protocol introduced BLS12-381 host functions?
    **A**: Protocol 22 (CAP-0059), released mainnet December 5, 2024.
    **Source**: [41].

17. **Q**: What protocol introduced BN254 and Poseidon host functions?
    **A**: Protocol 25 "X-Ray" (CAP-0074 and CAP-0075), mainnet activation January 22, 2026.
    **Source**: [84].

18. **Q**: What protocol added CAP-0077 quorum-freeze on Soroban entries?
    **A**: Protocol 26 "Yardstick" (May 6, 2026).
    **Source**: [76].

19. **Q**: What protocol activates auth delegation for custom accounts?
    **A**: Protocol 27 "Stellar Zipper" (CAP-0071-01 and CAP-0071-02), Testnet June 18, 2026 / Mainnet vote July 8, 2026.
    **Source**: [88].

20. **Q**: How is the total Soroban fee structured?
    **A**: Split into `inclusionFeeBid` (non-refundable), `competitiveResourcesFee` (non-refundable), and `refundableResourcesFee` (refundable post-execution).
    **Source**: [8].

21. **Q**: Where can you pre-flight a Soroban transaction to compute its resource fee?
    **A**: Stellar RPC `simulateTransaction` or `stellar tx simulate` (CLI).
    **Source**: [31].

22. **Q**: What's the maximum memory a Soroban transaction can use?
    **A**: `txMemoryLimit` (Wasm memory), a hard consensus ceiling with no fee.
    **Source**: [46].

23. **Q**: What is the rollback mechanism when a contract is invoked but fails?
    **A**: All ledger writes from the transaction revert; events emitted before the revert are dropped.
    **Source**: [16].

24. **Q**: What's CVE-2026-24889?
    **A**: Arithmetic overflow in `Bytes::slice`, `Vec::slice`, and `Prng::gen_range` in `soroban-sdk`; fixed in 22.0.10 / 23.5.2 / 25.1.1.
    **Source**: [81].

25. **Q**: What is the Soroban Security Audit Bank?
    **A**: SDF-run program with `>$3M` deployed and `40+` funded audits as of May 2025.
    **Source**: [71].

26. **Q**: Where do you find a curated list of Soroban vulnerabilities?
    **A**: The Inferara-curated "Soroban Security Portal" on GitHub.
    **Source**: [56].

27. **Q**: What's the canonical test harness in `stellar contract build`?
    **A**: The SDK's `Env::default()` plus `Env::mock_all_auths()`.
    **Source**: [3].

28. **Q**: What's the principal macro for declaring a contract struct?
    **A**: `#[contract]` paired with `#[contractimpl]` on the impl block.
    **Source**: [3].

29. **Q**: What is OpenZeppelin's flagship Soroban deliverable?
    **A**: `stellar-token-contract` (SEP-41 base) with mintable, burnable, capped, pausable, upgradeable extensions.
    **Source**: [51].

30. **Q**: What is the latest `stellar-cli` version as of June 2026?
    **A**: v27.0.0, released June 17, 2026, supporting Protocol 27.
    **Source**: [22].

## References

1. *Smart Contracts | Stellar Docs*. https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/contracts
2. *Soroban | Smart Contracts Platform on Stellar*. https://stellar.org/soroban
3. *Hello World - Build Smart Contracts*. https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world
4. *From Zero to Smart Contract Developer: Soroban*. https://dev.to/mikkolaj/from-zero-to-smart-contract-developer-soroban-402c
5. *Work with contract specs in Java, Python, and PHP*. https://developers.stellar.org/docs/build/guides/dapps/working-with-contract-specs
6. *How to choose the right storage type for your use case*. https://developers.stellar.org/docs/build/guides/storage/choosing-the-right-storage
7. *State Archival - Smart Contracts*. https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival
8. *stellar-protocol/core/cap-0046-12.md at master*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046-12.md
9. *Soroban Data & State Management | Lumen Loop*. https://lumenloop.com/media/soroban-data-state-management
10. *Soroban Data Locations & State Management - James Bachini*. https://jamesbachini.com/soroban-data-state-management/
11. *soroban-cli - crates.io: Rust Package Registry*. https://crates.io/crates/soroban-cli/25.2.0/dependencies
12. *soroban-sdk - crates.io: Rust Package Registry*. https://crates.io/crates/soroban-sdk/21.7.4/dependencies
13. *soroban-sdk - crates.io: Rust Package Registry*. https://crates.io/crates/soroban-sdk/0.8.1/dependencies
14. *soroban-kit - crates.io: Rust Package Registry*. https://crates.io/crates/soroban-kit
15. *soroban-sdk - crates.io: Rust Package Registry*. https://crates.io/crates/soroban-sdk/21.7.7
16. *Authorization | Stellar Docs*. https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization
17. *Context in soroban_sdk::auth - Rust*. https://docs.rs/soroban-sdk/latest/soroban_sdk/auth/enum.Context.html
18. *Using Soroban Auto-complete | Developer Tutorial*. https://www.youtube.com/watch?v=pqTEUPcR9po
19. *Soroban Webauthn Account Contract*. https://github.com/leighmcculloch/soroban-webauthn
20. *Soroban.ex*. https://hexdocs.pm/soroban/0.7.0/index.html
21. *Stellar CLI Manual*. https://developers.stellar.org/docs/tools/cli/stellar-cli
22. *Releases · stellar/stellar-cli*. https://github.com/stellar/soroban-cli/releases
23. *Stellar Transaction - Smart Contracts*. https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction
24. *Development & Deployment using Stellar-CLI & create ...*. https://dev.to/riojos/stellar-smart-contract-dapp-development-deployment-using-stellar-cli-create-soroban-dapp-33ad
25. *Making Your First Smart Contract on Stellar Network Using ...*. https://medium.com/@vmaharishi2003/making-your-first-smart-contract-on-stellar-network-using-soroban-cli-44f65c16589b
26. *Stellar Asset Contract (SAC)*. https://developers.stellar.org/docs/tokens/stellar-asset-contract
27. *Developer Tools, SDKs & Core Resources for ... - Stellar*. https://developers.stellar.org/
28. *Assets Overview & Comparison | Stellar Docs*. https://developers.stellar.org/docs/tokens/anatomy-of-an-asset
29. *Stellar Asset Contract (SAC) Tokens*. https://developers.stellar.org/docs/build/guides/tokens
30. *Update guide: Integrate Stellar Asset Contracts · Issue #1848*. https://github.com/stellar/stellar-docs/issues/1848
31. *Invoke a contract function in a transaction using SDKs*. https://developers.stellar.org/docs/build/guides/transactions/invoke-contract-tx-sdk
32. *Cross Contract Calls*. https://developers.stellar.org/docs/build/smart-contracts/example-contracts/cross-contract-call
33. *Making cross-contract calls | Stellar Docs*. https://developers.stellar.org/docs/build/guides/conventions/cross-contract
34. *Deep Dive into Soroban-CLI : soroban contract*. https://dev.to/darkvallen/deep-dive-into-soroban-cli-soroban-contract-1lp0
35. *Invoking soroban smart-contracts functions using PHP-SDK*. https://dev.to/icolomina/invoking-soroban-smart-contracts-functions-using-php-sdk-4j1p
36. *Ingest events published from a contract | Stellar Docs*. https://developers.stellar.org/docs/build/guides/events/ingest
37. *soroban-examples/events/src/lib.rs at main*. https://github.com/stellar/soroban-examples/blob/main/events/src/lib.rs
38. *Publish events from a smart contract.*. https://developers.stellar.org/docs/build/smart-contracts/example-contracts/events
39. *soroban_sdk - Rust*. https://docs.rs/soroban-sdk
40. *Soroban Contract State Management*. https://www.certik.com/blog/soroban-contract-state-management
41. *Announcing Protocol 22*. https://stellar.org/blog/developers/announcing-protocol-22
42. *Stellar Launches X-Ray Privacy Upgrade on Mainnet to ...*. https://www.bitget.com/news/detail/12560605165361
43. *What Connects Poseidon to X-Ray: A Deep Dive into ZKP on Stellar ...*. https://lumenloop.com/news/connects-poseidon-x-ray-deep-dive-zkp-stellar-2
44. *What Connects Poseidon to X-Ray: A Deep Dive into ZKP on Stellar ...*. https://lumenloop.com/news/connects-poseidon-x-ray-deep-dive-zkp-stellar
45. *ZK Proofs on Stellar*. https://developers.stellar.org/docs/build/apps/zk
46. *Fees & Metering | Stellar Docs*. https://developers.stellar.org/docs/build/guides/fees
47. *Metering & Fees: A Structure Designed for Fairness ...*. https://www.youtube.com/watch?v=aKWgPQX0qFg
48. *stellar-protocol/core/cap-0046-07.md at master*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046-07.md
49. *Stellar | How Soroban's Fee Structure Contributes to the ...*. https://stellar.org/blog/developers/sorobans-fee-structure-contributes-stellar-network-scalability
50. *Fees, Resource Limits, and Metering*. https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering
51. *OpenZeppelin Contracts written in Rust for Stellar Soroban*. https://github.com/OpenZeppelin/stellar-contracts
52. *Stellar Smart Contracts Suite - OpenZeppelin Docs*. https://docs.openzeppelin.com/stellar-contracts
53. *Build Secure Smart Contracts on Stellar with OpenZeppelin*. https://www.openzeppelin.com/networks/stellar
54. *OpenZeppelin Contracts and Toolings - Stellar Developer Docs*. https://developers.stellar.org/docs/tools/openzeppelin-contracts
55. *Soroban Contract Wizard | OpenZeppelin x Stellar - YouTube*. https://www.youtube.com/watch?v=iD7ZspsZLVo
56. *Inferara/soroban-security-portal: Unified knowledge base ...*. https://github.com/Inferara/soroban-security-portal
57. *Advanced Security Practices in Soroban: Protecting Your ...*. https://medium.com/@seymenbugay859/advanced-security-practices-in-soroban-protecting-your-smart-contracts-c29981740b5f
58. *Building on Stellar Soroban? Grab this security checklist to ...*. https://veridise.com/blog/audit-insights/building-on-stellar-soroban-grab-this-security-checklist-to-avoid-vulnerabilities/
59. *Your Roadmap to a Soroban Security Audit*. https://www.certora.com/blog/roadmap-to-a-soroban-security-audit
60. *Tag: Soroban*. https://blog.quarkslab.com/tag/soroban.html
61. *Parallelizing Stellar Core: The First Step Toward 5000 TPS*. https://stellar.org/blog/developers/parallelizing-stellar-core-the-first-step-toward-5000-tps
62. *Soroban performance notes & CAPs · stellar · Discussion #1460*. https://github.com/stellar/stellar-protocol/discussions/1460
63. *Multiply 10x Faster Mentally with a Soroban (Abacus ...*. https://www.youtube.com/watch?v=mxAkJ5SQrhk
64. *Stellar | The Road to 5000 TPS: Scaling Stellar in 2025*. https://stellar.org/blog/developers/the-road-to-5000-tps-scaling-stellar-in-2025
65. *Soroban*. https://en.wikipedia.org/wiki/Soroban
66. *Protocol 24 Upgrade Guide*. https://stellar.org/blog/developers/protocol-24-upgrade-guide
67. *Announcing Protocol 23*. https://stellar.org/blog/developers/announcing-protocol-23
68. *Protocol 23 Upgrade Guide*. https://stellar.org/blog/developers/protocol-23-upgrade-guide
69. *What is Whisk? Exploring The Stellar Network's Latest ...*. https://thedefiant.io/education/blockchains/what-is-whisk-exploring-the-stellar-network-s-latest-protocol-23-upgrade
70. *Stellar (XLM) Prepares for Protocol 24 Upgrade*. https://www.mexc.com/news/136761
71. *Stellar | Soroban Security Audit Bank: Raising the Standard ...*. https://stellar.org/blog/developers/soroban-security-audit-bank-raising-the-standard-for-smart-contract-security
72. *Soroban Security Portal*. https://communityfund.stellar.org/project/soroban-security-portal-7ea
73. *Official Rules | Stellar Community Fund - Handbook*. https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank/official-rules
74. *Soroban CAPs 73, 77, 78, 79, 80, 81, 82 --> Awaiting Approval / ...*. https://groups.google.com/g/stellar-dev/c/DpprkshuCs0/m/KvQrzcRYHgAJ
75. [[CAP-73] Supporting Contract Accounts in Funding New G- ...](https://github.com/orgs/stellar/discussions/1668)
76. *Yardstick, Stellar Protocol 26*. https://stellar.org/blog/foundation-news/yardstick-stellar-protocol-26
77. *Stellar Network Upgrade: Increasing Smart Contract Limits*. https://scopuly.medium.com/stellar-network-upgrade-increasing-smart-contract-limits-96dee4a294dd
78. *stellar-protocol/core/cap-0077.md at master*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0077.md
79. *Releases · stellar/rs-soroban-sdk*. https://github.com/stellar/rs-soroban-sdk/releases
80. *Software Versions | Stellar Docs*. https://developers.stellar.org/docs/networks/software-versions
81. *CVE-2026-24889 Detail - NVD*. https://nvd.nist.gov/vuln/detail/CVE-2026-24889
82. *Soroban: Preview Release #2*. https://stellar.org/blog/developers/soroban-preview-release-2
83. *stellar-protocol/core/cap-0074.md at master*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md
84. *Announcing Stellar X-Ray, Protocol 25*. https://stellar.org/blog/developers/announcing-stellar-x-ray-protocol-25
85. *Announcing Stellar X-Ray, Protocol 25*. https://x.com/StellarOrg/status/2011464480866074989
86. *Stellar Developer Meeting: Protocol discussion (CAP-80, CAP ...*. https://lumenloop.com/media/stellar-developer-meeting-protocol-discussion-cap-80-cap-73
87. *stellar-protocol/core/cap-0071.md at master*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md
88. *Stellar Zipper, Protocol 27 Upgrade Guide*. https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide
89. *Implement a contract account with multisig and custom ...*. https://developers.stellar.org/docs/build/smart-contracts/example-contracts/complex-account
90. *Delegation Part Two: (In)sensitive accounts*. https://www.silverfort.com/blog/delegation-part-two-insensitive-accounts/
91. *contractmeta in soroban_sdk - Rust*. https://docs.rs/soroban-sdk/latest/soroban_sdk/macro.contractmeta.html
92. *CVE-2026-26267*. https://www.tenable.com/cve/CVE-2026-26267
93. *Support trait method default implementations ...*. https://github.com/stellar/rs-soroban-sdk/issues/1451
94. *Soroban Contracts 101 : Logging*. https://dev.to/yuzurush/soroban-contracts-101-logging-d85
95. *stellar/rs-soroban-sdk: Rust SDK for Soroban contracts.*. https://github.com/stellar/rs-soroban-sdk
96. *stellar/soroban-examples*. https://github.com/stellar/soroban-examples
97. *Tutorial on fee estimation for soroban transactions*. https://dev.to/rahul-soshte/tutorial-on-fee-estimation-for-soroban-transactions-2p1o
98. *Releases · stellar/stellar-cli · GitHub*. https://github.com/stellar/stellar-cli/releases
