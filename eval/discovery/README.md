# Discovery Eval

Phase 0 discovery-only instrument for the discovery redesign. It asks a narrower question than QA: if a naive agent makes exactly one live MCP `search` call with the user's question, did the returned catalog hits surface the right source family and at least one usable operation or skill?

The runner talks to the real MCP server over HTTP and does not import `src/` search or scoring code. That keeps the lane pointed at the live product surface rather than an offline reimplementation.

## Run

```sh
node eval/discovery/run-discovery.mjs --url http://localhost:8788
```

`--url` defaults to `http://localhost:8788` and may include or omit `/mcp`. For non-local targets, provide an auth token through one of `RAVEN_MCP_BEARER_TOKEN`, `MCP_BEARER_TOKEN`, `MCP_ADMIN_TOKEN`, or `RAVEN_ADMIN_TOKEN`; the runner sends it as a bearer token and never prints it.

Results are written to `eval/discovery/results/<ISO-stamp>.json` and are local evidence, matching the existing eval results convention.

## Seed Pools

- `extended-strict-misses`: the 12 current extended-lane strict top-5 misses derived from `eval/routing-cases.json`. They are the cases where strict labels still miss while broader acceptable families can be defensible.
- `issue-9-exemplars`: vague/status/current-recommendation questions from GitHub issue #9's exemplar class, authored against exact manifest ids.
- `lumenloop-agentic-misses`: the 8 LumenLoop-labelled cases (`expected_service: lumenloop`) from the real agentic run `eval/agentic/results/agentic-2026-07-04-drift.json` (local-only, gitignored). Ground truth is authored from each case's `expected_cards`, so `expectedFamilies` is `["lumenloop"]` for the seven LumenLoop-only-card cases and `["lumenloop","scout"]` only for `blend-tvl`, whose authoritative card list itself includes `scout_analyze`. This pool deliberately measures **LumenLoop-family** discovery: a miss means one-shot search did not surface the intended LumenLoop editorial/directory source, even in cases where Scout may still return a factually usable answer. Scout was dropped from `phoenix-scf` (SCF submission history is a LumenLoop-specific dataset Scout cannot serve).
- `round-844-real-user`: representative real-user alias/error/tooling questions from the round-844 lane context in `eval/README.md`, using committed routing-corpus questions as durable refs.
- `pr17-fold`: unique provisional seed cases folded from draft PR #17 (`kalepail/stellar-raven#17`) so that competing Phase-0 instrument can be superseded without losing Protocol 24, AP2/ACP, and RPC `getTransactions` exemplars.

## Grading

For each case, the runner calls `search` once with the case question and `limit: 8`.

- `familyHit@3`: any rank 1-3 hit has `service` in `expectedFamilies`.
- `usableOp@5`: any rank 1-5 hit has `id` in `acceptableOps`.
- Raw rank 1-8 hits are recorded as `{ rank, id, service, kind, tier, score }` plus any additional score fields returned by the server that this runner knows to preserve.

The summary reports overall counts and per-seed-pool counts. The runner deliberately does not classify misses.

## Phase 0 Baseline

Baseline **re-stamped 2026-07-09 after pr17 fold** (Pool C re-seeded against the real
`agentic-2026-07-04-drift.json` results file during the earlier independent ground-truth
adjudication; see `lumenloop-agentic-misses` above). The pre-adjudication table reported the
overall lane at 32/40 (80.0%) familyHit@3 and 25/40 (62.5%) usableOp@5 — those numbers were
inflated by Pool C accepting Scout as a family, which masked the LumenLoop one-shot-discovery gap.
Post-PR-17-fold numbers, run against the Solo `dev-wt` server at `http://localhost:8788`:

| pool | n | familyHit@3 | usableOp@5 |
| --- | ---: | ---: | ---: |
| extended-strict-misses | 12 | 6/12 (50.0%) | 4/12 (33.3%) |
| issue-9-exemplars | 10 | 10/10 (100.0%) | 7/10 (70.0%) |
| lumenloop-agentic-misses | 8 | 3/8 (37.5%) | 2/8 (25.0%) |
| pr17-fold | 3 | 3/3 (100.0%) | 3/3 (100.0%) |
| round-844-real-user | 10 | 10/10 (100.0%) | 9/10 (90.0%) |
| overall | 43 | 32/43 (74.4%) | 25/43 (58.1%) |

The PR #17 fold added only the `pr17-fold` pool; extended/issue-9/round-844 numbers are
byte-identical to the pre-adjudication run, and Pool C remains at its adjudicated baseline.

### July 9 artifact availability

No `eval/discovery/results/` JSON or exact result-file stamp survives for this July 9 baseline.
A free in-memory replay on 2026-07-09 from 22:04:36.356Z through 22:04:37.631Z reproduced all
43 rows and the table exactly (32 family hits, 25 usable operations; pool counts 6/4, 10/7,
3/2, 3/3, 10/9), but that replay was not persisted. Those timestamps are an execution window,
not an invented artifact stamp. The table above is therefore the committed historical record;
the missing raw JSON is explicitly unavailable, and the next run must write a new honest stamp.

## Miss Classification

Classification happens during review, not in the runner:

- `retrieval`: one-search discovery failed to surface a needed family or usable op even though the exposed catalog contains one.
- `agent-behavior`: the needed family/op was visible, but an agent likely needs better search planning, follow-up search, or source-family guidance.
- `downstream`: discovery was sufficient; the later answer would fail because of execute usage, upstream data/content quality, missing fields, stale source data, or synthesis.
