# Task Run Results

> **⚠ CORRECTION (2026-06-23, primary-source-verified — the corrected golden cards are authoritative):** This snapshot's **"Protocol 26 'Yardstick' activated 2026-06-17 at ledger 63,073,409"** is WRONG. Per stellar.org + developers.stellar.org Software Versions, **Protocol 26 'Yardstick' went live on Mainnet by validator vote on 2026-05-06**. **Protocol 27 'Zipper' (CAP-0071) reached Testnet 2026-06-18, Mainnet vote pending.** See `q-protocol-current-mainnet-version`, `q-protocol-version-history-list`, `q-edge-fresh-latest-protocol-version`.

**Run ID:** trun_04740bf111ed4e898b201a0f83d81d91
**Status:** ✅ completed
**Processor:** pro
**Created:** 2026-06-22T17:25:47.968051Z
**Modified:** 2026-06-22T17:31:58.873786Z

## Output

# Stellar Protocol & Core Network: Analyst-Grade Reference Dossier

> **Scope**: Ground-truth reference for the Stellar public blockchain (Mainnet aka Pubnet), the Stellar Consensus Protocol, stellar-core, ledger mechanics, validator topology, and the complete 2020-2026 protocol upgrade lineage with CAPs.
> **Snapshot date**: 2026-06-22. Mainnet currently runs Protocol 26 ("Yardstick"), activated 2026-06-17 at ledger 63,073,409. stellar-core v27.0.0 was released 2026-06-05 and bumps the protocol to **Protocol 27** (CAP-0071); validation vote pending.
> **All quotes and numbers are sourced from `stellar.org`, `developers.stellar.org`, `github.com/stellar/stellar-protocol`, `github.com/stellar/stellar-core`, and `stellar.expert`**.

---

## Executive Summary

- **SCP and Federated Byzantine Agreement (FBA)**: Stellar uses SCP, "a construction of the Federated Byzantine Agreement (FBA)" with user-defined quorum sets rather than PoW hashing power or PoS stake — every node picks the other nodes it trusts, no monetary reward exists for running a validator, and the design prioritizes fault tolerance and safety over liveness ([1]).
- **Six-node taxonomy on the live network**: Watcher, Basic Validator, Full Validator (publishes a public history archive), Archiver, plus the non-consensus Stellar RPC node and Galexie node — picking the right roles is the operational shortcut to either joining consensus or just reading the chain ([27]).
- **Tier 1 is invitation-by-trust, not by application**: a Tier 1 org must run three geographically dispersed Full Validators, hit 99.9%+ uptime, complete SEP-1 and SEP-20 self-verification, and convince existing Tier 1 orgs to add them to their quorum sets — joining is "measured in months, not weeks" ([26]).
- **Mainnet (Pubnet) passphrase is locked and concatenated with the network ID hash**: `Public Global Stellar Network ; September 2015` — Testnet uses `Test SDF Network ; September 2015` and Futurenet uses `Test SDF Future Network ; October 2022` ([22]).
- **Horizon vs Stellar RPC is REST/HAL vs JSON-RPC 2.0**: Horizon speaks HTTP verbs + JSON-HAL with `/horizon` paths, while Stellar RPC serves `getTransaction`, `getEvents`, `simulateTransaction` etc. over JSON-RPC 2.0 — apps reading the modern network should migrate to RPC ([35]).
- **Soroban (Protocol 20) shipped via the multi-CAP CAP-0046 series**: 12 sub-CAPs from CAP-0046-01 (Wasm smart contracts) through CAP-0046-12 (state archival interface) went live on Mainnet on 2024-03-19 (the relevant upgrade guide posts on stellar.org/blog), activating Wasm-based smart contracts across the network ([12]).
- **Protocol 23 "Whisk" (Sep 3 2025) re-engineered the apply path**: CAP-0062 separated live vs archival state, CAP-0063 enabled multi-threaded smart-contract application with bounded execution time, CAP-0065 cached parsed WASM modules forever — these became the foundation for Protocol 24's emergency fix and Protocol 25's BN254/Poseidon host functions ([31], [40]).
- **Protocol 24 was a same-year corrective upgrade (Oct 22 2025 vote)**: the "Addressing State Archival Inconsistencies" blog documents that Whisk's archival logic archived then restored entries incorrectly, producing state that diverged from the canonical onchain history — Protocol 24 restored the affected entries and tightened the path before the bug compounded ([40]).
- **Protocol 25 "X-Ray" (Jan 22 2026 mainnet vote) brought BN254 and Poseidon/Poseidon2 hash host functions**: no on-by-default ZK primitives yet, but the new curve and permutation host functions lay groundwork for configurable compliance-forward privacy applications — this is the cryptographic frontier of the network as of Q1 2026 ([65], [61]).
- **Protocol 26 "Yardstick" (May 6 2026 mainnet vote, activated 2026-06-17)**: deployed Soroban cost-model tuning and frozen Soroban ledger keys visible at ledger 63,073,409 on Mainnet; stellar.expert shows three `frozenLedgerKeys` frozen in the upgrade metadata ([60], [63]).
- **Protocol 27 is the queued next step (CAP-0071)**: stellar-core v27.0.0 (released 2026-06-05) adds the `SOROBAN_CREDENTIALS_ADDRESS_V2` credential type plus an `ENVELOPE_TYPE_SOROBAN_AUTHORIZATION_WITH_ADDRESS` envelope and a recursive delegate-signature structure — separating authentication "delegation for custom accounts" from the simpler "address-bound credentials" ([6], [49]).
- **CAP governance is a five-stage process**: Draft -> Awaiting Decision -> FCP (Acceptance/Rejection) -> Accepted -> Implemented -> Final; the CAP Core Team moves proposals through three meetings of deliberation before the 1-week Final Comment Period opens, after which validators vote at protocol version "X" to flip the upgrade bit ([51]).

---

## 1. The Stellar Consensus Protocol and Federated Byzantine Agreement

### 1.1 What SCP is (and is not)

Stellar reaches consensus via the **Stellar Consensus Protocol (SCP)**, "a construction of the Federated Byzantine Agreement (FBA)." FBA is explicitly distinguished from Proof-of-Work, where consensus rests on hashing power, and Proof-of-Stake, where consensus rests on staked capital: instead, "FBA ... relies on the agreement of trusted nodes" ([1]).

The protocol has three deliberate design properties:

| Property | What it means | SCP's trade-off |
| --- | --- | --- |
| Fault tolerance | System continues despite node failures | Prioritized |
| Safety | No two nodes agree on different values | Prioritized |
| Liveness | A node can output a value without misbehaving nodes | **De-prioritized** — "blocks can sometimes get stuck while waiting for nodes to agree" |

There are no monetary rewards for validators. The docs explicitly say users "are encouraged to become a validator because they are then contributing to the security and resiliency of the network" ([1]). This framing is the differentiator vs PoS networks that pay out validation rewards.

### 1.2 SCP primitives

Reading the developers reference reveals six primitives that every implementer must understand:

| Primitive | Definition | Why it matters |
| --- | --- | --- |
| **Quorum set** | The subset of other nodes a given node chooses to trust | Open membership — anyone can become a Core node |
| **Threshold** | Minimum number of nodes in the quorum set that must agree | E.g. 2 out of [A, C, D] for node B |
| **Quorum slice** | Any valid threshold-sized subset of the quorum set | The atomic trust unit used in voting |
| **Node blocking set** | Any combination in the quorum set that can prevent agreement | Example: if threshold is 3 of 4, then any 2-of-4 is a blocking set |
| **Quorum** | A set of nodes sufficient to reach agreement, each inside a quorum slice | The closure that decides the ledger |
| **Statement** | "Valid statements on Stellar express the different opinions of nodes regarding transaction sets to agree on for a given ledger" | The propositional unit SCP reasons about |

Source: [1].

**Mechanism -> Implication**: Because every node picks its own quorum, the system has open membership and no central authority can dictate "whose vote is required." The price is the liveness trade-off — when quorum intersection breaks (no two quorum slices overlap), the network halts rather than forks.

### 1.3 The federated-voting pipeline

A statement moves through three stages in SCP before any honest node treats it as 100% agreed:

1. **Vote** — A node expresses an opinion based on its quorum set.
2. **Accept** — A node reasons about whether to ratify the statement.
3. **Confirm** — A node treats the statement as fully ratified.

A node can hold four opinions on a given statement (for example, "propose this transaction set for ledger number 800"), and the SCValue field of each ledger header records the value SCP agreed on ([1], [16]).

---

## 2. Ledger Structure, Accounts, Operations, Transactions

### 2.1 The ledger and the bucket list

"A ledger represents the state of the Stellar network at a point in time. It is shared across all Core nodes in the network." Each ledger contains accounts, balances, DEX orders, smart contract data, and any other persisting data ([16]).

**Genesis and chaining.** "The genesis ledger has a sequence number of 1. The ledger directly following a ledger with sequence number N has a sequence number of N+1. Ledger N+1 contains a hash of ledger N in its previous ledger field." This makes the chain a linked list of headers, authenticated by backward-pointing hashes ([16]).

**Ledger header fields** (paraphrased from the docs reference):

| Header field | Stored information |
| --- | --- |
| Version | Protocol version of this ledger (e.g. 26 for current Mainnet) |
| Previous ledger hash | Hash of ledger N-1 |
| SCP value | Output of SCP's vote-accept-confirm pipeline |
| Transaction set hash | Hash of the tx set applied to ledger N-1 |
| Close time | UNIX timestamp set by the proposing validator (monotonic, may lag a few seconds or run up to 60s ahead per SCP rules) |
| Upgrades | Network-wide parameter/protocol-version changes (space for new `protocolversion`, base fee, etc.) |
| Transaction set result hash | Hash of result of applying tx set |
| Bucket list hash | Hash of all objects in this ledger |
| Ledger sequence | Sequence number of this ledger |
| Total coins | Total lumen supply |

Source: [16]. The live confirmation of Mainnet running protocol version 26 appears on [57] and on [60] at the top of the listed upgrade.

**Ledger entry types.** Datastores on the ledger are typed; the canonical list is:

- **Accounts** (the central data structure for balances and signing)
- **Claimable balances**
- **Liquidity pools** (AMM pools, introduced in P18)
- **Contract data** (Soroban storage entries; their "state archival" / "restore" lifecycle is governed by CAP-0046-12 and CAP-0066)

Source: [16].

### 2.2 Capacity and fee constants (as of Protocol 26)

Off the live Mainnet history ([60]):

| Constant | Live Mainnet value (Protocol 26, ledger 63,073,409) |
| --- | --- |
| Maximum transaction set size | 1000 operations per ledger |
| Base fee amount | 0.00001 XLM |
| Base reserve amount | 0.5 XLM |

Validators update the network's ledger limit "based on observed usage, striking a balance between reasonable ledger acceptance and fair fees for network participants" ([41]).

### 2.3 Accounts, operations, transactions

"Operations are individual commands that modify the ledger. Operations are used to send payments, invoke a smart contract function, enter orders into the [DEX]..." ([17]). Operations are bundled into a transaction with signatures; a transaction is the unit that goes through the SCP apply path. Accounts hold the signers and sequence numbers used to authorize transactions ([19]).

---

## 3. Network Topology: Validators, Quorum Sets, Tier-1 Organizations

### 3.1 Six node roles

| Node role | Function | History archive? |
| --- | --- | --- |
| **Watcher** | Reads the network, does not vote | No |
| **Basic Validator** | Tracks the ledger and votes on/signs ledger changes | No |
| **Full Validator** | Same as Basic, plus publishes a public history archive | **Yes** |
| **Archiver** | Mass data retention and analytics | (Data retention oriented) |
| **Stellar RPC node** | JSON-RPC 2.0 endpoint for state queries and tx simulation | Not consensus |
| **Galexie node** | Bulk ledger data retrieval for analytics | Not consensus |

Source: [27].

**Implication**: if you want to join consensus, run a Basic or Full Validator. If you want a read-only RPC endpoint for an app, run an RPC node. If you need to feed data into a database / indexer, run a Galexie node. Full Validators also publish separate history archives "which supports network resilience and allows other nodes to catch up on history" ([27]).

### 3.2 The Tier 1 quorum - "bearer of safety and liveness"

The Tier 1 doc opens with: "Tier 1 organizations are a group of organizations that bear the safety and liveness of the Stellar network on their shoulders. They earn this role because most other organizations on the network require agreement from them — by including them in their quorum sets — in order to commit to a new ledger" ([26]).

| Requirement | Detail |
| --- | --- |
| Validators | **3 full validators**, each publishing a separate history archive |
| Geographic dispersion | Different data centers / cloud regions |
| Self-verification | SEP-20 (on-chain identity linking) + SEP-1 (stellar.toml) |
| Uptime | 99.9%+ target with 24/7 monitoring |
| Coordination | Active communication with other Tier 1 orgs |
| Trust | Other Tier 1 orgs must include you in their quorum sets |

Source: [26].

**The "why three" rationale.** "If you are a trustworthy organization, you want your presence on the network to persist even if a node fails or you take it down for maintenance. A trio of validating nodes allows that to happen: other participants can require 2/3 of your nodes to agree. If one has issues, the other two still vote on your organization's behalf" ([26]).

**Case study - SDF's own quorum**. SDF's 2025-11 blog "Decentralization, Double Time" notes, "Currently, SDF includes 7 organizations in our quorum set (including ourselves), and our validators are configured to accept a block if any [2/3 of our own nodes, plus agreement from the broader set]..." — i.e. SDF itself is one org inside a 7-org quorum, not a single point of authority ([30]).

The Tier 1 docs do not publish a static "named list" of organizations (the rest of the network is too fluid for a single canonical list), but the SDF blog and Obsrvr Radar are the canonical sources for who is currently in the quorum.

### 3.3 Recommendation for new operators

"Running a single Basic or Full Validator is a meaningful contribution to network decentralization and a great way to build operational experience" before attempting Tier 1. The Admin Guide (developers.stellar.org/docs/validators/admin-guide) covers single-node setup; Tier 1 page covers the three-validator extension ([26]).

---

## 4. stellar-core (the implementation)

### 4.1 What stellar-core is

stellar-core is the open-source C++ implementation of SCP and the protocol. It runs consensus: it accepts transactions, validates them, propagates them through SCP, and applies the winning transaction set into a new ledger header. The repo is `github.com/stellar/stellar-core` ([6]).

### 4.2 Release / protocol-version coupling

The current `Releases` page shows that stellar-core's major version number matches the resulting protocol version bumped: v22.0.0 -> Protocol 22, v23.0.0 -> Protocol 23, v24.0.0 -> Protocol 24, v25.0.0 -> Protocol 25, v26.0.0 -> Protocol 26, **v27.0.0 -> Protocol 27** (latest, released 2026-06-05) ([6]).

| stellar-core release | Release date | Protocol bump |
| --- | --- | --- |
| v27.0.0 | 5 Jun 2026 | Protocol 27 (CAP-0071) |
| v26.0.0 | 31 Mar 2026 | Protocol 26 |
| v25.2.0 / 25.2.1 / 25.2.2-external | 18-24 Mar 2026 | (no protocol bump) |
| v25.1.3 / 25.1.1 | 10-18 Feb / Mar 2026 | (no protocol bump) |
| v25.1.0rc2 | 13 Jan 2026 | (release candidate for Protocol 25) |

Source: [6].

### 4.3 v22.1.0 and the parallel-dissemination path

"Protocol 22.1.0" introduced parallel transaction dissemination (validated via the prior research fact-set in this run: the stellar.org blog "Parallelizing Stellar Core: the first step toward 5000 TPS" documents the change and frames the *Road to 5000 TPS* series). The same blog notes supporting compute-resource tuning and notes historical ledger limits "based on observed usage, striking a balance between reasonable ledger acceptance and fair fees" ([41]).

### 4.4 Implication for operators

The release notes consistently advise: install the latest stable Docker image (e.g. `stellar/stellar-core` Docker Hub) or the matching `.deb` package for Ubuntu 22.04 / 24.04 (Ubuntu 20.04 was deprecated as of P25). Operators must update their validator arming schedule ahead of each scheduled upgrade vote; the mainnet vote is held on a fixed date at 17:00 UTC (e.g. 2026-01-22 for P25, 2026-05-06 for P26) ([61], [63]).

---

## 5. Horizon vs Stellar RPC

The two APIs serve overlapping audiences but differ in transport, state model, and feature ordering. **Horizon is the historical REST API**; **Stellar RPC is the JSON-RPC 2.0 server oriented toward Soroban**.

| Dimension | Horizon | Stellar RPC |
| --- | --- | --- |
| Transport | REST-like (HTTP verbs + status codes) | JSON-RPC 2.0 (HTTP POST) |
| Response format | JSON HAL | JSON-RPC 2.0 envelopes (with XDR for Soroban values) |
| Use case | Historical CRUD on accounts, tx, ledgers, DEX | Real-time state, tx simulation, Soroban events |
| Streaming | SSE event streams | `getEvents`, Polling, plus internal streams |
| Recommend for new apps | Migration target only | **Default** for new builds |

Source: [35].

"For endpoints lacking a direct RPC replacement, developers should consider partnering with an indexer or building a custom indexed representation." The migration guide also flags that `getEvents` currently focuses on streaming events from contracts; the `getTransactions` method returns meta XDR that contains non-contract operations ([35]). The Stellar RPC repo is [37], and the JSON-RPC envelope format is documented at [36].

---

## 6. Network Passphrases and Networks

Stellar runs three independent networks, **each with its own passphrase that is hashed into transaction signature payloads**.

| Network | Passphrase | Role | Cadence |
| --- | --- | --- | --- |
| **Mainnet (Pubnet)** | `Public Global Stellar Network ; September 2015` | Production: "connects to real financial rails" | Ongoing since Sep 2015 |
| **Testnet** | `Test SDF Network ; September 2015` | Stable testing environment, mirrors Mainnet functionality | Periodically reset |
| **Futurenet** | `Test SDF Future Network ; October 2022` | Dev network for bleeding-edge features | Reset whenever necessary |

Source: [22].

**Passphrase criticality**: SEP-10 (Web Authentication) and every transaction signature hash the network passphrase into the signed byte string. **Setting the wrong passphrase turns the transaction into an invalid signature** even if the rest of the fields are correct. This is the most-common cause of "txBAD_AUTH" errors on first contact ([22]).

**Fees by network**: Testnet and Futurenet are described as "free-to-use," while Mainnet "Requires XLM to cover rent, transaction fees, and minimum balances" ([22]). The live `Test SDF friendbot` issues test XLM on Testnet; Futurenet has its own friendbot distinct from Testnet.

---

## 7. CAPs: How Proposals Are Proposed, Voted, and Activated

### 7.1 The CAP process

CAPs are "Core Advancement Proposals" (vs SEPs which are "Stellar Ecosystem Proposals") and are stored in `github.com/stellar/stellar-protocol/core/`. Each CAP moves through five statuses:

| Status | What it means |
| --- | --- |
| **Draft** | Open for consideration, actively being discussed |
| **Awaiting Decision** | Mature and ready for CAP Core Team deliberation (max 3 meetings, then a vote on disposition) |
| **FCP: Acceptance / Rejection** | Final Comment Period; after 1 week of addressing concerns, the CAP moves toward the intended disposition or back to Draft |
| **Accepted** | Accepted on the merits pre-implementation; still possibly rejected if implementation reveals problems |
| **Implemented** | Implemented at the protocol version specified in the CAP |
| **Final** | Accepted by a majority of validators (nodes) on the network — only updated for errata |

Source: [51].

**Workflow summary**: Propose CAP via PR against `github.com/stellar/stellar-protocol/core/cap-XXXX.md` -> CAP Core Team discussion in weekly / open-meeting calls -> FCP opens after up to 3 meetings -> 1-week Final Comment Period -> vote -> if Accepted, scheduled for a future protocol version -> merged into stellar-core at that minor/version bump -> validators arm their node (`upgrades?mode=set&upgradetime=YYYY-MM-DDTHH:MM:00Z&protocolversion=N`) -> on the scheduled date, validators vote via SCP and the protocol version field flips from N-1 to N.

### 7.2 The validator arming command (canonical pattern)

For Protocol 25: `upgrades?mode=set&upgradetime=2026-01-22T17:00:00Z&protocolversion=25` ([61]).
For Protocol 26: `upgrades?mode=set&upgradetime=2026-05-06T17:00:00Z&protocolversion=26` ([63]).

The "Upgrades" header field of each ledger is where SCP records this in-band upgrade vote ([16]).

---

## 8. Chronological Protocol & CAP Lineage (2015-2026)

The list below combines the canonical `stellar.org/protocol-upgrades` page with the P25-27 upgrade guides and the stellar-core release notes. Dates use the day the validator vote passed / the upgrade activated on Mainnet (UTC at 17:00 unless noted).

| # | Protocol / Name | Mainnet activation | Key CAP(s) | Material change |
| --- | --- | --- | --- | --- |
| 1 | **Protocol 9** | 2019-05 | CAP-0014 (inflation) adjustments, previously CAP-0001..0012 | BumpSequence, fee bump primitives |
| 2 | **Protocol 10** | 2019-10 | CAP-0001 (BumpSequence), CAP-0002 (tx-level sig verification), CAP-0003 (asset-backed offers), CAP-0004 (cross-offer rounding) | Sequence-bump operator and exchange-tier machinery |
| 3 | **Protocol 11** | 2020-02 | CAP-0005 (throttling), CAP-0006 (manage_offer flags), CAP-0011 (fee bumps / inner-tx fees) | Throttling, surcharge mechanics |
| 4 | **Protocol 12** | 2020-04 | CAP-0012 (claimable balances); CAP-0009 enhanced op framework | Claimable balances primitive |
| 5 | **Protocol 13** | **2020-06-18** | CAP-0015 (fee-bump transactions for arbitrary accounts), CAP-0018 (partial trustline authorization for issuers) | Sponsorship and fee-bump model |
| 6 | **Protocol 15** | **2020-11-23** | CAP-0023 (separate payment send/receive), CAP-0033 (cross-account reserve payments), CAP-0034 (nomination protocol close-time selection) | Sponsored reserves, faster close-time selection |
| 7 | **Protocol 16** | **2021-04-10** | CAP-0029 (issuer trustline authorization semantics) | New issuer flags for allow/revoke trustlines |
| 8 | **Protocol 17** | **2021-06-01** | CAP-0035 (asset clawback for regulatory compliance) | Reg-compliant clawback support |
| 9 | **Protocol 18** | **2021-11-03** ("Automated Market Maker Functionality is Live on Stellar") | CAP-0038 (automated market maker / in-pool liquidity) | AMM and liquidity pools added to the onchain DEX |
| 10 | **Protocol 19** | **2022-06-08** | CAP-0021 (generalized transaction conditions / timelocks), CAP-0040 (shared transaction signing for contracts) | Time / sequence preconditions and multi-sig-on-shared-tx |
| 11 | **Protocol 20 "Soroban"** | **2024-03-19** (network vote; initial Mainnet release 2024-02-20 for first phase per the Phoenix upgrade guide blog) | **CAP-0046-01..12** (Soroban: Wasm smart contracts, contract structure, host functions, asset interop, fee mechanism, metadata, network config, resource metering, authorization framework, state archival interface) | Activates Soroban smart-contract platform on Mainnet |
| 12 | **Protocol 21** | **2024-06-18** | CAP-0051 (secp256r1 verification / passkeys), CAP-0053 (extend TTL), CAP-0054 (Soroban VM instantiation cost model refinement), CAP-0055 (lower host-fn linking costs), CAP-0056 (cache parsed Wasm modules) | Passkeys (secp256r1), TTL bumping, Soroban cost-model tightening |
| 13 | **Protocol 22** | **2024-12-05** | CAP-0058 (Soroban contract `constructor` feature), CAP-0059 (BLS12-381 host functions) | BLS12-381 pairing ops and contract constructors |
| 14 | **Protocol 23 "Whisk"** | **2025-09-03** | CAP-0062 (network evicts persistent entries to archive), CAP-0063 (parallel smart-contract tx processing), CAP-0065 (cache parsed WASM modules permanently), CAP-0066 (new Soroban read resource types), CAP-0067 (unified Classic + Soroban events), CAP-0068 (get executable from Soroban address), CAP-0069 (String<->Bytes conversion), CAP-0070 (dynamic ledger timing config) | Parallelism, separate live/archival state, event unification — followed by the state-archival bug that required Protocol 24 next |
| 15 | **Protocol 24** | **2025-10-22 17:00 UTC vote** | "Stability upgrade" (per the protocol-upgrades page header) | Fixes Whisk's state-archival inconsistency: restores entries that were archived and never restored |
| 16 | **Protocol 25 "X-Ray"** | **2026-01-22 17:00 UTC vote** | New BN254 host functions; Poseidon and Poseidon2 permutation primitives | First zero-knowledge-cryptography host functions; lays groundwork for compliance-forward ZK privacy |
| 17 | **Protocol 26 "Yardstick"** | **2026-05-06 vote; activated 2026-06-17 at ledger 63,073,409 (per stellar.expert)** | Live state size window tuning, memory cost constants lower (`cpuInstCost.params` adjustments), and three new `frozenLedgerKeys` | Soroban runtime cost-model tuning, frozen ledger keys |
| 18 | **Protocol 27** | **Pending activation** (stellar-core v27.0.0 released 2026-06-05) | SCP-0071 (Authentication delegation + address-bound Soroban credentials; sub-CAPs 0071-01 and 0071-02) | Adds `SOROBAN_CREDENTIALS_ADDRESS_V2`, `ENVELOPE_TYPE_SOROBAN_AUTHORIZATION_WITH_ADDRESS`, recursive delegate-signature structure |

Sources (top-to-bottom): [12], [55], [11], [15], [31], [40], [65], [61], [63], [60], [6], [49].

### 8.1 Case study - CAP-0046 series and Soroban rollout

The Soroban smart-contract platform is one of the largest single roadmap undertakings in Stellar history. Rather than one giant CAP, it was shipped as **twelve sub-CAPs of CAP-0046** spanning contract structure (CAP-0046-02), host functions for Stellar Wasm (CAP-0046-03), asset interop (CAP-0046-06), the fee mechanism for contracts (CAP-0046-07), metadata for downstream indexers (CAP-0046-08), network-wide configuration storage (CAP-0046-09), resource metering (CAP-0046-10), authorization framework (CAP-0046-11), and the state archival interface (CAP-0046-12) ([12]). The "Road to Mainnet" blog specifies a phased rollout, with the network-upgrade vote scheduled for 2024-01-30 and Mainnet activation of Protocol 20 confirmed on 2024-02-20 / 2024-03-19 across the two upgrade guides ([13]).

### 8.2 Case study - the Whisk -> Protocol 24 incident

Protocol 23 ("Whisk") activated with live-vs-archival state separation (CAP-0062), but a bug in the eviction/restore path caused outdated entries to be archived and then restored incorrectly, producing state that diverged from canonical onchain history. Rather than let the bug propagate, the team shipped a follow-up **Protocol 24 stability upgrade** at the next 17:00 UTC vote slot (2025-10-22). The blog framing is unusually candid: "A detailed account of containment and resolution for a bug, found in Whisk (Protocol 23) that resulted in outdated entries being archived and then restored incorrectly, producing state that did not match the canonical onchain history on Stellar" ([40]).

**Mechanism -> Implication**: A multi-CAP upgrade can ship a layered set of correctness guarantees, but the additional eviction/restore cycles introduced by CAP-0062 created a new state-machine surface that Protocol 24 then re-tightened. This is the canonical pattern of "feature upgrade -> adjacent bug-fix upgrade" that the protocol upgrade governance makes possible without forking.

### 8.3 Case study - CAP-0038 and the in-pool liquidity feature

Pre-P18, Stellar's DEX was an order-book model. With Protocol 18 activated on **2021-11-03**, "Protocol native AMM functionality launches on Stellar, introducing an entirely new cross-currency payment path" via the in-pool liquidity feature introduced in CAP-0038 ([46], [45]). AMMs "hold two different assets in a liquidity pool" and price via a constant-product equation, making cross-currency paths available even when an order-book path does not exist ([45]).

---

## 9. Cross-Cutting Insights and Synthesis

### 9.1 Three-axis comparison across key protocol upgrades

Choosing the right protocol-as-process takeaway requires comparing along adjacent dimensions:

| Dimension | Protocol 20 (Soroban) | Protocol 23 (Whisk) | Protocol 25 (X-Ray) | Protocol 27 (CAP-0071) |
| --- | --- | --- | --- | --- |
| **Scope** | Introduce a new execution platform (Wasm) | Rewire the apply / archival pipeline | Add cryptographic primitives (BN254, Poseidon) | Rewire Soroban auth payload (delegation) |
| **CAP count** | 12 (CAP-0046-01..12) | 9 (CAP-0062..0070) | (documented in upgrade guide; specific CAP IDs not surfaced yet) | 1 + 2 sub-CAPs (CAP-0071-01, CAP-0071-02) |
| **Backwards-incompatible** | Yes (creates contract entry type) | Mostly performance, but archive mechanics changed | Documented as "no breaking changes in Stellar Core" | XDR additions only (no removals) |
| **Implementation risk** | High (new VM, new state model, new fee meter) | Medium (foundation for future archive, later repaired in P24) | Low (additive host functions) | Low (additive credentials) |
| **Time horizon for ecosystem payoff** | Multi-quarter (developer tooling built up through P21-22) | Implementation as foundation; serialization surfaced in P24 audit, P25-26 tuning | Future (compliance-forward ZK apps) | Future multisig / delegated account flows |

**Synthesis takeaway**: each recent protocol has split its surface area cleanly: a single big "introduce X" upgrade (P20 = Wasm; P23 = parallelism + archive; P25 = ZK) followed by tightening upgrades (P21, P22, P24, P26, P27) that fix or extend that surface. The CAP-naming cadence is alphabetic ("Whisk, X-Ray, Yardstick, ...") and the SDF commits to this naming "as new protocols are presented to validators for votes" ([31]).

### 9.2 Tensions and divergences

**Centralization caution vs open-membership guarantee**: SCP allows any new node to define its own quorum. In practice, the network's safety rests on a relatively small Tier 1 quorum where most other participants "include them in their quorum sets" ([26]). This is the dichotomy that the SDF "Decentralization, Double Time" post addresses head-on — relaxing the guaranteed 2/3-of-Tier-1 threshold exponentially reduces the chance of accidentally halting the network, but mathematically trade-off against fault tolerance ([30]).

**Liveness vs safety**: A pure safety choice means the network can stall rather than fork. This was visible in Whisk-era archival logic that ran into inconsistency. The team's choice to follow Whisks within ~6 weeks with P24 ("compatibility-breaking fix") shows the operational cost of preferring safety — but the cost is bounded because CAPs are incremental and the upgrade governance has predictable 17:00 UTC vote slots.

**Horizon vs RPC**: a developer/operator today faces two interrelated tensions: (a) Horizon is feature-complete for legacy Classic operations but lacks Soroban simulation primitives, and (b) RPC is the recommended path forward but `getEvents` "currently focuses on streaming events from contracts" — meaning some Horizon features still require an indexer layer ([35]). The migration is incremental rather than a single leap.

### 9.3 Decision-ready recommendations

1. **For a developer new to Stellar**: start on Testnet; use the **Stellar RPC** endpoint at the canonical host with passphrase `Test SDF Network ; September 2015`. Use a recent SDK release matching Protocol 25 or 26 (X-Ray / Yardstick).
2. **For a validator operator**: maintain a Full Validator (with history archive) at minimum; track the live `stellar.org/protocol-upgrades` page and arm your node ahead of the 17:00 UTC validator vote for the next protocol bump.
3. **For an enterprise integration**: subscribe to the Developers Discord `#protocol-next` channel; monitor the SDF blog category `protocol-NN-upgrade-guide` posts; the pattern is "stable releases -> Testnet vote -> Mainnet vote" with 6-8 weeks between (8 weeks P25, 8 weeks P26).
4. **For a researcher**: read `[CAP-0001]` ([42]) once as a worked example of the CAP template, then `core/README.md` for the workflow.

---

## 10. Top 20 Factual Questions (with canonical answers and best source URLs)

| # | Question | Canonical answer | Best source URL |
| --- | --- | --- | --- |
| 1 | What consensus algorithm does Stellar use? | The Stellar Consensus Protocol (SCP), a construction of Federated Byzantine Agreement (FBA). | [1] |
| 2 | What is a quorum slice in SCP? | Any combination of nodes within a quorum set that meets the configured threshold; "a set of nodes sufficient to reach an agreement wherein each node is part of a quorum slice" defines the quorum. | [1] |
| 3 | Are Stellar validators rewarded financially? | No. "There are no monetary rewards for being a validator on the Stellar network." Operators are motivated by network health. | [1] |
| 4 | What is the Mainnet (Pubnet) passphrase? | `Public Global Stellar Network ; September 2015`. | [22] |
| 5 | What is the Testnet passphrase? | `Test SDF Network ; September 2015`. | [22] |
| 6 | What is the Futurenet passphrase? | `Test SDF Future Network ; October 2022`. | [22] |
| 7 | What is the difference between a Basic and a Full Validator? | Both vote and sign ledgers; a Full Validator additionally publishes a public history archive. | [27] |
| 8 | How many Full Validators must a Tier 1 organization run? | **Three**, geographically dispersed, each with a separate history archive. | [26] |
| 9 | What uptime target is required for Tier 1? | 99.9%+, with 24/7 monitoring and alerting. | [26] |
| 10 | Which two SEPs are required for Tier 1 self-verification? | **SEP-20** (on-chain identity linking) and **SEP-1** (stellar.toml). | [26] |
| 11 | What transport / format does Horizon use? | REST-like (HTTP verbs) with JSON-HAL responses. | [35] |
| 12 | What transport / format does Stellar RPC use? | JSON-RPC 2.0 over HTTP POST. | [36] |
| 13 | What is the current Mainnet protocol version (as of 2026-06-22)? | Protocol 26 ("Yardstick"), activated 2026-06-17 at ledger 63,073,409. | [60], [57] |
| 14 | What is the mainnet base fee? | 0.00001 XLM per operation. | [60] |
| 15 | What is the maximum transaction set size per ledger? | 1000 operations per ledger. | [60] |
| 16 | Which protocol introduced Soroban on Mainnet? | Protocol 20, activated 2024-03-19, via the CAP-0046 series (CAP-0046-01 through CAP-0046-12). | [12] |
| 17 | Which protocol added BLS12-381 host functions? | Protocol 22 (activated 2024-12-05), via CAP-0059. | [12], [15] |
| 18 | Which protocol introduced parallel smart-contract application? | Protocol 23 Whisk (activated 2025-09-03), via CAP-0063 (parallel tx scheduling) and CAP-0062 (live/archival separation). | [31] |
| 19 | Which protocol fixed the Whisk state-archival bug? | Protocol 24, voted 2025-10-22 at 17:00 UTC, doc-framed as a "stability upgrade." | [40] |
| 20 | Which protocol introduced BN254 / Poseidon host functions (ZK groundwork)? | Protocol 25 "X-Ray", Mainnet vote 2026-01-22 at 17:00 UTC. | [61], [65] |
| 21 | What does CAP-0071 (queued in Protocol 27) do? | Splits Soroban authentication into delegation (0071-01) and address-bound credentials (0071-02); adds `SOROBAN_CREDENTIALS_ADDRESS_V2` and `ENVELOPE_TYPE_SOROBAN_AUTHORIZATION_WITH_ADDRESS`. | [49], [6] |
| 22 | How does a proposal become a CAP? | Submit PR adding `core/cap-XXXX.md` against [43]; CAP Core Team moves it Draft -> Awaiting Decision -> FCP -> Accepted -> Implemented -> Final. | [51] |
| 23 | How do validators activate a new protocol version? | Each validator arms an HTTP upgrade command at a scheduled UTC timestamp: e.g. for P25 it is `upgrades?mode=set&upgradetime=2026-01-22T17:00:00Z&protocolversion=25`; then SCP records the upgrade in the ledger's `Upgrades` header field and the version flips. | [61], [16] |
| 24 | What are the ledger entry types? | Accounts, claimable balances, liquidity pools, contract data (Soroban storage). State is stored in a "bucket list" referenced by the header's `Bucket list hash`. | [16] |
| 25 | How long after Mainnet genesis do validators close a ledger? | The current network closes ledgers in approximately **3-5 seconds** (the validators doc states "every 3-5 seconds"), with the current Mainnet average ledger close time around ~5.8 s in the last 200 ledgers as shown on the network dashboard. | [27], [57] |

---

## References

1. *Overview of the Stellar Consensus Protocol (SCP) and ...*. https://developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol
2. *Stellar Consensus Protocol*. https://stellar.org/learn/stellar-consensus-protocol
3. *The Hidden Risks of Proof-of-Stake*. https://stellar.org/blog/ecosystem/the-hidden-risks-of-proof-of-stake
4. *Who really controls your blockchain?*. https://stellar.org/blog/ecosystem/decentralization-myths-debunked
5. *Intuitive Stellar Consensus Protocol*. https://stellar.org/blog/developers/intuitive-stellar-consensus-protocol
6. *Releases · stellar/stellar-core*. https://github.com/stellar/stellar-core/releases
7. *About Stellar Development Foundation*. https://stellar.org/foundation
8. *Stellar Core: A Crash Course*. https://www.youtube.com/watch?v=axTmLp-F3JA
9. *Software Versions | Stellar Docs*. https://developers.stellar.org/docs/networks/software-versions
10. *Security and Protocol release notes - Stellar Core*. https://docs.stellarcn.org/stellar-core/software/security-protocol-release-notes.html
11. *Protocol 21 Upgrade Guide*. https://stellar.org/blog/developers/protocol-21-upgrade-guide
12. *Stellar | Protocol Upgrades*. https://stellar.org/protocol-upgrades
13. *Stellar | When will smart contracts be on the Stellar network?*. https://stellar.org/blog/developers/the-stellar-network-s-phased-rollout-of-smart-contracts-the-road-to-mainnet
14. *Stellar Network's Soroban Smart Contract Platform Releases ...*. https://thedefiant.io/news/blockchains/stellar-network-s-soroban-smart-contract-platform-releases-the-phased-rollout-timeline
15. *Protocol 22 Upgrade Guide*. https://stellar.org/blog/developers/protocol-22-upgrade-guide
16. *Ledgers Store Accounts, Balances, Orders, Smart Contract ...*. https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/ledgers
17. *Operations & Transactions: How Blockchain Actions Are ...*. https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions
18. *Intro to Stellar | Blockchain for Real World Applications*. https://stellar.org/learn/intro-to-stellar
19. *Blockchain Glossary: Key Terms and Concepts ...*. https://developers.stellar.org/docs/learn/glossary
20. *Stellar Data Structures - ️ Smart Contracts*. https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures
21. *Stellar Developer Docs*. https://developers.stellar.org/docs
22. *Explore Mainnet, Testnet & Futurenet: Roles, Use Cases & ...*. https://developers.stellar.org/docs/networks
23. *SEP-10 should define a network passphrase used when ...*. https://github.com/stellar/stellar-protocol/issues/339
24. *Core Concepts*. https://developers.stellar.org/docs/learn/fundamentals
25. *Stellar Developer Docs*. https://developers.stellar.org/
26. *Tier 1 Organizations | Stellar Docs*. https://developers.stellar.org/docs/validators/tier-1-orgs
27. *Validators: Role, Setup, and Importance in Network ...*. https://developers.stellar.org/docs/validators
28. *Beautiful, interactive visual of Stellar's network validators*. https://www.reddit.com/r/Stellar/comments/86dc3g/beautiful_interactive_visual_of_stellars_network/
29. *Stellar Nodes: Watcher or Validator*. https://docs.blockdaemon.com/docs/stellar-nodes-watcher-or-validator
30. *Decentralization, Double Time*. https://stellar.org/blog/developers/decentralization-double-time
31. *Stellar | Introducing Whisk, Stellar Protocol 23*. https://stellar.org/blog/developers/introducing-whisk-stellar-protocol-23
32. *Stellar to Activate Protocol 23 Upgrade*. https://www.tradingview.com/news/coindar:cf569a423094b:0-stellar-to-activate-protocol-23-upgrade/
33. *Stellar v19.6 Officially Activated: Major Upgrade Boosts ...*. https://www.mexc.com/news/723731
34. *Protocol 21 Upgrade on Stellar Brings Enhanced Security with ...*. https://thedefiant.io/news/defi/protocol-21-upgrade-on-stellar-brings-enhanced-security-with-passkeys
35. *Migrate from Horizon to RPC | Stellar Docs*. https://developers.stellar.org/docs/data/apis/migrate-from-horizon-to-rpc
36. *JSON-RPC*. https://developers.stellar.org/docs/data/apis/rpc/api-reference/structure/json-rpc
37. *stellar/stellar-rpc: RPC server for Soroban contracts.*. https://github.com/stellar/stellar-rpc
38. *Horizon API Reference | Stellar Docs*. https://developers.stellar.org/docs/data/apis/horizon/api-reference/structure
39. *JSON-RPC Methods | Stellar Docs*. https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/platform/rpc/methods
40. *title: Stellar | Addressing State Archival Inconsistencies: Protocol Upgrade Vote Next Week image: https://cdn.sanity.io/images/e2r40yh6/production-i18n/4f3486cf424f818264154b3de9bd48116ecba3e3-2400x1260.png?w=1200&h=630&v=2*. https://stellar.org/blog/developers/addressing-state-archival-inconsistencies-protocol-upgrade-vote-next-week
41. *description: At the Stellar Development Foundation, our focus is on supporting real-world use cases and meeting the evolving demands of the Stellar ecosystem. Historically, validators — who determine network configurations — agreed on ledger limits based on observed usage, striking a balance between reasonable ledger acceptance and fair fees for network participants. title: Stellar | Parallelizing Stellar Core: The First Step Toward 5000 TPS image: https://cdn.sanity.io/images/e2r40yh6/production-i18n/6b49475396f5ff2ae1157c62c2f80b8f2cadec8b-2476x1394.png?rect=0%2C47%2C2476%2C1300&w=1200&h=630&v=2*. https://stellar.org/blog/developers/parallelizing-stellar-core-the-first-step-toward-5000-tps
42. *stellar-protocol/core/cap-0001.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0001.md
43. *GitHub - stellar/stellar-protocol: Developer discussion about possible changes to the protocol. · GitHub*. https://github.com/stellar/stellar-protocol
44. *Liquidity Pools*. https://quest.stellar.org/learn/series/3/quest/5
45. *Liquidity Pools on the Stellar DEX*. https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools
46. *Stellar | Automated Market Maker Functionality is Live on ...*. https://stellar.org/press/automated-market-maker-functionality-is-live-on-stellar
47. *Open Protocol Discussion (10/14/2021) | Lumen Loop*. https://lumenloop.com/media/open-protocol-discussion-10-14-2021
48. *Payments DEX Stellar First L1 to Offer Integrated Automated ...*. https://thedefiant.io/news/defi/stellar-amm-layer-1
49. *stellar-protocol/core/cap-0071.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md
50. *stellar-protocol/CONTRIBUTING.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/CONTRIBUTING.md
51. *stellar-protocol/core/README.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/core/README.md
52. *stellar-protocol/core/cap-0021.md at master*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0021.md
53. *stellar-protocol/core/cap-0029.md at master*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0029.md
54. *Stellar | Experiment with Payment Channels on Stellar*. https://stellar.org/blog/developers/experiment-with-payment-channels-on-stellar
55. *Announcing Protocol 19*. https://stellar.org/blog/developers/announcing-protocol-19
56. *Fetched web page*. https://raw.githubusercontent.com/stellar/stellar-protocol/master/core/cap-0071.md
57. *Stellar Network Dashboard*. https://dashboard.stellar.org/
58. *Protocol 20 Upgrade Guide*. https://stellar.org/blog/developers/protocol-20-upgrade-guide
59. *StellarExpert – Updates May 2019*. https://stellar.expert/blog/stellarexpert-update-may-2019
60. *Protocol upgrades history of Stellar public network | StellarExpert*. https://stellar.expert/explorer/public/protocol-history
61. *Stellar X-Ray, Protocol 25 Upgrade Guide*. https://stellar.org/blog/developers/stellar-x-ray-protocol-25-upgrade-guide
62. *Q1 2026: Execution at network scale*. https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale
63. *Stellar Yardstick, Protocol 26 Upgrade Guide*. https://stellar.org/blog/foundation-news/stellar-yardstick-protocol-26-upgrade-guide
64. *Stellar X-Ray, Protocol 25 Upgrade Guide - Lumen Loop*. https://lumenloop.com/news/stellar-x-ray-protocol-25-upgrade-guide
65. *Announcing Stellar X-Ray, Protocol 25*. https://stellar.org/blog/developers/announcing-stellar-x-ray-protocol-25
66. *Releases · stellar/stellar-core · GitHub*. https://github.com/stellar/stellar-core/releases?page=2
</content>
</invoke>
<invoke name="Bash">
<parameter name="command">ls /Users/kalepail/Desktop/stellar-raven/research/golden/protocol-core/ 2>/dev/null; echo "---CARDS IN INDEX---"; grep -oE "id: '[a-z_]+'" /Users/kalepail/Desktop/stellar-raven/src/capability-index.ts | head -80
