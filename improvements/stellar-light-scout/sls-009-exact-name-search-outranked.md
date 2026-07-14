---
id: sls-009
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live re-check 2026-07-14: exact Slender and Blend records rank before adjacent Reflector matches; resolving PR https://github.com/Stellar-Light/stellarlight/pull/285
  - live production execute 2026-07-03 (scout.searchProjects name probes; Solo scratchpad 521 follow-up, todo 826 comment 2224)
  - live re-check 2026-07-06 (eval round todo 846): FIXED — q:"Slender" and q:"Blend" now rank the exact-name match #1 in both queries, with Reflector demoted to rank 2
---

## Finding

`searchProjects` ranks authority/prominence above exact name match: the queries
`q="Slender"` and `q="Blend"` both ranked Reflector (an authority-heavy record,
$444,840 SCF) ABOVE the exact-name match for the queried project. A consumer
looking up a specific project by its name — the most common directory query
shape — gets a different project first.

## Evidence

Live 2026-07-03, production `execute`: `scout.searchProjects({q:"Slender"})`
and `scout.searchProjects({q:"Blend"})` each returned Reflector at rank 1 with
the exact-name record below it. Both target records exist and are Live (Blend
by Script3, Slender by EQ Lab), so this is pure ranking, not coverage.

Fixed upstream: the 2026-07-06 live re-check found exact-name matches boosted
to rank 1 for both probe queries, with the authority-heavy Reflector record
demoted below them.

## Recommendation

Add an exact-name (or prefix/slug) match boost that dominates
authority/prominence signals when the query string equals a project name or
slug. This is the standard directory-search contract; without it every
name-lookup consumer must over-fetch and re-filter client-side (which is what
this gateway's eval probes had to do).
