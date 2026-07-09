---
id: sk-008
service: skills
status: fixed-upstream
discovered: 2026-07-09
evidence:
  - live drift issue 14: inventory/stellar-light.json refreshed to OpenAPI/status 1.7.0
  - ecosystem-skills/skills/stellar-light/stellar-scout/references/api-reference.md (mirror of upstream Stellar-Light/stellar-scout @ c2a6f95)
  - upstream issue filed 2026-07-09: https://github.com/Stellar-Light/stellar-scout/issues/8
  - upstream issue #8 closed completed after fix commit aea0c125325ceed746eefaa505e3bd45dabd5ca1
  - upstream source and local mirror rechecked 2026-07-09: api-reference now documents the ramps filter, typed partner capability/freshness/trust fields, and full codeVerified fields including symbols, sdkCapabilities, and mainnetContractId
  - local mirror synchronized to aea0c125 and regenerated through skills bundle, catalog, super spec, and plan op classes; production live verification remains pending coordinator merge/deploy
---

## Finding

The upstream `Stellar-Light/stellar-scout` skill API reference previously lagged the live
Scout OpenAPI 1.7.0 contract for two exposed read endpoints. The live
`GET /api/partners` operation now accepts a `ramps` query parameter and returns
a typed `PartnersResponse` / `Partner` schema, while the skill's
`references/api-reference.md` still lists the older params and a short,
informal row shape. The live `GET /api/repos/explain` response also gained
richer `codeVerified` fields, but the skill prose still documents only the
older high-level response keys.

Because this repo mirrors and bundles the upstream skill as runtime guidance,
agents reading `codemode.skill.read` can miss the new ramp-specific filter and
under-describe repo verification evidence even though the callable API already
supports it.

## Evidence

Live inventory refreshed for issue 14 shows:

- `inventory/stellar-light.json:1753` documents `GET /api/partners` parameter
  `ramps`, with valid values `on-ramp`, `off-ramp`, or comma-separated both.
- `inventory/stellar-light.json` now defines `Partner` and `PartnersResponse`
  component schemas, including partner fields such as `rampTypes`, `seps`,
  `assets`, `freshness`, `trust`, and `verified`.
- `inventory/stellar-light.json` expands repo/code verification output with
  fields such as `mainnetContractId`, `sdkCapabilities`, and `symbols`.

The former mirrored upstream skill said:

- `ecosystem-skills/skills/stellar-light/stellar-scout/references/api-reference.md:244`
  lists `/api/partners` params as `type`, `sector`, `region`, `accepting=1`,
  `q`, and `limit`/`offset`, with no `ramps`.
- `ecosystem-skills/skills/stellar-light/stellar-scout/references/api-reference.md:238`
  describes `/api/repos/explain` as returning `repo`, `routedVia`, `answer`,
  `alternateRepos`, and `sources`, omitting the new code-verification fields.

The fix landed in upstream commit `aea0c125325ceed746eefaa505e3bd45dabd5ca1`.
The 2026-07-09 mirror sync pins that commit and the generated runtime bundle
contains the corrected endpoint guidance. Production proof is intentionally
deferred until the coordinator merges and deploys this branch.

## Recommendation

Resolved upstream. Keep the mirror pin and runtime bundle synchronized with the
Scout source, and complete the final production read after coordinator merge and
deploy before treating Raven's served copy as live-verified.
