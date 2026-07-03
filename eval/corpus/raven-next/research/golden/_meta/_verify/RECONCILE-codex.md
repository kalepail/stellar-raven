# Reconcile Verification - codex

Date: 2026-06-23

Scope: independent adversarial re-verification of the contested golden-battery reconciliation. I did not rely on `GROUNDTRUTH.md`. I queried Scout, Lumenloop, Stellar/MoneyGram/project docs, and broad web search, then reviewed the six edited golden files in `git diff HEAD`. I did not edit golden answers or commit.

## Sources Hit

Scout / Stellar Light:
- `https://stellarlight.xyz/api/projects/search?q=perpetual&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=perps&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=derivatives&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=Noether&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=Stellars%20Finance&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=Zenex&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=Turbolong&limit=10`
- `https://stellarlight.xyz/api/research?q=Noether%20perpetual%20DEX%20Stellar%20testnet&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=oracle&limit=20`
- `https://stellarlight.xyz/api/projects/search?q=Band%20Protocol&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=RedStone%20Stellar&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=Reflector&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=Litemint%20NFT%20marketplace&limit=10`
- `https://stellarlight.xyz/api/projects/search?q=NFT%20marketplace&limit=10`

Lumenloop:
- `search_directory`: Noether perpetual DEX Stellar testnet mainnet audit
- `search_directory`: Stellars Finance perpetual futures Stellar mainnet testnet
- `search_directory`: Zenex Hermes perpetual Stellar testnet mainnet pending
- `search_directory`: oracle Stellar Soroban Band RedStone DIA Lightecho Orally Reflector mainnet
- `search_directory`: Litemint NFT marketplace Stellar
- `search_content_semantic`: Noether first perpetual DEX Stellar testnet mainnet audit April 16 2026
- `search_content_semantic`: RedStone Stellar mainnet SEP-40 oracle live March 2026 Band Protocol mainnet Soroban oracle
- `search_content_semantic`: Protocol 27 Zipper Testnet June 18 2026 mainnet vote July 8 Stellar
- `search_content_semantic`: MoneyGram Ramps Stellar SEP-24 174 countries 5 USDC 950 USDC

Web / primary sources:
- Stellar docs: `https://developers.stellar.org/docs/data/oracles/oracle-providers`
- Stellar blog: `https://stellar.org/blog/foundation-news/stellar-yardstick-protocol-26-upgrade-guide`
- Stellar blog: `https://stellar.org/blog/foundation-news/yardstick-stellar-protocol-26`
- Stellar blog: `https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide`
- Stellar docs: `https://developers.stellar.org/docs/networks/software-versions`
- Band blog: `https://blog.bandprotocol.com/bandprotocol-integration-with-stellar-smart-contracts/`
- RedStone blog: `https://blog.redstone.finance/2026/06/04/reliability-at-scale-redstone-and-the-data-standard-for-stellars-rwa-moment/`
- MoneyGram dev portal: `https://developer.moneygram.com/moneygram-developer/docs/integrate-moneygram-ramps`
- Stellar MoneyGram page: `https://stellar.org/products-and-tools/moneygram`
- MoneyGram Ramps page: `https://www.moneygram.com/us/en/ramps`

## Per-Fact Verdicts

### 1. Perps / derivatives on Stellar

VERDICT: confirmed, with one important nuance.

Scout confirms:
- Noether is a decentralized perpetual futures exchange on Stellar/Soroban, "currently live on testnet," SCF-funded, with active repos.
- Zenex is a decentralized perpetual exchange, "currently on testnet, with mainnet pending," SCF-funded.
- Turbolong is live but explicitly "no perpetual futures, no funding rates"; it is recursive leveraged spot via Blend lending loops.
- Stellars Finance is a real SCF-funded perpetual trading project, but Scout/Lumenloop only prove a directory-level "Live" status, not independently confirmed mainnet trading.

Lumenloop/Scout research confirms the 2026-04-16 SDF Developer Meeting notes: Noether was demoed as the team's first perpetual DEX on Stellar, with a live testnet demo, MVP contracts, and mainnet launch planned only after audit.

I did not find a reliable, independent confirmation of any Stellar mainnet perp DEX with live mainnet trading. Scout also surfaced Sushi, AssetDesk, Rails, Vanna, and derivatives-adjacent infra, but those do not overturn the bottom line: the confirmed native perp DEX lane is emerging/testnet/pre-mainnet, not mature mainnet.

### 2. Oracles

VERDICT: confirmed.

Reflector is not the only Stellar oracle. Scout `q=oracle` returned Reflector plus DIA, Band, Lightecho, RedStone Finance, Orally, and others. It marks Reflector as high-prominence and integrated with Blend/Laina/Slender, which supports "leading / most-integrated."

Band mainnet is confirmed by Stellar's oracle-provider docs, which list a Mainnet contract, and by Band's own integration post saying its Soroban oracle service was deployed on mainnet and testnet. RedStone mainnet is confirmed by Scout and RedStone's 2026-06-04 blog saying SEP-40 assets are live; web results also showed March 2026 mainnet launch coverage. DIA/Lightecho/Orally are present and live in Scout/Lumenloop, though DIA mainnet maturity is less strongly evidenced than Band/RedStone in my sources.

### 3. Protocol 26 / 27 freshness

VERDICT: confirmed, and the older June 17 / ledger figure remains stale where it still appears.

Primary Stellar sources say Protocol 26 "Yardstick" mainnet upgrade vote was May 6, 2026, and the later Stellar Yardstick post says Yardstick went live on mainnet on May 6, 2026 following the validator vote. Stellar Developer Docs Software Versions list "Protocol 26 (Mainnet, May 6, 2026)".

Protocol 27 "Zipper" is confirmed as Testnet June 18, 2026 by Stellar Developer Docs Software Versions. The Stellar Zipper upgrade guide and Lumenloop result give the mainnet vote date as July 8, 2026. The edited file says "mainnet pending," which is true; it could optionally include July 8 as the scheduled vote, but omission is not incorrect.

### 4. MoneyGram Ramps soft fix

VERDICT: confirmed.

MoneyGram's developer portal says on-ramp limit 5-950 USDC per transaction, off-ramp 5-2,500 USDC, and off-ramps available in 174 countries. MoneyGram's consumer Ramps page says 170+ countries. Stellar's product page still says MoneyGram has presence in over 180 countries. The edit to "~170+ countries (MoneyGram dev docs cite 174)" is the safer current statement for the Ramps integration.

### 5. Other edited-file doubt: NFT marketplace / Litemint

VERDICT: confirmed.

Scout and Lumenloop both return Litemint as a Stellar NFT marketplace, live, with NFT/Marketplace tags and Soroban royalties/auctions language. The market-map edit's claim that NFTs are not total whitespace because Litemint exists is supported.

## Per-Edit Review

1. `research/golden/defi-ecosystem/q-defi-perps-whitespace.md` - KEEP.
   The edit matches the independently verified reality: emerging category, Noether/Stellars Finance/Zenex are real entrants, Noether and Zenex are testnet/pre-mainnet, Turbolong is leveraged spot, and no confirmed mainnet perp DEX was found.

2. `research/golden/defi-ecosystem/q-eco-defi-market-map.md` - KEEP.
   The perps, oracles, and NFT corrections match live evidence. The wording avoids treating Turbolong as a perp. No adjustment required.

3. `research/golden/defi-ecosystem/q-defi-reflector-related-projects.md` - KEEP.
   The edit correctly changes "single oracle" to "leading / most-integrated" and caveats other mainnet oracle providers. The consumer list still appears grounded.

4. `research/golden/defi-ecosystem/q-defi-reflector-oracle.md` - KEEP.
   The edit correctly prevents a false "only oracle" claim. If tightened later, distinguish Band/RedStone as strongly mainnet-confirmed and DIA/Lightecho/Orally as live directory/provider alternatives.

5. `research/golden/edge-governance/q-edge-fresh-latest-protocol-version.md` - KEEP.
   The May 6 Protocol 26 date and Protocol 27 Testnet June 18/mainnet-pending framing are correct. Optional minor enhancement: mention the scheduled P27 mainnet vote date, July 8, 2026.

6. `research/golden/assets-anchors-seps/q-anchor-moneygram-ramps.md` - KEEP.
   The country-count softening is correct; MoneyGram dev docs currently cite 174 / 170+ rather than relying on Stellar's broader "over 180 countries" marketing language.

## New Contradictions Found

These are outside the six edited golden files and were not edited per instruction:

1. `research/golden/_dossiers/defi-ecosystem.md:19` still says the oracle stack is "effectively a single decentralized network" and that residual risk is Reflector cluster governance. This contradicts the corrected oracle cards and live evidence for Band/RedStone/DIA/Lightecho/Orally.

2. `research/golden/_dossiers/defi-ecosystem.md:26` and `research/golden/_dossiers/defi-ecosystem.md:319` still say perpetuals/derivatives are nearly absent / whitespace / none surfaced. This contradicts the corrected perps card and live evidence for Noether, Stellars Finance, and Zenex.

3. `research/golden/_dossiers/protocol-core.md:14`, `research/golden/_dossiers/protocol-core.md:30`, and `research/golden/_dossiers/protocol-core.md:293` still carry the "activated 2026-06-17 at ledger 63,073,409" Protocol 26 framing. This contradicts primary Stellar sources and the corrected protocol cards using May 6, 2026.

I did not find new contradictions inside the six edited files themselves.

## Counts

- BLOCKER: 0
- MAJOR: 3
  - Stale DeFi dossier oracle single-provider framing.
  - Stale DeFi dossier perps whitespace framing.
  - Stale protocol-core dossier Protocol 26 June 17 / ledger framing.
- MINOR: 1
  - `q-edge-fresh-latest-protocol-version.md` could optionally add Protocol 27's scheduled July 8, 2026 mainnet vote date, but "mainnet pending" is accurate.

## Final Verdict

The six applied golden-file edits are supported by independent live verification and should be kept. The reconciliation is not complete across the whole battery because the unedited dossiers still contain stale claims that now contradict the corrected golden cards.
