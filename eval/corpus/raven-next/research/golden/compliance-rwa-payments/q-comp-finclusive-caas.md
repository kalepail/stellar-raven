---
id: q-comp-finclusive-caas
q: "How do Stellar anchors handle Travel Rule and BSA/AML obligations, and what is FinClusive's 'Compliance as a Service' role?"
category: compliance-rwa-payments
subcategory: kyc-aml-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, perplexity_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "FinClusive provides a compliance toolkit / 'Compliance as a Service' (CaaS) for Stellar anchors, covering KYC/KYB and Travel-Rule / BSA / USA PATRIOT Act obligations.", weight: 5 }
  - { claim: "The anchor (regulated financial institution), not the Stellar protocol, carries the AML/Travel-Rule and licensing burden.", weight: 4 }
should_have:
  - { claim: "FinClusive operates as a shared/reusable verification utility so a customer verified once can be reused across anchors (subject to consent).", weight: 3 }
nice_to_have:
  - { claim: "Names anchor/wallet partners (e.g. MoneyGram, Bitso, Biccos, Kado, Nium) in the compliance ecosystem.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the Stellar network itself performs Travel Rule screening or holds AML licenses.", weight: 4 }
  - { claim: "Do NOT invent specific FinClusive regulatory approvals or licenses not in the record (state uncertainty instead).", weight: 3 }
must_cite:
  - "SDF policy blog (inclusion-through-compliance) and/or FinClusive materials."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://stellar.org/blog/policy/drive-inclusion-through-compliance
  - https://help.finclusive.com/en_US/stellar-transactions/what-is-a-stellar-anchor
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed. SDF policy blog documents FinClusive CaaS for anchors (KYB/KYC, Travel Rule, BSA/USA PATRIOT Act) as a shared verification utility. Partner names (MoneyGram, Bitso, Biccos, Kado, Nium) per SDF/anchor materials. Specific licenses/approvals not asserted. Trap: putting the AML duty on the protocol."
---

## Reference answer (gospel)

- **FinClusive provides a compliance toolkit / "Compliance as a Service" (CaaS) for Stellar anchors**,
  covering **KYC/KYB and Travel-Rule / BSA / USA PATRIOT Act** obligations [1].
- The **anchor — a regulated financial institution — carries the AML/Travel-Rule and licensing burden**,
  **not** the Stellar protocol [1].
- FinClusive operates as a **shared/reusable verification utility**, so a customer verified once can be
  reused across anchors (subject to consent), amortizing KYC cost network-wide [1].
- Anchor/wallet partners named in the ecosystem include **MoneyGram, Bitso, Biccos, Kado, Nium** [1].
  (Don't invent specific FinClusive licenses/approvals — state uncertainty instead.)

Sources: [1] SDF policy blog "Driving Inclusion Through Compliance"; FinClusive anchor materials.

## Why these cards (routing rationale)

FinClusive/anchor-compliance is documented in SDF's policy blog → `scout_research` (incidents/EC/docs corpus) is primary; `stellar_docs_mcp` and `perplexity_search` acceptable for partner/regulatory context.

## Edge / traps

Trap: putting the AML/Travel-Rule burden on Stellar core instead of the licensed anchor.
