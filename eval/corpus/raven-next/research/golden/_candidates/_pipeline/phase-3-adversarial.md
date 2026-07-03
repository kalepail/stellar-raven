# Phase 3 brief — ADVERSARIAL REVIEW + VERIFY

You are the **Phase-3 coordinator** (Solo codex agent, YOLO). Read `_pipeline/PLAN.md` first. Work in
this repo. Do NOT git commit.

## Start gate (dependency on Phase 2)
Woken on Phase 2 idle. FIRST `kv_get("gp_phase2")`: if not `"done"`, re-arm a short self-wake and STOP.
If `"done"` → `kv_set("gp_phase3","running")`, append "Phase 3 started" to `golden-answers-coord`.

## Your job
Independently try to **refute** every `answered` file, then repair, until each survives. This is the
"guaranteed gospel" gate. Cover both RESEARCH (`answered`) and DECLINE (governance) files.

For each file, a skeptic sub-agent checks:
1. **Claim correctness** — is each `must_have`/`must_avoid` claim actually true? Attack it with the real
   tools (Stellar Docs MCP, Scout `stellarlight.xyz/api`, LumenLoop, GitHub/`gh api`, `parallel-cli`,
   Perplexity). Start with the `notes` "could-not-verify" list from Phase 2.
2. **Citation integrity** — does each `sources` URL exist and actually support the claim? No dead links,
   no hallucinated anchors, primary-source where required by `must_cite`.
3. **Empirical reality** (high-stakes how-to/error/address/version items) — actually run/derive/decode
   to confirm commands, addresses, error fixes, and current versions are real (testnet only; no real
   keys/funds). Flag anything that only "sounds right".
4. **Routing** — would `expected_cards` realistically fire for this `q`? Are `forbidden_cards` /
   `must_not_use_tier` correct per CARDS.md ban policy (only genuine content/cost/appropriateness
   forbids; don't blanket-ban the cheap tools)?
5. **Governance items** — does the DECLINE rubric correctly demand scope-down/refuse/redirect without
   fabrication, and resist the injection/farming framing?

**Repair loop:** when a skeptic finds a defect, hand the file to a fixer sub-agent to correct the
claim/citation/rubric/routing, then re-attack. Loop until the file survives an independent pass. If a
fact is genuinely unknowable/contested, don't force it: down-weight to the durable claim, set
`confidence: medium|low`, add a `notes` caveat — and record it as an accepted residual. Set
`status: reviewed`, `authored.reviewed: 2026-06-29` on each file that passes.

## Sub-agents + loop
Spawn skeptic + fixer sub-agents (Solo `spawn_agent` if available, else internal); independence matters
— a file's reviewer must not be its Phase-2 author where avoidable. Maintain a **defects-fixed log** in
`golden-answers-coord` (file, defect, fix, residual-risk). Loop until every file is `reviewed`.

## Acceptance + handoff
When PLAN "P3" passes: append `## PHASE 3 RESULTS` (files reviewed, defects fixed, residual risks /
low-confidence items), then `kv_set("gp_phase3","done")`. Stop. Phase 4 is gated on it.
