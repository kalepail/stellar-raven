---
id: sls-054
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-13
evidence:
  - 2026-07-13 live GET https://stellarlight.xyz/api/changelog: the latest sls-050 summary describes nullable identity {currentName, aliases, renamedAt, sourceUrl}, while its detail says projects gain top-level aliases[]/renamedAt/renameSourceUrl
  - 2026-07-13 live GET https://stellarlight.xyz/api/openapi.json (1.7.18): Project defines nullable identity with currentName, aliases, renamedAt, and sourceUrl; no top-level aliases, renamedAt, or renameSourceUrl fields exist; inventory/stellar-light.json
  - upstream issue filed 2026-07-13: https://github.com/Stellar-Light/stellarlight/issues/525
  - 2026-07-13 upstream fix: issue https://github.com/Stellar-Light/stellarlight/issues/525 closed completed by merged PR https://github.com/Stellar-Light/stellarlight/pull/526; contract and unit checks passed
  - 2026-07-13 live fixed re-check: GET https://stellarlight.xyz/api/changelog now describes only nested identity {currentName, aliases, renamedAt, sourceUrl}, with no top-level rename fields or renameSourceUrl; GET https://stellarlight.xyz/api/openapi.json version 1.7.18 matches that shape
---

## Finding

The live sls-050 changelog entry contradicts itself about the project rename-continuity response shape.
Its summary matches the OpenAPI contract: a nullable
`identity` object containing `currentName`, `aliases`, `renamedAt`, and
`sourceUrl`. Its detail instead says projects gain optional top-level
`aliases[]`, `renamedAt`, and `renameSourceUrl` fields. A consumer relying on
the detail text can implement the wrong projection or look for a field name
that the API never serves.

## Evidence

Live re-check on 2026-07-13 read the latest entry from `GET /api/changelog` and
the Project schema from `GET /api/openapi.json` version 1.7.18. The summary and
schema agree on `identity { currentName, aliases, renamedAt, sourceUrl }`; the
detail text alone claims top-level fields and uses `renameSourceUrl` instead of
the contracted `sourceUrl`. The regenerated Raven inventory and super-spec
follow the schema rather than the contradictory detail sentence.

Later on 2026-07-13, upstream issue #525 closed through merged PR #526. An
independent live re-check confirmed the changelog detail now uses the same
nested `identity` shape and field names as OpenAPI 1.7.18, so the original
contradiction no longer reproduces.

## Recommendation

Rewrite the sls-050 changelog detail to name the actual nested response shape:
projects gain optional nullable `identity { currentName, aliases[], renamedAt,
sourceUrl }`. Keep the field names byte-aligned with the OpenAPI schema and add
a changelog-contract assertion so future entries cannot describe response
fields that are absent from the published schema.
