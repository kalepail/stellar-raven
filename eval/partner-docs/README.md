# Partner-doc retrieval diagnostic

This todo-910 lane measures whether a fixed, code-allowlisted set of public partner Markdown
pages contains facts that Raven's current sources do not retrieve on the same question. It is a
diagnostic source-admission instrument, not the headline QA eval and not a production routing map.

Run against the existing Solo-managed local Raven process:

```sh
npm run eval:partner-docs -- --raven-url http://localhost:8787/mcp
```

The harness makes only read-only GETs to URLs declared in `cases.json`. Code-owned validation
restricts Alchemy to `https://www.alchemy.com/docs/**/*.md` or admitted `llms.txt` files and
OpenZeppelin to MDX below the `OpenZeppelin/docs` Stellar/Relayer content roots. Redirect targets,
content type, UTF-8 decoding, and a 256 KiB per-document cap are enforced. It never connects to a
partner MCP server and never calls an API described by the fetched documentation.

Measured OpenZeppelin case URLs are commit-pinned; each result records `resolvedCommit` alongside
the body SHA-256. Any Raven baseline error makes the retrieval gate `inconclusive` rather than
silently shrinking the comparison denominator.

## 2026-07-10 baseline

Canonical diagnostic run: `2026-07-10T03:15:21.411Z`, local Raven at `7cf6213`, eight cases / 64
fact groups. Current-Raven arm used one fixed relevant operation or mirrored skill per case;
candidate arm fetched one admitted first-party Markdown/MDX page. Both arms were scored with the
same literal fact-group matcher.

| Case | Current Raven | Candidate docs |
| --- | ---: | ---: |
| `alchemy-stellar-data-overview` | 0/8 | 8/8 |
| `alchemy-stellar-transfers` | 1/8 | 8/8 |
| `alchemy-stellar-balances` | 0/8 | 7/8 |
| `alchemy-stellar-rpc-quickstart` | 5/8 | 8/8 |
| `openzeppelin-stellar-suite` | 1/8 | 8/8 |
| `openzeppelin-smart-account` | 0/8 | 8/8 |
| `openzeppelin-stellar-rwa` | 0/8 | 8/8 |
| `openzeppelin-stellar-relayer` | 0/8 | 8/8 |
| **Total** | **7/64 (10.9%)** | **63/64 (98.4%)** |

Candidate fetches had zero errors, redirects outside the allowlist, prompt-signal matches, or
content-type violations. Median document fetch was 46.0 ms and p95 was 172.4 ms in this single
local run. The retrieval-admission threshold passed (+87.5 percentage points, eight wins, zero
regressions).

This is deliberately not a ship result. The cases were derived from the candidate pages, Raven's
arm did not get an answering agent or multi-query recovery, one run does not establish reliability,
and the narrow prompt-signal scanner is not a security proof. The paired end-to-end QA, resilience,
drift, and security gates in `research/partner-doc-source-onboarding.md` remain unrun, so the harness
reports `headlineQaGate: not-run` and `shipDecision: do-not-ship-runtime-adapter`.
