---
id: q-ti-stellar-lab-usage-and-new-ui
q: "Walk me through using the current Stellar Lab to fund/build/ sign/submit (fetch sequence number, where the submit button / Add Operation / Add Trustline / public- network option moved in the new UI, sign with Freighter or hardware), create a SAC, and use it offline."
category: tooling-infra
subcategory: developer-tooling
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Anchors on the current 'all-new' Stellar Lab UI (relaunched 2024) and walks the operator through it, rather than just asserting the tool exists.", weight: 4 }
  - { claim: "Describes the transaction-builder flow step-by-step: choose the network, enter source account, fetch next sequence number, add operation such as Change Trust/Add Trustline, then sign (Freighter/hardware) and submit.", weight: 5 }
  - { claim: "Correctly says Friendbot funding is for Testnet/Futurenet, not Mainnet, and that Lab can add Testnet USDC/EURC trustlines.", weight: 4 }
  - { claim: "Mentions custom/local network configuration for Quickstart via Lab's Custom network dropdown with RPC/Horizon/passphrase values.", weight: 3 }
  - { claim: "For SAC work, points to Lab's contract deployment/invocation features or the CLI/SDK `createStellarAssetContract`/`stellar contract id asset --asset native` flow rather than inventing an ERC-20 deployment path.", weight: 4 }
should_have:
  - { claim: "Mentions Saved Keypairs/Transactions as the safe Lab-local workflow for offline-ish signing or later submission, while warning not to paste production secrets into untrusted contexts.", weight: 2 }
  - { claim: "Cites the 2024 all-new Lab announcement or current Lab docs for UI freshness.", weight: 2 }
nice_to_have:
  - { claim: "Notes exact button positions may drift and a dated source or current UI inspection is preferred.", weight: 1 }
must_avoid:
  - { claim: "Do NOT freeze exact UI positions without a current source or screenshot.", weight: 5 }
  - { claim: "Do NOT say Mainnet can be funded by Friendbot.", weight: 5 }
  - { claim: "Do NOT equate a Stellar Asset Contract with an independent ERC-20-style token deployment.", weight: 4 }
must_cite:
  - "Current Stellar Lab docs."
  - "A Lab/Friendbot/Testnet docs page when explaining funding/trustlines."
  - "SAC/contract deployment docs or CLI help when discussing SAC creation."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/lab
  - https://stellar.org/blog/developers/introducing-the-all-new-stellar-lab
  - https://developers.stellar.org/docs/tools/quickstart/getting-started/connect-stellar-lab
  - https://developers.stellar.org/docs/build/guides/conventions/deploy-sac-with-code
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 differentiation: this file owns the step-by-step new-UI WORKFLOW lane (fetch sequence, Add Operation/Add Trustline button locations, sign with Freighter/hardware, SAC, offline); the bare existence/capabilities answer is owned by q-tool-lab-what-is — reframed must_have #1 from a duplicate 'identify the tool + capabilities' claim to a current-UI walkthrough anchor. Fresh UI wording can drift; verified with current docs search, not a browser screenshot of Lab."
---

## Reference answer (gospel)

Use the current [Stellar Lab](https://developers.stellar.org/docs/tools/lab) as the official browser surface: it creates accounts on Mainnet/Testnet/Futurenet, funds Testnet/Futurenet through Friendbot, adds Testnet USDC/EURC trustlines, deploys/invokes contracts, submits/simulates transactions, and converts XDR to JSON. The "all-new Lab" was announced as the all-in-one tool for building, signing, simulating, submitting transactions, and interacting with contracts [announcement](https://stellar.org/blog/developers/introducing-the-all-new-stellar-lab).

For a classic transaction: select the target network, open Transaction Builder, enter the source account, click "Fetch next sequence number", use Add Operation (for example Change Trust/Add Trustline), then sign and submit. The x402 quickstart documents this exact Lab trustline flow for Testnet USDC, including "Fetch next sequence number" and "Add Operation -> Change Trust" [x402 quickstart](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide). For local Quickstart, choose Custom network in Lab and enter `http://localhost:8000/rpc`, `http://localhost:8000`, and `Standalone Network ; February 2017` [Quickstart + Lab](https://developers.stellar.org/docs/tools/quickstart/getting-started/connect-stellar-lab).

For SACs, do not describe an ERC-20 deployment. Lab can deploy/invoke contracts; in code/CLI, SAC creation uses Stellar Asset Contract mechanics such as `createStellarAssetContract` or `stellar contract id asset --asset native`/`--asset CODE:G...` [deploy SAC with code](https://developers.stellar.org/docs/build/guides/conventions/deploy-sac-with-code). Use Saved Keypairs/Transactions for repeat workflows, but avoid entering production secrets into browser tooling unless that is your deliberate security model.

## Why these cards (routing rationale)

`stellar_docs_mcp` is the right route because this is a current official-tool workflow. `parallel_search` may be used to check a dated UI announcement or current page if docs snippets are insufficient, and `scout_research` can locate developer meeting/context, but official Lab docs should govern.

## Edge / traps

The trap is giving stale UI button coordinates or treating Friendbot as a Mainnet funder. Another trap is using EVM token language for SACs. A robust answer describes the durable workflow and warns that exact UI placement may move.
