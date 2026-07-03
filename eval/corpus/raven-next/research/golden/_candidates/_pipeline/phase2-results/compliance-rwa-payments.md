# Phase 2 results — compliance-rwa-payments

Date: 2026-06-29
Batch: `compliance-rwa-payments`

## Files answered

- `research/golden/compliance-rwa-payments/q-crp-anchors-by-corridor.md`
- `research/golden/compliance-rwa-payments/q-crp-become-an-anchor-licensing.md`
- `research/golden/compliance-rwa-payments/q-crp-custodial-vs-noncustodial-wallets.md`
- `research/golden/compliance-rwa-payments/q-crp-ecommerce-payment-processor.md`
- `research/golden/compliance-rwa-payments/q-crp-export-tx-history-taxes.md`
- `research/golden/compliance-rwa-payments/q-crp-oz-rwa-erc3643-trex.md`
- `research/golden/compliance-rwa-payments/q-crp-regional-offramp-mobilemoney.md`
- `research/golden/compliance-rwa-payments/q-crp-remittance-founder-advisory.md`
- `research/golden/compliance-rwa-payments/q-crp-sdp-operation.md`
- `research/golden/compliance-rwa-payments/q-crp-tokenize-personal-rwa.md`

All 10 assigned files are now `status: answered` with `authored.phase2: 2026-06-29`, non-empty source lists, and filled reference dossier sections.

## Confidence distribution

- High: 2
- Medium: 8
- Low: 0

High-confidence files are the stable anchor/licensing and remittance rail-map questions. Medium-confidence files are mostly freshness-sensitive provider, tax-tool, draft-standard, SDP account-support, or legal/compliance questions.

## Sources and tool classes used

- Official Stellar docs and repos: anchors, Anchor Platform, MoneyGram Access, SDP configuration/API keys, Horizon/RPC, asset controls, SEP-8, SEP-10, SEP-12, SEP-24, SEP-31, SEP-38, SEP-57.
- Stellar Light Scout HTTP: project/research/repo queries for anchors/off-ramps, MoneyGram, HoneyCoin, Decaf, OpenZeppelin/RWA, and RWA tokenization context.
- Parallel CLI search: MoneyGram Ramps current limits/countries, OpenZeppelin SEP-57/T-REX status, SDP operational docs, and CoinTracker/Stellar tax import support.
- Provider/project sources: MoneyGram developer docs, MoneyGram/Stellar Ramps page, Rozo Intent Pay docs, NOWPayments plugin/API docs, CoinTracker Stellar integration, Franklin Templeton FOBXX page.
- Local ecosystem skills: `stellar-dev/assets`, `stellar-dev/standards`, `stellar-dev/agentic-payments` excerpts, `lumenloop` ecosystem routing guidance, and `stellar-light/stellar-scout` routing guidance.

## Phase 3 caveats

- Corridor, country, mobile-money, and fee claims are intentionally not static. Re-query provider docs/directories for any exact country, rail, limit, or fee used in scoring.
- `q-crp-sdp-operation`: recipient support for contract/C accounts, muxed accounts, sponsored accounts, and arbitrary custodial destinations remains the sharpest unverified point. Phase 3 should inspect current SDP docs/source before accepting any exact account-type claim.
- `q-crp-oz-rwa-erc3643-trex`: SEP-0057 is Draft and was verified as updated 2026-06-11. Re-check current status/API names before treating function-level details as stable.
- `q-crp-export-tx-history-taxes`: CoinTracker support was verified through Parallel extraction and URL reachability; browser-check exact provider wording if the review depends on direct-sync versus CSV-import phrasing.
- High-stakes compliance/RWA answers are deliberately bounded. Phase 3 should reject any drift into definitive legal/tax/licensing advice without jurisdiction-specific primary authority.
