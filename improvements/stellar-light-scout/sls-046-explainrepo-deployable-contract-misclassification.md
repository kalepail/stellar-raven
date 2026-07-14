---
id: sls-046
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-11
evidence:
  - live re-check 2026-07-14: stellar-core repo explanation returns codeVerified.isDeployableContract=false; resolving PR https://github.com/Stellar-Light/stellarlight/pull/498
  - P4 N1 live scout.explainRepo({q:"Where are transaction result codes defined?",repo:"stellar/stellar-core"}) returned codeVerified.isDeployableContract:true while identifying stellar-core as the C++ core/XDR transaction-processing repository; solo://proj/49/scratchpad/super-corpus-rebuild--585
  - 2026-07-11 live re-check after Scout 1.7.15: the same explainRepo trigger returns codeVerified.isDeployableContract=false for stellar/stellar-core
---

## Finding

Scout marks `stellar/stellar-core` as `codeVerified.isDeployableContract:true`
even though the returned explanation identifies the repository as Stellar Core
C++ source. Consumers using the flag to select deployable Soroban contracts can
therefore misclassify core protocol software as a contract deployment.

## Evidence

P4 N1 executed the pinned explainRepo probe on 2026-07-11 and recorded a
successful source-grounded answer plus the contradictory classification field.
The same lane's draft explicitly guards callers against treating the flag as a
claim that Stellar Core itself is deployable. This is proposed until a direct
raw response fixture is attached to the upstream report.

## Recommendation

Correct the classification or rename/split it so it describes repository
contents rather than the repository itself. Add negative fixtures for
`stellar/stellar-core`, RPC, SDK, and tooling repositories, and retain a clear
positive contract-deployment definition.
