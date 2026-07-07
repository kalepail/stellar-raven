---
id: sls-016
service: stellar-light-scout
status: verified
discovered: 2026-07-07
evidence:
  - eval/qa/results/2026-07-07T19-26-06-variantA.json (q-live-hackathon-recent-winners)
  - "live probe 2026-07-07: GET /api/hackathons/{stellar-agents-x402-stripe-mpp,stellar-hacks-zk-gaming} — itemized per-place amounts appear only in description markdown ('First Place:** $5,000 in XLM' …); structured winner entries carry an identical pool-level award label"
  - Solo todo 870 round record (scratchpad artifact-source-basi--545)
---
## Finding

Per-winner award amounts are not structured. Winner entries on completed
hackathons carry `hackathonPlacement`/`placementRank` (fixed in sls-001) plus an
`award` field, but that field holds the same pool-level label for every winner
(e.g. "10K Prize Pool"). The actual per-place split ($5,000 / $2,000 / $1,250 /
$1,000 / $750 in XLM) exists only inside the hackathon `description` markdown
prose. `prizePoolUSD` is total-only.

## Evidence

Both completed hackathons probed on 2026-07-07 show the pattern: the itemized
split is present verbatim in `description` ("First Place:** $5,000 in XLM"),
while no winner-level or track-level structured field carries per-place
amounts. Consumer-side symptom, reproducible: in QA run
2026-07-07T19-26-06-variantA.json the answering agent correctly extracted the
split from the prose, and an evidence-bounded judge — seeing only the
structured award fields — graded the amounts as fabricated. Any consumer that
trusts structured fields over prose will either miss the split or mistrust a
correct one.

## Recommendation

Add a structured per-place amount to winner entries — e.g.
`awardAmountUSD`/`awardAmount` + `awardAsset` alongside the existing
`hackathonPlacement`/`placementRank` — or a `prizeTiers` array on the
hackathon (rank → amount → asset), keeping the prose as display copy.
Cheapest fix: `prizeTiers` at the hackathon level, since the ranked winner
join already exists via `placementRank`. Until then the description prose is
the only source of truth for amounts; this repo's judge evidence packs are
being extended to include prose regions matched to answer claims (Solo todo
filed this round) as the consumer-side workaround.
