# GROUNDTRUTH — Verified Stellar ecosystem facts (as of 2026-06-22)

Liberal real-API sweep. Sources favor **Stellar Light / Scout** (`stellarlight.xyz`) + **Lumenloop**
(`api.lumenloop.com`) as Stellar-specific records, corroborated with **Perplexity**, **Parallel**,
SDF developer-meeting notes, project docs, and on-chain oracle docs. API calls were free and made
liberally. This file records the REAL state; it does NOT edit golden answers.

**Bottom line:** Several "whitespace" claims in golden answers are now **STALE/WRONG** as of mid-2026.
Perps, oracles, and the DEX/AMM scene have all moved. NFT and liquid-staking claims are closer to true
but need nuance.

---

## 1. Perpetuals / derivatives DEXes — VERDICT: REAL & ACTIVELY BEING BUILT; "whitespace" is now WRONG, but NO confirmed mainnet perp DEX yet (testnet-stage)

Stellar perps went from genuinely empty to a **crowded race of 3-4 SCF-funded teams within ~early 2026**.
The "whitespace" framing was true in 2024-2025 but is **stale as of 2026-06**. However, the precise truth
is nuanced: the named projects are **real and live on TESTNET**, with **no independently-confirmed mainnet
perp DEX deployment yet** (audits pending). Confidence: **HIGH** on existence; **HIGH** that none is
confirmed mainnet-live yet.

| Project | Status (verified) | Notes |
|---|---|---|
| **Noether** (noether.exchange) | **Live on testnet**; mainnet planned post-audit | Native Soroban perp DEX, up to 10x leverage (25x planned), BTC/ETH/XLM-PERP, keeper bots, order book, 6 Soroban contracts. SCF graduate ($86.2K awarded). Demoed at the **2026-04-16 SDF Developer Meeting** as, in their words, **"the first perpetual DEX on Stellar."** Team will NOT launch mainnet before SDF-supported audit (≈2-3 months out from April). Repo last commit 2026-06-09 (active). |
| **Stellars Finance** (stellars.finance) | **Listed "Live"** on Scout; SCF perps grant; **mainnet targeted Feb 2026** per SCF submission | Soroban perpetual futures for leveraged synthetic assets. SCF awarded ~$119.3K. SCF roadmap targeted BTC/ETH/XLM perp markets on mainnet Feb 2026, but no independent mainnet-trading confirmation found. Treat "Live" as directory optimism; status genuinely ambiguous (testnet/early-mainnet). |
| **Zenex** (zenex.trade, formerly Hermes / Zenith Protocols) | **Pre-Release / testnet**, mainnet pending | Liquidity-pool + oracle-priced perp exchange. Passkey login, Rozo bridging, Circle CCTP "coming soon." SCF awarded $150K. Repo (zenith-protocols/hermes) older but zenex-sdk/docs active May 2026. |
| **Turbolong** (turbolong.com) | **Live** | NOT a perp DEX — it is **one-click leveraged spot** via atomic recursive lending loops on Blend pools (up to 12.9x, "no perpetual futures, no funding rates"). SCF ~$99K. Real and live, but a different primitive. |

Adjacent/related: **Vanna Finance** (composable leverage / aggregated derivatives, "Live"),
**Rails** (regulated vaults for crypto derivatives, "Live"), **AssetDesk** (margin/limit lending),
**Archax $GOVY** perpetual *T-Bill* token (RWA, not a perp DEX, launched ~June 2026).

**Net:** Perps are an active, contested category with 3+ funded teams (Noether, Stellars Finance, Zenex)
racing to mainnet. Saying "Stellar has no perps / it's whitespace" is **outdated**. Saying "Stellar has a
live mainnet perp DEX" is **also not yet confirmed** — the leaders are testnet/pre-mainnet pending audits.
Best characterization: **"emerging, multiple testnet entrants, no confirmed mainnet perp DEX yet (mid-2026)."**

Sources: Scout `/projects/search?q=perpetuals|perps` (Noether, Zenex, Turbolong, Stellars Finance records);
Lumenloop `search_directory` (semantic, same set); SDF Developer Meeting 2026-04-16
(developers.stellar.org/meetings/2026/04/16 — Noether "first perpetual DEX" demo, mainnet pending audit);
noether-sdk on PyPI (libraries.io/pypi/noether-sdk); SCF submission "Bringing Perpetuals on Stellar"
(communityfund.stellar.org); r/Stellar "Why Stellar Needs Native Perpetual Futures" (2026-06-05).

---

## 2. NFT marketplaces — VERDICT: ONE established Stellar-native marketplace (Litemint); not a deep/mature multi-player scene. "Whitespace" is too strong; "thin" is accurate

- **Litemint** (litemint.com) — the clear, established Stellar-native NFT marketplace. Soroban contracts
  for royalties + auctions, P2P cross-currency bidding, multi-platform (iOS/Android/web). **Highest SCF
  funding of any project in this sweep: ~$376.8K.** Repo 51 stars (medium repo-score), last commit
  2026-01-25. Also runs **Cyberbrawl**, a live on-chain TCG/GameFi title. Confidence: **HIGH** it's real,
  live, and the de-facto Stellar NFT marketplace.
- **Rarible** — listed as "Live" and integrated/supporting Stellar (multi-chain marketplace + protocol).
  Real company, but Stellar is one of many chains; not a Stellar-first deployment. Confidence: MEDIUM on
  depth of Stellar support.
- **Phoenix** has an NFT-marketplace repo (phoenix-nft-marketplace, Rust, active Apr 2026) — secondary.
- Others touching NFTs: Beamable (GameFi SDK w/ marketplaces), LumosDAO/LumosCore (multichain, NFT
  marketplace among many features), Plutus (conditional NFT ownership/rentals).

**Net:** There **is** a mature-enough Stellar-native NFT marketplace (**Litemint**), so "no NFT marketplace
exists / total whitespace" is **WRONG**. But it is NOT a saturated, multi-strong-player scene — it's
essentially **one anchor (Litemint) + Rarible-on-Stellar + minor entrants**. Accurate framing: **"thin but
not empty; Litemint is the established player."** Confidence: **HIGH**.

Sources: Scout `/projects/search?q=NFT marketplace` & `?q=Litemint`; Lumenloop `search_directory`
(Litemint, Rarible, LumosDAO); Litemint site (litemint.com, incl. SXLM staking page); r/Stellar Litemint
threads.

---

## 3. Liquid staking / LSTs — VERDICT: NO genuine liquid-staking-derivative protocol on Stellar. "Whitespace" claim is essentially TRUE (architectural reason)

Stellar uses **SCP (Federated Byzantine Agreement), not proof-of-stake** — there is no native staking to
derive an LST from, so classic "liquid staking" (stETH-style) **does not apply natively**. Confirmed: XLM
"key data" sources explicitly note SCP "uses reputation rather than ... staked tokens."

Searches for "liquid staking / LST / staked XLM" returned **NO Stellar-native LST protocol**. What exists
instead is **DeFi yield on XLM** (not staking derivatives):
- **Y-assets / yXLM** (auto-compounding wrapped yield tokens, surfaced in Lumenloop AV content) — yield
  wrappers, not consensus-staking LSTs.
- **Blend** lending (XLM deposits/backstop emissions), **Aquarius** AMM rewards, **FxDAO** (mint stablecoins
  against XLM), **DeFindex** (yield aggregator), **Ultra Stellar** (4-7% on "staked" assets — marketing
  term for yield, not LST).
- **Helix Labs** does liquid staking — but for **Cardano/ICP/BNB/Aptos/Sui/Solana/Ethereum**, bringing
  *institutional settlement* to Stellar's RWA layer, NOT an XLM LST.

**Net:** "Liquid staking / LSTs are whitespace on Stellar" is **TRUE and likely to stay structurally true**
(no native PoS to stake). The nuance: there's a rich **XLM-yield** ecosystem (Blend/Aquarius/FxDAO/
DeFindex/y-assets), so if a golden answer conflates "yield on XLM" with "no whitespace," correct it: the
whitespace is specifically **liquid *staking* derivatives**, and that gap is architectural. Confidence: **HIGH**.

Sources: Lumenloop `search_directory` + `search_content_semantic` (no LST; returned lending/yield);
Scout searches; MEXC XLM key-data (SCP non-PoS); Lumenloop AV "5x Crypto" yield-farming vlogs (Blend/
Aquarius/FxDAO/y-assets).

---

## 4. Oracles — VERDICT: Reflector is the LEADER but is NOT the only one. Multiple oracles live; "Reflector is the only oracle" is WRONG

Confirmed via **official Stellar developer docs** (developers.stellar.org/docs/data/oracles) plus Scout +
RedStone's own blog:

| Oracle | Status | Evidence |
|---|---|---|
| **Reflector** | **Live, mainnet, DAO-governed** | The dominant SEP-40 oracle. 3 mainnet public contracts (Stellar DEX, external CEX/DEX, fiat FX). DAO of 7 ecosystem orgs (launched Dec 2024, XRF token). Integrations: Blend, OrbitCDP, DeFindex, Laina, EquitX, Slender, SorobanDomains. |
| **Band Protocol** | **Live, mainnet** | Deployed mainnet contract `CCQXWMZVM3KRTXTUPTN53YHL272QGKF32L7XEDNZ2S6OSUFK3NFBGG5M` listed in Stellar docs. One of "three oracle providers" in the official docs set. |
| **DIA** | **Live (testnet contract in docs; "Live" on Scout)** | Cross-chain, 20,000+ assets. Docs list a **testnet** contract; Scout marks "Live." Deployment maturity = testnet-confirmed, mainnet less clear. |
| **RedStone** | **Live, MAINNET since March 2026** | Strongest *new* entrant. SEP-40, push-model. Launched mainnet **2026-03** with 10 feeds (BTC, ETH, USDC, PYUSD, BENJI); by **2026-06-04** expanded to **9 live RWA assets** (incl. CETES, USTRY, TESOURO, SolvBTC). Blend integration in progress. Confirmed via redstone.finance blog + Scout. |
| **Lightecho** | **Live** | Free open-source oracle by BP Ventures; emerging-market FX feeds; also shipped a **SEP-40 "RANDOM" randomness oracle** (Chainlink-compatible) for games. |
| **Orally** | **Live** | Cross-chain push/pull oracles, custom feeds. |
| **Quasar / Nebula** (Eiger) | Live | Decentralized price-feed oracle grids for derivatives/lending. |
| **Pyth** | Listed "Live" on Scout | Multi-chain oracle; Stellar presence claimed but not in core SDF oracle docs — treat as secondary/unconfirmed-depth. |
| **Chainlink** | NOT a price oracle on Stellar | Only a "Chainlink Oracles Relayer" for **randomness** exists; no Chainlink price feeds. |

**Net:** "Reflector is the only oracle on Stellar" is **WRONG**. Reflector is the **leader/default**, but
**Band (mainnet), RedStone (mainnet, since Mar 2026), DIA (testnet+), Lightecho, Orally, Quasar/Nebula**
are all real. The most important correction vs older golden answers: **RedStone is now live on mainnet
(2026-03)** and is the marquee institutional/RWA oracle. Confidence: **HIGH**.

Sources: developers.stellar.org/docs/data/oracles/oracle-providers (Reflector/Band/DIA contracts);
blog.redstone.finance (2026-03-04 mainnet launch, 2026-06-04 SEP-40 9-asset post); Scout `/projects/
search?q=oracle`; Lumenloop news `?tag=oracles` (RedStone, BPVentures/LightEcho RANDOM, DIA testnet).

---

## 5. DEX / AMM landscape — VERDICT: SATURATED / mature with multiple serious live players. NOT whitespace

This is the **most crowded** DeFi category on Stellar. Serious live players:

- **Soroswap** — "first DEX + DEX aggregator on Soroban." Live. Core AMM/router.
- **Aquarius (AQUA)** — major DeFi liquidity layer + AMM, stable & volatile pools, large daily AQUA
  emissions (~7M/day), governance. Live, heavily used.
- **Phoenix (PHO)** — SCF-funded AMM DEX hub, concentrated pools, high LP APRs. Live.
- **Comet** — Balancer-style weighted-pool AMM primitive on Soroban. Live.
- **AXIS** — on-chain limit orderbook, backward-compatible with Classic SDEX. Live.
- **StellarBroker / StellarTerm** — non-custodial swap router/aggregator + classic SDEX trading client. Live.
- **Sushi (SushiSwap)** — **deployed first concentrated-liquidity DEX on Stellar** (PYUSD/USDC, XLM/USDC
  pools live as of 2026-04-16 SDF meeting); cross-chain swaps for XLM/USDC across 40+ chains (June 2026).
- Aggregators/cross-chain touching Stellar: **Rubic, Rango, Houdiniswap, SwiftEx**.
- Plus the **native Stellar Classic DEX (SDEX)** itself, always-on path-payment AMM/orderbook.

**Net:** DEX/AMM is **saturated** — Soroswap, Aquarius, Phoenix, Comet, AXIS + the native SDEX + Sushi's
arrival = a mature, competitive field. Any "Stellar lacks DEXes / AMM is whitespace" claim is **clearly
WRONG**. Confidence: **HIGH**.

Sources: Scout `/projects/search?q=AMM DEX` (15 DEX-typed projects); SDF Developer Meeting 2026-04-16
(Sushi concentrated-liquidity launch); Lumenloop roundups (SushiSwap cross-chain, DeFindex #20 on
DeFiLlama).

---

## 6. Other "state / first / only / whitespace" facts noted while sweeping

Verified or debunked en passant (corroborate before using as golden truth):

- **Lending is mature, Blend is the anchor.** Blend crossed **$80M TVL** (SDF mtg 2026-04-16), ~$100.6M by
  Q1-2026 end; "Stellar's largest DeFi protocol by TVL." Other lenders: YieldBlox, Slender, Laina, K2 Lend,
  AssetDesk, XOXNO, Templar (chain-abstracted), OrbitCDP/FxDAO (CDP stablecoins). NOT whitespace.
- **RWA is a flagship strength, not whitespace.** RWA stack **crossed ~$2.8B** (mid-2026), 3.5x since late
  2025. **DTCC** tokenization targeting Stellar **H1 2027** (SEC approval Dec 2025, 50+ partners). Issuers:
  Franklin Templeton (BENJI ~$678M), Ondo (USDY), WisdomTree, Spiko (**first to cross $1B tokenized on
  Stellar**, mid-June 2026), Etherfuse (CETES), Archax ($GOVY perpetual T-Bill). **Confidence: HIGH.**
- **Stablecoins / institutional:** **MoneyGram MGUSD** launched native on Stellar **2026-06-02** (moved off
  USDC for core settlement, 60M+ customers). **Figure YLDS** — first regulated yield-bearing stablecoin on
  Stellar (2026-05-05). PayPal PYUSD live across markets. Circle **CCTP live** on Stellar (June 2026).
  Mastercard expanded stablecoin settlement. **CME launched XLM futures** (confirmed ~Apr 2026) — note:
  centralized futures, NOT a Stellar-native perp.
- **Agentic payments live on mainnet:** **x402 + MPP** both live on Stellar mainnet (2026-04-16). Real.
- **Protocol cadence:** Protocol 26 "Yardstick" testnet 2026-04-16 (mainnet vote May 6). Protocol 27
  "Zipper" mainnet vote **July 8, 2026**. (Note: some YouTube sources mention "Protocol 24 X-Ray" ZK/privacy
  — treat protocol-number/codename claims cautiously; Yardstick=26, Zipper=27 are the corroborated ones.)
- **Post-quantum:** As of 2026-06-10, Stellar is **Ed25519-only on mainnet, zero PQ live.** SDF published a
  3-stage Quantum Preparedness Plan (2026-06-09): ML-DSA in Soroban host fns (2026), native PQ signers
  (2027). So "Stellar is quantum-ready" = **FALSE**; "has a roadmap" = TRUE. (Source: qrindex.org eval.)
- **SCF scale:** ~50 funded projects live on mainnet (May 2026 Demo Day); ~$7.7M across ~75 projects in 3
  rounds; SCF #43 closed $3.14M to 29 projects.
- **ZK / privacy:** Nethermind **Stellar Private Payments v1 shipped**, v2 (compliance options) coming;
  SEP-57 regulated-token standard expected 2027. Privacy is in-progress, not absent.

---

## Source toolbelt (all free, used liberally)

- **Stellar Light / Scout** (keyless): `stellarlight.xyz/api/projects/search`, `/repos/search`,
  `/leaderboard` — primary Stellar-native directory w/ status, SCF $, repo activity, confidence scores.
- **Lumenloop** (keyed, key in `.dev.vars`): `search_directory` (substring+semantic), `search_content_semantic`
  (news/AV/events/SCF), `news?tag=`, weekly roundups — strongest for *recency* and dated events.
- **Perplexity** `perplexity_search` — URL/fact corroboration (SDF mtg notes, RedStone blog, PyPI, Reddit).
- **Parallel** `web_search_preview` — oracle docs (Reflector), cross-checks.
- **Stellar developer docs** (developers.stellar.org/docs/data/oracles, /meetings/2026/...) — authoritative
  for oracle contracts + dev-meeting demos.

**Caveats:** noether.exchange and stellars.finance returned **HTTP 403** to WebFetch (bot-blocked), so their
mainnet-vs-testnet status rests on Scout + SDF-meeting + SCF + PyPI corroboration, not a direct site read.
Scout "Live" labels can be optimistic for early projects (e.g. Stellars Finance) — cross-checked against
testnet/audit signals where possible.
