---
id: sls-057
service: stellar-light-scout
status: proposed
discovered: 2026-07-27
upstreamTitle: Improve getPeople discovery coverage for current SDF leadership
evidence:
  - Solo todo 1204 comment 3211: “Who is Denelle Dixon?” (the current SDF CEO) did not reach scout.getPeople on either side of the Scout 1.8.28 catalog update
  - Solo todo 1204 comment 3211: the 1.8.28 getPeople routing change produced 3 wins, 1 loss, and 8 unchanged results in a 12-query person-question sweep; the loss was “who is satoshi nakamoto,” which changed from all-backfill with three wider candidates to gated getPeople with none
  - src/catalog/search.ts derives widerCandidates only for all-backfill result pages; a gated getPeople hit therefore has no wider-candidate recovery block
---

## Finding

Scout's people-discovery surface does not currently provide a route to
`getPeople` for “Who is Denelle Dixon?”, despite her being the current SDF CEO.
That pre-existing miss is the upstream coverage gap behind the catalog's
otherwise-positive Scout 1.8.28 person-query routing change.

The catalog update moves the narrower `getPeople` operation to top-1 for more
person questions. In the measured 12-query sweep it improved three queries,
regressed one out-of-roster query, and left eight unchanged. The narrower hit
also suppresses the catalog's all-backfill `widerCandidates` recovery block;
the updated `SCOUT_MISS_HINT` partly compensates by naming `getPeople`.

## Evidence

The recorded comparison is catalog-routing evidence, not a direct live
reproduction of the Scout people endpoint. It is sufficient to preserve the
observed trade-off and identify the Denelle Dixon coverage gap, but not to file
an upstream issue yet.

## Recommendation

Verify the live Scout people search/index for Denelle Dixon and other current
SDF leadership. If they are absent or not retrievable by name, add or refresh
the canonical people records and keep a named-person recall check covering both
in-roster and out-of-roster queries. Reclassify after that live recheck; do not
file from the catalog-only evidence.
