# Merged additive-candidate shortlist (from 4 prior collections)

Consolidated from `review-raven-main.md`, `review-cf-flue.md`, `review-gist.md`, `review-raven-pr11.md`.
Sources accessed via `gh` (all 4 are private repos / a gist). The prior collections overlap heavily
with our 376-question battery; this is the residual that MIGHT be additive. Each needs (a) a real dedup
check vs `_our-questions.txt` and (b) a grounding check that it's real/current before adoption.
Verdicts to be set by the Codex adversarial pass + orchestrator grounding research: ADOPT / REFRAME / REJECT.

| # | Theme | Sources | Why possibly additive | Grounding to verify | Maps to |
|---|---|---|---|---|---|
| A | **Agentic / x402 per-call payments** — "charge AI agents per API call on Stellar (x402)"; x402 vs MPP vs AP2/ACP standard choice; MPP discovery; ERC-8004 / stellar8004 agent identity & reputation | ALL 4 | We have ZERO agentic-payments coverage; an `agentic-payments` skill exists; on-brand for an agent-facing tool | Does x402 / MPP / AP2 / ACP / stellar8004 actually exist on Stellar today? | soroban / defi-ecosystem; stellar_docs_mcp + scout_research/projects |
| B | **Contract source / WASM verification** (reproducible builds; verify deployed WASM matches published source) — possibly **SEP-49** | raven-main, cf-flue, gist | Absent from our SEP/standards + soroban-upgrade coverage | Does SEP-49 exist + its status? Is there real verification tooling? | soroban / assets-anchors-seps; stellar_docs_mcp |
| C | **Fact-check / claim-adjudication task shape** — e.g. "fact-check this tweet: 'Soroswap is Stellar's first AMM and just passed $1B TVL'" | raven-main, gist | A task SHAPE we lack (claim → adjudicate w/ sources + flag the unverifiable figure); great honesty eval | Is Soroswap the first AMM? (Aquarius/others?) plausible TVL? | edge-governance; scout/lumenloop + honesty |
| D | **Streaming / continuous payments prior-art** discovery on Soroban | raven-main, cf-flue, gist | A discovery angle none of our questions use | Do streaming-payment contracts exist on Stellar/Soroban? | defi-ecosystem / soroban; scout_repos/lumenloop |
| E | **DeFi exploit / incident history** — e.g. the YieldBlox / Reflector ~$10.8M oracle exploit (Feb 2026) postmortem | pr11 | We test audits/vuln-classes but never a REAL named incident; Scout has an incidents corpus | Did this incident actually happen? amount/date/projects correct? | compliance-rwa-payments / soroban; scout_research(incidents) |
| F | **SEP-53 sign/verify message** | pr11 | Absent from our SEP set | Does SEP-53 exist + purpose? | assets-anchors-seps; stellar_docs_mcp |
| G | **CCTP cross-chain** (Circle CCTP on Stellar; CCTP+WalletKit; CCTP vs intents routing) | pr11 | We have only generic bridges | Does Circle CCTP support Stellar today? | defi-ecosystem / tooling-infra; scout/lumenloop/perplexity |
| H | **Passkey wallet recovery** (recovery UX / multi-signer design) | pr11 | We test ADDING signers, not recovery | Real patterns? (passkey-kit / smart wallets) | soroban / tooling-infra; stellar_docs_mcp/scout_repos |
| I | **smart-account-kit vs passkey-kit supersession** (is smart-account-kit deprecated?) | cf-flue | A supersession/freshness trap distinct from "what is PasskeyKit" | Current status of both repos | tooling-infra; scout_repos/perplexity |
| J | **Policy signers / scoped auth; oracle-manipulation defense** | pr11 | Possibly already in soroban security; verify | Are these distinct from our existing soroban auth/security Qs? | soroban |
| K | **etherfuse stablebonds integration** | pr11 | Niche RWA/stablecoin integration | Real + Stellar-relevant? | defi-ecosystem |
| L | **Meta self-freshness introspection** — ask the index to report its own project-count/last-updated before answering | gist | Novel introspection angle | Is this in-scope for Raven (vs Raven-internal)? | edge-governance (likely REJECT as out-of-remit) |
| O | **Code-generation task shape** (e.g. "write a minimal Soroban counter contract", "connect Freighter in React & submit a payment", "implement Blend per-depositor yield attribution") | raven-main, gist, pr11 | — | SCOPE DECISION: Raven returns sourced EVIDENCE, not generated code/prose. Likely REJECT pure code-gen; CONSIDER reframing as "where is the canonical example / recommended pattern for X" (a context lookup). | n/a |

**Reviewer-flagged junk/skip:** `x402-mpp-analytics-dashboard`, `why-stellar-differentiators` (marketing), `noir-ultrahonk-status` (too niche/stale), `compare-current-hackathons` (targets the dormant `scout_hackathon_compare` card).
