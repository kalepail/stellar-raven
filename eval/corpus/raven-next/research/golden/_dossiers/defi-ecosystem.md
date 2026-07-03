# Task Run Results

> **⚠ CORRECTIONS (2026-06-23, API-verified — the corrected golden cards are authoritative, NOT this raw snapshot):**
> - **Oracles are NOT "a single decentralized network."** Reflector is the leading / most-integrated oracle, but **Band and RedStone are live on Stellar mainnet** (RedStone since ~2026-03 with SEP-40 / RWA feeds; Band per developers.stellar.org oracle-provider docs), plus DIA / Lightecho / Orally. The line below is stale.
> - **Perpetuals/derivatives are NOT absent whitespace.** Real testnet entrants exist — **Noether** (demoed 2026-04-16 as the team's first Stellar perp DEX, mainnet pending audit), **Stellars Finance** (SCF perps grant), **Zenex** (testnet) — though there is **no confirmed mainnet perp DEX yet** (Turbolong is recursive leveraged *spot*, not a perp). The "nearly absent / None surfaced" lines below are stale.
> - NFT marketplaces: **Litemint** is a live Stellar-native marketplace (thin, not zero).
> See `q-defi-perps-whitespace`, `q-eco-defi-market-map`, `q-defi-reflector-related-projects`, `q-defi-reflector-oracle` for the corrected truth.

**Run ID:** trun_04740bf111ed4e8985d49439db1ba638
**Status:** ✅ completed
**Processor:** pro
**Created:** 2026-06-22T17:26:09.001702Z
**Modified:** 2026-06-22T17:32:06.600175Z

## Output

# Stellar DeFi & Application Ecosystem Dossier 2025-2026

_Live projects, ground-truth reference, as of 22 June 2026_

## Executive Summary

- **Lending/borrowing**: Blend Protocol (Soroban) is the single canonical money-market primitive; downstream yield apps (Meru, Soroswap Earn via Defindex) are built on top of it rather than running parallel lending markets. -> Builders should treat Blend as the "Aave-equivalent" substrate on Stellar and integrate against `blend-capital/blend-contracts` (Rust, Soroban) instead of forking.
- **DEX/AMM landscape is converging on three anchors**: Soroswap (aggregator), Aquarius (largest AMM, ~$48M TVL, ~$584M cumulative DEX volume per DeFiLlama) and Phoenix (DeFi-Hub DEX). StellarX remains as a Classic/AMM-trade UI. Comet (weighted AMM reference impl from 2023) is mostly educational. -> New AMMs face a thin field; differentiation has to be on routing/UX (Soroswap's aggregator layer) rather than pool mechanics.
- **Oracle stack is effectively a single decentralized network**: Reflector, with 7 vetted ecosystem node operators (StellarExpert, UltraStellar, Script3, PublicNode, xyclooLabs, Lightsail, CreitTech) serving all major Stellar DeFi (Blend, Orbit CDP, Laina, EquitX, DeFindex). -> Price-feed sourcing problem on Stellar is solved at protocol-design level; residual risk is governance of the multisig-protected Reflector cluster rather than oracle manipulation per se.
- **RWA is the deepest, most institutionally validated category**: Franklin Templeton BENJI/FOBXX (first US-registered tokenized MMF, on Stellar since 2021, 5-year milestone marked Apr 30 2026) sits alongside WisdomTree's CRDT private-credit fund (Stellar + Ethereum, launched Sep 12 2025) and Ondo USDY (Sep 17 2025, 5.3% APY at launch, Treasuries-backed, non-US). -> The credible institutional RWAs on Stellar are Treasuries-flavored yieldcoins, not yet equity or securitized credit at scale.
- **Stablecoin issuance is institution-led, not crypto-native**: PYUSD launched on Stellar Sep 18 2025 (PayPal), alongside Circle's USDC/EURC and Franklin's BENJI. -> For traders and integrators, fiat on/off-ramps via Circle/Paxos/PayPal dominate over algorithmic stables.
- **Wallet stack is split by sponsor model**: Freighter (Stellar Development Foundation official, browser + iOS, Blockaid scam protection), LOBSTR (Ultra Stellar, Stellar + XRP Ledger, 1M+ users, 10M+ monthly tx), Hana ($132k SCF-funded multi-chain) and xBull/Creit-Tech (hybrid passkey V2 announced). -> Users have choice; none of these is a MetaMask-scale winner, so app developers must integrate the Stellar Wallets Kit to remain wallet-agnostic.
- **Bridges are mostly off-Shelf via third parties**: Allbridge integrated Stellar-to-Ethereum/Solana/Celo/Polygon in Jul 2023; Ripple-announced Allbridge-XRPL integration also live; SDF-pushed Starbridge was a 2022 research project (trust-minimized Stellar-Ethereum). -> Cross-chain liquidity exists but is fragmented; GMP (General Message Passing) via Wormhole-style messaging is documented in Stellar's cross-chain infra page.
- **Infrastructure is pluralistic but catalogued**: 14+ Soroban RPC providers (SDF, NowNodes, Gateway.fm, OnFinality, Blockdaemon, QuickNode, Alchemy, Ankr, Obsrvr, Exaion, Infstones, GetBlock, Lightsail/Quasar, Validation Cloud, Nodies, Uniblock, Liquify, sorobanrpc.com); 5+ indexers (SubQuery since Oct 2023, Goldsky Mirrors, Hubble SDF BigQuery dataset, Mercury Stellar-native, OnFinality). -> Builders do not need to run infrastructure themselves; production-grade RPC + indexing is a commodity.
- **Ecosystem TVL hit a record $242M on May 30 2026**: DeFiLlama Star list showed ~$227M in June 2026; Q1 2026 SDF update cited $2B+ onchain RWAs and $5.5B stablecoin payment volume, 86% YoY developer growth. -> Both the DeFi (lending + DEX) and the asset-issuance (RWA + stablecoin) narratives are firing in parallel; this is the deepest "L1 utility" signal since 2021.
- **Whitespace categories**: liquid staking has no dominant Soroban LST protocol, perpetuals/derivatives are nearly absent, NFT marketplaces are reference-level only, on-chain identity/attestation is thin, and insurance is unbuilt. -> Liquid-staking and perps are the most-cited whitespace; new launches through 2026 should cluster here.
- **2025-2026 milestone cadence was unusually dense**: Protocol 23 (Jun 10 2025, SEP-0041 unified Classic + Soroban events), USDY on Stellar (Sep 17 2025), PYUSD on Stellar (Sep 18 2025), WisdomTree CRDT (Sep 12 2025), Meridian 2025 in Rio (Sep 17-18 2025), all coinciding with BENJI's 5-year anniversary (Apr 30 2026). -> The Sep 2025 cluster (USDY/PYUSD/CRDT) was the inflection point that raised TVL from <$100M toward the $242M record by mid-2026.

## Lending/Borrowing: Blend Capital and downstream yield apps

### Blend Protocol (the only money-market primitive on Stellar)

Blend Capital (`blend-capital`) is a Soroban implementation of the Blend Protocol described in its GitHub README as "a universal liquidity protocol primitive". It enables permissionless creation of lending pools where end-users deposit assets to earn interest or post collateral to borrow. The repo (https://github.com/blend-capital/blend-contracts) carries 21 stars, 17 forks, and reached v1.0.0 on May 1 2024 [2].

The Stellar case study explains the practical pattern: Meru (USDC wallet for Latin American freelancers) plugged into Blend pools to power a yield-bearing product inside its app, demonstrating the "protocol-as-backbone" integration mode [5]. Soroswap's "Soroswap Earn" feature similarly outsources yield routing to Defindex, which in turn interacts with Blend [6].

| Attribute | Value |
|---|---|
| Category | Lending/borrowing (Soroban money market) |
| Status | Live on mainnet, v1.0.0 since May 2024 |
| Implementation | Rust, on Soroban |
| Sponsor | Independent `blend-capital` team (not SDF) |
| Website | (no marketing site in scope; canonical entry = GitHub) |
| GitHub | https://github.com/blend-capital/blend-contracts |
| X / Twitter | not enumerated in source excerpts |
| Notable adopters | Meru, Soroswap Earn (via Defindex) |

Downstream implications: because Blend is the only well-known Soroban lending primitive in scope of this dossier, every "earn" product for Stellar stablecoins (USDC, EURC, BENJI, USDY, PYUSD) ends up passing through Blend or via Blend-aware routers like Defindex. This makes Blend an effective chokepoint for systemic risk on Stellar DeFi.

### Yield aggregator layer: Defindex (referenced)

Defindex appears inside the Reflector integration list and inside Soroswap Earn as the automated yield-routing engine. It is referenced as "Defindex" via Reflector's homepage integration list [19]. Its exact TVL and product details were not surfaced in excerpts gathered.

## DEX/AMM: Five live trading venues with clear role differentiation

### Soroswap - first DEX aggregator

Soroswap (`Soroswap.Finance`) brands itself as "the first DEX aggregator on Stellar" with a pooled routing engine that pulls from four liquidity sources: Aquarius, Phoenix, Soroswap AMM, and the original Stellar Classic DEX. The current product surface is threefold: a web App for retail swaps, a Soroswap REST API (free tier ~1 RPS, paid Pro and Pro II plans) for third-party integrations, and Soroswap Earn (automated yield strategies via Defindex). It is live on Stellar Mainnet with a Testnet sandbox, supports gasless trustlines, and integrates a Rozo Pay cross-chain bridge [6].

| Attribute | Value |
|---|---|
| Category | DEX (AMM + aggregator) on Soroban |
| Status | Live, mainnet + testnet |
| Implementation | Soroban smart contracts |
| Sponsor | Palta Labs (team stated on LinkedIn profile in prior context) |
| Website | https://soroswap.finance |
| GitHub | https://github.com/soroswap (docs https://github.com/soroswap/docs) |
| X / Twitter | not enumerated in this dossier's excerpts |
| Aggregated venues | Aquarius, Phoenix, Soroswap AMM, Stellar Classic DEX |

### Aquarius (AQUA) - largest DEX on Stellar by TVL

Aquarius' own homepage bills it as "Stellar's DeFi Hub" and reports total swap volume of $593.68M, total liquidity of $48.52M, and $45.7K monthly rewards; it lists LOBSTR, StellarX, Freighter, StellarTerm and Hot Wallet as integrations. The protocol runs Soroban AMMs with stable, volatile and concentrated pools, supporting 2-asset and 3-asset strategies and both classic-Stellar assets and new Soroban tokens [11].

DeFiLlama's Aquarius-Stellar protocol page corroborates a TVL of $48.3M, annualized fees of $642,821, annualized revenue of $323,554, 30-day DEX volume of $104.8M, and cumulative DEX volume of $584.66M [15]. The AQUA token is used for liquidity rewards; locking AQUA mints ICE, a non-transferable governance/voting token that increases pool earnings "by up to 250%", and voters earn daily AQUA emissions [12].

| Attribute | Value |
|---|---|
| Category | DEX/AMM (Soroban) |
| Status | Live, governance active |
| TVL | ~$48.3M (DeFiLlama) |
| Cumulative volume | ~$584-593M |
| Tokens | AQUA (utility), ICE (non-transferable vote-lock) |
| Implementations | Stable / volatile / concentrated pools; 2-asset and 3-asset |
| Website | https://aqua.network |
| GitHub | (Aquarius org repos referenced in excerpts but not enumerated) |
| X / Twitter | not enumerated in excerpts |

### Phoenix - DeFi Hub DEX

Phoenix ("DeFi Hub on Soroban") positions itself explicitly as a hub of synergistic DeFi products with its AMM DEX as the foundational layer. Its site publishes a whitepaper, points to a `Phoenix-Protocol-Group` GitHub org, Discord `yWqJwJ4yza`, and X handle `@PhoenixDefiHub` [55]. Decrypt describes it as building "out its ecosystem on Stellar using the new Soroban smart contract platform" [59]; the Stellar Community Fund dashboard links a $PHO submission by Phoenix describing the AMM DEX as "the first of several products" [58].

| Attribute | Value |
|---|---|
| Category | DEX/AMM (DeFi Hub) on Soroban |
| Status | Pre-launch/early-launch per 2024 sources; aggregator integration live by 2026 |
| Token | $PHO |
| Website | https://www.phoenix-hub.io |
| GitHub | https://github.com/Phoenix-Protocol-Group |
| X / Twitter | https://twitter.com/PhoenixDefiHub |
| Discord | https://discord.gg/yWqJwJ4yza |

### StellarX - DEX trading interface with AMM access

StellarX is branded as "a powerful decentralized trading platform built on the Stellar network" with explicit AMM access at https://stellarx.com/AMM/AMM. It connects to a user wallet and allows buy/sell of any Stellar token [50]. The site is still reachable as of 2026 excerpts retrieved; no source explicitly confirms shutdown, but launch announcements have been quiet since 2024.

### Comet - Balancer-style weighted AMM reference implementation

Comet is described in Stellar's "Financial Innovation Powered by Soroban" recap (May 1 2023) and the SCF submission page as "a Soroban Futurenet implementation of Balancer's weighted automated market maker (AMM) protocol" that "uses a cost function" to enable flexible pool weights [142]. The Meridian 2023 demo session noted Comet "introduced weighted pool AMM reducing impermanent loss by 74% vs standard pools" [141]. It functions more as a research reference than as a high-traffic live DEX.

### Comparative snapshot of Stellar DEX/AMM venues

| Project | Category | Stage (2025-2026) | TVL/Volume signal | Distinct edge |
|---|---|---|---|---|
| Soroswap | Aggregator | Live, both retail API and Earn | Gateway to all liquidity | Routing + REST API |
| Aquarius / AQUA | AMM | Live, largest pool TVL | ~$48M TVL; ~$584M cumulative vol | Largest single pool, governance via ICE |
| Phoenix | AMM + DeFi Hub | Live aggregator integration; further products planned | Direct TVL figure not in excerpts | Hub-of-products roadmap |
| StellarX | Trading UI | Live, accessible | Public volume figure not in excerpts | Wizard-style UX wrapper |
| Comet | AMM (weighted) | Reference impl, low activity | N/A (research-grade) | Balancer-style weights |

**Takeaway**: Soroswap and Aquarius dominate user flow today; Phoenix and StellarX are long-tail; Comet is a baseline reference. New DEX entrants without unique AMM math face an aggregator-folding scenario.

## Oracles: Reflector as the de facto price-feed layer

Reflector ("Decentralized price oracle for Stellar Network") is a combination of Soroban smart contracts and a peer-to-peer consensus network of data-provider nodes maintained by trusted Stellar ecosystem organizations. It is "secured via a multisig-protected consensus" and offers free-of-charge data with no usage limits [16]. The "Pulse", "Flare" and "Stats" sub-products cover different data shapes (TWAP, cross-price, helpers) on the homepage [19].

The Reflector cluster is curated by seven named organizations: StellarExpert, UltraStellar, Script3, PublicNode, xyclooLabs, Lightsail, CreitTech. Reflector pages list its integrations with Blend, Orbit CDP, Laina, EquitX and DeFindex as in-protocol consumers [19].

| Attribute | Value |
|---|---|
| Category | Oracle (price feeds) |
| Status | Live on Stellar |
| Node cluster | StellarExpert, UltraStellar, Script3, PublicNode, xyclooLabs, Lightsail, CreitTech |
| Products | Pulse, Flare, Stats |
| Pricing | Free, no usage limits |
| Integrations | Blend, Orbit CDP, Laina, EquitX, DeFindex |
| Website | https://reflector.network |
| Docs | https://reflector.network/docs |
| GitHub | https://github.com/reflector-network (incl. reflector-contract) |

**Implication**: For new Soroban protocols needing price feeds, integrating Reflector is the de-facto standard. The residual operational risk is governance of the 7-node multisig rather than oracle price correctness.

## Real-World Asset Tokenization: Three institutional issuers anchor this category

This is the deepest category on Stellar in 2025-2026 because of three independent institutional issuers.

### Franklin Templeton BENJI / Franklin OnChain U.S. Government Money Fund (FOBXX)

Franklin Templeton and the Stellar Development Foundation marked five years of BENJI on April 30, 2026 - described as "the first U.S.-registered mutual fund to use a public blockchain as its official system of record for recording share ownership and processing transactions" [24]. Fund details from Franklin's product page: at least 99.5% of total assets in U.S. government securities, cash and repurchase agreements collateralized fully by U.S. government securities [22].

BENJI is "the only money market fund offering intraday yield and peer-to-peer (P2P) transferability of shares". Milestones include the 2024 launch of the first fully tokenized UCITS in Luxembourg on Stellar, and the 2025 launch of the first retail tokenized fund in Singapore, also on Stellar [24]. A separate February 19, 2025 Franklin institutional release confirms "the first Luxembourg domiciled fully tokenised UCITS product" [21].

| Attribute | Value |
|---|---|
| Category | RWA - tokenized U.S. Government MMF |
| Launch on Stellar | 2021 |
| Anchor token | BENJI (FOBXX fund) |
| Differentiator | Intraday yield + P2P transferability |
| Source | https://stellar.org/press/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u-s-registered-tokenized-money-market-fund |

### WisdomTree Private Credit and Alternative Income Digital Fund (CRDT)

WisdomTree launched the private-credit tokenized fund "WisdomTree Private Credit and Alternative Income Digital Fund (Token: CRDT)" on September 12, 2025 on Stellar and Ethereum. CRDT tracks the "Gapstow Private Credit and Alternative Income Index (GLACI)", is available to both institutional and retail investors through WisdomTree Connect and WisdomTree Prime, with a minimum investment of $25, T+0 subscription settlement and T+2 redemption settlement [33]. The Stellar case study frames WisdomTree as "setting a new standard for investment" via integration of crypto and tokenized RWAs, with $100B+ AUM [31].

| Attribute | Value |
|---|---|
| Category | RWA - tokenized private credit / alternative income |
| Launch | Sep 12, 2025 |
| Chains | Stellar + Ethereum |
| Index | GLACI (Gapstow) |
| Distribution | WisdomTree Connect and WisdomTree Prime |
| Source | https://ir.wisdomtree.com/news-events/press-releases/detail/755/wisdomtree-brings-private-credit-onchain-with-the-launch-of |

### Ondo USDY (US Dollar Yield)

USDY is Ondo Finance's "institutional-grade yieldcoin" launched on Stellar on September 17, 2025. It is backed by tokenized U.S. Treasuries and "currently offers a 5.3% APY", enabling "global (non-US) individual and institutional investors" access; "it is not offered or sold to US persons". The deployment enables "new use cases such as cost-effective collateral in DeFi, onchain savings, and treasury management" [129].

| Attribute | Value |
|---|---|
| Category | RWA - tokenized Treasuries yieldcoin |
| Launch on Stellar | Sep 17, 2025 |
| APY at launch | 5.3% |
| Backing | Tokenized U.S. Treasuries |
| Access | Non-US persons only |
| Source | https://stellar.org/press/ondo-finance-launches-usdy-on-stellar |

**Pattern identified**: All three live institutional RWAs on Stellar target either Treasuries (Franklin FOBXX, Ondo USDY) or private credit (WisdomTree CRDT). Equity tokenization is not yet live in scope of these excerpts - that is white-space.

## Stablecoins: A constellation of issuer-led dollars

Four stablecoins stood out across the sources:

- **USDC** by Circle. "USDC on Stellar combines the power and inclusivity of the Stellar network with one of the world's most widely used dollar digital currencies" [70]. Application requires a Circle Account with Stellar USDC/EURC selectable at the issuer layer [71].
- **EURC** by Circle (same source).
- **PYUSD** (PayPal USD). PayPal's stablecoin launched on Stellar September 18, 2025 - "PYUSD on Stellar provides new capital sources for businesses around the world. By deploying on the Stellar network, PYUSD's reach will" expand ... [69].
- **BENJI** as quasi-stablecoin (institutional money-market share).
- Stablecoins overview concept page: "There are many asset issuers who have tokenized global fiat currencies on the Stellar network" [72].

Anchor-country tail stablecoins (region-specific) include **TZS** issued by ClickPesa (Tanzania shilling tokenized on Stellar) [114].

## Bridges and Cross-Chain: Allbridge is the multi-direction workhorse

Allbridge integrated Stellar with Ethereum, Solana, Celo and Polygon on July 11, 2023 - "seamless digital asset transfer between Stellar and other prominent chains" [28]. Allbridge also added XRP Ledger support ("Cross-Chain Bridge Allbridge Brings DeFi to the XRP Ledger" via Ripple's press line) [27]. Stellar's cross-chain infra page documents General Message Passing (GMP) as the cross-chain communication protocol allowing smart contracts on different blockchains to communicate [29].

For protocol-internal integrations, the LiveSwap AMM layer (referenced by Soroswap) uses Rozo Pay as a cross-chain bridging layer for inbound payment-rail flows.

| Attribute | Value |
|---|---|
| Category | Bridge (cross-chain) |
| Status | Live |
| Chains supported | Stellar, Ethereum, Solana, Celo, Polygon, XRP Ledger |
| Source | https://stellar.org/press/allbridge-launch-connects-stellar-network-to-ethereum-solana-and-polygon |

Liquid staking: No dominant Soroban LST protocol was surfaced in the excerpts. This remains a documented whitespace.

## Wallets: Four distinct wallet models

### Freighter - SDF official wallet

Freighter is built and published by the Stellar Development Foundation. The Chrome Web Store listing describes it as "a non-custodial wallet extension that enables you to sign Stellar transactions via your browser", with 10,000+ users, Blockaid-powered scam protection, instant DEX swaps, native NFT management, multi-address handling and recovery-phrase import. The site also confirms iOS and Android mobile apps with biometric support [138], [38]. The "Freighter Wallet | Stellar Docs" entry confirms "Freighter is a browser extension wallet provided by the Stellar Development Foundation" [37].

### LOBSTR - consumer wallet with >1M users (by Ultra Stellar)

LOBSTR is built by Ultra Stellar (parent `ultrastellar.com`). The wallet spans web, iOS, Android, with LOBSTR Vault (separate iOS/Android app), StellarTerm and a Signer Extension as adjacent products. "LOBSTR is operated by an independent commercial entity that is unaffiliated with the Stellar Development Foundation", has "over one million total users" and processes "more than 10 million monthly transactions", with a 4.7 rating across 30,000+ reviews [136], [137].

### Hana Wallet - multi-chain all-in-one

Hana's own profile (Lumen Loop) describes it as "Simple multi-chain crypto on-the-go, Like MetaMask, Polkadot.js, ICONex, Keplr, all in one, for everybody", with Stellar Community Fund funding of $132,000 across SCF rounds 22 and 25. On its website Hana advertises Moneygram cash-in/out integration, Coinbase onramp, Bitcoin full support and "Powered by SODAX" for liquidity [143], [43]. A dedicated Stellar integration guide via `Stellar Wallets Kit` confirms Hana is treated as a "Compatible third-party Wallet" by Ledger and by Stellar developer docs [44], [42].

| Attribute | Value |
|---|---|
| Category | Wallet (multi-chain) |
| Status | Live |
| Funding | SCF $132,000 (rounds 22, 25) |
| Backend | SODAX-powered |
| Website | https://hanawallet.io |
| X / Twitter | https://x.com/hanawallet |
| Discord | https://discord.gg/b5qvcxjjjm |
| YouTube | https://www.youtube.com/@hanawallet |

### xBull Wallet (Creit-Tech) - hybrid passkey

xBull ("Creit-Tech/xBull-Wallet", 32 stars, 9 forks on GitHub) is "a powerful but easy to use extension wallet to interact with the Stellar Network" supporting the full Stellar asset surface. V2 is announced as "a new hybrid wallet ... the passkey based experience but without the drawbacks of a smart wallet" [46], [47].

### Wallet comparison

| Wallet | Sponsor | Chains | Notable feature | Source |
|---|---|---|---|---|
| Freighter | Stellar Development Foundation | Stellar + Soroban | Blockaid scam protection, NFT native | https://www.freighter.app/ |
| LOBSTR | Ultra Stellar (independent) | Stellar + XRP Ledger | 1M+ users, 10M+ monthly tx | https://lobstr.co/ |
| Hana | Hana Technology (SCF-funded) | Stellar + multi-chain | MoneyGram on/off-ramp | https://hanawallet.io/ |
| xBull | Creit-Tech | Stellar | Hybrid passkey (V2) | https://github.com/Creit-Tech/xBull-Wallet |

Wallets-as-integration-list is also documented in Stellar dev portal's "Wallet Integration" page, which lists StellarTerm and Hot Labs wallet [49]. The Stellar Wallets Kit is the recommended SDK for connecting a dApp against all of these.

## Notable Infrastructure

### Soroban RPC providers (12+ canonical providers)

The Stellar docs "Providers" page lists the following organizations as officially recognized infrastructure providers for Soroban RPC [78]:

- **SDF** - Futurenet
- **NowNodes** - Futurenet, Testnet, Mainnet, Dedicated Nodes
- **Gateway.fm** - Testnet, Mainnet, Dedicated Nodes, RPC Archive
- **OnFinality** - Mainnet, Dedicated Nodes, RPC Archive
- **Blockdaemon** - Testnet, Mainnet, Dedicated Nodes
- **QuickNode** - Testnet, Mainnet, Dedicated Nodes
- **Alchemy** - Testnet, Mainnet, Dedicated Nodes
- **Ankr** - Testnet, Mainnet, RPC Archive
- **Obsrvr** - Testnet, Mainnet, RPC Archive
- **Exaion** - Mainnet, Dedicated Nodes, RPC Archive
- **Infstones** - Mainnet, Dedicated Nodes
- **GetBlock** - Mainnet, Dedicated Nodes, RPC Archive
- **Lightsail Network - Quasar** - Mainnet, RPC Archive
- **Validation Cloud** - Testnet, Mainnet
- **Nodies** - Testnet, Mainnet
- **Uniblock** - Testnet, Mainnet
- **Liquify** - Futurenet
- **sorobanrpc.com** - Mainnet (free public endpoint at https://rpc.lightsail.network)

Comparative metrics for these providers (latency, uptime, price) are aggregated on https://www.comparenodes.com/protocols/stellar/ (30 providers indexed as of 2026 [80]). BlockEden additionally offers a hosted all-in-one Standard Soroban RPC + indexer GraphQL API + analytics web portal product [94].

### Indexers and Analytics

| Indexer | Sponsor | Type | Source |
|---|---|---|---|
| **SubQuery** | SubQuery (independent) | Decentralized GraphQL indexer, supports 300+ chains. Stellar support since Oct 19, 2023 | https://subquery.network/blog/subquery-supports-stellar-with-fast-and-flexible-data-indexing |
| **Goldsky** | Goldsky (independent) | Mirrors + Subgraphs + Edge RPC. Stellar-supported via Mirrors | https://docs.goldsky.com/chains/stellar |
| **Hubble** | Stellar Development Foundation | Open-source BigQuery dataset, complete historical record of Stellar ledger | https://stellar.org/blog/developers/beyond-the-blockchain-unlocking-the-power-of-analytics-with-hubble |
| **Mercury** | Stellar-native ecosystem team, with streamlined Soroban support | Indexer | https://developers.stellar.org/docs/data/indexers |
| **OnFinality** | OnFinality | Managed Stellar API service | https://developers.stellar.org/docs/data/indexers |

The Stellar docs Indexers page notes: "SubQuery: Decentralized Indexer SDK, Decentralized RPCs, & AI Apps. Supports 300+ chains. Like The Graph, uses a decentralized model. OnFinality ..." [84].

## Payments Apps

- **MoneyGram Ramps**: "MoneyGram Ramps makes it easy to bridge crypto and cash. Enable global cash-in and cash-out at 170+ countries with one simple integration" [73]. Stellar and MoneyGram are connected via the case study pair "How MoneyGram International and Stellar connect the physical to digital landscape through cash-to-crypto on and off-ramps" [77].
- **ClickPesa** (Tanzania): tokenized TZS stablecoin on Stellar, integrated with LOBSTR for retail UX [117].
- **Flutterwave**: "Flutterwave, a global payments technology company, has launched two new remittance corridors between Europe and Africa on the Stellar network" [116].
- **Meru**: "Meru is a Stellar Community Fund (SCF)-funded, non-custodial USDC digital wallet launched in August 2022 that allows small-medium enterprises (SMEs), freelancers and remote workers to get paid, save, spend, and potentially earn yield" via Blend [5].
- **Stellar basic payment app (reference)**: an open-source example payments application demonstrating multiple SEPs at https://github.com/stellar/basic-payment-app.

## Ecosystem Shape: Crowded Categories vs White Space

| Category | Status | Live projects in scope | Whitespace signal |
|---|---|---|---|
| Wallets | Crowded but differentiated | Freighter, LOBSTR, Hana, xBull, StellarTerm, Hot Labs | All differentiated by sponsor model; SDK via Stellar Wallets Kit unifies them |
| Oracles | Effectively single-provider | Reflector | Cluster governance is the systemic risk; no competitor viable at scale |
| DEX/AMM | Aggregator + 2-3 hub venues | Soroswap aggregator, Aquarius, Phoenix, StellarX UI, Comet (reference) | New entrants face aggregator capture |
| Lending | Single backbone | Blend | All "earn" flows route through Blend |
| RWA | Three flagship issuers | FOBXX/BENJI, CRDT, USDY | Equity, real-estate, commodities un-built at scale |
| Stablecoins | Issuer-led dollars | USDC, EURC, PYUSD, BENJI (+ region anchors TZS) | Algorithmic stables absent |
| Bridges | Few providers | Allbridge (+ Rozo Pay inside Soroswap) | GMP messaging documented but limited GMO protocols |
| Wallets infra (Wallets Kit) | Standardized | Stellar Wallets Kit | SDK integration dominant |
| Indexers | Multi-vendor | SubQuery, Goldsky, Hubble, Mercury, OnFinality | Sufficient |
| Soroban RPC | Catalog of 17 providers | SDF, Gateway, OnFinality, Blockdaemon, QuickNode, Alchemy, Ankr, Obsrvr, Exaion, Infstones, GetBlock, NowNodes, Lightsail/Quasar, Validation Cloud, Nodies, Uniblock, Liquify | Sufficient |
| Payments apps | Selective | MoneyGram, ClickPesa, Flutterwave, Meru | Region-corridor expansion possible |
| Liquid staking | Whitespace | None dominant on Soroban | Major opportunity |
| Perpetuals / derivatives | Whitespace | None surfaced | Major opportunity |
| NFT marketplaces | Reference only | Not surfaced | Undeveloped |
| On-chain identity/attestation | Whitespace | None surfaced | Undeveloped |
| Insurance | Whitespace | None surfaced | Undeveloped |

## TVL and Adoption Signals

- **May 30, 2026 record**: "Stellar (@StellarOrg) set a new record for its DeFi ecosystem, with total value locked (TVL) reaching roughly $242 million" [96].
- **DeFiLlama snapshot**: "Stellar, +8.30%, $227.12" - change vs prior period is +8.30% [106]. DeFiLlama tracks Stellar TVL, Fees & Revenue, DEX Volume, App Revenue, App Fees under https://defillama.com/chain/stellar.
- **SDF Q1 2026 update**: "$2B+ in onchain RWAs, $5.5B in stablecoin payment volume, 86% developer growth" [102].
- **2025 year-in-review**: "The 2025 roadmap was clear: improve technical performance for both builders and enterprises, expand product offerings through the Stellar" [97].
- **Aquarius-alone**: TVL $48.3M; annualized fees ~$643K; annualized revenue ~$324K; 30-day DEX volume $104.8M [15]. Aquarius is roughly **20% of DeFiLlama-listed Stellar TVL** on its own.

## Most Significant 2025-2026 Launches and Milestones

| Date | Event | Source |
|---|---|---|
| Nov 5, 2024 | Protocol 22 announced; Mainnet vote Dec 5, 2024 | https://stellar.org/blog/developers/announcing-protocol-22 |
| Feb 19, 2025 | Franklin Templeton launches first Luxembourg-domiciled fully tokenized UCITS on public blockchain (Stellar) | https://www.ftinstitutionalemea.com/press-releases/franklin-templeton-launches-franklin-onchain-u.s.-government-money-fund |
| Jun 10, 2025 | Protocol 23 announced (SEP-0041 unifies Classic + Soroban event streams) | https://stellar.org/blog/developers/announcing-protocol-23 |
| Sep 12-18, 2025 | Cluster of RWA / stable launches and Meridian 2025 in Rio | multiple |
| Sep 12, 2025 | WisdomTree CRDT (private credit) launches on Stellar + Ethereum | https://ir.wisdomtree.com/news-events/press-releases/detail/755/wisdomtree-brings-private-credit-onchain-with-the-launch-of |
| Sep 17, 2025 | Ondo USDY launches on Stellar (5.3% APY) | https://stellar.org/press/ondo-finance-launches-usdy-on-stellar |
| Sep 17-18, 2025 | Meridian 2025 in Rio de Janeiro, themed RWAs + stablecoins + emerging markets | https://stellar.org/events/community/meridian-2025 |
| Sep 18, 2025 | PayPal's PYUSD launches on Stellar | https://stellar.org/press/paypal-pyusd-is-now-available-on-stellar |
| Apr 30, 2026 | Franklin Templeton + SDF mark 5 years of BENJI | https://stellar.org/press/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u-s-registered-tokenized-money-market-fund |
| May 30, 2026 | Stellar DeFi TVL hits record ~$242M | https://x.com/BSCNews/article/2063985562260767069 |
| May 7, 2026 | SDF Q1 2026 update confirms $2B+ RWA + $5.5B stablecoin volume + 86% dev growth | https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale |
| Oct 28-29, 2026 | Meridian 2026 planned, Lisbon Convento do Beato | https://meridian.stellar.org/ |

**Pattern identified**: The Sep 2025 cluster (USDY + PYUSD + CRDT + Meridian Rio) was the inflection point that drove TVL growth toward the $242M record by mid-2026. Q1 2026 marked the institutional maturation ("Execution at network scale" framing).

## Cross-Cutting Insights (Synthesis)

### Three axes distinguish the leading wallets
- **Sponsor model**: SDF-official (Freighter) vs independent commercial but ecosystem-anchored (LOBSTR/UItra Stellar) vs SCF-grant funded (Hana) vs open-source tooling shop (Creit-Tech/xBull). The diversity is a structural feature, not a bug - it reflects Stellar's "open network" ethos.
- **Chain coverage**: Stellar-only wallets (Freighter, xBull) vs Stellar + XRP Ledger (LOBSTR) vs multi-chain aggregator (Hana). Coverage choice correlates with on-ramp breadth (MoneyGram, Coinbase).
- **Custody and UX**: Non-custodial throughout, but security UX differs - Freighter Blockaid protection; LOBSTR multisig + 2FA + PIN; Hana biometric mobile; xBull passkey push.

### Three different functions distinguish the DEX/AMM entrants
- **Aggregation**: Soroswap captures routing value, so any new AMM gets pulled in.
- **Primary liquidity**: Aquarius is the largest single Soroban AMM and dominates pair-level depth.
- **Product-suite**: Phoenix's roadmap path (AMM DEX plus "several products" per its SCF submission) signals hub-aspiration.
This is a clear case of natural "modular" DeFi: one aggregator, one liquidity base layer, one product "hub" - existing on other chains but now also present on Stellar.

### RWA: three issuers, three parallel models
- **Treasuries yield**: Franklin FOBXX (BENJI) and Ondo USDY. Differ in geographic accessibility (BENJI accessible to US via P2P mechanics; USDY is non-US only) and product type (mutual fund share vs yieldcoin).
- **Private credit/alternative income**: WisdomTree CRDT. Different risk profile, lowest minimum ($25).
The interesting **tension**: Ondo and WisdomTree styles coexist; the institutional RWA market treats Stellar as a serious venue for both US Treasuries AND private credit - unusual among L1 chains.

### Infrastructure is pluralistic but commodity-grade
17+ RPC providers + 5+ indexers all maintain Stellar endpoints - this is the deepest infrastructure footprint of any L1 outside EVM majors. The **mechanism**: Stellar's tooling (SEP standards, Horizon vs Soroban RPC, classic asset issuance) is uniformly compatible, so providers can ship a single endpoint type. **Implication**: infrastructure-side excuses for not building on Stellar are no longer credible.

### 2025-2026 trajectory is consistent with a "capital-markets L1" strategy
RWAs (BENJI, CRDT, USDY) + stablecoins (USDC, EURC, PYUSD) + payments rails (MoneyGram, Flutterwave) point to Stellar's self-positioning as a network optimized for tokenized financial assets rather than generalized DeFi. DeFi primitives (Blend, Aquarius, Soroswap) continue to exist but are sized to support that core market, not to compete with high-throughput consumer L1s.

### Failure cases / counter-evidence
- The comet AMM and Phoenix DEX aggregator integration are still maturing; TVL is concentrated in Aquarius.
- StellarX activity relative to Aquarius direct access has declined for retail, suggesting UI wrappers cannot beat direct AMM usage once interfaces are clean.
- Live "liquid staking", "perpetuals", "insurance" categories are missing; the absence is real, not under-reported.

## 20-30 Most Important Factual Questions on the Stellar App/DeFi Ecosystem

1. **What is Soroswap Finance?**
   - Soroswap is the first DEX aggregator on Stellar, pooling liquidity from Aquarius, Phoenix, Soroswap AMM and the Stellar Classic DEX, with a REST API (free + Pro/Pro II tiers), a web app, Soroswap Earn (via Defindex) and cross-chain bridging via Rozo Pay.
   - Source: https://soroswap.finance/

2. **What does Blend Protocol do on Stellar?**
   - Blend (Soroban, Rust, v1.0.0 May 2024) is a universal liquidity protocol primitive enabling permissionless creation of lending pools; users deposit to earn interest or post collateral to borrow.
   - Source: https://github.com/blend-capital/blend-contracts

3. **What is Aquarius (AQUA)?**
   - Aquarius is Stellar's DeFi Hub; the largest Soroban DEX with ~$48M TVL, ~$584-593M cumulative volume, stable/volatile/concentrated pools (2-asset/3-asset), AQUA + ICE vote-lock governance.
   - Source: https://aqua.network/ and https://defillama.com/protocol/aquarius-stellar

4. **What is Reflector?**
   - A decentralized price oracle for Stellar combining Soroban contracts and a 7-node cluster (StellarExpert, UltraStellar, Script3, PublicNode, xyclooLabs, Lightsail, CreitTech); integrates Blend, Orbit CDP, Laina, EquitX, DeFindex.
   - Source: https://reflector.network/ and https://reflector.network/docs

5. **What is BENJI / FOBXX?**
   - BENJI is the share token of the Franklin OnChain U.S. Government Money Fund (FOBXX), the first U.S.-registered mutual fund using a public blockchain (Stellar, since 2021) as its official system of record; offers intraday yield and P2P share transferability.
   - Source: https://stellar.org/press/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u-s-registered-tokenized-money-market-fund

6. **What did WisdomTree launch on Stellar?**
   - The WisdomTree Private Credit and Alternative Income Digital Fund, ticker CRDT, on Stellar + Ethereum, tracking the GLACI index, Sep 12, 2025; minimum $25, T+0 subscription and T+2 redemption settlement.
   - Source: https://ir.wisdomtree.com/news-events/press-releases/detail/755/wisdomtree-brings-private-credit-onchain-with-the-launch-of

7. **What is USDY on Stellar?**
   - Ondo Finance's institutional-grade yieldcoin backed by tokenized U.S. Treasuries, launched on Stellar Sep 17, 2025; ~5.3% APY at launch; available to non-U.S. persons only.
   - Source: https://stellar.org/press/ondo-finance-launches-usdy-on-stellar

8. **When did PayPal's PYUSD launch on Stellar?**
   - September 18, 2025.
   - Source: https://stellar.org/press/paypal-pyusd-is-now-available-on-stellar

9. **Who made the Allbridge-Stellar bridge live?**
   - Allbridge launched Stellar-to-Ethereum, Solana, Celo and Polygon on July 11, 2023; later added XRP Ledger support.
   - Source: https://stellar.org/press/allbridge-launch-connects-stellar-network-to-ethereum-solana-and-polygon

10. **What is Freighter?**
    - Official non-custodial wallet by Stellar Development Foundation; browser extension (Chrome/Firefox/Brave), plus iOS + Android mobile apps, with Blockaid scam protection, instant DEX swaps, NFT management and multi-address.
    - Source: https://www.freighter.app/ and https://developers.stellar.org/docs/build/guides/freighter

11. **What is LOBSTR?**
    - A web + mobile non-custodial wallet for Stellar + XRP Ledger; built by Ultra Stellar; adjacent products LOBSTR Vault, StellarTerm, Signer Extension; >1M users, >10M monthly transactions.
    - Source: https://lobstr.co/ and https://ultrastellar.com/

12. **Who builds xBull Wallet?**
    - Creit-Tech (https://github.com/Creit-Tech/xBull-Wallet, 32 stars / 9 forks), with a hybrid passkey V2 announced for the Stellar network.
    - Source: https://github.com/Creit-Tech/xBull-Wallet and https://xbull.app/

13. **What is Hana Wallet's Stellar story?**
    - A multi-chain all-in-one crypto wallet with SCF funding ($132,000, rounds 22 + 25); Stellar integration via Stellar Wallets Kit; MoneyGram on/off-ramp functionality; powered by SODAX.
    - Source: https://hanawallet.io/ and https://support.hanawallet.io/en/articles/11045736-hana-wallet-stellar-integration-guide

14. **Who runs Soroban RPC?**
    - SDF, NowNodes, Gateway.fm, OnFinality, Blockdaemon, QuickNode, Alchemy, Ankr, Obsrvr, Exaion, Infstones, GetBlock, Lightsail/Quasar, Validation Cloud, Nodies, Uniblock, Liquify, sorobanrpc.com.
    - Source: https://developers.stellar.org/docs/data/apis/rpc/providers

15. **What indexers support Stellar?**
    - SubQuery (since Oct 19, 2023), Goldsky (Mirrors + Subgraphs + Edge RPC), Hubble (SDF BigQuery dataset), Mercury (Stellar-native Soroban indexer), OnFinality.
    - Source: https://developers.stellar.org/docs/data/indexers and https://subquery.network/blog/subquery-supports-stellar-with-fast-and-flexible-data-indexing

16. **What is Comet on Stellar?**
    - A Balancer-style weighted AMM implementation on Soroban Futurenet (May 2023 milestone), with multi-asset pools demonstrated to reduce impermanent loss ~74% vs standard pools.
    - Source: https://stellar.org/blog/ecosystem/stellar-community-fund-recap-financial-innovation-powered-soroban and https://communityfund.stellar.org/submissions/recG7Kj7ouwAFP2XY

17. **What is Phoenix?**
    - A Soroban DeFi Hub project building an AMM DEX as the foundational product; $PHO token; whitepaper published by the Phoenix-Protocol-Group GitHub org.
    - Source: https://www.phoenix-hub.io/ and https://github.com/Phoenix-Protocol-Group

18. **What is StellarX?**
    - A DEX trading platform / AMM-access UI for the Stellar network, connecting user wallets to trade Stellar tokens.
    - Source: https://www.stellarx.com/

19. **What was the major Stellar protocol upgrade in June 2025?**
    - Protocol 23 (announced June 10, 2025), which adds SEP-0041 to emit Soroban token interface events for all Stellar operations that move value, unifying Classic and Soroban event streams.
    - Source: https://stellar.org/blog/developers/announcing-protocol-23

20. **What is Stellar's all-time-high DeFi TVL?**
    - ~$242 million on May 30, 2026 (also recorded by BSCNews).
    - Source: https://x.com/BSCNews/article/2063985562260767069

21. **What does DeFiLlama show for Stellar TVL?**
    - DeFiLlama tracks Stellar at https://defillama.com/chain/stellar; the chain ranking page shows ~$227.12M with +8.30% recent change.
    - Source: https://defillama.com/chain/stellar and https://defillama.com/chains

22. **What did SDF report for Q1 2026?**
    - Over $2B onchain RWAs, $5.5B stablecoin payment volume, 86% developer growth.
    - Source: https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale

23. **Where is MoneyGram on Stellar?**
    - MoneyGram Ramps offers cash-in/cash-out in 170+ countries integrating with Stellar, per MoneyGram's own product page and SDF case study.
    - Source: https://www.moneygram.com/us/en/ramps and https://stellar.org/case-studies/moneygram-international

24. **What is ClickPesa on Stellar?**
    - ClickPesa issues TZS, a Tanzanian-shilling stablecoin on Stellar, tradable against XLM, USDC, BTC, ETH per its announcement.
    - Source: https://medium.com/clickpesa/a-non-technical-guide-to-integrate-with-stellar-and-clickpesas-assets-b4d50d919d08 and https://dev.to/clickpesa/receive-tzs-asset-into-your-stellar-account-via-lobstr-wallet-42n4

25. **What is the Meru wallet?**
    - SCF-funded non-custodial USDC wallet launched Aug 2022 for Latin-American freelancers and SMEs, integrated with Blend for yield.
    - Source: https://stellar.org/case-studies/meru-wallet-uses-blend-defi-protocol-for-yield-v2

26. **What does AQUA / ICE token combo do in Aquarius?**
    - AQUA is the utility token for liquidity rewards; locking AQUA mints non-transferable ICE for voting/governance, which can boost liquidity earnings by up to 250% per pool; voters earn daily AQUA emissions.
    - Source: https://medium.com/aquarius-aqua/aquarius-amms-updates-and-plans-for-2024-f390e9d06b15

27. **What is Hubble?**
    - An open-source, publicly available BigQuery dataset maintained by SDF that contains the complete historical record of the Stellar network, enabling analytics without running a full history database.
    - Source: https://stellar.org/blog/developers/beyond-the-blockchain-unlocking-the-power-of-analytics-with-hubble and https://developers.stellar.org/docs/data/analytics/hubble

28. **What Galactic GMP/cross-chain protocol does Stellar support?**
    - General Message Passing (GMP) is documented as the cross-chain communication protocol allowing smart contracts on different blockchains to communicate (per Stellar cross-chain infra page).
    - Source: https://developers.stellar.org/docs/tools/infra-tools/cross-chain

29. **When and where is Meridian 2026?**
    - October 28-29, 2026 at Convento do Beato, Lisbon, Portugal.
    - Source: https://meridian.stellar.org/

30. **Is there a major liquid-staking category on Stellar/Soroban?**
    - No dominant Soroban LST protocol surfaced in scope. This is a recognized whitespace / open opportunity rather than a documented product at present.
    - Source: narrative-only conclusion from absence in sourced excerpts; treat as "not publicly listed as an active product" rather than a confirmed project.

## References

1. *Blend: Digital Lending & Account Opening for Banks, Credit ...*. https://blend.com/
2. *blend-capital/blend-contracts: Soroban implementation of ...*. https://github.com/blend-capital/blend-contracts
3. *Soroban | Smart Contracts Platform on Stellar*. https://stellar.org/soroban
4. *Blend Unveils Vision for Intelligent Origination*. https://blend.com/company/newsroom/blend-unveils-vision-intelligent-origination-new-operating-model-lending/
5. *Blend & Meru Case Study*. https://stellar.org/case-studies/meru-wallet-uses-blend-defi-protocol-for-yield-v2
6. *Soroswap - The First DEX Aggregator on Stellar*. https://soroswap.finance/
7. *docs/additional-resources/01-concepts/02-pools.md at main*. https://github.com/soroswap/docs/blob/main/additional-resources/01-concepts/02-pools.md
8. *soroswap/docs: Soroswap.Finance Documentation for ...*. https://github.com/soroswap/docs
9. *DeFi on Stellar with Soroswap - Lumen Loop*. https://lumenloop.com/media/defi-stellar-soroswap
10. *Liquidity Pools | Stellar Docs*. https://developers.stellar.org/docs/data/apis/horizon/api-reference/resources/liquiditypools
11. *Aquarius*. https://aqua.network/
12. *Aquarius AMMs — Updates and plans for 2024*. https://medium.com/aquarius-aqua/aquarius-amms-updates-and-plans-for-2024-f390e9d06b15
13. *AQUA value : r/Stellar*. https://www.reddit.com/r/Stellar/comments/s609u1/aqua_value/
14. *Soroban & Aquarius*. https://communityfund.stellar.org/dashboard/submissions/recRUJxeF1PdlM6aV
15. *Aquarius Stellar TVL, Fees, Revenue & Volume*. https://defillama.com/protocol/aquarius-stellar
16. *Documentation Reflector / Decentralized price oracle for ...*. https://reflector.network/docs
17. *reflector-network/reflector-contract: Reflector oracle smart ...*. https://github.com/reflector-network/reflector-contract
18. *Reflector*. https://github.com/reflector-network
19. *Reflector / Decentralized price oracle for Stellar Network*. https://reflector.network/
20. *A High-Level Overview of Reflector Oracle Protocol*. https://dev.to/francis001210/a-high-level-overview-of-reflector-oracle-protocol-1i44
21. *Franklin Templeton launches Franklin OnChain U.S. ...*. https://www.ftinstitutionalemea.com/press-releases/franklin-templeton-launches-franklin-onchain-u.s.-government-money-fund
22. *Franklin OnChain U.S. Government Money Fund - FOBXX*. https://www.franklintempleton.com/investments/options/money-market-funds/products/29386/SINGLCLASS/franklin-on-chain-u-s-government-money-fund/FOBXX
23. *Franklin Templeton, Stellar Development Foundation Mark ...*. https://www.franklintempleton.com/press-releases/news-room/2026/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u.s.-registered-tokenized-money-market-fund
24. *Franklin Templeton, Stellar Development Foundation Mark ...*. https://stellar.org/press/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u-s-registered-tokenized-money-market-fund
25. *Franklin Templeton BENJI Price, BENJI ...*. https://www.coinbase.com/price/franklin-templeton-benji
26. *Cross Chain Bridge Crypto - Transfer Coins Between ...*. https://allbridge.io/
27. *Cross-Chain Bridge Allbridge Brings DeFi to the XRP Ledger*. https://ripple.com/ripple-press/cross-chain-bridge-allbridge-brings-defi-to-the-xrp-ledger/
28. *Allbridge launch connects Stellar network to Ethereum, ...*. https://stellar.org/press/allbridge-launch-connects-stellar-network-to-ethereum-solana-and-polygon
29. *Cross-Chain | Stellar Docs*. https://developers.stellar.org/docs/tools/infra-tools/cross-chain
30. *Allbridge: Expanding an Ecosystem of Cross-Chain Solutions*. https://meridian.stellar.org/sessions/how-to-build-solutions-for-interoperability-between-evm-and-non-evm-blockchains-by-allbridge
31. *Stellar | WisdomTree Case Study*. https://stellar.org/case-studies/wisdomtree
32. *WisdomTree Physical Stellar Lumens GB*. https://www.wisdomtree.eu/en-gb/products/ucits-etfs-unleveraged-etps/cryptocurrency/wisdomtree-physical-stellar-lumens
33. *WisdomTree Brings Private Credit Onchain with the ...*. https://ir.wisdomtree.com/news-events/press-releases/detail/755/wisdomtree-brings-private-credit-onchain-with-the-launch-of
34. *WisdomTree Prime and WisdomTree Connect: 2025 Outlook*. https://www.wisdomtreeprime.com/digital-funds-insights/wisdomtree-prime-and-wisdomtree-connect-2025-outlook/
35. *Digital Funds: A New Era of Tokenized Investing*. https://www.wisdomtreeprime.com/digital-funds-insights/digital-funds-a-new-era-of-tokenized-investing/
36. *2025 SDF Product Roadmap*. https://stellar.org/foundation/roadmap
37. *Freighter Wallet | Stellar Docs*. https://developers.stellar.org/docs/build/guides/freighter
38. *Freighter - Chrome Web Store*. https://chromewebstore.google.com/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en
39. *stellar/freighter-api*. https://www.npmjs.com/package/@stellar/freighter-api?activeTab=dependents
40. *Freighter Developer Docs: Introduction - Freighter wallet*. https://docs.freighter.app/
41. *Hana Wallet*. https://communityfund.stellar.org/project/hana-wallet-x9e
42. *Hana Wallet Stellar Integration Guide*. https://support.hanawallet.io/en/articles/11045736-hana-wallet-stellar-integration-guide
43. *Hana | Lumen Loop*. https://lumenloop.com/projects/hana
44. *Hana Wallet - Compatible third-party Wallet*. https://www.ledger.com/hana-wallet
45. *xBull Wallet - Chrome Web Store*. https://chromewebstore.google.com/detail/xbull-wallet/omajpeaffjgmlpmhbfdjepdejoemifpe?hl=en-US
46. *xBull Wallet V2*. https://xbull.app/
47. *Creit-Tech/xBull-Wallet: A powerful but easy to use ...*. https://github.com/Creit-Tech/xBull-Wallet
48. *xBull Wallet: A powerful but easy to use extension wallet*. https://www.reddit.com/r/Stellar/comments/pasgxi/xbull_wallet_a_powerful_but_easy_to_use_extension/
49. *Wallet Integration | Stellar Docs*. https://developers.stellar.org/docs/tools/developer-tools/wallets
50. *StellarX — DEX trading platform with AMM access*. https://www.stellarx.com/
51. [5 Reasons StellarX Is A GAME CHANGER! [Stellar Exchange Review/ Walk-Through]](https://www.youtube.com/watch?v=A_qR1CHGEYI)
52. *StellarX - Quest VR Games - Meta*. https://www.meta.com/experiences/stellarx/8132958546745663/?srsltid=AfmBOorfS8jHTVc4pOSMqFVy2G9hF2z_goJRKxqPtA8ottDldcjQVYdT
53. *Connect Wallet*. https://www.stellarx.com/login
54. *DEX trading platform with AMM access*. https://stellarx.com/AMM/AMM
55. *Phoenix*. https://www.phoenix-hub.io/
56. *Phoenix DeFi Hub DEX Demo with Stellar Global : r/Stellar*. https://www.reddit.com/r/Stellar/comments/1crudhy/phoenix_defi_hub_dex_demo_with_stellar_global/
57. *Phoenix-Protocol-Group*. https://github.com/Phoenix-Protocol-Group
58. *Phoenix ($PHO)*. https://communityfund.stellar.org/dashboard/submissions/recLOzDpEMgJWDbTe
59. *Phoenix Rising: Building the 'One-Stop Shop' for DeFi on ...*. https://decrypt.co/243194/phoenix-rising-building-the-one-stop-shop-for-defi-on-stellar
60. *Yield-Bearing Assets on Stellar: Unlocking Potential with ...*. https://stellar.org/blog/developers/yield-bearing-assets-stellar-soroban
61. *Stellar | Blockchain Network for DeFi, Payments & Asset ...*. https://stellar.org/
62. *Comet, Stellar Pup spike? : r/mtgfinance*. https://www.reddit.com/r/mtgfinance/comments/1biwq6a/comet_stellar_pup_spike/
63. *Yield Protocol*. https://yieldprotocol.com/
64. *Proof-of-stake vs. proof-of-agreement: Stellar's security edge*. https://stellar.org/blog/ecosystem/proof-of-stake-vs-proof-of-agreement-stellars-security-edge
65. *Is there a bridge between ethereum and stellar?*. https://www.reddit.com/r/Stellar/comments/111iyl1/is_there_a_bridge_between_ethereum_and_stellar/
66. *How XRD staking emissions rewards & penalties are ...*. https://www.radixdlt.com/articles-learn/how-xrd-staking-emissions-rewards-penalties-are-calculated-general
67. *Stellar*. https://www.blockdaemon.com/protocols/stellar
68. *Starbridge: a trust-minimized bridge between ...*. https://stellar.org/blog/developers/starbridge-a-trust-minimized-bridge-between-stellar-and-other-blockchains
69. *Stellar | PayPal USD is Now Available on Stellar*. https://stellar.org/press/paypal-pyusd-is-now-available-on-stellar
70. *USDC on Stellar | Use USDC as a Native Asset on Stellar*. https://www.circle.com/multi-chain-usdc/stellar
71. *Fast, cheap, and connected. meet USDC and EURC on ...*. https://stellar.org/products-and-tools/circle-usdc-eurc
72. *Stablecoins*. https://stellar.org/learn/what-are-stablecoins
73. *MoneyGram Ramps | Connect Crypto to Cash in Minutes*. https://www.moneygram.com/us/en/ramps
74. *stellar/basic-payment-app: An example ...*. https://github.com/stellar/basic-payment-app
75. *Stellar Payments Home*. https://stellarpayments.com/
76. *Stellar cryptocurrency wallets*. https://www.moneygram.com/us/en/help-center/faq/services/stellar-wallets
77. *MoneyGram International Case Study*. https://stellar.org/case-studies/moneygram-international
78. *Providers | Stellar Docs*. https://developers.stellar.org/docs/data/apis/rpc/providers
79. *Stellar Soroban RPC: Free Public RPC Node for Stellar ...*. https://sorobanrpc.com/
80. *Stellar RPC Providers, Nodes and APIs in 2026*. https://www.comparenodes.com/protocols/stellar/
81. *Stellar Soroban - JSON RPC*. https://blockeden.xyz/api-marketplace/stellar-soroban
82. *Stellar Soroban RPC API*. https://docs.blockdaemon.com/reference/soroban-stellar-methods-rpc-api
83. *SubQuery Supports Stellar with Fast and Flexible Data Indexing*. https://subquery.network/blog/subquery-supports-stellar-with-fast-and-flexible-data-indexing
84. *Indexers Overview | Stellar Docs*. https://developers.stellar.org/docs/data/indexers
85. *Index Stellar Network Data Fast with OnFinality & SubQuery*. https://blog.onfinality.io/index-stellar-network-data-with-onfinality/
86. *Stellar & Soroban (Combined) Quick Start - SubQuery Network*. https://subquery.network/doc/indexer/quickstart/quickstart_chains/stellar.html
87. *Index Data with SubQuery & GraphQL | Moonbeam Docs*. https://docs.moonbeam.network/builders/integrations/indexers/subquery/
88. *Index Stellar Blockchain Data*. https://goldsky.com/chains/stellar
89. *Stellar*. https://docs.goldsky.com/chains/stellar
90. *Goldsky - Sei Docs*. https://docs.sei.io/evm/indexer-providers/goldsky
91. *Stellar | Soroban: The Smart Contract Platform Designed ...*. https://stellar.org/blog/developers/soroban-the-smart-contract-platform-designed-for-developers
92. *Unlocking the Power of Analytics with Hubble*. https://stellar.org/blog/developers/beyond-the-blockchain-unlocking-the-power-of-analytics-with-hubble
93. *Hubble*. https://developers.stellar.org/docs/data/analytics/hubble
94. *Stellar Soroban Indexer and GraphQL*. https://blockeden.xyz/stellar-soroban/
95. *Hubble sees black hole beam boosting stellar eruptions*. https://www.esa.int/Science_Exploration/Space_Science/Hubble_sees_black_hole_beam_boosting_stellar_eruptions
96. *Stellar Makes History with $242M in TVL*. https://x.com/BSCNews/article/2063985562260767069
97. *Stellar 2025: A Podium Finish*. https://stellar.org/blog/ecosystem/stellar-2025-year-in-review
98. *Q1 2025 Quarterly Report*. https://bitcoinke.io/wp-content/uploads/2025/05/Stellar-Development-Foundation-Q1-2025-BitKE.pdf
99. *2026-04-16*. https://developers.stellar.org/meetings/2026/04/16
100. *Announcing Protocol 22*. https://stellar.org/blog/developers/announcing-protocol-22
101. *Announcing Protocol 23*. https://stellar.org/blog/developers/announcing-protocol-23
102. *Q1 2026: Execution at network scale*. https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale
103. *Protocol 23 Upgrade Guide*. https://stellar.org/blog/developers/protocol-23-upgrade-guide
104. *Protocol 22 Upgrade Guide*. https://stellar.org/blog/developers/protocol-22-upgrade-guide
105. *Stellar - DeFi TVL, Fees, & Revenue*. https://defillama.com/chain/stellar
106. *Chain Rankings by TVL - DeFi Analytics*. https://defillama.com/chains
107. *DefiLlama - DeFi Dashboard & Crypto Analytics*. https://defillama.com/
108. *About DefiLlama - DeFi Dashboard & Crypto Analytics*. http://defillama.com/about
109. *Discontinued History Year 1 Resources*. https://www.goodandbeautiful.com/pages/history1?srsltid=AfmBOoqb3ni8Ljinr_nmqqQRXIQNr2YB4Kzwt9-nB1ojQbMPjaiJkXLd
110. *StellarX terms of service*. https://www.stellarx.com/legal/terms
111. *DEX trading platform with AMM access*. https://stellarx.com/AMM/BOO
112. *StellarX Labs investment portfolio*. https://pitchbook.com/profiles/investor/718959-79
113. *Stellar | Building Stellar Infrastructure in Africa*. https://stellar.org/blog/ecosystem/building-stellar-infrastructure-in-africa
114. *A non-technical guide to integrate with Stellar and ...*. https://medium.com/clickpesa/a-non-technical-guide-to-integrate-with-stellar-and-clickpesas-assets-b4d50d919d08
115. *ClickPesa*. https://clickpesa.com/
116. *Stellar | Flutterwave Enables New Europe-Africa Payment ...*. https://stellar.org/press/flutterwave-enables-new-europe-africa-payment-corridors-via-stellar
117. *Receive TZS asset into your Stellar account via LOBSTR ...*. https://dev.to/clickpesa/receive-tzs-asset-into-your-stellar-account-via-lobstr-wallet-42n4
118. *Stellar | Build DeFi with Soroban: Rust-Based Smart ...*. https://stellar.org/use-cases/defi
119. *Neobancos y Blockchain: Bancos usan Stellar y Soroban ...*. https://www.reddit.com/r/Stellar/comments/1e782bx/neobancos_y_blockchain_bancos_usan_stellar_y/
120. *MERU - Amilcar Erazo y Carlos Neira*. http://espaciocripto.io/podcast/meru-tu-mejor-aliado-para-manejar-dolares-como-freelancer-amilcar-erazo-y-carlos-neira
121. *Meru — Payments · Company Profile & Data*. https://thegrid.id/profiles/meru
122. *Stellar Consensus Protocol*. https://stellar.org/learn/stellar-consensus-protocol
123. *Stellar Lumen*. https://www.bankfrick.li/en/stellar-lumen
124. *Blog - Stellar (XLM)*. https://www.anycoin.cz/blog/stellar?locale=en_US
125. *Tokenize Real-World Assets: Secure, Compliant, Global*. https://stellar.org/use-cases/tokenization
126. *Ondo Finance*. https://ondo.finance/
127. *RWA.xyz | Analytics on Tokenized Real-World Assets*. https://app.rwa.xyz/
128. *Stellar RWA ecosystem*. https://tokenterminal.com/explorer/projects/stellar/rwa-ecosystem/assets
129. *Stellar | Ondo Finance Launches USDY on Stellar*. https://stellar.org/press/ondo-finance-launches-usdy-on-stellar
130. *Meridian 2026 - Meridian 2026 - Stellar*. https://meridian.stellar.org/
131. *Stellar | The Blueprint Comes to Life: Building the Future of ...*. https://stellar.org/blog/foundation-news/the-blueprint-at-meridian-2025
132. *Stellar Meridian 2025*. https://stellar.org/events/community/meridian-2025
133. *Stellar's Flagship Meridian Conference Focused on RWAs ...*. https://thedefiant.io/news/blockchains/stellar-s-flagship-meridian-conference-highlights-focus-on-rwas-stablecoins-and-emerging-markets
134. *A conference by Stellar*. https://meridian.stellar.org/register
135. *Page Not Found | Franklin Templeton | Franklin Templeton*. https://www.franklintempleton.com/press-releases/news-room/2026/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u-s-registered-tokenized-money-market-fund
136. *LOBSTR – Simple and Secure Stellar & XRP Ledger Wallet.*. https://lobstr.co/
137. *Ultra Stellar*. https://ultrastellar.com/
138. *Freighter | Your Everyday Stellar Wallet*. https://www.freighter.app/
139. *Financial Innovation Powered by Soroban*. https://stellar.org/blog/ecosystem/stellar-community-fund-recap-financial-innovation-powered-soroban
140. *stellar/soroban-examples*. https://github.com/stellar/soroban-examples
141. *Soroban Ecosystem Demo Hour | Meridian 2023 - Lumen Loop*. https://lumenloop.com/media/soroban-ecosystem-demo-hour-meridian-2023
142. *Comet*. https://communityfund.stellar.org/submissions/recG7Kj7ouwAFP2XY
143. *Hana | All-in-One Crypto Money App*. https://hanawallet.io/
