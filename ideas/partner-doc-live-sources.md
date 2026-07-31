# Live ecosystem-partner documentation as a Raven source

Status: held product idea. Re-evaluate on or after **2026-10-31**, or earlier only if one of the
triggers below fires. Raised as [issue #18](https://github.com/kalepail/stellar-raven/issues/18);
the dated evidence and the full admission contract live in
[`research/partner-doc-source-onboarding.md`](../research/partner-doc-source-onboarding.md).

## Current decision

The issue asks one question and it resolves into two answers that point in opposite directions.

**1. Do not federate partner MCP servers.** Not as an integration rule, and not for the two
partners named. This declines the mechanism asked for in the issue thread itself — "ideally we'd
tap into their docs mcps if they have them" and "most should have by now" (2026-07-09) — so it owes
those commenters a reason. The reason is a measured finding about what those servers actually are,
not a position on MCP:

- Alchemy's hosted MCP documents 168 tools behind OAuth 2.1, including account/app mutations such
  as `create_app`, `update_app`, `select_app`, and `update_allowlist`. Mounting it to read
  documentation would import an authenticated operational surface Raven did not ask for.
- OpenZeppelin's hosted MCP advertises contract *generation*, not documentation retrieval. It
  answers a different question than the one this issue is about.

Raven's whole boundary is that model code never owns endpoints, arguments, auth, or exposure
(ADR-0003). A federated partner MCP inverts that: the partner decides what is callable, and the
tool surface changes underneath us without a repo change.

**2. Allowlisted first-party partner Markdown is a credible fourth authority class** — and it is
the mechanism that actually delivers what the issue wants. Partner docs are authoritative for that
partner's own products, and their public Markdown is a bounded, reviewable, commit-pinnable source.
The design is written and the retrieval evidence is strong. It is **held behind a four-phase ship
gate**, and no runtime adapter ships until that gate passes.

Authority stays claim-scoped, never a global ranking: Stellar Docs, SEPs, and CAPs remain
authoritative for protocol behavior; a partner is authoritative for its own products; mirrored
skills are procedural interpretation pinned to a commit and never override newer first-party
reference docs. Conflicts are returned as conflicts, with dates and provenance — never merged into
a synthetic fact, and never resolved by letting the newer timestamp silently win.

## Why the HOLD currently stands

- **The retrieval signal is real, reproducible, and weaker than its headline number.** The
  candidate arm scores 95/96 (99.0%) across 12 cases; the current-Raven arm scored 7/64 (10.9%) on
  the original eight. On 2026-07-31 the original cohort reproduced its 2026-07-10 score *exactly*,
  21 days later, with zero fetch errors — a stability observation about the sources.

  **Read the 10.9% with its scope and its date attached.** That arm calls one operation per case
  from a restricted set — three `stellarDocs.search_*` operations plus two mirrored OpenZeppelin
  skill reads — and the whole Scout family, including the research and partner-directory lanes, is
  outside it. So the figure measures *Raven minus its research lane*, not Raven. It also predates
  [stellarlight#657](https://github.com/Stellar-Light/stellarlight/pull/657) by eleven days, which
  anchored the provider-roster docs for this exact query.

  It is stale in time as well as narrow in scope: both baseline corpora were replaced after it was
  measured. `stellar-docs#2573` went live 2026-07-15 into the very `/docs/data` prefix one of those
  operations searches, and the mirrored skill pin advanced from a 2026-04-14 to a 2026-07-15
  snapshot. The true delta is smaller than 87.5 points by an amount nobody has measured. Phase 1
  cannot be called passed until a paired run re-measures the current-Raven arm **live**, against a
  baseline wide enough to reach the research lane — reusing the recorded per-case numbers would not
  be a measurement.

  The 2026-07-31 re-run reproduced the candidate side exactly, which is a statement about source
  stability on that side only. The baseline arm has not been re-run since 2026-07-10.
- **Phases 2–4 have not run.** Reliability (≥100 probes over 24h, verified 304 / stale-if-error),
  paired headline QA (≥16 cases, same answering and judge models, zero new wrong answers), and the
  security/non-regression pass are all unstarted. Phase 3 is the one that matters most and the one
  no retrieval harness can substitute for.
- **Phase 1 itself is still unmet.** The four independent paraphrase/negative/conflict cases the
  gate asked for now exist and the floor is code-enforced, but the 2026-07-31 run measured the
  candidate arm only. Without a paired baseline over all 12 cases the gate is `inconclusive` by
  construction — a missing baseline never shrinks the denominator quietly.
- **The issue's concrete example healed from two directions at once.** Alchemy's Stellar Data API
  was missing from the official docs when the issue was filed; the same gap was tracked as
  `sd-010`, and `stellar/stellar-docs#2573` merged and was live-verified on 2026-07-15. In
  parallel, [stellarlight#446](https://github.com/Stellar-Light/stellarlight/pull/446) (merged
  2026-07-10) corrected the ecosystem `alchemy` record to name both products and add the `Indexer`
  type — four days *before* `#2573` merged, grounded in the language SDF was then merging. The
  acute instance was closed by coordinated upstream and downstream fixes, not by one PR.

  The systemic point survives it: both fixes took humans noticing, filing, and shipping, which is
  exactly the cadence problem the issue names.
- **This hold is corroborated, not novel.**
  [stellarlight#448](https://github.com/Stellar-Light/stellarlight/pull/448) (merged 2026-07-10)
  reached the same "no" on the same grounds three weeks earlier — provider reference docs are
  already agent-readable at source, a corpus copy goes stale and duplicates what the provider
  serves — and chose "the structured record plus a first-class pointer to the living source" over
  ingestion. Two independent analyses converging is the strongest evidence here; it also means
  this record should not be read as a new finding.
- **The residue is already being measured upstream — but ingestion is not retrieval.** Partner-side
  movement that reaches official docs is caught by the improvements pipeline, and
  `check-skills-drift` detects upstream skill drift. More directly, the Stellar Light upstream
  shipped a coverage-and-freshness detector explicitly motivated by this issue
  ([stellarlight#561](https://github.com/Stellar-Light/stellarlight/pull/561), merged 2026-07-16),
  whose `coverage-watch.yml` runs monthly and tiers partner coverage `own` / `mention` / `none`.
  Its first run reported **0 of 4 partners with their own content indexed**.

  Two corrections travel with that number, and both matter more than the number does. First, the
  lane was judging "served" by result URL alone and
  [stellarlight#564](https://github.com/Stellar-Light/stellarlight/pull/564) (2026-07-16) fixed it
  to scan served text at probe depth 15 — so the first run's verdict semantics are not the current
  ones, and the 0/4 should not be quoted as standing fact. Second, and more damaging to the easy
  version of this argument:
  [stellarlight#565](https://github.com/Stellar-Light/stellarlight/pull/565) (2026-07-16) found
  that *after* `stellar-docs#2573` was ingested, a bare `q=Alchemy` still returned **zero
  results**, and the Indexers chunk that documents the Data API ranked below top-15 for its own
  brand query. It needed a lexical-pool supplement and a 0.8 `fullLexicalMatch` floor to fix.

  So "the improvements pipeline already catches it" is too glib: content reaching official docs is
  necessary and not sufficient — it must also be *retrievable*. That is a real, dated live failure
  of exactly the kind this lane's reopen trigger asks for, and it argues for fixing retrieval
  upstream before adding a source here, not for adding one.
- **The same upstream is closing the gap from the supply side.**
  [stellarlight#657](https://github.com/Stellar-Light/stellarlight/pull/657) (merged 2026-07-21)
  added a `data-providers` research anchor targeting, in its own words, "stellar-raven#18's exact
  case" — the `alchemy` query that surfaced event-ingest guides instead of the Providers and
  Indexers roster docs that name Alchemy's Stellar Data API. Every point of upstream coverage is a
  point of justification this lane loses: the better Stellar Light indexes partner content, the
  weaker the case for Raven fetching it directly. Re-evaluation must measure against that improved
  upstream, not against the 2026-07-10 picture.

## Triggers to revisit

Reopen the **Markdown source lane** before the dated review only after **two unrelated,
live-reproduced production or owned-QA failures** where all of the following hold:

1. The missing or incorrect fact is present on a current first-party partner page.
2. No currently exposed source — including official Docs after the improvements pipeline has had a
   chance to correct them — returns quotable support for it.
3. The failure is a source-coverage problem, not answer craft, stale truth metadata, or routing.

Reopen the **MCP federation question** only on a narrower, different fact: a partner shipping a
read-only, unauthenticated, documentation-scoped MCP surface with a stable tool contract. That is
not what either partner ships today, and it is the only shape that would not import an operational
surface. A partner adding *more* tools is evidence against, not for.

## Re-evaluation requirements

If a trigger fires, or at the dated review:

1. Re-run `npm run eval:partner-docs -- --raven-url …` over all 12 cases so both arms are measured.
   An unpaired run is not a phase-1 result.
2. Read the residue before sizing it yourself: the newest `coverage-watch` run in
   [Stellar-Light/stellarlight](https://github.com/Stellar-Light/stellarlight/pull/561) already
   reports partner coverage monthly as `own` / `mention` / `none`. Start from its current numbers,
   not from the 2026-07-16 first run quoted above, and ask how many live failures are partner-only
   facts that reached neither official docs, a pinned skill, nor the upstream index. If that set is
   empty, close the idea again without an implementation round.
3. Do not build a generic `fetch_url`, a caller-selected endpoint, or an MCP proxy. The smallest
   useful surface is one host adapter with manifest-authored, closure-captured source identities.
4. Treat fetched prose as untrusted data even from a first-party domain: never into catalog
   descriptions, server instructions, or tool error hints.
5. Honour serve-do-not-store. This lane must not become the reason Raven starts owning a mirror of
   someone else's content (ARCHITECTURE §6).
6. Phase 3 is the decision, not phase 1. Ship only on a measured answer-quality win with correct
   provenance on every partner-specific claim, and OpenZeppelin cases must show value beyond the
   existing skill and docs paths.

## Durable references

- Design, admission contract, and ship gate:
  [`research/partner-doc-source-onboarding.md`](../research/partner-doc-source-onboarding.md)
- Harness and case corpus: [`scripts/eval-partner-docs.mjs`](../scripts/eval-partner-docs.mjs),
  [`eval/partner-docs/`](../eval/partner-docs/README.md)
- The upstream correction that closed the issue's concrete example:
  [`stellar/stellar-docs#2573`](https://github.com/stellar/stellar-docs/pull/2573), tracked as
  `sd-010` and resolved 2026-07-15 in [`improvements/resolved.json`](../improvements/resolved.json)
- Work on this issue in the Stellar Light upstream, which this lane must be measured against:
  [`#446`](https://github.com/Stellar-Light/stellarlight/pull/446) (corrected the `alchemy` record,
  2026-07-10), [`#448`](https://github.com/Stellar-Light/stellarlight/pull/448) (the converging
  earlier "no", plus the `#447` retraction and its negative-grep lesson),
  [`#561`](https://github.com/Stellar-Light/stellarlight/pull/561) (monthly coverage-and-freshness
  detector), [`#564`](https://github.com/Stellar-Light/stellarlight/pull/564) (fixed that
  detector's URL-only "served" verdict), [`#565`](https://github.com/Stellar-Light/stellarlight/pull/565)
  (ingested ≠ retrievable; `q=Alchemy` returned zero results), and
  [`#657`](https://github.com/Stellar-Light/stellarlight/pull/657) (`data-providers` research
  anchor for the Alchemy roster case)
- Precedent for a held source lane with the same shape:
  [`ideas/stellar-org-source-lane.md`](./stellar-org-source-lane.md)
