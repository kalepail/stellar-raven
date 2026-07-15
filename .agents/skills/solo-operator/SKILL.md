---
name: solo-operator
description: Operate Solo MCP and Solo Docs for project-scoped process control, cross-model agent fan-out, grounded research, durable coordination, monitoring, readiness, integration, and cleanup. Use whenever work mentions Solo, SoloTerm, Solo MCP, Solo Docs, agent spawning, long-running agents or processes, scratchpads, todos, timers, locks, shared KV, prompt templates, localhost service discovery, choosing Claude Fable/Opus, Grok, or GPT-5.6 Sol/Terra with explicit reasoning effort, or selecting Cloudflare, GitHub, Parallel, Perplexity, and other research MCP/CLI surfaces for evidence-backed build decisions.
---

# Solo Operator

Use Solo as control plane and one lead agent as integration owner. Keep workers bounded; preserve
facts outside chat scrollback.

## Start from authority

1. Read repo and nearest directory instructions.
2. Call `whoami`; confirm caller process, actor, and effective project.
3. Call `list_processes` before process action. Call `list_agent_tools` before every spawn.
4. Use live `help(topic=...)` when a tool contract is unclear.
5. Use Solo Docs MCP for feature behavior: search corpus first, then fetch exact current page with
   Solo Docs execute when wording matters. Live tool schema/help wins over cached prose.
6. Pass `project_id` for one-off scope. Never re-identify as another process to change scope or
   timer delivery.

Read [tool routing](references/tool-routing.md) before nontrivial process, timer, memory, lock, or
cleanup work. Read [model routing](references/model-routing.md) before fan-out. Read
[research tool routing](references/research-tool-routing.md) before external research or a build
decision that depends on current service, API, library, repository, or ecosystem facts.

## Decide whether to fan out

Stay with one agent when work is sequential, fits one context, changes one small shared surface,
or each next step depends on previous result. More agents add coordination and error-amplification
cost.

Fan out only when at least one condition holds:

- Independent lanes can run concurrently with clear ownership.
- Search/research breadth exceeds one context or benefits from independent source paths.
- Separate lab or clean-context review materially reduces correlated assumptions.
- A long-running worker can progress while lead performs useful independent work.

Default topology: centralized lead plus two or three workers. Lead owns plan, user conversation,
integration, and final verification. Add workers only for named lanes; do not build peer mesh or
worker swarm without task-specific evidence.

Partition research workers by source class or falsifiable question, not by asking several engines
the same broad prompt. Search-engine agreement is not independent corroboration.

## Make state durable

For multi-turn or multi-worker work:

1. Write concise scratchpad: goal, evidence, constraints, ownership, decisions, gates, next action.
2. Create todos for concrete lanes. Use blockers for real ordering and comments for handoffs.
3. Use scratchpad revisions: read first, then edit/append with `expected_revision`.
4. Use KV only for small structured state another actor must discover.
5. Use lease locks only for short overlapping critical sections. Locks signal coordination; they
   do not transfer process ownership.

Do not mirror same state into scratchpad, todo, KV, and repo file. Pick smallest durable surface.

## Spawn correctly

1. Inspect saved runtime command from `list_agent_tools`.
2. Read live spawning help/schema before writing an exact payload. Use the identifier discovery
   actually returns; current `list_agent_tools` returns `agent_tool_id`. Pass
   `agent_tool_installation_id` only when project-scoped runnable discovery supplied one.
3. Select model and effort explicitly using [model routing](references/model-routing.md).
4. Add permission bypass only when saved command lacks it. Duplicate bypass flags can fail launch.
5. Call `spawn_agent`. Prepend returned `agent_instructions` to first prompt, then call
   `send_input`.
6. Record returned child ID immediately; Solo process reads do not expose reliable parentage.
7. Make every worker non-interactive. Require same for any authorized descendants.
8. If generic runtime can stop on trust/setup prompt, run bounded headless preflight or fix saved
   runtime configuration; do not assume process creation means prompt delivery succeeded.

Worker brief must state:

- One objective and why lane exists.
- Inputs and authoritative sources.
- Exact file/output ownership; forbidden edits and unrelated dirty-tree warning.
- Read-only versus edit authority.
- Required checks and handoff format.
- No process lifecycle action outside own descendants.
- Non-interactive mode and descendant policy.
- Durable report location when work may outlive lead context.

Never leak desired conclusion into independent validation. Give reviewer raw plan, diff, logs, or
artifact plus acceptance contract.

## Monitor without polling

- Treat idle classification and summaries as triage, not proof. Read actual output/status.
- Use `timer_fire_when_idle_any/all` to wake lead after worker quiet periods. Timer body must be a
  self-contained fresh-turn instruction with process IDs, scratchpad/todo IDs, and next action.
- Use `wait_for_bound_port`, `services_list`, or `get_process_ports` for service readiness.
  Worker idle and listener readiness are different signals.
- Avoid sleep loops and repeated polling. Cancel owned timers when no longer needed.
- A saturated or confused worker gets a fresh bounded replacement; do not keep extending stale
  context merely because process remains open.

## Integrate and finish

1. Capture handoff before cleanup: files or artifact, evidence, checks, blockers, remaining risk.
2. Inspect real diff/output, not worker summary alone.
3. Integrate one lane at a time and run focused checks after meaningful changes.
4. Use author-independent review when requested or risk warrants it. Reconcile every finding;
   verdict is evidence, not authority.
5. Update scratchpad/todo with final state. Complete todos only when objective is met.
6. Release owned locks and cancel owned timers.
7. Stop/close only self or recursive descendants, and only after useful context is durable.
   Never adopt or lifecycle-manage parent, sibling, unrelated process, or another agent's
   descendants.

Apply same ownership gate to `send_input`, rename, output clearing, UI selection, timer delivery,
and other target-process control. Unknown provenance means not owned.

If Solo connection restarts, inspect status before duplicating work: bundled helper can reconnect,
buffer bounded requests, and resume Solo-launched session identity.

## Evidence boundary

Solo-specific behavior comes from live Solo MCP help/tool schemas and Solo Docs. Model roles are
house policy informed by callable runtime evidence and local outcomes; public benchmarks are
directional, never automatic rankings. Read
[dated research](../../../research/solo-agent-orchestration-2026-07-15.md) before changing policy.
