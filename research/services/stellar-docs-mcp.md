# Stellar Docs MCP — verified inventory

> **Status (decided 2026-07-01): FALLBACK PATH.** Direct Algolia REST search with the dedicated
> search key is now the primary integration — see
> [`stellar-docs-algolia.md`](./stellar-docs-algolia.md) for endpoints, index settings, adapter
> design, and refresh probes. This MCP doc is retained as the fallback path (e.g. if the search
> key is revoked); its content remains accurate as of the date above.

_Measured live on **2026-07-01** with raw curl JSON-RPC probes + the in-session MCP client tools.
Cross-checked against prior art in
`/Users/kalepail/Desktop/stellar-raven-next/research/capability/stellar-docs-mcp.md` (2026-06-25
audit) — zero drift on tool names/schemas; corpus size moved 3916 → 3808 (dedup-counted)._

## Overview

An **Algolia-hosted MCP server** (`algolia-mcp` v1.0.0) exposing keyword search over the official
Stellar developer docs corpus (`developers.stellar.org` docs + blog + meeting notes), indexed by the
Algolia DocSearch crawler. It exposes exactly **2 tools** over one Algolia index
(`docs_replica_agent`): a working search tool and a facet-values tool that is **broken on this
index**. Net usable surface: **one search tool**.

- **Server URL**: `https://VNSJF5AWIZ.algolia.net/mcp/1/yXtzs-p7TOyu9BQddSwV9g/mcp`
- **Auth**: none (keyless; the token is embedded in the URL path)
- **serverInfo**: `{"name":"algolia-mcp","version":"1.0.0"}`
- **capabilities**: `{"tools":{"listChanged":true}}`
- **Index**: `docs_replica_agent` — a replica of primary index `crawler_Stellar Docs - Docusaurus`
  (12,867 raw records; empty-query `nbHits` via MCP ≈ 3,808 because DocSearch `distinct` groups
  records per page/section)

## Protocol details

- **Transport**: MCP Streamable HTTP. Single endpoint, POST only.
- **Response framing**: every response is **one SSE frame** (`Content-Type: text/event-stream`,
  body = `event: message\ndata: {json-rpc}\n\n`) with a fixed `Content-Length` — no streaming of
  partials, no multi-event streams. Parse: strip the `data: ` prefix of the single event.
- **Accept header is enforced**: you MUST send
  `Accept: application/json, text/event-stream`. Sending only `application/json` →
  **HTTP 406** with `{"error":{"code":-32000,"message":"Not Acceptable: Client must accept both
  application/json and text/event-stream"}}`.
- **Stateless**: `initialize` returns **no `Mcp-Session-Id` header**. `tools/list` and `tools/call`
  work on fresh connections with no prior `initialize` and no session header. The
  `notifications/initialized` POST returns **HTTP 202 Accepted** (empty body) but is optional.
- **Protocol version negotiation**: echoes whatever you send — probed with `2025-03-26` (echoed)
  and `2025-06-18` (echoed). No downgrade complaints.
- **GET on endpoint** → HTTP 405 (no server-initiated SSE stream support).
- **Unknown method** (e.g. `resources/list`) → JSON-RPC error `-32601 Method not found` (inside the
  SSE frame). Tools only — no resources/prompts.
- Both tools carry `execution.taskSupport: "forbidden"` — synchronous call-and-return only.
- Cloudflare-fronted; sets a `__cf_bm` cookie (ignorable), `Access-Control-Allow-Origin: *`.

## Tool inventory (full, from live `tools/list`)

### 1. `algolia_search_index_docs_replica_agent` — WORKS (the primary tool)

Title: "Algolia Search Index docs_replica_agent". Searches the index and returns the raw Algolia
JSON as-is (contract in description: no re-rank/filter/dedup/summarize).

Input schema (JSON Schema draft-07), **required: `query`, `userIntent`, `originalQuery`,
`sessionId`** — the last three are analytics-only (verified in prior art P7: they do not change
results), but the server zod-validates their presence:

| Param | Type | Notes |
| --- | --- | --- |
| `query` | string (required) | keyword query; per-word OR-ish matching, typo tolerant |
| `userIntent` | string (required) | LLM rationale — analytics only |
| `originalQuery` | string (required) | raw user prompt — analytics only |
| `sessionId` | string (required) | UUIDv4 — analytics grouping only |
| `attributesToRetrieve` | string[] enum `*, url, url_without_anchor, anchor, content, type, hierarchy, objectID` | default `["*"]` |
| `page` | number ≥0 | default 0 |
| `hitsPerPage` | number 1..1000 | default **5**; >1000 → `-32602 Too big` |
| `clickAnalytics` | boolean | default true |
| `facet_lang` / `facet_language` | string[] (AND) | e.g. `en` |
| `facet_type` | string[] (AND) | `content`, `lvl1`..`lvl5` |
| `facet_version` | string[] (AND) | `current` |
| `facet_docusaurus_tag` | string[] (AND) | `docs-default-current`, `default`, `blog_tags_posts`, `blog_posts_list`, `blog_authors_posts`, `blog_tags_list` |

### 2. `algolia_search_for_facet_values` — BROKEN on this index (deny)

Title: "Search For Facet Values". Required: `indexName` (enum: only `docs_replica_agent`),
`facetName`, `userIntent`, `originalQuery`, `sessionId`. Optional: `facetQuery` (default `""`),
`maxFacetHits` (≤100, default 10), `sortFacetValuesBy` (`count`|`alpha`).

**Verified broken 2026-07-01** (both via raw curl and the in-session MCP tool), on every facet
tried (`type`, `docusaurus_tag`):

```
Error: Cannot search in `type` attribute, you need to add `searchable(type)` to attributesForFaceting.
```

Returned as `result.content[0].text` with `"isError": true` — not a JSON-RPC error. No facet
attribute on this index is configured `searchable()`, so this tool can never succeed. If you need
facet counts, use the `facets` block that comes back free on every search response instead.

## Example request/response pairs

### tools/call — search "cross-chain transfers" (trimmed attributes)

Request body:
```json
{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"algolia_search_index_docs_replica_agent","arguments":{"query":"cross-chain transfers","userIntent":"inventory probe","originalQuery":"cross-chain transfers","sessionId":"550e8400-e29b-41d4-a716-446655440000","hitsPerPage":3,"attributesToRetrieve":["url","hierarchy","content","anchor","type","objectID"]}}}
```

Response (SSE frame; `result.content[0].text` is a **JSON string to parse**):
```json
{"hits":[
  {"url":"https://developers.stellar.org/docs/tokens/cross-chain-transfers",
   "anchor":"","type":"content",
   "hierarchy":{"lvl0":"Documentation","lvl1":"Cross-Chain USDC Transfers with CCTP","lvl2":null,"lvl3":null,"lvl4":null,"lvl5":null,"lvl6":null},
   "objectID":"2-https://developers.stellar.org/docs/tokens/cross-chain-transfers",
   "_snippetResult":{"content":{"value":"Circle's <span class=\"algolia-docsearch-suggestion--highlight\">Cross-Chain</span> Transfer Protocol (CCTP) supports native USDC","matchLevel":"partial"}}},
  {"url":"https://developers.stellar.org/docs/tools/infra-tools/cross-chain#learn-about-the-stellar-interchain-token-service-its", "...":"..."}],
 "nbHits":2,"page":0,"nbPages":1,"hitsPerPage":3,
 "facets":{"lang":{"en":3},"type":{"content":2,"lvl1":1},"version":{"current":3},"language":{"en":3},"docusaurus_tag":{"docs-default-current":3}},
 "queryID":"0159c0210005b62439fa8a3887342658"}
```

`query:"soroban storage"` (hitsPerPage 3) → `nbHits: 88, nbPages: 30`; top hit = the state-archival
TTL-extension guide, #3 = the getting-started "Storing Data" page. Sensible relevance for two-word
technical queries.

### Result (hit) shape

With `attributesToRetrieve:["*"]` each hit contains: `url`, `url_without_variables`,
`url_without_anchor`, `anchor`, `content` (full section text — can be **multi-KB**),
`content_camel` (duplicate of content — payload bloat, avoid `*`), `hierarchy.lvl0..lvl6`
(breadcrumb; nulls beyond depth), `type` (`content`|`lvl1`..`lvl5`), `lang`, `language`, `version[]`,
`tags[]`, `docusaurus_tag`, `weight{pageRank,level,position}`, `recordVersion`, `objectID`,
`_snippetResult.content{value,matchLevel}` (HTML-highlighted snippet), `_highlightResult`. The
top-level response always includes `nbHits`, `page`, `nbPages`, `hitsPerPage`, `facets{...}`,
`queryID`. Note: `processingTimeMS` is **not** present in the MCP-wrapped payload.

1 record = one page **section/anchor**, not a whole page — expect fragmented results; dedupe by
`url_without_anchor` if you want page-level results.

### Error envelope (two distinct shapes)

1. **Tool-level errors** (validation, Algolia errors): HTTP 200, JSON-RPC **`result`** with
   `result.isError: true` and the message in `result.content[0].text`. E.g. missing required args →
   `"MCP error -32602: Input validation error: Invalid arguments for tool …: [ {expected:string, code:invalid_type, path:[userIntent], …} ]"`.
   The facet-values Algolia failure arrives the same way. **A wrapper must check `isError` — do not
   treat `content[0].text` as data blindly.**
2. **Protocol-level errors**: JSON-RPC `error` object — `-32601` for unknown methods, `-32000` (with
   HTTP 406) for a bad Accept header.

## Latency

- MCP `tools/call` search: **0.41–0.73 s** total (curl, cold TLS each time; 3-sample empty-query
  run: 0.64 / 0.43 / 0.41 s). `initialize`: 0.85 s. `tools/list`: 0.52 s.
- Direct Algolia REST query: ~0.4–1.1 s cold; same ballpark. Both are "fast" tier.
- Because the server is stateless, a wrapper can skip the `initialize` handshake entirely and go
  straight to `tools/call` (saves ~2 RTTs).

## Direct Algolia alternative — VIABLE (with a different key)

- The **URL-path token `yXtzs-p7TOyu9BQddSwV9g` is NOT an Algolia search API key** — using it as
  `X-Algolia-API-Key` returns `403 {"message":"Invalid Application-ID or API key"}` on query and
  list-indexes endpoints. It is an MCP-endpoint token only.
- **But** `developers.stellar.org` (Docusaurus) embeds a public DocSearch config in its JS bundle
  (`/assets/js/main.527ff567.js`):
  - `appId: "VNSJF5AWIZ"` (same app)
  - `apiKey: "c932e7670879e29070e269d202fb6740"` (public search-only DocSearch key)
  - `indexName: "crawler_Stellar Docs - Docusaurus"`
- Verified working (2026-07-01):

```sh
curl -sS -X POST \
  'https://VNSJF5AWIZ-dsn.algolia.net/1/indexes/crawler_Stellar%20Docs%20-%20Docusaurus/query' \
  -H 'X-Algolia-Application-Id: VNSJF5AWIZ' \
  -H 'X-Algolia-API-Key: c932e7670879e29070e269d202fb6740' \
  -H 'Content-Type: application/json' \
  -d '{"query":"soroban storage","hitsPerPage":2,"attributesToRetrieve":["url","hierarchy.lvl1"]}'
```

  → 200 with the **same top hits** as the MCP replica (replica shares the primary's data; only
  ranking config can differ, and top results matched in testing). Full Algolia search params
  (`filters`, `facetFilters`, `distinct`, `attributesToSnippet`, `restrictSearchableAttributes`, …)
  become available — strictly more expressive than the MCP tool's `facet_*` params.
- Scope of that key: index-restricted. `GET /1/indexes` lists only
  `crawler_Stellar Docs - Docusaurus` (12,867 entries, replicas: `["docs_replica_agent"]`); querying
  `docs_replica_agent` directly with it → `403 "Index not allowed with this API key"`. So direct
  access = **primary index only**, MCP = **replica only**. Same corpus.
- Trade-off: the DocSearch key is scraped from the site bundle and could rotate on redeploy; the MCP
  endpoint is the "supported" surface. Reasonable design: use MCP as the contract, keep direct
  Algolia as a documented fallback/fast path with a health check.

## Notes for the unified codemode wrapper

1. **Only one tool is worth exposing.** Wrap `algolia_search_index_docs_replica_agent`; hard-exclude
   `algolia_search_for_facet_values` (broken on this index — prior art keeps it deny-by-omission;
   re-verified broken today). For facet exploration, surface the `facets` object from a normal
   search response.
2. **Skip the handshake.** Server is stateless: POST `tools/call` directly, no `initialize`, no
   `notifications/initialized`, no `Mcp-Session-Id`. Always send
   `Accept: application/json, text/event-stream` (406 otherwise) and parse the single
   `event: message` SSE frame.
3. **Auto-fill the analytics params.** `userIntent`, `originalQuery`, `sessionId` are required by
   server zod but never affect results. The wrapper should synthesize them (echo the query; one
   UUIDv4 per wrapper session) so callers only pass `query` + optional knobs.
4. **Double-parse + isError.** Payload is `result.content[0].text` — a JSON *string* of the Algolia
   response. Check `result.isError === true` first; error text is not JSON.
5. **Trim the payload.** Default `attributesToRetrieve:["*"]` returns `content` + `content_camel`
   (full duplicated section text) per hit. Use
   `["url","url_without_anchor","anchor","hierarchy","type","objectID"]` (+ `content` only when the
   caller wants body text); snippets come back regardless via `_snippetResult`.
6. **Relevance discipline** (from prior art, re-confirmed): Algolia matches per-word OR-ish —
   `nbHits==0` is a reliable "not in docs corpus" signal, but `nbHits>0` only means ≥1 word matched;
   judge the top hit's `hierarchy` + `_snippetResult`, not the count. Empty query returns the whole
   corpus (noise). `facet_docusaurus_tag:["docs-default-current"]` scopes to docs-only (drops
   blog/meeting notes).
7. **Strip HTML** from `_snippetResult.content.value`
   (`<span class="algolia-docsearch-suggestion--highlight">`).
8. **hitsPerPage cap is 1000**; default 5. `-32602` (as `isError` content) beyond that.

### Refresh-script curls (verified 2026-07-01)

```sh
MCP='https://VNSJF5AWIZ.algolia.net/mcp/1/yXtzs-p7TOyu9BQddSwV9g/mcp'
H1='Content-Type: application/json'
H2='Accept: application/json, text/event-stream'

# 1. initialize (optional — server is stateless; kept for drift detection of serverInfo/capabilities)
curl -sS -X POST "$MCP" -H "$H1" -H "$H2" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"codemode-inventory","version":"0.1.0"}}}'

# 2. initialized notification (optional; returns HTTP 202, empty body)
curl -sS -X POST "$MCP" -H "$H1" -H "$H2" \
  -d '{"jsonrpc":"2.0","method":"notifications/initialized"}'

# 3. tools/list — the actual inventory (works standalone on a fresh connection)
curl -sS -X POST "$MCP" -H "$H1" -H "$H2" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# 4. smoke-test tools/call
curl -sS -X POST "$MCP" -H "$H1" -H "$H2" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"algolia_search_index_docs_replica_agent","arguments":{"query":"soroban storage","userIntent":"inventory refresh smoke test","originalQuery":"soroban storage","sessionId":"550e8400-e29b-41d4-a716-446655440000","hitsPerPage":3,"attributesToRetrieve":["url","hierarchy","anchor","type","objectID"]}}}'

# Parse an SSE frame in a pipeline:
#   sed 's/^data: //' | grep -v '^event' | grep -v '^$' | jq .
# Then for tools/call: jq -r '.result.content[0].text' | jq .

# 5. direct-Algolia fallback health check (public DocSearch key, primary index)
curl -sS -X POST 'https://VNSJF5AWIZ-dsn.algolia.net/1/indexes/crawler_Stellar%20Docs%20-%20Docusaurus/query' \
  -H 'X-Algolia-Application-Id: VNSJF5AWIZ' \
  -H 'X-Algolia-API-Key: c932e7670879e29070e269d202fb6740' \
  -H 'Content-Type: application/json' \
  -d '{"query":"soroban storage","hitsPerPage":1}'
```

Drift markers to diff on refresh: tool names (renamed once before, 2026-06:
`algolia_search_index_crawler_Stellar Docs - Docusaurus` → `algolia_search_index_docs_replica_agent`),
`inputSchema.required` lists, index enum in the facet tool, `serverInfo.version`, empty-query
`nbHits` (corpus size: 3781 → 3916 → 3808), and whether facet-values is still broken.

## Cross-check vs prior art (stellar-raven-next)

- `research/capability/stellar-docs-mcp.md` (2026-06-25): all claims re-verified — stateless,
  no session id, 2 tools, taskSupport forbidden, facet tool broken, analytics-only required params,
  hitsPerPage max 1000, isError-in-result envelope. Only deltas: corpus `nbHits` 3916 → 3808 and
  protocolVersion echoes the client's requested version (prior art pinned `2025-06-18`; `2025-03-26`
  also accepted).
- `research/capability-index.md` line 32 lists the same endpoint as the single Stellar-docs card;
  the facet tool is deny-by-omission there.
- `src/agents/docs-mcp/agent.ts` is a thin lane wrapper (`runFirstWaveServiceJob(input, "docs_mcp")`);
  the transport/error handling lessons live in the capability doc (notably: their executor once
  turned `isError:true` payloads into fake primary-tier evidence — the codemode wrapper must check
  `isError` from day one).
- The in-session MCP tools (`mcp__stellar-docs__*`) returned byte-identical result shapes to the raw
  curl probes (same nbHits, same top hits, same facet-tool error), confirming the client adds
  nothing beyond transport.
