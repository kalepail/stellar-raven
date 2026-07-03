# Golden Questions — Raven's eval ground truth

> **Status: shipped golden corpus.** Raven's current golden battery is
> [`compiled/golden.json`](./compiled/golden.json): 538 curated, answered cases across 9
> categories, including 147 freshness-sensitive cases. It replaces the 8 hand-mocked starters in
> `eval/dataset.ts`, which now remain only as a unit-tier scaffold fixture.

## What a "golden question" is here

A golden question is a **question an AI agent would realistically ask Raven about the Stellar
ecosystem**, paired with a **machine-gradable rubric** of what a correct Raven answer must, should,
and must-not contain — plus a **cited reference dossier** (the human-auditable "gospel" answer) and
the **capability cards that should fire** to produce it.

Raven returns **sourced evidence (claims + provenance + confidence), not prose** (AGENTS.md), and
its outputs are open-ended + freshness-sensitive. So we grade **"sufficiently meets the rubric," not
exact match**. The rubric is the gradable contract; the dossier is the evidence the rubric was
derived from and the reviewer's audit trail.

### Three coverage axes (every question is tagged to at least one)

1. **Tool-targeted** — a question that *should* light up a specific capability card / service, used
   to prove routing + gather work for that surface (e.g. "deploy a Soroban contract with the CLI" →
   `stellar_docs_mcp`; "SCF history for Soroswap" → `lumenloop_get_scf_submissions`; "most active
   Stellar projects by stars" → `scout_leaderboard`).
2. **Ecosystem-spectrum** — the full breadth of what Stellar is/does: protocol, Soroban, assets,
   anchors, SEPs/CAPs, DeFi, SCF/grants, history/org, tokenomics, tooling, compliance, RWA, builders,
   repos, news. Proves Raven gives *comprehensive, current, accurate* answers, not half-answers.
3. **Edge / governance** — the boundaries: general-web-only questions (the Perplexity/Parallel edge),
   should-not-fire / out-of-scope (non-Stellar), banned deep-research governance cases, and
   honest-"not in the corpus" cases. Proves Raven doesn't hallucinate or become a one-size-fits-all tool.

## Directory layout

```
research/golden/
  README.md            # this file — the spec
  _template.md         # copy-this skeleton for a new question
  _meta/
    PLAN.md            # historical orchestration plan + run ledger
    TAXONOMY.md        # the coverage matrix (categories × cards × axes) — the backbone
    CATALOG.md         # generated index of every question (id · q · cards · status)
  _dossiers/           # the foundation deep-research dossiers (one per domain) — Phase-2 raw material
  <category>/<id>.md   # one question per file (frontmatter rubric + prose body)
  ...
compiled/golden.json # current generated corpus loaded by the endpoint eval harness
```

Categories (subdirs): `protocol-core`, `soroban`, `assets-anchors-seps`, `defi-ecosystem`,
`scf-grants-builders`, `history-org-tokenomics`, `tooling-infra`, `compliance-rwa-payments`,
`edge-governance`.

## The per-question schema (YAML frontmatter)

Every `<category>/<id>.md` file begins with this frontmatter, then a markdown body (reference
dossier). Some comments still name the original two-arm authoring pass; the current compiled corpus
is already answered and is the harness input.

```yaml
---
id: q-soroban-deploy-cli            # stable kebab id, globally unique, prefix q-
q: "How do I deploy a Soroban smart contract to testnet using the Stellar CLI?"   # P1
category: soroban                   # one of the 9 dirs                              # P1
subcategory: tooling-cli            # finer bucket                                   # P1
axes: [tool-targeted, ecosystem-spectrum]   # 1+ of the three axes                  # P1
query_type: how-to                  # factual | how-to | comparison | discovery |   # P1
                                    #   freshness | list | governance-negative | edge-nonstellar
difficulty: easy                    # easy | medium | hard                           # P1
freshness_sensitive: false          # true => answer can go stale; pair w/ a freshness note  # P1
freshness_horizon: null             # e.g. "protocol-release" | "weekly" | null       # P1

# --- Tool-targeting contract (the routing assertion) ---------------------------- # P1
expected_cards: [stellar_docs_mcp]  # card ids that SHOULD fire (see capability-index.ts)
acceptable_cards: [scout_research]  # also-correct alternates that wouldn't be a routing miss
forbidden_cards: []                 # cards genuinely WRONG to fire here (content/cost/appropriateness) — NOT cheap tools by default; see ban policy below
expected_service: stellar_docs      # the authoritative service
should_fire: true                   # false for governance/should-not-answer cases

# --- The gradable rubric -------------------------------------------------------- # mostly P2
# Each claim: text + weight (1=minor .. 5=defining). Pass logic below.
must_have:                          # absent => FAIL regardless of score
  - { claim: "Uses `stellar contract deploy` (the Stellar CLI command).", weight: 5 }
  - { claim: "Requires building the contract to Wasm first (`stellar contract build`).", weight: 4 }
should_have:                        # strongly expected; missing costs score but isn't auto-fail
  - { claim: "Mentions configuring a network/identity (testnet, source account/keys).", weight: 3 }
nice_to_have:                       # bonus signal of a thorough answer
  - { claim: "Notes the returned contract ID and how to invoke it next.", weight: 1 }
must_avoid:                         # present => FAIL (hallucination / error traps)
  - { claim: "Do NOT claim contracts are written in Solidity or deployed with `soroban deploy` as the current command.", weight: 5 }
must_cite:                          # citation requirements
  - "At least one primary source on developers.stellar.org (docs)."
must_not_use_tier: []               # governance-only: EXPENSIVE tiers that must NOT have run (deep-research; metered-research). Empty on ordinary Qs. See ban policy below

# --- Scoring -------------------------------------------------------------------- # P1 defaults, P2 tune
pass_threshold: 0.7                 # weighted-coverage score needed to pass (after gates)
weight_profile: standard           # standard | strict (governance) — see Scoring below

# --- Provenance ----------------------------------------------------------------- 
source_kind: canonical-urls          # canonical-urls | dynamic-corpus. dynamic-corpus means the
                                    # fixed source is a tool corpus/query result, not a stable URL
sources:                            # canonical source URLs the dossier/rubric rest on  # P2
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started/deploy-to-testnet
status: draft                       # draft (P1 done) | answered (P2 done) | reviewed | final
authored: { phase1: 2026-06-22, phase2: null, reviewed: null }
confidence: high                    # rubric-author confidence: high | medium | low
notes: ""                           # anything a reviewer should know (ambiguity, freshness caveat)
---
```

The markdown **body** (Phase 2) is the **reference dossier**: a concise, fully-cited "this is the
correct answer" writeup, plus a short "why these cards" routing rationale and any "edge / traps"
notes. It is the gospel a human reviewer audits the rubric against — never graded verbatim.

## Scoring model (how the judge uses the rubric)

Solo-orchestrated reviewer agents grade Raven's rendered output and return the existing `Verdict`
(`pass | fail | inconclusive` + 0-1 score + stage + reasoning), applied through these layers:

1. **Hard gates (any failing gate ⇒ `fail`, regardless of score):**
   - Every `must_have` claim is present (semantically, not verbatim).
   - No `must_avoid` claim is present.
   - All `must_cite` requirements satisfied.
   - No `forbidden_cards` fired and no `must_not_use_tier` tier ran (governance).
   - For `should_fire: false` cases, Raven correctly **declined / scoped down** instead of fabricating.
2. **Weighted coverage score (0-1):** `Σ(weight of satisfied must+should+nice) / Σ(all must+should+nice weights)`.
   `must_avoid` violations and missing citations subtract (and also trip a gate). Pass if gates pass
   **and** score ≥ `pass_threshold`.
3. **Stage attribution:** Solo reviewer agents mark whether a miss is `route` (wrong/missing cards),
   `gather` (right cards, thin/empty evidence), or `synthesize` (had evidence, answered poorly) — so
   failures localize to a pipeline stage (eval/report.ts `byCategory` = stages).
4. **`inconclusive`** routes to Solo coordinator review (don't force a binary on a genuinely
   ambiguous/low-evidence case).

`weight_profile: strict` (governance/edge cases) sets `pass_threshold` high and makes any gate breach
dominate — these questions are about *not* doing the wrong thing.

### Harness artifacts

The current compiled `compiled/golden.json` carries question text, canonical answers, answer
guidance, sources, freshness flags, and source-file pointers for 538 cases. Endpoint runs and Solo
reviewer prompts consume this golden artifact. `eval/dataset.ts` keeps the old
`{ id, q, criteria, tags }` fixture shape only for scaffold/unit-tier compatibility.

## Authoring rules

- **One fact per claim.** Claims are atomic so reviewers can mark each present/absent.
- **Weights are about importance, not difficulty.** 5 = defining (answer is wrong without it); 1 = nice colour.
- **`must_avoid` encodes real traps** — the plausible wrong answer (wrong SEP number, Solidity, a
  defunct command, a hallucinated partnership). Derive these from the dossiers, not imagination.
- **Tool-targeting must match the real cards** in `src/capability-index.ts`. If unsure a card exists,
  check the index. Edge questions deliberately target the general-web cards or `should_fire:false`.
- **Cite primary sources.** Prefer developers.stellar.org, the stellar GitHub orgs, the CAP/SEP repos,
  communityfund.stellar.org, and reputable dated news for freshness items.
- **Freshness items carry a horizon + caveat** — they are reported separately from stable cases,
  and the rubric should reward Raven for *flagging staleness* rather than asserting confidently.

## Controlled vocabularies & conventions (review-hardened 2026-06-22)

- **`axes`** — exactly these three values: `tool-targeted`, `ecosystem-spectrum`, `edge-governance`.
  (`discovery` etc. are `query_type` values, never axes.)
- **`forbidden_cards`** (ban policy, revised 2026-06-22) — reserve for cards whose firing would be
  **genuinely wrong for *this* question by content, cost, or appropriateness** — NOT "not the best tool",
  NOT "costs a few cents", NOT "isn't wired". The cheap, system-governed tools — `perplexity_search`
  (≈ $0.005), `parallel_search`/`parallel_extract`, and the **LumenLoop research lane in its pinned
  `answer` mode (≈ $0.02)** — are **callable-when-relevant** and are **not** blanket-forbidden; routing
  preference is carried by `expected_cards`/`acceptable_cards`, and the `must_cite` primary-source gate
  already down-weights a general-web answer to a Stellar-docs question. Forbids concentrate on (a) the
  **governance-negative** cases that test the cost governor, and (b) cases where firing general web to
  "answer" an out-of-scope question is itself the error. *Why:* the expensive tiers are gated at the
  **system** level — budget governor + 5-min deadline + router-isolation (the metered lane is
  `async-research`, never router-selected) + `answer`-mode pin + `RAVEN_RESEARCH_LANE=off` kill-switch
  The eval tests that governor on a focused set; it does not re-ban cheap tools across the full
  corpus.
- **`must_not_use_tier`** — controlled tokens for the **expensive** research tiers, asserted **only** on
  the governance-negative over-escalation cases (not ordinary questions):
  - `deep-research` — uncarded / system-denied agentic deep-research: Parallel deep research
    (`createDeepResearch`/Task tiers), Perplexity `sonar-deep-research` / Pro Search / Agent API, and any
    multi-step external research agent not represented by the cheap search cards.
  - `metered-research` — the **expensive** LumenLoop modes that are NOT the pinned `answer` runtime path:
    `sources`, `structured`, `report` (a mode/tier, **not** the `lumenloop_request_research` card id;
    runtime-disabled today — the executor pins `output_format: "answer"`).
  - The cheap `answer` lane (≈ $0.02) is **never** a banned tier. On governance-negative cases the
    `lumenloop_request_research` / `lumenloop_research_result` cards stay in `forbidden_cards` as the only
    observable proxy for "the metered lane fired" until the harness records mode-level tier usage.
- **`should_fire: false`** (out-of-scope / decline / clarify-first cases) ⇒ **`acceptable_cards: []`**.
  Any "what it *could* route to after clarification" belongs in the body/notes, not `acceptable_cards`
  (an "acceptable" card on a no-fire case muddies the hard gate). These cases use `weight_profile: strict`
  with `pass_threshold ≥ 0.8`.
- **Expansion-lane cards** (`scout_hackathon_detail`, `scout_skill_detail`, `lumenloop_get_document`,
  `lumenloop_get_related_projects`, `parallel_extract`) are reached only after a prior call surfaces an
  id/slug/URL — a question expecting one should name the upstream discovery card as `acceptable_cards`.

See `_template.md` to start a question, `_meta/TAXONOMY.md` for the coverage matrix, and
`_meta/PLAN.md` for the orchestration plan.
