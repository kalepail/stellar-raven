---
id: sk-009
service: skills
status: reported-upstream
discovered: 2026-07-10
evidence:
  - live drift issue kalepail/stellar-raven#19: inventory/stellar-light.json refreshed to OpenAPI/status 1.7.11
  - live 2026-07-10 OpenAPI verification: projects/search adds semantic fallback metadata and Project tvlUSD/tvlAsOf; research adds source=cap
  - ecosystem-skills/skills/stellar-light/stellar-scout/references/api-reference.md at pinned upstream commit aea0c125325ceed746eefaa505e3bd45dabd5ca1
  - Solo scratchpad 575 drift verdict and independent read-only review by process 3209
  - upstream issue filed 2026-07-13: https://github.com/Stellar-Light/stellar-scout/issues/11
  - 2026-07-14 follow-up narrows the residual after source=cap landed: https://github.com/Stellar-Light/stellar-scout/issues/11#issuecomment-4971409842
  - 2026-07-15 pin 7a5a27 and live OpenAPI 1.7.26 verification: research adds source=sdf-org and observedAt; leaderboard adds exact type filtering plus filter and metric metadata, while the mirrored reference omits them
recurrences:
  - date: 2026-07-15
    evidence: the 1.7.26 mirror still omits live research source=sdf-org and observedAt plus leaderboard type, meta.filters.type, meta.metricDefinitions, and meta.dataAsOf
---

## Finding

The pinned Stellar Scout skill API reference has fallen behind the live Scout
OpenAPI contract from 1.7.11 through 1.7.26. This is new drift after `sk-008` was fixed for the
earlier 1.7.0 partner and repository fields, so it is a successor rather than a
reopening of that resolved finding.

The live API now documents three capabilities absent from the mirrored skill:

- `GET /api/projects/search` can return a `semantic` match mode when no keyword
  tier matches; each fallback row is marked `via:"semantic"` and should be
  treated as a medium-confidence similarity guess.
- Project records can carry `tvlUSD` and `tvlAsOf`, where `null` means not
  tracked by DefiLlama rather than zero TVL.
- `GET /api/research` accepts `source=cap` for CAP material.
- `GET /api/research` also accepts `source=sdf-org`, and research rows can carry
  `publishedAt` and `observedAt` provenance dates.
- `GET /api/leaderboard` accepts repeatable or comma-separated exact `type`
  filters and returns the resolved filter plus metric definitions and data date
  in `meta.filters.type`, `meta.metricDefinitions`, and `meta.dataAsOf`.

Agents that read the bundled skill can therefore misread semantic results as
keyword-confirmed, collapse untracked TVL to zero, or omit the new CAP source
filter, miss SDF organizational research, or overlook leaderboard filtering and
provenance even though Raven's regenerated operation schemas expose them.

## Evidence

Live verification on 2026-07-10 and the regenerated inventory show:

- `inventory/stellar-light.json` adds `semantic` to the project-search
  `matchMode` enum and describes it as a vector-similarity fallback used only
  after keyword tiers miss.
- The same schema adds nullable `tvlUSD` and `tvlAsOf` fields to Project.
- The research-source enum adds `cap`.

The pinned upstream reference still says a `majority` miss returns an advisory
to use `/api/research`, lists no `semantic` tier, omits the TVL fields, and its
research source list omits `sdf-org`. Its leaderboard parameters omit `type`,
and its result documentation omits the filter, metric-definition, and data-date
metadata:

- `ecosystem-skills/skills/stellar-light/stellar-scout/references/api-reference.md`
  lines 119-127 (project match modes)
- the same file around lines 9-14 and 169-186 (leaderboard parameters and research sources)

The local mirror must remain read-only; the correction belongs in the upstream
`Stellar-Light/stellar-scout` source and should arrive here through a new pin and
the normal bundle/catalog regeneration chain.

## Recommendation

Update the Scout skill API reference to document the `semantic` result tier and
its confidence caveat, Project `tvlUSD`/`tvlAsOf` null semantics, and the
`source=cap` and `source=sdf-org` research filters with provenance dates. Also
document leaderboard `type` filtering and its returned filter, metric, and data
date metadata. Add a small schema-to-reference drift check so a new enum value
or documented field produces a review signal before the skill lags another live
release.
