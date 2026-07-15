# Solo tool routing

Authoritative baseline: live Solo MCP help/tool schemas plus Solo Docs snapshot. Discover exact
current schemas instead of guessing arguments.

## Contents

- Scope, identity, and docs
- Process and agent control
- Wake-up versus readiness
- Durable coordination
- Commands, project config, and rare surfaces
- Spawn failures

## Scope, identity, and docs

| Need | Use | Contract |
|---|---|---|
| Confirm caller | `whoami` | Inspect process, actor, bound and effective project. |
| Recover identity | `identify_session` | Auto-detect first. Self-assert only own `SOLO_PROCESS_ID`; external registration only for outside-Solo actor. |
| Change default project | `select_project` | Session-local default only. |
| One call elsewhere | `project_id` parameter | Does not change session default or caller identity. |
| Discover capabilities | `help(topic)`, `mcp_tools_summary` | Prefer live surface. |
| Research behavior | Solo Docs `search`, then `execute` | Search cached corpus; execute fetches exact docs API page. |

Solo MCP uses local stdio helper connected to running app. Solo-launched sessions normally retain
identity and selected project across helper/app restarts; helper reconnects with backoff and
buffers bounded in-flight requests. Inspect before retrying a mutation.

## Process and agent control

| Need | Use |
|---|---|
| Inventory | `list_processes`, `get_process_status`, `get_project_status` |
| Spawn agent | `list_agent_tools` → `spawn_agent` → prepend `agent_instructions` → `send_input` |
| Spawn shell | `spawn_process(kind="terminal")` |
| Existing entry lifecycle | `start_process`, `stop_process`, `restart_process` |
| Remove terminal/agent | `close_process`; never use for command |
| Read output | `get_process_output`; raw variant only for terminal control details |
| Search output | `search_output`; raw variant only when rendered view hides evidence |
| UI attachment | `select_process` |
| Ports for known process | `get_process_ports` |

Process ownership is repo policy layered over Solo: lifecycle-manage only self and recursively
spawned descendants. Read APIs do not expose reliable parentage, so record child IDs returned by
spawn; unknown provenance is not owned. Apply same gate to input, rename, output clearing, UI
selection, and timer delivery. A stale or idle row does not become yours. Closing agent stops
current work and preserves partial filesystem edits; capture handoff and inspect diff first.

`list_agent_tools` exposes saved runtime tools, not project-scoped runnable installations. Use its
returned `agent_tool_id`; pass optional `agent_tool_installation_id` only when another live
project-scoped discovery surface actually returned one. Do not copy field names from docs into a
payload without checking current tool schema.

Agent state is heuristic. Quiet may mean thinking pause, permission wait, error, or completion.
Confirm from real output and requested deliverable.

`clear_output` erases saved evidence while leaving PTY alive. `select_process` changes user's
attached Solo UI surface. Use either only when task needs it.

## Wake-up versus readiness

| Question | Correct surface |
|---|---|
| Worker became quiet | `timer_fire_when_idle_any/all` |
| Resume after delay | `timer_set` |
| What timers do I own? | `timer_list` |
| Service has listener | `wait_for_bound_port` |
| Discover project services | `services_list` |
| Known process listener snapshot | `get_process_ports` |

Timers inject `body` verbatim as fresh user turn into one delivery agent. Watch list and delivery
target are distinct. Include cold-start context in body. `max_wait_ms` is deadline, not polling
interval. `idle_any` ignores already-idle processes until new transition; `idle_all` counts
already-idle processes and may return `already_satisfied` without creating timer.

Timers are actor-owned. Cancel/pause/resume only owned timers. Cancel them after integration.

## Durable coordination

| Information | Surface | Rules |
|---|---|---|
| Plan, evidence, report | Scratchpad | Read revision first; prefer targeted edit/append over full write. |
| Concrete work/status | Todo | Use blockers for ordering, comments for handoff, completion for outcome. |
| Active todo edit | Todo lock | Lease coordination; completion releases actor lock by default. |
| Shared critical section | `lock_acquire/status/release` | Short-lived project lease; owner releases. |
| Small discoverable JSON | KV | No long prose/logs; use TTL when state expires. |
| Reusable human prompt | Prompt template | Global or project-scoped; feature tool may be disabled. |

Scratchpad mutation flow:

1. `scratchpad_read` (headings/section for large notes).
2. `scratchpad_edit`, `scratchpad_append_section`, or `scratchpad_append`.
3. Pass `expected_revision` when overwriting or targeted edit could clobber concurrent work.
4. Use file import/export only when user wants repo/file artifact.

Todo writes default to slim receipts. Request `response_mode=rich` only when hydrated state is
needed. Transfer preserves comments/completion but clears blockers/locks.

Generic KV has no compare-and-swap contract; never use it for critical concurrent ownership.
Lease locks have bounded TTL and no assumed renewal; re-check before acting after delay.

`get_prompt_template` updates `last_selected`. Creating without `project_id` creates global
template; pass project scope for repo-only template. Export writes files and needs write authority.

## Commands, project config, and rare surfaces

- `solo.yml` stores command processes only; terminals and agents remain app state.
- YAML-backed command trust must be approved in Solo UI. Trust-relevant changes can require review.
- `working_dir`, icon, and file-backed paths must stay inside project root.
- Do not start duplicate dev service. Inspect process list, then use existing command and discovered
  bound port.
- Bulk start/stop/restart affects trusted command rows, not agents or terminals. Repo lifecycle
  ownership still applies.
- Project create/delete, template deletion, and self-close are destructive. Require explicit user
  authority; self-close also requires live confirmation field. Do not delete project to clean state.
- `mcp_smoke_test` creates temporary records, `setup_agent_integration` edits repo files, and
  feedback opens UI. Treat them as mutations, not read-only diagnostics.

## Spawn failures

After spawn, inspect early output/status before assuming worker received prompt.

- Duplicate bypass flag: process may exit during argument parsing. Inspect saved command first.
- Interactive trust/setup screen: saved runtime is not truly non-interactive. Prefer documented
  headless mode for bounded lane or fix runtime configuration with user authority.
- PTY write error: process probably exited; read status/raw output before retrying.
- Missing MCP inside worker: require stdout/file handoff; lead harvests it.
- Context saturation: start fresh worker from durable scratchpad/raw artifacts.

## Sources

- [MCP integration](https://soloterm.com/api/v1/docs/integrations/mcp-server)
- [Agent and terminal tools](https://soloterm.com/api/v1/docs/mcp-tools/agent-terminal)
- [Agent orchestration workflow](https://soloterm.com/api/v1/docs/workflows/agent-orchestration)
- [Process tools](https://soloterm.com/api/v1/docs/mcp-tools/process)
- [Timers](https://soloterm.com/api/v1/docs/mcp-tools/timers)
- [Scratchpads](https://soloterm.com/api/v1/docs/mcp-tools/scratchpads)
- [Todos](https://soloterm.com/api/v1/docs/mcp-tools/todos)
- [Services](https://soloterm.com/api/v1/docs/mcp-tools/services)
- [Coordination locks](https://soloterm.com/api/v1/docs/mcp-tools/coordination)
- [solo.yml](https://soloterm.com/api/v1/docs/projects/solo-yml)
