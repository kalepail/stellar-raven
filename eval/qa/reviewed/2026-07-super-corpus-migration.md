# 2026-07 super-corpus migration proof

The C5 atomic cutover preserved the judge contract while changing the storage model from the
legacy compiled corpus plus overrides to owned per-case JSON files.

- Projection proof: `node scripts/verify-qa-corpus-projection.mjs --full` compared
  `git show 2def7be:eval/qa/cases.json` with the newly compiled owned battery. Result:
  **0 projection diffs across 469/469 cases**, including exact trap values, the rendered
  freshness-block bit, and the evidence-pack gate bit.
- Prompt proof: the same verifier rendered the pinned candidate/transcript fixtures through the
  new tri-state `buildJudgePrompt` path. Result: **15/15 promptSha256 fixtures identical**. These
  hashes are permanent guards in `eval/qa/judge.mjs`; rubric `v2.4` and pack `p3` are unchanged.
- Ledger proof: **469/469 unique carry rows** resolved to owned destinations.

Corroboration verdicts were normalized during C4 migration according to the governing design's
§2.5 verdict-normalization table: `confirmed`, `confirmed-as-of`, `disputed`, `unverifiable`,
`corpus-only`, and `contradicted`. Legacy nuance remains in each row's free-text `note`.

Result-row migration note: new QA and playground rows preserve `tags` without the retired
`difficulty`/`confidence` fields and copy the judge-blind `truth.status` plus optional
`truth.asOf` under `row.truth` for verdict triage.

Artifact retirement 2026-07-30: the one-shot files this record names —
`scripts/qa-corpus-gt-clusters.json`, `scripts/qa-corpus-verdict-normalization.json`, and
`scripts/verify-qa-corpus-projection.mjs` — were deleted in the forward-only sweep. They had no
live caller (no package script, no CI step, no import); the migration they proved is complete and
its output is the committed corpus under `eval/qa/corpus/`. Recover them from git history at this
record's commit if the projection ever needs re-deriving.
