# Reusable prompt — Solo-powered two-phase review of untrusted golden questions

> Paste this whole block into a fresh **orchestrator** session at the repo root,
> drop your raw sources into the **UNTRUSTED SOURCES**
> slot at the very bottom, and run. Synthesized from the cf-flue `semantic-golden-ques--264` campaign,
> the cf-flue coverage-audit, the PR-#11 4-source prior-art review, and the Phase-1/Phase-2
> program (`_meta/PLAN.md`, `_meta/ANSWERING-BRIEF.md`, `_meta/_verify/`).
>
> **Two phases, one run.** Phase A *finds & curates* the worthy questions; Phase B *answers & verifies*
> them. **Two-model split, both driven through the Solo MCP: Codex is the primary reviewer/answerer;
> Claude is the independent adversarial verifier** (mirrors the original cf-flue split — Codex first
> pass, fresh Claude falsifies it). Both phases build off the same verified source battery.

---

You are the **orchestrator/coordinator**. Your inputs are one or more **UNTRUSTED, UNVERIFIED**
collections of "golden questions" (listed at the bottom). Treat every question and every claim in them
as a *candidate to be falsified*, not as truth — they did not come from anything grounded. Drive the
whole thing through Solo: spawn the reviewers/answerers as Solo agents, coordinate via one Solo
scratchpad + todos, wake on idle timers (never sleep-poll), and capture durable output to committed
files as you go.

## Our trusted baseline (what untrusted questions are measured against)
- **The battery:** `research/golden/<category>/q-*.md` (~391 Q across 9 categories: protocol-core,
  soroban, assets-anchors-seps, defi-ecosystem, scf-grants-builders, history-org-tokenomics,
  tooling-infra, compliance-rwa-payments, edge-governance).
- **Schema / conventions:** `research/golden/_template.md`, `research/golden/README.md` (the P1/P2
  field split + `draft→answered→reviewed→final` lifecycle), `_meta/TAXONOMY.md`, `_meta/CATALOG.md`.
- **Capability cards** (routing targets): `src/capability-index.ts` + `_meta/CARDS.md` cheat-sheet.
- **Phase briefs to follow:** `_meta/ANSWERING-BRIEF.md` (Phase B method), `_meta/_verify/GROUNDTRUTH.md`
  (how the liberal real-API sweep was done + already-verified facts), `_meta/_verify/VERIFY-codex.md`
  (what an adversarial answer-verification pass looks like).
- **Prior runs of this workflow:** `_meta/_prior-art/` (review-*.md, `_candidates.md`,
  `review-codex-synthesis.md`, `_adopt-spec.md`). Read these first so you don't re-litigate settled
  ADOPT/REJECT calls.

## Source battery — the verified sources you ground EVERYTHING against, and how to reach them
This is the same evidence Raven itself routes to, so answers reflect what Raven would surface. Mixed
trust — prefer first-party Stellar + corpus sources; use general web for live/freshness facts. Tell
every spawned agent it has all of these and should use them **liberally** (the APIs are free):

- **Stellar Light "Scout" — keyless HTTP API**, curl directly:
  `https://stellarlight.xyz/api/research?q=...&limit=5` (also `/api/projects/search`, `/api/repos/search`,
  `/api/builders`, `/api/rfps`, `/api/hackathons`). Research corpora (SEPs, audits, papers, incidents,
  dev-docs, SCF handbook), project directory, repos, builders. **This is literally what Raven's Scout
  card returns** — cross-check ecosystem/project/SCF/incident facts here first.
- **Lumenloop — HTTP API** (`api.lumenloop.com`; creds in repo `.dev.vars`, never print): semantic
  content (news/talks/research/SCF), per-project records, similar-project / similar-SCF lookups,
  directory. Also mirrors a Raven card.
- **Stellar Docs MCP** — canonical protocol/SEP/CAP truth. Load via
  `ToolSearch select:mcp__plugin_cloudflare_cloudflare-docs__search_cloudflare_documentation` (or the
  repo's `search_stellar_docs` tool); for raw spec text `WebFetch` developers.stellar.org + the
  `stellar/stellar-protocol` repo (SEP/CAP files) via the GitHub MCP.
- **Perplexity MCP** — `mcp__perplexity__perplexity_search` (recency/facts) + `perplexity_research`
  (multi-source deep). **Parallel** — `parallel_search` / `parallel_extract`, and `createDeepResearch`
  for big sweeps. **WebSearch/WebFetch** for live "what's actually live today" checks.
- **GitHub / DeepWiki / Context7 MCPs** — repo/SEP/CAP confirmation, SDK docs.
- **Local mirrors already on disk:** `research/golden/_dossiers/<domain>.md` (the Phase-0 deep-research
  dossiers — primary raw material), `agents-docs/`, `ecosystem-skills/`.

Load any MCP tool on demand with `ToolSearch` (schemas are deferred). When a fact is freshness-sensitive,
contested, or future-dated, resolve it against the **PRIMARY** source and prefer the *sourced dossier/API
over model recall*.

## Hard rules (apply to both phases)
1. **Questions-only in Phase A.** Judge the *question* / whether the concept is covered. Ignore the
   sources' own rubric blocks (must-include/avoid, pass/fail, regex) — ours are higher quality; lift a
   wording idea only if clearly better.
2. **Unverified until grounded.** Every figure, name, SEP/CAP number, date, status, or "first/only…"
   claim is a *trap to verify* against the source battery. Misnumbered SEPs/CAPs, stale "what's live,"
   and inflated TVL/loss figures are the recurring failure modes.
3. **Raven is a context/evidence server, not a code generator.** Reject pure code-gen ("write me a
   contract"); reframe code-shaped topics into evidence/pattern lookups ("where is the canonical example
   / which library should a downstream coding agent cite?"). Reference answers stay **tight and cited**
   (evidence, not prose).
4. **Don't bloat.** Covered at equal/higher quality → SKIP and say so. Add the **minimal** high-value
   set; one good question can close several gaps. Prefer "SUFFICIENT, here's the proof" over padding.
5. **Two-model split, both via Solo.** **Codex = primary** (per-source review in A; gospel-answer draft
   in B). **Claude = adversarial** (falsifies the verdicts in A; verifies answers against primary sources
   in B). They are separate Solo processes that must *disagree* before you trust a result — the Claude
   pass exists to falsify Codex's, not echo it. Coordinate only through Solo scratchpads/todos.
   - Codex: `spawn_agent agent_tool_id=4`, `extra_args:["--dangerously-bypass-approvals-and-sandbox"]`
     (rejects `--dangerously-skip-permissions`; boots with Solo MCP; ignore harmless cloudflare OAuth fails).
   - Claude: `spawn_agent agent_tool_id=3`, `extra_args:["--dangerously-skip-permissions"]`.
   - Drive each with `send_input`, prepending the returned `agent_instructions`. Pre-create shared
     append-target files to avoid create-races. Wake with `timer_fire_when_idle_all`.
   - **Never close early on any spawned review/answer lane.** If a child agent is slow, appears stuck,
     goes quiet, or misses the first write attempt, do not substitute coordinator-authored work and do
     not stop the process merely to avoid a late write. Timer wake-up, apparent idleness, or max-wait
     expiry is only a prompt to inspect status; it is not completion. Use Solo idle timers/watchers,
     inspect output only after timer wake-ups, retry or redirect the same process when needed, and wait
     patiently until the assigned durable artifact exists. Proceed without that artifact only if a
     concrete blocker is recorded in the todo/scratchpad and the owner explicitly approves a reduced
     review.

---

## PHASE A — find & curate the worthy questions

**A0 — setup.** `whoami()`. Create the coordination scratchpad + per-source todos. Flatten the battery
once: write `id \t q` for every `research/golden/*/q-*.md` to `_meta/_prior-art/_our-questions.txt`.
Fetch each untrusted source to `_meta/_prior-art/_incoming/` (gh/WebFetch/MCP). Pre-create the shared files.

**A1 — Codex primary reviewers (parallel, one per source).** Each extracts questions only and classifies
every one against `_our-questions.txt`: **COVERED** (already at equal/higher quality — cite our id) /
**NEAR** (we touch it but lack this specific, useful angle) / **NEW** (genuinely absent concept). For
each NEAR/NEW: the concept, our closest category + capability card, a one-line grounding sanity note.
Writes `_meta/_prior-art/review-<source>.md`.

**A2 — Claude adversarial reviewer (separate, fresh).** Consolidates the NEAR/NEW candidates and tries to
**falsify each**: is it *really* new (re-grep `_our-questions.txt`)? is it *grounded* (verify against the
source battery)? Returns **ADOPT / REFRAME / REJECT** per candidate with evidence (URLs/corpus hits),
corrected facts (right SEP/CAP number, real figure/date, what's actually live), and target category + cards.
Writes `_meta/_prior-art/review-adversarial.md`.

**A3 — reconcile → author drafts.** Do not start A3 until every A1/A2 reviewer artifact exists and
contains the requested classifications/verdicts, or the owner has explicitly approved proceeding
without a blocked lane. Then reconcile A1+A2, dedupe against the battery *and* against
already-rejected items in `_adopt-spec.md`, and author each ADOPT/REFRAME as a NEW file in its category
dir, **full Phase-1 frontmatter** per `_template.md`: `status: draft`, `authored.phase1: <today>`,
seeded weighted `must_have`/`must_avoid` from the verified FACTS+TRAPS, `expected_cards`/`acceptable_cards`,
`should_fire`, `freshness_sensitive` + horizon for time-sensitive items. **The four outcomes per candidate:**
- **COVERED & unchanged** → skip; note the covering id.
- **COVERED but the source exposes new/contrary info** → no duplicate; verify the new fact and, if real,
  **fold the correction into the existing question** (and re-answer it in Phase B).
- **NEAR** → author a focused single-concept question for the missing angle (split composites).
- **NEW & grounded** → author it. **NEW but ungrounded/experimental** → reframe as an honest "what
  exists / how mature is it?" question, or reject. Never assert an immature thing is settled.

Append a one-line pointer per new file; update `_meta/CATALOG.md` (`node _meta/build-index.mjs`). If
nothing is additive, stop here with a **"SUFFICIENT — fully covered"** verdict + the coverage proof.

---

## PHASE B — answer & verify the newly-adopted questions

Runs only on the questions Phase A authored/edited. Follow `_meta/ANSWERING-BRIEF.md`. Turn each
`status: draft` into `status: answered`: a cited **reference dossier** (the gospel answer) + a
**finalized weighted rubric**. Re-derive the answer from evidence — do NOT reuse Phase-A craft reasoning
as the answer.

**B1 — Codex primary answerers (by category; split big batches).** For each question, re-derive the answer
from the source battery in this evidence order: (1) the category `_dossiers/<domain>.md`; (2) targeted live
verification for any freshness-sensitive/contested fact — Scout + Lumenloop HTTP APIs (curl liberally,
they're free and are what Raven returns), Stellar primary docs/SEP/CAP via Docs MCP + WebFetch + GitHub,
Perplexity/Parallel for recency. Then **finalize the question file**:
- `must_have` / `should_have` / `nice_to_have` — real verified claims, each weighted 1-5; promote/demote
  the Phase-A seeds against what you verify. `must_avoid` — the real verified-wrong traps, weighted.
- `must_cite` — the citation requirement(s); `sources` — 1-4 REAL primary-first URLs you verified against.
- `status: answered`, `authored.phase2: <today>`, `confidence` (high/medium/low — lower for
  freshness/contested facts, with a `notes` caveat).
- Body: **## Reference answer (gospel)** (concise, fully-cited, evidence-shaped — claims + sources, not an
  essay), **## Why these cards**, **## Edge / traps**. For `should_fire:false`/governance/edge cases the
  "answer" is the correct *behavior* (decline/scope/flag), and the rubric gates on that.
- **Contested facts:** resolve against PRIMARY source; if sources genuinely disagree or it's future/uncertain,
  do NOT gate on one number — gate the durable part (protocol version + CAP id + "cite a dated primary
  source") and record the disagreement in `notes`. Honesty > false precision. (See ANSWERING-BRIEF's
  "Known contested items" list.) Report any fact you could NOT verify, for the adversarial pass.

**B2 — Claude adversarial verification.** A separate fresh Claude adversarially spot-checks each answered
file against PRIMARY sources (the `VERIFY-codex.md` method, roles reversed): re-check high-weight
`must_have`/`must_avoid` and every freshness-sensitive claim; `curl -L -sI` the `sources` URLs and spot-read
contested bodies; surface cross-question contradictions. Returns per-file **CONFIRM / FIX (exact change +
evidence) / BLOCKER**. Resolve every BLOCKER (correct the file or downgrade `confidence` + `notes`); only
then is a question truly `answered`. Writes `_meta/_verify/verify-adversarial-<batch>.md`.

**B3 — reconcile + compile.** Apply fixes, re-verify any contradictions against the primary source, then
(re)compile the battery projection (`_meta/compile.mjs` → `compiled/golden.json` + the `criteria`
projection for `eval/dataset.ts`). Commit (secret-scan first; `Co-Authored-By: Claude Opus 4.8`).

---

## Output to me
1. Phase A: per-source `review-<source>.md` + `review-adversarial.md`, and what was adopted/reframed/rejected
   (or **"SUFFICIENT — fully covered"** with proof).
2. Phase B: the new `answered` files (rubric + gospel + sources), the adversarial verdicts, every BLOCKER
   and how it was resolved, and any fact left unverified (with the honesty caveat applied).
3. A short top-level summary: totals, standout gaps closed, contested facts and how you gated them.

## Coordination hygiene
Creds from `.dev.vars` (never print). macOS has no `timeout` — use `perl -e 'alarm shift; exec @ARGV'`.
Route shared-file edits through an explicit DELTA section you integrate serially. At the end: close only
the Solo processes spawned/owned by this review coordinator and delete the coordination scratchpad, but
only after each spawned process has produced its agreed durable output or has a documented
owner-approved blocker. Report progress as you go.

---

## >>> UNTRUSTED SOURCES TO REVIEW (paste below) <<<
<!-- Drop raw golden-question sources here: GitHub PR/file URLs, gist URLs, raw JSON/markdown, pasted
     lists, other repos' eval sets. One per line or inline. Everything below this line is UNVERIFIED
     input to be falsified and fact-checked, not trusted. -->


</content>
