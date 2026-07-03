# Task Run Results

**Run ID:** trun_04740bf111ed4e89a5c469f20979a9c7
**Status:** ✅ completed
**Processor:** pro
**Created:** 2026-06-22T17:26:42.783954Z
**Modified:** 2026-06-22T17:34:04.080489Z

## Output

# Stellar's Regulatory, Compliance, Legal, and Real-World-Asset/Payments Posture: Analyst-Grade Reference Dossier (June 2026)

## Executive Summary

- **Compliance tooling is a first-class native capability**: SEP-10 (web auth), SEP-12 (KYC), SEP-8 (regulated assets / approval server) plus native `AUTH_REQUIRED`, `AUTH_REVOCABLE`, `AUTH_IMMUTABLE`, and Protocol 17 `AUTH_CLAWBACK_ENABLED` flags mean issuers can run compliant tokenized securities from day one without bespoke smart contracts -> Anchor operators and issuers have a defensible technical baseline aligned with SEC, FinCEN, and MiCA expectations.
- **XLM moved closer to commodity classification in March 2026**: SEC Press Release 2026-30 (March 17, 2026) and the parallel SEC/CFTC joint interpretation established a five-part token taxonomy, with XLM cited in coverage as one of the 16 crypto assets classified as a digital commodity -> core token risk profile is now materially lower than during the 2018-2024 "Is XLM a security?" era, though a Supreme-Court-of-securities-law precedent has not yet been litigated.
- **EURC on Stellar is the first MiCA-compliant euro stablecoin**: €380.9M in circulation as of June 15, 2026 across Avalanche, Base, Ethereum, Solana, and Stellar, with Circle Mint providing 1:1 euro on/off-ramp -> MiCA exposes USDC/EURC as the only institutional-grade cross-Atlantic stablecoin gateway structurally supported today.
- **MGUSD launch on June 2, 2026 reframes the MoneyGram-Stellar thesis**: MoneyGram issued its own US-dollar stablecoin (issuer Bridge/Stripe, M0 minting, Fireblocks custody) on Stellar, integrated into the MoneyGram app for self-custody + cash-out at ~500K retail locations -> creates a vertically integrated, GENIUS-Act-aligned remittance rail rather than a third-party stablecoin ride.
- **BENJI is now a five-year, public-record tokenized money-market fund**: Franklin Templeton and SDF announced the 5-year milestone on April 30, 2026; DTCC's May 27, 2026 announcement adds another institutional anchor via a December 2025 SEC no-action letter -> anchor RWA stack now includes Franklin Templeton, WisdomTree (13 funds + Gold token, 41 states), DTCC (Treasuries/ETFs/Russell 1000 in 1H27), and MoneyGram's MGUSD.
- **Humanitarian aid has a measurable track record**: UNHCR disbursed $4.6M to ~2,500 households in Ukraine via Stellar Aid Assist as of December 19, 2024, expanding to Argentina for refugee entrepreneurs, with cash-out in 185+ countries and processing fees reported at approximately 1 US cent per 10,000 transactions -> builds a compliance-grade case study for FATF Travel Rule readiness under extreme-distribution conditions.
- **MoneyGram Ramps interoperability runs on SEP-24**: USD-denominated on/off-ramp via USDC on Stellar with allow-listed wallet domains and explicit per-transaction limits ($5 USDC min / $2,500 USDC max off-ramp) -> partner-integration risk moves from "binary connectivity" to "compliance-review SLA".
- **Anchor KYC/AML is enabled through Anchor Platform + FinClusive CaaS**: SDF's inclusion-via-compliance blog documents FinClusive's Travel-Rule and BSA/USA PATRIOT Act toolkit, with named anchor wallet partners (Kado, Bitso, Biccos, MoneyGram, Nium, Striim) -> the gap between B2B anchors and consumer money-transmitter obligations is now largely defined, but final licensing jurisdiction remains the anchor's responsibility.
- **Major legal/regulatory tailwinds in 2025-2026**: GENIUS Act passed July 18, 2025 (S.1582); the Senate Banking Committee advanced the CLARITY Act in a historic bipartisan vote on May 14, 2026; SEC's "Project Crypto" under Chair Atkins formalized a five-part crypto taxonomy on March 17, 2026 -> creates the most defined US federal framework since 2017, even as some bright-line questions remain for decentralized tokens.
- **Risk surface is explicit and disclosed**: Protocol 17 Asset Clawback was specifically designed "to allow asset issuers to meet securities regulations, which in many jurisdictions require asset issuers (or designated transfer agents) to have the ability to revoke assets" -> clawback is positioned as a regulatory tool, not a security flaw, but it places XLM holders' counterparty risk on issuer-side compliance.
- **Audit posture is mature but fragmented**: HackerOne vulnerability disclosure (last updated June 9, 2026), Soroban Security Audit Bank for SCF grants, an active Stellar Bug Bounty Program, and core-protocol audits across the public repo, plus DTCC's $114T custody load anchoring reliability expectations -> there is no public record of a Stellar-protocol-level funds-loss incident; mainnet stability has been consistent (7M+ accounts, 10B+ operations verified by May 1, 2024).
- **Frontier risk**: October 2025 Circle MiCA-compliant EURC supply at ~€427M (~41-50% euro-stablecoin share) is dominated by MiCA compliance, not product features; MiCA is effectively re-routing the European euro-stablecoin market to Stellar's venue -> makes a regulatory disruption to EURC-Stellar an existential risk for the network's EU payments density.

## 1. Native Compliance and Asset-Control Tooling on Stellar

### 1.1 SEP Taxonomy (open standards at GitHub stellar/stellar-protocol)

Stellar's compliance surface is exposed as a small, stable set of Stellar Ecosystem Proposals (SEPs) maintained in the stellar-protocol repository. Each SEP is feature-frozen once accepted and cited verbatim by developers.stellar.org.

| SEP | Surface | Role | Source |
|-----|---------|------|--------|
| SEP-10 | Stellar Web Authentication | Wallet signs a transaction to prove control of a Stellar account; anchors issue signed JSON web tokens once the signed tx is verified; enables custodial and non-custodial authentication flows | developers.stellar.org/docs/build/apps/wallet/sep10 |
| SEP-12 | KYC Data Sharing | A standard way for Stellar clients to upload KYC / other customer information to anchors and other services, dated September 11, 2018 | github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md |
| SEP-8 | Regulated Assets / Approval Server | Anchor runs an Approval Server that "validates client transactions according to the service's approval criteria. Validated transactions are signed by the asset's issuing" account and rebroadcast | github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md |

Mechanism -> The Approval Server acts as a gatekeeper between a wallet's signed transaction and the underlying Stellar ledger: the wallet prepares a regulated transaction, the issuer signs it after verifying sender and recipient against the issuer's off-chain KYC/AML policy, and then the network consumes the dual-signed transaction. As WisdomTree stated publicly, they "leveraged the Stellar network standard for Regulated Assets" to "create assets that require an issuer's approval to transact with", and on Stellar the tokenization process is a "four-step process that does not require a smart contract" [11].

Strategic implication -> SEP-8 + SEP-10 + SEP-12 effectively replicate the disclosure lifecycle of a regulated transfer agent (authenticate applicant, post KYC, gate regulated assets) using only ledger primitives. Regulators get a digestible audit trail anchored in immutable records; issuers avoid bespoke off-chain infra that drifts from the protocol.

### 1.2 Asset Authorization Flags and Protocol 17 Clawback

Account-level asset authorization on the Stellar network uses a small set of flags. The Stellar Developers documentation enumerates three levels of authorization an asset issuer can remove using the `Set Trustline Flags` operation, and the `Clawbacks` guide explicitly states: issuers must have the `AUTH_REVOCABLE_FLAG` set to enable the `AUTH_CLAWBACK_ENABLED` flag [44].

| Flag | Function | Use Case |
|------|----------|----------|
| `AUTH_REQUIRED_FLAG` | Issuer must approve every trustline before a wallet can hold the asset | Default for regulated tokens |
| `AUTH_REVOCABLE_FLAG` | Issuer can revoke a trustline at any time | Required pre-condition for clawback |
| `AUTH_CLAWBACK_ENABLED` | Issuer can burn a specific amount from any holder | Securities-recall anti-fraud mechanism |
| `AUTH_IMMUTABLE_FLAG` | Locks all authorization flags once set | Finalizes asset governance posture |

Clawback was introduced by CAP-0035 (Asset Clawback). The Stellar blog post "Using Protocol 17's Asset Clawback" (June 15, 2021) describes "a set of two new operations and an account flag that allows issuers to claw back tokens from any token-holding account" [47]. The Stellar docs frame the design intent as: claws were "designed to allow asset issuers to meet securities regulations, which in many jurisdictions require asset issuers (or designated transfer agents) to have the ability to revoke assets in the event of a mistaken or fraudulent transaction or other regulatory action regarding a specific person or asset" [44].

Mechanism -> An issuer needs both flags active: first `AUTH_REVOCABLE_FLAG` to expose the revocation operation, then `AUTH_CLAWBACK_ENABLED` to expose the burn-from-any-balance operation. Once enabled, issuers can specify a recipient account + asset code + amount and the network burns that amount from the holder's balance without requiring the holder's cooperation.

Recommendation -> Issuers building regulated tokens on Stellar should explicitly enable `AUTH_REQUIRED_FLAG` at issuance and document a written escalation procedure that triggers clawback, mapping it to FATF Travel Rule and BSA/USA PATRIOT Act compliance pathways (see Section 2). Anchors running SEP-24 host-end approval servers should mirror these flag states in their off-chain KYC decision log.

### 1.3 Soroban Smart Contracts, Stellar Asset Contract, and the Audit Bank

Soroban (Stellar's smart contract platform, integrated into the core protocol) introduced programmable logic to Stellar assets. The Stellar Asset Contract (SAC) is the canonical interface layer: "The Stellar Asset Contract allows users and contracts to make payments with, and interact with, assets" [46]. For compliance-bounded use cases, the SAC inherits the underlying native asset's authorization flags, so a `AUTH_CLAWBACK_ENABLED` asset remains clawback-eligible when used through a Soroban contract.

The Soroban Security Audit Bank provides "comprehensive, structured security audits for eligible projects funded through the Stellar Community Fund (SCF)" [63], and the global Stellar vulnerability-disclosure program is hosted on HackerOne ("The Stellar.org Vulnerability Disclosure Program enlists the help of the hacker community at HackerOne to make Stellar.org more secure", last updated June 9, 2026) [64].

Strategic implication -> For tokenized assets whose logic exceeds four steps (futures, conditional payments, issuance trust ladders), Soroban is mandatory, and the SAC pattern keeps regulated-token flag semantics intact. The Audit Bank and HackerOne program act as the principal on-chain disclosure regime for the protocol.

## 2. Anchor Architecture and KYC/AML Compliance

### 2.1 What an Anchor Is and What It Must Do

Anchors "connect the Stellar network to traditional banking rails so that currencies around the world can interoperate on a single, seamless platform" [88]. The Stellar site bases anchors more clearly as "regulated financial institutions" [50]. The Anchor Platform is the open-source reference implementation that lets wallet providers, custodians, and fintechs plug into the anchor's compliance stack [48].

A working anchor stack combines, in order of flow:

1. WALLET authentication via SEP-10 (signed transaction proves account control) [4].
2. KYC upload via SEP-12 (customer data sent to the anchor's KYC store; data schema is anchored in SEP-12) [3].
3. Decision by the anchor's off-chain policy system (cue FinClusive, sanctions screening, beneficial-owner / Travel Rule data match).
4. Optional SEP-8 Approval Server gate for regulated assets: transaction validated by issuer's approval server before quorum entry [2].
5. SEP-24 Hosted Deposit/Withdrawal flow for fiat-to-crypto and back, including MoneyGram Ramps for cash-in/cash-out MoneyGram Ramps developer docs.
6. Native flag enforcement on the asset itself (`AUTH_REQUIRED`, `AUTH_REVOCABLE`, `AUTH_CLAWBACK_ENABLED`).

### 2.2 FinClusive "Compliance as a Service"

SDF's policy team has published that FinClusive provides a compliance toolkit including "Compliance as a Service" (CaaS) for anchors, enabling "near-instant verification validation of these clients across the network as a shared utility" [49]. The same post documents that on September 9, 2020 SDF and FinClusive "explored compliant Stellar usage in the context of the Bank Secrecy Act (BSA) and the USA PATRIOT ACT". Anchors cited as integrated users include Biccos (Mexico remittance). The Travel Rule is operationalized via KYB/KYC at the FinClusive layer.

Mechanism -> FinClusive effectively operates as a KYC/AML clearinghouse shared across anchors, so that a wallet's customer verified once with anchor A can be reused by anchor B without re-onboarding, subject to consent. This shifts KYC marginal cost from anchor-by-anchor to network-wide amortization, which is consistent with Treasury Department and FATF expectations that compliance infrastructure should be reusable rather than duplicative.

### 2.3 Reference Revenue Stream Per Anchor (illustrative)

Anchors paying for the Anchor Platform reference implementation can deploy it on their own infrastructure or consume SDF-hosted components; SDF partners include Kado ("CEO Emery Andrew stated integrating SEP-24 allowed them to "easily connect with Stellar ecosystem wallets through a standardized API""), Bitso ("Eduardo Cruz reported the Anchor Platform allowed their team to "access cross-border payments on the Stellar network" within weeks"), Nium ("Partnered with the Stellar Development Foundation to "enable pay-outs in 190 countries""), and Strieem/Stellar (per the publicly listed anchors) [48].

| Anchor / Platform Partner | Headline Capability | Primary Geography |
|--------------------------|---------------------|-------------------|
| MoneyGram Ramps | Cash-in/cash-out of USDC at ~500K retail locations in 170+ countries via SEP-24 | Global, GTN-strong |
| Nium | Payouts in 190 countries; integrated with SDP | Cross-border payouts |
| Bitso | Anchor in Mexico; remittance flows from US to MX | Mexico / LatAm |
| Biccos | Cross-border remittance US-Mexico via FinClusive | Mexico |
| Kado | SEP-24 integration for fiat ramps (USD/EUR/MXN) | US / Mexico / EU |
| Tempo, Kraken, MoneyGram | "Partner to [scale real-world stablecoin utility globally]" | North America / global |
| Volcano | MoneyGram partnership at Stellar House Mexico City (April 22, 2026) | LatAm / global |

Source: [86]; Nium newsroom.

Recommendation -> Wallet providers under MSB/money-transmitter regimes should treat the Anchor Platform + FinClusive CaaS as a reference blueprint for shared utilities and route per-transaction decisions through the SEP-8 Approval Server. Anchor operators should publish a license map for every jurisdiction in which they on-board customers; this complements, but does not replace, native Stellar flag enforcement.

## 3. Regulatory Status of XLM and USDC/EURC Stablecoins

### 3.1 XLM Classification: From Unclear to Digital Commodity

XLM's status has shifted materially during 2025-2026. The most important event was SEC Press Release 2026-30, dated March 17, 2026, titled "SEC Clarifies the Application of Federal Securities Laws to Crypto Assets". According to the Sullcrom analysis, the SEC's March 17, 2026 interpretation "establishes a five-part token taxonomy" [68]. Coverage of the SEC/CFTC joint interpretation that followed three days later (March 20, 2026) describes the rule as deeming "the sale of a digital commodity to qualify" for a Section 4(a)(8) exemption [57]. The SEC's interpretive PDF is at [67].

Operating assumption: XLM is treated as a digital commodity for the purposes of US federal securities regulation as of March 17, 2026, but this is interpretive guidance and a hostile administration could revisit the question. Flag -> uncertain evolving; precise legal weight subject to litigation and any Congressional reversal. The Phemex Academy note that "XLM was included in the March 17, 2026, SEC/CFTC joint final rule that classified 16 crypto assets as digital commodities" is a secondary characterization [25] and should be cross-checked against the official SEC interpretive release.

Mechanism -> Project Crypto under SEC Chair Atkins produced a five-part token taxonomy (digital commodities, digital securities, wrapped stablecoins, stablecoins, NFTs) so each token gets one classification and the corresponding regulator. For XLM, the digital-commodity bucket lines up with prior CFTC treatment of similar Layer-1 settlement tokens.

### 3.2 USDC and EURC: MiCA-Compliant on Stellar, GENIUS-Act-Ready in the US

Circle expanded USD Coin to Stellar in late 2020; the Circle blog post of October 15, 2020 reads: "Circle will support USDC Stellar across its suite of payments and infrastructure APIs and business account products by Q1 2021" [28]. The relevance of that decision for 2026 is that USDC and EURC have been continuously issued on Stellar for ~5.5 years.

EURC's MiCA dimension is documented by Circle itself: "EURC is a euro-backed stablecoin that's accessible globally on Avalanche, Base, Ethereum, Solana, and Stellar. Similar to USDC, EURC is MiCA-compliant" [29]. As of June 15, 2026, EURC had €380.9 million in circulation and reserves per the Q1 2026 Stablecoin Report [31]. The Bleap / StablecoinInsider data points: ~€427M market cap, 41-50% euro-stablecoin share.

For USDC under the US GENIUS Act (S.1582, signed July 18, 2025) [95], Circle is "regulated in Bermuda, France, Singapore and the UK, as well as licensed as a money transmitter in 49 states" [98], which provides the regulatory perimeter for USDC issued on Stellar. The GENIUS Act Richmond Fed treatment of the bill is "the GENIUS Act requires any payment stablecoin issuer to adhere to a regulatory framework" [96].

MGUSD, MoneyGram's own stablecoin launched June 2, 2026, was explicitly named a "GENIUS-Act-ready issuer" via Bridge (a Stripe company), with mint/burn infrastructure by M0 and custody by Fireblocks [23].

### 3.3 Comparative Stablecoin Treatment on Stellar

| Stablecoin | Issuer | US Status | EU Status | Blockchains incl. Stellar | Reference |
|------------|--------|-----------|-----------|---------------------------|-----------|
| USDC | Circle Internet Financial | NYDFS regulated; GENIUS-Act-ready; money transmitter in 49 states | MiCA-compliant (Circle has French EMI) | Yes (since Q1 2021) | [28] |
| EURC | Circle | Same as USDC | MiCA-compliant euro stablecoin | Yes (since Sep 2023) | [29] |
| MGUSD | Bridge (Stripe) for MoneyGram | GENIUS-Act-ready issuer designation | n/a (omitted from EU release) | Stellar only | [23] |
| Franklin Templeton BENJI | Franklin Templeton (issuer) | SEC-registered 1940 Act fund, FOBXX ticker, multi-chain (Stellar, Avalanche, Arbitrum, Optimism, Polygon) | EU treatment: not MiCA-targeted; passported as regulated UCITS fund where applicable | Yes (since 2021) | [13] |

Takeaway -> USDC/EURC give Stellar its only MiCA-compliant institutional stablecoin route today; MGUSD gives MoneyGram a vertically-integrated GENIUS-Act-anchored rail with the smallest current EU footprint.

## 4. Real-World Asset (RWA) Tokenization on Stellar

### 4.1 Franklin Templeton BENJI: Five-Year Track Record from a 1940 Act Fund

Franklin Templeton's "Franklin OnChain US Government Money Fund" (FOBXX) was launched in April 2021 and tonkenized shares (BENJI) live on Stellar alongside Avalanche, Arbitrum, Optimism, and Polygon. The April 30, 2026 press release from Franklin Templeton marked "Five Years of BENJI, the First U.S.-Registered Tokenized Money Market Fund" [12]. The fund's defining facts from the product page: it "invests at least 99.5% of its total assets in US government securities, cash and repurchase agreements collateralized fully by US government" assets [13].

Legal structuring -> BENJI is a regulated 1940 Act mutual fund whose ledger representation is a separate recordkeeping layer; civil-law dominion and control remain with Franklin Templeton's transfer agent. Redemption, NAV calculation, and shareholder rights follow traditional 1940 Act procedures, with Stellar merely substituting a distributed ledger for the fund/unit share register. The fund ticker (FOBXX) and SEC registration carry the substantive obligations; the Stellar token is the share.

Mechanism -> Securities are tokenized as native Stellar assets, not Soroban contracts. The combination of `AUTH_REQUIRED_FLAG` (issuance-level authorization) and BENJI's regulator-recognized share ledger produces an audit trail that bankers, auditors, and rating agencies can navigate without learning a new primitve. The Stellar blog and asset-control documentation explicitly identify this as the standard regulated-asset pattern [43]; [46].

### 4.2 WisdomTree: 13 Digital Funds + Gold Token, 41 US States

WisdomTree moved thirteen digital funds plus a 1:1 physical gold token onto Stellar, marketed through the WisdomTree Prime retail app. On May 1, 2024 SDF announced "WisdomTree Prime is available in 41 states, representing 75% of the U.S. population" [70]. SDF CEO Denelle Dixon stated on the record: "Trusted financial institutions like WisdomTree are choosing the Stellar network to tokenize real-world assets because it can provide unparalleled control with respect to regulated assets and access to a global ecosystem of businesses hosted on the network".

Legal structuring -> WisdomTree's funds likely operate under a US-registered investment company structure (1940 Act) where the token represents beneficial ownership with transfer-agent-equivalent protection. WisdomTree Prime itself is operated by WisdomTree Digital Trust, a New York chartered limited liability trust company, which provides activity-locus-specific regulation.

Mechanism -> The four-step tokenization flow WisdomTree adopted (configure native asset, lock authorization flags, deploy issuer account with `AUTH_REQUIRED`, enable SEP-8 approval gating for transfers) replaces a smart-contract proxy issuer. This is what makes Stellar materially easier to audit than ERC-20 wrapped representations for a US bank counsel.

### 4.3 DTCC-DTC Tokenization on Stellar: From No-Action to Production in 1H27

On May 27, 2026, DTCC and SDF announced that "DTC's Tokenization Service to Connect with Stellar Public Blockchain as DTC Advances its Multi-Chain Strategy" [26]. The integration "makes DTC-tokenized assets available in the first half of 2027 (1H27)" and is built on a "No-Action Letter from the U.S. Securities and Exchange Commission (SEC) received in December 2025". Asset classes under evaluation: "U.S. Treasury bills, notes, and bonds, ETFs tracking major indices, and constituents of the Russell 1000".

DTCC scale: in 2025, "DTCC subsidiaries processed securities transactions valued at U.S. $4.7 quadrillion" and the depository subsidiary "provided asset servicing and custody for securities from over 150 countries and territories valued at U.S. $114 trillion". Leadership named: Frank La Salla (DTCC CEO), Brian Steele (MD / President of Clearing & Securities Services), Nadine Chakar (MD / Global Head of DTCC Digital Assets), Denelle Dixon (SDF CEO and Executive Director).

Legal and procedural implications -> The SEC no-action posture is procedural relief for DTCC's transfer-agent-equivalent activity; the SEC has indicated a willingness to issue relief for tokenized securities issuance without invoking the registration framework, provided civil-law entitlements are preserved. Investors would have the same entitlements, safeguards, and protections as traditional securities.

Risk flag -> 1H27 launch is forward-looking; the SEC no-action letter is not a public document and its specific exemption scope is unclear in the public record; destabilizing new SEC guidance or a major de-platforming event could delay or withdraw the integration.

### 4.4 MoneyGram-Supported RWA / Stablecoin Stack: Tempo, Kraken, MGUSD

On April 22, 2026 at Stellar House Mexico City, MoneyGram and SDF "extended [their] Partnership to Scale Real-World Stablecoin Utility Globally", partnering with Tempo, Kraken, and a third partner named in the announcement, focusing on "the MoneyGram app that gives customers the ability to hold funds or cash out on their own terms" [84].

## 5. Cross-Border Payments, Remittances, and Humanitarian Aid

### 5.1 MoneyGram Ramps / Stellar: Full Stack Integration

The Stellar Disbursement Platform (SDP) and MoneyGram Ramps are two complementary products. Ramps is "a MoneyGram product that enables users of third-party applications, such as crypto wallets and exchanges, to cash-in (and cash-out)" [21]. Under the hood: "MoneyGram currently supports on/off ramps for USD Coin (USDC) via the Stellar blockchain using the Stellar SEP-24 protocol"; off-ramp limits are "5 USDC min / 2,500 USDC max per transaction" per the developer docs.

MoneyGram scale per their June 2, 2026 MGUSD announcement: "MoneyGram reports serving over 60 million active customers via nearly 500,000 retail locations, with more than 70% of its transactions being digital" [23].

| Capability | Counterparty | Channel | Volume Impact |
|------------|--------------|---------|---------------|
| Cash-in / cash-out | MoneyGram via USDC (SEP-24) | Retail agent network ~500K locations, 170+ countries | Direct anchor entry for ~60M active consumers |
| Self-custodial wallet | MoneyGram App | Mobile app | US launch with MGUSD balance on Stellar |
| Global payouts | Nium partnership | 190 countries | SDP integration |
| Tempo payments | Tempo + MoneyGram + Kraken (April 22, 2026) | App + retail | TBD |
| Telegram-linked wallet | MoneyGram wallet FAQ | App | Stellar-based wallets supported |

Source: [83]; [23].

### 5.2 Stellar Disbursement Platform and Aid Assist

Stellar Aid Assist, built on SDP, had disbursed $4.6M via UNHCR to approximately 2,500 households in Ukraine as of December 19, 2024 [42]. Use cases documented: emergency cash assistance in conflict zones; refugee economic inclusion; humanitarian startup-style disbursements. Operations specifics: fees reported at "approximately 1 US cent per 10,000 transactions" by Stellar; "Cash-out locations are available in over 185 countries"; recipients only need a mobile phone, no bank account or prepaid card required; SDF explicitly states it "does not have any control over the fees charged by independent organizations participating in SAA flows" [16].

The IRC (International Rescue Committee) and UNHCR use cases are documented in case studies: "Through Stellar Aid Assist, we offered transparent, portable, and accessible digital cash assistance to conflict-affected individuals in Ukraine" [38]; "Stellar Disbursement Platform (SDP), a bulk disbursement tool that enables organizations to distribute funds to recipients and monitor the disbursement" lives next to a separate [39]. SDA is also part of the UN Financial Gateway and is "expanding to Argentina to assist refugee entrepreneurs and "mitigating local currency devaluation"".

Mechanism -> Aid assist fuses SDP's bulk transaction layer with anchor-MoneyGram Ramps and a fiat off-ramp layered on top; KYC is contextual and proportionate (the UNREBCE/IRC contracts handle recipient identification off-chain). Travel Rule compliance is achieved by the originating humanitarian org, not Stellar or MoneyGram.

### 5.3 Compliance Considerations for Remittance / Aid Flows

The GENIUS Act has direct implications for cross-border payments on Stellar: US-incorporated MoneyGram and its MGUSD become subject to federal payment-stablecoin supervision, with knock-on effects for its parent North-American issuers (USDC). EU flows are routed through Circle's MiCA-compliant EURC on Stellar, providing a compliance-cleared European path.

Failure case -> If Circle's EURC supply is interrupted (e.g., regulator-driven delisting in France, FTX-style reserve disclosure failure), the Europe-facing side of Stellar aid and remittance will collapse onto a private regulatory-controlled substitute (e.g., MGUSD or USDC-only). Humanitarian Aid flows anchored in EURC therefore should retain a contingency path. Conversely, USDC-as-primary on US aid flows requires continued BSA/USA PATRIOT Act compliance by the issuer.

## 6. Risks, Audits, and Security Posture

### 6.1 Native Disclosure and Bug Bounty Surface

| Layer | Program | Source | Last Update (as cited) |
|-------|---------|--------|-----------------------|
| Stellar.org / Stellar network | HackerOne Vulnerability Disclosure Program | [64] | June 9, 2026 |
| Core Protocol / Repo Disclosures | Stellar Bug Bounty Program | [65] | ongoing |
| Soroban SCF Grants | Soroban Security Audit Bank | [63] | ongoing |

The Stellar Bug Bounty Program "provides bounties for vulnerabilities and exploits discovered in the Stellar protocol or any of the code in our repos" [65].

### 6.2 Notable Incidents

| Incident class | Status | Notes |
|----------------|--------|-------|
| Protocol-level funds-loss incident on mainnet | None publicly disclosed | No catastrophic CVE-equivalent event is on the public record |
| Stellar.org website outages | Disclosed benignly on [81] | Public incident dashboard is operational |
| CVE-2020-3961 | Unrelated (VMware Horizon Client privilege escalation) | n/a |

Risk-flagged but not necessarily vulnerabilities -> Token-level risks: an issuer enabling `AUTH_CLAWBACK_ENABLED` accepts issuer-counterparty risk on holders' balance; this is a regulator-mandated feature, but exposes token-holders to issuer compliance decisions (e.g., a sanctioned-sender clawback).

### 6.3 SDF Transparency Structure and XLM Burn History

SDF explicitly states: it is a "non-profit organization with a mission: "creating equitable access to the global financial system leveraging Stellar""; it is "self-funded" because it sells XLM on "public exchanges like Kraken, Coinbase, and Bitstamp" as well as through direct sales [82]. At one point SDF burned 55 billion of the ~100 billion XLM originally allocated; the April 2019 / November 5, 2019 disclosure titled "The Stellar Foundation has burned over 50% of the total" is documented at $4.4-4.7 billion [103]; the official SDF post "SDF's Next Steps" confirms: "50 billion of the 68 billion lumens in those programs have also been burned. SDF will not burn any additional lumens. there are now 50 billion lumens" [99].

As of June 18, 2026, SDF's mandate page lists transparent XLM account balances (raw): Development 2,469,392,312 XLM; Growth 5,979,172,852 XLM; Product and Innovation 4,055,924,083 XLM; Assets and Liquidity 3,422,446,986 XLM [82].

### 6.4 Network Stats and Resilience

As of May 1, 2024: "The Stellar network has grown to over 7 million accounts and processed more than 10 billion operations" [70]. The Stellar Network Dashboard at [81] shows heightened reporting on testnet incidents but no recent mainnet outage.

### 6.5 Regulatory Risk Inventory for Issuers and Holders

| Risk | Severity | Direction | Source |
|------|----------|-----------|--------|
| SEC interpretive guidance reversal | High | Down | Subject to changes in WH/CFTC/SEC leadership |
| MiCA disruption of EURC supply | Medium-High | Down | Q1 2026 EURC report shows MiCA share concentration |
| CLARITY Act withdrawal / change | Medium | Uncertain | Senate Banking vote May 14, 2026; not yet signed | 
| DTCC Dec 2025 no-action letter scope | Low (for now) | Operational | Letter is not public |
| USDC transfer-agent sub-custody | Low | Stable | Circle Bermuda / France / Singapore / 49-state MSB |
| Anchor Counterparty (clawback) | Medium | Issuer Risk | Documented by Stellar clawback design |

## 7. Comparative Analysis: How Stellar's Compliance Stacks Up

| Dimension | Stellar | Ethereum / ERC-20 (Notes) | Solana |
|-----------|---------|---------------------------|--------|
| Native regulated-asset tokens | Yes (SEP-8 + flags) | Standard requires external wraps or compliance proxies | Same as Ethereum |
| KYC standard | SEP-12 (off-chain shared) | No native equivalent | No native equivalent |
| Auth standard | SEP-10 (signed tx) | Wallet Connect is session auth, not native | Wallet connect equivalent |
| Clawback at protocol level | Yes (Protocol 17 + CAP-0035) | Token-level implementation must rely on issuer proxies or blacklists | Per-token |
| MiCA Compliance bankable for platform | Direct (EURC native) | USDC/EURC on Ethereum also compliant; not all chains directly | USDC/EURC on Solana |
| Humanitarian aid scale (cash only) | ~$4.6M to 2,500 households via UNHCR (Stellar Aid Assist) | Multiple humanitarian pilots but few published Guardian-style audits | Distribution work in early stage |
| Major bank-grade RWA on-chain (regulator-registered) | BENJI 5-year, 1940 Act; DTCC DTC 1H27 | Lower count of fully-bank-grade RWA on chain | Limited |

Takeaway -> Stellar's compliance primitives (SEP-8 / SEP-10 / SEP-12 + flags + clawback) contrast most directly with ERC-20, which forces regulated issuers to wrap tokens and rely on issuer-side blacklists or proxies; the trade-off is that Stellar's ledger is purpose-built for payment and issuance, while Ethereum's is general-purpose. For institutions committing to a regulated-asset ledger, the Stellar stack is meaningfully easier to defend in audit.

## 8. Synthesis

Across all five domains of this dossier, three cross-cutting conclusions emerge:

1. The compliance toolchain is finally "complete" but the legal guardrails lag the engineering. SEP-8, SEP-10, SEP-12, native flags, and Protocol 17 clawback form an end-to-end stack that maps cleanly to BSA / USA PATRIOT Act, FinCEN Travel Rule, and MiCA Title III. The slow-moving variable is legal recognition - SEC no-action relief (DTCC December 2025), MiCA compliance (EURC), and slow House / Senate adoption of the CLARITY Act have not yet produced a permissive, permanent legal regime. Holders and issuers benefit from a defensible baseline but live with interpretive uncertainty.
2. The institutional RWA pipeline is becoming real-world scale. Franklin Templeton BENJI celebrated 5 years in April 2026, WisdomTree Prime reached 41 US states with 13 funds + Gold token, DTCC's $114T custody book plans 1H27 launch of DTC-tokenized assets on Stellar under an SEC no-action posture, and DTCC processed $4.7 quadrillion in transactions in 2025. MoneyGram's 500,000 retail locations now reach the consumer tier on top of the institutional RWA pipeline.
3. The biggest residual risk is political, not technical. SEC Press Release 2026-30 (March 17, 2026) and the SEC/CFTC joint interpretation are interpretive; a future administration could revisit. The CLARITY Act (May 14, 2026 Senate Banking Committee advance, not yet signed) sits in legislative limbo. EURC's 41-50% euro-stablecoin share depends on a single French regulator's continued license posture. The single most consequential watch-point is whether the interpretive / no-action postures hold through the 2028 US election cycle.

What this means for issuers -> Build on Stellar today, but do so with documented control over issuer-side flags, blacklist procedures, and Travel Rule data. Anchor operators should layer FinClusive / shared CaaS / Anchor Platform elements rather than depending on a single vendor.
What this means for regulators -> The Stellar-compliance stack is now a viable reference architecture for bank-grade regulated tokens. The SEC March 2026 interpretive release and ongoing CLARITY Act negotiations have institutionalized XLM as a digital commodity, but the implementation rules will test whether the new five-part taxonomy holds in contested cases.

## 9. Q&A: The 25 Most Important Factual Questions on Stellar Compliance / Regulation / RWA / Payments

| # | Question | Canonical Answer | Best Source |
|---|----------|-----------------|-------------|
| 1 | What is SEP-10 and why does it matter for compliance? | SEP-10 is "Stellar Web Authentication": wallets prove control of an account by signing a transaction; anchors return a signed JWT for downstream authenticated calls. | [4] |
| 2 | What does SEP-12 do? | SEP-12 is the standard way for clients to upload KYC (or other) information to anchors and other services; incepted September 11, 2018. | [3] |
| 3 | What is SEP-8? | SEP-8 is the Regulated Assets standard; it defines an Approval Server that "validates client transactions according to the service's approval criteria. Validated transactions are signed by the asset's issuing" account. | [2] |
| 4 | How do issuers clawback tokens on Stellar? | Issuers enable the `AUTH_CLAWBACK_ENABLED` flag and use the clawback operation introduced in CAP-0035 / Protocol 17 to burn a specific amount of an asset from any holder; pre-condition is `AUTH_REVOCABLE_FLAG`. | [44]; [45] |
| 5 | What was the original SDF XLM burn? | SDF burned 55 billion XLM worth $4.4-4.7 billion over the 2019 program; "SDF will not burn any additional lumens"; remaining ~50B lumens. | [99]; [103] |
| 6 | How many XLM does SDF control today? | As of June 18, 2026: SDF Development 2.47B; Growth 5.98B; Product and Innovation 4.06B; Assets & Liquidity 3.42B XLM. | [82] |
| 7 | Is XLM a US security? | As of March 17, 2026 SEC Press Release 2026-30 and the parallel SEC/CFTC joint interpretation, XLM is treated as a digital commodity in the new five-part token taxonomy. Status evolving - interpretive, not statutory. | [53]; [67]; [57] |
| 8 | How is EURC regulated in the EU? | EURC is MiCA-compliant and is accessible on Stellar per Circle; €380.9M in circulation and reserves as of June 15, 2026. | [29]; [31] |
| 9 | What is GENIUS Act and how does it affect USDC/MGUSD? | GENIUS Act (S.1582) is the US federal stablecoin framework; it was signed July 18, 2025, and requires any payment-stablecoin issuer to follow a regulatory framework; it is the basis for the "GENIUS-Act-ready" MGUSD designation by Bridge/Stripe. | [95]; [96] |
| 10 | What is the CLARITY Act status? | On May 14, 2026, the Senate Banking Committee "advanced the Digital Asset Market Clarity Act" in a "historic bipartisan vote" (still requires Senate floor, House, and President). | [58]; Banking.senate.gov |
| 11 | What was DTCC's announcement on Stellar? | On May 27, 2026, DTCC and SDF announced Stellar will host DTC-tokenized assets in 1H27 via a December 2025 SEC no-action letter; eligible assets include US Treasuries, ETFs, Russell 1000 constituents. | [26] |
| 12 | How big is DTCC? | DTCC subsidiaries processed $4.7 quadrillion in 2025; its depository subsidiary provided custody for over $114T securities from 150+ jurisdictions; 25B+ Global Trade Repository messages annually. | [26] |
| 13 | What is BENJI and what is its regulatory structure? | BENJI is the tradable Stellar token representing shares of the Franklin OnChain US Government Money Fund (FOBXX), a 1940-Act-registered mutual fund; the 99.5%+ of the fund is held in US government securities, cash, and repurchase agreements collateralized by US government assets. | [13]; [12] |
| 14 | How many WisdomTree funds are on Stellar? | 13 digital funds + a Gold token (backed 1:1 to physical gold); available in 41 US states via WisdomTree Prime. | [70]; [11] |
| 15 | Is MGUSD on Stellar GENIUS-Act-compliant? | Yes. MGUSD is a "GENIUS Act-ready issuer" via Bridge (Stripe) and runs on Stellar; M0 mint/burn; Fireblocks wallet; launched June 2, 2026 as a "native US dollar stablecoin". | [23] |
| 16 | What is MoneyGram Ramps? | MoneyGram Ramps is a product that enables third-party app users (wallets and exchanges) to cash-in and cash-out at 170+ countries via SEP-24; uses USDC on Stellar; off-ramp limits $5-2,500 USDC per transaction. | MoneyGram Devs; [21] |
| 17 | What is Stellar Aid Assist? | An open-source protocol on Stellar Disbursement Platform; recipients only need a mobile phone; cash-out in 185+ countries; processing fees approximately 1 US cent per 10,000 transactions per Stellar. | [16] |
| 18 | What is the volume impact of UNHCR/IRC on Stellar? | $4.6M disbursed to ~2,500 households in Ukraine as of December 19, 2024; expanding to Argentina. | [42] |
| 19 | How is Stellar audited / disclosed for security? | HackerOne Vulnerability Disclosure Program (last updated June 9, 2026) + Stellar Bug Bounty Program + Soroban Security Audit Bank. | [64]; [65]; [63] |
| 20 | Are there known protocol-level compromise incidents on Stellar? | No public record of a Stellar-protocol-level funds-loss incident; engineering disclosure regime (HackerOne, Bug Bounty) operates without catastrophic CVEs. (CVE-2020-3961 is VMware Horizon Client and unrelated.) | [81] |
| 21 | What is FinClusive and how does it support anchors? | FinClusive provides a compliance toolkit and "Compliance as a Service" (CaaS) for anchors including KYB/KYC and a Travel-Rule / BSA / USA PATRIOT Act-compliant audit trail; shared across the Stellar network. | [49] |
| 22 | How big is Stellar's user base? | As of May 1, 2024: 7M+ accounts and 10B+ processed operations. | [70] |
| 23 | How do anchors meet US MSB obligations for on/off-ramping? | Anchor Platform is an anchor reference runtime with SEP-24 deposit/withdrawal compliance; named partners include MoneyGram, Bitso, Biccos, Kado, Nium. The anchor has the licensing burden; Stellar does not. | [48] |
| 24 | Where can the GENIUS Act and CLARITY Act texts be found? | GENIUS Act = S.1582; CLARITY Act = H.R.3633. Both House/Senate documents are public. | [95]; [59] |
| 25 | Is IRS reporting applicable to XLM in 2026? | Yes; Form 1099-DA is currently in effect (revision January 20, 2026); digital-asset income reporting required. | [105]; [104] |
| 26 | How do humanitarian-aid flows handle Travel Rule? | The originating humanitarian organization (UNHCR, IRC) holds the Travel Rule obligations; SDF explicitly disclaims control over "fees charged by independent organizations participating in SAA flows". | [16] |
| 27 | What is the Stellar Asset Contract? | The SAC is the "Stellar Asset Contract allows users and contracts to make payments with, and interact with, assets"; it inherits the underlying native asset's flag semantics. | [46] |
| 28 | Who audits Stellar's reserves or governance? | SDF mandate page publishes quarterly reports and live XLM account balances; Hogan Lovells-style legal opinions are referenced but not always public; the SEC no-action letter for DTCC is not public. | [82]; [26] |
| 29 | What is MoneyGram's distribution scale? | MoneyGram reports 60M+ active customers via ~500,000 retail locations; 70%+ of transactions are digital. | [23] |
| 30 | What is the DTCC no-action letter's effective date? | December 2025; no public text. | [26] |

## References

1. *SEP-10: Stellar Web Authentication*. https://developers.stellar.org/docs/build/apps/example-application-tutorial/anchor-integration/sep10
2. *stellar-protocol/ecosystem/sep-0008.md at master*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md
3. *stellar-protocol/ecosystem/sep-0012.md at master*. https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md
4. *Stellar Authentication*. https://developers.stellar.org/docs/build/apps/wallet/sep10
5. *Anchor Tools | Stellar Docs*. https://developers.stellar.org/docs/tools/developer-tools/anchor-tools
6. *Application of FinCEN's Regulations to Persons ...*. https://www.fincen.gov/resources/statutes-regulations/guidance/application-fincens-regulations-persons-administering
7. *Does Stellar have to worry about the SEC Securities ...*. https://www.reddit.com/r/Stellar/comments/a1jtlj/does_stellar_have_to_worry_about_the_sec/
8. *Sanctions List Search*. https://sanctionssearch.ofac.treas.gov/Details.aspx?id=49624
9. *Stellar Lumens (XLM): All About This Crypto*. https://www.coinhouse.com/stellar
10. *Grayscale Stellar Lumens Trust*. https://www.grayscale.com/funds/grayscale-stellar-lumens-trust
11. *Stellar | WisdomTree Case Study*. https://stellar.org/case-studies/wisdomtree
12. *Franklin Templeton, Stellar Development Foundation Mark ...*. https://www.franklintempleton.com/press-releases/news-room/2026/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u.s.-registered-tokenized-money-market-fund
13. *Franklin OnChain U.S. Government Money Fund - FOBXX*. https://www.franklintempleton.com/investments/options/money-market-funds/products/29386/SINGLCLASS/franklin-on-chain-u-s-government-money-fund/FOBXX
14. *Franklin Templeton: Tokenized Money Market Fund (BENJI)*. https://dune.com/entropy_advisors/franklin-templeton-tokenized-money-market-fund-benji
15. *Tokenized Investment Assets*. https://stellar.org/learn/tokenized-investment-assets
16. *Stellar Aid Assist*. https://stellar.org/use-cases/stellar-for-aid
17. *Stellar | Blockchain Network for DeFi, Payments & Asset ...*. https://stellar.org/
18. *On-Ramp & Off-Ramp*. https://developer.moneygram.com/moneygram-developer/docs/integrate-moneygram-ramps
19. *Stellar Aid Assist - Stellar Development Foundation*. https://www.anthemawards.com/winners/list/entry/#!responsible-technology/best-use-of-technology/stellar-aid-assist/1972/-1/535124
20. *MoneyGram Ramps: One Integration, Cash Access*. https://stellar.org/products-and-tools/moneygram
21. *MoneyGram Ramps | Stellar Docs*. https://developers.stellar.org/docs/tools/ramps/moneygram
22. *MoneyGram Ramps | Connect Crypto to Cash in Minutes*. https://www.moneygram.com/us/en/ramps
23. *MoneyGram Launches MGUSD, a Stablecoin to Power Its ...*. https://www.prnewswire.com/news-releases/moneygram-launches-mgusd-a-stablecoin-to-power-its-own-global-network-302787799.html
24. *Bridging Chain | Best Practices*. https://developer.moneygram.com/moneygram-developer/docs/bridging-chain-best-practice
25. *What Is Stellar (XLM) and Why It's Now a US Digital ...*. https://phemex.com/academy/what-is-stellar-xlm-digital-commodity
26. *DTCC Connects Tokenization Service to Stellar Blockchain*. https://www.dtcc.com/news/2026/may/27/tokenization-service-to-connect-with-stellar-public-blockchain-as-dtc-advances-multi-chain-strategy
27. *About Stellar Development Foundation*. https://stellar.org/foundation
28. *Stellar Becomes an Official Blockchain for USDC*. https://www.circle.com/blog/usdc-for-stellar-coming-to-circle
29. *EURC | A Euro-Backed Stablecoin*. https://www.circle.com/eurc
30. *Fast, cheap, and connected. meet USDC and EURC on ...*. https://stellar.org/products-and-tools/circle-usdc-eurc
31. *Circle's EURC Q1 2026 Stablecoin Report*. https://stablecoininsider.org/eurc-q1-2026-stablecoin-report/
32. *All About EURC: Circle's Euro Stablecoin Explained (2026 ...*. https://www.bleap.finance/blog/all-about-eurc-circles-euro-stablecoin
33. *About Stellar Development Foundation*. http://stellar.org/foundation
34. *Stellar Development Foundation: 2025 Year in Review - YouTube*. http://youtube.com/watch?v=_sjRDKEIERo
35. *Juan Lopez Carretero - Stellar Development Foundation*. http://linkedin.com/in/juan-lopez-carretero-5a50b6b
36. *Stellar Development Foundation Mandate*. http://stellar.org/foundation/mandate
37. *Jason Espino - Head of Corporate Security and IT at Stellar ...*. http://linkedin.com/in/jasonespino1
38. *How IRC Distributed Cash Assistance Through Stellar Aid ...*. https://stellar.org/case-studies/irc
39. *How UNHCR Distributes Cash Assistance Through ...*. https://stellar.org/case-studies/unhcr
40. *Building Blocks*. https://innovation.wfp.org/project/building-blocks
41. *Resilient with blockchain*. https://stellar.org/resilientblockchain
42. *Stellar Aid Assist used to deliver $4.6 million in aid*. https://stellar.org/blog/foundation-news/stellar-aid-assist-2-year-anniversary
43. *Asset Design Considerations*. https://developers.stellar.org/docs/tokens/control-asset-access
44. *Clawbacks | Stellar Docs*. https://developers.stellar.org/docs/build/guides/transactions/clawbacks
45. *stellar-protocol/core/cap-0035.md at master*. https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md
46. *Stellar Asset Contract (SAC)*. https://developers.stellar.org/docs/tokens/stellar-asset-contract
47. *Using Protocol 17's Asset Clawback*. https://stellar.org/blog/developers/using-protocol-17s-asset-clawback
48. *Anchor Platform*. https://stellar.org/products-and-tools/anchor-platform
49. *Stellar | Driving Inclusion Through Compliance*. https://stellar.org/blog/policy/drive-inclusion-through-compliance
50. *What is a Stellar anchor?*. https://help.finclusive.com/en_US/stellar-transactions/what-is-a-stellar-anchor
51. *Stellar Anchor Directory*. https://anchors.stellar.org/
52. *Decaf, Boss, Beans*. https://meridian.stellar.org/sessions/how-stellar-disbursement-platform-integrated-wallets-deliver-cash-globally-decaf-boss-beans
53. *SEC Clarifies the Application of Federal Securities Laws to ...*. https://www.sec.gov/newsroom/press-releases/2026-30-sec-clarifies-application-federal-securities-laws-crypto-assets
54. *SEC-CFTC Harmonization Initiative*. https://www.sec.gov/featured-topics/sec-cftc-harmonization-initiative
55. *SEC – CFTC Harmonization Event Rescheduled to Jan. 29*. https://www.consumerfinancialserviceslawmonitor.com/2026/01/sec-cftc-harmonization-event-rescheduled-to-jan-29/
56. *Clarity Act nears Senate vote deadline | Grafa*. http://grafa.com/en/news/crypto/clarity-act-senate-vote-crypto
57. *SEC and CFTC Issue Landmark Joint Interpretation on ...*. https://www.jenner.com/en/news-insights/client-alerts/sec-and-cftc-issue-landmark-joint-interpretation-on-crypto-asset-classification
58. *Senate Banking Committee Advances Crypto Market ...*. https://www.dwt.com/blogs/financial-services-law-advisor/2026/05/senate-banking-crypto-market-structure-bill
59. *H.R.3633 - 119th Congress (2025-2026): Digital Asset ...*. https://www.congress.gov/bill/119th-congress/house-bill/3633/text
60. *Senate Banking Draft and CLARITY Act*. https://www.paulhastings.com/insights/crypto-policy-tracker/update-on-crypto-market-structure-legislation-senate-banking-draft-and-clarity-act
61. *Senate Banking Committee releases text of crypto bill ahead ...*. https://bankingjournal.aba.com/2026/05/senate-banking-committee-releases-text-of-crypto-bill-ahead-of-vote/
62. *Senate Releases Crypto Market Structure Bills*. https://www.hunton.com/blockchain-legal-resource/senate-releases-crypto-market-structure-bills
63. *Stellar | Smart Contract Security Audit Support*. https://stellar.org/grants-and-funding/soroban-audit-bank
64. *Stellar.org | Response Policy*. https://hackerone.com/stellar
65. *Stellar | Bug Bounty Program*. https://stellar.org/grants-and-funding/bug-bounty
66. *Stellar Smart Contract Security Audit*. https://shellboxes.com/services/blockchain-security/stellar-smart-contract-audit/
67. *Application of the Federal Securities Laws to Certain Types ...*. https://www.sec.gov/files/rules/interp/2026/33-11412.pdf
68. *SEC and CFTC Issue Interpretation Regarding the ...*. https://www.sullcrom.com/insights/memo/2026/March/SEC-Clarifies-Application-Securities-Laws-Crypto-Assets
69. *What Does the SEC Digital Commodity Ruling Mean for ...*. https://www.bitget.com/academy/sec-digital-commodity-ruling-for-crypto-traders
70. *Stellar Statement on WisdomTree Prime being available to ...*. https://stellar.org/press/stellar-statement-on-wisdomtree-prime-being-available-to-users-in-41-states
71. *Case studies*. https://stellar.org/case-studies
72. *About*. https://www.wisdomtreeprime.com/about/
73. *Enterprise Blockchain for Financial Institutions*. https://stellar.org/institutions-solutions
74. *Virtual Currency Business Licensing - DFS.ny.gov*. https://www.dfs.ny.gov/virtual_currency_businesses
75. *New York proposes stablecoin regulation update*. https://www.facebook.com/NYDFS/posts/today-dfs-proposed-a-regulation-to-build-on-new-yorks-nation-leading-stablecoin-/1429680875860872/
76. *New York DFS Guidance on Stablecoins Issuance ...*. https://www.cooley.com/news/insight/2022/2022-06-21-ny-guidance-on-stablecoins-establishes-requirements-for-reserve-assets-and-redeemability
77. *CVE-2020-3961 Detail - NVD*. https://nvd.nist.gov/vuln/detail/CVE-2020-3961
78. *Stellar Status. Check if Stellar is down or having an outage.*. https://statusgator.com/services/stellar
79. *Help & Network Status - Stellar Fiber Internet*. https://www.stellarbb.com/network-status.html
80. *Is stellar.org Down?*. https://uptime.com/stellar.org
81. *Stellar Network Dashboard*. https://dashboard.stellar.org/
82. *description: Our mandate provides transparent and live updates on our progress towards our goals. title: Stellar | SDF Mandate image: https://cdn.sanity.io/images/e2r40yh6/production-i18n/7e4fbc5f727856e8c29d26bef4b5baca487f0544-2400x1260.png?w=1200&h=630&v=2*. https://stellar.org/foundation/mandate
83. *Stellar cryptocurrency wallets*. https://www.moneygram.com/us/en/help-center/faq/services/stellar-wallets
84. *MoneyGram and Stellar Extend Partnership to Scale Real- ...*. https://stellar.org/press/moneygram-and-stellar-extend-partnership-to-scale-real-world-stablecoin-utility-globally
85. *Stellar | Three Years of Impact: How MoneyGram is ...*. https://stellar.org/blog/foundation-news/three-years-with-moneygram
86. *MoneyGram and Stellar Extend Partnership to Scale Real ...*. https://www.prnewswire.com/news-releases/moneygram-and-stellar-extend-partnership-to-scale-real-world-stablecoin-utility-globally-302749574.html
87. *Stellar | Learn More About Stellar Anchors*. https://stellar.org/learn/anchor-basics
88. *Learn About Anchors*. https://developers.stellar.org/docs/learn/fundamentals/anchors
89. *Cryptoasset Regulation Coming to the United Kingdom*. https://www.klgates.com/Cryptoasset-Regulation-Coming-to-the-United-Kingdom-What-You-Need-to-Know-4-30-2026
90. *VARA and Virtual Asset Regulation Compliance in Dubai*. https://mco.mycomplianceoffice.com/blog/vara-and-virtual-asset-regulation-compliance-in-dubai
91. *How to buy Stellar in Singapore*. https://www.revolut.com/en-SG/crypto/buy-stellar/
92. *Cryptoassets in the UK: a practical guide to the new ...*. https://www.dentons.com/en/insights/articles/2026/february/4/cryptoassets-in-the-uk
93. *MAS provides guidelines on the provision of Digital ...*. https://compliance.waystone.com/mas-provides-guidelines-on-the-provision-of-digital-payment-token-services-to-the-public/
94. *GENIUS Act: U.S. Stablecoin Law | Circle & USDC ...*. https://www.circle.com/genius-act
95. *Text - S.1582 - 119th Congress (2025-2026): GENIUS Act*. https://www.congress.gov/bill/119th-congress/senate-bill/1582/text
96. *Stablecoins and the GENIUS Act: An Overview*. https://www.richmondfed.org/banking/banker_resources/news_flash/2025/20251118_genius_act
97. *Genius Act Implementation | CSBS*. https://www.csbs.org/csbs-genius-act-implementation-comment-letter
98. *Anti-Money Laundering Aspects of the GENIUS Act*. https://www.moneylaunderingnews.com/2025/03/anti-money-laundering-aspects-of-the-genius-act/
99. *SDF's Next Steps*. https://stellar.org/blog/foundation-news/sdfs-next-steps
100. *XLM Token Burn, The Solution To All Of Stellar's Problems?*. https://www.reddit.com/r/Stellar/comments/apjy7n/xlm_token_burn_the_solution_to_all_of_stellars/
101. *Stellar Development Foundation Q3 2024 in Review*. https://stellar.org/blog/foundation-news/stellar-development-foundation-q3-2024-in-review
102. *Stellar Burns $4.7 Billion Worth of XLM*. https://chainbulletin.com/stellar-burns-4-7-billion-worth-of-its-cryptocurrency
103. *The Stellar Foundation has burned over 50% of the total ...*. https://finance.yahoo.com/news/stellar-foundation-burned-over-50-005916105.html
104. *Digital assets | Internal Revenue Service*. https://www.irs.gov/filing/digital-assets
105. *About Form 1099-DA, Digital Asset Proceeds From Broker ...*. https://www.irs.gov/forms-pubs/about-form-1099-da
106. *Lawmakers Call for Changes to Crypto Staking Reward Regs*. https://www.taxnotes.com/research/federal/legislative-documents/congressional-tax-correspondence/lawmakers-call-changes-crypto-staking-reward-regs/7tdtc
107. *Crypto Tax Guide: 2026 Rates and Rules*. https://www.nerdwallet.com/investing/learn/crypto-tax-rate
108. *Summ | IRS-Ready Crypto Tax Software*. http://summ.com/us
109. *Stellar Soroban: Smart Contracts for Stablecoin Infrastructure*. https://eco.com/support/en/articles/15346520-stellar-soroban-smart-contracts-for-stablecoin-infrastructure
110. *Soroban | Smart Contracts Platform on Stellar*. https://stellar.org/soroban
111. *Yield-Bearing Assets on Stellar: Unlocking Potential with ...*. https://stellar.org/blog/developers/yield-bearing-assets-stellar-soroban
112. *Smart Contracts | Stellar Docs*. https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/contracts
