# codemode.skill.run — design round (2026-07-03, Solo todo 806)

**Decision: do not build now.** The three open design questions are settled below with
evidence; the outcome is a documented contract for *when* a runnable skill exists, plus
explicit triggers that reopen the work. Until a trigger fires, `skill.read` +
model-authored `execute` scripts cover every real use we have measured.

## Q1 — which skills are runnable? **None today.**

Surveyed every file in `src/skills/bundle.json` (43 files, 505 KB) by fenced-code-block
census + spot reads:

| Family | Code blocks | Verdict |
|---|---|---|
| `stellar-dev/*`, `openzeppelin-stellar/*` | rust / typescript / bash | Build instructions for the **developer's machine** (cargo, wrangler, browser SDKs). Not executable in a no-network JS isolate, and shouldn't be. |
| `lumenloop-api/*` (retired from catalog 2026-07-03) | bash curl + json | Direct-consumer transport docs — the retirement rationale already established gateway callers cannot perform these. |
| `lumenloop/*` playbooks, `stellar-light/stellar-scout` | plain-text templates | Multi-pass **LLM methodologies** (dossier 7-step, digest 6-pass): steps like "assess", "synthesize", "position against" require model judgment between calls. They are prompts, not programs — a JS `skill.run` cannot execute them, and the model already executes them via `skill.read` + its own `execute` scripts. |

Zero files contain a parameterized `async (input) => {...}` procedure over the service
globals — the form PLAN §3 line 146 defines as the runnable unit.

## Q2 — input/output contract (defined now, dormant until needed)

When a runnable candidate exists it enters the catalog as **data**, per CLAUDE.md rules:

- New entry kind `snippet` (mirrors upstream codemode's `kind: "snippet"` in
  `codemode.search` results). `transport: { type: "snippet", path }` pointing into the
  bundle; body is the parameterized script itself.
- `inputSchema` on the entry, validated host-side exactly like operation args — model
  code never owns the contract.
- Output rides the normal envelope (`{ ok, data } | { ok, error }`) and the same
  model-boundary truncation as any `execute` return.
- `codemode.skill.run(id, input)` = exact-match id resolution (same discipline as
  `skill.read`, including the nearest-id suggestion), then host-side dispatch of the
  stored script through the **identical** provider set the outer script uses.

## Q3 — policy inheritance: automatic by construction

The snippet executes against the same sandbox providers as the calling script, so
every control is enforced at the same choke points it is today: denied ops stay denied
(policy is per-op at dispatch, not per-entry-point), the paid Lumenloop research gate
applies at the adapter, `globalOutbound: null` holds, and any embedded `skill.read`
inherits the fail-closed section posture (62fa42d). No new enforcement surface is
created — this is the main reason the contract above is cheap to hold in reserve.

## Why not build it speculatively

- Upstream codemode's snippets layer is **grown, not authored**: a developer promotes a
  *successful real execution* via `runtime.saveSnippet(name)` (research/codemode.md
  §1.2). Authoring runnable skills top-down inverts that and has no precedent to mirror
  (correctness-over-cost: deviations need conviction or a winning A/B).
- Eval evidence points the other way: the 2026-07-03 rounds show agents compose
  multi-service scripts well; the failures were ergonomics (truncation footers,
  skill.read option typos — both since fixed), not composition. There is no eval case a
  runnable skill would win, and the ship rule is "only with an eval".

## Reopen triggers (todo 806 parks on these)

1. **A promotion candidate appears**: eval transcripts or live sessions show the same
   nontrivial composition being rewritten repeatedly (especially with errors) — that
   script is the first snippet, following upstream's promote-from-real-runs model.
2. **An upstream skill ships an executable procedure**: a mirrored SKILL.md gains a
   parameterized snippet over bare tool names (the mirror sync + description-notes
   review would surface this).
3. Either trigger still ships only with an eval case the snippet should win
   (eval/plan or eval/qa extension).
