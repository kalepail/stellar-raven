---
id: q-ti-find-export-secret-key
q: "Where do I find/export my secret key in a wallet like Freighter (it only shows a recovery phrase), and can I get a private key from a public address?"
category: tooling-infra
subcategory: wallets-keys
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States clearly that a public Stellar address/public key cannot be reversed into a secret key.", weight: 5 }
  - { claim: "Explains the public-key/secret-key distinction and that the secret key grants full control of the account.", weight: 5 }
  - { claim: "Separates wallet-specific recovery/export UX from Stellar protocol facts; if a wallet only shows a recovery phrase, the user must follow that wallet's supported backup/export flow.", weight: 4 }
  - { claim: "Warns against pasting production seed phrases or secret keys into websites, chats, logs, or untrusted tools.", weight: 4 }
should_have:
  - { claim: "Mentions that testnet/hot-wallet examples may use .env secret keys, but that is not a production custody recommendation.", weight: 2 }
nice_to_have:
  - { claim: "Suggests creating a new account and moving funds if the recovery phrase/secret key may be exposed.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet, faucet, provider, SDK, explorer, or infrastructure behavior without a current source.", weight: 5 }
  - { claim: "Do NOT tell users a public address can reveal a secret key or encourage unsafe plaintext key handling.", weight: 5 }
must_cite:
  - "Primary Stellar docs for keypair/public-key/secret-key behavior."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/guides/transactions/create-account#create-a-keypair"
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions#transactions"
  - "https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide#setting-up-a-testnet-wallet"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Freighter's exact export UI can change, so the durable rubric gates on protocol truth and safe wallet-specific guidance rather than fixed menu labels."
---

## Reference answer (gospel)

You cannot derive a Stellar secret key from a public address. Stellar uses public-key cryptography: the public key/address is safe to share; the secret key proves ownership and gives account access [1]. Transactions are authorized by signatures made with the secret key associated with the public key [2].

If Freighter or another wallet shows only a recovery phrase, that is wallet custody UX, not an on-chain limitation. Use that wallet's supported backup/export flow, or restore the phrase in the same trusted wallet and move funds to a new account if you need a different custody setup. Do not paste a real recovery phrase or secret key into a website, chat, issue, log, or random converter. Stellar docs use `.env` secret keys in testnet tutorials and explicitly warn that secret keys provide full access and `.env` hot wallets are testnet-only guidance [3].

## Why these cards (routing rationale)

`stellar_docs_mcp` should supply the protocol/keypair evidence. `scout_research` is acceptable only for wallet-ecosystem context; it should not override the cryptographic fact that public keys do not reveal secret keys.

## Edge / traps

The dangerous trap is telling the user a public address can recover a private key. Another trap is giving brittle wallet menu instructions as if they were protocol facts. The safe answer says what Stellar guarantees, then directs wallet-specific export/recovery questions to the wallet's trusted UI/docs.
