# Intake: theboycoder StellarLight data-layer golden set (2026-06-25)

Source gist: https://gist.github.com/theboycoder/9aba5b80f3a3534323211e30562d4ab7
Raw JSON: https://gist.githubusercontent.com/theboycoder/9aba5b80f3a3534323211e30562d4ab7/raw/stellarlight-golden-questions-cf-flue.json

Status: in review. Treat as unverified prior art until independently grounded.

## Intake Frame

The gist describes a 21-question StellarLight data-layer augmentation for the cf-flue eval. Its own
schema is not Raven's golden schema; use it as candidate prior art only. Candidate impact should be
judged against the existing Raven battery by:

- whether the question is materially additive beyond `research/golden/`;
- whether the premise can be independently verified against primary sources, Scout/StellarLight live
  surfaces, or current project/repo records;
- whether it exercises an existing Raven capability card or exposes a real card/schema gap;
- whether it can be expressed as a Raven evidence-server question rather than a cf-flue adapter test;
- whether brittle live rankings/counts should become freshness-sensitive rubrics or be rejected.

Follow the precedent in `research/golden/_meta/_prior-art/`: independent source review, independent
grounding, then a reconciled ADOPT / REFRAME / COVERED / REJECT list. Do not edit golden question
files during this intake round.

## Candidate Inventory

| Gist id | Gist category | Question theme |
| --- | --- | --- |
| `sl-priorart-lending-scf-flagships` | prior-art-data | Lending/borrowing prior art and SCF-funded flagships |
| `sl-priorart-oracle-reflector-leader` | prior-art-data | Stellar oracle providers and Reflector as leading oracle |
| `sl-priorart-rwa-treasuries-not-scf` | prior-art-data | Tokenized treasuries/RWA issuers and whether they are SCF-funded |
| `sl-code-passkey-wallet-top-repo` | code-data | Highest-signal passkey/smart-wallet repos |
| `sl-code-zk-xray-games-top` | code-data | Top ZK Soroban repos and hackathon winner status |
| `sl-code-soroban-oracle-least-bad` | code-data | Soroban oracle repo quality and safer alternatives |
| `sl-hackathon-blend-winners` | hackathon-data | Stellar Hacks: Blend winners |
| `sl-hackathon-kale-reflector-1st` | hackathon-data | Stellar Hacks: KALE x Reflector first-place project |
| `sl-hackathon-kale-vs-blend-counts` | hackathon-data | Hackathon submission/winner counts |
| `sl-funding-open-rfps-q2-2026` | funding-data | Currently open SCF sponsor briefs |
| `sl-funding-smart-account-passkey-rfps` | funding-data | Smart-account/passkey sponsor briefs |
| `sl-funding-hummingbot-kelp-closed` | funding-data | Closed Kelp/market-making RFP and same-round RFPs |
| `sl-ecosystem-crowded-vs-underbuilt-category` | ecosystem-data | Crowded vs underbuilt project categories |
| `sl-ecosystem-highest-scf-funded-ratio-category` | ecosystem-data | Category with highest SCF-funded ratio |
| `sl-ecosystem-asset-rwa-underbuilt-unfunded` | ecosystem-data | Asset/RWA category size and funding status |
| `sl-builders-pedro-hackathon-winner` | builder-data | Builder directory hackathon winner |
| `sl-builders-kenya-location` | builder-data | Kenya-based Stellar builders |
| `sl-builders-kale-pau-koh-top-kale` | builder-data | KALE-focused builders |
| `sl-research-x402-stellar-live` | research-data | x402 on Stellar live/theoretical status |
| `sl-research-soroban-auth-recursion-dos` | research-data | Soroban auth recursion / DoS audit finding |
| `sl-research-sep41-soroban-token-draft` | research-data | SEP-41 token interface and status |

## Reviewer Outputs

Write independent findings here:

- `research/golden/_meta/_prior-art/review-theboycoder-stellarlight-overlap.md`
- `research/golden/_meta/_prior-art/review-theboycoder-stellarlight-grounding.md`
- `research/golden/_meta/_prior-art/review-theboycoder-stellarlight-adversarial.md`

The coordinator should synthesize into:

- `research/golden/_meta/_prior-art/review-theboycoder-stellarlight-synthesis.md`

Expected synthesis table columns: `gist_id`, `verdict`, `existing_coverage`, `grounding_status`,
`recommended_raven_category`, `expected_cards`, `rubric_notes`, `reasoning`.

Verdicts: `ADOPT`, `REFRAME`, `COVERED`, `REJECT`, `DEFER_FRESHNESS`.
