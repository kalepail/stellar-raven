# Phase 2 results: protocol-core-a

Date: 2026-06-29

## Files answered

- `research/golden/protocol-core/q-pc-account-activation-not-found.md` — high
- `research/golden/protocol-core/q-pc-account-merge-reclaim-reserve.md` — high
- `research/golden/protocol-core/q-pc-address-types-strkey.md` — high
- `research/golden/protocol-core/q-pc-bucketlist-vs-merkle-inclusion-proof.md` — medium
- `research/golden/protocol-core/q-pc-fee-bump-channel-accounts-feepool.md` — medium
- `research/golden/protocol-core/q-pc-l2-payment-channels-starlight.md` — medium
- `research/golden/protocol-core/q-pc-memos-reference.md` — high
- `research/golden/protocol-core/q-pc-multisig-setup-lifecycle.md` — high
- `research/golden/protocol-core/q-pc-muxed-accounts.md` — high

## Confidence distribution

- High: 6
- Medium: 3
- Low: 0

## Sources and classes used

- Stellar Docs MCP / developers.stellar.org: account creation, minimum balance, AccountMerge result codes, ledger header fields, LedgerCloseMeta, fee-bump transactions, channel accounts, inclusion fees, memos, pooled/muxed accounts, multisig, SetOptions.
- Stellar protocol GitHub: SEP-0023 StrKey, CAP-0015 fee-bump transactions, CAP-0021 generalized preconditions, CAP-0027 muxed accounts, CAP-0040 signed-payload signer.
- Stellar.org / project primary sources: Starlight/payment-channel experiment blog and `stellar/starlight` repository for live-status caution.
- Existing golden prior-art notes: fee-pool wording cross-checked to avoid saying fees are validator rewards or EIP-1559-style burns.

## Phase 3 caveats

- `q-pc-bucketlist-vs-merkle-inclusion-proof`: Phase 2 verified ledger-header and archive semantics but did not find a current one-call light-client transaction-inclusion proof API. Phase 3 should attack this with stellar-core/history tooling if needed.
- `q-pc-fee-bump-channel-accounts-feepool`: Fee-bump/channel mechanics are strong; fee-pool sentence should be re-verified directly against current stellar-core/protocol source before treating it as tokenomics ground truth.
- `q-pc-l2-payment-channels-starlight`: Current status is freshness-sensitive. Phase 2 found historical/prototype evidence and no primary evidence of live production Starlight infrastructure as of 2026-06-29; Phase 3 should re-check repo/archive status and any newer SDF/ecosystem announcements.
