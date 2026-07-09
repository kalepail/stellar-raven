# Adversarial reviews — discovery redesign (issues #9–#13), 2026-07-09

Three independent Codex (gpt-5.5 high) reviewers, spawned via Solo in yolo mode with
read-only repo access and adversarial briefs, each attacking one slice of the
github.com/kalepail/stellar-raven issues #9–#13 design thread:

- [`atlas-critic.md`](./atlas-critic.md) — attacks the atlas-first hypothesis (#10, with #9
  as problem statement). Verdict: **reject as stated**; the premise conflates retrieval
  misses, agent-behavior misses, and downstream data-quality failures; measured token math
  breaks the ≤6k claim; minimal defensible version = generated micro-map + guidance rewrite.
- [`semantic-skeptic.md`](./semantic-skeptic.md) — attacks the Vectorize routing-card layer
  (#11) and hybrid `search(auto)` (#12). Verdict: **reject-now-with-trigger** for both;
  round 5f (eval/README.md) already measured bge-base embeddings failing every mode; defines
  the five-part trigger condition under which vectors would be justified.
- [`surface-taxonomist.md`](./surface-taxonomist.md) — stress-tests the top-level tool-surface
  options and #13's placement table. Verdict: **keep exactly two tools** (`search`+`execute`),
  atlas as SERVER_INSTRUCTIONS content plus generated `kind:"service"`/`kind:"workflow"`
  catalog lanes through existing `search`; #13's placement table is mostly the status quo.

Synthesis, the orchestrating agent's own evidence audit, and the resulting plan:
[`../../discovery-redesign.md`](../../discovery-redesign.md). Line-number citations in these
reviews reference the 2026-07-09 working tree (post-8f803d1, pre-redesign).
