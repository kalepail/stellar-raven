---
id: sd-010
service: stellar-docs
status: reported-upstream
discovered: 2026-07-09
evidence:
  - developers.stellar.org Indexers overview fetched 2026-07-09 still says Alchemy is "in talks" to add Stellar with a targeted launch in the first half of 2026
  - official Alchemy Stellar Data API overview fetched 2026-07-09 documents live indexed native, classic, and Soroban asset data, including transfer history, balances, and NFT holdings without operating an indexer
  - official Alchemy Stellar API quickstart fetched 2026-07-09 documents the live Stellar JSON-RPC endpoint separately from the indexed Data API
  - upstream fix pending in open PR https://github.com/stellar/stellar-docs/pull/2573 (head 00e3c391fcb5011dfe13e66b726004e5a00f5228; checks green as of 2026-07-09)
probe:
  type: http-text
  url: https://developers.stellar.org/docs/data/indexers
  expect:
    status: 200
    contains:
      - now in talks to expand their service to Stellar
      - targeted launch in the first half of 2026
---

## Finding

The Indexers overview still describes Alchemy's live Stellar Data API as a future launch.

It describes Alchemy's Stellar support as a future possibility — "in talks"
with a targeted first-half-2026 launch — after Alchemy
made both its Stellar RPC service and its indexed Stellar Data API available.
That stale entry can incorrectly steer developers away from a live hosted
indexing option.

This finding distinguishes the two current products. Alchemy's Stellar API is
a JSON-RPC endpoint; its Stellar Data API is the relevant indexer offering for
native, classic, and Soroban asset transfer history, account balances, and NFT
holdings. The latter is the evidence that directly contradicts the Indexers
page's future-tense claim.

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
provider-owned sources. As of 2026-07-09 it is open at head
`00e3c391fcb5011dfe13e66b726004e5a00f5228`, with its build, formatting,
security, and preview checks green. The finding is not fixed yet: reconciliation
requires the PR to merge, the docs site and search crawler to update, and live
Raven search to return the corrected product description.

## Recommendation

Merge the provenance-bearing PR, then verify all three downstream layers:
rendered Indexers page, crawled Algolia record, and Raven live search. Only
after those checks should this finding move to `fixed-upstream`; an open PR or
green preview alone is not live proof.
