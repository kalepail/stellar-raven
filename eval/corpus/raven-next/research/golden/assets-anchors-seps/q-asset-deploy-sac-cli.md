---
id: q-asset-deploy-sac-cli
q: "How do I deploy the Stellar Asset Contract for an existing classic asset so I can use it from Soroban?"
category: assets-anchors-seps
subcategory: sac-bridge
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "You deploy the asset's SAC via the Stellar CLI (e.g. stellar contract asset deploy) or SDK, not by writing a new token contract.", weight: 5 }
  - { claim: "The SAC contract ID is deterministically derived from the asset (CONTRACT_ID_FROM_ASSET); it represents the same classic asset.", weight: 4 }
should_have:
  - { claim: "After deployment the issuer is automatically the admin (controls mint/clawback/set_authorized).", weight: 2 }
  - { claim: "Mechanically it is an InvokeHostFunction with CREATE_CONTRACT host function.", weight: 2 }
nice_to_have:
  - { claim: "Notes XLM's SAC is also derivable the same way.", weight: 1 }
must_avoid:
  - { claim: "Do NOT instruct the user to write/deploy a brand-new ERC-20-style token contract instead of deploying the asset's SAC.", weight: 4 }
  - { claim: "Do NOT use a defunct command name (e.g. 'soroban token wrap' presented as the current canonical command without noting the current CLI).", weight: 2 }
must_cite:
  - "The SAC page or the 'deploy-stellar-asset-contract' CLI guide on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/cli/deploy-stellar-asset-contract
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "How-to. Dossier §2.3. Verified current CLI command: `stellar contract asset deploy --asset CODE:ISSUER`; id via `stellar contract id asset`. (Legacy `soroban lab token wrap` is superseded by the `stellar` CLI.)"
---

## Reference answer (gospel)

- You **deploy the asset's reserved built-in SAC** — you do **not** write a new token contract. Current Stellar CLI command [1]:
  `stellar contract asset deploy --source-account <ACCT> --network <NET> --asset USDC:GCYE...` (use `--asset native` for XLM, which already exists on testnet/mainnet).
- The SAC's contract ID is **deterministically derived from the asset** (`CONTRACT_ID_FROM_ASSET`); it represents the *same* classic asset, not a copy. Fetch it without deploying via `stellar contract id asset --asset CODE:ISSUER` [1][2].
- Anyone can deploy it (no authorization required); after deployment the **asset's issuer is automatically the admin** (controls `mint`/`clawback`/`set_authorized`) [2].
- Mechanically this is an **`InvokeHostFunction`** with the `CREATE_CONTRACT` host function [2].

## Why these cards (routing rationale)

CLI/SDK how-to → `stellar_docs_mcp` (the CLI guide). No general-web/deep-research.

## Edge / traps

Deploying a new ERC-20-style token contract instead of the asset's reserved SAC; or quoting the legacy `soroban lab token wrap` as the current command (it is the `stellar contract asset deploy` CLI now).
