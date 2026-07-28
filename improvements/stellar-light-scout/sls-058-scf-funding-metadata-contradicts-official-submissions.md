---
id: sls-058
service: stellar-light-scout
status: verified
discovered: 2026-07-27
upstreamTitle: Reconcile project SCF funding metadata against official submission records
evidence:
  - eval round 2026-07-27 QA sample-30, results stamp 2026-07-27T22-32-31-variantA.json, case q-defi-streaming-payments-prior-art graded wrong with 2 wrong claims, both traceable to Scout structured fields
  - 2026-07-27 live production scout.searchProjects({ query "SStream", limit 5 }) returned scfAwarded false, scfTotalAwardedUSD null, scfAwardedRounds []
  - 2026-07-27 live production lumenloop.get_scf_submissions({ name "SStream" }) returned SCF #16, budget 36000, award_type "Legacy v4.0 Award", official submission recnfJhEt3t2QogUI
  - 2026-07-27 live production scout.searchProjects({ query "Fluxity", limit 5 }) returned scfAwarded true, scfTotalAwardedUSD 82750, scfAmountStatus "disclosed", scfAwardedRounds [21]
  - 2026-07-27 live production lumenloop.get_scf_submissions({ name "Fluxity" }) returned SCF #21, budget 68000, award_type "Legacy v5.0 Community Award", official submission recDXtqYuR8g9FMXt
  - independently re-executed by the round lead after the triage lane reported it; both contradictions reproduced
---

## Finding

Scout's structured SCF funding fields contradict the official SCF submission
records for at least two projects, in opposite directions.

`sstream` is reported as never SCF-funded (`scfAwarded: false`,
`scfTotalAwardedUSD: null`, `scfAwardedRounds: []`). The official submission
record shows it won SCF #16 with a budget of `36000`.

`fluxity` is reported with `scfTotalAwardedUSD: 82750` and
`scfAmountStatus: "disclosed"` for round 21. The official SCF #21 submission
record for the same project carries a budget of `68000`, a `14750` difference.

These are machine-readable fields on the primary discovery surface. An agent
that trusts them states false funding facts without any way to detect the
error from Scout alone — which is exactly what happened in the eval case cited
above, where both funding assertions in the answer were wrong and both came
directly from these fields.

The two rows fail differently, which matters for diagnosis: one is a missing
award linkage, the other is a project-level aggregate presented in a field an
agent reads as the round award. A fix that only reconciles totals would leave
the `sstream` case broken.

## Evidence

All probes are free production operations observed 2026-07-27.

| project | Scout structured fields | official SCF submission record |
| --- | --- | --- |
| `sstream` | `scfAwarded: false`, `scfTotalAwardedUSD: null`, `scfAwardedRounds: []` | SCF #16, budget `36000`, Legacy v4.0 Award, `recnfJhEt3t2QogUI` |
| `fluxity` | `scfAwarded: true`, `scfTotalAwardedUSD: 82750`, `scfAmountStatus: "disclosed"`, `scfAwardedRounds: [21]` | SCF #21, budget `68000`, Legacy v5.0 Community Award, `recDXtqYuR8g9FMXt` |

Reproduction:

```js
await scout.searchProjects({ query: "SStream", limit: 5 });
await lumenloop.get_scf_submissions({ name: "SStream" });
await scout.searchProjects({ query: "Fluxity", limit: 5 });
await lumenloop.get_scf_submissions({ name: "Fluxity" });
```

Prevalence: 2 of 2 named project-funding assertions checked in the failing eval
case were wrong because of these fields. Both projects were reached through
ordinary prior-art discovery, not adversarial selection. Broader prevalence
across the project corpus was not measured and is the first thing worth
checking upstream.

## Recommendation

Reconcile `scfAwarded`, `scfAwardedRounds`, and `scfTotalAwardedUSD` against
the official submission IDs on a per-round basis.

Cheapest fix first: repair the linkage for the affected slugs and add a
reconciliation check that fails when a project's SCF fields disagree with the
official submission set for the same canonical slug.

Better, if the data model allows it: keep a project-level lifetime aggregate
separate from per-round award amounts, and expose the per-round amount with its
official submission URL so a consumer can cite the round award rather than
inferring it from an aggregate. The existing `scfAmountStatus` and
`scfCountBasis` fields already acknowledge that SDF does not publish every
per-award amount; the same honesty applied per round would let an agent tell
"reconstructed aggregate" apart from "official round award" without a second
service call.

Consumer-side workaround currently required: cross-check every Scout funding
claim against `lumenloop.get_scf_submissions` before asserting it. That is an
extra service call per project and it only works for consumers who happen to
have both services available.
