# P2 outcome addendum — card-mediated capture is empirically unviable (2026-07-09)

Status: coordinator-authored round record. Parent: `research/p2-lanes-spec.md`,
`research/discovery-redesign.md`. Evidence trail: Solo ledger scratchpad 562; local result
files under `eval/agentic/results/` and `eval/discovery/results/` (gitignored evidence).

## What was built and verified (banked on the branch)

Commits 10a26f8 / 741962c / 0ff25c1: `kind:"service"` (4) + `kind:"workflow"` (10) cards
emitted from the shared archetypes data file, kind weight 0.75, describe(workflow/service)
wired, op-routing grading card-proof, fail-loud guards (bogus/excluded/card-to-card refs and
callable-tokens-in-titles all break the build, test-proven). Routing stayed byte-identical
(legacy 213/267/305, skills 18/23) — the cards perturb nothing.

Known small defect (pending fix): `describe("service:skills")` returns an empty operations
list plus a usage line that can't be followed; either list skill ids or special-case the
prose (`src/executor/providers.ts`).

## Why the three-arm A/B was NOT run

The adversarial review probed every workflow card against the live P2 build with phrasings
matching its own questionShape: on all 8 lumenloop capture cases, no card reached top-8.
A follow-up mined ALL queries real agents issued on those cases across the six
query-recording live runs (160 occurrences; the 2026-07-04 baseline file is compacted and
carries no query strings):

| register | share |
|---|---|
| MIXED (entity + capability words) | 106/160 (66.3%) |
| entity-only | 46/160 (28.8%) |
| pure capability-register | 8/160 (5.0%) |

Card interception of that real traffic: top-8 **4.4% as-is**, **6.9% upper bound** with
entities stripped (the best keyword enrichment could approach, not reach — mixed queries
keep their entity tokens, which dominate lexical scoring). Measured run-to-run family-rate
noise is ±1–2 cases per 8-case family (see the P1 variance protocol). A mechanism that can
touch ≤7% of traffic cannot move a metric with that noise floor: the A/B outcome was
predetermined, so it was skipped rather than run as theater.

## The structural finding (three independent instruments agree)

The lumenloop capture problem is an **entity→family mapping problem in a mixed-register
query stream**, and it is beyond lexical reach:

1. **Prose ceiling** (7 live agentic runs, P1): guidance wording only toggles the same
   borderline cases between scout↔lumenloop, zero-sum; the stuck cases never move.
2. **Card ceiling** (live probes + traffic mining, P2): generic cards share no lexical
   surface with entity-named queries; the mixed register keeps entity dominance.
3. **The op layer already does the reachable work**: lumenloop *operations* reached top-5
   for 42/160 (26%) of real query occurrences — when capture fails, it is usually the agent
   *choosing* the scout op over the visible lumenloop op, not pure retrieval failure.

Implication for `research/discovery-redesign.md` §3 (#11, Vectorize trigger): the
"lexical levers exhausted" component of the trigger is now demonstrated for this class.
Round 5f's bge-base failure still stands on the embedding side — any semantic spike must
use a stronger embedding model and a determinism-preserving design, and must target
exactly this measured class (mixed-register entity→family capture), with the P1-era
per-case matrices as its baseline.

Also recorded: the discovery instrument's naive-verbatim queries under-represent the mixed
register agents actually use — a future instrument lane should replay mined real queries
(cheap: the extraction script pattern lives in the ledger/agent transcripts).

## Open decision (Tyler)

The cards are harmless but unproven: ship them anyway (orientation value via deliberate
`kind:"workflow"` searches + describe), or revert the card emission and keep only the
grading/guard/test improvements? The plan's gate said the A/B decides ship-or-revert; with
the A/B provably null, this is a judgment call, not a measurement.
