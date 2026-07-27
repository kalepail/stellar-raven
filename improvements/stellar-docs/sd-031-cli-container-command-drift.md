---
id: sd-031
service: stellar-docs
status: fixed-upstream
discovered: 2026-07-11
upstreamTitle: Fix the removed stellar network container command
evidence:
  - live developers.stellar.org/docs/tools/lab/quickstart-with-lab rendered stellar network container start testnet on 2026-07-11
  - live Stellar Docs exact-phrase search returned that invalid command from the current page
  - stellar/stellar-docs main commit 45770fa8 retains the command in docs/tools/lab/quickstart-with-lab.mdx and the current Spanish docs retain stellar network container start local
  - local Stellar CLI 27.0.0 rejected network container and exposed stellar container start NETWORK with local, testnet, futurenet, and pubnet
  - Solo scratchpad 575 GT-55 primary process 3392 and pre-read-sealed blind process 3393
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2598
  - fixed upstream by https://github.com/stellar/stellar-docs/pull/2618 (merged 2026-07-16); issue https://github.com/stellar/stellar-docs/issues/2598 closed completed
  - live recheck 2026-07-27: the Lab quickstart teaches "stellar container start testnet", and the retired "stellar network container start" sequence no longer appears on the quickstart, container advanced-usage, or smart-contract setup pages
---

## Finding

Current Stellar Docs still publish the removed
`stellar network container start ...` command. The English Lab/Quickstart page
uses `stellar network container start testnet`, and a current Spanish dapp
template uses `stellar network container start local`. Stellar CLI 27.0.0 has
no `network container` subcommand; the current form is
`stellar container start <network>`.

The adjacent current Quickstart getting-started page already uses
`stellar container start local`, so the official docs teach mutually
incompatible forms. This is a docs-content defect, not an Algolia ranking
problem: the live index accurately exposes the stale source text.

## Evidence

GT-55 independently confirmed the command family from current official docs,
the current `stellar/stellar-docs` source, the CLI release, and local CLI help.
`stellar container start --help` listed `local`, `testnet`, `futurenet`, and
`pubnet`; `stellar network container start --help` failed with an unrecognized
subcommand before any container was started.

This does not duplicate `sd-006`, which concerned code-block indexing, or
`sd-026`, which concerns the deprecated contract optimize workflow.

## Recommendation

Replace every current how-to occurrence with
`stellar container start <network>`, preserve historical meeting notes only
when clearly labeled historical, and add a docs CI check that rejects the
retired `stellar network container` token sequence in current docs and
translations.
