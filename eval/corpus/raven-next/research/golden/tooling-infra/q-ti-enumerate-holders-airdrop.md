---
id: q-ti-enumerate-holders-airdrop
q: "How do I enumerate every holder (trustline) of an asset (paginating past Horizon's 200-record limit / avoiding 414) and distribute a batched, retry-safe airdrop or %-bonus to all of them?"
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
  - { claim: "Explains that Horizon account/balance endpoints are paginated and API-bounded; for all holders at scale use Hubble/BigQuery, a Horizon instance with ingestion filters, or an indexer rather than one giant URL/query.", weight: 5 }
  - { claim: "Tells the user to paginate with cursor links/pages and store a checkpoint, avoiding long query strings that can trigger HTTP 414.", weight: 4 }
  - { claim: "For a batched airdrop or percentage bonus, requires an idempotent recipient snapshot, per-recipient tx status, retry/resume logic, and sequence/fee management.", weight: 4 }
  - { claim: "Distinguishes classic issued-asset trustline holders from Soroban contract balances, which may require SAC/token event or contract-data indexing.", weight: 4 }
should_have:
  - { claim: "Mentions Horizon public-history limits and recommends Hubble or an indexer for full historical/bulk analytics.", weight: 3 }
  - { claim: "Mentions that distribution should use normal Stellar payment transactions or claimable balances depending on whether recipients must opt in/claim.", weight: 2 }
nice_to_have:
  - { claim: "Suggests a dry run on Testnet and small production canary batch before large distribution.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet, faucet, provider, SDK, explorer, or infrastructure behavior without a current source.", weight: 5 }
  - { claim: "Do NOT claim Horizon can return every holder in one unpaginated request or advise stuffing hundreds of account IDs into one URL.", weight: 5 }
  - { claim: "Do NOT ignore idempotency/retry safety for the airdrop step.", weight: 4 }
must_cite:
  - "Horizon pagination/account docs or Hubble/indexer docs for the data-source choice."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/data/apis/horizon"
  - "https://developers.stellar.org/docs/data/apis/horizon/admin-guide/ingestion"
  - "https://developers.stellar.org/docs/data/analytics/hubble/analyst-guide/history-vs-state-tables"
  - "https://developers.stellar.org/docs/data/indexers"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Classic holder enumeration is well grounded. Exact table/SQL choices depend on Hubble schema and whether the asset is classic trustline-only or has contract-address balances."
---

## Reference answer (gospel)

For a small/bounded job, page Horizon instead of constructing a huge URL: follow collection pagination/cursors and checkpoint each page/recipient. Public Horizon is not the right primitive for unlimited historical/bulk holder analytics; SDF's Horizon docs note public history truncation and the admin guide recommends Hubble when you cannot fit a retention/filtering window [1][2]. For a complete holder snapshot, use Hubble/BigQuery state/current tables, your own Horizon with ingestion filters, or an indexer [3][4].

For the airdrop itself, first freeze a recipient snapshot, then write one durable row per holder with computed amount, tx hash, status, and retry count. Submit payments or claimable balances in batches, but make retries idempotent: never recompute from live balances mid-run unless that is explicitly the campaign rule. Use fresh sequence numbers/fee policy per source account, handle partial failures, and dry-run on Testnet.

Classic issued-asset holders are trustlines/account balances. Contract-address balances for a SAC or custom SEP-41 token may not appear as Horizon account balances, so enumerate those from contract data/events or an indexer rather than assuming the classic trustline list is complete.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer turns on Horizon pagination/retention, Hubble, and indexer docs. `scout_research` is acceptable for corroborating indexer/ecosystem choices but should not replace primary API docs.

## Edge / traps

The main trap is treating this as a one-call Horizon query. Another trap is computing bonuses from a moving live balance set while retrying, which can double-pay or miss recipients. A correct answer also keeps classic trustline holders separate from contract-address token balances.
