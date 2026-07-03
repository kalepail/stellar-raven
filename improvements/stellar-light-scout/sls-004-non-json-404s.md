---
id: sls-004
service: stellar-light-scout
status: proposed
discovered: 2026-07-03
evidence:
  - src/adapters/scout.ts (host-side normalization, hardening commit 62fa42d)
  - Solo project 49, todo 822, comments 2204-2210
---

## Finding

404 responses are sometimes non-JSON (content-type inconsistency with the rest of
the API). This repo normalizes them host-side to soft-empty
(`src/adapters/scout.ts`, hardening commit 62fa42d), so it is contained here, but
any other consumer hits the same inconsistency.

## Evidence

Encountered during adapter hardening (commit 62fa42d); recorded in the
2026-07-03 eval round's finding set (Solo refs above).

## Recommendation

Return JSON error bodies with a consistent content-type for 404s (and other
error statuses), matching the API's success responses.
