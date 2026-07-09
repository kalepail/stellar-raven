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
    "confidence": "high",              // corpus curator's ground-truth confidence: high | medium
                                       //   | low (their phase-4 review); omitted when unstated
    "freshness": false,                // answer can drift; judge tolerates sourced drift
    "freshnessHorizon": "quarterly",   // corpus drift cadence, verbatim (weekly, quarterly,
                                       //   protocol-release, docs-release, …); omitted when the
                                       //   source says null — stated iff freshness-sensitive
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
SSRF case). Every drop is listed in `cases.json → skipped` with its reason. Golden confidence:
356 high / 111 medium / 2 low (corpus curator's own rating — medium means "spot-check before
relying on as stable ground truth"). Freshness horizons (stated on exactly the 118
freshness-sensitive cases): 42 quarterly / 29 weekly / 19 protocol-release / 13 docs-release /
10 monthly / 2 yearly / 1 each annual, realtime, scf-round.

**Golden overrides (`golden-overrides.json`).** The vendored corpus is a verbatim read-only
snapshot (`eval/corpus/PROVENANCE.md`), so live-verified golden corrections land in
`eval/qa/golden-overrides.json` — a hand-authored, committed, load-time supplement (same
pattern as the routing overlay). `compile-qa.mjs` applies each entry after case assembly:
per-field replacement of `golden` subfields plus `graderNotesAppend` (preserving the original
review trail); applied ids are recorded in `cases.json → overrides`, stale ids warn at compile
time.

**Gospel changes go through the golden-truth skill.** Any change to golden *content*
(`answer`/`keyFacts`/`avoid`/`sources`/`graderNotes`) follows
`.claude/skills/golden-truth/SKILL.md`: classify the truth domain (real-world vs
corpus-grounded vs freshness), triangulate across independent source classes (primary docs,
source code, live services, general-web research via perplexity/parallel, docs index — the
aggregator never corroborates itself), and encode by verdict — confirmed facts may pin
(with `asOf` when volatile), **disputed facts are never pinned**, unverifiable facts are
never claimed. Entries must carry `truthDomain` + a `corroboration` matrix (compile-enforced
alongside `why`/`evidence`/`rootCause`).

**Consistency register (`consistency-register.json`).** The corpus's cross-question
contradiction log. Both ancestor corpora's dominant silent-drift failure was pairs of goldens
that individually pass verification but cannot both be true, so each sweep clusters cases by
shared entities/ids, compares their numeric/status claims against each other (corpus-internal
— no live calls), and records contradictions (→ golden-truth review), tensions (→ grader
caution), and verified-consistent clusters. Settled clusters are not re-litigated in later
sweeps unless a member case changed; overridden cases (`cases.json → overrides.applied`) are
the more-verified side in any conflict. Re-run method is in the file's `$comment`. First
sweep 2026-07-03 (todo 829): 102 clusters examined → 1 contradiction, 5 tensions, 17
verified-consistent clusters.

**Overrides are stop-gaps, not fixes.** An override corrects the eval's *copy* of the truth;
the defect that made it necessary lives somewhere else and must be captured where it can
actually get fixed — an upstream service gap goes to `improvements/`, an eval-side
authoring/rubric flaw goes to a Solo todo, plain freshness drift gets named as such. This is
enforced structurally: every entry must carry `why` (what was wrong), `evidence` (live
re-execution provenance — a judge's opinion alone never justifies an override), and
`rootCause` (non-empty: `improvements/` paths, `solo://` refs, or an explicit eval-side
rationale), and **the compile refuses entries missing any of the three**. The integrity risk
this guards against is score laundering — "correcting" a golden until the agent's answer
grades right; the live-evidence bar plus the root-cause pointer keep every override auditable
back to a defect that exists independently of the eval score. Entries are re-checkable on
later rounds: when facts drift or the root cause is fixed upstream, update the entry with
fresh evidence rather than letting it rot. First entries (2026-07-03, todo 827):
`q-scf-regional-india` (under-enumeration + support-relative avoid clause → concrete traps;
root causes: todo 826 rubric artifact + freshness drift) and
`q-ti-rpc-gettransactions-pagination-xdr` (false 200-is-Horizon-only premise; live method
page says RPC getTransactions is 1–200 hardcoded, default 50 — root cause
`improvements/stellar-docs/sd-003`).

## How to run

```sh
# 1. compile the battery (deterministic; safe to re-run — byte-identical output)
node eval/qa/compile-qa.mjs                # writes eval/qa/cases.json
node eval/qa/compile-qa.mjs --sample 30    # also writes eval/qa/sample.json (stratified)

# 2. judge sanity check (4 hand-written candidates vs 1 case; ~4 CLI calls —
#    incl. the rubric-v2.1 support-relative-avoid regression guard)
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

### Canonical live-data lane and opt-in digest supplement (todos 818, 806, 913)

`live-data-canonical-v1` is `eval/qa/live-cases.json`: the membership-frozen **10-case** execute-grounding
lane (7 Scout / 2 Lumenloop / 1 cant-do trap). It covers currently-open RFPs, recent hackathon
winners, activity leaderboards, latest SCF round, Lumenloop's free-text region vocabulary, and
the honest out-of-scope control. Membership/order comes from `eb412bd^`, before the denominator
drift. Content is the current vetted state: specifically, `6fed730` deliberately updated
`q-live-hackathon-recent-winners` for Scout's self-describing `winnersRanked` and
`placementRank` fields alongside rubric v2.2; reverting to the older bytes would restore stale
truth. `eval:selftest` pins the complete chosen case array, not only its ids.

`live-digest-supplement-v1` is `eval/qa/live-digest-supplement-cases.json`: an opt-in **2-case**
Lumenloop recency-digest supplement (`q-live-digest-rwa-recent` and
`q-live-digest-blend-coverage`). It was authored for the skill.run experiment and is not part of
the canonical live-data denominator. Its complete two-case array is independently digest-pinned.
Run, stamp, cost, and report it separately.

Both contracts use **behavioral** goldens — live-derived facts + as-of framing + honest refusal
or quiet-window handling — never snapshot values, so they do not rot the way freshness-pinned
goldens do. Canonical provenance: viable DEFER_FRESHNESS candidates from the upstream
theboycoder/boxy review (reframed per that review's own guidance; its REJECTed cases' failure
modes became `avoid` items) plus codemode-authored Lumenloop drift cases. Digest-supplement
provenance is recorded in `research/skill-run-design.md` §10 and each case's grader notes.

```sh
node eval/qa/run-qa.mjs --cases eval/qa/live-cases.json --port 8788
node eval/plan/grade-plan.mjs eval/qa/results/<canonical-stamp>-variantA.json

# Opt-in; a different named contract and result stamp:
node eval/qa/run-qa.mjs --cases eval/qa/live-digest-supplement-cases.json --port 8788
node eval/plan/grade-plan.mjs eval/qa/results/<supplement-stamp>-variantA.json
```

Zero contract-specific runner/judge code — both ride `--cases`, `run-qa.mjs` records the JSON
`contract` as `meta.caseContract`, and `graderNotes`/`tags` carry the grounding rubric. The
contract files record provenance plus the expected `sha256(JSON.stringify(cases))`; changing a
question, golden, tag, or grader note requires an explicit version bump and digest update. Report
each as its own lane; **never merge either into the main battery or each other**. Historical
12-case runs are explicitly “canonical + supplement”, not canonical-lane results (see
`eval/EVALS.md`).

Results land in `eval/qa/results/<stamp>-variant<X>.json` (git-ignored/local-only):
`{ meta, summary, rows: [{ id, question, tags, answer, transcript, agent, verdict, durationMs }] }`
plus a console table (correct/partial/wrong overall, by service, by category, trap handling).

Both the answering agent and the judge are headless `claude -p --model claude-sonnet-5
--output-format json|stream-json` calls (verified live 2026-07-02, including `--mcp-config` with a
generated temp `{type: "http", url: "http://localhost:PORT/mcp"}` config and `--allowedTools`
scoping the agent to the variant's search tool + execute). Rough cost: ~$0.15–0.60 per case
(agent) + ~$0.07 per judge call, so the membership-frozen canonical 10 costs about **$2.20–6.70** and the
two-case digest supplement about **$0.44–1.34**. These are separate budgets and result stamps.

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

**Results — 2026-07-03 post-nudge checkpoint** (`results/2026-07-03T16-06-45-variantA.json`,
same 30-case sample, rubric v2 native, post-op-keywords catalog + execute-description
progression nudge): **20 correct / 9 partial / 1 wrong / 0 errors** (81.7% weighted) — best run
on this sample; traps 2/2, stellarDocs 15C/3P/0W. Agentic review (every wrong/partial
live-re-executed, Solo scratchpad 521) **overturned the one wrong** — `q-scf-regional-india`'s
"fabricated" events all exist verbatim in the live corpus — so the round has zero true agent
wrongs; `q-protocol-24-whisk-incident` (the prior round's real failure) graded correct. All 9
partials upheld; root causes: 4 mild agent synthesis/scoping slips, 3 upstream data gaps
(sls-007 new, sk-001/sk-002 recurrences), 1 upstream retrieval gap pair (ll-006 + sls-006),
1 wrong golden (todo 827).

**Results — 2026-07-06 post-round-5 checkpoint** (`results/2026-07-06T18-48-22-variantA.json`,
same 30-case sample, rubric v2.1 native, post-round-5 catalog/tool-surface — tier marker +
total/truncated + filter validation, describe-as-detail-step + signature stubs, alias lever 6):
**20 correct / 9 partial / 1 wrong / 0 errors — aggregate-identical to the 07-03 post-nudge
best run.** Per-case, 9 flips netting zero (4 c→p, 3 p→c, 1 p→w, 1 w→c); rubric moved
v2→v2.1 between runs, so per-case flips carry judge variance — the aggregate identity is the
robust signal that round 5 is headline-neutral. Traps 2/2; stellarDocs 13C/5P/0W. Plan regrade:
29/30 requiredCovered, onPlanRatio 1.00; the 11 progression-expected cases split used 4 →
3C/1P/0W vs skipped 7 → 3C/3P/1W (small-n, consistent with the progression guidance mattering).
Agentic review (every wrong/partial live-re-executed by 10 sub-agents, workflow wf_01b3347d-1b8,
Solo scratchpad 531) **overturned 2 of 10 as judge artifacts** (both RWA-freshness cases:
transcript-blind fabrication call on a verbatim-sourced roundup quote; an "e.g."-list keyFact
gated against its own crediting rule) → calibrated read 22C/7P/1W. The 1 wrong stands but is an
**upstream data gap, not an agent failure** (`q-scf-current-round`: the agent faithfully quoted
scout's brand-new scfRound meta, which was two rounds stale against its own verifyAt source —
filed as sls-014). Other root causes: 3 isolated agent slips (no common shape — monitor-only),
1 mixed truncation-clip (monitor-only, 1 case), upstream gaps filed as sd-005 (AP2/ACP landscape
absent), sd-006 (Algolia strips code blocks — CLI install commands unanswerable from the index),
ll-010 (unscoped roundup RWA milestones), sk-001 recurrence.

**Results — 2026-07-07 truncation cap A/B and artifact-lane checkpoint** (focused truncation-prone
set: 5 cases selected from the then-combined canonical + digest-supplement file, plus 2
main-battery cases, all `variantA`, answering/judge model
`claude-sonnet-5`, judge rubric v2.2). Baseline used the committed/default
`EXECUTE_MODEL_BOUNDARY_MAX_TOKENS=6000`; experiment used a local `.dev.vars` override
`EXECUTE_MODEL_BOUNDARY_MAX_TOKENS=12000` with Solo `dev` restart before each condition. Stamps:
6000 live `results/2026-07-07T17-41-13-variantA.json` (plan
`results/2026-07-07T17-41-13-variantA.plan.json`), 6000 main
`results/2026-07-07T17-42-27-variantA.json` (plan
`results/2026-07-07T17-42-27-variantA.plan.json`), 12000 live
`results/2026-07-07T17-51-00-variantA.json` (plan
`results/2026-07-07T17-51-00-variantA.plan.json`), 12000 main
`results/2026-07-07T17-51-59-variantA.json` (plan
`results/2026-07-07T17-51-59-variantA.plan.json`). Reading after transcript review:
6000 live was original judge **4C/1W** but the one wrong (`q-live-digest-blend-coverage`) was a
judge artifact, so the answer-quality read is **5C**; 6000 main was **2C**. 12000 live was
**4C/1P**; the partial was a real over-inference in `q-live-digest-blend-coverage` (`re-published`
relationship not literally present). 12000 main was **2C**. Cost/latency/composition: 6000 live
26 tool calls / 11 execute calls / 0 execute failures / 3 truncated execute results / ~$0.723 /
mean ~58s; 6000 main 10 tool calls / 7 execute calls / 1 execute failure / 2 truncated results /
~$0.295 / mean ~35s; 12000 live 23 tool calls / 11 execute calls / 1 execute failure /
2 truncated results / ~$0.847 / mean ~77s; 12000 main 8 tool calls / 3 execute calls /
0 execute failures / 1 truncated result / ~$0.247 / mean ~28s. Decision: keep the committed
default at 6000 and keep the bounded host-side override (1000..32000) for measured experiments
or clients with larger context windows. A blind default cap raise did not improve the live lane
after transcript review and was slower/more expensive there; the product direction is bounded
model-lane output plus artifact/source-basis mechanisms rather than prompt stuffing or a simple
cap raise. Production telemetry at the design checkpoint supported that split: 7-day Cloudflare
Workers Observability showed 280 execute events, 20 result truncations (~7.1%), and 0 log or error
truncations (last 24h: 141 execute events, 6 result truncations, 0 log/error truncations). That is
a real payload-heavy failure mode, not a universal execute-path failure, and it justified the
result-only artifact/source-basis lane.

**Judge-artifact lessons from the 2026-07-07 truncation round.** First, the
`q-live-hackathon-recent-winners` golden notes were stale after Scout fixed hackathon placement
fields: live detail now carries `winnersRanked:true`, `hackathonPlacement`, and numeric
`placementRank`, so exact placements are allowed only when those fields are present; the durable
behavioral rule is encoded in `live-cases.json`. Second, the digest-supplement case
`q-live-digest-blend-coverage` exposed
long/truncated transcript evidence dilution: the saved execute result already contained the source
summaries the v2.2 judge called invented (`Templar`, `backstop LP market migration`,
`February Blend hack`, `GAMI Capital`, `State Capital`, `Untangled Vault`, `OctoLend`,
`Stellar Indexer SDK`, `Stellar Wallets Kit`). That case led to the v2.3 source-basis evidence
pack described below; keep the detailed rubric mechanics there rather than duplicating them in
result records.

**Results — 2026-07-07 artifact/source-basis lane ship round** (todo 870; rubric v2.3 throughout,
answering/judge claude-sonnet-5; dev server on the artifact-lane build with the loopback
`dev-local` owner active). Routing gate PASS (`eval/results/routing-2026-07-07T19-13-48-644Z.json`).
Same-rubric baseline: the stored 6000-cap rows re-judged under v2.3 read live-5 = 5 correct
(blend-coverage wrong→correct via the v2.3 pack; one identical-input variance flip on
hackathon-winners, monitor-only), main-2 = 2 correct. Experiment: live-5
`results/2026-07-07T19-26-06-variantA.json` original 3C/2P, main-2
`results/2026-07-07T19-27-04-variantA.json` 2C. Both experiment partials live-verified as judge
artifacts (disputed specifics verbatim in tool results — hackathon prize split in description
prose + `submissionCount`, Blend incident specifics in article bodies); the fix is the todo-873
claim-anchored pack extension, under which both rows re-judge correct. Corrected reading: live-5
5C, main-2 2C — neutral-or-better on the payload-heavy class with `codemode.artifact.read` used
in 4/5 live cases (blend 4×), 3 recoverable execute slips (two malformed tool calls, one
envelope-path misread the fail-loud guard recovered), no main-battery regression. Ship gate PASS.
Closing sample-30 battery `results/2026-07-07T19-58-35-variantA.json`: **19 correct / 11 partial /
0 wrong / 0 error** (judged pre-873-pack by module cache; immaterial to untagged rows). Partial
review: 7 legitimate completeness partials (heterogeneous golden-nuance omissions, do-not-act
bucket); 4 wrong-claim partials → sk-001 recurrence (stale wasm target read from the mirrored
skill), sk-002 recurrence (reentrancy claim, same source), sls-017 filed (LOBSTR XRPL support
omitted from directory records), and one stale golden (q-soroban-storage-types: post-P23
auto-restore semantics) corrected via the golden-truth workflow (CAP-0066 triangulation; docs
ambiguity filed as sd-007). Under the corrected golden that stored row re-judges wrong, honestly:
the candidate had Instance auto-restore right but still described Persistent as
RestoreFootprintOp-only — a genuine failure whose root cause is the sd-007 docs ambiguity, which
the old golden had masked by encoding the same stale belief. Numbers as-is, nothing tuned.

**Calibrated record (2026-07-07 v2.4/p3 noise floor, todo 876).** The stored 30-row run above was
re-judged three times under final rubric `v2.4` + evidence pack `p3`
(`results/2026-07-07T19-58-35-variantA-rejudge-v2.4-p3-pass1.json`,
`...pass2.json`, `...pass3.json`): pass 1 **20C/7P/3W**, pass 2 **20C/7P/3W**,
pass 3 **21C/7P/2W**. Per-row any-flip rate was **7/30 = 23.3%**:
`q-eco-wallets-overview` p/p/c, `q-edge-1xlm-activation-fee` p/c/p,
`q-protocol-tier1-org-list` p/p/c, `q-soroban-reentrancy` w/w/p,
`q-soroban-storage-types` w/w/p, `q-ti-cli-rust-windows-troubleshooting` c/p/p,
`q-tool-cli-install` p/p/w. Pairwise score disagreement was **14/90 = 15.6%**.
The committed monitor-only noise floor is the stricter per-row number, **23.3%**: isolated
single-run score movement at or below that scale is variance until confirmed by live transcript
review or a repeated mechanism. The three passes cost $8.51 reported judge CLI cost total.

MissingFacts clustering over those same three v2.4/p3 pass files (`cluster-missing-facts.mjs`)
found 45 missingFacts: version/number 15, other 13, caveat 7, enumeration-tail 6,
cross-source corroboration 4. The result confirms heterogeneity rather than one systematic
synthesis-depth class: the largest bucket is only one third of the facts and spans six unrelated
cases; enumeration-tail/caveat/corroboration omissions are real but not yet a mechanism candidate.
The full stored-row judge-regression gate remains deliberately deferred because committed replay
fixtures conflict with the repo's results-local-only convention.

**Results — 2026-07-09 truth-maintenance checkpoint** (todo 900; answering/judge
`claude-sonnet-5`, rubric v2.4 / pack p3, dev server on the shipped P1 discovery-guidance build).
The post-P27 focused smoke
`results/2026-07-09T19-25-25-variantA.json` covered eight P27/Zipper/release cases and scored
**0 correct / 3 partial / 5 wrong / 0 error**. Every answer and verdict was manually reviewed.
The misses are real: exposed docs repeatedly called P26 current, treated the completed July 8 vote
as unconfirmed, omitted the P27 history/activation tail, or denied CAP-0071 delegation; release
answers recovered only part of the live tag/status contract. No golden was weakened to match stale
retrieval. The official Software Versions lag and measured consumer impact are recorded in
`improvements/stellar-docs/sd-008`; the eight local goldens were independently re-verified and
corrected through the golden-truth workflow. The behavior-gated edge row was compiled after the
smoke with a post-vote example; manual re-grade leaves its saved verdict wrong because the candidate
still asserted a version without the required staleness caveat.

Fresh sample-30 `results/2026-07-09T19-53-07-variantA.json`: **20 correct / 8 partial / 2 wrong /
0 error**; plan regrade `results/2026-07-09T19-53-07-variantA.plan.json`: **28/30 requiredCovered
(93%), mean onPlanRatio 0.98**. This score sits inside the committed v2.4/p3 noise floor and does not
justify a full 469-case run. Review of all ten non-correct verdicts found no judge artifacts. The two
wrongs are genuine: `q-sep-6-24-deprecation` denied the SEP-0006 status note that interactive
components are deprecated in favor of SEP-24 (upstream docs parity gap filed as `sd-009`), and
`q-tool-cli-install` invented a Stellar “SVM” version manager despite otherwise retrieving the
correct install commands (answer-synthesis error, no upstream finding). The eight partials are
heterogeneous omissions or one timeline imprecision, not a shared regression mechanism. Outcome:
headline checkpoint and plan gate complete; prioritize upstream findings and risk-weighted corpus
maintenance rather than spending on an archival/full-battery score.

**Second judge-artifact class (2026-07-03 evening, Solo todo 826):** the rubric-v2 addendum can
be bypassed by **avoid-clause phrasing** — a golden must-avoid banning claims "beyond corpus
support" makes a corpus-blind judge read beyond-golden specifics as avoid-matched, wrong again.
Treat any wrong verdict whose rationale cites a support-relative avoid item as suspect-artifact
until live-verified.

**Rubric v2.1 (2026-07-03, todo 826) — avoid-clause scoping.** The fix for the class above,
shipped in the judge prompt: must-avoid items bind only on what the judge can check from the
candidate answer itself — **concrete wrong content** (named wrong entity, retired command, wrong
number/date/version, specific false statement) or an **answer-visible sourcing condition**
("without a dated source": the judge can see whether the candidate gave one). Avoid items
conditioned on support the judge CANNOT see — corpus, reviewer verification, cited records
("beyond corpus support", "not verified by the reviewer") — are advisory and never generate
`wrongClaims` by themselves. Verdicts now carry a `rubric` field (`JUDGE_RUBRIC` exported from
`judge.mjs`), and the self-test includes a regression candidate for exactly this artifact (a
support-relative avoid item + a beyond-golden specific must still grade correct).
**Comparability:** same rule as the v2 addendum — re-judge saved `rows[].answer` before any
cross-rubric-version comparison. The calibrated v2 record above (the two `rejudge-rubric2`
files, 19/8/3 and 17/11/2) remains the baseline of record until a v2.1 re-judge supersedes it;
do not diff a v2.1 run against pre-v2.1 verdicts directly.
**Golden hygiene:** `npm run eval:qa:lint` (`eval/qa/lint-goldens.mjs`, warn-only, never a gate)
flags support-relative phrasing in avoid lists in two tiers mirroring the judge rule —
`judge-blind` findings (the artifact class) should be rewritten to concrete traps;
`sourcing-guard` findings (answer-checkable) are informational and allowed.

**Verification re-judge (2026-07-03, todos 826+827 closure):** the two overridden cases'
saved answers from `2026-07-03T16-06-45` re-judged under corrected goldens + rubric v2.1:
`q-scf-regional-india` **wrong → correct** (zero wrongClaims; the judge explicitly applies the
unverified-not-wrong rule to the beyond-golden India events — the artifact class is closed),
and `q-ti-rpc-gettransactions-pagination-xdr` **partial → wrong** — correctly so: the agent
genuinely denied the RPC-side 200 cap (the sd-003 indexing gap), a real failure the old golden
masked by encoding the same false belief. The 16-06-45 headline stays as recorded (rubric v2 +
pre-override goldens); this re-judge is closure evidence, not a re-headline.

**Rubric v2.2 (2026-07-07, todo 865) — compact transcript evidence for live/freshness judging.**
Live-data and freshness cases can hinge on whether a candidate's answer-visible sourcing condition
was actually satisfied by a returned field (for example, "ranked via `placementRank`"). The judge is
still grading the final answer, but `run-qa.mjs` now passes the tool transcript into `judgeCase`,
and `judge.mjs` includes bounded execute-result excerpts only for live/freshness-style cases. The
evidence is intentionally compact and non-exclusive: shown fields can support or contradict a claim,
but omitted fields are not proof of absence. This fixes the judge-artifact class where a stale prior
about an old API shape caused transcript-supported live claims to be marked fabricated. Comparability:
as with v2/v2.1, re-judge saved answers before comparing wrong counts across this rubric boundary.

**Rubric v2.3 (2026-07-07, todo 871) — source-basis packs for long/truncated live-data transcripts.**
The v2.2 excerpt mechanism could still miss evidence when an execute result was long or truncated:
one focused digest-supplement row (`q-live-digest-blend-coverage`,
`results/2026-07-07T17-41-13-variantA.json`) was judged wrong even though the saved execute result
contained the disputed source summaries. v2.3 replaces ad hoc snippets with a deterministic
source-basis evidence pack for explicitly tagged live/freshness cases only. The pack mirrors the
artifact/source-basis lane's philosophy on the eval side: summarize execute-result shape, list
execute call outcomes and sanitized canonical URLs, parse source-like items (`title`/`url`/`date`/
`summary`), rank them by overlap with candidate/golden terms, label them data-derived/untrusted,
and enforce a hard post-serialization char budget. Packed URLs are sanitized, so stripped query or
fragment text is not contradiction evidence. Non-live/non-freshness cases still receive no transcript
evidence unless explicitly tagged for it. Todo 873 extended the same v2.3 pack format with
claim-anchored snippets: salient candidate-answer claims (amounts, numbers, durations, percentages,
proper-noun phrases) are matched against raw transcript result text so non-source-shaped prose can
support the answer without dumping whole payloads. **Comparability:** this is a prompt/rubric
semantic change relative to v2.2
(`JUDGE_RUBRIC=v2.3`); do not compare v2.3 wrong counts against v2.2/native stored verdicts without
re-judging the saved answers under v2.3. For same-rubric v2.3 rows judged before todo 873, targeted
rejudge is still needed when the pack shape matters.

**Rubric v2.4 + pack p3 (2026-07-07, todo 876) — evidence-pack integrity counter-pressure.**
The claim-snippet pack now removes case-literal proper-noun subjects generically instead of using
case constants, boundary-matches numeric/amount claims so `2,000` cannot match inside `12,000`,
and restricts claim snippets to execute results only. `PACK_VERSION` is exported from
`evidence-pack.mjs` as `p3`; every judge verdict carries `{rubric, packVersion, promptSha256}`,
where `promptSha256` hashes the fully interpolated judge prompt, and `run-qa.mjs` stores each row's
evidence-pack SHA-256 and character count. **Comparability:** compare stored rows only when the
rubric, packVersion, and promptSha256/pack-hash semantics match, or re-judge saved answers under
the target tuple. The v2.4 self-test includes contradiction and numeric false-support
counter-pressure fixtures plus the todo-865 untagged transcript-evidence negative guard.

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
- **Golden confidence is not uniform.** 113 kept cases carry the corpus curator's own
  `confidence: medium|low` rating; agentic verdict review should prioritize skepticism there — a
  medium-confidence golden contradicting an agent answer deserves a golden-truth check
  (`.claude/skills/golden-truth/SKILL.md`) before grading the agent wrong.
- **Sequential runner.** One agent + one judge call at a time; a 30-case run is ~20–35 min. Fine
  for the A/B sample sizes; parallelize only if needed.
- **Transcript fidelity.** Tool calls + result sizes are captured from `stream-json`; execute result
  bodies are captured after the server-side model-boundary cap, which is why composition analysis can
  detect truncation footers. The judge sees only compact source-basis packs for live/freshness cases,
  not full payloads. The agent may also call its harness's own ToolSearch to load MCP tools — that
  appears in transcripts and is harmless.
- **Long/truncated live-data evidence dilution.** v2.3 source-basis packs reduce the known failure
  mode where relevant source summaries were present in a saved execute result but buried in a long
  or truncated payload. They do not make the judge omniscient: the pack is still bounded, rank-based,
  and extracted from already-capped transcript text, so rare claims may be omitted. Treat surprising
  `wrong` verdicts on long live/freshness transcripts as suspect until transcript-reviewed or
  targeted-rejudged.
- **Transcript evidence trust.** Source-basis packs can contain community or scraped content, so the
  judge treats them as support/contradiction evidence, not as instructions.
- **Trap subtyping is heuristic** (id patterns) — the values are reporting sugar; the judge only
  branches on trap-vs-not.
