# Task Run Results

**Run ID:** trun_04740bf111ed4e89b6c0e8743f13d17e
**Status:** ✅ completed
**Processor:** pro
**Created:** 2026-06-22T17:26:22.074965Z
**Modified:** 2026-06-22T17:32:55.067812Z

## Output

# Stellar Funding, Grants, Programs & Builder Ecosystem: Analyst-Grade Reference Dossier

*Ground-truth knowledge base compiled June 22, 2026, covering the Stellar Community Fund (SCF), Stellar Development Foundation (SDF) funding instruments, hackathon/bounty infrastructure on DoraHacks, the builder/ambassador landscape, and 2025-2026 program changes.*

---

## Executive Summary

- **Two-Tier Funding Architecture**: Stellar ecosystem grants split between the community-driven Stellar Community Fund (SCF) on `communityfund.stellar.org` and several direct SDF programs on `stellar.org/grants-and-funding` (>5 grant lines totaling up to ~$1.65M per project across all instruments) -> Apply to the right program by track (Open/Integration/RFP for $150K Build vs. SDF direct for Marketing/Matching/Bug Bounty).
- **SCF v7.0 Is the Current Standard (since January 2026)**: SCF 7.0 split Build into Open/Integration/RFP tracks, replaced the prior 3-tranche model with a 4-tranche milestone disbursement (10% on award, 20% at MVP, 30% at Testnet, 40% at Mainnet+UX), consolidated 6 supporting programs into a unified Growth track, and added a Referral Program -> Submit via the SCF interest form for SCF #45 (deadline July 26, 2026).
- **Neural Quorum Governance (NQG) Drives Open-Track Community Vote**: Since October 2023, SCF community voting uses a reputation-weighted NQG model (a dossier on `stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance`), with delegate selection calibrated to 1/40 of track voting weight -> Become "SCF Verified" before voting in Open Track.
- **Funding Cap Floors at $150K (with Lifecycle Stack)**: SCF Build caps at $150K in XLM per award; Instawards max $15K per project via Ambassador chapters; Growth Hack funds 10-15 teams at $20K with up to $200K performance; Public Goods Award $50K XLM per quarter; Liquidity Award for audited, live mainnet protocols -> Plan funding ladder (Instawards -> Build -> Growth Hack -> Liquidity/Marketing).
- **Audit Bank Eliminates Security Cost Barrier**: SDF absorbs up to 100% of audit costs via the Audit Bank for SCF-funded projects (priority categories: financial protocols, infrastructure contracts, yield-bearing protocols; non-priority needs 10K MAA or $100K TVL) -> SCF winners should apply for Audit Bank rather than self-fund security audits.
- **Round Cadence and Velocity**: SCF Build awards run every 6 weeks; SCF #45 submission deadline is July 26, 2026 with $150K max; active Q2 2026 RFPs include Trustline Onboarder, Passkey UI, Contract Source Verification Service -> Align engineering milestones to the bi-monthly calendar.
- **Cumulative Footprint (200M XLM / 400 winners since 2016)**: Across all SCF versions from SBC (2016) through SCF 7.0, the program has nearly 400 winners and has distributed ~200M XLM; the v7 site shows 656+ awarded submissions -> Builders entering today join one of the largest cumulative-reward pools in L1 community funding.
- **Bug Bounty as a Separate Track**: SDF's Bug Bounty offers up to $250,000 in XLM for protocol/core repository vulnerabilities and up to $50,000 USD for Soroban smart-contract exploits -> Security researchers should target Stellar/Soroban repos directly via the SDF program rather than via SCF.
- **Hackathon Infrastructure Operates via DoraHacks**: Active Stellar-themed hackathons include Build On Stellar National Bounty (India, 2025) and Stellar Hacks: Agents (x402 + Stripe micropayments, 2026); SDF maintains a dedicated organization page on `dorahacks.io/org/stellar` -> Builders should register on DoraHacks for SDF-bountied hackathons.
- **Ambassador Program Reaches Regional Chapters**: The Stellar Ambassador Program (`stellar.gitbook.io/ambassador-program`) supports builders and educators forming regional chapters; under SCF 7.0, ambassadors gain direct Instawards recommendation power (up to $15K per project) -> Builders seeking early funding should reach out to local Ambassador chapters first.
- **Strategic Sequencing for Builders**: The optimal 2025-2026 path is: (1) Apply to Instawards via local Ambassador for early proof-of-concept, (2) Progress to SCF Build Open Track, (3) Apply for Audit Bank coverage before mainnet launch, (4) Graduate into Growth Hack cohort, then (5) Apply for SDF Marketing Grant and Matching Fund -> Use the layered ecosystem rather than a single grant request.
- **Failure Modes to Avoid**: SCF Build entries are evaluated on ecosystem value, technical feasibility, roadmap clarity, and team capability; a project without active traction or ecosystem fit is likely rejected at prescreen panel; resubmissions are permitted but require meaningful improvements -> Stress-test alignment with Stellar's DeFi/RWA/Payments themes before submitting.

---

## 1. Network-Level Architecture: SCF vs. SDF Funding Lines

### 1.1 Two Funding Pillars, Distinct Application Lanes

Stellar ecosystem funding bifurcates into two complementary pillars. The **Stellar Community Fund (SCF)** operates as a community-driven program leveraging public voting and panel review; it is administered at `communityfund.stellar.org` and currently in version 7.0 (since January 2026). The **Stellar Development Foundation (SDF)** separately administers direct grants (Marketing, Matching, Academic Research), enterprise funding, and bug bounties via `stellar.org/grants-and-funding`.

| Pillar | Administering Entity | Mechanism | Application Portals | Status (2026) |
|---|---|---|---|---|
| SCF Build Award ($150K XLM cap) | Stellar Community Foundation (SCF) + SDF | Quarterly panel + community vote (Open Track only) via NQG | `communityfund.stellar.org` interest form | SCF #45 open, deadline July 26, 2026 |
| SCF Instawards ($15K XLM) | Local Stellar Ambassador Chapters | Chapter-led recommendation | Local Ambassador channels | Active under SCF 7.0 |
| SCF Public Goods Award ($50K XLM/quarter) | SCF Verified Members via Soroban Governor | Invitation-only, NQG-weighted governance | `#scf-governance` Discord | Active |
| Stellar Liquidity Award | SDF | Invitation-only, for audited live protocols | SDF outreach | Active |
| Audit Bank | SDF | Covers up to 100% of audit costs | Soroban Security Audit Bank form (email from SCF) | Active |
| Bug Bounty (Protocol) | SDF via Cantino?, etc. | Public submissions | `stellar.org/grants-and-funding` | Active ($250K XLM for protocol/$50K USD for Soroban) |
| Marketing Grants | SDF | Direct proposal | `stellar.org/grants-and-funding` | Up to $500K USD/USDC/XLM |
| Matching Fund | SDF Enterprise Fund investment track | Direct partnership | No open application | Up to $500K USD |
| Academic Research Grants | SDF Research | Quarterly RFPs | `research.stellar.org/research-grants` | Up to $150K USD |
| Enterprise Fund | SDF | Internal sourcing | No application | Active |

The separation is deliberate: SCF is positioned as an open-application funding mechanism that ingests a high volume of community proposals, while SDF direct funding targets later-stage ecosystem partners it engages with internally. Builders targeting the SCF must work within the published tracks and deadlines; builders seeking growth-stage capital should approach SDF's Marketing/Matching channels.

---

## 2. Stellar Community Fund (SCF): Mechanics, Awards, Tracks

### 2.1 SCF Awards Page Overview

The SCF site (`communityfund.stellar.org/awards`) lists the current open cycle (SCF #45) with a submission deadline of July 26, 2026 and a max award of $150K in XLM. According to the homepage counter, SCF has funded **656+ projects since inception**. The handbook further notes "Since 2016, the fund has had nearly 400 winners and distributed almost 200M XLM," accounting for predecessor programs (Startup Camp / Stellar Build Camp).

### 2.2 Award Tiers Under SCF v7.0 (Effective January 2026)

SCF 7.0 reorganized the award suite based on the `stellar.org/blog/ecosystem/introducing-scf-v7` announcement. The structure now consists of one main award (SCF Build) plus supporting programs in a unified "Growth" track.

| Award / Tier | Max Amount | Currency | Eligibility | Application Path |
|---|---|---|---|---|
| SCF Build Award | $150,000 | XLM | Teams building apps/protocols on Stellar or Soroban | Interest form -> Build form -> KYC/KYB -> Tranches |
| Instawards | $15,000 per project | XLM | Early-stage builders, recommended by local Ambassador Chapter | Ambassador channel recommendation (no open application) |
| Growth Hack | $20,000 base + up to $200,000 performance | XLM | Stellar mainnet projects (cohort of 10-15 teams/quarter) | Quarterly cohort application |
| Audit Bank | Up to 100% of audit costs | USD (paid by SDF) | SCF-funded projects, KYC-passed, testnet-stage | Audit Bank intake email from SCF |
| Public Goods Award | $50,000 per proposal, per quarter | XLM | SCF Verified Members maintaining ecosystem public goods | Invitation; voted via Soroban Governor |
| Stellar Liquidity Award | Not publicly disclosed | Not publicly disclosed | Financial protocols, audit-complete, live on mainnet | Invitation-only |

The Kickstart Award (introduced under SCF v6.0, September 2024) explicitly provided up to $15,000 in XLM and required participation in a 5-day bootcamp; under SCF 7.0 the Kickstart function was replaced by Instawards on a decentralized, ambassador-led model.

### 2.3 SCF Build Award Tracks (Three Tracks)

Per `stellar.gitbook.io/scf-handbook/scf-awards/build-award`, SCF Build has three tracks plus a Resubmission path.

| Track | Audience | Vote | Panel Size | Typical Cap |
|---|---|---|---|---|
| Open Track | Teams building something brand-new on Stellar | Community Vote (NQG) + panel | 11-13 delegates | $150K XLM |
| Integration Track | Teams integrating an existing Stellar "building block" or with significant traction | Panel only | 11-13 delegates | $150K XLM |
| RFP Track | Developers building tools/SDKs/APIs/explorers/testing infra aligned with active RFPs | Panel only | 9-11 delegates | $150K XLM |
| Resubmission | Previous applicants not selected, after meaningful improvements | Depends on track chosen | n/a | $150K XLM |

### 2.4 Build Award 4-Tranche Milestone Disbursement (v7.0)

Under SCF 7.0, funding flows in four tranches tied to technical milestones:

| Tranche | % Paid | Trigger |
|---|---|---|
| Initial | 10% | Award acceptance (no longer requires initial upfront delivery) |
| Tranche #1 | 20% | MVP delivery |
| Tranche #2 | 30% | Testnet deployment |
| Tranche #3 | 40% | Mainnet launch + UX readiness |

The 4-tranche model replaces the v6.0 three-equal-disbursement structure. Funding is intended to cover approximately four months of development, with projects typically spanning 3-6 months end-to-end.

### 2.5 Application Flow (Step by Step)

According to the Build Award handbook, the application path is:

1. **Interest Form** submission on `communityfund.stellar.org` (open window ~2 weeks)
2. **Referral confirmation and eligibility review**
3. **Invitation** via email to submit a full proposal to a specific track
4. **Full proposal** submission with technical roadmap, milestone plan, budget breakdown, traction, team skills
5. **Prescreen** for completeness and eligibility
6. **Panel review** by SDF employees + community reviewers (Track Delegate Panels)
7. **Revision window** (optional, for minor changes)
8. **Community Vote** (Open Track only, NQG-weighted)
9. **KYC/KYB** compliance and identity verification
10. **Tranche payments** per milestone

Required documents per the SCF handbook include detailed technical roadmap, milestone plan, budget breakdown by tranche, current traction, and team bio/information. Selected recipients must also complete KYC/KYB and meet participant eligibility requirements.

---

## 3. Governance and Voting: Neural Quorum (NQG) Explained

### 3.1 Origins and Adoption

Neural Quorum Governance (NQG) was introduced to the Stellar Community Fund in **October 2023**, replacing the prior activation/community-vote split. NQG was co-developed with BlockScience via a joint ideation, specification, and implementation effort (per `blog.block.science/introducing-neural-quorum-governance`, November 9, 2023).

### 3.2 Mechanism Structure

NQG combines two primitives:

- **Neural Governance**: modular voting-power attribution (each voter's weight reflects reputation through layered trust signals).
- **Quorum Delegation**: voters with limited expertise can delegate to quorums (groups of higher-reputation voters) without trusting a single delegate.

Per the SCF Handbook, NQG is "a reputation-based voting mechanism designed to distribute voting weight in a decentralized, fair, and transparent manner." Voters must be **SCF Verified** to participate. The voting power is calculated dynamically based on each user's contribution history, trust, and expertise.

### 3.3 NQG in Practice at SCF

- **Applied to**: Open Track community vote (SCF Build) and the Public Goods Award.
- **Delegate selection**: Cut-off for becoming a community delegate is **1/40 of total NQG Voting Weight** for that specific track.
- **Final funding decisions**: Shaped by delegate votes; panel review still weighs in for non-Open tracks.
- **Implementation History Page**: Available at `stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance/implementation-history.md` documents the version-by-version rollout.

### 3.4 Verified Members

SCF Verified Members are earned, dynamic, and influence-based (per `stellar.gitbook.io/scf-handbook/governance/verified-members`). The community consists of **four tiers**, with the path to verification documented at `/governance/verified-members/how-to-become-verified.md`. Verified Members vote in Open Track and Public Goods Award rounds, and can be nominated to Track Delegate Panels.

### 3.5 Quarterly Governance Process

Per `stellar.gitbook.io/scf-handbook/scf-awards/build-award/quarterly-governance-process`, the panels structure each quarter as follows:

| Panel | Track | Selection | Size | Community Vote? |
|---|---|---|---|---|
| Delegate Panel | Open Track | Top NQG holders (>= 1/40 of track weight) | 11-13 | Yes |
| Delegate Panel | Integration Track | Top NQG holders | 11-13 | No |
| Delegate Panel | RFP Track | Top NQG holders | 9-11 | No |

Funding decisions are shaped by delegate contributions. Delegates are required to vote on all eligible SCF Build submissions within their track.

---

## 4. Vote Cadence, Active Rounds, and Active RFPs (2026)

### 4.1 Round Cadence

SCF Build Award rounds run every **6 weeks**, per `communityfund.stellar.org/awards`. The most recent round visible is **SCF #45**, with a submission deadline of **July 26, 2026**. Round numbers visible across research: SCF #38, #39, #40, #41 (deadline Feb 1, 2026), #43 (Q2 2026), #44 (Q2 moved per April 2026 handbook update), #45 (deadline July 26, 2026).

### 4.2 Active Q2 2026 RFPs

The handbook's RFP Track page (`stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track`) — last updated to add new Q2 RFPs as of May 11, 2026 for SCF #43 — lists the following active Requests for Proposals (RFPs):

| RFP Name | Scope | Target Audience |
|---|---|---|
| Trustline Onboarder | Standard + reference implementation (incl. landing page) enabling exchanges/brokers/wallets to onboard users into Stellar assets without manual trustline setup | Experienced builders with Stellar ops + CAP standards + wallet/exchange integration |
| Passkey UI | Documented passkey usage patterns for Stellar smart accounts; minimal composable passkey SDK; reference UI components to integrate into `stellar-wallet-kit` | Trusted teams with production WebAuthn/passkeys experience |
| Contract Source Verification Service | Public, hosted contract source verification service for Soroban smart contracts using SEP-58 metadata vocabulary (service layer + transaction recording/observation + synthesizer) | Developers capable of building a service+observation layer |

Note: Bounty amounts per RFP are not disclosed on the handbook page; pricing follows the standard SCF Build cap of $150K in XLM for the selected sub-track.

### 4.3 Active SCF Rounds Visible (May-June 2026)

- SCF #43: RFP Track opened Q2 2026 (May 11, 2026)
- SCF #44: Q2 RFPs relocated (April 2026 handbook update)
- SCF #45: Open submission deadline July 26, 2026 ($150K XLM cap)

For historical reference, the occasional "SCF Kickstart #11" recap is also surfaced on the homepage, reflecting the v6 kickstart cadence.

---

## 5. SDF Grants Beyond SCF

### 5.1 Program Catalog (`stellar.org/grants-and-funding`)

| Program | Max Amount | Currencies | Who Qualifies | Mechanism |
|---|---|---|---|---|
| SCF Build Award (linked to SCF) | $150,000 | XLM | Builders building apps/protocols on Stellar | SCF cadence (every 6 weeks) |
| Bug Bounty Program | $250,000 (protocol/repos) / $50,000 (Soroban exploits) | XLM / USD | Individual security researchers | Public submission, severity-weighted |
| Matching Fund | $500,000 | USD | Earlier-stage companies (pre-seed to Series B) | Partnership/investment track |
| Academic Research Grant | $150,000 | USD | Students, researchers submitting academic proposals | Quarterly RFP at `research.stellar.org/research-grants` |
| Marketing Grants | $500,000 | USD, USDC, or XLM | New or existing projects with a live product on Stellar | Direct grant proposal; supports digital + offline marketing, in-app incentives, PR, communications |
| Enterprise Fund | Not publicly disclosed as a cap | Not publicly disclosed | Promising enterprises (no open application) | SDF engagement; includes Matching Fund investment track |

### 5.2 SDF Mandate and Liquidity Programs

Per `stellar.org/foundation/mandate`, SDF's mandate includes increasing on-chain liquidity via market-making programs for key assets and grants/incentives for institutions that provide on-chain liquidity. SDF funds ecosystem development through public-goods-targeted grants, smart-contract audit support, and developer tooling.

### 5.3 Academic Research Grants

Per `research.stellar.org/research-grants`, SDF accepts proposals for "scientific, technological, economic, and legal research advancing the foundation's goals." Max award $150K USD. Academic applicants must follow the published RFP schedule.

### 5.4 Bug Bounty Specifics (Per `stellar.org/grants-and-funding`)

- Protocol / Core Repositories: **$250,000 in XLM** for vulnerabilities in Stellar protocol or core repos.
- Soroban / Smart Contracts: **$50,000 USD** for Soroban smart-contract exploits.

This is a critical distinction: protocol-level bugs pay in XLM at a higher cap; application-level Soroban exploits pay in USD with a lower cap. Security researchers should target repos accordingly.

### 5.5 Marketing Grant Specifics

SDF offers Marketing Grants of up to $500,000, awarded in USD, USDC, or XLM, to support the growth and user acquisition of projects built on the Stellar network. Eligible activities: digital and offline marketing, in-app incentives, PR, and communications.

---

## 6. Hackathons, Bounties, and RFPs via DoraHacks and Adjacent

### 6.1 Stellar Org on DoraHacks

`dorahacks.io/org/stellar` is the SDF's organization page on DoraHacks, the leading global hackathon community and open-source developer incentive platform. The page lists all hackathons and BUIDLs SDF sponsors or co-hosts.

### 6.2 Active 2025-2026 Hackathons Documented

| Hackathon | Location | Date | Prize Pool | Theme |
|---|---|---|---|---|
| Build On Stellar National Bounty 2025 | India (Bangalore?) | Submission started Aug 19, 2025 | $1,000 (USD) USD per winning track? | Code for Bharat: Season 2; organized by Tech Masters India Community + Stellar India |
| Stellar Hacks: Agents | Global / Online | Submission period 2026/03/30+ | $10 (USD?) USD? | AI agents, x402, Stripe micropayments, autonomous transactions on Stellar |

The Build On Stellar hackathon is a "Code for Bharat: Season 2" partner event; the Stellar Hacks: Agents event focuses on enabling AI agents to autonomously transact, access services, and operate independently using seamless micropayments on Stellar (x402 + Stripe integration layer).

### 6.3 Past Notable Hackathons

- **SBC: Stellar Build Camp** (2016-2019): predecessor to SCF, awarded "no-strings-attached funding"
- **DraperU Embark Accelerator**: Per SCF v6.0 blog post, accepted startups received a "guaranteed US$50K investment" upon completing the program. Status under SCF v7.0: pivoted into the broader Growth track consisting of Growth Hack + Audit Bank + Accelerators + Distribution.

### 6.4 RFP Track as Developer-Tooling Funnel

Per the SCF Build RFP Track page, the RFP track intentionally funnels developer tooling, SDKs, APIs, explorers, and testing infrastructure into a specialized review path with 9-11 delegates and no community vote. This formalizes the "what should we build?" question into published, funded scopes, reducing guesswork for builders.

---

## 7. Builder and Developer Ecosystem Landscape

### 7.1 Notable Teams (Indicative Categories)

The Stellar ecosystem projects page at `stellar.org/ecosystem` curates a catalog of builders across multiple categories. A representative snapshot drawn from `stellar.org/blog/ecosystem/irl-stellar-bringing-culture-onchain-invisibly` and SCF-funded project databases includes:

| Project Category | Example Builders (per published case studies) | Funding Pathway |
|---|---|---|
| IRL (cultural/Web3) | IRL (per `stellar.org/blog/ecosystem/irl-stellar-bringing-culture-onchain-invisibly`) | SCF Build Award (Build Award per case study) |
| AI / Agentic | Stellar Hacks: Agents bounty winners | Hackathon + SCF Build RFP |
| DeFi / Liquidity | Audited, mainnet financial protocols | SCF Build -> Liquidity Award |
| Developer Tooling | RFP Track winners (Trustline Onboarder, Passkey UI, Contract Source Verification) | SCF Build RFP Track |
| Soroban / Smart Contracts | All apps shipping on Soroban | SCF + Audit Bank |
| Regional Builders | India-based (Tech Masters India Community); broader Ambassador chapters | Instawards + Ambassador recommendations |

### 7.2 Stellar Ambassador Program

Per `stellar.gitbook.io/ambassador-program`, the program supports builders and educators forming regional chapters, organizing local events, leading meetups, and contributing to documentation. Under SCF 7.0, ambassadors gain direct recommendation authority for **Instawards up to $15K per project** — a major decentralization and acceleration of funding decisions to the local level.

### 7.3 Developer Relations Infrastructure

Stellar ecosystem developer relations touches four primary channels:

- **Discord** (`discord.gg/stellardev` or `discord.gg/stellar`): #scf-governance, #scf-build, #soroban channels with defined roles per `stellar.gitbook.io/scf-handbook/additional-support/navigating-discord/channels-and-roles.md`.
- **Dev Docs**: `developers.stellar.org` is the canonical tech documentation portal.
- **SCF Handbook**: `stellar.gitbook.io/scf-handbook` is the source of truth for SCF programs.
- **GitHub**: `github.com/stellar/scf-handbook` — handbook repo, updated most recently April 2026.

### 7.4 Regional Communities

Beyond flagship hubs, the Ambassador Program maintains regional chapters. Notable activity documented in research:

- **India**: Tech Masters India Community hosts Build on Stellar National Bounty in collaboration with Stellar India.
- **Global / Online**: BUIDLs (long-form hackathons) and shorter hackathons.

### 7.5 DoraHacks as a Builder Gateway

DoraHacks describes itself as "the leading global hackathon community and open-source developer incentive platform." It provides toolkits for organizing hackathons and funding. Per Pitchbook, DoraHacks has raised $38.2M (per `pitchbook.com/profiles/company/231034-06`). The Stellar org page aggregates SDF-sponsored hackathons across regions and themes, serving as the entry point for builders who want to lock in a hackathon-to-grant pathway.

---

## 8. Historical Evolution of the SCF (2016-2026)

The History page (`stellar.gitbook.io/scf-handbook/additional-support/history-of-scf.md`, last updated April 2024) provides a version-by-version timeline. Frame it as a process-of-iteration toward community empowerment and quality, not a static program.

| Version | Era | Key Innovation | Award Caps | Voting |
|---|---|---|---|---|
| SBC (Stellar Build Camp) | 2016-2019 | No-strings-attached funding | Variable | No |
| SCF 1.0 | 2019-2020 | Community voting introduced; 12M XLM/year, quarterly rounds | Variable | Yes |
| SCF 2.0 | 2020-2021 | Lab Fund (experimental) + Seed Fund (scaling); Seed launched Jan 18, 2021 | $200K-350K XLM | Yes |
| SCF 3.0 | 2021-2022 | USD budgets paid in XLM; yes/abstain voting; Project Pitches; Startup Camp; SCF Handbook | Variable | Yes/abstain |
| SCF 4.0 | 2023 | On-chain voting; Submittable for award mgmt; Stellar Developers Discord; pilot SCF #12 Jan 23, 2023 | Variable | On-chain |
| SCF 5.0 (SCF #20-29) | 2023-2024 | Activation Awards (up to $50K) + Community Awards (up to $100K); NQG adopted | $50-100K | NQG |
| SCF 6.0 (SCF #30-40) | 2024-2025 | Launched Sept 4, 2024; Kickstart Award revived (up to $15K + 5-day bootcamp); LaunchKit; DraperU Embark $50K guaranteed invest | $15K Kickstart, $150K Build | NQG |
| SCF 7.0 (SCF #41-Current) | Jan 2026 onward | Build Award split into Open/Integration/RFP; 4-tranche 10/20/30/40 milestone model; Instawards replaces Kickstart; $150K cap universal | $150K Build, $15K Instawards | NQG (Open Track only) |

Key directional shift: starting from pure SBC grants, SCF progressively devolved selection power from internal committee to community via voting, then to NQG-based governance, then to per-track delegate panels, then to local Ambassador chapters via Instawards. The strategic direction is more local, more specialization, and tighter milestone accountability.

---

## 9. 2025-2026 Program Changes (Concrete Updates)

Material changes during the period from late 2025 to June 2026:

| Change | Effective | Source |
|---|---|---|
| SCF 7.0 launch | January 2026 | `stellar.org/blog/ecosystem/introducing-scf-v7` |
| 4-tranche Build Award disbursement (10/20/30/40) | January 2026 SCF #41+ | SCF v7.0 post |
| $150K universal cap with case-by-case exceptions | January 2026 | `github.com/stellar/scf-handbook` (April 2026 update reference) |
| UX audits and user testing added to Build | January 2026 | GitHub SCF handbook |
| Instawards launched (Kickstart function migration) | January 2026 (SCF 7.0) | SCF v7.0 post + Instawards handbook |
| Build Award split into Open / Integration / RFP tracks | January 2026 | Build Award handbook (Updated 01/9/2026) |
| Q2 2026 RFPs opened (Trustline Onboarder, Passkey UI, Contract Source Verification) | May 11, 2026 (for SCF #43) | RFP Track handbook |
| Integration Track estimated-dev-time guidance | April 2026 | GitHub SCF handbook |
| Q2 RFPs relocated to SCF #44 | April 2026 | GitHub SCF handbook |
| Referral Program operationalized | January 2026 | Build Award Referral Program page |

---

## 10. Comparative Analysis: SCF vs. SDF Direct (Decision Framework)

When should a builder apply to SCF vs. SDF direct channels? The decision tree:

| Builder Situation | Best Channel | Reason |
|---|---|---|
| Idea-stage, needs quick funding | Instawards via Ambassador | $15K, no open application, fast turnaround |
| Building an app or protocol on Stellar | SCF Build Open Track | $150K cap, community-voted, broad appeal |
| Integrating an existing Stellar "building block" | SCF Build Integration Track | Faster track for composable work |
| Building tooling per an open RFP | SCF Build RFP Track | Panel-only path reduces vote risk |
| Already built, need code audit | Audit Bank | Up to 100% SDF-funded prior to mainnet launch |
| Launched on mainnet, need growth activation | Growth Hack cohort | $20K base + up to $200K performance |
| Operating a public good (data, governance, infra tooling) | Public Goods Award | $50K/qtr, NQG-weighted |
| Audited financial protocol with live mainnet liquidity | Stellar Liquidity Award | Invite-only; downside: cap not publicly disclosed |
| Marketing/growth traction post-launch | SDF Marketing Grant | Up to $500K USD/USDC/XLM |
| Funded by external VC, want signal multiplier | SDF Matching Fund | Up to $500K USD |
| Pre-seed to Series B fundraising stage | SDF Matching Fund / Enterprise Fund | Investment-track funds |
| Academic study advancing Stellar goals | SDF Academic Research Grant | Up to $150K USD via `research.stellar.org/research-grants` |
| Security research on Soroban or protocol | Bug Bounty | $250K XLM for protocol, $50K USD for Soroban |
| Hackathon-style rapid prototyping | DoraHacks hackathons (Build On Stellar, Stellar Hacks: Agents) | Prize-driven, networking, mentor sessions |

Critical caveat: The Enterprise Fund has **no open application process** — it is sourced by SDF outbound. Builders should not waste effort applying to it; the Matching Fund is the closest open analog but is described as an investment-track mechanism.

---

## 11. Quantified Snapshot: Disbursements, Caps, and Cadence

A consolidated quantitative view across the dossier:

| Metric | Value | Source |
|---|---|---|
| Total SCF-funded projects (since 2016) | ~400 winners | `stellar.gitbook.io/scf-handbook/additional-support/history-of-scf.md` |
| Total SCF-funded projects (current v7.0 counter) | 656+ awarded submissions | `communityfund.stellar.org` |
| Cumulative XLM distributed via SCF since 2016 | ~200M XLM | History of SCF |
| SCF Build cap | $150,000 XLM | Build Award handbook |
| SCF Build cadence | Every 6 weeks | `communityfund.stellar.org/awards` |
| Instawards cap | $15,000 XLM per project | SCF v7.0 blog post |
| Public Goods Award cap | $50,000 XLM per proposal per quarter | Public Goods Award handbook |
| Growth Hack base | $20,000 XLM per team | Growth Hack handbook |
| Growth Hack performance max | $200,000 XLM | Growth Hack handbook |
| Audit Bank coverage | Up to 100% of audit costs | Audit Bank Official Rules |
| Audit Bank co-pay | 5% upfront (refundable) | Audit Bank Official Rules |
| NQG delegate cutoff (per track) | 1/40 of total NQG Voting Weight | Quarterly Governance Process |
| Delegate Panel - Open Track size | 11-13 | Quarterly Governance Process |
| Delegate Panel - Integration Track size | 11-13 | Quarterly Governance Process |
| Delegate Panel - RFP Track size | 9-11 | Quarterly Governance Process |
| Build Award (Open) initial milestone | 10% on award | SCF v7.0 blog post |
| Build Award (Open) MVP | 20% | SCF v7.0 blog post |
| Build Award (Open) Testnet | 30% | SCF v7.0 blog post |
| Build Award (Open) Mainnet + UX | 40% | SCF v7.0 blog post |
| Marketing Grant cap | $500,000 USD/USDC/XLM | `stellar.org/grants-and-funding` |
| Matching Fund cap | $500,000 USD | `stellar.org/grants-and-funding` |
| Academic Research Grant cap | $150,000 USD | `research.stellar.org/research-grants` |
| Bug Bounty - Protocol | $250,000 XLM | `stellar.org/grants-and-funding` |
| Bug Bounty - Soroban | $50,000 USD | `stellar.org/grants-and-funding` |
| SCF Kickstart (v6) cap | $15,000 XLM | SCF v6.0 post |
| Current active SCF round | #45 | `communityfund.stellar.org/awards` |
| SCF #45 submission deadline | July 26, 2026 | `communityfund.stellar.org/awards` |
| Star Hunt Accelerator (DraperU Embark) guaranteed investment | $50,000 USD | SCF v6.0 post |

---

## 12. Risks, Failure Modes, and Tensions

Worth documenting the tensions surfaced across the research:

- **Open Track Community Vote Risk**: Because Open Track is the only Build track with community voting, projects targeting broad ecosystem appeal may prefer Open Track; projects with niche tooling may face lower community attention even if technically superior. Mitigation: RFP Track is the safer venue for tooling.
- **NQG Reputation Bottleneck**: Voting power concentrated in long-time verified members risks ossification. The `@stellar` ecosystem explicitly added UX audits, user testing, and ReferralProgram to broaden the funnel.
- **Audit Bank Conditionality**: Upfront 5% co-payment for initial audits; refund conditional on resolution of critical/high/medium vulns within 20 business days. Projects slow to remediate will lose the refund.
- **No-Application Enterprise Fund**: Builders may mistakenly approach the Enterprise Fund; it's outreach-only.
- **Cap Disclosure Gaps**: The Enterprise Fund, Liquidity Award, and individual RFP bounties do not publicly disclose caps. Best-effort budget discovery required; engage via Discord `#scf-governance` for visibility.
- **Env Tensions: SCF Build vs. SDF Direct**: SCF Build caps at $150K XLM; SDF Marketing hits $500K. Coordinated stacking is allowed (SCF -> Audit Bank -> Growth Hack -> Marketing), but each program has its own eligibility windows and approval timelines.
- **Failure Case - Resubmission**: Projects rejected from Open Track can resubmit only if they incorporate meaningful improvements; "minor" tweaks do not qualify.

---

## 13. Synthesis: The Stellar Funding Flywheel

Across the research, a recurring flywheel becomes visible: **Instawards (local seeding) -> SCF Build (ideation-to-launch capital) -> Audit Bank (security) -> Growth Hack (post-launch activation) -> Marketing/Matching/Liquidity (scale)**. SCF 7.0 explicitly aligns the programs as a staged ladder with NQG providing governance continuity at each stage.

The strategic posture of the program in mid-2026 is "more local, more specialization, more discipline": Instawards pushes funding decisions outward to ambassadors and chapters; Build's three tracks funnel builders into purpose-fit paths with narrower evaluation criteria; the 4-tranche milestone disbursement ties capital to execution; UX audits and user testing raise the quality bar beyond protocol metrics.

For an analyst or applicant: the right framing is not "which single grant?" but "which rung of the ladder best matches my milestone?" Builders early in the funnel should engage local Ambassadors for Instawards; teams with traction should apply to Open Track and engage the community vote; niche tooling builders should target RFP Track; finance protocols should layer Build + Audit Bank + Liquidity Award; launched projects should pursue Marketing/Matching.

Builders who treat the programs as a coordinated stack rather than a single grant will maximize funding, security coverage, and ecosystem support — the upside of which the cumulative **~200M XLM / 656+ submissions** record makes concrete.

---

## 14. The 25 Most Important Questions About Stellar Funding, Grants, SCF & Builder Programs

Listed below are the canonical answers and best source URLs for the top 25 questions an applicant, journalist, ecosystem analyst, or builder would ask.

| # | Question | Canonical Answer | Best Source URL |
|---|---|---|---|
| 1 | What is the Stellar Community Fund (SCF)? | A community-driven program that uses public voting and panel review to fund Web3 teams building on Stellar (apps, protocols, Soroban). | https://communityfund.stellar.org/ |
| 2 | Who runs the SCF? | The Stellar Community Foundation (SCF), with SDF employees and SCF Verified Members serving as Track Delegate Panelists and contributors. | https://stellar.gitbook.io/scf-handbook/welcome-to-the-scf-handbook |
| 3 | What is the SCF Build Award cap? | $150,000 in XLM per award (under SCF v7.0 effective January 2026). | https://stellar.gitbook.io/scf-handbook/scf-awards/build-award |
| 4 | What tracks are available under SCF Build? | Open Track, Integration Track, RFP Track, plus a Resubmission path. | https://communityfund.stellar.org/awards |
| 5 | How often do SCF Build rounds run? | Every six weeks. SCF #45 is the current round, deadline July 26, 2026. | https://communityfund.stellar.org/awards |
| 6 | What is Neural Quorum Governance (NQG)? | A reputation-based voting-power attribution and delegation mechanism adopted by SCF since October 2023, co-developed with BlockScience. | https://stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance |
| 7 | Who can vote in SCF Community Vote? | SCF Verified Members only. Verified status is earned through sustained ecosystem contribution. | https://stellar.gitbook.io/scf-handbook/governance/verified-members |
| 8 | How is the SCF Build award paid out? | In 4 milestones: 10% on award, 20% at MVP, 30% at Testnet, 40% at Mainnet + UX readiness. | https://stellar.org/blog/ecosystem/introducing-scf-v7 |
| 9 | What is the Instawards program? | Ambassador-recommended awards of up to $15,000 in XLM for early-stage builders; replaces Kickstart under SCF 7.0. | https://stellar.gitbook.io/scf-handbook/scf-awards/instawards |
| 10 | What is the SCF Public Goods Award? | A $50,000 XLM per proposal per quarter award for community-maintained public goods, voted via NQG on Soroban Governor. | https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award |
| 11 | What is the Audit Bank? | An SDF-funded program covering up to 100% of audit costs for SCF-awarded projects. Priority: financial protocols, infrastructure contracts, yield-bearing protocols. | https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank/official-rules |
| 12 | What is Growth Hack? | A quarterly 8-week competition-style GTM/PMF cohort funding 10-15 teams at $20K each + up to $200K performance award. | https://stellar.gitbook.io/scf-handbook/supporting-programs/growth-hack |
| 13 | What is the SCF Liquidity Award? | An invitation-only award for audited, mainnet-live financial protocols to bootstrap initial liquidity. | https://stellar.gitbook.io/scf-handbook/supporting-programs/stellar-liquidity-award |
| 14 | How many projects has the SCF funded? | Approximately 400 winners distributed across all SCF versions since 2016, with ~200M XLM disbursed; the v7.0 site counter shows 656+ submissions awarded. | https://stellar.gitbook.io/scf-handbook/additional-support/history-of-scf |
| 15 | When did SCF v7.0 launch? | January 2026, with SCF #41 as the first round under the new regime. | https://stellar.org/blog/ecosystem/introducing-scf-v7 |
| 16 | When did SCF v6.0 launch? | September 4, 2024, introducing Kickstart ($15K), Build ($150K), Audit support via LaunchKit, Growth program, and a $50K guaranteed DraperU Embark investment. | https://stellar.org/blog/developers/introducing-stellar-community-fund-v6-0 |
| 17 | What was the predecessor to SCF? | The Stellar Build Camp (SBC) ran 2016-2019 with no-strings-attached funding; SCF 1.0 launched 2019-2020 with community voting. | https://stellar.gitbook.io/scf-handbook/additional-support/history-of-scf |
| 18 | What is the SDF Enterprise Fund? | An outreach-only funding line for promising enterprises; includes the Matching Fund investment track. No open application. | https://stellar.org/grants-and-funding |
| 19 | What is the SDF Marketing Grant? | Direct USD/USDC/XLM grant of up to $500,000 for marketing, in-app incentives, PR, or communications tied to launches on Stellar. | https://stellar.org/grants-and-funding |
| 20 | What is the SDF Matching Fund? | Investment-track fund offering up to $500,000 USD to earlier-stage companies from pre-seed through Series B. | https://stellar.org/grants-and-funding |
| 21 | What is the SDF Bug Bounty? | $250,000 XLM for protocol/core repo vulnerabilities; $50,000 USD for Soroban smart-contract exploits. | https://stellar.org/grants-and-funding |
| 22 | What are the active 2026 Q2 RFPs? | Trustline Onboarder, Passkey UI, and Contract Source Verification Service (Soroban/SEP-58) — accepting submissions for SCF #43. | https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track |
| 23 | How does a builder apply? | Submit an interest form on `communityfund.stellar.org`; if eligible, you are invited to submit a full proposal to a specific track, then complete KYC/KYB before tranche payments. | https://stellar.gitbook.io/scf-handbook/scf-awards/build-award |
| 24 | What is the Stellar Ambassador Program? | A regional-chapter program for builders and educators; under SCF 7.0, ambassadors are the primary recommender for Instawards (up to $15K). | https://stellar.gitbook.io/ambassador-program |
| 25 | Where do Stellar hackathons live? | On DoraHacks via the SDF organization page; active events include Build On Stellar National Bounty (India 2025) and Stellar Hacks: Agents (x402 + Stripe 2026). | https://dorahacks.io/org/stellar |

---

## References

1. *Stellar Community Fund | Blockchain Grants & Web3 Funding*. https://communityfund.stellar.org/
2. *Is the SCF Kickstart Award the Game Changer for Stellar ...*. https://www.reddit.com/r/Stellar/comments/1hro55s/is_the_scf_kickstart_award_the_game_changer_for/
3. *Build Award | Stellar Community Fund - Handbook*. https://stellar.gitbook.io/scf-handbook/scf-awards/build-award
4. *Build Awards $150K+ | Stellar Ecosystem Grants & Funding*. https://communityfund.stellar.org/awards
5. *AuditAI*. https://communityfund.stellar.org/project/auditai-lv1
6. *Introducing Neural Quorum Governance*. https://blog.block.science/introducing-neural-quorum-governance/
7. *Neural Quorum Governance | Stellar Community Fund*. https://stellar.gitbook.io/scf-handbook/governance/neural-quorum-governance
8. *Grants and Funding*. https://stellar.org/grants-and-funding
9. *Invitations to Bid, Requests for Proposals ...*. https://www.scf.edu/administration/departments/business-services/invitations-to-bid-requests-for-proposals-invitations-to-negotiate/
10. *SCF #39*. https://communityfund.stellar.org/awards/rec9bKSlg8jOYiwS0
11. *SCF #38*. https://communityfund.stellar.org/awards/recj1XuLpWn6GQRmc
12. *SDF Mandate*. https://stellar.org/foundation/mandate
13. *SDF's Next Steps*. https://stellar.org/blog/foundation-news/sdfs-next-steps
14. *About Stellar Development Foundation*. https://stellar.org/foundation
15. *Academic Research Grants | SDF Research*. https://research.stellar.org/research-grants
16. *DoraHacks - Leading Open Source Incentive & Hackathon ...*. https://dorahacks.io/
17. *Hackathons for Frontier Tech - AI, Quantum, Crypto, BioTech*. https://dorahacks.io/hackathon
18. *Build On Stellar National Bounty | Hackathon*. https://dorahacks.io/hackathon/buildonstellarhack
19. *Stellar Development Foundation | Organization*. https://dorahacks.io/org/stellar
20. *Stellar Hacks: Agents | Hackathon*. https://dorahacks.io/hackathon/stellar-agents-x402-stripe-mpp/buidl
21. *Stellar Ecosystem Projects*. https://stellar.org/ecosystem
22. *Stellar Ambassador Program*. https://stellar.gitbook.io/ambassador-program
23. *Stellar Communities – leading real estate development ...*. https://livestellar.com/
24. *The Stellar Community*. https://stellar.org/community
25. *The Stellar Ambassador Program provides support ...*. https://x.com/StellarOrg/status/1893030752603787439
26. *The Stellar Kickstart Accelerator & Funding Opportunities*. https://www.youtube.com/watch?v=0aIIfGJ-LOE
27. *Introducing Stellar Community Fund v6.0*. https://stellar.org/blog/developers/introducing-stellar-community-fund-v6-0
28. *a new era of community empowerment begins*. https://stellar.org/blog/ecosystem/stellar-community-fund-a-new-era-of-community-empowerment-begins
29. *Introducing Stellar Community Fund 6.0 | by Anke Liu*. https://medium.com/stellar-community/introducing-stellar-community-fund-6-0-9bf48dd407e9
30. *stellar/scf-handbook*. https://github.com/stellar/scf-handbook
31. *DoraHacks*. http://youtube.com/c/DoraHacksGlobal
32. *DoraHacks Blog Announcements*. http://dorahacks.io/blog/announcements
33. *Jiannan Zhang - LinkedIn*. http://linkedin.com/in/jiannanzhang
34. *DoraHacks LinkedIn*. http://linkedin.com/company/dorahacks
35. *Stellar SCF 7.0: Grants & Funding Tracks for Web3 Builders*. https://stellar.org/blog/ecosystem/introducing-scf-v7
36. *Survey of Consumer Finances (SCF)*. https://www.federalreserve.gov/econres/scfindex.htm
37. *Survey of Consumer Finances (SCF)*. https://www.norc.org/research/projects/survey-of-consumer-finances.html
38. *Institutional Effectiveness and Research*. https://www.scf.edu/administration/departments/institutional-effectiveness/institutional-effectiveness-research/
39. *Inheritances and the Distribution of Wealth or Whatever ...*. https://ideas.repec.org/p/nbr/nberwo/16840.html
40. *Instawards | Stellar Community Fund - Handbook*. https://stellar.gitbook.io/scf-handbook/scf-awards/instawards
41. *Stellar Community Fund - Handbook*. https://stellar.gitbook.io/scf-handbook/llms.txt
42. *Welcome to the SCF Handbook!*. https://stellar.gitbook.io/scf-handbook
43. *Build Award*. https://stellar.gitbook.io/scf-handbook/scf-awards/build-award.md
44. *Page Not Found*. https://stellar.gitbook.io/scf-handbook/scf-awards/kickstart-award.md
45. *Instawards*. https://stellar.gitbook.io/scf-handbook/scf-awards/instawards.md
46. *Page Not Found*. https://stellar.gitbook.io/scf-handbook/scf-awards/audit-bank.md
47. *Page Not Found*. https://stellar.gitbook.io/scf-handbook/scf-awards/liquidity-award.md
48. *Page Not Found*. https://stellar.gitbook.io/scf-handbook/scf-awards/growth-hack.md
49. *Page Not Found*. https://stellar.gitbook.io/scf-handbook/scf-awards/accelerators.md
50. *Page Not Found*. https://stellar.gitbook.io/scf-handbook/scf-awards/distribution.md
51. *Page Not Found*. https://stellar.gitbook.io/scf-handbook/scf-awards/activation-award.md
52. *Page Not Found*. https://stellar.gitbook.io/scf-handbook/scf-awards/community-award.md
53. *Audit Bank*. https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank.md
54. *Official Rules*. https://stellar.gitbook.io/scf-handbook/supporting-programs/audit-bank/official-rules.md
55. *Public Goods Award*. https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award.md
56. *Stellar Liquidity Award*. https://stellar.gitbook.io/scf-handbook/supporting-programs/stellar-liquidity-award.md
57. *Growth Hack*. https://stellar.gitbook.io/scf-handbook/supporting-programs/growth-hack.md
58. *RFP Track*. https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track.md
59. *Quarterly Governance Process*. https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/quarterly-governance-process.md
60. *History of SCF*. https://stellar.gitbook.io/scf-handbook/additional-support/history-of-scf.md
61. *Page Not Found*. https://stellar.gitbook.io/scf-handbook/additional-support/welcome-to-the-scf-handbook.md
62. *Verified Members*. https://stellar.gitbook.io/scf-handbook/governance/verified-members.md
63. *Welcome to the SCF Handbook!*. https://stellar.gitbook.io/scf-handbook/welcome-to-the-scf-handbook.md
</content>
</invoke>
