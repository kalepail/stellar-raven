export const meta = {
  name: 'agentic-routing-eval',
  description: 'Sonnet 5 sub-agents (low+medium effort) pick tools via live MCP search; graded vs golden labels',
  phases: [
    { title: 'Ask', detail: '30 questions x 2 efforts, Sonnet 5 agents against live /mcp' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : args
const { port, cases } = input
const VERDICT = {
  type: 'object',
  properties: {
    queriesUsed: { type: 'array', items: { type: 'string' } },
    primaryToolId: { type: 'string' },
    primaryService: { type: 'string', enum: ['lumenloop', 'scout', 'stellarDocs', 'skills', 'none'] },
    alternateToolIds: { type: 'array', items: { type: 'string' } },
    reasoning: { type: 'string' },
  },
  required: ['queriesUsed', 'primaryToolId', 'primaryService', 'reasoning'],
  additionalProperties: false,
}

function prompt(c) {
  return `You are an AI agent connected to an MCP server that unifies Stellar-ecosystem tools (services: lumenloop = Stellar content/directory/research platform; scout = Stellar Light project/repo/builder/partner data; stellarDocs = official Stellar developer docs search; skills = reference playbooks/guides).

A user asked: "${c.question}"

Discover which tools exist by calling the server's search tool with curl via Bash. Exact command (replace QUERY; keep the quoting):
curl -s http://localhost:${port}/mcp -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search","arguments":{"query":"QUERY","limit":8}}}'
The response is an SSE frame: take the line starting with "data: ", parse it as JSON, then parse result.content[0].text as JSON to get {hits:[{id,service,kind,score,description,signature}]}.

Rules: 1-3 search calls total, different query phrasings allowed. Pick the ONE tool id you would actually invoke to answer the user (prefer kind "operation" when an operation can answer; a skill/skill-section only if reference reading is genuinely the right answer). Then report via structured output: queriesUsed, primaryToolId (an exact id from the hits), primaryService (the service of that tool), alternateToolIds (0-3 backups), reasoning (1-2 sentences). Do not answer the user's question itself.`
}

phase('Ask')
const jobs = []
for (const c of cases) {
  for (const effort of ['low', 'medium']) {
    jobs.push({ c, effort })
  }
}
log(`${jobs.length} agent runs (${cases.length} cases x low/medium)`)

const results = await parallel(jobs.map(({ c, effort }) => () =>
  agent(prompt(c), {
    label: `${effort}:${c.id}`,
    model: 'sonnet',
    effort,
    schema: VERDICT,
  }).then(v => ({ caseId: c.id, question: c.question, expected: c.expected_service, effort, verdict: v }))
    .catch(() => null)
))

const rows = results.filter(Boolean).filter(r => r.verdict)
// Twin-aware grading (routing rule v2 — mirrors eval/lib/grade.mjs hitServices() and the
// src/skills/store.ts alias): lumenloop.skill.<name> and skills.<source>.<name> are ONE
// aliased resource, keyed on terminal-name equality. A twin pick satisfies BOTH the
// lumenloop and skills labels. The sandbox has no fs/imports, so the twin terminal-name
// set (terminal names of the 14 lumenloop.skill.* entries in catalog/manifest.json) is
// inlined — keep in sync with the manifest.
const TWIN_TERMINALS = new Set([
  'lumenloop-api-billing', 'lumenloop-api-connect', 'lumenloop-api-integrate',
  'lumenloop-api-keys', 'lumenloop-api-query', 'lumenloop-api-research',
  'lumenloop-mcp-connect', 'scf-submission-radar', 'stellar-builder-quickstart',
  'stellar-content-auditor', 'stellar-ecosystem-digest', 'stellar-ecosystem-scout',
  'stellar-integration-finder', 'stellar-project-dossier',
])
const terminalName = id => String(id).split('#')[0].split('.').pop()
const servicesOf = (id, service) => {
  const services = [service]
  if (TWIN_TERMINALS.has(terminalName(id))) {
    if (service === 'lumenloop') services.push('skills')
    else if (service === 'skills') services.push('lumenloop')
  }
  return services
}
const grade = rs => {
  const n = rs.length
  const primary = r => servicesOf(r.verdict.primaryToolId, r.verdict.primaryService).includes(r.expected)
  const primaryHit = rs.filter(primary).length
  const anyHit = rs.filter(r =>
    primary(r) ||
    (r.verdict.alternateToolIds || []).some(id => servicesOf(id, String(id).split('.')[0]).includes(r.expected))
  ).length
  return { n, primaryHit, primaryPct: n ? +(100 * primaryHit / n).toFixed(1) : 0, anyHit, anyPct: n ? +(100 * anyHit / n).toFixed(1) : 0 }
}
const summary = {}
for (const effort of ['low', 'medium']) {
  const sub = rows.filter(r => r.effort === effort)
  summary[effort] = { overall: grade(sub) }
  for (const svc of ['lumenloop', 'scout', 'stellarDocs']) {
    summary[effort][svc] = grade(sub.filter(r => r.expected === svc))
  }
}
log(`graded ${rows.length}/${jobs.length} runs`)
return { summary, rows }