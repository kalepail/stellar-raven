# Phase 2 results: soroban-c

Date: 2026-06-29
Worker: gp-p2-soroban-c / Solo process 2852

## Files answered

- `research/golden/soroban/q-sor-reflector-integration-code.md` - medium
- `research/golden/soroban/q-sor-require-auth-propagation.md` - high
- `research/golden/soroban/q-sor-sac-introspection.md` - high
- `research/golden/soroban/q-sor-scval-conversion.md` - high
- `research/golden/soroban/q-sor-sep41-transfer-vs-transferfrom.md` - high
- `research/golden/soroban/q-sor-stale-spec-after-upgrade.md` - medium
- `research/golden/soroban/q-sor-testing-negative-auth-events.md` - high
- `research/golden/soroban/q-sor-ttl-defaults-extend.md` - high
- `research/golden/soroban/q-sor-x-ray-bn254-sdk-gap.md` - medium

## Confidence distribution

- High: 6
- Medium: 3
- Low: 0

## Sources and classes used

- Official Stellar Docs: authorization, cross-contract auth, transaction simulation, SAC, token guide, XDR/SCVal, contract specs, state archival, TTL testing, ZK/privacy docs, CLI docs.
- Stellar protocol specs: SEP-40, SEP-41, CAP-0074, CAP-0075.
- Project primary sources: Reflector contract README and Reflector TOML.
- Local repo references: `research/golden/_dossiers/soroban.md`, `ecosystem-skills/skills/stellar-dev/soroban/SKILL.md`, `ecosystem-skills/skills/openzeppelin-stellar/*`, and Stellar Scout skill guidance.
- Empirical check: local `stellar --version` reports `stellar 25.2.0`; no mutating testnet commands were run.

## Phase 3 caveats

- Reflector live oracle contract IDs are rendered by the SPA. The README sample interface and TOML are verified, but Phase 3 should re-check the selected mainnet/testnet oracle IDs from the live Reflector page before treating any sample ID as current.
- JS SDK helper names and high-level bypass APIs should be verified against the current `@stellar/stellar-sdk` release because this repo does not vendor the package.
- Protocol 25 BN254/Poseidon CAP signatures are verified, but Phase 3 should verify exact live network protocol state and current `soroban-sdk` helper exposure before accepting a "works today on testnet/mainnet" answer.
