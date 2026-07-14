---
id: sls-055
service: stellar-light-scout
status: reported-upstream
discovered: 2026-07-13
evidence:
  - 2026-07-13 production source-ceiling audit over four owned SDF-organizational QA cases, using Scout research/projects/builders, Lumenloop semantic/entity/A-V, and Stellar Docs search; solo://proj/49/scratchpad/sdf-organizational-s--630
  - q-org-sdf-structure-mandate: no exposed source returned the current Mandate page's self-funded/pays-taxes wording or the Terms page's Delaware nonprofit wording, while direct live reads did
  - q-org-sdf-enterprise-fund: exposed results returned historical portfolio scalars but not the current Enterprise Fund page's venture-style description and portfolio-totaling-over-$100m wording
  - boundary controls: Scout retrieved current mandate-bucket labels from an SDF blog and historical Chief Scientist/SCP material, showing that routing and blog/paper ingestion work while canonical non-blog page coverage is the residual
  - 2026-07-14 targeted QA q-org-mazieres-chief-scientist covered the required broad/detail plan but found historical title/SCP material without current canonical Team-page role, founder, and Stanford context
  - 2026-07-14 normalized-semantic generality round still left Justin Rice partial on both playground and main MCP because neither retrieved the live Team-page title as a dated observation
  - upstream issue filed 2026-07-13 America/New_York (2026-07-14 UTC): https://github.com/Stellar-Light/stellarlight/issues/533
recurrences:
  - date: 2026-07-14
    evidence: eval/qa/results/2026-07-14T03-29-01-variantA.json scored q-org-mazieres-chief-scientist wrong after five on-plan calls; the answer promoted a 2014-2015 Chief Scientist title as timeless current and omitted canonical founder/professor context
  - date: 2026-07-14
    evidence: the reopened playground generality artifact and eval/qa/results/2026-07-14T13-10-10-variantA.json both retrieved Justin Rice history but missed the live Team-page role and observation date
  - date: 2026-07-14
    evidence: source=sdf-org now covers Mandate, Terms, Enterprise Fund, Team, Foundation, and report pages, but the Team page's embedded leadership-role text (Founder and Chief Scientist; VP of Ecosystem) is still absent and records lack per-record crawl-observation dates
---

## Finding

Scout research does not reliably expose quotable canonical SDF organizational pages.
Its broad cited-research lane routes SDF-organizational questions correctly, but it
does not reliably expose quotable sections from canonical non-blog
`stellar.org` pages. This is a source-family coverage gap rather than another
named-person or keyword-ranking miss.

Two independent owned-QA failures reproduce the ceiling. For SDF's legal and
funding structure, all exposed research, project, builder, semantic, A/V, and
Docs searches missed the current Mandate page's statements that SDF is
self-funded and pays taxes and the Terms page's Delaware-nonprofit wording.
For the Enterprise Fund, the same broad fan-out returned older portfolio
figures but not the current page's venture-style description and
portfolio-totaling-over-$100m statement. Direct live reads of the canonical
pages contained those facts.

The gap extends beyond those two probes: the family also depends on Foundation,
Team, current and historical Mandate, Quarterly Reports, and related
organization pages. Some adjacent claims are already retrievable from SDF blog
articles or papers, so per-query synonyms would hide the underlying page-family
omission and create uneven coverage.

## Evidence

The 2026-07-13 production audit exercised every currently exposed broad family:
`scout.searchResearch`, `scout.searchProjects`, `scout.getBuilders`,
`lumenloop.search_content_semantic`, `lumenloop.find_content_by_entity`,
`lumenloop.find_av_passages`, and `stellarDocs.search_docs`. It then compared
the results with direct live reads of:

- `https://stellar.org/foundation`
- `https://stellar.org/foundation/team`
- `https://stellar.org/foundation/mandate`
- `https://stellar.org/foundation/mandate/2019`
- `https://stellar.org/enterprise-fund`
- `https://stellar.org/terms-of-service`

The exact per-case result counts, claim classifications, counterargument, and
independent trigger adjudication are recorded in the internal audit ledger.
Existing `sls-006`
already covers SDF blog article-body ingestion, and `sls-052` covers routing
vocabulary; neither covers canonical non-blog organizational pages.

## Recommendation

Add a general canonical-SDF-site source family to `searchResearch` (for
example `sdf-site`) and ingest the substantive sections of non-blog
organizational pages, including Foundation, Team, current and historical
Mandate, Enterprise Fund, Quarterly Reports, and Terms. Preserve canonical URL,
page/update date when present, crawl observation time, section heading, and
verbatim text. Exclude navigation/listing boilerplate and retain rendered-page
semantics when embedded page data differs from visible content.

Guard the source family with representative claim probes across legal
structure, current fund scope, leadership-page rendering, historical mandate
labels, and report discovery. The fix should be corpus-wide and
provenance-bearing; do not implement per-person aliases, per-question ranking
rules, or a Raven-only duplicate endpoint.
