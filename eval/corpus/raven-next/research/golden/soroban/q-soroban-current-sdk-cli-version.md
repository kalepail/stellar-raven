---
id: q-soroban-current-sdk-cli-version
q: "What are the current soroban-sdk and stellar-cli versions I should be using, and what protocol do they target?"
category: soroban
subcategory: tooling-cli
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_repos]
acceptable_cards: [stellar_docs_mcp, scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Should report the latest released soroban-sdk and stellar-cli versions (as of mid-2026, soroban-sdk ~v26.x and stellar-cli ~v27.x targeting Protocol 27).", weight: 4 }
  - { claim: "Should flag that exact version numbers move and must be checked against the live GitHub releases / crates.io rather than asserted as fixed.", weight: 4 }
should_have:
  - { claim: "SDF supports the two most recent SDK majors with critical fixes, so pin to a supported major.", weight: 3 }
  - { claim: "Run the latest CLI to get the newest protocol's features (e.g., P27 AddressV2 auth).", weight: 2 }
nice_to_have:
  - { claim: "Points at rs-soroban-sdk releases, stellar-cli releases, or the Software Versions docs page.", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a version number as the permanent current version without noting it may be stale.", weight: 4 }
  - { claim: "Do NOT recommend the deprecated `soroban` binary name as the current CLI.", weight: 2 }
must_cite:
  - "The stellar-cli / rs-soroban-sdk GitHub releases or developers.stellar.org software-versions page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/rs-soroban-sdk/releases
  - https://github.com/stellar/stellar-cli/releases
  - https://developers.stellar.org/docs/networks/software-versions
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness:true (weekly). Re-checked GitHub releases 2026-06-29: stable soroban-sdk is v26.1.0 (v27.0.0-rc.1 is a pre-release) and stellar-cli is v27.0.0 (latest), targeting Protocol 27 — numbers from the 2026-06-22 review still hold. DO NOT gate on exact numbers — gate on 'report the latest AND flag it must be re-checked against GitHub releases / crates.io / software-versions'."
---

## Reference answer (gospel)

As of **2026-06-29**, the live release pages show **soroban-sdk ≈ v26.x** (latest stable v26.1.0;
v27.0.0-rc.1 is a pre-release) and **stellar-cli ≈ v27.x** (latest v27.0.0), with the CLI **targeting
Protocol 27**. [sdk-rel][cli-rel]

- **Always re-check the live source** — these move (often weekly), so a correct answer reports the
  latest **and flags that the numbers may be stale**, pointing at **rs-soroban-sdk releases**,
  **stellar-cli releases**, or the **Software Versions** docs page rather than asserting a fixed
  version. [sw-versions]
- **SDF supports the two most recent SDK majors** with critical fixes — pin to a supported major.
- **Run the latest CLI** to get the newest protocol's features (e.g., P27 AddressV2 auth entries).

Traps: stating a version number as permanently current without a staleness caveat; or recommending the
deprecated **`soroban`** binary name as the current CLI (it is **`stellar`**).

## Why these cards (routing rationale)

Current-version lookup over graded repos/releases → `scout_repos`; docs plus live web/source discovery
(`perplexity_search`/`parallel_search`) acceptable for confirming the latest release/crates.io metadata.
Deep-research tier stays banned.

## Edge / traps

Asserting a version as permanently current; recommending the old `soroban` binary.
