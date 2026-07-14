---
id: ll-004
service: lumenloop
status: reported-upstream
discovered: 2026-07-03
evidence:
  - live regression re-check 2026-07-14: authenticated partner-tier GET /v1/tools returned the same 18 rows as the anonymous control and omitted list_my_research, request_research, and research_result, while same-key GET /v1/me reported tools.available=21 and tools.visible=21
  - upstream regression issue filed 2026-07-14: https://github.com/lumenloop/lumenloop-backend/issues/42
  - research/services/lumenloop.md (documented quirk)
  - Solo project 49, todo 822, comments 2204-2210
  - live re-check 2026-07-09: authenticated partner-tier GET /v1/tools returned all 21 available tools, including list_my_research, request_research, and research_result; GET /v1/me independently reported tools.available=21 and tools.visible=21
  - anonymous control 2026-07-09: unauthenticated GET /v1/tools returned the intended 18 public tools, confirming tier-aware visibility rather than the former authenticated-list omission
  - 2026-07-14 follow-up after the regression stopped reproducing, requesting deployed fix context: https://github.com/lumenloop/lumenloop-backend/issues/42#issuecomment-4971409286
recurrences:
  - date: 2026-07-14
    evidence: same-key authenticated /v1/tools=18 versus /v1/me available=21 and visible=21; regression reported at https://github.com/lumenloop/lumenloop-backend/issues/42
---

## Finding

Partner items are again hidden from `/v1/tools` for a partner-tier caller, so a
complete authorized tool listing requires a union with `/v1/me`. The defect was
live-fixed on 2026-07-09 but recurred by 2026-07-14: authenticated and anonymous
listings both return 18 tools while partner `/v1/me` reports 21 visible tools.

## Evidence

The 2026-07-09 live control used the same partner credential for both endpoints.
`GET /v1/tools` returned 21 named rows including all three account-scoped tools,
and `/v1/me` reported `available: 21` / `visible: 21`. An anonymous request
returned 18 and omitted those three names, proving the service now applies the
expected tier-aware distinction. The same-key 2026-07-14 re-check regressed:
authenticated `/v1/tools` returned 18 rows and omitted all three account-scoped
names while `/v1/me` still reported 21 available/visible tools. Issue #42 records
the current reproduction and requested regression guard.

## Recommendation

Keep the authenticated listing and `/v1/me` counts consistent. Consumers may
retain the count cross-check as a drift guard, but no two-endpoint union is now
needed to discover partner-tier tool names.
