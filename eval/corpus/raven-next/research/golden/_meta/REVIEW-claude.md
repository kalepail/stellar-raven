# REVIEW — Phase-1 coverage / dedup / schema (Claude reviewer)

Scope: COVERAGE (Axis A/B/C vs TAXONOMY.md), DEDUP, SCHEMA CONSISTENCY, and CATALOG build.
Factual accuracy + adversarial card-targeting are the Codex reviewer's lane and are out of scope here.

Corpus: **358 question files** across 9 categories. Parsed all frontmatter (valid YAML in 358/358).
Card vocabulary checked against `src/capability-index.ts` + `_meta/CARDS.md`.

Tags: **BLOCKER** = a stated coverage gate fails / breaks Phase 2; **MAJOR** = floor missed or real
dup to cut; **MINOR** = polish.

---

## Headline

Schema discipline is excellent (no missing fields, no bad weights, no id/filename drift, no invalid
card ids, all YAML parses). Category floors all pass. The real gaps are in **Axis A card coverage**:
several route-ready cards sit at **zero `expected_cards`** — most importantly `parallel_search`, which
the taxonomy floors at 3 but which is used **only as acceptable/forbidden, never as the expected
route**. Query-type mix is skewed heavily toward `factual` (44% vs 30% target) at the expense of
`how-to` and `list`. Dedup surfaced ~5 true near-duplicates worth merging out of ~19 flagged pairs.

---

## 1. COVERAGE

### Axis A — card-targeting (expected_cards count vs TAXONOMY floor)

Full table is in `_meta/CATALOG.md`. Cards **below floor**:

| card | expected | floor | also in acceptable_cards | severity |
|---|---:|---:|---:|---|
| `parallel_search` | **0** | 3 | 61 | **BLOCKER** |
| `scout_hackathon_detail` | **0** | 1 | 0 | MAJOR |
| `scout_skill_detail` | **0** | 1 | 0 | MAJOR |
| `lumenloop_get_document` | **0** | 1 | 0 | MAJOR |
| vocab cards (`get_categories`/`get_regions`/`get_project_tags_vocabulary`/`get_tags_vocabulary`) | **0** combined | 2 | 0 | MAJOR |
| `scout_leaderboard` | 1 | 2 | 2 | MINOR |
| `lumenloop_find_av_passages` | 1 | 2 | 2 | MINOR |

**BLOCKER — `parallel_search` is never an expected route.** It appears 61× as `acceptable_cards` and
203× as `forbidden_cards`, but **0× as `expected_cards`**. TAXONOMY Axis A floors it at 3 ("general-web
ranked sources + dated excerpts"). Right now no golden question asserts that a query *should* route to
Parallel as its primary surface, so Phase 2 can never prove the Parallel-search route fires. Fix: pick
~3 of the existing freshness / general-web items where Parallel (ranked dated sources) is the better
primary than Perplexity and promote `parallel_search` into `expected_cards`. Good candidates already
list it as acceptable — e.g. `q-protocol-latest-stellar-core-release`,
`q-hist-ibm-world-wire-status`, a dated-RWA-value item. (Several `eco-*` freshness items would also fit.)

**MAJOR — four expansion/vocab lanes have zero coverage.** `scout_hackathon_detail`,
`scout_skill_detail`, `lumenloop_get_document`, and the four lumenloop vocab cards
(`get_categories`/`get_regions`/`get_project_tags_vocabulary`/`get_tags_vocabulary`, floor 2 combined)
are never referenced in any field. The taxonomy marks these as "expansion-aware" / "only when the user
asks what X exist," so they need *purpose-built* questions, not promotions:
  - a "what hackathon categories/tracks does <hackathon> have" detail-expansion (→ `scout_hackathon_detail`),
  - a "show me the details/install for <skill>" (→ `scout_skill_detail`),
  - 2 vocab questions: "what project **categories** does the directory track?" / "what **regions** /
    tags exist?" (→ the lumenloop vocab cards).
  `lumenloop_get_document` (id-gated detail) is an expansion lane — at minimum acceptable on one
  content-lookup item.

**MINOR — `scout_leaderboard` (1/2) and `lumenloop_find_av_passages` (1/2)** each need one more
`expected_cards` assertion. Both already appear in 2 `acceptable_cards` items; promote one each
(e.g. `q-eco-dex-saturation` could expect `scout_leaderboard`; `q-builder-content-by-person` or
`q-scf-v7-changes` could expect `lumenloop_find_av_passages`).

Cards comfortably **over** floor and fine: `stellar_docs_mcp` (167), `scout_research` (69),
`perplexity_search` (45), `lumenloop_search_content_semantic` (15), `lumenloop_get_project` (13),
`scout_projects` (13). No card carries an **invalid id**, and no `forbidden_cards`/`acceptable_cards`
reference a non-existent card. `scout_hackathon_compare` (dormant) is correctly never expected.

### Axis B — category floors + subtopics

All nine categories **meet or exceed** their file floor:

| category | count | floor | category | count | floor |
|---|---:|---:|---|---:|---:|
| protocol-core | 36 | 30 | history-org-tokenomics | 36 | 30 |
| soroban | 44 | 40 | tooling-infra | 39 | 35 |
| assets-anchors-seps | 43 | 40 | compliance-rwa-payments | 31 | 25 |
| defi-ecosystem | 54 | 40 | edge-governance | 36 | 35 |
| scf-grants-builders | 39 | 30 | **TOTAL** | **358** | **305** |

Subtopic spot-check (via `subcategory` field): every TAXONOMY subtopic list is touched ≥1. Notable
depth — `tooling-infra` spans 35 distinct subcategories (every SDK language, RPC/Horizon/migration,
Hubble/Galexie, passkeys, wallets-kit). No empty subtopic cells found. **PASS.**

### Axis C — query-type distribution (n=358)

| query_type | count | actual | target | verdict |
|---|---:|---:|---:|---|
| factual | 158 | 44.1% | 30% | **MAJOR — far over (crowds out others)** |
| how-to | 38 | 10.6% | 15% | below target (above half) |
| comparison | 34 | 9.5% | 12% | slightly under |
| discovery | 41 | 11.5% | 12% | OK |
| list | 15 | 4.2% | 8% | **MAJOR — at/below half-target (4%)** |
| freshness | 31 | 8.7% | 10% | OK |
| governance-negative | 32 | 8.9% | 8% | OK |
| edge-nonstellar | 9 | 2.5% | 5% | **at half-target floor; thin** |

**MAJOR — `factual` is 44% vs a 30% target**, absorbing share that should be `how-to` (15% target,
actual 10.6%) and `list` (8% target, actual 4.2%). `list` is the worst: 15 files is right at the
half-target gate floor. Gate 3 ("no query-type < half its target share") is technically **met** for all
types (`list` 4.2% ≥ 4% half; `edge-nonstellar` 2.5% ≥ 2.5% half) but `list` and `edge-nonstellar` are
on the line. Fix before Phase 2: re-classify or add ~10 `list` items (SEP catalog enumeration, award
tiers, protocol-version list, validator tiers) and ~6 `how-to` items; this also naturally pulls
`factual` back toward 30%. Easiest path — several current `factual` items that ask "which SEPs/CAPs…"
or "list the flags…" are really `list` and are mistagged (see dedup note on `q-asset-auth-flags-list`).

### Coverage gate 4 (edge-governance composition)

- `should_fire: false` cases: **10** — `q-edge-ambig-*` (3), `q-edge-oos-*` (6), `q-edge-inject-exfiltrate-secrets` (1). Good spread of underspecified + out-of-scope + injection-refusal.
- `governance-negative` query_type: **32**; `weight_profile: strict`: **32** (cleanly aligned).
- Banned deep-research: all 358 files carry `lumenloop_request_research` in `forbidden_cards` and
  `must_not_use_tier` includes `deep-research` everywhere — so the "banned tier did not run" assertion
  is universal (≥6 requirement satisfied many times over).
- Honest-no-info: `subcategory: honest-no-info` present in `edge-governance` (the
  "plausible-but-nonexistent project / no-such-SEP" items). **Gate 4 PASS.**

---

## 2. DEDUP

Token-overlap (Jaccard ≥ 0.42 on content words) flagged **19 candidate pairs**. After inspecting
`expected_cards` + `query_type` + `subcategory`, most are **intentional cross-route coverage** (same
topic, deliberately different primary card to test routing) and should be **kept**. The genuine
near-duplicates to **merge/cut** (same intent AND same `expected_cards` AND same `query_type`):

**MAJOR — true near-dups (merge/cut one):**

1. `q-protocol-horizon-vs-rpc` ↔ `q-infra-horizon-vs-rpc` (0.80) — both "Horizon vs Stellar RPC for a
   new app", both `expected:[stellar_docs_mcp] acc:[scout_research] comparison`. **Cut one** (keep the
   `infra` one, it's the natural home; or differentiate the protocol one toward "data structures /
   ingestion" so it's not a vs-question).
2. `q-protocol-futurenet-vs-testnet` ↔ `q-infra-testnet-vs-futurenet` (0.75) — identical intent and
   cards. **Cut one** (keep `infra`).
3. `q-asset-auth-flags-list` ↔ `q-comp-auth-flags-overview` (0.62) — "list the issuer auth flags",
   same `expected:[stellar_docs_mcp]`, both effectively a list. **Keep both only if** the compliance
   one is re-angled to the regulated/SEP-8 framing it claims (`auth-flags-clawback`) — otherwise
   redundant. Also tag both `list` (one is `list`, the other should be too).
4. `q-soroban-simulate-resource-fee` ↔ `q-infra-simulate-transaction-howto` (0.58) — both "simulate to
   get footprint+fees before submit", same `expected:[stellar_docs_mcp] how-to`. **Differentiate**: make
   the soroban one about *resource metering / budget* and the infra one about the *RPC `simulateTransaction`
   method shape*, or cut one.
5. `q-eco-franklin-templeton-background` ↔ `q-edge-web-franklin-templeton-background` (0.56) — both
   "background on Franklin Templeton the company", identical `expected:[perplexity_search]
   edge-nonstellar`. **Cut one** (keep the `edge-governance` one — it's the canonical general-web edge
   test; the `eco` duplicate is redundant).
6. `q-eco-scf-funding-totals` ↔ `q-scf-total-distributed` (0.43) — both "how much has SCF distributed",
   same `expected:[scout_analyze] factual`. **Cut/merge one** (keep the `scf-grants-builders` one).

**KEEP — looks-similar but intentionally distinct route/angle (no action):**

- BENJI trio `q-defi-benji-franklin-templeton` / `q-hist-franklin-templeton-benji` /
  `q-rwa-benji-structure` — three *different* expected routes (`lumenloop_find_content_by_entity` /
  `scout_research` / `perplexity_search`) and angles (token / partnership / legal structure). Valid.
- UNHCR `q-hist-unhcr-stellar-aid-assist` (scout) ↔ `q-pay-unhcr-aid-assist` (perplexity) — different
  primary route + different category lens. Valid (borderline; ensure rubrics diverge in Phase 2).
- SCF-history trio `q-defi-soroswap-scf` / `q-scf-history-blend` / `q-scf-history-aquarius` — same card
  (`lumenloop_get_scf_submissions`) but **different projects on purpose** to hit that card's floor of 3.
  This is the *intended* mechanism, not a dup. Keep all three.
- `q-soroban-sac-what-is` / `q-asset-sac-cap-sep` / `q-sep-41-token-interface` — SAC-vs-SEP-41 cluster;
  distinct facts (what SAC is / which CAP+SEP / what SEP-41 is). Keep.
- `q-hist-ibm-world-wire` (factual) ↔ `q-hist-ibm-world-wire-status` (freshness "still operating?") —
  deliberate factual-vs-freshness pair. Keep.
- Anchor/SEP pairs (`q-anchor-platform-what`/`q-anchor-required-seps`,
  `q-asset-wallet-sdk-seps`/`q-sep-10-auth`) — distinct facts. Keep.

**Net:** ~**6 merge/cut actions**; the rest are intentional. Removing them drops the corpus to ~352,
still well above all floors.

---

## 3. SCHEMA CONSISTENCY

Mechanically very clean:

- **Required fields:** all of `id, q, category, axes, query_type, difficulty, expected_cards,
  should_fire, must_have, must_avoid, must_cite, must_not_use_tier, status` present in **358/358**. No
  missing-field violations.
- **YAML:** parses cleanly in **358/358** (pyyaml `safe_load`).
- **Weights:** every `weight: N` is in **1–5** (0 out-of-range).
- **id integrity:** `id == filename` in all 358; **no duplicate ids**; **no `category`-field vs dir
  mismatch**.
- **Card ids:** no invalid card id appears in any `expected_cards` / `acceptable_cards` /
  `forbidden_cards` field.
- **`should_fire`:** 348 true / 10 false (parses correctly once inline `#` comments are stripped).
- **`pass_threshold`:** clustered 0.65–0.9, all sane; `weight_profile: strict` (32) aligns 1:1 with
  `governance-negative`.

**MINOR — `must_not_use_tier` vocab split is under-applied.** Split is 296 `[deep-research]` vs 62
`[deep-research, metered-research]`. Only **8 of 32 `governance-negative`** cases carry the
`metered-research` tier. The lumenloop metered lane (`lumenloop_request_research`/`research_result`) is
the *specific* over-escalation trap for governance cases; any governance-negative whose trap is "should
it have paid for metered research" should list `metered-research`, not just `deep-research`. Audit the
24 governance items without it and add `metered-research` where the lumenloop-metered route is the
plausible wrong escalation. (Not a blocker — it's a tightening of the gate.)

**MINOR — inline comments on scalar values.** Many `should_fire:` / a few other scalars carry trailing
`# …` rationale comments. YAML tolerates them and they're useful, but the compile step (Phase 2 `tsx`)
must strip `#`-to-EOL on scalars or `should_fire` will serialize as the string
`"false   # underspecified…"`. Flagging so the compiler is written defensively.

---

## 4. CATALOG

Built `_meta/CATALOG.md` (generated, do-not-hand-edit): Axis-A card-coverage table, per-category +
grand totals, then a per-category table of `id | query_type | difficulty | expected_cards |
freshness_sensitive | should_fire | status`. Regenerate from the question files after any edits.

---

## Top fixes before Phase 2 (priority order)

1. **[BLOCKER] Give `parallel_search` ≥3 `expected_cards` assertions** — promote it as the primary
   route on ~3 freshness/general-web items where ranked dated sources beat Perplexity. Today the
   Parallel-search route is untestable.
2. **[MAJOR] Author the 4 zero-coverage lanes** — `scout_hackathon_detail`, `scout_skill_detail`, and
   2 lumenloop **vocab** questions (categories/regions); add `lumenloop_get_document` as acceptable on a
   content lookup. These need purpose-built questions, not promotions.
3. **[MAJOR] Rebalance Axis C** — `factual` is 44% (target 30%); `list` 4.2% and `how-to` 10.6% are
   thin. Re-tag the mistagged `list`-shaped "which SEPs/flags/versions…" items and add ~6 `how-to` +
   ~10 `list`. Lifts `list`/`edge-nonstellar` off the gate floor.
4. **[MAJOR] Cut the ~6 true near-dups** (Horizon-vs-RPC, Testnet-vs-Futurenet, FT-background,
   SCF-totals, and re-angle the auth-flags + simulate pairs). Keep all intentional cross-route clusters.
5. **[MINOR] Bump `scout_leaderboard` and `lumenloop_find_av_passages` to 2** expected each (promote
   from existing acceptable lists).
6. **[MINOR] Apply `metered-research` tier** to the governance-negative cases whose trap is the
   lumenloop metered lane (24 currently miss it).
7. **[MINOR] Make the Phase-2 compiler strip inline `#` comments** on scalar frontmatter values.
