---
id: sd-002
service: stellar-docs
status: proposed
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - retrieval cluster analysis C2 (2026-07-03 eval round)
  - Solo project 49, todo 822, comments 2204-2210
  - live probe 2026-07-06 (eval round todo 846): possibly fixed — direct search_docs on the combined C2 cluster now returns 10/10 on-topic official docs hits (sponsored-reserves, claimable-balance, account-merge, fee-pool sections), but the original evidence was a cross-service ranking comparison that could not be replicated via execute, so this is not a confirmed refutation; status held
  - live probe 2026-07-09 (Solo scratchpad 565): combined C2 query still returns on-topic official docs, including sponsored-reserves, claimable-balances, fee-pool/lumens, account data, and token-transfer processor hits, but the direct search does not refute the original cross-service ranking claim; status held at proposed
---

## Finding

Operation-level protocol vocabulary is under-represented in the docs search
surface relative to how users phrase questions. Terms in the cluster: sponsored
reserves, account merge, msg.sender equivalent, SEP-41 transfer vs transferFrom,
claimable-balance predicates, fee pool. The content exists in the docs, but
ranking loses to other sources for these phrasings.

## Evidence

Retrieval cluster analysis C2 from the 2026-07-03 eval round (results files
above). Follow-up probes on 2026-07-06 and 2026-07-09 show collateral
improvement in direct docs search for the combined C2 vocabulary, but they do
not reproduce the original cross-service ranking comparison closely enough to
confirm a fix. Conversely, those successful direct-search probes mean the
history does not support a stronger claim that the vocabulary is absent or
currently unretrievable. The original observation and the later probes measure
different things, so this finding remains `proposed`: neither promoted as a
confirmed recurrence nor closed as fixed.

## Recommendation

First replay the original cross-service candidate-ranking comparison with a
captured, repeatable target. If docs still lose despite returning the relevant
pages directly, improve ranking/synonym coverage — e.g. boost operation
reference pages or add synonym mappings for the user phrasing. Do not file an
upstream ranking report from the current non-like-for-like history alone.
