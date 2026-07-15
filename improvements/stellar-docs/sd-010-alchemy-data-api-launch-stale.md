---
id: sd-010
service: stellar-docs
status: fixed-upstream
discovered: 2026-07-09
evidence:
  - developers.stellar.org Indexers overview fetched 2026-07-09 still says Alchemy is "in talks" to add Stellar with a targeted launch in the first half of 2026
  - official Alchemy Stellar Data API overview fetched 2026-07-09 documents live indexed native, classic, and Soroban asset data, including transfer history, balances, and NFT holdings without operating an indexer
  - official Alchemy Stellar API quickstart fetched 2026-07-09 documents the live Stellar JSON-RPC endpoint separately from the indexed Data API
  - todo-910 partner-doc diagnostic at 2026-07-10T03:15:21.411Z matched 6/32 Alchemy fact groups through one current Raven source call versus 31/32 in four allowlisted first-party Markdown pages; eval/partner-docs/README.md
  - resolving PR https://github.com/stellar/stellar-docs/pull/2573 merged 2026-07-14T17:45:48Z as 93ffcc76884d81c26f43cb2a2cc64e76627b6b9e after maintainer approval and green checks
  - 2026-07-14 live recheck: https://developers.stellar.org/docs/data/indexers renders Alchemy as live on Stellar with Stellar Data API transfer history, balances, and NFT holdings, and no longer contains the former “in talks” or first-half-2026 launch wording
  - independent Fable recheck 2026-07-14: the Docs Algolia record and Raven stellarDocs search still returned the pre-merge future-launch sentence after the rendered page updated; solo://proj/49/scratchpad/docs-and-site-improv--639#verification-and-closeout
  - live recheck 2026-07-15T15:24Z: cache-busted rendered page and Raven stellarDocs search both returned the corrected live Data API wording; the exact former “in talks” and first-half-2026 phrases returned soft-empty with zero hits
recurrences:
  - date: 2026-07-13
    evidence: structured HTTP probe returned 200 and still found both "now in talks to expand their service to Stellar" and the targeted first-half-2026 launch wording
  - date: 2026-07-14
    evidence: pre-merge live indexers page remained stale; green PR follow-up https://github.com/stellar/stellar-docs/pull/2573#issuecomment-4971410572
  - date: 2026-07-14
    evidence: after PR #2573 merged and the rendered page updated, the crawled Algolia record and Raven stellarDocs search still served the old future-launch sentence; no follow-up comment posted while propagation remains incomplete
---

## Finding

The rendered Indexers page now describes Alchemy's live Stellar Data API accurately,
but the Docs search record still describes it as a future launch.

After the upstream page was corrected, the crawled Algolia record and Raven's
live `stellarDocs` search continued to return the former "in talks" wording with
a targeted first-half-2026 launch. That stale search result can still steer
grounded agents away from a live hosted indexing option.

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

Upstream PR `stellar/stellar-docs#2573` merged on 2026-07-14, and the rendered
page now uses the corrected product description. An independent post-merge
recheck found that the corresponding Algolia record had not yet recrawled and
that Raven search still returned the stale future-launch sentence. The
agent-visible trigger therefore remains live at the search layer even though
the canonical page is fixed.

## Recommendation

Allow or trigger the normal Docs recrawl, then verify that the crawled Algolia
record and Raven live search both serve the merged wording. Move this finding
to `fixed-upstream` and retire it only after the rendered page, search record,
and Raven result agree; do not post a propagation-only reminder on the merged
PR while the crawler is merely catching up.
