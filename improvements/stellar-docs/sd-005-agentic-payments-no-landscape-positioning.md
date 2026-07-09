---
id: sd-005
service: stellar-docs
status: reported-upstream
discovered: 2026-07-06
evidence:
  - eval/qa/results/2026-07-06T18-48-22-variantA.json (q-defi-agentic-payment-standards-compare, partial — verdict stands)
  - verdict-review workflow wf_01b3347d-1b8 (triage: upstream-data-gap; the answering agent's retrieval was exhaustive and correct)
  - live verification 2026-07-06: get_doc_page_sections full-content read, Algolia term probes, full read of the agentic-payments skill, lumenloop title/summary probes — all zero AP2/ACP content
  - Solo project 49, todo 846
  - upstream issue filed 2026-07-07: https://github.com/stellar/stellar-docs/issues/2565
recurrences:
  - date: 2026-07-09
    evidence: targeted QA smoke `eval/qa/results/2026-07-09T14-51-15-variantA.json` case `q-defi-agentic-payment-standards-compare` still could not ground AP2/ACP/Agentic Commerce Protocol from the catalog; direct Algolia probes for `AP2 Agent Payments Protocol` and `Agentic Commerce Protocol ACP` still return x402/MPP substring artifacts or unrelated passkeys/SCP noise, not AP2/ACP landscape content
---

## Finding

The docs' agentic-payments coverage documents x402 and MPP mechanics in depth
but contains **zero positioning against the wider agent-payments landscape**
(Google's AP2, the Agentic Commerce Protocol). "How do Stellar's x402/MPP
relate to AP2/ACP?" is the natural comparison question the docs invite by
covering the mechanics — and a corpus-grounded agent must punt on it, because
the answer exists nowhere in the corpus: not in the docs page, not in the
Algolia index, not in the bundled agentic-payments skill, and not in any
lumenloop title or summary. In the 2026-07-06 QA round the answering agent
did exhaustive, correct retrieval across all of those surfaces and could only
report "not indexed"; the golden's landscape keyFact (AP2/ACP are
general/coordination-layer standards, not Stellar settlement) was
unreachable from grounded sources, and the partial verdict stands as a
measurement of the corpus, not the agent.

## Evidence

All probes live on production, 2026-07-06, reproducible verbatim:

- `stellarDocs.get_doc_page_sections("/docs/build/agentic-payments",
  includeContent)` — 2,798 chars total, 0 matches for "AP2" / "Agentic
  Commerce" / "coordination".
- Algolia `search_docs("AP2 Agent Payments Protocol")` — 5 hits, all
  substring artifacts (Algolia bolds "AP" inside "APIs" on the x402/MPP
  pages); `"Agentic Commerce Protocol ACP"` — noise hits only (passkeys, SCP
  glossary).
- Full read of `skills.stellar-dev.agentic-payments` — 28,563 chars, 0
  matches for AP2 / ACP / "Agentic Commerce" / "Agent Payments Protocol" /
  Google / Visa.
- Lumenloop title/URL probes for "AP2" / "agentic commerce" / "agent payments
  protocol" across articles/research/av/events/proposals — 0 hits; the top
  semantic candidates (articles 5934, 3015, 7050, 2596) have 1.3–1.6k-char
  summaries with 0 mentions.

QA case q-defi-agentic-payment-standards-compare in the 2026-07-06 stamp;
review triage in workflow wf_01b3347d-1b8.

Recurrence 2026-07-09: targeted QA smoke
`eval/qa/results/2026-07-09T14-51-15-variantA.json` again left
`q-defi-agentic-payment-standards-compare` ungrounded for AP2/ACP. Direct
Algolia probes still show no useful AP2/ACP landscape content: `AP2 Agent
Payments Protocol` returns the agentic-payments/x402/MPP pages via generic
payment/protocol terms, while `Agentic Commerce Protocol ACP` returns
unrelated passkeys/SCP/glossary-style noise.

## Recommendation

Cheapest fix: a short "x402/MPP vs the broader agent-payments landscape"
subsection on the agentic-payments overview page — three sentences suffice:
AP2 (Google) is a coordination/mandate layer that can route settlement
through x402 rails; ACP is a general agent-commerce protocol; x402/MPP are
the Stellar-settled pair. That one subsection converts an unanswerable
comparison into an indexed answer. Secondary (lumenloop, noted here since the
gap spans both corpora): no article or research summary mentions AP2 or ACP —
a landscape explainer would fill the same hole on the editorial side.
Consumer-side workaround: none from grounded retrieval; an agent can state
the general characterization from parametric knowledge without fabricating,
but corpus-faithful agents will keep punting until the docs say it.
