---
id: sk-005
service: skills
status: proposed
discovered: 2026-07-03
evidence:
  - gateway retirement decision + verification, Solo project 49, todo 825 (2026-07-03)
  - scripts/build-catalog.mjs RETIRED_ONBOARDING_SKILLS (deny-list-as-data, this repo)
  - content survey: lumenloop-api family teaches Bearer llmcp_ auth, key minting, REST envelope; playbooks reference tools by bare name only (zero REST markers)
---

## Finding

The lumenloop skill corpus mixes two audiences with no machine-readable marker. The
`lumenloop-api` family (connect/keys/billing/integrate/query/research) plus
`lumenloop-mcp-connect` teach **transport onboarding**: Bearer `llmcp_` auth, key
minting/rotation, rate limits, the REST response envelope, connector installs. The
seven playbooks (dossier, ecosystem-scout, scf-radar, digest, auditor, quickstart,
integration-finder) are **transport-agnostic methodology** — they reference tools by
bare name (`search_directory(query)`) and survive any transport.

For gateway/aggregator deployments that re-expose the tools behind their own auth
and envelope (this repo: sandboxed `lumenloop.*` fns, no network, host-held key,
`{ok,data}` envelope), the onboarding family is not just redundant but actively
misleading — it steers agents toward key management and raw HTTP that the sandbox
forbids. We retired those 7 from exposure on 2026-07-03 (deny-list-as-data;
bodies retained in the mirror as reference); the playbooks were verified clean and
kept.

## Evidence

Content survey and retirement verification in Solo todo 825. REST-marker scan across
the family vs the playbooks (transport markers 40+ per onboarding skill, 0 per
playbook).

## Recommendation

Add a machine-readable audience/transport field to skill frontmatter in
`lumenloop/lumenloop-skills` and the partner archive — e.g.
`audience: direct-consumer | any` or `transport: rest | mcp | agnostic` — so
downstream catalogs can filter mechanically instead of re-deriving the split by
content analysis. The playbooks' "reconnect the connector" pointers to
`lumenloop-mcp-connect` would also carry a graceful no-op for gateway contexts.
