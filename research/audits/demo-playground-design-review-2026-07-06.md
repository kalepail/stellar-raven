# Adversarial design review — /demo agent playground (codex gpt-5.5, 2026-07-06)

Reviewer: Codex CLI (`codex exec -s read-only -c model_reasoning_effort=high`),
independent gate before implementation, run against worktree branch
`demo-playground` at commit f39d9ee. Verdict: **APPROVE-WITH-CHANGES** (no
blockers). All findings were incorporated into
`research/demo-playground-design.md` in the same change that adds this file.

## Findings (verbatim substance, condensed formatting)

1. **major — `/demo/chat` needs explicit CSRF/origin defense, not just a signed
   `__Host-` cookie.** Existing cookies use `SameSite=Lax` (src/auth/workos.ts:64)
   and the worker serves two same-site custom domains (wrangler.jsonc:40); the
   only current CSRF protection is on the OAuth consent POST. Fix: require
   `Origin === request origin` on `POST /demo/chat`, reject unsafe
   `Sec-Fetch-Site` values where present, use `SameSite=Strict` for the demo
   cookie, add a CSRF token if non-fetch POSTs ever appear.

2. **major — `/callback` reuse is implementable but the parked-state shape is
   not branch-safe yet.** Current KV state is untyped `{ oauthReq, binding }`
   (src/auth/workos.ts:66) and the callback unconditionally parses it as
   `ParkedLogin` then calls `completeAuthorization()`. Fix: validated
   discriminated union `{ type: "mcp", oauthReq, binding } | { type: "demo",
   binding, returnTo }`; reject unknown/malformed JSON; delete state single-use
   before exchange; fixed same-origin redirects on the demo branch.

3. **major — cost caps are not "hard" as written.** Workers KV has no atomic
   consume, so concurrent requests can overrun an hourly bucket; and
   `stepCountIs(5)` does not cap multiple tool calls emitted in one model step.
   Fix: call the KV bucket best-effort coarse throttling; enforce real limits
   with in-request closure counters (execute ≤ 2, search limit clamp, code
   length, history chars, abort/timeout); AI Gateway spend limits as mandatory
   backstop; an atomic limiter (DO or rate-limiting product) only if hard
   cross-request caps ever become a requirement.

4. **major — the design referenced exported tool descriptions that are not
   exported.** Only `SERVER_INSTRUCTIONS` is exported; `SEARCH_DESCRIPTION` /
   `EXECUTE_DESCRIPTION` are module-private (src/mcp/tools.ts:129,150). Fix:
   export them (or factor a shared prompt-strings module) so demo and MCP
   cannot drift.

5. **major — same problem for site constants.** `FONT_FACE`, `TOKENS`, `BASE`
   are private in src/site.ts (lines 61/69/80). Fix: export the shared
   design-system constants intentionally.

6. **minor — route interception is correct but needs exact matching + HEAD.**
   Broad `startsWith("/demo")` would catch `/demolition`; public routes answer
   GET+HEAD. Fix: `isDemoPath(url)` with exact `/demo`, `/demo/`,
   `/demo/login`, `/demo/chat`; 405 on unsupported methods.

7. **minor — the ADR-0003 test must reuse the real exclusion data.** The build
   guard is local to scripts/build-catalog.mjs and scans only manifest entries;
   exclusion data lives in scripts/exposure.mjs. Fix: factor a reusable
   `assertNoNonExposedRefsInText()` helper backed by scripts/exposure.mjs and
   run it over rendered demo HTML + the demo system/tool prompt text.

8. **major — dependency risk under-specified.** `ai`/`workers-ai-provider` are
   not current runtime deps (only optional peers in the lockfile). Fix: pin
   exact versions, run `npm run build` (dry-run deploy) and record bundle
   size/import warnings, add a workerd smoke test importing the demo route.

## Confirmed claims

- `/demo` can be intercepted before `oauthProvider.fetch` without touching MCP
  auth (src/server.ts:66-84), if matching is narrow.
- In-process reuse: `searchCatalogPage()` is pure and clamps to catalog max
  (src/catalog/search.ts:380); `createExecuteRunner(env)` is worker-only and
  already cached per isolate (src/server.ts:34, src/executor/run.ts:5).
- Envelope claim correct: `"denied"` is gone; adapter error kinds are
  `"error" | "soft-empty"` (src/adapters/types.ts:32, ADR-0003:64).
