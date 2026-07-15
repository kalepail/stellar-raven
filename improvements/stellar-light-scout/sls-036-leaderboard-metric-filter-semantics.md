---
id: sls-036
service: stellar-light-scout
status: reported-upstream
discovered: 2026-07-10
evidence:
  - live sort=activity range=30d payload did not expose repoScore or commit count
  - activity, stars, issues, and sampled GitHub commits produced different rankings
  - Solo scratchpad 575 GT-19 primary 3254 and blind 3258
  - GT-55 live sort=issues range=all payload returned project-level openIssuesTotal rollups with generatedAt and repoCount that differed from contemporaneous GitHub issue-only checks
  - upstream issue filed 2026-07-13: https://github.com/Stellar-Light/stellarlight/issues/524
  - 2026-07-15 live recheck on spec 1.7.26 returned explicit metricDefinitions and dataAsOf; repeatable type=DEX&type=Lending used exact whole-element EITHER membership, echoed meta.filters.type, and every returned row matched DEX or Lending; upstream resolution https://github.com/Stellar-Light/stellarlight/issues/524#issuecomment-4974459740
  - 2026-07-15 independent review confirmed the type-filter and general metric-metadata portion fixed, but the original sort=issues issue-only versus pull-request definition and repository-universe evidence remain unverified
recurrences:
  - date: 2026-07-11
    evidence: GT-55 reproduced that issues is a cached project/repository-universe backlog rollup, not activity or quality; GitHub repository open_issues_count also cannot corroborate issue-only totals because it includes pull requests
  - date: 2026-07-14
    evidence: definitions and dataAsOf are live but the requested type filter remains absent; follow-up https://github.com/Stellar-Light/stellarlight/issues/524#issuecomment-4971408859
---

## Finding

The leaderboard does not make the exact activity calculation or repository
source timestamp answer-visible, and its coarse filtering cannot reliably
express "Stellar DeFi development activity." Consumers can easily relabel an
activity/last-update ordering as repo score or commit count and force a
misleading fixed roster.

GT-55 reproduced the same metric/scope problem on the `issues` dimension.
`/api/leaderboard?sort=issues&range=all` returned dated project rollups across
one or more repositories, while contemporaneous GitHub issue-only searches did
not always match the cached totals. The values are useful backlog snapshots,
but they are not direct activity or quality rankings, and GitHub's repository
`open_issues_count` is not an issue-only comparator because it includes pull
requests.

Scout 1.7.26 fixes the explicit project-type filter and returns general metric
definitions plus `dataAsOf`. The `sort=issues` residual remains open here until
the issue-only versus pull-request definition and repository universe are
independently verified live.

## Recommendation

Return the metric definition, calculation window, `generatedAt`, repository
data timestamp, included repositories, and explicit type/tag filters. If commit
count is supported, expose it as a distinct metric. Add fixtures showing that
activity, stars, issues, commits, TVL, and market usage are not interchangeable.
For `sort=issues`, also expose whether the value is issue-only, the repository
universe and cache timestamp, and a reproducible issue-versus-pull-request
definition.
