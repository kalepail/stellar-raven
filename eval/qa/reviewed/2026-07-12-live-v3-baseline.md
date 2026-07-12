# 2026-07-12 canonical live-data v3 baseline

This is the first baseline for `live-data-canonical-v3`: the 10 byte-identical v2 cases plus
five manifest-approved behavioral cases. The round was reviewed in full against saved answers,
transcripts, joined goldens, guarded re-judges, and production free-operation probes. Coordinator
and Fable contract review approved the interpretation recorded here.

## Exact run

Solo process 2948 was reused on `localhost:8787`; no second Wrangler process was started. The
MCP initialize readiness probe returned HTTP 200. The exact command was:

```sh
env -u QA_AGENT_PROMPT_APPEND node eval/qa/run-qa.mjs \
  --cases eval/qa/corpus/live/live-cases.json \
  --port 8787 \
  --server-revision 7fbedd764752db345f36d3b58e5a4f944ca3a349
```

- Results: `eval/qa/results/2026-07-12T08-04-12-variantA.json` (local-only, gitignored).
- Answering model / judge: `claude-sonnet-5` / `claude-sonnet-5`.
- Measurement tuple: rubric `v2.4`, evidence pack `p3`.
- Server revision: `7fbedd764752db345f36d3b58e5a4f944ca3a349`.
- Run interval: `2026-07-12T07:41:53.968Z` to `2026-07-12T08:04:12.844Z`.
- Run cost: $9.4573501; four guarded re-judges cost $1.0028849; total **$10.4602350
  ($10.46)**.

The result truthfully records `runnerDirty: true`. The shared checkout already contained
unrelated observability/auth work (including request-observability source/tests/docs) owned by
another lane. Lane 4 changed none of it. The server revision, manifest hash, runner/harness hashes,
tool-surface hash, and exact case snapshot were independently stamped, so the dirty flag is a
provenance caveat rather than an unrecorded input ambiguity.

An offline plan regrade wrote `2026-07-12T08-04-12-variantA.plan.json`: 14/15 required-operation
coverage (93%), mean on-plan ratio 0.93.

## Machine gate

The stored result passed every predeclared machine check:

- exactly 15 unique ids in canonical v3 order;
- contract `live-data-canonical-v3` and input case digest
  `2a9c98d1088acc7bbbf563ac3a95fbe74e2bea81901c6d0fcc6e5860b1c23340`;
- `summary.overall.error === 0`;
- answering and judging models both `claude-sonnet-5`;
- result metadata and every verdict stamped rubric `v2.4`, pack `p3`, and a prompt hash;
- server revision exactly `7fbedd764752db345f36d3b58e5a4f944ca3a349`;
- the v2 carried-case projection remained byte-identical and independently digest-pinned.

## Raw and reviewed results

| Scope | Raw | Reviewed | Reading |
|---|---:|---:|---|
| Canonical v3 overall | 11C / 3P / 1W / 0E | **12C / 2P / 1W / 0E** | One carried raw partial was judge variance. |
| Carried v2 ten | 8C / 2P / 0W | **9C / 1P / 0W** | Per-id comparable with the prior v2 run's 10C. |
| New v3 five | 3C / 1P / 1W | **3C / 1P / 1W** | Both surprising verdicts were stable on re-judge. |

Raw service breakdown was Scout 7C/3P, Lumenloop 3C/0P/1W, and none 1C. Error was zero in
every scope.

### Carried-ten comparison

The comparison baseline was `2026-07-11T21-55-31-variantA.json` (10C). The requested
`--flips-vs` invocation failed closed before spend because the v2 baseline does not contain the
five new v3 ids. The authorized asymmetric-membership fallback selected only the two carried
score flips with `--ids`; `--allow-non-identical` was never used. Artifact
`2026-07-12T08-06-26-rejudge.json` records matching case hashes, order, and v2.4/p3 tuple.

- `q-live-hackathon-recent-winners`: raw P → re-judge C. The answer correctly separated the
  newest event (no winners yet) from the latest event with results and used explicit placement
  fields. This was judge variance.
- `q-live-zk-repos-current`: raw P → re-judge P. This is the one confirmed v2 C→P regression:
  the answer grouped `AshFrancis/chickenz` into a February no-activity-since cohort even though
  the saved evidence showed a 2026-05-25 last commit. It is an answering-model recency/synthesis
  fabrication, not a retrieval or upstream-data failure.

Thus carried-case per-id continuity reads 9C/1P versus the preceding 10C, with one confirmed
regression and one variance flip.

## New-case behavioral review

Artifact `2026-07-12T08-09-08-rejudge.json` re-judged the surprising jobs wrong and Beans
partial on identical input. Both identity and tuple guards passed; both verdicts were stable.

| Case | Raw / reviewed | Did the discriminator work? | Evidence and disposition |
|---|---:|---|---|
| `q-live-fluxity-status-provenance` | C / C | **Yes.** It exercised the current null-qualifier branch. | The answer read Scout's `Live` plus null `statusAsOf`, `statusBasis`, and `statusSourceUrl`, empty `supportedNetworks`, `Unverified`, and null mainnet contract id. It explicitly refused to promote those fields into mainnet or audit proof. The populated-qualifier branch remains future-proof but was not observed. |
| `q-live-ll-active-jobs-recency` | W / W | **Yes, strongly.** | The answer correctly handled pagination and the missing `last_seen_at`, then collapsed 30 distinct ids/URLs into 16 title groups without a stable identity key and overstated `active` as independent reconfirmation. A production probe at `2026-07-12T08:09:36Z` confirmed distinct URLs for repeated titles and only `id/title/url/status/source/created_at` fields. Real answering-agent synthesis failure. |
| `q-live-beans-cross-service-reconcile` | P / P | **Yes.** | The answer successfully separated and reconciled Scout/Lumenloop identity, taxonomy, links, and null builder fields. It then used repo recency plus an unqualified Scout `Live` label to call Beans an actively maintained operating product without respecting null status-basis fields. Partial is real. The judge's separate claim that `versionStatus: unknown` contradicted a served 2026-07-08 commit and the served “v15.1.0, June 2026” description was itself a judge artifact; production recheck confirmed those fields, but that artifact does not erase the lifecycle over-promotion. |
| `q-live-ll-guessed-slug-soft-empty` | C / C | **Yes.** | The answer classified `reflector-network` as soft-empty, searched by name, resolved `reflector`, and explicitly rejected the absence inference. |
| `q-live-builders-artifact-continuation` | C / C | **Partly.** | Focused Soroban (6/6) and Rust (5/5) queries avoided truncation. The answer established completeness, deduplicated to 10, grouped by served location/project, preserved unknown locations, and treated free-text matches as unverified candidates. The conditional `artifact.read` branch was not exercised. |

Reviewed new-five remains 3C/1P/1W. The confirmed misses are case-level answering-agent
synthesis failures; no new upstream or eval-golden defect was established.

## Residuals

### Artifact continuation was not exercised

The artifact-continuation case measured completeness, scoping, and evidence-tier discipline,
but did not exercise `codemode.artifact.read` because the answering model chose focused complete
queries. That is valid under the conditional golden and should be monitored across future runs.
If the continuation branch remains unexercised, consider a broader forced query only through a
future frozen-contract version bump (v4), never an in-place v3 edit.

### Beans judge-artifact pattern

Both judge samples treated `codeVerified.versionStatus: "unknown"` as contradicting separately
served repository activity/version-description fields. It does not: the production response
confirmed `lastActivityAt: 2026-07-08` and the `.NET Stellar SDK` description's June-2026 version
wording. Monitor this evidence-pack/rubric interpretation pattern. The row remains partial for the
independent, transcript-visible lifecycle over-promotion, so no score is manually upgraded here.

## Saturation relief

Canonical v2 had reached a flat reviewed 10/10. V3 restores useful discriminating signal without
hardening the frozen carried cases: the five additions produced a stable wrong, a stable partial,
and three correct answers across lifecycle provenance, non-digest recency, reconciliation,
soft-empty handling, and continuation/completeness behavior. The lane again distinguishes
answering quality instead of only confirming already-saturated behaviors.

## Comparability

- Per-id comparison is valid for the carried ten: their order/content stayed byte-identical and
  the judge tuple remained v2.4/p3.
- The v3 15-case aggregate is **not comparable** to the v2 10-case aggregate. They are different
  frozen denominators; report each by contract name.
- `live-digest-supplement-v2` remains untouched at two cases and is never merged into canonical
  v2 or v3 numbers.
- Raw and reviewed counts remain separate; the reviewed movement is one identical-input variance
  correction, not a rewritten raw result.

## Monitor-only list

- `q-live-zk-repos-current`: confirmed carried C→P regression from a stale-activity fabrication.
- `q-live-ll-active-jobs-recency`: unsafe title-only deduplication plus active-status overclaim.
- `q-live-beans-cross-service-reconcile`: source reconciliation succeeded, lifecycle evidence was
  over-promoted; judge also exhibited the versionStatus-unknown artifact described above.

All three are answering-agent synthesis failures. They do not establish the same mechanism across
two unrelated cases, so none clears the acting bar for prompt, catalog, adapter, or upstream work.
No new improvement finding is filed; Fluxity continues to exercise the already-reported
`sls-024` / Stellar-Light `stellar-scout#9` lifecycle-provenance class.

## What this establishes

`live-data-canonical-v3` now has a reproducible baseline: raw 11C/3P/1W and reviewed
12C/2P/1W, with zero errors. The expansion relieved v2 saturation while preserving carried-case
continuity, exposed three distinct synthesis misses, and found no new service or golden defect.
Future runs should retain the 15-case denominator, re-judge flips before interpreting them, and
watch whether the artifact continuation branch is ever exercised.
