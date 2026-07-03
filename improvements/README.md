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
  ranking, tokenization, vocabulary coverage.
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

## When findings get filed

After **every eval round**. See `eval/EVALS.md` for the eval workflow; filing the
round's findings into this directory is part of closing the round.
