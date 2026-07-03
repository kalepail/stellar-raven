# Research output formats — completed payload reference

What `research_result` returns for each `output_format` of a completed
`request_research` run, plus the anatomy of `sources` and `basis` and how to
write a good `output_schema`.

Every response arrives in the standard REST envelope
(`{ "success": true, "data": …, "error": null, "meta": … }`); the JSON in this
document is the `data` field. Examples are realistic but abridged — `…` marks
trimmed content.

## Fields common to every completed run

| Field | Always present | Meaning |
| --- | --- | --- |
| `status` | yes | `"completed"` (this document; while running you get `"running"` + `progress`, on failure `"failed"` + `reason`) |
| `output_format` | yes | `"report"`, `"answer"`, `"sources"`, or `"structured"` |
| `sources` | report/sources/structured | Resolved corpus sources backing the output (anatomy below) — `answer` runs return `citations` only |
| `citations` | yes | Flat list of `{ title, url }`, server-resolved from the corpus — never model-invented URLs |

## Source item anatomy

Every entry carries `type`, `title`, and `url` (the original source link —
**this is what you cite**). On source-pack runs, sources also carry `note` —
the curator's per-source relevance note explaining why the source made the
pack. The rest varies by `type`:

| `type` | Identifier | Other fields |
| --- | --- | --- |
| `article`, `av` | numeric `id` | `author`, `date`, `tags`, `summary`, `long_summary` |
| `research` | numeric `id` | Same as `article`/`av`, but `url` can be **`null`** — LumenLoop's own published research has no external link |
| `event` | numeric `id` | `author`, `date`, `summary` — no tags |
| `scf_submission` | `slug` (a `"rec…"` string) | `author` — link-only, no date or summaries |
| `tweet` | string `id` (a snowflake) | `author`, `date`; `title` is `"Tweet by @handle"` — link-only, no summary or tags |

`summary`/`long_summary` are LumenLoop's AI-generated digests; the quotable
original lives at `url`. Pull exact wording from there — do not quote a digest
as if it were the article.

## `output_format: "report"`

A synthesized, cited editorial report in markdown. The `format` argument
(`tweet` | `thread` | `long-form`, default `long-form`) chose its shape and
latency: tweet ≈30–60s, thread ≈1–2 min, long-form ≈3–10 min.

```json
{
  "status": "completed",
  "output_format": "report",
  "report": "# Institutional adoption of Stellar in 2026\n\nThrough the first half of 2026, institutional activity on Stellar clustered around three threads: settlement integrations by custodians [1], tokenized money-market funds [2], and anchor-led corridor expansion [3].\n\n## Settlement\n\nIn March 2026, … [1] …\n\n## Tokenized funds\n\n… [2] …\n\n## What to watch\n\n…\n\n## Sources\n\n1. Major custodian adds Stellar settlement rails — https://example-news.com/custodian-stellar-settlement\n2. …",
  "sources": [
    {
      "type": "article",
      "id": 5121,
      "title": "Major custodian adds Stellar settlement rails",
      "url": "https://example-news.com/custodian-stellar-settlement",
      "author": "Jane Doe",
      "date": "2026-03-14",
      "tags": ["institutional", "payments"],
      "summary": "A large custodian integrated Stellar for same-day settlement…",
      "long_summary": "The integration covers…"
    },
    {
      "type": "av",
      "id": 887,
      "title": "Meridian 2026 panel: institutions on-chain",
      "url": "https://example-video.com/watch?v=abc123",
      "author": "Stellar Development Foundation",
      "date": "2026-04-02",
      "tags": ["events", "institutional"],
      "summary": "Panelists discussed…",
      "long_summary": "…"
    }
  ],
  "citations": [
    { "title": "Major custodian adds Stellar settlement rails", "url": "https://example-news.com/custodian-stellar-settlement" },
    { "title": "Meridian 2026 panel: institutions on-chain", "url": "https://example-video.com/watch?v=abc123" }
  ]
}
```

Consume it by presenting `report` with its citations intact; `sources` gives
you the richer per-item metadata if you want to render a bibliography.

## `output_format: "answer"`

A fast, cited answer to a single question — flat **$0.02**, completes in
**seconds** (the commission response carries `poll_after_s: 2`, so the first
poll usually returns the finished run). The leanest payload of the four: no
`sources` array, just the answer, its citations, and an overall confidence
tier.

```json
{
  "status": "completed",
  "output_format": "answer",
  "answer": "Yes — through H1 2026 at least two custodians added Stellar settlement support, led by the March integration covered in [1]. Tokenized money-market funds followed in Q2 [2].",
  "citations": [
    { "title": "Major custodian adds Stellar settlement rails", "url": "https://example-news.com/custodian-stellar-settlement" },
    { "title": "Tokenized treasury fund launches on Stellar", "url": "https://example-news.com/tokenized-treasury-stellar" }
  ],
  "confidence": "high"
}
```

`confidence` is the same string tier as structured-mode `basis.confidence`:
rely on `"high"`; on `"low"` read the cited sources before relaying the
answer. Use `answer` for one factual question; when the ask needs narrative,
comparison, or multiple threads, commission a `report` (or `sources`/
`structured`) instead — the answer rung does not replace them.

## `output_format: "sources"`

No synthesis — a curated source pack for **you** to write from. The pack adds
`pack { title, overview }` framing the topic, and each source carries the
curator's `note` saying why it is in the pack and what it contributes.

```json
{
  "status": "completed",
  "output_format": "sources",
  "pack": {
    "title": "Real-world asset tokenization on Stellar, 2025-2026",
    "overview": "Coverage splits into fund tokenization, treasury products, and infrastructure enabling RWAs. The strongest reporting is on…"
  },
  "sources": [
    {
      "type": "article",
      "id": 4980,
      "title": "Tokenized treasury fund launches on Stellar",
      "url": "https://example-news.com/tokenized-treasury-stellar",
      "author": "…",
      "date": "2026-01-22",
      "tags": ["rwa", "funds"],
      "summary": "…",
      "long_summary": "…",
      "note": "Primary launch coverage with the fund's structure and custodian — anchor source for the treasury-products thread."
    },
    {
      "type": "scf_submission",
      "slug": "rec0RWAInfraExample",
      "title": "SCF submission: RWA compliance tooling",
      "url": "https://example-scf.com/submissions/rwa-compliance-tooling",
      "author": "…",
      "note": "Shows what builders are proposing at the infrastructure layer; useful contrast to the shipped products above."
    }
  ],
  "citations": [
    { "title": "Tokenized treasury fund launches on Stellar", "url": "https://example-news.com/tokenized-treasury-stellar" },
    { "title": "SCF submission: RWA compliance tooling", "url": "https://example-scf.com/submissions/rwa-compliance-tooling" }
  ]
}
```

Workflow: read `pack.overview` for the lay of the land, use each `note` to
decide reading order, synthesize from the summaries, and cite each source's
`url` in your own write-up.

## `output_format: "structured"`

Data conforming to **your** `output_schema`, plus the evidence trail. Adds
`title` (a dataset title), `data`, `schema` (an echo of the schema the data
conforms to), and `basis`.

```json
{
  "status": "completed",
  "output_format": "structured",
  "title": "Stellar DEX landscape, mid-2026",
  "data": {
    "market_overview": "The Stellar DEX landscape in mid-2026 is led by a handful of AMM-centric projects, with order-book activity consolidating around…",
    "active_projects": [
      { "name": "Aquarius", "focus": "Liquidity incentives and AMM governance for Stellar markets" },
      { "name": "…", "focus": "…" }
    ],
    "notable_developments": [
      "2026-02: … shipped concentrated liquidity pools",
      "2026-04: … integrated with …"
    ],
    "coverage_gaps": [
      "Little corpus coverage of off-chain order-flow volumes"
    ]
  },
  "schema": {
    "type": "object",
    "properties": {
      "market_overview": { "type": "string", "description": "2-3 sentence state of the Stellar DEX landscape" },
      "active_projects": { "type": "array", "description": "…", "items": { "…": "…" } },
      "notable_developments": { "type": "array", "items": { "type": "string" }, "description": "…" },
      "coverage_gaps": { "type": "array", "items": { "type": "string" }, "description": "…" }
    },
    "required": ["market_overview", "active_projects", "notable_developments"]
  },
  "basis": [
    {
      "field": "market_overview",
      "citations": [
        { "title": "State of Stellar DeFi, Q2 2026", "url": "https://example-research.com/stellar-defi-q2-2026" }
      ],
      "reasoning": "Synthesized from the Q2 ecosystem report and recent AMM coverage; consistent across sources.",
      "confidence": "high"
    },
    {
      "field": "active_projects.0",
      "citations": [
        { "title": "…", "url": "…" },
        { "title": "…", "url": "…" }
      ],
      "reasoning": "Directory entry cross-checked against 2026 content for activity signals; coverage is recent and consistent.",
      "confidence": "high"
    },
    {
      "field": "notable_developments.1",
      "citations": [ { "title": "…", "url": "…" } ],
      "reasoning": "Dated item taken directly from launch coverage; the April item rests on a single source.",
      "confidence": "low"
    }
  ],
  "sources": [ { "type": "article", "id": 5044, "title": "…", "url": "…", "author": "…", "date": "…", "tags": ["…"], "summary": "…", "long_summary": "…" } ],
  "citations": [ { "title": "…", "url": "…" } ]
}
```

### `basis` anatomy

One entry per filled field (array elements get their own entries) — the reason
to trust (or not trust) each value:

| Field | Meaning |
| --- | --- |
| `field` | Dot path into `data`, array indices included (e.g. `active_projects.0`) |
| `citations` | `{ title, url }` list backing that field specifically |
| `reasoning` | How the researcher derived the value — methodology, cross-checks, caveats |
| `confidence` | A string tier such as `"high"`. Rely on `"high"`; treat **`"low"` as weak**: follow the field's citations and read the sources before relying on the value |

Use `basis` programmatically: gate automated downstream use of a field on its
`confidence`, and surface `reasoning` wherever a human reviews the data.

## Writing a good `output_schema`

The schema is both a contract and a brief — the researcher reads it to decide
what to fill. Rules of thumb:

- **A top-level `object`, flat-ish.** One level of arrays-of-small-objects is
  fine; deep nesting dilutes research effort across too many slots and lowers
  per-field quality.
- **Mark top-level fields `required`.** Optional fields may legitimately come
  back absent; required fields force the researcher to address them.
- **Put a `description` on every property.** This is the single highest-leverage
  habit: "2-3 sentence state of the Stellar DEX landscape" or "Dated
  developments from the last 12 months" tells the researcher exactly what
  evidence to gather. A bare `{ "type": "string" }` invites filler.
- **Do NOT add URL or citation fields.** Citations are attached server-side per
  field via `basis` — schema slots for URLs just tempt redundant, lower-quality
  duplication of what `basis` already provides.
- **Constrain where it helps.** `enum`s for known buckets, `items` schemas for
  arrays, and explicit string fields for dates ("ISO date" in the description)
  all sharpen the output.
- **Include an escape hatch.** An optional array such as `coverage_gaps`
  ("Questions the corpus could not answer") gives uncertainty somewhere to go
  other than into your data fields.
- **Stay under ~8KB serialized.** The schema is rejected above that; it is also
  required whenever `output_format="structured"`.

## Failed runs

```json
{ "status": "failed", "reason": "The run could not be completed." }
```

`reason` is a generic, skip-safe message — there is nothing machine-actionable
to parse. Decide whether to refine the question and commission a new run.
