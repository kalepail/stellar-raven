---
id: q-builder-dorahacks-background
q: "DoraHacks hosts Stellar's hackathons — what's the background on DoraHacks as a company (who funds it, how big is it)?"
category: scf-grants-builders
subcategory: hackathons
axes: [edge-governance, ecosystem-spectrum]
query_type: edge-nonstellar
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "Recognizes this is general-company background (DoraHacks as a business), best answered via general-web search rather than Stellar corpora.", weight: 5 }
  - { claim: "Returns sourced background on DoraHacks (e.g. it is a global hackathon / open-source incentive platform).", weight: 3 }
should_have:
  - { claim: "May note DoraHacks' funding/scale (e.g. venture funding raised) from a general-web source.", weight: 2 }
nice_to_have:
  - { claim: "Connects back to the Stellar relevance: SDF runs hackathons via dorahacks.io/org/stellar.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate funding figures or investors for DoraHacks; cite a general-web source.", weight: 4 }
  - { claim: "Do NOT force this purely into Stellar-only corpora (Scout/Lumenloop) — the company background is a general-web question.", weight: 3 }
must_cite:
  - "A general-web source on DoraHacks the company (Crunchbase/Pitchbook/news), not a Stellar-only corpus."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://pitchbook.com/profiles/company/231034-06
  - https://dorahacks.io
  - https://dorahacks.io/org/stellar
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Dossier §7.5. Near-edge: deliberately exercises the general-web edge (perplexity/parallel) for a partner-company background, with Stellar relevance retained. Verified 2026-06-29: corrected the Pitchbook URL (was 454905-21, which is not DoraHacks; correct profile is 231034-06). Pitchbook reports ~$38.2M raised; other trackers differ ($28M CBInsights, $20M ZoomInfo, $28-29M others) — figure is estimate-dependent, so the answer should cite its source and not assert a single hard number."
---

## Reference answer (gospel)

- This is general company background (DoraHacks as a business), so route to general web (`perplexity_search` / `parallel_search`), NOT Stellar-only corpora (Scout / Lumenloop) which can't answer a partner company's funding/scale.
- DoraHacks is a global hackathon community and open-source / Web3 developer-incentive platform (dorahacks.io). Source: https://dorahacks.io
- DoraHacks has raised ~$38.2M in venture funding per Pitchbook (estimates vary by tracker — e.g. CB Insights reports ~$28M; ZoomInfo ~$20M). Cite the specific general-web source for whatever funding figure you give, and present it as a sourced estimate rather than a single hard number; do NOT fabricate investors or amounts. Source: https://pitchbook.com/profiles/company/231034-06
- Stellar relevance: the SDF runs its hackathons through DoraHacks at dorahacks.io/org/stellar — connect the company background back to that. Source: https://dorahacks.io/org/stellar
- Deep-research is over-escalation for a company-background lookup; a single general-web search suffices.

## Why these cards (routing rationale)

Partner-company background (non-Stellar-specific) is exactly the general-web edge → `perplexity_search`
(or `parallel_search`). Stellar-only corpora can't answer DoraHacks' funding/scale.

## Edge / traps

Trap: forcing it into Scout/Lumenloop, or fabricating funding figures. Deep-research is still over-escalation.
