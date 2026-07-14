---
id: sls-007
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live re-check 2026-07-14: open-RFP metadata reports current round 45, Submission phase, and 2026-08-16 close date; resolving PR https://github.com/Stellar-Light/stellarlight/pull/273
  - eval/qa/results/2026-07-03T16-06-45-variantA.json (q-scf-current-round)
  - live getRfps re-execution (2026-07-03 evening, production)
  - Solo project 49, todo 807, scratchpad 521
  - live re-check 2026-07-06 (eval round todo 846): FIXED — getRfps meta now ships a scfRound object {currentRound, lastConfirmedRound:43 + note ("SCF #43 concluded, next round not confirmed open"), submissionWindow:{opens,closes}, asOf:"2026-07-03", verifyAt:communityfund.stellar.org} — the recommended fields verbatim; values are null only because no next round is confirmed open, which the payload now states honestly
---

## Finding

`/api/rfps` exposes `activeQuarter` plus per-RFP `quarter` and `status`,
but **no SCF round number and no submission-window open/close dates**.
"What's the current SCF round and when does it close?" — a routine
builder question — is unanswerable from any lane of this catalog: the
freshest lumenloop artifact is the SCF #43 *recap* (2026-06-02), and
scout's payload carries nothing newer than the quarter label. On
2026-07-03 the live response still says `activeQuarter: "q2-2026"`
(consistent with scout's own 1–2-week-lag disclaimer), which compounds
the gap: an agent can neither name the round nor bound its dates.

Not covered by sls-002 (null award amounts) — this is about round
identity and windows, not amounts.

## Evidence

Live re-execution 2026-07-03 (production, free ops):
`scout.getRfps({status:"open"})` → meta {total 14, open 5, activeQuarter
"q2-2026", source stellarlight.xyz/ideas}; sample rows carry
quarter+status only. The QA agent's answer (graded partial) could only
say "active SCF quarter of Q2 2026" with a freshness caveat — the
rubric-correct ceiling given the payload. Round record: Solo scratchpad
521 (batch-2 review report).

Fixed upstream: the 2026-07-06 live re-check found the recommended
round-identity fields shipped (`scfRound` with lastConfirmedRound, submissionWindow,
asOf, and a verify link), converting the previously-unanswerable question into
one answerable with an honest freshness caveat.

## Recommendation

Add `currentRound` (integer, e.g. 45) and `submissionWindow: {opens,
closes}` (ISO dates) to the `/api/rfps` meta — the service already
mirrors stellarlight.xyz/ideas and computes open/closed status, so the
round/deadline metadata is one field away. If the upstream source lags,
carry an `asOf` timestamp so consumers can present the lag honestly.
This unlocks an entire freshness-sensitive question class no consumer
can currently ground.
