# Stellar/Soroban ecosystem skills — mirror

A local, version-pinned mirror of the **Stellar/Soroban agent skills** (Claude-Code-style
`SKILL.md` playbooks) published across the ecosystem — LumenLoop, OpenZeppelin, the Stellar
Development Foundation (SDF), and Stellar Light — plus a snapshot of the broader
[stellarlight.xyz](https://stellarlight.xyz/skills) ecosystem **directory**.

Lifted from `stellar-raven-next/ecosystem-skills/` (pinned commits, a generated index, a refresh
script). In **this** repo it is the skills source the unified catalog builds from: each skill and
each of its `##` sections becomes a searchable catalog entry (see `PLAN.md` §3), subject to the
manifest allowlist. The mirror itself stays a plain, script-synced copy of upstream.

## Layout

```
ecosystem-skills/
├── skills/<source>/<skill>/SKILL.md (+reference/ | references/)   # downloaded skills, grouped by source
├── INDEX.md         # AUTO-GENERATED themed catalog (name + description + source + size) + ecosystem directory
├── MANIFEST.json    # per-source pinned commit/ref + per-file path/size/sha + catalog summary
├── groups.json      # theme → skill-id mapping that drives INDEX.md grouping
├── catalog.json     # full snapshot of the stellarlight.xyz/api/skills directory (~30 entries)
├── build-index.mjs  # regenerates INDEX.md from MANIFEST.json + groups.json
├── update.sh        # syncs every source, pins commits, rebuilds the index
└── README.md
```

**Start at [`INDEX.md`](./INDEX.md)** — it groups every mirrored skill by theme, links straight to
the folder, and ends with the ecosystem directory snapshot (what else exists, including
non-`skill-md` SDKs/MCP servers/CLIs that are *not* mirrored here).

## Sources

| Source id | Origin | What | How |
| --- | --- | --- | --- |
| `lumenloop` | [`lumenloop/lumenloop-skills`](https://github.com/lumenloop/lumenloop-skills) `skills/` | 8 public Stellar-ecosystem analyst skills | `gh` raw download @ pinned commit |
| `lumenloop-api` | `lumenloop/lumenloop-api-skills` (partner) | 6 partner skills for the LumenLoop REST API (not on public GitHub) | `curl` the `/v1/skills/archive/partner` zip @ pinned commit |
| `openzeppelin-stellar` | [`OpenZeppelin/openzeppelin-skills`](https://github.com/OpenZeppelin/openzeppelin-skills) `skills/` | 3 Stellar/Soroban contract skills (cherry-picked from a multi-chain repo) | `gh` raw download @ pinned commit |
| `stellar-dev` | [`stellar/stellar-dev-skill`](https://github.com/stellar/stellar-dev-skill) `skills/` | 7 SDF developer skills (soroban, dapp, data, assets, agentic-payments, standards, zk-proofs) | `gh` raw download @ pinned commit |
| `stellar-light` | [`Stellar-Light/stellar-scout`](https://github.com/Stellar-Light/stellar-scout) (root) | 1 ecosystem-analyst skill | `gh` raw download @ pinned commit |
| _catalog_ | [`stellarlight.xyz/api/skills`](https://stellarlight.xyz/api/skills) | ~30-entry ecosystem directory (sdf / stellarlight / lumenloop / external) | `curl` snapshot → `catalog.json` (NOT downloaded as skills) |

The LumenLoop API exposes 14 skills total (`GET /v1/skills`): the 8 public ones (identical to the
GitHub repo) and 6 partner ones. We mirror the public set from GitHub and fill the partner gap from
the API archive, so all 14 are present and each set is pinned to the commit the API reports.

## Design choices

- **Same shape as `agents-docs/`** — upstream layout mirrored faithfully under `skills/<source>/`,
  no physical re-foldering; the "nice organization" lives in `INDEX.md` + `groups.json`.
- **The index is auto-generated.** Each skill's name + one-line description is extracted from its
  `SKILL.md` YAML frontmatter at sync time, so the index never drifts from the skills.
- **Newly synced skills surface loudly.** Any skill not filed in `groups.json` lands in an
  "Uncategorized" section of `INDEX.md` (and is printed by `update.sh`).
- **The ecosystem is bigger than what we mirror.** `catalog.json` captures the full stellarlight
  directory — including SDKs/MCP servers/CLIs that aren't `SKILL.md` skills — so the map of "what
  exists" stays complete without dragging in non-skill artifacts.
- **Fail closed, swap atomically.** `update.sh` validates required credentials *before* touching
  disk, builds the whole mirror in a temp staging tree, and only swaps it into `skills/` (plus
  `MANIFEST.json` / `catalog.json`) on full success. A mid-run failure leaves the existing mirror
  untouched — it never produces a half-written or silently-downgraded tree.
- **Deterministic except timestamps.** Back-to-back runs against the same upstream produce
  byte-identical output **except the timestamp fields**: `MANIFEST.synced_at`,
  `catalog.fetched_at`, the per-source `archive_fetched_at`, and their rendered copies in `INDEX.md`
  (the "synced …" / "fetched …" text). Nothing else changes.
- **Honest provenance per source.** The four GitHub sources pin full commit SHAs (independently
  verifiable). The `lumenloop-api` partner source is a **private** repo behind a credentialed,
  mutable archive endpoint, so it can't be git-pinned: the manifest instead records the API version
  ref **plus a SHA256 of the exact downloaded zip** and labels it
  `reproducibility: "api-versioned+archive-digested"`.

## Updating

```bash
./update.sh                    # sync every source, rebuild INDEX.md (fails closed if creds missing)
ALLOW_PARTIAL=1 ./update.sh    # accept an explicitly-marked PARTIAL mirror (skips lumenloop-api)
node build-index.mjs           # just rebuild the index (e.g. after editing groups.json)
```

`update.sh` re-downloads every skill at a resolved commit per source, removes skills deleted
upstream, rewrites `MANIFEST.json` + `catalog.json`, then runs `build-index.mjs`. After a sync,
check the output for any **Uncategorized** skills and file them into `groups.json`.

Validate the mirror after a sync:

```bash
node scripts/check-mirrors.mjs   # from the repo root
```

This fails if any mirrored skill is uncategorized, if `groups.json` references skills missing from
`MANIFEST.json`, if any manifest-listed file is missing on disk, or if the mirror is partial.

### After a sync: rebuild the generated surfaces (repo root)

The mirror is an *input*; the model-facing artifacts are generated from it and must be rebuilt in
this order after every sync (CI runs the same chain):

```bash
node scripts/build-catalog.mjs   # catalog/manifest.json (applies policy: retirements, de-dup)
npm run skills:bundle            # src/skills/bundle.json (Worker-importable mirror content)
npm run spec:build               # specs/super-spec.json (in-sandbox spec; policy-aware skill index)
npm test                         # contract tests over the rebuilt artifacts
node eval/run-routing.mjs --gate # routing gates (eval/gates.json baselines)
```

Two guard classes can fail the catalog build loudly — both mean "a human must reconcile,
nothing silently changes exposure":

- **Retirement guard** (`assertRetirementNamesResolve`, `scripts/build-catalog.mjs`): the
  deny-listed skills (`RETIRED_ONBOARDING_SKILLS` — the lumenloop-api onboarding family +
  `lumenloop-mcp-connect`, retired from catalog exposure 2026-07-03, Solo todo 825) are pinned by
  upstream NAME. If a sync renames or removes one, the build fails instead of silently
  un-retiring it: retire the new name, or drop the entry if the skill is gone.
- **Orphaned description notes** (`scripts/description-notes.mjs`): catalog notes are exact-match
  data keyed on upstream tool/operation names; a rename orphans the note and fails both builders.

Eval coupling: `eval/skills-cases.json` grades skills routing. Cases whose target skill leaves
catalog exposure move to its inert `retiredCases` array (rationale + date), and the skills-lane
floor in `eval/gates.json` is re-baselined **in the same commit** with the decision recorded in
Solo (EVALS.md rule 1).

**Automated drift detection (CI):** the daily `refresh.yml` workflow runs
`node scripts/check-skills-drift.mjs`, which compares every pin in `MANIFEST.json` against upstream
— latest commit touching each GitHub source's pinned path, the LumenLoop API's partner version ref
(`GET /v1/skills`), and a volatile-field-free re-projection of the live stellarlight directory
against `catalog.json`. Any drift fails the run and lands in the same drift issue as the inventory
checks. It is **detection only** — CI never runs `update.sh`, because mirrored skills are prompt
input and upstream edits must be human-reviewed: on drift, run `./update.sh` locally, read the
skill diffs, re-pin, and commit. The script also runs standalone
(`node scripts/check-skills-drift.mjs [--json]`, exit 1 on drift); without `LUMENLOOP_API_KEY` the
`lumenloop-api` source is loudly marked skipped, never silently ok.

Requires an authenticated `gh` CLI, plus `jq`, `node`, `curl`, `unzip`, and `git`. The
`lumenloop-api` source additionally needs `LUMENLOOP_API_KEY` in the environment (or in a sibling
`../.env` / `../.dev.vars`). **Without the key the script fails closed** (exits non-zero, touches nothing) so a
keyless refresh can't silently downgrade the mirror to 19 of 25 skills. To deliberately produce a
partial mirror, set `ALLOW_PARTIAL=1`; the result is stamped `"status": "partial"` with
`missing_sources` in `MANIFEST.json` and a ⚠️ banner in `INDEX.md`, so it can't be mistaken for
complete.

## Source of truth

Each source's pin is recorded in [`MANIFEST.json`](./MANIFEST.json): a full commit SHA for the
GitHub sources, and the API version ref + zip SHA256 for the `lumenloop-api` partner archive
(`reproducibility: "api-versioned+archive-digested"`). Re-run `update.sh` to reconcile with upstream.
