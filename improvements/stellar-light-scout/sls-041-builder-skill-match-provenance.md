---
id: sls-041
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-10
evidence:
  - live skill=Rust and skill=Soroban searches produced ten unique candidates
  - seven candidates had direct public Soroban/Rust code footprints; three had weak or absent direct code evidence in the bounded sweep
  - builder rows do not expose matched fields, matched projects, or code evidence
  - 2026-07-11 live re-check: skill=Rust and skill=Soroban rows now expose match.matchedFields, match.matchedProjects, match.matchedTerms, codeEvidence, and meta.matchBasis
  - Solo scratchpad 575 GT-35 primary 3287 and blind 3289
---

## Finding

Builder skill search returns useful candidates but does not explain why a row
matched. A bio, role title, project text, or adjacent ecosystem mention can be
presented as verified experience or seniority even when no direct code evidence
is available. Consumers cannot distinguish a strong repository-backed match
from a weak text match without repeating an external investigation.

## Recommendation

Return `matchedFields`, `matchedProjects`, and source/provenance for each skill
match. Where repository evidence is indexed, expose the repository, language,
relevant path, and last-observed activity separately from subjective experience.
Keep candidate discovery distinct from experience, seniority, deployment, and
availability claims.
