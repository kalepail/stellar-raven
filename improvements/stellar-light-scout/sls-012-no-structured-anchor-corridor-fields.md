---
id: sls-012
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live production execute 2026-07-03 (scout.searchProjects category Anchor, scout.matchPartners, lumenloop.search_directory/get_project; Solo scratchpad 521 follow-up, todo 826 comment 2224)
  - consumer-side workaround shipped in the golden for q-crp-anchors-by-corridor (dated-citation guard instead of structured grounding; owned case eval/qa/corpus/battery/compliance-rwa-payments/q-crp-anchors-by-corridor.json)
  - live re-verified 2026-07-06 (eval round todo 846): 19 Anchor-category projects still carry coverage only in shortDescription prose — no countries[]/currencies[]/seps[] structured fields (and no regions field) on project rows
  - upstream issue filed 2026-07-07: https://github.com/Stellar-Light/stellar-scout/issues/3
  - fixed upstream in 2026-07-08 drift: Project schema now exposes coverage.{countries,currencies,seps,asOf}; live category=Anchor check returned 14/19 anchors with non-null coverage, including Bitso/Mexico/MXN and Cash Abroad/Mexico, with dated asOf values
---

## Finding

Anchor corridor/coverage data exists only as free-text prose; no structured
fields anywhere in the stack. Scout's 19 Live Anchor-type projects carry their
country/currency coverage inside `shortDescription` sentences ("20 African
countries incl. Nigeria", "BSP-regulated PHP"); Scout partner records expose
only coarse `regions: ["africa"]`; Lumenloop's `operating_region` is region
labels (`["Global"]`, `["Sub-Saharan Africa"]`). "Which anchors serve corridor
X→Y?" — a core integration question — is answerable only by prose-mining, and
the mined figures can't be dated or compared. (The one bright spot:
`scout.matchPartners` live-ranks partners against a plain-language corridor
need with a dated `generatedAt` and per-partner freshness status, and hedges
honestly — e.g. flagging "NGN coverage not explicitly confirmed" for Fonbnk.)

## Evidence

Live 2026-07-03, production `execute`: Anchor-category project sweep (19 Live
records, coverage in prose only), `matchPartners("USDC off-ramp to NGN via
SEP-24")` → Yellow Card 92 / HoneyCoin 88 / Fonbnk 72 with dated meta,
Lumenloop directory + get_project on anchor slugs (region labels only). Docs
side checked too: `search_anchor_sep_docs` returns SEP flow docs, no corridor
listings — as expected, protocol docs are the wrong layer for this.

Live re-check 2026-07-08: `GET /api/projects/search?category=Anchor&limit=50`
returned 19 Anchor-category records, 14 with non-null `coverage`. Examples:
Bitso carries `countries:["Mexico"]`, `currencies:["MXN","BRL","ARS","COP","USD"]`,
`asOf:"2026-07-07"`; Cash Abroad carries `countries:["Mexico"]`,
`asOf:"2026-07-07"`; MYKOBO carries `currencies:["EUR"]` and
`seps:["sep-6","sep-24","sep-31"]`. The original "no structured fields anywhere"
defect is fixed. A successor ranking/retrieval issue is tracked as `sls-018`.

## Recommendation

Add per-anchor structured coverage to the project/partner records:
`countries[]`, `currencies[]`, `seps[]`, plus an `asOf` date. Even a partial
rollout (the ~19 Anchor-typed projects) would convert corridor questions from
prose-mining to filterable, dated evidence. matchPartners' freshness metadata
is the right pattern — extend it to the directory records themselves.
