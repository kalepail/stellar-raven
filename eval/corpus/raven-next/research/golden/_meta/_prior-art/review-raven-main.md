# Prior-art review — kalepail/stellar-raven `evals/golden-questions.json` (main)

**Source:** `github.com/kalepail/stellar-raven` @ `main`, path `evals/golden-questions.json`
(private repo; fetched via authenticated `gh api`. The file's own `$comment` says it is a
"cf-flue high-value golden subset, adapted from stellar-pallet/evals/golden-questions.json +
scratchpad 196 §6 recommended subset" — i.e. itself a curated subset, not the full prior battery.)

**Total questions found:** 35
**Classification counts:** COVERED 25 · NEAR 6 · NEW 4

Reviewed against our 376-question battery (`_our-questions.txt`), TAXONOMY.md (Axis A/B/C),
and CARDS.md. Per instructions, only the QUESTION TEXT was judged; their expect/semantic/anchor
blocks were ignored.

## Headline

Most of this subset is already COVERED — it's a thin, build-flow-oriented slice that overlaps
heavily with our `soroban`, `assets-anchors-seps`, `tooling-infra`, and `defi-ecosystem`
categories. The materially-additive signal clusters in two themes our battery genuinely lacks:
**(a) agentic/x402 payments**, and **(b) code-generation + claim-verification *task* framings**
(write-a-contract, connect-and-pay, fact-check-this-tweet). Also a real **contract source-
verification standard** gap.

## NEW / NEAR candidates

| Prior id | Question (verbatim, abridged) | NEW/NEAR | Why additive | Stellar concept | Our category → card | Grounding sanity |
|---|---|---|---|---|---|---|
| `agentic-payments-x402` | "How do I charge AI agents per API call on Stellar?" | **NEW** | Our battery has **zero** agentic-payments / x402 / pay-per-call coverage; a project skill (`agentic-payments`) and the x402 pattern exist in the ecosystem. Highest-value gap. | x402 / agent micropayments on Stellar | `defi-ecosystem` or new lane → `scout_research` / `stellar_docs_mcp` (+ ecosystem discovery) | Real & answerable (x402 + Stellar agentic payments is a live ecosystem topic); good question. |
| `soroban-counter` | "Write a minimal Soroban contract that stores a counter and increments it." | **NEW** | We have *how-to-scaffold* and *macros* questions but **no code-generation prompt** that asks Raven to produce contract source. Different task-shape (generate vs. explain). | soroban-sdk contract authoring (storage + increment) | `soroban` → `stellar_docs_mcp` (+ soroban skill) | Real, canonical "hello-world" Soroban task; well-grounded. Note: tests Raven-as-coder, which may be out of its context-server remit — flag for owner. |
| `dapp-freighter` | "How do I connect the Freighter wallet in a React app and submit a payment?" | **NEW** | We cover "what is Freighter" and Wallets-Kit, but **not the client-side connect-and-submit-payment how-to** (the `dapp` skill's core flow). | Freighter connect + build/sign/submit payment from a React app | `tooling-infra` → `stellar_docs_mcp` (+ dapp skill) | Real, common dApp task; well-grounded. |
| `standards-contract-source-verification` | "Which Stellar standard(s) cover verifying that a deployed Soroban contract's WASM corresponds to its published source code, and what does that verification actually prove?" | **NEW** | **Contract source / WASM verification** is entirely absent from our SEP/standards coverage. | Reproducible-build / source-verification standard for Soroban WASM | `assets-anchors-seps` (standards) → `stellar_docs_mcp` / `scout_research` | Real and topical (source verification is an active Stellar standards area). Sanity-check which SEP actually owns it before authoring; answerable. |
| `content-audit-soroswap` / `content-audit-openzeppelin-stellar` | Fact-check a tweet draft ("Soroswap is Stellar's first AMM and just passed \$1B TVL") / fact-check claim ("OpenZeppelin has no Stellar smart-contract library"). | **NEAR** | We have freshness + honest-no-info cases, but **no "fact-check this specific claim/tweet" task-shape** — a distinct verification framing (claim → adjudicate true/false with sources). | Claim verification grounded in ecosystem content + live web | `edge-governance` (verification) → `lumenloop_*` / `parallel_search` / `perplexity_search` | Real and useful (forces grounded refutation of a plausible-but-false claim); good. The Soroswap "first AMM / \$1B TVL" is deliberately false-ish — good trap. |
| `prior-art-streaming-payments` | "I'm designing a streaming-payments contract on Soroban. What existing Stellar projects have built something similar … where can I read their code?" | **NEAR** | We have prior-art/discovery for oracles, passkeys, payroll, AMM — but **streaming payments** as a prior-art topic is uncovered. | Streaming / continuous payments contracts as prior art | `defi-ecosystem` → `scout_repos` / `lumenloop_find_similar_*` | Real discovery question; grounded. Mild risk the corpus is thin on streaming-payments projects — still a legitimate "what exists?" probe. |

### Lower-confidence NEAR (note, but likely fold into existing cells)

- `active-zk-hackathon` ("Is there an active Stellar ZK hackathon today?") and
  `open-rfp-contract-source-verification` ("open RFP re Soroban contract source verification?")
  — **NEAR**: same cards as our `q-scf-hackathons-active` / `q-scf-open-rfps`, but with a *specific
  named topic* (ZK / source-verification) as the freshness filter. Additive only if we want
  topic-scoped freshness probes; otherwise COVERED.

## Skip / junk note

Nothing in this subset is non-Stellar, ungrounded, or noise — it is a tight, real, build-focused
set. The following are NOT additive (COVERED) and should be skipped as duplicates of our battery:

- `protocol-trustline`, `assets-sac-usdc`, `assets-sac-vs-openzeppelin-contract-token`,
  `standards-sep41-interface-not-sac`, `assets-issuance-flags` → covered by our `q-asset-*` /
  `q-sep-41-*` / `q-soroban-sac-*` cluster.
- `standards-anchor-deposit`, `dapp-passkey-smart-account`, `wallet-infra-landscape` → covered by
  `q-sep-interactive-deposit-withdraw`/`q-sep-10-auth`, `q-tool-passkeykit-smart-wallet`,
  `q-eco-wallets-overview`.
- `setup-scaffold-contract`, `official-docs-current-contract-scaffold` → `q-soroban-cli-init-build`,
  `q-soroban-oz-token`, `q-tool-cli-init-build-deploy`.
- `data-rpc-vs-horizon`, `data-storage-ttl`, `data-rpc-methods`, `zk-groth16`,
  `perplexity-research-protocol-25-zk` → `q-infra-horizon-vs-rpc`, `q-soroban-storage-types`,
  `q-infra-rpc-methods-list`, `q-soroban-zk-groth16-verifier`, `q-protocol-bn254-poseidon-xray`.
- `ecosystem-index-freshness`, `ecosystem-category-whitespace`, `ecosystem-project-dossier-soroswap`,
  `ecosystem-content-about-soroswap`, `ecosystem-taxonomy-dispatch`, `developer-activity-leaderboard`,
  `prior-art-similar-and-builders`, `ecosystem-cluster-and-rollup`, `web-extract-openzeppelin-primary`,
  `compare-current-hackathons`, `rfps-and-hackathons` → all map to existing `q-defi-*` / `q-eco-*` /
  `q-scf-*` / `q-builder-*` discovery + market-map + vocab + leaderboard + SCF-history cells.
  (`compare-current-hackathons` leans on the `compare_hackathons` card, which our CARDS.md marks
  **dormant / not-routable** — treat as not additive.)

> One cross-cutting flag for the owner: several of these (`soroban-counter`, `dapp-freighter`)
> ask Raven to **produce code**, not just surface context. That's a deliberate task-shape choice
> our battery has avoided so far; worth a decision before importing — it may sit outside Raven's
> "context service for other agents" remit.
