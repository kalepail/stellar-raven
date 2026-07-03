# Capability-card cheat sheet (exact ids)

The ONLY card ids valid in `expected_cards` / `acceptable_cards` / `forbidden_cards`. Source of truth:
`src/capability-index.ts`. Match each question to the card whose real capability covers it.

## Stellar Docs MCP (keyless) — the primary-source workhorse
- `stellar_docs_mcp` — official developer docs / SDK / CLI / RPC / SEP reference (canonical
  developers.stellar.org URLs). Best for how-to + protocol/spec/standards lookups. Keyword search,
  not semantic; returns ranked snippets, not an answer.

## Stellar Light "Scout" (keyless GET)
- `scout_research` — vector search over 11 Stellar corpora (SEPs, audits, papers, dev-docs, SCF
  handbook, incidents, EC reports). Primary Stellar knowledge lookups.
- `scout_projects` — curated project directory by free-text ("who is building what").
- `scout_repos` — ~2301 graded Stellar/Soroban GitHub repos, ranked by repoScore. Code-shaped queries.
- `scout_builders` — ~110 builder/people profiles by skill / location / SCF tier.
- `scout_rfps` — open/closed SCF sponsor RFPs (funding-opportunity briefs).
- `scout_hackathons` — hackathon catalog (status: active|upcoming|completed). `q` ignored.
- `scout_skills` — install-ready skill/MCP/SDK/CLI catalog (source/kind filters). `q` ignored.
- `scout_analyze` — ecosystem analytics: SCF funding totals, category distribution (dimension enum).
- `scout_clusters` — market-map / saturation (where the ecosystem is crowded vs whitespace).
- `scout_leaderboard` — most-active / top projects (activity | stars | issues).
- `scout_hackathon_detail` / `scout_skill_detail` — single-item detail (bounded expansion lane; needs a slug).

## Lumenloop (keyed REST)
- `lumenloop_search_content_semantic` — semantic search across curated Stellar corpus (news, research,
  talks/AV, SCF). "What has been said about X."
- `lumenloop_search_directory` — resolve a project by name → directory entry.
- `lumenloop_find_similar_scf_submissions` — SCF archive by topic/idea ("has anything like X been funded").
- `lumenloop_find_av_passages` — semantic search over talk/podcast transcripts.
- `lumenloop_find_content_by_entity` — content mentioning a named entity (works without a directory slug).
- `lumenloop_find_content_about_project` — ALL content for one named project (resolve→call).
- `lumenloop_get_project` — full identity record for one project (links/category/tags/SCF/tokens/audits).
- `lumenloop_find_similar_projects_semantic` — "projects like X" (competitive landscape).
- `lumenloop_get_scf_submissions` — one project's SCF funding history (rounds/amounts/award types).
- `lumenloop_get_document` / `lumenloop_get_related_projects` — id-gated detail / reverse lookup (expansion).
- `lumenloop_get_categories` / `lumenloop_get_regions` / `lumenloop_get_project_tags_vocabulary` /
  `lumenloop_get_tags_vocabulary` — controlled vocab (only when the user asks "what categories/regions/tags exist").

## General web — the deliberate EDGE (non-Stellar-specific)
- `perplexity_search` — general open-web source/URL discovery with a native recency window
  (`search_recency_filter`, hour…year, auto-applied on freshness intent). The right card for legitimately
  general-web context (a partner company's background, macro/regulatory context) AND when you want a tighter
  native freshness window (its date metadata is still imperfect, so not a mathematical guarantee).
- `parallel_search` — general web ranked sources + dated markdown excerpts (`publish_date`). ALSO recency-aware
  via `advanced_settings.source_policy.after_date` (auto-applied on freshness intent), but it is a
  "no-known-stale" filter — undated pages still pass — so a SOFTER freshness guarantee than Perplexity's window.
  Co-equal with `perplexity_search` for general-web freshness (hence both belong in `acceptable_cards`); it is
  also the first hop of a search→extract close read. NB both services support recency — the historical
  "Perplexity is the only recency-aware web card" framing was WRONG (live-verified 2026-06-22).
- `parallel_extract` — read known URLs in depth (expansion after a search).

## Research lane — LIVE + cost-governed (callable-when-needed, NOT blanket-forbidden)
- `lumenloop_request_research` → `lumenloop_research_result` — the LumenLoop metered research lane is now
  **LIVE** (`runtimeReady:true`), pinned to the cheap **`answer`** mode (≈ $0.02). It is **router-isolated**
  (`async-research` — never router-selected), fires only as a **post-gather escalation** when the free
  corpus search returns zero citable artifacts, and is **daily-budget-gated + dedup'd + deadline-bounded +
  redacted**, with a `RAVEN_RESEARCH_LANE=off` kill-switch (ADR-0018). A legitimate cheap governed tool —
  **do NOT blanket-forbid it**; leave it OFF `forbidden_cards` on ordinary questions.
- `scout_hackathon_compare` — dormant (not routable today).

## When to forbid (ban policy — see README "Controlled vocabularies & conventions")
> A `forbidden_card` / `must_not_use_tier` means a call would be **genuinely wrong for THIS question by
> content / cost / appropriateness** — not "not the best tool", not "a few cents", not "unwired". The
> cheap tools (`perplexity_search` ≈ $0.005, `parallel_search`/`parallel_extract`, the LumenLoop `answer`
> lane ≈ $0.02) are **callable-when-relevant**. Only the **governance-negative** over-escalation cases
> assert `forbidden_cards: [lumenloop_request_research, lumenloop_research_result]` +
> `must_not_use_tier: [deep-research, metered-research]`. Tiers: `deep-research` = uncarded Parallel/
> Perplexity deep modes; `metered-research` = the EXPENSIVE LumenLoop `sources`/`structured`/`report`
> modes (NOT the cheap `answer` lane). The truly expensive tiers are gated at the **system** level.
