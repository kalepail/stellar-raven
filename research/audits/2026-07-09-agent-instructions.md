# Agent instruction-file audit — 2026-07-09

## Decision

`AGENTS.md` is now the canonical, cross-agent repository instruction file. `CLAUDE.md` imports it
and carries no duplicated project policy. The root instruction layer is operational rather than a
historical archive: current commands, constraints, verification, coordination, model routing, and
links to narrower sources of truth.

The old cost/intelligence/taste table was removed from the instruction layer. GPT-5.5 is explicitly
prohibited and removed from every active selection surface. Current model
availability, reasoning depths, announcements, benchmarks, prices, and evidence boundaries remain
in `research/agent-model-roster.md`, where dated research belongs.

## Evidence-backed audit criteria

Official OpenAI guidance describes `AGENTS.md` as a practical repository guide containing layout,
run/build/test/lint commands, conventions, constraints, and the definition of done. It recommends a
short, accurate file; guidance should be added after repeated mistakes and split into linked docs or
nearer instruction files when it grows. Codex loads root-to-current-directory instructions with the
nearest file taking precedence and a 32 KiB combined default limit.

Official Anthropic guidance similarly favors short, concrete, verifiable `CLAUDE.md` instructions,
with a target below 200 lines, imports for shared material, and narrower rules or skills for
specialized workflows. Both approaches penalize duplicated, contradictory, vague, or stale context.

Industry guidance is directionally consistent—exact commands and boundaries are higher value than
generic prose—but numeric claims from vendor blogs were not treated as decision-grade evidence.

## Findings and disposition

| Finding | Previous state | Disposition |
|---|---|---|
| Canonical source was vendor-specific | `AGENTS.md` delegated to a 228-line `CLAUDE.md` | Inverted: `AGENTS.md` is canonical; `CLAUDE.md` imports it |
| Root guidance mixed policy with archive material | Deployment history, retired-repo narrative, dated inventories, benchmark detail, and operational rules shared one file | Root contains current actions and links; history/research remain under `research/` |
| Core verification was incomplete | Commands were scattered across skills and package metadata | Added reproducible install, baseline checks, secrets scan, targeted-gate rule, and definition of done |
| Model table encoded stale preference | GPT-5.5 remained a recommended calibrated baseline | Removed table; GPT-5.5 is prohibited; current routing uses Sol/Terra/Luna, Grok 4.5, and Claude review arms |
| Specialized workflows were summarized at length | Skill mechanics occupied root context | Root now provides trigger routing; each `SKILL.md` owns procedure |
| Codex discovery behavior lacked a verification basis | Official manual helper was unavailable during the first audit pass | Restored helper access, read the current manual, and confirmed hierarchy, concision, routing, and verification guidance |

## Resulting form

- `AGENTS.md`: portable current instructions, approximately 110 lines.
- `CLAUDE.md`: one canonical import plus an anti-duplication note.
- `.agents/skills/`: task-specific repeatable workflows, shared with Claude through the existing
  `.claude/skills` symlink.
- `PLAN.md`, `ARCHITECTURE.md`, and `research/`: product truth, implementation detail, dated evidence,
  and history linked from—not copied into—the instruction layer.

## Verification checklist

- Confirm the instruction layer contains the named ban and no stale numeric table:
  `rg -n "GPT-5\\.5|cost.*intelligence.*taste" AGENTS.md CLAUDE.md`.
- Confirm Claude import remains exactly rooted at `@AGENTS.md`.
- From a fresh Codex session, ask it to list loaded instruction sources and summarize repository
  verification commands.
- From a fresh Claude Code session, ask it to summarize imported project instructions.
- Re-audit after material command, architecture, model-roster, or skill-discovery changes; do not
  append chronology to the root files.

## Sources

Primary sources accessed 2026-07-09:

- OpenAI, Codex best practices: <https://developers.openai.com/codex/learn/best-practices>
- OpenAI, custom instructions with `AGENTS.md`: <https://developers.openai.com/codex/guides/agents-md>
- OpenAI, Codex skills: <https://developers.openai.com/codex/skills>
- Anthropic, Claude Code memory and `CLAUDE.md`: <https://docs.anthropic.com/en/docs/claude-code/memory>
- Anthropic, Claude Code best practices: <https://www.anthropic.com/engineering/claude-code-best-practices>
- Anthropic, Agent Skills best practices:
  <https://console.anthropic.com/docs/en/agents-and-tools/agent-skills/best-practices>
- AGENTS.md open format: <https://agents.md/>

Research was triangulated with Parallel CLI search and Perplexity MCP. The official Codex manual
helper was then restored and used as the final OpenAI-source check; its relevant manual sections
were "Make guidance reusable with AGENTS.md", "Custom instructions with AGENTS.md", and
"AGENTS Guidance".
