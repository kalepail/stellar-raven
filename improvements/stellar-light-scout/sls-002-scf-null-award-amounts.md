---
id: sls-002
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live re-check 2026-07-14: Liqvid exposes scfAwarded=true with null total and scfAmountStatus=undisclosed; resolving PR https://github.com/Stellar-Light/stellarlight/pull/268
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - Solo project 49, todo 822, comments 2204-2210
  - recurred live 2026-07-03: production searchProjects again returned Liqvid.xyz scfAwarded true / amount null (Solo scratchpad 521 follow-up probe)
  - live re-check 2026-07-06 (eval round todo 846): FIXED — Liqvid.xyz now returns scfAwarded:true, scfTotalAwardedUSD:null plus a new scfAmountStatus:"undisclosed" field, exactly the recommended explicit marker
---

## Finding

Some SCF award entries carry null amounts — e.g. Liqvid.xyz is marked awarded
with amount null. Null is a legitimate value here, but it is ambiguous between
"undisclosed" and "missing data", which invites downstream guessing.

## Evidence

Observed in the 2026-07-03 eval round (results files above).

Fixed upstream: the 2026-07-06 live re-check found the exact recommended
marker shipped — `scfAmountStatus: "undisclosed"` on the Liqvid.xyz record —
resolving the undisclosed-vs-missing ambiguity.

## Recommendation

Add an explicit "amount undisclosed" marker (or equivalent enum/flag) so
consumers can distinguish undisclosed awards from data gaps instead of guessing.
