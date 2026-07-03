# Prior-art review — kalepail gist (golden-question rubric)

**Source:** https://gist.githubusercontent.com/kalepail/e9cdd7c41320f88ad447e3c00d6c4935/raw
**What it is:** A JSON golden-question evaluation rubric for grading AI answers about Stellar/Soroban
dev. Each entry pairs a user-facing `question` with semantic must-include/must-avoid/freshness/canonical-fact
blocks (those blocks were IGNORED per instructions — only the question text was assessed).
**Note on fetch:** WebFetch truncated the array (reported 8/11). The definitive count comes from a
direct `curl` + JSON parse: **35 questions total**.

## Totals

| Classification | Count |
|---|---|
| COVERED (already in our battery) | 23 |
| NEAR (different angle we partly lack) | 6 |
| NEW (genuinely absent) | 6 |
| OUT-OF-SCOPE (non-Stellar) | 0 |
| **Total** | **35** |

The gist overlaps heavily with our battery (trustlines, SEP-24 deposits, SAC/SEP-41, Groth16,
storage TTL, passkeys, Horizon-vs-RPC, OZ token vs SAC, clawback/auth flags, Soroswap dossier/
content/similar, leaderboard, clusters, vocab, RPC methods, OZ verification). Those are COVERED.
Below are only the additive candidates.

## NEW / NEAR candidates (additive)

| # | Gist question (verbatim) | Class | Why additive | Stellar concept | Our category / card | Grounding sanity check |
|---|---|---|---|---|---|---|
| g4 | "Write a minimal Soroban contract that stores a counter and increments it." | NEW | Our battery has **zero code-generation prompts** — every soroban Q asks "how/what", none says "write the contract". A clean codegen probe. | Soroban contract authoring (storage + fn) | `soroban` / `stellar_docs_mcp` | Sound — the canonical counter example exists in Stellar docs/CLI examples. |
| g13 | "Which Stellar standard(s) cover verifying that a deployed Soroban contract's WASM corresponds to its published source code, and what does that verification actually prove?" | NEW | We have **no WASM source-verification / reproducible-build** question at all. Live, real topic (SEP-49 contract-source-verification / `stellar contract verify`). | Reproducible builds, contract source verification (SEP-49) | `soroban` or `tooling-infra` / `stellar_docs_mcp` + `scout_research` | Mostly sound but STATUS-SENSITIVE — verify the exact SEP number (SEP-49) and tooling maturity before adopting; flag for grounding. |
| g15 | "How do I charge AI agents per API call on Stellar?" | NEW | No x402 / per-call agent-payment / monetization question exists in our 376. Emerging, highly on-brand for Raven's audience. | x402 / micropayments / agent-to-agent payments on Stellar | `assets-anchors-seps` or `tooling-infra` / `scout_research` + `stellar_docs_mcp` | Sound — Stellar x402 work is real and recent; confirm current tooling story (status-sensitive, could be thin in corpus → may double as honest-coverage probe). |
| g16 | "Before giving me ecosystem recommendations, check whether the Stellar ecosystem index is fresh enough to rely on. What does the index say about its project count and last-updated status?" | NEW | A **meta / self-freshness-introspection** probe — asks the agent to interrogate the index's own freshness metadata before answering. We have freshness questions but none that ask the tool to report on its OWN currency. | Index freshness/self-reporting | `edge-governance` (freshness) / `scout_analyze` or `scout_projects` | Sound IF Scout exposes project-count + last-updated metadata; verify that surface exists before adopting. |
| g28 | "Fact-check this tweet draft before I post it: 'Soroswap is Stellar's first AMM and just passed $1B in TVL.'" | NEW | **Fact-check-a-false-claim** framing — combines a falsifiable historical claim (first AMM) + an unverifiable live figure (TVL). We have no "fact-check this draft" question shape; tests honesty + freshness refusal in one. | DeFi facts + freshness honesty | `defi-ecosystem` + `edge-governance` / `lumenloop_find_content_about_project` + `scout_research` | Sound — "first AMM" is checkably false-ish (native AMM/SDEX predate Soroswap) and exact TVL is a no-info trap; strong probe. |
| g27 | "I'm designing a streaming-payments contract on Soroban. What existing Stellar projects have built something similar that I could learn from, and where can I read their code?" | NEW | A **prior-art discovery for a specific contract pattern** (streaming/recurring payments) that our discovery questions don't cover — we discover DEX/oracle/lending/wallet projects but never streaming-payments. | Streaming/recurring payments prior-art | `defi-ecosystem` / `scout_projects` + `scout_repos` | Sound as a discovery probe; the answer may legitimately be thin → also a soft honest-coverage check. |
| g21 | "Using live hackathon data, compare the latest Stellar ZK hackathon with the recent Stellar agents/x402 hackathon. Which had more registered hackers, and what were their prize pools?" | NEAR | We cover hackathons (active/upcoming, DoraHacks, detail-results) but never a **two-hackathon head-to-head on registrant counts + prize pools**. Different angle: comparison over `scout_hackathons` + detail. | Hackathon comparison | `scf-grants-builders` / `scout_hackathons` + `scout_hackathon_detail` | Status-sensitive — depends on these two specific hackathons existing in the catalog now; verify before adopting. |
| g19 | "Is there an active Stellar zero-knowledge hackathon today? If so, give the name, date range, and source link." | NEAR | Sharper than our generic `q-scf-hackathons-active`: a **topic-filtered freshness** hackathon query (ZK-specific, demands source link) that should gracefully say "none" if absent. | Topic-filtered hackathon freshness | `scf-grants-builders` / `scout_hackathons` | Sound as a freshness/honest-no-info hybrid; `scout_hackathons` ignores `q`, so it tests filtering discipline. |
| g20 | "Is there an open Stellar RFP related to Soroban contract source verification? Summarize what it asks builders to create." | NEAR | We have `q-scf-rfp-tooling` (tooling/indexing RFP) but not a **topic-specific RFP lookup tied to a niche capability (source verification)**. Pairs with g13. | Topic-filtered RFP lookup | `scf-grants-builders` / `scout_rfps` | Status-sensitive — only additive if such an RFP plausibly exists; otherwise collapses into honest-no-info (still useful). |
| g14 | "I want users to sign Stellar dApp actions with passkeys instead of seed phrases. What pieces do I need and what should I be careful about?" | NEAR | We cover passkeys/secp256r1/PasskeyKit/smart-wallet add-signer, but this is a **dApp-builder framing ("what pieces + what to watch out for")** with a security-caveat ask — a more synthesis/gotchas angle than our component-level questions. | Passkey dApp integration + pitfalls | `tooling-infra` / `q-tool-passkeykit-smart-wallet` + `dapp` skill area | Sound; risk of near-dup with `q-tool-passkeykit-smart-wallet` / `q-soroban-add-signer-smart-wallet-howto` — adopt only if the "pitfalls/synthesis" framing is judged distinct. |
| g34 | "I'm issuing a regulated stablecoin as a classic Stellar asset. Walk me through the issuance flow and explain the issuer authorization flags — auth_required, auth_revocable, and clawback — and how trustline authorization works for KYC'd holders." | NEAR | We have issuance how-to + auth-flags list + clawback separately, but not a **single end-to-end "regulated-stablecoin issuance + auth-flag + KYC-trustline-authorization" walkthrough** tying them together. | Regulated asset issuance flow | `assets-anchors-seps` / `stellar_docs_mcp` | Sound; borderline-dup with `q-asset-issue-asset-howto` + `q-asset-auth-flags-list` + `q-comp-auth-flags-overview` — only additive as an integrated flow. |

## Skip / junk note

- **g1, g2, g3, g9, g10, g12** — COVERED (trustlines / SEP-24 deposits+auth / Groth16-today /
  storage TTL temp-vs-persistent / SAC↔SEP-41↔trustlines / "is SEP-41 the SAC"): direct equivalents
  at `q-asset-trustline-basics`, `q-sep-interactive-deposit-withdraw`+`q-sep-10-auth`,
  `q-soroban-zk-groth16-verifier`/`q-protocol-bn254-poseidon-xray`, `q-soroban-ttl-expiry-behavior`,
  `q-soroban-sac-what-is`/`q-asset-sac-cap-sep`, `q-sep-41-token-interface`.
- **g5, g6** — COVERED by `q-soroban-cli-init-build` + `q-tool-cli-init-build-deploy` (OZ-crate
  scaffold flavor is a near-dup, not worth a new slot).
- **g7** — COVERED by Freighter/wallet + dapp coverage (`q-tool-freighter-wallet`, `q-eco-freighter-wallet`);
  the React+payment how-to is a docs/dapp lookup we already imply.
- **g8, g35** — COVERED: Horizon-vs-RPC + event streaming (`q-infra-horizon-vs-rpc`,
  `q-infra-which-indexer`, `q-infra-query-contract-events-rpc-howto`) and RPC methods/pagination
  (`q-infra-rpc-methods-list`, `q-infra-rpc-event-retention`, `q-infra-rpc-provider-archive-tier`).
- **g11** — COVERED by `q-soroban-oz-token` + `q-soroban-sac-vs-custom-token` (OZ FungibleToken vs SAC).
- **g17** — COVERED by `q-eco-wallets-overview` / `q-tool-smart-wallet-repos-discovery` /
  `q-eco-stellar-wallets-list` (wallet-infra builder discovery).
- **g18** — COVERED by `q-scf-open-rfps` + `q-scf-hackathons-active` (combined, but each half exists).
- **g22** — COVERED by `q-eco-defi-market-map` / `q-defi-liquid-staking-whitespace` style clusters;
  dev-tooling-crowded-vs-whitespace maps to `scout_clusters` cases we already have.
- **g23, g24** — COVERED: Soroswap dossier (`q-defi-soroswap-resolve`) + Soroswap content
  (`q-defi-soroswap-content`).
- **g25** — COVERED by vocab questions `q-defi-lumenloop-categories-vocab` +
  `q-builder-lumenloop-regions-vocab`.
- **g26** — COVERED by `q-eco-most-active-defi-projects` / `q-tool-leaderboard-open-issues`
  (leaderboard + source/freshness caveat).
- **g29, g30** — COVERED: "OZ has no Stellar library" false-claim maps to `q-soroban-oz-token` /
  `q-soroban-oz-upgradeable-macro` (we assert OZ Stellar crates exist); the web+extract verify flavor
  is a tool-routing variant, not a new concept.
- **g31** — COVERED by `q-protocol-bn254-poseidon-xray` (P25/X-Ray BN254+Poseidon, don't overstate privacy).
- **g32** — COVERED: "similar projects + separate builder list" maps to `q-defi-soroswap-similar` +
  `q-builder-rust-soroban-devs`/`q-builder-by-region-latam` (two-list discipline already probed).
- **g33** — COVERED by `q-eco-defi-market-map` + `q-scf-funding-by-category` + `q-scf-total-distributed`
  (cluster saturation + ecosystem aggregate).

**Quality flags:**
- Status-sensitive (verify before adopting): g13 (SEP-49 number/maturity), g15 (x402 tooling),
  g19/g20/g21 (specific hackathons/RFPs must exist in catalog now), g16 (index must expose
  freshness metadata).
- None are out-of-scope/non-Stellar.
- g14 and g34 risk semantic near-dup with existing questions — adopt only if their synthesis framing
  is judged materially distinct.
