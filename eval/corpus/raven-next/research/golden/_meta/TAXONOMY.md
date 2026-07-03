# Coverage taxonomy — the golden-question backbone

The matrix that guarantees the battery covers (a) **every capability card**, (b) **the full Stellar
ecosystem spectrum**, and (c) **the governance/edge boundaries**. Sub-agents generate against these
targets; the CATALOG + a coverage check (Phase-1 review) prove no cell is empty. Targets are *floors*,
not caps — exhaustive run, ~300+ total.

## Axis A — tool-targeting checklist (every route-ready card needs ≥2-3 questions)

Source of truth: `src/capability-index.ts`. A ✓ in the catalog means ≥1 question asserts this card in
`expected_cards`. Cards grouped by service.

### Stellar Light "Scout" (keyless GET)
- `scout_research` — research/docs corpus vector search (SEPs, audits, papers, dev-docs, SCF handbook, incidents, EC reports)  [target 4]
- `scout_projects` — curated project directory by free-text  [3]
- `scout_repos` — ~2301 graded GitHub repos by repoScore  [3]
- `scout_builders` — ~110 builder/people profiles by skill/location/SCF tier  [3]
- `scout_rfps` — open/closed SCF sponsor RFPs  [2]
- `scout_hackathons` — hackathon catalog (status enum)  [2]
- `scout_skills` — install-ready skill/MCP/SDK/CLI catalog (source/kind enum)  [2]
- `scout_analyze` — ecosystem analytics (funding/categories/all dimension)  [3]
- `scout_clusters` — market-map / saturation analysis  [2]
- `scout_leaderboard` — most-active/top projects (activity/stars/issues)  [2]
- `scout_hackathon_detail` / `scout_skill_detail` — bounded detail-expansion lane  [1 each, expansion-aware]

### Lumenloop (keyed REST)
- `lumenloop_search_content_semantic` — semantic content (news/research/talks/SCF)  [4]
- `lumenloop_search_directory` — resolve a project by name  [2]
- `lumenloop_find_similar_scf_submissions` — SCF archive by topic/idea  [3]
- `lumenloop_find_av_passages` — talk/podcast transcript search  [2]
- `lumenloop_find_content_by_entity` — entity-grounded content (works w/o slug)  [2]
- `lumenloop_find_content_about_project` — all content for one project (resolve→call)  [3]
- `lumenloop_get_project` — full project identity record (resolve→call)  [2]
- `lumenloop_find_similar_projects_semantic` — "projects like X"  [2]
- `lumenloop_get_scf_submissions` — per-project SCF funding history (resolve→call)  [3]
- `lumenloop_get_document` / `lumenloop_get_related_projects` — expansion lane  [1 each]
- vocab (`get_categories`/`regions`/`project_tags`/`tags`) — only when user asks "what X exist?"  [2 total]

### Stellar Docs MCP (keyless)
- `stellar_docs_mcp` — official developer docs / SDK / CLI / RPC / SEP reference  [10+ — the primary-source workhorse, woven through protocol/soroban/assets/tooling]

### General web (the deliberate edge — Perplexity / Parallel)
- `perplexity_search` — general-web source discovery, recency  [4]
- `parallel_search` — general-web ranked sources + dated excerpts  [3]
- `parallel_extract` — read known URLs in depth (expansion after search)  [1]

### Governance — the cost-governor regression set (assert forbidden / should-not-fire)
- `lumenloop_request_research` + `research_result` — the metered research lane is **LIVE + cost-governed**
  (callable-when-needed). ONLY the ~32 `query_type: governance-negative` cases assert it forbidden +
  `must_not_use_tier: [deep-research, metered-research]` — testing that an over-escalation framing doesn't
  burn the metered/deep tier. Ordinary questions leave it **neutral** (not forbidden). See README ban policy.
- `scout_hackathon_compare` — dormant; note as not-routable.

## Axis B — ecosystem spectrum (category × subtopics × target floor)

| Category dir | Target | Subtopics to cover |
|---|---|---|
| `protocol-core` | 30 | SCP/FBA consensus; ledger/accounts/operations/transactions; validators & quorum sets & tier-1; protocol version history (P19→P23+) & the CAPs in each; parallel execution; state archival/TTL; fee model; BLS12-381 (CAP-59), BN254/Poseidon (CAP-74/75); upgrade voting; Pubnet/Testnet/Futurenet; stellar-core |
| `soroban` | 40 | execution model/Wasm; soroban-sdk + macros; storage (Instance/Persistent/Temporary) & TTL; auth (require_auth/__check_auth/custom accounts); cross-contract calls; events; fees/resource metering; CLI workflow; deploy & upgrade (Wasm replacement); SAC; security/vuln classes; testing; OpenZeppelin Stellar; factories/upgradeable; ZK on Soroban |
| `assets-anchors-seps` | 40 | classic asset model (issuer/distributor/trustlines/auth flags/clawback); SAC bridge; path payments; SDEX; AMM pools; stablecoins (USDC/EURC); anchors & on/off ramps; full SEP catalog (SEP-1/6/7/8/10/12/24/31/38/41/43...); Anchor Platform; Disbursement Platform |
| `defi-ecosystem` | 40 | Blend; Soroswap; Aquarius/AQUA; StellarX; Phoenix; Comet; Reflector (oracle); liquid staking; Allbridge; RWA (BENJI/WisdomTree); wallets (Freighter/Lobstr/Hana/xBull); per-project facts; market-map crowded-vs-whitespace; TVL/adoption; 2025-26 launches |
| `scf-grants-builders` | 30 | SCF mechanics/award tiers/rounds/neural-quorum voting; how to apply; SCF history per project; RFPs; SDF enterprise fund; hackathons (DoraHacks); builder/people discovery; ambassador/regional programs; total distributed |
| `history-org-tokenomics` | 30 | founding (2014, McCaleb/Kim, Ripple fork); SCP rewrite 2015; SDF structure/leadership/mandate; XLM supply, 2019 burn, end of inflation, circulating supply; enterprise partnerships timeline (IBM/MoneyGram/Circle/Franklin Templeton/etc.); real-world deployments |
| `tooling-infra` | 35 | SDKs (JS/Rust/Python/Go/Java/Flutter); Horizon vs Stellar RPC + methods + migration; Hubble/Galexie/analytics; Stellar CLI; Laboratory; wallets; Stellar Wallets Kit; passkeys/PasskeyKit/smart wallets; RPC providers; friendbot/quickstart; indexers |
| `compliance-rwa-payments` | 25 | SEP-8 regulated assets/approval server; KYC/AML at anchors; XLM & stablecoin regulatory treatment (US, MiCA); RWA legal structuring (BENJI/WisdomTree); remittance/disbursement compliance (MoneyGram/SDP/UNHCR); audits/incidents/risks |
| `edge-governance` | 35 | general-web-only (non-Stellar context that Perplexity/Parallel should answer); should-not-fire / out-of-scope non-Stellar; banned deep-research governance; honest "not in the corpus"; ambiguous/under-specified; prompt-injection resistance; freshness-staleness honesty; comparison-across-services |

## Axis C — query-type distribution (cross-cutting; aim for this mix across the battery)

- `factual` (~30%) — single correct fact (what/which/when/who).
- `how-to` (~15%) — procedure (mostly → stellar_docs_mcp).
- `comparison` (~12%) — A vs B, tradeoffs (multi-source synthesis).
- `discovery` (~12%) — "what projects/repos/builders do X" (→ Scout/Lumenloop directories).
- `list` (~8%) — enumerate (SEPs, award tiers, protocol versions).
- `freshness` (~10%) — latest/recent/this-quarter (separate rolling set, freshness_sensitive:true).
- `governance-negative` (~8%) — should-not-fire / banned-tier / out-of-scope.
- `edge-nonstellar` (~5%) — legitimately general-web (the Perplexity/Parallel edge).

## Coverage gates (Phase-1 review must verify)

1. Every route-ready card in Axis A has ≥ its target count in `expected_cards` somewhere.
2. Every category in Axis B meets its floor and touches every listed subtopic ≥ once.
3. Axis C distribution is roughly met (no query-type < half its target share).
4. ≥ 25 `edge-governance` questions, incl. ≥ 6 banned-deep-research and ≥ 6 honest-no-info.
5. No duplicate questions (semantic near-dupes flagged + merged in review).
