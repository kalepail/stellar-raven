# Prior-art synthesis verdict

Independent adversarial pass over `_candidates.md`, the four prior reviews, `_our-questions.txt`, the
existing golden-question files, local dossiers, Stellar Light Scout, official Stellar/Circle docs, and
public GitHub/web sources. Date of verification: 2026-06-22.

## Per-candidate verdicts

| Theme | Really-new? | Grounded? (evidence) | Verdict | Target |
|---|---|---|---|---|
| A. Agentic / x402 per-call payments | Yes. `_our-questions.txt` has no `x402`, `MPP`, agentic-payment, or machine-payment question. | Yes, but split the claims. Stellar Docs has an [Agentic Payments](https://developers.stellar.org/docs/build/agentic-payments) section for x402 + MPP, [x402 on Stellar](https://developers.stellar.org/docs/build/agentic-payments/x402), and `stellar/stellar-mpp-sdk` describes a Stellar MPP payment method. AP2 and ACP are real general agent-payment / commerce protocols, but I did not confirm them as Stellar settlement standards. `stellar8004` is only thinly grounded: one public repo (`progax01/stellar8004`) showed up, not a mature standard. | ADOPT for x402/MPP; REFRAME AP2/ACP/8004 as "what exists, what is generic, what is experimental?" | `defi-ecosystem` or `tooling-infra`; `stellar_docs_mcp`, `scout_repos`, `scout_research`, `perplexity_search` acceptable for general AP2/ACP context. |
| B. Contract source / WASM verification | Yes. Existing questions cover upgradeability, contract IDs, CLI deploy/build, and security, but not build provenance/reproducibility. | Yes, but the SEP number in the prior reviews is wrong. [SEP-49](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0049.md) is Upgradeable Contracts. Source/build verification is [SEP-55](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md) Contract Build Verification (Draft) and [SEP-58](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0058.md) Contract Build Reproducibility for Verification (Draft). The SCF dossier/RFP also names a Contract Source Verification Service using SEP-58 vocabulary. | REFRAME. Adopt the question, but make the wrong-SEP trap explicit. | `soroban` or `assets-anchors-seps`; `stellar_docs_mcp`, `scout_research`. |
| C. Fact-check / claim adjudication | Yes as a task shape. Existing questions cover Soroswap facts and freshness, but not "fact-check this draft claim." | Yes. Local dossier says Soroswap is the first DEX aggregator, not the first Stellar AMM; Stellar had SDEX and protocol AMMs before Soroswap. The `$1B TVL` part is a good freshness/no-source trap unless current evidence supports it. | ADOPT. | `edge-governance` or `defi-ecosystem`; `lumenloop_find_content_about_project`, `scout_research`, `parallel_search`/`perplexity_search` acceptable for live TVL claim checking. |
| D. Streaming / continuous payments prior art | Yes. No existing question is anchored on streaming/continuous/recurring payment prior art. | Yes. Public evidence includes SDF's Hack-a-Soroban writeup on recurring payments, a Soroban payment-streaming tutorial/source, and repos such as `LabsCrypt/flowfi`, `LFGBanditLabs/Quipay`, and `Ali6nXI/stellar-drips`. Scout broad queries mostly returned agentic-payment false positives, so route via web/repo discovery plus Scout repos. | ADOPT. | `defi-ecosystem` or `tooling-infra`; `scout_repos`, `lumenloop_find_similar_scf_submissions`, `parallel_search`. |
| E. YieldBlox / Reflector exploit history | Yes. Existing security questions cover vuln classes, audits, and disclosure programs, but not a named incident postmortem. | Yes, with amount caveat. Scout project search identifies YieldBlox as a Blend pool affected by a February 2026 oracle manipulation using USTRY/Reflector and roughly `$10.8M`; public reports vary between about `$10.2M` and `$10.8M`, with about `$7.2M`/48M XLM frozen. Sources: Stellar Light YieldBlox result, [NomosLabs archive](https://nomoslabs.io/archive/yieldblox-dao-2026), [Medium/Cryip](https://medium.com/%40cryip/10-8m-oracle-manipulation-exploit-on-stellars-blend-protocol-6bdcbb1568c0). | ADOPT, but phrase amount as "about $10M" or require evidence to reconcile exact figures. | `compliance-rwa-payments` or `defi-ecosystem`; `scout_research`, `scout_projects`, `parallel_search`. |
| F. SEP-53 sign/verify message | Yes. Existing SEP list stops at common anchor/wallet SEPs and has no SEP-53 question. | Yes. [SEP-53](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0053.md) is "Sign and Verify Messages", Status: Final, updated 2026-06-18. It standardizes arbitrary message signing/verifying with Stellar keypairs. | ADOPT. | `assets-anchors-seps` or `tooling-infra`; `stellar_docs_mcp`, `scout_research`. |
| G. CCTP cross-chain | Partly. `q-token-circle-usdc-on-stellar` already has CCTP-on-Stellar as a `should_have`, and `q-defi-bridges-content` covers generic bridges. We do not have a CCTP-specific integration/limitations question. | Yes. SDF says [Circle CCTP is live on Stellar](https://stellar.org/blog/foundation-news/circle-cctp-is-live-on-stellar) as of 2026-05-19, and Circle has [CCTP on Stellar docs](https://developers.circle.com/cctp/references/stellar) noting Stellar-specific address/precision behavior. | REFRAME. Do not add "is CCTP live?" as a duplicate; add an integration/limitations question. | `tooling-infra` or `defi-ecosystem`; `stellar_docs_mcp`, `perplexity_search`, `parallel_extract`. |
| H. Passkey wallet recovery | Partly. `q-soroban-add-signer-smart-wallet-howto` says "consider recovery" as a nice-to-have, and smart-wallet questions cover signer mechanics, but there is no dedicated recovery UX/design slot. | Yes. Stellar smart wallets/custom accounts support multiple signer schemes; smart-account-kit explicitly supports passkeys, Ed25519 keys, policy signers, storage/session recovery surfaces, and relayer use. | REFRAME/ADOPT as a recovery-pattern context lookup, not a code task. | `tooling-infra` or `soroban`; `stellar_docs_mcp`, `scout_repos`. |
| I. smart-account-kit vs passkey-kit supersession | No. `q-tool-passkeykit-smart-wallet` already has the exact must-have: passkey-kit as legacy precursor and smart-account-kit as greenfield default. | Grounded, but current nuance matters. `smart-account-kit` exists and is active; npm latest 0.2.10 describes an OpenZeppelin smart-account SDK. `passkey-kit` also remains active (GitHub pushed 2026-06-08, npm latest 0.12.0) and should not be called dead unless a source says so. | REJECT as duplicate. Keep the existing question; Phase 2 should verify wording carefully. | Existing `q-tool-passkeykit-smart-wallet`; `stellar_docs_mcp`, `scout_repos`. |
| J. Policy signers / scoped auth; oracle-manipulation defense | Partly. Policy signers are already in `q-tool-passkeykit-smart-wallet`, `q-soroban-check-auth-custom-account`, and `q-soroban-auth-delegation-p27`. Oracle defense is only generic in `q-soroban-vuln-classes` and Reflector identity. | Yes. Policy signers are present in smart-account-kit and local docs. Oracle manipulation defense is grounded by the YieldBlox/Reflector incident plus SEP-40/oracle docs and existing Reflector audits. | REFRAME. Reject a standalone policy-signer duplicate; adopt an oracle-consumer safety question tied to the real incident. | `soroban` or `defi-ecosystem`; `scout_research`, `stellar_docs_mcp`, `lumenloop_get_project`. |
| K. Etherfuse Stablebonds integration | Partly. Existing RWA questions cover tokenized-RWA discovery and BENJI/Ondo-style cases, but not Etherfuse integration. | Yes. Scout project search returns [Etherfuse](https://stellarlight.xyz/project/etherfuse) as issuing Stablebonds on Stellar and [OrbitCDP](https://stellarlight.xyz/project/orbitcdp) as using Etherfuse tokenized bonds like USTRY/CETES. | ADOPT if we want a specific RWA integration slot; otherwise fold into RWA discovery. My vote: ADOPT one specific question because USTRY is also part of the exploit story. | `compliance-rwa-payments` or `defi-ecosystem`; `scout_projects`, `lumenloop_search_directory`, `parallel_search`. |
| L. Meta self-freshness introspection | No, not as phrased. Existing freshness questions test current facts; this asks Raven to introspect a specific index's metadata, which is more Raven-internal than Stellar-ecosystem knowledge. | Not sufficiently grounded for the golden battery. I did not verify a stable Scout API field that exposes project-count/last-updated as a user-facing contract, beyond ad hoc `meta.generatedAt/counts` fields in endpoint responses. | REJECT. Could become an internal routing/observability test, not a user golden question. | None for golden battery. |
| O. Code-generation task shape | The pure codegen shape is new, but out of scope for Raven. Some underlying topics are already covered (`q-soroban-cli-init-build`, smart-wallet/passkey, Freighter/wallet questions). | Underlying examples are real: Stellar docs include counter/increment examples and dApp/Freighter material; smart-account-kit and Blend are real. But Raven returns sourced evidence, not generated code. | REFRAME only. Reject "write code" prompts; allow "where is the canonical example/recommended pattern, and what should the downstream coding agent cite/use?" | `soroban` or `tooling-infra`; `stellar_docs_mcp`, `scout_repos`. |

## Adopt list

Questions I would actually add, after dedupe and grounding:

1. "How do x402 and MPP work on Stellar for per-request API or AI-agent payments, and what parts are live on testnet/mainnet today?"
2. "If I am choosing an agent-payment standard for a Stellar API, how should I compare x402, MPP, AP2, and ACP, and which parts are Stellar-specific versus general agent-commerce protocols?"
3. "What, if anything, exists today for ERC-8004-style agent identity or reputation on Stellar, and how experimental is it?"
4. "Which Stellar standards cover Soroban contract build/source verification, and what do SEP-55 and SEP-58 prove or not prove about a deployed WASM?"
5. "Fact-check this draft: 'Soroswap is Stellar's first AMM and just passed $1B in TVL.' What is true, false, or not verifiable from current sources?"
6. "I am designing a streaming or recurring-payments contract on Soroban. What existing Stellar projects, repos, or SCF submissions should I study?"
7. "What happened in the YieldBlox/Reflector oracle manipulation incident, what was the approximate loss/recovery, and what design lessons apply to Soroban DeFi?"
8. "What is SEP-53, what does it standardize for signing and verifying messages with Stellar keys, and which SDK/library support should I look for?"
9. "Circle CCTP is live on Stellar; what integration details and Stellar-specific constraints should a wallet or bridge developer know?"
10. "If a user loses a passkey for a Stellar smart wallet, what recovery patterns exist using backup signers, policy signers, or multi-signer account design?"
11. "How should a Soroban protocol consume Reflector or other price oracles defensively so stale/thin-liquidity prices cannot drain a lending pool?"
12. "What are Etherfuse Stablebonds on Stellar, and how would a DeFi app integrate or reason about assets such as USTRY/CETES?"
13. "Where are the canonical Stellar examples for a Soroban counter contract, Freighter/React payment flow, or Blend-style integration, and what should a downstream coding agent use as source material?"

## Scope opinion

Do not add pure code-generation tasks to this battery. Raven is a context/evidence service for other
agents, and the schema grades sourced claims, provenance, route/gather behavior, and confidence. A prompt
like "write a minimal Soroban counter contract" measures a coding agent, not Raven. The useful Raven-shaped
version is a context lookup: identify canonical examples, current docs, recommended libraries, traps, and
sources that a downstream coding agent should use.

That means code-shaped topics are admissible only when phrased as evidence retrieval or pattern selection:
"where is the canonical example?", "which repo/library should I use?", "what current command/API should I
cite?", or "what implementation pitfalls do the sources identify?"

## Junk/skip list

Confirmed skip:

- `x402-mpp-analytics-dashboard` - weak and mostly non-Stellar-dashboard shaped; agentic payments are covered better by A.
- `why-stellar-differentiators` - marketing/positioning, not a good evidence-routing eval.
- `noir-ultrahonk-status` - too niche relative to the existing ZK/prover coverage unless a future dossier makes it first-class.
- `compare-current-hackathons` - targets dormant `scout_hackathon_compare`; existing SCF/hackathon questions cover the routable surfaces.

Additional correction:

- "SEP-49 source verification" is junk as stated. SEP-49 is upgradeable contracts; use SEP-55/SEP-58 for build verification/reproducibility.
- "smart-account-kit deprecated vs passkey-kit" is backwards/ambiguous as stated. `smart-account-kit` is active/current; `passkey-kit` is active but legacy/precursor in the existing question wording.
