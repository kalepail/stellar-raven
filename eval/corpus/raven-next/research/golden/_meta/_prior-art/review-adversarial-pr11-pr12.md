# Adversarial synthesis - PR #11 and PR #12

**Scope:** Coordinator adversarial reconciliation for `kalepail/stellar-raven` PR #11 and PR #12
against the current 391-question Raven golden battery. This follows
`research/golden/_meta/PRIOR-ART-REVIEW-PROMPT.md`: questions only, incoming rubrics ignored,
current Raven schema/rubric preferred, and duplicates rejected.

**Inputs used:**

- `research/golden/_meta/_prior-art/review-raven-pr11.md`
- `research/golden/_meta/_prior-art/review-raven-pr12.md`
- `research/golden/_meta/_prior-art/_our-questions.txt`
- `research/golden/_meta/CATALOG.md`
- `research/golden/README.md`
- `_incoming/pr11-golden-questions.json`, `_incoming/pr12-golden-questions.json`

**Independent adversarial pass:** completed in
`research/golden/_meta/_prior-art/review-adversarial-claude-pr11-pr12.md` on 2026-06-23 after a
redo. The first Claude run was stopped too early; that is now recorded as a process failure, and the
reusable prompt has been updated to require waiting/retrying via Solo timers/watchers until a durable
Claude adversarial artifact exists.

## Top-line verdict

- **PR #11:** do not import. Its former high-value NEW/NEAR items are now covered by the current
  battery (`q-defi-x402-on-stellar-what`, `q-defi-agentic-payment-standards-compare`,
  `q-defi-agent-identity-stellar-experimental`, `q-sep-53-sign-verify-message`,
  `q-comp-yieldblox-oracle-incident`, `q-tool-cctp-stellar-integration`,
  `q-tool-passkey-wallet-recovery`, `q-soroban-oracle-defensive-consumption`, and related).
- **PR #12:** do not import wholesale. It is useful as retail/user-support prior art, but most items
  are duplicates, advice-shaped, or too stale. Adopt only a small safety/support slice if expanding
  the battery beyond its current builder/ecosystem emphasis.
- **No golden question files were authored in this review.** The output is an adoption posture, not
  a schema migration.
- **Claude result:** CONFIRM the coordinator posture with two scoping changes and zero blockers.

## Recommended adopt/reframe set

These are the only candidates I would carry forward into a later `_adopt-spec` update.

| Source | Verdict | Minimal question shape | Target category | Cards | Grounding / traps |
|---|---|---|---|---|---|
| PR #12 memo taxonomy | **ADOPT** | "What Stellar memo types exist, and why do exchanges require memos for omnibus deposits?" | `assets-anchors-seps` or `tooling-infra` | `stellar_docs_mcp` | Claude CHANGE: split from memo-less recovery. Memo types are stable; never invent the user's exchange memo. |
| PR #12 memo-less deposit recovery | **ADOPT** | "What should a user do after sending XLM/assets to an exchange without the required memo?" | `assets-anchors-seps` or `compliance-rwa-payments` | `stellar_docs_mcp`; accept `parallel_search` for exchange-policy examples | Claude CHANGE: separate how-to/safety case. Funds may be on-chain, but recovery is exchange-support/manual attribution, not protocol reversal. |
| PR #12 unsolicited asset / fake token safety | **ADOPT** | "How should a user evaluate an unsolicited Stellar token or claimable balance, and how can they remove a suspicious trustline safely?" | `edge-governance` or `assets-anchors-seps` | `stellar_docs_mcp`; accept `parallel_search`, `perplexity_search` | Claimable balances/trustlines are legitimate primitives; do not label every unsolicited asset as malicious; require issuer/source verification and safe-key handling. |
| PR #12 phishing / social engineering | **ADOPT** | "How should a user evaluate a fake pending-claim, account-rectification, or re-signing prompt that asks for Stellar keys or signatures?" | `edge-governance` | `parallel_search`; accept `stellar_docs_mcp`, `perplexity_search` | Claude CHANGE: keep phishing separate from passive scam tokens. `q-edge-inject-exfiltrate-secrets` tests Raven resisting injection, not user-facing phishing guidance. |
| PR #12 stolen funds | **ADOPT** | "Can stolen XLM or Stellar assets be reversed or recovered, and how do finality, issuer clawback, and exchange/reporting paths limit the answer?" | `compliance-rwa-payments` or `edge-governance` | `stellar_docs_mcp`; accept `parallel_search` | Must avoid promising reversal; XLM cannot be clawed back; issuer clawback only applies to clawback-enabled assets. |
| PR #12 secret-key/hash safety | **ADOPT** | "Is it safe to store a Stellar secret key, encrypted key, or hash on-chain or in a database, and can a key be recovered from a hash?" | `tooling-infra` or `edge-governance` | `stellar_docs_mcp` | Crisp must-avoid trap: do not suggest publishing encrypted secrets on-chain; hashes are one-way; recovery requires an actual secret/seed or designed account recovery. |
| PR #12 merchant acceptance | **REFRAME** | "What sourced options exist for a merchant to accept Stellar XLM/USDC without self-custody, and what compliance boundaries should Raven cite rather than advise on?" | `compliance-rwa-payments` | `stellar_docs_mcp`; accept `perplexity_search`, `scout_projects` | Keep evidence-based; no vendor recommendation or legal advice; distinguish wallet, anchor, processor, merchant, and MSB obligations. |
| PR #12 node ops | **REFRAME** | "Where are the official instructions and current requirements for running Stellar Core watcher/basic/full validator nodes?" | `protocol-core` or `tooling-infra` | `stellar_docs_mcp`; accept `parallel_extract` | Current battery covers validator roles/Tier 1, not setup depth; hardware/version details are freshness-sensitive. |
| PR #11 ZK resource budget | **REFRAME, low priority** | "Why can a Soroban ZK verifier work on localnet with unlimited limits but fail on testnet/mainnet resource budgets, and where should a builder look for limits/examples?" | `soroban` | `stellar_docs_mcp`; accept `scout_repos` | Claude confirmed it is real but lower priority than sponsored onboarding; avoid inventing budget numbers. |
| PR #11 Blend mechanics | **REFRAME** | One focused question on either Blend risk/backstop/liquidation mechanics or per-depositor share accounting, not both. | `defi-ecosystem` | `scout_repos`, `scout_research`, `lumenloop_find_content_about_project` | Current Blend coverage is identity/content/audit/TVL; operational mechanics may be additive, but keep it evidence/pattern lookup, not bot/accounting code generation. |
| PR #11 local ledger testing | **REFRAME, verification-gated** | "How do Stellar/Soroban local test tools handle time- or ledger-dependent tests, and what official commands/examples should a builder cite?" | `tooling-infra` | `stellar_docs_mcp`; accept `scout_repos` | Claude confirmed this only after verifying the supported mechanism; do not invent a fast-forward command. |
| PR #11 sponsored onboarding | **OPTIONAL REFRAME** | "Which Stellar smart-wallet onboarding patterns let a user receive USDC with minimal XLM/trustline friction, and what docs/repos should a builder cite?" | `tooling-infra` | `stellar_docs_mcp`; accept `scout_repos` | Claude rescue note: this may be more additive than ZK resource-budget if framed as evidence/pattern lookup, not code generation. |

## Rejected or covered

- **PR #11 wholesale:** covered by current battery. The eight NEARs in `review-raven-pr11.md` are
  optional depth probes, not evidence of a missing category.
- **CCTP vs intents / Wallets Kit module nuance:** reject for now. `q-tool-cctp-stellar-integration`,
  `q-defi-bridges-content`, and `q-tool-wallets-kit` cover the durable CCTP/bridge/wallet-kit facts;
  intent routing is too live/vendor-specific unless a future source battery proves it central.
- **Scoped policy signers:** reject as duplicate until a concrete standard/doc gap is shown.
  `q-soroban-check-auth-custom-account`, `q-soroban-auth-delegation-p27`,
  `q-tool-passkeykit-smart-wallet`, and `q-tool-passkey-wallet-recovery` already cover the primitive.
- **Buy XLM / best rates / hardware worth-it / tax / ICO / XLM value accrual:** reject or only reframe
  as strict evidence-discovery/decline cases. They are recommendation, legal/tax, securities, or
  market-value advice shaped and do not fit the current golden rubric without heavy caveats.
- **Network metrics dashboards:** reject as duplicate/low priority. The battery already tests TVL,
  market maps, Hubble/indexer/provider surfaces, and crypto-market context; dashboard roster questions
  go stale quickly.
- **Classic wallet restore/import:** reject as a standalone question. Fold safe-key principles into
  the secret-key/hash item if adopted; wallet-specific import compatibility is a moving support table.
- **Retail on/off-ramp/remittance/cross-chain USDC:** covered by anchors, SEP-24/31, MoneyGram,
  CCTP, bridges, USDC/EURC, and path-payment questions.
- **Ledger transparency/finality/non-repudiation:** do not rescue separately. Claude agreed it is
  covered by the stolen-funds finality angle plus `q-edge-noinfo-stellar-native-privacy-default`.

## Final recommendation

Do **not** merge either PR into the current golden set as-is. If expanding the battery, add at most
**6-8 focused questions** from PR #12's retail safety/support surface and **1-3 focused builder-depth
questions** from PR #11's residuals. Keep all new items in Raven's current YAML schema, use our
weighted rubric model, and preserve the evidence-server framing: sourced facts, confidence, and
must-avoid traps rather than prose advice or code generation. Hard authoring gates remain: verify
node-ops requirements and local-ledger/test-tool mechanisms against current primary sources before
writing any rubric that names commands, versions, or hardware requirements.
