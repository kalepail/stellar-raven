---
name: cloudflare-observability-review
description: Investigate live Cloudflare Workers observability for stellar-raven-codemode. Use when reviewing production MCP request logs, traces, Ray IDs, request headers, telemetry query results, eval observability, agent-run forensics, or whether Cloudflare metadata is enough without app-level correlation IDs.
---

# Cloudflare Observability Review

Use this runbook to answer "what happened in production?" for
`stellar-raven-codemode` using Cloudflare Workers Logs, platform invocation
events, and OTel spans.

## Principle

Prefer Cloudflare-native request identity over app-issued task IDs.

This service no longer needs a model-facing `correlationId` contract for normal
observability. In practice, same-user concurrent MCP tasks are rare, and for
debugging/evals we can join requests by Ray ID, time window, user-agent/client
marker, host/path/method/status, and auth mode. If a future investigation needs
stronger cross-request grouping, add privacy-safe auth subject/client fields to
app logs rather than asking models to forward ids.

## Safety Rules

- Never print secrets from `.env`, `.dev.vars`, Wrangler, Cloudflare, or MCP
  responses.
- Use Cloudflare API MCP for historical evidence. `wrangler tail` is only a
  convenience stream; a miss there is not evidence that logs are absent.
- Do not copy raw IPs, IP hashes, or IP-derived fingerprints into app logs.
  Cloudflare platform events already expose IP-bearing request headers.
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

- Cloudflare headers alone are best-effort, not proof.
- Use auth subject/client attribution if implemented.
- Accept that rare same-user concurrency may be ambiguous.

## Live Probe

Generate a known request when needed. Load the production admin token without
echoing it:

```sh
set -a; . ./.env; set +a
MARK="codex-live-telemetry-$(date +%s)"
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

## Field Map

High-value fields:

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
- Multi-request attribution by authenticated user/client: prefer adding
  privacy-safe auth subject/client fields to app logs.
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
