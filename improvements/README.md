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
  explanation needed by grounded agents (for example `sd-007`).
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
- `lumenloop/` and `stellar-docs/` findings — no public issue channel wired yet; record
  the report route in the finding file when one is used.

## When findings get filed

After **every eval round**. See `eval/EVALS.md` for the eval workflow; filing the
round's findings into this directory is part of closing the round.
