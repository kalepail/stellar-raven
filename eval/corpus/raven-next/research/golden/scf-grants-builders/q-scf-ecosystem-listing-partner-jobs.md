---
id: q-scf-ecosystem-listing-partner-jobs
q: How do I get my project listed on the Stellar ecosystem directory, become a partner/service provider or hackathon sponsor, find Stellar/Soroban jobs, and what is the Matching Fund?
category: scf-grants-builders
subcategory: ecosystem-inbound
axes:
  - ecosystem-spectrum
  - edge-governance
query_type: discovery
difficulty: hard
freshness_sensitive: true
freshness_horizon: monthly
expected_cards:
  - scout_projects
acceptable_cards:
  - scout_rfps
  - scout_hackathons
  - scout_research
  - perplexity_search
  - parallel_search
forbidden_cards: []
expected_service: stellar_light
should_fire: true
must_have:
  - claim: "Separates the user's multiple intents: ecosystem-directory listing, partnership/service-provider inquiry, hackathon sponsorship, jobs, and Matching Fund are distinct paths."
    weight: 5
  - claim: Defines the Matching Fund as an SDF funding/investment program distinct from SCF awards, with current eligibility/details verified from source.
    weight: 5
  - claim: Points to official or source-backed channels for listings, partnerships, sponsorships, and jobs rather than inventing a personal SDF contact.
    weight: 5
should_have:
  - claim: Uses the ecosystem directory/project surface when discussing project listing or current listed projects.
    weight: 3
  - claim: Flags that jobs, sponsorships, and partner intake routes are freshness-sensitive and should be checked live.
    weight: 3
nice_to_have:
  - claim: Suggests narrowing the request because it combines several separate operational workflows.
    weight: 1
must_avoid:
  - claim: Do NOT fabricate SDF employee names, emails, intros, or guaranteed partner status.
    weight: 5
  - claim: Do NOT conflate the Matching Fund with SCF Build awards, Marketing Grants, or ordinary hackathon prizes.
    weight: 4
  - claim: Do NOT imply a project can pay to be listed or sponsored unless the cited source says so.
    weight: 4
must_cite:
  - Official Stellar/SDF pages or sourced ecosystem directory/job/hackathon pages for each concrete path named.
must_not_use_tier: []
pass_threshold: 0.75
weight_profile: standard
sources:
  - https://stellar.org/ecosystem
  - https://stellar.org/ecosystem/service-providers
  - https://stellar.org/foundation/careers
  - https://stellar.org/grants-and-funding/matching-fund
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: medium
notes: Snapshot 2026-06-29. Listing/partner/sponsor/jobs paths are operational and may move; do not invent contacts. Matching Fund details verified from SDF grants/funding search result and page HTML.
---

## Reference answer (gospel)

This question combines several distinct workflows. For ecosystem/project visibility, start with official ecosystem surfaces such as Stellar's ecosystem projects and service-provider pages; if there is no public intake form on the page, do not invent a listing email or promise placement. For partner/service-provider or hackathon sponsorship, use official Stellar connect/community/event pages or the relevant program page and ask the user to narrow the request. For jobs, use SDF careers for foundation roles and project/company career pages for ecosystem roles.

The Matching Fund is not an SCF Build Award or hackathon prize. SDF describes it as an investment track within the Stellar Enterprise Fund for pre-seed to Series B companies building on Stellar, matching lead-investor funding up to $500,000 USD. That should be kept separate from SCF awards, Marketing Grants, and ordinary sponsorship.

## Why these cards (routing rationale)

`scout_projects` should fire for ecosystem-directory/project discovery. `scout_rfps` and `scout_hackathons` are acceptable for funding opportunities and hackathons; general search is acceptable for current jobs or operational pages.

## Edge / traps

The model must not fabricate SDF employee names, emails, intros, guaranteed listing, paid placement, or partner status. It should ask the user to split the workflows if they need action steps for each.
