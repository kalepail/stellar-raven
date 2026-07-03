# Phase 2 brief — DEEP RESEARCH / ANSWERING

You are the **Phase-2 coordinator** (Solo codex agent, YOLO). Read `_pipeline/PLAN.md` first. Work in
this repo. Do NOT git commit.

## Start gate (dependency on Phase 1)
You were woken because Phase 1's agent went idle. **Idle ≠ done.** FIRST `kv_get("gp_phase1")`:
- If not `"done"` → re-arm: `timer_set` a short self-wake (or `timer_fire_when_idle_all` on the Phase-1
  agent again) and STOP without starting. Do not proceed until the gate is `done`.
- If `"done"` → `kv_set("gp_phase2","running")`, append "Phase 2 started" to `golden-answers-coord`, and
  read the `## WORKLIST`. Process only **RESEARCH** items (skip DECLINE/FOLD/DROP).

## Your job
Turn every RESEARCH `draft` file into `answered`: a tight, fully-cited **reference dossier** body +
finalized weighted rubric, re-derived from evidence (don't just trust the Phase-1 seed). Follow
`_meta/ANSWERING-BRIEF.md` exactly — it is the canonical answering spec.

## Evidence order + tools (per PLAN tool policy; weight official, use everything)
1. **Tier-1 official:** Stellar Docs MCP (`mcp__stellar-docs__*`), developers.stellar.org (WebFetch),
   stellar GitHub orgs + CAP/SEP repos (GitHub MCP / `gh api`).
2. **Tier-1 ecosystem:** Stellar Light Scout (`curl -s 'https://stellarlight.xyz/api/research?q=...&limit=5'`
   + `/projects/search`,`/repos/search`,`/builders`,`/rfps`) and LumenLoop tools. Use for project/SCF/
   ecosystem/named-protocol facts (also validates routing).
3. **Tier-2 general web (news/partnership/figures/freshness):** `~/.local/bin/parallel-cli`
   (`search`/`research`/`fetch`), Perplexity MCP, `parallel-search` MCP, WebFetch.
4. **Empirical verification** for high-stakes how-to/error/address items: run the `stellar` CLI, derive
   SAC addresses, decode sample XDR, reproduce build errors — testnet only, never real keys/funds.
Resolve contested/freshness facts against the PRIMARY source; gate the durable part + caveat in `notes`
and set `confidence: medium|low` rather than asserting a shaky number.

## Per-question output (fill in the file)
- `## Reference answer (gospel)` — concise, evidence-shaped (claims + inline source), NOT an essay.
- `## Why these cards` — routing rationale (confirm `expected_cards` against real tool behavior).
- `## Edge / traps` — the plausible-wrong answers the `must_avoid` encodes.
- Finalize `must_have`/`should_have`/`nice_to_have`/`must_avoid` (real, weighted), `must_cite`,
  `sources` (1–4 REAL URLs you verified, primary first), `status: answered`,
  `authored.phase2: 2026-06-29`, `confidence`. List any fact you could NOT verify in the file `notes`
  (Phase 3 will attack those first).

## Sub-agents + loop
Batch the RESEARCH worklist (e.g. by category / ~8–12 per wave) and spawn research worker sub-agents
(Solo `spawn_agent` if available, else internal parallelism); each owns a disjoint set of files (no two
edit the same file). **Loop** wave-by-wave until every RESEARCH file is `answered` and self-checks pass
(dossier present, sources real, rubric finalized). Keep a running tally in `golden-answers-coord`.

## Acceptance + handoff
When PLAN "P2" passes: append `## PHASE 2 RESULTS` (counts, confidence distribution, unverified-fact
list for P3), then `kv_set("gp_phase2","done")`. Stop. Phase 3 is gated on it.
