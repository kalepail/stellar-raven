---
name: lumenloop-api-research
description: Commissions metered server-side research over LumenLoop's full Stellar-ecosystem corpus through the REST API at https://api.lumenloop.com/v1 (partner tier, billed in USD against the account budget) via request_research, research_result, and list_my_research. Use when commissioning a cited research report over the LumenLoop corpus, getting a fast cited answer to a single question, getting a curated source pack to synthesize yourself, filling a JSON Schema with cited per-field data, or polling and retrieving a commissioned research run.
user-invocable: true
---

# Commission LumenLoop Research over the REST API

This is the partner tier's flagship capability. `request_research` asks a
**server-side research agent** to investigate a question over the **full
LumenLoop corpus** — everything LumenLoop has indexed and enriched across news,
AV, events, SCF data, and its own research — going beyond the AI summaries the
free query tools return. What comes back is LumenLoop's own synthesis, every
claim cited to its original source — citations land on the exact articles
and timestamps, so supporting quotes are one fetch away at the original.
The run executes asynchronously and
returns **cited output** in one of four shapes: a fast single-question answer,
a finished editorial report, a curated source pack, or structured data
conforming to your own JSON Schema.

Three facts shape everything below. **Async**: `request_research` returns a
`run_id` immediately; you poll `research_result` until the run completes —
`answer` runs finish in seconds, the other formats over a few minutes.
**Metered**: each run is charged in USD against your account's monthly quota,
then its allocated credits — `answer` is a flat $0.02; for the other formats
cost varies with depth and format, typical runs are well under $2; check
`GET /v1/me` for your budget. **Cited**: citations are resolved server-side
from the corpus, never model-invented URLs.

## When to use this skill

- The user wants a **researched, cited answer** that goes deeper than the AI
  summaries the free query tools return.
- You have **one factual question** and want a fast, cited answer in seconds
  for a flat $0.02 (`output_format: "answer"`).
- You need a **ranked, annotated source pack** to write your own synthesis from.
- You want **machine-readable data in your own shape** (a JSON Schema you
  define), with per-field citations and confidence.
- You hold a `run_id` and need to **poll a run** or **re-fetch a past report**.

**When NOT to use it:** if summaries from the query tools answer the question,
use `../lumenloop-api-query/SKILL.md` instead — browsing and semantic search are
free within rate limits, and commissioning research for something
`search_content_semantic` already surfaces wastes budget. To browse LumenLoop's
own published research library, use the free `list_research` tool, not
`list_my_research`.

## Related skills

- Auth, response envelope, error codes → `../lumenloop-api-connect/SKILL.md`
- Quota, credits, 402 recovery, x402 top-ups → `../lumenloop-api-billing/SKILL.md`
- Free directory/content/SCF browsing → `../lumenloop-api-query/SKILL.md`

## Prerequisites

- A **partner-tier credential** (an `llmcp_` API key or OAuth token), sent as
  `Authorization: Bearer <credential>` on every call.
- A **billing account with budget**. Check before commissioning:

```bash
curl -s https://api.lumenloop.com/v1/me \
  -H "Authorization: Bearer $LUMENLOOP_KEY"
```

In the response, `billing.research_enabled` must be `true`;
`billing.research_quota_usd`, `billing.month_spend_usd`, and
`billing.credits_remaining_usd` show the monthly allowance, month-to-date
spend, and prepaid credit pool. No billing account, or both budgets exhausted,
means `request_research` returns **HTTP 402 `payment_required` before the run
starts** — recovery (top-ups, budget requests) is covered in
`../lumenloop-api-billing/SKILL.md`.

## The three tools

| Tool | Role |
| --- | --- |
| `request_research` | Start a run. Returns `{ run_id, poll_after_s, message, recent_runs? }` immediately — `recent_runs` (when present) lists your account's recent completed reports so you can reuse one via `research_result` instead of paying for a duplicate. |
| `research_result` | Poll a run by `run_id` (optionally long-poll via `wait_s`); also re-fetches past completed runs. |
| `list_my_research` | Your account's past runs, most recent first. |

You can only read research your **own account** commissioned.

## Choosing `output_format`

| You want | `output_format` | Completed payload | Cost / latency |
| --- | --- | --- | --- |
| A finished, cited editorial answer | `report` (default) | `report` (markdown) + `sources` + `citations` | Variable, typically well under $2 · tweet ≈30–60s, thread ≈1–2 min, long-form ≈3–10 min |
| A fast, cited answer to ONE question | `answer` | `answer` + `citations` + `confidence` | Flat $0.02 · completes in seconds |
| To write the synthesis yourself from a ranked, annotated source pack | `sources` | `pack { title, overview }` + `sources` (each with the curator's relevance note) + `citations` | Variable, typically well under $2 · ≈1–3 min |
| Machine-readable data conforming to YOUR JSON Schema, with per-field citations and confidence | `structured` | `data` + `schema` (echo) + `basis` + `sources` + `citations` | Variable, typically well under $2 |

Two more arguments:

- `format` — **report mode only**: `"tweet"`, `"thread"`, or `"long-form"`
  (default `long-form`). Controls the report's shape, depth, and latency:
  `long-form` (≈3–10 min) for a full report, `thread` (≈1–2 min) and `tweet`
  (≈30–60s) for progressively tighter briefs. Ignored for
  `answer`/`sources`/`structured`.
- `output_schema` — a JSON Schema object, **required when
  `output_format="structured"`**, max ~8KB serialized. Do NOT add URL fields to
  it — citations are attached server-side per field via `basis`.

Full payload anatomy per format → `reference/output-formats.md`.

## The lifecycle, end to end

All responses arrive in the standard envelope
(`{ "success": true, "data": …, "error": null, "meta": … }` — see
`../lumenloop-api-connect/SKILL.md`); the JSON shown below is the `data` field,
abridged.

### Step 0 — check you have not already paid for this question

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/list_my_research \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"limit":10}'
```

```json
{
  "results": [
    { "run_id": "9f2c81d4-7c1a-4e0b-9d3f-2a6e8b14c507", "status": "completed",
      "started_at": "2026-05-28T13:58:40Z", "title": "Stellar RWA landscape, Q1 2026",
      "slug": "stellar-rwa-landscape-q1-2026", "format": "long-form",
      "summary": "…", "created_at": "2026-05-28T14:02:11Z" },
    { "run_id": "0b3d2e6a-5f47-4c19-8a02-d91e74c3b8aa", "status": "failed",
      "started_at": "2026-05-02T09:14:33Z", "title": null, "format": null,
      "summary": null, "created_at": null }
  ]
}
```

If a past run already answers the question, pass its `run_id` to
`research_result` instead of commissioning (and paying for) a new run.
`limit` is 1–100, default 25. Failed and legacy rows can carry `null` for the
metadata fields, as shown.

Even if you skip this step, `request_research` echoes a `recent_runs` array
(plus a `recent_runs_note`) in its `202` response when your account has recent
completed reports — so a reusable `run_id` is handed back inline. This is a soft
reuse hint, not a guard: it never blocks the commission, and a duplicate that
goes through is billed, so still prefer checking before you pay.

### Step 1 — commission the run

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/request_research \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"question":"Summarize institutional adoption of Stellar in 2026 so far","format":"long-form"}'
```

```json
{ "run_id": "5fde21e9-2034-4e90-b132-b05d059bb36e", "poll_after_s": 30,
  "message": "Research started — typically completes in a few minutes. Poll research_result(run_id) every 30-60s (or pass wait_s=30 to long-poll); progress.message is safe to relay to your user." }
```

`question` is required (5–4000 chars). The run is now executing server-side;
this is the point at which it is metered. For `output_format: "answer"` the
commission response comes back with `poll_after_s: 2` — the run completes in
seconds, so the first poll usually returns the finished answer. Two
submit-time failures to know:

- **402** — no billing account or budget; the run never started.
- **409** — a run is **already in flight on your account**; the response
  includes `conflicting_run_id` plus a hint. Don't retry-loop the commission —
  poll that run via `research_result` instead (you may be racing another agent
  on the same account, and its answer may be the one you wanted anyway).

### Step 2 — poll (or long-poll) until the run completes

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/research_result \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"run_id":"5fde21e9-2034-4e90-b132-b05d059bb36e","wait_s":30}'
```

`wait_s` (optional integer, 0–45) turns the poll into a **long-poll**: the call
holds until the run completes, the phase changes, or the window expires, then
returns the current state. Expiry returns the normal running object, so the
pattern degrades gracefully to plain polling. Recommended for HTTP agents:
`wait_s: 30`.

While running:

```json
{
  "status": "running",
  "progress": {
    "phase": "Searching sources",
    "steps": 3, "searches_run": 2, "sources_read": 1,
    "detail": "3 research steps so far",
    "elapsed_s": 47, "last_activity_s": 6, "stalled": false,
    "eta_s": 160, "pct": 23, "poll_after_s": 30,
    "message": "Searching sources — 3 research steps so far, 1 source read, about 3 minutes to go."
  }
}
```

How to read `progress`:

- **`message` is written to be relayed to your user verbatim** — a partner-safe
  one-liner combining phase, activity, and ETA. Prefer it over assembling your
  own line from the raw fields.
- **Honor `poll_after_s`** — the server's check-back hint. Sleep that long
  before the next poll instead of picking a fixed interval.
- `eta_s` and `pct` come from historical median run durations for the run's
  format. They are `null` when no history exists, or once a run exceeds 2× the
  median — the estimate is withdrawn rather than wrong. `pct` caps at 95; it
  never claims done.
- `last_activity_s` is a heartbeat — seconds since the run last wrote progress
  (`null` on runs started before heartbeats existed). `stalled` flips to `true`
  after ~3 minutes of silence; stalled runs are auto-failed by the platform
  after 30 minutes total, so a stalled run always resolves — keep polling,
  don't commission a duplicate.

Typical report/sources/structured runs take a few minutes; long-poll with
`wait_s`, or poll every 30–60s. `answer` runs complete in seconds — poll after
~2s (the commission response's `poll_after_s`). Never hot-loop.

### Step 3 — consume the completed payload

```json
{
  "status": "completed",
  "output_format": "report",
  "report": "# Institutional adoption of Stellar in 2026\n\nThrough the first half of 2026, institutional activity clustered around three threads… [1] …\n\n## Sources\n…",
  "sources": [
    { "type": "article", "id": 5121,
      "title": "Major custodian adds Stellar settlement rails",
      "url": "https://example-news.com/custodian-stellar-settlement",
      "author": "…", "date": "2026-03-14", "tags": ["institutional", "payments"],
      "summary": "…", "long_summary": "…" }
  ],
  "citations": [
    { "title": "Major custodian adds Stellar settlement rails",
      "url": "https://example-news.com/custodian-stellar-settlement" }
  ]
}
```

An `answer` run completes with a leaner payload — the cited answer plus an
overall confidence tier:

```json
{
  "status": "completed",
  "output_format": "answer",
  "answer": "Yes — through H1 2026 at least two custodians added Stellar settlement support… [1]",
  "citations": [
    { "title": "Major custodian adds Stellar settlement rails",
      "url": "https://example-news.com/custodian-stellar-settlement" }
  ],
  "confidence": "high"
}
```

Treat `confidence` like the structured-mode tier: rely on `"high"`, and on
`"low"` read the cited sources before relaying the answer.

If the run failed:

```json
{ "status": "failed", "reason": "The run could not be completed." }
```

The `reason` is a generic, skip-safe message. Refine the question and
commission again if it is still worth the spend.

## Structured mode, worked

Define a small, flat schema with a `description` on every field — the
researcher reads those descriptions as the brief for what to fill:

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/request_research \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{
    "question": "Map the active decentralized exchange landscape on Stellar as of mid-2026",
    "output_format": "structured",
    "output_schema": {
      "type": "object",
      "properties": {
        "market_overview": { "type": "string", "description": "2-3 sentence state of the Stellar DEX landscape" },
        "active_projects": { "type": "array", "description": "DEX projects with visible 2025-2026 activity",
          "items": { "type": "object", "properties": {
              "name": { "type": "string" },
              "focus": { "type": "string", "description": "One-line value proposition" } },
            "required": ["name", "focus"] } },
        "notable_developments": { "type": "array", "items": { "type": "string" },
          "description": "Dated developments from the last 12 months" },
        "coverage_gaps": { "type": "array", "items": { "type": "string" },
          "description": "Questions the corpus could not answer" }
      },
      "required": ["market_overview", "active_projects", "notable_developments"]
    }
  }'
```

Poll as usual; the completed payload returns `data` conforming to your schema,
`schema` (an echo), a dataset `title`, and — the part that makes it trustworthy —
`basis`, one entry per filled field:

```json
{
  "status": "completed",
  "output_format": "structured",
  "title": "Stellar DEX landscape, mid-2026",
  "data": { "market_overview": "…", "active_projects": [ { "name": "…", "focus": "…" } ], "notable_developments": ["…"] },
  "schema": { "type": "object", "properties": { "…": "…" } },
  "basis": [
    { "field": "active_projects.0",
      "citations": [ { "title": "…", "url": "…" } ],
      "reasoning": "Directory entry cross-checked against 2026 coverage…",
      "confidence": "high" }
  ],
  "sources": [ { "type": "article", "…": "…" } ],
  "citations": [ { "title": "…", "url": "…" } ]
}
```

Reading it: `field` is a dot path into `data`, array indices included
(`active_projects.0`); `confidence` is a string tier — rely on `"high"`, and
treat `"low"` as weak: follow that field's `citations` and read the underlying
sources before relying on the value.
Full `basis` and schema-authoring guidance → `reference/output-formats.md`.

## Asking good questions

- **Scoped, ecosystem-relevant questions beat vague ones.** "Summarize
  institutional adoption of Stellar in 2026 so far" gives the researcher a
  topic, a lens, and a time window. "Tell me about Stellar" wastes a metered run.
- The corpus is the **Stellar ecosystem** — projects, news, AV, events, SCF,
  research. Questions outside it will come back thin.
- Pick depth deliberately: `format: "long-form"` (default, ≈3–10 min) for a
  full report; `"thread"` (≈1–2 min) or `"tweet"` (≈30–60s) for a quick brief
  when a few paragraphs or sentences suffice — shallower runs also tend to
  cost less. For one factual question, `output_format: "answer"` (flat $0.02,
  seconds) is the cheapest, fastest rung of all.
- For `sources` and `structured`, the `question` is still the research brief —
  state the angle you care about, not just a topic word.

## Operational notes

- **Poll cadence:** long-poll with `wait_s: 30`, and sleep
  `progress.poll_after_s` (fallback 30s) between calls. Polling counts against
  your rate limits (partner: 240 req/min, 30,000 req/day) — never hot-loop.
- **One run in flight per account:** commissioning while a run is already
  running returns **409 with `conflicting_run_id`** — poll that run rather
  than retrying the commission.
- **Duration:** `answer` completes in seconds (`poll_after_s: 2`); reports run
  tweet ≈30–60s, thread ≈1–2 min, long-form ≈3–10 min; source packs ≈1–3 min.
  `progress.eta_s`/`pct` estimate from your format's history when one exists.
- **Re-fetching:** `research_result` also re-fetches past completed runs — keep
  the `run_id`, or recover it later via `list_my_research`.
- **Ownership:** one account = one shared budget across all of its API keys and
  grants; any key on the account can read any run the account commissioned, and
  no one else's.
- **Failures:** `status: "failed"` carries a generic `reason`; there is nothing
  to parse — decide whether to refine and re-commission.
- **402 on commission:** stop and route through
  `../lumenloop-api-billing/SKILL.md` (check `/v1/me`, top up, or request a
  budget increase) before retrying.

## Skip polling — webhooks

If you run a server, register a webhook and let LumenLoop notify you when runs
start, complete, or fail — polling always keeps working; webhooks are optional
on top. Requires partner tier with a billing account, like the other
self-service endpoints.

```bash
curl -s -X PUT https://api.lumenloop.com/v1/me/webhook \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/hooks/lumenloop"}'
```

The response includes the signing `secret` (`whsec_…`) **exactly once** — store
it immediately. Events: `research.run.started`, `research.run.completed`,
`research.run.failed`; payloads carry identifiers only
(`{ type, run_id, status, occurred_at }`), so on completion fetch the output
via `research_result` with your own credential. Deliveries are signed per the
Standard Webhooks convention — `webhook-signature` is
`v1,<base64 HMAC-SHA256(secret, "{id}.{timestamp}.{body}")>` — verify with any
Standard-Webhooks library. `GET` and `DELETE /v1/me/webhook` inspect and remove
the config; full endpoint reference (fields, error codes) lives in the endpoint
catalog under `../lumenloop-api-connect/SKILL.md`, and a runnable signed
receiver ships with `../lumenloop-api-integrate/SKILL.md`.

## Citation discipline

- **Present the citations with the output.** Reports embed citation markers and
  ship a flat `citations` list of `{ title, url }` — keep them attached when you
  relay the report.
- **Summaries orient; quotes come from the source.** Each source carries
  LumenLoop's AI summaries (`summary`, `long_summary`) plus the original's
  `url` — when you need exact wording it is one fetch away: quote from the
  `url`, not from the summary.
- **Trust the URLs.** Citations are server-resolved from corpus records, never
  model-invented — but they point at third-party sites that can change; cite the
  `url` so readers can verify.

## Pointers

- Payload anatomy per output format: `reference/output-formats.md`
- Live tool schemas: `GET https://api.lumenloop.com/v1/tools/request_research`,
  `…/research_result`, `…/list_my_research`
- Full API guide: `GET https://api.lumenloop.com/v1/docs`
