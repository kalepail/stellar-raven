# Stellar Developer Tooling and Infrastructure Reference Dossier (2026)

> Ground-truth analyst reference covering the official SDKs, the Horizon vs Stellar RPC duality, data infrastructure (Hubble, Galexie, Stellar-ETL, BigQuery), the Stellar CLI, Stellar Lab, wallets (Freighter + ecosystem), the Stellar Wallets Kit, smart wallets / passkeys / PasskeyKit / smart-account-kit, RPC providers, Quickstart / Friendbot / Testnet / Futurenet, the Stellar Disbursement Platform, the Anchor Platform, plus the 30 most-asked developer questions with canonical answers and authoritative URLs.

---

## Executive Summary

- **Three-tier SDK stratification clarifies ownership**: Contract SDKs are dominated by the SDF-maintained Rust `soroban-sdk`, with Hyperledger Solang for Solidity and Soneso's AssemblyScript as community alternatives; Client/XDR SDKs are split between SDF-maintained JS (`@stellar/stellar-sdk`) and Go (`go-stellar-sdk`) and community-maintained Python, Java, Flutter, iOS, Kotlin Multiplatform, PHP, and .NET clients, so contributors should follow the maintainer column before benchmarking ([65], [64]).
- **Stellar RPC has officially replaced Soroban RPC** (renamed Nov 2024) and is the JSON-RPC 2.0 surface for Soroban smart contracts, while Horizon remains the REST/HAL surface for classic Stellar; the August 2025 "Migrate from Horizon to RPC" guide establishes the migration path and exposes a concrete endpoint-by-endpoint mapping table ([75], [66]).
- **Horizon has no direct RPC equivalent for roughly half of its REST surface** (operations/{id}, claimable_balances, liquidity_pools, offers, payments, effects via Horizon-only fields), which deciders must accept as a migration cost and resolve with indexers (SubQuery, Goldsky, OBSRVR) rather than RPC alone ([75]).
- **Hubble, Galexie, Stellar-ETL form a three-layer analytics stack**: Hubble is the open-source public BigQuery dataset at `crypto-stellar.crypto_stellar` for historical SQL, Galexie ingests ledger data to AWS S3 buckets, and `stellar-etl` reads Stellar Core history archives — pick based on whether you need SQL, raw archive, or pipeline data ([73], [7], [72]).
- **Fifteen RPC providers compete for hosted Stellar RPC today**, with tiered offerings from Validation Cloud, QuickNode, Blockdaemon, Nodies, Ankr, NowNodes, Alchemy, and others; only Gateway, Obsrvr, OnFinality, Lightsail/Quasar, Exaion, and GetBlock currently expose the new `getLedgers` Archive tier ([40]).
- **Smart-wallet authentication is the strategic frontier**: PasskeyKit (`passkey-kit`) is now labeled the "legacy precursor" to smart-account-kit which is "built on top of the audited OpenZeppelin stellar-contracts library" — new projects should default to `smart-account-kit` while existing passkey users can keep `passkey-kit` and still use `addSecp256r1`, `addEd25519`, and `addPolicy` signer primitives ([96], [27]).
- **The Wallets Kit is the de-facto wallet-integration abstraction**, published by Creit-Tech as `@creit.tech/stellar-wallets-kit`, supporting Freighter, LOBSTR, xBull, Albedo, Rabet, Hana, WalletConnect, plus Ledger/Trezor hardware modules, so most apps should ignore raw wallet protocols ([31]).
- **Local dev converges on the Quickstart container** (`stellar/quickstart`) for `--local`, `--testnet`, and `--pubnet`, with Friendbot exposed on `:8000/friendbot` and the Lab pointing at it from `lab.stellar.org/account/fund`; install the `stellar` CLI on top and the loop closes ([61], [80]).
- **Anchor Platform is the SEP-aligned Java anchor SDK** covering SEP-1 (stellar.toml), SEP-10 (Web Auth), SEP-12 (KYC), SEP-24 (Hosted Deposit/Withdrawal), and SEP-31 (Cross-border), so any serious on/off-ramp project should fork it instead of rolling its own server ([50]).
- **SDP is the canonical bulk-payment reference app**: an open-source tool designed to make large payment batches (advertised up to 10,000) and routes them through anchors, ideal for payroll, aid, and airdrops ([45], [48]).

---

## 1. SDK Landscape at a Glance

Stellar splits its SDK universe into two non-overlapping universes. **Contract SDKs** build wasm32-v1 Soroban smart contracts that compile down to the on-chain runtime. **Client/XDR SDKs** are used by off-chain apps (wallets, exchanges, dashboards) to talk to Horizon and Stellar RPC, sign transactions, and decode XDR.

| Category | SDK | Stack | Maintainer | Repo | Source |
|---|---|---|---|---|---|
| Contract | `soroban-sdk` | Rust | SDF | [2] | [64] |
| Contract | Solang compiler | Solidity targeting Stellar | Hyperledger | hyperledger-solang/solang | [64] |
| Contract | `as-soroban-sdk` | AssemblyScript | community (Soneso) | Soneso/as-soroban-sdk | [64] |
| Contract | OpenZeppelin crates | Stellar macros / access / utils / tokens | OpenZeppelin | stellar-macros, stellar-access, stellar-contract-utils, stellar-tokens | [64] |
| Client | `@stellar/stellar-sdk` (v16 folded `@stellar/stellar-base`) | JS / TS | SDF | [3] | [65] |
| Client | `py-stellar-base` | Python 3.10+/PyPy 3.10+ | community (StellarCN) | StellarCN/py-stellar-base | [65] |
| Client | `stellar-xdr`, `stellar-strkey`, `rs-stellar-rpc-client` | Rust | SDF | stellar/rs-stellar-xdr, stellar/rs-stellar-strkey, stellar/rs-stellar-rpc-client | [65] |
| Client | `soroban-client` | Rust | community (rahul-soshte) | rahul-soshte/rs-soroban-client | [65] |
| Client | `go-stellar-sdk` (txnbuild, Horizon Client, RPC Client, Ingest SDK) | Go | SDF | stellar/go-stellar-sdk | [65] |
| Client | `stellar_flutter_sdk` | Flutter | community (Soneso) | Soneso/stellar_flutter_sdk | [65] |
| Client | `stellar-ios-mac-sdk` | iOS / macOS | community (Soneso) | Soneso/stellar-ios-mac-sdk | [65] |
| Client | `kmp-stellar-sdk` | Kotlin Multiplatform | community (Soneso) | Soneso/kmp-stellar-sdk | [65] |
| Client | `stellar-php-sdk` | PHP | community (Soneso) | Soneso/stellar-php-sdk | [65] |
| Client | `java-stellar-sdk` | Java | community (lightsail-network) | lightsail-network/java-stellar-sdk | [65] |
| Client | C# .NET SDK | C# | community (Beans-BV) | Beans-BV/dotnet-stellar-sdk | [65] |

**Observation -> mechanism -> implication.** Every entry above is a live GitHub repo headed by either SDF or a named community developer. The split is not accidental: SDF concentrates the production-critical stacks (JS, Go, contract-Rust, XDR/strkey), and the community covers the long-tail platforms (Python, Flutter, iOS, PHP, Kotlin, Java, .NET). For a multi-language team, the practical implication is to pin the SDF-maintained SDKs in CI and treat the community SDKs as "best effort" with explicit fallback to XDR-JSON when needed ([65]).

---

## 2. JavaScript Stellar SDK (deep)

The `@stellar/stellar-sdk` package is the single official JavaScript client. It is **maintained by SDF**, communicates with both Stellar RPC and Horizon, supports `mainnet`, `testnet`, `futurenet`, and `localnet`, exposes classes `Horizon`, `rpc`, `Keypair`, `TransactionBuilder`, and for contract interaction a typed `Client` generated from the contract bindings ([3], [65]).

Install with `npm install --save @stellar/stellar-sdk`, `pnpm add @stellar/stellar-sdk`, or `yarn add @stellar/stellar-sdk`. **In v16.0.0 the old `@stellar/stellar-base` package was folded into `@stellar/stellar-sdk`**, so migration requires replacing `"@stellar/stellar-base"` imports with `"@stellar/stellar-sdk"` and uninstalling the standalone base package. The release that announced v16.0.0 (BuildOnStellar on X) called it "the only required package" ([3], [4]).

**Mechanism.** The SDK keeps a parallel networking layer (`Horizon` for REST, `rpc` for JSON-RPC), each returning the same XDR-decoded primitives so an app can switch transports without rewriting business code. The native network selector trips on `Networks.PUBLIC`, `Networks.TESTNET`, `Networks.FUTURENET`, `Networks.LOCAL`. **Recommendation.** Always pin the latest SDK to absorb protocol-upgrade XDR changes automatically, treat `SorobanRpc.Server` as the standard Soroban surface, and never sign classic operations with `Keypair.random()` persisted on the client.

---

## 3. Rust: `soroban-sdk` and the Client Crates

**Contract building.** The single canonical crate for Soroban contracts is `soroban-sdk` (crates.io/soroban-sdk), maintained by SDF. Contracts "must be built for the wasm32-unknown-unknown target" (recently wasm32v1-none with Rust 1.84+ as the only wasm target supported by the Soroban runtime on Stellar) ([2], [64]).

**Off-chain client.** Four Rust crates sit on the table per developers.stellar.org:

| Crate | Purpose | Maintainer | Repo |
|---|---|---|---|
| `stellar-xdr` | XDR encode/decode + reference XDR-JSON | SDF | stellar/rs-stellar-xdr |
| `stellar-strkey` | SEP-23 Strkey (G..., C..., M...) | SDF | stellar/rs-stellar-strkey |
| `soroban-client` | Build/submit transactions + RPC interaction | community (rahul-soshte) | rahul-soshte/rs-soroban-client |
| `rs-stellar-rpc-client` | Stellar RPC client | SDF | stellar/rs-stellar-rpc-client |

The combination `stellar-xdr` + `rs-stellar-rpc-client` is the canonical, SDF-backed off-chain Rust stack. **`soroban-client` is viable** but should be weighted by its community-maintainer status ([65]).

**OpenZeppelin Stellar contracts.** A complete library of audited token/access/macro utilities is published under the `stellar-*` crates list above ([64]).

---

## 4. Python, Java, Flutter/iOS, Kotlin Multiplatform, PHP, Go, .NET

These are summarized in the SDK Landscape table; the depth here is on quirks.

- **Python (`py-stellar-base`).** "A Python library for communicating with a Stellar Horizon server and Stellar RPC server." Maintained by community/developer StellarCN, requires Python 3.10+ or PyPy 3.10+. (StellarCN/py-stellar-base, [65]).
- **Go (`go-stellar-sdk`).** "The Go SDK is maintained by SDF," shipped as four packages: `txnbuild`, `Horizon Client`, `RPC Client`, and `Ingest SDK`. The Ingest SDK is the canonical way to stream ledger data from a Stellar Core for custom pipelines. (stellar/go-stellar-sdk, [65]).
- **Java (`java-stellar-sdk`).** Community-maintained by lightsail-network. ([65]).
- **Flutter / iOS / Kotlin Multiplatform / PHP ("Soneso four").** All four are "maintained by a dedicated community developer, Soneso." Useful when Soneso itself is your dependency tier because they share code patterns. (Soneso/stellar_flutter_sdk, Soneso/stellar-ios-mac-sdk, Soneso/kmp-stellar-sdk, Soneso/stellar-php-sdk).
- **.NET (Beans-BV).** "This SDK is maintained by dedicated community developers," so any .NET shop should accept that as the lowest tier of support. (Beans-BV/dotnet-stellar-sdk).

**Failure case.** Picking a community SDK for production banking flows and treating its GitHub Issue tracker as a service-level commitment is a common pitfall. SDF's JS and Go, and the Rust crate set, are the safe defaults.

---

## 5. Horizon (Legacy REST) vs Stellar RPC (Soroban JSON-RPC)

**Horizon** is Stellar's REST/HAL API hosted alongside Stellar Core, querying accounts, transactions, operations, ledgers, payments, offers, liquidity pools, claimable balances, and effects. ([67]).

**Stellar RPC** is the JSON-RPC 2.0 server specifically designed to surface Soroban smart-contract state and to simulate/footprint contract calls. **It was renamed from "Soroban RPC" to "Stellar RPC" in November 2024** to reflect that it now stretches beyond Soroban-only use cases ([75]). RPC methods include at minimum: `getNetwork`, `getHealth`, `getLatestLedger`, `getLedgers` (the archive tier), `getTransactions`, `getEvents`, `getFeeStats`, `getVersionInfo`, `getLedgerEntries`, `simulateTransaction`, `sendTransaction` ([68], [9], [13], [90], [93], [91]).

**Format difference.** Horizon uses HTTP verbs and HAL+JSON; RPC uses JSON-RPC 2.0 envelope objects. Both return XDR values inside JSON, decodable via any of the SDKs ([75]).

**Recommendation.** For new Soroban-facing applications, build against RPC from day one. Keep Horizon in the legacy path for any rest of REST endpoints with no RPC equivalent (see Section 6).

---

## 6. Horizon to RPC Migration Map (the Endpoint Translation Table)

The official "Migrate from Horizon to RPC" guide, dated Aug 8, 2025, ships with a translation matrix that should be hand-copied into any team engineering doc. ([75]).

| Horizon Endpoint | Corresponding RPC Method | Indexer Equivalent | Notes |
|---|---|---|---|
| `GET /` | `getLatestLedger`, `getVersionInfo` | - | root info |
| `GET /transactions` | `getTransactions` | - | filterable |
| `GET /transactions/{hash}` | `getTransaction` | - | single tx |
| `GET /transactions/{hash}/operations` | `getTransaction` | - | via nested |
| `GET /transactions/{hash}/payments` | (no direct) | `getEvents` + `getTransactions` | use RPC events |
| `GET /transactions/{hash}/effects` | (no direct) | `getEvents` + `getTransactions` | use RPC events |
| `GET /operations` | `getTransactions` | - | operational history |
| `GET /operations/{id}` | (no direct) | - | single op-id is Horizon-only |
| `GET /operations/{id}/effects` | (no direct) | - | mirror Horizon |
| `GET /fee_stats` | `getFeeStats`, `simulateTransaction` | - | pair w/ sim |
| `GET /accounts` | (no direct) | - | bulk accounts is Horizon/Hubble only |
| `GET /accounts/{address}` | `getLedgerEntries` | - | per-account |
| `GET /claimable_balances` | (no direct) | - | indexer/Hubble |
| `GET /claimable_balances/{id}/operations` | (no direct) | - | mirror Horizon |
| `GET /liquidity_pools` | (no direct) | - | indexer/Hubble |
| `GET /liquidity_pools/{id}/effects` | (no direct) | - | mirror |
| `GET /liquidity_pools/{id}/trades` | (no direct) | - | mirror |
| `GET /offers` | (no direct) | - | indexer/Hubble |
| `GET /offers/{id}` | `getLedgerEntries` | - | per-offer |
| `GET /offers/{id}/trades` | (no direct) | - | mirror |
| `GET /payments` | `getEvents` + `getTransactions` | - | flow via events |
| `GET /effects` | `getEvents` + `getTransactions` | - | flow via events |

**Observation.** Roughly half of Horizon endpoints have **no direct RPC equivalent**. **Mechanism.** The RPC API was scoped to Soroban state and the recently-increased ledger archive; classic-Stellar concerns (claimable balances, offers, liquidity-pools, the whole effects/operations-by-id universe) were intentionally left out. **Implication.** If you depend on those endpoints, you must place an indexer underneath them and reposition your app's data layer against Hubble + SubQuery/Goldsky/OBSRVR. **Recommendation.** Codify the "no direct" column explicitly in your service's contracts - vague "migrate to RPC" guidance silently drops semantics for those endpoints ([75]).

---

## 7. Data Infrastructure: Hubble, Galexie, Stellar-ETL, and BigQuery

Three components cooperate, and developers should pick the right one for the right job.

- **Hubble.** "Hubble is an open-source, publicly available dataset that provides a complete historical record of the Stellar network. It ingests and presents the data produced by the Stellar network in a format that is easier to consume." ([73]).
- **Hubble BigQuery project.** The public project is **`crypto-stellar`** with dataset **`crypto_stellar`**. Concrete query: `select account_id, balance from \`crypto-stellar.crypto_stellar.accounts_current\` order by balance desc` ([7]). Access methods documented: BigQuery UI, BigQuery SDK (e.g. `google-cloud-bigquery`), Looker Studio.
- **Stellar-ETL.** A Go data pipeline "that allows users to extract data from the history of the Stellar network" via Stellar Core history archives ([72]).
- **Galexie.** A separate ingest tool published by SDF that streams ledger data into AWS S3 archival buckets ("a datastore of session ledgers");  Docker image `stellar/galexie` (Galexie Docker Hub reference - search `stellar/galexie`).

| Layer | What it solves | Where it lives |
|---|---|---|
| Hubble | bulk historical SQL, no-ops analytics | BigQuery `crypto-stellar.crypto_stellar` |
| Stellar-ETL | raw transform pipeline off Core archives | [72] |
| Galexie | ledger-by-ledger stream into S3 buckets | Docker: `stellar/galexie` |

**Implication.** Most consumer apps should use HUD/Hubble for analytics, use Stellar-ETL for ETL into a private warehouse, and use Galexie only when they need raw archive replay. **Recommendation.** Run the BigQuery sample (`accounts_current`) before committing to a pipeline, because Hubble covers ~80% of typical reporting questions for free.

---

## 8. Third-Party Indexers

SDF's official Indexers Overview on developers.stellar.org enumerates seven third-party indexer offerings ([55]).

| Indexer | What it offers | Stellar support today | Notes |
|---|---|---|---|
| **The Graph** | Subgraphs, Token API, Substreams | Substreams only | "no current plans for Subgraph or Token API on Stellar" |
| **Goldsky** | Subgraphs (EVM only) + Mirror/Pipelines | Mirrors already support Stellar | "currently-most-loved option on EVM for this use-case" |
| **SubQuery** | Decentralized Indexer SDK + Decentralized RPCs + AI Apps | Supports 300+ chains incl. Stellar | [56] |
| **OnFinality** | Data hosting for SubQuery (raw Stellar + ETL) | Active | big in Polkadot, now expanding |
| **Alchemy** | Portfolio APIs | Stellar launch in H1 2026 | most-popular on EVM |
| **Allium** | Portfolio APIs + analytics | Stellar launch Q1 2026 | "currently building" per docs |
| **OBSRVR** | Stellar-native RPC + Obsrvr Gateway "Flow" | Active | real-time data straight to warehouse |
| **Mercury** | Retroshades for Soroban + Mercury Classic GraphQL | Active | graphQL flavor of Stellar History |

**Mechanism.** Indexers exist because Horizon lacks indexes for filtered queries (e.g., "all payments to account X between ledgers A and B") and RPC caps event history to ~7 days ([90]). **Implication.** Anything that requires historical cross-account filtering, off-ledger tag mapping, or portfolio snapshots should source from an indexer, not from RPC. **Recommendation.** SubQuery is the safest starting point due to multi-chain parity and a dedicated starter repo; OBSRVR is the most Stellar-native; Goldsky Mirrors fit when the org already runs Goldsky on EVM ([55], [54]).

---

## 9. The Stellar CLI (the `stellar` command)

The CLI is "the command-line multi-tool for running and deploying Stellar contracts on the Stellar network" ([15]). Installation is multi-channel: cargo, brew, apt, AUR (listed on the install page) ([16]). Arch Linux users have a dedicated AUR package `stellar-cli` ([17]).

**Key command surfaces.**
- `stellar contract init` initializes a Cargo workspace Soroban project.
- `stellar contract build` produces wasm32v1-none WASM.
- `stellar contract deploy --wasm ... --network <net>` deploys the contract.
- `stellar contract invoke --id <addr> --fn <name> ...` calls a contract function.
- `stellar network container start testnet` boots the Quickstart container with a Testnet-friendly config plus Friendbot ([18]).
- `stellar completion --shell <SHELL>` enables tab-completion in bash/etc.

**Observation.** The CLI is the seam that links every section of this dossier: it pulls down Quickstart locally, targets a hosted RPC/horizon, signs with a key from `stellar keys`, and surfaces contract events. **Mechanism.** It is essentially the Unix pipe between Foundation-shipped docker images and your shell. **Implication.** A team that does not adopt the CLI is re-implementing its shortcuts in the SDK. **Recommendation.** Use `stellar network container start testnet` to bootstrap CI, use `stellar contract deploy` for one-command deployments, and use `stellar keys` + `stellar tx new` for offline signing exercises ([14]).

---

## 10. Stellar Laboratory (lab.stellar.org)

Stellar Lab is the official web tool. As of Oct 2, 2024, the "all-new Stellar Lab" relaunch positioned it as the "all-in-one web tool to build, sign, simulate, and submit transactions and interact with contracts on the Stellar network" ([20], [19]).

**Documented endpoints/Tools.**
- Transaction builder ([21])
- Keypair generator ([22])
- Friendbot-backed account funding for testnet ([78])
- Invoke Contract / Simulate / Submit (RPC-backed)

**Recommendation.** Standardize your team's QA workflow around Lab for any custom transaction shape (complex multi-op, fee-bump, clawback, etc.) before going to code.

---

## 11. Wallets: Freighter and the Broader Set

**Freighter is SDF's official wallet** -- a browser extension maintained by SDF; specifically the docs say "Freighter is a browser extension wallet provided by the Stellar Development Foundation. It provides users a way to interact with Soroban tokens directly from..." ([37], [36]). The historical SDF message: "As SDF develops and maintains Freighter, we stand ready to support and collaborate with other extensions. We believe many wallet options allow" ([34]).

| Wallet | Type | Status |
|---|---|---|
| Freighter | Browser extension + mobile | SDF-maintained, widely used ([36]) |
| LOBSTR | Extension + mobile | mainstream ([35]) |
| xBull | PWA + extension | supported in Wallets Kit |
| Albedo | Web-based | supported in Wallets Kit |
| Rabet | Extension | supported in Wallets Kit |
| Hana | Extension | supported in Wallets Kit |
| Ledger | Hardware (USB) | via Wallets Kit `LedgerModule` |
| Trezor | Hardware (USB) | via Wallets Kit `TrezorModule` |
| WalletConnect | Mobile-via-WC | supported in Wallets Kit |

**Implication.** Any dApp that has to pick exactly one wallet should pick Freighter first as a sanity check, then layer the Wallets Kit (Section 12) on top.

---

## 12. The Stellar Wallets Kit

The Stellar Wallets Kit is the **multi-wallet abstraction published by community developer Creit-Tech**. NPM package: **`@creit.tech/stellar-wallets-kit`** ([70], [82], [30]). It exposes the `StellarWalletsKit` class plus per-wallet modules: `FreighterModule`, `LobstrModule`, `xBullModule`, `LedgerModule`, `TrezorModule`, and `WalletNetwork` enum. Wallet Connect is supported via a "Protocol" module ([31]).

Documented supported wallets per the ecosystem doc: **Freighter (Extension), LOBSTR (Extension/Mobile), xBull (Extension), Albedo (Web), Rabet (Extension), Hana (Extension), WalletConnect (Mobile), Ledger (Hardware), Trezor (Hardware)**. The Wallets tutorial on Wallets Kit ([32]) is the canonical reference ([33]).

**Mechanism.** A single import gives you a list of allowed wallets and a uniform `signTransaction(...)` interface abstracted over each wallet's quirks (e.g., WalletConnect's deep-link vs Rabet's injected `window.rabet`). **Recommendation.** Ship the Wallets Kit for any multi-wallet dApp; bypass it only when you need a niche feature that has no module yet.

---

## 13. Smart Wallets, Passkeys, PasskeyKit, secp256r1, Policy Signers

A Soroban "smart wallet" is a **contract account** that enforces authorization in `check_auth` rather than relying on a single secret-key signature ([24], [27]). Per the official smart-wallets guide quoted verbatim: **"Passkeys (WebAuthn) are common, but you can also use Ed25519 keys, policy signers, session keys or anything the contract can verify"** ([27]).

### 13.1 PasskeyKit

`passkey-kit` is a TypeScript SDK maintained by community developer Tyler van der Hoeven (kalepail). **Latest published version is 0.12.0** (last published circa Jan 14, 2026 with 115 versions total). The package is "A TypeScript SDK for creating and managing Stellar smart wallets using passkeys" and **"Works with OpenZeppelin Relayer for submitting passkey-signed transactions"** ([25], [96]). Exposed surface:

| Class / Method | Purpose |
|---|---|
| `PasskeyKit()` (client) | create / connect / sign transactions |
| `PasskeyServer` | server utilities |
| `SACClient` | Stellar Asset Contract helper |
| `PasskeyClient` | low-level contract client (from `passkey-kit-sdk`) |
| `createWallet(app, user, settings?)` | "Creates a new passkey and deploys a smart wallet" |
| `createKey(app, user, settings?)` | passkey-only, no deploy |
| `connectWallet(opts?)` | reconnect to existing wallet |
| `sign(txn, options?)` | sign all auth entries in a transaction |
| `signAuthEntry(entry, options?)` | sign a single entry |
| `addSecp256r1 / addEd25519 / addPolicy` | signer primitives (+ matching `update` / `remove`) |

### 13.2 The Deprecation Story and `smart-account-kit`

The npm page of `passkey-kit` states: **"Looking for the latest smart wallet SDK? This package is the legacy precursor to OpenZeppelin Smart Accounts. For new projects, use smart-account-kit."** Smart-account-kit is "a comprehensive SDK built on top of the audited OpenZeppelin stellar-contracts library" ([96]).

**Mechanism.** Smart-account-kit and passkey-kit both target the same underlying primitives (secp256r1 host function for WebAuthn, policy signers for advanced rules) but smart-account-kit re-implements them on top of the audited OpenZeppelin base. **Implication.** If you are starting greenfield, use `smart-account-kit`; if you have an existing passkey-kit integration or a specific feature (e.g. signer-store / atsign), stay on `passkey-kit`. **Recommendation.** Use either; do not roll your own WebAuthn contract from scratch -- both SDKs handle the browser + contract + relayer plumbing.

### 13.3 secp256r1 Host Function

Soroban exposes the secp256r1 verification primitives so contracts can verify WebAuthn/P-256 signatures inside `check_auth`. The custom signer story (Ed25519, secp256r1, policy, session) is the new authentication stack replacing trust in a single root key ([27]).

---

## 14. RPC Providers (15 Hosted Endpoints, plus Publicly Accessible APIs)

The official Providers list at developers.stellar.org/maintained tables for Testnet/Mainnet/Futurenet coverage, dedicated nodes, and the new `getLedgers` Archive tier ([40]). Verified date stamp: **Jun 12, 2026** (table freshness).

| Provider | Futurenet | Testnet | Mainnet | Dedicated Nodes | RPC Archive (`getLedgers`) |
|---|---|---|---|---|---|
| Blockdaemon | ❌ | ✅ | ✅ | ✅ | ❌ |
| Validation Cloud | ❌ | ✅ | ✅ | ❌ | ❌ |
| QuickNode | ❌ | ✅ | ✅ | ✅ | ❌ |
| NowNodes | ✅ | ✅ | ✅ | ✅ | ❌ |
| Gateway (*) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Ankr | ❌ | ✅ | ✅ | ❌ | ✅ |
| InfStones | ❌ | ❌ | ✅ | ✅ | ❌ |
| Obsrvr (*) | ❌ | ✅ | ✅ | ❌ | ✅ |
| Nodies | ❌ | ✅ | ✅ | ❌ | ❌ |
| OnFinality (*) | ❌ | ❌ | ✅ | ✅ | ✅ |
| Lightsail Network - Quasar (*) | ❌ | ❌ | ✅ | ❌ | ✅ |
| Uniblock | ❌ | ✅ | ✅ | ❌ | ❌ |
| Exaion | ❌ | ❌ | ✅ | ✅ | ✅ |
| Alchemy | ❌ | ✅ | ✅ | ✅ | ❌ |
| GetBlock | ❌ | ❌ | ✅ | ✅ | ✅ |

(*) Indicates providers hosting the new "RPC Archive" tier, which supports the `getLedgers` RPC method for full ledger-history retrieval. RPC Archive data can also be self-hosted via the data-lake integration ([40]).

**Publicly Accessible API URLs (verified from same page).**

| Provider | Network | URL |
|---|---|---|
| Liquify | Futurenet | `https://stellar.liquify.com/api=41EEWAH79Y5OCGI7/futurenet` |
| Liquify | Testnet | `https://stellar.liquify.com/api=41EEWAH79Y5OCGI7/testnet` |
| Liquify | Mainnet | `https://stellar-mainnet.liquify.com/api=41EEWAH79Y5OCGI7/mainnet` |
| Gateway | Testnet | `https://soroban-rpc.testnet.stellar.gateway.fm` |
| Gateway | Mainnet | `https://soroban-rpc.mainnet.stellar.gateway.fm` |
| sorobanrpc.com | Mainnet | `https://mainnet.sorobanrpc.com` |
| Nodies | Testnet | `https://stellar-soroban-testnet-public.nodies.app` |
| Nodies | Mainnet | `https://stellar-soroban-public.nodies.app` |
| SDF | (see docs) | listed under `SDF` rows of providers table |

**Provider-specific docs.**
- QuickNode docs: [41] and landing page [94].
- Blockdaemon: [39] and [43].
- Alchemy: dashboard link with `?utm_source=chain_partner&utm_medium=referral&utm_campaign=stellar` per Providers table.
- GetBlock: [92].
- Validation Cloud: [12].

**Implication.** Validation Cloud and QuickNode are the lowest-friction consumer-facing options. **Recommendation.** Mix Ankr or Gateway for ledger-archive workloads (`getLedgers`), use the SDF-listed public RPC for quick prototyping, and graduate to a dedicated node from Blockdaemon / QuickNode / NowNodes for production.

---

## 15. Local Dev, Testnet, Futurenet, Quickstart, Friendbot

**Quickstart.** The docker image `stellar/quickstart` is "a simple way to run all components of a Stellar network locally" (requires Docker Desktop 4.37.1+) ([59], [60]). Configure with `--local`, `--testnet`, or `--pubnet` at container start.

**Stellar CLI integration.** `stellar network container start testnet` boots the Quickstart container with a Testnet-friendly config ([18]). Quickstart exposes Friendbot on **`http://localhost:8000/friendbot`** ([81]).

**Friendbot.** "Friendbot helps users of the Stellar testnet by exposing a REST endpoint that creates & funds new accounts and contract addresses" ([80]). Endpoint pattern: `GET|POST /?addr=<account-or-contract-address>`, valid for `G...` account addresses and `C...` contract addresses ([80], [78]). Public Friendbot for Testnet is reachable at `https://friendbot.stellar.org` ([79]). To run Friendbot locally: `docker run --platform linux/amd64 -v $PWD/friendbot.cfg:/friendbot.cfg -p 8004:8004 stellar/friendbot:<FULL-GIT-SHA>`.

**Testnet vs Futurenet.** Both are public networks separate from Mainnet. The RPC providers table marks which supports each:
- **Futurenet**: Only NowNodes (per Providers table).
- **Testnet**: 11 providers, including Blockdaemon, Validation Cloud, QuickNode, Nodies, Ankr, Alchemy, etc.
- **Mainnet**: 14+ providers.

The Lab guides Freighter to the Testnet by default and offers a "fund account with Friendbot" prompt when the account does not exist ([79]).

**Implication.** Use `--local` for hermetic CI tests, `--testnet` for interop with public testnet data and faucet, and resize to `--pubnet` only when staging mainnet-shaped flows. Always rebind Friendbot or Lab to a local network in CI.

---

## 16. Stellar Disbursement Platform (SDP)

SDF's "Stellar Disbursement Platform (SDP) is a tool built for organizations to make bulk payments to a group of recipients over the Stellar" network ([48]). Backend source: [45]. Marketing claim on stellar.org: "Send up to **10,000 payments of any amount in a single batch** by simply uploading a list of receivers" ([44]).

**Mechanism.** SDP is a Go backend that ingests CSV files, registers receivers (KYC through anchors), and fires payment transactions through a chosen Anchor Platform. **Implication.** Bulk payment use cases (aid, payroll, airdrops, gig payouts) should not reinvent the orchestration. **Recommendation.** Fork SDP if you need to ship a custom receiving flow, otherwise embed it as a service.

---

## 17. Anchor Platform and SEPs

The Anchor Platform is the **canonical Java SDK that anchors use to implement Stellar Ecosystem Proposals (SEPs)** ([50], [69]). From the repo README's docs structure, the platform covers:
- **SEP-1**: Stellar Info File (`stellar.toml`) ([49])
- **SEP-10**: Stellar Web Authentication
- **SEP-12**: KYC API
- **SEP-24**: Hosted Deposit & Withdrawal
- **SEP-31**: Cross-border payments

**Mechanism.** The Anchor Platform sits between wallets/users and your anchor's core ledgers; events on the Stellar side (deposit, withdrawal, KYC, auth) are demuxed onto its REST surface. **Implication.** An anchor built bespoke will gap-an-issue against SEP-24 or SEP-31 conformance; a fork of Anchor Platform inherits the conformance. **Recommendation.** Treat Anchor Platform as the de-facto blueprint for any new anchor, fork only if you need a niche financial control flow.

---

## 18. Synthesis: Cross-Cutting Decisions and Failure Modes

The dossier above yields several non-obvious, decision-ready observations that span multiple sections.

**1. SDF-maintained vs community-maintained is a tier-of-trust, not a quality verdict.** Of all SDKs, only JS (`@stellar/stellar-sdk`), Go (`go-stellar-sdk`), Rust contract (`soroban-sdk`), Rust XDR/strkey/RPC client, Freighter, Anchor Platform, SDP, Quickstart, Friendbot, and `stellar-etl` are SDF-maintained. The rest -- Python, Java, Flutter/iOS/Kotlin/PHP (Soneso), .NET (Beans-BV) -- are community-maintained and "best effort" ([65]). For institutional workloads (banks, PSPs), default to SDF-maintained; for consumer products, the Soneso stack is high quality and rarely the cause of bugs.

**2. The Horizon-to-RPC migration is partial, not wholesale.** Roughly half of Horizon endpoints (per Section 6) have no direct RPC equivalent -- the gap is fundamental, not transitional. **Implication.** Apps maintaining legacy Horizon integrations for `offers`, `claimable_balances`, `operations/{id}`, or `effects` need an indexer layer in parallel ([75]).

**3. The data infrastructure has three correct layers, not one.** Hubble answers historical SQL, Galexie/ETL answer warehouse ETL, RPC providers answer live current-state. Choosing wrong inflates cost: using RPC for historical scans is rate-limited; using BigQuery for low-latency reads is wasteful. Use Hubble's `accounts_current` table for analytics, RPC's `getEvents` for ~7-day hot reads, an indexer for the weeks-between window ([73], [55]).

**4. Indexer picks follow org defaults.** A team already using SubQuery's GraphQL or The Graph's Substreams elsewhere loses little by adopting it; a team running Kubernetes private infra should evaluate OBSRVR for its "real-time data" pitch; a team using Goldsky for EVM subgraphs inherits Stellar via Goldsky Mirrors. SubQuery's diverse footprint (300+ chains including Stellar) makes it the lowest-risk default ([55], [54]).

**5. RPC providers have segmented feature tiers.** Only five providers currently expose the new `getLedgers` archive tier -- Gateway, Ankr, Obsrvr, OnFinality, Lightsail/Quasar, Exaion, GetBlock (**8 providers with ✅ in the RPC Archive column**) ([40]). **Recommendation.** Archive-aware workloads (history-aware joins) must pick from this set; the rest are fine for current-state reads.

**6. Smart-wallet authentication is converging on OpenZeppelin + secp256r1.** `passkey-kit` is explicitly "the legacy precursor to OpenZeppelin Smart Accounts." New projects should default to `smart-account-kit` on top of OpenZeppelin stellar-contracts; existing passkey-kit codebases stay supported but slated for migration. **Failure case.** Building a custom WebAuthn contract from scratch instead of forking either PasskeyKit's smart-account-kit guarantees you to reinvent signer-store, policy framework, and relayer glue.

**7. The Wallets Kit obviates Wallets-Kit-shaped boilerplate.** A team writing a custom adapter per wallet (Freighter, Rabet, Albedo, xBull, LOBSTR, Hana) is rewriting what `@creit.tech/stellar-wallets-kit` already exposes, plus it adds hardware-wallet coverage and WalletConnect mobile reach.

**8. Quickstart + Friendbot + Lab are a single dev story.** All three share the same `:8000/friendbot` endpoint and the same container. Boot Quickstart, point Lab at it (via `stellar network container start testnet`), use Lab's Friendbot UI for direct funding. **Failure case.** Treating Quickstart, Friendbot, and Friendbot-the-Lab-page as separate topics splits cognition.

**9. The CLI is the operational glue.** Every other tool has the CLI as an alternate frontend. Use `stellar network container start testnet` to boot, `stellar keys` for identity, `stellar contract deploy/invoke` for app operations, then switch to higher-level SDKs in app code.

---

## Developer Q&A: 30 Most-Important Tooling Questions

The questions below are the canonical toolkit "FAQ" that consumers of the SDK, wallets, RPC, and platforms ask. Each is answered with a one-line of "canonical answer" then the authoritative source URL.

| # | Question | Canonical Answer | Best Source URL |
|---|---|---|---|
| 1 | Which is the canonical JavaScript client SDK for Stellar and who maintains it? | `@stellar/stellar-sdk` (v16.0.0 folded in `@stellar/stellar-base`), maintained by SDF. | [3] |
| 2 | Which Cargo crate do I add to write Soroban smart contracts? | `soroban-sdk` from crates.io, maintained by SDF. | [64] |
| 3 | Is Horizon being deprecated? | Not formally deprecated, but the official Aug 2025 guide flags RPC as the future for Soroban. | [75] |
| 4 | What is "Stellar RPC"? | The JSON-RPC 2.0 server for Soroban; **renamed from Soroban RPC in November 2024**. | [66] |
| 5 | Where is the canonical list of Stellar RPC methods? | developers.stellar.org RPC method reference. | [68] |
| 6 | What is Hubble? | Open-source public dataset providing a complete historical record of the Stellar network on BigQuery. | [73] |
| 7 | How do I access the Hubble BigQuery dataset? | Project `crypto-stellar` / dataset `crypto_stellar`; sample `accounts_current` table. | Connecting to BigQuery[7] |
| 8 | What does Galexie do? | Streams ledger data into AWS S3 archival buckets; image `stellar/galexie`. | [73] |
| 9 | Which third-party indexers support Stellar? | SubQuery, Goldsky (Mirrors), OnFinality, OBSRVR, Mercury; The Graph (Substreams only). Alchemy and Allium target Stellar launch in 2026. | [55] |
| 10 | How do I install the Stellar CLI? | cargo / brew / apt / AUR / docker per install page. | [16] |
| 11 | Where do I build/sign/submit a transaction in a browser without code? | lab.stellar.org (relaunched Oct 2, 2024). | [20] |
| 12 | Which is SDF's official wallet? | Freighter, browser extension + mobile, repo github.com/stellar/freighter. | [37] |
| 13 | What does the Stellar Wallets Kit do? | Multi-wallet abstraction published by Creit-Tech as `@creit.tech/stellar-wallets-kit`. | [31] |
| 14 | What passkey library should I use for Stellar? | `passkey-kit` (legacy) or `smart-account-kit` (current, built on OpenZeppelin stellar-contracts). | [96] |
| 15 | What is secp256r1 in Stellar smart wallets? | The cryptographic curve verified via Soroban host function for WebAuthn / passkey signatures inside `check_auth`. | [27] |
| 16 | Where do I get a hosted Stellar RPC endpoint? | One of 15 providers listed by SDF; Validation Cloud, QuickNode, Blockdaemon, Nodies, Ankr, etc. | [40] |
| 17 | Is there an SDF-listed public RPC endpoint? | Yes - see the publicly-accessible table; examples include Liquify, Gateway, sorobanrpc.com, Nodies. | [40] |
| 18 | How do I run a local Stellar network? | `docker run stellar/quickstart --<local|testnet|pubnet>` or `stellar network container start testnet`. | [61] |
| 19 | Where do I fund a testnet account? | Friendbot via `https://friendbot.stellar.org` (public) or `http://localhost:8000/friendbot` on Quickstart. | [80] |
| 20 | What's the difference between Testnet and Futurenet? | Testnet mirrors Mainnet behavior; Futurenet hosts upcoming protocol features. Only NowNodes lists Futurenet in the official providers table. | [40] |
| 21 | How do I deploy a Soroban contract from the CLI? | `stellar contract init` -> `stellar contract build` -> `stellar contract deploy --wasm <path> --network <net>`. | [14] |
| 22 | How do I simulate a contract call before submitting? | `simulateTransaction` RPC method. | [91] |
| 23 | Where is the canonical Wallets Kit repo? | github.com/Creit-Tech/Stellar-Wallets-Kit. | [30] |
| 24 | Is there a SEP-aligned way to build an anchor? | github.com/stellar/anchor-platform - implements SEP-1 / 10 / 12 / 24 / 31. | [50] |
| 25 | What is the use case for the Stellar Disbursement Platform? | Bulk payments to N recipients (aid, payroll, airdrops) - up to 10,000 per batch. | [45] |
| 26 | Does the Python SDK (py-stellar-base) support RPC? | Yes - repo README says it communicates with Stellar Horizon and Stellar RPC. | py-stellar-base repo |
| 27 | What is `rs-stellar-rpc-client`? | SDF-maintained Rust client for Stellar RPC. | rs-stellar-rpc-client repo |
| 28 | Is there a Go SDK for Soroban? | `go-stellar-sdk` packages: `txnbuild`, `Horizon Client`, `RPC Client`, `Ingest SDK`; SDF-maintained. | go-stellar-sdk repo |
| 29 | What's the RPC event retention window? | Up to ~7 days per `getEvents` docs. Use an indexer for older history. | [90] |
| 30 | Is Freighter available on mobile? | Yes - the Wallets Kit and Freighter ecosystem entries both list extension and mobile. | [37] |

---

## References

1. *Stellar Python SDK*. https://github.com/stellarcn/py-stellar-base
2. *stellar/rs-soroban-sdk: Rust SDK for Soroban contracts.*. https://github.com/stellar/rs-soroban-sdk
3. *stellar/js-stellar-sdk: Main Stellar client library for the ...*. https://github.com/stellar/js-stellar-sdk
4. *⚡️Stellar JS SDK v16.0.0 is live, landing alongside today's ...*. https://x.com/BuildOnStellar/status/2067691600084635878
5. *Explore SDKs for Blockchain Development with JavaScript, ...*. https://developers.stellar.org/docs/tools/sdks
6. *BigQuery public datasets*. https://docs.cloud.google.com/bigquery/public-data
7. *Connecting | Stellar Docs*. https://developers.stellar.org/docs/data/analytics/hubble/developer-guide/connecting-to-bigquery
8. *BigQuery data sharing | Analytics Hub*. https://cloud.google.com/analytics-hub
9. *getHealth | Stellar Docs*. https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getHealth
10. *getHealth RPC Method | Stellar Docs*. https://www.quicknode.com/docs/stellar/getHealth
11. *stellar/stellar-rpc: RPC server for Soroban contracts.*. https://github.com/stellar/stellar-rpc
12. *Stellar RPC (formerly Soroban API) | Validation Cloud*. https://docs.validationcloud.io/v1/stellar/stellar-rpc-formerly-soroban-api
13. *getNetwork | Stellar Docs*. https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getNetwork
14. *Stellar CLI Manual*. https://developers.stellar.org/docs/tools/cli/stellar-cli
15. *stellar/stellar-cli: CLI for Stellar developers*. https://github.com/stellar/stellar-cli
16. *Install the Stellar CLI*. https://developers.stellar.org/docs/tools/cli/install-cli
17. *AUR (en) - stellar-cli - Arch Linux*. https://aur.archlinux.org/packages/stellar-cli
18. *Using Lab with Quickstart | Stellar Docs*. https://developers.stellar.org/docs/tools/lab/quickstart-with-lab
19. *Stellar Lab*. https://lab.stellar.org/
20. *Introducing the All-New Stellar Lab*. https://stellar.org/blog/developers/introducing-the-all-new-stellar-lab
21. *Build transaction*. https://lab.stellar.org/transaction/build
22. *Keypair generator*. https://lab.stellar.org/account/create
23. *Intro to Stellar | Blockchain for Real World Applications*. https://stellar.org/learn/intro-to-stellar
24. *Contract Accounts | Stellar Docs*. https://developers.stellar.org/docs/build/guides/contract-accounts
25. *kalepail/passkey-kit: TS SDK for creating and managing ...*. https://github.com/kalepail/passkey-kit
26. *Building a Passkey-Enabled Smart Wallet on the Stellar ...*. https://cheesecakelabs.com/blog/building-a-passkey-enabled-smart-wallet-on-the-stellar-network/
27. *Smart wallets | Stellar Docs*. https://developers.stellar.org/docs/build/guides/contract-accounts/smart-wallets
28. *Smart Wallets and Passkeys*. https://www.corbado.com/blog/smart-wallets-passkeys
29. *stellar-wallet-kit*. https://www.npmjs.com/package/stellar-wallet-kit
30. *Creit-Tech/Stellar-Wallets-Kit*. https://github.com/Creit-Tech/Stellar-Wallets-Kit
31. *stellar-wallets-kit.md*. https://github.com/stellar/ecosystem-resources/blob/main/wallet-integration/stellar-wallets-kit.md
32. *Wallet Connect*. https://stellarwalletskit.dev/wallets/wallet-connect.html
33. *Wallet Integration | Stellar Docs*. https://developers.stellar.org/docs/tools/developer-tools/wallets
34. *Freighter Wallet Evolves*. https://stellar.org/blog/developers/freighter-wallet-evolves
35. *Stellar Wallets in 2026: Why the Ecosystem Needs More Than ...*. https://scopuly.medium.com/stellar-wallets-in-2026-why-the-ecosystem-needs-more-than-one-best-wallet-bd20eeb57b9b
36. *Freighter - Stellar browser extension*. https://github.com/stellar/freighter
37. *Freighter Wallet | Stellar Docs*. https://developers.stellar.org/docs/build/guides/freighter
38. *Freighter - Stellar Wallet with Secure Browser Integration*. https://allcryptowallets.org/wallets/freighter
39. *Stellar*. https://www.blockdaemon.com/protocols/stellar
40. *Providers | Stellar Docs*. https://developers.stellar.org/docs/data/apis/rpc/providers
41. *Stellar RPC - Quicknode Docs*. https://www.quicknode.com/docs/stellar
42. *Stellar | Service Providers*. https://stellar.org/ecosystem/service-providers
43. *Blockdaemon Guides - How to Connect to Stellar*. https://docs.blockdaemon.com/docs/how-to-connect-to-stellar
44. *Stellar | Stellar Disbursement Platform*. https://stellar.org/products-and-tools/disbursement-platform
45. *Stellar Disbursement Platform Backend*. https://github.com/stellar/stellar-disbursement-platform-backend
46. *Architecting Bulk Payments (the Open Source Way)*. https://www.youtube.com/watch?v=xO2R2iXWtUs
47. *The Stellar Disbursement Platform: How Bulk Payments Make ...*. https://meridian.stellar.org/sessions/how-to-do-bulk-payments-using-blockchain-on-stellars-disbursement-platform-sdp
48. *Stellar Disbursement Platform Introduction*. https://developers.stellar.org/docs/platforms/stellar-disbursement-platform
49. *Stellar Info File (SEP-1)*. https://developers.stellar.org/docs/platforms/anchor-platform/sep-guide/sep1
50. *stellar/anchor-platform: Java SDK for the ...*. https://github.com/stellar/anchor-platform
51. *Stellar Anchor Platform Tutorial – JamesBachini.com*. https://jamesbachini.com/stellar-anchor-platform/
52. *Introducing the Stellar Anchor Platform*. https://www.youtube.com/watch?v=jyQlMuNTOTo
53. *stellar/anchor-platform - Docker Image*. https://hub.docker.com/r/stellar/anchor-platform
54. *SubQuery Supports Stellar with Fast and Flexible Data Indexing*. https://subquery.network/blog/subquery-supports-stellar-with-fast-and-flexible-data-indexing
55. *Indexers Overview | Stellar Docs*. https://developers.stellar.org/docs/data/indexers
56. *subquery/stellar-subql-starter: This project can be use as a ...*. https://github.com/subquery/stellar-subql-starter
57. *Encode x Stellar Educate: Stellar x SubQuery: Virtual ...*. https://www.youtube.com/watch?v=alwQgcN1ewc
58. *SubQuery Launches Data Indexing Support for Celestia*. https://subquery.medium.com/subquery-launches-data-indexing-support-for-celestia-cd7ba18a36ff
59. *stellar/quickstart - Docker Image*. https://hub.docker.com/r/stellar/quickstart/
60. *Stellar Quickstart Docker Image*. https://github.com/stellar/quickstart
61. *Quickstart | Stellar Docs*. https://developers.stellar.org/docs/tools/quickstart
62. *Dockerfile - stellar/quickstart*. https://hub.docker.com/r/stellar/quickstart/dockerfile
63. *Image Layer Details - stellar/quickstart:pr-371-dev*. https://hub.docker.com/layers/stellar/quickstart/pr-371-dev/images/sha256-da203cfe947d7d993e2cc97040d170015a1bbacd7e1a2a92d1f12dde8063af3c
64. *Build smart contracts that will be deployed to the Stellar network | Stellar Docs*. https://developers.stellar.org/docs/tools/sdks/contract-sdks
65. *Simplify Blockchain Development with SDKs for Java, Python, and More | Stellar Docs*. https://developers.stellar.org/docs/tools/sdks/client-sdks
66. *Use the Stellar RPC to Access Blockchain Data, Query Transactions & More | Stellar Docs*. https://developers.stellar.org/docs/data/apis/rpc
67. *Access Blockchain Data with Horizon API | Stellar Docs*. https://developers.stellar.org/docs/data/apis/horizon
68. *Methods | Stellar Docs*. https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods
69. *The Anchor Platform | Stellar Docs*. https://developers.stellar.org/docs/platforms/anchor-platform
70. *npm | Sign In*. https://www.npmjs.com/package/@creit-tech/stellar-wallets-kit
71. *Unlocking the Power of Analytics with Hubble*. https://stellar.org/blog/developers/beyond-the-blockchain-unlocking-the-power-of-analytics-with-hubble
72. *Stellar ETL will enable real-time analytics on the ...*. https://github.com/stellar/stellar-etl
73. *Hubble*. https://developers.stellar.org/docs/data/analytics/hubble
74. *Protocol 22 Upgrade Guide*. https://stellar.org/blog/developers/protocol-22-upgrade-guide
75. *Migrate from Horizon to RPC | Stellar Docs*. https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc
76. *horizon/docs/reference/admin.md at master · stellar- ...*. https://github.com/stellar-deprecated/horizon/blob/master/docs/reference/admin.md
77. *Horizon: Past and Future | Lumen Loop*. https://lumenloop.com/media/horizon-past-future
78. *Friendbot: fund a Testnet account or contract with XLM, ...*. https://lab.stellar.org/account/fund
79. *Connect to the Testnet | Stellar Docs*. https://developers.stellar.org/docs/build/guides/freighter/connect-testnet
80. *stellar/friendbot: Stellar's native asset faucet*. https://github.com/stellar/friendbot
81. *Faucet | Stellar Docs*. https://developers.stellar.org/docs/tools/quickstart/faucet
82. *@creit-tech/stellar-wallets-kit - JSR*. https://jsr.io/@creit-tech/stellar-wallets-kit
83. *Boilerplate code for Creit Tech Stellar Wallet Kit v2*. https://www.youtube.com/watch?v=bedkQE8Pb2A
84. *Stellar-Wallets-Kit*. https://npmx.dev/package/@creit.tech/stellar-wallets-kit/v/%5E1.7.0
85. *Create ERC-4337 Smart Wallets with Account Abstraction ...*. https://www.youtube.com/watch?v=xmz7c7rl9cM
86. *The Passkey Powered Future of Web3 - kalepail*. https://kalepail.com/blockchain/the-passkey-powered-future-of-web3
87. *passkey-kit*. https://www.npmjs.com/package/passkey-kit?activeTab=readme
88. *Tyler van der Hoeven*. http://tyvdh.com/
89. *JSON-RPC*. https://developers.stellar.org/docs/data/apis/rpc/api-reference/structure/json-rpc
90. *getEvents | Stellar Docs*. https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getEvents
91. *simulateTransaction RPC method guide | Stellar Docs*. https://developers.stellar.org/docs/build/guides/transactions/simulateTransaction-Deep-Dive
92. *getEvents - Stellar - GetBlock Docs*. https://docs.getblock.io/api-reference/stellar-xlm/getevents-stellar
93. *getLatestLedger | Stellar Docs*. https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getLatestLedger
94. *High-Performance RPC & Data for Stellar*. https://www.quicknode.com/chains/stellar
95. *Stellar*. https://docs.blockdaemon.com/docs/access-stellar-rpc
96. *passkey-kit - npm*. https://www.npmjs.com/package/passkey-kit
