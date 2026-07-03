# Phase-2 answering brief (per-category Solo/sub-agent)

The answering arm turns each `status: draft` question into `status: answered`: a cited **reference
dossier** (the gospel answer) + a **finalized weighted rubric**. Independent of Phase-1 craft reasoning
— re-derive the answer from evidence. One agent owns one category (big categories are split).

## What "answered" means — fill these per question file

Keep all existing Phase-1 frontmatter; then **finalize**:
- `must_have` / `should_have` / `nice_to_have` — the real, verified claims, each weighted 1-5 (5 =
  defining, answer is wrong without it). Promote/demote the Phase-1 seeds against what you verify.
- `must_avoid` — the real traps (the verified-wrong answers), weighted.
- `must_cite` — the citation requirement(s) (e.g. "a primary developers.stellar.org page", "the SEP
  spec", "a dated source for the figure").
- `sources` — 1-4 REAL URLs you actually verified the answer against (primary first).
- `status: answered`, `authored.phase2: 2026-06-22`, `confidence` (high/medium/low — low/medium for
  freshness/contested facts, with a `notes` caveat).
- The markdown BODY: fill **## Reference answer (gospel)** — concise, fully-cited, evidence-shaped
  (claims + sources), NOT an essay; **## Why these cards**; **## Edge / traps**. This is what a human
  auditor checks the rubric against.

## Evidence order (re-derive; don't just trust the Phase-1 seed)

1. **Your category dossier** `research/golden/_dossiers/<category>.md` — the deep-research base (it
   already contains canonical answers + sources for many questions). Primary starting point.
2. **Targeted live verification** for any fact that is freshness-sensitive, contested, or you're unsure
   of:
   - **Stellar primary docs / SEP / CAP** — `WebFetch` developers.stellar.org pages and the
     stellar/stellar-protocol repo; or `perplexity_search` / `parallel_search` (load via
     `ToolSearch select:WebFetch,mcp__perplexity__perplexity_search,mcp__parallel-search__web_search_preview`).
   - **Stellar Light "Scout" (keyless)** — `curl -s 'https://stellarlight.xyz/api/research?q=...&limit=5'`
     (also `/api/projects/search`, `/api/repos/search`, `/api/builders`, `/api/rfps`). Cross-check
     ecosystem/project/SCF facts here — this is also literally what Raven's tools return.
   - **GitHub** (`ToolSearch select:mcp__github__get_file_contents,mcp__github__search_code`) for repo/SEP/CAP confirmation.
3. **Contested facts** (e.g. protocol activation dates, draft SEP numbers, incident $ figures): resolve
   against the PRIMARY source. If sources genuinely disagree or it's future/uncertain, DO NOT gate on a
   single number — gate the rubric on the durable part (protocol version + CAP id + "cite a dated
   primary source") and record the disagreement in `notes`. Honesty > false precision.

Known contested items to resolve (see `_meta/PLAN.md` "Known issues" + `_prior-art/_adopt-spec.md`):
Soroban/P20 + P23/Whisk activation dates; BN254/Poseidon CAP-0074/0075 vs P25; SEP-55/58 (build
verification) numbers+status; the YieldBlox/Reflector incident figures; the x402 wallet/facilitator
surface; CCTP-on-Stellar date; XLM circulating supply; per-project SCF amounts/slugs.

## Rules
- Cite PRIMARY sources (developers.stellar.org, the SEP/CAP repos, stellar.org, communityfund.stellar.org,
  the project's own site/repo); use reputable dated news only for news/partnership/incident facts.
- For `should_fire: false` / governance / edge cases: the "answer" is the correct *behavior* (decline /
  scope / flag), not a factual essay — keep the rubric about the gate.
- Keep reference bodies TIGHT (Raven returns evidence, not prose). One source per non-obvious claim.
- Do NOT git commit. Report a summary + any fact you could not verify (for the adversarial pass).
</content>
