---
id: sls-056
service: stellar-light-scout
status: reported-upstream
discovered: 2026-07-15
upstreamTitle: Apply project result counts after canonical deduplication
evidence:
  - 2026-07-15 live GET /api/projects/search?q=OrbitCDP&limit=100 returned one canonical orbitcdp project while meta.counts.returned and total both reported 2
  - 2026-07-15 live GET /api/projects/search?q=Orbit&limit=100 returned two project rows while meta.counts.returned and total both reported 3
  - predecessor sls-008 confirms the Orbit/OrbitCDP identity conflict is fixed; this successor isolates the post-deduplication count contract
  - successor residual posted and read back 2026-07-15: https://github.com/Stellar-Light/stellarlight/pull/289#issuecomment-4982310089
---

## Finding

Scout project search applies canonical deduplication to the returned `projects`
array after computing `meta.counts`. The payload can therefore report more
returned rows than it actually contains.

On 2026-07-15, an exact `OrbitCDP` query returned one canonical `orbitcdp`
project while both `meta.counts.returned` and `meta.counts.total` were `2`.
The broader `Orbit` query returned two projects while both counts were `3`.
Consumers cannot use these fields for pagination, completeness checks, or
answer-visible result counts without recounting the array.

## Evidence

The live checks used Scout OpenAPI version 1.7.26 and the production
`/api/projects/search` endpoint. Both mismatches were reproduced with
`limit=100`, so pagination truncation did not explain the difference.
The canonical identity fix is working: `OrbitCDP` no longer exposes the stale
`orbit-finance` row. This finding covers only the count metadata left after
that deduplication.

## Recommendation

Compute `returned` after canonical deduplication. Define whether `total` counts
canonical projects before pagination or raw candidate rows; if both are useful,
expose them under distinct names. Add response invariants:

- `returned === projects.length`;
- `total >= returned`; and
- pagination offsets operate on the same canonical population counted by
  `total`.
