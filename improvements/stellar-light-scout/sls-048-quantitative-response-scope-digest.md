---
id: sls-048
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-11
evidence:
  - live re-check 2026-07-14: status, analyze, and clusters expose a shared dated population scope and population identifier; resolving PR https://github.com/Stellar-Light/stellarlight/pull/498
  - P4 H1 compared getStatus (952 projects), analyzeEcosystem categories (841 active projects), and category clusters with a separately documented filtered population; solo://proj/49/scratchpad/super-corpus-rebuild--585
  - sls-042 independently proves that one category-clusters path silently truncates at 500, demonstrating why population compatibility must be answer-visible
  - live re-check 2026-07-13: https://stellarlight.xyz/api/changelog plus current status, analyze, and clusters responses expose population scope IDs and matching full-scope metadata
---

## Finding

Scout quantitative operations expose locally plausible totals but lack a common
population identifier and scope digest. The full collection, active-only
analysis, and clusters are easy to compare or sum even when their status,
pagination, and eligibility populations differ.

## Evidence

H1's 2026-07-11 comparison recorded 952 full records versus 841 active records
and another filtered cluster view. sls-042 supplies a related live truncation
case; this finding is the broader response-contract gap, not a duplicate of
that endpoint bug.

## Recommendation

Return `populationId`, status/filter inputs, total available, returned count,
pagination/truncation state, and generated time with every quantitative
operation. Identical scope digests should be mechanically comparable; differing
ones should be visibly incompatible.
