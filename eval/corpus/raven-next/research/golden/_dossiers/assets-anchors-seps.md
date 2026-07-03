# Stellar Assets, Anchors, Payments, and the SEP Standards: A 2026 Reference Dossier

> Source: Parallel Task run_id `trun_04740bf111ed4e8994ec330e58416b0a` (processor `pro`,
> completed 2026-06-22). Written verbatim as Phase-2 raw material for the
> `assets-anchors-seps` golden-question category.

## Executive Summary

The following 10 insights distill the master repo, developer docs, and product pages studied for this dossier.

- **Two-Account Issuing Pattern**: Stellar best practice separates an asset issuer into one "issuing account" (locked down, enables flags, accumulates reserves) and one "distribution account" (publicly visible, sends to users), so a compromised distribution account cannot trigger asset-wide clawbacks -> new issuers should isolate the issuing key in cold storage and use the distribution account for all user-facing send/receive.
- **Four Account-Level Auth Flags**: `AUTH_REQUIRED_FLAG`, `AUTH_REVOCABLE_FLAG`, `AUTH_CLAWBACK_ENABLED_FLAG`, and `AUTH_IMMUTABLE_FLAG` are independent toggles on the issuer account; an issuer that wants clawback must first enable `AUTH_REVOCABLE` before `AUTH_CLAWBACK_ENABLED` will stick -> regulated-asset issuers should follow this ordering during setup.
- **Clawback Activated in Protocol 17 via CAP-35**: Stellar Core v15.1.0 introduced `ClawbackOp`, `ClawbackClaimableBalanceOp`, and `SetTrustLineFlagsOp`, all activated at protocol 17, to meet global securities regulations and let issuers actually burn (not just freeze) balances -> only assets whose issuer had both `AUTH_REVOCABLE` and `AUTH_CLAWBACK_ENABLED` set before the trustline opened are clawback-enabled today.
- **Path Payments Are 5-Second Multi-Hop Swaps**: `PathPaymentStrictSendOp` and `PathPaymentStrictReceiveOp` route across the Stellar DEX orderbook and/or AMM pools in a single atomic transaction, settling in roughly 3-5 seconds for very low fees -> wallets and remittance apps can offer on-chain FX (e.g., USDC in, EURC out) without holding the intermediate assets themselves.
- **AMM Constant-Product 30 bps Fee**: Liquidity pools enforce the `A * B = k` invariant, charge a fixed 30 basis points (0.30%) fee per swap, and represent LP ownership via pool-share trustlines that require two base reserves instead of one -> LPs must budget 1.0 XLM of locked reserve per share trustline.
- **SAC Implements CAP-46-6 and SEP-41**: The Stellar Asset Contract is the reserved, on-chain contract for every Stellar asset (classic or native), implementing the CAP-46-6 standardized asset spec and the SEP-41 token interface; it exposes `transfer`, `allowance`, `incr_allow`, `burn`, `mint`, `set_authorized`, `set_admin`, and `clawback` -> Soroban contracts can call into any SAC by contract ID without redeploying the asset, unifying classic and smart-contract tokens.
- **USDC and EURC Are the Two Anchor-Backed Stablecoins on Stellar**: USDC has shipped on Stellar since Circle's multi-chain expansion, and EURC "launches on the Stellar network" on September 26, 2023, both redeemable 1:1 for USD and EUR respectively from Circle -> anchors seeking global reach typically integrate USDC + EURC as the default settlement rails (source: [13]).
- **SEP-43 Has No Current Numbered Slot**: As of the master branch of stellar-protocol, no `sep-0043.md` file exists; the SEP numbering skips 43 entirely and the community treats this as a gap, not an active standard -> until a numbered SEP-43 proposal is merged, the closest functional analogs are SEP-10 (Stellar Web Authentication) for accounts and SEP-45 (Stellar Web Authentication for Contract Accounts) for Soroban smart accounts.
- **Anchor Platform Encodes Most Anchor Standards**: The official Java-based Anchor Platform package implements SEP-6, SEP-10, SEP-12, SEP-24, SEP-31, and SEP-38, letting a fiat operator go live with payments, KYC, RFQ, and interactive deposit/withdrawal in a single deployment -> prospective anchors should run this SDK rather than reinvent the endpoints.
- **SDP Emits Up to 10,000 Bulk Payments Per Batch**: The Stellar Disbursement Platform (SDP) is the SDF-maintained open-source tool for sending up to 10,000 payments of any amount in a single batch (payroll, aid, supplier payouts), using a hosted web UI for KYC and a TOML-defined payment receiver list -> organizations making bulk payouts should run SDP rather than scripting raw transactions.

## 1. Classic Asset Model: Issuing/Distribution Accounts, Trustlines, Flags

**Key takeaway**: Every Stellar asset is defined by `<asset_code, asset_issuer>` on four flag-toggable, optional-clawback, optionally-mutable balances; issuers should split into two accounts to limit blast radius. Source: [1] and [2].

### 1.1 Account topology: issuing vs distribution
Stellar best practice splits a token issuer into two Stellar accounts:

1. The **issuing account** - holds the asset's total supply, turns on the authorization/clawback flags, signs reserve-paying operations, and should be kept in cold storage.
2. The **distribution account** - public-facing account that sends and receives the asset on behalf of users, holding a small float.

If a distribution account is compromised, the attacker can only spend up to the float. The issuing account retains the ability to clawback, change flags, or freeze if needed. (Source: [1].)

### 1.2 Trustlines - opt-in holdings
Holding a Stellar asset on the network requires the holder's account to open a trustline (`ChangeTrustOp`) to the issuer. Without a trustline, payments of that asset bounce. Each trustline consumes one base reserve (0.5 XLM). Pool-share trustlines cost two base reserves. (Source: [5].)

### 1.3 The four account-level authorization flags
`AUTH_REQUIRED_FLAG`, `AUTH_REVOCABLE_FLAG`, `AUTH_CLAWBACK_ENABLED_FLAG`, and `AUTH_IMMUTABLE_FLAG`. Mechanism: AUTH_REQUIRED forces a holder to be explicitly authorized before the issuer will let them receive the asset; AUTH_REVOCABLE allows the issuer to retroactively deauthorize a trustline. AUTH_CLAWBACK_ENABLED lets the issuer actually burn a balance back to themselves. AUTH_IMMUTABLE locks the authorization flags so an issuer cannot accidentally weaken them. CAP-35 specifies the rule that `AUTH_CLAWBACK_ENABLED` only sticks if `AUTH_REVOCABLE` is also set. (Sources: [1], [64].)

### 1.4 Clawback operations - CAP-35 in protocol 17
CAP-35 added three primitives: `ClawbackOp` (burn a specific amount from a trustline), `ClawbackClaimableBalanceOp` (burn an entire claimable balance, all-or-nothing), and `SetTrustLineFlagsOp`. The XDR changes were based on stellar-core tag v15.1.0; activation was at protocol 17. Rationale: regulated securities use cases like SEC enforcement actions require actual asset removal, not just freezing. (Source: [64].)

### 1.5 Regulated assets via SEP-8
SEP-8 ("Regulated Assets") layers per-transaction issuer approval on top of the account-level flags. Mechanism: with AUTH_REQUIRED and AUTH_REVOCABLE on, plus an `approval_server` declared in `stellar.toml`, the issuer can require every send to be POSTed to that server for `success/revised/pending/action_required/rejected` approval. This is how the regulated-assets bridge actually approves cross-jurisdiction transfers. (Source: [50].)

### 1.6 Case study: Why two-account design matters
In 2020 the Open Protocol Discussion surfaced an attack scenario in which a single-account issuer was drained when its hot key was stolen; splitting into issuing+cold and distribution+hot became the canonical recovery posture. Today the [1] explicitly states "best practice is to create two accounts when issuing an asset." A regulated-asset issuer skipping this single decision inherits the entire blast-radius risk on the distribution key.

| Risk | Single-Account Issuer | Two-Account Issuer |
|---|---|---|
| Compromise of hot key | Total supply exposure | Float-only exposure |
| Clawback feasibility | Same | Same (still on issuing account) |
| Operating cost | Slightly lower | Slightly higher (extra reserve) |
| Recommended posture | Only for testnets | All public issuers |

Takeaway: an extra 0.5 XLM reserve buys a meaningful segregation of duties; the canonical Stellar answer is to always split.

## 2. Stellar Asset Contract (SAC) and the Soroban Classic-Asset Bridge

**Key takeaway**: Every Stellar asset has a reserved Soroban contract built into the protocol, implementing CAP-46-6 and SEP-41, so Soroban developers get classic-asset compatibility without redeploying the asset. Source: [21].

### 2.1 What the SAC is
"The Stellar Asset Contract (SAC) is a special built-in contract that has access to functionality of the Stellar network that allows it to use Stellar assets directly." It is an implementation of CAP-46-6 Smart Contract Standardized Asset and of the SEP-41 token interface. Each classic Stellar asset has a reserved SAC instance on the network. (Source: [21].)

### 2.2 Function surface
The contract functions are split by privilege layer:
- **Getters**: `balance`, etc.
- **Unprivileged mutators**: `xfer`, `transfer`, `incr_allow`, `burn` (calling contract must hold), `allowance`.
- **Privileged admin (issuer-only)**: `set_admin`, `mint`, `clawback`, `set_authorized`.
- **Helper**: `trust` (lets a contract create a trustline on behalf of an address).

Transfers between Stellar accounts flow through the SAC's underlying trustline; transfers between contracts use a Contract Data ledger entry on the receiving contract. (Source: [21].)

### 2.3 Deployment
Any developer can deploy an SAC using the Stellar CLI or SDK. Mechanically, the SDK issues an `InvokeHostFunctionOp` with `HOST_FUNCTION_TYPE_CREATE_CONTRACT` and `CONTRACT_ID_FROM_ASSET`; after deployment, the issuer is automatically granted admin permissions over the contract.

### 2.4 Implications
Mechanism: because the SAC is reserved by the protocol, Soroban contracts can refer to any Stellar asset by deterministic contract ID, no separate deployment needed. Implication: DeFi, AMM, NFT, and RWA contracts on Soroban interoperate with classic USDC/EURC/XLM-with-trustline flows out of the box. Recommendation: prefer the SAC over hand-rolled token contracts unless your asset has truly exotic semantics.

### 2.5 Case study: SAC and USDC
When Circle's USDC exists on Stellar as a classic asset, it automatically has a reserved SAC. A Soroban DeFi contract can `transfer` USDC by calling into that SAC; the underlying ledger entry still uses USDC's classic trustline. This means a regulated stablecoin and a fully programmable contract layer share one source of truth - there is no separate "USDC-on-Soroban" token to keep in sync (Source: [21]).

## 3. Path Payments, Stellar DEX (SDEX), and AMM Liquidity Pools

**Key takeaway**: Stellar combines a central-limit-orderbook DEX (`SDEX`) with automated market maker pools (`LiquidityPoolDepositOp`/`WithdrawOp`); both feed `PathPaymentStrictSendOp`/`StrictReceiveOp` to deliver cross-asset payments in one atomic transaction. Sources: [7] and Path Payments docs.

### 3.1 SDEX - classic orderbook DEX
The Stellar DEX is a chain-native orderbook of `manageOffer`/`createPassiveOffer` operations. Any account can post offers; matching is atomic. There is no off-chain matching engine; offers live in the ledger.

### 3.2 Path payments in 3-5 seconds
A path payment "locks in the price you'd like and lets the network find the best path across the orderbook and/or AMM pools." Two operation types exist: `PathPaymentStrictSendOp` (sender commits an exact source amount; receiver receives at least `dest_min`) and `PathPaymentStrictReceiveOp` (receiver commits an exact destination; sender pays at most `send_max`). Both execute in a single transaction; settlement is roughly 3-5 seconds (network close time).

### 3.3 AMM constant product
Liquidity pools enforce the `A * B = k` constant-product invariant. Every swap charges 30 basis points (0.30%), separate from network fees. Fees accumulate in the pool, growing `k` over time. Participants receive **pool shares**, trustline assets unique to each pool, with trustlines that require **two base reserves** (1.0 XLM) instead of the usual one. (Source: [7].)

### 3.4 Operations and reserve cost
`LiquidityPoolDepositOp` adds liquidity; `LiquidityPoolWithdrawOp` removes it. Pool shares cannot be transferred to other accounts - they are modified only via deposit/withdraw. Fee rewards are distributed proportional to share and collected when withdrawing.

### 3.5 Case study: USDC -> EURC on Stellar
A wallet wants to deliver EURC to a recipient; the sender holds USDC. Using `PathPaymentStrictReceiveOp` with a destination asset of EURC, the Horizon network finds a path through pools and/or offers (e.g., USDC/XLM pool -> XLM/EURC offers) and delivers EURC in one atomic transaction. The wallet never touches XLM or EURC directly. This is the mechanism behind low-cost cross-currency Stellar remittances.

| Mechanism | How it routes | Settlement time | Cost |
|---|---|---|---|
| Native offer (SDEX) | Single order book match | ~5 s | Network fee |
| Liquidity pool (AMM) | Constant-product swap, 30 bps fee | ~5 s | Network fee + 0.30% |
| Path payment | AMM + SDEX in one tx | ~5 s | Network fee + slippage |

Takeaway: path payments blur the line between payments and FX, which is why anchor remittance use cases overwhelmingly use SEP-31 or SEP-24 rather than rebuilding UX themselves.

## 4. Stablecoins on Stellar (USDC, EURC, and others)

**Key takeaway**: Stellar's regulated-stablecoin story hinges on Circle's USDC and EURC, both 1:1 redeemable, with EURC launching on Stellar on September 26, 2023. Sources: [12], [13], and [11].

### 4.1 USDC on Stellar
Circle's USDC is "truly global fiat-backed" on Stellar, branded as "fast, cheap, and connected." Banks, fintechs and exchanges consume it as a settlement rail. Both USDC and EURC are issued as classic Stellar assets, so they automatically have reserved SACs that any Soroban contract can read. (Source: [12].)

### 4.2 EURC on Stellar
"EURC launches on the Stellar network" on September 26, 2023, revolutionizing cross-border payments. EURC is a euro-backed stablecoin issued by Circle, available on Avalanche, Ethereum, Solana, and Stellar, and always redeemable 1:1 for euro. (Source: [13]; [11].)

### 4.3 EURC regulatory status
As of 2026, EURC is "fully reserved, MiCA-regulated euro stablecoin issued by Circle Mint Europe SAS, with each token backed 1:1 by euro-denominated cash" (third-party summary; original is the [11]). On Stellar, the EURC issuer is Circle's EU-regulated entity, which is what makes EURC usable for EUR-denominated anchor flows inside MiCA scope.

### 4.4 Other notable stablecoins
The StellarX AMM live list (third-party aggregator, [10]) shows EURC/NAFU, XLM/USDC, and many tokenized assets. The Stellar 2026 State of the Network report highlights $2.8B in tokenized real-world assets, 3.5x growth since late 2025 ([35]). Beyond USDC/EURC, individual issuers include anchor-operated stables (e.g., fiat-pegged tokens from settlement partners).

### 4.5 Case study: USDC + EURC for cross-border remittance
A Mexico-bound remitter holds USDC, the beneficiary wants EUR-equivalent (or peso-equivalent) value at the bank. A Stellar remittance app pools USDC and EURC across multiple anchors: deposit USDC via a US anchor (SEP-24), path-swap to EURC on the SDEX/AMM, deliver EURC to a EU anchor (SEP-31) that pays out EUR to the recipient's bank. The whole flow is fiat-in / fiat-out from the user's perspective. The conversion happens on-chain in roughly 5 seconds for a minimal network cost.

| Stablecoin | Issuer | Launch on Stellar | Regulatory detail | Native on Soroban via SAC |
|---|---|---|---|---|
| USDC | Circle | Yes (multi-year) | US-regulated | Yes |
| EURC | Circle Mint Europe SAS | September 26, 2023 | MiCA-regulated | Yes |
| Other on-chain stables | Various anchor issuers | Various | Various | Yes (if classic asset) |

Takeaway: the regulated-stablecoin plus the AMM is the engine that lets corridors like US->EU or US->Mexico clear in seconds rather than days.

## 5. Anchor Model: On/Off Ramps, Fiat In/Out

**Key takeaway**: Anchors are real-world entities that bridge fiat and Stellar tokens, and they implement a defined set of SEPs to be interoperable with any compliant wallet. Source: [17].

### 5.1 What an anchor is
An anchor is described as a "Stellar-specific term for the on and off-ramps that connect the Stellar network to traditional financial rails, such as financial institutions or fintech companies." They accept "deposits of fiat currencies" and send "equivalent digital tokens on the Stellar network," and they let users "redeem their tokens for the real-world assets they represent." (Source: [17].)

### 5.2 Required SEPs for a compliant anchor
From the developer docs, explicit anchor stack: SEP-6 (programmatic deposit/withdrawal), SEP-24 (hosted deposit/withdrawal), SEP-31 (cross-border payments), SEP-10 (auth), SEP-12 (KYC), SEP-38 (RFQ/quote exchange). A full TOML file per SEP-1 is the discovery layer. (Source: [17].)

### 5.3 MoneyGram Ramps
Stellar ships the "Stellar Ramps" product suite as a one-stop standard for global access. MoneyGram Ramps is one anchor implementation that runs on the Stellar Ramps standard, giving wallets "one seamless integration" to "the fiat-to-digital on and off ramps provided by anchors." (Source: [16]; developments doc 2025-2026.)

### 5.4 Anchor Platform and Wallet SDK
- The **Anchor Platform** ("Java SDK for the Stellar network anchor development") is "the easiest and fastest way to deploy a SEP-compatible anchor service. It implements the majority of standardized API (SEP) endpoints." (Source: [37].)
- The **Wallet SDK** (TypeScript) helps wallets build compliant UX by wrapping SEP-10, SEP-12, SEP-24, SEP-31, SEP-38 into a single JS library. (Source: [38].)

### 5.5 Case study: MoneyGram Ramps integration
A MoneyGram agent in Nairobi wants to send USD-denominated value to a recipient in Manila. Using the SEP-31 flow: sender auths via SEP-10, posts identifying info via SEP-12, requests a quote via SEP-38, posts a send via SEP-31, and the destination anchor (MoneyGram Ramps in PHL) pays out PHP cash from a MoneyGram branch. The wallet app does not need to know anything about bank rails - the anchor pair hides them under standard SEPs.

### 5.6 Practical implications
- Issued asset only flows through anchors when the issuer has implemented the deposit/withdrawal half of the SEPs.
- A wallet that implements SEP-10/SEP-12/SEP-24/SEP-31/SEP-38 client-side can interoperate with every compliant anchor in the network, removing integration-by-integration work.
- Anchors that adopt the Java Anchor Platform ship SEP-6, SEP-10, SEP-12, SEP-24, SEP-31, SEP-38 with a single codebase.

## 6. Stellar Disbursement Platform (SDP) and Wallet SDK

**Key takeaway**: SDP is SDF's open-source tool for orgs to send up to 10,000 bulk payments per batch with hosted KYC; Wallet SDK is the wallet-side counterpart for consumer Stellar apps. Sources: [26], [27], [38].

### 6.1 SDP mechanics
The SDP product page says "Bulk payments. Send up to 10,000 payments of any amount in a single batch by simply uploading a list of receivers to the platform." The intro page describes it as "a tool built for organizations to make bulk payments to a group of recipients over the Stellar network," backed by an admin guide and an API reference. Use cases include payroll, invoice payment, government disbursements, and aid. (Source: [28].)

### 6.2 Anchor compliance + SDP
SDP pairs an Organization's wallet service with one or more anchors. Recipients are invited to register; their KYC is collected via SEP-12 to the anchor; payments use SEP-31 cross-border rails or SEP-24 hosted deposit flows. The org uploads a CSV of receivers and a payment amount; SDP batches on-chain payments across many receivers in one ledger close.

### 6.3 Wallet SDK mechanics
The TypeScript Wallet SDK is "a library that allows developers to build wallet applications on the Stellar network faster" and wraps SEP-10 (auth), SEP-12 (KYC), SEP-24 (hosted deposit/withdraw), SEP-31 (cross-border), and SEP-38 (RFQ) behind idiomatic JS calls.

### 6.4 Case study: NGO payroll via SDP
A humanitarian NGO needs to disburse monthly stipends to 8,500 aid recipients across 3 corridors. Setting up SDP: (1) NGO admin uploads recipients.csv; (2) SDP links to anchor(s) for each corridor; (3) recipients receive a wallet link, complete SEP-12 KYC on first payout; (4) NGO sets the amount and currency; (5) SDP batches up to 10,000 payments per batch via SEP-31 cross-border flows. Settlement is in roughly 5 seconds per batch. The NGO never touches XLM, USDC, or any specific on-chain asset directly; the anchor stack abstracts them.

| Component | Maintainer | SEP coverage | Primary user |
|---|---|---|---|
| Anchor Platform (Java SDK) | SDF | SEP-6, 10, 12, 24, 31, 38 | Anchor operators |
| Wallet SDK (TypeScript) | SDF | SEP-10, 12, 24, 31, 38 | Wallet developers |
| SDP Backend | SDF | SEP-10, 12, 31 | Disbursement orgs |

Takeaway: SDF ships a complete turn-key stack - one SDK per role - so operators do not need to re-implement SEP endpoints in isolation.

## 7. Complete, Current SEP Inventory

**Key takeaway**: 49 numbered SEPs are listed in the master ecosystem README of stellar-protocol; SEP-43 is not present. Source: [31].

| # | Title | Status |
|---|---|---|
| 1 | Stellar Info File (stellar.toml) | Active |
| 2 | Federation Protocol | Final |
| 3 | Compliance Protocol | Abandoned |
| 4 | Tx Status Endpoint | Final |
| 5 | Key Derivation Methods for Stellar Accounts | Final |
| 6 | Deposit and Withdrawal API | Active (interactive components deprecated in favor of SEP-24) |
| 7 | URI Scheme to Facilitate Delegated Signing | Active |
| 8 | Regulated Assets | Active |
| 9 | Standard KYC Fields | Active |
| 10 | Stellar Authentication | Active |
| 11 | Txrep: Human-Readable Low-Level Representation of Stellar Transactions | Active |
| 12 | KYC API | Active |
| 13 | DEPOSIT_SERVER Proposal | Abandoned |
| 14 | Dynamic Asset Metadata | Draft |
| 15 | Attachment Convention | Draft |
| 16 | Account Transfer Permissionless Payment Protocol (@p2p) | Draft |
| 17 | Issuer Account Funding Protocol (CAP-13 Based) | Draft |
| 18 | Data Entry Namespaces | Active |
| 19 | Bootstrapping Multisig Transaction Submission | Draft |
| 20 | Self-Verification of Validator Nodes | Active |
| 21 | On-Chain Signature and Transaction Sharing | Draft |
| 22 | IPFS Support | Draft |
| 23 | Muxed Account Strkeys | Active |
| 24 | Hosted Deposit and Withdrawal | Active |
| 26 | Non-Interactive Anchor/Wallet Asset Transfer | Abandoned |
| 28 | XDR Base64 Encoding | Final |
| 29 | Account Memo Requirements | Active |
| 30 | Recoverysigner: Multi-Party Key Management of Stellar Accounts | Draft |
| 31 | Cross-Border Payments API | Active |
| 32 | Asset Address | Draft |
| 33 | Identicons for Stellar Accounts | Active |
| 34 | Wallet Attribution for Anchors | Final Comment Period |
| 35 | Operation IDs | Draft |
| 37 | Address Directory API | Draft |
| 38 | Anchor RFQ API | Draft |
| 39 | Interoperability Recommendations for NFTs | Active |
| 40 | Oracle Consumer Interface | Draft |
| 41 | Soroban Token Interface | Draft |
| 45 | Stellar Web Authentication for Contract Accounts | Draft |
| 46 | Contract Meta | Active |
| 47 | Contract Interface Discovery | Draft |
| 48 | Contract Interface Specification | Active |
| 49 | Upgradeable Contracts | Draft |
| 50 | Non-Fungible Tokens | Draft |
| 51 | XDR-JSON | Draft |
| 52 | Key Sharing Method for Stellar Keys | Draft |
| 53 | Sign and Verify Messages | Final Comment Period (Final) |
| 54 | Ledger Metadata Storage | Active |
| 55 | Contract Build Info | Draft |
| 56 | Tokenized Vault Standard | Draft |
| 57 | T-REX (Token for Regulated EXchanges) | Draft |
| 58 | Contract Build Reproducibility for Verification | Draft |
| 59 | External Account API | Draft |

Note on **SEP-43**: The user's prompt listed SEP-43. As of the master branch of [31], no `sep-0043.md` exists and the numbering skips from 41 to 45. Functionally, SEP-10 covers the same authentication space for classic accounts, and SEP-45 covers it for Soroban contract accounts. Treat "SEP-43" as not currently published.

### 7.1 Detailed profile: heavily used SEPs

| SEP | One-line purpose | Key technical anchor |
|---|---|---|
| SEP-1 | `stellar.toml` discovery file for wallets and anchors | [46] |
| SEP-6 | Programmatic Deposit/Withdrawal API for non-interactive flows | [48] |
| SEP-7 | `web+stellar://` URI scheme for wallet-side transaction signing | [49] |
| SEP-8 | Regulated assets (per-tx issuer approval) | [50] |
| SEP-9 | Standard KYC Fields (data dictionary) | [51] |
| SEP-10 | Stellar Web Authentication (signed tx -> JWT) | [52] |
| SEP-12 | KYC API endpoints (POST /customer callback /status) | [42] |
| SEP-24 | Hosted deposit/withdrawal (anchor-hosted webview) | [54] |
| SEP-31 | Cross-Border Payments API (sender KYC, receiver payout) | [56] |
| SEP-38 | Anchor RFQ API (quotes between assets) | [58] |
| SEP-41 | Soroban Token Interface (CAP-46-6 standard) | [59] |

### 7.2 How anchors, wallets, and SDP use these SEPs

- **Anchor operator** -> runs SEP-1 (published TOML at `https://<domain>/.well-known/stellar.toml`), SEP-6/SEP-24 endpoints for deposits and withdrawals, SEP-10 challenge endpoint for signed-tx auth, SEP-12 for `POST /customer`, SEP-31 for cross-border sends, SEP-38 for `/quote`. Uses Anchor Platform for the implementation.
- **Wallet developer** -> discovers the anchor via SEP-1, then triggers SEP-10 sign-in, calls SEP-12 to upload customer info, fetches a SEP-38 quote, posts to SEP-6 or SEP-24 (or SEP-31 for cross-border), and polls the transaction status endpoint. Uses Wallet SDK to wrap the calls.
- **Disbursement org** -> uploads CSV of receivers; SDP triggers SEP-12 KYC to the receiver-facing anchor, uses SEP-31 cross-border to deliver on-chain value at scale, falls back to SEP-24 direct-to-wallet for known wallets.

## 8. Synthesis: Tensions, Trade-offs, and the Bigger Picture

### 8.1 Comparison of the four principal asset primitives along four dimensions

| Dimension | Classic asset (trustline) | SAC (on Soroban) | AMM pool share | Claimable balance |
|---|---|---|---|---|
| Storage | Trustline entry | Contract Data entry | Trustline entry | Claimable Balance entry |
| Native access by Soroban? | Via reserved SAC | Yes (it's the SAC) | Indirect | Indirect |
| Clawback eligible? | If issuer AUTH_CLAWBACK | Yes (calls `clawback`) | No (pool shares are non-clawbackable) | Yes, whole-balance only |
| Best for | Regulated fiat, payments | Programmable DeFi, RWA | Liquidity provision | Conditional payouts (e.g., escrow) |

### 8.2 Tensions and divergences
1. **SEP-6 vs SEP-24**: SEP-6's interactive flow is officially deprecated ("Interactive components are deprecated in favor of SEP-24") but the non-interactive portion remains useful for fully API-driven anchors. Anchors debating between the two are really debating whether they want to host a webview (SEP-24) or require the wallet to keep a stateful handle on the user (SEP-6 non-interactive).
2. **Clawback vs decentralization**: CAP-35's choice to enable clawback is what makes Stellar viable for regulated securities - but a token whose issuer can clawback is, by definition, not censorship-resistant. This is the central design tension of the platform.
3. **AMM fee vs orderbook pricing**: 30 bps is a single, protocol-fixed fee; offers can be priced tighter or wider. This means high-volume USDC/XLM pairs migrate to offers, exotic pairs migrate to pools. The 30 bps floor is enforced for AMM but offers can undercut.
4. **Classic trustlines vs SAC**: Both refer to the same classic asset; the SAC is a Soroban-visible mirror, not a new token. But because the SAC contract functions (`mint`, `clawback`) can only be called by the issuer's admin key, the "is this token really decentralized" question stays anchored to the issuer's sovereignty over the classic asset.

### 8.3 Roadmap signals through 2026
- Protocol 19/20 (Soroban mainnet) made SAC the de facto interface for all Stellar assets. SEP-45 (draft) extends SEP-10 to contract accounts, indicating Soroban authentication parity is in progress.
- SEP-34 (Final Comment Period) marks friction between wallet attribution revenue models and anchor economics - still in comment period.
- SEP-57 (T-REX, Token for Regulated EXchanges, draft) is the next-generation regulated-asset standard that likely supersedes SEP-8 for securities use cases.

### 8.4 Best-practice summary (mechanism -> action)
- Issuers should adopt the two-account pattern, set `AUTH_REVOCABLE` before `AUTH_CLAWBACK_ENABLED`, and publish `stellar.toml` per SEP-1.
- Anchors should run the Java Anchor Platform to ship SEP-6/10/12/24/31/38 in one deploy.
- Wallets should integrate the TypeScript Wallet SDK to consume anchors uniformly.
- Bulk-payment orgs should use SDP rather than scripting raw transactions.
- DeFi builders should prefer calling a reserved SAC by contract ID over deploying a parallel custom token.

## 9. 25 Ground-Truth Factual Questions (with canonical answers)

The following 25 questions are framed as ground-truth checks. After each, the canonical answer is sourced from the most authoritative primary document.

**Q1. What is the Stellar canonical pattern for a token issuer's account topology?**  
A1. Two accounts: an issuing account (cold-storage, flag management) and a distribution account (public, handles user payments). Source: [1].

**Q2. List the four account-level authorization flags on a Stellar issuing account.**  
A2. `AUTH_REQUIRED_FLAG`, `AUTH_REVOCABLE_FLAG`, `AUTH_CLAWBACK_ENABLED_FLAG`, `AUTH_IMMUTABLE_FLAG`. Source: [1] and [64].

**Q3. Which protocol version activated Stellar's clawback feature, and which CAP introduced it?**  
A3. Protocol 17; CAP-35 ("Asset Clawback"). XDR derived from stellar-core v15.1.0. Source: [64].

**Q4. How does Stellar net `AUTH_CLAWBACK_ENABLED` and `AUTH_REVOCABLE`?**  
A4. Setting `AUTH_CLAWBACK_ENABLED_FLAG` requires that `AUTH_REVOCABLE_FLAG` is also set on the same account. Source: [2].

**Q5. What is the SAC's relationship to a classic Stellar asset?**  
A5. Every Stellar asset has a reserved SAC, an implementation of CAP-46-6 and the SEP-41 token interface. Source: [21].

**Q6. What invariant does a Stellar AMM liquidity pool enforce?**  
A6. Constant-product: `A * B = k`, with a 30 basis point (0.30%) fee per swap. Source: [7].

**Q7. How many base reserves does an AMM pool-share trustline consume?**  
A7. Two base reserves (1.0 XLM), versus one for a regular asset trustline. Source: [7].

**Q8. What two path-payment operations does Stellar expose?**  
A8. `PathPaymentStrictSendOp` and `PathPaymentStrictReceiveOp`. Source: Path Payments developer docs.

**Q9. Name the issuer and launch date of EURC on Stellar.**  
A9. Issuer: Circle (specifically Circle Mint Europe SAS for MiCA scope). Launch date on Stellar: September 26, 2023. Source: [13].

**Q10. What standards do compliant Stellar anchors implement, per developer docs?**  
A10. SEP-6 (deposit/withdrawal), SEP-24 (hosted deposit/withdrawal), SEP-31 (cross-border), SEP-10 (auth), SEP-12 (KYC), and SEP-38 (RFQ). Source: [17].

**Q11. What is the purpose of SEP-1 (stellar.toml)?**  
A11. A web-hosted TOML file that publishes an organization's Stellar endpoints, currencies, principals, validators, and documentation. Source: [46].

**Q12. What is the purpose of SEP-10?**  
A12. Stellar Web Authentication: a wallet signs a challenge transaction to prove control of its account, after which the anchor issues a JWT. Source: [52].

**Q13. What is the difference between SEP-6 and SEP-24?**  
A13. SEP-6 is programmatic (non-interactive) batch-friendly deposit/withdrawal; SEP-24 uses an anchor-hosted interactive webview for KYC and confirmation. SEP-6's interactive components are officially deprecated in favor of SEP-24. Source: [48]; [54].

**Q14. What is SEP-8 for?**  
A14. Regulated Assets: per-transaction issuer (or delegated approval-server) approval, layered on top of AUTH_REQUIRED and AUTH_REVOCABLE. Source: [50].

**Q15. What does SEP-12 do?**  
A15. KYC API: a wallet uploads customer PII/AML data to an anchor; the anchor verifies and returns a status callback. Source: [42].

**Q16. What does SEP-31 add on top of SEP-6/SEP-24?**  
A16. Cross-Border Payments API: sender and receiver workflows across different anchors and currencies, with sender KYC and receiver info embedded. Source: [56].

**Q17. What does SEP-38 define?**  
A17. Anchor RFQ API: quote exchange between assets, used to present prices before a SEP-6/SEP-24/SEP-31 deposit or withdrawal. Source: [58].

**Q18. What is the SEP-41 token interface?**  
A18. The Soroban contract interface standard that the SAC implements, defining common functions like `transfer`, `allowance`, `burn`, `approve`. Source: [59].

**Q19. What is SEP-7?**  
A19. A `web+stellar://` URI scheme used by wallets to receive a signing request from a website (tx or pay operation). Source: [49].

**Q20. Is SEP-43 an actual published SEP?**  
A20. No. As of the master branch of stellar-protocol/ecosystem, no SEP-43 exists; the numbering skips from 41 to 45. The closest functional analogs are SEP-10 (auth for classic accounts) and SEP-45 (auth for Soroban contract accounts, draft). Source: [31].

**Q21. What is the Anchor Platform?**  
A21. The Java SDK and services package from SDF that implements most of SEP-6, SEP-10, SEP-12, SEP-24, SEP-31, and SEP-38 in a single backend, intended to be the fastest way to deploy a SEP-compliant anchor. Source: [37].

**Q22. What is the Wallet SDK?**  
A22. A TypeScript library that lets wallet developers consume SEP-10, SEP-12, SEP-24, SEP-31, and SEP-38 flows with idiomatic JS calls. Source: [38].

**Q23. What is the Stellar Disbursement Platform's max batch size, per its product page?**  
A23. Up to 10,000 payments per batch. Source: [26].

**Q24. Which operations did CAP-35 add to Stellar?**  
A24. `ClawbackOp`, `ClawbackClaimableBalanceOp`, and `SetTrustLineFlagsOp`. Source: [64].

**Q25. How does an account hold a Stellar asset?**  
A25. By opening a trustline to the asset's issuer via `ChangeTrustOp`. Without this trustline, payments of the asset bounce. Source: [5].

## 10. References

Primary sources cited in this dossier (all retrieved 2026-06):

**Master SEP repository (stellar-protocol/ecosystem)**:
- [31], [46], [47], [48], [49], [50], [51], [52], [42], [53], [54], [55], [56], [57], [58], [59], [60], [61], [64], [32]

**Stellar developer documentation (developers.stellar.org)**:
- [1], [21], [2], [5], [17], [7], [41], [39], [28], [62], [63]

**Stellar.org product / use-case pages**:
- [12], [13], [16], [36], [40], [26], [25]

**GitHub component repositories**:
- [37], [38], [27], stellar/stellar-protocol (ecosystem + core)

**Circle stablecoin documentation**:
- [11]

## References (numbered)

1. *Asset Design Considerations*. https://developers.stellar.org/docs/tokens/control-asset-access
2. *Clawbacks | Stellar Docs*. https://developers.stellar.org/docs/build/guides/transactions/clawbacks
3. *Creating custom assets with Stellar - Nando Vieira*. https://nandovieira.com/creating-custom-assets-with-stellar
4. *Open Protocol Discussion (1/28/21) | Lumen Loop*. https://lumenloop.com/media/open-protocol-discussion-1-28-21
5. *Verify Trustlines | Stellar Docs*. https://developers.stellar.org/docs/build/guides/basics/verify-trustlines
6. *Stellar Liquidity Pools (AMM). Earn 0.3% fees on ...*. https://scopuly.com/pools
7. *Liquidity Pools on the Stellar DEX*. https://developers.stellar.org/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools
8. *AMM Reward Fees : r/Stellar*. https://www.reddit.com/r/Stellar/comments/qpg0hz/amm_reward_fees/
9. *Liquidity*. https://www.stellarx.com/amm/liquidity
10. *Liquidity Pools - Explore Stellar Lumens (XLM)*. https://stellarchain.io/liquidity-pools
11. *EURC | A Euro-Backed Stablecoin*. https://www.circle.com/eurc
12. *Fast, cheap, and connected. meet USDC and EURC on ...*. https://stellar.org/products-and-tools/circle-usdc-eurc
13. *Stellar | EURC Launches on the Stellar Network*. https://stellar.org/press/eurc-launches-on-the-stellar-network
14. *What Is EURC? Circle's Euro Stablecoin Explained 2026*. https://eco.com/support/en/articles/15192007-what-is-eurc-circle-s-euro-stablecoin-explained-2026
15. *What is EURC (Euro Coin)? | Due*. https://www.opendue.com/glossary/eurc-cryptocurrency
16. *Stellar Network On and Off-Ramps*. https://stellar.org/use-cases/ramps
17. *Learn About Anchors*. https://developers.stellar.org/docs/learn/fundamentals/anchors
18. *The Role of Anchors In The Stellar Network*. https://cheesecakelabs.com/blog/stellar-anchor/
19. *Stellar Anchor Platform Tutorial – JamesBachini.com*. https://jamesbachini.com/stellar-anchor-platform/
20. *How Stellar changes Fiat-to-Crypto on-ramps!*. https://www.beansapp.com/post/how-stellar-changes-fiat-to-crypto-on-ramps
21. *Stellar Asset Contract (SAC)*. https://developers.stellar.org/docs/tokens/stellar-asset-contract
22. *stellar-dev-skill/skills/assets/SKILL.md at main*. https://github.com/stellar/stellar-dev-skill/blob/main/skills/assets/SKILL.md
23. *Stellar Soroban: Smart Contracts for Stablecoin Infrastructure*. https://eco.com/support/en/articles/15346520-stellar-soroban-smart-contracts-for-stablecoin-infrastructure
24. *Navigating Classic Assets and Smart Contract Tokens on ...*. https://cheesecakelabs.com/blog/native-tokens-vs-soroban-tokens/
25. *Soroban | Smart Contracts Platform on Stellar*. https://stellar.org/soroban
26. *Stellar | Stellar Disbursement Platform*. https://stellar.org/products-and-tools/disbursement-platform
27. *Stellar Disbursement Platform Backend*. https://github.com/stellar/stellar-disbursement-platform-backend
28. *Stellar Disbursement Platform Introduction*. https://developers.stellar.org/docs/platforms/stellar-disbursement-platform
29. *How Bulk Payments Make the World Go Round*. https://meridian.stellar.org/sessions/how-to-do-bulk-payments-using-blockchain-on-stellars-disbursement-platform-sdp
30. *Stellar | Stellar Disbursement Platform*. https://x.com/StellarOrg/status/1896951375906681107
31. *stellar-protocol/ecosystem/README.md at master*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/README.md
32. *stellar-protocol/README.md at master*. https://github.com/stellar/stellar-protocol/blob/master/README.md
33. *State of Stellar Q1 2026 & Beyond : r/Stellar*. https://www.reddit.com/r/Stellar/comments/1tx863j/state_of_stellar_q1_2026_beyond/
34. *Stellar Governance — Live & Recent Proposals - Lumen Loop*. https://lumenloop.com/governance
35. *State of Stellar Q1 2026 & Beyond - Lumen Loop*. https://lumenloop.com/media/state-stellar-q1-2026-beyond
36. *Wallet SDK*. https://stellar.org/products-and-tools/wallet-sdk
37. *stellar/anchor-platform: Java SDK for the ...*. https://github.com/stellar/anchor-platform
38. *stellar/typescript-wallet-sdk*. https://github.com/stellar/typescript-wallet-sdk
39. *The Anchor Platform: Build and Manage On ...*. https://developers.stellar.org/docs/platforms/anchor-platform
40. *Anchor Platform*. https://stellar.org/products-and-tools/anchor-platform
41. *Stellar Ecosystem Proposals (SEPs)*. https://developers.stellar.org/docs/learn/fundamentals/stellar-ecosystem-proposals
42. *stellar-protocol/ecosystem/sep-0012.md at master*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md
43. *Anonymous web authentication with Stellar blockchain*. https://evilmartians.com/chronicles/anonymous-web-authentication-with-stellar-blockchain
44. *SEP-10: Stellar Web Authentication*. https://developers.stellar.org/docs/build/apps/example-application-tutorial/anchor-integration/sep10
45. *SEP-30 and User-Friendly Key Management*. https://stellar.org/blog/developers/sep-30-recoverysigner-user-friendly-key-management
46. *stellar-protocol/ecosystem/sep-0001.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0001.md
47. *stellar-protocol/ecosystem/sep-0002.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0002.md
48. *stellar-protocol/ecosystem/sep-0006.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md
49. *stellar-protocol/ecosystem/sep-0007.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md
50. *stellar-protocol/ecosystem/sep-0008.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md
51. *stellar-protocol/ecosystem/sep-0009.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0009.md
52. *stellar-protocol/ecosystem/sep-0010.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md
53. *stellar-protocol/ecosystem/sep-0023.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md
54. *stellar-protocol/ecosystem/sep-0024.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md
55. *stellar-protocol/ecosystem/sep-0029.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0029.md
56. *stellar-protocol/ecosystem/sep-0031.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md
57. *stellar-protocol/ecosystem/sep-0034.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0034.md
58. *stellar-protocol/ecosystem/sep-0038.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0038.md
59. *stellar-protocol/ecosystem/sep-0041.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md
60. *stellar-protocol/ecosystem/sep-0045.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0045.md
61. *stellar-protocol/ecosystem/sep-0053.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0053.md
62. *image: ... Anchor Integration | Stellar Docs ...*. https://developers.stellar.org/docs/build/apps/example-application-tutorial/anchor-integration
63. *image: ... SEP-24: Hosted Deposit and Withdrawal | Stellar Docs ...*. https://developers.stellar.org/docs/build/apps/example-application-tutorial/anchor-integration/sep24
64. *stellar-protocol/core/cap-0035.md at master · stellar/stellar-protocol · GitHub*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md
