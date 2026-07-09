# Discovery Phase 0 Eval

Static discovery-only instrument for `research/discovery-redesign.md` Phase 0.

For each seed question it runs one `searchCatalogPage(catalog, { query, limit: 5 })`
call and records:

- whether the intended source family appears in the top 3;
- whether a usable operation or skill appears in the top 5;
- a deterministic miss classification: `retrieval`, `agent-behavior`, or `downstream`.

The classification rule is deliberately simple: if one-call discovery misses either
target, the cause is `retrieval`. If discovery passes, fixture evidence may classify a
known prior failure as `agent-behavior` or `downstream`; otherwise the case is `none`.
This avoids crediting later redesign work for content gaps outside the catalog search
layer.

Run:

```sh
node eval/discovery/run-discovery.mjs
```

Results are written under `eval/discovery/results/` and are local-only evidence, like
the other eval result directories. Use `--no-write` for a smoke run or `--out <path>`
for a specific JSON output.

## Current Seed Set

- 12 current extended-lane strict top-5 misses from
  `eval/results/routing-2026-07-09T15-20-19-712Z.json`.
- Protocol 24, CAP-62, AP2/ACP, and RPC `getTransactions` examples from Solo
  scratchpad 565.

## First Run

2026-07-09 local run:

- cases: 16
- result file: `eval/discovery/results/discovery-2026-07-09T15-23-24-715Z.json`
- source family top-3: 4/16
- usable op/skill top-5: 3/16
- discovery pass: 3/16
- classification counts: retrieval 13, agent-behavior 1, downstream 2, none 0

The agent-allowed-<=3-search arm is not implemented in this pass. That gap matters:
the static arm can tell whether the first search page exposes the right affordance, but
it cannot yet distinguish a model that would recover with two refined searches from one
that would keep following the wrong source family. The fixture carries `priorMiss`
evidence only for cases where scratchpad 565 already documents that distinction.
