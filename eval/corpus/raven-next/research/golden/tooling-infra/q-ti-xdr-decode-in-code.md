---
id: q-ti-xdr-decode-in-code
q: "How do I decode/encode Stellar XDR in code — transaction result XDR & resultCodes, TransactionMetaV4/operation meta, building ledger keys, computing a tx hash from an envelope (V0→V1), and decoding ScVal return values?"
category: tooling-infra
subcategory: encoding-diagnostics
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains XDR is Stellar's binary serialization for ledger data, transactions, results, history, and messages; SDKs provide typed wrappers and Lab can decode XDR.", weight: 5 }
  - { claim: "Separates Horizon XDR fields (`envelope_xdr`, `result_xdr`, `result_meta_xdr`, `fee_meta_xdr`) from RPC fields generally suffixed `Xdr`.", weight: 4 }
  - { claim: "Explains resultCodes are Horizon-normalized protocol result codes surfaced in error `extras`, while lower-level code can decode `TransactionResult` XDR directly.", weight: 4 }
  - { claim: "Points developers to official SDK XDR bindings (`@stellar/stellar-sdk`/`xdr`, Go `xdr`, Rust `stellar-xdr`) for TransactionMeta/OperationMeta/LedgerKey handling rather than ad hoc base64 parsing.", weight: 5 }
  - { claim: "Explains ScVal return values should be decoded via SDK conversion helpers such as JS `scValToNative`/`nativeToScVal` or typed bindings.", weight: 4 }
  - { claim: "Mentions tx hash computation depends on the transaction envelope/network passphrase/signature base; normalize V0/V1 through SDK transaction/envelope parsing rather than hashing raw base64 blindly.", weight: 4 }
should_have:
  - { claim: "Mentions Ingest SDK for historical ledger meta and OperationMeta parsing.", weight: 2 }
  - { claim: "Mentions current TransactionMetaV4/CAP-era metadata can change with protocol upgrades, so pin SDK versions.", weight: 2 }
nice_to_have:
  - { claim: "Mentions Scout surfaced `stellar-expert/tx-meta-effects-parser` as a community low-level parser, but official SDKs remain primary.", weight: 1 }
must_avoid:
  - { claim: "Do NOT parse XDR by hand as arbitrary JSON/base64 strings when SDK XDR types exist.", weight: 5 }
  - { claim: "Do NOT confuse result-code strings with operation meta or diagnostic events.", weight: 4 }
  - { claim: "Do NOT compute transaction hashes without the correct network passphrase/signature base semantics.", weight: 5 }
must_cite:
  - "Official XDR/data format docs."
  - "Horizon/RPC XDR field docs or error response docs."
  - "Official SDK docs/repositories for typed XDR conversion."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/learn/fundamentals/data-format/xdr
  - https://developers.stellar.org/docs/data/apis/horizon/api-reference/structure/xdr
  - https://developers.stellar.org/docs/data/apis/rpc/api-reference/structure/data-format
  - https://github.com/stellar/js-stellar-sdk
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified with Stellar Docs MCP, Scout repos search, and GitHub repo URL for js-stellar-sdk. Phase 3 may add exact code snippets if desired, but this golden's rubric focuses on correct boundaries."
---

## Reference answer (gospel)

Use SDK XDR types, not ad hoc parsing. Stellar stores and communicates ledger data, transactions, results, history, and messages in XDR; SDKs convert XDR into typed/friendlier formats [XDR docs](https://developers.stellar.org/docs/learn/fundamentals/data-format/xdr). Horizon exposes `envelope_xdr`, `result_xdr`, `result_meta_xdr`, and `fee_meta_xdr` on transaction responses [Horizon XDR](https://developers.stellar.org/docs/data/apis/horizon/api-reference/structure/xdr). RPC returns base64 XDR fields, usually suffixed `Xdr`, when simulating/sending transactions and retrieving transactions, ledgers, and ledger entries [RPC data format](https://developers.stellar.org/docs/data/apis/rpc/api-reference/structure/data-format).

For JS, import from the official [@stellar/stellar-sdk](https://github.com/stellar/js-stellar-sdk): parse envelopes with `TransactionBuilder.fromXDR(...)` or XDR classes, inspect `xdr.TransactionResult`, `xdr.TransactionMeta`, `xdr.LedgerKey`, and decode contract return `ScVal` with SDK helpers such as `scValToNative`; build arguments with `nativeToScVal`. For Go/Rust, use the official XDR bindings (`go-stellar-sdk/xdr`, `stellar-xdr`). Result-code strings are Horizon's normalized view of protocol result codes in error `extras`; lower-level code can decode `TransactionResult` XDR directly [result codes](https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes).

For transaction hashes, parse the envelope with the correct network passphrase and let the SDK compute/hash the transaction signature base. Do not hash the base64 envelope bytes directly, and normalize old V0/new V1 envelopes through SDK parsing.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because official data-format, Horizon, RPC, and SDK docs define the correct boundaries. `scout_research` and `parallel_search` are acceptable for discovering code examples or community parsers, but should not replace SDK/XDR references.

## Edge / traps

The traps are mixing result codes, operation meta, Soroban diagnostic events, and ScVal return values into one blob, or computing a transaction hash without the network passphrase/signature-base rules. The safe answer points to typed SDK XDR.
