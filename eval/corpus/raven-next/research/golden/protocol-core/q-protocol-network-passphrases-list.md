---
id: q-protocol-network-passphrases-list
q: "List the Stellar network passphrases for the public network, testnet, and futurenet — what is the exact passphrase string for each?"
category: protocol-core
subcategory: networks
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Gives the public-network passphrase exactly: 'Public Global Stellar Network ; September 2015'.", weight: 5 }
  - { claim: "Gives the testnet passphrase exactly: 'Test SDF Network ; September 2015'.", weight: 5 }
should_have:
  - { claim: "Gives the futurenet passphrase exactly ('Test SDF Future Network ; October 2022').", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT garble the passphrase strings (e.g. wrong date, missing the ' ; ' separator, or swapping public/test strings).", weight: 5 }
  - { claim: "Do NOT invent a separate 'mainnet' passphrase distinct from the public-network one.", weight: 3 }
must_cite:
  - "A networks / network-passphrase page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/networks
  - https://developers.stellar.org/docs/networks
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Reviewed 2026-06-29: differentiated from q-protocol-network-passphrases by stripping the 'why they matter' rationale (network-id hashing / replay / signing) — this is the bare-enumeration variant; the rationale now lives only in the factual sibling. Strings verified against developers.stellar.org/docs/networks. Trap = garbling the strings."
---

## Reference answer (gospel)

Exact passphrase string per network [1][2]:

- **Public network**: `Public Global Stellar Network ; September 2015`
- **Testnet**: `Test SDF Network ; September 2015`
- **Futurenet**: `Test SDF Future Network ; October 2022`

There is no separate "mainnet" passphrase distinct from the public-network one. (Why the passphrase matters — network-id hashing, replay protection, signing — is covered by `q-protocol-network-passphrases`; this variant is the bare per-network enumeration.)

## Why these cards (routing rationale)

Enumerating the exact passphrase strings per network → `stellar_docs_mcp` (canonical fundamentals
page); `scout_research` acceptable. General-web is a miss for exact protocol constants.

## Edge / traps

Garbling a passphrase string, or inventing a separate 'mainnet' passphrase.
