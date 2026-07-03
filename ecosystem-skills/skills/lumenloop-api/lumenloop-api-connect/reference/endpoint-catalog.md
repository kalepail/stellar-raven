# LumenLoop REST API — endpoint catalog

Complete reference for every REST endpoint. The canonical, always-current version of
this material is the live agent guide at `GET https://api.lumenloop.com/v1/docs`
(generated from the tool registry); an OpenAPI 3.1 spec for codegen lives at
`GET https://api.lumenloop.com/v1/openapi.json`.

Conventions used throughout:

- Base URL `https://api.lumenloop.com/v1` (alias `https://mcp.lumenloop.com/api/v1`).
- Auth (where required) is always `Authorization: Bearer <credential>` — an `llmcp_`
  API key or an OAuth JWT from the LumenLoop authorization server.
- Every response uses the envelope `{ success, data, error, … }` (see
  [Response envelope](#response-envelope) at the end).
- Every response carries `X-RateLimit-Limit`, `X-RateLimit-Remaining`,
  `X-RateLimit-Reset` (unix seconds); 429s add `Retry-After` (seconds).

## Discovery (no auth required)

Discovery responses are **projected per credential** — unauthenticated and
external-lane callers see the 21 external tools; internal tools are neither listed
nor invokable for them. The origin marks these responses private with a 5-minute
lifetime — treat them as cacheable for ~5 minutes per credential, but don't key
logic off the exact `Cache-Control` header (the edge may rewrite caching headers).

### GET /v1 — API index

Machine-readable orientation: API name/version, the REST and MCP interfaces, the two
authentication methods, the tier ladder, and a map of every endpoint below.
`data.your_access` is `null` for unauthenticated callers.

### GET /v1/docs — agent guide

The full agent-facing guide (auth, tiers, envelope, errors, pricing, workflows, and
the complete tool catalog with curl examples). Canonical and generated from the tool
registry — when this catalog and `/v1/docs` disagree, trust `/v1/docs`.

### GET /v1/tools — tool catalog

Catalog of every tool visible to your credential. `data`:

| Field | Meaning |
| --- | --- |
| `count` | Number of tools visible (21 for external callers) |
| `scope` | Note describing the projection applied to this credential |
| `tools[]` | Per tool: `name`, `tier`, `category`, `metered`, `description`, `when_to_use`, `returns`, `detail` (path to the tool's detail endpoint) |

### GET /v1/tools/{name} — tool detail

Everything from the catalog entry plus:

| Field | Meaning |
| --- | --- |
| `input_schema` | JSON Schema (draft-07) the request body is validated against |
| `output_schema` | JSON Schema describing `data` on success |
| `example_args` | A ready-to-send example body |
| `invoke` | `method`, `path`, `content_type`, `auth` — how to call it |

Errors: 404 `unknown_tool` if the name does not exist for your tier.

### GET /v1/openapi.json — OpenAPI spec

OpenAPI 3.1 document covering the endpoints and tools visible to your credential.
Feed it to a generator for a typed client (see `../../lumenloop-api-integrate/SKILL.md`).

## Invocation

### POST /v1/tools/{name} — invoke a tool

- **Auth:** required (guest tier and up; individual tools may require partner).
- **Request:** JSON body = the tool's arguments, validated against `input_schema`.
  Tools with no arguments accept an empty body. `Content-Type: application/json`.
- **Response:** the envelope with `meta: { tool, format }`; read `data` per
  `meta.format` (see [Response envelope](#response-envelope)).

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/search_directory \
  -H "Authorization: Bearer $LUMENLOOP_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "decentralized exchange", "limit": 5}'
```

The 21 external-lane tools:

| Tool | Tier | Metered |
| --- | --- | --- |
| `search_directory`, `get_project`, `get_related_projects`, `get_categories`, `get_regions`, `get_tags_vocabulary`, `get_project_tags_vocabulary` | guest | no |
| `get_scf_submissions`, `find_similar_scf_submissions` | guest | no |
| `search_content_semantic`, `find_content_about_project`, `find_av_passages`, `find_content_by_entity`, `find_similar_projects_semantic` | guest | no |
| `list_documents`, `search_documents`, `get_document`, `list_research` | guest | no |
| `list_my_research`, `research_result` | partner | no |
| `request_research` | partner | **yes — USD per run against your account quota** |

Research notes: `request_research` is async — it returns
`{ run_id, poll_after_s, message }` immediately and the run executes server-side.
`output_format: "answer"` runs complete in seconds (the commission response
carries `poll_after_s: 2`, and the run costs a flat $0.02); the other formats
take minutes. `research_result` accepts an optional `wait_s` (integer 0–45) to
**long-poll**: the call holds until the run completes, the phase changes, or the
window expires, then returns the current state (expiry returns the normal
running object).

Error cases: 400 `invalid_arguments` (with `details`), 401, 402 `payment_required`
(metered tool, no usable budget), 403 `insufficient_scope` (tier too low), 404
`unknown_tool`, 409 on `request_research` when a run is already in flight on the
account (the response includes `conflicting_run_id` and a hint — poll that run
instead of retrying), 429 `rate_limited`, 5xx `tool_failed`.

## Identity

### GET /v1/me — who am I

- **Auth:** required (any authenticated caller, any tier).
- **Request:** none.
- **Response `data`:**

| Field | Type | Meaning |
| --- | --- | --- |
| `principal` | string | Identifier of the calling credential |
| `auth_method` | `"api_key"` \| `"oauth"` | How you authenticated |
| `tier` | string | Your effective tier (`guest`, `partner`, …) |
| `tiers` | string[] | The tiers your credential includes (ladder) |
| `lane` | `"external"` \| `"internal"` | Which lane your tier belongs to |
| `limits.requests_per_minute` | number | Per-minute rate limit |
| `limits.requests_per_day` | number (optional) | Daily cap, when one applies |
| `tools.available` | number | Tools your tier can invoke |
| `tools.visible` | number | Tools listed in your catalog projection |
| `billing` | object \| null | `null` for credentials with no billing context; partner credentials with an account get the object below |
| `billing.billing_state` | `"attached"` \| `"no_account"` \| `"no_budget"` \| `"lookup_failed"` | Whether metered research is billable: `attached` = account with usable budget; `no_account` = no billing account on this credential; `no_budget` = account exists but quota and credits are exhausted/absent; `lookup_failed` = transient — retry |
| `billing.account` | string (optional) | Billing account reference, when attached |
| `billing.research_quota_usd` | number (optional) | Monthly research quota (resets each calendar month) |
| `billing.month_spend_usd` | number | Month-to-date metered spend |
| `billing.credits_total_usd` | number | Allocated prepaid credits, lifetime total |
| `billing.credits_remaining_usd` | number | Prepaid credits left |
| `billing.research_enabled` | boolean | Whether `request_research` would be accepted right now |
| `billing.hint` | string (optional) | Next step when something needs fixing |

Use this as the smoke test after minting/receiving a credential, and to predict 402s
before commissioning research.

## Self-service (partner tier)

Partner credentials manage their own keys, budgets, and webhooks — no admin
round-trip. All eight endpoints require partner-tier auth on a credential with a
billing account (**403** for non-partner credentials, **409** when no billing
account is attached). Minted keys are **partner-tier only** (self-service can
never raise a tier); accounts are capped at **10 active keys**.

### GET /v1/me/credentials — list credentials

Every API key and OAuth grant on your account. OAuth tier grants are admin-managed
and listed **read-only**. Use it to audit what exists before rotating. Calls from
non-partner or billing-less credentials return **403**.

### POST /v1/me/keys — mint a key

- **Request body:**

| Field | Type | Meaning |
| --- | --- | --- |
| `label` | string | Human-readable name (e.g. `"agent-fleet-3"`) |
| `expires_in_days` | number, 0–365 (optional) | Lifetime in days; `0` = never expires; default `90` |

- **Response:** the new key's metadata plus its `llmcp_` plaintext — **returned
  exactly once**; store it immediately. The new key is partner tier and draws on the
  same shared account budget.
- Use it to rotate keys or give each agent its own credential.

### DELETE /v1/me/keys/{id} — revoke a key

Revokes one key on your account by id (ids come from `GET /v1/me/credentials`).
Revocation is immediate — subsequent calls with that key return 401.

### GET /v1/me/budget-requests — list budget requests

Your budget-increase requests with their status. **One open request at a time** — check
here before filing another.

### POST /v1/me/budget-request — ask for more budget

Asks a LumenLoop admin to raise your recurring monthly quota or grant a one-time
credit allocation (admin-reviewed, not instant — for instant credit see the x402
top-up below).

- **Request body:**

| Field | Type | Meaning |
| --- | --- | --- |
| `kind` | `"quota"` \| `"credits"` | Raise the recurring monthly quota, or grant one-time credits |
| `amount_usd` | number (optional) | Requested amount in USD |
| `note` | string | Why you need it |

### GET /v1/me/webhook — research webhook config

Server-to-server completion notifications for research runs — optional; polling
`research_result` always works. Returns the current config:

| Field | Meaning |
| --- | --- |
| `configured` | `true` when a webhook is registered (`false` + `hint` otherwise) |
| `url` | The registered endpoint |
| `created_at` / `updated_at` | Registration timestamps |
| `last_delivery_at` / `last_status` | Outcome of the most recent delivery attempt |

The signing secret is **never returned** — re-register to obtain a new one.

### PUT /v1/me/webhook — register/replace the webhook

- **Request body:** `{ "url": "https://…" }`. The URL must be **public https** —
  localhost and private addresses are rejected with **400** `invalid_webhook_url`.
- **Response:** `{ url, secret, events, note }`. `secret` (`whsec_…`) is shown
  **exactly once** — store it immediately.
- **Events delivered:** `research.run.started`, `research.run.completed`,
  `research.run.failed`. The payload is `{ "type", "run_id", "status",
  "occurred_at" }` — identifiers only; fetch the result via `research_result`
  with your own credential.
- **Signing:** Standard Webhooks convention — headers `webhook-id`,
  `webhook-timestamp` (unix seconds), and `webhook-signature:
  "v1,<base64 HMAC-SHA256(secret, "{id}.{timestamp}.{body}")>"`. Verify with any
  Standard-Webhooks library.
- **Delivery:** 3 attempts with backoff, 10s timeout each; the latest outcome is
  visible via `GET /v1/me/webhook`.

### DELETE /v1/me/webhook — remove the webhook

Returns 200 `{ "removed": true }`, or **404** `no_webhook` if none is configured.

## Billing

### POST /v1/billing/topup?amount=N — x402 top-up (USDC on Stellar)

Adds allocated credits to your billing account autonomously via the
[x402 payment protocol](https://www.x402.org/). Bearer auth required; your credential
must already have a billing account (`GET /v1/me` → `billing`).

Flow:

1. `POST /v1/billing/topup?amount=25` → **HTTP 402** with x402 payment requirements
   (exact scheme, USDC on Stellar, LumenLoop's receiving address).
2. Pay with any x402-capable client (e.g. `@x402/fetch` + a Stellar signer) and retry
   the same request with the `X-PAYMENT` header.
3. On settlement the amount is credited to your account; the settlement transaction
   is returned in the `X-PAYMENT-RESPONSE` header.

`amount` is USD, **1–500**, default **$10**. Replays of the same settlement are
idempotent. Errors: **409** `no_billing_account` if your credential has no billing
account, **400** if `amount` is out of range, **503** when payments are not enabled
on the deployment.

Full quota-vs-credits mechanics → `../../lumenloop-api-billing/SKILL.md`.

## Response envelope

Every invocation returns:

```json
{ "success": true, "data": …, "error": null, "meta": { "tool": "…", "format": "json" } }
```

`meta.format` is the deterministic rule for reading `data`:

| `meta.format` | `data` is |
| --- | --- |
| `"json"` | The parsed object/array the tool emitted. Every catalog tool answers this way; the five formerly multi-block tools now return single objects (`search_directory` `{count, projects}`, `get_categories` `{count, categories}`, `get_regions` `{count, regions}`, `get_scf_submissions` `{count, submissions}`, `get_project_tags_vocabulary` `{count, tags}`) |
| `"text"` | `{ "text": "…" }` — prose |
| `"blocks"` | `{ "content": [...] }` — multi-part MCP content blocks. Retired for the catalog tools; tolerate it only as a legacy fallback |

If a legacy `"blocks"` response ever appears, scan `data.content[]` for the first
text block starting with `[` or `{` and JSON-parse it.

Caveat: prose inside a successful envelope is not always data — it can be a count
line, a not-found message (e.g. `get_document` on a missing id → `format: "text"`,
`data.text` = "No document found with ID 4321 in articles"), or an upstream failure
("… failed: …"). Read it before assuming data; a `failed:` prefix is a tool-level
error even though `success` is `true`.

## Error codes

Errors use HTTP status + the same envelope with `success: false`, a machine-readable
`code`, and a `hint` with the next step:

| Status | `code` | Meaning / what to do |
| --- | --- | --- |
| 400 | `invalid_arguments` | Body failed the tool's schema — the `details` array lists each issue; fix and retry |
| 401 | `unauthorized` | Missing/invalid/expired credential — re-authenticate (see `WWW-Authenticate`) |
| 402 | `payment_required` | Metered tool without a billing account/quota — contact LumenLoop to enable partner research |
| 403 | `insufficient_scope` | Tier below the tool's `required_tier` — request an upgrade or use a lower-tier alternative |
| 404 | `unknown_tool` | No such tool for your tier — `GET /v1/tools` for the catalog |
| 429 | `rate_limited` | Over the per-minute/day budget — wait `Retry-After` seconds, watch `X-RateLimit-*` |
| 5xx | `tool_failed` | Upstream/internal failure — safe to retry with backoff |

Example 401 envelope:

```json
{ "success": false, "data": null, "error": "Invalid, expired, or revoked API key", "code": "unauthorized" }
```

## Rate-limit headers

| Header | Meaning |
| --- | --- |
| `X-RateLimit-Limit` | Per-minute budget for your credential |
| `X-RateLimit-Remaining` | Calls left in the current window |
| `X-RateLimit-Reset` | Window reset time (unix seconds) |
| `Retry-After` | On 429 only — seconds to wait |

Tier budgets: guest 30/min and 2,000/day; partner 240/min and 30,000/day. Pace off
`X-RateLimit-Remaining` rather than retry-looping.
