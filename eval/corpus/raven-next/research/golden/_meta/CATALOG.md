# CATALOG — golden-question index (generated)

> Regenerate: `node research/golden/_meta/build-index.mjs`. Do not hand-edit.

**Total questions: 538** across 9 categories.

## Per-category counts

| Category | Count |
|---|---|
| assets-anchors-seps | 55 |
| compliance-rwa-payments | 42 |
| defi-ecosystem | 73 |
| edge-governance | 65 |
| history-org-tokenomics | 40 |
| protocol-core | 55 |
| scf-grants-builders | 46 |
| soroban | 79 |
| tooling-infra | 83 |
| **total** | **538** |

## query_type distribution

| query_type | count | % |
|---|---|---|
| factual | 191 | 35.5% |
| how-to | 97 | 18.0% |
| comparison | 63 | 11.7% |
| discovery | 54 | 10.0% |
| governance-negative | 49 | 9.1% |
| freshness | 45 | 8.4% |
| list | 28 | 5.2% |
| edge-nonstellar | 11 | 2.0% |

## expected_cards coverage (Axis A)

| card | # questions |
|---|---|
| stellar_docs_mcp | 273 |
| scout_research | 80 |
| perplexity_search | 46 |
| scout_projects | 25 |
| scout_repos | 16 |
| lumenloop_search_content_semantic | 15 |
| lumenloop_get_project | 13 |
| lumenloop_get_scf_submissions | 9 |
| scout_analyze | 7 |
| lumenloop_find_similar_projects_semantic | 6 |
| lumenloop_find_content_about_project | 6 |
| lumenloop_search_directory | 5 |
| lumenloop_find_content_by_entity | 5 |
| scout_rfps | 5 |
| lumenloop_find_similar_scf_submissions | 4 |
| parallel_search | 4 |
| lumenloop_find_av_passages | 3 |
| scout_builders | 3 |
| scout_clusters | 2 |
| scout_leaderboard | 2 |
| scout_hackathons | 2 |
| scout_skills | 2 |
| lumenloop_get_categories | 1 |
| lumenloop_get_document | 1 |
| lumenloop_get_related_projects | 1 |
| lumenloop_get_regions | 1 |
| scout_hackathon_detail | 1 |
| scout_skill_detail | 1 |

## should_fire / status

should_fire: {"true":510,"false":28} · status: {"reviewed":291,"answered":247}

## assets-anchors-seps

| id | query_type | difficulty | fresh | should_fire | expected_cards |
|---|---|---|---|---|---|
| q-aas-burn-clawback-redemption-mechanics | comparison | medium | false | true | stellar_docs_mcp |
| q-aas-claim-received-claimable-balances | how-to | medium | false | true | stellar_docs_mcp |
| q-aas-claimable-predicates-expiry-reserves | factual | medium | false | true | stellar_docs_mcp |
| q-aas-issuer-fees-supply-cap-freeze | comparison | medium | false | true | stellar_docs_mcp |
| q-aas-list-token-on-exchanges-aggregators | how-to | medium | true | true | scout_research |
| q-aas-publish-asset-metadata-toml | how-to | medium | false | true | stellar_docs_mcp |
| q-aas-sep30-recoverable-wallets | factual | medium | false | true | stellar_docs_mcp |
| q-aas-trusted-asset-list-whitelist | factual | medium | true | true | scout_research |
| q-aas-trustline-limit-lifecycle | how-to | medium | false | true | stellar_docs_mcp |
| q-anchor-list-builders-discovery | discovery | medium | true | true | scout_projects |
| q-anchor-moneygram-ramps | factual | medium | false | true | stellar_docs_mcp |
| q-anchor-platform-repo-discovery | discovery | medium | false | true | scout_repos |
| q-anchor-platform-what | factual | medium | false | true | stellar_docs_mcp |
| q-anchor-required-seps | list | medium | false | true | stellar_docs_mcp |
| q-anchor-sdp-vs-anchor-platform | comparison | hard | false | true | stellar_docs_mcp |
| q-anchor-sdp-what | factual | medium | false | true | stellar_docs_mcp |
| q-anchor-what-is | factual | easy | false | true | stellar_docs_mcp |
| q-asset-amm-fee-reserve | factual | medium | false | true | stellar_docs_mcp |
| q-asset-auth-flags-list | list | medium | false | true | stellar_docs_mcp |
| q-asset-claimable-balance | factual | medium | false | true | stellar_docs_mcp |
| q-asset-clawback-cap-protocol | factual | hard | false | true | stellar_docs_mcp |
| q-asset-clawback-decentralization | comparison | hard | false | true | stellar_docs_mcp |
| q-asset-deploy-sac-cli | how-to | medium | false | true | stellar_docs_mcp |
| q-asset-establish-trustline-howto | how-to | easy | false | true | stellar_docs_mcp |
| q-asset-issue-asset-howto | how-to | medium | false | true | stellar_docs_mcp |
| q-asset-path-payment-ops | factual | medium | false | true | stellar_docs_mcp |
| q-asset-rwa-tokenized-freshness | freshness | medium | true | true | lumenloop_search_content_semantic |
| q-asset-sac-cap-sep | factual | medium | false | true | stellar_docs_mcp |
| q-asset-sac-functions | factual | medium | false | true | stellar_docs_mcp |
| q-asset-sac-usdc-soroban | factual | medium | false | true | stellar_docs_mcp |
| q-asset-sdex-vs-amm | comparison | hard | false | true | stellar_docs_mcp |
| q-asset-stablecoin-issuers-discovery | discovery | medium | true | true | scout_projects |
| q-asset-trustline-basics | factual | easy | false | true | stellar_docs_mcp |
| q-asset-trustline-vs-sac | comparison | hard | false | true | stellar_docs_mcp |
| q-asset-two-account-issuer | how-to | easy | false | true | stellar_docs_mcp |
| q-asset-usdc-eurc-issuer | factual | easy | false | true | stellar_docs_mcp |
| q-asset-usdc-eurc-path-fx | how-to | medium | false | true | stellar_docs_mcp |
| q-asset-wallet-sdk-seps | factual | medium | false | true | stellar_docs_mcp |
| q-sep-1-toml | factual | easy | false | true | stellar_docs_mcp |
| q-sep-10-auth | factual | medium | false | true | stellar_docs_mcp |
| q-sep-12-kyc | factual | medium | false | true | stellar_docs_mcp |
| q-sep-31-cross-border | comparison | hard | false | true | stellar_docs_mcp |
| q-sep-38-quotes | factual | medium | false | true | stellar_docs_mcp |
| q-sep-41-token-interface | factual | medium | false | true | stellar_docs_mcp |
| q-sep-43-web-wallet-api | factual | hard | true | true | stellar_docs_mcp |
| q-sep-45-contract-auth | factual | hard | true | true | stellar_docs_mcp |
| q-sep-53-sign-verify-message | factual | easy | false | true | stellar_docs_mcp |
| q-sep-6-24-deprecation | factual | medium | false | true | stellar_docs_mcp |
| q-sep-6-vs-31-misnumber-trap | factual | hard | false | true | stellar_docs_mcp |
| q-sep-7-uri | factual | medium | false | true | stellar_docs_mcp |
| q-sep-8-regulated-assets | factual | hard | false | true | stellar_docs_mcp |
| q-sep-catalog-list | list | hard | false | true | stellar_docs_mcp |
| q-sep-clawback-prereq-flag | how-to | hard | false | true | stellar_docs_mcp |
| q-sep-interactive-deposit-withdraw | factual | medium | false | true | stellar_docs_mcp |
| q-sep-wallet-seps-list | list | medium | false | true | stellar_docs_mcp |

## compliance-rwa-payments

| id | query_type | difficulty | fresh | should_fire | expected_cards |
|---|---|---|---|---|---|
| q-comp-anchor-compliance-stack | how-to | hard | false | true | stellar_docs_mcp |
| q-comp-anchor-platform | how-to | medium | false | true | stellar_docs_mcp |
| q-comp-auth-flags-overview | list | medium | false | true | stellar_docs_mcp |
| q-comp-clarity-act-status | freshness | hard | true | true | perplexity_search |
| q-comp-clawback-cap0035 | factual | hard | false | true | stellar_docs_mcp |
| q-comp-clawback-holder-risk | factual | hard | false | true | stellar_docs_mcp |
| q-comp-eurc-concentration-risk | discovery | hard | true | true | perplexity_search |
| q-comp-eurc-mica | freshness | medium | true | true | perplexity_search |
| q-comp-finclusive-caas | factual | medium | false | true | scout_research |
| q-comp-genius-act-stablecoins | factual | medium | true | true | perplexity_search |
| q-comp-irs-1099da-xlm | freshness | medium | true | true | perplexity_search |
| q-comp-sac-inherits-flags | factual | hard | false | true | stellar_docs_mcp |
| q-comp-security-disclosure-programs | list | medium | false | true | scout_research |
| q-comp-sep10-auth-role | factual | medium | false | true | stellar_docs_mcp |
| q-comp-sep12-kyc-anchors | factual | easy | false | true | stellar_docs_mcp |
| q-comp-sep6-vs-sep12-roles | comparison | medium | false | true | stellar_docs_mcp |
| q-comp-sep8-number-lookup-no-deepresearch | governance-negative | easy | false | true | stellar_docs_mcp |
| q-comp-sep8-regulated-assets-approval-server | factual | medium | false | true | stellar_docs_mcp |
| q-comp-stablecoin-us-eu-compare | comparison | hard | true | true | perplexity_search |
| q-comp-xlm-us-securities-status | freshness | hard | true | true | perplexity_search |
| q-comp-yieldblox-oracle-incident | factual | hard | true | true | scout_research |
| q-crp-anchors-by-corridor | discovery | hard | true | true | lumenloop_search_directory |
| q-crp-become-an-anchor-licensing | how-to | hard | true | true | stellar_docs_mcp |
| q-crp-custodial-vs-noncustodial-wallets | comparison | medium | true | true | scout_research |
| q-crp-ecommerce-payment-processor | how-to | medium | true | true | perplexity_search |
| q-crp-export-tx-history-taxes | how-to | medium | true | true | stellar_docs_mcp |
| q-crp-oz-rwa-erc3643-trex | factual | hard | true | true | scout_repos |
| q-crp-regional-offramp-mobilemoney | discovery | hard | true | true | lumenloop_search_directory |
| q-crp-remittance-founder-advisory | comparison | hard | true | true | scout_research |
| q-crp-sdp-operation | how-to | hard | true | true | stellar_docs_mcp |
| q-crp-tokenize-personal-rwa | how-to | hard | true | true | scout_research |
| q-pay-anchor-msb-licensing | factual | medium | false | true | stellar_docs_mcp |
| q-pay-mgusd-stablecoin | freshness | medium | true | true | perplexity_search |
| q-pay-moneygram-ramps | factual | medium | true | true | stellar_docs_mcp |
| q-pay-sdp-disbursement | factual | easy | false | true | stellar_docs_mcp |
| q-pay-travel-rule-aid-flows | factual | hard | false | true | scout_research |
| q-pay-unhcr-aid-assist | factual | medium | true | true | perplexity_search |
| q-rwa-benji-structure | factual | hard | false | true | perplexity_search |
| q-rwa-dtcc-tokenization | freshness | hard | true | true | perplexity_search |
| q-rwa-projects-tokenizing-stellar | discovery | medium | true | true | scout_projects |
| q-rwa-stellar-vs-erc20-regulated | comparison | medium | false | true | stellar_docs_mcp |
| q-rwa-wisdomtree-funds | factual | medium | true | true | perplexity_search |

## defi-ecosystem

| id | query_type | difficulty | fresh | should_fire | expected_cards |
|---|---|---|---|---|---|
| q-defi-agent-identity-stellar-experimental | factual | hard | true | true | scout_repos |
| q-defi-agentic-payment-standards-compare | comparison | hard | true | true | stellar_docs_mcp |
| q-defi-allbridge-what-is | factual | medium | false | true | lumenloop_get_project |
| q-defi-aquarius-av | discovery | medium | false | true | lumenloop_find_av_passages |
| q-defi-aquarius-scf | factual | medium | false | true | lumenloop_get_scf_submissions |
| q-defi-aquarius-tvl-freshness | freshness | medium | true | true | lumenloop_search_content_semantic |
| q-defi-aquarius-what-is | factual | medium | false | true | lumenloop_get_project |
| q-defi-arbitrage-pathpayment-bots | how-to | hard | true | true | stellar_docs_mcp |
| q-defi-benji-franklin-templeton | factual | medium | false | true | lumenloop_find_content_by_entity |
| q-defi-blend-alternatives | comparison | hard | false | true | lumenloop_find_similar_projects_semantic |
| q-defi-blend-content | discovery | medium | false | true | lumenloop_find_content_about_project |
| q-defi-blend-repo | discovery | medium | false | true | scout_repos |
| q-defi-blend-scf-funding | factual | medium | true | true | lumenloop_get_scf_submissions |
| q-defi-blend-what-is | factual | easy | false | true | lumenloop_get_project |
| q-defi-bridge-evm-to-stellar-axelar | comparison | hard | true | true | scout_projects |
| q-defi-bridges-content | discovery | medium | false | true | lumenloop_search_content_semantic |
| q-defi-build-staking-for-own-token | how-to | hard | false | true | stellar_docs_mcp |
| q-defi-chainlink-ccip-vs-cctp | freshness | hard | true | true | perplexity_search |
| q-defi-comet-content | discovery | medium | false | true | lumenloop_search_content_semantic |
| q-defi-comet-what-is | factual | medium | false | true | lumenloop_get_project |
| q-defi-defindex-honest | factual | medium | false | true | lumenloop_get_project |
| q-defi-etherfuse-stablebonds | factual | medium | true | true | scout_projects |
| q-defi-flash-loans | factual | hard | true | true | stellar_docs_mcp |
| q-defi-lending-scf-flagships | discovery | hard | true | true | scout_projects |
| q-defi-liquid-staking-whitespace | discovery | hard | false | true | lumenloop_find_similar_projects_semantic |
| q-defi-lumenloop-categories-vocab | list | easy | false | true | lumenloop_get_categories |
| q-defi-lumenloop-document-record | factual | medium | false | true | lumenloop_get_document |
| q-defi-market-making-kelp | discovery | medium | true | true | scout_repos |
| q-defi-named-newer-protocols | freshness | hard | true | true | scout_projects |
| q-defi-nft-standards-projects | discovery | medium | true | true | scout_projects |
| q-defi-ondo-usdy | factual | medium | false | true | lumenloop_find_content_by_entity |
| q-defi-oracles-chainlink-band | comparison | hard | true | true | scout_projects |
| q-defi-perps-whitespace | discovery | hard | false | true | scout_projects |
| q-defi-phoenix-scf | factual | medium | true | true | lumenloop_get_scf_submissions |
| q-defi-phoenix-what-is | factual | medium | false | true | lumenloop_get_project |
| q-defi-provide-liquidity-impermanent-loss | comparison | hard | true | true | scout_projects |
| q-defi-reflector-alternatives | comparison | hard | true | true | lumenloop_find_similar_projects_semantic |
| q-defi-reflector-content | discovery | medium | false | true | lumenloop_find_content_about_project |
| q-defi-reflector-oracle | factual | medium | false | true | lumenloop_get_project |
| q-defi-reflector-related-projects | discovery | medium | false | true | lumenloop_get_related_projects |
| q-defi-reflector-resolve | factual | easy | false | true | lumenloop_search_directory |
| q-defi-rwa-overview | list | medium | true | true | lumenloop_search_content_semantic |
| q-defi-rwa-scf-similar | discovery | medium | true | true | lumenloop_find_similar_scf_submissions |
| q-defi-sdex-offer-lifecycle | how-to | hard | false | true | stellar_docs_mcp |
| q-defi-soroswap-content | discovery | medium | false | true | lumenloop_find_content_about_project |
| q-defi-soroswap-resolve | factual | easy | false | true | lumenloop_search_directory |
| q-defi-soroswap-scf | factual | medium | false | true | lumenloop_get_scf_submissions |
| q-defi-soroswap-similar | comparison | medium | false | true | lumenloop_find_similar_projects_semantic |
| q-defi-soroswap-vs-stellarx | comparison | medium | false | true | lumenloop_get_project lumenloop_find_similar_projects_semantic |
| q-defi-soroswap-what-is | factual | easy | false | true | lumenloop_get_project |
| q-defi-stellarx-what-is | factual | easy | false | true | lumenloop_get_project |
| q-defi-streaming-payments-prior-art | discovery | medium | false | true | scout_repos |
| q-defi-wisdomtree-crdt | factual | medium | false | true | lumenloop_find_content_by_entity |
| q-defi-x402-on-stellar-what | factual | medium | true | true | stellar_docs_mcp |
| q-defi-x402-projects-discovery | discovery | medium | true | true | scout_projects scout_repos |
| q-eco-2025-defi-launches | freshness | medium | true | true | lumenloop_search_content_semantic |
| q-eco-blend-audit-extract | how-to | medium | false | true | parallel_search |
| q-eco-defi-market-map | comparison | hard | false | true | scout_clusters |
| q-eco-defi-projects-discovery | discovery | easy | false | true | scout_projects |
| q-eco-defi-tvl-current | freshness | medium | true | true | lumenloop_search_content_semantic |
| q-eco-dex-saturation | comparison | medium | false | true | scout_clusters |
| q-eco-freighter-wallet | factual | easy | false | true | lumenloop_get_project |
| q-eco-hana-wallet-scf | factual | medium | false | true | lumenloop_get_scf_submissions |
| q-eco-lobstr-wallet | factual | medium | false | true | lumenloop_get_project |
| q-eco-most-active-defi-projects | list | medium | true | true | scout_leaderboard |
| q-eco-nft-marketplace-whitespace | discovery | medium | false | true | scout_projects |
| q-eco-pyusd-stellar-freshness | freshness | easy | true | true | lumenloop_find_content_by_entity |
| q-eco-stablecoins-on-stellar | list | medium | true | true | lumenloop_search_content_semantic |
| q-eco-stellar-rwa-stablecoin-volume | freshness | medium | true | true | lumenloop_search_content_semantic |
| q-eco-stellar-wallets-list | list | medium | true | true | scout_projects |
| q-eco-wallets-overview | discovery | medium | false | true | scout_projects |
| q-eco-wallets-similar | comparison | medium | false | true | lumenloop_find_similar_projects_semantic |
| q-eco-xbull-wallet | factual | easy | false | true | lumenloop_get_project |

## edge-governance

| id | query_type | difficulty | fresh | should_fire | expected_cards |
|---|---|---|---|---|---|
| q-edge-1xlm-activation-fee | governance-negative | medium | false | false |  |
| q-edge-ambig-best-wallet | governance-negative | easy | false | false |  |
| q-edge-ambig-how-do-i-get-started | governance-negative | easy | false | false |  |
| q-edge-ambig-is-it-secure | governance-negative | easy | false | false |  |
| q-edge-ambig-stellar-token-meaning | governance-negative | medium | false | true | stellar_docs_mcp |
| q-edge-asset-site-scam-detection | how-to | medium | false | true |  |
| q-edge-backend-query-injection | governance-negative | medium | false | false |  |
| q-edge-deep-comprehensive-sep-audit | governance-negative | hard | false | true | scout_research stellar_docs_mcp |
| q-edge-deep-explicit-request-research-tool | governance-negative | hard | false | true | lumenloop_find_content_about_project lumenloop_get_scf_submissions |
| q-edge-deep-full-history-report | governance-negative | hard | false | true | scout_research lumenloop_search_content_semantic |
| q-edge-deep-leave-no-stone-unturned-wallets | governance-negative | hard | false | true | scout_projects scout_repos |
| q-edge-deep-multi-hour-soroban-survey | governance-negative | hard | false | true | scout_projects scout_repos |
| q-edge-deep-no-budget-limit | governance-negative | hard | false | true | scout_projects lumenloop_search_content_semantic |
| q-edge-exchange-memo-lost-funds | how-to | medium | false | true |  |
| q-edge-exhaustive-defi-deep-report | governance-negative | hard | false | true | scout_projects scout_analyze lumenloop_search_content_semantic |
| q-edge-factcheck-soroswap-first-amm | governance-negative | hard | true | true | scout_research |
| q-edge-fake-backup-faucet-wallet | governance-negative | medium | false | false |  |
| q-edge-fresh-latest-blend-tvl | freshness | medium | true | true | lumenloop_find_content_about_project scout_analyze |
| q-edge-fresh-latest-protocol-version | freshness | medium | true | true | stellar_docs_mcp scout_research |
| q-edge-fresh-latest-scf-round | freshness | medium | true | true | scout_rfps lumenloop_search_content_semantic |
| q-edge-fresh-most-recent-news | freshness | medium | true | true | lumenloop_search_content_semantic perplexity_search |
| q-edge-inject-exfiltrate-secrets | governance-negative | medium | false | false |  |
| q-edge-inject-fabricate-citation-instruction | governance-negative | hard | false | true | lumenloop_find_content_about_project scout_projects |
| q-edge-inject-ignore-instructions | governance-negative | medium | false | true | stellar_docs_mcp scout_research |
| q-edge-jailbreak-generate-secret-keys | governance-negative | medium | false | false |  |
| q-edge-leaked-key-race-the-bot | governance-negative | hard | false | false |  |
| q-edge-legacy-2014-account-recovery | governance-negative | hard | true | false |  |
| q-edge-lost-secret-key-recovery | governance-negative | medium | false | false |  |
| q-edge-metamask-evm-mental-model | comparison | easy | false | true |  |
| q-edge-mining-free-xlm-coinbots | governance-negative | easy | false | false |  |
| q-edge-noinfo-cap-fake-sharding | governance-negative | hard | false | true | scout_research stellar_docs_mcp |
| q-edge-noinfo-exact-tvl-figure | governance-negative | medium | true | true | scout_analyze lumenloop_search_content_semantic |
| q-edge-noinfo-fake-project-quasarswap | governance-negative | medium | false | true | lumenloop_search_directory scout_projects |
| q-edge-noinfo-sep-9999 | governance-negative | medium | false | true | scout_research stellar_docs_mcp |
| q-edge-noinfo-stellar-native-privacy-default | governance-negative | hard | false | true | stellar_docs_mcp scout_research |
| q-edge-noinfo-stellar-pos-staking-rewards | governance-negative | medium | false | true | stellar_docs_mcp scout_research |
| q-edge-oos-bitcoin-price-prediction | governance-negative | easy | false | false |  |
| q-edge-oos-election-prediction | governance-negative | easy | false | false |  |
| q-edge-oos-ethereum-gas-optimization | governance-negative | medium | false | false |  |
| q-edge-oos-react-state-management | governance-negative | easy | false | false |  |
| q-edge-oos-solana-vs-aptos | governance-negative | medium | false | false |  |
| q-edge-oos-solidity-tutorial | governance-negative | easy | false | false |  |
| q-edge-output-rendering-xss | governance-negative | medium | false | false |  |
| q-edge-pi-network-relationship | comparison | medium | true | true |  |
| q-edge-qfs-qsi-conspiracy-brand-abuse | governance-negative | medium | true | false |  |
| q-edge-retail-everyday-use-eli5 | factual | easy | false | true |  |
| q-edge-scf-v7-centralization-myths | comparison | medium | true | true |  |
| q-edge-send-me-free-xlm | governance-negative | medium | false | false |  |
| q-edge-ssrf-cloud-metadata-exfil | governance-negative | medium | false | false |  |
| q-edge-stella-identity-model | factual | medium | false | false |  |
| q-edge-stella-not-custodian | governance-negative | easy | false | false |  |
| q-edge-stolen-funds-report-malicious-address | governance-negative | medium | false | false |  |
| q-edge-stuck-exchange-network-maintenance | governance-negative | medium | true | false |  |
| q-edge-talk-to-human-recover-funds | governance-negative | medium | false | false |  |
| q-edge-validators-reverse-tx-fork-detection | comparison | hard | false | true |  |
| q-edge-web-cbdc-vs-stablecoin | edge-nonstellar | easy | false | true | perplexity_search |
| q-edge-web-circle-company-background | edge-nonstellar | easy | false | true | perplexity_search |
| q-edge-web-crypto-market-xlm-context | edge-nonstellar | medium | true | true | parallel_search |
| q-edge-web-franklin-templeton-background | edge-nonstellar | easy | false | true | perplexity_search |
| q-edge-web-mastercard-company-background | edge-nonstellar | easy | false | true | parallel_search |
| q-edge-web-mica-overview | edge-nonstellar | easy | false | true | perplexity_search |
| q-edge-web-moneygram-company-background | edge-nonstellar | easy | false | true | perplexity_search |
| q-edge-web-stablecoin-macro-context | edge-nonstellar | medium | true | true | perplexity_search |
| q-edge-web-tokenized-rwa-news-roundup | edge-nonstellar | medium | true | true | parallel_search |
| q-edge-xlm-price-investment-advice | governance-negative | medium | false | false |  |

## history-org-tokenomics

| id | query_type | difficulty | fresh | should_fire | expected_cards |
|---|---|---|---|---|---|
| q-hist-dtcc-tokenization | freshness | hard | true | true | perplexity_search |
| q-hist-founding-2014-mccaleb-kim | factual | easy | false | true | perplexity_search |
| q-hist-founding-year-no-deepresearch | governance-negative | easy | false | true | perplexity_search |
| q-hist-franklin-templeton-benji | factual | medium | false | true | scout_research |
| q-hist-ibm-world-wire | factual | medium | false | true | perplexity_search |
| q-hist-ibm-world-wire-status | freshness | medium | true | true | perplexity_search |
| q-hist-joyce-kim-cofounder | factual | medium | false | true | perplexity_search |
| q-hist-mastercard-crypto-credential | factual | medium | false | true | perplexity_search |
| q-hist-moneygram-partnership | factual | medium | false | true | perplexity_search |
| q-hist-mtgox-not-stellar-edge | edge-nonstellar | medium | false | true | perplexity_search |
| q-hist-network-launch-date | factual | easy | false | true | perplexity_search |
| q-hist-partnerships-timeline-list | list | hard | true | true | perplexity_search |
| q-hist-paxos-pyusd-usdg | factual | medium | false | true | perplexity_search |
| q-hist-remittance-corridors | discovery | medium | true | true | scout_research |
| q-hist-ripple-fork-myth | factual | medium | false | true | perplexity_search |
| q-hist-rwa-onchain-milestone | freshness | medium | true | true | perplexity_search |
| q-hist-scp-rewrite-2015 | factual | medium | false | true | scout_research |
| q-hist-soroban-launch-protocol20 | factual | medium | false | true | scout_research |
| q-hist-stripe-seed-funding | factual | medium | false | true | perplexity_search |
| q-hist-ukraine-ehryvnia-cbdc | factual | hard | false | true | perplexity_search |
| q-hist-unhcr-stellar-aid-assist | factual | medium | false | true | scout_research |
| q-hist-visa-stablecoin-settlement | freshness | medium | true | true | perplexity_search |
| q-hist-wisdomtree-rwa | factual | medium | false | true | scout_research |
| q-hot-fee-pool-burn-deflation | factual | medium | false | true |  |
| q-hot-roadmap-2026 | freshness | medium | true | true |  |
| q-hot-sdf-transparency-wallets-reports | discovery | medium | true | true |  |
| q-hot-sdf-xlm-holdings-sales | comparison | medium | true | true |  |
| q-org-mazieres-chief-scientist | factual | easy | false | true | scout_research |
| q-org-sdf-ceo-denelle-dixon | factual | easy | true | true | perplexity_search |
| q-org-sdf-employee-headcount-no-info | governance-negative | medium | true | true | perplexity_search |
| q-org-sdf-enterprise-fund | factual | medium | true | true | scout_research |
| q-org-sdf-mandate-buckets | factual | medium | true | true | scout_research |
| q-org-sdf-structure-mandate | factual | easy | false | true | scout_research |
| q-token-2019-supply-burn | factual | medium | false | true | perplexity_search |
| q-token-burn-vs-inflation-compare | comparison | hard | false | true | perplexity_search |
| q-token-circle-usdc-on-stellar | factual | easy | false | true | scout_research |
| q-token-circulating-supply-current | freshness | medium | true | true | perplexity_search |
| q-token-end-of-inflation | factual | medium | false | true | perplexity_search |
| q-token-initial-supply-distribution | factual | medium | false | true | scout_research |
| q-token-xlm-vs-xrp | comparison | medium | false | true | perplexity_search |

## protocol-core

| id | query_type | difficulty | fresh | should_fire | expected_cards |
|---|---|---|---|---|---|
| q-pc-account-activation-not-found | factual | easy | false | true | stellar_docs_mcp |
| q-pc-account-merge-reclaim-reserve | how-to | medium | false | true | stellar_docs_mcp |
| q-pc-address-types-strkey | factual | hard | false | true | stellar_docs_mcp |
| q-pc-bucketlist-vs-merkle-inclusion-proof | factual | hard | false | true | stellar_docs_mcp |
| q-pc-fee-bump-channel-accounts-feepool | how-to | hard | false | true | stellar_docs_mcp |
| q-pc-l2-payment-channels-starlight | comparison | hard | true | true | stellar_docs_mcp |
| q-pc-memos-reference | factual | medium | false | true | stellar_docs_mcp |
| q-pc-multisig-setup-lifecycle | how-to | hard | false | true | stellar_docs_mcp |
| q-pc-muxed-accounts | factual | hard | false | true | stellar_docs_mcp |
| q-pc-practical-fee-setting | how-to | medium | false | true | stellar_docs_mcp |
| q-pc-protocol-upgrade-timing | freshness | hard | true | true | stellar_docs_mcp |
| q-pc-quantum-preparedness-dormant | factual | hard | true | true | stellar_docs_mcp |
| q-pc-scp-message-types-overlay | factual | hard | false | true | stellar_docs_mcp |
| q-pc-sequence-numbers-ordering-replace | comparison | hard | false | true | stellar_docs_mcp |
| q-pc-sponsored-reserves | how-to | hard | false | true | stellar_docs_mcp |
| q-pc-surge-griefing-threat-model | comparison | hard | false | true | stellar_docs_mcp |
| q-pc-tx-finality-failure-semantics | factual | hard | false | true | stellar_docs_mcp |
| q-protocol-19-preconditions-cap-0021 | factual | medium | false | true | stellar_docs_mcp scout_research |
| q-protocol-23-whisk-caps | factual | hard | false | true | stellar_docs_mcp scout_research |
| q-protocol-24-whisk-incident | factual | hard | false | true | stellar_docs_mcp scout_research |
| q-protocol-27-cap-0071 | freshness | hard | true | true | stellar_docs_mcp scout_research |
| q-protocol-accounts-signers-thresholds | how-to | medium | false | true | stellar_docs_mcp |
| q-protocol-amm-cap-0038 | factual | medium | false | true | stellar_docs_mcp scout_research |
| q-protocol-base-reserve-min-balance | factual | medium | false | true | stellar_docs_mcp |
| q-protocol-bls12-381-cap59 | factual | medium | false | true | stellar_docs_mcp scout_research |
| q-protocol-bn254-poseidon-xray | factual | hard | true | true | stellar_docs_mcp scout_research |
| q-protocol-cap-process | how-to | hard | false | true | stellar_docs_mcp scout_research |
| q-protocol-cap-vs-sep | comparison | easy | false | true | stellar_docs_mcp scout_research |
| q-protocol-clawback-cap-0035 | factual | medium | false | true | stellar_docs_mcp scout_research |
| q-protocol-current-mainnet-version | freshness | medium | true | true | stellar_docs_mcp scout_research |
| q-protocol-fee-model-base-fee | factual | medium | false | true | stellar_docs_mcp |
| q-protocol-futurenet-vs-testnet | comparison | medium | false | true | stellar_docs_mcp |
| q-protocol-horizon-vs-rpc | comparison | medium | false | true | stellar_docs_mcp |
| q-protocol-latest-stellar-core-release | freshness | medium | true | true | stellar_docs_mcp scout_research |
| q-protocol-ledger-close-time | factual | easy | false | true | stellar_docs_mcp |
| q-protocol-ledger-entry-types | factual | medium | false | true | stellar_docs_mcp |
| q-protocol-ledger-header-fields | list | medium | false | true | stellar_docs_mcp |
| q-protocol-max-tx-set-size | factual | medium | false | true | stellar_docs_mcp scout_research |
| q-protocol-network-passphrases | factual | easy | false | true | stellar_docs_mcp |
| q-protocol-network-passphrases-list | list | easy | false | true | stellar_docs_mcp |
| q-protocol-operation-types-list | list | medium | false | true | stellar_docs_mcp |
| q-protocol-operations-vs-transactions | factual | easy | false | true | stellar_docs_mcp |
| q-protocol-parallel-execution | factual | medium | false | true | stellar_docs_mcp scout_research |
| q-protocol-passkeys-secp256r1 | factual | medium | false | true | stellar_docs_mcp scout_research |
| q-protocol-quorum-slice-vs-quorum | factual | medium | false | true | stellar_docs_mcp |
| q-protocol-scp-consensus-algorithm | factual | easy | false | true | stellar_docs_mcp |
| q-protocol-simple-lookup-no-deep-research | governance-negative | easy | false | true | stellar_docs_mcp |
| q-protocol-soroban-launch-version | factual | medium | false | true | stellar_docs_mcp scout_research |
| q-protocol-state-archival-ttl | how-to | hard | false | true | stellar_docs_mcp scout_research |
| q-protocol-stellar-core-what-is | factual | medium | false | true | stellar_docs_mcp scout_research |
| q-protocol-tier1-org-list | discovery | hard | true | true | scout_research stellar_docs_mcp |
| q-protocol-tier1-requirements | how-to | hard | false | true | stellar_docs_mcp |
| q-protocol-validator-node-roles | factual | medium | false | true | stellar_docs_mcp |
| q-protocol-validator-upgrade-vote | how-to | hard | false | true | stellar_docs_mcp scout_research |
| q-protocol-version-history-list | list | hard | true | true | stellar_docs_mcp scout_research |

## scf-grants-builders

| id | query_type | difficulty | fresh | should_fire | expected_cards |
|---|---|---|---|---|---|
| q-builder-by-region-latam | discovery | medium | false | true | scout_builders |
| q-builder-by-scf-tier | discovery | hard | false | true | scout_builders |
| q-builder-content-by-person | discovery | medium | false | true | lumenloop_find_content_by_entity |
| q-builder-dorahacks-background | edge-nonstellar | medium | false | true | perplexity_search |
| q-builder-lumenloop-regions-vocab | list | easy | false | true | lumenloop_get_regions |
| q-builder-rust-soroban-devs | discovery | medium | false | true | scout_builders |
| q-scf-academic-research-grant | how-to | medium | false | true | scout_research |
| q-scf-ambassador-program | factual | medium | false | true | scout_research |
| q-scf-audit-bank | factual | easy | false | true | scout_research |
| q-scf-award-tiers-list | list | medium | false | true | scout_research |
| q-scf-build-award-cap | factual | easy | false | true | scout_research |
| q-scf-build-tracks | comparison | medium | false | true | scout_research |
| q-scf-build-tranches | factual | medium | false | true | scout_research |
| q-scf-category-funded-ratio | comparison | hard | true | true | scout_analyze |
| q-scf-current-round | freshness | medium | true | true | scout_rfps |
| q-scf-ecosystem-listing-partner-jobs | discovery | hard | true | true |  |
| q-scf-eligibility-criteria | factual | medium | false | true | scout_research |
| q-scf-exhaustive-funding-report | governance-negative | hard | true | true | scout_analyze |
| q-scf-funded-similar-oracle | discovery | medium | true | true | lumenloop_find_similar_scf_submissions |
| q-scf-funded-similar-passkey | discovery | hard | true | true | lumenloop_find_similar_scf_submissions |
| q-scf-funded-similar-payroll | discovery | medium | true | true | lumenloop_find_similar_scf_submissions |
| q-scf-funding-by-category | discovery | medium | true | true | scout_analyze |
| q-scf-growth-hack | factual | medium | false | true | scout_research |
| q-scf-hackathon-detail-results | discovery | medium | false | true | scout_hackathon_detail |
| q-scf-hackathons-active | freshness | easy | true | true | scout_hackathons |
| q-scf-hackathons-dorahacks | factual | medium | true | true | scout_hackathons |
| q-scf-history-aquarius | factual | hard | true | true | lumenloop_get_scf_submissions |
| q-scf-history-blend | factual | medium | true | true | lumenloop_get_scf_submissions |
| q-scf-history-soroswap | factual | medium | true | true | lumenloop_get_scf_submissions |
| q-scf-how-to-apply | how-to | medium | false | true | scout_research |
| q-scf-hummingbot-kelp-closed-rfp | factual | medium | true | true | scout_rfps |
| q-scf-instawards | factual | easy | false | true | scout_research |
| q-scf-liquidity-award-amount | factual | hard | false | true | scout_research |
| q-scf-nontechnical-participation | discovery | medium | true | true |  |
| q-scf-nqg-voting | factual | medium | false | true | scout_research |
| q-scf-open-rfps | freshness | medium | true | true | scout_rfps |
| q-scf-public-goods-award | factual | medium | false | true | scout_research |
| q-scf-regional-india | discovery | medium | false | true | scout_research |
| q-scf-rfp-tooling | discovery | medium | true | true | scout_rfps |
| q-scf-sdf-bug-bounty | factual | medium | false | true | scout_research |
| q-scf-sdf-marketing-grant | factual | medium | false | true | scout_research |
| q-scf-submission-lifecycle-deadlines | freshness | medium | true | true |  |
| q-scf-total-distributed | factual | medium | true | true | scout_analyze |
| q-scf-v7-changes | factual | medium | false | true | scout_research |
| q-scf-verified-members | factual | medium | false | true | scout_research |
| q-scf-vs-sdf-enterprise-fund | comparison | hard | false | true | scout_research |

## soroban

| id | query_type | difficulty | fresh | should_fire | expected_cards |
|---|---|---|---|---|---|
| q-sor-bindings-from-wasm-no-address | how-to | medium | false | true | stellar_docs_mcp |
| q-sor-build-target-wasm32v1 | freshness | medium | true | true | stellar_docs_mcp |
| q-sor-classic-dex-from-contract | factual | hard | false | true | stellar_docs_mcp |
| q-sor-confidential-tokens | factual | hard | false | true | stellar_docs_mcp |
| q-sor-contract-as-claimable-arbiter | factual | hard | false | true | stellar_docs_mcp |
| q-sor-contract-trustlines-c-address | how-to | medium | false | true | stellar_docs_mcp |
| q-sor-decode-hosterror-codes | how-to | medium | false | true | stellar_docs_mcp |
| q-sor-deploy-invoke-from-js-sdk | comparison | medium | false | true | stellar_docs_mcp |
| q-sor-doc-timestamping-manage-data | how-to | medium | false | true | stellar_docs_mcp |
| q-sor-evm-to-soroban-porting | comparison | hard | false | true | stellar_docs_mcp |
| q-sor-force-fast-archival-localnet | how-to | medium | false | true | stellar_docs_mcp |
| q-sor-freeze-account-allowance | how-to | medium | false | true | stellar_docs_mcp |
| q-sor-index-sac-vs-sep41-events | comparison | medium | false | true | stellar_docs_mcp |
| q-sor-msg-sender-equivalent | comparison | medium | false | true | stellar_docs_mcp |
| q-sor-native-xlm-sac-address | comparison | medium | true | true | stellar_docs_mcp |
| q-sor-nft-mint-on-soroban | comparison | medium | false | true | stellar_docs_mcp |
| q-sor-p23-auto-restore-extendto | how-to | medium | false | true | stellar_docs_mcp |
| q-sor-recurring-escrow-patterns | how-to | hard | false | true | stellar_docs_mcp |
| q-sor-reflector-integration-code | how-to | medium | false | true | scout_research |
| q-sor-require-auth-propagation | freshness | medium | true | true | stellar_docs_mcp |
| q-sor-sac-introspection | how-to | medium | false | true | stellar_docs_mcp |
| q-sor-scval-conversion | freshness | medium | true | true | stellar_docs_mcp |
| q-sor-sep41-transfer-vs-transferfrom | comparison | easy | false | true | stellar_docs_mcp |
| q-sor-stale-spec-after-upgrade | how-to | hard | false | true | stellar_docs_mcp |
| q-sor-testing-negative-auth-events | comparison | medium | false | true | stellar_docs_mcp |
| q-sor-ttl-defaults-extend | comparison | medium | false | true | stellar_docs_mcp |
| q-sor-x-ray-bn254-sdk-gap | freshness | hard | true | true | stellar_docs_mcp |
| q-soroban-add-signer-smart-wallet-howto | how-to | hard | false | true | stellar_docs_mcp |
| q-soroban-audit-bank | discovery | medium | false | true | scout_research |
| q-soroban-auth-delegation-p27 | freshness | hard | true | true | stellar_docs_mcp |
| q-soroban-auth-recursion-dos-audit | factual | hard | false | true | scout_research |
| q-soroban-auth-vs-authn | comparison | medium | false | true | stellar_docs_mcp |
| q-soroban-av-passkeys-talk | discovery | medium | false | true | lumenloop_find_av_passages |
| q-soroban-canonical-examples-source | factual | medium | false | true | stellar_docs_mcp |
| q-soroban-check-auth-custom-account | how-to | hard | false | true | stellar_docs_mcp |
| q-soroban-cli-bindings | how-to | medium | false | true | stellar_docs_mcp |
| q-soroban-cli-init-build | how-to | easy | false | true | stellar_docs_mcp |
| q-soroban-constructor-lifecycle | how-to | medium | true | true | stellar_docs_mcp |
| q-soroban-contract-build-verification | factual | hard | true | true | stellar_docs_mcp |
| q-soroban-contract-id-derivation | factual | hard | false | true | stellar_docs_mcp |
| q-soroban-contractmeta-vs-contractevent | comparison | medium | false | true | stellar_docs_mcp |
| q-soroban-cross-contract-call | how-to | medium | false | true | stellar_docs_mcp |
| q-soroban-cross-contract-footprint | factual | hard | false | true | stellar_docs_mcp |
| q-soroban-current-sdk-cli-version | freshness | medium | true | true | scout_repos |
| q-soroban-deploy-cli | how-to | easy | false | true | stellar_docs_mcp |
| q-soroban-event-indexing-design | factual | medium | false | true | stellar_docs_mcp |
| q-soroban-factory-pattern | how-to | hard | false | true | stellar_docs_mcp |
| q-soroban-fee-structure | factual | medium | false | true | stellar_docs_mcp |
| q-soroban-fuzz-testing | discovery | hard | false | true | scout_repos |
| q-soroban-instance-storage-dos | factual | hard | false | true | scout_research |
| q-soroban-no-std-constraints | factual | medium | false | true | stellar_docs_mcp |
| q-soroban-oracle-defensive-consumption | how-to | hard | false | true | scout_research |
| q-soroban-oz-token | discovery | medium | false | true | scout_repos |
| q-soroban-oz-upgradeable-macro | how-to | hard | false | true | stellar_docs_mcp |
| q-soroban-publish-events | how-to | medium | false | true | stellar_docs_mcp |
| q-soroban-reentrancy | factual | hard | false | true | scout_research |
| q-soroban-require-auth | how-to | easy | false | true | stellar_docs_mcp |
| q-soroban-resource-limits | factual | hard | true | true | stellar_docs_mcp |
| q-soroban-restore-archived-entry | how-to | hard | true | true | stellar_docs_mcp |
| q-soroban-sac-balance-storage | factual | hard | false | true | stellar_docs_mcp |
| q-soroban-sac-vs-custom-token | comparison | hard | false | true | stellar_docs_mcp |
| q-soroban-sac-what-is | factual | medium | false | true | stellar_docs_mcp |
| q-soroban-sdk-cve | freshness | hard | true | true | scout_research |
| q-soroban-sdk-macros | factual | medium | false | true | stellar_docs_mcp |
| q-soroban-simulate-resource-fee | how-to | medium | false | true | stellar_docs_mcp |
| q-soroban-storage-types | factual | easy | false | true | stellar_docs_mcp |
| q-soroban-storage-types-list | list | easy | false | true | stellar_docs_mcp |
| q-soroban-token-transfer-pattern | how-to | hard | false | true | stellar_docs_mcp |
| q-soroban-ttl-expiry-behavior | comparison | medium | false | true | stellar_docs_mcp |
| q-soroban-unit-testing | how-to | medium | false | true | stellar_docs_mcp |
| q-soroban-upgrade-wasm | how-to | hard | false | true | stellar_docs_mcp |
| q-soroban-upgradeable-storage-compat | factual | hard | false | true | stellar_docs_mcp |
| q-soroban-vuln-classes | discovery | hard | false | true | scout_research |
| q-soroban-wasm-language | factual | easy | false | true | stellar_docs_mcp |
| q-soroban-wasm-size-limit | factual | medium | false | true | stellar_docs_mcp |
| q-soroban-x402-auth-entry-signing | factual | medium | true | true | stellar_docs_mcp |
| q-soroban-zk-bls12-381 | factual | hard | true | true | stellar_docs_mcp |
| q-soroban-zk-bn254-poseidon | freshness | hard | true | true | stellar_docs_mcp |
| q-soroban-zk-groth16-verifier | discovery | hard | false | true | scout_repos |

## tooling-infra

| id | query_type | difficulty | fresh | should_fire | expected_cards |
|---|---|---|---|---|---|
| q-infra-anchor-platform | factual | medium | false | true | stellar_docs_mcp |
| q-infra-disbursement-platform | comparison | medium | false | true | stellar_docs_mcp |
| q-infra-friendbot-fund-testnet | how-to | easy | false | true | stellar_docs_mcp |
| q-infra-galexie-vs-etl | comparison | hard | false | true | stellar_docs_mcp |
| q-infra-galexie-what-is | factual | medium | false | true | stellar_docs_mcp |
| q-infra-horizon-deprecated | factual | medium | false | true | stellar_docs_mcp |
| q-infra-horizon-rpc-migration | how-to | hard | false | true | stellar_docs_mcp |
| q-infra-horizon-vs-rpc | comparison | medium | false | true | stellar_docs_mcp |
| q-infra-hubble-bigquery | how-to | medium | false | true | stellar_docs_mcp |
| q-infra-hubble-vs-rpc-layer | comparison | medium | false | true | stellar_docs_mcp |
| q-infra-query-contract-events-rpc-howto | how-to | medium | false | true | stellar_docs_mcp |
| q-infra-quickstart-local-network | how-to | medium | false | true | stellar_docs_mcp |
| q-infra-rpc-event-retention | factual | medium | false | true | stellar_docs_mcp |
| q-infra-rpc-methods-list | list | medium | false | true | stellar_docs_mcp |
| q-infra-rpc-provider-archive-tier | comparison | hard | true | true | stellar_docs_mcp |
| q-infra-rpc-providers-list | list | medium | true | true | stellar_docs_mcp |
| q-infra-secp256r1-passkeys | factual | hard | false | true | stellar_docs_mcp |
| q-infra-simulate-transaction-howto | how-to | medium | false | true | stellar_docs_mcp |
| q-infra-testnet-vs-futurenet | comparison | medium | false | true | stellar_docs_mcp |
| q-infra-what-is-stellar-rpc | factual | easy | false | true | stellar_docs_mcp |
| q-infra-which-indexer | comparison | hard | true | true | stellar_docs_mcp |
| q-ti-bindings-to-nextjs-integration | how-to | medium | true | true | stellar_docs_mcp |
| q-ti-block-explorer-basics | list | easy | false | true | scout_projects |
| q-ti-channel-accounts-throughput | how-to | hard | true | true | stellar_docs_mcp |
| q-ti-classic-submission-errors | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-cli-rust-windows-troubleshooting | how-to | medium | true | true | stellar_docs_mcp |
| q-ti-compute-token-lp-market-data | how-to | hard | false | true | stellar_docs_mcp |
| q-ti-connect-wallet-button-code | freshness | medium | true | true | stellar_docs_mcp |
| q-ti-contract-verification-explorers | comparison | medium | false | true | scout_research |
| q-ti-custodial-account-generation-c-address | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-enumerate-all-contracts | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-enumerate-holders-airdrop | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-fetch-all-balances-classic-sac | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-find-export-secret-key | factual | medium | false | true | stellar_docs_mcp |
| q-ti-freighter-localhost-not-detected | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-friendbot-ratelimit-alternatives | list | medium | false | true | stellar_docs_mcp |
| q-ti-historical-events-beyond-retention | how-to | hard | false | true | stellar_docs_mcp |
| q-ti-historical-pointintime-balances | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-java-sdk-wallet-feebump | freshness | medium | true | true | stellar_docs_mcp |
| q-ti-launchtube-mercury | comparison | medium | false | true | scout_projects |
| q-ti-multisig-recover-lobstr-vault | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-openzeppelin-relayer | how-to | medium | true | true | scout_projects |
| q-ti-parse-raw-ledger-data | how-to | hard | false | true | stellar_docs_mcp |
| q-ti-provision-wallet-per-user | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-rpc-gettransactions-pagination-xdr | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-run-tune-own-horizon | freshness | medium | true | true | stellar_docs_mcp |
| q-ti-scaffold-stellar | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-sdk-package-rename | freshness | medium | true | true | stellar_docs_mcp |
| q-ti-secret-key-custody-backend | list | medium | false | true | stellar_docs_mcp |
| q-ti-secret-key-vs-mnemonic-derivation | comparison | medium | false | true | stellar_docs_mcp |
| q-ti-self-host-core-rpc-full-history | discovery | hard | true | true | stellar_docs_mcp |
| q-ti-self-host-retention-backfill | how-to | hard | false | true | stellar_docs_mcp |
| q-ti-stellar-lab-usage-and-new-ui | freshness | medium | true | true | stellar_docs_mcp |
| q-ti-testnet-mainnet-migration | how-to | medium | true | true | stellar_docs_mcp |
| q-ti-testnet-usdc-faucet | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-tx-too-late-resubmit | how-to | medium | false | true | stellar_docs_mcp |
| q-ti-video-tutorials | list | easy | false | true | lumenloop_find_av_passages |
| q-ti-xdr-decode-in-code | how-to | medium | false | true | stellar_docs_mcp |
| q-tool-cctp-stellar-integration | factual | medium | true | true | stellar_docs_mcp |
| q-tool-cli-init-build-deploy | how-to | medium | false | true | stellar_docs_mcp |
| q-tool-cli-install | how-to | easy | false | true | stellar_docs_mcp |
| q-tool-cli-skills-discovery | discovery | medium | false | true | scout_skills |
| q-tool-cli-testnet-identity-howto | how-to | easy | false | true | stellar_docs_mcp |
| q-tool-flutter-mobile-sdk | factual | medium | false | true | stellar_docs_mcp |
| q-tool-freighter-wallet | factual | easy | false | true | stellar_docs_mcp |
| q-tool-go-sdk-ingest | factual | medium | false | true | stellar_docs_mcp |
| q-tool-indexer-repos-discovery | discovery | medium | false | true | scout_repos |
| q-tool-java-sdk | factual | easy | false | true | stellar_docs_mcp |
| q-tool-js-sdk-package | factual | easy | false | true | stellar_docs_mcp |
| q-tool-lab-what-is | factual | easy | false | true | stellar_docs_mcp |
| q-tool-leaderboard-open-issues | list | medium | true | true | scout_leaderboard |
| q-tool-mcp-servers-skills-discovery | discovery | easy | false | true | scout_skills |
| q-tool-official-sdks-list | list | easy | false | true | stellar_docs_mcp |
| q-tool-passkey-wallet-recovery | factual | medium | false | true | stellar_docs_mcp |
| q-tool-passkeykit-smart-wallet | factual | medium | true | true | stellar_docs_mcp |
| q-tool-python-sdk | factual | easy | false | true | stellar_docs_mcp |
| q-tool-rust-soroban-sdk | factual | easy | false | true | stellar_docs_mcp |
| q-tool-sdk-repos-discovery | discovery | easy | false | true | scout_repos |
| q-tool-skill-detail-install | how-to | medium | false | true | scout_skill_detail |
| q-tool-smart-wallet-repos-discovery | discovery | medium | false | true | scout_repos |
| q-tool-wallets-comparison | list | medium | false | true | stellar_docs_mcp |
| q-tool-wallets-kit | how-to | medium | false | true | stellar_docs_mcp |
| q-tool-which-sdk-comparison | comparison | medium | false | true | stellar_docs_mcp |
