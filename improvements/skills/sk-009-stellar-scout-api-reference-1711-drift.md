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
---

## Finding

The pinned Stellar Scout skill API reference has fallen behind the live Scout
OpenAPI 1.7.11 contract. This is new drift after `sk-008` was fixed for the
earlier 1.7.0 partner and repository fields, so it is a successor rather than a
reopening of that resolved finding.

The live API now documents three capabilities absent from the mirrored skill:

- `GET /api/projects/search` can return a `semantic` match mode when no keyword
  tier matches; each fallback row is marked `via:"semantic"` and should be
  treated as a medium-confidence similarity guess.
- Project records can carry `tvlUSD` and `tvlAsOf`, where `null` means not
  tracked by DefiLlama rather than zero TVL.
- `GET /api/research` accepts `source=cap` for CAP material.

Agents that read the bundled skill can therefore misread semantic results as
keyword-confirmed, collapse untracked TVL to zero, or omit the new CAP source
filter even though Raven's regenerated operation schemas expose it.

## Evidence

Live verification on 2026-07-10 and the regenerated inventory show:

- `inventory/stellar-light.json` adds `semantic` to the project-search
  `matchMode` enum and describes it as a vector-similarity fallback used only
  after keyword tiers miss.
- The same schema adds nullable `tvlUSD` and `tvlAsOf` fields to Project.
- The research-source enum adds `cap`.

The pinned upstream reference still says a `majority` miss returns an advisory
to use `/api/research`, lists no `semantic` tier, omits the TVL fields, and its
research source list omits `cap`:

- `ecosystem-skills/skills/stellar-light/stellar-scout/references/api-reference.md`
  lines 119-127 (project match modes)
- the same file around line 184 (research sources)

The local mirror must remain read-only; the correction belongs in the upstream
`Stellar-Light/stellar-scout` source and should arrive here through a new pin and
the normal bundle/catalog regeneration chain.

## Recommendation

Update the Scout skill API reference to document the `semantic` result tier and
its confidence caveat, Project `tvlUSD`/`tvlAsOf` null semantics, and the
`source=cap` research filter. Add a small schema-to-reference drift check so a
new enum value or documented Project field produces a review signal before the
skill lags another live release.
