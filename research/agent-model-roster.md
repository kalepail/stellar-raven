# Agent model roster

Verified 2026-07-15 against Solo project 49, the installed CLI help/model catalogs, live Solo
spawns, provider announcements/docs, and independent Artificial Analysis results. This is the
availability, mechanics, and external-evidence record for repo-work fan-out. Active selection
policy lives in `.agents/skills/solo-operator/references/model-routing.md`, linked from `AGENTS.md`;
historical house ratings are not an operational routing surface.

## Callable Solo runtimes

| Solo tool | Saved command | Default model | Explicit model syntax |
|---|---|---|---|
| Codex | `headroom wrap codex --no-proxy --yolo` | `gpt-5.6-sol` (host config: high; catalog default: low) | `-m <model>` |
| Claude | `headroom wrap claude --no-proxy --1m --dangerously-skip-permissions` | account/runtime default | `--model <alias-or-id>` |
| Grok | `grok --yolo` | `grok-4.5` | `-m <model>` |
| OpenCode | `headroom wrap opencode --no-proxy --auto` | runtime/provider dependent | `-m <provider/model>` |

The saved commands already contain permission-bypass flags, but generic runtimes can still expose
setup/trust prompts. Inspect
`list_agent_tools` before every fan-out and add a bypass flag only when the saved command lacks
one. In particular, passing a second Codex `--yolo` in `extra_args` kills the spawn.

## Codex models

Installed Codex CLI `0.144.4` exposes these relevant ids:

| id | catalog positioning | Codex context | reasoning efforts |
|---|---|---:|---|
| `gpt-5.6-sol` | latest frontier agentic coding model | 372k | low, medium, high, xhigh, max, ultra |
| `gpt-5.6-terra` | balanced everyday agentic coding model | 372k | low, medium, high, xhigh, max, ultra |
| `gpt-5.6-luna` | fast/affordable agentic coding model | 372k | low, medium, high, xhigh, max |

Solo examples (the saved Codex tool already supplies `--yolo`):

```text
spawn_agent(agent_tool_id=<Codex>, extra_args=["-m", "gpt-5.6-terra", "-c", "model_reasoning_effort=\"high\""])
spawn_agent(agent_tool_id=<Codex>, extra_args=["-m", "gpt-5.6-luna", "-c", "model_reasoning_effort=\"medium\""])
```

One-shot equivalents:

```sh
codex exec -s read-only -m gpt-5.6-sol -c 'model_reasoning_effort="high"' "<investigation brief>"
codex exec --yolo -m gpt-5.6-luna -c 'model_reasoning_effort="medium"' "<bounded edit brief>"
```

There is no bare `gpt-5.6` id in the Codex catalog checked on this date; use the Sol, Terra,
or Luna slug explicitly.

## Grok models

Installed Grok CLI `0.2.101` reports:

- `grok-4.5` — default frontier model, 500k context, low/medium/high reasoning.
- `grok-composer-2.5-fast` — fast coding model without the same reasoning-effort control.

Solo's Grok tool is a first-class vendor-diverse review arm:

```text
spawn_agent(agent_tool_id=<Grok>, extra_args=["-m", "grok-4.5", "--reasoning-effort", "high"])
```

Do not repeat `--yolo`; the saved tool command already includes it.

Current interactive Solo spawn can still stop at Grok's directory-trust screen before prompt
delivery. Verify status/output after spawn. For bounded read-only review, current headless
`--single` plus `--permission-mode bypassPermissions` avoided interactive prompt; do not send
blind trust input or assume saved `--yolo` alone makes generic tool non-interactive.

## Public evidence snapshot — 2026-07-09

This is directional evidence for calibration if house axes are reintroduced, not a second
operational routing table. Public API prices do not define a house `cost` score; any future score
would reflect what Tyler actually pays under the available plans, including allowance pressure.
Likewise, public
benchmarks do not directly measure the repo's combined UI/UX, code-quality, API-design, and copy
`taste` axis.

The Artificial Analysis model pages label the GPT-5.6 variants below as `max`. OpenAI's launch
table reports the Coding Agent Index figures; Grok's figure comes from Artificial Analysis's Grok
Build evaluation. Do not generalize these numbers to lower reasoning efforts or compare `ultra`
with a single-agent run: `ultra` delegates to subagents and is a different execution system.

| model / external reference config | public API input / output per 1M | AA Intelligence Index | AA Coding Agent Index | calibration role |
|---|---:|---:|---:|---|
| GPT-5.6 Sol (`max`) | $5 / $30 | 58.9 (displayed as 59) | 80 | frontier-intelligence candidate |
| GPT-5.6 Terra (`max`) | $2.50 / $15 | 55 | 77.4 | balanced/prior-frontier candidate |
| GPT-5.6 Luna (`max`) | $1 / $6 | 51.2 (displayed as 51) | 74.6 | fast/high-throughput candidate |
| Grok 4.5 (API default `high`) | $2 / $6 | 54 | 76 | vendor-diverse coding candidate |

The final column explains the role each arm should cover in follow-up gauntlets. Public results are
evidence for calibration if house axes are reintroduced, not substitutes for Tyler's direct
ratings and not a second ranking table.

Relevant external evidence:

- OpenAI's general-availability announcement publishes the GPT-5.6 family prices and evaluation
  table, including Agents' Last Exam, Artificial Analysis Intelligence and Coding Agent indices,
  SWE-Bench Pro, DeepSWE, and Terminal-Bench results. It also defines Sol/Terra/Luna as durable
  capability tiers and `ultra` as a delegated multi-agent mode:
  <https://openai.com/index/gpt-5-6/>.
- The independent Artificial Analysis model pages report Sol 59, Terra 55, and Luna 51 on
  Intelligence Index v4.1, with each page explicitly labeled `max`:
  <https://artificialanalysis.ai/models/gpt-5-6-sol>,
  <https://artificialanalysis.ai/models/gpt-5-6-terra>, and
  <https://artificialanalysis.ai/models/gpt-5-6-luna>.
- Artificial Analysis reports Grok 4.5 at 54 on its Intelligence Index and 76 in Grok Build on its
  Coding Agent Index. It reports $0.31 per
  Intelligence Index task and $2.59 per Coding Agent Index task, driven by both price and token
  efficiency: <https://artificialanalysis.ai/articles/grok-4-5-brings-spacexai-to-the-the-intelligence-frontier>.
- xAI's launch results show why Grok needs task-level calibration rather than one headline score:
  83.3% on Terminal-Bench 2.1 and a leading 29% SWE Marathon result, but 53% on DeepSWE 1.1 and
  64.7% on SWE-Bench Pro. The same announcement gives its $2/$6 price and 80 TPS serving claim:
  <https://x.ai/news/grok-4-5>.
- xAI's model docs confirm the exact `grok-4.5` id and low/medium/high reasoning, defaulting to
  high: <https://docs.x.ai/developers/grok-4-5>.

### Context and effort boundaries

- The installed Codex catalog exposes a 372k working context for Sol, Terra, and Luna; the public
  API/Artificial Analysis specification reports a 1M model context. Say **372k Codex context** in
  repo fan-out guidance so these two surfaces are not conflated.
- The installed catalog exposes low/medium/high/xhigh/max/ultra for Sol and Terra, and
  low/medium/high/xhigh/max for Luna. Its catalog defaults are low for Sol and medium for
  Terra/Luna. This host's `~/.codex/config.toml` selects Sol at high effort, and the Solo Codex
  command inherits that host configuration; the repository itself does not set that default.
- Grok 4.5 exposes low/medium/high and defaults to high. The installed Grok CLI reports 500k
  context.

### What remains to calibrate

- **House cost:** public token prices do not reveal subscription allowance consumption, throttling,
  retries, or the marginal dollars Tyler actually pays.
- **Taste:** launch posts contain promising frontend, artifact, and Office-work examples, but the
  search found no same-harness independent taste comparison. Keep this axis unscored until a local
  blind review or Tyler's direct ranking supplies it.
- **Effort curves:** most comparable GPT-5.6 results are at `max`; there is not yet a controlled
  low/medium/high/xhigh/max curve on this repo's work.

To calibrate the currently unscored models, run the same representative repo tasks at explicit configurations:
Sol `high` and `max`, Terra `medium` and `max`, Luna `medium` and `max`, and Grok 4.5 `high`.
Record unsupervised completion quality, retries/interventions, wall time, allowance or credit
consumption, and a blind paired taste judgment from a reviewer other than the author. Treat
Sol/Terra `ultra` as a separate multi-agent arm.

## Claude aliases

Claude Code `2.1.210` accepts `fable`, `opus`, and `sonnet` aliases. Fable 5 must be invoked as
`--model fable` (or the full `claude-fable-5` id); `--model fable-5` is not a valid CLI alias.
Solo's saved Claude command already includes `--dangerously-skip-permissions`.

## Evidence boundaries

- GPT-5.6 Sol/Terra, Claude Fable/Opus, and Grok 4.5 are verified callable and covered by the
  `solo-operator` model-routing reference. Luna is verified callable but intentionally remains
  evidence-only, not an active house lane. External benchmarks support interim roles; local
  gauntlets or Tyler's direct judgment would be required before reintroducing house
  cost/intelligence/taste scores.
- The public demo's Workers AI/provider models are a separate surface and measurement contract
  (`research/demo-model-gauntlet-2026-07-07.md`). Do not infer Solo-agent quality from that table.
- QA answering and judge defaults are another separate measurement contract (`run-evals` skill).
  A new fan-out model never changes those defaults implicitly.
