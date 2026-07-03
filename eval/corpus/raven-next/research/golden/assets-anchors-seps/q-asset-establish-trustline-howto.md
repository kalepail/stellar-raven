---
id: q-asset-establish-trustline-howto
q: "How do I establish a trustline to an asset on Stellar so my account can hold it?"
category: assets-anchors-seps
subcategory: trustlines
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that holding a non-native asset requires a ChangeTrust operation to create a trustline to the asset (code + issuer).", weight: 5 }
  - { claim: "States the account must keep enough XLM for the extra base reserve each trustline requires.", weight: 4 }
should_have:
  - { claim: "Notes the trustline can carry a limit, and that some assets require issuer authorization (AUTH_REQUIRED) before the holder can receive them.", weight: 3 }
  - { claim: "Shows the path via SDK or Stellar CLI/Laboratory to submit the ChangeTrust operation.", weight: 2 }
nice_to_have:
  - { claim: "Notes XLM (native) needs no trustline.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim a trustline is created with a 'Payment' or 'CreateAccount' operation — it is ChangeTrust.", weight: 5 }
  - { claim: "Do NOT claim assets can be received with no trustline (other than native XLM).", weight: 4 }
must_cite:
  - "A trustlines / change-trust page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts#trustlines
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Axis-C how-to. Procedure → stellar_docs_mcp. Trap = wrong operation (must be ChangeTrust) or claiming no trustline needed. Verified: trustlines created via ChangeTrust; each consumes a base reserve (0.5 XLM)."
---

## Reference answer (gospel)

To hold a **non-native** asset, your account must **create a trustline to it with the `ChangeTrust`
operation**, specifying the asset's **code and issuer** (and optionally a `limit`) [1]. Steps:

1. **Submit a `ChangeTrust` operation** for the asset (`<code:issuer>`) from your account — via an
   SDK (e.g. JS/Python `stellar-sdk`), the **Stellar CLI**, or the Stellar **Laboratory** [1].
2. **Keep enough XLM in reserve:** each trustline raises your account's **minimum balance by one
   base reserve (0.5 XLM)**, so the account must hold that extra XLM [1].
3. Some assets set **`AUTH_REQUIRED`**, meaning the **issuer must authorize** your trustline before
   you can receive the asset; until then the line exists but can't hold a balance [1].

**XLM (native) needs no trustline.** A non-native asset payment to an account **with no trustline
will fail** — the trustline is the opt-in that lets you receive it. (A trustline is *not* created
by a `Payment` or `CreateAccount` operation — it is `ChangeTrust`.)

Source: [1] developers.stellar.org accounts / trustlines docs.

## Why these cards (routing rationale)

Procedure to establish a trustline → `stellar_docs_mcp`; `scout_research` acceptable. General-web/
deep-research are misses.

## Edge / traps

Using the wrong operation (must be ChangeTrust), or claiming a non-native asset can be held without a
trustline.
