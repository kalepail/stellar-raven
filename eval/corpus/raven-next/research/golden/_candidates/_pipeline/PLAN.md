# Golden-answer pipeline — master plan (Jitsu net-new candidates → answered goldens)

Orchestrator: the top-level Claude session (Solo process "Claude", project 47 `stellar-raven-next`).
Workers: **4 chained Solo codex phase-coordinator agents**, each spawning its own sub-agents and
looping until its phase is complete. Phases run strictly in order via dependency gating.

## Source of truth (inputs)
- Candidate questions: [`../2026-06-29-jitsu-net-new-questions.md`](../2026-06-29-jitsu-net-new-questions.md)
  (144 net-new candidates) + the raw per-chunk findings in `../_raw-jitsu-findings/`.
- The golden spec + artifact shape: `research/golden/README.md`, `research/golden/_template.md`,
  `research/golden/_meta/ANSWERING-BRIEF.md`, `research/golden/_meta/CARDS.md`,
  `research/golden/_meta/TAXONOMY.md`, and exemplars (`soroban/q-soroban-deploy-cli.md`, etc.).

## Target artifact (what "done" produces)
One file per promoted question at `research/golden/<category>/<id>.md`, in the exact `_template.md`
schema: full frontmatter rubric (`must_have`/`should_have`/`nice_to_have`/`must_avoid`/`must_cite`,
`expected_cards`/`acceptable_cards`/`forbidden_cards` from `_meta/CARDS.md`, `should_fire`, scoring) +
a tight, fully-cited **reference dossier** body (gospel answer, "why these cards", "edge/traps").
Status progresses `draft` → `answered` → `reviewed`. Do NOT git commit.

## The four phases (chained; each gated on the prior)
1. **TRIAGE + CONSOLIDATE + PHASE-1 AUTHORING** → writes `draft` files + the worklist.
2. **DEEP RESEARCH / ANSWERING** → fills dossier + finalizes rubric → `answered`.
3. **ADVERSARIAL REVIEW + VERIFY** → refute/repair loop, empirical checks → `reviewed`.
4. **ASSEMBLY + COMPILE + FINAL REPORT** → validate, index, summarize.

Each phase has its own brief: `phase-1-triage.md` … `phase-4-assembly.md`.

## RELEVANCE / ANSWERABILITY GATE (cost discipline — applies in Phase 1, honored everywhere)
We are building eval ground truth for a **Stellar** research assistant. We do NOT spend deep-research
money on questions that are out of scope, unanswerable with our tools, or attempts to farm the
service. Per question, Phase 1 assigns one **disposition**:
- **RESEARCH** — on-topic Stellar/Soroban/XLM/ecosystem question we can answer authoritatively with our
  tools. Goes to Phase 2 for full deep research.
- **DECLINE** — out-of-scope / unrelated / unanswerable-by-design / farming / harmful (e.g. "is this
  random site a scam", "send me XLM", price prediction, generic adversarial probes, anything as
  off-topic to this service as "what's the top speed of a cheetah"). NO deep research. The golden
  "answer" is the **expected decline/redirect behavior** (`should_fire: false`, `weight_profile:
  strict`): correctly scope down / decline / point out it's out of scope, without fabricating. A short
  behavioral rubric is authored directly; Phase 2 skips it.
- **FOLD** — a near-miss that should extend an EXISTING golden question's rubric rather than become a
  new file. Recorded in the worklist with the target `q-id`; not a new file unless Phase 4 decides.
- **DROP** — duplicate of another candidate after consolidation, or fails the strong+answerable bar.

The disposition split is the headline cost lever: only RESEARCH items hit Phase 2's expensive tools.

**Pi Network nuance:** the *relationship* question ("is Pi built on/partnered with Stellar, does it use
SCP") IS answerable and on-topic-adjacent → RESEARCH (factual: Pi is a separate SCP-derived network,
not a Stellar asset, SDF has no affiliation — verify). But "fix my Pi wallet / Pi price / claim my Pi"
→ DECLINE (not Stellar). Phase 1 splits the Pi cluster accordingly.

## TOOL POLICY (research + verification — use the REAL service tools)
Weight slightly toward official/first-party, but use everything; record provenance + confidence.
- **Tier 1 (official / first-party — prefer):** Stellar Docs MCP (`mcp__stellar-docs__*`),
  developers.stellar.org (WebFetch), the stellar GitHub orgs + CAP/SEP repos (GitHub MCP / `gh api`),
  stellar.org / communityfund.stellar.org, a project's own repo/site.
- **Tier 1 ecosystem (prefer for ecosystem facts):** **LumenLoop** (`mcp__solo`? no — the lumenloop
  cards / `mcp__stellar-raven`? use the LumenLoop tools available) and **Stellar Light "Scout"** —
  keyless HTTP: `curl -s 'https://stellarlight.xyz/api/research?q=...&limit=5'` (+ `/api/projects/search`,
  `/api/repos/search`, `/api/builders`, `/api/rfps`). These are literally what Raven's tools return —
  cross-checking here also validates routing.
- **Tier 2 (general web — fine, esp. for news/partnership/figures/freshness):** the **`parallel-cli`**
  bin at `~/.local/bin/parallel-cli` (`search`, `research`, `fetch`/`extract`), the Perplexity MCP
  (`mcp__perplexity__*`), the `parallel-search` MCP, plain WebFetch/WebSearch.
- **Empirical verification (high-stakes how-to/error/address items):** actually run it where feasible —
  `stellar` CLI, derive SAC addresses, decode sample XDR, reproduce a build error — to guarantee the
  command/value is real, not a doc guess. Codex runs with bypassed sandbox; be careful, testnet only,
  never touch real keys/funds.
- **Contested/freshness facts:** resolve against the PRIMARY source; if genuinely
  future/uncertain/disagreeing, do NOT gate on a single number — gate the durable part (protocol
  version + CAP/SEP id + "cite a dated primary source") and record the caveat in `notes` +
  `confidence: medium|low`. Honesty > false precision. Snapshot date: **2026-06-29**, current mainnet.

## SOLO COORDINATION PROTOCOL (how the chain stays in lock-step)
- **KV gates** (small status flags; orchestrator seeds them `pending`):
  `gp_phase1`, `gp_phase2`, `gp_phase3`, `gp_phase4` ∈ {`pending`,`running`,`done`,`blocked`}.
  A phase sets its own gate `running` at start and `done` ONLY when fully complete + artifacts verified.
- **Shared scratchpad** `golden-answers-coord` — each phase appends a progress/》results section
  (`scratchpad_append_section`), and the worklist lives here (Phase 1 writes it).
- **Dependency gating (the "wait for previous phase" requirement):** the orchestrator wires an
  idle-timer so phase N is woken when phase N-1's agent goes idle. **Idle ≠ done**, so on wake each
  phase coordinator FIRST does `kv_get(gp_phase{N-1})`; if it is not `done`, it re-arms (sets a short
  self-timer / waits on the prior agent again) and does NOT start. Only `done` releases it. This makes
  the KV gate authoritative and tolerant of the prior coordinator's transient idle while it waited on
  its own sub-agents.
- **Sub-agent fan-out:** each phase coordinator spawns worker sub-agents (Solo `spawn_agent` if Solo
  MCP is available in its environment; otherwise it parallelizes internally / via its own task tools)
  to write→review→test, and **loops until its phase's acceptance check passes** before marking `done`.
- **Locks:** use `lock_acquire("golden-files")` around the index/compile write in Phase 4; per-question
  files are owned by one sub-agent at a time (no two agents edit the same file).
- Workers do NOT git commit. The orchestrator owns any commit decision (only if the user later asks).

## Acceptance check per phase (gate to `done`)
- P1: every candidate has a disposition; all RESEARCH+DECLINE items have a `draft` file with valid
  frontmatter (card ids exist in CARDS.md; ids unique); worklist written.
- P2: every RESEARCH file is `answered` — dossier body filled, `sources` are real verified URLs,
  rubric finalized, `confidence` set; unverifiable facts flagged for P3.
- P3: every `answered` file passed an independent skeptic (claims + citations refuted-then-survived or
  repaired); high-stakes how-to/error/address items empirically checked; status `reviewed`; a
  defects-fixed log written.
- P4: frontmatter validates, no dup ids, CATALOG/compile refreshed (or a clean diff proposed),
  FINAL-REPORT.md written with counts, dispositions, confidence distribution, and open risks.

## Orchestrator responsibilities (me)
Seed KV gates + scratchpad, spawn the 4 codex phase agents, wire the dependency timers, set a periodic
self-monitor wakeup, and surface a summary to the user at each phase boundary / on completion.
