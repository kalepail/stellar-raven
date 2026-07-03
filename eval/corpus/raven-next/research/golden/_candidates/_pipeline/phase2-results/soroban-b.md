# Phase 2 Results: soroban-b

Date: 2026-06-29
Worker: gp-p2-soroban-b

## Files Answered

- `research/golden/soroban/q-sor-evm-to-soroban-porting.md` — high
- `research/golden/soroban/q-sor-force-fast-archival-localnet.md` — medium
- `research/golden/soroban/q-sor-freeze-account-allowance.md` — high
- `research/golden/soroban/q-sor-index-sac-vs-sep41-events.md` — high
- `research/golden/soroban/q-sor-msg-sender-equivalent.md` — high
- `research/golden/soroban/q-sor-native-xlm-sac-address.md` — high
- `research/golden/soroban/q-sor-nft-mint-on-soroban.md` — medium
- `research/golden/soroban/q-sor-p23-auto-restore-extendto.md` — high
- `research/golden/soroban/q-sor-recurring-escrow-patterns.md` — high

## Confidence Distribution

- High: 7
- Medium: 2
- Low: 0

## Sources / Classes Used

- Official Stellar Docs MCP / developers.stellar.org:
  - Soroban authorization and transaction authorization entries.
  - Storage, state archival, Protocol 23 restore flow, event/RPC retention.
  - SAC, token interface, payments, OpenZeppelin Stellar tooling, NFT examples.
  - Account signer thresholds and master-key weight behavior.
- Stellar protocol repository:
  - SEP-41 token interface and event shapes.
  - CAP-67 unified asset event shapes.
- Stellar Light Scout:
  - Cross-checks for SAC/native asset docs, token examples, authorization/allowance, and OpenZeppelin/Solang repository discovery.
- Empirical checks:
  - `stellar 25.2.0` used to derive native XLM and USDC SAC IDs for testnet/mainnet on 2026-06-29.
- Local mirrored skills:
  - `ecosystem-skills/skills/stellar-dev/soroban/SKILL.md`
  - `ecosystem-skills/skills/openzeppelin-stellar/develop-secure-contracts/SKILL.md`
  - `ecosystem-skills/skills/openzeppelin-stellar/setup-stellar-contracts/SKILL.md`
  - `ecosystem-skills/skills/openzeppelin-stellar/upgrade-stellar-contracts/SKILL.md`
  - `ecosystem-skills/skills/stellar-light/stellar-scout/SKILL.md`

## Unverified Caveats For Phase 3

- `q-sor-force-fast-archival-localnet`: exact quickstart/stellar-core config flag names for forcing very small local state-archival TTLs are version-sensitive. The answer intentionally gates on verified semantics and asks Phase 3 to spot-check exact local CLI/config names if the final golden wants command-level flags.
- `q-sor-nft-mint-on-soroban`: Soroban/OpenZeppelin NFT support is verified. The classic single-unit asset plus SEP-39/Manage Data metadata branch was kept at comparison level; Phase 3 should verify exact SEP-39 metadata details before hardening that branch.
- `q-sor-index-sac-vs-sep41-events`: CAP-67/SEP-41 topic shapes are verified. Phase 3 may spot-check the exact JSON-RPC `getEvents` field names (`id`/cursor shape) against a live RPC response if the final rubric tests SDK-specific wording.

## Verification Notes

- Sanity check found no remaining `status: draft`, `phase2: null`, empty `sources: []`, or Phase-2 placeholder body text in the nine assigned files.
- No files outside the `soroban-b` batch were edited except this required result artifact.
- No git commit was made.
