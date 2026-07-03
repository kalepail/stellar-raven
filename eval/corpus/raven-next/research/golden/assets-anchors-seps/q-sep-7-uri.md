---
id: q-sep-7-uri
q: "Which Stellar SEP defines a URI scheme for requesting that a wallet sign a transaction or payment, and what does the URI look like?"
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names SEP-7 as the URI scheme for delegated/wallet signing requests.", weight: 5 }
  - { claim: "The scheme is web+stellar: (e.g. web+stellar:tx?... or web+stellar:pay?...).", weight: 3 }
should_have:
  - { claim: "Lets a website/app hand a wallet a transaction or pay operation to sign.", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes the tx vs pay operation forms.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber it (the URI scheme is SEP-7, not SEP-10 or SEP-24).", weight: 5 }
  - { claim: "Do NOT confuse SEP-7 (signing URI) with SEP-10 (web authentication).", weight: 3 }
must_cite:
  - "SEP-0007 on the stellar-protocol repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §7.1, Q19. Verified: SEP-0007 'URI Scheme to facilitate delegated signing'. Status note: the spec preamble declares Active (v2.1.0); the ecosystem README master table lists it under Final. Status is not gated — the number + scheme + tx/pay ops are the defining facts."
---

## Reference answer (gospel)

It is **SEP-7, "URI Scheme to facilitate delegated signing."** It defines the **`web+stellar:`**
URI scheme (no forward slashes) so a non-wallet app can hand a user's wallet a request to sign,
without ever seeing the secret key. Syntax: `web+stellar:<operation>?<param>=<value>&…`, with two
operations [1]:

- **`tx`** — sign a specific transaction: `web+stellar:tx?xdr=<base64+URL-encoded TransactionEnvelope>&…`
  (optional `callback`, `pubkey`, `msg`, `origin_domain`, `signature`, etc.).
- **`pay`** — request a payment: `web+stellar:pay?destination=G…&amount=…&asset_code=…&asset_issuer=…&memo=…`.

Apps may sign the URI (`origin_domain` + `signature`, validated against `URI_REQUEST_SIGNING_KEY`
in the domain's `stellar.toml`) so wallets can show a verified origin. SEP-7 is the **signing-URI**
standard and is distinct from **SEP-10** (web *authentication* / JWT) [1].

Source: [1] stellar-protocol `ecosystem/sep-0007.md` (URI Scheme to facilitate delegated signing).

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` + SEP repo.

## Edge / traps

Confusing the signing-URI SEP-7 with the auth SEP-10.
