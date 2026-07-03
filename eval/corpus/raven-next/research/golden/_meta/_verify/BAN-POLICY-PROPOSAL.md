# Proposal: relax the golden battery's tool-ban footprint (cost/appropriateness-based)

Status: ACCEPTED + APPLIED (2026-06-22; Codex review `BAN-POLICY-codex.md` ADOPT-WITH-CHANGES, user sign-off; applied via `apply-ban-policy.mjs`).
Trigger: user review — "does it make sense to ban `lumenloop_request_research` so extremely?"

## Current footprint (measured 2026-06-22, all 391 files)

| Card / field | appears in `forbidden_cards` (or tier ban) | how it's actually used |
|---|---|---|
| `lumenloop_request_research` | **391 / 391 (100%)** | never `expected`/`acceptable` anywhere — pure blanket ban |
| `lumenloop_research_result` | 148 | paired with the above |
| `parallel_search` | 216 | `expected` on 4; ~2 of the forbids are real edge cases |
| `perplexity_search` | 191 (only **2** in edge-governance) | `expected` on 44 (the legit general-web edge) |
| `must_not_use_tier` | **391 / 391** | `[deep-research]` ×303, `[deep-research, metered-research]` ×90 |

## Cost / latency grounding (from `src/capability-index.ts` + the shipped research lane)

| Tool | cost | latency | callable today? | governed how |
|---|---|---|---|---|
| `stellar_docs_mcp`, all Scout cards | free / low | fast | yes | — |
| `perplexity_search` | **$0.005/call** ($5/1k, no token charge) | fast | yes | router selects ≤5 |
| `parallel_search` | 1× `sku_search` (cheap) | fast | yes | router selects ≤5 |
| `parallel_extract` | 1× `sku_extract_excerpts`/URL, ≤5 cap | fast | yes (expansion) | URL-gated, capped |
| `lumenloop_request_research` (**answer** mode) | **≈ $0.02** | ≤ ~5-min (fits deadline) | **yes (now LIVE)** | **system governor**: post-gather-only, fires only when free search returns 0 citable artifacts, daily-budget guard (skips if headroom < $0.02), dedup-before-paying, router-isolated, `RAVEN_RESEARCH_LANE=off` kill-switch, redaction |
| Lumenloop **`sources`** mode | ~$? | **1–3 min** | **NO — system-disabled** | pinned off (blows deadline) |
| Lumenloop **`report`** mode | **~$2 (~100×)** | **3–10 min** | **NO — system-disabled** | pinned off (blows deadline/budget) |
| Parallel `createDeepResearch` (pro/ultra) | **$$$ (dollars)** | **2–10+ min** | **NO — not a card** | ADR-0013 banned; system-level |
| Perplexity `sonar-deep-research` / `reason` | token-charged, higher | **30 s+** | **NO — not a card** | not wired; system-level |

**Key finding:** the three cards we forbid on (nearly) every question are the **cheap** tiers
(all `cost_tier: low`), and the genuinely **expensive** deep-research is **not even a callable card** —
it's already gated at the system layer (budget governor + deadline + router-isolation + answer-mode
pin). So the eval blanket-forbids the cheap/governed tools while the expensive risk is handled
elsewhere. That's the inverted, systemic over-ban the user flagged.

## Principle (proposed)

A `forbidden_card` / `must_not_use_tier` should mean **"firing this here would be wrong for THIS
question — by content, cost, or appropriateness"**, NOT "it's not the best tool", NOT "it costs a few
cents", and NOT "it isn't wired" (it is now). Three tiers:

1. **Cheap, callable-when-relevant — NEVER blanket-forbidden.** All Scout/Lumenloop lookup +
   `stellar_docs_mcp` + `perplexity_search` + `parallel_search`/`parallel_extract` + **`lumenloop_request_research`
   in its pinned `answer` mode (~$0.02)**. Routing preference is expressed by `expected_cards` /
   `acceptable_cards`; an unlisted cheap card is **neutral** (not a graded failure). The `must_cite`
   "primary developers.stellar.org source" gate already down-weights a general-web-only answer to a
   Stellar-docs question — no hard forbid needed.
2. **Expensive / slow — the real ban tier, enforced at the SYSTEM level (already built), TESTED in the
   eval on a focused set only.** Parallel/Perplexity *deep research* + Lumenloop `report`/`sources`
   modes. The eval asserts `must_not_use_tier: [deep-research]` (and `metered-research` for the costly
   Lumenloop modes) ONLY on the dedicated governance-negative cases that test the governor — not on all 391.
3. **Genuinely-inappropriate per question — a small curated forbid set.** e.g. a primary-source-only
   question where falling back to general web is the explicit error tested.

## Proposed edits (pending sign-off)

- **A. `lumenloop_request_research` + `lumenloop_research_result`:** remove from `forbidden_cards` on all
  ~359 non-over-escalation files. KEEP only on the governance-negative over-escalation cases (the
  "exhaustive / multi-hour / leave-no-stone deep report" framings + the explicit-request-research-tool
  injection) — ~8–12 files.
- **B. `perplexity_search` / `parallel_search`:** remove the blanket `forbidden_cards` entries on the
  ~189 normal Stellar questions. Keep (or rely on `must_cite`) only on a small curated "don't fall back
  to general web for this primary-source Stellar fact" set. Where general-web corroboration is fine,
  list them as `acceptable_cards` instead.
- **C. `must_not_use_tier`:** remove the blanket `[deep-research]` from non-governance files; keep
  `[deep-research, metered-research]` on the governance-negative set (~32). Define the tier vocab in the
  README: `deep-research` = Parallel/Perplexity deep modes (not cards; system-banned); `metered-research`
  = Lumenloop `report`/`sources` expensive modes (system-disabled). The cheap `answer` lane is NOT a
  banned tier.
- **D. Docs:** update `README.md` "Controlled vocabularies & conventions" (redefine `forbidden_cards` +
  `must_not_use_tier`), `_meta/CARDS.md` (research cards now LIVE + cheap; expensive modes system-disabled),
  `_meta/TAXONOMY.md` governance section; then `node _meta/compile.mjs` + `build-index.mjs`.

Net: the governance/edge tests of the cost governor get sharper and fewer; the other ~359 questions stop
forbidding cheap tools they were never going to (mis)use anyway.

## Open questions for the user

1. Confirm the principle: cheap tools (incl. the `lumenloop` answer lane ≈ $0.02) are callable-when-relevant
   and should NOT be blanket-forbidden; the eval tests the *expensive*-tier governor on a focused
   governance set, not on every question.
2. `perplexity_search`/`parallel_search` on normal Stellar Qs: **drop the forbid entirely** (rely on
   `expected`/`acceptable` + the `must_cite` primary-source gate) — my recommendation — or keep a hard
   forbid on a small curated subset?
3. On the governance over-escalation cases, keep `lumenloop_request_research` in `forbidden_cards`
   (recommended — those framings invite expensive escalation), or forbid only via `must_not_use_tier`
   and leave the card neutral?
</content>
