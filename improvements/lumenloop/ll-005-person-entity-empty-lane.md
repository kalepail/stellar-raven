---
id: ll-005
service: lumenloop
status: verified
discovered: 2026-07-03
evidence:
  - live probe 2026-07-03: find_content_by_entity {entity:"Denelle Dixon", entity_type:"person"} → success:true, all groups empty
  - control probe same session: {entity:"Stellar Development Foundation", entity_type:"organization"} → full groups (3/3/3/3/3)
  - Solo project 49, todo 825 (skills-harvest verification pass)
---

## Finding

`find_content_by_entity` advertises `entity_type: "person"` in its input schema enum,
but the external lane returns `success: true` with **all-empty content groups** for
person-type queries — even for people with guaranteed heavy corpus coverage (probe:
the SDF CEO). Because the response is `meta.format: "json"` with empty arrays (not a
`text` guidance payload), it normalizes as *evidence-shaped data*, so callers read
"no content mentions this person" as evidence of absence when it is lane behavior.
The partner-archive skill (`lumenloop-api-query` tool cheatsheet) documents the
restriction ("person-type results are not exposed on the external lane"), but the
tool schema and description do not.

## Evidence

Live probes above (2026-07-03, partner key). The organization control confirms the
tool itself works on this lane; only the person type is silently empty.

## Recommendation

Any one of, in preference order: (1) serve person entities on the external lane;
(2) drop `"person"` from the external-lane enum so bad calls fail loudly as
`invalid_arguments`; (3) state the restriction in the tool description /
`when_to_use` so agents route people-queries to `search_content_semantic`.
Mitigated on our side 2026-07-03 with a catalog description note
(`scripts/description-notes.mjs`, LUMENLOOP_DESCRIPTION_NOTES) — but every other
external consumer still hits it.
