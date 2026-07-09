---
id: sls-004
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - src/adapters/scout.ts (host-side normalization, hardening commit 62fa42d)
  - Solo project 49, todo 822, comments 2204-2210
  - exhaustive live re-check 2026-07-09: all current GET path-parameter routes (hackathons/{slug}, partners/{slug}, skills/{name}) returned status 404, content-type application/json, and parseable JSON for guaranteed-missing values
---

## Finding

404 responses were sometimes non-JSON (content-type inconsistency with the rest of
the API). This repo still normalizes them host-side to soft-empty
(`src/adapters/scout.ts`, hardening commit 62fa42d), so it is contained here, but
the upstream inconsistency no longer reproduces on any current GET path route.

## Evidence

Encountered during adapter hardening (commit 62fa42d). On 2026-07-09 an
OpenAPI-derived sweep substituted guaranteed-missing values into every current
GET route with a required path parameter: hackathons/{slug}, partners/{slug},
and skills/{name}. All three returned 404 with `application/json` and parsed as
JSON.

## Recommendation

Resolved upstream. Retain the adapter normalization as defense in depth and
reopen only if a current route again returns a non-JSON error body.
