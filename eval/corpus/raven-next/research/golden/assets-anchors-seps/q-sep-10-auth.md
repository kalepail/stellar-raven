---
id: q-sep-10-auth
q: "How does SEP-10 authenticate a Stellar wallet to an anchor?"
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
  - { claim: "Names SEP-10 as Stellar Web Authentication.", weight: 5 }
  - { claim: "The wallet signs a server-provided challenge transaction to prove control of its account; the server returns a JWT on success.", weight: 4 }
should_have:
  - { claim: "The challenge transaction is not submitted to the network (it is a signed proof, not a real payment).", weight: 2 }
nice_to_have:
  - { claim: "Notes SEP-45 extends web auth to Soroban contract accounts.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber it (authentication is SEP-10, not SEP-12/SEP-24).", weight: 5 }
  - { claim: "Do NOT claim the challenge transaction is submitted on-chain to authenticate.", weight: 2 }
must_cite:
  - "SEP-0010 on the stellar-protocol repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0045.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §7.1, Q12. Verified: SEP-0010 'Stellar Authentication', Status Active (ecosystem README master table)."
---

## Reference answer (gospel)

**SEP-10** is **Stellar Web Authentication** (Status: Active) — the standard by which a wallet
proves control of its Stellar account to a server (e.g. an anchor) and obtains a session JWT.
Flow: (1) the wallet GETs a **challenge transaction** from the server's `WEB_AUTH_ENDPOINT`
(signed by the server's `SIGNING_KEY`); (2) the wallet **signs the challenge** with its account
key(s) and POSTs it back; (3) the server validates the signature(s) and returns a **JWT**
authenticating the session. The challenge transaction is a **proof artifact — it is built with an
invalid sequence number and is never submitted to the ledger**, so no on-chain payment or fee is
involved [1]. SEP-10 authenticates classic `G`/`M` accounts; **SEP-45** is the analogous web-auth
standard for Soroban **contract (`C…`) accounts** [2].

Sources: [1] stellar-protocol `ecosystem/sep-0010.md` (Stellar Authentication, Active);
[2] `ecosystem/sep-0045.md` (Web Authentication for Contract Accounts, Draft).

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` + SEP repo.

## Edge / traps

Misnumbering (auth is SEP-10, not SEP-12/24), or claiming the challenge is submitted on-chain.
