/**
 * Live-captured fixture — production raven.stellar.buzz MCP `execute`, 2026-07-06.
 * Op: lumenloop.search_directory   Args: { query: "Blend", limit: 5 }
 * Projection: strings > 160 chars truncated with a trailing ellipsis; arrays cut
 * to their first 2 items (live count was 5). Shape-true to the live payload.
 * Note the live quirk this preserves: a substring query for "Blend" surfaces
 * OTHER projects whose descriptions mention Blend — neither hit here is the
 * blend project, which is exactly the ambiguous-multi-hit resolution case.
 * Refresh via the live-drift runner checklist (research/skill-run-design.md §11 row 18).
 */
export default {
  ok: true as const,
  data: {
    count: 5,
    projects: [
      {
        slug: "backyard",
        title: "Backyard",
        description:
          "Backyard lets users create their own liquid yield strategy for stablecoins. Users build diversified stablecoin yield strategies by allocating across multiple yi…",
        category: "Financial Protocols",
        tags: ["DeFi", "Yield"],
        website: '["backyard.finance"]'
      },
      {
        slug: "bexo",
        title: "Bexo",
        description:
          "Bexo is a self-custodial USDC wallet and payments super app for Latin America. Users can pay at any QR merchant with pesos or crypto, swap between ARS and USDC …",
        category: "Applications",
        tags: ["Software Wallet", "On-Off Ramp"],
        website: '["bexo.app"]'
      }
    ]
  }
};
