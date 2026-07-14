# Temporal observation scorer (Lane T)

This offline diagnostic measures whether the host observation anchor changes answer-time treatment
of mutable facts without turning the anchor into evidence. It is deterministic, judge-blind, and
fixture-driven: only the 12 preregistered case IDs and their case-specific regexes in
`expectations.json` are scored. It does not change serving behavior, QA goldens, or judge semantics.

## Contract

The lane has six mutable positives and six controls, fixed by `temporal-expectations-v1`. Every
surface/arm must contain two rows per positive and one row per control. The scorer accepts ordinary
saved QA `/mcp` artifacts and `/playground/chat` artifacts (`{ meta, rows }`) through explicit input
labels; it never infers an experiment arm from filenames.

Attribution is fail-closed. Every candidate row must contain `--- OBSERVATION CONTEXT ---` inside a
recorded `execute` result in its transcript. Every baseline row must lack that block. A marker in an
answer, search result, or tool input does not satisfy attribution.

The four reported metrics are separate per surface and arm:

- `asOfDatingRate`: positive answers whose case-specific qualifier regex binds an answer-time date
  or observation qualifier to the mutable claim.
- `staleAsCurrent`: preregistered stale assertions made without that trap's historical/as-of guard.
- `anchorAsFact`: a control answer that promotes the July 14 observation date into the CCTP
  publication date or Meridian event date.
- `spuriousHedge`: case-specific hedging attached to a stable/closed-world control core.

`perSurfaceBaseline` records the preregistration's already-observed QA grades for context only. The
scorer does not read saved verdicts, goldens, or truth metadata. Headline C/P/W remains the separate
QA guardrail under its frozen judge tuple.

## Commands

Run the free detector self-test:

```sh
npm run eval:temporal:selftest
```

Score saved artifacts (repeat an `--input` label when replicates are split across files):

```sh
node eval/temporal/score-temporal.mjs \
  --input mcp:baseline:eval/qa/results/<mcp-baseline>.json \
  --input mcp:candidate:eval/qa/results/<mcp-candidate>.json \
  --input playground:baseline:eval/local-lanes/playground-semantic/<playground-baseline>.json \
  --input playground:candidate:eval/local-lanes/playground-semantic/<playground-candidate>.json \
  --output /tmp/temporal-score.json
```

Malformed or missing expectations, invalid regexes, non-selected IDs, wrong classes, missing
replicates, mislabeled surfaces, and attribution failures exit nonzero with a `Temporal scorer:`
error. The scorer performs no network or model calls.
