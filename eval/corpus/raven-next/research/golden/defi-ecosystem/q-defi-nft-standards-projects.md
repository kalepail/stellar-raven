---
id: q-defi-nft-standards-projects
q: "How are NFTs represented on Stellar, how do they differ from classic assets or Ethereum NFTs, and which NFT projects exist beyond Litemint?"
category: defi-ecosystem
subcategory: nfts
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: true
freshness_horizon: quarterly

expected_cards: [scout_projects]
acceptable_cards: [stellar_docs_mcp, scout_research, lumenloop_find_similar_projects_semantic, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Explains Stellar NFTs can be represented through Stellar assets/Soroban contracts depending on standard/project design, and should not be assumed identical to Ethereum ERC-721/ERC-1155.", weight: 5 }
  - { claim: "Distinguishes classic-asset representation, Soroban NFT/contract patterns, metadata, and marketplace/project support.", weight: 4 }
  - { claim: "Names NFT projects or marketplaces only with current sourced evidence and does not stop at Litemint if other verified projects exist.", weight: 5 }
should_have:
  - { claim: "Mentions the category may be thinner than EVM NFT ecosystems and requires current discovery.", weight: 3 }
  - { claim: "Notes standards/status should be verified against current Stellar docs/SEPs or project repos.", weight: 3 }
nice_to_have:
  - { claim: "Mentions royalties/metadata support varies by project/contract.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim there are no NFT projects on Stellar if current Scout/project data shows examples.", weight: 5 }
  - { claim: "Do NOT call Stellar NFTs ERC-721 tokens unless discussing an explicit bridge/wrapper with sources.", weight: 5 }
must_cite:
  - "Stellar docs/standards for representation claims and dated Scout/project sources for named NFT projects."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0050.md"
  - "https://developers.stellar.org/docs/tokens/anatomy-of-an-asset"
  - "https://stellarlight.xyz/project/litemint"
  - "https://stellarlight.xyz/api/projects/search?q=NFT&limit=10"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Re-verified 2026-06-29: live Scout confirms Cyberbrawl (Live, on-chain TCG by Litemint), Token Tails (Live, play-to-save NFT game), QuillTip (Live, decentralized publishing) as real rows; roster carries verified+unverified mix so individual project/activity claims still need per-site checks (caveat gated). This file OWNS the STANDARDS-distinction + project-roster lane (how NFTs are represented vs ERC-721; which projects beyond Litemint) — DISTINCT from q-eco-nft-marketplace-whitespace (the integrate-decision: 'is there a mature marketplace I could integrate')."
---

## Reference answer (gospel)

Stellar NFT answers need to distinguish representation from ecosystem adoption. Historically, NFTs can be represented as Stellar assets with supply/issuer/metadata conventions, while Soroban enables contract-based NFTs and SEP-0050 tracks NFT standard work. Stellar/Soroban NFTs should not be described as ERC-721/ERC-1155 unless the answer is about a sourced bridge/wrapper.

Project discovery is not "only Litemint." Scout currently surfaces Litemint as a live Stellar NFT marketplace using Soroban contracts for royalties/auctions, plus NFT-related projects such as Cyberbrawl, Token Tails, QuillTip, Stellar Tools, Phoenix NFT marketplace code, and other game/loyalty/collectible projects. The category is thinner than EVM NFT ecosystems, and royalties/metadata/marketplace support vary by project.

## Why these cards (routing rationale)

`scout_projects` is expected for current project discovery. `stellar_docs_mcp` or primary SEP/GitHub sources are needed for standards and representation claims.

## Edge / traps

Do not say Stellar has no NFTs if Scout/project data shows live examples. Do not imply all Stellar NFTs share one mature ERC-style standard or marketplace behavior.
