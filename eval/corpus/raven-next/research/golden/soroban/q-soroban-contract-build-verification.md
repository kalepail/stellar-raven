---
id: q-soroban-contract-build-verification
q: "How can I verify a deployed Soroban contract's WASM matches its published source, and which Stellar standards cover it?"
category: soroban
subcategory: build-verification
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Verification works by building the WASM in CI and producing GitHub Attestations (SEP-55, e.g. the soroban-build-workflow) and/or by reproducibly rebuilding it and comparing bytes (SEP-58).", weight: 5 }
  - { claim: "The WASM carries contractmetav0 metadata (e.g. a source_repo / source_sha256 entry) linking it to the source.", weight: 4 }
  - { claim: "Build/verification info is surfaced in tooling such as Stellar Lab / explorers (Build Info) or `stellar contract info meta`.", weight: 2 }
  - { claim: "The relevant standards are SEP-55 (Contract Build Verification, Draft) and SEP-58 (Contract Build Reproducibility for Verification, Draft).", weight: 5 }
should_have:
  - { claim: "'Build verified' attests that the published build workflow produced the WASM, not that the source is safe/audited.", weight: 3 }
nice_to_have:
  - { claim: "Notes these SEPs are Draft and subject to change.", weight: 1 }
must_avoid:
  - { claim: "Do NOT call contract build verification SEP-49 (SEP-49 is Upgradeable Contracts).", weight: 5 }
  - { claim: "Do NOT claim Stellar stores the contract source code on-chain.", weight: 5 }
must_cite:
  - "A primary developers.stellar.org / SEP repo source for SEP-55 / SEP-58 and the build-verification workflow."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0058.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: medium
notes: "Freshness:true — SEP-55/SEP-58 are Draft and numbers/titles can change. VERIFIED against the SEP repo (2026-06): SEP-55 = 'Contract Build Verification' (Draft, v0.4.1), attestation-based via GitHub Attestations + contractmetav0 source_repo; SEP-58 = 'Contract Build Reproducibility for Verification' (Draft, v0.5.0), rebuild-based via bldimg/bldopt/source_sha256 meta, explicitly complementary to SEP-55. NOT SEP-49 (that is Upgradeable Contracts). Both confirm Stellar does not store source on-chain. SEP-58 title is 'Contract Build Reproducibility for Verification' (the rubric/body now match)."
---

## Reference answer (gospel)

You verify a deployed Soroban contract's WASM against published source via **reproducible/attested
builds** — there are **two complementary, Draft standards**:

- **SEP-55 "Contract Build Verification" (Draft)** — *attestation-based*. A CI workflow (e.g. the
  stellar-expert **`soroban-build-workflow`** GitHub Action) builds the WASM and produces **GitHub
  Attestations**; the WASM embeds a **`contractmetav0`** `source_repo=github:<org>/<repo>` (and
  optional `home_domain`) entry. A verifier fetches the attestation by the WASM's SHA-256 hash and
  confirms it was built from that repo.
- **SEP-58 "Contract Build Reproducibility for Verification" (Draft)** — *rebuild-based*. It defines a
  vocabulary (`bldimg` digest-pinned build image, `bldopt` flags, `source_sha256`/`source_uri`) so an
  independent party can **rebuild the WASM and compare bytes** without trusting a CI. It is explicitly
  **complementary to SEP-55**; a contract can carry both.

These are surfaced by tooling (e.g. **Stellar Lab / explorers Build Info**, `stellar contract info
meta`).

Important nuances: "**build verified**" attests **how** the WASM was built (the workflow/source), **not**
that the source is safe or audited. And Stellar does **not** store contract source code on-chain — only
metadata + attestations pointing to it.

## Why these cards (routing rationale)

Standards + tooling defined in first-party docs / the SEP repo → **`stellar_docs_mcp`**, with
`scout_research` acceptable for corroboration. Deep-research tier is governance-forbidden.

## Edge / traps

Traps: (a) calling it **SEP-49** (that is **Upgradeable Contracts**); (b) claiming Stellar stores
**source code on-chain** (it stores metadata + attestations, not source). Both are weight-5
`must_avoid`.
