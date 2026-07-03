---
id: q-tool-smart-wallet-repos-discovery
q: "Show me open-source code for Stellar passkey / smart-wallet implementations I can learn from."
category: tooling-infra
subcategory: passkeys-discovery
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_repos]
acceptable_cards: [stellar_docs_mcp, scout_research]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Returns concrete Stellar/Soroban GitHub repos for passkeys/smart wallets, ranked by repoScore/activity.", weight: 5 }
  - { claim: "Surfaces real candidates (e.g. passkey-kit, smart-account-kit, OpenZeppelin stellar-contracts, example smart-wallet demos) rather than prose-only.", weight: 3 }
should_have:
  - { claim: "Treats this as code/repo discovery, not a conceptual docs question.", weight: 2 }
nice_to_have:
  - { claim: "Notes which are SDK kits vs reference/demo apps.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate repo names/URLs that don't exist.", weight: 4 }
must_cite:
  - "Scout repo results (stellarlight.xyz/api/repos) and/or the GitHub repos returned."
must_not_use_tier: []

pass_threshold: 0.68
weight_profile: standard

sources:
  - https://stellarlight.xyz/api/repos/search
  - https://github.com/kalepail/passkey-kit
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified Scout /api/repos/search returns graded Stellar repos; real passkey/smart-wallet candidates confirmed (kalepail/passkey-kit, smart-account-kit, OpenZeppelin stellar-contracts). Code-shaped → scout_repos. Fabrication is the trap."
---

## Reference answer (gospel)

This is **repo/code discovery** → the **Scout repos** surface (`stellarlight.xyz/api/repos/search`),
which returns graded Stellar/Soroban GitHub repos ranked by **repoScore/activity** — not a conceptual
docs page.

Real candidates it surfaces for passkeys / smart wallets:
- **`kalepail/passkey-kit`** — TS SDK for Stellar passkey smart wallets (legacy precursor to
  OpenZeppelin Smart Accounts; pairs with Launchtube).
- **`smart-account-kit`** — current TS SDK for OpenZeppelin Smart Account contracts (passkey/Ed25519/
  policy signers).
- **OpenZeppelin `stellar-contracts`** — the audited contract library underneath Smart Accounts.
- Example/demo smart-wallet apps (e.g. passkey reference implementations).

Distinguish SDK **kits** from **reference/demo** apps; do not fabricate repo names/URLs.

## Why these cards (routing rationale)

Repo/code discovery → `scout_repos`. `stellar_docs_mcp` acceptable for the smart-wallets guide. Deep-research/general-web are misses.

## Edge / traps

Hallucinated repos are the trap.
