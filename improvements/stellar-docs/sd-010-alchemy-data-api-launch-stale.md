---
id: sd-010
service: stellar-docs
status: reported-upstream
discovered: 2026-07-09
evidence:
  - developers.stellar.org Indexers overview fetched 2026-07-09 still says Alchemy is "in talks" to add Stellar with a targeted launch in the first half of 2026
  - official Alchemy Stellar Data API overview fetched 2026-07-09 documents live indexed native, classic, and Soroban asset data, including transfer history, balances, and NFT holdings without operating an indexer
  - official Alchemy Stellar API quickstart fetched 2026-07-09 documents the live Stellar JSON-RPC endpoint separately from the indexed Data API
  - todo-910 partner-doc diagnostic at 2026-07-10T03:15:21.411Z matched 6/32 Alchemy fact groups through one current Raven source call versus 31/32 in four allowlisted first-party Markdown pages; eval/partner-docs/README.md
  - upstream fix pending in open PR https://github.com/stellar/stellar-docs/pull/2573 (head 088f13cda1d56792c9cef96d3cdba4980dfc6c99 as of 2026-07-13; checks/preview green, review required, merge blocked)
  - maintainer review on PR #2573 requests terminology alignment before merge: use the Docs' established `stellar assets` / `contract tokens` distinction instead of overlapping native/Classic/Soroban categories, and `Stellar RPC` instead of `Stellar JSON-RPC`
recurrences:
  - date: 2026-07-13
    evidence: structured HTTP probe returned 200 and still found both "now in talks to expand their service to Stellar" and the targeted first-half-2026 launch wording
probe:
  type: http-text
  url: https://developers.stellar.org/docs/data/indexers
  expect:
    status: 200
    contains:
      - now in talks to expand their service to Stellar
      - targeted launch in the first half of 2026
recurrences:
  - date: 2026-07-14
    evidence: live indexers page remains stale; green PR follow-up https://github.com/stellar/stellar-docs/pull/2573#issuecomment-4971410572
---

## Finding

The Indexers overview still describes Alchemy's live Stellar Data API as a future launch.

It describes Alchemy's Stellar support as a future possibility — "in talks"
with a targeted first-half-2026 launch — after Alchemy
made both its Stellar RPC service and its indexed Stellar Data API available.
That stale entry can incorrectly steer developers away from a live hosted
indexing option.

This finding distinguishes the two current products. Alchemy's Stellar API is
the Stellar RPC endpoint; its Stellar Data API is the relevant indexer offering
for XLM, issued Stellar assets, and contract-token transfer history, account
balances, and NFT holdings. The latter is the evidence that directly
contradicts the Indexers page's future-tense claim.

## Evidence

The live `https://developers.stellar.org/docs/data/indexers` page fetched on
2026-07-09 still rendered the Alchemy entry as "now in talks to expand their
service to Stellar, with a targeted launch in the first half of 2026."

Alchemy's official `https://www.alchemy.com/docs/reference/stellar-data-api-overview`
instead documents an available indexed-data surface across native, classic,
and Soroban assets, including transfer history, balances, and NFT holdings
without running an indexer. Its separate official
`https://www.alchemy.com/docs/reference/stellar-api-quickstart` documents the
live Stellar JSON-RPC endpoint. These independent product pages prevent the
RPC launch alone from being mistaken for proof of indexed-data availability.

Upstream PR `stellar/stellar-docs#2573` updates the Indexers entry from those
provider-owned sources. As of 2026-07-13 it is open at head
`088f13cda1d56792c9cef96d3cdba4980dfc6c99`, with checks and preview green but
review required. The requested changes are terminology-only but actionable:
align asset categories with the Docs' `stellar assets` / `contract tokens`
language and call the endpoint `Stellar RPC`. The finding is not fixed yet:
reconciliation requires those nits to land, the PR to merge, the docs site and
search crawler to update, and live Raven search to return the corrected product
description.

## Recommendation

Address the two terminology comments, merge the provenance-bearing PR, then
verify all three downstream layers:
rendered Indexers page, crawled Algolia record, and Raven live search. Only
after those checks should this finding move to `fixed-upstream`; an open PR or
green preview alone is not live proof.
