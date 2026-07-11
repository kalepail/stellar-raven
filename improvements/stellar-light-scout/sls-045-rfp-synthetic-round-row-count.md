---
id: sls-045
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-10
evidence:
  - live getRfps/open probe returned five actual Q2 briefs plus a synthetic scf-round-45 row
  - response metadata reported open=5 while matched/returned contained six rows
  - official SCF RFP page independently listed the same five real briefs
  - Solo scratchpad 575 GT-39 primary process 3300 and blind process 3303
  - H1 recurrence 2026-07-11: /api/rfps?status=open again reported counts.open=5 but counts.matched=6 and counts.returned=6 because scf-round-45 is included as a synthetic row; solo://proj/49/scratchpad/super-corpus-rebuild--585
  - 2026-07-11 live re-check after Scout 1.7.15: the round row carries rowType=scf-round and synthetic=true, brief rows carry rowType=rfp, counts expose syntheticRounds=1, and meta.countBasis explains the five-brief/six-row distinction
recurrences:
  - date: 2026-07-11
    evidence: Before Scout 1.7.15, the synthetic current-round row made the same response support both five real briefs and six returned rows without typed row/count semantics. The 1.7.15 live re-check resolves that ambiguity with rowType, synthetic, syntheticRounds, meta.scfRound, and countBasis.
---

## Finding

The RFP discovery response prepends a synthetic current-round row to the
actual RFP records. The same response reports five open RFPs in metadata but
returns six matched rows, so consumers that count or render the result array
can misstate the number of current briefs and treat round metadata as an RFP.

## Recommendation

Return round context in a typed metadata field rather than as an RFP row. At
minimum, mark synthetic rows with an explicit discriminator and make
`matched`, `returned`, and `open` counts state whether metadata rows are
included. Add a contract test asserting that the five current briefs produce
five RFP records.
