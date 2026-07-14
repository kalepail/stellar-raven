---
id: sls-008
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-03
evidence:
  - live re-check 2026-07-14: Orbit search returns one canonical inactive OrbitCDP record and no duplicate orbit-finance row; resolving PR https://github.com/Stellar-Light/stellarlight/pull/289
  - live production execute 2026-07-03 (scout.searchProjects name probes; Solo scratchpad 521 follow-up, todo 826 comment 2224)
  - deep verification 2026-07-03 (todo 828): official SCF award pages confirm OrbitCDP awards (SCF #21 incl. 'Part 2 of budget', spring-2024 round, SCF #29; team Zenith Protocols), while a web sweep found NO primary or project-side evidence of a distinct 'Orbit Finance' project — the lineage's own branding oscillates between Orbit / Orbit Protocol / OrbitCDP, so the unfunded row is most plausibly a naming artifact of the same lineage
  - consumer-side workaround shipped in the golden for q-defi-lending-scf-flagships: grader instructed not to penalize treating the two rows as one lineage (owned case eval/qa/corpus/battery/defi-ecosystem/q-defi-lending-scf-flagships.json)
  - live re-check 2026-07-06 (eval round todo 846): FIXED — orbit-finance now carries canonicalSlug:"orbitcdp" and both records are status Inactive; orbitcdp gained lifecycle {wasLive:true, note: SCF-funded $280k rounds 21/25/29, shut down 2026, team pivoted to Zenex} plus scfAwardedRounds:[21,25,29]; the secondary types-field-per-query inconsistency was not separately re-verified
---

## Finding

The project directory carries two live, Lending-typed records that appear to be
the same lineage with no cross-link or dedupe signal: `orbit-finance` (status
Live, scfAwarded false, scfTotalAwardedUSD null, no lastActivityAt) and
`orbitcdp` (status Live, scfAwarded true, scfTotalAwardedUSD 280000). Consumers
asking "is Orbit SCF-funded?" get opposite answers depending on which record a
name query surfaces. Related inconsistency: the same `orbit-finance` record
returned `types: ["Lending"]` under `q="Orbit Finance"` but `types: []` under
`q="OrbitCDP"` in the same instant — per-query field surfacing or data
inconsistency.

## Evidence

Live 2026-07-03, production `execute` with six parallel
`scout.searchProjects` calls: `q="Orbit Finance"` → orbit-finance
(scfAwarded:false, amount null); `q="OrbitCDP"` → orbitcdp (scfAwarded:true,
$280,000, types [Lending]). Both records status Live, both surfaced in the
SCF-funded lending landscape query. The eval golden for
`q-defi-lending-scf-flagships` had already noted the naming fuzziness on its
2026-06-29 review; the live probe confirms both records still coexist and
diverge on funding.

Fixed upstream: the 2026-07-06 live re-check found the recommended
cross-reference shipped (`canonicalSlug: "orbitcdp"` on orbit-finance, both records
marked Inactive, lifecycle note on orbitcdp), resolving the opposite-answer
failure mode.

## Recommendation

Either merge the records, mark the stale one Inactive, or add an explicit
cross-reference field (e.g. `relatedSlugs` / `renamedTo`) so consumers can
detect the lineage. Failing that, a dedupe hint in search results (same-team
records grouped) would prevent the opposite-answer failure mode. Consumer-side,
this gateway can only hardcode the pair in eval goldens (done — override entry
above), which rots the moment either record changes.
