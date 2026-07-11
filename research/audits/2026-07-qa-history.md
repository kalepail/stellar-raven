# QA eval history — corpus origins, override doctrine, rubric evolution, run archaeology

Dated research record, extracted 2026-07-11 from `eval/qa/README.md` during the super-corpus
docs rewrite (C7 of the rebuild plan in
[`2026-07-11-super-corpus-design.md`](./2026-07-11-super-corpus-design.md)). Everything below is
**historical**: it describes the overlay-era eval (vendored corpus + `golden-overrides.json`)
and the run/rubric record accumulated between 2026-07-02 and 2026-07-10. The current system —
owned per-case files under `eval/qa/corpus/battery/` — is documented in `eval/qa/README.md`;
the migration proof is `eval/qa/reviewed/2026-07-super-corpus-migration.md`. File paths quoted
below are as they were at the time; the overlay files (`golden-overrides.json`,
`grader-notes.mjs`, `lint-goldens.mjs`) were deleted at the migration.

## 1. Origin — the A/B referee and the raven corpus spirit statement

The QA eval was built as the referee for the search-design A/B (Solo todo 803): variant A (host
ranked-string search) vs variant B (code-shaped spec search). Decision of record:
[ADR-0001](../decisions/0001-search-tool-shape.md) — variant A shipped as the top-level
`search`; the code-shaped variant retired into `execute`'s sandbox. Contract (Solo scratchpad
516): `run(question, {searchVariant}) → {answer, transcript}` and
`judge(question, goldenAnswer, answer) → verdict`.

The raven-next golden corpus (538 compiled cases; vendored snapshot at
`eval/corpus/raven-next/research/golden/` — see `eval/corpus/PROVENANCE.md`) was the **content
source**; its schema and eval code were deliberately **not** reused (user directive: follow the
spirit, not the format).

**Kept (the spirit):** real Stellar-ecosystem questions across all categories; a human-audited
golden answer plus atomic must-appear facts and must-avoid traps; freshness-sensitivity as a
first-class tag; trap cases graded on behavior; sourced answers preferred, fabrication punished
hardest.

**Changed (deliberately):** no routing assertions (`expected_cards` / `acceptable_cards` /
`forbidden_cards` / stage attribution dropped — routing is measured by `eval/run-routing.mjs` +
`eval/agentic/`); no weighted rubric scoring (weight-per-claim + `pass_threshold` +
`weight_profile` replaced by coarse `correct | partial | wrong` with explicit
`missingFacts`/`wrongClaims`); no citation hard-gate (`must_cite` became advisory grader-notes
context); own case format compiled fresh from corpus content + per-question YAML frontmatter
labels; general-web cases dropped (51 perplexity/parallel cases skipped, 10 curated
`expected_service: none` traps kept).

**Compile-era battery counts** (from 538 corpus cases): 469 kept — 277 stellarDocs / 119 scout /
63 lumenloop / 10 none-traps; 241 freshness-sensitive; 30 traps (10 decline-family + 20
in-catalog). 69 dropped: 47 perplexity + 4 parallel (general-web), 14 none-traps beyond the kept
quota, 4 raven-agent-specific traps. Every drop was listed in `cases.json → skipped` with its
reason. Golden confidence tags (retired at migration): 356 high / 111 medium / 2 low. Freshness
horizons (10-value vocabulary, retired at migration in favor of `truth.reverifyBy`): 62
quarterly / 36 weekly / 39 protocol-release / 59 docs-release / 25 monthly / 7 realtime /
4 package-release / 4 config-release / 2 yearly / 2 scf-round / 1 annual.

## 2. The override doctrine (overlay era, retired at migration)

The vendored corpus was a verbatim read-only snapshot, so live-verified golden corrections
landed in `eval/qa/golden-overrides.json` — a hand-authored, committed, load-time supplement.
`compile-qa.mjs` applied each entry after case assembly: per-field replacement of `golden`
subfields; validated overrides of only `tags.freshness`/`tags.freshnessHorizon`; exact-match,
non-overlapping `graderNotesReplacements` (failing unless the inherited span occurred exactly
once) plus `graderNotesAppend`; applied ids recorded in `cases.json → overrides`, stale ids
warning at compile time. `graderNotesHistory` preserved each inherited/effective pair.

**Overrides were stop-gaps, not fixes.** An override corrected the eval's *copy* of the truth;
the defect that made it necessary lived somewhere else and had to be captured where it could
actually get fixed — an upstream service gap in `improvements/`, an eval-side authoring/rubric
flaw in a Solo todo, plain freshness drift named as such. Enforced structurally: every entry
carried `why` (what was wrong), `evidence` (live re-execution provenance — a judge's opinion
alone never justified an override), and `rootCause` (non-empty), and the compile refused
entries missing any of the three. Later hardening (golden-truth skill) added required
`truthDomain` + a `corroboration` matrix per entry. The integrity risk guarded against was
score laundering — "correcting" a golden until the agent's answer grades right; the
live-evidence bar plus the root-cause pointer kept every override auditable back to a defect
that exists independently of the eval score.

First entries (2026-07-03, todo 827): `q-scf-regional-india` (under-enumeration +
support-relative avoid clause → concrete traps; root causes: todo 826 rubric artifact +
freshness drift) and `q-ti-rpc-gettransactions-pagination-xdr` (false 200-is-Horizon-only
premise; live method page says RPC getTransactions is 1–200 hardcoded, default 50 — root cause
`improvements/stellar-docs/sd-003`).

By migration time, 372 cases carried effective overrides; the entries' provenance
(`truthDomain`, corroboration matrices, evidence, rootCause) was imported losslessly into each
owned case's `truth` block, and the 1.03 MB override file was deleted. The compile-time
perpetual-provenance enforcement was replaced by the moment-of-change gospel-change lint
(`lint-corpus.mjs` lane c). The GT-sweep's 34 ad-hoc corroboration verdict strings normalized
onto the 6-value enum per `scripts/qa-corpus-verdict-normalization.json`.

## 3. Consistency register origins

Both ancestor corpora's dominant silent-drift failure was pairs of goldens that individually
pass verification but cannot both be true. `eval/qa/consistency-register.json` records periodic
corpus-internal sweeps (no live calls): cluster cases by shared entities/ids, compare
numeric/status claims, record contradictions (→ golden-truth review), tensions (→ grader
caution), and verified-consistent clusters. Settled clusters are not re-litigated unless a
member case changed; overlay-era rule: overridden cases were the more-verified side in any
conflict. First sweep 2026-07-03 (todo 829): 102 clusters examined → 1 contradiction,
5 tensions, 17 verified-consistent clusters. Post-migration, `register-helper.mjs` stamps
member content hashes and auto-reopens clusters whose members changed.

## 4. Rubric evolution (v2 → v2.4)

The judge began as one headless `claude -p --model claude-sonnet-5` call per grade (verified
live 2026-07-02). The short changelog lives in the `judge.mjs` header; this is the full record.

**Rubric v2 addendum (2026-07-03).** Specific claims BEYOND the golden's scope are graded
"unverified", not wrong — they count toward `wrongClaims` only when they contradict a golden
fact or match a must-avoid item. Rationale: live verification of the 2026-07-03 30-case run
proved 4 of 7 "wrong" verdicts were judge artifacts — the judge can't see tool transcripts, so
it graded transcript-invisible corpus-grounded specifics (e.g. audit-report citations that exist
exactly in the scout audit corpus) as fabrication. Comparability: wrong-counts from runs judged
before this addendum are not directly comparable to later runs — re-judge the saved
`rows[].answer` first. Calibrated record (2026-07-03 rejudge): both 30-sample runs re-judged
under this rubric (`results/2026-07-02T18-18-36-variantA-rejudge-rubric2.json`,
`results/2026-07-03T04-13-42-variantA-rejudge-rubric2.json`): pre-hardening 18/9/3 → 19/8/3,
post-hardening 12/11/7 → 17/11/2 (10 flips — all four live-verified judge-artifact wrongs
recovered). The calibrated before/after read as judge-variance-level noise, confirming the
post-audit deploy quality-neutral end to end.

**Second judge-artifact class (2026-07-03 evening, todo 826): avoid-clause bypass.** A golden
must-avoid banning claims "beyond corpus support" makes a corpus-blind judge read beyond-golden
specifics as avoid-matched — wrong again despite the v2 addendum. Standing triage rule: treat
any wrong verdict whose rationale cites a support-relative avoid item as suspect-artifact until
live-verified.

**Rubric v2.1 (2026-07-03, todo 826) — avoid-clause scoping.** Must-avoid items bind only on
what the judge can check from the candidate answer itself — concrete wrong content or an
answer-visible sourcing condition. Avoid items conditioned on support the judge cannot see are
advisory and never generate `wrongClaims` by themselves. Verdicts gained a `rubric` field; the
self-test gained a regression candidate for exactly this artifact. This round also introduced
the warn-only avoid-phrasing lint (`lint-goldens.mjs`, 104 lines — ported in substance into
`lint-corpus.mjs` lane d at migration) with its `judge-blind` vs `sourcing-guard` tiers.

**Verification re-judge (2026-07-03, todos 826+827 closure).** The two overridden cases' saved
answers from `2026-07-03T16-06-45` re-judged under corrected goldens + rubric v2.1:
`q-scf-regional-india` wrong → correct (artifact class closed);
`q-ti-rpc-gettransactions-pagination-xdr` partial → wrong — correctly so: the agent genuinely
denied the RPC-side 200 cap, a real failure the old golden had masked by encoding the same
false belief.

**Rubric v2.2 (2026-07-07, todo 865) — compact transcript evidence for live/freshness judging.**
`run-qa.mjs` began passing the tool transcript into `judgeCase`; `judge.mjs` included bounded
execute-result excerpts for live/freshness-style cases only. Fixed the artifact class where a
stale prior about an old API shape caused transcript-supported live claims to be marked
fabricated (the `q-live-hackathon-recent-winners` `winnersRanked`/`placementRank` episode).

**Rubric v2.3 (2026-07-07, todo 871) — source-basis packs for long/truncated transcripts.**
The v2.2 excerpt mechanism could miss evidence in long or truncated execute results: one
digest-supplement row (`q-live-digest-blend-coverage`,
`results/2026-07-07T17-41-13-variantA.json`) was judged wrong even though the saved execute
result contained the disputed source summaries (`Templar`, `backstop LP market migration`,
`February Blend hack`, `GAMI Capital`, and others). v2.3 replaced ad hoc snippets with a
deterministic source-basis evidence pack for explicitly tagged live/freshness cases: summarize
execute-result shape, list call outcomes and sanitized canonical URLs, parse source-like items,
rank by overlap with candidate/golden terms, label them data-derived/untrusted, and enforce a
hard post-serialization char budget. Todo 873 extended the pack with claim-anchored snippets
(amounts, numbers, durations, percentages, proper-noun phrases matched against raw transcript
result text).

**Rubric v2.4 + pack p3 (2026-07-07, todo 876) — evidence-pack integrity counter-pressure.**
The claim-snippet pack removes case-literal proper-noun subjects generically, boundary-matches
numeric claims (so `2,000` cannot match inside `12,000`), and restricts claim snippets to
execute results only. `PACK_VERSION = "p3"` exported from `evidence-pack.mjs`; every verdict
carries `{rubric, packVersion, promptSha256}`; `run-qa.mjs` stores each row's evidence-pack
SHA-256 and char count. The v2.4 self-test added contradiction and numeric false-support
counter-pressure fixtures plus the todo-865 untagged transcript-evidence negative guard.

**Noise floor (2026-07-07, todo 876).** The stored 30-row `2026-07-07T19-58-35` run was
re-judged three times under v2.4/p3 (`...-rejudge-v2.4-p3-pass{1,2,3}.json`): 20C/7P/3W,
20C/7P/3W, 21C/7P/2W. Per-row any-flip rate 7/30 = **23.3%** (the committed monitor-only noise
floor); pairwise score disagreement 14/90 = 15.6%. Flipping rows: `q-eco-wallets-overview`,
`q-edge-1xlm-activation-fee`, `q-protocol-tier1-org-list`, `q-soroban-reentrancy`,
`q-soroban-storage-types`, `q-ti-cli-rust-windows-troubleshooting`, `q-tool-cli-install`.
Judge CLI cost for the three passes: $8.51. MissingFacts clustering over the same passes
(`cluster-missing-facts.mjs`) found 45 missingFacts: version/number 15, other 13, caveat 7,
enumeration-tail 6, cross-source corroboration 4 — heterogeneity, not one systematic
synthesis-depth class. A committed judge-regression replay gate was deliberately deferred
because committed replay fixtures conflict with the results-local-only convention.

## 5. Run archaeology (overlay-era results record)

All stamps refer to local-only files under `eval/qa/results/` (gitignored); the committed
reading lived in the README at the time and moves here verbatim-in-substance.

- **2026-07-03 post-nudge checkpoint** (`2026-07-03T16-06-45-variantA.json`, sample-30, rubric
  v2 native): 20C/9P/1W/0E (81.7% weighted) — best run on the sample; traps 2/2. Agentic review
  (Solo scratchpad 521) overturned the one wrong (`q-scf-regional-india` — "fabricated" events
  all exist verbatim in the live corpus), so zero true agent wrongs. Root causes across the 9
  partials: 4 mild agent synthesis/scoping slips, 3 upstream data gaps (sls-007 new,
  sk-001/sk-002 recurrences), 1 retrieval gap pair (ll-006 + sls-006), 1 wrong golden (todo 827).
- **2026-07-06 post-round-5 checkpoint** (`2026-07-06T18-48-22-variantA.json`, rubric v2.1):
  20C/9P/1W/0E — aggregate-identical to 07-03; 9 per-case flips netting zero across the rubric
  boundary, so the aggregate identity was the robust signal that round 5 was headline-neutral.
  Plan regrade 29/30 requiredCovered, onPlanRatio 1.00. Agentic review (workflow wf_01b3347d-1b8,
  scratchpad 531) overturned 2 of 10 as judge artifacts (both RWA-freshness rows); calibrated
  read 22C/7P/1W. The 1 wrong stood as an upstream data gap (`q-scf-current-round` → sls-014).
  Findings filed: sd-005, sd-006, ll-010, sk-001 recurrence.
- **2026-07-07 truncation cap A/B** (focused truncation-prone 5 live + 2 main cases, rubric
  v2.2; `EXECUTE_MODEL_BOUNDARY_MAX_TOKENS` 6000 vs 12000; stamps `17-41-13`/`17-42-27` vs
  `17-51-00`/`17-51-59`): after transcript review, 6000 live read 5C (one judge artifact), main
  2C; 12000 live 4C/1P (real over-inference), main 2C; 12000 was slower/more expensive on the
  live lane. Decision: keep the committed 6000 default plus the bounded host-side override; the
  product direction is bounded model-lane output + artifact/source-basis mechanisms, not cap
  raises. Production telemetry: 7-day window showed 280 execute events, 20 result truncations
  (~7.1%), 0 log/error truncations — a payload-heavy failure mode, justifying the result-only
  artifact/source-basis lane. This round also caught the stale hackathon-winners golden notes
  (fixed with the durable behavioral rule in the live contract) and produced the
  blend-coverage evidence-dilution lesson that became v2.3.
- **2026-07-07 artifact/source-basis ship round** (todo 870, rubric v2.3): routing gate PASS
  (`eval/results/routing-2026-07-07T19-13-48-644Z.json`). Re-judged baseline live-5 5C main-2
  2C; experiment live-5 3C/2P (`19-26-06`), main-2 2C (`19-27-04`) — both experiment partials
  live-verified as judge artifacts whose fix was the todo-873 claim-anchored pack. Corrected
  reading: neutral-or-better with `codemode.artifact.read` used in 4/5 live cases; ship gate
  PASS. Closing sample-30 `19-58-35`: 19C/11P/0W/0E. Partial review: 7 legitimate completeness
  partials; 4 wrong-claim partials → sk-001, sk-002 recurrences, sls-017 filed, and one stale
  golden (`q-soroban-storage-types`, post-P23 auto-restore semantics) corrected via
  golden-truth (CAP-0066 triangulation; docs ambiguity filed as sd-007) — under the corrected
  golden the stored row re-judged wrong, honestly: a genuine failure the old golden had masked
  by encoding the same stale belief.
- **2026-07-09 truth-maintenance checkpoint** (todo 900, rubric v2.4/p3). Post-P27 focused
  smoke `19-25-25` (eight P27/Zipper/release cases): 0C/3P/5W — misses real (exposed docs
  called P26 current, treated the completed July 8 vote as unconfirmed, omitted the P27 tail,
  denied CAP-0071 delegation); no golden weakened to match stale retrieval; official Software
  Versions lag filed as sd-008; the eight goldens independently re-verified and corrected via
  golden-truth. Fresh sample-30 `19-53-07`: 20C/8P/2W, plan 28/30 requiredCovered, mean
  onPlanRatio 0.98 — inside the noise floor, no full-battery run justified. No judge artifacts
  in the ten non-correct verdicts; the two wrongs: `q-sep-6-24-deprecation` (upstream docs
  parity gap → sd-009) and `q-tool-cli-install` (invented "SVM" version manager — synthesis
  error, no upstream finding).
- **2026-07-10 per-operation architecture A/B** (todo 903; full reviewed record:
  `eval/qa/reviewed/2026-07-10-per-operation-architecture-ab.md`). QA-30 calibrated 20C/9P/1W
  (search+execute) vs 17C/12P/1W (50-operation arm); canonical live-10 9C/1P/0W vs 10C/0P/0W.
  The 79,817 vs 21,356 advertised wire characters are not consumed context (deferred MCP tools +
  ToolSearch in both arms). With one replicate, cross-lane-only order reversal, direct-arm
  skills/artifact-read omissions, and mixed metrics: **NULL / NO SHIP**; routing and QA
  baselines unchanged.

## 6. Live-lane contract history

`live-data-canonical-v1` (`eval/qa/live-cases.json` at the time; todos 818, 806) froze the
10-case execute-grounding lane: 7 Scout / 2 Lumenloop / 1 cant-do trap; membership/order from
`eb412bd^` (pre-denominator-drift), content current-vetted (notably `6fed730`'s deliberate
hackathon-winners update alongside rubric v2.2). `live-digest-supplement-v1` (todo 913) was the
opt-in 2-case Lumenloop recency-digest supplement authored for the skill.run experiment, never
part of the canonical denominator. Canonical provenance: viable DEFER_FRESHNESS candidates from
the upstream theboycoder/boxy review (REJECTed cases' failure modes became `avoid` items) plus
codemode-authored Lumenloop drift cases; digest provenance in `research/skill-run-design.md`
§10. Historical 12-case runs are "canonical + supplement", never canonical-lane results. Both
contracts bumped to v2 at the migration (schema-migrated bodies, explicit membership arrays,
`caseContentDigest` pins asserted by `eval/self-test.mjs`); they live at
`eval/qa/corpus/live/` now.

## 7. Migration pointer

The 2026-07-11 rebuild replaced the vendored-corpus + overlay storage model with owned
per-case files, judge contract provably unchanged (0 projection diffs across 469 cases; 15/15
promptSha256 fixtures identical; rubric v2.4 / pack p3 throughout). Design:
[`2026-07-11-super-corpus-design.md`](./2026-07-11-super-corpus-design.md). Proof record:
`eval/qa/reviewed/2026-07-super-corpus-migration.md`. Old baselines remain valid per-id for
continuing cases (same rubric); denominator-level comparisons across the rebuild carry the
"denominator changed at the rebuild" note.
