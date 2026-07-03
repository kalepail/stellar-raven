# Prior-art review — kalepail/stellar-raven PR #11

## Source metadata

- **Source:** PR #11 "evals: adding 49 builder-sourced golden questions" from the old `stellar-raven`
  lineage.
- **Snapshot reviewed:** `_incoming/pr11-golden-questions.json`
- **Diff available:** `_incoming/pr11.diff`
- **Review scope:** Phase 1, questions only. PR rubrics/regex/semantic blocks are untrusted and ignored
  except where wording clarifies the question intent.
- **Current comparison base:** `_our-questions.txt`, **391** questions, confirmed 2026-06-23.
- **Prior review status:** the 2026-06-22 review was directionally useful but **does not stand as a
  current verdict**. Many items it marked NEW/NEAR have since been adopted into the 391-question
  battery, notably x402/MPP/AP2/ACP, agent identity, SEP-53, YieldBlox/Reflector, CCTP, passkey
  recovery, Etherfuse, recurring-payments prior art, contract-source verification, and defensive oracle
  consumption.

## Summary

- PR questions extracted: **49**
- **COVERED:** **41**
- **NEAR:** **8**
- **NEW:** **0**

Bottom line: PR #11 no longer contributes a genuinely absent concept. It still exposes a few
builder-depth angles worth adversarial review, but all are adjacent to current questions rather than
new categories.

## Question-by-question table

| PR id | Verdict | Current covering ids / candidate note |
|---|---:|---|
| `protocol-trustline` | COVERED | `q-asset-trustline-basics`, `q-asset-establish-trustline-howto`, `q-asset-trustline-vs-sac` |
| `standards-anchor-deposit` | COVERED | `q-sep-interactive-deposit-withdraw`, `q-sep-10-auth`, `q-comp-sep10-auth-role`, `q-anchor-required-seps` |
| `zk-groth16` | COVERED | `q-soroban-zk-groth16-verifier`, `q-soroban-zk-bn254-poseidon`, `q-protocol-bn254-poseidon-xray`, `q-soroban-zk-bls12-381` |
| `soroban-counter` | COVERED | Pure code-gen is out of scope; covered by the current reframe `q-soroban-canonical-examples-source` plus storage/testing examples. |
| `setup-scaffold-contract` | COVERED | `q-soroban-cli-init-build`, `q-tool-cli-init-build-deploy`, `q-soroban-oz-token`, `q-soroban-canonical-examples-source` |
| `official-docs-current-contract-scaffold` | COVERED | `q-soroban-cli-init-build`, `q-tool-cli-init-build-deploy`, `q-soroban-deploy-cli` |
| `dapp-freighter` | COVERED | Code-gen reframe covered by `q-soroban-canonical-examples-source`; wallet context by `q-tool-freighter-wallet`, `q-tool-wallets-kit`. |
| `data-rpc-vs-horizon` | COVERED | `q-infra-horizon-vs-rpc`, `q-protocol-horizon-vs-rpc`, `q-infra-query-contract-events-rpc-howto`, `q-infra-rpc-event-retention` |
| `data-storage-ttl` | COVERED | `q-protocol-state-archival-ttl`, `q-soroban-ttl-expiry-behavior`, `q-soroban-storage-types`, `q-soroban-restore-archived-entry` |
| `assets-sac-usdc` | COVERED | `q-asset-sac-usdc-soroban`, `q-asset-sac-cap-sep`, `q-soroban-sac-what-is`, `q-comp-sac-inherits-flags` |
| `assets-sac-vs-openzeppelin-contract-token` | COVERED | `q-soroban-sac-vs-custom-token`, `q-assets-sac-vs-openzeppelin-contract-token` equivalent coverage via `q-asset-trustline-vs-sac`, `q-soroban-oz-token` |
| `standards-sep41-interface-not-sac` | COVERED | `q-sep-41-token-interface`, `q-asset-sac-cap-sep`, `q-soroban-sac-vs-custom-token` |
| `standards-contract-source-verification` | COVERED | `q-soroban-contract-build-verification` |
| `dapp-passkey-smart-account` | COVERED | `q-tool-passkeykit-smart-wallet`, `q-infra-secp256r1-passkeys`, `q-soroban-check-auth-custom-account`, `q-tool-passkey-wallet-recovery` |
| `agentic-payments-x402` | COVERED | `q-defi-x402-on-stellar-what`, `q-soroban-x402-auth-entry-signing`, `q-defi-x402-projects-discovery` |
| `ecosystem-index-freshness` | COVERED | `q-eco-defi-market-map`, `q-scf-funding-by-category`, `q-tool-leaderboard-open-issues`; current battery already tests freshness/caveat behavior around live indexes. |
| `wallet-infra-landscape` | COVERED | `q-eco-wallets-overview`, `q-eco-stellar-wallets-list`, `q-tool-wallets-kit`, `q-tool-smart-wallet-repos-discovery` |
| `rfps-and-hackathons` | COVERED | `q-scf-open-rfps`, `q-scf-rfp-tooling`, `q-scf-hackathons-active`, `q-scf-hackathons-dorahacks` |
| `active-zk-hackathon` | COVERED | `q-scf-hackathons-active`, `q-scf-hackathons-dorahacks`; specific active-event names are freshness-sensitive. |
| `open-rfp-contract-source-verification` | COVERED | `q-soroban-contract-build-verification`, `q-scf-open-rfps`, `q-scf-rfp-tooling` |
| `compare-current-hackathons` | COVERED | Skip as a weak/dormant-card shape; current hackathon coverage forbids `scout_hackathon_compare` and covers active/detail lookups via `q-scf-hackathons-active`, `q-scf-hackathon-detail-results`. |
| `ecosystem-category-whitespace` | COVERED | `q-eco-defi-market-map`, `q-eco-dex-saturation`, `q-scf-funding-by-category`, `q-defi-perps-whitespace` |
| `ecosystem-project-dossier-soroswap` | COVERED | `q-defi-soroswap-resolve`, `q-defi-soroswap-what-is`, `q-defi-soroswap-scf` |
| `ecosystem-content-about-soroswap` | COVERED | `q-defi-soroswap-content`, `q-defi-soroswap-vs-stellarx`, `q-edge-factcheck-soroswap-first-amm` |
| `ecosystem-taxonomy-dispatch` | COVERED | `q-defi-lumenloop-categories-vocab`, `q-eco-defi-market-map`, `q-scf-funding-by-category` |
| `developer-activity-leaderboard` | COVERED | `q-tool-leaderboard-open-issues`, `q-eco-most-active-defi-projects` |
| `prior-art-streaming-payments` | COVERED | `q-defi-streaming-payments-prior-art` |
| `content-audit-soroswap` | COVERED | `q-edge-factcheck-soroswap-first-amm` |
| `content-audit-openzeppelin-stellar` | COVERED | `q-soroban-oz-token`, `q-tool-smart-wallet-repos-discovery` |
| `web-extract-openzeppelin-primary` | COVERED | `q-soroban-oz-token`, `q-soroban-canonical-examples-source` |
| `perplexity-research-protocol-25-zk` | COVERED | `q-protocol-bn254-poseidon-xray`, `q-soroban-zk-bn254-poseidon` |
| `prior-art-similar-and-builders` | COVERED | `q-defi-soroswap-similar`, `q-builder-by-region-latam`, `q-scf-funded-similar-payroll`, `q-eco-defi-projects-discovery` |
| `ecosystem-cluster-and-rollup` | COVERED | `q-eco-defi-market-map`, `q-scf-funding-by-category`, `q-scf-exhaustive-funding-report` |
| `assets-issuance-flags` | COVERED | `q-asset-issue-asset-howto`, `q-asset-auth-flags-list`, `q-comp-auth-flags-overview`, `q-sep-clawback-prereq-flag` |
| `data-rpc-methods` | COVERED | `q-infra-rpc-methods-list`, `q-infra-query-contract-events-rpc-howto`, `q-infra-rpc-event-retention`, `q-infra-rpc-provider-archive-tier` |
| `zk-proving-systems-languages` | COVERED | `q-soroban-zk-groth16-verifier`, `q-soroban-zk-bn254-poseidon`, `q-protocol-bn254-poseidon-xray` |
| `poseidon-input-encoding-soroban` | COVERED | `q-soroban-zk-bn254-poseidon`; encoding detail is narrow and not worth a duplicate. |
| `confidential-tokens-state` | COVERED | `q-edge-noinfo-stellar-native-privacy-default`, `q-soroban-zk-groth16-verifier`, `q-defi-agent-identity-stellar-experimental` for honesty/maturity framing. |
| `zk-host-functions-cap-roadmap` | COVERED | `q-protocol-bn254-poseidon-xray`, `q-protocol-bls12-381-cap59`, `q-soroban-zk-bn254-poseidon`, `q-soroban-zk-bls12-381` |
| `zk-circuit-dev-workflow` | COVERED | `q-soroban-zk-groth16-verifier`, `q-soroban-zk-bn254-poseidon` |
| `noir-ultrahonk-status` | COVERED | `q-soroban-zk-groth16-verifier` already allows/grounds Noir/UltraHonk verifier discovery; low standalone value. |
| `privacy-pool-nullifier-storage` | COVERED | `q-soroban-instance-storage-dos`, `q-soroban-storage-types`, `q-protocol-state-archival-ttl` |
| `prior-art-zk-on-stellar` | COVERED | `q-soroban-zk-groth16-verifier`, `q-tool-smart-wallet-repos-discovery` style repo-discovery coverage |
| `prior-art-private-payments` | COVERED | `q-edge-noinfo-stellar-native-privacy-default`, `q-soroban-zk-groth16-verifier`; no duplicate until grounded mature private-payment code exists. |
| `stellar-zklogin-identity` | COVERED | `q-edge-noinfo-stellar-native-privacy-default`, `q-defi-agent-identity-stellar-experimental`; current honest-maturity framing is better than asserting zkLogin parity. |
| `x402-payment-verification-stellar` | COVERED | `q-defi-x402-on-stellar-what`, `q-soroban-x402-auth-entry-signing` cover facilitator verify/settle and Stellar auth-entry flow. |
| `agentic-payment-standard-choice` | COVERED | `q-defi-agentic-payment-standards-compare` |
| `agentic-mpp-discovery` | COVERED | `q-defi-agentic-payment-standards-compare`, `q-defi-x402-on-stellar-what`, `q-defi-x402-projects-discovery` |
| `agent-identity-reputation-8004` | COVERED | `q-defi-agent-identity-stellar-experimental` |
| `x402-mpp-analytics-dashboard` | COVERED | Weak/junk. Current `q-defi-x402-projects-discovery` covers real project/repo discovery; analytics-dashboard framing is not additive. |
| `passkey-smart-wallet-architecture` | COVERED | `q-soroban-check-auth-custom-account`, `q-infra-secp256r1-passkeys`, `q-tool-passkeykit-smart-wallet` |
| `smart-wallet-stack-oz-vs-passkeykit` | COVERED | `q-tool-passkeykit-smart-wallet`, `q-tool-smart-wallet-repos-discovery`, `q-soroban-oz-token` |
| `passkey-wallet-recovery` | COVERED | `q-tool-passkey-wallet-recovery` |
| `cctp-walletkit-integration` | COVERED | `q-tool-cctp-stellar-integration`, `q-tool-wallets-kit`; Wallets Kit module wording is not enough to justify a duplicate. |
| `cctp-usdc-stellar-crosschain` | COVERED | `q-tool-cctp-stellar-integration`, `q-token-circle-usdc-on-stellar` |
| `cctp-vs-intents-routing` | NEAR | Concept: CCTP vs intent/multi-route bridge selection; category `tooling-infra` or `defi-ecosystem`; cards `stellar_docs_mcp`, `perplexity_search`, `parallel_search`. Grounding: CCTP/Allbridge/Rozo are covered, but intent-routing comparison is not isolated. |
| `cross-chain-asset-swap-stellar` | COVERED | `q-defi-bridges-content`, `q-defi-allbridge-what-is`, `q-tool-cctp-stellar-integration` |
| `smart-wallet-fee-sponsorship-onboarding` | NEAR | Concept: gasless/sponsored onboarding for smart wallets receiving USDC without XLM/trustline-reserve friction; category `tooling-infra`; cards `stellar_docs_mcp`, `scout_repos`. Grounding: fee-bump, relayers, reserves, x402 sponsored fees exist, but no single current question tests onboarding design. |
| `passkey-wallet-constraints` | COVERED | `q-infra-secp256r1-passkeys`, `q-tool-passkeykit-smart-wallet`, `q-tool-passkey-wallet-recovery` |
| `recurring-subscriptions-stellar` | COVERED | `q-defi-streaming-payments-prior-art`, `q-defi-agentic-payment-standards-compare` |
| `private-fees-relayer` | COVERED | `q-protocol-fee-model-base-fee`, `q-tool-passkey-wallet-recovery`, `q-soroban-x402-auth-entry-signing`; privacy framing is not additive. |
| `rwa-tokenization-stellar` | COVERED | `q-asset-rwa-tokenized-freshness`, `q-rwa-projects-tokenizing-stellar`, `q-defi-rwa-overview`, `q-rwa-stellar-vs-erc20-regulated` |
| `etherfuse-stablebonds-integration` | COVERED | `q-defi-etherfuse-stablebonds` |
| `classic-soroban-asset-data-crossing` | COVERED | `q-asset-sac-usdc-soroban`, `q-asset-trustline-vs-sac`, `q-comp-sac-inherits-flags`, `q-soroban-sac-balance-storage` |
| `blend-yield-attribution` | NEAR | Concept: per-depositor share/yield accounting when many users route into one Blend position; category `defi-ecosystem`; cards `scout_repos`, `stellar_docs_mcp`. Grounding: Blend/DeFindex/yield-vault coverage exists, but this implementation/accounting pattern is not directly tested; reframe as pattern/source lookup, not code-gen. |
| `dex-aggregation-stellar` | COVERED | `q-defi-soroswap-what-is`, `q-eco-dex-saturation`, `q-defi-soroswap-vs-stellarx`, `q-asset-sdex-vs-amm` |
| `reflector-integration` | COVERED | `q-defi-reflector-oracle`, `q-defi-reflector-content`, `q-soroban-oracle-defensive-consumption` |
| `blend-risk-model-isolation-backstop` | NEAR | Concept: Blend pool isolation/backstop/shared-risk model; category `defi-ecosystem`; cards `lumenloop_find_content_about_project`, `scout_research`, `scout_repos`. Grounding: current Blend questions identify Blend and audits/incidents, but not its risk/backstop mechanics. |
| `blend-liquidation-keeper` | NEAR | Concept: Blend liquidation auctions and keeper/bot design; category `defi-ecosystem`; cards `scout_repos`, `scout_research`. Grounding: current battery covers Blend identity/audits/TVL but not liquidation keeper mechanics; reframe away from bot code generation. |
| `stellar-staking-yield-landscape` | COVERED | `q-defi-liquid-staking-whitespace`, `q-edge-noinfo-stellar-pos-staking-rewards`, `q-defi-blend-alternatives`, `q-defi-defindex-honest` |
| `rwa-collateral-liquidation-oracle` | COVERED | `q-soroban-oracle-defensive-consumption`, `q-comp-yieldblox-oracle-incident`, `q-defi-etherfuse-stablebonds` |
| `rwa-yield-private-credit-infra` | COVERED | Composite covered by `q-defi-rwa-overview`, `q-defi-wisdomtree-crdt`, `q-defi-etherfuse-stablebonds`, `q-defi-defindex-honest`, `q-soroban-oracle-defensive-consumption`; too broad to add as one question. |
| `anchor-discovery-integration` | COVERED | `q-anchor-list-builders-discovery`, `q-anchor-platform-repo-discovery`, `q-anchor-what-is`, `q-anchor-required-seps` |
| `sep24-vs-sep31-vs-sep6` | COVERED | `q-sep-interactive-deposit-withdraw`, `q-sep-6-24-deprecation`, `q-sep-31-cross-border`, `q-sep-6-vs-31-misnumber-trap` |
| `production-anchor-architecture` | COVERED | `q-comp-anchor-compliance-stack`, `q-anchor-platform-what`, `q-infra-anchor-platform`, `q-anchor-required-seps` |
| `sep53-sign-verify-message` | COVERED | `q-sep-53-sign-verify-message` |
| `zk-verification-resource-budget` | NEAR | Concept: ZK verification failure caused by Soroban resource budgets/localnet-vs-testnet limits; category `soroban`; cards `stellar_docs_mcp`, `scout_repos`. Grounding: current ZK and resource-limit questions cover the parts, but not this concrete intersection. |
| `soroban-storage-migration-upgrade` | COVERED | `q-soroban-upgradeable-storage-compat`, `q-soroban-upgrade-wasm`, `q-soroban-restore-archived-entry`, `q-soroban-oz-upgradeable-macro` |
| `policy-signers-scoped-auth` | NEAR | Concept: scoped policy signers for amount/time/role-limited authorization; category `soroban` or `tooling-infra`; cards `stellar_docs_mcp`, `scout_repos`. Grounding: current passkey/custom-account questions mention policy signers, but not scoped-auth design as the main question. |
| `oracle-manipulation-defense-soroban` | COVERED | `q-soroban-oracle-defensive-consumption`, `q-comp-yieldblox-oracle-incident` |
| `local-fast-ledger-testing` | NEAR | Concept: fast-forwarding/speeding local ledgers for time-dependent Soroban tests; category `tooling-infra`; cards `stellar_docs_mcp`, `scout_repos`. Grounding: Quickstart/local-network coverage exists, but not the time-travel/ledger-advance test workflow. |
| `why-stellar-differentiators` | COVERED | Soft/marketing. Covered enough by `q-hist-stellar-vs-ripple`, `q-rwa-stellar-vs-erc20-regulated`, ecosystem market-map questions; low eval value. |
| `stellar-defi-exploits-history` | COVERED | `q-comp-yieldblox-oracle-incident`, `q-soroban-oracle-defensive-consumption`, `q-comp-security-disclosure-programs` |
| `rwa-asset-discovery-dashboard` | COVERED | `q-rwa-projects-tokenizing-stellar`, `q-asset-rwa-tokenized-freshness`, `q-defi-rwa-overview`, `q-eco-stellar-rwa-stablecoin-volume` |

## NEAR candidates for adversarial review

| Candidate | Target category | Cards | Why it may still be additive | Sanity note |
|---|---|---|---|---|
| CCTP vs intent/multi-route bridge selection | `tooling-infra` or `defi-ecosystem` | `stellar_docs_mcp`, `perplexity_search`, `parallel_search` | Current CCTP and bridge questions do not isolate intent routing / route-selection tradeoffs. | Verify Near Intents/ROZO/Allbridge Next names and Stellar support before adopting. |
| Sponsored smart-wallet onboarding | `tooling-infra` | `stellar_docs_mcp`, `scout_repos` | Current questions cover reserves, fee-bumps, relayers, passkeys, and x402 sponsored fees separately, not the end-to-end onboarding friction. | Must avoid implying reserves/trustlines disappear; sponsorship/relayer support needs current docs. |
| Blend per-depositor yield attribution | `defi-ecosystem` | `scout_repos`, `stellar_docs_mcp` | Current battery covers Blend and DeFindex, but not share-accounting for many depositors behind one Blend position. | Reframe as "which pattern/repos/docs should a builder cite?", not "write the accounting code." |
| Blend risk/backstop mechanics | `defi-ecosystem` | `lumenloop_find_content_about_project`, `scout_research`, `scout_repos` | Current Blend questions are identity/content/audit/funding/TVL; risk/backstop mechanics remain under-tested. | Ground in Blend docs/audits; do not infer from generic money-market designs. |
| Blend liquidation keeper mechanics | `defi-ecosystem` | `scout_repos`, `scout_research` | Liquidation auctions/keeper operations are not directly covered. | Keep as evidence/pattern lookup; avoid bot code-gen. |
| ZK verification resource-budget failure | `soroban` | `stellar_docs_mcp`, `scout_repos` | Current ZK and resource-limit questions cover the pieces, not the localnet-unlimited vs testnet/mainnet failure mode. | Needs current Soroban resource-budget docs and verifier examples. |
| Scoped policy signers | `soroban` / `tooling-infra` | `stellar_docs_mcp`, `scout_repos` | Policy signers are mentioned in passkey recovery and smart-account questions, but scoped amount/time/RBAC authorization is not isolated. | Verify current smart-account-kit/passkey docs before writing rubric claims. |
| Fast-forward local ledgers for tests | `tooling-infra` | `stellar_docs_mcp`, `scout_repos` | Quickstart/local network is covered, but the specific time-dependent test workflow is not. | Confirm actual supported CLI/quickstart/testutils mechanism; do not invent a command. |

## Reviewer notes

- **Changed verdicts caused by the current battery:** the old review's 7 NEW items are now all COVERED
  (`q-defi-x402-on-stellar-what`, `q-defi-agentic-payment-standards-compare`,
  `q-defi-agent-identity-stellar-experimental`, `q-tool-passkey-wallet-recovery`,
  `q-comp-yieldblox-oracle-incident`, `q-sep-53-sign-verify-message`, etc.). Several old NEAR items
  are also now directly covered (`q-tool-cctp-stellar-integration`, `q-soroban-oracle-defensive-consumption`,
  `q-defi-etherfuse-stablebonds`, `q-defi-streaming-payments-prior-art`).
- **Schema/rubric mismatch:** PR #11's source format uses old `answerRegex` / `semantic` expectations
  and cf-flue tool names. Do not transplant those blocks into this repo's YAML rubric; only question
  concepts were evaluated.
- **Raven scope trap:** prompts asking Raven to write code (`soroban-counter`, dApp/Freighter snippets,
  keeper bots, accounting implementations) should be reframed into evidence/source/pattern lookups.
- **Freshness traps:** x402/MPP/AP2/ACP, ERC-8004/stellar8004, CCTP, wallet auth-entry support,
  OpenZeppelin/PasskeyKit positioning, hackathons/RFPs, protocol versions, and YieldBlox incident figures
  require dated sources if any rubric is later authored.
- **Duplicate-risk note:** if any NEAR candidate is adopted, keep it single-concept and avoid broad
  composites like `rwa-yield-private-credit-infra`, which is already covered by decomposed RWA, Etherfuse,
  DeFindex, and oracle-defense questions.
