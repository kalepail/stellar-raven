# Adversarial review (independent Claude pass) — PR #11 / PR #12

**Date:** 2026-06-23
**Role:** This is the required **independent adversarial pass** mandated by
`PRIOR-ART-REVIEW-PROMPT.md` (Phase A2: "Claude falsifies, not echoes"). The prior run was stopped
before producing a durable artifact; this file replaces that gap. It does **not** edit any golden
`q-*.md` file and does **not** update `_adopt-spec.md`.

**Target falsified:** `review-adversarial-pr11-pr12.md` (the coordinator synthesis), checked against
the live 391-question battery (`_our-questions.txt`), the two primary reviews
(`review-raven-pr11.md`, `review-raven-pr12.md`), and the raw incoming JSON.

## What I independently verified (not just re-read)

- **PR #12 NEW items are genuinely absent.** `grep -i` over `_our-questions.txt` for `memo`,
  `scam|phish|stolen|drain|hack`, `merchant|accept`, and secret-key/hash storage returns **no
  user-facing match**. The only `memo` hit is `q-soroban-resource-limits` (unrelated); the only
  "exfiltrate-secrets" hit is `q-edge-inject-exfiltrate-secrets`, which is a **prompt-injection test
  against Raven**, not a user "is this a scam / can I recover" case. → coordinator's "absent" calls hold.
- **PR #11 is genuinely covered.** ZK (`q-soroban-zk-groth16/bn254/bls12`, `q-protocol-bn254-poseidon-xray`,
  `q-protocol-bls12-381-cap59`), resource limits (`q-soroban-resource-limits`), Blend (10 ids incl.
  `q-defi-blend-what-is`, `q-eco-blend-audit-extract`, `q-comp-yieldblox-oracle-incident`), and clawback
  (7 ids) are all present. → "do not import PR #11 wholesale; 0 NEW" holds.
- **Incoming text matches the reviews.** I read the raw `questions[]` for the six pivotal PR #12 items;
  the primary review's paraphrases are faithful (no smuggled rubric, no inflated claim).

## Top-line verdict: **CONFIRM** the coordinator posture, with two **CHANGE**s and zero **BLOCKER**s

The adoption posture — *do not merge either PR as-is; PR #11 contributes 0 new concepts and at most a
few builder-depth reframes; PR #12's real value is a small retail safety/support slice* — is correct
and grounded. I could not falsify it. Two refinements below; both are scoping corrections, not reversals.

## Per-item verdicts

| Item (coordinator) | Verdict | Rationale / replacement |
|---|---|---|
| PR #12 memo types + exchange deposit + memoless recovery | **CHANGE → split into 2** | Genuinely absent and high-value. But this is a composite of two concepts with different `query_type` and different traps: (a) **memo taxonomy + which type to use** (factual; trap = never invent the user's exchange memo value), (b) **memoless-deposit recovery** (how-to/safety; trap = funds are on-chain but recovery is exchange-support attribution, *not* protocol reversal). A3 says "split composites." Author two single-concept files, not one. |
| PR #12 scam / unsolicited claimable / fake token / trustline removal | **CHANGE → keep phishing separate** | ADOPT the unsolicited-asset/fake-token/trustline-removal safety case (grounded: claimable balances & trustlines are legitimate primitives; do not label all unsolicited assets malicious). **But do NOT fold the phishing pattern into it.** Social-engineering phishing ("you have a pending XLM claim", "re-sign at xlm.services", "pay to rectify a flagged account" — PR #12 #40) is the **highest-frequency real fund-loss vector** and is a distinct concept from passive spam tokens. It is **not** covered by `q-edge-inject-exfiltrate-secrets` (that tests Raven resisting injection, not a user asking "is this email a scam"). Recommend it as its own `edge-governance` question. |
| PR #12 stolen-funds recovery | **CONFIRM** | Strong honesty/safety case, absent, crisp must-avoid (no reversal; XLM has no clawback; issuer clawback only on clawback-enabled assets). Keep separate from the scam cluster — coordinator already does. |
| PR #12 secret-key / hash safety | **CONFIRM** | Best single additive item. Stable cryptographic must-avoid (hash is one-way; never publish encrypted secrets on-chain; a key cannot be derived from its hash). No freshness risk. |
| PR #12 merchant acceptance | **CONFIRM (reframe)** | Borderline advice-shaped; the reframe to "what sourced options exist + which compliance boundaries to *cite, not advise on*" is the right neutralization. Keep evidence-only; no vendor pick, no legal advice. |
| PR #12 node-ops setup | **CONFIRM (reframe, freshness-gated)** | Real depth gap over `q-protocol-validator-node-roles` / `q-protocol-tier1-requirements`. Mark `freshness_sensitive: true` (hardware/version drift); gate the rubric on "cite official run-a-validator docs", not on specific specs. |
| PR #11 ZK resource budget | **CONFIRM (low priority)** | Marginal but real: the localnet-unlimited-vs-testnet/mainnet-budget failure mode for ZK verifiers is the concrete intersection of `q-soroban-resource-limits` + `q-soroban-zk-groth16-verifier`, not directly tested. Lowest-value of the adopt set. See rescue note for a stronger alternative. |
| PR #11 Blend mechanics (risk/backstop *or* share-accounting, not both) | **CONFIRM** | Coordinator correctly forbids the composite. Keep it evidence/pattern-lookup (which audits/docs/repos to cite), never accounting/keeper code-gen. |
| PR #11 local-ledger testing | **CONFIRM (BLOCKER-gated authoring)** | Adopt **only after** verifying the actual supported mechanism in current Stellar/Soroban test tooling. Do **not** author a rubric that asserts a "fast-forward ledger" command until grounded — inventing a command is the exact trap the prompt warns about. Verification gate, not a blocker on the posture. |

## Rescue check (did the coordinator over-reject?)

- **Phishing pattern (#40)** — rescued above; the one item I move from "merge away" to "adopt distinct."
- **Sponsored / gasless smart-wallet onboarding (PR #11 NEAR)** — arguably **more additive than the ZK
  resource-budget item**: receiving USDC without XLM/trustline-reserve friction is a concrete, currently
  painful, common builder question, and the end-to-end onboarding *design* is not isolated anywhere
  (reserves, fee-bump, relayers, x402 sponsored fees are each tested separately). Offered as an optional
  swap for the ZK-budget reframe; risks code-gen framing, so keep it "which patterns/repos/docs to cite."
  Not a blocker either way.
- **Everything else the coordinator rejected stays rejected.** `buy-xlm/best-rates`, `tax`,
  `hardware-worth-it-at-size-X`, `ICO/fundraising`, `xlm-value-accrual` are recommendation / legal-tax /
  securities / market-value shaped and correctly out of scope. `ledger-transparency-finality-non-repudiation`
  is covered by the stolen-funds finality angle + `q-edge-noinfo-stellar-native-privacy-default`. CCTP-vs-intents,
  scoped policy signers, and network-metrics dashboards are correctly rejected as too vendor/live or duplicative
  (`q-tool-cctp-stellar-integration`, `q-soroban-check-auth-custom-account`, `q-eco-defi-market-map` cover the durable parts).

## Net recommendation

Adopt the coordinator's set with the two CHANGEs applied. Resulting PR #12 safety/support slice
(**~6–8 focused questions**): memo-taxonomy, memoless-recovery, unsolicited-asset/fake-token-safety,
**phishing/social-engineering (rescued)**, stolen-funds-recovery, secret-key/hash-safety, merchant-acceptance,
node-ops. PR #11 builder-depth (**1–3**): Blend-mechanics, local-ledger-testing (gated), and either
ZK-resource-budget **or** sponsored-onboarding. All in Raven's current YAML schema, weighted rubric,
evidence-server framing (sourced facts + confidence + must-avoid traps; never prose advice or code-gen).
No BLOCKERs. The only hard authoring gate: verify the live mechanism before writing node-ops and
local-ledger rubrics.
