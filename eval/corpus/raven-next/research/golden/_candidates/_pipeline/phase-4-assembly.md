# Phase 4 brief — ASSEMBLY + COMPILE + FINAL REPORT

You are the **Phase-4 coordinator** (Solo codex agent, YOLO). Read `_pipeline/PLAN.md` first. Work in
this repo. Do NOT git commit (the human owns commits).

## Start gate (dependency on Phase 3)
Woken on Phase 3 idle. FIRST `kv_get("gp_phase3")`: if not `"done"`, re-arm a short self-wake and STOP.
If `"done"` → `kv_set("gp_phase4","running")`, append "Phase 4 started" to `golden-answers-coord`.

## Your job
1. **Validate** every new/changed file under `research/golden/<category>/`: frontmatter parses; all card
   ids exist in `src/capability-index.ts` / `_meta/CARDS.md`; ids globally unique (no clash with the
   existing 395); required fields present; `status` is `reviewed` (RESEARCH/DECLINE) — flag any stragglers
   back into a short repair loop (spawn a fixer sub-agent).
2. **FOLD items:** for each worklist FOLD row, propose the concrete rubric addition to the named existing
   `q-id` (as a diff/patch suggestion appended to the report) — do not silently overwrite an existing
   reviewed golden; leave the human the decision.
3. **Index/compile:** acquire `lock_acquire("golden-files")`, then refresh the generated index/corpus the
   way the repo does it — run `node research/golden/_meta/build-index.mjs` and `node
   research/golden/_meta/compile.mjs` (per README) if they run clean; if a script errors or would
   clobber, instead emit the intended diff into the report and leave it for the human. Release the lock.
4. **FINAL-REPORT.md** at `research/golden/_candidates/_pipeline/FINAL-REPORT.md`: total promoted, split
   by disposition (RESEARCH/DECLINE/FOLD/DROP) and category; confidence distribution; freshness-sensitive
   set + horizons; residual low-confidence/contested items from Phase 3; the FOLD patch proposals; and a
   crisp "recommended next actions for the human" list (what to review, what to commit, what to re-run as
   an eval).

## Sub-agents + loop
Spawn validation/fixer sub-agents as needed; loop until validation is clean (or cleanly reported as
needing human input). 

## Acceptance + handoff
When PLAN "P4" passes: append `## PHASE 4 RESULTS` to `golden-answers-coord`, write FINAL-REPORT.md,
then `kv_set("gp_phase4","done")`. Stop. The orchestrator will surface the report to the human.
