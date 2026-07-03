---
id: q-protocol-network-passphrases
q: "What are the network passphrases for Stellar Mainnet, Testnet, and Futurenet, and why do they matter?"
category: protocol-core
subcategory: networks-passphrases
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Gives the Mainnet/Pubnet passphrase exactly: 'Public Global Stellar Network ; September 2015'.", weight: 5 }
  - { claim: "Gives the Testnet passphrase exactly: 'Test SDF Network ; September 2015'.", weight: 5 }
  - { claim: "Gives the Futurenet passphrase exactly: 'Test SDF Future Network ; October 2022'.", weight: 4 }
should_have:
  - { claim: "Explains the passphrase is hashed into the transaction signing payload, so the wrong passphrase produces an invalid signature (txBAD_AUTH).", weight: 3 }
nice_to_have:
  - { claim: "Notes Testnet/Futurenet are free-to-use (friendbot funds) while Mainnet requires real XLM.", weight: 1 }
must_avoid:
  - { claim: "Do NOT swap the Testnet and Mainnet passphrases or alter their exact wording/date.", weight: 5 }
  - { claim: "Do NOT give the Futurenet date as September 2015 (it is October 2022).", weight: 4 }
  - { claim: "Do NOT invent a separate passphrase for Soroban (Soroban runs on the same networks/passphrases).", weight: 3 }
must_cite:
  - "The networks page on developers.stellar.org/docs/networks."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/networks
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Exact-string fact; high pass threshold. Traps are swapping passphrases or wrong Futurenet date."
---

## Reference answer (gospel)

The network passphrases are exact, case- and punctuation-sensitive strings [1]:

- **Mainnet / Pubnet**: `Public Global Stellar Network ; September 2015`
- **Testnet**: `Test SDF Network ; September 2015`
- **Futurenet**: `Test SDF Future Network ; October 2022`

The passphrase is hashed into the transaction signing payload, so signing with the wrong passphrase produces an **invalid signature (`txBAD_AUTH`)** when the tx is submitted to a given network [1]. Testnet/Futurenet are free (friendbot-funded); Mainnet requires real XLM. Soroban runs on these same networks and uses the **same passphrases** — there is no separate Soroban passphrase [1].

## Why these cards (routing rationale)

Exact canonical config string → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

The traps are subtle string errors: swapping Test/Public, wrong Futurenet year (Oct 2022 not Sep 2015),
or inventing a Soroban-specific passphrase.
