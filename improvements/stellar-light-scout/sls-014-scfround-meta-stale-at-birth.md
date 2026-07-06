---
id: sls-014
service: stellar-light-scout
status: verified
discovered: 2026-07-06
evidence:
  - eval/qa/results/2026-07-06T18-48-22-variantA.json (q-scf-current-round, wrong)
  - verdict-review workflow wf_01b3347d-1b8 (triage: upstream-data-gap, verdict stands on outcome)
  - live verification 2026-07-06: production scout.getRfps reproduced the stale scfRound meta verbatim; communityfund.stellar.org/awards fetched the same day shows SCF #45 in Submission
  - Solo project 49, todo 846
---

## Finding

Successor to the fixed sls-007 — and its cautionary sequel. The `scfRound`
object on `getRfps` meta is exactly the mechanism sls-007 recommended (round
identity, submission window, `asOf`, `verifyAt`), and it shipped. But its data
was **two rounds stale at birth**: as of its own `asOf` of 2026-07-03 it
reports `currentRound: null` / `lastConfirmedRound: 43` / null
`submissionWindow` with the note "the next round had not been confirmed open
as of asOf" — while the payload's own `verifyAt` authority
(communityfund.stellar.org/awards) showed SCF #45 **in Submission** with a
July 26, 2026 deadline, and SCF #44 already past its June 14, 2026 submission
deadline. The mechanism shipped; the refresh cadence didn't, so the field
asserts a negative ("not confirmed open") that its cited source contradicted
before the assertion was made.

This cost a QA verdict outright: the answering agent did everything right —
called the correct operation, quoted `scfRound` faithfully, flagged the `asOf`
date, and pointed the user at communityfund.stellar.org — and was still graded
wrong on outcome, because the service's curated answer to "what's the current
SCF round?" was false.

## Evidence

Live re-execution 2026-07-06 (production, free ops) reproduces the answering
agent's payload exactly:

```
meta.scfRound = {"currentRound":null,"lastConfirmedRound":43,
  "submissionWindow":{"opens":null,"closes":null},"asOf":"2026-07-03",
  "note":"SCF #43 concluded (recap 2026-06-02); the next round had not been
  confirmed open as of asOf"}
```

Live communityfund.stellar.org/awards, fetched the same day: "SCF #45 /
Submission / Deadline to submit: July 26, 2026 / $150K in XLM", with SCF #44
already in Panel Review (submission deadline June 14, 2026). Anyone can
reproduce both sides in one sitting: call `getRfps` and open the awards page.
QA case q-scf-current-round in the 2026-07-06 stamp; verdict-review triage in
workflow wf_01b3347d-1b8.

## Recommendation

Fix the cadence, not the schema — the schema is right. Cheapest fix: ingest
the awards page (or the SCF API) on a cadence tighter than the ~6-week round
rotation — weekly matches the freshness horizon of the questions this field
exists to answer — and populate `currentRound`/`submissionWindow` from it.
Invariant worth enforcing regardless of cadence: never emit a "not confirmed
open" note whose `asOf` postdates an open round on the cited `verifyAt`
source — a pre-publish check of the meta against its own authority would have
caught this. Consumer-side workaround: follow `verifyAt` directly; for
consumers that can't fetch it (this gateway's sandbox has no network), the
caveat-and-point-at-verifyAt behavior the answering agent already exhibited is
the ceiling, and it still yields a wrong headline.
