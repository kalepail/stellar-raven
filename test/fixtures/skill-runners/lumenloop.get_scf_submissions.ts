/**
 * Live-captured fixture — production raven.stellar.buzz MCP `execute`, 2026-07-06.
 * Op: lumenloop.get_scf_submissions   Args: { slug: "blend" }
 * Projection: strings > 160 chars truncated with a trailing ellipsis; arrays cut
 * to their first 2 items. Shape-true to the live payload, sized for fixtures.
 * (No `status` field on live rows — award status rides `award_type`/`round`;
 * the runner projects status as null when absent.)
 * Refresh via the live-drift runner checklist (research/skill-run-design.md §11 row 18).
 */
export default {
  ok: true as const,
  data: {
    count: 1,
    submissions: [
      {
        slug: "recRSgNDEycVg2xG8",
        linked_project_slug: "blend",
        linked_project_slugs: ["blend"],
        title: "Blend Capital",
        project: "Blend",
        submission_url: "https://communityfund.stellar.org/submissions/recRSgNDEycVg2xG8",
        round: "Liquidity Award - '24 Q1",
        round_number: null,
        award_type: "Liquidity Award",
        category: "Financial Protocols",
        budget: "50000",
        description:
          "Blend is a modular liquidity protocol, it allows anyone to deploy lending pools that meet their project's unique requirements and automatically manages the econ…",
        application: null,
        website: "https://blend.capital",
        github_url: "https://github.com/blend-capital",
        architecture_url: null
      }
    ]
  }
};
