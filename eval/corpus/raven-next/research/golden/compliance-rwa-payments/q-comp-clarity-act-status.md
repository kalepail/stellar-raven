---
id: q-comp-clarity-act-status
q: "What's the current status of the US CLARITY Act (crypto market structure bill) and what would it change for tokens like XLM?"
category: compliance-rwa-payments
subcategory: regulatory-treatment-xlm
axes: [edge-governance, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: regulatory-change
expected_cards: [perplexity_search]
acceptable_cards: [parallel_search]
forbidden_cards: []
expected_service: perplexity
should_fire: true

must_have:
  - { claim: "The CLARITY Act is a US crypto market-structure bill that is still in the legislative process (not yet enacted law as of mid-2026), and the answer says so.", weight: 5 }
  - { claim: "Explicitly flags that legislative status changes quickly and the answer is freshness-sensitive (reward checking current status).", weight: 4 }
should_have:
  - { claim: "Notes it would help allocate jurisdiction between the SEC and CFTC for digital commodities vs securities.", weight: 3 }
  - { claim: "References a dated milestone (e.g. a 2026 Senate Banking Committee advancement) rather than asserting it passed.", weight: 2 }
nice_to_have:
  - { claim: "Bill identifier (e.g. H.R.3633) as a checkable detail.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the CLARITY Act has been signed into law / is in force if it has not been.", weight: 5 }
  - { claim: "Do NOT invent a specific provision settling XLM's status as fact.", weight: 4 }
  - { claim: "Do NOT source legislative status from Stellar developer docs.", weight: 2 }
must_cite:
  - "A dated legislative/news source (congress.gov, Senate Banking, law firm, reputable news)."
must_not_use_tier: []

pass_threshold: 0.78
weight_profile: strict

sources:
  - https://www.congress.gov/bill/119th-congress/house-bill/3633/text
  - https://www.lw.com/en/us-crypto-policy-tracker/legislative-developments
  - https://www.cnbc.com/2026/05/14/clarity-act-congress-crypto-senate.html
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29 reviewed; status remains freshness-gated (regulatory-change horizon), rubric rewards 'not yet law, confirm current status'. FRESHNESS. VERIFIED status (as of 2026-06-22): CLARITY Act = Digital Asset Market Clarity Act (H.R.3633). Passed the HOUSE July 17, 2025 (294-134). Senate Banking Committee advanced it 15-9 on May 14, 2026; placed on Senate Legislative Calendar June 1, 2026. STILL requires: full Senate floor (60 votes), reconciliation with Senate Agriculture text, re-passage by the House, and the President's signature — NOT yet enacted. Reward flagging 'not yet law, status evolving'; must_avoid: claiming it passed/was signed."
---

## Reference answer (gospel)

- The **CLARITY Act (Digital Asset Market Clarity Act, H.R.3633)** is a US **crypto market-structure bill
  that is still in the legislative process — NOT yet enacted law** as of mid-2026 [1][2].
- It would **allocate jurisdiction between the SEC and CFTC** for digital commodities vs. securities (a
  **decentralization-based test** for when a network token is not a security) [2].
- Dated milestones: **passed the House July 17, 2025 (294-134)**; the **Senate Banking Committee advanced
  it 15-9 on May 14, 2026**; placed on the Senate calendar **June 1, 2026** [2][3]. It **still needs** a
  full Senate floor vote (60 votes), reconciliation with the Senate Agriculture text, re-passage by the
  House, and the President's signature [2].
- **Legislative status changes fast — this is freshness-sensitive; confirm current status.** Do **not**
  claim it is signed/in force, and do **not** invent a specific provision settling XLM's status.

Sources: [1] congress.gov H.R.3633; [2] Latham US Crypto Policy Tracker; [3] CNBC (May 14, 2026).

## Why these cards (routing rationale)

Pending-legislation status is general-web + recency → `perplexity_search`/`parallel_search`. Not a Stellar fact.

## Edge / traps

Trap: asserting the bill is law; inventing a settled XLM provision.
