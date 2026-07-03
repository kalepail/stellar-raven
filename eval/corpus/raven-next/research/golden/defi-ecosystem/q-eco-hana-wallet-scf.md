---
id: q-eco-hana-wallet-scf
q: "What is the Hana wallet and did it receive SCF funding?"
category: defi-ecosystem
subcategory: wallets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_get_scf_submissions]
acceptable_cards: [lumenloop_get_project, lumenloop_find_content_about_project, scout_projects]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Hana is a multi-chain crypto wallet (MetaMask-style, multiple chains in one) that supports Stellar, and it received SCF funding.", weight: 5 }
should_have:
  - { claim: "Reports Hana's SCF funding (approximately $132,000 across SCF rounds 22 and 25) from the source data, or honestly states what is in the corpus.", weight: 3 }
nice_to_have:
  - { claim: "Notes features like MoneyGram cash-in/out, Coinbase onramp, Bitcoin support.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate an SCF amount or round different from the source data.", weight: 5 }
  - { claim: "Do NOT describe Hana as a Stellar-only wallet (it is multi-chain).", weight: 3 }
must_cite:
  - "The SCF submission record for Hana (or an explicit note of what's in the corpus)."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellarlight.xyz/project/hana
  - https://hanawallet.io/
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "lumenloop_get_scf_submissions. VERIFIED on Scout: Hana is scfAwarded with scfTotalAwardedUSD = $132,000 (dossier attributes this to rounds 22 & 25); a non-custodial MULTI-chain wallet (browser ext + mobile) with Stellar support. Gate on 'is SCF-awarded + cite the record + multi-chain'; treat the $132K as tool-sourced."
---

## Reference answer (gospel)

**Hana** is a **non-custodial multi-chain crypto wallet** (browser extension + mobile) with Stellar
support — MetaMask-style, multiple chains in one app [Scout: stellarlight.xyz/project/hana;
hanawallet.io]. **Yes, it received SCF funding:** Scout reports **`scfAwarded: true`** with a total of
**$132,000** (per the dossier, across SCF rounds 22 and 25). Report the SCF status + total **from the
tool record**; note features (e.g. MoneyGram cash-in/out, Coinbase onramp, Bitcoin support) if surfaced.
Do **not** call Hana Stellar-only — it is multi-chain — and do not fabricate a different SCF figure.

## Why these cards (routing rationale)

Per-project SCF funding → `lumenloop_get_scf_submissions`; get_project acceptable for identity.

## Edge / traps

Don't fabricate the SCF figure ($132K tool-sourced); don't call Hana Stellar-only.
