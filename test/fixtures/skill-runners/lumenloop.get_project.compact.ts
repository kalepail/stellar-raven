/**
 * Live-captured fixture — production raven.stellar.buzz MCP `execute`, 2026-07-06.
 * Op: lumenloop.get_project   Args: { slug: "blend", compact: true }
 * Projection: strings > 160 chars truncated with a trailing ellipsis; arrays cut
 * to their first 2 items. Shape-true to the live payload, sized for fixtures.
 * Refresh via the live-drift runner checklist (research/skill-run-design.md §11 row 18).
 */
export default {
  ok: true as const,
  data: {
    slug: "blend",
    title: "Blend Capital",
    description:
      "Blend is a decentralized finance (DeFi) protocol built on Stellar's Soroban smart contract platform, enabling users, DAOs, and institutions to create and manage…",
    category: "Financial Protocols",
    tags: ["DeFi", "Lending & Borrowing"],
    operating_region: ["Global"],
    based_in: "United States",
    other_names: ["Blend"],
    parent: "Script3",
    links: {
      website: ["blend.capital"],
      x: ["blend_capital"],
      discord: ["discord.gg/a6cdbqqcjw"],
      youtube: ["youtube.com/@blend_capital"],
      github: ["github.com/blend-capital"]
    },
    scf: {
      awarded_round: ["Liquidity Award - '24 Q1"],
      awarded_total: 50000,
      submission_urls: ["communityfund.stellar.org/submissions/recRSgNDEycVg2xG8"]
    },
    mainnet: { tokens: [], audits: [] }
  }
};
