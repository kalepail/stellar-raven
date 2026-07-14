---
id: sls-042
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-10
evidence:
  - live re-check 2026-07-14: analyze and category clusters both report 845 included/available records with truncated=false; resolving PR https://github.com/Stellar-Light/stellarlight/pull/498
  - near-simultaneous /api/analyze?dimension=categories and /api/clusters?dimension=category&minSize=1 reads produced different totals and funded-ratio winners
  - analyze covered 841 active projects and made Protocol/Contract 68/129 the winner
  - clusters summed exactly 500 projects and made User-Facing App 104/207 the winner
  - source inspection showed clusters fetches active projects with limit 500 and no pagination while analyze uses limit 5000
  - 2026-07-11 live re-check: analyze categories and category clusters both report population id projects|status:Development+Live+Pre-Release with totalAvailable=842, included=842, and truncated=false
  - Solo scratchpad 575 GT-36 primary 3290 and blind 3291
---

## Finding

The category-cluster endpoint silently truncates its active-project input at
500 rows without pagination. The categories analyze endpoint covered 841 active
projects in a near-simultaneous read. Because the missing tail is not category-
neutral, the two endpoints produced different denominators and different answers
to “which category has the highest SCF-funded share.” No response metadata tells
the caller that the cluster result is a sample.

## Recommendation

Paginate through the complete active-project set or expose an explicit sample/
truncation contract with input count, total available, limit, and generated time.
Add a regression fixture requiring category totals and funded ratios to agree
across analyze and clusters when their status scope is the same, or require the
endpoints to declare intentionally different scopes.
