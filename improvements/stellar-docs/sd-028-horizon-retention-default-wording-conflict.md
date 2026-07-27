---
id: sd-028
service: stellar-docs
status: fixed-upstream
discovered: 2026-07-11
upstreamTitle: Correct the Horizon history retention default
evidence:
  - official Horizon configuring and ingestion pages inspected 2026-07-11 disagree on whether HISTORY_RETENTION_COUNT defaults to 0 or 518400
  - stellar-horizon v27.0.0 internal/flags.go sets history-retention-count to 0 and defines 0 as unlimited
  - stellar-horizon v27.0.0 reaper source skips automatic history deletion when the count is 0
  - Solo scratchpad 575 GT-54 primary process 3383 and pre-read-locked blind process 3386
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2599
  - fixed upstream by https://github.com/stellar/stellar-docs/pull/2619 (merged 2026-07-16); issue https://github.com/stellar/stellar-docs/issues/2599 closed completed
  - live recheck 2026-07-27: both the Horizon configuring and ingestion admin pages state "By default (HISTORY_RETENTION_COUNT=0), Horizon retains all ingested history and never purges it" and present 518400 as a recommended ~30-day sliding window rather than the executable default
---

## Finding

Official Horizon administration pages disagree on the executable default for
`HISTORY_RETENTION_COUNT`. The configuring/source-backed behavior is
`0`, meaning unlimited/no automatic reaping, while the ingestion page promotes
`518400`—an approximate one-month recommendation—into default wording.

This distinction changes capacity planning and historical-ingestion outcomes.
An operator who believes the binary automatically reaps at 518400 may under-plan
storage; an operator who reingests old rows under a deliberately nonzero trailing
window may see them reaped again.

## Evidence

On 2026-07-11, both independent GT-54 lanes compared the rendered administration
pages with the v27.0.0 implementation. `internal/flags.go` initializes
`history-retention-count` to `0`, and the reaper treats zero as
unlimited. The one-month `518400` value remains useful operational
guidance, but it is not the executable default.

The blind matrix was sealed before the primary report was read and records the
conflict as resolved by source rather than averaged between the two prose values.

## Recommendation

Use one consistent formulation across Horizon administration pages:

- executable default: `HISTORY_RETENTION_COUNT=0`, meaning unlimited/no
  automatic history reaping;
- `518400`: a dated approximate one-month recommendation for an
  unfiltered deployment, not a binary default;
- changing retention does not ingest missing rows, and nonzero retention can
  reap explicitly reingested rows outside the active trailing window.

Link the wording to the versioned flag definition and keep any ledger-to-days
conversion explicitly approximate.
