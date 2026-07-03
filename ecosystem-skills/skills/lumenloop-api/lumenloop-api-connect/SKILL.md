---
name: lumenloop-api-connect
description: Onboard to the LumenLoop REST API for the Stellar ecosystem at api.lumenloop.com/v1 — Bearer authentication, the guest/partner tier ladder, rate limits, the deterministic response envelope, and a first smoke test. Use when the user wants to call the LumenLoop API over plain HTTP/REST, needs orientation on auth, tiers, or the envelope, is troubleshooting a 401, 402, 403, 404, or 429 response, or is picking which lumenloop-api skill fits the task.
user-invocable: true
---

# Connect to the LumenLoop REST API

This is the onboarding anchor for the LumenLoop API skill family. It gets you making
authenticated calls to **the LumenLoop REST API** (`https://api.lumenloop.com/v1`,
alias `https://mcp.lumenloop.com/api/v1`) — REST access to the LumenLoop platform for
the Stellar blockchain ecosystem: the **project directory**, **news / AV / event
summaries**, **Stellar Community Fund (SCF) data**, **semantic search**, and
**commissioned research**. The API is built for agents: a machine-readable tool
catalog, a deterministic response envelope, and explicit errors with a machine-readable
`code` and a `hint` for the next step.

## REST or MCP?

The same platform is reachable two ways. Both expose the **same tools, tiers,
credentials, and rate limits** — nothing is exclusive to either.

| Interface | Endpoint | Best for |
| --- | --- | --- |
| **REST** (this skill family) | `POST https://api.lumenloop.com/v1/tools/{name}` | Plain HTTP clients, scripts, agent frameworks without MCP support |
| **MCP** (Model Context Protocol) | `https://mcp.lumenloop.com/` (Streamable HTTP) | Claude / MCP-native clients — connect and tools appear natively |

For MCP setup and query playbooks over the free guest MCP, use the **public
`lumenloop-skills` repo** (https://github.com/lumenloop/lumenloop-skills) instead —
this repo covers the REST surface.

## When to use this skill

- The user wants to **call the LumenLoop API over plain HTTP/REST** (curl, scripts,
  agent backends) and needs to get connected.
- You need orientation on **authentication, tiers, rate limits, or the response
  envelope** before making calls.
- A request is failing with **401 / 402 / 403 / 404 / 429** and you need to diagnose it.
- You are unsure **which lumenloop-api skill** fits the task (query vs research vs
  keys vs billing vs integrate).
- A teammate or agent is starting fresh and needs the **one-page orientation**.

## Related skills

- Query the directory / content / SCF data over REST (recipes + gotchas) →
  `../lumenloop-api-query/SKILL.md`
- Commission metered research (answer / report / sources / structured output) →
  `../lumenloop-api-research/SKILL.md`
- Self-service API key management (mint, rotate, revoke) →
  `../lumenloop-api-keys/SKILL.md`
- Budgets, quota vs credits, x402 USDC top-ups, budget requests →
  `../lumenloop-api-billing/SKILL.md`
- Build a client/agent on the API (codegen, retries, pacing) →
  `../lumenloop-api-integrate/SKILL.md`

---

## Authentication

Every authenticated request sends one header:

```
Authorization: Bearer <credential>
```

Two credential types, told apart automatically by the server (no separate endpoint
per method):

1. **API key** — starts with `llmcp_`. Issued by LumenLoop with a fixed tier. Best
   for servers, scripts, and agent backends. **Keep it secret; the plaintext is shown
   exactly once at creation.** Partners can mint and revoke their own keys — see
   `../lumenloop-api-keys/SKILL.md`.
2. **OAuth access token** — a JWT from the LumenLoop authorization server, used by
   OAuth-capable clients. Discovery metadata:
   `GET https://mcp.lumenloop.com/.well-known/oauth-protected-resource`. New OAuth
   identities default to the **guest** tier; higher tiers are granted server-side
   per identity.

**No credential needed** for the discovery surface: `GET /v1`, `GET /v1/docs`,
`GET /v1/tools`, `GET /v1/tools/{name}`, `GET /v1/openapi.json`. Discovery responses
are projected per credential (unauthenticated and external callers see the 21
external-lane tools). The origin marks them private with a 5-minute lifetime — treat
catalogs/docs as cacheable for ~5 minutes per credential, but don't key logic off the
exact `Cache-Control` header (the edge may rewrite caching headers).

## Tiers

Tiers are a ladder — each includes everything below it. This skill family covers the
two **external-lane** tiers:

| Tier | Adds | Rate limits |
| --- | --- | --- |
| `guest` | Browse the published surface: directory, content summaries, semantic search, SCF data | 30 req/min, 2,000 req/day |
| `partner` | Commissioned research over the full corpus (`request_research`), metered in USD against your account quota | 240 req/min, 30,000 req/day + research quota |

Higher internal-lane tiers exist for LumenLoop's own operations; they are not covered
here. Check your own tier, limits, and quota with `GET /v1/me` (authenticated). Want
a key or a higher tier? Contact LumenLoop at https://lumenloop.com.

## First call — smoke test

Step 1: confirm who you are and what you can do.

```bash
curl -s https://api.lumenloop.com/v1/me \
  -H "Authorization: Bearer $LUMENLOOP_KEY"
```

`data` describes your credential (values below are illustrative):

```json
{
  "success": true,
  "data": {
    "principal": "…",
    "auth_method": "api_key",
    "tier": "partner",
    "tiers": ["guest", "partner"],
    "lane": "external",
    "limits": { "requests_per_minute": 240, "requests_per_day": 30000 },
    "tools": { "available": 21, "visible": 21 },
    "billing": {
      "billing_state": "attached",
      "research_quota_usd": 50,
      "month_spend_usd": 12.5,
      "credits_total_usd": 25,
      "credits_remaining_usd": 25,
      "research_enabled": true
    }
  },
  "error": null
}
```

Check three things: `tier` (guest or partner), `limits` (your per-minute/day budget),
and `billing.billing_state` (`attached` means research is billable; `no_account` /
`no_budget` predict a 402 on `request_research` — see
`../lumenloop-api-billing/SKILL.md`).

Step 2: invoke one tool. Arguments go in the JSON body and are validated against the
tool's schema (`GET /v1/tools/{name}` shows it as JSON Schema). Tools with no
arguments accept an empty body.

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/search_directory \
  -H "Authorization: Bearer $LUMENLOOP_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "decentralized exchange", "limit": 5}'
```

```json
{
  "success": true,
  "data": {
    "count": 5,
    "projects": [ { "slug": "…", "title": "…", "category": "…" }, … ]
  },
  "error": null,
  "meta": { "tool": "search_directory", "format": "json" }
}
```

Note `format: "json"` — `search_directory` answers with one parsed JSON object,
`count` plus the matching `projects` (see the envelope rules below).

If both calls return `success: true`, you are connected.

## The response envelope

Every invocation returns the same envelope:

```json
{ "success": true, "data": …, "error": null, "meta": { "tool": "…", "format": "json" } }
```

`meta.format` tells you how to read `data` — this rule is deterministic:

- `"json"` — the tool emitted JSON; `data` is the parsed object/array. Every
  catalog tool answers this way; the five that used to return multi-block
  content now return single objects — `search_directory` `{count, projects}`,
  `get_categories` `{count, categories}`, `get_regions` `{count, regions}`,
  `get_scf_submissions` `{count, submissions}`, `get_project_tags_vocabulary`
  `{count, tags}`.
- `"text"` — the tool emitted prose; `data` is `{ "text": "…" }`.
- `"blocks"` — multi-part result; `data` is `{ "content": [...] }` (MCP content
  blocks). Retired for the catalog tools — keep a fallback only if your client
  must tolerate older deployments: scan `data.content[]` for the first text
  block starting with `[` or `{` and JSON-parse it.

One caveat: prose inside a successful envelope is not always data. It can be a count
line, a not-found message (`get_document` on a missing id → `format: "text"`,
`data.text` = "No document found with ID 4321 in articles"), or an upstream failure
("… failed: …"). **Read the prose before assuming data** — a `failed:` prefix is a
tool-level error even though `success` is `true`.

## Errors

Errors use HTTP status + the same envelope with `success: false`, a machine-readable
`code`, and a `hint` with the next step:

| Status | `code` | Meaning / what to do |
| --- | --- | --- |
| 400 | `invalid_arguments` | Body failed the tool's schema — the `details` array lists each issue; fix and retry |
| 401 | `unauthorized` | Missing/invalid/expired credential — re-authenticate (see the `WWW-Authenticate` header) |
| 402 | `payment_required` | Metered tool without a billing account/quota — contact LumenLoop to enable partner research |
| 403 | `insufficient_scope` | Your tier is below the tool's `required_tier` — request an upgrade or use a lower-tier alternative |
| 404 | `unknown_tool` | No such tool for your tier — `GET /v1/tools` for the catalog |
| 429 | `rate_limited` | Over the per-minute/day budget — wait `Retry-After` seconds, watch `X-RateLimit-*` headers |
| 5xx | `tool_failed` | Upstream/internal failure — safe to retry with backoff |

A real 401 looks like:

```json
{ "success": false, "data": null, "error": "Invalid, expired, or revoked API key", "code": "unauthorized" }
```

## Rate limits

Every response carries:

- `X-RateLimit-Limit` — your per-minute budget
- `X-RateLimit-Remaining` — calls left in the current window
- `X-RateLimit-Reset` — when the window resets (unix seconds)

On 429 you also get `Retry-After` (seconds). **Pace yourself off `Remaining`** instead
of retry-looping; daily caps (guest 2,000 / partner 30,000) apply on top of the
per-minute ones.

## The 21 tools at a glance

All invoked as `POST /v1/tools/{name}`. Full per-endpoint reference →
`reference/endpoint-catalog.md`; live catalog with schemas → `GET /v1/tools`.

| Group | Tools | Tier |
| --- | --- | --- |
| Directory & taxonomy | `search_directory`, `get_project`, `get_related_projects`, `get_categories`, `get_regions`, `get_tags_vocabulary`, `get_project_tags_vocabulary` | guest |
| SCF funding | `get_scf_submissions`, `find_similar_scf_submissions` | guest |
| Semantic discovery | `search_content_semantic`, `find_content_about_project`, `find_av_passages`, `find_content_by_entity`, `find_similar_projects_semantic` | guest |
| Documents & research library | `list_documents`, `search_documents`, `get_document`, `list_research` | guest |
| Commissioned research (metered) | `request_research`, `research_result`, `list_my_research` | partner |

## Which skill for which job

| You want to… | Use skill |
| --- | --- |
| Search/browse the directory, content, SCF data (recipes + gotchas) | `../lumenloop-api-query/SKILL.md` |
| Commission a research run; pick answer vs report vs sources vs structured output; poll results | `../lumenloop-api-research/SKILL.md` |
| Mint a key per agent, rotate, revoke, list credentials | `../lumenloop-api-keys/SKILL.md` |
| Understand quota vs credits, read `billing`, top up via x402, request a budget raise | `../lumenloop-api-billing/SKILL.md` |
| Generate a typed client, design retries/backoff, pace an agent fleet | `../lumenloop-api-integrate/SKILL.md` |
| Get connected, decode an error, check your tier | this skill |

## Pointers

- Live agent guide (canonical, generated from the tool registry): `GET https://api.lumenloop.com/v1/docs`
- OpenAPI 3.1 spec for codegen: `GET https://api.lumenloop.com/v1/openapi.json`
- Full REST endpoint reference: `reference/endpoint-catalog.md`
- MCP setup + guest query playbooks: https://github.com/lumenloop/lumenloop-skills
- Get a credential / request a tier: https://lumenloop.com
