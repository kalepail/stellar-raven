---
id: q-ti-enumerate-all-contracts
q: "How do I get a complete list of every deployed Soroban contract ID (and distinct WASM hashes), e.g. from Hubble state tables rather than the full history table?"
category: tooling-infra
subcategory: indexing-data
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Says to use current state/state-export tables such as Hubble `contract_data` and `contract_code` rather than scanning the full transaction history table for every deploy.", weight: 5 }
  - { claim: "Explains the data model: contract instances live in contract data/instance ledger entries, uploaded wasm lives in contract code entries keyed by wasm hash, and multiple contract instances may reference the same wasm hash.", weight: 5 }
  - { claim: "Mentions TTL/state archival: current/live state tables may omit expired/archived entries unless the table/export includes archival/TTL status, so define whether the requested list means live contracts or all-ever-deployed contracts.", weight: 4 }
  - { claim: "Gives an actionable BigQuery shape: select distinct contract IDs from contract data entries with instance/executable fields, join/extract wasm hash where executable is wasm, and select distinct hashes from contract code.", weight: 4 }
  - { claim: "Warns that all-ever-deployed historical reconstruction requires history/archive ingestion, not just current state.", weight: 4 }
should_have:
  - { claim: "Cites Hubble state table export docs and contract data/code docs.", weight: 3 }
  - { claim: "Mentions SAC built-in token contracts may have asset-derived contract IDs and built-in executable type rather than uploaded custom wasm.", weight: 2 }
nice_to_have:
  - { claim: "Mentions using RPC `getLedgerEntries` for specific entries but not for complete enumeration.", weight: 1 }
must_avoid:
  - { claim: "Do NOT advise paginating RPC methods as if they expose a complete contract registry.", weight: 5 }
  - { claim: "Do NOT count distinct wasm hashes as distinct deployed contracts.", weight: 5 }
  - { claim: "Do NOT ignore archived/expired state when the user asks for complete historical coverage.", weight: 4 }
must_cite:
  - "Official Hubble docs for state table export including `contract_data` and `contract_code`."
  - "Official Stellar docs for contract code/data/wasm hash model."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/analytics/hubble/developer-guide/scheduling-and-orchestration/getting-started"
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview"
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival"
  - "https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/stellar-transaction"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified docs 2026-06-29. Exact BigQuery column names should be checked against the live Hubble schema in Phase 3 before publishing runnable SQL."
---

## Reference answer (gospel)

Use state tables for a live/current inventory, not full transaction history. Hubble's state table export DAG explicitly exports `contract_data`, `contract_code`, and `ttl` to BigQuery (https://developers.stellar.org/docs/data/analytics/hubble/developer-guide/scheduling-and-orchestration/getting-started). Contract instances and their executable references live in contract data/instance entries; uploaded wasm bytecode lives separately in contract code entries keyed by wasm hash. The contract overview explains that uploaded wasm is identified by its hash and that multiple contract instances can reference the same wasm bytecode (https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview).

The query shape is: from the current/live `contract_data` table, filter for contract instance entries, extract the contract ID and executable; when executable type is wasm, extract the wasm hash; when executable type is token/SAC, treat it separately as an asset-derived built-in contract. Then select distinct contract IDs and distinct wasm hashes, and join/check `contract_code` for uploaded code entries. Use exact live Hubble schema names rather than guessing in application code.

Define "complete." If you mean live deploys, current state tables are the right starting point. If you mean all contracts ever deployed, including expired/archived entries, state archival matters: Stellar docs say ContractData and ContractCode entries have `liveUntilLedger` and stop being live after that ledger, with archive/restore behavior depending on storage type (https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival). All-ever history requires archive/history ingestion, not just current state.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because this is a Hubble/state-model question. `scout_research` is acceptable only as supplemental search over docs/corpus.

## Edge / traps

The plausible wrong answer is scanning `history_transactions` for deploy operations and calling it complete; that is expensive and still misses the current state model unless carefully decoded. Another is counting wasm hashes as contracts; many contracts can share one wasm hash, and SAC/token executable entries are not custom uploaded wasm.
