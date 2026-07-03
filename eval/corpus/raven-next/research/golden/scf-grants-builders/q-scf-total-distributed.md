---
id: q-scf-total-distributed
q: "How much has the Stellar Community Fund distributed in total, and to roughly how many projects?"
category: scf-grants-builders
subcategory: funding-totals
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: true
freshness_horizon: "weekly"

expected_cards: [scout_analyze]
acceptable_cards: [scout_research, lumenloop_search_content_semantic]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Reports the cumulative SCF distribution as an ecosystem-analytics figure (the funding dimension), not a per-project number.", weight: 5 }
  - { claim: "Gives a count of funded projects/winners alongside the total amount, and is explicit about which count basis it uses (distinct funded projects vs awarded submissions).", weight: 4 }
should_have:
  - { claim: "Flags that cumulative totals grow each round and should be confirmed against the live source, and notes the USD vs XLM denomination (budgets are set in USD, paid in XLM).", weight: 2 }
nice_to_have:
  - { claim: "As of the 2026-06-29 live analytics, scout_analyze funding shows ~$19.97M USD across ~223 distinct funded projects (mean ~$89.5K); the communityfund.stellar.org awards counter separately shows ~504 awarded submissions (a project can win multiple rounds).", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a precise total as permanently fixed (it accrues every ~6-week round, and the live analytics figure itself drifts between indexings).", weight: 4 }
  - { claim: "Do NOT conflate the distinct-funded-projects count (~223) with the awarded-submissions counter (~504), or USD-denominated totals with XLM-denominated press figures (~200M XLM).", weight: 3 }
  - { claim: "Do NOT confuse SCF cumulative distribution with SDF treasury size, XLM total supply, or the SDF Enterprise Fund.", weight: 4 }
must_cite:
  - "Stellar Light analytics (scout_analyze funding) and/or the SCF history-of-SCF page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellarlight.xyz"
  - "https://communityfund.stellar.org/awards"
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Dossier §11. scout_analyze funding dimension is the exact card ('how much has SCF distributed'). Re-verified live 2026-06-29: scout_analyze ?dimension=funding returned scfTotalDistributedUSD ~$19.97M, scfAwardedProjects 223, meanAwardUSD ~$89.5K (DOWN from the 2026-06-22 $21.36M/239 — the live metric recomputes and drifts in both directions). communityfund.stellar.org/awards counter showed 504 'Previously Awarded Submissions'. RECONCILED: two count bases (distinct funded projects ~223 vs awarded submissions ~504, since a project can win multiple rounds) and two denominations (USD analytics vs XLM-denominated press figures like ~200M XLM). Freshness-sensitive."
---

## Reference answer (gospel)

- The right source is Stellar Light's `scout_analyze` **funding dimension** — it returns the cumulative SCF distribution as an ecosystem-analytics total, not a per-project lookup. [Stellar Light scout / stellarlight.xyz]
- **Time-sensitive figure (2026-06-29 live analytics):** ~**$19.97M USD** distributed across **~223 distinct SCF-funded projects**, mean award ≈ **$89.5K USD**. Report this as the live snapshot, not a fixed total — it had been $21.36M / 239 a week earlier, so the metric itself drifts. [scout_analyze `?dimension=funding`]
- **Two different counts, do not conflate them:** scout_analyze counts ~**223 distinct funded projects**; the communityfund.stellar.org/awards page counts ~**504 awarded submissions** (a single project can win across multiple rounds, so submissions > projects). [communityfund.stellar.org/awards]
- **Two denominations:** SCF budgets are set in **USD** (what scout_analyze reports) but paid out in **XLM**; older press figures of **~200M XLM** are XLM-denominated and not directly comparable to the USD total. Cite the live number and name the denomination/count basis rather than asserting any frozen figure.
- **Always flag freshness:** cumulative totals grow every ~6-week round; confirm against the live source.
- Keep scope distinct: SCF cumulative distribution ≠ SDF treasury size, ≠ total XLM supply, ≠ the SDF Enterprise Fund (outreach-only, no application).

## Why these cards (routing rationale)

"How much has SCF distributed" is the literal example query for `scout_analyze` (funding dimension).

## Edge / traps

Trap: a fixed total without a freshness note; or confusing SCF distribution with SDF treasury / XLM supply.
