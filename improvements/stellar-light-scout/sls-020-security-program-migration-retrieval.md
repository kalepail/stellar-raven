---
id: sls-020
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-10
evidence:
  - live Scout research query for the exact 2026-05-07 SDF HackerOne consolidation returned no matching transition record
  - current HackerOne policy records the consolidation, deprecated general Stellar Immunefi program, and separate OpenZeppelin carve-out
  - live SDF security landing content still advertises both general programs and is stale relative to the controlling policy
  - Solo scratchpad 575 GT-07 primary process 3223
  - GT-40 blind recurrence: exact current-policy research still missed the 2026-05-07 consolidation and June 29 reward matrix while stale $50K Soroban material remained retrievable
  - upstream issue filed 2026-07-13: https://github.com/Stellar-Light/stellar-scout/issues/10
  - resolving PR merged 2026-07-14: https://github.com/Stellar-Light/stellarlight/pull/529
  - live recheck 2026-07-15T15:22Z: the exact original transition query returned the 2026-05-07 security-program supersession record at rank 1 and the controlling HackerOne policy at rank 2, including the consolidated HackerOne program, deprecated general Immunefi program, and separate active OpenZeppelin carve-out
---

## Finding

Scout research retrieval does not surface the May 7, 2026 Stellar Development
Foundation security-program migration. An exact live query for the effective
date, the single consolidated HackerOne bounty, the deprecated general Stellar
Immunefi program, and the separate OpenZeppelin-on-Stellar carve-out returned
25 unrelated research rows and no transition match.

This is consequential because the live SDF security landing page still
advertises both the general Immunefi and HackerOne programs. Without a newer
controlling record or supersession metadata, a consumer can double-count one
program, direct reports to a retired intake, or miss the still-separate
OpenZeppelin bounty.

## Evidence

The read-only audit queried Scout on 2026-07-10 with:

    Effective 7 MAY 2026 SDF consolidated bug bounty single HackerOne Immunefi deprecated

The result set contained no row matching HackerOne, Immunefi, consolidation,
or the transition date. Current primary records establish:

- SDF's live HackerOne policy says the programs were consolidated effective
  May 7, 2026.
- The former general Stellar Immunefi program is deprecated.
- The distinct OpenZeppelin-on-Stellar Immunefi bounty remains active and is
  expressly outside that consolidation.
- The SDF landing page conflicts with this newer policy.

Lumenloop semantic search also missed the transition, but its public API/content
intake remains unclear; this finding targets Scout's durable GitHub intake and
does not treat the two aggregators as independent corroboration.

## Recommendation

Ingest the current HackerOne policy/version history as a dated security
research record, capture program status and supersession relationships, and
label the older SDF landing content as conflicted or superseded for this claim.

Add a regression query using the exact transition wording above. The expected
result should rank in the top three and expose:

- effective date;
- consolidated HackerOne program;
- deprecated general Immunefi program; and
- separate active OpenZeppelin carve-out.

The stale SDF landing page should not be returned as uncontested current truth.
