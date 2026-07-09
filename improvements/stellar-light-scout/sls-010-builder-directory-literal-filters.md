---
id: sls-010
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live production execute 2026-07-03 (scout.getBuilders 16-probe fan-out; Solo scratchpad 521 follow-up, todo 826 comment 2224)
  - consumer-side workaround shipped: eval/qa/golden-overrides.json q-builder-by-region-latam graderNotes instruct per-country fan-out
  - live re-check 2026-07-06 (eval round todo 846): claim (1) FIXED — location:"Latin America" now returns 19 builders with country-valued locations (Chile, Brazil, Costa Rica), confirming region→country synonym expansion shipped; claim (2) strict-literal q bio matching was not probed this round, so the finding stays open on that half
  - upstream issue filed 2026-07-07: https://github.com/Stellar-Light/stellar-scout/issues/2
  - "fixed upstream and live re-verified 2026-07-09T13:00Z after Stellar-Light/stellar-scout#2 closure: GET https://stellarlight.xyz/api/builders?location=Latin%20America&limit=50 and GET https://stellarlight.xyz/api/builders?location=LatAm&limit=50 each return 19 builders across Brazil/Chile/Colombia/Costa%20Rica; GET https://stellarlight.xyz/api/builders?location=Brazil&q=payments&limit=50 returns 2 builders including Cleverson Silva's Boleto Guardian profile, which does not contain the literal token 'payments'"
---

## Finding

Builder-directory filtering is literal substring over free-text fields, which
breaks the two query shapes region questions actually take:

1. **No region-synonym expansion**: `location="Latin America"` (and "LatAm")
   returns 0 matches even though 18 LatAm profiles exist (Brazil 10, Chile 5,
   Costa Rica 2, Colombia 1 of 112 total) — the location values are free-text
   country/city strings, so region-level terms never match. `searchProjects`
   already does category-synonym expansion; builders has no equivalent.
2. **`q` is strict-literal against bio text**: `location=Brazil&q=payments`
   returns only 1 of the 10 Brazil profiles although others are
   payments-relevant (e.g. a profile building "Boleto Guardian, a
   blockchain-based [payments] infra" does not contain the literal token
   "payments").

Coverage note for the directory owners: Argentina, Mexico, Peru, and Venezuela
have zero profiles despite active Stellar communities — likely a
Passport-sync/coverage gap rather than an API defect.

## Evidence

Live 2026-07-03, production `execute` fan-out: per-country `getBuilders` for 8
LatAm countries plus 7 location×skill combos plus the unfiltered total (112).
Zero-match responses correctly return the structured filter-miss advisory
(112-profile directory restated, Discord/GitHub fallbacks) — the miss
signalling is good; the matching is what's literal.

Live re-check 2026-07-09T13:00Z after upstream issue
`Stellar-Light/stellar-scout#2` was closed:

- `GET https://stellarlight.xyz/api/builders?location=Latin%20America&limit=50`
  and `GET https://stellarlight.xyz/api/builders?location=LatAm&limit=50`
  each return 19 builders with country-valued locations including Brazil,
  Chile, Colombia, and Costa Rica.
- `GET https://stellarlight.xyz/api/builders?location=Brazil&q=payments&limit=50`
  returns 2 builders, including Cleverson Silva's Boleto Guardian profile
  ("blockchain-based infrastructure that prevents boleto fraud..."), which was
  the original non-literal payments-relevant miss. `GET
  https://stellarlight.xyz/api/builders?location=Latin%20America&q=payments&limit=50`
  returns 7 builders. Both halves of the original matching finding are fixed.

## Recommendation

Cheapest first: (1) region-synonym expansion in the location filter (region →
country list), mirroring the category synonyms searchProjects already has;
(2) semantic or synonym fallback for the builder `q` filter, matching
project-search behavior. Until then every regional consumer must know to fan
out by country name — undiscoverable from the API surface alone.
