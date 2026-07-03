---
id: q-comp-anchor-compliance-stack
q: "Walk me through the order of SEPs and controls a compliant Stellar anchor uses to onboard a customer and process a regulated deposit."
category: compliance-rwa-payments
subcategory: kyc-aml-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Authentication first via SEP-10 (wallet proves account control, gets a token).", weight: 5 }
  - { claim: "KYC upload via SEP-12 (customer data sent to the anchor).", weight: 5 }
  - { claim: "Deposit/withdrawal handled via SEP-24 (interactive) or SEP-6 (programmatic).", weight: 3 }
should_have:
  - { claim: "For regulated assets, a SEP-8 approval server gates the transaction before submission.", weight: 3 }
  - { claim: "The asset's native flags (AUTH_REQUIRED / AUTH_CLAWBACK_ENABLED) enforce control at the ledger.", weight: 2 }
  - { claim: "The anchor (a regulated financial institution) runs off-chain AML/sanctions screening; licensing burden is the anchor's, not Stellar's.", weight: 2 }
nice_to_have:
  - { claim: "Mentions the Anchor Platform as the reference implementation tying this together.", weight: 1 }
must_avoid:
  - { claim: "Do NOT scramble the SEP roles (e.g. put SEP-8 as KYC, SEP-12 as auth, or SEP-10 as deposit).", weight: 5 }
  - { claim: "Do NOT claim Stellar core / the protocol performs KYC or holds the money-transmitter license.", weight: 3 }
must_cite:
  - "developers.stellar.org anchor / Anchor Platform docs and the relevant SEP specs."
must_not_use_tier: []

pass_threshold: 0.78
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/anchors
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md
  - https://stellar.org/products-and-tools/anchor-platform
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Multi-hop how-to chaining SEP-10/12/24/8 + flags, verified against the individual SEP specs. Trap: scrambling SEP roles."
---

## Reference answer (gospel)

A compliant anchor onboards a customer and processes a regulated deposit roughly in this order:

1. **Authenticate via SEP-10** — the wallet signs a challenge transaction; the anchor returns a JWT [1].
2. **Upload KYC via SEP-12** — the wallet submits customer data (`PUT /customer`) to the anchor [2].
3. **Deposit/withdrawal via SEP-24** (interactive/hosted) or **SEP-6** (programmatic) [1].
4. For a **regulated asset**, a **SEP-8 approval server** co-signs the transaction before submission [1].
5. The asset's **native flags** (`AUTH_REQUIRED` / `AUTH_CLAWBACK_ENABLED`) enforce control at the ledger.
6. The anchor — a **regulated financial institution** — runs off-chain **AML/sanctions screening**; the
   licensing burden is the **anchor's, not the Stellar protocol's** [1].

The **Anchor Platform** is SDF's reference implementation tying these SEPs together [3].

Sources: [1] developers.stellar.org Anchors; [2] SEP-0012; [3] Anchor Platform.

## Why these cards (routing rationale)

Procedure across SEPs/Anchor Platform → `stellar_docs_mcp`; `scout_research` acceptable.

## Edge / traps

Trap: mis-ordering or mis-assigning SEP roles; claiming the protocol itself is the regulated entity.
