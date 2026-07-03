---
id: q-ti-video-tutorials
q: "Are there official video/YouTube tutorials for learning Stellar/Soroban, and which should a beginner start with?"
category: tooling-infra
subcategory: developer-tooling
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_av_passages]
acceptable_cards: [lumenloop_search_content_semantic, perplexity_search, scout_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Answers yes, there are official/durable video resources, but recommends beginning with official docs plus beginner guides rather than relying only on videos.", weight: 5 }
  - { claim: "Names the Stellar Development Foundation/Build on Stellar video channel or Stellar Developers YouTube as the official-style source to check for current videos.", weight: 4 }
  - { claim: "Recommends a beginner path: Stellar basics/accounts/transactions first, then Stellar CLI, then Soroban getting-started/hello-world/deploy-to-testnet, then wallet/frontend tutorials.", weight: 4 }
  - { claim: "Uses LumenLoop AV/content search or a dated web source for specific talk/video recommendations rather than inventing titles.", weight: 4 }
  - { claim: "Warns that video UIs/CLI commands can age; verify against developers.stellar.org before copying commands.", weight: 3 }
should_have:
  - { claim: "Mentions official developer meetings/talks can be useful for current ecosystem/tool updates.", weight: 2 }
  - { claim: "Mentions community creators can be useful but should be treated as secondary to official docs for current commands.", weight: 2 }
nice_to_have:
  - { claim: "Suggests choosing videos by date and matching protocol/CLI version.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate exact video titles, publication dates, or official status.", weight: 5 }
  - { claim: "Do NOT recommend stale `soroban` CLI commands without checking current docs.", weight: 4 }
must_cite:
  - "LumenLoop AV/content search, official Stellar developer docs, or official Stellar/Build on Stellar video source."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://www.youtube.com/@StellarDevelopmentFoundation
  - https://developers.stellar.org/docs/build/guides/basics
  - https://developers.stellar.org/docs/build/smart-contracts/getting-started
  - https://developers.stellar.org/meetings
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Scout research returned official dev-doc and developer-meeting material but not a clean ranked YouTube playlist. Exact videos/timestamps remain best-effort and should come from LumenLoop AV or current official channel search when available."
---

## Reference answer (gospel)

Yes, but a beginner answer should not be "watch random videos only." Start with official docs for the commands, then use videos as walkthroughs. Recommended path: Stellar Basics for accounts/transactions [Stellar Basics](https://developers.stellar.org/docs/build/guides/basics), Stellar CLI setup/use, then Soroban Getting Started/Hello World/Deploy to Testnet [Soroban getting started](https://developers.stellar.org/docs/build/smart-contracts/getting-started), then wallet/frontend tutorials.

For video sources, check official SDF/Build on Stellar video channels such as the [Stellar Development Foundation YouTube channel](https://www.youtube.com/@StellarDevelopmentFoundation) and official developer meetings [developers meetings](https://developers.stellar.org/meetings). Use LumenLoop AV/content search for named talk recommendations or timestamps when the user asks for videos. Always verify commands against developers.stellar.org because older videos may show the legacy `soroban` binary or pre-current Lab/CLI UI.

## Why these cards (routing rationale)

The expected card is `lumenloop_find_av_passages` because the user asks specifically for video/tutorial media. `lumenloop_search_content_semantic` and `perplexity_search` are acceptable for discovering official videos/pages. I added `scout_research` as acceptable because it can return official dev-doc/developer-meeting records but it is not ideal for AV passage extraction.

## Edge / traps

Do not fabricate a playlist or quote stale video commands as canonical. A correct Raven answer should route to AV search for media, then anchor the learning path in official docs.
