# Phase-1 generation brief (per-category Solo sub-agent)

Reusable instruction block handed to each spawned Solo sub-agent. The orchestrator fills the
`{{PLACEHOLDERS}}` and prepends the agent's own `agent_instructions`. One agent owns one category.

---

You are generating Phase-1 golden questions for the Stellar Raven eval battery. Work entirely in this
repository. Do NOT load large content into chat — read/write
files directly and report back only a short summary.

**Your category:** `{{CATEGORY}}`   **Target count (floor):** `{{TARGET_COUNT}}`
**Your foundation dossier:** Parallel run_id `{{DOSSIER_RUN_ID}}`

### Step 1 — Read the spec (do this first, in full)
- `research/golden/README.md` — the schema, scoring model, authoring rules.
- `research/golden/_template.md` — the exact frontmatter skeleton to copy.
- `research/golden/_meta/TAXONOMY.md` — find your category's subtopics + the Axis-A cards you must hit.
- Skim the three exemplars: `soroban/q-soroban-deploy-cli.md`,
  `assets-anchors-seps/q-sep-interactive-deposit-withdraw.md`,
  `edge-governance/q-edge-exhaustive-defi-deep-report.md`. Mirror their depth and format exactly.

### Step 2 — Fetch + commit your dossier
- Call the `parallel-task` MCP `getResultMarkdown` with your `{{DOSSIER_RUN_ID}}`.
- Write the full markdown to `research/golden/_dossiers/{{CATEGORY}}.md` verbatim (this is committed
  Phase-2 raw material). If the run isn't complete yet, STOP and report "dossier not ready".

### Step 3 — Ground against the real tools (light, targeted)
- Open `src/capability-index.ts` and confirm the exact card ids you will put in `expected_cards` /
  `forbidden_cards`. Only use card ids that exist there. Match each question to the card whose
  `good_at` actually covers it.
- Where useful, sanity-check what a card returns by calling Raven's own surfaces (Scout HTTP at
  `https://stellarlight.xyz/api/...`, the Stellar Docs MCP, GitHub/DeepWiki) — but keep this light;
  the dossier is your main source.

### Step 4 — Generate the questions
Create `research/golden/{{CATEGORY}}/<id>.md`, one file per question, frontmatter per the template:
- Realistic questions an AI agent would ask Raven — varied phrasing, not templated.
- Cover EVERY subtopic listed for your category in TAXONOMY.md, and hit your Axis-A target cards.
- Mix query_types per TAXONOMY Axis C (factual/how-to/comparison/discovery/list/freshness/etc.).
- Fill all Phase-1 fields: `id, q, category, subcategory, axes, query_type, difficulty,
  freshness_sensitive, freshness_horizon, expected_cards, acceptable_cards, forbidden_cards,
  expected_service, should_fire`.
- **Seed the rubric** from the dossier: write the `must_have` and `must_avoid` claims (the defining
  facts + the plausible wrong answers) with weights. Stub `should_have`/`nice_to_have` lightly. Leave
  `sources` and the dossier body for Phase 2, but the must_have/must_avoid must be real and correct.
- Set `status: draft`, `authored.phase1: 2026-06-22`, and an honest `confidence`.
- **Include the hard cases**, not just easy ones: comparisons, multi-hop, and (for relevant
  categories) at least one freshness item + one near-edge case that probes your category's boundary.
- IDs: `q-<category-short>-<slug>`, globally unique, kebab-case. Check existing files to avoid clashes.

### Step 5 — Report back
Append a one-block summary under your category heading in the Solo scratchpad
`golden-build-coord` (use `scratchpad_append_section`): count produced, subtopics covered, cards hit,
and any gaps/uncertainties you couldn't resolve. Then stop. Do not commit to git.

Quality bar: a reviewer (Claude + Codex, high reasoning) will adversarially check tool-targeting
correctness, governance rigor, must_avoid quality, duplicates, and coverage. Write for that bar.
