# 2026-07-03 fleet audit — full-repo correctness / security / cleanliness pass

**Method:** five parallel read-only auditor agents, each owning a disjoint slice of the tree,
followed by a two-agent fix wave (code vs docs, disjoint file sets). Baseline: HEAD `b14df5e`,
working tree clean. This file is the immutable consolidated record; line numbers reference the
audited baseline, not post-fix state.

Slices: (1) `src/` + config, security-invariant focus; (2) `scripts/` + `catalog/` +
`inventory/` + CI workflows; (3) `test/` + `specs/` + `eval/` + `improvements/`;
(4) all docs + `research/` + `ecosystem-skills/` + `.claude/skills/` + `public/`;
(5) whole-tree cruft/git-hygiene/secrets sweep.

## Headline verdicts

- **Zero critical or major defects across all five slices.**
- **All six CLAUDE.md security invariants CONFIRMED with file:line evidence:** secrets
  host-side only (adapter-scoped env reads + 3-layer redaction ordered before log clipping);
  `globalOutbound: null` pinned in both executors; deny-list as manifest data enforced at four
  independent layers (guard, search, describe, skill reads with fail-closed section excision);
  exact-match id resolution everywhere (single documented alias, refused on 0 or >1 matches);
  paid research double-gated (deny-list AND metered-cost guard — stricter than documented);
  model code owns no endpoints/args/auth (manifest-closure → guard → validate → adapter).
- **Auth surface tight:** timing-safe admin-token digests, unset secret disables bypass; dev
  bypass requires exact `"true"` AND loopback hostname; S256-only PKCE; WorkOS token dropped
  post-exchange, peppered SHA-256 subject only; consent CSRF double-submit + browser-binding
  cookie + single-use parked state; all interpolated HTML escaped; status-only failure logging.
- **Generated-artifact pipeline healthy:** catalog/manifest.json, specs/super-spec.json,
  src/skills/bundle.json all rebuilt **byte-identically** from committed inputs in an isolated
  copy. No hand-edit smells. Inventory fresh vs the 2026-07-02 service releases.
- **Tests green:** 13 files / 215 tests, hermetic, 625ms. eval selftest passes; routing gate
  PASSES (legacy 338 within 222/288/318 band; skills 18/23 floor met at 78.3% top-1).
- **Secrets/PII clean:** `.env`/`.dev.vars` untracked, never in history; zero secret-pattern
  matches across all tracked content including the vendored corpus; jutsu pool absent from
  disk AND full git history (squash to root `7e83d1c` verified effective).
- **Repo rename fully propagated already:** zero `github.com/kalepail/stellar-raven-codemode`
  references anywhere. Remaining `stellar-raven-codemode` strings are the worker / package /
  local-dir names, intentionally retained.
- **Git hygiene clean:** every untracked disk file is gitignored; no tracked build output; no
  dead gitignore entries (the `jutsu/` entry is a deliberate permanent guard); no leftover
  worktrees; no .DS_Store/backup/one-off files.

## Findings fixed in the same-day fix wave

Code/scripts (severity minor unless noted):

1. `scripts/scan-secrets.mjs` — `file.slice(file.lastIndexOf("."))` returns the last character
   for dotless paths, making the `ext === ""` branch unreachable: extensionless files silently
   skipped layer D (keyword heuristic). Fixed; stale header comments (pre-public-repo claims,
   wrong CI invocation) refreshed.
2. `scripts/build-catalog.mjs` — manifest `generatedAt` omitted `stellar-docs-titles.json`
   `fetchedAt` from its newest-input reduce (provably stale: titles 15:11Z > manifest 14:02Z).
   Fixed + artifacts rebuilt.
3. `scripts/refresh-inventory.mjs` — documented `LUMENLOOP_PARTNER_SKILLS` count guard did not
   exist in code (docs described it in two places); resolved per /v1/me evidence (see fix-wave
   report). Also: secret-scrub only read `.env`, not process.env (guarantee overstated); the
   `pageTitleCount` return was silently dropped from the summary.
4. `.github/workflows/refresh.yml` — a refresh-script crash opened no issue (only drift did),
   contradicting the "impossible to miss" contract. Added `if: failure()` issue step.
5. `scripts/gen-og.mjs` / `gen-site-fonts.mjs` — no `res.ok` checks (a 404 page becomes a
   .ttf); gen-og header string still said "Fraunces" post IBM Plex switch.
6. `src/catalog` — manifest load did not enforce identifier validity; an op failing
   `VALID_IDENT` was silently dropped from the sandbox while still ranking in search
   (searchable-but-uncallable, fails quiet). Now fails loudly at load.
7. `src/executor/providers.ts` — `codemode.spec()` unwired fallback returned bare
   `{ error }` instead of the standard failure envelope.
8. `src/catalog/search.ts` — twin-suppression branch was dead code since the 2026-07-03 twin
   de-dup deny-listed all 14 `lumenloop.skill.*` twins (denied entries filter before scoring).
   Removed per forward-only rule; routing gate re-verified unchanged.
9. `src/auth/workos.ts` — `deriveSubject` would pepper with literal `"undefined"` if
   `MCP_SERVER_SECRET` unset (silent pepper loss, not a bypass). Now throws loudly.
10. Nits: consent-page CSP gained `form-action 'self'` parity; `/og.png` decode now cached
    module-level; `redact.ts` comment records ALGOLIA_APPLICATION_ID's deliberate absence;
    duplicate npm script aliases consolidated; stale "Unused until Phase 3" comment on the
    load-bearing LOADER binding rewritten; `src/observability.ts` gained direct tests.

Docs (root cause: the 2026-07-03 skills-retirement + twin de-dup had no decision record, so
PLAN/ARCHITECTURE went stale by one build generation):

11. NEW `research/decisions/0002-skills-retirement-twin-dedup.md` — the missing ADR
    (374→299 entries, 25→18 exposed skills, 278→203 sections, 4→25 denied entries).
12. PLAN.md §§2/4/7/8 refreshed to current manifest truth; raven.stellar.buzz stated as
    primary (agents.* alias); site/SEO surface documented; broken `§5 item 4` cross-ref fixed;
    orphaned `research/skill-run-design.md` linked.
13. ARCHITECTURE.md — documented the fifth scoring lever (`scoreEntryWeightedUngated` + tiered
    ungated backfill), the one substantive code/doc drift found; twin mechanism reconciled to
    the deny-list reality; site surface added.
14. CLAUDE.md opening line "Stellar Docs MCP" → "Stellar Docs (Algolia)" (matches the settled
    integration; MCP is fallback only).
15. `research/auth-workos.md` refreshed (primary hostname; loopback-gated bypass as shipped);
    `research/super-spec-design.md` counts refreshed + de-orphaned;
    `research/services/stellar-docs-spec-design.md` de-orphaned (linked, "shipped" note).
16. eval docs: EVALS.md lane counts 31→23 (+8 documented-inert retired); results-pruning
    guidance added to rule 7; eval/README.md gate record caught up with the todo-825 and
    todo-824 re-baselines (stamps from gates.json note).
17. `improvements/README.md` project-number hard-code → pointer to CLAUDE.md; new
    `improvements/skills/` finding filed for the upstream digest skill's hard-coded
    "Today is 2026-06-08" worked example.
18. NEW `public/README.md` documenting the directory's GitHub-only role (nothing in public/
    is served by the Worker; live og/fonts are generated code).

## Cleanliness decisions (user-confirmed)

- `public/Gemini_Generated_Image_klv48….png` (10.4 MB, tracked, zero references): **KEEP**,
  per user decision — reserved future asset; documented in public/README.md. Note preserved
  here: if it is ever deleted, a history rewrite to drop the blob costs little while history
  is short and more as public clones accumulate.
- `research/services/{lumenloop,stellar-light}-openapi.json`: **DELETED**, per user decision —
  duplicative with the daily-refreshed `inventory/` snapshots and already a version behind;
  doc links repointed to inventory/.
- `dist/` (gitignored, stale local dry-run output): local-only hygiene, no repo action.
- `eval/*/results/` accumulation: gitignored-by-convention confirmed; pruning guidance added
  to EVALS.md rule 7 rather than any automated deletion.

## Verified-intentional (do not "clean up" later)

- Tracked generated artifacts (manifest, super-spec, bundle, fonts.ts, og.ts) — CI diffs them
  as the drift signal; they must stay tracked.
- `specs/stellar-docs.json` — authored spec-as-data INPUT, not stale output.
- `eval/corpus/` 11 MB vendored archive incl. reconciliation diffs — stated purpose in
  PROVENANCE.md.
- `ecosystem-skills/update.sh` + `build-index.mjs` living inside the data dir — self-contained
  mirror machinery referenced by the refresh workflow's remediation text.
- Guard's metered branch is unreachable for the only metered entry (deny-list fires first) —
  deliberate defense-in-depth, keep both layers.
- `createSpecSearchRunner` + spec-sandbox support surface — dead at runtime since ADR-0001,
  kept intentionally for future A/Bs (documented in-file).
- Sibling-repo mentions (18 files) — all archival provenance text; no live path dependencies.

## Residuals (tracked, not fixed here)

- **Offline coverage gap:** `src/server.ts` (assembled router) and `src/executor/run.ts`
  (isolate wiring) have no offline tests — building blocks are covered; the executor is
  exercised only by the manual `test/live/run-live-execute.mjs`. Filed as a Solo backlog todo
  (vitest-pool-workers smoke lane or scheduled live-smoke CI job).
- `eval/gates.json` `baselineResults` evidence file remains machine-local by accepted design
  (EVALS.md rule 7); revisit only if a Logpush/R2 sink is ever built (todo 808).
- gitleaks `--tree` mode scans the working dir including local `.env` (guaranteed local false
  positive for anyone with gitleaks installed) — cosmetic; not addressed.
- Vendored-corpus citation ambiguity (`review-raven-main.md` cites the retired repo that
  previously held the stellar-raven name) — annotated in PROVENANCE.md, content untouched.
