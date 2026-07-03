---
id: q-ti-testnet-usdc-faucet
q: "How do I get testnet USDC (or other issued test assets) after adding the trustline, given Friendbot only funds XLM?"
category: tooling-infra
subcategory: assets-balances
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States Friendbot funds Testnet XLM/native lumens only; it does not mint arbitrary issued assets like USDC.", weight: 5 }
  - { claim: "Explains that to receive classic issued assets such as testnet USDC, the account must first create a trustline to the correct asset code and issuer.", weight: 5 }
  - { claim: "Points to the current documented testnet USDC issuer and Circle faucet flow where applicable, rather than inventing an SDF USDC faucet.", weight: 4 }
  - { claim: "Distinguishes classic issued-asset trustline balances from SAC/SEP-41 contract balances.", weight: 4 }
  - { claim: "Gives alternate routes for non-USDC test assets: receive payment from the issuer/project, issue your own test asset, or use a project-specific faucet if documented.", weight: 3 }
should_have:
  - { claim: "Mentions Stellar Lab's fund page can help add Testnet USDC/EURC trustlines but receiving units still requires the asset issuer/faucet/payment.", weight: 3 }
  - { claim: "Cites a dated/current source for any specific issuer address or faucet URL.", weight: 3 }
nice_to_have:
  - { claim: "Mentions testnet reset/faucet availability can change.", weight: 1 }
must_avoid:
  - { claim: "Do NOT tell users Friendbot sends USDC or other non-native assets.", weight: 5 }
  - { claim: "Do NOT fabricate issuer addresses or unofficial faucet wallets.", weight: 5 }
  - { claim: "Do NOT treat a trustline as receiving a balance by itself.", weight: 4 }
must_cite:
  - "Friendbot/Lab/Testnet docs."
  - "A current source for testnet USDC issuer/faucet, such as Stellar x402 docs or Circle faucet docs."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/lab
  - https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide
  - https://developers.stellar.org/docs/build/guides/transactions/create-account
  - https://lab.stellar.org/account/fund
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Circle faucet availability and testnet issuer details are external/current-service dependent. Verified docs search shows testnet USDC issuer `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` and Circle faucet flow."
---

## Reference answer (gospel)

Friendbot is for Testnet XLM account funding, not arbitrary issued assets. Stellar Lab's current docs say Lab can create/fund Testnet/Futurenet accounts with Friendbot and can add Testnet USDC/EURC trustlines [Lab](https://developers.stellar.org/docs/tools/lab). A trustline only says your account can hold the asset; it does not give you a balance.

For Testnet USDC, use the documented flow: create/fund a Testnet account, create a USDC trustline, then use Circle's faucet with Stellar Testnet selected. Stellar's x402 quickstart gives the Testnet USDC issuer `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`, shows the Lab Change Trust steps, and points to `https://faucet.circle.com` [x402 quickstart](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide). For other test assets, get a payment from the issuer/project, use a documented project faucet, or issue your own test asset.

Classic asset trustlines are ledger entries on an account. SACs wrap Stellar assets as contracts for Soroban interaction; do not treat a SAC contract balance model as identical to simply adding a classic trustline.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer depends on official Lab/Friendbot/trustline docs and current x402/Testnet USDC docs. `parallel_search` is acceptable for Circle faucet freshness, and `scout_research` can surface the same dev-doc excerpts.

## Edge / traps

The dangerous trap is inventing a "backup faucet wallet" or saying Friendbot sends USDC. Another common mistake is thinking Add Trustline equals receiving tokens.
