---
id: q-ti-block-explorer-basics
q: "Which block explorer do I use to look up a Stellar tx/account/contract by hash/address (stellar.expert), and what can it show me?"
category: tooling-infra
subcategory: developer-tooling
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_directory, parallel_search, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Names StellarExpert (`stellar.expert`) as the usual first-stop explorer for Stellar transactions, accounts, assets, liquidity pools, and Soroban contracts.", weight: 5 }
  - { claim: "Explains that a user can paste a transaction hash, G/M/C address, asset, liquidity-pool id, or contract id and inspect ledger metadata such as operations/events, balances, trustlines/assets, source/destination, fees, result status, and contract/wasm details where available.", weight: 5 }
  - { claim: "Mentions Stellar Lab's transaction dashboard/contract explorer as an official developer debugging complement, not a replacement for public explorer discovery.", weight: 4 }
  - { claim: "Separates network selection: mainnet/testnet/futurenet/local views must match the hash/address network.", weight: 3 }
should_have:
  - { claim: "Mentions StellarChain as an alternate explorer with contract support, with source caveat if only site-level verification was available.", weight: 2 }
  - { claim: "Cites a live explorer URL and an official Stellar Lab/explorer-related docs page.", weight: 3 }
nice_to_have:
  - { claim: "Warns that explorers display indexed/interpreted data and may lag or disagree on labels/badges.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim an explorer can prove custody, reverse a transaction, or recover funds.", weight: 5 }
  - { claim: "Do NOT mix Stellar transaction hashes/accounts with EVM explorer semantics.", weight: 4 }
must_cite:
  - "A live explorer URL."
  - "An official Stellar Lab or developer docs page describing transaction/contract inspection."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.expert"
  - "https://developers.stellar.org/docs/tools/lab/transaction-dashboard"
  - "https://developers.stellar.org/docs/tools/lab/smart-contracts/upload-deploy-contract"
  - "https://stellarchain.io"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified explorer home URLs and official Stellar Lab docs on 2026-06-29. Specific explorer UI fields can change; Phase 3 may screenshot current UI if it wants stricter UI-field claims."
---

## Reference answer (gospel)

Use StellarExpert first for a general public lookup: paste a transaction hash, account address (`G...`), muxed account (`M...`), contract address (`C...`), asset, or liquidity-pool id into `stellar.expert` and choose the correct network (https://stellar.expert). It is the practical answer for "what happened to this tx/account/contract?" because it indexes and labels the network for human inspection.

For transaction debugging, expect explorer views to show status/result, ledger/time, source account, operations, fee information, signatures, and metadata/events where applicable. For accounts/assets, expect balances, trustlines, offers, payments/trades, and related activity. For Soroban contracts, expect contract address pages and related wasm/instance/activity data when indexed.

Use Stellar Lab as the official developer companion. Its transaction dashboard is documented as showing transaction details including XDR, operations, results, metadata, and fee breakdown (https://developers.stellar.org/docs/tools/lab/transaction-dashboard). The Lab upload/deploy docs explicitly point users to check deployed contracts on blockchain explorers like Stellar.Expert or Lab's contract explorer after deployment (https://developers.stellar.org/docs/tools/lab/smart-contracts/upload-deploy-contract). StellarChain is a live alternate explorer to cross-check contract/explorer displays (https://stellarchain.io).

## Why these cards (routing rationale)

`scout_projects` is the expected card because this asks for a live ecosystem tool, not just a protocol fact. `stellar_docs_mcp` is also acceptable for the official Lab/debugging pages that explain what the developer tooling can inspect.

## Edge / traps

An explorer is an indexer/UI, not authority to reverse a transaction or adjudicate custody. A mismatch between explorers usually means indexing/labeling/UI lag or different feature coverage, not a different ledger result. Always match the network before deciding a hash or address is missing.
