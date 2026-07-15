# Model and effort routing

This is house policy for repo-work fan-out, not global model ranking. Confirm callable tools with
`list_agent_tools`; exact availability and CLI mechanics live in
`research/agent-model-roster.md`.

## Choose role before model

| Lane | Preferred arm | Default effort | Escalate when |
|---|---|---|---|
| Hard implementation, architecture, root-cause analysis | GPT-5.6 Sol | `high` | `max` after high misses quality bar or task is genuinely frontier |
| Routine implementation, bounded verification, balanced analysis | GPT-5.6 Terra | `high` | Sol high when ambiguity or integration risk grows |
| Mechanical inventory or low-risk first pass | GPT-5.6 Terra | `medium` | Terra high or Sol high before consequential integration |
| Product/API/code-quality/copy judgment; adversarial plan review | Claude Fable 5 | `xhigh` for hard review; `high` for bounded review | Fresh Fable context or separate lab when first pass is contaminated |
| Stable Claude second opinion, long-context review, Fable fallback | Claude Opus 4.8 | `high` | Higher effort only for demonstrated ambiguity |
| Vendor-diverse adversarial challenge, assumption attack | Grok 4.5 | `high` | Rerun with Sol/Fable if taste or nuanced user-facing judgment dominates |

Prefer different lab over merely deeper same-model pass when goal is independent challenge.
Reviewer must differ from author. Give raw artifacts and contract, not intended answer.

## Effort ladder

- `medium`: narrow mapping, mechanical inventory, cheap first pass where stronger review follows.
- `high`: default substantive implementation, verification, and analysis.
- `xhigh`: ambiguous planning, adversarial review, subtle API/product judgment.
- `max`: frontier problems or measured failure at lower effort; not routine insurance.
- `ultra`: delegated multi-agent system, not deeper single-agent reasoning. Treat as separate
  topology with separate cost, observability, and evaluation.

Do not rely on runtime/catalog defaults. State model and effort explicitly in launch.

## Current launch patterns

Saved tool command may already include permission bypass. Never duplicate it.

```text
# Codex; saved command already has --yolo
extra_args=["-m", "gpt-5.6-sol", "-c", "model_reasoning_effort=\"high\""]
extra_args=["-m", "gpt-5.6-terra", "-c", "model_reasoning_effort=\"high\""]

# Claude; saved command already has --dangerously-skip-permissions
extra_args=["--model", "fable", "--effort", "xhigh"]
extra_args=["--model", "opus", "--effort", "high"]

# Grok; saved command currently has --yolo
extra_args=["--model", "grok-4.5", "--reasoning-effort", "high"]
```

Fable CLI alias is `fable`, never `fable-5`. Grok is generic Solo tool here: verify actual
prompt delivery. Current Grok build can still show directory-trust UI on interactive launch even
with saved `--yolo`; bounded headless `--single` plus documented permission mode is safer until
saved runtime is corrected. Do not send blind `y` to trust prompt.

## Routing principles

- Use strongest lead for decomposition only when decomposition itself is hard.
- Use Terra for routine worker lanes and independent verification when Sol authored.
- Use Fable/Opus for user-facing taste and cross-lab plan/code review.
- Use Grok to attack assumptions, completeness, and vendor-correlated blind spots; do not treat it
  as calibrated taste authority.
- Keep worker count proportional to independent lanes. Two strong workers beat five overlapping
  ones.
- Cost is tie-breaker after quality and independence. Record retries, intervention, elapsed time,
  and quality on local tasks before changing roles.
- Public benchmarks describe particular harnesses and effort levels. They do not establish house
  cost, taste, reliability, or repo-specific ordering.

## Escalation

1. Rerun failed lane with clearer evidence/contract at same arm when prompt or missing context caused
   failure.
2. Increase effort when reasoning depth was limiting.
3. Change lab/model when correlated assumptions, taste, or tool behavior was limiting.
4. Add another agent only when new lane is independent or explicitly verifies prior work.
5. Root agent reconciles contradictions against source artifacts; majority vote is not truth.
