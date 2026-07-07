/**
 * Live-captured fixture — production raven.stellar.buzz MCP `execute`, 2026-07-06.
 * Op: lumenloop.find_content_about_project
 * Args: { slug: "blend", limit: 2, types: ["articles","av","events","research"],
 *         response_format: "concise" }
 * Projection: strings > 160 chars truncated with a trailing ellipsis; arrays cut
 * to their first 2 items. Shape-true to the live payload, sized for fixtures.
 * Shape notes the runner projection depends on: payload is a map keyed by
 * content type; the date field differs per type (articles: publishing_date,
 * av/research: created_at, events: start_at); research rows carry NO url.
 * Refresh via the live-drift runner checklist (research/skill-run-design.md §11 row 18).
 */
export default {
  ok: true as const,
  data: {
    articles: [
      {
        id: "8535",
        title: " Blend & Rivool case study",
        url: "https://x.com/i/article/2065568320821096448",
        domain: "x.com",
        publishing_date: "2026-06-12 23:04:14+00",
        summary:
          "Rivool integrated Blend's DeFi lending protocol to bring onchain yield into managed, risk-profiled strategies for financial advisors and their clients. Instead …",
        slug: "blend-rivool-case-study",
        similarity: 0.631472180916132
      },
      {
        id: "8520",
        title: "OctoPos DeFi Risk Monitoring on Stellar",
        url: "https://x.com/i/article/2065506647993118720",
        domain: "x.com",
        publishing_date: "2026-06-17 22:53:27+00",
        summary:
          "OctoPos RMS, a real-time DeFi risk monitoring system built by crediolabs, went live on Stellar to monitor Blend's lending pools. The tool detects oracle anomali…",
        slug: "octopos-defi-risk-monitoring-stellar",
        similarity: 0.54435627391412
      }
    ],
    av: [
      {
        id: "492",
        title: "Decentralized Lending Pools | Blend Capital",
        url: "https://www.youtube.com/watch?v=chy2GdyKUzM",
        channel: "James Bachini",
        created_at: "2026-04-02T23:24:41.620Z",
        summary:
          "Tutorial on Blend Protocol, an over-collateralized lending platform on Stellar. Covers how the protocol works, testnet UI walkthrough, and how developers can bu…",
        slug: "decentralized-lending-pools-blend-capital",
        similarity: 0.6533431340399783
      },
      {
        id: "1471",
        title: "Blend Blastoff: How to use DeFi Protocol to Drive User Adoption | Meridian 2024",
        url: "https://www.youtube.com/watch?v=58j0QkXKiDU",
        channel: "Stellar Development Foundation",
        created_at: "2026-05-01T07:20:39.623Z",
        summary:
          "Marcus from Script3 presented Blend Capital's five-month performance on Soroban, highlighting 237 unique wallets, $8.58M total deposits, and innovative auction-…",
        slug: "blend-blastoff-use-defi-protocol-drive-user-adoption",
        similarity: 0.6112987889208686
      }
    ],
    events: [
      {
        id: "1425",
        title: "MORNING ALPHA w/ Etherfuse + Stellar +Shinhan",
        url: "https://luma.com/9r2exe6m",
        start_at: "2026-05-05T13:00:00.000Z",
        platform: "luma",
        summary:
          "Invite-only brunch during Consensus Miami 2026 hosted by Etherfuse, Shinhan Securities, Stellar, and Myosin for institutional investors and builders exploring r…",
        slug: "morning-alpha-w-etherfuse",
        similarity: 0.4416616734215111
      }
    ],
    research: [
      {
        id: 80,
        title: "Cypher Integrates Stellar",
        format: "long-form",
        summary:
          "Cypher, a multi-chain wallet and crypto card, integrated with Stellar on May 28, 2026, consolidating wallet, card, DEX swap, cross-chain bridge, and Blend lendi…",
        slug: "cypher-integrates-stellar",
        created_at: "2026-05-28T21:36:37.683Z",
        similarity: 0.5639286743272094
      }
    ]
  }
};
