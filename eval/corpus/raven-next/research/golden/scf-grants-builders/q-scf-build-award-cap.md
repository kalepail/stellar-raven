---
id: q-scf-build-award-cap
q: "What is the maximum award amount under the SCF Build Award, and in what currency is it paid?"
category: scf-grants-builders
subcategory: scf-mechanics
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [scout_research]
acceptable_cards: [stellar_docs_mcp, lumenloop_search_content_semantic, scout_analyze]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "The SCF Build Award caps at $150,000 per award.", weight: 5 }
  - { claim: "The award is denominated/paid in XLM (the budget is set in USD but disbursed in XLM).", weight: 4 }
should_have:
  - { claim: "This is the per-award cap under SCF v7.0 (effective January 2026).", weight: 2 }
  - { claim: "Build is the main SCF award; other tiers (Instawards, Public Goods, Growth Hack) have different caps.", weight: 2 }
nice_to_have:
  - { claim: "Funds are disbursed in milestone tranches rather than a single lump sum.", weight: 1 }
must_avoid:
  - { claim: "Do NOT state a wrong cap (e.g. $100K, $50K, $500K) as the SCF Build maximum.", weight: 5 }
  - { claim: "Do NOT conflate the SCF Build cap with the SDF Marketing Grant ($500K) or Matching Fund ($500K) — those are separate SDF-direct programs, not SCF Build.", weight: 4 }
  - { claim: "Do NOT claim the award is paid in USDC/USD by default (the Build Award is paid in XLM).", weight: 3 }
must_cite:
  - "An SCF handbook or communityfund.stellar.org page stating the $150K XLM Build cap."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award"
  - "https://communityfund.stellar.org/awards"
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §2.2/§11. The $500K SCF-vs-SDF trap is the defining must_avoid."
---

## Reference answer (gospel)

- The SCF Build Award caps at **up to $150,000 worth of XLM** per award ([SCF handbook — Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award); [communityfund.stellar.org/awards](https://communityfund.stellar.org/awards) shows "$150K in XLM").
- The budget is **set in USD but disbursed in XLM** — it is not paid in USDC/USD by default ([Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).
- This is the per-award cap under **SCF v7.0** (the Build structure introduced January 2026) ([Introducing SCF v7](https://stellar.org/blog/ecosystem/introducing-scf-v7)).
- Build is the **main** SCF award; other tiers carry different caps — e.g. Instawards (≤$15K XLM), Public Goods (≈$50K XLM/quarter), Growth Hack (~$20K base + up to $200K performance) ([Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).
- Funds are disbursed in **milestone tranches**, not a single lump sum ([Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)).
- The $150K SCF Build cap is **distinct from SDF-direct programs** — SDF Marketing Grant (up to $500K) and Matching Fund (up to $500K) are separate instruments, not SCF Build ([stellar.org/grants-and-funding](https://stellar.org/grants-and-funding)).

## Why these cards (routing rationale)

A factual SCF-program lookup → Scout's research corpus includes the SCF handbook; `scout_research`
is primary. The Stellar Docs MCP and Lumenloop semantic search are acceptable corroboration. Firing
general-web (Perplexity/Parallel) or any deep-research tier for a documented program fact is a miss.

## Edge / traps

The plausible-wrong answer confuses the SCF Build cap ($150K XLM) with SDF-direct caps ($500K
Marketing/Matching) or quotes a stale pre-v7 number.
