---
id: sls-024
service: stellar-light-scout
status: verified
discovered: 2026-07-10
evidence:
  - live Scout project probes for Slender, Laina, K2 Lend, and OrbitCDP asOf 2026-07-10
  - direct operator-site and repository re-checks for the same four projects
  - Solo scratchpad 575 GT-14 primary process 3239 and independent blind process 3242
  - GT-15 recurrence 2026-07-10: Slender app showed no usable state while marketing remained reachable; Laina was testnet/early; Orbit V2 pool was frozen/suspended; Scout labels remained source-relative rather than deployment proof
  - GT-17 recurrence 2026-07-10: official/provider Reflector pages still list OrbitCDP as an integration while Scout marks the project Inactive
  - GT-20 recurrence 2026-07-10: xBull remained Live with Android platform metadata while its Google Play URL returned 404 and operator page described passkey/hybrid V2 as forthcoming
  - GT-29 recurrence 2026-07-10: Centaurus remained Live+Unverified while its linked repositories had no activity after 2021 and no current primary deployment evidence was found
  - Eval recurrence 2026-07-11: super-corpus baseline headline run (result stamp 2026-07-11T15-36-44-variantA.json, case q-defi-streaming-payments-prior-art) — live Scout labeled Fluxity and SStream Live with no contract/network deployment proof, and the answering agent promoted the label into deployment and audit maturity; re-judge confirmed wrong
  - Eval recurrence 2026-07-11 (tier-interleave round, result stamp 2026-07-11T21-44-47-variantA.json, same case): re-reproduced W→W; live re-execution `scout.searchProjects({q:"streaming recurring payments"})` returned Fluxity status=`Live`, verificationLevel=`Unverified`, `statusAsOf`/`statusBasis`/`statusSourceUrl` all `null`, `supportedNetworks` `[]`, scfTotalAwardedUSD 82750 across scfAwardedRounds [18,21] (the internally inconsistent aggregate the golden warns against); all 19 streaming-payment projects in the response were labeled `Live`. The qualifier fields this finding recommends now EXIST in the schema but are unpopulated, so the label still carries no deployment basis and the agent again promoted `Live` into production/audit maturity
---

## Finding

Scout exposes one project-level lifecycle label without the source, scope, or
deployment qualifier needed to reconcile it with operator surfaces. In the
2026-07-10 lending audit, Scout marked Slender Inactive, Laina Live, K2 Lend
Live, and OrbitCDP Inactive. At the same time, operator surfaces respectively
showed an accessible Slender app, Laina describing early/testnet development,
K2 describing the product as coming soon, and OrbitCDP still describing itself
as live.

These pairs need not mean the Scout label is wrong: an operator page can be
stale, an app can remain reachable after abandonment, and "Live" can describe
an organization rather than a mainnet product. The API currently gives the
consumer no structured way to tell which interpretation the label represents.

## Evidence

The golden audit ran exact Scout project queries and separately fetched each
operator site/repository on 2026-07-10. Two independent audit lanes reproduced
the conflicts. The answer could only remain correct by reporting status as
source-relative and dated rather than promoting either surface to universal
truth.

This is a response-semantics problem, not proof that the operator claims are
newer or more authoritative than Scout.

GT-15 independently reproduced the class while auditing lending/flash loans:
Slender's marketing described flash loans but the app exposed no usable
market state; Laina used testnet faucets; and the current Orbit V2 Blend pool
was frozen with supply/borrow suspended. These deployment observations add
product-level nuance without making an operator UI the universal lifecycle
authority.

GT-17 reproduced the same ambiguity from the integration direction: current
official/provider Reflector pages still list OrbitCDP as an integration while
Scout marks OrbitCDP Inactive. The two claims can coexist if one is a historical
listing and the other is a lifecycle assessment, but consumers need dates and
relationship status to avoid turning the pair into a contradiction.

GT-20 reproduced the class for a wallet/platform record. Scout marked xBull
Live and still exposed Android support, while the Google Play listing returned
404. The operator roadmap described passkey/hybrid V2 as forthcoming, contrary
to corpus wording that treated it as shipped. Project lifecycle, per-platform
availability, and roadmap feature state need separate evidence.

The 2026-07-11 super-corpus baseline reproduced the class in an eval answer
(`q-defi-streaming-payments-prior-art`, headline result stamp
`2026-07-11T15-36-44-variantA.json`, reviewed in
`eval/qa/reviewed/2026-07-super-corpus-baseline.md`): Scout labeled Fluxity and
SStream `Live`, the answer inferred mainnet deployment and audit maturity from
the label, and live re-execution found no contract/network deployment proof
behind it. The consumer-facing consequence is exactly the missing qualifier this
finding recommends — without a deployment basis, `Live` keeps getting promoted
into deployment truth.

The 2026-07-11 tier-interleave round (result stamp
`2026-07-11T21-44-47-variantA.json`, same case, reviewed in
`eval/qa/reviewed/2026-07-11-tier-interleave-round.md`) reproduced the class a
second time and sharpened it against the recommendation below. A live
`scout.searchProjects({ q: "streaming recurring payments" })` returned Fluxity
with `status: "Live"` but `verificationLevel: "Unverified"`, `statusAsOf`,
`statusBasis`, and `statusSourceUrl` all `null`, and `supportedNetworks: []` —
i.e. the exact provenance/deployment-scope fields this finding asks for are now
present in the response schema yet unpopulated for this record. Its
`scfTotalAwardedUSD` was `82750` spanning `scfAwardedRounds: [18, 21]`, the
internally inconsistent aggregate the golden explicitly cautions against
promoting into a second award. Every one of the 19 streaming-payment projects
in the same response was labeled `Live`. The answering agent again reported
Fluxity as `Live` with the `$82,750` aggregate and no deployment caveat. Schema
presence without population does not close the gap: a consumer still cannot
distinguish organization-active from mainnet-live, so the actionable ask is now
to POPULATE `statusBasis`/`statusAsOf`/`statusSourceUrl` (and `supportedNetworks`)
per record, not merely expose the fields.

## Recommendation

Attach lifecycle provenance and deployment scope to each project record:

- `statusAsOf` and `statusSourceUrl`;
- `statusBasis` or a short evidence note;
- separate entity/project lifecycle from testnet/mainnet product deployment;
- explicit `conflictingStatus` evidence when a current operator surface differs;
- last successful operator/repository verification timestamps.

Add regression fixtures for Slender, Laina, K2 Lend, and OrbitCDP. A consumer
should be able to tell whether each record means organization active,
development active, testnet available, mainnet live, paused, or inactive.
For listed integrations, expose whether the relationship is current,
historical, provider-declared, or independently code/deployment verified.
For apps, track per-platform store URL/status and roadmap-versus-shipped feature
state with independent timestamps.

GT-29 reproduced the lifecycle ambiguity for a payment-channel/L2 candidate:
Scout labeled Centaurus Live+Unverified while its linked repositories were
stale and no dated primary production deployment was located. Preserve the
record for discovery, but expose the unverified basis and repository/deployment
timestamps so Live is not promoted into Mainnet production status.
