# Adversarial review: theboycoder StellarLight data-layer prior art

Date: 2026-06-25

Sources reviewed:

- Intake brief: `research/golden/_meta/_prior-art/_incoming/2026-06-25-theboycoder-stellarlight-data-layer-intake.md`
- Source gist: <https://gist.github.com/theboycoder/9aba5b80f3a3534323211e30562d4ab7>
- Raw JSON: <https://gist.githubusercontent.com/theboycoder/9aba5b80f3a3534323211e30562d4ab7/raw/stellarlight-golden-questions-cf-flue.json>
- Golden schema/governance: `research/golden/README.md`, `research/golden/_template.md`, `research/decisions/0023-golden-question-battery.md`
- Capability cards checked against `src/capability-index.ts` and `research/golden/_meta/CARDS.md`

## Adversarial Findings

The gist is useful prior art for Raven only after reframing. It is deliberately optimized for cf-flue
adapter discrimination: every case is `liveSource:true`, several rubrics require a specific
StellarLight tool or internal field, and many `canonicalFacts` are exact live database values. Raven's
contract is different: it should return sourced evidence over MCP, with provenance and confidence,
not prove that a specific adapter was queried or that a frozen regex matched a live table snapshot.

| gist_id | risk_level | rubric_fit | fairness_prereq | adversarial_notes | recommended_verdict |
| --- | --- | --- | --- | --- | --- |
| `sl-priorart-lending-scf-flagships` | medium | Good Raven question if reframed as prior-art plus funding evidence, not "prove search_projects". | `scout_projects` plus possibly `lumenloop_get_scf_submissions` or directory evidence that includes SCF status. Project filters for category or `scfAwarded` are not fully wired, so avoid exhaustive "all lending" gates. | Useful because it asks a realistic builder question. Risk is "flagship" and "serious backed teams" are subjective, and the gist overfits to directory membership and SCF flags. Grade on cited evidence that lending is not greenfield and at least two named Stellar projects have funding evidence. | REFRAME |
| `sl-priorart-oracle-reflector-leader` | medium | Partly fit; "leading/highest-signal" needs an explicit evidence basis. | `scout_projects`, `stellar_docs_mcp`, and optionally LumenLoop project content. If using "highest-signal", Raven needs a cited metric or multiple evidence signals, not an unexposed prominence field. | The current rubric risks encoding StellarLight's internal ranking as truth. Reflector can be a good expected answer, but the rubric should accept "best-supported by cited docs, integrations, funding, and usage evidence" rather than require a hidden prominence score. | REFRAME |
| `sl-priorart-rwa-treasuries-not-scf` | low | Strong fit as a misconception test about institutional RWA issuers versus SCF-funded tooling. | `scout_projects` and primary issuer or Stellar docs/news citations. SCF status should be cited from Scout/LumenLoop, not assumed. | This is one of the better candidates: it tests evidence synthesis and avoids live rank fragility. Keep `must_avoid` around falsely calling the named issuers SCF-funded, but do not require all four names. | ADOPT |
| `sl-code-passkey-wallet-top-repo` | high | Useful topic, brittle as written because "highest-quality", exact `repoScore 56`, and "right now" are live-ranking assertions. | `scout_repos` must return ranked repoScore evidence with a dated snapshot. Golden should have `freshness_sensitive: true`, weekly or monthly horizon, and score tolerance. | Exact repoScore and top-rank gates turn Raven into a database regression suite. A Raven-shaped version should ask for high-signal open-source references with cited repo evidence and accept changed rankings when Raven flags the as-of date. | DEFER_FRESHNESS |
| `sl-code-zk-xray-games-top` | high | Mixed. Good evidence question, but top-two rank and exact scores are volatile. | `scout_repos`; hackathon-win claim needs `scout_hackathons` plus reliable detail expansion or another citable hackathon source. | The "top ZK repo right now" premise is live and rank-fragile. The hackathon-winner join is useful, but should be graded as "cite a ZK repo and winner evidence" rather than exact #1/#2 score ordering unless kept in a rolling freshness slice. | DEFER_FRESHNESS |
| `sl-code-soroban-oracle-least-bad` | high | Valuable only as a freshness/ranking case; too score-specific for static golden. | `scout_repos` with current repoScore evidence. If "the three repos that show up" is based on a seed query, the rubric must preserve the query/date and tolerate changed results. | The phrase "least bad" and exact 26/15/9/46 ordering target a particular search-result snapshot. This is fragile and potentially prompt-targeted to Scout internals. | DEFER_FRESHNESS |
| `sl-hackathon-blend-winners` | high | Good historical question, but unfair until named hackathon detail lookup is reliable. | Raven has `scout_hackathons` and expansion-only `scout_hackathon_detail`, but `scout_hackathons` ignores free-text `q` and returns a limited catalog. A singular event lookup or slug-resolution path is required. | The facts are historical and suitable, but the gist assumes `get_hackathon`. Raven may not surface the named event slug from a generic catalog call, making failure a capability gap rather than a reasoning miss. | DEFER_CAPABILITY |
| `sl-hackathon-kale-reflector-1st` | high | Good trap if the detail surface is reachable; unfair as a router test today. | Same as above: reliable named-event slug resolution into `scout_hackathon_detail`, or another citable source path. | This is a useful adversarial trap against guessing from KALE-themed names, but it requires singular hackathon detail. Do not adopt until the card can fairly fetch that event. | DEFER_CAPABILITY |
| `sl-hackathon-kale-vs-blend-counts` | high | Comparison intent is not fair today. | `scout_hackathon_compare` is documented dormant and `runtimeReady:false`; a compare-intent pair-driver or reliable two-event detail expansion is required. | This is exact-count, cross-event database comparison. It directly exercises a missing/dormant Raven capability and should not be a golden failure until that support exists. | DEFER_CAPABILITY |
| `sl-funding-open-rfps-q2-2026` | high | Useful live funding-opportunity question, but not a static golden. | `scout_rfps` can support it, but it must be a rolling freshness item with an as-of date, active-quarter caveat, and source timestamp. | "Right now", "open this round", exact 5 open, and Q2 2026 will go stale quickly after 2026-06-30 or any RFP update. Static adoption would punish correct fresh answers later. | DEFER_FRESHNESS |
| `sl-funding-smart-account-passkey-rfps` | high | Useful live funding filter, but current-open status is volatile. | `scout_rfps`; rolling freshness horizon tied to SCF/RFP round changes. | The distinction between Passkey UI Kit and OZ Accounts Policy Builder is good, but "open opportunity" is time-sensitive. Require Raven to cite current RFP status and say "as of". | DEFER_FRESHNESS |
| `sl-funding-hummingbot-kelp-closed` | low | Stronger fit because it asks a historical closed-brief question rather than a current-open list. | `scout_rfps` and optionally SCF/LumenLoop source evidence. | This is mostly stable: exact title, closed status, and Kelp framing. The "same round" list can be nice-to-have, not a hard exact list, to avoid turning it into table-diff grading. | ADOPT |
| `sl-ecosystem-crowded-vs-underbuilt-category` | high | Concept is useful, but exact current category counts are live analytics. | `scout_clusters` is available. Use `freshness_sensitive: true`, weekly/monthly horizon, dated count snapshot, and approximate/tolerant scoring. | Counts like 204, 1, and 3 are live database values. The stable skill is reasoning from saturation evidence; the brittle part is freezing exact cardinalities. | DEFER_FRESHNESS |
| `sl-ecosystem-highest-scf-funded-ratio-category` | high | Good ratio-vs-absolute-count trap, but exact ratio inputs are live. | `scout_clusters` or `scout_analyze`; rubric must require cited current counts and tolerate changed category totals. | This is a useful analytical question if it grades the distinction between ratio and absolute count. It is bad as a hard 47/78 and 110 gate in the static battery. | DEFER_FRESHNESS |
| `sl-ecosystem-asset-rwa-underbuilt-unfunded` | medium | Good misconception test, but current Asset count and SCF-funded count should be dated. | `scout_clusters` plus project evidence from `scout_projects` for named examples. | The "open lane, not crowded" point is useful. The exact 3 projects and 0 SCF-funded assertion should be freshness-gated and allowed to change with the Scout snapshot. | REFRAME |
| `sl-builders-pedro-hackathon-winner` | medium | Fit depends on builder bios being sufficient evidence; avoid over-requiring directory-only proof. | `scout_builders` can search people, but the rubric should cite the builder profile and preferably an external hackathon source if available. | Useful "attended versus won" distinction. Risk is that the source of truth is a bio field, so Raven should not be punished for uncertainty if the profile is self-reported or ambiguous. | REFRAME |
| `sl-builders-kenya-location` | medium | Useful builder discovery, but exact people count and location filtering are live directory behavior. | `scout_builders`. The current card maps query text to `q`; it does not explicitly send a `location` parameter even though the endpoint advertises one. Strong exact-count grading should wait for location filter wiring. | Good user-facing recruiting query. Require named sourced candidates, not "exactly 2" as a hard gate unless the location filter is wired and the snapshot is dated. | REFRAME |
| `sl-builders-kale-pau-koh-top-kale` | medium | Reasonable niche-builder discovery question, but single-match exactness is directory-snapshot fragile. | `scout_builders` with `q=kale`; optional `scout_projects` or repo evidence for Top Kale. | Useful as an honest "niche term is not empty" test. Do not hard-fail if new KALE builders appear; grade on citing at least one matching builder and not fabricating. | REFRAME |
| `sl-research-x402-stellar-live` | low | Strong Raven fit if grounded in official Stellar docs, not StellarLight-provider proof. | `stellar_docs_mcp` and/or `scout_research`; should accept developers.stellar.org evidence directly. | The gist's "do not answer without surfacing the StellarLight dev-docs record" is over-specific. Raven should cite the Stellar docs x402 page and state whether there is a runnable demo/support, with freshness caveat if docs change. | ADOPT |
| `sl-research-soroban-auth-recursion-dos` | low | Strong research/evidence fit. | `scout_research`, maybe `parallel_extract` for known audit URLs if needed. | This is a good nuanced security question: it tests severity plus "critical but invalid/not exploitable" nuance. Remove the provider-leak requirement and focus on cited audit evidence. | ADOPT |
| `sl-research-sep41-soroban-token-draft` | medium | Good standards question, but status can change and official sources should be accepted. | `stellar_docs_mcp`, `scout_research`, or direct SEP GitHub evidence. Freshness horizon should be protocol-release or SEP-status-change. | Useful trap against wrong SEP number or assuming finality. Risk is hardcoding Draft forever and requiring StellarLight specifically. Grade on citing the current SEP record and flagging status as of the cited date. | REFRAME |

## Policy for Data-Layer and LiveSource Candidates

1. Treat StellarLight data-layer questions as evidence-discovery probes, not adapter-verification probes.
   Rubrics may name expected Raven cards, but `must_have` and `must_avoid` should not require that Raven
   "used StellarLight", "retrieved the Scout record", or reproduced internal fields unless those fields
   are visible, citable evidence in Raven's output.

2. Put live rankings, current-open opportunities, exact counts, and "right now" questions in a rolling
   freshness slice. They need `freshness_sensitive: true`, a concrete horizon such as `weekly`,
   `monthly`, `scf-round`, or `protocol-release`, and rubric language that rewards an as-of date and
   staleness caveat. Exact counts or scores should usually be `nice_to_have` or tolerant ranges, not hard
   gates.

3. Historical records can be static if the source is durable. Hackathon winners, closed RFPs, audit
   findings, and published SEP history are fair static candidates once Raven has a reachable card path and
   the rubric cites primary or durable sources.

4. Do not adopt candidates that require missing capability-card behavior. In this intake, singular named
   hackathon lookup, hackathon pair comparison, explicit builder location filters, and exact project
   category or SCF-status filtering are the main fairness risks. These should become golden questions
   only after the relevant card support is runtime-ready and represented in `expected_cards`.

5. Avoid turning the golden set into a live database regression suite. Raven should be graded on whether
   it finds relevant, sourced, current-enough evidence; distinguishes uncertainty; and avoids false
   claims. It should not be graded primarily on matching a frozen Scout row count, hidden repoScore,
   internal prominence rank, or answerRegex.

6. Preserve prompt hygiene. Gist fields such as `answerRegex`, `toolsAll`, `discriminator`, and
   provider-specific "proves a real query" language are intake metadata only. They should not be copied
   into Raven-facing rubrics except as human review notes, and never as wording that teaches the model the
   expected answer shape.
