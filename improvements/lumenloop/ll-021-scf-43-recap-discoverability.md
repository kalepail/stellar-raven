---
id: ll-021
service: lumenloop
status: fixed-upstream
discovered: 2026-07-11
evidence:
  - live re-check 2026-07-14: public https://lumenloop.com/search?q=SCF%20%2343 still returns "SCF #43 Round Recap" dated 2026-06-02; owner-repo title/body/comment/PR search found no pre-existing tracking ref, so no ceremonial issue was created for the already-fixed gap
  - P4 N2 observed Lumenloop's public SCF landing-page recap path ending at round 40 while the official SCF #43 recap is current; solo://proj/49/scratchpad/super-corpus-rebuild--585
  - official SCF #43 recap, published 2026-06-02, reports 85 submissions, 29 awarded projects, and $3,139,069 worth of XLM; the 2026-07-11 dashboard snapshot instead showed 28 selected cards totaling $3,049,069
  - live re-check 2026-07-13: https://lumenloop.com/search?q=SCF%20%2343 returns "SCF #43 Round Recap" dated 2026-06-02, so the proposed discoverability gap no longer reproduces and no upstream issue was filed
---

## Finding

Lumenloop's SCF recap discovery lags the official round result. The accessible
recap index stops at round 40, so current retrieval cannot ground SCF #43's
final 29-project/$3,139,069 decision and may instead inherit the dashboard's
transient 28-project/$3,049,069 card snapshot.

## Evidence

P4 N2's 2026-07-11 primary and blind reconciliation compared the Lumenloop
recap path with the official Stellar Community SCF #43 recap and the live SCF
round page. The latter is a payment-lifecycle view, not a replacement for the
published selection decision. A direct public-search re-check on 2026-07-13
returned the official recap, so the discovery defect is now fixed upstream.

## Recommendation

Index the official recap promptly and expose its publication date, final
selection count, award valuation, and source URL. Keep decision results
separate from live payment/card statuses so a partial dashboard does not
silently overwrite the official total.
