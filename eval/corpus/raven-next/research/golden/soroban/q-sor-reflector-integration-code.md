---
id: q-sor-reflector-integration-code
q: "How do I call Reflector's `lastprice`/`x_last_price` from the JS SDK or a contract — which contract IDs, what asset-ID encoding, what return type, and why does it trap with UnreachableCodeReached when the CLI works?"
category: soroban
subcategory: soroban-development
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_directory, scout_projects, scout_repos]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Identifies Reflector as a SEP-40-compatible Stellar oracle and distinguishes Pulse `lastprice(asset)` from Beam `lastprice(caller, asset)`/fee authorization behavior.", weight: 5 }
  - { claim: "States that Reflector asset arguments are the contract UDT enum `Asset::Stellar(Address)` for Stellar/Soroban assets or `Asset::Other(Symbol)` for external tickers, not a raw JS string or raw hex asset id.", weight: 5 }
  - { claim: "States that `lastprice` returns `Option<PriceData>` and `PriceData` contains `price: i128` and `timestamp: u64`; callers must handle `None` and scale by oracle `decimals()`.", weight: 4 }
  - { claim: "Explains that `UnreachableCodeReached` when CLI works usually means the JS/client invocation encoded args against the wrong contract spec/signature, wrong UDT arm, wrong oracle type, or stale generated bindings, rather than a price-feed failure.", weight: 4 }
  - { claim: "Uses current Reflector contract ids from the live Reflector oracle page or project docs instead of inventing IDs; examples may cite README/live-page sample ids but must advise verifying the selected mainnet/testnet oracle page.", weight: 3 }
should_have:
  - { claim: "Mentions Beam's XRF cost/authorization path and `authorize_as_current_contract` when calling from a contract.", weight: 3 }
  - { claim: "Recommends generated bindings/spec-derived clients or explicit ScVal construction for the UDT enum when calling from JS.", weight: 3 }
nice_to_have:
  - { claim: "Mentions checking staleness with returned timestamp and oracle resolution/retention.", weight: 1 }
must_avoid:
  - { claim: "Do NOT pass a classic asset code/issuer string directly where Reflector expects its `Asset` UDT.", weight: 5 }
  - { claim: "Do NOT assume Pulse and Beam have identical `lastprice` signatures.", weight: 5 }
  - { claim: "Do NOT treat `UnreachableCodeReached` as proof that Reflector is down when the CLI invocation succeeds.", weight: 4 }
must_cite:
  - "Reflector's README/interface or live oracle page for contract interface and contract IDs."
  - "SEP-40 for the oracle-interface standard."
  - "Stellar docs for Soroban typed clients/specs or contract invocation encoding when discussing JS calls."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/reflector-network/reflector-contract
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0040.md
  - https://reflector.network/.well-known/stellar.toml
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Phase 3 checked Reflector README, TOML, Scout, SEP-40, and the live SPA bundle on 2026-06-29. README sample Pulse id remains CAFJ...; the live SPA bundle also embedded CBQSUF57OYX4RIMCZV62DKN6JFOTEKPHIZASMJYOUOCNHGNG2P3XQLSE. Treat IDs as freshness-sensitive and require live oracle-page/project-doc verification."
---

## Reference answer (gospel)

Reflector is a SEP-40-compatible Stellar oracle. Its project README defines two relevant interfaces: Pulse uses `lastprice(asset: Asset) -> Option<PriceData>`, while Beam uses `lastprice(caller: Address, asset: Asset) -> Option<PriceData>` and charges XRF through a separate authorization path. The README's sample Pulse oracle address is `CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN`; on 2026-06-29, the live Reflector SPA bundle also embedded `CBQSUF57OYX4RIMCZV62DKN6JFOTEKPHIZASMJYOUOCNHGNG2P3XQLSE`. A correct answer should tell the user to pick the current mainnet/testnet oracle from Reflector's live oracle page or project docs before hardcoding a contract id.

The argument is Reflector's own UDT enum, not a plain string: `Asset::Stellar(Address)` for Stellar Classic/Soroban assets and `Asset::Other(Symbol)` for external tickers such as `BTC`. The return is optional; on success, unwrap `PriceData { price: i128, timestamp: u64 }`, then divide/scale using `decimals()` from that oracle and reject stale timestamps according to the feed's resolution/retention.

If `stellar contract invoke ... lastprice ...` works but JS `Contract.call()` traps with `UnreachableCodeReached`, the likely bug is client-side encoding: stale or wrong contract spec, wrong UDT arm, Pulse-vs-Beam signature mismatch, passing raw asset-code/issuer/hex instead of the expected enum, or using a generated binding from an old WASM. Regenerate bindings/spec, or build the call with explicit ScVals matching the exact contract spec. For Beam from a contract, authorize the XRF burn with `Env::authorize_as_current_contract` before `lastprice(caller, asset)`.

## Why these cards (routing rationale)

`scout_research` is the expected card because the answer depends on an ecosystem project's contract interface. `stellar_docs_mcp` is a valid supporting card for Soroban invocation/spec encoding, and `scout_projects`/`scout_repos` can resolve Reflector project and repo identity.

## Edge / traps

The common wrong answer is to use generic token/SAC encoding or an EVM oracle mental model. Reflector's asset id is a contract-specific enum. Another trap is to copy a sample contract id without checking the live oracle list, or to ignore the difference between Pulse's free interface and Beam's fee-bearing caller interface.
