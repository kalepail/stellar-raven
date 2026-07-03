---
id: q-soroban-sac-balance-storage
q: "Where do SAC token balances live for a classic G-account versus a contract holder, and what integer types are used?"
category: soroban
subcategory: sac
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "For a classic `Address::Account` (G-account) holder, the SAC balance lives in the account's trustline as an i64.", weight: 5 }
  - { claim: "For an `Address::Contract` (C-address) holder, the SAC balance lives in contract storage as an i128.", weight: 5 }
should_have:
  - { claim: "This means a G-account must have a trustline (or use the native asset) to hold the SAC balance, while contract holders do not use trustlines.", weight: 3 }
nice_to_have:
  - { claim: "Notes Protocol 26 / CAP-73 adds a SAC `trust` function so a contract can open a trustline for a G-account.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim all SAC balances are stored uniformly in contract storage regardless of holder type.", weight: 4 }
  - { claim: "Do NOT swap the integer widths (e.g., say trustlines are i128 and contract balances i64).", weight: 4 }
must_cite:
  - "The developers.stellar.org SAC documentation (balance storage section)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "i64-trustline vs i128-contract-storage verified verbatim against the SAC docs (64-bit vs 128-bit signed). Swapping is the trap. CAP-73 SAC `trust` re-verified as Protocol 26 / Implemented (gh api) on 2026-06-29. Differentiation: this file owns the focused storage-internals lane (where balances live + integer widths); the operational 'does a C-address need a trustline / how to send USDC' how-to is q-sor-contract-trustlines-c-address."
---

## Reference answer (gospel)

SAC balances live in **different places with different integer widths** depending on the holder type:
[sac]

- **Classic `Address::Account` (G-account) holder** — the balance lives in the account's **trustline**
  (or the account itself, for native XLM) and is a **64-bit signed integer (i64)**; operations
  exceeding i64 fail. [sac]
- **`Address::Contract` (C-address) holder** — the balance lives in **contract storage** (not a
  trustline) as a **128-bit signed integer (i128)**; the authorization state is also kept in contract
  storage. [sac]

Consequence: a G-account must hold a **trustline** (or use native XLM) to carry the SAC balance, while
contract holders need no trustline. Protocol 26 / CAP-73 adds a SAC `trust` function so a contract can
open a trustline on a G-account's behalf.

Traps: claiming all SAC balances sit uniformly in contract storage; or swapping the widths (trustline
i128 / contract i64).

## Why these cards (routing rationale)

SAC internals fact → `stellar_docs_mcp`. `scout_research`/`scout_repos` acceptable.

## Edge / traps

Uniform-storage claim; swapping the i64/i128 widths.
