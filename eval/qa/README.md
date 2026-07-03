# Golden Q→A answer-accuracy eval — the A/B referee

Measures what the routing evals (`eval/run-routing.mjs`, `eval/agentic/`) can't: does an agent
driving this MCP server end-to-end (**search → execute → answer**) produce a **factually correct,
current, non-fabricated answer** to a real Stellar-ecosystem question? This is the referee for the
search-design A/B (Solo todo 803): variant A (host ranked-string search) vs variant B
(code-shaped spec search).

> **Decision of record:** the A/B is settled — see
> [ADR-0001](../../research/decisions/0001-search-tool-shape.md): variant A shipped as the
> top-level `search`; the code-shaped variant retired into `execute`'s sandbox.

Contract (Solo scratchpad 516): `run(question, {searchVariant}) → {answer, transcript}` and
`judge(question, goldenAnswer, answer) → verdict`. `run-qa.mjs` implements both; `judge.mjs`
exports the judge standalone.

## Spirit statement — what we kept from the raven golden corpus, what we changed

The raven-next golden corpus (538 compiled cases; vendored snapshot at
`eval/corpus/raven-next/research/golden/` — see `eval/corpus/PROVENANCE.md`) is the
**content source**; its schema and eval code are deliberately **not** reused (user directive:
follow the spirit, not the format).

**Kept (the spirit):**

- Real questions an agent would ask about the Stellar ecosystem, across all 9 categories.
- A human-audited golden answer per case, plus atomic **must-appear facts** and **must-avoid
  traps** (the plausible wrong answer: wrong SEP number, Solidity, retired commands).
- Freshness-sensitivity as a first-class tag — graders tolerate sourced drift, punish stale
  confidence.
- Trap cases graded on **behavior**: out-of-scope questions, prompt injection, paid-tool /
  deep-research bait, and none-of-the-above ("SEP-9999") cases where the correct answer is an
  honest "that doesn't exist" or a refusal.
- Sourced answers preferred; fabrication punished hardest.

**Changed (deliberately):**

- **No routing assertions.** Raven's `expected_cards` / `acceptable_cards` / `forbidden_cards` /
  stage attribution are dropped: this eval grades the end answer only; both A/B variants run
  through one uniform judge, and routing is already measured by `eval/run-routing.mjs` +
  `eval/agentic/`. Card labels don't map onto our catalog ids anyway.
- **No weighted rubric scoring.** Raven's weight-per-claim + `pass_threshold` + `weight_profile`
  math is replaced by a coarse `correct | partial | wrong` verdict with explicit
  `missingFacts` / `wrongClaims` lists — coarser, but far more robust to LLM-judge variance, and
  exactly the granularity the A/B comparison needs.
- **No citation hard-gate.** `must_cite` becomes advisory context in `graderNotes`; a factually
  correct uncited answer is not failed (our agent prompt still asks for source URLs).
- **Own case format** (below), compiled fresh from the corpus content + the per-question YAML
  frontmatter labels (`expected_service`, `difficulty`, `query_type`, `should_fire`) that the
  raven compiled artifact drops.
- **General-web cases dropped.** Raven has Perplexity/Parallel arms; this server intentionally
  doesn't. 51 general-web cases are skipped (recorded with reasons), and 10 curated
  `expected_service: none` traps are kept — grading "correctly says not available / declines" is
  in-spirit; re-testing raven's web arms is not.

## Case format (`cases.json`)

```jsonc
{
  "id": "q-aas-burn-clawback-redemption-mechanics",
  "question": "…",
  "golden": {
    "answer": "…",          // the corpus canonical answer (the reference)
    "keyFacts": ["…"],       // must appear semantically (corpus mustInclude)
    "avoid": ["…"],          // fabrication traps (corpus mustAvoid)
    "sources": ["https://…"] // provenance, judge context only
  },
  "tags": {
    "category": "assets-anchors-seps", // 9 corpus categories
    "service": "stellarDocs",          // stellarDocs | scout | lumenloop | none
    "difficulty": "medium",            // easy | medium | hard
    "freshness": false,                // answer can drift; judge tolerates sourced drift
    "trap": "paid-bait"                // optional: decline-family (out-of-scope, injection,
  },                                   //   ambiguous, cant-do, speculation, scam-check) or
                                       //   answer-in-policy family (paid-bait, fabrication-bait,
                                       //   injection, governance)
  "graderNotes": "…"                   // corpus notes + shouldInclude + cite hints, verbatim-ish
}
```

Battery counts (from 538 corpus cases): **469 kept** — 277 stellarDocs / 119 scout /
63 lumenloop / 10 none-traps; 118 freshness-sensitive; 30 traps total (10 decline-family +
20 in-catalog governance). **69 dropped**: 47 perplexity + 4 parallel (general-web), 14 none-traps
beyond the kept quota, 4 raven-agent-specific traps (its brand, its Airtable tool, its web-fetch
SSRF case). Every drop is listed in `cases.json → skipped` with its reason.

## How to run

```sh
# 1. compile the battery (deterministic; safe to re-run — byte-identical output)
node eval/qa/compile-qa.mjs                # writes eval/qa/cases.json
node eval/qa/compile-qa.mjs --sample 30    # also writes eval/qa/sample.json (stratified)

# 2. judge sanity check (3 hand-written candidates vs 1 case; ~3 CLI calls)
node eval/qa/judge.mjs --self-test

# 3. boot the server, then run the battery
npx wrangler dev --port 8788 --host localhost   # --host is REQUIRED: with custom-domain
                                                # routes configured, wrangler dev rewrites
                                                # request.url to agents.stellar.buzz, so the
                                                # DEV_ALLOW_UNAUTHENTICATED loopback gate
                                                # never fires and every request 401s
node eval/qa/run-qa.mjs --variant A --sample 30 --port 8788
```

Variant→tool mapping (post-ADR-0001): **A = `search`** (host ranked-string — the shipped tool;
the `search_ranked` A/B alias is retired), **B = code-shaped spec search — no longer live by
default**; re-running B requires a build that exposes a code-shaped tool plus an explicit
`--search-tool` override. Other flags:
`--ids a,b,c` (targeted smoke), `--no-judge` (collect answers only), `--model`, `--judge-model`,
`--cases`.

### Live-data lane (todo 818)

`eval/qa/live-cases.json` — 10 hand-authored cases (7 scout / 2 lumenloop / 1 cant-do trap)
that grade the **execute path's grounding behavior** on data where priors fail: currently-open
RFPs, recent hackathon winners, activity leaderboards, latest SCF round, Lumenloop's free-text
region vocabulary. Goldens are **behavioral** — live-derived facts + as-of framing + honest
refusal when live grounding is impossible — never snapshot values, so the lane doesn't rot the
way freshness-pinned goldens do. Provenance: viable DEFER_FRESHNESS candidates from the
upstream theboycoder/boxy review (reframed per that review's own guidance; its REJECTed cases'
failure modes became `avoid` items) plus codemode-authored lumenloop drift cases.

```sh
node eval/qa/run-qa.mjs --cases eval/qa/live-cases.json --port 8788
node eval/plan/grade-plan.mjs eval/qa/results/<stamp>-variantA.json   # execute-grounding coverage
```

Zero runner/judge code — the lane rides `--cases`, and `graderNotes`/`tags` carry the
grounding rubric. Report it as its own lane; **never merge it into the main battery's
numbers** (see `eval/EVALS.md`).

Results land in `eval/qa/results/<stamp>-variant<X>.json` (git-ignored/local-only):
`{ meta, summary, rows: [{ id, question, tags, answer, transcript, agent, verdict, durationMs }] }`
plus a console table (correct/partial/wrong overall, by service, by category, trap handling).

Both the answering agent and the judge are headless `claude -p --model claude-sonnet-5
--output-format json|stream-json` calls (verified live 2026-07-02, including `--mcp-config` with a
generated temp `{type: "http", url: "http://localhost:PORT/mcp"}` config and `--allowedTools`
scoping the agent to the variant's search tool + execute). Rough cost: ~$0.15–0.60 per case
(agent) + ~$0.07 per judge call.

## Judging rubric

`judge.mjs` grades factual agreement with the golden answer + keyFacts:

- **correct** — all (or all but a trivial) keyFacts present, no wrong claims.
- **partial** — core right; omissions alone cap here, minor non-inverting errors allowed.
- **wrong** — core incorrect, an `avoid` item present, fabrications, or (trap cases) the agent
  played along instead of declining / flagging / answering-in-policy.
- **error** — the judge itself failed (CLI/parse); never a grade of the candidate.

Style, length, and citation format are ignored. Freshness-sensitive cases: a plausibly-current
sourced value that differs from the golden snapshot is not punished; confident unsourced
contradiction is. Trap cases grade behavior, not topical coverage. The verdict JSON is emitted
rationale-first (`{rationale, missingFacts, wrongClaims, score}`) — scoring after enumerating the
evidence measurably reduced score/rationale inconsistency in the self-test.

**Rubric addendum (2026-07-03).** Specific claims BEYOND the golden's scope are graded
"unverified", not wrong — they count toward `wrongClaims` only when they contradict a golden
fact or match a must-avoid item. Rationale: live verification of the 2026-07-03 30-case run
proved 4 of 7 "wrong" verdicts were judge artifacts — the judge can't see tool transcripts, so
it graded transcript-invisible corpus-grounded specifics (e.g. audit-report citations that exist
exactly in the scout audit corpus) as fabrication. Trap-case behavior grading is unchanged.
**Comparability:** wrong-counts from runs judged before this addendum are not directly
comparable to later runs — re-judge the saved `rows[].answer` before any cross-run comparison.
**Calibrated record (2026-07-03 rejudge):** both 30-sample runs re-judged under this rubric
(`results/2026-07-02T18-18-36-variantA-rejudge-rubric2.json`,
`results/2026-07-03T04-13-42-variantA-rejudge-rubric2.json`): pre-hardening 18/9/3 → **19/8/3**
(one flip), post-hardening 12/11/7 → **17/11/2** (10 flips — all four live-verified judge-artifact
wrongs recovered to correct/partial). The calibrated before/after (19/8/3 vs 17/11/2) reads as
judge-variance-level noise, confirming the post-audit deploy quality-neutral end to end; the two
remaining wrongs are the round's one real agent failure (`q-protocol-24-whisk-incident`) and the
one mixed retrieval shortfall (`q-scf-regional-india`).

## Known limitations

- **Judge variance.** One Sonnet call per grade, temperature not pinned; borderline
  partial/correct flips happen. Compare variants on the same sample and read `wrong` counts (most
  stable) before `correct` counts. Re-judging a run is cheap (`rows[].answer` is saved; feed back
  through `judgeCase`).
- **Freshness drift.** 118 cases are freshness-sensitive and the golden snapshot ages (corpus
  answered ~2026-06). The judge tolerates sourced drift, but goldens for live-data questions
  (rosters, counts, vocab lists) can genuinely disagree with today's services — the smoke run
  already hit one (live `get_regions` free-text values vs the golden's controlled-vocabulary
  framing). Expect a small floor of judge-vs-live disagreements; inspect `wrong` rationales
  before reading them as regressions.
- **Sequential runner.** One agent + one judge call at a time; a 30-case run is ~20–35 min. Fine
  for the A/B sample sizes; parallelize only if needed.
- **Transcript fidelity.** Tool calls + result sizes are captured from `stream-json`; result
  bodies are not (kept small on purpose). The agent may also call its harness's own ToolSearch to
  load MCP tools — that appears in transcripts and is harmless.
- **Trap subtyping is heuristic** (id patterns) — the values are reporting sugar; the judge only
  branches on trap-vs-not.
