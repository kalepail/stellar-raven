---
id: q-tool-python-sdk
q: "Is there a Python SDK for Stellar, and does it support the new Stellar RPC as well as Horizon?"
category: tooling-infra
subcategory: sdks-python
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Python SDK is `py-stellar-base` (StellarCN), a community-maintained library.", weight: 5 }
  - { claim: "It communicates with both a Stellar Horizon server and a Stellar RPC server.", weight: 4 }
should_have:
  - { claim: "It is community-maintained (not SDF), unlike the JS and Go SDKs.", weight: 2 }
  - { claim: "Requires a recent Python (3.10+ / PyPy 3.10+).", weight: 1 }
nice_to_have:
  - { claim: "Installable via pip (`pip install stellar-sdk`).", weight: 1 }
  - { claim: "Disambiguates registries: the PyPI `stellar-sdk` (Python, py-stellar-base) is the current package, NOT the same as the deprecated unscoped npm `stellar-sdk` (the JS one moved to `@stellar/stellar-sdk`).", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Python is SDF-maintained or that there is no Python SDK.", weight: 3 }
  - { claim: "Do NOT say it only supports Horizon (it also supports Stellar RPC).", weight: 3 }
must_cite:
  - "developers.stellar.org client-sdks page or the StellarCN/py-stellar-base repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://pypi.org/project/stellar-sdk/
  - https://github.com/StellarCN/py-stellar-base
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Re-verified 2026-06-29: PyPI `stellar-sdk` latest 14.1.1 (community StellarCN/py-stellar-base), supports Python 3.10+/PyPy, talks to BOTH Horizon and Stellar RPC. Added registry disambiguation: PyPI `stellar-sdk` (current Python) ≠ deprecated unscoped npm `stellar-sdk` (JS moved to @stellar/stellar-sdk)."
---

## Reference answer (gospel)

Yes — the Python SDK is **`py-stellar-base`** (repo `StellarCN/py-stellar-base`), distributed on PyPI
as **`stellar-sdk`** (`pip install stellar-sdk`); it is **community-maintained** (StellarCN), not SDF
([PyPI](https://pypi.org/project/stellar-sdk/),
[StellarCN/py-stellar-base](https://github.com/StellarCN/py-stellar-base)).

- It communicates with **both** a Stellar **Horizon** server **and** a Stellar **RPC** server, and
  builds/signs transactions (including Soroban interactions).
- Requires a recent **Python (3.10+ / PyPy 3.10+)**.
- Note the registry collision: PyPI **`stellar-sdk`** (this Python package, latest `14.1.1` as of
  2026-06-29) is **not** the deprecated unscoped **npm** `stellar-sdk` — the JavaScript package moved to
  `@stellar/stellar-sdk`. Same string, different ecosystems.

Do not claim it's SDF-maintained, that none exists, or that it only supports Horizon (it also supports
Stellar RPC).

## Why these cards (routing rationale)

Factual SDK lookup → `stellar_docs_mcp`; `scout_repos` acceptable. Deep-research/general-web are misses.

## Edge / traps

Claiming SDF maintains it or that it is Horizon-only are the traps.
