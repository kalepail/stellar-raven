# LumenLoop REST API — guest tool cheatsheet

All 18 guest-tier read tools, invoked as
`POST https://api.lumenloop.com/v1/tools/{name}` with a JSON body and
`Authorization: Bearer $LUMENLOOP_KEY`. Args marked **(req)** are required;
everything else is optional. Defaults and enums below are taken verbatim from
the live JSON Schemas — verify any time with `curl -s https://api.lumenloop.com/v1/tools/{name}`
(no auth needed). Tools with no args accept an empty body (`-d '{}'`).

**`meta.format` is per-tool** — know it before you parse:

- `"json"`: every tool — `data` is the parsed result, one JSON object. The five
  tools that formerly answered with multi-block content now return single
  objects: `search_directory` → `{count, projects}`, `get_categories` →
  `{count, categories}`, `get_regions` → `{count, regions}`,
  `get_scf_submissions` → `{count, submissions}`,
  `get_project_tags_vocabulary` → `{count, tags}`.
- `"text"`: `get_document` when the id is NOT found — `data.text` is prose like
  `No document found with ID 4321 in articles`, inside a `success: true`
  envelope with no `failed:` prefix.

## Directory & taxonomy

| Tool | Args | Returns |
| --- | --- | --- |
| `search_directory` | `query` (req) — keyword/ILIKE over title, description, other_names; `limit` 1–100, default 20 | `{count, projects: […]}` — each project: slug, title, description, category, tags. A multi-word query with no substring hit auto-falls back to semantic project search (`match_mode: "semantic"` + per-row `similarity`) instead of returning 0 |
| `get_project` | `slug` (req); `compact` bool, default false — slim writer shape, cuts ~95% of payload | One project: slug, title, description, category, tags, links, based_in, operating_region, SCF awards |
| `get_related_projects` | `content_id` (req, number); `content_type` (req) `article\|av\|event\|research` (plural/alias accepted) | Projects MENTIONED BY that content item: slug, title, description, category |
| `get_categories` | none | `{count, categories: […]}` — category objects `{id, name, slug}`, NOT bare name strings (controlled vocabulary) |
| `get_regions` | none | `{count, regions: […]}` — distinct region strings (based_in + operating_region) |
| `get_tags_vocabulary` | none | CONTENT tags (id, name) — articles/AV, not projects |
| `get_project_tags_vocabulary` | none | `{count, tags: […]}` — PROJECT tag strings (controlled vocabulary) |

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/search_directory \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"query":"decentralized exchange","limit":5}'

# Vocabulary tools take no args — empty body
curl -s -X POST https://api.lumenloop.com/v1/tools/get_categories \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{}'
```

## Stellar Community Fund (SCF)

| Tool | Args | Returns |
| --- | --- | --- |
| `get_scf_submissions` | `slug` or `name` — pass at least one; `name` is fuzzy ILIKE on project name | `{count, submissions: […]}` — submissions linked to one project: slug, linked_project_slug, title, project, round (`"SCF #35"`), round_number, award_type, category, budget, description, submission_url, website, github_url, architecture_url |
| `find_similar_scf_submissions` | `query` XOR `slug` (existing submission slug, e.g. `recsAQHCghw9HIUvF`); `limit` 1–100, default 15; `round` (e.g. `"SCF #29"`); `category` | Submissions ranked by embedding similarity, with round/category/funding metadata + `linked_project_slug` |

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/find_similar_scf_submissions \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"query":"ZK proofs for compliance","limit":5}'
```

## Semantic content (AI summaries + source url)

| Tool | Args | Returns |
| --- | --- | --- |
| `search_content_semantic` | `query` (req); `limit` 1–100, default 5 (per type); `response_format` `concise\|detailed`, default `concise` — omits each hit's `long_summary`, `detailed` includes it; `date_start`/`date_end` ISO; `date_field` `publishing_date\|created_at` (articles only); `sources` array (articles: domain, AV: channel, events: platform, tweets: user_screen_name); `types` array ⊆ `articles\|av\|events\|research\|tweets\|twitter_accounts\|scf_submissions` (default all 7) | Hits grouped by content type: AI summary, url, date, similarity. Weak hits may carry `_weak_match` + `_hint`; zero-hit searches return a recovery hint |
| `find_content_about_project` | `slug` (req); same `limit`/`date_start`/`date_end`/`date_field`/`sources`/`types` as above | Content that DISCUSSES the project, grouped by type, with summaries + links |
| `find_av_passages` | `query` (req); `limit` 1–100, default 15; `date_start`; `date_end` | AV items with AI summary, `created_at` (recording date — cite/judge recency), `start_offset` (opaque transcript chunk offset, **not** seconds — order-only, do not render as a timestamp), link — cite link + date + passage text |
| `find_content_by_entity` | `entity` (req) — name (case-insensitive) or normalized slug; `entity_type` `project\|person\|organization\|token` (person-type results are not exposed on the external lane); `content_type` `articles\|av\|events\|scf_submissions`; `min_confidence` 0.0–1.0, default 0.5 (server-side filter; the score itself is not returned); `date_start`; `date_end`; `limit` 1–100, default 30 | Content grouped by type (`articles`/`av`/`events`/`scf_submissions`), each item with `entity_name`, `entity_type`, url, and metadata |
| `find_similar_projects_semantic` | `slug` (req); `limit` 1–100, default 10 | Projects ranked by cosine similarity: slug, title, description, score |

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/search_content_semantic \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"query":"real-world asset tokenization on Stellar","limit":5}'
```

## Documents & research library

| Tool | Args | Returns |
| --- | --- | --- |
| `list_documents` | `collection` (req) `articles\|events\|videos\|av\|jobs\|research` (`av` = alias of `videos`); `page` default 1; `limit` default 20 (max 100); `search` — title/URL, case-insensitive; `source`; `status` (jobs only: `active`/`removed`); `wp` `all\|published\|unpublished`; `period` `all\|upcoming\|past` (events only); `sort` (per-collection fields, table below); `order` `ASC\|DESC`, default `DESC` | `{items: […], pagination: {total, page, limit, hasMore}}` — items are document summaries (title, url, slug, summary, long_summary, tags, dates) |
| `search_documents` | `collection` (req) `articles\|events\|videos\|av\|jobs\|research`; `query` (req) — matches title and URL; `limit` default 20 | Matching document summaries (same projection as list_documents) |
| `get_document` | `collection` (req) `articles\|events\|videos\|av\|jobs\|research`; `id` (req, number) | One JSON object: title, url, domain, author, summary, long_summary, tags, content_type, publishing_date, slug, status (`id` comes back as a string) — for exact wording, fetch and cite the url. Missing id → format `"text"` not-found prose, still `success: true` |
| `list_research` | `status` `draft\|ai ready\|processed\|published\|failed`; `format` `tweet\|thread\|long-form\|sources\|structured`; `source` — prefix match (e.g. `"agent:"`); `editorial_style_slug`; `since` ISO; `limit` default 20 | LumenLoop research previews: id, title, format, status, summary, created_at — full body via `get_document(collection:"research", id)` |

`list_documents` sort fields by collection:

| Collection | `sort` values |
| --- | --- |
| `articles` | `processed_at`, `publishing_date`, `created_at`, `domain`, `source` |
| `events` | `start_at`, `processed_at`, `created_at` |
| `videos` | `processed_at`, `publishing_date`, `created_at`, `source` |
| `jobs` | `updated_at`, `last_seen_at`, `published_at`, `created_at` |

```bash
curl -s -X POST https://api.lumenloop.com/v1/tools/list_documents \
  -H "Authorization: Bearer $LUMENLOOP_KEY" -H "Content-Type: application/json" \
  -d '{"collection":"articles","limit":10,"sort":"publishing_date","order":"DESC"}'
```

## Notes

- **`videos` and `av` are aliases** for the same AV table. `search_documents`,
  `get_document`, and `list_documents` all accept either.
- **`find_similar_scf_submissions`: `query` XOR `slug`** — pass exactly one.
- **`get_related_projects` is content→projects**; project→project is
  `find_similar_projects_semantic`.
- The four vocabulary tools (`get_categories`, `get_regions`,
  `get_tags_vocabulary`, `get_project_tags_vocabulary`) take no args — call
  them before filtering so category/tag strings match the data.
- Commissioning NEW research (`request_research`, partner tier, metered) is
  covered in `../../lumenloop-api-research/SKILL.md` — `list_research` here
  only browses LumenLoop's published library.
- Bad args return HTTP 400 `invalid_arguments` with per-issue `details`;
  rate limits are guest 30 req/min / 2,000 req/day (partner 240 / 30,000) —
  watch `X-RateLimit-Remaining`.
