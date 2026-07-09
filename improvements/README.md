# improvements/ — upstream findings from eval runs

## Principle

This MCP server's own tuning ceiling is limited. But running evals against it gives
outsized leverage for **discovering gaps and errors in the four upstream surfaces it
fronts**. From now on, a primary artifact of every eval run is a recorded,
evidence-backed improvement recommendation set for those services. This directory is
that collection.

## Collections

- `lumenloop/` — findings about the Lumenloop API and its content corpus (slugs,
  extraction quality, vocabularies, endpoint completeness).
- `stellar-light-scout/` — findings about the Stellar Light/Scout API (response
  semantics, missing fields, content-type consistency; positive trust anchors too).
- `stellar-docs/` — findings about the Stellar Docs search surface (Algolia index):
  ranking, tokenization, vocabulary coverage. Docs-content findings also belong
  here when the indexed source content is stale, ambiguous, or missing a current
  explanation needed by grounded agents (for example `sd-007`). As of 2026-07-09 we
  hold operator Algolia credentials (write / crawler / analytics — see
  `research/services/stellar-docs-algolia.md`), so some `stellar-docs` findings now have
  a **direct-remediation** path in addition to filing upstream; see "Resolution paths"
  below for which findings that applies to and the bar it must clear.
- `skills/` — findings about the **upstream skill sources** mirrored here as
  ecosystem-skills. Recommendations target the source repos; never edit the mirror
  in this repo to "fix" a finding.

## Record format

One file per finding. YAML-ish frontmatter, then three short sections.

```
---
id: <collection>-NNN
service: lumenloop | stellar-light-scout | stellar-docs | skills
status: proposed | verified | reported-upstream | fixed-upstream
discovered: YYYY-MM-DD
evidence:
  - eval/qa/results/<results-file stamp>
  - live verification note
  - Solo todo/comment ref
---

## Finding        (what's wrong, factually)
## Evidence       (how we know — stamps, paths, re-execution notes)
## Recommendation (the concrete upstream change)
```

## Lifecycle

- A finding enters as `proposed`. It graduates to `verified` **only with live
  re-execution evidence** — an eval judge's opinion alone is not verification.
- `reported-upstream` when it has been filed with the service owner;
  `fixed-upstream` when a live re-check confirms the fix. Refresh status whenever
  upstream changes (drift refresh is a natural checkpoint).
- Findings here are for the **services**. Fixes to this repo (adapters,
  normalizers, catalog, eval golden) go to Solo todos instead (the Solo project binding
  lives in CLAUDE.md) — a finding file may note that a fix landed here, but the repo work
  is tracked there.

## Upstream filing channels

`reported-upstream` means a GitHub issue (or equivalent) exists with the service owner.
Known channels (issue access confirmed 2026-07-09):

- `stellar-light-scout/` and `skills/` (Scout-sourced) findings → the Stellar-Light org:
  - <https://github.com/Stellar-Light/stellarlight> — the discovery-layer service behind
    the Stellar Light API (data/content/API-semantics findings).
  - <https://github.com/Stellar-Light/stellar-scout> — the Scout skill (skill-content and
    research-corpus findings).
  - <https://github.com/Stellar-Light/scout-mcp> — their MCP server surface.
  File on the repo that owns the failing surface; when unsure, file on `stellarlight`
  and cross-link. Record the issue URL in the finding's `evidence` list.
- `stellar-docs/` content/content-structure findings →
  <https://github.com/stellar/stellar-docs>; pure Algolia ranking/tokenization findings may still
  need search-owner triage when that repository cannot plausibly own the behavior.
- `lumenloop/` API/content findings — no confirmed public issue channel is wired yet; record the
  report route in the finding file when one is used.

## Resolution paths (stellar-docs: upstream vs. direct Algolia)

Filing upstream is still the default. But `stellar-docs` findings split by root cause, and one class
is now directly remediable with the operator Algolia credentials in `.env`
(`research/services/stellar-docs-algolia.md`):

- **Content gaps** — a page is stale, wrong, ambiguous, or missing (e.g. `sd-007`, `sd-008`). These
  stay **upstream** on `stellar/stellar-docs`. Do not "fix" them by rewriting index records; the
  crawler would overwrite it and we would be diverging a shared corpus from its source.
- **Search-mechanism gaps** — ranking, tokenization, synonym/vocabulary, or crawler-config issues
  (`sd-001`, `sd-003`, `sd-006`). These we *can* now remediate directly (a general rule/synonym, an
  index-settings change, a crawler-config fix + reindex), subject to a hard bar:
  - a **general mechanism only** — no per-page/per-query rules or synonyms (same anti-overfitting
    rule the eval loop enforces);
  - a **measured win on the read-only A/B harness** (`scripts/eval-algolia-raven.mjs`,
    `npm run eval:algolia-raven`) before it lands — the load-bearing `raven-promote-stellar-cli-install`
    rule is the ceiling of an acceptable single-target mechanism, not a template;
  - **shared-corpus caution** — it also serves the real DocSearch frontend, so prefer the lowest-risk
    rung (analytics read < rule/settings < crawler/index write) that closes the gap.

  Record a direct Algolia remediation in the finding's `evidence` (what changed, the A/B before/after,
  the live re-check) exactly like an upstream fix; keep the GitHub ref too when the underlying cause is
  also a content/crawler issue the docs owner should know about (as `sd-006` does with its monitor-only
  rule residual).

**Analytics as evidence.** The Search Analytics / usage keys give us real user query streams and
no-result queries — a new, low-risk evidence source. Use them to quantify a finding's prevalence
(stronger than the eval corpus's approximation) and to surface content/vocabulary gaps we would
otherwise never see. Cite the analytics query and window in `evidence`.

## When findings get filed

After **every eval round**. See `eval/EVALS.md` for the eval workflow; filing the
round's findings into this directory is part of closing the round.
