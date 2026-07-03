---
id: q-defi-rwa-scf-similar
q: "Has anything like tokenized real-world assets or on-chain funds been funded through the SCF?"
category: defi-ecosystem
subcategory: rwa
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [lumenloop_find_similar_scf_submissions]
acceptable_cards: [lumenloop_search_content_semantic, scout_analyze, scout_rfps, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Searches the SCF archive for RWA / tokenized-fund / tokenization-themed submissions and reports what is (or isn't) found in the corpus.", weight: 5 }
should_have:
  - { claim: "Distinguishes SCF-funded RWA-tooling/builder submissions from the major institutional RWAs (BENJI, CRDT, USDY) which are issuer-led, not SCF grants.", weight: 3 }
nice_to_have:
  - { claim: "Notes the RWA category is institutionally validated but issuer-driven rather than primarily SCF-grant-driven.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Franklin Templeton, WisdomTree, or Ondo received SCF grants for their RWA products unless the source data shows it.", weight: 5 }
  - { claim: "Do NOT fabricate an SCF submission, amount, or award tier not present in source data.", weight: 5 }
must_cite:
  - "SCF archive matches (or an explicit 'none found' note)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "GROUNDED 2026-06-22: live Scout (q=tokenized RWA, scfAwarded=true, total=11) confirms real SCF-funded RWA-tooling/builder submissions: OrbitCDP ($280K, RWA-collateral CDP), Tauvlo (tokenized real estate, $145K), Rivool Finance ($150K, emerging-markets yield), Bando ($75K, B2B treasury), Legasi ($93.6K, Lombard lending), Velo ($14K). 'Has anything like X been funded' → find_similar_scf_submissions. KEY TRAP: the flagship institutional RWAs (BENJI/CRDT/USDY) are issuer-led, NOT SCF grants. REVIEWED 2026-06-29: re-confirmed all six live (q=tokenized RWA&scfAwarded=true) — OrbitCDP $280,000 (Etherfuse USTRY/CETES collateral), Tauvlo $145,000, Rivool Finance $150,000 (tokenized credit receivables), Legasi $93,660, Bando $75,000 (CETES via Etherfuse Stablebonds), Velo $14,000 (USDV backed by tokenized T-bills); Etherfuse confirmed as a real RWA-collateral issuer. SCF $ amounts drift → freshness_sensitive:true (quarterly); rubric gates on corpus-discovery discipline, not exact dollars."
---

## Reference answer (gospel)

**Yes — RWA / tokenization work has been SCF-funded**, but it is the **builder/tooling** layer, not the
flagship institutional issuers. Live SCF-awarded RWA submissions include [1]: **OrbitCDP** (~$280K, a
CDP using Etherfuse RWA collateral), **Tauvlo** (~$145K, tokenized real-estate marketplace), **Rivool
Finance** (~$150K, emerging-markets yield), **Legasi** (~$93.6K, Lombard lending), **Bando** (~$75K,
B2B treasury), and **Velo** (~$14K).

Critically, the **headline institutional RWAs — BENJI (Franklin Templeton), CRDT (WisdomTree), USDY
(Ondo) — are issuer-led launches, NOT SCF grants.** So the SCF funds RWA *infrastructure/builders*,
while the big tokenized funds come from the institutions directly.

Source: [1] stellarlight.xyz directory (Scout SCF-awarded RWA search, 2026-06-22).

## Why these cards (routing rationale)

"Has anything like X been funded by SCF" → `lumenloop_find_similar_scf_submissions`; analyze/content
acceptable.

## Edge / traps

Don't attribute SCF grants to Franklin Templeton/WisdomTree/Ondo (issuer-led); don't fabricate
submissions or amounts.
