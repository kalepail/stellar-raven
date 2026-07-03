# Golden-question build — orchestration plan & run ledger

Two independent research arms, Solo-orchestrated, each gated by Claude + Codex adversarial review.
Goal: an exhaustive (~300+) golden battery (see `TAXONOMY.md`) with weighted rubrics + cited
reference dossiers (schema in `../README.md`). Decisions locked 2026-06-22 (scale: exhaustive;
truth: rubric + dossier; layout: one md/Q + compiled JSON; Phase 2 gated on Phase 1 review).

## Phase 0 — Foundation deep-research sweeps (IN FLIGHT)

8 Parallel `createDeepResearch` (processor `pro`) dossiers mapping "everything Stellar". Results →
`research/golden/_dossiers/<slug>.md` (committed; Phase-2 raw material + Phase-1 question seeds).

| Slug | Domain | Parallel run_id | Status |
|---|---|---|---|
| protocol-core | Protocol & core network | `trun_04740bf111ed4e898b201a0f83d81d91` | queued |
| soroban | Soroban smart contracts | `trun_04740bf111ed4e89b6a8a36aa66bea46` | queued |
| assets-anchors-seps | Assets, anchors, SEPs | `trun_04740bf111ed4e8994ec330e58416b0a` | queued |
| defi-ecosystem | DeFi & app ecosystem | `trun_04740bf111ed4e8985d49439db1ba638` | queued |
| scf-grants-builders | SCF, grants, builders | `trun_04740bf111ed4e89b6c0e8743f13d17e` | queued |
| history-org-tokenomics | History, org, tokenomics, partnerships | `trun_04740bf111ed4e89a32b6ee0584ee3fd` | queued |
| tooling-infra | Dev tooling & infrastructure | `trun_04740bf111ed4e898b007b5f44f3ec29` | queued |
| compliance-rwa-payments | Compliance, regulation, RWA, payments | `trun_04740bf111ed4e89a5c469f20979a9c7` | queued |

Poll with `getStatus(run_id)`; fetch with `getResultMarkdown(run_id)` when complete. Platform views at
`platform.parallel.ai/view/task-run/<run_id>`.

Complementary live-tool grounding (Phase 1, via Solo sub-agents — NOT loaded into the orchestrator
context): Raven's own Scout + Lumenloop HTTP APIs, the Stellar Docs MCP, GitHub MCP (stellar org
repos), DeepWiki/Context7 (SDK repos), and the ecosystem-skills mirror. These characterize *what each
card actually returns* so tool-targeting is accurate.

## Phase 1 — Question generation (gated → user review)

1. **Distill** each foundation dossier → a `_dossiers/<slug>.md` (committed) + a question-seed list.
2. **Generate** per-category question files (frontmatter complete through `should_fire`; rubric
   `must_have`/`must_avoid` stubbed from the dossier, weights set) — fanned across Solo sub-agents,
   one category per agent, writing directly into `research/golden/<category>/`.
3. **Tool-targeting pass** — verify every `expected_cards` against `capability-index.ts`; fill the
   Axis-A checklist; add missing per-card questions.
4. **Adversarial review** — Claude pass (coverage gaps, dupes, ecosystem breadth) + Codex pass
   (tool-targeting correctness, governance-case rigor, must_avoid quality, hallucination risk), high
   reasoning. Reconcile.
5. **Compile** CATALOG.md + a coverage report; **commit**; **STOP for user sign-off.**

## Phase 2 — Answering (separate arm, post-review)

Independent research per question (re-derive the gospel answer + sources; do NOT reuse Phase-1
question-craft reasoning as the answer). Fill the rubric (`must_have` weights finalized,
`should/nice/avoid`, `must_cite`, `sources`) + write the reference-dossier body. Fan across Solo
sub-agents by category; Claude+Codex adversarial verification of each answer against primary sources;
build `compiled/golden.json` + a `criteria` projection for `eval/dataset.ts` back-compat; ADR-0022.

## Coordination

- Solo scratchpad **`golden-build-coord`** = live cross-agent status (run states, per-category
  ownership, blockers). Ephemeral — durable output lands in these committed files, then it's closed.
- Solo todos track each category's generation + each review gate.
- Wake-ups via idle timers on spawned agents / a poll timer for the Parallel runs — never sleep-poll.
- A wake-up is not completion. Before reconciling, synthesizing, authoring follow-on files, or closing
  Solo processes, verify every spawned agent assigned to that gate has written its durable output
  (`review-*.md`, answered question files, verification notes, etc.). If an agent is still running or
  its output is missing/incomplete, wait with another timer or re-prompt that same agent. Do not fill
  in a missing independent lane with coordinator work unless a real blocker is recorded and the owner
  explicitly approves continuing without it.
- **Capture-as-you-go:** every round ends by committing to `research/golden/`; nothing stranded in Solo.

## Phase 1 — OUTCOME (2026-06-22) — COMPLETE, awaiting user sign-off

- **376 question files** across the 9 categories + **8 committed dossiers** (`_dossiers/`). Index:
  `_meta/CATALOG.md` (regenerate via `node _meta/build-index.mjs`). All 27 route-ready cards covered.
- **Generation:** 9 parallel category sub-agents (one dossier each, distilled in-agent).
- **Adversarial review (two independent reviewers):** native Claude (coverage/dedup/schema →
  `_meta/REVIEW-claude.md`) + Solo **Codex** (adversarial card-targeting/factual/governance →
  `_meta/REVIEW-codex.md`). Reconciled fixes applied: factual date corrections, 2 card-targeting
  re-routes, freshness-card un-forbidding, governance hardening (no-fire ⇒ `acceptable_cards: []` +
  strict), `discovery`-axis removal, tier-vocab normalization, ~4 true dups cut, +20 coverage questions
  (closed the `parallel_search`=0 blocker + 4 zero-coverage lanes).

### Known issues to reconcile in Phase 2 (the answering arm verifies against PRIMARY sources)
- **Contested protocol dates.** The protocol-core dossier dates Protocol 23 'Whisk' at **2025-09-03**
  and carries both 2024-02-20 and 2024-03-19 for Soroban/P20; Codex asserted 2025-06-10 / 2024-02-20
  from model knowledge. For future-dated events the **sourced dossier should win over model recall** —
  do NOT trust either blindly. Phase 2 must verify activation dates against developers.stellar.org /
  stellar-core releases / the CAP repo, and prefer rubrics that gate on *protocol-version + CAP + a
  dated primary source* rather than a specific contested date.
- **BN254/Poseidon CAP ids** (CAP-0074/0075, P25 'X-Ray') confirmed by the soroban dossier but not
  surfaced in the protocol-core dossier — Phase 2 confirm against stellar/stellar-protocol.
- **Per-project SCF amounts / slugs** were left unasserted (rubrics reward grounding-in-record, not
  specific figures) — Phase 2 resolves slugs + amounts via live Lumenloop/Scout.
- `factual` query-type still ~42% (spec-dense battery); acceptable, but Phase 2 may retag a few to `list`.

## Phase 1.5 — Prior-art mining (2026-06-22) — COMPLETE

Owner asked to mine 4 prior (unverified) golden collections (stellar-raven main + PR#11, cf-flue, a
gist) for anything materially additive, treating them as ungrounded. Process: 4 independent per-source
reviewer sub-agents → Codex adversarial+independent synthesis (`_prior-art/review-codex-synthesis.md`)
→ orchestrator grounding via Parallel/Perplexity + Stellar Light/Scout (`_prior-art/_grounding-
orchestrator.md`) → reconciled ADOPT list (`_prior-art/_adopt-spec.md`). All 4 sources overlapped
heavily with our battery (mostly COVERED); the residual was small + convergent.

- **Outcome: +15 validated-additive questions → battery now 391.** Biggest gap (flagged by all 4
  sources) = **agentic / x402 payments** — now a 5-question cluster (what/auth-entries/standards-
  compare/projects-discovery/agent-identity), grounded in first-party Stellar docs + Scout corpus.
  Plus: SEP-53 sign/verify; Soroban contract **build verification (SEP-55/58 — NOT SEP-49)**; a
  fact-check/claim-adjudication honesty case (Soroswap = first *aggregator*, not first AMM); the real
  **YieldBlox/Reflector oracle incident** (~$10M, Feb 2026); oracle-defensive-consumption; CCTP-on-
  Stellar integration; passkey wallet recovery; Etherfuse Stablebonds; a code-gen→context-lookup reframe.
- **Rejected** (grounding caught these): the gist's "SEP-49 = source verification" (SEP-49 is Upgradeable
  Contracts); a fabricated incident figure; smart-account-kit-vs-passkey-kit (dup of existing); pure
  code-gen tasks (out of Raven's evidence-server remit); Raven self-introspection; the reviewer junk list.
- **Phase-2 re-verify** (flagged in the new files' notes): exact YieldBlox $ figures; SEP-55/58
  numbers/status (drafts); the x402 wallet/facilitator surface; CCTP go-live date; the discovery items'
  illustrative project/repo names (confirm against live Scout, don't hard-gate the exact set).
- Provenance kept in `research/golden/_meta/_prior-art/` (4 reviews + codex synthesis + grounding +
  adopt spec + the merged candidate list).

## Phase 2 — Answering arm (2026-06-22) — COMPLETE

The independent answering arm turned all **391** questions `draft → answered`: cited reference-dossier
bodies + finalized weighted rubrics + verified `sources[]`. Process: pilot (protocol-core, set the bar)
→ 13 parallel per-category answering sub-agents (big categories split odd/even) using the dossiers +
**live primary-source verification** (developers.stellar.org, the SEP/CAP repos, GitHub, Stellar Light
Scout) → independent **Codex adversarial verification** (`_meta/_verify/VERIFY-codex.md`) → fixes.

- **Compiled:** `research/golden/compiled/golden.json` (391 entries) via `_meta/compile.mjs`, which also
  emits a derived `criteria` string per question for `eval/dataset.ts` `GoldenCase` back-compat. The
  compiler validates clean (0 drafts, 0 missing fields, 0 should-fire-without-must_have, 0 bad weights).
- **ADR:** [ADR-0023](../decisions/0023-golden-question-battery.md) (golden schema + two-arm build).
- **Key Phase-2 corrections (live-verified):** Soroban P20 Mainnet = 2024-02-20 (not Mar); P23 'Whisk'
  = 2025-09-03 (dossier right, reviewer wrong); BN254/Poseidon = CAP-0074/0075 / P25; current Mainnet =
  **P26 'Yardstick' (2026-05-06)**, stellar-core v27 targeting P27/CAP-0071 (testnet 2026-06-18);
  SEP-55/58 (build verification, not SEP-49); **SEP-43 exists** (renamed `q-sep-43-nonexistent` →
  `q-sep-43-web-wallet-api`, fixed the false-nonexistence claims in 2 other files); SEP-8 = Final;
  getEvents 24h default / ~7d max; CCTP live on Stellar 2026-05-19; StellarX = Ultra Stellar; many
  fabricated/stale per-project facts (streaming + x402 repos, oracle alternatives, TVL) re-grounded.
- **YieldBlox/Reflector incident** reconciled by the verifier across ~6 dated sources to **Feb 21-22,
  2026** (~$10.2M drain via thin-liquidity USTRY on a Blend V2 pool, ~48M XLM frozen; pool oracle-config
  failure, not a Stellar/Blend-core/Reflector-core flaw). The "May 2026" framing was a secondary-source
  error; normalized across files.
- **Freshness items** gate on durable facts (version + CAP + "cite a dated source") + staleness-flagging,
  not frozen numbers; they form the rolling freshness set.

### Phase-2 follow-up (NEXT.md when the tree's other edits settle)
- **Wire the eval harness** to `compiled/golden.json` (point `eval/dataset.ts` at it / consume the rubric
  directly), run N× endpoint captures, and drive semantic review through Solo-spawned reviewers per
  ADR-0024.
- Periodic freshness re-verify of the `notes`-flagged items (incident figures, draft SEP status, P27
  mainnet date, RPC-provider list, per-project TVL/SCF amounts).

## Phase 3 — Ban-policy relaxation (2026-06-22) — COMPLETE

User review of the "incredibly verbose" tool-bans. After the LumenLoop research lane shipped LIVE
(ADR-0018), the blanket bans were the wrong layer. Process: orchestrator footprint + cost grounding →
proposal (`_verify/BAN-POLICY-PROPOSAL.md`) → **Codex adversarial review** (`_verify/BAN-POLICY-codex.md`,
ADOPT-WITH-CHANGES, 0 blockers) → user sign-off → deterministic transform (`_verify/apply-ban-policy.mjs`).

- **Footprint:** `lumenloop_request_research` in `forbidden_cards` **391 → 32**; `perplexity_search`
  **191 → 2**, `parallel_search` **216 → 2**; `must_not_use_tier` non-empty **391 → 32**. 362 files changed.
- **Policy:** a forbid = "genuinely wrong here by content/cost/appropriateness", not "not the best tool".
  Cheap governed tools (perplexity ≈$0.005, parallel, LumenLoop `answer` ≈$0.02) are callable-when-relevant
  (neutral, not forbidden). The metered/deep bans concentrate on the **32 `governance-negative`** cases.
- **Tier vocab fixed** (Codex): `deep-research` = uncarded Parallel/Perplexity deep modes; `metered-research`
  = the EXPENSIVE LumenLoop `sources`/`structured`/`report` modes (NOT the cheap `answer` lane).
- **Load-bearing caveat / system follow-up:** the live escalation trigger (`shouldEscalateToResearch`) is
  *syntactic* (zero-artifact), not semantic — so the 32 governance forbids stay until the **semantic
  trigger** lands (NEXT.md "richer escalation trigger" / ADR-0022 assess loop); then they can shift from
  card-forbid to mode-tier-forbid once the harness records mode-level tier usage.

## Phase 4 — Research-lane positive weave (2026-06-22) — COMPLETE

Follow-up to Phase 3: the ban-policy stopped the over-ban but left `lumenloop_request_research` with
**no positive signal** (acceptable:0) — i.e. still never-signaled, the other half of the problem. User
direction: weave it into EXISTING questions like perplexity/parallel (billed, cautious) but more strongly
where it's the higher-signal *Stellar-specific* research call; don't add a pile of new questions.

- Process: footprint + card-purpose grounding → curate the deep-synthesis subset → user sign-off
  (strong+medium ~20, acceptable-only) → `_verify/apply-research-weave.mjs` → **Codex adversarial review**
  (`_verify/RESEARCH-WEAVE-codex.md`, 1 BLOCKER + 2 MAJOR) → `_verify/reconcile-research-weave.mjs`.
- **Result:** `lumenloop_request_research` in `acceptable_cards` **0 → 16** (expected 0, forbidden 32 —
  governance set untouched). Acceptable-only: the free corpus search stays the expected primary; the
  metered lane is the governed "escalate when thin" option (matches the post-gather-escalation design).
- **Codex removes (over-use / contradiction):** dropped from the 4 exact named-entity *content lookups*
  (dedicated free lanes suffice), `q-pay-unhcr-aid-assist` (non-corpus expected primary), and
  `q-defi-perps-whitespace` (rubric contradicts `q-eco-defi-market-map` on whether perps are whitespace —
  a pre-existing golden-content inconsistency, flagged for separate reconciliation).
- **Adds:** `q-defi-streaming-payments-prior-art` (+ stale "metered forbidden" prose fixed) and
  `q-defi-agent-identity-stellar-experimental` (thin emerging Stellar landscape). Skipped 4 general-web-
  leaning Codex candidates (regulatory/partnerships/incident — perplexity/parallel own those).
- **RESOLVED in Phase 5 (2026-06-23):** the `q-defi-perps-whitespace` ↔ `q-eco-defi-market-map` perps
  contradiction — reconciled to the verified truth (emerging/testnet, no confirmed mainnet perp DEX). See Phase 5 below.

## Phase 5 — Contradiction reconciliation + ground-truth re-verification (2026-06-23) — COMPLETE

Resolved the flagged perps contradiction + swept for others. Process: a contradiction-hunter sweep
(`_verify/CONTRADICTIONS.md`, 4 sets) + a liberal ground-truth sweep across Scout + Lumenloop +
Perplexity + Parallel + web (`_verify/GROUNDTRUTH.md`) → reconciliation → **independent Codex
re-verification** (it re-queried the real APIs itself, not the notes — `_verify/RECONCILE-codex.md`,
all 6 edits CONFIRMED, 0 blockers).

- **Perps** (both sides were wrong): reframed `q-defi-perps-whitespace` + `q-eco-defi-market-map` to the
  verified truth — emerging, real testnet teams (Noether/Stellars Finance/Zenex), **no confirmed mainnet
  perp DEX yet**; Turbolong removed from perps (leveraged spot).
- **Oracles**: `q-defi-reflector-related-projects` + `q-defi-reflector-oracle` — Reflector is leading,
  **not the only** oracle (Band + RedStone live on mainnet, DIA/Lightecho/Orally).
- **Protocol dates**: `q-edge-fresh-latest-protocol-version` aligned to verified P26 (2026-05-06) / P27
  (Testnet 2026-06-18) — dropped the stale `2026-06-17 / ledger 63,073,409` figure.
- **Soft**: MoneyGram country count normalized (~170+; dev docs cite 174).
- **Provenance dossiers corrected**: added correction headers to `_dossiers/defi-ecosystem.md` (oracles +
  perps) and `_dossiers/protocol-core.md` (P26 date) so the raw snapshots don't carry the debunked facts
  (Codex's 3 MAJOR "stale dossier" finds). None of the questions needed dropping — all premises valid.
- Verified non-contradictions (unchanged): NFT (Litemint live), liquid staking (genuine whitespace —
  architectural, SCP not PoS), "first AMM"=aggregator, CAP/SEP/tokenomics/SCF facts.
