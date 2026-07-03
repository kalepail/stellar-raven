---
id: q-ti-openzeppelin-relayer
q: "What is the OpenZeppelin Relayer on Stellar — is it live on mainnet, how is the relayer address funded/topped-up, and how do I integrate it with my backend to pay gas?"
category: tooling-infra
subcategory: developer-tooling
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: true
freshness_horizon: monthly

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_directory, parallel_search, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Identifies OpenZeppelin Relayer / Stellar Channels Service as managed infrastructure for submitting Stellar/Soroban transactions with parallel processing and fee management.", weight: 5 }
  - { claim: "States that Stellar support exists for Pubnet/Mainnet and Testnet, but status/integration details should be verified against the current OpenZeppelin stable docs or managed-service docs because the docs distinguish development and stable versions.", weight: 4 }
  - { claim: "Explains that the relayer pays network fees from its configured Stellar relayer account/key; that account must hold enough XLM or be funded/topped up according to the operator or managed-service workflow.", weight: 5 }
  - { claim: "Describes backend integration as submitting prepared transactions through the Relayer API/SDK or service endpoint, keeping relayer credentials server-side and enforcing app-level policy before relaying.", weight: 4 }
should_have:
  - { claim: "Mentions that SDF docs position OpenZeppelin Relayer as the replacement for experimental Launchtube fee sponsorship/contract-invocation flows.", weight: 3 }
  - { claim: "Cites OpenZeppelin's own relayer docs or repo for supported networks, configuration, SDK, and key-management details.", weight: 3 }
nice_to_have:
  - { claim: "Mentions the x402 facilitator plugin only as an optional related integration, not as the default gas-payment path.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim users can pay Stellar base fees without any funded relayer/sponsor account.", weight: 5 }
  - { claim: "Do NOT freeze a mainnet/live status without a dated/current source.", weight: 5 }
  - { claim: "Do NOT expose relayer private keys/API credentials in frontend code.", weight: 5 }
must_cite:
  - "A current Stellar docs page for the Stellar-specific Relayer role and an OpenZeppelin docs/repo source for operational details."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/tools/openzeppelin-relayer"
  - "https://developers.stellar.org/docs/build/agentic-payments/x402"
  - "https://developers.stellar.org/docs/tools#openzeppelin-relayer"
  - "https://docs.openzeppelin.com/relayer"
  - "https://github.com/OpenZeppelin/openzeppelin-relayer"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness-sensitive. Phase 3 verified SDF docs for OpenZeppelin Relayer and x402 facilitator availability on Testnet/Mainnet; exact managed-service funding UI/API remains an accepted residual that should be checked against current OpenZeppelin stable docs at answer time."
---

## Reference answer (gospel)

OpenZeppelin Relayer on Stellar is the Stellar Channels Service: managed infrastructure for submitting Stellar/Soroban transactions with automatic parallel processing and fee management. SDF's docs describe it as the replacement for Launchtube, which was experimental and less mature for fee sponsorship and contract invocations.

For fees, the important model is simple: the relayer is not magic free gas. A configured Stellar relayer account signs/submits or sponsors transactions and needs XLM to cover network fees and any reserves its flow requires. In a managed setup, you fund/top up the relayer address through the service's documented workflow; in a self-hosted setup, you configure the Stellar network, relayer key material, and funding yourself. Backend integration should submit prepared transactions or relay requests through the OpenZeppelin API/SDK from your server, keep credentials server-side, validate the user's requested action, then let the relayer submit and track the transaction.

As of the 2026-06-29 verification snapshot, SDF docs list OpenZeppelin Relayer as a Stellar developer tool and OpenZeppelin docs list Stellar networks, including Pubnet and Testnet, in the relayer's network model. Because OpenZeppelin's site labels some docs as development while linking to stable `1.5.x`, a production answer should cite the current stable docs or managed-service page before asserting exact mainnet operational status.

## Why these cards (routing rationale)

`scout_projects` is expected because this is a named ecosystem/tooling project and Scout returns the OpenZeppelin project plus the `openzeppelin/openzeppelin-relayer` repo. `stellar_docs_mcp` is also acceptable because SDF has a dedicated OpenZeppelin Relayer page. `parallel_search` or LumenLoop directory search can be useful for the current managed-service status.

## Edge / traps

Do not describe the relayer as eliminating Stellar fees; it shifts fee payment to a funded relayer/sponsor flow. Do not put the relayer private key or API credential in a browser. Do not confuse the optional x402 facilitator plugin with the baseline Relayer product.
