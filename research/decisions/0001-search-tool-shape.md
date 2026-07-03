# ADR-0001: Top-level `search` is host-side ranked query; code-shaped search retires to `execute`'s sandbox

- Status: accepted (2026-07-02)
- Decision rule (user, 2026-07-02): mirror Cloudflare's shipped codemode pattern unless an A/B on
  golden question→answer accuracy shows a clear win for the deviation.

## Context

`@cloudflare/codemode@0.4.2`'s `openApiMcpServer` ships `search {code}`: LLM-written JS executed
in a Dynamic Worker against `codemode.spec()` (the OpenAPI spec as data). Our rounds 1–2 instead
shipped a host-side ranked string query (`{query,…}`) using upstream's own vendored
`searchConnectors` scorer. Round 3 built a faithful mirror — a unified 75-path super spec
(lumenloop 36 · scout 24 · stellarDocs 12 · skills 3; 180KB/~45k tokens, `specs/super-spec.json`)
and a 1:1 `createOpenApiSandboxCode` port — and ran both variants through the golden Q→A battery
(`eval/qa/`, spirit-compiled from stellar-raven-next's corpus; Sonnet 5 answering agents scoped to
one search variant + `execute`; LLM judge vs golden answers + keyFacts/mustAvoid).

## Evidence (60 paired stratified cases, 2 disjoint 30-case batches; results in `eval/qa/results/`)

| pooled n=60 | A: host ranked `search_ranked` | B: code-shaped `search` |
|---|---|---|
| correct / partial / wrong / error | 26 / 19 / 15 / 0 | 21 / 17 / 13 / 9 |
| weighted (correct=1, partial=.5) | 35.5/60 (59.2%) | 29.5/60 (49.2%) |
| paired case wins | 19 | 11 (30 ties) |
| avg tool calls · latency · agent cost | 8 · 80s · $26.91 | 13 · 89s · $30.67 |

- Paired accuracy difference: directionally A, not significant alone (sign test p≈0.20).
- **Reliability difference is significant and structural**: all 9 B failures are
  `error_max_turns` — the agent exhausted its 25-turn budget grepping the spec and never answered
  (~$0.80/failure). 9–0 one-sided (p≈0.004). When B finished, answer quality matched A
  (13 vs 15 wrong): the failure mode is turn economics, not answer quality.
- Root cause: upstream's example wraps ONE API spec. At multi-service super-spec scale
  (~45k tokens), in-sandbox grep needs multiple write-code→read-truncated-output→iterate turns
  that compete with the answering phase for the same budget.

## Decision

1. Top-level `search` = host-side ranked query (the round-2 implementation, upstream's own
   scorer). The temporary `search_ranked` name retires; the tool is `search` again.
2. The code-shaped variant is NOT deleted — it moves to where upstream's runtime also puts
   discovery: inside `execute`'s sandbox. `codemode.spec()` (super spec as data, upstream
   REQUEST_TYPES parity), `codemode.search`, `codemode.catalog()` all remain. Discovery-in-code
   survives at zero marginal turn cost; only the mandatory isolate-per-search front door goes.
3. The super spec stays a first-class artifact (feeds `codemode.spec()`; `spec:build` in CI
   scope).

## Consequences / revisit triggers

- Revisit if: turn budgets for callers rise materially (B's errors would convert); the super spec
  shrinks or gets a compact search view; upstream ships a multi-spec search pattern; or a future
  A/B (larger n, or answer-quality-weighted) reverses the reliability gap.
- The A/B harness (`eval/qa/run-qa.mjs --variant`) stays; `--search-tool` override allows
  re-testing any future variant without code changes.
