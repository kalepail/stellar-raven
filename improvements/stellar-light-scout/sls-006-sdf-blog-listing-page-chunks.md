---
id: sls-006
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live re-check 2026-07-14: sampled SDF-blog research hits return substantive Q1 article body rather than listing/tag chunks; resolving PR https://github.com/Stellar-Light/stellarlight/pull/277
  - eval/qa/results/2026-07-03T16-06-45-variantA.json (q-eco-stellar-rwa-stablecoin-volume)
  - live searchResearch probes source:sdf-blog + source:dev-docs (2026-07-03 evening, production)
  - Solo project 49, todo 807, scratchpad 521
  - live re-check 2026-07-06 (eval round todo 846): FIXED — searchResearch source:sdf-blog now returns real article-body chunks (incl. the Q1 2026 report's "86% year-over-year growth in total developers, according to Electric Capital" and a closing-section chunk); all 10 hits substantive content from distinct SDF posts, no listing/tag-page chunks observed
---

## Finding

The scout research corpus's `sdf-blog` source indexes blog **listing,
filter, and tag pages** rather than article bodies. Queries for SDF's
"Q1 2026: Execution at network scale" report return "Stellar | News from
the SDF" index-page chunks that merely *list* the article title; the
article body (which carries the quarter's headline figures — $5.5B
payment volume, 86% YoY developer growth) appears absent from the corpus
entirely. The same probes also returned the same meeting content indexed
3× via duplicated `/meetings/tags/developer` tag-page chunks — listing
pages both crowd out and duplicate real content.

## Evidence

Live probes 2026-07-03 (production, free ops): `searchResearch` with
source:sdf-blog ×2 → index/tag pages only, no article-body chunk for the
Q1 report; source:dev-docs → the Apr 23 2026 dev-meeting chunk (different
figures) is the closest substantive hit; triplicate tag-page chunks
observed. Round record: Solo scratchpad 521 (batch-1 review report).

Fixed upstream: the 2026-07-06 live re-check found the Q1 2026 article body
chunked and searchable with substantive content, and no listing/tag-page or
duplicate tag chunks in the results.

## Recommendation

In the sdf-blog crawler, follow listing pages to article URLs and index
the article bodies; exclude listing/filter/tag URL patterns
(`/news$`, `/tags/`, paginated indexes) from chunk output, or
canonical-dedupe chunks whose content hash repeats across tag pages.
Flagship SDF reporting is exactly what agents cite for
ecosystem-size questions; today the corpus can name the report but not
quote it.
