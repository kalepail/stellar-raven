---
id: q-soroban-sdk-cve
q: "Are there known security advisories in the soroban-sdk I should make sure I've patched?"
category: soroban
subcategory: security
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: weekly

expected_cards: [scout_research]
acceptable_cards: [scout_repos, stellar_docs_mcp, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_light
should_fire: true

must_have:
  - { claim: "There have been soroban-sdk security advisories (e.g., a GHSA overflow advisory in `Bytes::slice`/`Vec::slice`/`gen_range`, a `#[contractimpl]` macro inherent-vs-trait method-resolution bug, and an `Fr` scalar equality / modular-reduction bypass) fixed in specific patch releases.", weight: 4 }
  - { claim: "Mitigation is to pin and upgrade to a patched SDK version and stay on a currently-supported major.", weight: 4 }
should_have:
  - { claim: "Answer should flag that the exact CVE ids / fixed versions are time-sensitive and should be checked against the current advisory database / GitHub releases.", weight: 3 }
nice_to_have:
  - { claim: "Mentions checking the rs-soroban-sdk releases/advisories or NVD directly for the latest.", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert there are no security advisories for soroban-sdk.", weight: 4 }
  - { claim: "Do NOT state a fixed-version mapping as permanently authoritative without flagging it may be stale.", weight: 3 }
must_cite:
  - "The rs-soroban-sdk releases/advisories or an NVD/CVE entry."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/rs-soroban-sdk/security/advisories
  - https://github.com/stellar/rs-soroban-sdk/releases
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "2026-06-29: removed duplicated Why-these-cards/Edge sections (verified 2026-06-29). Freshness: advisory list grows — reward flagging that the mapping is time-sensitive. VERIFIED against rs-soroban-sdk GitHub Security Advisories (2026-06): GHSA-96xm-fv9w-pf3f (overflow in Bytes::slice/Vec::slice/gen_range, Jan 2026), GHSA-4chv-4c6w-w254 (#[contractimpl] calls inherent fn instead of trait fn on name collision, High, Feb 2026), GHSA-x2hw-px52-wp4m (Fr equality bypasses modular reduction, Mar 2026). Exact patched-version mapping is time-sensitive — do not pin it as permanently authoritative; check the advisories/releases live."
---

## Reference answer (gospel)

**Yes — `soroban-sdk` has published GitHub Security Advisories (GHSA), so pin to a patched, currently
supported version.** Known advisories include:

- **GHSA-96xm-fv9w-pf3f** — arithmetic **overflow** in `Bytes::slice` / `Vec::slice` / `gen_range`.
- **GHSA-4chv-4c6w-w254** (High) — **`#[contractimpl]`** calls the **inherent** function instead of the
  **trait** function when names collide (incorrect method dispatch).
- **GHSA-x2hw-px52-wp4m** — **`Fr`** scalar-field **equality bypasses modular reduction** (crypto
  arithmetic).

Mitigation: **upgrade to a patched release** and stay on one of the **currently supported SDK majors**
(SDF supports the two most recent majors with critical fixes).

**Freshness caveat:** the exact advisory list and patched-version mapping is **time-sensitive** — verify
against the **rs-soroban-sdk Security Advisories** page / releases (or NVD) rather than treating any
fixed-version table as permanently current. Do **not** claim there are *no* advisories.

## Why these cards (routing rationale)

Advisory lookup over the security/repos corpus → `scout_research`/`scout_repos`. Docs plus live web/advisory
discovery (`perplexity_search`/`parallel_search`) acceptable for NVD/GitHub advisory freshness. Deep-research
tier stays banned.

## Edge / traps

Claiming no advisories; presenting a fixed-version table as permanently current.
