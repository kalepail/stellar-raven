---
id: q-edge-web-franklin-templeton-background
q: "Give me background on Franklin Templeton as a company — who they are and how big they are."
category: edge-governance
subcategory: general-web-only
axes: [edge-governance]
query_type: edge-nonstellar
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true   # background on a Stellar partner company = legit general-web context

must_have:
  - { claim: "Pins Franklin Templeton's specific identity: a large global asset-management / investment firm (Franklin Resources, NYSE: BEN) — not a crypto-native startup or a token.", weight: 5 }
  - { claim: "Answers from a general-web source rather than refusing because the company question is not strictly Stellar-specific.", weight: 4 }
should_have:
  - { claim: "Gives a sense of scale (large AUM / global investment manager).", weight: 3 }
  - { claim: "May note the Stellar connection (BENJI / the Franklin OnChain U.S. Government Money Fund on Stellar) as relevant context.", weight: 2 }
nice_to_have:
  - { claim: "Distinguishes the general company background from the on-chain product (BENJI) cleanly.", weight: 1 }
must_avoid:
  - { claim: "Do NOT decline as out-of-scope; company background on a known Stellar partner is legitimate general-web context.", weight: 4 }
  - { claim: "Do NOT fabricate a specific AUM figure, founding date, or leadership names without a citation.", weight: 4 }
must_cite:
  - "At least one reputable general-web source on Franklin Templeton."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.franklintempleton.com/
  - https://stellar.org/case-studies/franklin-templeton
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Reviewed 2026-06-29: pinned Franklin Templeton's identity (global asset manager, NYSE: BEN) in must_have. Stellar tie verified — FOBXX/BENJI launched on Stellar in 2021 (fund inception 2021-04-06; first US-registered fund using a public blockchain as system of record). AUM is freshness-sensitive — cite, don't assert a fixed number."
---

## Reference answer (gospel)

**General-web edge (should answer).** **Franklin Templeton** (Franklin Resources, NYSE: BEN) is a
**global asset-management firm** — one of the large global investment managers, with hundreds of billions
to roughly a trillion+ in AUM ([franklintempleton.com](https://www.franklintempleton.com/)). Raven should
answer from a general-web source rather than refusing because it is not strictly Stellar-specific. It may
note the Stellar connection — the **Franklin OnChain U.S. Government Money Fund (FOBXX), token BENJI**,
launched on Stellar in 2021
([Stellar case study](https://stellar.org/case-studies/franklin-templeton)) — as optional context kept
distinct from the company profile. It must **not** fabricate a specific AUM figure, founding date, or
leadership names without a citation (AUM is freshness-sensitive).

## Why these cards (routing rationale)

General company background lives on the open web, not in Stellar corpora — route to `perplexity_search`
/ `parallel_search`. The Stellar-specific BENJI fund is a separate (optional) lookup.

## Edge / traps

Wrong answers: refusing because "this isn't a Stellar question," or inventing precise AUM/founding facts.
