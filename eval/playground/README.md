# Playground semantic evaluation

`scripts/run-demo-model-gauntlet.mjs` remains the eight-case transport and tool-loop smoke test. It checks that models can complete the SSE chat path cleanly; it does not establish factual answer quality.

`npm run eval:playground` is the complementary semantic lane. It sends existing QA cases to the real `POST /playground/chat` SSE route, captures the final assistant text, search/execute outcomes, terminal reason, latency, HTTP/SSE errors, and grades the final answer with the existing `eval/qa` golden, evidence-pack, and judge contract. It introduces no new quality rubric and does not change corpus or golden content.

Use the existing Solo `dev` process and its discovered loopback URL; do not start Wrangler for this command.

```sh
# Free validation: default seeded, stratified five-case selection; no HTTP/model/judge calls.
npm run eval:playground -- --dry-run

# Free route-auth validation: signed run cookie reaches body validation before throttle/model work.
npm run eval:playground -- --preflight

# Small paid run (the default is five cases). This invokes the playground model and QA judge.
npm run eval:playground -- --confirm-paid --url http://localhost:8787 --sample 5 --seed baseline-a

# Targeted reproduction.
npm run eval:playground -- --confirm-paid --ids q-aas-burn-clawback-redemption-mechanics

# Whole named contract, only when it stays within the one-subject 30/hour cap.
npm run eval:playground -- --confirm-paid --cases eval/qa/corpus/live/live-cases.json --full
```

`--no-judge` captures a route/trace diagnostic only; omit it for the semantic result. Results are timestamped JSON below `eval/local-lanes/playground-semantic/`, which is gitignored. Their saved transcript uses `mcp__playground__search` / `mcp__playground__execute` aliases with full JSON-stringified inputs and results, so the existing plan grader works directly:

```sh
npm run eval:plan -- eval/local-lanes/playground-semantic/<stamp>-playground-semantic.json
```

Run that regrade after playground prompt or tool-loop changes. Treat this as a separate playground lane: do not merge its denominator or scores with the main MCP QA battery.

For live loopback runs, the harness reads `MCP_SERVER_SECRET` from the environment or `.dev.vars` without logging it and mints an ephemeral run-scoped demo cookie. This exercises the normal cookie-authenticated per-subject throttle while avoiding collisions in the shared `dev-loopback` bucket; it never uses this cookie against a non-loopback URL.

One run-scoped subject is intentionally limited to the real `DEMO_CAPS.chatsPerHour` ceiling (currently 30). Selection over that cap, including `--full` against the 469-case main battery, is rejected before the harness mints a cookie or sends a request. Use `--sample 30`, a <=30-case named contract, or an explicit `--ids` shard; it never rotates subjects to evade the safeguard.
