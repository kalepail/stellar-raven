/**
 * Live-captured fixture — production raven.stellar.buzz MCP `execute`, 2026-07-06.
 * Op: lumenloop.find_similar_projects_semantic   Args: { slug: "blend", limit: 3 }
 * Projection: arrays cut to their first 2 items (live count was 3). Shape-true:
 * the payload is a BARE ARRAY of directory rows, not an object wrapper.
 * Refresh via the live-drift runner checklist (research/skill-run-design.md §11 row 18).
 */
export default {
  ok: true as const,
  data: [
    {
      slug: "yieldblox",
      title: "Yieldblox",
      category: "Financial Protocols",
      tags: ["DeFi", "Lending & Borrowing"],
      similarity: 0.7037114759237104
    },
    {
      slug: "turbolong",
      title: "Turbolong",
      category: "Financial Protocols",
      tags: ["DeFi", "Lending & Borrowing"],
      similarity: 0.6891446035657741
    }
  ]
};
