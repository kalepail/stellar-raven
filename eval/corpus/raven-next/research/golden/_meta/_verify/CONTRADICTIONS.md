# Golden-question battery — INTERNAL CONTRADICTIONS scan

**Scope:** all 391 `research/golden/<category>/q-*.md` files across all 9 categories.
**Method:** cross-referenced the frontmatter `claim:` lines (must_have / should_have / must_avoid)
and the "Reference answer (gospel)" bodies for pairs/sets that assert mutually exclusive "truth"
about the same project / topic / fact. **No web verification** — these are INTERNAL inconsistencies
only (a separate agent owns ground truth).
**Date of scan:** 2026-06-22.

A "contradiction" here means two (or more) golden files **cannot both be true as written** — not mere
differences in emphasis or freshness caveats. Soft tensions and verified-consistent clusters are listed
at the end so they are not re-investigated.

---

## CONTRADICTION SETS (4)

### SET 1 — Perpetuals / derivatives DEX: whitespace vs. live products
**Topic:** Whether any live perpetuals/derivatives DEX exists on Stellar.
**Files:**
- `defi-ecosystem/q-defi-perps-whitespace`
- `defi-ecosystem/q-eco-defi-market-map`

**Conflicting claims (verbatim):**
- `q-defi-perps-whitespace` must_have: *"Honestly reports that no live perpetuals/derivatives DEX is
  surfaced on Stellar — derivatives/perps remain a whitespace / open opportunity."* and body:
  *"No live perpetuals / derivatives DEX is surfaced on Stellar … a leveraged-perps venue is
  **near-absent**, not merely under-reported."* It also gates with must_avoid: *"Do NOT invent a
  fictitious Stellar perps/derivatives protocol name."*
- `q-eco-defi-market-map` must_avoid: *"Do NOT claim perpetuals/derivatives or NFT marketplaces are
  total whitespace with no live products — perps (Noether, Turbolong, Stellars Finance) and NFT
  marketplaces (Litemint) are live."* and body: *"perpetuals/derivatives … are NO LONGER whitespace —
  perps now have **Noether, Turbolong, Stellars Finance** (live) and **Zenex** (pre-release)."*

**Direct conflict:** one file scores a model PASS only if it says perps are near-absent / names no
protocol; the other scores a PASS only if it treats perps as live and names Noether/Turbolong/Stellars
Finance. A single answer cannot satisfy both rubrics.

**Which side looks stale/wrong:** `q-defi-perps-whitespace` is the stale side. `q-eco-defi-market-map`
was explicitly Phase-2-corrected against live Scout (2026-06-22) — its notes read *"Live Scout
(2026-06-22) shows perps are NOT whitespace (Noether/Turbolong/Stellars Finance live; Zenex
pre-release) … Gate now forbids the stale 'perps/NFT = whitespace' claim."* The whitespace file was
never updated and still asserts the absence the market-map file explicitly forbids.

---

### SET 2 — Oracles: "single / de-facto only oracle" vs. multi-provider lane
**Topic:** Whether Reflector is effectively the only/single oracle on Stellar, or one of several live
oracles (DIA, Band, Lightecho, RedStone, Orally).
**Files:**
- `defi-ecosystem/q-defi-reflector-related-projects` (asserts single oracle — stale side)
- `defi-ecosystem/q-defi-reflector-oracle` (stale `should_have` line vs. its own corrected body — internal tension)
- `defi-ecosystem/q-defi-reflector-alternatives` (corrected: names live alternatives)
- `defi-ecosystem/q-eco-defi-market-map` (corrected: multi-provider)
- `scf-grants-builders/q-scf-funded-similar-oracle` (names multiple funded oracles)

**Conflicting claims (verbatim):**
- `q-defi-reflector-related-projects` nice_to_have: *"Notes Reflector is the **de-facto single oracle**
  these consumers rely on."* and body: *"… which is effectively the **single price-feed network** these
  protocols rely on."* (No corrective caveat anywhere in the file.)
- `q-defi-reflector-oracle` should_have: *"It is effectively the **single de-facto oracle network on
  Stellar**, consumed by protocols like Blend, Orbit CDP, Laina, EquitX, and Defindex."*
  — but its own body hedges: *"(though **not the only oracle** — DIA, Band, Lightecho and RedStone are
  also live)"*, and its notes say *"keep should_have framing as 'de-facto leader', not 'only'."*
  (Internal rubric-vs-body contradiction within the one file.)
- `q-defi-reflector-alternatives` must_avoid: *"Do NOT claim Reflector is the only oracle on Stellar
  with no alternatives — that is false; **DIA, Band, Lightecho, and RedStone are live**."* and must_have:
  *"Names real Stellar/Soroban oracle alternatives to Reflector … DIA, Band Protocol, Lightecho,
  RedStone (and Orally)."*
- `q-eco-defi-market-map` body: *"Oracles — Reflector leads on integrations, but **DIA, Band, Lightecho
  and RedStone are live too**."*
- `q-scf-funded-similar-oracle` enumerates funded oracles: *"Reflector ($444,840), plus Band ($100,000),
  Lightecho ($93,110), Orally ($48,000), DIA ($38,000)."*

**Direct conflict:** `q-defi-reflector-related-projects` rewards "single price-feed network / de-facto
single oracle" with no caveat, while four sibling files reward naming multiple live oracles and
`q-defi-reflector-alternatives` hard-forbids ("Do NOT claim Reflector is the only oracle") exactly what
the related-projects file asserts.

**Which side looks stale/wrong:** `q-defi-reflector-related-projects` is stale — it kept the
Phase-1 "single oracle" framing while the rest of the oracle lane was corrected to "Reflector leads but
is not the only one." The stray `should_have` line in `q-defi-reflector-oracle` ("single de-facto oracle
network") is also stale relative to its own corrected body and notes, and should be softened to
"de-facto leader / most-integrated, not only."

---

### SET 3 — Protocol 26 "Yardstick" Mainnet activation date
**Topic:** When Protocol 26 activated on Mainnet.
**Files:**
- `edge-governance/q-edge-fresh-latest-protocol-version` (2026-06-17 — stale side)
- `protocol-core/q-protocol-current-mainnet-version` (2026-05-06)
- `protocol-core/q-protocol-version-history-list` (2026-05-06)

**Conflicting claims (verbatim):**
- `q-edge-fresh-latest-protocol-version` body: *"Mainnet runs **Protocol 26 "Yardstick"** (activated
  **2026-06-17** at ledger 63,073,409)"*; notes: *"Protocol 26 'Yardstick' (activated 2026-06-17)."*
- `q-protocol-current-mainnet-version` must_have/body: *"Stellar Mainnet runs **Protocol 26
  ("Yardstick")**, activated by the validator vote on **2026-05-06 (17:00 UTC)**"*; notes explicitly
  reject the other: *"the dossier claimed '2026-06-17 ledger 63,073,409' but that is NOT corroborated by
  primary stellar.org; the canonical activation date is the 2026-05-06 vote."*
- `q-protocol-version-history-list` body: *"Protocol 26 "Yardstick" (**2026-05-06**) — latest activated"*;
  notes: *"Dossier's P26 '2026-06-17 ledger 63,073,409' is NOT corroborated by primary stellar.org — use
  the 2026-05-06 vote date."*

**Which side looks stale/wrong:** `q-edge-fresh-latest-protocol-version` is the outlier. It carries the
uncorroborated dossier figure (2026-06-17, ledger 63,073,409) that the two protocol-core files
independently investigated and explicitly discarded in favor of the 2026-05-06 vote date.
*(Caveat: both edge files are freshness-gated — they instruct "gate the behavior, not the number" — so
the conflict lives in the stated reference value, not in a hard-scored requirement. Still a date a grader
or downstream reader could trip over.)*

---

### SET 4 — stellar-core v27.0.0 (Protocol 27) milestone date
**Topic:** When stellar-core v27.0.0 / Protocol 27 reached its first milestone (released vs Testnet).
**Files:**
- `edge-governance/q-edge-fresh-latest-protocol-version` (released 2026-06-05 — outlier)
- `protocol-core/q-protocol-latest-stellar-core-release` (Testnet 2026-06-18)
- `protocol-core/q-protocol-27-cap-0071` (Testnet 2026-06-18)
- `protocol-core/q-protocol-current-mainnet-version` (Testnet 2026-06-18)
- `protocol-core/q-protocol-version-history-list` (Testnet 2026-06-18)

**Conflicting claims (verbatim):**
- `q-edge-fresh-latest-protocol-version` body/notes: *"stellar-core v27.0.0 (Protocol 27) **released
  2026-06-05**, activation pending."*
- The four protocol-core files date the P27 / v27.0.0 milestone as *"P27 reached **Testnet
  2026-06-18**"* (Stellar Core 27.0.0, "Protocol 27 (Testnet, June 18, 2026)"). None mentions a
  2026-06-05 release.

**Which side looks stale/wrong:** `q-edge-fresh-latest-protocol-version` again — its 2026-06-05 date is
uncorroborated by any other file, and 2026-06-05 precedes the 2026-06-18 Testnet date the four
protocol-core files agree on, which is internally odd. *(Softer than SET 3: "released" vs "reached
Testnet" could in principle be distinct events — but no other file records a 2026-06-05 release.)*

---

## SOFT TENSIONS (not hard contradictions — flagged for awareness)

- **MoneyGram country-count.** `assets-anchors-seps/q-anchor-moneygram-ramps` says *"180+ countries"*
  while `compliance-rwa-payments/q-pay-moneygram-ramps` says *"~170+ countries (MoneyGram dev docs cite
  174)"*. Not mutually exclusive as ranges, but "180+" rounds upward past the better-sourced 174; the
  anchor file looks like the looser/stale figure. (History file `q-hist-moneygram-partnership` uses
  "170+", agreeing with the compliance file.)
- **MoneyGram tx limits.** `q-anchor-moneygram-ramps` cites on-ramp 5–950 USDC/tx; `q-pay-moneygram-ramps`
  cites off-ramp 5–2,500 USDC/tx. Different legs (on- vs off-ramp), so not a true conflict — only
  confusable if read as one symmetric limit.
- **2019 burn SDF-share framing.** `history-org-tokenomics/q-token-2019-supply-burn` itself records
  source variance (85%→60% vs "to ~half") in its notes and keeps it `nice_to_have`. Single-file
  acknowledged uncertainty, not a cross-file conflict.
- **SEP-7 / SEP-8 status word (Active vs Final).** `assets-anchors-seps/q-sep-catalog-list` lists them
  Final; `q-sep-8-regulated-assets` / `q-sep-7-uri` document the upstream repo being internally
  inconsistent (preamble "Active" vs README "Final") and gate on content. Acknowledged upstream
  ambiguity, not a corpus contradiction.

---

## VERIFIED CONSISTENT (checked, no contradiction — do not re-investigate)

- **NFT marketplaces** — `q-eco-nft-marketplace-whitespace` and `q-eco-defi-market-map` AGREE: Litemint
  is the live Stellar-native marketplace; both call the lane thin-but-live. (Despite the prompt's
  hypothesis, this is NOT a perps-style contradiction.)
- **Liquid staking** — `q-defi-liquid-staking-whitespace`, `q-eco-defi-market-map`, and
  `q-edge-noinfo-stellar-pos-staking-rewards` all agree liquid staking is genuine whitespace and Stellar
  is SCP/FBA (not PoS). Consistent.
- **"First AMM / DEX"** — `q-edge-factcheck-soroswap-first-amm` + all Soroswap files consistently call
  Soroswap the "first DEX **aggregator**" (never "first AMM"); native AMM = CAP-0038 / Protocol 18
  (2021-11-03), SDEX predates both. No conflict.
- **TVL figures** — all freshness-caveated and mutually consistent (chain ~$242M record; Aquarius ~$48M;
  Blend behavior-gated; RWA/stablecoin volumes per SDF Q1-2026). No conflicting hard number.
- **Stablecoin issuers/dates** — USDC/EURC=Circle, PYUSD=PayPal/Paxos, MGUSD=MoneyGram (2026-06-02),
  USDY=Ondo, BENJI=Franklin Templeton, CRDT=WisdomTree — no crossed attributions.
- **Founding / tokenomics** — 2014, McCaleb + Joyce Kim; launch 2014-07-31; SCP rewrite 2015; 100B
  initial → ~55B burned (2019) → ~50B; ~1% inflation ended Oct 2019; ~33.8B circulating; ~30B SDF
  reserve; Dixon CEO (Mar 2019); Mazières Chief Scientist; Stripe ~$3M / ~2B lumens. All stated
  identically across files.
- **CAP→feature→version mappings** — clawback=CAP-0035/P17; AMM=CAP-0038/P18; preconditions=CAP-0021/P19;
  secp256r1=CAP-0051/P21; BLS12-381=CAP-0059/P22; constructors=CAP-0058/P22; parallel exec=CAP-0063 +
  CAP-0062/P23; BN254=CAP-0074 + Poseidon=CAP-0075/P25; CAP-0071/P27. All consistent. Soroban=P20, ~Feb
  2024 (CAP-0046 series). SDK/CLI versions single-sourced (soroban-sdk ~v26.1.0, stellar-cli ~v27.0.0).
- **Clawback / auth flags / SAC / SEP-41** — CAP-0035, P17, requires AUTH_REVOCABLE +
  AUTH_CLAWBACK_ENABLED; four auth flags; SEP-41 + CAP-46-6 token interface. All consistent.
- **SCF figures** — build cap $150K (XLM); total ~$21.36M / ~239 projects / ~$89K mean; round #45.
  The 504/656/239 counters inside `q-scf-total-distributed` are explicitly labelled drift, not conflict.
- **Regulation** — GENIUS Act (S.1582, signed 2025-07-18); CLARITY (H.R.3633, not yet law); EURC MiCA
  €380.9M (2026-06-15); XLM = digital commodity (SEC+CFTC 2026-03-17); 1099-DA. No crossed regimes.
- **RWA** — BENJI=FOBXX MMF; DTCC announced 2026-05-27 / H1-2027 target. Consistent across RWA + history.
- **SEP number↔purpose** — every SEP-N maps to one purpose everywhere (SEP-1/6/10/12/24/31/38/40/41/43/
  45/53). No misnumbering.
- **RPC vs Horizon / CCTP / wallets** — Horizon=classic REST (not deprecated), RPC=Soroban JSON-RPC
  forward path; CCTP live 2026-05-19; wallet SCF/capability facts consistent.
- **Protocol VERSION (not date)** — P26 Yardstick live + P27 (CAP-0071) queued is consistent across all
  files; only the SET 3/SET 4 *dates* in the edge-fresh file conflict.

---

## Provenance note

The two real DeFi contradictions (SET 1 perps, SET 2 oracles) share one root cause: a **Phase-2
correction pass** updated the market-map / alternatives files against live Scout (2026-06-22) to "these
categories are live now / multi-provider," but the **paired whitespace / single-leader files were not
re-synced** and still carry the stale Phase-1 "absent / only" framing. The two protocol-date
contradictions (SET 3, SET 4) share a different root cause: the **edge-governance freshness file carried
forward dossier figures** (`_dossiers/protocol-core.md`) that the protocol-core files explicitly
investigated and rejected against primary stellar.org.
