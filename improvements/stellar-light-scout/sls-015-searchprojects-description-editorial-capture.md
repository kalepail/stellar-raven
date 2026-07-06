---
id: sls-015
service: stellar-light-scout
status: verified
discovered: 2026-07-06
evidence:
  - agentic lane run 2026-07-06, workflow wf_b5be4d53-41f (30 cases x sonnet-5, low + medium efforts), compared against the 2026-07-04 agentic run
  - verdict-review workflow wf_01b3347d-1b8 (round-close review, eval round todo 846)
  - live verification 2026-07-06: the emitted searchProjects catalog description carries both the upstream product name-drops and the gateway's counter-balancing routing note
  - Solo project 49, todo 846
---

## Finding

First, credit where due: the 1.4.4/1.5.0 enrichments to `searchProjects`'
upstream description legitimately improved routing to scout for scout-shaped
questions — this gateway's routing gate re-baselined UP on them. The problem
is boundary spillover. The enriched description name-drops specific products
("named products (Etherfuse Stablebonds, Soroswap)", "specific products like
Etherfuse Stablebonds (USTRY/CETES)", block explorers by name) and claims
broad question phrasings ("who has built / which projects / give me a
directory") — and agents take the name-drops as a routing promise for ANY
question about those products, including editorial/analysis/content questions
that scout's directory records cannot answer and Lumenloop can.

Quantified from the 2026-07-06 agentic lane (workflow wf_b5be4d53-41f, 30
cases x sonnet-5 at low and medium effort) vs the 2026-07-04 run:
lumenloop-labeled cases fell from 37.5% to 12.5% primary routing, with
`searchProjects` the captor on 4 distinct cases — soroswap-what-is,
lobstr-wallet, rwa-overview, blend-tvl — at BOTH effort levels; in total 8 of
16 lumenloop-labeled agent runs were captured by `searchProjects`. Notably,
the gateway's own counter-balancing catalog note ("structured directory
facts, not editorial pieces — for articles, AV, interviews... use lumenloop")
is present in the emitted description and did not hold against the upstream
name-drops.

## Evidence

Reproducible by any consumer: fetch the live `searchProjects` operation
description (scout's self-description surface) and observe the product
name-drops quoted above alongside the directory-facts scope note; then hand
an agent an editorial question naming one of those products ("what is
Soroswap?", "tell me about the LOBSTR wallet") and watch tool selection. In
this round's runs the capture reproduced deterministically across both effort
levels on all 4 case types. Run records: agentic lane workflow
wf_b5be4d53-41f (2026-07-06) with the 2026-07-04 run as baseline; round-close
triage in workflow wf_01b3347d-1b8, Solo todo 846.

## Recommendation

Keep the enrichment's routing wins; contain the spillover. Cheapest fix:
scope the product name-drops in place — one clause such as "for
editorial/analysis content about these products (articles, interviews,
metrics commentary), see content platforms" turns the name-drop from a blanket
claim into a bounded one. Better structural fix: separate machine-routing
keywords from the prose description — put product names and question-phrasing
exemplars in a dedicated keywords/examples field so consumers can weight them
for discovery without LLM agents reading them as scope claims in the
description text. Consumer-side workaround: partial at best — this gateway
already ships the strongest available counterweight (an explicit
directory-vs-editorial note inside the same description) and it lost to the
upstream name-drops; further gateway-side scoring counterweights are tracked
as own-repo work in Solo, but every other consumer of scout's self-description
inherits the capture as-is.
