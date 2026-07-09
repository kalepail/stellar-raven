---
id: sd-009
service: stellar-docs
status: verified
discovered: 2026-07-09
evidence:
  - eval/qa/results/2026-07-09T19-53-07-variantA.json (q-sep-6-24-deprecation, wrong; verdict manually reviewed and upheld)
  - stellar/stellar-protocol ecosystem/sep-0006.md live source rechecked 2026-07-09: status is "Active (Interactive components are deprecated in favor of SEP-24)"
  - developers.stellar.org Anchors fundamentals page rechecked 2026-07-09: contrasts SEP-6 programmatic with SEP-24 hosted flows but never surfaces the deprecation status
---

## Finding

The canonical SEP-6 specification explicitly says its **interactive components are deprecated in
favor of SEP-24**, while the indexed developer-docs guidance only contrasts SEP-6 as programmatic
with SEP-24 as hosted/interactive. It never carries the specification's deprecation sentence.
Consequently, a docs-search consumer can correctly recommend SEP-24 for interactive flows yet
incorrectly deny that SEP-6's interactive components are deprecated.

This is a discoverability/content-parity gap, not a claim that SEP-6 itself is retired. SEP-6
remains Active for programmatic deposit and withdrawal; only its interactive components are the
deprecated part.

## Evidence

The live `stellar/stellar-protocol` source begins SEP-0006 with:
`Status: Active (Interactive components are deprecated in favor of SEP-24)`. Its introduction also
states that SEP-6 is programmatic and SEP-24 exists for anchor-hosted interactive use.

The live Anchors fundamentals page links both specifications and accurately describes the
programmatic-versus-hosted split, but a text check finds no `deprecated` language in that section.
In QA stamp `2026-07-09T19-53-07`, the agent exhaustively searched the exposed docs corpus, found the
split but not the status note, and answered that no explicit deprecation language exists. The judge
correctly scored this wrong. The answer still recommended SEP-24, demonstrating that the missing
fact is specifically deprecation status rather than the basic flow distinction.

## Recommendation

Add one explicit sentence to the SEP-6 versus SEP-24 section: SEP-6 remains Active for programmatic
flows, but its interactive components are deprecated in favor of SEP-24. Also ensure search records
for SEP pages carry their `Status` metadata so queries about deprecation resolve to the canonical
specification rather than relying on an incomplete prose summary.
