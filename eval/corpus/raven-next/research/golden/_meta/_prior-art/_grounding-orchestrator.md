# Orchestrator independent grounding (2026-06-22)

My own Parallel/Perplexity + Stellar Light (Scout) cross-check of the candidate themes, per the
owner's "do your own independent research; don't trust the prior collections" instruction. Pairs with
the Codex adversarial pass (`review-codex-synthesis.md`). Verdicts finalized at synthesis.

## Confirmed REAL + grounded (primary Stellar sources)

- **A — Agentic / x402 payments: STRONGLY CONFIRMED, first-party.** `developers.stellar.org/docs/build/
  agentic-payments` (+ `/x402`), `stellar.org/x402`, `stellar.org/blog/foundation-news/x402-on-stellar`.
  x402 = Coinbase per-request HTTP-402 payments; on Stellar via **Soroban authorization entries**, any
  **SEP-41** token (default **USDC**); facilitators = Coinbase (testnet) + **OpenZeppelin Relayer/
  Channels** (testnet+mainnet); wallets needing **auth-entry signing** (Freighter ext, Albedo, Hana,
  HOT, Klever, OneKey). **MPP on Stellar** = Machine Payments Protocol (Soroban SAC transfers + payment
  channels). **AP2** = Google's Agent Payments Protocol (routes through x402). Scout corpus confirms:
  research has "Agentic Payments: HTTP-Native Payment Protocols"; projects **ApiCharge / Benkiko**;
  repos **StellarPay402 / Agent-Paywall-Router / XLMx402earn**; an **"Agentic Payments" skill** exists.
  → ADOPT a small cluster (multi-card: scout_research/projects/repos/skills + stellar_docs_mcp).
  Note: **ERC-8004** (agent identity) is an *Ethereum* mainnet standard (live 2026-01-29) — Stellar
  relevance is as comparison/edge, not a Stellar-native standard; treat as general-web edge at most.

- **B — Contract source / build verification: CONFIRMED (concept).** The "Contract Source Validation
  SEP" (stellar discussions #1573) — GitHub Actions + **Attestations**, `stellar-expert/
  soroban-build-workflow`, WASM `contractmetav0` `source_repo` metadata; surfaced in **Stellar Lab →
  Build Info**. ⚠️ Do NOT hard-gate a specific SEP number (the gist said "SEP-49"; the live SEP list
  shows 46/48/50 — 49 plausible but unconfirmed). Gate on the *mechanism*, let the answer name the SEP.
  → ADOPT (soroban or assets-anchors-seps; stellar_docs_mcp).

- **F — SEP-53 sign/verify message: CONFIRMED.** Stellar CLI `message` subcommand = "Sign and verify
  arbitrary messages using **SEP-53**." → ADOPT (assets-anchors-seps; stellar_docs_mcp).

- **E — DeFi incident history: theme real, prior CLAIM wrong.** The PR's "YieldBlox/Reflector ~$10.8M
  oracle exploit (Feb 2026)" is NOT in the corpus. What IS grounded: **"Blend Protocol —
  oracle-manipulation incident (May 2026, attempted & contained)"** + Reflector OtterSec audits.
  → ADOPT but anchor ONLY to the real grounded incident; `must_avoid` = inventing a specific
  exploit/amount (e.g. the $10.8M figure). category compliance-rwa-payments or soroban; scout_research
  (incidents corpus). This is also a good honesty/accuracy eval.

## Also surfaced (check our coverage, possibly add)
- Newer SEPs: **SEP-48 Contract Interface Specification**, **SEP-50 Non-Fungible Tokens**, **SEP-46
  Contract Meta**, **Upgradeable Contracts SEP** (PR #1671). Sanity-check our assets/soroban coverage.

## Deferred to Codex's independent pass
- **G CCTP on Stellar**, **I smart-account-kit deprecation vs passkey-kit**, **D streaming payments
  (weakly distinct — likely folds into A)**, **K etherfuse stablebonds**, **J policy-signers/oracle-
  manipulation-defense (may already be in soroban security)**.

## Scope call (mine, pending Codex's view)
- **O code-generation tasks: REJECT as-is.** Raven returns sourced EVIDENCE, not generated code. REFRAME
  the useful ones as context lookups: "where is the canonical X example / what's the recommended pattern
  for X" → stellar_docs_mcp/scout_repos. (e.g. the Freighter-connect and counter-contract prompts.)
- **L meta self-introspection (index reports own project-count/last-updated): REJECT** — Raven-internal,
  out of the ecosystem-research remit.
- Junk list (x402-mpp-analytics-dashboard, why-stellar-differentiators, noir-ultrahonk-status,
  compare-current-hackathons→dormant card): concur with skip.
