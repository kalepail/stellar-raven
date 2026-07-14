---
id: sls-047
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-11
evidence:
  - live re-check 2026-07-14: zero-knowledge repo search leads with code-verified Stellar evidence and no generic Noir result; resolving PR https://github.com/Stellar-Light/stellarlight/pull/498
  - P4 H1 live scout.searchRepos(q="zero-knowledge") ranked noir-lang/noir first by repoScore although its codeVerified.stellarProof was none, ahead of Stellar deployable verifier/game repositories; solo://proj/49/scratchpad/super-corpus-rebuild--585
  - 2026-07-11 live re-check after Scout 1.7.15: the first five zero-knowledge results carry stellarEvidence=code-verified and the generic noir-lang/noir dependency no longer appears ahead of them
---

## Finding

Scout's generic repository score can outrank Stellar-specific implementations
with a general-purpose ZK dependency for a Stellar-scoped query. The top
`noir-lang/noir` result advertises no Stellar proof while deployable Stellar
verifier/game repositories follow it, encouraging an answer that mistakes a
toolchain dependency for a local reference implementation.

## Evidence

H1 recorded the live `zero-knowledge` query and the returned
`codeVerified.stellarProof` values on 2026-07-11. The observation is distinct
from sls-025's alias-recall defect: all of these results were returned, but
their ranking lacks a query-intent relevance tie-break.

## Recommendation

When query text contains Stellar/Soroban intent, apply a transparent
Stellar-proof/repository-role tie-break and expose why a general dependency is
ranked. Preserve general tools, but label them as toolchains rather than
deployable Stellar examples.
