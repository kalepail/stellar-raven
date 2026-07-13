---
name: cloudflare-observability-review
description: Investigate live Cloudflare Workers observability for stellar-raven-codemode. Use when reviewing production MCP request logs, playground/demo telemetry, traces, Ray IDs, request headers, telemetry query results, eval observability, agent-run forensics, or whether Cloudflare metadata is enough without app-level correlation IDs.
---

# Cloudflare Observability Review

Use this runbook to answer "what happened in production?" for
`stellar-raven-codemode` using Cloudflare Workers Logs, platform invocation
events, and OTel spans.

When the investigation is part of an eval round, agent-run forensic review, or other
multi-agent maintenance pass, record the query inputs, Ray IDs, and verdict in the relevant
Solo scratchpad/todo so the evidence survives outside the current context window.

## Principle

Prefer Cloudflare-native request identity for one invocation. Use the app's
privacy-safe OAuth subject/client hashes only for cross-request attribution.

Observability works without a model-facing `correlationId` contract. Same-user
concurrent MCP tasks are rare, and for debugging/evals we join requests by Ray ID,
time window, user-agent/client marker, host/path/method/status, and auth mode. If an
investigation needs stronger cross-request grouping, add privacy-safe auth
subject/client fields to app logs rather than asking models to forward ids.

## Safety Rules

- Never print secrets from `.env`, `.dev.vars`, Wrangler, Cloudflare, or MCP
  responses.
- Use Cloudflare API MCP for historical evidence. `wrangler tail` is only a
  convenience stream; a miss there is not evidence that logs are absent.
- Do not copy raw IPs, IP hashes, or IP-derived fingerprints into app logs.
  Cloudflare platform events already expose IP-bearing request headers.
- It is OK to query and use Cloudflare-native private/platform fields
  (IP-bearing headers, geo, TLS/client fingerprint fields, user-agent) inside a
  bounded investigation when they are needed to join or separate requests.
  Report them only when directly relevant; otherwise report Ray IDs, time
  windows, paths, statuses, and app event fields.
- Do not infer identity from IP/geo/TLS fields unless explicitly doing an abuse
  review with a separate privacy decision.

## What Joins Reliably

For one HTTP invocation:

- Response `cf-ray` header -> Workers Logs. Strip the colo suffix:
  `a15a1ed37fa5b049-ATL` -> `a15a1ed37fa5b049`.
- Workers app JSON logs: `$metadata.type = "cf-worker"`.
- Workers platform invocation logs: `$metadata.type = "cf-worker-event"`.
- OTel spans: `$metadata.type = "span"`, joined by `cloudflare.ray_id`.

Across a controlled eval/research run:

- Use a narrow time window.
- Use unique non-secret markers in `clientInfo.name` or user-agent when the
  harness allows it.
- Group by service, host, path, method, status, user-agent, and Ray IDs.

Across arbitrary third-party MCP traffic:

- Join one invocation through the Ray ID and Cloudflare request metadata.
- For successful OAuth requests, group across invocations by `subjectHash`
  and/or `clientHash` from the authoritative `mcp_request` summary. Child
  events join through `$metadata.requestId`; they do not repeat the hashes.
- Old grants issued before client attribution have `clientHash = null`. Never
  fill that gap from user-agent or network fields.
- Accept that rare same-user concurrency may be ambiguous.

Identity caveats:

- `subjectHash` is the same 16-hex `hashPrefix(subject)` used by playground
  and artifact events.
- `clientHash` is a 16-hex, versioned, domain-separated HMAC of the OAuth
  client id. The raw client id lives only in encrypted grant props.
- Rotating `MCP_SERVER_SECRET` creates a temporary split: old grants retain
  old props while new grants derive new user/client hashes. Demo cookies
  rotate too.
- A wrong admin bearer token intentionally falls through to the provider and
  appears as `accessMode = "oauth-rejected"`; do not derive identity from
  rejected credentials.
- OAuth-provider `OPTIONS /mcp` preflights emit no `mcp_request` app event.

## Live Probe

Generate a known request when needed. Load the production admin token without
echoing it:

```sh
set -a; . ./.env; set +a
MARK="raven-live-telemetry-$(date +%s)"
BODY=$(node -e 'const m=process.argv[1]; console.log(JSON.stringify({
  jsonrpc:"2.0", id:0, method:"initialize",
  params:{protocolVersion:"2025-06-18", capabilities:{},
  clientInfo:{name:m, version:"0.0.0"}}
}))' "$MARK")
curl -i -sS https://raven.stellar.buzz/mcp \
  -H "Authorization: Bearer $MCP_ADMIN_TOKEN_PRODUCTION" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  --data "$BODY" |
  awk 'BEGIN{IGNORECASE=1} /^HTTP\//{print} /^cf-ray:/{print} /^content-type:/{print} /^mcp-session-id:/{print}'
```

Wait 30-90 seconds for ingestion before querying.

## Query Workflow

1. Discover fields if needed with Cloudflare API MCP
   `/workers/observability/telemetry/keys`.
2. Query recent events with filters:

```json
[
  { "key": "$metadata.service", "operation": "eq", "type": "string", "value": "stellar-raven-codemode" },
  { "key": "$metadata.requestId", "operation": "eq", "type": "string", "value": "<ray-without-colo>" }
]
```

3. If looking for traces, query OTel/span events by:

```json
[
  { "key": "cloudflare.script_name", "operation": "eq", "type": "string", "value": "stellar-raven-codemode" },
  { "key": "cloudflare.ray_id", "operation": "eq", "type": "string", "value": "<ray-without-colo>" }
]
```

4. For broader reviews, group counts by `$metadata.type`,
   `$workers.event.request.path`, `$workers.event.response.status`,
   `$workers.event.request.headers.user-agent`, or `cloudflare.ray_id`.
5. For cross-request OAuth review, filter app events to
   `evt = "mcp_request"`, then group by `subjectHash` or `clientHash`. Use
   each matching event's `$metadata.requestId`/`rayId` to join child tool/op
   events and spans. A null client hash means a pre-attribution grant, not an
   anonymous user.

## Demo Playground Failures

For `/playground/chat` screenshots or user-visible tool cards, do not start only
from the screenshot timestamp. The screenshot may be captured after the failing
turn, or from a local browser that is replaying retained UI state. First search
a wide recent window (usually 10 hours, or the user's stated window) for app
events:

- `evt = "demo-execute"` grouped by `ok` and `error`.
- `evt = "demo-chat"` with `executeFailures > 0`, grouped by
  `executeFailures`, `finishReason`, and Ray/request ID.
- Needle searches for visible user-query terms in `demo-chat-start.latestUserPreview`
  and bounded model search text in `demo-search.queryPreview`, e.g. `ecosystem gaps
  builders` or `yield rwa bond asset`.
- Span view for `codemode.execute`, grouped by `$metadata.message` and
  `sandbox.ok`, to separate model-code failures from sandbox/runtime failures.

Then join each failing request by `$metadata.requestId`:

- `demo-search`: bounded `queryPreview`, exact-match `queryHash`, query size,
  requested/effective limits, kind/service filters, hit/total/omitted counts,
  gated/backfill counts, truncation, and top ids.
- `demo-execute`: `ok`, `error`, `codeChars`, redacted/sampled `code`, `ms`.
- `op`: operation ids/outcomes/timings inside the execute attempt.
- `demo-chat`: `searchCalls`, `executeCalls`, `executeFailures`,
  `finishReason`, `budgetExhausted`, `finalNeededButMissing`, answer preview.
- `cf-worker-event`: path/method/status/user-agent and, when needed, the
  Cloudflare private/platform fields used to disambiguate same-user traffic.

When the question text matters, start with `demo-chat-start`. It records the
inbound browser message surface without storing the full transcript:

- `evt = "demo-chat-start"` grouped by `$metadata.requestId`, `model`,
  `openAiApiMode`, `reasoningEffort`, `auth`, `historyMessages`, and
  `userMessages`.
- `latestUserPreview`: short sanitized preview of the latest user message.
  Search this for visible screenshot terms.
- `latestUserHash`: stable hash prefix for exact matching repeated prompts
  without exposing the raw text.
- `latestUserChars`, `historyChars`: sizing clues for truncation/body issues.
- `subjectHash`: privacy-safe per-demo-session join key; do not infer real
  identity from it.

Full chat transcripts are intentionally not logged. If `demo-chat-start` is
absent in older logs or a nonstandard environment, reconstruct the user ask from
`demo-search.queryPreview`/`queryHash`, `demo-execute.code`, answer preview, timestamp, Ray ID, and
screenshot text; mark that reconstruction as best-effort.

Common diagnosis patterns:

- `object is not iterable (cannot read property Symbol(Symbol.iterator))` with
  code containing `Promise.all({ ... })` is model-authored JavaScript, not an
  upstream service outage. The retry should rewrite to
  `Promise.all([callA, callB])`.
- `Execution timed out` after successful `op` lines usually means the model
  wrote a slow/broad script or hit the sandbox's 60s wall-clock cap. Check
  `codeChars`, broad list limits, and operation timings before blaming a
  service.
- `demo-chat` can still finish with an answer after failed executes; inspect
  `executeFailures`, not only `finishReason`.

## Field Map

Cloudflare's query/filter keyspace flattens app JSON log fields. If a returned
event object displays app data under `source.evt` / `source.queryPreview`, filter and
group by `evt` / `queryPreview` unless the keys endpoint shows the `source.*` variant
for that dataset. A query using `source.evt = "demo-search"` can miss events
that `evt = "demo-search"` finds.

High-value fields:

- MCP request summary: `accessMode`, `subjectHash`, `clientHash`, `requestId`,
  `rayId`, `method`, `status`. Successful requests include identity keys
  (null outside attributed OAuth); rejected events omit them entirely.
- The older `auth` app field is redacted to `*****` by Cloudflare and is not
  useful for grouping; the `/mcp` summary deliberately uses `accessMode`.
- App JSON logs: `evt`, `queryPreview`, `queryHash`, `queryChars`,
  `requestedLimit`, `effectiveLimit`, `omittedCount`, `gatedHits`, `backfillHits`,
  `kind`, `service`, `hits`, `total`, `truncated`, `top`,
  `ok`, `error`, `code`, `resultPreview`, `answerPreview`, `finalPreview`,
  `latestUserPreview`, `latestUserHash`, `latestUserChars`, `historyChars`,
  `historyMessages`, `userMessages`, `subjectHash`, `auth`, `model`,
  `openAiApiMode`, `reasoningEffort`

- `$metadata.service`, `$metadata.requestId`, `$metadata.type`,
  `$metadata.trigger`, `$metadata.message`
- `$workers.event.rayId`, `$workers.requestId`,
  `$workers.event.request.headers.cf-ray`
- `$workers.event.request.headers.user-agent`
- `$workers.event.request.headers.mcp-protocol-version`
- `$workers.event.request.path`, `$workers.event.request.method`,
  `$workers.event.response.status`
- OTel: `cloudflare.script_name`, `cloudflare.ray_id`, `cloudflare.colo`,
  `cloudflare.asn`, `http.response.status_code`, `url.full`,
  `user_agent.original`, `traceId`, `spanId`

`queryHash` is a stable 16-hex SHA-256 prefix of the exact raw query for
equality grouping. It is not a secrecy mechanism: short queries are
dictionary-recoverable, so the raw query is not logged and only the bounded
preview is human-readable. `omittedCount` is `total - hits` for the scorer
tiers consulted by that page; like `total`, it is a floor rather than an
exhaustive missed-result count. A null `effectiveLimit` means validation or a
refusal prevented the search page from running.

Privacy-sensitive fields already present in platform logs:

- `$workers.event.request.headers.cf-connecting-ip`
- `$workers.event.request.headers.x-real-ip`
- precise geo, TLS, and client-fingerprint-like metadata

## Decision Heuristic

- Request-level debugging: Ray ID is enough.
- Controlled eval/research review: Ray ID plus time window and unique marker is
  enough.
- Ordinary user support: Ray ID plus auth mode, user-agent, host/path/status,
  and nearby events is usually enough.
- Multi-request attribution by authenticated user/client: use the existing
  request-summary `subjectHash`/`clientHash`; do not infer missing attribution
  from platform fingerprint fields.
- Exact separation of rare same-user concurrent tasks: accept ambiguity unless
  there is evidence it matters enough to add a new app-level mechanism.

Do not reintroduce a model-forwarded correlation id unless production evidence
shows Cloudflare/auth observability fails for common investigations.

## Report Shape

End with:

- Query inputs: timeframe, filters, Ray IDs, datasets/views.
- Joined evidence: app JSON logs, platform events, spans.
- Gaps: ingestion delay, missing auth subject/client, no session header, etc.
- Privacy notes: IP-bearing or fingerprint-like fields observed.
- Recommendation: Cloudflare-only, add auth subject/client fields, or change
  service code/docs.
