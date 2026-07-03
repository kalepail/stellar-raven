# Prior-art review — kalepail/cf-flue golden questions

- **Source:** `kalepail/cf-flue` @ `evals/golden-questions.json` (main). Private repo; fetched via
  authenticated `gh api` (MCP token + public raw URL both 404'd). File self-describes as a
  "high-value golden subset, adapted from stellar-pallet/evals/golden-questions.json + scratchpad 196
  §6", re-skinned with cf-flue tool/skill names. Despite the "cf-flue" name it is **entirely
  Stellar-focused** — no Cloudflare/Flue out-of-scope items.
- **Totals:** 36 questions reviewed. Question text only; rubric/expect blocks ignored per instructions.
- **Counts:** COVERED 28 · NEAR 4 · NEW 3 · OUT-OF-SCOPE 1.

This is a *subset* derived from a lineage that overlaps heavily with our own battery (same SEP/SAC/
storage-TTL/RPC-vs-Horizon/freighter/issuance-flags backbone), so most items are already covered,
often by multiple of our questions. The materially additive surface is small but real: **agentic /
x402 per-call payments**, **Soroban contract source-code / WASM verification**, and the
**smart-account-kit vs passkey-kit lineage** question. Streaming-payments prior-art is a worthwhile
NEAR angle. One item (`compare-current-hackathons`) is a near-dup of our `q-edge-deep` /
hackathon-compare lane but targets a *dormant/not-routable* tool — flagged, low value.

## NEW / NEAR candidate table

| cf-flue id | Class | Question (verbatim) | Why additive | Stellar concept | Our category + card | Grounding sanity check |
|---|---|---|---|---|---|---|
| `agentic-payments-x402` | **NEW** | "How do I charge AI agents per API call on Stellar?" | We have **zero** x402 / agentic-payments / pay-per-call coverage. cf-flue treats `agentic-payments` as a first-class skill; our battery never mentions x402, machine payments, or metered API billing on Stellar. Genuinely absent and topical. | x402 / agentic payments, micropayments per API call, payment-channel / streaming primitives | `defi-ecosystem` or new agentic-payments lane → likely `scout_research` + `stellar_docs_mcp` (+ web for x402 spec) | Grounded: x402 + Stellar agentic-payment efforts are real and current (2025-26). Verify exact tooling before fixing an answer; lane is fast-moving. |
| `standards-contract-source-verification` (+ `open-rfp-contract-source-verification`, `web-extract-openzeppelin-primary` overlaps separately) | **NEW** | "Which Stellar standard(s) cover verifying that a deployed Soroban contract's WASM corresponds to its published source code, and what does that verification actually prove?" | We cover contract-id derivation, upgrade/WASM replacement, and SDK CVEs, but **not source-code/reproducible-build verification** of a deployed contract's WASM. Distinct, increasingly relevant standards question. | Soroban contract source verification, reproducible builds, WASM hash vs published source (SEP / stellar.expert / explorer verification) | `soroban` or `standards` → `stellar_docs_mcp` + `scout_research` (SEP/standards corpus) | Grounded-but-verify: confirm which standard/SEP (if any) actually governs this vs explorer-level verification; answer must be honest if no formal SEP exists. Good honesty/precision case. |
| `dapp-smart-account-kit-passkey-kit-lineage` | **NEW** | "Is kalepail's smart-account-kit deprecated or superseded - for example replaced by an OpenZeppelin smart-account approach - or is it the current SDK? And how does it relate to passkey-kit?" | We cover PasskeyKit / passkeys / smart wallets broadly (`q-tool-passkeykit-smart-wallet`, `q-soroban-add-signer-smart-wallet-howto`) but **not the smart-account-kit ↔ passkey-kit lineage / deprecation** question — a "is X superseded?" freshness+identity trap distinct from "what is PasskeyKit?". | smart-account-kit vs passkey-kit, library deprecation/supersession, OZ smart-account relation | `tooling-infra` → `scout_repos` / `scout_skills` + `stellar_docs_mcp` | Grounded-but-freshness-sensitive: lineage/deprecation status changes; treat as freshness case. Good "don't assert stale supersession" trap. |
| `prior-art-streaming-payments` | **NEAR** | "I'm designing a streaming-payments contract on Soroban. What existing Stellar projects have built something similar that I could learn from, and where can I read their code?" | We have many discovery/prior-art questions (Soroswap-similar, oracle-similar, repos-discovery) but **none anchored on streaming/continuous payments** as the design topic. Different domain anchor for the `find_similar` + repos discovery lane. | Streaming / continuous / payroll payments on Soroban, prior-art repo discovery | `defi-ecosystem` / `tooling-infra` → `lumenloop_find_similar_scf_submissions` + `scout_repos` + `lumenloop_find_content_about_project` | Grounded: streaming-payment / payroll projects exist in the Stellar/SCF corpus. Pairs naturally with the new agentic-payments lane. |
| `setup-scaffold-contract` / `assets-sac-vs-openzeppelin-contract-token` / `dapp-passkey-smart-account` | **NEAR (low)** | (scaffold + OZ token-vs-SAC + passkey dApp pieces) | We cover SAC-vs-custom-token (`q-soroban-sac-vs-custom-token`) and CLI scaffold (`q-soroban-cli-init-build`) but these fold **OpenZeppelin FungibleToken vs SAC** explicitly into the choice and the OZ-crate scaffold step. Mostly covered; the explicit *OZ-contract-token vs SAC* framing is a mild angle we under-emphasize. | OZ Stellar FungibleToken vs SAC vs SEP-41; OZ-crate scaffolding | `soroban` → `stellar_docs_mcp` + OZ skill | Grounded; low additive value — close to `q-soroban-oz-token` + `q-soroban-sac-vs-custom-token`. Merge-candidate, not a new file. |

## Skip / junk note

- **COVERED (28):** trustline, anchor-deposit SEP, Groth16-in-Soroban, soroban-counter, freighter
  payment, RPC-vs-Horizon + event streaming, storage TTL temp/persistent, SAC↔SEP-41↔trustlines,
  SEP-41-is-interface-not-SAC, ecosystem-index-freshness, wallet-infra landscape, open SCF RFPs +
  active hackathons, ecosystem whitespace/clusters, soroswap dossier/content/similar, taxonomy
  dispatch (categories/tags vocab), developer-activity leaderboard, soroswap-AMM/$1B-TVL fact-check,
  OZ-has-no-Stellar-lib fact-check, Protocol-25/X-Ray BN254+Poseidon, builders directory,
  cluster+rollup aggregate, regulated-stablecoin issuance flags (auth_required/revocable/clawback),
  RPC JSON-RPC methods (getEvents/getLedgers/getTransactions). Each maps cleanly to one or more of our
  ids (e.g. SEP-24 → `q-sep-interactive-deposit-withdraw`; storage TTL → `q-soroban-storage-types` +
  `q-soroban-ttl-expiry-behavior`; issuance flags → `q-asset-auth-flags-list` + `q-comp-auth-flags-overview`;
  RPC methods → `q-infra-rpc-methods-list`; X-Ray ZK → `q-protocol-bn254-poseidon-xray` +
  `q-soroban-zk-bn254-poseidon`).
- **OUT-OF-SCOPE / not-additive (1):** `compare-current-hackathons` ("compare the latest Stellar ZK
  hackathon with the agents/x402 hackathon, which had more registered hackers + prize pools") — Stellar,
  but it explicitly drives `scout_hackathon_compare`, which CARDS.md/TAXONOMY mark **dormant /
  not-routable today**. Our `q-scf-hackathon-detail-results` already covers hackathon-detail. Skip as a
  routing target; the embedded "agents/x402 hackathon" reference is a weak secondary signal for the new
  agentic-payments lane, not a question on its own.
- **No non-Stellar / no fabricated / no stale-broken items** in the set. Quality is uniformly high
  (it is a curated subset). The only freshness caveat is the smart-account-kit lineage item, which we
  capture as a deliberate freshness trap above.

## Recommendation (top additive candidates)

1. **`agentic-payments-x402`** — net-new lane (per-call/agentic payments, x402). Highest value.
2. **`standards-contract-source-verification`** — net-new (Soroban WASM/source verification standard).
3. **`dapp-smart-account-kit-passkey-kit-lineage`** — net-new freshness/supersession trap.
4. **`prior-art-streaming-payments`** — NEAR; good discovery-lane anchor, pairs with #1.

Everything else is covered or a merge-candidate; nothing else is materially additive.
