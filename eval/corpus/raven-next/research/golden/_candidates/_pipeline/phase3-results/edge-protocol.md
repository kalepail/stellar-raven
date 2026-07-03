# Phase 3 results: edge-governance + protocol-core

Reviewer: `gp3-skeptic-edge-protocol` (Solo process 2857)  
Date: 2026-06-29

## Files reviewed

Reviewed and marked `status: reviewed` with `authored.reviewed: 2026-06-29`:

- `research/golden/edge-governance/q-edge-pi-network-relationship.md`
- `research/golden/edge-governance/q-edge-exchange-memo-lost-funds.md`
- `research/golden/edge-governance/q-edge-lost-secret-key-recovery.md`
- `research/golden/edge-governance/q-edge-stuck-exchange-network-maintenance.md`
- `research/golden/edge-governance/q-edge-stella-not-custodian.md`
- `research/golden/edge-governance/q-edge-talk-to-human-recover-funds.md`
- `research/golden/edge-governance/q-edge-legacy-2014-account-recovery.md`
- `research/golden/edge-governance/q-edge-asset-site-scam-detection.md`
- `research/golden/edge-governance/q-edge-1xlm-activation-fee.md`
- `research/golden/edge-governance/q-edge-stolen-funds-report-malicious-address.md`
- `research/golden/edge-governance/q-edge-leaked-key-race-the-bot.md`
- `research/golden/edge-governance/q-edge-qfs-qsi-conspiracy-brand-abuse.md`
- `research/golden/edge-governance/q-edge-mining-free-xlm-coinbots.md`
- `research/golden/edge-governance/q-edge-xlm-price-investment-advice.md`
- `research/golden/edge-governance/q-edge-send-me-free-xlm.md`
- `research/golden/edge-governance/q-edge-ssrf-cloud-metadata-exfil.md`
- `research/golden/edge-governance/q-edge-backend-query-injection.md`
- `research/golden/edge-governance/q-edge-fake-backup-faucet-wallet.md`
- `research/golden/edge-governance/q-edge-jailbreak-generate-secret-keys.md`
- `research/golden/edge-governance/q-edge-output-rendering-xss.md`
- `research/golden/edge-governance/q-edge-validators-reverse-tx-fork-detection.md`
- `research/golden/edge-governance/q-edge-scf-v7-centralization-myths.md`
- `research/golden/edge-governance/q-edge-metamask-evm-mental-model.md`
- `research/golden/edge-governance/q-edge-retail-everyday-use-eli5.md`
- `research/golden/edge-governance/q-edge-stella-identity-model.md`
- `research/golden/protocol-core/q-pc-memos-reference.md`
- `research/golden/protocol-core/q-pc-muxed-accounts.md`
- `research/golden/protocol-core/q-pc-account-merge-reclaim-reserve.md`
- `research/golden/protocol-core/q-pc-sponsored-reserves.md`
- `research/golden/protocol-core/q-pc-multisig-setup-lifecycle.md`
- `research/golden/protocol-core/q-pc-account-activation-not-found.md`
- `research/golden/protocol-core/q-pc-fee-bump-channel-accounts-feepool.md`
- `research/golden/protocol-core/q-pc-sequence-numbers-ordering-replace.md`
- `research/golden/protocol-core/q-pc-address-types-strkey.md`
- `research/golden/protocol-core/q-pc-tx-finality-failure-semantics.md`
- `research/golden/protocol-core/q-pc-practical-fee-setting.md`
- `research/golden/protocol-core/q-pc-protocol-upgrade-timing.md`
- `research/golden/protocol-core/q-pc-quantum-preparedness-dormant.md`
- `research/golden/protocol-core/q-pc-scp-message-types-overlay.md`
- `research/golden/protocol-core/q-pc-bucketlist-vs-merkle-inclusion-proof.md`
- `research/golden/protocol-core/q-pc-l2-payment-channels-starlight.md`
- `research/golden/protocol-core/q-pc-surge-griefing-threat-model.md`

## Defects fixed

| File | Defect | Fix | Source/check |
| --- | --- | --- | --- |
| `q-edge-retail-everyday-use-eli5.md` | Source URL `developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/lumens` returned 404. | Replaced with `https://developers.stellar.org/docs/learn/fundamentals/lumens`; marked reviewed. | `curl -L` URL check; Stellar Docs MCP result for "Lumens (XLM)" confirms XLM native-asset, fee, rent, and minimum-balance support. |
| `q-edge-stella-identity-model.md` | Worklist marked this as RESEARCH, but file was still a draft generic assistant-meta decline with no reviewable dossier. | Repaired into a bounded product-fact golden: Raven/Stella is an MCP research/context service, public contract is `raven_start` -> `raven_poll` -> `raven_result`, no token/wallet/API claims without source, local repo docs as intentional sources; marked reviewed. | `README.md`, `AGENTS.md`, `wrangler.jsonc`, `src/mcp/raven-mcp.ts`. |
| `q-pc-l2-payment-channels-starlight.md` | Current live-status support was weak ("no primary evidence found"). | Added explicit GitHub archived/deprecated repository evidence and updated the dossier/notes to state Starlight is not supported as live production infrastructure on the 2026-06-29 snapshot; marked reviewed. | `gh api repos/stellar/starlight` returned `archived: true` and redirect target `https://github.com/stellar-deprecated/starlight`. |
| Seven owned answer files using block `claim:` syntax | The current golden compiler only extracts quoted `claim: "..."` values; unquoted block claims caused must-have guidance to be dropped for answering cases. | Normalized owned unquoted `claim:` lines to quoted strings. | `npx tsx` migration check over owned IDs reported `shouldFireWithoutMustInclude: []`. |
| DECLINE/governance draft files | Phase 1 governance files were complete but still `status: draft` with no review date. | Adversarially checked routing/governance policy, forbidden-card policy, and no-citation behavioral scope; marked reviewed while leaving `phase2: null` where Phase 2 was intentionally skipped. | `research/golden/README.md` ban policy and `_meta/CARDS.md`; source URL and card validation checks. |

## Verification performed

- Stellar Docs MCP search confirmed the replacement XLM/lumens source and current official docs support.
- `curl -L` checked every HTTP(S) source URL in the owned slice; all returned HTTP 200 after fixes.
- Scout endpoint checks:
  - `https://stellarlight.xyz/api/research?q=SCF%20v7%20milestone%2010%25%20upfront%20centralization%20mainnet&limit=3`
  - `https://stellarlight.xyz/api/research?q=Stellar%20memos%20muxed%20accounts%20sponsored%20reserves%20account%20merge%20fee%20bump&limit=5`
  - `https://stellarlight.xyz/api/research?q=Stellar%20Starlight%20payment%20channels%20CAP-21%20CAP-40&limit=3`
- GitHub check: `gh api repos/stellar/starlight --jq '{archived, pushed_at, updated_at, description, html_url}'`.
- Owned-card validation found no invalid `expected_cards`, `acceptable_cards`, or `forbidden_cards`.
- Owned migration sanity check found 42 owned files and no should-fire file with empty must-include guidance.

## Residual risks

- Freshness-sensitive files still require re-check after their horizon: Protocol 27 mainnet vote timing after 2026-07-08, SCF award terms/deadlines after the active round, Starlight/L2 status yearly, Pi relationship yearly, and QPP if a finalized CAP/dormant-account rule appears.
- `q-edge-stella-identity-model.md` intentionally cites repo-local product sources, because the fact under test is Raven/Stella self-description rather than an external Stellar ecosystem fact.
- Broad `npm run test:golden` fails in this in-progress candidate state because `migrateGoldenCorpus()` sees 539 markdown questions while `compiled/golden.json` still contains the shipped 395-question corpus. This is a Phase 4 assembly/compile concern, not an owned-slice parse failure.

## Could not validate

- No owned file was left unvalidated. The only unresolved item is freshness after future dates/events, recorded above as residual risk.
