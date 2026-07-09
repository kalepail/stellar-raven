---
id: ll-004
service: lumenloop
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - research/services/lumenloop.md (documented quirk)
  - Solo project 49, todo 822, comments 2204-2210
  - live re-check 2026-07-09: authenticated partner-tier GET /v1/tools returned all 21 available tools, including list_my_research, request_research, and research_result; GET /v1/me independently reported tools.available=21 and tools.visible=21
  - anonymous control 2026-07-09: unauthenticated GET /v1/tools returned the intended 18 public tools, confirming tier-aware visibility rather than the former authenticated-list omission
---

## Finding

Partner items were hidden from `/v1/tools` even for a partner-tier caller, so a
complete tool listing required a union with `/v1/me`. The defect no longer
reproduces: authenticated partner-tier listing now returns all 21 tools, while
anonymous listing correctly remains the 18-tool public surface.

## Evidence

The 2026-07-09 live control used the same partner credential for both endpoints.
`GET /v1/tools` returned 21 named rows including all three account-scoped tools,
and `/v1/me` reported `available: 21` / `visible: 21`. An anonymous request
returned 18 and omitted those three names, proving the service now applies the
expected tier-aware distinction.

## Recommendation

Keep the authenticated listing and `/v1/me` counts consistent. Consumers may
retain the count cross-check as a drift guard, but no two-endpoint union is now
needed to discover partner-tier tool names.
