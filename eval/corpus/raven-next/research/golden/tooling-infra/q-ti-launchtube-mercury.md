---
id: q-ti-launchtube-mercury
q: "What are LaunchTube and Mercury — when do I need each (fee sponsorship / tx submission vs Soroban indexing), do they require API keys, and can a passkey smart wallet run fully client-side without them?"
category: tooling-infra
subcategory: developer-tooling
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_projects]
acceptable_cards: [lumenloop_search_directory, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "Correctly distinguishes Launchtube as a relay/paymaster-like transaction-submission and fee/sequence service from Mercury as an indexing/data service for Stellar/Soroban.", weight: 5 }
  - { claim: "Explains that passkey-kit examples use Launchtube for submitting/funding transactions and Mercury/Zephyr for indexing smart-wallet/passkey events, but the dApp usually interacts through the SDK/server layer.", weight: 5 }
  - { claim: "States that both services require setup/auth tokens or API keys in the documented tutorial path, not secret-key sharing with the service.", weight: 4 }
  - { claim: "Answers the fully-client-side question: signing can happen client-side, but fee sponsorship/submission and indexing usually require service/server infrastructure; do not claim a production passkey wallet needs no backend/indexer/relayer unless the app accepts those limitations.", weight: 4 }
should_have:
  - { claim: "Mentions Mercury is live/indexer infrastructure per Scout and developer docs.", weight: 3 }
nice_to_have:
  - { claim: "Mentions OpenZeppelin Relayer/smart-account-kit as a newer alternative lane for greenfield smart accounts when relevant.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet, faucet, provider, SDK, explorer, or infrastructure behavior without a current source.", weight: 5 }
  - { claim: "Do NOT conflate Mercury with Mercuryo or with a transaction relayer.", weight: 5 }
  - { claim: "Do NOT claim Launchtube is an indexer or that Mercury submits/sponsors transactions.", weight: 5 }
  - { claim: "Do NOT imply passkey smart-wallet apps should expose service JWTs or private keys in public client code.", weight: 5 }
must_cite:
  - "Stellar passkey prerequisites/smart-wallet docs and Scout/project evidence for Mercury."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/apps/guestbook/passkeys-prerequisites"
  - "https://developers.stellar.org/docs/build/guides/contract-accounts/smart-wallets"
  - "https://stellarlight.xyz/project/mercury"
  - "https://github.com/stellar/launchtube"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Scout project search verified Mercury (not Mercuryo) as live indexer infra, SCF-awarded. Scout project search did not resolve LaunchTube as a directory project, but dev-docs and stellar/launchtube repo ground it."
---

## Reference answer (gospel)

Launchtube and Mercury solve different parts of the smart-wallet/passkey stack. The Stellar passkey prerequisites describe Launchtube as a paymaster-like service that gets transactions on-chain without the app handling gas fees, sequence numbers, or source accounts directly; the tutorial gets a Launchtube JWT and stores it as a private env var [1]. The smart-wallet docs summarize it as a relay for submitting transactions and handling fees/sequence numbers [2].

Mercury is an indexer/data platform. The same prerequisites describe Mercury as a Testnet/Mainnet data indexer and ZephyrVM environment, used in the tutorial to index smart-wallet events and reverse-lookup passkey-to-wallet data; it needs a Mercury JWT/API key and `mercury-cli` deployment in that path [1]. Scout verifies Mercury as a live Stellar infrastructure/indexer project, distinct from Mercuryo [3].

A passkey smart wallet can sign authorization client-side, but a useful production dApp usually still needs infrastructure for transaction submission/fee sponsorship and for discovering/indexing wallet state. Do not expose Launchtube/Mercury JWTs or secret keys in public client code; put service credentials behind a server or use an SDK/service pattern that handles that boundary.

## Why these cards (routing rationale)

`scout_projects` should fire to resolve Mercury and avoid confusing it with Mercuryo. `stellar_docs_mcp`/dev-doc content is also necessary for Launchtube because Scout's project directory did not return a LaunchTube project, while official passkey docs and `stellar/launchtube` ground the service.

## Edge / traps

The traps are name collision and role collision: Mercury is not Mercuryo, and Mercury is not a transaction relayer. Launchtube is not an indexer. A third trap is saying "fully client-side" while leaking API tokens or ignoring the need for indexed smart-wallet discovery.
