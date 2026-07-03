---
id: ll-004
service: lumenloop
status: proposed
discovered: 2026-07-03
evidence:
  - research/services/lumenloop.md (documented quirk)
  - Solo project 49, todo 822, comments 2204-2210
---

## Finding

Partner items are hidden from `/v1/tools`; a complete tool listing requires a
union of `/v1/tools` with `/v1/me`. This is a known quirk (documented in
`research/services/lumenloop.md` and worked around host-side in this repo's
adapter), but it is a trap for any other consumer.

## Evidence

Documented and continuously exercised via this repo's adapter, which performs the
union. Recorded in the 2026-07-03 eval round's finding set (Solo refs above).

## Recommendation

Expose a complete tool listing from `/v1/tools` (or an explicit
`include=partner` parameter), so consumers do not need the two-endpoint union.
