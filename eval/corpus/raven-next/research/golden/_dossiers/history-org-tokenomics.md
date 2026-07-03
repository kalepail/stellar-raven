# Task Run Results

**Run ID:** trun_04740bf111ed4e89a32b6ee0584ee3fd
**Status:** ✅ completed
**Processor:** pro
**Created:** 2026-06-22T17:26:29.610702Z
**Modified:** 2026-06-22T17:33:24.728131Z

## Output

# Stellar (XLM) Reference Dossier: History, Organization, Tokenomics, and Partnerships (2014-2026)

## Executive Summary

- **Origins as a Non-Fork Spinoff**: Stellar was founded in early 2014 (network launched July 31, 2014) by Jed McCaleb (creator of eDonkey, founder of Mt. Gox, co-founder of Ripple) and Joyce Kim with $3 million in seed funding from Stripe and operational leadership from Stripe's Patrick Collison; the network was a brand-new C++ codebase, not a hard fork of Ripple. -> Treat any "Stellar is a Ripple fork" framing as inaccurate; decisions around validator and consensus design stand on their own.
- **SCP Rewrite in 2015**: After the original quorum-based consensus proved flawed, Chief Scientist David Mazieres co-authored the Stellar Consensus Protocol paper in 2015 (federated Byzantine agreement), and a redesigned SCP-led protocol was released in April 2015 and went live in November 2015. -> SCP, not the original Ripple-derived model, is what every node runs today - relevant for any technical comparison.
- **Self-Funded Nonprofit SDF**: The Stellar Development Foundation is a Delaware non-stock, non-profit corporation, self-funded by XLM sales, paying US taxes, with no shareholders; board of Jed McCaleb, Lin-Hua Wu, Ronaldo Lemos, Ginger Baker, Asiff Hirji; CEO/Executive Director Denelle Dixon (appointed March 14, 2019, ex-Mozilla COO). -> SDF funding structure is structurally different from equity-funded Layer-1 foundations; compare Stripe/Stellar/MoneyGram alignments accordingly.
- **The November 2019 Burn and Fixed Supply**: Validator vote ended inflation on October 28, 2019; on November 4, 2019 SDF burned 55,442,095,285.7418 XLM (~55B lumens, ~$4.4B at the time), collapsing total supply from ~100B to ~50B and cutting SDF's holdings from ~85% to ~60% of supply; current 2026 circulating supply is ~33.82B XLM against a ~50B max. -> Investors and partners should anchor on a 50B hard cap with no further issuance - differentiate from Bitcoin-style supply schedules.
- **Cross-Chain Stablecoin Rails**: Circle's CCTP went live on Stellar on May 19, 2026 (native USDC interoperability with Ethereum, Solana, Base); Frankline Templeton's BENJI/FOBXX tokenized money-market fund launched on Stellar in 2021 and marked its 5-year anniversary on April 30, 2026 with $580M+ issued; Visa added Stellar (with EURC, USDG, PYUSD) to its settlement platform on July 31, 2025; Wirex went live with dual-stablecoin USDC/EURC Visa settlement on November 18, 2025 for 7M+ users. -> Stellar is now an explicit payments-native L1 for regulated USD/stablecoin settlement rather than mainly an open-crypto chain.
- **Institutional Compliance Stack**: Mastercard Crypto Credential partnership announced October 15, 2024; Paxos integration announced at Meridian on October 16, 2024; DTCC connected its tokenization service to Stellar on May 27, 2026 with production availability targeted for H1 2027. -> Risk-management teams can use these as evidence that compliance, KYC, and regulated issuance are first-class on Stellar.
- **Humanitarian and CBDC Deployments**: UNHCR launched "Stellar Aid Assist" in 2022 in Ukraine (Kyiv, Lviv, Vinnytsia), sending USDC to Vesseo wallets redeemable via MoneyGram Ramps; disbursed $1.1M+ to 1,500+ individuals by December 2023, winning a "Best Impact Project Award" in March 2023; on December 14, 2021 TASCOMBANK + Bitt launched an electronic hryvnia pilot under National Bank of Ukraine supervision. -> Use UNHCR/Ukraine as primary case studies when contrasting Stellar against other L1s' humanitarian work.
- **Enterprise Funding Tied to Mandate**: SDF's Enterprise Fund invests from XLM holdings (not its operating cash), with disclosed grants/investments including SatoshiPay $550K (May 28, 2020), NetXD $10 million (October 28, 2022), and Puntored $2 million (September 2024); Enterprise Fund holds over $100 million. -> Map funding decisions chronologically against the four XLM-account buckets: User Acquisition, Use-Case Investment, Ecosystem Support, Direct Development (2019 framework) and Assets and Liquidity, Product and Innovation, Stellar Growth, SDF Development (2025 framework).
- **2025 Network Growth Inflection**: Stellar processed $55.6B in payment volume in 2025 (+52% YoY), 3.6B transactions, lifetime 21.5B operations, 10.3M unique addresses, 632K monthly actives; on-chain RWAs reached $785M at year-end and crossed $1B in the first week of January 2026; Whisk protocol raised theoretical max throughput to ~3,000 TPS, SLP4 doubled Soroban ledger limits with 70% smart-contract cost reduction, and X-Ray went live on mainnet with BN254 zero-knowledge cryptography. -> Sellers should expect Stellar to be positioned primarily on stablecoin + RWA throughput in 2026 onward.
- **MoneyGram as Both Equity and Distribution Partner**: During Madison Dearborn Partners' ~$1.8B, $11-per-share go-private transaction announced February 15, 2022 (closed August 15, 2023), SDF became a minority investor in MoneyGram from its cash treasury (not Enterprise Fund) and received a MoneyGram board seat. MoneyGram Ramps are now integrated as the cash endpoint for stablecoin deposits/withdrawals in 170+ countries; April 22, 2026 saw a multi-year partnership extension. -> The Stellar-MoneyGram integration is a structural equity plus product linkage, not just a press release.
- **Tal/Lumen and the Partnership-Grant Program**: SDF's Partnership Grant Program (introduced September 7, 2017) grants up to $2M per partner in XLM; Tala joined Stellar October 14, 2021 to "build out digital banking capabilities"; Vibrant is a Stellar-wallet app by Sunship, Inc. (a Stellar Development Foundation subsidiary); SatoshiPay (Berlin/London fintech) received $550K in XLM making it the third Enterprise Fund investment. -> The Stellar Enterprise Fund sits at the intersection of venture investing and grant-making, so model it differently from equity-funded infrastructure.

---

## 1. Founding History: 2014 Launch and Ripple-Adjacent Origins

Stellar was founded in early 2014 by Jed McCaleb and Joyce Kim, with the network going live on July 31, 2014 ([1]; Wikipedia - Stellar payment network)). McCaleb had previously co-founded Ripple (where he served as CTO until 2013) and founded Mt. Gox, and Kim was previously CEO of Soompi and a venture capitalist ([105]; [171]).

The founding consortium received a $3 million seed commitment from Stripe (led by Patrick Collison). This placed Stripe among the earliest enterprise backers and positioned Stellar as a payments-first chain: "Stripe provided $3 million in seed funding in 2014 for the cryptocurrency Stellar, developed by a nonprofit that Collison co-founded" ([115]; [5]).

**Fork relationship with Ripple.** Stellar is frequently mischaracterized as a "Ripple fork." Multiple authoritative sources state the opposite: "Jed McCaleb founded Stellar with Joyce Kim in 2014 by forming a new blockchain that split off from Ripple's blockchain (of which he co-founded)" ([1]). The Stellar codebase was written from scratch in C++ rather than as a fork of Ripple's C++ codebase, and the two networks have continued to diverge on consensus, ledger, and token model. Mechanism: McCaleb's exit from Ripple in 2013 left disagreement over what "open, payments-first" should mean, and Stellar's design pair (low-fee, federated consensus, currency issuance) reflects that disagreement. Implication: comparisons to Ripple should focus on overlapping founders, not inherited technology.

**Founders and founding team.**

| Name | Role | Notes |
| --- | --- | --- |
| Jed McCaleb | Co-founder, Chief Architect | Original eDonkey creator, Mt. Gox founder, Ripple co-founder |
| Joyce Kim | Co-founder, early Executive Director | Prior CEO of Soompi; co-founder of mobile-commerce startup SimpleHoney |
| Patrick Collison | Strategic backer (Stripe co-founder/CEO) | Provided $3M seed; remains Stellar advisor |
| David Mazieres | Chief Scientist | Lead author of SCP paper (2015) |

Sources: [5]; [105]; [115]; [3].

## 2. Protocol Rewrite to SCP: The 2015 Pivot

Within roughly a year of launch, the founding team recognized the original protocol modeled on Ripple's quorum-based design was not robust. Mechanism: SCP, described in April 2015 by David Mazieres in "The Stellar Consensus Protocol: A Federated Model for Internet-Level Consensus" ([3]; [4]), introduced **federated Byzantine agreement (FBA)**, in which each node picks its own quorum slices. FBA is what today's Stellar consensus relies on (Wikipedia - Stellar payment network)).

The redesigned protocol was released in April 2015 and went live in November 2015 - a year after network launch and a pivot away from the Ripple-derived consensus design (Wikipedia - Stellar payment network)). Implication: every "older" Stellar architecture decision (issuance, anchors, multi-sig, claimable balances) predates SCP, and any feature living on the chain today depends on quorum slices, not on a closed validator set. Recommendation: analysts should treat Stellar's decentralization model (open quorum slices) as a defining structural feature different from both delegated-PoS and Bitcoin-style PoW sister chains.

## 3. The Stellar Development Foundation (SDF): Structure, Leadership, Mandate, and Funding

### Structure

The Stellar Development Foundation is "a nonprofit organization creating equitable access to the global financial system through blockchain technology" ([18]). It is incorporated as a "non-stock, nonprofit corporation organized under the laws of Delaware" (Stellar - connect/legal). SDF is **self-funded**: it pays US taxes, has no shareholders, and funds its operational expenses and mandate work by selling XLM through direct sales and public exchanges - "specifically citing Coinbase, Kraken, and Bitstamp" ([16]). Mechanism: the absence of equity holders means SDF cannot be acquired; its only "shareholders" are holders of XLM via the network it stewards.

### Leadership as of 2026

Per SDF's official mandate page ([16]), the structure is:

| Role | Members |
| --- | --- |
| Board of Directors | Jed McCaleb, Lin-Hua Wu, Ronaldo Lemos, Ginger Baker, Asiff Hirji |
| Leadership Team | Denelle Dixon, Jason Karsh, Jed McCaleb, Justin Rice, Jose Fernandez da Ponte, Candace Kelly, David Mazieres, Lisa Macnew, Liz Ray, Nicolas Barry, Raja Chakravorti, Tomer Weller |
| Advisors | Patrick Collison, Sam Altman, Naval Ravikant, Matt Mullenweg, Greg Stein, Keith Rabois, Bhagwan Chowdhry, Dan Kaminsky |

Denelle Dixon was named CEO and Executive Director on March 14, 2019, joining from Mozilla where she had served as Chief Operating Officer ([167]; [168]; [17]). She continues to hold both CEO and Executive Director titles, structuring SDF's executive hierarchy with one named accountable leader rather than separate Chair/CEO roles.

### Mandate and the XLM Authority

SDF's stated mandate is "creating equitable access to the global financial system through blockchain technology" ([16]). Concretely, SDF is mandated to: (1) build necessary public goods for the Stellar system, (2) promote the network to enterprises and developers, (3) invest in mission-supporting protocols and companies, and (4) advocate for sustainable regulatory frameworks ([16]).

The 2014 Steering Document vested SDF with authority to use XLM to "enhance and promote the Stellar ecosystem" ([16]). SDF updated the mandate framework twice:

| Year | XLM Account Buckets | Source |
| --- | --- | --- |
| 2019 | User Acquisition, Use-Case Investment, Ecosystem Support, Direct Development | ([16]) |
| 2025 | Assets and Liquidity, Product and Innovation, Stellar Growth, SDF Development | ([16]) |

Mechanism: the 2025 reset re-prioritized "Assets and Liquidity" (reflecting RWA, stablecoin, and cross-chain focus) ahead of pure user acquisition. Implication: the 2019->2025 shift marks the network's pivot from "give away lumens for onboarding" to "lease capacity for institutional flows."

### Funding and Treasury

SDF's funding sources are: (1) XLM sales via partner exchanges (Coinbase, Kraken, Bitstamp); (2) returns on investments from Enterprise Fund cash (e.g., the MoneyGram investment earned in cash treasury is separate from XLM operating accounts); and (3) corporate treasury management ([50]). Per the SDF MoneyGram blog post: "This investment was made out of SDF's own cash treasury, the assets set aside to support the operations of the SDF, rather than the Enterprise Fund" ([49]; [52]).

## 4. The Lumen (XLM): Supply, Burn, Inflation, and 2026 Tokenomics

### Initial Supply and Distribution at Launch (July 31, 2014)

At launch, the network generated 100 billion XLM, with a built-in 1% annual issuance rate ([15]; [94]; Wikipedia - Stellar payment network)). The 2017 Mandate document describes the on-launch giveaway: "SDF allocated 20% of the initial lumens to be distributed for free to holders of bitcoin and XRP (19% for bitcoin holders and 1% for XRP holders)" ([96]).

### 2015-2019: 1% Annual Inflation

For roughly five years post-launch, total XLM supply expanded by 1% per year ([94]). This was designed to fund development while keeping total dilution modest.

### 2019: Validator Vote Ends Inflation; Burn Caps Supply at 50B

Two related events bracketed late 2019:

| Date | Event | Source |
| --- | --- | --- |
| October 28, 2019 | Inflation ended by validator vote | ([12]) |
| November 4, 2019 | SDF burned 55,442,095,285.7418 XLM (~$4.4B at the time) | ([12]; [13]) |

The burn reduced total supply from ~100B to ~50B and "dropped the SDF's ownership of the total XLM supply from 85% to 60%" ([15]). Mechanism: by destroying nearly all of SDF's allocation rather than just the inflation component, the burn aimed to remove "founder overhang" risk and align SDF more closely with the network it stewards. Recommendation: analysts should treat post-2019 SDF XLM holdings as mission-tied operational reserve, not as founder-equity-equivalent.

### 2026 Tokenomics State

| Metric | Value (mid-2026) | Source |
| --- | --- | --- |
| Total / Max supply | ~50,001,806,812 XLM | ([134]) |
| Circulating supply | ~33,823,967,869 XLM (June 2026) | ([134]); ([136]) |
| Circulating as % of max | ~68% | ([136]) |
| Inflation rate | 0% (fixed since Nov 2019) | ([94]) |

Distribution of remaining ~30B XLM held by SDF: "approximately 50 billion lumens in existence ... The Stellar Development Foundation holds about 30 billion lumens to promote network growth" ([94]; [13]).

**Mechanism -> implication.** The post-2019 supply model effectively gives XLM three roles: (1) anti-spam transaction fee (minimum ~0.00001 XLM hurdle), (2) network-native DEX base pair, and (3) operational + ecosystem reserve under SDF's authority ([16]). 2025's pivot to "Assets and Liquidity" as a separate XLM bucket (table above) institutionalizes XLM as the reserve collateral for stablecoin and RWA flows onchain.

## 5. Enterprise Partnerships and Integrations: IBM, MoneyGram, Circle, Franklin, WisdomTree, Mastercard, Visa, Paxos

### Pre-2018: IBM World Wire

IBM announced its World Wire pilot on Stellar on October 2017, and the network officially launched into "limited production across more than 50 countries" on March 18, 2019 ([62]; [9]). IBM updated branding to "IBM Blockchain World Wire" by March 2022 ([61]). Stellar publicly noted it was not built "as a captive system" ([7]). The IBM-World-Wire-on-Stellar era represents one of the first Big Tech adoption of an open-source payments L1, though the offering has had well-documented limited use and operational transitions since 2022 ([162]).

### 2017-2022: SatoshiPay, Tala, Velo Labs / Interstellar

**SatoshiPay.** SDF announced a $550K Enterprise Fund investment on May 28, 2020 ([128]). SatoshiPay, a London/Berlin micropayments fintech, had migrated to Stellar, with over 650,000 euros processed via micropayments and 25,000+ downloads of the "Solar" wallet in 40 countries.

**Tala.** SDF announced on October 14, 2021: "Tala users will be able to borrow, spend, save, invest, and send/receive entirely using Stellar assets and stablecoins like Stellar USDC" ([112]). In May 2026 Tala broadened its onchain footprint via a partnership with Airtm (Tala - on-chain with Airtm).

**Lightyear -> Chain -> Interstellar -> Velo.** Lightyear was founded in 2017 by Jed McCaleb and Brit Yonge, with SDF backing. On September 10, 2018, Lightyear acquired Chain, Inc., with the combined company rebranded **Interstellar** ([110]; [131]; [92]). On March 15, 2021, Thai conglomerate CP Group-backed Velo Labs merged with Interstellar "in a nine-figure deal" ([89]). Velo subsequently opened a remittance corridor with Philippine Digital Asset Exchange (PDAX) on March 24, 2022 ([84]).

### 2021-2023: Franklin Templeton, IBM (continued), MoneyGram

**Franklin Templeton / FOBXX / BENJI.** Franklin Templeton launched the Franklin OnChain U.S. Government Money Fund (FOBXX), represented by the BENJI token, on Stellar in October-2021. **Mechanism**: It is "the first U.S.-registered mutual fund to use a public blockchain as its official system of record" ([37]; [76]; [75]). Per the April 30, 2026 anniversary release, Franklin Templeton had issued over $580 million in tokenized U.S. Treasuries, making BENJI "the second-largest tokenized real-world asset (RWA) on Stellar by value" ([37]).

**WisdomTree.** WisdomTree selected Stellar to power its tokenized asset products, citing "native asset controls on the Stellar network" that let the issuer customize tokenomics to internal business needs ([36]).

**MoneyGram.** During Madison Dearborn Partners' go-private transaction (announced February 15, 2022, closed August 15, 2023), SDF became a minority investor in MoneyGram from its cash treasury and received a MoneyGram board seat ([49]; [67]; [65]). Mechanism: the equity stake converted MoneyGram from a customer into a distribution partner. The Stellar<->MoneyGram product stack crystallized as "MoneyGram Ramps" - a developer API for wallet/app providers that lets users "convert their physical cash into digital dollars and back - even if users don't have a bank account" in "170+ countries" ([21]; [25]). On April 22, 2026 MoneyGram and Stellar extended the partnership, "to scale real-world stablecoin utility globally" ([22]).

### 2024: Mastercard, Paxos, Soroban, More Enterprise Fund Deals

**Mastercard Crypto Credential.** On October 15, 2024, SDF announced a partnership "with Mastercard to integrate the company's Crypto Credential solution with the Stellar network" ([32]; [35]). Mechanism: the Crypto Credential framework provides interoperable identity assertions for blockchain addresses - a verified-onchain-identity layer that lets issuers and exchanges satisfy KYC for cross-network transfers without running a closed permissioning system. Implication: Mastercard's choice to integrate with a public chain for credentialing signals that permissioned, programmatic KYC has become a viable offering on Stellar.

**Paxos.** At Meridian 2024 on October 16, 2024, Paxos announced an integration with Stellar to expand its tokenization platform ([31]). This makes Paxos a regulated US issuer (PYUSD, USDG) available on Stellar rails.

**Soroban smart contracts launch.** On March 19, 2024 SDF announced that smart contracts would launch on Stellar, backed by a $100 million Soroban adoption fund. Soroban's mainnet launch was **February 20, 2024 with Protocol 20**, with public dApp deployment opened subsequently ([109]; [59]). Mechanism: Soroban is a WASM-based smart-contract execution environment that integrates with Stellar's native payment primitives, with the explicit goal of supporting stablecoins and asset tokenization - not a general-purpose L1.

**Enterprise Fund additional investments.** Notable investments include NetXD at $10 million on October 28, 2022 ([149]) and Puntored at $2 million on September 3, 2024 ([147]). The Enterprise Fund's mandate page indicates "over $100m" cumulative ([146]).

### 2025-2026: Visa, Wirex, Circle CCTP, DTCC, PayPal, MoneyGram Extension

| Date | Event | Source |
| --- | --- | --- |
| July 31, 2025 | Visa expanded stablecoin-settlement platform to Stellar (added EURC, USDG, PYUSD; Stellar + Avalanche added) | ([69]; [71]) |
| November 18, 2025 | Wirex + Stellar go live with dual-stablecoin USDC/EURC Visa settlement for 7M+ users | ([70]) |
| April 22, 2026 | MoneyGram + Stellar partnership extended to "scale real-world stablecoin utility globally" | ([22]) |
| April 30, 2026 | Franklin Templeton + SDF celebrate 5-year BENJI anniversary | ([37]) |
| May 8, 2026 | SDF launches region-focused Market Development team emphasizing SPEI (Mexico), PIX (Brazil), SEPA (Europe) integrations | ([125]) |
| May 19, 2026 | Circle's CCTP (Cross-Chain Transfer Protocol) goes live on Stellar | ([28]; [30]) |
| May 27, 2026 | DTCC announces tokenization-service connection to Stellar public blockchain; production targeted H1 2027 | ([111]) |

Mechanism of the Visa/Wirex combination: Visa's stablecoin settlement (USDC/EURC) was already a settlement layer for card transactions on Visa Direct, but had been exclusive to a few chains. Stellar's addition - plus Wirex's integration running card settlement in USDC/EURC directly on Stellar - makes Stellar a "shared ledger layer" beneath USDC/EURC settlement for both card and remittance flows ([81]). Implication: rather than competing with Circle or Visa, Stellar is positioning itself as "their" multi-chain friction-shedding settlement surface.

## 6. Grants, Enterprise Fund, and Anchor Investments

SDF's Enterprise Fund sits alongside its operating treasury. The Partnership Grant Program, introduced September 7, 2017, allowed "up to $2,000,000 USD per grant (paid in XLM)" to qualifying partners ([164]). Selected investments from the Enterprise Fund:

| Date | Company / Asset | Amount | Source |
| --- | --- | --- | --- |
| May 28, 2020 | SatoshiPay | $550K | ([128]) |
| October 28, 2022 | NetXD Inc. | $10 million | ([149]) |
| August 15, 2023 | MoneyGram (cash treasury investment) | Minority equity stake + board seat | ([49]) |
| September 3, 2024 | Puntored | $2 million | ([147]) |
| March 24, 2022 | Velo + PDAX (corridor partnership, not direct grant) | n/a | ([84]) |
| March 19, 2024 | Soroban Adoption Fund | $100 million | ([109]) |

Mechanism: by mixing operating cash and Enterprise Fund XLM, SDF can act simultaneously as venture investor (MoneyGram), grant provider (SatoshiPay), and strategic ecosystem investor (Velo via Interstellar). Implication for analysts: SDF's "investments" line item combines grant-style and venture-style commitments underwritten in different assets, so any comparison to venture-funded L1 foundations must control for that.

## 7. Real-World Deployments: Remittances, Ukraine CBDC, UNHCR Aid

### Ukraine CBDC (Electronic Hryvnia)

On December 14, 2021, TASCOMBANK and global fintech Bitt launched a pilot project to issue an electronic hryvnia on Stellar, supervised by the National Bank of Ukraine ([41]; [42]; [44]). Use cases tested included programmable payroll for Diia City employees, P2P payments, and merchant payments. Mechanism: NBU acts as "platform operator" fully controlling and verifying issuance ([43]). Stellar's role was ledger and settlement infrastructure; TASCOMBANK ran integration endpoints. Implication: this is a rare multi-year public-sector pilot where NBU retained supervisory control - useful case study for any central-bank CBDC build on a public L1.

### UNHCR / Stellar Aid Assist

UNCER (UN Refugee Agency), in collaboration with UNICC, launched "Stellar Aid Assist" in 2022 in Ukraine cities (Kyiv, Lviv, Vinnytsia). It works as follows: the Stellar Disbursement Platform sends USDC to recipient Vesseo digital wallets, which recipients can redeem as cash via MoneyGram Ramps in roughly 170 countries ([46]; [47]). By December 20, 2023 "UNHCR's launch of Stellar Aid Assist in Ukraine has disbursed more than $1.1 million dollars to more than 1,500 individuals" ([157]). UNHCR won the "Best Impact Project Award at the inaugural Anthem Awards for its pilot using blockchain to disburse cash to people displaced by the war in Ukraine" ([48]).

Mechanism -> implication. The UNHCR deployment binds three ecosystems together: (1) donor funds -> (2) USDC on Stellar -> (3) fiat redemption at MoneyGram agent. Each hop is auditable and programmable while the recipient stays anonymous to the public chain (their wallet is a Stellar address tied to Vesseo anchoring). Recommendation: humanitarian-aid teams considering similar deployments should study the UNHCR/Stellar/Vesseo pipeline as a known-good integration.

### Remittances (Velo/Interstellar, MoneyGram Access, Onafriq, Nium, Coins.ph)

- March 24, 2022: Velo Labs + PDAX opened a Philippines remittance corridor via Stellar ([84]).
- June 22, 2022: Nium + SDF integrated so that Nium's payout rails ("190 countries") can convert fiat -> USDC on Stellar ([123]).
- May 4, 2026: MoneyGram + Stellar marked five-year partnership with stablecoin remittance expansion across Latin America ([87]).
- June 2026: Coins.ph, a major Philippine fintech, supports remittance corridors connecting PHP to Stellar-based settlement ([88]).
- Onafriq, Africa's largest digital payments gateway, supports the Stellar network for cross-border and domestic real-time payments across 43 African markets ([138]; [140]).

Mechanism -> implication. Each partner anchors a fiat on Stellar, then uses the network's native DEX for currency conversion. The redundancy across anchors (MoneyGram, Onafriq, Velo, Coins.ph, Nium) is what makes the network's corridor coverage robust: failure of one anchor doesn't break the corridor.

## 8. 2025-2026 Protocol Upgrades and Network Stats

| Date | Protocol/Feature | Outcome |
| --- | --- | --- |
| February 20, 2024 | Soroban mainnet, Protocol 20 | Smart contracts live onchain ([59]) |
| July 17, 2025 | Protocol 23 on Testnet | Quorum configuration upgrade ([79]) |
| September 3, 2025 | Protocol 23 Mainnet vote | 10 a.m. PST / 17:00 GMT ([82]) |
| Throughout 2025 | Whisk | "parallel transaction execution and pushes theoretical max throughput to 3,000 TPS" ([81]) |
| Throughout 2025 | SLP4 | "doubles most Soroban ledger limits and delivers a 70% cost reduction in smart contract invocations" ([81]) |
| 2025 | X-Ray | Zero-knowledge cryptography on mainnet with BN254 elliptic curve integration ([81]) |

**Network statistics, end of 2025 / early 2026 (per [81]):**

| Metric | 2025 Value |
| --- | --- |
| Annual payment volume | $55.6 billion (+52% YoY) |
| Transactions processed in 2025 | 3.6 billion |
| Lifetime operations | 21.5 billion |
| Unique addresses | 10.3 million |
| Monthly active addresses | 632,000 |
| On-chain RWAs at year-end | $785 million |
| On-chain RWAs first week of Jan 2026 | crossed $1 billion |
| Visa stablecoin settlement run rate (across all chains) | ~$4.6 billion |

Takeaway: Stellar is reaching the kind of throughput (claimed 3,000 TPS theoretical via Whisk) and regulatory footprint (Mastercard, Visa, DTCC, Circle, PayPal) that historically only "Big Tech"-attached chains held, while still running open-source consensus.

## 9. Synthesis: Comparative Analysis and Cross-Cutting Themes

Stellar's story has three defining tensions worth contrasting. **First**, founder dynamics: McCaleb is the only person to have co-founded both Ripple (predecessor in spirit) and Stellar, yet "fork" framing is consistently rejected - because Stellar is a clean-room C++ implementation running on a structurally different consensus (SCP / federated Byzantine agreement vs. Ripple's original RPCA-style model). This divergence matters because it makes Stellar "post-Ripple," not "fork-of-Ripple," for any partner evaluating technology alignment.

**Second**, founder incentive vs. nonprofit structure: SDF is a non-stock Delaware nonprofit that pays taxes and has no equity holders ([16]). That makes SDF structurally similar to the Mozilla Foundation (Dixon came from Mozilla), not to a Cayman/Ethereum-style L1 foundation. Trade-off: SDF cannot raise equity to chase grants/buys; it uses XLM sales and Enterprise Fund cash. Earn-back: it cannot be acquired or hijacked by token-holder votes, so long-term mission-aligned behavior is plausible.

**Third**, XLM as a beacon vs. stablecoin-on-XLM: After the November 2019 burn, XLM is no longer an inflationary medium-of-exchange token; it is a fixed-supply (~50B) network fee unit and ledger primitive. In contrast, USDC, EURC, BENJI, PYUSD, and the on-chain RWA corpus are designed as the actual transaction-volume vehicle. The SDF mandate's 2025 account bundle "Assets and Liquidity" (replacing 2019's "User Acquisition") institutionalizes this: SDF's XLM is increasingly the "balance sheet" against which stablecoin/RWA liquidity is provisioned, rather than an end-user airdrop target ([16]). Implication: future SDF XLM distributions are likely to be programmatic and rate-limited for stablecoin/RWA support rather than retail-onboarding-style giveaways.

**Comparative case study: IBM World Wire vs. Visa settlement.** Both sit under Mastercard/Visa's payments franchise umbrella but went down very different paths. IBM's 2017 announcement positioned World Wire as "open-source cross-border payments built on Stellar," and by 2019 it claimed live in 50+ countries ([62]). Independent observers in 2023 noted declining activity ([8]), illustrating the gap between announcement and active volume. By contrast, the Visa-on-Stellar milestone (July 31, 2025) was followed in months by Wirex going live (November 18, 2025), with 7M+ users routing via USDC/EURC Visa settlement ([69]; [70]). Mechanism: Visa's product roadmap had explicit stablecoin-flow ambitions and a global existing card network, whereas IBM's go-to-market required building correspondent rails from scratch.

**Comparative case study: Franklin BENJI vs. DTCC.** Franklin Templeton's BENJI is an "active" tokenized mutual fund on Stellar since 2021, with $580M+ in tokenized US Treasuries ([37]). DTCC's May 27, 2026 announcement is structural: DTCC's tokenization service is connecting to Stellar, with production targeted H1 2027 ([111]). The divergence reveals a stage-wise build-up: trial-purpose issuance (BENJI), then native issuer-side custody rails (DTCC). Each adds a different layer of regulatory confidence without competing.

**Comparative case study: UNHCR vs. MoneyGram Ramps.** UNHCR's Stellar Aid Assist binds donation to USDC on Stellar to cash at MoneyGram retailer; MoneyGram's commercial product (Ramps) replicates the same design at retail scale, in 170+ countries. Mechanism: the same atomic token-handling on Stellar (USDC issued natively, then redeemed via off-ramp anchor) underlies both humanitarian and commercial disbursement - suggesting that as stablecoin acceptance grows, the same rails can carry both impact and commercial flows at marginal cost.

**Dominant divergences and broader themes:**

- MoneyGram is the only partner where SDF holds equity plus a board seat, signaling that the "structural" relationship is reserved for assets that anchor the on/off-ramp layer.
- 2024-2026's integrations (Visa, Wirex, PayPal, DTCC, Mastercard Crypto Credential, Circle CCTP) all came from "regulated dollar" issuers, not from open DeFi protocols - a clear institutional pivot after 2024's Soroban mainnet.
- DFTCC and Franklin Templeton are layered: Benzi's onchain fund lives on Stellar, while DTCC connects its custody mirror. The two are additive, not competitive.
- Sub-account structure changes in 2025 (from "User Acquisition + Use-Case Investment + Ecosystem Support + Direct Development" to "Assets and Liquidity + Product and Innovation + Stellar Growth + SDF Development") makes explicit that SDF's XLM is no longer a giveaway vehicle; it is now a balance-sheet asset.

**Risk register and recommended watch items.** First, SDF XLM (still ~30B lumens held) is the single largest concentration risk on the network; the 2019 burn was a one-time dilution mitigation but not a structural cap-and-dissolve. Second, IBM World Wire's quiet downsizing is a reminder that Big Tech adoption with limited usage can produce reputation without throughput. Third, XLM-only USD-onchain metrics can mislead: payment volume in USD is driven primarily by USDC/EURC denominated flows, so a thesis investment should distinguish "$ flow onchain" from "XLM price/uniqueness" - they have decoupled structurally.

---

## 10. Top 25 Factual Questions and Canonical Answers (with Best Source URL)

Question 1: When was the Stellar network launched?
Answer: July 31, 2014.
Best source: https://en.wikipedia.org/wiki/Stellar_(payment_network)

Question 2: Who co-founded Stellar, and what was the initial seed funding?
Answer: Jed McCaleb and Joyce Kim, with $3 million seed funding from Stripe.
Best source: https://mitsloan.mit.edu/ideas-made-to-matter/stripe-co-founder-patrick-collison-blockchain-regulation-and-challengers-to-silicon-valley

Question 3: Was Stellar a hard fork of Ripple?
Answer: No - Stellar is a new C++ blockchain that "split off from" Ripple around McCaleb's departure; it is not a fork. The codebase is original.
Best source: https://www.bullish.com/us/digital-assets/stellar

Question 4: When was the Stellar Consensus Protocol (SCP) paper published, and when did the SCP-led protocol go live?
Answer: SCP paper published April 2015 (Mazieres). Redesigned SCP-led protocol released April 2015 and went live November 2015.
Best source: https://8130068.fs1.hubspotusercontent-na1.net/hubfs/8130068/stellar-consensus-protocol.pdf

Question 5: What was XLM's initial supply at launch?
Answer: 100 billion lumens, with a 1% annual issuance rate.
Best source: https://stellar.org/learn/lumens

Question 6: How was the initial XLM distributed between bitcoin and XRP holders?
Answer: 20% of initial lumens were distributed to bitcoin (19%) and XRP (1%) holders for free.
Best source: https://stellar.org/foundation/previous-mandate

Question 7: When was inflation ended, and how much was burned on November 4, 2019?
Answer: Inflation ended by validator vote on October 28, 2019. SDF burned 55,442,095,285.7418 XLM (~$4.4B) on November 4, 2019.
Best source: https://www.findas.org/tokenomics-review/coins/the-tokenomics-of-stellar-xlm/r/2hVv1ajyn6SxfqQSc2tqW1

Question 8: What is XLM's total and circulating supply as of mid-2026?
Answer: Total ~50,001,806,812 XLM (max); circulating approximately 33.82 billion XLM.
Best source: https://coinmarketcap.com/currencies/stellar/

Question 9: How did the SDF's share of total XLM supply change with the burn?
Answer: SDF's share dropped from approximately 85% to approximately 60%.
Best source: https://altfins.com/crypto-screener/xlm-stellar

Question 10: Who is the current CEO/Executive Director of SDF and when were they appointed?
Answer: Denelle Dixon, appointed CEO and Executive Director on March 14, 2019 (joined from Mozilla, where she was COO).
Best source: https://stellar.org/press/sdf-appoints-denelle-dixon-as-executive-director-and-ceo

Question 11: Who currently sits on the SDF board of directors?
Answer: Jed McCaleb, Lin-Hua Wu, Ronaldo Lemos, Ginger Baker, Asiff Hirji.
Best source: https://stellar.org/foundation/mandate

Question 12: Is SDF a for-profit company, and where is it incorporated?
Answer: SDF is a non-stock, non-profit corporation organized under Delaware law, self-funded, pays US taxes, with no shareholders.
Best source: https://stellar.org/connect

Question 13: How does SDF fund operations?
Answer: By selling XLM through direct sales and public exchanges on Coinbase, Kraken, and Bitstamp, plus returns on cash-treasury investments (separate from Enterprise Fund).
Best source: https://stellar.org/foundation/mandate

Question 14: When did IBM launch World Wire on Stellar?
Answer: Pilot announced October 2017; production announced March 18, 2019, spanning 50+ countries.
Best source: https://www.prnewswire.com/news-releases/ibm-blockchain-world-wire-a-new-global-payment-network-to-support-payments-and-foreign-exchange-in-more-than-50-countries-300813674.html

Question 15: When did SDF become a minority investor in MoneyGram, and what did it receive?
Answer: August 15, 2023, during Madison Dearborn Partners' go-private deal (announced Feb 15, 2022 at $11/share, $1.8B). SDF received a MoneyGram board seat.
Best source: https://stellar.org/blog/foundation-news/sdfs-investment-in-moneygram-international

Question 16: What is MoneyGram Ramps?
Answer: A developer integration from MoneyGram that enables wallet/app providers to on-ramp (cash -> USDC) and off-ramp (USDC -> cash) in 170+ countries through MoneyGram agent locations, executing on the Stellar blockchain.
Best source: https://stellar.org/products-and-tools/moneygram

Question 17: When did Circle's CCTP go live on Stellar?
Answer: May 19, 2026.
Best source: https://stellar.org/blog/foundation-news/circle-cctp-is-live-on-stellar

Question 18: When did Franklin Templeton launch BENJI/FOBXX on Stellar, and what is it?
Answer: Franklin Templeton launched the Franklin OnChain US Government Money Fund (FOBXX, ticker BENJI) on Stellar in 2021 - the first U.S.-registered mutual fund to use a public blockchain as its official system of record. Five-year anniversary marked April 30, 2026, with $580M+ in tokenized US Treasuries issued.
Best source: https://www.franklintempleton.com/press-releases/news-room/2026/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u.s.-registered-tokenized-money-market-fund

Question 19: When did Mastercard announce its Crypto Credential partnership with Stellar, and when did Visa add Stellar to its settlement platform?
Answer: Mastercard Crypto Credential partnership: October 15, 2024. Visa added Stellar (with EURC, USDG, and PYUSD) to its stablecoin settlement platform: July 31, 2025.
Best source: https://stellar.org/press/stellar-joins-the-mastercard-crypto-credential-ecosystem-to-unlock-verified-interactions-across-public-blockchain-networks

Question 20: When did Wirex go live with dual-stablecoin USDC/EURC Visa settlement on Stellar?
Answer: November 18, 2025, serving 7 million+ Wirex users.
Best source: https://www.prnewswire.com/news-releases/wirex-and-stellar-go-live-with-dual-stablecoin-visa-settlement-in-usdc-and-eurc-for-7-million-users-302618287.html

Question 21: When did Paxos announce integration with Stellar?
Answer: October 16, 2024 (Meridian 2024).
Best source: https://stellar.org/press/paxos-plans-expansion-to-stellar-network-in-collaboration-with-stellar-development-foundation

Question 22: When did Soroban (Stellar smart contracts) go live, and what protocol number?
Answer: Soroban launched on mainnet on February 20, 2024 with Protocol 20. Public dApp deployment was opened afterwards, with $100M Soroban adoption fund announced March 19, 2024.
Best source: https://stellar.org/press/smart-contracts-launch-on-stellar

Question 23: When did the Ukraine electronic hryvnia (e-hryvnia) pilot launch?
Answer: December 14, 2021, by TASCOMBANK and Bitt, under National Bank of Ukraine supervision.
Best source: https://stellar.org/press/ukraine-electronic-hryvnia-pilot-launched-by-tascombank-and-bitt-on-stellar

Question 24: What is UNHCR's Stellar Aid Assist, when did it launch, and how much has it disbursed?
Answer: Stellar Aid Assist, launched by UNHCR in 2022 in Ukrainian cities (Kyiv, Lviv, Vinnytsia), sends USDC to recipient Vesseo wallets that can be redeemed as cash via MoneyGram Ramps. By December 20, 2023, more than $1.1M had been disbursed to over 1,500 individuals.
Best source: https://stellar.org/blog/foundation-news/one-year-of-stellar-aid-assist

Question 25: What are SDF's 2025 XLM account categories (post-mandate-update)?
Answer: Assets and Liquidity, Product and Innovation, Stellar Growth, and SDF Development.
Best source: https://stellar.org/foundation/mandate

Question 26: When did SDF announce its grant program of up to $2M per partner?
Answer: September 7, 2017 (the Stellar Partnership Grant Program).
Best source: https://stellar.org/blog/foundation-news/introducing-stellar-partnership-grant-program

Question 27: When did Lightyear acquire Chain, and what was the successor entity?
Answer: Lightyear acquired Chain, Inc. on September 10, 2018, then rebranded the combined company Interstellar.
Best source: https://www.prnewswire.com/news-releases/chain-merges-with-lightyear-goes-all-in-on-stellar-300709372.html

Question 28: When did Velo Labs merge with Interstellar?
Answer: March 15, 2021, in a nine-figure deal backed by CP Group.
Best source: https://www.theblock.co/linked/98274/cp-velo-stellar-merger

Question 29: When did DTCC announce its tokenization-service connection to Stellar, and when is production targeted?
Answer: May 27, 2026 announcement; production targeted in the first half of 2027.
Best source: https://www.dtcc.com/news/2026/may/27/tokenization-service-to-connect-with-stellar-public-blockchain-as-dtc-advances-multi-chain-strategy

Question 30: What were Stellar's network metrics for full-year 2025?
Answer: $55.6B annual payment volume (+52% YoY), 3.6B transactions, lifetime 21.5B operations, 10.3M unique addresses, 632K monthly actives, on-chain RWAs of $785M by year-end and over $1B in the first week of January 2026.
Best source: https://stellar.org/blog/foundation-news/2025-year-in-review

---

## References

1. *Stellar | Digital Assets*. https://www.bullish.com/us/digital-assets/stellar
2. *Stellar is not a fork of ripple. It is completely different code.*. https://www.reddit.com/r/Stellar/comments/7nl0ne/stellar_is_not_a_fork_of_ripple_it_is_completely/
3. *The Stellar Consensus Protocol: A Federated Model for ...*. https://8130068.fs1.hubspotusercontent-na1.net/hubfs/8130068/stellar-consensus-protocol.pdf
4. *Stellar Consensus Protocol*. https://stellar.org/learn/stellar-consensus-protocol
5. *Stellar*. http://bitcoinwiki.org/wiki/stellar
6. *Fueling the financial industry with open source cross- ...*. https://www.ibm.com/think/topics/cross-border-payments-blockchain
7. *Stellar | Why IBM Built World Wire on Stellar*. https://stellar.org/blog/ecosystem/why-ibm-built-world-wire-on-stellar
8. *IBM World Wire : r/Stellar*. https://www.reddit.com/r/Stellar/comments/19aej68/ibm_world_wire/
9. *IBM blockchain and Stellar partner on cross-border banking*. https://ctmfile.com/story/ibm-blockchain-and-stellar-partner-on-cross-border-banking
10. *How cross border payments work on blockchain*. https://stellar.org/learn/cross-border-payments
11. *Top 10 Stellar Wallets Hold Nearly 80% of XLM Circulating ...*. https://www.bitget.com/news/detail/12560604743447
12. *Stellar (XLM) Tokenomics: Supply, Inflation, and Utility*. https://www.findas.org/tokenomics-review/coins/the-tokenomics-of-stellar-xlm/r/2hVv1ajyn6SxfqQSc2tqW1
13. *The Stellar Foundation has burned over 50% of the total ...*. https://finance.yahoo.com/news/stellar-foundation-burned-over-50-005916105.html
14. *Stellar (XLM) Price Prediction for 2026, 2030 & More*. https://changehero.io/blog/stellar-lumens-price-prediction/
15. *Stellar price - XLM value, charts and news*. https://altfins.com/crypto-screener/xlm-stellar
16. *SDF Mandate*. https://stellar.org/foundation/mandate
17. *Denelle Dixon - Agenda Contributor*. https://www.weforum.org/stories/authors/denelle-dixon/
18. *About Stellar Development Foundation*. https://stellar.org/foundation
19. *Stellar Development Foundation*. https://www.weforum.org/organizations/stellar-development-foundation/
20. *The SDF Team*. https://stellar.org/foundation/team
21. *MoneyGram Ramps: One Integration, Cash Access*. https://stellar.org/products-and-tools/moneygram
22. *MoneyGram and Stellar Extend Partnership to Scale Real ...*. https://www.prnewswire.com/news-releases/moneygram-and-stellar-extend-partnership-to-scale-real-world-stablecoin-utility-globally-302749574.html
23. *MoneyGram Ramps | Connect Crypto to Cash in Minutes*. https://www.moneygram.com/us/en/ramps
24. *On-Ramp & Off-Ramp*. https://developer.moneygram.com/moneygram-developer/docs/integrate-moneygram-ramps
25. *About MoneyGram*. https://corporate.moneygram.com/about-us/
26. *Fast, cheap, and connected. meet USDC and EURC on ...*. https://stellar.org/products-and-tools/circle-usdc-eurc
27. *CCTP (Cross-Chain Transfer Protocol)*. https://www.circle.com/cross-chain-transfer-protocol
28. *Circle CCTP is Live on Stellar*. https://stellar.org/blog/foundation-news/circle-cctp-is-live-on-stellar
29. *USDC Swap: Stellar CCTP Bridge*. https://communityfund.stellar.org/project/usdc-swap-stellar-cctp-bridge-yv8
30. *Stellar integrates Circle's onchain infrastructure to improve ...*. https://www.fow.com/insights/stellar-integrates-circles-onchain-infrastructure-to-improve-usdc-transfers
31. *Paxos Plans Expansion to Stellar Network in Collaboration ...*. https://stellar.org/press/paxos-plans-expansion-to-stellar-network-in-collaboration-with-stellar-development-foundation
32. *Stellar joins the Mastercard Crypto Credential ecosystem to ...*. https://stellar.org/press/stellar-joins-the-mastercard-crypto-credential-ecosystem-to-unlock-verified-interactions-across-public-blockchain-networks
33. *Wirex and Stellar Go Live with Dual-Stablecoin Visa ...*. https://stellar.org/press/wirex-and-stellar-go-live-with-dual-stablecoin-visa-settlement-in-usdc-and-eurc-for-7-million-users
34. *Visa Expands Settlement Platform to Stellar, Avalanche, ...*. https://au.finance.yahoo.com/news/visa-expands-settlement-platform-stellar-142627217.html
35. *Mastercard and Stellar partner for customer verification*. https://www.cnbc.com/video/2024/10/16/mastercard-and-stellar-partner-for-customer-verification.html
36. *Stellar | WisdomTree Case Study*. https://stellar.org/case-studies/wisdomtree
37. *Franklin Templeton, Stellar Development Foundation Mark ...*. https://www.franklintempleton.com/press-releases/news-room/2026/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u.s.-registered-tokenized-money-market-fund
38. *Franklin OnChain U.S. Government Money Fund - FOBXX*. https://www.franklintempleton.com/investments/options/money-market-funds/products/29386/SINGLCLASS/franklin-on-chain-u-s-government-money-fund/FOBXX
39. *Tokenized Investment Assets*. https://stellar.org/learn/tokenized-investment-assets
40. *Digital Funds: A New Era of Tokenized Investing*. https://www.wisdomtreeprime.com/digital-funds-insights/digital-funds-a-new-era-of-tokenized-investing/
41. *Stellar | Ukraine Electronic Hryvnia Pilot Launched by ...*. https://stellar.org/press/ukraine-electronic-hryvnia-pilot-launched-by-tascombank-and-bitt-on-stellar
42. *Ukraine Commercial Bank to Test Digital Currency Built on ...*. https://www.coindesk.com/policy/2021/12/14/ukraine-commercial-bank-to-test-digital-currency-built-on-stellar
43. *Analytical Report on E-hryvnia.pdf*. https://bank.gov.ua/admin_uploads/article/Analytical%20Report%20on%20E-hryvnia.pdf
44. *Ukraine Electronic Hryvnia Pilot Launched by ...*. https://www.prnewswire.com/news-releases/ukraine-electronic-hryvnia-pilot-launched-by-tascombank-and-bitt-on-stellar-301443773.html
45. *Stellar | Ukraine's Instant Transparent Payment Network*. https://stellar.org/case-studies/tpn
46. *How UNHCR Distributes Cash Assistance Through ...*. https://stellar.org/case-studies/unhcr
47. *Resilient with blockchain*. https://stellar.org/resilientblockchain
48. *UNHCR wins award for innovative use of blockchain ...*. https://www.unhcr.org/news/press-releases/unhcr-wins-award-innovative-use-blockchain-solutions-provide-cash-forcibly
49. *Stellar | SDF's Investment in MoneyGram International*. https://stellar.org/blog/foundation-news/sdfs-investment-in-moneygram-international
50. *How corporate treasury management works*. https://stripe.com/resources/more/corporate-treasury-management-101-what-it-is-how-it-works-and-why-it-matters
51. *Stripe Treasury | Business Account to Unify Your Finances*. https://stripe.com/en-ch/treasury
52. *Stellar invests in MoneyGram, gets seat on board*. https://www.theblock.co/post/245395/stellar-invests-in-moneygram-gets-seat-on-board
53. *Payments Network Stellar Announces Investment in Money ...*. https://finance.yahoo.com/news/payments-network-stellar-announces-investment-070454562.html
54. *Board of Directors*. https://sdf.org.bd/board-of-directors
55. *AMA with Stellar Development Foundation - Denelle Dixon ...*. https://www.reddit.com/r/Stellar/comments/d8cian/ama_with_stellar_development_foundation_denelle/
56. *Meet CEO at Stellar Development Foundation, Denelle Dixon*. https://www.nycfintechwomen.com/post/fintech-female-fridays-meet-ceo-at-stellar-development-foundation-denelle-dixon
57. *Denelle Dixon (@DenelleDixon) / Posts / X*. https://x.com/DenelleDixon
58. *Smart Contracts Launch on Stellar with $100M Allocated to Soroban ...*. http://stellar.org/press/smart-contracts-launch-on-stellar
59. *Stellar Soroban: Smart Contracts for Stablecoin Infrastructure*. http://eco.com/support/en/articles/15346520-stellar-soroban-smart-contracts-for-stablecoin-infrastructure
60. *Intro to Stellar | Blockchain for Real World Applications*. http://stellar.org/learn/intro-to-stellar
61. *IBM Blockchain World Wire revolutionize cross-border ...*. https://www.ibm.com/support/pages/ibm-blockchain-world-wire-revolutionize-cross-border-payments
62. *IBM Blockchain World Wire, a New Global Payment ...*. https://www.prnewswire.com/news-releases/ibm-blockchain-world-wire-a-new-global-payment-network-to-support-payments-and-foreign-exchange-in-more-than-50-countries-300813674.html
63. *IBM Launches Stellar-backed 'Blockchain World Wire ...*. https://www.investopedia.com/news/ibm-launches-stellarbacked-blockchain-world-wire-payments-system/
64. *Blockchain Explained*. https://ibm-zcouncil.com/wp-content/uploads/2020/04/BlockchainExplained_zCouncil.pdf
65. *Inside the MoneyGram Acquisition*. https://www.fxcintel.com/research/reports/moneygram-acquisition-teardown-madison-dearborn-partners
66. *MoneyGram International | Investments*. https://www.mdcp.com/portfolio/moneygram-international
67. *MoneyGram Will Go Private in $1.8 Billion Deal With ...*. https://www.digitaltransactions.net/moneygram-will-go-private-in-1-8-billion-deal-with-private-equity-player-madison-dearborn/
68. *Moneygram - Jamieson*. https://jamiesoncf.com/deals/moneygram/
69. *Visa Expands Stablecoin Settlement Support*. https://investor.visa.com/news/news-details/2025/Visa-Expands-Stablecoin-Settlement-Support/default.aspx
70. *Wirex and Stellar Go Live with Dual-Stablecoin Visa ...*. https://www.prnewswire.com/news-releases/wirex-and-stellar-go-live-with-dual-stablecoin-visa-settlement-in-usdc-and-eurc-for-7-million-users-302618287.html
71. *Visa expands stablecoin settlement to include PayPal's ...*. https://www.theblock.co/post/365044/visa-stablecoin-settlement-paypal-pyusd-paxos-usdg-circle-eurc-stellar-avalanche
72. *Visa Expands Stablecoin Support Across Ethereum, ...*. https://atomicwallet.io/academy/articles/visa-stablecoin-payments
73. *How Simple Wallet is Hyper-Scaling Using Wirex BaaS*. http://wirexapp.com/post/how-simple-wallet-is-hyper-scaling-using-wirex-baas-from-zero-to-millions-in-just-weeks
74. *Franklin Templeton launches Franklin OnChain U.S. ...*. https://www.ftinstitutionalemea.com/press-releases/franklin-templeton-launches-franklin-onchain-u.s.-government-money-fund
75. *Invest with Benji | Blockchain-Powered ...*. https://digitalassets.franklintempleton.com/benji/
76. *Franklin Templeton runs the first U.S.-registered mutual ...*. https://stellar.org/case-studies/franklin-templeton
77. *Franklin Templeton, Stellar Development Foundation Mark ...*. https://stellar.org/press/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u-s-registered-tokenized-money-market-fund
78. *Franklin Templeton Launches Tokenized Money Market Fund ...*. https://www.avax.network/about/blog/franklin-templeton-launches-tokenized-money-market-fund-benji-avalanche
79. *Protocol 23 Upgrade Guide*. https://stellar.org/blog/developers/protocol-23-upgrade-guide
80. *Stellar Blockchain Sees $3B of Real World Assets (RWA) ...*. https://www.coindesk.com/business/2025/04/17/stellar-sees-usd3b-of-real-world-assets-coming-on-chain-in-2025
81. *End of Year 2025 Report – Execution at Scale*. https://stellar.org/blog/foundation-news/2025-year-in-review
82. *Announcing Protocol 23*. https://stellar.org/blog/developers/announcing-protocol-23
83. *Tokenize Real-World Assets: Secure, Compliant, Global*. https://stellar.org/use-cases/tokenization
84. *Velo Labs and PDAX open remittance corridor into the ...*. https://www.prnewswire.com/news-releases/velo-labs-and-pdax-open-remittance-corridor-into-the-philippines-using-the-stellar-network-301509603.html
85. *New Jersey Partnership Tax Login*. https://www1.state.nj.us/TYTR_BusinessFilings/jsp/common/Login.jsp?taxcode=43
86. *Stellar for Blockchain-Powered Cross-Border Payments*. https://stellar.org/use-cases/payments
87. *MoneyGram and Stellar Mark Five-Year Partnership with ...*. https://thefintechtimes.com/moneygram-and-stellar-mark-five-year-partnership-with-stablecoin-expansion-across-latam/
88. *Stellar's Role in Cross-Border Payments: Active Corridors ...*. https://x.com/BSCNews/article/2065388883886612845
89. *CP Group-backed Velo merges with Stellar startup Interstellar*. https://www.theblock.co/linked/98274/cp-velo-stellar-merger
90. *Interstellar and Velo Labs Join Forces : r/Stellar*. https://www.reddit.com/r/Stellar/comments/m5dh2n/interstellar_and_velo_labs_join_forces/
91. *Blockchain company Chain acquired by Stellar*. https://finance.yahoo.com/news/blockchain-company-chain-acquired-stellar-134018150.html
92. *Lightyear buys U.S. blockchain start-up Chain; to move ...*. https://www.reuters.com/article/world/lightyear-buys-us-blockchain-start-up-chain-to-move-business-to-stellar-idUSKCN1LQ15Z/
93. *Announcing Interstellar. Lightyear has acquired Chain and is now…*. http://medium.com/interstellar/announcing-interstellar-24ff0bc2d89c
94. *Stellar Lumens*. https://stellar.org/learn/lumens
95. *Stellar distribution concerns.*. https://www.reddit.com/r/Stellar/comments/7xhj9h/stellar_distribution_concerns/
96. *SDF Mandate (2017)*. https://stellar.org/foundation/previous-mandate
97. *Stellar (payment network)*. https://en.wikipedia.org/wiki/Stellar_(payment_network)
98. *Soroban | Smart Contracts Platform on Stellar*. https://stellar.org/soroban
99. *Quarterly Reports*. https://stellar.org/quarterly-reports
100. *What Is Stellar? The Payments-First Blockchain for 2026 - Eco*. https://eco.com/support/en/articles/15346517-what-is-stellar-the-payments-first-blockchain-for-2026
101. *Q1 2025 Quarterly Report*. https://bitcoinke.io/wp-content/uploads/2025/05/Stellar-Development-Foundation-Q1-2025-BitKE.pdf
102. *Stellar Payments news | Lumen Loop*. https://lumenloop.com/news?tag=payments
103. *Jed McCaleb*. https://en.wikipedia.org/wiki/Jed_McCaleb
104. *Adventures In Updating A Legacy Codebase - Billy Baker ...*. https://www.youtube.com/watch?v=HhtxZ3CXdu4
105. *Who Is Jed McCaleb | Ripple, Stellar, Mt Gox Founder*. https://phemex.com/academy/jed-mccaleb-ripple-stellar-mtgox
106. *XLM Crypto Explained – Beginner's Guide to Stellar Lumens*. https://changehero.io/blog/what-is-stellar-lumens-xlm-a-beginners-guide/
107. *EN - What is Stellar*. https://nbx.com/en/whatisstellar
108. *Stellar (payment network) - Wikipedia*. https://en.wikipedia.org/wiki/Stellar_%28payment_network%29
109. *description: Smart contracts on Stellar marks the network’s biggest upgrade in its 10-year history. Already a world leader in crypto payments, Stellar now supports decentralized finance (DeFi) and applications (dapps). The Stellar Development Foundation is deploying a $100M Soroban adoption fund. title: Stellar | Smart Contracts Launch on Stellar with $100M Allocated to Soroban Adoption Fund image: https://cdn.sanity.io/images/e2r40yh6/production-i18n/a36a4713e42a88ff4c024b1ec8938b6b1b842d1b-2024x1012.png?rect=48%2C0%2C1928%2C1012&w=1200&h=630&v=2*. https://stellar.org/press/smart-contracts-launch-on-stellar
110. *Announcing Interstellar. Lightyear has acquired Chain and is now… | by Interstellar | Interstellar | Medium*. https://medium.com/interstellar/announcing-interstellar-24ff0bc2d89c
111. *DTCC Connects Tokenization Service to Stellar Blockchain*. https://www.dtcc.com/news/2026/may/27/tokenization-service-to-connect-with-stellar-public-blockchain-as-dtc-advances-multi-chain-strategy
112. *Stellar | Tala Joins the Stellar Ecosystem to Build Out ...*. https://stellar.org/blog/ecosystem/tala-joins-the-stellar-ecosystem-to-build-out-digital-banking-capabilities
113. *Tala Brings AI-Native Credit Infrastructure On-Chain with Airtm  - Tala*. http://tala.co/blog/2026/05/06/tala-brings-ai-native-credit-infrastructure-on-chain-with-airtm
114. *Cross-Border Payments with Stellar Blockchain*. https://www.rapidinnovation.io/post/how-can-stellar-blockchain-simplify-cross-border-payments
115. *Stripe co-founder Patrick Collison on blockchain ...*. https://mitsloan.mit.edu/ideas-made-to-matter/stripe-co-founder-patrick-collison-blockchain-regulation-and-challengers-to-silicon-valley
116. *Stripe ending bitcoin support... but what do they say about ...*. https://www.reddit.com/r/Stellar/comments/7sgsnk/stripe_ending_bitcoin_support_but_what_do_they/
117. *Grow Your Business with Stripe | Stripe Startups*. https://stripe.com/startups
118. *The untold story of Stripe*. https://thefinanser.com/2018/12/untold-story-stripe
119. *How Would Stellar and Stripe Work Together*. https://www.bitget.com/wiki/how-would-stellar-and-stripe-work-together
120. *Stellar | Service Providers*. https://stellar.org/ecosystem/service-providers
121. *Stellar | Stellar Disbursement Platform*. https://stellar.org/products-and-tools/disbursement-platform
122. *Two Massive Stellar Partnerships!CEO INTERVIEW Denelle ...*. https://www.youtube.com/watch?v=XoL_zIg9neU
123. *Nium and Stellar Development Foundation Partner to ...*. https://www.nium.com/newsroom/nium-and-stellar-development-foundation-partner-to-enable-pay-outs-in-190-countries
124. *Stellar Holdings*. https://stellar.com/
125. *Bringing Stellar to the Regions That Matter*. https://stellar.org/blog/foundation-news/bringing-stellar-to-the-regions-that-matter
126. *SatoshiPay launches Stellar integration and six new ...*. https://satoshipay.medium.com/satoshipay-launches-stellar-integration-and-six-new-partnerships-1ce6c74059b6
127. *Stellar + Satoshipay Partnership*. https://www.reddit.com/r/Stellar/comments/7c3694/stellar_satoshipay_partnership/
128. *SatoshiPay*. https://stellar.org/press/stellar-development-foundation-announces-enterprise-fund-investment-in-satoshipay
129. *How SatoshiPay is Using Stellar to Transform Online Publishing*. https://www.youtube.com/watch?v=aaCc0s1bWAs
130. *Lightyear.io: Funding, Team & Investors*. https://startupintros.com/orgs/lightyear-io
131. *Chain Merges with Lightyear, Goes All-In on Stellar*. https://www.prnewswire.com/news-releases/chain-merges-with-lightyear-goes-all-in-on-stellar-300709372.html
132. *Stellar-Based Lightyear Acquires Chain, Forms New Entity*. https://finance.yahoo.com/news/stellar-based-lightyear-acquires-chain-135508238.html
133. *Validators: Role, Setup, and Importance in Network ...*. https://developers.stellar.org/docs/validators
134. *Stellar price today, XLM to USD live ...*. https://coinmarketcap.com/currencies/stellar/
135. *Stellar (XLM) Price Prediction 2026 – Is a Massive Bull Run ...*. https://bitcoinfoundation.org/news/analysis/stellar-price-prediction-2026-is-massive-bull-run-coming/
136. *Stellar Lumens Price, XLM Price, Live Charts, and Marketcap*. https://www.coinbase.com/price/stellar
137. *Mastercard And Onafriq Boost Africa's Financial Services*. https://onafriq.com/press/article/mastercard-and-onafriq-partner-to-increase-accessibility-to-financial-services-across-africas-payment-ecosystem
138. *Onafriq: Africa's Largest Digital Payments Gateway*. https://onafriq.com/
139. *How to Transform Financial Access in Africa with Onafriq's ...*. https://www.youtube.com/watch?v=cFeKN0yOt8M
140. *How to Transform Financial Access in Africa with Onafriq's ...*. https://meridian.stellar.org/sessions/how-to-transform-financial-access-in-africa-with-onafriqs-real-time-payments
141. *Yuno Partners with Onafriq to Unlock Pan-African ...*. https://onafriq.com/press/article/yuno-partners-with-onafriq-to-unlock-pan-african-payments-for-global-merchants
142. *Stellar price prediction 2026-2030: the compliance-first bet*. https://crypto.news/stellar-price-prediction-2026-2030-the-compliance-first-bet/
143. *Financials - Quarterly Results - Stellar Bancorp, Inc.*. https://ir.stellar.bank/financials/quarterly-results/default.aspx
144. *Stellar 2025: A Podium Finish*. http://stellar.org/blog/ecosystem/stellar-2025-year-in-review
145. *End of Year 2025 Report – Execution at Scale*. http://stellar.org/blog/foundation-news/2025-year-in-review
146. *Stellar Enterprise Fund: Catalyst for Web3 Innovation & ...*. https://stellar.org/enterprise-fund
147. *Puntored raises $2M from Stellar Development Foundation*. https://latamlist.com/puntored-raises-2m-from-stellar-development-foundation/
148. *Stellar Development Foundation*. https://www.crunchbase.com/organization/stellar
149. *Stellar Development Foundation Enterprise Fund Invests ...*. https://stellar.org/press/stellar-development-foundation-enterprise-fund-invests-10-million-in-netxd
150. *Academic Research Grants | SDF Research*. https://research.stellar.org/research-grants
151. *Animoca Brands | Reimagining future economies*. https://www.animocabrands.com/
152. *Newsroom*. https://www.animocabrands.com/newsroom?3cd02193_page=15&f1a37b42_page=15
153. *Animoca Brands has a web3 portfolio worth $1.5B because ...*. https://protos.com/animoca-brands-has-a-web3-portfolio-worth-1-5b-because-it-said-so/
154. *Animoca Brands - Crunchbase Company Profile & Funding*. https://www.crunchbase.com/organization/animoca-brands-corporation
155. *Animoca Brands*. https://en.wikipedia.org/wiki/Animoca_Brands
156. *Stellar Anchor Directory*. https://anchors.stellar.org/
157. *Stellar Aid Assist used to deliver $1.1 million in aid*. https://stellar.org/blog/foundation-news/one-year-of-stellar-aid-assist
158. *Is this the result of Stellar's partnership with ukraine?*. https://www.reddit.com/r/Stellar/comments/1gx3ysz/is_this_the_result_of_stellars_partnership_with/
159. *Stellar Aid Assist - Stellar Development Foundation*. https://www.anthemawards.com/winners/list/entry/#!responsible-technology/best-use-of-technology/stellar-aid-assist/1972/-1/535124
160. *Revolutionizing Global Aid: Stellar Aid Assist and the Power of ...*. https://www.reddit.com/r/Stellar/comments/19b5q6l/revolutionizing_global_aid_stellar_aid_assist_and/
161. *IBM Power8 end of service: What are my options?*. https://www.ibm.com/new/announcements/ibm-power8-end-of-service
162. *Is IBM WorldWire seeing any use yet? : r/Stellar*. https://www.reddit.com/r/Stellar/comments/d06l3p/is_ibm_worldwire_seeing_any_use_yet/
163. *Stellar Health & PCDC Partnership: Q&A on Supporting ...*. https://www.pcdc.org/press-release/stellar-health-pcdc-partnership-qa-on-supporting-providers-in-their-shift-towards-value/
164. *Introducing the Stellar Partnership Grant Program*. https://stellar.org/blog/foundation-news/introducing-stellar-partnership-grant-program
165. *Newly announced partnership between Circle and Visa ...*. https://www.reddit.com/r/Stellar/comments/kveimr/newly_announced_partnership_between_circle_and/
166. *Built on Stellar - Vibrant*. https://www.youtube.com/watch?v=WL1zgBMAFxI
167. *Stellar Development Foundation Appoints Denelle Dixon ...*. https://stellar.org/press/sdf-appoints-denelle-dixon-as-executive-director-and-ceo
168. *Denelle Dixon - Chief Executive Officer ...*. https://www.linkedin.com/in/denelledixon
169. *Denelle Dixon*. https://corporate.moneygram.com/denell-dixon
170. *Joyce Kim - NextBillion*. https://nextbillion.net/authors/joyce-kim/
171. *Overview ‹ Joyce Kim*. https://www.media.mit.edu/people/joycekim/overview/
172. *Joyce Kim, Stellar at Fast Forward Demo Day 2015*. https://www.youtube.com/watch?v=8f98nmidUi8
173. *Joyce Kim*. http://bitcoinwiki.org/wiki/joyce-kim
174. *Joyce Kim Stellar - San Francisco, California*. https://about.me/kimstellar2017
