---
name: run-evals
description: Run a full eval round on stellar-raven-codemode from Codex, Claude Code, or another CLI agent — pick the right instruments (routing gate, QA headline, agentic, plan, live-data), distinguish the orchestrating agent from the spawned answering and judge agents, record results, review every answer/verdict, triage failures to root cause, and file evidence-backed upstream service-improvement findings in improvements/. Use when asked to run evals, check gates, measure a scoring/catalog/executor change, review QA verdicts, understand eval model roles, or close an eval round. The primary artifact of every round is upstream findings, not the scores.
---

# Eval round — stellar-raven-codemode

This skill is agent-agnostic: it is a plain-markdown runbook. Claude Code invokes it as a
skill; Codex or any other CLI agent can be pointed at this file directly.

## North star

Every instrument answers one question at some layer:

> Does an agent driving this MCP end-to-end produce a correct, current, non-fabricated answer?

Two non-negotiables, from `eval/EVALS.md` and `improvements/README.md` (re-read both before
any round — they are the current truth; this skill is the orchestration around them):

1. **The scores are the instrument; the findings are the product.** This server's own tuning
   ceiling is single-digit points. The outsized leverage is discovering gaps in the four
   upstream surfaces (Lumenloop, Stellar Light/Scout, Stellar Docs, skill sources). A round
   that surfaces an upstream gap and doesn't file it in `improvements/` has dropped its most
   valuable output.
2. **One headline, two gates, everything else diagnostic.** Never merge lanes, never tune
   per-question, never promote a view to a gate without a Solo-recorded decision.

## Agent roles and model boundaries

Do not conflate the agent running this runbook with the model under test:

- **Orchestrating agent**: Codex/Claude Code/etc. in the repo. It starts servers, runs commands,
  records result stamps, joins rows with goldens, reviews transcripts, patches code/docs, and
  files findings. It is not the QA answer model being measured.
- **Answering agent**: spawned by `eval/qa/run-qa.mjs` once per QA case via headless
  `claude -p`. It only gets the MCP `search` + `execute` tools and produces the candidate
  user-facing answer. Default model: `claude-sonnet-5`, override with `--model`.
- **Judge agent**: spawned by `eval/qa/judge.mjs` to grade the candidate answer against the
  golden. Default model: `claude-sonnet-5`, override with `--judge-model`. Judge verdicts are
  evidence to review, not unquestionable truth.

There is no committed multi-model matrix unless the round explicitly creates one. Report the
answering model, judge model, sample/full-set size, and results-file stamp for every QA run.

## Clean Codex workflow

When asked to run evals "from this Codex agent", use this loop:

1. Run the preflight and selected instruments from this repo.
2. Let the eval runner spawn the answering and judge agents; do not answer cases manually from
   the orchestrating session.
3. Save and name the results file stamp(s).
4. Systematically review every `wrong` and `partial` row first; for a full closeout, review every
   row, including surprising passes.
5. Join each result row with its golden from `eval/qa/cases.json` before analysis.
6. Classify each issue with the Step 5 root-cause table.
7. Apply own-repo fixes where appropriate; file upstream findings in `improvements/`; use
   golden overrides only through the `golden-truth` workflow.
8. Update the committed eval record and close the round only after failures and learnings are
   accounted for.

## Step 0 — scope the round and set up tracking

Decide what changed (or what question you're asking) — that picks the instruments:

| Trigger | Run |
|---|---|
| Any scoring/catalog/manifest change | routing (`--gate`) — free, seconds, ALWAYS |
| Retrieval work (query decomposition, vocab, semantic) | routing; read the **extended lane** as the target metric, legacy 338 as the non-regression gate |
| Skills routing / skill store changes | routing; read the skills lane vs its floor |
| Major search-behavior change | + agentic lane (~$, minutes, needs live server) |
| Big change / A-B / before-after on answer quality | + QA battery sample (headline; ~$0.2–0.7/case, ~30 min per 30) |
| Executor / adapter / envelope changes | + QA live-data lane (`--cases eval/qa/live-cases.json`) |
| Tool-description / agent-prompt-surface change (tool descriptions, MCP instructions, nudges) | QA sample + plan regrade — behavior shifts, routing math doesn't |
| Any QA run already stored | + plan regrade (free, offline) |
| Upstream drift refresh landed | routing `--gate`; refresh `improvements/` statuses (drift is the natural checkpoint for `fixed-upstream` re-checks) and re-check `eval/qa/golden-overrides.json` entries — they cite live facts that rot; update with fresh evidence |
| Corpus-health cadence (periodic, no code change needed) | cross-question contradiction scan (corpus-internal, no live calls: flag golden pairs whose answers can't both be true — the ancestor corpora's dominant silent-drift failure; results + verified-consistent clusters + method all live in `eval/qa/consistency-register.json`) + a sampled refute-then-repair sweep (skeptic agent attacks a small sample of goldens' claims/citations with real tools, weighted toward freshness-sensitive + numeric/version claims and lower `confidence` tags — the strata where breaks concentrate; fixes go through the `golden-truth` skill) + re-verify any `dateContingentTraps` in the register whose trigger has passed. |

Tracking (Solo MCP — this repo's project binding is in CLAUDE.md): create or claim a todo for the round; open a scratchpad as
the round's working record (numbers, per-case notes, triage table, findings drafted). Repo
fixes discovered during the round become **their own Solo todos** — never `improvements/` files.

## Step 1 — preflight (always, free)

```sh
npm run eval:selftest           # grader math sanity — no src/ or catalog needed
npm run eval:compile            # corpus → eval/routing-cases.json (deterministic)
npm run eval:qa:compile         # only if running QA; add --sample 30 for the stratified sample
npm run eval:qa:selftest        # only if judging — 3 candidates vs 1 case, ~3 CLI calls
```

Compiles are deterministic and never touch the hand-authored supplements
(`eval/skills-cases.json`, `eval/build-question-overlay.json`, `eval/qa/live-cases.json`) —
those are load-time files, committed, and safe from recompiles. Generated files
(`routing-cases.json`, `qa/cases.json`, `plan/op-classes.json`) are never hand-edited.

## Step 2 — live server (only for QA / agentic / live-data lanes)

```sh
npx wrangler dev --port 8788 --host localhost
```

`--host localhost` is REQUIRED: the custom-domain routes make wrangler present request.url
as agents.stellar.buzz, so the `DEV_ALLOW_UNAUTHENTICATED` loopback gate never fires and
every request 401s. Routing/plan lanes need no server.

Readiness check before launching any lane (a plain GET on `/mcp` is not meaningful — probe
with a real MCP initialize):

```sh
curl -s -o /dev/null -w '%{http_code}' -X POST http://localhost:8788/mcp \
  -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"probe","version":"0"}}}'
```

Expect `200`. A `401` here means the `--host localhost` gotcha above bit you.

## Step 3 — run the instruments

```sh
# Routing (gate): prints legacy-strict, skills-lane, extended, accept-either tables
npm run eval:routing -- --gate            # exit 1 on gate breach or changed denominator

# QA headline (sample) — variant A = the shipped `search` tool
node eval/qa/run-qa.mjs --variant A --sample 30 --port 8788
# targeted smoke: --ids a,b,c ; collect-only: --no-judge ; overrides: --model/--judge-model

# QA live-data lane (grounding behavior; graded behaviorally, never on snapshot values)
node eval/qa/run-qa.mjs --cases eval/qa/live-cases.json --port 8788

# Plan regrade (offline, reads stored transcripts)
npm run eval:plan -- eval/qa/results/<stamp>-variantA.json

# Agentic lane (Claude Code only — Workflow harness): boot server, then invoke the
# Workflow tool with eval/agentic/workflow-agentic-routing.js and
# args {"port": 8788, "cases": [...]} mapped from eval/agentic/sample.json
# (id/question/expected_service). Codex fallback: skip, or drive sub-agents manually
# per eval/agentic/README.md "Method".
```

The QA runner is sequential (one agent + one judge call at a time). For orchestration,
prefer letting the runner own execution and spend agent effort on **review** (step 4);
if parallelizing across shards, keep one results file per shard and report lanes separately.

## Step 4 — gate verdicts and agentic review of results

**Gates first.** `eval/gates.json` holds the baselines (legacy 338 top-1/3/5 within ±1%,
skills-lane top-1 floor; grading rule v2 twin-aware). On a FAIL:
- If the change is a regression → fix or revert; don't rationalize.
- If the numbers moved legitimately (drift, deliberate policy change) → re-baseline:
  update `gates.json` **in the same commit** as the change that moved the numbers, decision
  recorded in Solo, and check per-case hit→miss regressions (zero-regression is the standard
  the last re-baselines held themselves to), plus the `$comment`/`note` provenance fields.

**QA verdicts are NOT ground truth — review them agentically before believing them.**
Known judge failure modes (from `eval/qa/README.md`):
- The judge can't see tool transcripts; transcript-invisible corpus-grounded specifics get
  misgraded as fabrication. The rubric's unverified-not-wrong rule covers this — but still
  **live-verify every `wrong` verdict** by re-executing the claim against the live service
  before counting it as an agent failure (past rounds have overturned the majority of a
  run's wrongs as judge artifacts).
- Judge variance: read `wrong` counts before `correct` counts; compare variants only on the
  same sample; re-judging is cheap (`rows[].answer` is saved — feed back through `judgeCase`).
  Never cross-compare runs judged under different rubric versions without a re-judge
  (`JUDGE_RUBRIC` in `judge.mjs` is the current version; verdicts carry a `rubric` stamp).
  The calibrated baseline of record lives in `eval/qa/README.md` ("Judging rubric" →
  calibrated record) — compare a new run against the re-judged baseline for the current
  rubric version, never against stale original verdicts in same-stamp files.
- Freshness cases: sourced drift from the golden snapshot is fine; confident unsourced
  contradiction is not. Expect a small floor of judge-vs-live disagreements.
- **Avoid-clause bypass of the rubric-v2 addendum**: a golden whose must-avoid item bans
  claims "beyond corpus support" (or similar evidence-support phrasing) lets a corpus-blind
  judge read "not in the golden" as "must-avoid matched" — re-criminalizing thorough
  retrieval despite the addendum. Treat any `wrong` verdict whose rationale cites an avoid
  item phrased in terms of corpus/evidence support as a suspect artifact until live-verified.

Fan out sub-agents for this review when the run is big: one per `wrong`/`partial` case, each
re-executing the disputed claims live (production or dev `execute`) and returning a verdict
+ evidence. Collect into the round scratchpad.

Results rows do NOT carry the `golden` field (`{id, question, tags, answer, transcript,
verdict, ...}` only) — reviewers working from rows alone can't see `golden.keyFacts`/`avoid`.
When extracting per-case review files, JOIN the golden from `eval/qa/cases.json` on id, e.g.:

```js
const golden = Object.fromEntries(cases.cases.map(c => [c.id, c.golden]))
// per row: { ...row, golden: golden[row.id] }
```

## Step 5 — triage every failure to its root cause

For each miss/wrong/partial (and each surprising pass), classify and route:

| Root cause | How to recognize | Where it goes |
|---|---|---|
| Judge artifact | live re-execution contradicts the verdict | round record; re-judge; rubric note if a new failure mode |
| Agent failure | tool use / synthesis genuinely wrong in transcript | round record; only actionable if a pattern → Solo todo (prompt/tool-shape) |
| Own-repo gap: scoring/catalog/executor/adapters/normalizers | search buried the right entry; envelope/normalizer misread a payload | **own-repo Solo todo** — never improvements/ |
| Eval-side gap: stale golden, mislabeled case, missing lane coverage | golden disagrees with live truth from the service's own mouth | Solo todo (goldens live in this repo); the fix lands as an `eval/qa/golden-overrides.json` entry (the corpus archive is verbatim/read-only) **via the `golden-truth` skill** (`.claude/skills/golden-truth/SKILL.md` — gospel changes need multi-source triangulation, never a single source class); freshness-drifting truth moves to the live-data lane as behavioral golden |
| **Upstream data/content gap**: missing fields, unordered arrays, empty lanes, extraction quality, stale skill content | correct agent + correct plumbing still can't answer from what the service returns | **`improvements/` finding** |
| **Upstream semantics/spec gap**: response contracts, error shapes, vocabulary, index tokenization/ranking | the service works but its self-description or behavior misleads any consumer, not just us | **`improvements/` finding** |

Anti-overfitting rules bind here: zero-hit routing cases stay failing until a *general*
mechanism fixes them; no query→service maps, no per-question vocabulary. If the only fix
you can imagine is case-specific, the case stays red and the note says why.

**"Do not act yet" bucket.** A finding backed by a single case goes into a named
monitor-only list in the round record, not into a fix. The bar for acting: the same
failure across 2+ unrelated cases, a contract mismatch, a reproducible infra bug, or
trace evidence the model was asked the wrong thing. (Prior-art rule from both ancestor
repos; it kept their improvement loops from chasing variance.)

**Prose-surface check — run it before proposing any prompt/description change.** When an
agent-failure pattern clears the acting bar and a wording fix looks tempting, first inventory
what the model was already told at the failure moment. The surfaces, nearest-to-failure first:
runtime guard/warning messages and `codemode.*` error strings (`src/executor/providers.ts`),
truncation footers (`src/policy/truncate.ts`), adapter hints (`src/adapters/`), `search`'s
`nextSteps`, tool descriptions + schema `.describe()` strings + `SERVER_INSTRUCTIONS`
(`src/mcp/tools.ts`), and catalog entry descriptions (generated — change `scripts/`, never
the manifest). Then route:

- Prose already teaches the behavior and the transcript shows the agent read past it →
  prefer a mechanism (fail-loud guard, exact-match error with the fix in the message,
  schema change) over more words; repeating ignored guidance across surfaces is clutter,
  not reinforcement.
- Prose is absent, wrong, or contradicts another surface → smallest wording change in the
  ONE surface closest to the failure moment.
- Catalog/manifest descriptions feed the lexical scorer — any change there re-runs the
  routing gates before landing (Step 0's instrument row for prompt-surface changes applies).

Measure prose changes like code changes: before/after on the same instrument, delta in the
round record. A prose edit with no measured behavior shift gets reverted, not accumulated.

**Override doctrine — overrides are stop-gaps wearing their provenance.** A
`golden-overrides.json` entry corrects the eval's *copy* of the truth; the defect that made
it necessary lives somewhere else and MUST be captured where it can actually get fixed:
upstream service gap → `improvements/` finding, eval-side authoring/rubric flaw → Solo todo,
plain freshness drift → named as such. An override without its root-cause capture is a patch
hiding a defect. This is compile-enforced (every entry needs `why` + live `evidence` +
`rootCause`; `compile-qa.mjs` refuses entries missing any) — but the enforcement only checks
the fields exist; the reviewer checks they're true.

## Step 6 — file the findings (the round's primary artifact)

Charter: `improvements/README.md`. One file per finding in the matching collection
(`lumenloop/`, `stellar-light-scout/`, `stellar-docs/`, `skills/`), next id in the
collection's `<prefix>-NNN` sequence. Frontmatter + three sections:

```
---
id: <collection>-NNN
service: lumenloop | stellar-light-scout | stellar-docs | skills
status: proposed | verified | reported-upstream | fixed-upstream
discovered: YYYY-MM-DD
evidence:
  - eval results-file stamp(s)
  - live verification note
  - Solo todo/comment ref
---
## Finding        (what's wrong, factually)
## Evidence       (stamps, paths, re-execution notes — reproducible by a stranger)
## Recommendation (the concrete upstream change — cheapest fix first, alternatives noted)
```

Quality bar (match the existing findings, e.g. `sls-005`):
- **Verified requires live re-execution evidence** — a judge's opinion alone never
  graduates a finding past `proposed`. Probe the live service yourself (production
  `execute` on free ops is the usual instrument) and record exactly what came back.
- Quantify prevalence ("4 of 11 completed events"), so upstream can judge routine vs edge.
- The Recommendation is written for the **service owner**: concrete, self-describing-data
  biased, with the consumer-side workaround this repo shipped noted (commit ref) so they
  see the cost of not fixing it.
- Skills findings target the **source repos**; never "fix" the mirror in this repo.
- Update existing findings rather than filing near-duplicates; refresh statuses when the
  daily drift refresh lands (a fix upstream → live re-check → `fixed-upstream`, residuals
  become successor findings, as sls-001 → sls-005).

Then push where it's clear how: when a finding is `verified` and the service has an obvious
intake (repo issues for skill sources, service owner contact, changelog feedback channel),
file it and flip to `reported-upstream` with the ref in `evidence`. If intake is unclear,
say so in the round record instead of letting the finding stall silently.

## Step 7 — close the round

Results JSONs are **local-only evidence** (`eval/**/results/`, gitignored). The committed
record is the READMEs — update the relevant lane README's results section with the exact
results-file stamp, the numbers table, and honest reading notes (report as-is; "nothing
tuned, numbers as-is" is the house style; caveats belong in the record, not omitted).

Close-out checklist:
- [ ] Gate verdict recorded (and `gates.json` re-baselined in-commit if legitimate)
- [ ] Lane README(s) updated with stamped results + reading notes
- [ ] Every failure triaged (step 5 table complete in the round scratchpad)
- [ ] New/updated `improvements/` findings committed — a round with zero findings needs an
      explicit "nothing new surfaced, here's what was re-checked" note to be credible
- [ ] Own-repo fixes filed as Solo todos (not improvements/, not silently patched)
- [ ] Any new/changed golden override carries live evidence + `rootCause` (compile enforces
      the fields; the reviewer verifies the substance) and its root cause is actually filed
- [ ] Solo round todo closed with a comment linking scratchpad + results stamps

## Hard rules (violating any of these invalidates the round)

- Lanes never merge; denominators never quietly change (`--gate` fails on that too).
- Headline = QA end-to-end; when two instruments disagree, the one closer to the headline wins.
- No per-question tuning, no foreign schemas/judge code from prior-art repos (spirit, not schema).
- Freshness-sensitive truth is graded as behavior, never pinned values in gates.
- Never print or commit secrets (`LUMENLOOP_API_KEY`, Algolia keys); paid Lumenloop research
  stays gated (dedup via `list_my_research`, budget cap, off by default) — eval runs use free ops.
- Sandbox/network posture is not relaxed for eval convenience.
