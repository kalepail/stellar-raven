---
id: sk-003
service: skills
status: reported-upstream
discovered: 2026-07-03
evidence:
  - eval/qa/results/2026-07-03T03-49-35-variantA.json
  - eval/qa/results/2026-07-03T04-13-42-variantA.json
  - official getLedgers docs rechecked 2026-07-09: historical reach is provider-retention dependent, not an unconditional genesis guarantee
  - live SDF Testnet RPC 2026-07-09: getHealth returned oldestLedger 3402817 / latestLedger 3523776 / retentionWindow 120960; getLedgers(startLedger=2) returned JSON-RPC -32600 requiring start within that retained range
  - Solo project 49, todo 822, comments 2204-2210
  - upstream issue filed 2026-07-09: https://github.com/stellar/stellar-dev-skill/issues/52
recurrences:
  - date: 2026-07-09
    evidence: upstream data skill still says getLedgers can reach genesis in four places, while official docs qualify history by provider retention and the SDF Testnet instance rejected ledger 2 outside its retained range
probe:
  type: http-text
  url: https://raw.githubusercontent.com/stellar/stellar-dev-skill/main/skills/data/SKILL.md
  expect:
    status: 200
    contains:
      - Infinite Scroll
      - back to genesis
---

## Finding

The data skill promises `getLedgers` history back to genesis despite provider retention limits.

`stellar-dev/data/SKILL.md` (~lines 177, 365, 389, 409) claims `getLedgers`
supports unconditional "Infinite Scroll back to genesis" access. Official
method documentation instead qualifies historical reach by the selected
provider's retention, and a live SDF Testnet RPC rejects ledgers older than its
reported retention boundary.

## Evidence

Conflict surfaced in the 2026-07-03 eval round. On 2026-07-09, the SDF Testnet
RPC reported `oldestLedger: 3402817`, `latestLedger: 3523776`, and
`retentionWindow: 120960`; `getLedgers` with `startLedger: 2` failed with
JSON-RPC `-32600` and required a start within the retained range. A data-lake-
backed provider may retain genesis, but the method does not guarantee it.

## Recommendation

Qualify all four upstream skill references: `getLedgers` can reach as far back as
the chosen provider retains or exposes through its data-lake integration; it is
not universally guaranteed to reach genesis. Teach callers to inspect
`getHealth.oldestLedger` (or provider documentation) before assuming depth.
