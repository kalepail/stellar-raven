---
id: sls-005
service: stellar-light-scout
status: verified
discovered: 2026-07-03
evidence:
  - live probe of all 11 completed hackathons via production execute (2026-07-03 afternoon)
  - buildonstellarchile — 14 winners, every hackathonPlacement "Winners", every placementRank null, awards heterogeneous ($50/$100 video-pitch prizes)
  - also tier-only: stellar-hacks-zk-gaming (5), ideaton2026 (6), ideatontelluscoop (3)
  - Solo project 49, todo 824, comment 2216
---

## Finding

Successor to the fixed sls-001. On events whose winners were announced as a
prize tier rather than an ordinal ranking, every winner entry carries
`hackathonPlacement: "Winners"` and `placementRank: null`, and the array order
is not a ranking. Nothing in the payload says so — a consumer that just fixed
its behavior on ordinal events (trust `placementRank`) still has no signal that
THIS array is unordered, and the original placement-trap failure mode (asserting
finishing order from list position) survives intact for exactly these events.

4 of the 11 completed events are tier-only, so this is a routine case, not an
edge case.

## Evidence

Live probe (production `execute`, free ops, 2026-07-03 afternoon): of 11
completed events, 6 return ordinal labels with numeric `placementRank`;
`buildonstellarchile`, `stellar-hacks-zk-gaming`, `ideaton2026`, and
`ideatontelluscoop` return only the bare "Winners" label with null ranks.
`telluscoop-ideaton` has zero winners recorded. On `buildonstellarchile` the
award strings show genuinely tiered, non-ordinal prizes (multiple equal $50/$100
awards), confirming the nulls are honest — the data has no ranking to give.

## Recommendation

Make the unordered case self-describing. Cheapest fix: an event-level flag
(e.g. `winnersRanked: false`) or a documented guarantee that `placementRank` is
the ONLY ordering signal and array position is meaningless. Alternatively derive
a coarse rank from award amounts where they differ. Until then, consumers must
special-case null ranks — this gateway ships a `scout.getHackathon` catalog note
saying exactly that (commit a52eef8), but every other consumer will rediscover
the trap.
