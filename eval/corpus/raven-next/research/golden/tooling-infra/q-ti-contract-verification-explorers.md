---
id: q-ti-contract-verification-explorers
q: "Why do Stellar Lab and stellar.expert disagree on whether my contract's source is verified (what does release.yml do), what are the main explorers (StellarExpert vs StellarChain) and their 'verified' badges, and how do I make a Soroban/SAC token show up in xBull/ LOBSTR?"
category: tooling-infra
subcategory: developer-tooling
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [parallel_search, scout_projects, stellar_docs_mcp]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Explains the difference between contract metadata/spec availability and source/build verification: explorers can show a contract interface or metadata without proving reproducible source-to-wasm build verification.", weight: 5 }
  - { claim: "Cites SEP-55 (Contract Build Info, Draft) as the Stellar contract build-verification standard and distinguishes it from SEP-46 (Contract Meta, Active) and SEP-48 (Contract Interface Specification, Active).", weight: 5 }
  - { claim: "Explains that `release.yml` in this context is usually a project CI/GitHub release workflow used to publish artifacts/metadata that explorers or verifiers can consume; it is not itself a protocol guarantee.", weight: 4 }
  - { claim: "Names StellarExpert and StellarChain as live explorer surfaces and warns their verified badges may reflect different ingestion/verifier policies.", weight: 4 }
  - { claim: "For wallet visibility, says classic assets/SAC tokens need correct issuer/home-domain/stellar.toml/asset metadata and wallet/indexer ingestion; custom Soroban tokens need SEP-41/metadata/spec support and may require wallet-specific listing/indexing.", weight: 4 }
should_have:
  - { claim: "Mentions Stellar Lab's contract explorer can view/download contract specs but may not match third-party source-verified badges.", weight: 3 }
  - { claim: "Cites live explorer URLs and primary SEP/protocol docs.", weight: 3 }
nice_to_have:
  - { claim: "Mentions that SAC and custom SEP-41 tokens differ for wallet support because SAC wraps classic assets while custom token contracts rely more heavily on contract metadata/spec/indexing.", weight: 2 }
must_avoid:
  - { claim: "Do NOT say a Stellar Lab-readable interface automatically means the source code is verified.", weight: 5 }
  - { claim: "Do NOT promise xBull/LOBSTR listing solely from deployment of a contract.", weight: 5 }
  - { claim: "Do NOT conflate classic asset trustline metadata with custom Soroban token metadata.", weight: 4 }
must_cite:
  - "SEP-55 for build verification."
  - "Official Stellar docs for contract spec/metadata or Lab contract explorer."
  - "Live explorer URLs for explorer-specific claims."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md"
  - "https://developers.stellar.org/docs/build/guides/dapps/working-with-contract-specs"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0046.md"
  - "https://stellar.expert"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 verified via stellar/stellar-protocol ecosystem README: SEP-55 = 'Contract Build Info' (Status Draft), SEP-46 = 'Contract Meta' (Active), SEP-48 = 'Contract Interface Specification' (Active); SEP-41 = Soroban Token Interface (Draft). SEP/explorer URLs resolve. Exact current StellarExpert/StellarChain badge rules and xBull/LOBSTR listing policies remain accepted residual caveats (product-specific, not fully specified by primary protocol docs)."
---

## Reference answer (gospel)

Separate three things. First, contract metadata/spec: Stellar contracts can carry metadata (SEP-46 Contract Meta, Active) and an interface/spec (SEP-48 Contract Interface Specification, Active), and the docs say Stellar Lab's Contract Explorer can view/download a contract spec from wasm/contract info (https://developers.stellar.org/docs/build/guides/dapps/working-with-contract-specs). Second, source/build verification: SEP-55 (Contract Build Info, currently Draft) is the Stellar standard for contract build verification, i.e. proving a source/release build corresponds to deployed wasm (https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md). Third, explorer badges: StellarExpert and StellarChain are third-party explorer/indexer surfaces, so their "verified" labels can differ if one has ingested a release artifact/verifier result and the other has not.

`release.yml` is not magic protocol state. In most projects it is a GitHub Actions workflow that builds/releases wasm and related artifacts. It can support verification if it publishes reproducible build inputs/outputs that a SEP-55 verifier or explorer consumes, but the workflow file alone does not prove the deployed contract source.

For wallet visibility, SAC tokens and custom Soroban tokens differ. A SAC token represents a classic Stellar asset, so wallet display depends heavily on classic issuer identity, home domain, `stellar.toml`, asset metadata, and the wallet/indexer's asset-listing policy. A custom Soroban token should implement expected token interfaces/metadata/specs, but wallets may still need indexing/listing support before showing it like a familiar asset. Do not promise that deployment alone makes it appear in xBull or LOBSTR.

## Why these cards (routing rationale)

`scout_research` is expected because this is ecosystem-tool behavior across explorers and wallets. `stellar_docs_mcp` is acceptable and useful for the official contract-spec and SEP evidence.

## Edge / traps

The trap is equating "Lab can read my contract interface" with "my source is verified." Another trap is assuming explorer badges are protocol-level truth; they are product/indexer decisions. Wallet listing is also not automatic for every deployed contract.
