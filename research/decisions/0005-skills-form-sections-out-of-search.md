# ADR-0005: Skill sections leave search (exposed, `searchable: false`)

- Status: accepted (2026-07-13); shipped as the default catalog build and deployed
- Decision rule (user): skills are first-class, but their *representation in search* is an
  empirical question — decide by pre-registered A/B on golden Q→A accuracy, not by taste
  (todo 890: "review… how to actually utilize, surface and deliver skills").
- Driver: Solo todo 890 (skills program); full experiment record in Solo scratchpad 608.

## Context

Since round 3 (todo 810) the catalog carried one search entry per `##` section of every
skill — 204 `skill-section` cards beside 18 whole-skill cards and 50 operations. Sections
existed so mid-skill content (error codes, flags, function names) was lexically reachable,
but they are near-duplicate fragments of documents whose whole-skill entry also ranks: on
shared topical vocabulary they crowded the operations the search tool exists to route to.
The skills program asked whether that representation earns its keep, whether skills should
be in search at all, and whether a distilled parent-keyword form beats both.

## Decision

Skill sections stay **exposed** (exact-id `codemode.skill.read`, `availableSections`,
bundle, schemas all unchanged) but leave **search**: `buildSkills` stamps every
`skill-section` entry `searchable: false`, and `scoreCandidates` drops non-searchable
entries before scoring. Whole-skill entries remain searchable. Discovery is
whole-skill-first; section reads are a follow-up affordance, not a routing surface.

The `searchable` field is the general seam: exposure (can the model call/read it) and
search membership (does it compete in ranking) are independent axes on one entry — no
second manifest, no parallel mechanism.

## Evidence (2026-07-13, scratchpad 608)

Four pre-registered arms over identical inputs (treatment audit: ops byte-identical,
bundle pinned, only the skills search representation moving):

- **A** — status quo: sections searchable (control).
- **B** — sections exposed but out of search. **Winner, shipped.**
- **C** — all skill entries out of search. Banked: +30/−1 offline, held for a possible
  follow-up from the B baseline.
- **D** — parent keyword distillation (section vocabulary folded into the whole-skill
  entry's lever-4 keywords). Eliminated offline (P3); removed from the builder.

B vs A: offline legacy strict 205/272/305 → 209/285/316 with the skills lane at its 18/23
floor; interloper capture 68→56 (top-1) / 278→214 (top-5); paid paired QA (3× QA-30 per
arm, counterbalanced) 41C/7W vs 39C/9W with stable per-case wins 3–1 for B and a flat
skills stratum (the OpenZeppelin case stayed correct 6/6 via whole-skill discovery alone);
live-v2 ten-case guard zero wrongs across 3 runs; 3× agent-discovery runs B ≥ A on every
overall metric. Adversarial pre-review of the design and a post-hoc verdict review both
completed (reviewer ≠ author).

## Consequences

- `eval/gates.json` was re-baselined to 209/285/316 in the same change (its note carries
  the numeric summary; this ADR is the durable *why*).
- Scoring lever 2 (0.75 section damping) and lever 4 (section keywords) still exist but
  only act in experiment arms that re-enable sections; the shipped catalog never scores a
  section.
- Arm A stays buildable (`node scripts/build-catalog.mjs --skills-form A`) so future
  rounds can rerun the control; arm C's evidence is banked in scratchpad 608.
- Emitted text (instructions, demo, micro-map) may reference section *reads* but must not
  imply sections appear as search hits.

## Amendment (2026-07-30)

The "bundle pinned" control in this round's validity record meant "skill content held constant",
which still describes what was measured. The bundle itself no longer exists (bodies are fetched
from their pinned commit — see the amendment on ADR-0003), and section entries now carry their
heading alone with no body excerpt or body-derived keywords, since nothing scores them in the
shipped arm. Arm A still re-enables both. The arm-B decision and its evidence are unchanged.
