---
id: q-sor-nft-mint-on-soroban
q: "How do I build/mint an NFT on Stellar — Soroban contract (OpenZeppelin non-fungible) vs classic single-unit asset + stellar.toml + SEP-39 Manage Data — including a buy-with-USDC flow (recipient ≠ payer), royalties, metadata, and listing the NFTs an account holds?"
category: soroban
subcategory: nft-patterns
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Presents two viable Stellar NFT patterns: Soroban/OpenZeppelin non-fungible contract for programmable NFTs, or classic single-unit asset plus metadata for maximum classic-wallet compatibility.", weight: 5 }
  - { claim: "For Soroban, cites OpenZeppelin non-fungible modules and extensions such as burnable, enumerable, consecutive, and royalties.", weight: 4 }
  - { claim: "For buy-with-USDC, explains a contract sale flow where payer authorizes USDC transfer/payment while minted NFT recipient can be a separate `Address` argument.", weight: 4 }
  - { claim: "Explains metadata/listing tradeoffs: contract events/enumerable extension/indexer for Soroban NFTs; stellar.toml/SEP-39-style Manage Data metadata and Horizon/indexers for classic assets.", weight: 4 }
should_have:
  - { claim: "Notes royalties are contract/application-enforced on Soroban or marketplace-enforced off-chain for classic assets; they are not automatic on every Stellar transfer unless encoded/enforced by the relevant system.", weight: 3 }
  - { claim: "Mentions trustlines/reserves for classic single-unit assets and contract storage/events for Soroban NFTs.", weight: 3 }
nice_to_have:
  - { claim: "Mentions OpenZeppelin sequential minting and enumerable examples as implementation references.", weight: 1 }
must_avoid:
  - { claim: "Do not claim Stellar has only one NFT standard or that all NFTs must be classic assets.", weight: 5 }
  - { claim: "Do not promise automatic protocol-level royalties on arbitrary secondary transfers.", weight: 5 }
  - { claim: "Do not require payer and recipient to be the same address if the contract API separates them and authorizes the payer.", weight: 4 }
must_cite:
  - "Official Stellar NFT/OpenZeppelin docs or OpenZeppelin stellar-contracts repo."
  - "Official payment/SAC docs for USDC/token transfer flow."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/smart-contracts/example-contracts/non-fungible-token"
  - "https://developers.stellar.org/docs/tools/openzeppelin-contracts"
  - "https://github.com/OpenZeppelin/stellar-contracts"
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0039.md"
  - "https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Phase 3 verified the classic branch against SEP-39. SEP-39 is Draft/informational best-practice guidance, not a mandatory NFT standard; keep answers framed as compatibility guidance."
---

## Reference answer (gospel)

Use a Soroban NFT contract when you need programmable minting, royalties, enumeration, custody, or sale logic. Stellar's official non-fungible token example uses OpenZeppelin Stellar Contracts, and the OpenZeppelin tooling page lists non-fungible modules/extensions including burnable, enumerable, consecutive batch minting, and royalties. Sources: https://developers.stellar.org/docs/build/smart-contracts/example-contracts/non-fungible-token and https://developers.stellar.org/docs/tools/openzeppelin-contracts.

Use a classic single-unit asset when you want maximum compatibility with classic Stellar asset tooling and wallets. SEP-39 is a draft informational recommendation for NFT interoperability on Stellar; it describes representing NFTs as Stellar assets, using SEP-1 `stellar.toml`, and optionally linking IPFS metadata through `ManageData` keys such as `ipfshash`. That path relies on asset issuance/distribution, trustlines/reserves, and metadata conventions rather than a programmable NFT contract. It is simpler for collectibles but weaker for contract-enforced royalties or custom sale logic. Source: https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0039.md.

A buy-with-USDC flow is a contract/API design problem: pass `payer`, `recipient`, `usdc_sac`, and NFT parameters separately. Require payer authorization for the USDC transfer or `transfer_from`, then mint/transfer the NFT to `recipient`. Stellar's payment guide distinguishes Stellar assets through SAC from contract-token payments and says asset-to-contract or contract-to-contract payments use the asset's contract. Source: https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments.

For listing holdings, a Soroban NFT should emit stable events and/or use OpenZeppelin enumerable support, then index contract events. A classic single-unit asset holder list comes from trustlines/balances through Horizon/Hubble/indexers. Royalties are not universal protocol magic: enforce them in the NFT sale contract/marketplace or use OpenZeppelin royalty extensions where your transfer/sale path honors them.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because official example contracts and payment docs answer the implementation split. `scout_repos` is acceptable to discover live NFT repos or OpenZeppelin examples, but the primary answer should cite developers.stellar.org and OpenZeppelin.

## Edge / traps

The trap is pretending "NFT on Stellar" means exactly one thing. Classic assets and Soroban NFTs have different indexing, metadata, and enforcement properties. SEP-39 should be cited as draft interoperability guidance, not as a mandatory protocol-level NFT standard. Another trap is promising royalties for transfers that bypass the contract/marketplace path that enforces them.
