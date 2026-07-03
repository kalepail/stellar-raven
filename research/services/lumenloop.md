# Lumenloop — service spec (codemode wrapper research)

> Verified by live probes on **2026-07-01** with the partner API key from
> `stellar-raven-codemode/.env` (`LUMENLOOP_API_KEY`, format `llmcp_…` — value redacted
> everywhere in this doc). **Re-verified 2026-07-02:** OpenAPI byte-identical to the
> 07-01 save, changelog still 16 entries (latest 2026-06-25), tool union still 18 + 3 = 21
> (`/v1/me` `tools.available: 21`) — no upstream change since 07-01. Backend truth cross-checked against the local clone at
> `/Users/kalepail/Desktop/lumenloop-backend/` (service `lumenloop-mcp`) and prior measured
> characterization in `/Users/kalepail/Desktop/stellar-raven-next/research/capability/lumenloop.md`.

## Overview

LumenLoop is a content + directory + research platform for the **Stellar ecosystem**:
project directory, news/articles, AV (videos/podcasts/spaces) with transcript-derived AI
summaries, events, jobs, governance proposals, SCF (Stellar Community Fund) submissions,
and LumenLoop's own editorial research. It is explicitly built for agents: machine-readable
catalog with `when_to_use`/`returns` guidance per tool, a deterministic response envelope,
explicit error codes with hints, a keyless changelog, and downloadable agent-skill playbooks.

- **Base URL (REST):** `https://api.lumenloop.com/v1` (alias `https://mcp.lumenloop.com/api/v1`)
- **MCP endpoint:** `https://mcp.lumenloop.com/` (Streamable HTTP) — same tools, credentials, tiers, and rate limits as REST
- **Invoke pattern:** `POST /v1/tools/{name}` with a JSON body validated against the tool's JSON Schema
- **Versioning:** path-versioned (`/v1`); drift is published at keyless `GET /v1/changelog` (`?since=YYYY-MM-DD`, `?breaking=true`)

## Auth

Single header for everything: `Authorization: Bearer <credential>`. Two credential types,
auto-detected server-side:

1. **API key** — `llmcp_…`, issued by LumenLoop with a fixed tier. Ours is **partner** tier.
2. **OAuth JWT** — from LumenLoop's auth server (used by MCP connectors; discovery at
   `https://mcp.lumenloop.com/.well-known/oauth-protected-resource`). New OAuth identities default to **guest**.

Tier ladder (each includes everything below): `guest → partner → read → write → manager → admin`.
Only `guest` and `partner` are relevant externally; write/manager/admin tools are invisible
and 404 for external credentials.

- **Discovery is keyless**: `GET /v1`, `/v1/docs`, `/v1/tools`, `/v1/openapi.json`, `/v1/changelog`, `/llms.txt` all return 200 without auth.
- **Every tool invocation requires auth** — verified live: `POST /v1/tools/search_directory`
  with no header → HTTP 401 `{"success":false,"data":null,"error":"Missing or malformed Authorization: Bearer <credential> header","code":"unauthorized"}`.

### `GET /v1/me` (verified live 2026-07-01, identifiers redacted)

```json
{
  "success": true,
  "data": {
    "principal": "key:16",
    "auth_method": "api_key",
    "tier": "partner",
    "tiers": ["guest", "partner"],
    "lane": "external",
    "limits": { "requests_per_minute": 240, "requests_per_day": 30000 },
    "tools": { "available": 21, "visible": 21 },
    "billing": {
      "billing_state": "attached",
      "account": "user_REDACTED",
      "research_quota_usd": 50,
      "month_spend_usd": 3.49,
      "credits_total_usd": 0,
      "credits_remaining_usd": 0,
      "research_enabled": true
    }
  },
  "error": null
}
```

Budget model: only `request_research` is metered — billed in USD against a **$50/month
research quota** (`month_spend_usd` accounting), plus optional prepaid credits
(`credits_*`, top-up via x402 USDC on Stellar at `POST /v1/billing/topup`). Everything
else is free within rate limits.

## Response envelope (all tools)

```json
{ "success": true, "data": …, "error": null, "meta": { "tool": "search_directory", "format": "json" } }
```

`meta.format` is the deterministic read rule:
- `"json"` — `data` is the parsed object/array (shape is **per-tool**, not uniform: bare arrays, `{count, projects}`, type-keyed objects, etc.)
- `"text"` — `data` is `{ "text": "…" }`. **Soft-empty/guidance, not evidence** — used for unknown slugs, not-found ids, "pass query or slug" messages. Still `success: true`.
- `"blocks"` — `data` is `{ "content": [ {type:"text", text}, … ] }` (MCP content blocks; used by `get_related_projects`).

Known non-uniform `data` shapes (from measured prior art, consistent with live probes):
bare arrays (`find_similar_projects_semantic`, `find_similar_scf_submissions`,
`list_my_research`, `get_tags_vocabulary`); type-keyed objects
`{articles,av,events,research,scf_submissions,…}` for the three cross-content discovery
tools, with underscore meta keys (`_hint`, `_top_similarity`, `_weak_match`) on weak
matches; `{items, pagination:{page,limit,total,hasMore}, hint?}` for `list_documents`/
`search_documents`. Per-row dates are per-collection: `articles → publishing_date`,
`av`/`research → created_at`, `events → start_at`; the generic `date` field is often null.

## Error envelope (verified live)

HTTP status + same envelope with `success:false`, machine-readable `code`, `details[]`, and a `hint`:

| Status | `code` | Verified live example |
|---|---|---|
| 400 | `invalid_arguments` | `POST /v1/tools/search_directory {}` → `{"success":false,"data":null,"error":"Arguments failed validation for search_directory — query: Required","code":"invalid_arguments","details":[{"path":"query","message":"Required"}],"hint":"GET /api/v1/tools/search_directory for the argument schema."}` |
| 401 | `unauthorized` | missing/malformed Bearer header (see above) |
| 403 | `insufficient_scope` | tier below the tool's `required_tier` |
| 404 | `unknown_tool` | `POST /v1/tools/not_a_real_tool` → `{"success":false,"data":null,"error":"Unknown tool: not_a_real_tool","code":"unknown_tool","hint":"GET /api/v1/tools for the catalog available to you."}` |
| 402 | — | `request_research` without a billing account |
| 429 | `rate_limited` | over per-minute/day budget; carries `Retry-After` |
| 5xx | `tool_failed` | upstream/internal failure — retry with backoff |

Validation errors are non-retryable and self-describing (field names in the message since 2026-06-18).

## Rate limits (verified live + backend source)

Every response carries `X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset`
(unix seconds); 429 adds `Retry-After` (seconds). Observed live: `/v1/me` returned
`x-ratelimit-limit: 300` (the per-principal minute limiter), tool invocations returned
`x-ratelimit-limit: 30000` with `remaining` counting down (the partner **daily** bucket) —
i.e. the header reflects whichever bucket is binding, so refresh scripts should pace off
`Remaining`, not assume one window.

Source of truth (`lumenloop-backend/lumenloop-mcp/src/index.ts` + `src/api/router.ts`):

| Tier | Per minute | Per day |
|---|---|---|
| guest | 30 | 2,000 |
| partner | 240 | 30,000 |
| (per-principal ceiling) | 300 | — |

Pagination: only `list_documents` is truly paginated (`page` + `limit ≤ 100`,
response `pagination:{page,limit,total,hasMore}`). Everything else takes a `limit` cap only;
no cursors anywhere.

Latency observed live: simple lookups 0.08–0.16 s; embedding-backed semantic search ~0.5 s.

## Tool inventory (21 tools = 18 guest + 3 partner)

**Discovery quirk (confirmed live 2026-07-01):** `GET /v1/tools` returns only the **18
guest tools** (`data.count: 18`, scope note: "Guest lane only — the published read
surface") **even with the partner key**, while `GET /v1/me` reports
`tools:{available:21, visible:21}`. The 3 partner research tools are fully reachable via
`GET /v1/tools/{name}` (200 with auth, 404 without) and `POST /v1/tools/{name}`.
The OpenAPI spec likewise only lists the 18 guest tool paths. **Do not infer partner-tool
absence from the list endpoint or the spec** — union `/v1/tools` with per-tool lookups of
the research tools (or with `/v1/me` counts).

All guest tools: free (`metered:false`), auth required, counted against the tier rate
limit. `*` = required arg. Enum defaults from the live OpenAPI spec (2026-07-01) — note
`response_format` defaults to `detailed`; send `concise` explicitly for smaller payloads.

| Tool | Cat | Description (condensed) | Input | Output (`data`) |
|---|---|---|---|---|
| `search_content_semantic` | discovery | Meaning-based search across ALL content types at once (pgvector cosine); the default discovery tool; recency-aware, dated, citable | `query*`, `limit=20` (per type), `response_format=detailed`, `date_start/end`, `date_field`, `sources[]`, `types[]` | object keyed by present type → `{id,title,url,domain,publishing_date,summary,slug,similarity}`; `_weak_match`/`_hint`/`_top_similarity` meta on weak queries |
| `find_content_about_project` | discovery | All published content about ONE project **by slug** (resolve name via `search_directory` first), grouped by type | `slug*`, `limit=20`, `response_format`, `date_*`, `sources[]`, `types[]` | `{articles,av,events,research,scf_submissions}` (present types only); bad slug → soft-empty `data.text` |
| `find_content_by_entity` | discovery | Content mentioning a NAMED entity (LLM-extracted, confidence-filtered); works with no directory slug. **Trap: `entity_type:"person"` returns all-empty groups on this lane even for heavily covered people (verified 2026-07-03; control: organization returns full groups) — not evidence of absence; catalog note added** | `entity*`, `entity_type` (project\|person\|organization\|token), `content_type` (articles\|av\|events\|proposals\|scf_submissions), `min_confidence=0.5`, `date_*`, `limit=30` | object keyed by content type → rows with `entity_name`, confidence, `publishing_date` |
| `find_av_passages` | discovery | WHERE in videos/podcasts a topic is discussed; passage AI summary + parent metadata. `start_offset` is an **opaque ordering key, NOT playback seconds** | `query*`, `limit=15`, `date_start/end` | array of `{av_id,title,url,channel,summary,long_summary,start_offset,created_at}` |
| `search_directory` | directory | Find a project by name/keyword/category (substring; auto semantic fallback with `match_mode:"semantic"`). The slug resolver | `query*`, `limit=20` | `{count, projects:[{slug,title,description,category,tags,website}], match_mode?, note?}` |
| `get_project` | directory | One project by slug: links, category, tags, regions, parent, SCF awards. `compact=true` for ~500-char writer shape | `slug*`, `compact=false` | 12-key project object incl. `links{…}`, `scf{awarded_round[],awarded_total,submission_urls[]}` |
| `find_similar_projects_semantic` | directory | "Projects like X" via embedding cosine | `slug*`, `limit=10` | **bare array** of `{slug,title,description,similarity}` |
| `get_related_projects` | directory | Reverse lookup: projects mentioned by a content item | `content_id*:number`, `content_type*` (article(s)\|av\|video(s)\|event(s)\|research\|proposal(s)) | `meta.format:"blocks"` — `data.content[]` text blocks with projects JSON stringified |
| `get_categories` | directory | Controlled vocabulary of project categories | (none) | `{count, categories:[{id,name,slug}]}` |
| `get_regions` | directory | Distinct region values in use | (none) | `{count, regions:[string]}` |
| `get_project_tags_vocabulary` | directory | Controlled tags for directory projects | (none) | `{count, tags:[{id,name,slug}]}` |
| `get_tags_vocabulary` | directory | Controlled tags for content (articles/AV) | (none) | **bare array** of `{id,name,slug,…,article_count,av_count,total_count}` |
| `get_document` | content | Full metadata of one document by collection + numeric id (summary projection only — no body/transcript) | `collection*` (articles\|events\|videos\|av\|jobs\|research\|proposals), `id*:number` | flat document object (`title,url,summary,long_summary,tags,author,channel,publishing_date,…`) |
| `list_documents` | content | Browse/page a collection with filters + sorting; `search` is title/URL substring only | `collection*`, `page=1`, `limit=20 (≤100)`, `search`, `source`, `status`, `wp`, `period` (events), `sort`, `order=DESC` | `{items[], pagination:{page,limit,total,hasMore}, hint?}` — miss can carry `hint` → use `search_content_semantic` |
| `search_documents` | content | Exact title/URL substring match within one collection | `collection*`, `query*`, `limit=20` | `{items[], pagination}` (same projection as list) |
| `list_research` | content | Browse LumenLoop's OWN published editorial research (previews) | `status`, `format`, `source`, `editorial_style_slug`, `since`, `limit=20` | `{count, research:[{id,title,format,status,summary,created_at,…}]}` |
| `find_similar_scf_submissions` | scf | SCF submissions by topic (`query`) OR similar to an existing one (`slug`) — mutually exclusive (slug wins) | `query` XOR `slug`, `limit=15`, `round`, `category` | **bare array** of `{slug,title,description,category,round,award_type,budget,linked_project_slug(s),similarity}` |
| `get_scf_submissions` | scf | SCF submissions for one project incl. **full `application` proposal markdown**; pass slug (preferred) or fuzzy `name` — at least one (else clean 400) | `slug` and/or `name` | `{count, submissions:[{title,round,category,award_type,budget,description,application,submission_url,…}]}` |

Partner research tools (tier `partner`; invisible on `/v1/tools`, discoverable per-name; verified via authed `GET /v1/tools/{name}` 2026-07-01):

| Tool | Metered | Description | Input | Output (`data`) |
|---|---|---|---|---|
| `request_research` | **YES ($)** | Commission a server-side research agent over the full corpus. Modes: `answer` (flat ~$0.02, seconds), `sources`/`structured`/`report` (depth-dependent, capped ~$2/run, vs $50/mo quota). HTTP 402 without billing. Async | `question*` (5–4000 chars), `output_format` (report\|sources\|structured\|answer; default report), `format` (tweet\|thread\|long-form; report only), `output_schema` (structured only) | `{run_id, poll_after_s, message, recent_runs?}` |
| `research_result` | no (free poll) | Poll a run by `run_id`; `wait_s` (0–45) long-polls | `run_id*` (uuid), `wait_s` | running: `{status:"running",progress{…}}`; complete: mode-dependent (`answer` → `{answer,confidence,citations}`; `report` → `{report,sources,citations}`; etc.). Unknown uuid → soft-empty `data.text`; non-uuid → 400 |
| `list_my_research` | no (free) | List YOUR account's commissioned runs — **dedup before paying** | `limit=25 (≤100)` | **bare array** of `{run_id,status,started_at,title,slug,format,summary,created_at}` (published schema says `{results:[…]}` — trust the wire) |

**New since prior characterization (2026-06-27):** the collection enums now include
**`proposals`** (governance) in `get_document`, `list_documents`, `search_documents`,
`get_related_projects`, and `find_content_by_entity.content_type`.

### Live call proofs (2026-07-01)

- `search_directory {"query":"soroban defi","limit":3}` → 200 in 0.157 s, `{count:2, projects:[{slug:"nectar-network",…},{slug:"stellar-oracle-shield",…}]}`, `meta:{tool,format:"json"}`.
- `search_content_semantic {"query":"soroban defi liquidity","limit":2,"types":["articles"],"response_format":"concise"}` → 200 in 0.497 s, `data.articles[0]:{id:"8179",title:"Building Cross-Border Payment Flows on Stellar…",publishing_date:"2026-06-05…",similarity:0.439}`.
- `get_project {"slug":"soroswap","compact":true}` → 200 in 0.081 s, full identity object with `links{website,x,github,…}`.
- Error probes: unknown tool → 404 `unknown_tool`; missing arg → 400 `invalid_arguments` with `details[]` + `hint`; no auth → 401 `unauthorized`. All JSON, all enveloped.

## Docs & discovery endpoints (all keyless, all verified 200)

| Endpoint | Format | Content |
|---|---|---|
| `GET /v1` | JSON (enveloped) | machine-readable index: interfaces, auth methods, tiers, endpoint map |
| `GET /v1/docs` | **markdown** (text, ~23 KB) | full agent guide: auth, tiers, envelope + `meta.format` rules, error table, rate-limit headers, 3 named workflows (profile-a-project, topic-research, explore-scf-funding), full tool catalog with curl examples |
| `GET /v1/tools` | JSON | catalog (guest lane only — 18) with `when_to_use`/`returns`/`detail` per tool |
| `GET /v1/tools/{name}` | JSON | one tool: full JSON Schema in/out, `example_args`, `invoke` block, `cost` (metered tools). Works for partner tools with auth |
| `GET /v1/openapi.json` | OpenAPI **3.1.0** (~125 KB) | codegen spec — guest tools + account endpoints only. Saved pretty-printed at `research/services/lumenloop-openapi.json` |
| `GET /v1/changelog` | JSON | newest-first integration changelog (16 entries live); `?since=YYYY-MM-DD`, `?breaking=true` |
| `GET /v1/skills` · `/v1/skills/{name}` · `/v1/skills/archive/{set}` | JSON / zip | agent skill playbooks served by the API itself (see below) |
| `GET /llms.txt` | text | llms.txt index pointing at docs/tools/openapi/MCP |
| `https://lumenloop.com/ai` | HTML | human/AI marketing guide: MCP connect instructions, the 8 public skills, `claude mcp add --transport http lumenloop https://mcp.lumenloop.com`, Claude Code plugin install (`/plugin marketplace add lumenloop/lumenloop-skills`) |
| `GET /v1/me` | JSON (auth) | tier, limits, tool counts, billing/budget |

Docs tier table (keyless view) only lists guest limits (30/min, 2,000/day); partner limits
come from `/v1/me`.

### Account-management endpoints (in OpenAPI — do not call from the wrapper)

`GET /me/credentials`, `POST /me/keys`, `DELETE /me/keys/{id}`, `GET /me/budget-requests`,
`POST /me/budget-request`, `GET/PUT/DELETE /me/webhook` (Standard-Webhooks-signed
research-run callbacks), `POST /billing/topup?amount={usd}` (x402 USDC top-up). These
mutate keys/budget/spend; the codemode wrapper should exclude them from any executable
surface (carry over stellar-raven's standing ban).

## Skills

Two distribution channels, same content:

**1. Served by the API** — `GET /v1/skills` returns **14 skills** in two sets:
- `public` set (8, tier guest, `available:true`): `lumenloop-mcp-connect`,
  `scf-submission-radar`, `stellar-builder-quickstart`, `stellar-content-auditor`,
  `stellar-ecosystem-digest`, `stellar-ecosystem-scout`, `stellar-integration-finder`,
  `stellar-project-dossier`.
- `partner` set (6, tier partner): `lumenloop-api-billing`, `lumenloop-api-connect`,
  `lumenloop-api-integrate`, `lumenloop-api-keys`, `lumenloop-api-query`,
  `lumenloop-api-research`. **Quirk (live 2026-07-01):** the list shows
  `available:false` for the partner set even with the partner key, but
  `GET /v1/skills/{name}` returns the full partner skill content with the same key —
  same trust-the-detail-endpoint rule as partner tools.
- `GET /v1/skills/{name}` returns every file inline: `{name,set,tier,description,files:[{path,content}]}`.
- `GET /v1/skills/archive/public` → application/zip (~43 KB, verified).

**2. GitHub repo `lumenloop/lumenloop-skills`** (public set only; MIT; the partner set
comes from a separate `lumenloop-api-skills` repo per the backend's
`skills-content/manifest.json`). Structure:

```
.claude-plugin/{marketplace.json, plugin.json}   # Claude Code plugin (name: lumenloop-skills)
.mcp.json                                        # wires {"lumenloop": {type:"http", url:"https://mcp.lumenloop.com"}}
scripts/validate_skills.mjs
skills/<name>/SKILL.md                           # YAML frontmatter: name, description, user-invocable
skills/<name>/reference/*.md                     # optional: tool-catalog / output templates
```

SKILL.md format is standard Claude Agent Skills: `---\nname: …\ndescription: … (with
"Use when …" trigger)\nuser-invocable: true\n---` followed by a markdown playbook that
names exact MCP tools and call order. Each skill maps to a tool choreography (e.g.
`stellar-ecosystem-scout` → `search_directory` + `find_similar_projects_semantic` +
vocab tools + `search_content_semantic`; `scf-submission-radar` →
`find_similar_scf_submissions` + `get_scf_submissions`). Installing the plugin wires the
MCP connector automatically.

## Notes for the unified codemode wrapper

**Discoverability: excellent — the best-instrumented service in the set.** The whole
surface is machine-readable and self-describing: JSON index, per-tool JSON Schemas
(draft-07) with `when_to_use`/`returns`/`example_args`, OpenAPI 3.1 for codegen, a
keyless changelog for drift detection, and markdown docs. Tool descriptions are already
written for LLM routing — the search side of a search+execute codemode server can index
`/v1/tools` output nearly verbatim.

Wrapper guidance:
1. **Uniform invoke shape**: every tool is `POST /v1/tools/{name}` + JSON body + Bearer —
   one generic executor covers all 21 tools. Validate args client-side from
   `input_schema`; the server 400s cleanly with field-level `details[]` if you don't.
2. **Normalize per-tool, never assume `data.results`** — branch on `meta.format` first
   (`json`/`text`/`blocks`), and treat `data.text` under `success:true` as
   soft-empty/guidance, never evidence.
3. **Catalog union**: an inventory refresh must merge keyless `GET /v1/tools` (18) with
   authed `GET /v1/tools/{request_research,research_result,list_my_research}` and
   `GET /v1/me` (`tools.available`) — the list endpoint hides the partner lane.
4. **Cost gating**: only `request_research` is metered (`metered:true` + `cost` string in
   its detail). Gate it (dedup via `list_my_research` first, default `output_format:"answer"`,
   respect `research_quota_usd` − `month_spend_usd` from `/v1/me`). All 20 other tools are free.
5. **Exclude account endpoints** (`/me/keys`, `/me/webhook`, `/billing/topup`, …) from any
   executable surface.
6. **Slug-first discipline**: expose the `search_directory → slug → get_project /
   find_content_about_project / get_scf_submissions` chain in the wrapper docs; guessed
   slugs soft-fail.
7. **Pace off `X-RateLimit-Remaining`** (buckets differ per endpoint); partner budget is
   240/min, 30k/day.
8. **Drift watch**: poll `GET /v1/changelog?since=<last-run>` in the refresh script; enums
   already gained `proposals` since the 2026-06-27 characterization.
9. MCP transport exists (`https://mcp.lumenloop.com/`) but the REST lane is simpler for a
   codemode wrapper and is contractually identical.

### Refresh-script curl commands

```bash
# keyless discovery
curl -s https://api.lumenloop.com/v1                       # index
curl -s https://api.lumenloop.com/v1/docs                  # agent guide (markdown)
curl -s https://api.lumenloop.com/v1/tools                 # guest tool catalog (18)
curl -s https://api.lumenloop.com/v1/openapi.json          # OpenAPI 3.1
curl -s https://api.lumenloop.com/llms.txt
curl -s "https://api.lumenloop.com/v1/changelog?since=2026-07-02"
curl -s https://api.lumenloop.com/v1/skills

# authed: account/limits/budget + partner-tool schemas (union with /v1/tools)
curl -s -H "Authorization: Bearer $LUMENLOOP_API_KEY" https://api.lumenloop.com/v1/me
for t in request_research research_result list_my_research; do
  curl -s -H "Authorization: Bearer $LUMENLOOP_API_KEY" "https://api.lumenloop.com/v1/tools/$t"
done

# per-tool schema (works keyless for guest tools)
curl -s https://api.lumenloop.com/v1/tools/search_content_semantic

# smoke-test invoke (free)
curl -s -X POST https://api.lumenloop.com/v1/tools/search_directory \
  -H "Authorization: Bearer $LUMENLOOP_API_KEY" -H "Content-Type: application/json" \
  -d '{"query":"soroban defi","limit":3}'
```
