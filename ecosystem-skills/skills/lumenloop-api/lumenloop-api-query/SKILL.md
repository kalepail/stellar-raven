---
name: lumenloop-api-query
description: Query LumenLoop's Stellar ecosystem data — the project directory, AI content summaries, SCF funding history, and semantic search — through 18 guest-tier read tools on the REST API at https://api.lumenloop.com/v1. Use when querying Stellar ecosystem projects, content, or SCF data over HTTP, building scripts or agents that browse the directory, resolving project names to slugs, or finding content about a topic or project via the REST API.
user-invocable: true
---

# Query the Stellar Ecosystem over the LumenLoop REST API

LumenLoop's REST API exposes **18 guest-tier read tools** over the Stellar
ecosystem dataset — the **project directory**, **Stellar Community Fund (SCF)
submissions**, and the **content library** (articles, AV, events, research) with
AI summaries and semantic search. Every tool is invoked the same way:

```bash
curl -X POST https://api.lumenloop.com/v1/tools/{name} \
  -H "Authorization: Bearer $LUMENLOOP_KEY" \
  -H "Content-Type: application/json" \
  -d '{ ...args... }'
```

Envelope recap (full contract → `../lumenloop-api-connect/SKILL.md`):

- Every call returns `{ "success", "data", "error", "meta" }`.
- `meta.format` is **per-tool** — all 18 read tools now answer `"json"` (`data` is the parsed result, one JSON object), except `get_document` on a missing id, which answers `"text"` (`data` is `{ "text": "…" }`). The former `"blocks"` envelope is retired for these tools — see [Parse the envelope](#parse-the-envelope).
- A `failed:` prefix in `data.text` is a tool-level error, even with `success: true`. (`get_document` on a missing id answers with plain not-found prose as `"text"` — no `failed:` prefix.)

Args go in the JSON body, validated against each tool's JSON Schema — discover it
unauthenticated via `GET /v1/tools/{name}` (catalog: `GET /v1/tools`). Exact
signatures for all 18 tools → **`reference/tool-cheatsheet.md`**.

## When to use this skill

- You need Stellar ecosystem **projects, content, or SCF data over plain HTTP** — no MCP client required.
- You are **building a script, cron job, or agent** that browses the directory.
- You have a project **name and need its slug** (the key most tools take).
- You want **what has been published** about a topic or one project, with citable urls.
- You need the **exact args** for one of the 18 tools (→ `reference/tool-cheatsheet.md`).

## Related skills

- Auth, envelope, errors, rate limits — the full API contract → `../lumenloop-api-connect/SKILL.md`
- Summaries not enough? Commission server-side research over the full LumenLoop corpus
  (`request_research`, partner tier) → `../lumenloop-api-research/SKILL.md`
- Production client patterns (retries, pagination, codegen) → `../lumenloop-api-integrate/SKILL.md`

---

## Recipe 1 — profile-a-project

Build a profile of one ecosystem project (guest tier).

```bash
# 1. Resolve the name to a slug — never guess slugs
curl -s -X POST https://api.lumenloop.com/v1/tools/search_directory \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"query":"wallet","limit":2}'
```

```json
{"success":true,"data":{"count":2,"projects":[
  {"slug":"abroad","title":"…","description":"…","category":"…","tags":["…"]},
  {"slug":"adamik","title":"…","description":"…","category":"…","tags":["…"]}
]},"error":null,"meta":{"tool":"search_directory","format":"json"}}
```

One JSON object — `data.count` plus the rows under `data.projects`. Pull them
with `jq '.data.projects'`. A zero-hit query (e.g. a long natural-language
phrase) returns a recovery hint alongside the empty result — read it instead
of retry-looping the same query.

Resolve any name the same way; the rest of this recipe profiles `aquarius`.
Outputs below are abridged to `.data` — the envelope is identical on every call.

```bash
# 2. Identity, links, category — compact:true cuts ~95% of the payload
curl -s -X POST https://api.lumenloop.com/v1/tools/get_project \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"slug":"aquarius","compact":true}'
```

```json
{"slug":"aquarius","title":"Aquarius","description":"…","category":"Financial Protocols",
 "tags":["DeFi","AMM"],"twitter_handles":["aqua_token"],"website":"https://aqua.network",
 "other_names":["AQUA"]}
```

Omit `compact` only when you need the full row (~8k chars) — the slim shape is
the right default for writing and citation.

```bash
# 3. Recent coverage with summaries (grouped by content type)
curl -s -X POST https://api.lumenloop.com/v1/tools/find_content_about_project \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"slug":"aquarius","limit":5}'
```

```json
{"articles":[{"id":4321,"title":"…","url":"https://…","publishing_date":"2026-05-28",
  "summary":"…","similarity":0.62}],
 "av":[{"id":918,"title":"…","url":"https://…","summary":"…"}]}
```

```bash
# 4. Funding history — pass slug OR name (fuzzy); at least one is required
curl -s -X POST https://api.lumenloop.com/v1/tools/get_scf_submissions \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"slug":"aquarius"}'
```

```json
{"count":1,"submissions":[
 {"slug":"…","linked_project_slug":"aquarius","title":"Aquarius","round":"SCF #…",
  "round_number":…,"award_type":"…","category":"Financial Protocols","budget":…,
  "description":"…","submission_url":"https://…"}]}
```

```bash
# 5. Competitive landscape — project→project similarity
curl -s -X POST https://api.lumenloop.com/v1/tools/find_similar_projects_semantic \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"slug":"aquarius","limit":5}'
```

```json
{"results":[{"slug":"soroswap","title":"Soroswap","description":"…","similarity":0.81},
 {"slug":"stellarx","title":"StellarX","description":"…","similarity":0.78}]}
```

## Recipe 2 — topic-research

Find what has been published about a topic (guest tier).

```bash
# 1. Meaning-based search across all content types
curl -s -X POST https://api.lumenloop.com/v1/tools/search_content_semantic \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"query":"real-world asset tokenization on Stellar","limit":5}'
```

```json
{"articles":[{"id":4321,"slug":"tokenization-basics","title":"…","url":"https://…",
  "publishing_date":"2026-04-02","summary":"…","similarity":0.71}],
 "av":[{"id":918,"title":"…","url":"https://…","summary":"…","similarity":0.64}]}
```

Narrow with `"types":["articles"]` plus `date_start`/`date_end`/`sources` —
fanning out across all types multiplies the row count. `limit` defaults to
**5 per content type**; the default `response_format: "concise"` omits each
hit's `long_summary` — pass `"response_format":"detailed"` to include it.
Weak semantic hits may carry a `_weak_match` flag plus a `_hint`, and a
zero-hit search returns a recovery hint (rephrase, widen types/dates) rather
than a bare empty result.

```bash
# 2. Timestamped spots in video/audio — find the exact moment to quote
curl -s -X POST https://api.lumenloop.com/v1/tools/find_av_passages \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"query":"real-world asset tokenization","limit":5}'
```

```json
{"results":[{"id":918,"title":"…","url":"https://…","summary":"…","created_at":"2026-04-24T19:47:01Z","start_offset":1422}]}
```

`created_at` is the recording's date — use it to judge and cite how recent a
talk is. `start_offset` is an opaque transcript position (a chunk offset, **not**
playback seconds) — use it only to order passages within a recording. Do not
render it as an mm:ss timestamp or build a deep-link from it; cite the recording
link + date and the passage text, not a derived time.

```bash
# 3. Full metadata of a promising hit — found: format "json", one object.
#    Missing id: format "text", data.text "No document found with ID 4321 in
#    articles" — still success:true, NO failed: prefix, so check for the prose.
curl -s -X POST https://api.lumenloop.com/v1/tools/get_document \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"collection":"articles","id":4321}'

# 4. Which ecosystem projects does that item mention?
curl -s -X POST https://api.lumenloop.com/v1/tools/get_related_projects \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"content_id":4321,"content_type":"article"}'
```

```json
{"results":[{"slug":"aquarius","title":"Aquarius","description":"…",
  "category":"Financial Protocols"}]}
```

Only have an entity NAME (token, org, project) and no slug? `find_content_by_entity`
(`entity`, optional `entity_type`, `min_confidence` default 0.5) matches extracted
entity mentions case-insensitively — exact grounding instead of semantic similarity.

## Recipe 3 — explore-scf-funding

Explore Stellar Community Fund history by theme (guest tier).

```bash
# 1. Thematically similar proposals (query XOR slug — never both)
RESP=$(curl -s -X POST https://api.lumenloop.com/v1/tools/find_similar_scf_submissions \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"query":"ZK proofs for compliance","limit":5}')
echo "$RESP" | jq '.data'
```

```json
{"results":[{"title":"…","round":"SCF #29","category":"Developer Tooling",
  "award_type":"…","description":"…","linked_project_slug":"…","similarity":0.69}]}
```

```bash
# 2. All submissions of the project behind the top hit
SLUG=$(echo "$RESP" | jq -r '.data.results[0].linked_project_slug')
curl -s -X POST https://api.lumenloop.com/v1/tools/get_scf_submissions \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d "{\"slug\":\"$SLUG\"}" | jq '.data.submissions'

# 3. What the funded team is building now
curl -s -X POST https://api.lumenloop.com/v1/tools/get_project \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d "{\"slug\":\"$SLUG\",\"compact\":true}"
```

## Recipe 4 — browse-latest

Page through the newest published content (guest tier).

```bash
# 1. Newest articles first
curl -s -X POST https://api.lumenloop.com/v1/tools/list_documents \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"collection":"articles","limit":10,"sort":"publishing_date","order":"DESC"}'
```

```json
{"items":[{"id":5102,"title":"…","url":"https://…","slug":"…",
  "publishing_date":"2026-06-09","summary":"…","tags":["DeFi"]}],
 "pagination":{"total":4980,"page":1,"limit":10,"hasMore":true}}
```

```bash
# 2. Drill into one item — one JSON object (id comes back as a string).
#    A missing id flips to format "text" not-found prose (no failed: prefix).
curl -s -X POST https://api.lumenloop.com/v1/tools/get_document \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"collection":"articles","id":5102}'

# Exact-title lookup (known announcement) — keyword, not semantic
curl -s -X POST https://api.lumenloop.com/v1/tools/search_documents \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"collection":"articles","query":"protocol 23","limit":10}'
```

LumenLoop's own published research library browses the same way: `list_research`
returns previews (id, title, format, status, summary); fetch one full record with
`get_document` and `{"collection":"research","id":…}`. Commissioning NEW research
is partner tier → `../lumenloop-api-research/SKILL.md`.

---

## Gotchas

- **`search_directory` is keyword/ILIKE first.** Short terms hit ("wallet",
  "oracle", "RWA"). A long natural-language phrase that matches no substring now
  **auto-falls back to semantic project search** — the response carries
  `match_mode: "semantic"` + a per-row `similarity`, so you still get the closest
  projects (not 0). For pure project-to-project neighbors use
  `find_similar_projects_semantic`; for content use `search_content_semantic`.
- **For "latest / current" ecosystem facts, search the corpus first.** Protocol
  versions, whether a program or fund is still active, recent incidents or
  launches, who shipped lately — `search_content_semantic` and
  `find_content_about_project` return dated, citable results (ranking is
  recency-aware and the corpus updates continuously), so cite the result date.
  Reach for live web only for facts the corpus can't hold, e.g. upstream
  package/registry pins (crates.io, npm, GitHub release tags).
- **Never guess slugs.** Resolve names via `search_directory` first — a guessed
  slug 404s or returns empty.
- **Summaries orient; quotes come from the source.** Content tools return
  LumenLoop AI summaries + the source `url` — when you need exact wording,
  fetch the `url` (for AV, jump to the timestamp) and quote the original.
  Always cite the url.
- **`get_project` is heavy by default** (~8k chars). Pass `compact:true` for
  writer/citation use (~500 chars).
- **`find_similar_scf_submissions` takes `query` XOR `slug`** — natural-language
  query for topics, an existing submission slug for neighbors. Not both.
- **`get_related_projects` is content→projects** (takes `content_id` +
  `content_type`). Project→project similarity is `find_similar_projects_semantic`.
- **Vocabularies are controlled.** Call `get_categories` / `get_regions` /
  `get_tags_vocabulary` / `get_project_tags_vocabulary` (no args) before
  filtering — do not invent category or tag strings. Content tags ≠ project tags.
- **"videos" and "av" are aliases** for the same collection. `search_documents`,
  `get_document`, and `list_documents` all accept either.
- **Pace off `X-RateLimit-Remaining`** (guest 30 req/min, 2,000 req/day;
  partner 240 req/min, 30,000 req/day). On 429 wait `Retry-After` seconds
  instead of retry-looping.

## Parse the envelope

```bash
curl -s … | jq '.data'                                    # just the payload
curl -s … | jq -e '.success' >/dev/null || echo "failed"  # guard a script on success
```

All 18 tools are `"json"` — `data` is one parsed JSON object. The five tools
that used to answer with the multi-block envelope now return single objects:
`search_directory` → `{count, projects}`, `get_scf_submissions` →
`{count, submissions}`, `get_categories` → `{count, categories}`,
`get_regions` → `{count, regions}`, `get_project_tags_vocabulary` →
`{count, tags}` (the `"blocks"` format and its block-extraction helper are no
longer needed for any read tool). The one exception is `get_document` on a
missing id, which returns `"text"` prose
(`No document found with ID 4321 in articles`) inside a `success: true`
envelope — no `failed:` prefix, so check `data.text` for it.

## Pointers

- Exact signatures for all 18 tools → `reference/tool-cheatsheet.md`
- Tool catalog + per-tool schemas (no auth) → `GET https://api.lumenloop.com/v1/tools` and `/v1/tools/{name}`
- Agent guide → `GET https://api.lumenloop.com/v1/docs` · OpenAPI 3.1 → `GET /v1/openapi.json`
- Auth + envelope + errors → `../lumenloop-api-connect/SKILL.md`
