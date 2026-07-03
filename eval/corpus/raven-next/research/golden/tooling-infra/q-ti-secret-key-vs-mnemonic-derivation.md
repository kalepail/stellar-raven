---
id: q-ti-secret-key-vs-mnemonic-derivation
q: "What's the difference between my S... secret key and my 12/24-word recovery phrase, how do I derive the keypair from the mnemonic (SEP-5/SEP-52 / BIP-39, why one seed yields many addresses), and where in the Lab/CLI do I do it (the `stellar keys generate --seed` errors)?"
category: tooling-infra
subcategory: wallets-keys
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Distinguishes a Stellar secret key (`S...`) as the private Ed25519 signing key for one derived account from a recovery phrase/mnemonic as seed material that can derive one or many keypairs.", weight: 5 }
  - { claim: "Explains that SEP-5 standardizes Stellar hierarchical deterministic key derivation and allows multiple keys from one seed; SEP-52 covers user-friendly secret-key recovery phrases, not public-key-to-secret-key recovery.", weight: 5 }
  - { claim: "States that a public address cannot reveal or recover the secret key; losing the only secret/mnemonic means the account cannot be controlled unless prior recovery/multisig arrangements exist.", weight: 5 }
  - { claim: "Correctly describes current Stellar CLI behavior: `stellar keys generate <name>` creates a 24-word seed phrase by default; `--seed` is optional seed material for deterministic generation, not where a 12/24-word phrase is pasted; `--hd-path` selects a derivation path when generating a secret key.", weight: 4 }
  - { claim: "Mentions Stellar Lab can manually save either an `S...` secret key or a 12/24-word recovery passphrase in Saved Keypairs.", weight: 3 }
should_have:
  - { claim: "Advises using wallet/export flows or secure storage rather than pasting production mnemonics into web tools or committing keys to code.", weight: 3 }
  - { claim: "Notes that one mnemonic can yield multiple addresses because the derivation path/index changes.", weight: 2 }
nice_to_have:
  - { claim: "Mentions empirical CLI help or version drift because `stellar keys generate --seed` wording has confused users.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say a public address can derive the secret key or recovery phrase.", weight: 5 }
  - { claim: "Do NOT conflate an `S...` Stellar secret key with a BIP-39 mnemonic or tell users to store production secrets in plaintext.", weight: 5 }
  - { claim: "Do NOT present `--seed` as the normal import flag for a wallet recovery phrase without checking current CLI help.", weight: 4 }
must_cite:
  - "SEP-5 or the Stellar Docs SEP overview for Stellar key derivation."
  - "SEP-52 for recovery-phrase semantics when discussing recovery phrases."
  - "Stellar Lab Saved Keypairs docs or current `stellar keys generate --help` output for tooling behavior."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0052.md
  - https://developers.stellar.org/docs/tools/lab/saved/keypairs
  - https://developers.stellar.org/docs/tools/cli
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against Stellar Docs search, SEP-5/SEP-52 GitHub URLs via gh, and local `stellar keys generate --help` on stellar 25.2.0. CLI latest in web docs is newer than local; Phase 3 may re-check CLI 27 help text."
---

## Reference answer (gospel)

An `S...` Stellar secret key is the private signing key for a specific Ed25519 keypair/account. A 12/24-word recovery phrase is mnemonic seed material; per SEP-5, standard derivation lets wallets generate multiple Stellar keys from one seed, so changing the derivation path/index can yield different `G...` addresses from the same phrase [SEP-5](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md). SEP-52 is about user-friendly secret-key recovery phrases; it does not make public addresses reversible into private keys [SEP-52](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0052.md).

For tooling: current `stellar keys generate <name>` generates a 24-word seed phrase by default; local CLI help shows `--seed <SEED>` as optional deterministic seed material and `--hd-path <HD_PATH>` for choosing the derivation path when generating a secret key. Lab's Saved Keypairs page supports manually saving a keypair with either an `S...` secret key or a 12/24-word recovery passphrase [Lab Saved Keypairs](https://developers.stellar.org/docs/tools/lab/saved/keypairs). Treat any import/derivation action as secret handling: do it in the wallet/CLI/secure store you trust, never from a public key, and never by exposing production mnemonics in a browser or repo.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because the answer is determined by Stellar protocol standards and official tooling docs. `scout_research` is acceptable as a secondary corpus route, but it should not replace primary SEP and CLI/Lab sources.

## Edge / traps

The common wrong answers are: "public key can recover private key"; "`--seed` means paste your wallet's recovery phrase"; and "one seed equals exactly one Stellar account." The verified answer must separate mnemonic seed, derivation path, secret key, public address, and on-chain account state.
