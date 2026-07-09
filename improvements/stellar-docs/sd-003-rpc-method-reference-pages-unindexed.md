---
id: sd-003
service: stellar-docs
status: reported-upstream
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T16-06-45-variantA.json (q-ti-rpc-gettransactions-pagination-xdr)
  - live soft-empty on get_doc_page_sections for the getTransactions method page + WebFetch of the live page (2026-07-03 evening)
  - Solo project 49, todo 807, scratchpad 521
  - 2026-07-03 corrected-golden re-judge (todo 827): the saved agent answer flips partial → wrong under the fixed golden — the agent explicitly denied a getTransactions 200 cap ("did not find RPC-doc confirmation"), a real wrong answer this gap causes that the old golden masked by encoding the same false belief
  - live re-verified 2026-07-06 (eval round todo 846): get_doc_page_sections on the getTransactions method page still returns the identical soft-empty ("auto-generated API-reference pages are not indexed")
  - upstream issue filed 2026-07-07: https://github.com/stellar/stellar-docs/issues/2566
  - live re-check 2026-07-09 (Solo scratchpad 565): `getTransactions limit 200 default 50 pagination` now ranks `/docs/data/apis/rpc/admin-guide/configuring` at #1 with the getTransactions transaction cap snippet, but `getTransactions API reference limit` still drifts to Horizon/API Explorer/structure pages and the generated method page remains unindexed; partial mitigation only
---

## Finding

The Algolia docs index excludes the auto-generated RPC-method and
Horizon-endpoint API-reference pages, so authoritative per-method limits
remain unreliable through search. The live
`/docs/data/apis/rpc/api-reference/methods/getTransactions` page states
the limit "can range from 1 to 200 — an upper limit that is hardcoded in
Stellar-RPC for performance reasons... defaults to 50". As of 2026-07-09,
the indexed RPC admin config page can surface the getTransactions cap for a
targeted limit/default query, but API-reference phrasing still drifts and the
generated method page itself remains absent. The *indexed* RPC
Structure→Pagination page documents only getEvents limits (1–10000, default
100). The consequence is worse
than a zero-hit: consumers extrapolate from the getEvents numbers or
from Horizon's (1–200, default 10) and get getTransactions wrong. This
round it produced a two-sided failure — the QA agent claimed "default
100" (getEvents-only) and even the eval golden itself encoded the false
belief that a 200 limit "is Horizon's, not RPC's".

## Evidence

Live 2026-07-03: `get_doc_page_sections({path:
"/docs/data/apis/rpc/api-reference/methods/getTransactions"})` →
soft-empty ("auto-generated API-reference pages are not indexed" — the
op description admits the exclusion); `search_docs` /
`search_rpc_horizon_data_docs` for the limit facts → no relevant hits;
WebFetch of the live method page → the 1–200/default-50 text quoted
above. Round record: Solo scratchpad 521 (batch-3 review report).

Live 2026-07-09: direct Algolia query
`getTransactions limit 200 default 50 pagination` now returns
`/docs/data/apis/rpc/admin-guide/configuring` at rank #1 with a snippet naming
the getTransactions transaction cap. However, `getTransactions API reference
limit` still returns Horizon rate-limit/API Explorer/structure pages ahead of
RPC structure pages, and the generated
`/docs/data/apis/rpc/api-reference/methods/getTransactions` method page is
still not directly indexed. This is a partial mitigation, not a fix.

Impact quantified (2026-07-03 follow-up, todo 827): after correcting the
golden to the live method-page numbers, re-judging the saved agent answer
flips it partial → wrong — the agent's denial of an RPC-side 200 cap is a
genuine consumer-facing wrong answer produced by this indexing gap, not a
grading nuance. Both the QA agent and the original golden author
independently derived the same false belief from the indexed pages.

## Recommendation

Two options, cheapest first: (1) add per-method limits/defaults to the
indexed RPC Structure→Pagination page (a table of method → min/max/
default fixes discoverability without touching the crawler); (2) include
the auto-generated method/endpoint reference pages in the Algolia
crawl — they are the only authoritative source for per-method numbers.
Consumer-side, this gateway cannot work around the gap without shipping
hardcoded limits that would rot.
