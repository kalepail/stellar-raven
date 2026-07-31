# Live ecosystem-partner documentation as a Raven source

Status: held product idea. Re-evaluate on or after **2026-10-31**, or earlier only if one of the
triggers below fires. Raised as [issue #18](https://github.com/kalepail/stellar-raven/issues/18);
the dated evidence and the full admission contract live in
[`research/partner-doc-source-onboarding.md`](../research/partner-doc-source-onboarding.md).

## Current decision

The issue asks one question and it resolves into two answers that point in opposite directions.

**1. Do not federate partner MCP servers.** Not as an integration rule, and not for the two
partners named. This is a measured finding about what those servers actually are, not a position
on MCP:

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

- **The retrieval signal is real, reproducible, and not sufficient.** The candidate arm scores
  95/96 (99.0%) across 12 cases against 7/64 (10.9%) for the current-Raven arm on the original
  eight. On 2026-07-31 the original cohort reproduced its 2026-07-10 score *exactly*, 21 days
  later, with zero fetch errors. Retrieval admission is phase 1 of four; it shows the bytes are
  reachable, not that an answering agent gets better.
- **Phases 2–4 have not run.** Reliability (≥100 probes over 24h, verified 304 / stale-if-error),
  paired headline QA (≥16 cases, same answering and judge models, zero new wrong answers), and the
  security/non-regression pass are all unstarted. Phase 3 is the one that matters most and the one
  no retrieval harness can substitute for.
- **Phase 1 itself is still unmet.** The four independent paraphrase/negative/conflict cases the
  gate asked for now exist and the floor is code-enforced, but the 2026-07-31 run measured the
  candidate arm only. Without a paired baseline over all 12 cases the gate is `inconclusive` by
  construction — a missing baseline never shrinks the denominator quietly.
- **The issue's concrete example healed upstream, which changes the urgency but not the argument.**
  Alchemy's Stellar Data API was missing from the official docs when the issue was filed; the same
  gap was tracked as `sd-010`, and `stellar/stellar-docs#2573` merged and was live-verified on
  2026-07-15. The acute instance is closed. The systemic point survives it: that fix took a human
  noticing, filing, and shipping a PR, which is exactly the cadence problem the issue names.
- **A cheaper mechanism may already cover part of it.** Partner-side movement that reaches official
  docs is already caught by the improvements pipeline, and `check-skills-drift` already detects
  upstream skill drift. What neither covers is a partner shipping a product that never reaches
  either surface. Sizing *that* residue is the honest first question at re-evaluation, and it is
  smaller than the issue's framing implies.

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
2. Size the residue first: how many live failures are partner-only facts that never reached
   official docs or a pinned skill? If that set is empty, close the idea again without an
   implementation round.
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
- Precedent for a held source lane with the same shape:
  [`ideas/stellar-org-source-lane.md`](./stellar-org-source-lane.md)
