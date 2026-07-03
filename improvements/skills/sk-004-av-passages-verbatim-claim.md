---
id: sk-004
service: skills
status: verified
discovered: 2026-07-03
evidence:
  - live probe 2026-07-03: find_av_passages returns only summary/long_summary (AI-generated) + start_offset — no transcript text field
  - lumenloop/lumenloop-skills @ d92c56b — stellar-project-dossier SKILL.md pipeline row 5 ("Direct quotes … transcript passages to quote"); stellar-ecosystem-digest Quality rules ("only find_av_passages gives verbatim passages")
  - Solo project 49, todo 825 (skills-harvest verification pass)
---

## Finding

Two `lumenloop-skills` playbooks teach that `find_av_passages` yields **verbatim,
quotable transcript passages**: `stellar-project-dossier` labels it "Direct quotes /
transcript passages to quote", and `stellar-ecosystem-digest` states "only
find_av_passages gives verbatim passages" as a quality rule. On the external lane
the tool returns only AI-generated `summary` / `long_summary` plus an opaque
`start_offset` — no transcript text field exists in the response. An agent following
the playbook will present an AI summary as a direct quote, which is exactly the
misattribution the digest skill's own "never present summaries as direct quotes"
rule tries to prevent.

## Evidence

Live probe above (2026-07-03): response item keys are `av_id, channel, created_at,
long_summary, similarity, slug, start_offset, summary, title, url`. Consistent with
the upstream tool description ("Transcript text itself is never returned — cite the
link + the passage summary").

## Recommendation

In `lumenloop/lumenloop-skills`: reword dossier pipeline step 5 to "passage-level
summaries to cite (with link + date), not verbatim quotes", and fix the digest
quality rule to say find_av_passages localizes WHERE a topic is discussed but its
text is still an AI summary — verbatim quotes require following the returned url.
