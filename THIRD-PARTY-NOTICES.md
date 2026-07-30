# Third-party notices

This repository is licensed under [Apache-2.0](./LICENSE) (see `LICENSE`), **except** the
third-party content noted below.

## Ecosystem skills — referenced, not vendored

**This section describes mechanism. It does not state a licensing conclusion; that is for
counsel.** Two facts matter and both are verifiable from this repository:

**1. No copy is stored here.** Ecosystem skill bodies (`SKILL.md` playbooks and their companion
files) are not committed to this repository and are not shipped inside the Worker bundle. What is
committed is an address: `ecosystem-skills/MANIFEST.json` records, per source, the upstream
repository and a full commit SHA, and per file a path and git blob hash;
`catalog/manifest.json` additionally records a SHA-256 per file. Copies do exist transiently
while serving: a gitignored build cache (`ecosystem-skills/.cache/`), the Cloudflare colo Cache
API, and an in-isolate memo. None is committed or published.

**2. This service fetches and serves the bytes, and modifies them on the way.** A request to
`codemode.skill.read` causes this Worker to fetch the file from `raw.githubusercontent.com` at
the pinned commit, verify it against both recorded digests, and return it to the caller. Before
returning it the Worker **modifies** the content:

- `scrubRetiredSkillRefs` (`src/skills/scrub.ts`) removes markdown list items that reference
  non-exposed skills. As of the current pins this alters **8 of the 30 served files** (the seven
  `lumenloop` skills and `stellar-light/stellar-scout`).
- YAML frontmatter is stripped from whole reads.
- Section reads return an excerpt of a file, not the file.

So the served bytes are **not** always identical to upstream's, and this service — not the
upstream host — is what delivers them to the user. Any analysis of redistribution, conveyance, or
AGPL-3.0 obligations must start from those facts rather than from the absence of a checked-in
copy.

| Source | Upstream | License |
| --- | --- | --- |
| `lumenloop` | [lumenloop/lumenloop-skills](https://github.com/lumenloop/lumenloop-skills) | MIT (© 2026 LumenLoop) |
| `openzeppelin-stellar` | [OpenZeppelin/openzeppelin-skills](https://github.com/OpenZeppelin/openzeppelin-skills) | **AGPL-3.0** (© 2026 Zeppelin Group Ltd) |
| `stellar-dev` | [stellar/stellar-dev-skill](https://github.com/stellar/stellar-dev-skill) | Apache-2.0 (SDF) |
| `stellar-light` | [Stellar-Light/stellar-scout](https://github.com/Stellar-Light/stellar-scout) | MIT |

Each source's own `LICENSE`/`NOTICE` file names are recorded in `MANIFEST.json`
(`license_files`) at the same pinned commit. **They are not currently attached to API responses**
— `skill.read` returns markdown with no license text, which was equally true when the bodies were
vendored. The `openzeppelin-stellar` skills are AGPL-3.0; if AGPL obligations attach to serving
them through this gateway, the scrub above is a modification and the modified versions remain
AGPL-3.0. **Open question for counsel — see `ideas/skill-serving-legal-questions.md`.**

Two derived facts about a skill ARE committed, because routing needs them: the one-line
`description` from a skill's YAML frontmatter (what `search` scores) and its `##` section
headings (how `skill.read` addresses parts of a body). Section prose, body excerpts, and
body-derived keyword bags are not committed —
`test/skill-content-not-vendored.test.ts` is the standing guard on that line.

## Vendored code: `src/catalog/vendor/`

`normalize.ts`, `search-scoring.ts`, and `json-schema-types.ts` are vendored (with documented
adaptations — see each file's header) from
[`@cloudflare/codemode`](https://www.npmjs.com/package/@cloudflare/codemode) v0.4.2, which is
distributed under the MIT license:

> MIT License Copyright (c) 2025 Cloudflare, Inc.
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software
> and associated documentation files (the "Software"), to deal in the Software without
> restriction, including without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
> Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or
> substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
> BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
> DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Other snapshot data

- `ecosystem-skills/catalog.json` — a factual snapshot of the public
  [stellarlight.xyz/api/skills](https://stellarlight.xyz/api/skills) ecosystem directory.
- `inventory/*.json` — interface metadata (operation names, descriptions, schemas) published by
  the upstream services themselves for consumption; regenerated by
  `scripts/refresh-inventory.mjs`. Partner-tier LumenLoop items are persisted as name-only stubs;
  partner-tier detail is never committed to this repository.
- `eval/corpus/` — self-authored corpora vendored from this project's own retired prior-art
  repos; provenance in `eval/corpus/PROVENANCE.md`.
- `public/*.png` — AI-generated images; provenance documented in `public/README.md`.
