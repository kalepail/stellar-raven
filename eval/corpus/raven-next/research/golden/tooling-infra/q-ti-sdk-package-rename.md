---
id: q-ti-sdk-package-rename
q: "Which Stellar SDK packages are current vs deprecated — `stellar-sdk` → `@stellar/stellar-sdk` on npm, `github.com/stellar/go` → `…/go-stellar-sdk` in Go — and what's the latest version?"
category: tooling-infra
subcategory: sdks
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [perplexity_search, parallel_search, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States that the current JavaScript package is scoped `@stellar/stellar-sdk`; the unscoped `stellar-sdk` npm package is deprecated/moved.", weight: 5 }
  - { claim: "States the current Go module path is `github.com/stellar/go-stellar-sdk`, not legacy `github.com/stellar/go` imports.", weight: 5 }
  - { claim: "Includes a current-date version check from package registries/releases rather than relying only on docs; as of 2026-06-29, npm `@stellar/stellar-sdk` latest is 16.0.1 and `go-stellar-sdk` latest GitHub release is v0.6.0.", weight: 5 }
  - { claim: "Mentions `@stellar/stellar-base` was folded into `@stellar/stellar-sdk` in v16-era guidance, so imports should consolidate on `@stellar/stellar-sdk`.", weight: 3 }
should_have:
  - { claim: "Cites developers.stellar.org SDK docs for supported SDK landscape and Go package examples.", weight: 3 }
  - { claim: "Advises checking npm/GitHub immediately before pinning because this is freshness-sensitive.", weight: 3 }
nice_to_have:
  - { claim: "Mentions SDF-maintained JS and Go SDKs versus community SDKs.", weight: 1 }
must_avoid:
  - { claim: "Do NOT call old package names current when registry metadata says they moved/deprecated.", weight: 5 }
  - { claim: "Do NOT freeze latest versions without a dated verification snapshot.", weight: 5 }
must_cite:
  - "Official docs plus npm/GitHub registry or release URLs for current version claims."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - "https://www.npmjs.com/package/@stellar/stellar-sdk"
  - "https://www.npmjs.com/package/stellar-sdk"
  - "https://github.com/stellar/go-stellar-sdk/releases/tag/v0.6.0"
  - "https://developers.stellar.org/docs/data/indexers/build-your-own/ingest-sdk"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Live checks run 2026-06-29: `npm view @stellar/stellar-sdk version dist-tags`, `npm view stellar-sdk version deprecated`, `go list -m -versions github.com/stellar/go-stellar-sdk`, and `gh api repos/stellar/go-stellar-sdk/releases/latest`."
---

## Reference answer (gospel)

Use `@stellar/stellar-sdk` for JavaScript/TypeScript. A live npm check on 2026-06-29 reported `@stellar/stellar-sdk` latest as `16.0.1`; the old unscoped `stellar-sdk` package reported version `13.3.0` with the deprecation message that it has moved to `@stellar/stellar-sdk`. The tooling-infra dossier also notes the v16 consolidation of `@stellar/stellar-base` into `@stellar/stellar-sdk`, so new imports should come from the scoped package.

Use `github.com/stellar/go-stellar-sdk` for Go. Stellar docs for the Ingest SDK and ledger backends show packages under `github.com/stellar/go-stellar-sdk/...`, and a live GitHub release check on 2026-06-29 reported latest release `v0.6.0`, published 2026-06-09. `go list -m -versions github.com/stellar/go-stellar-sdk` returned versions through `v0.6.0`.

Because this is version-sensitive, a correct answer should give the package rename and include a verification date. Before changing production pins, re-run npm/GitHub/go module checks.

## Why these cards (routing rationale)

`stellar_docs_mcp` is expected for official SDK package-path guidance. `parallel_search`, `perplexity_search`, or `scout_repos` are acceptable because latest version/deprecation state is registry/repo metadata and changes over time.

## Edge / traps

The trap is answering from old StackOverflow-era package names. `stellar-sdk` and `github.com/stellar/go` should not be presented as current names if the registry/docs point to the scoped npm package and `go-stellar-sdk` module.
