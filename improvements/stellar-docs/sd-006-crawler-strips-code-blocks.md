---
id: sd-006
service: stellar-docs
status: reported-upstream
discovered: 2026-07-06
evidence:
  - eval/qa/results/2026-07-06T18-48-22-variantA.json (q-tool-cli-install, partial — verdict stands, mixed root cause)
  - verdict-review workflow wf_01b3347d-1b8 (triage: the code-block gap is the upstream share of a mixed verdict)
  - live verification 2026-07-06: index-record probe of /docs/tools/cli/install-cli plus regex sweep of the full index for install command strings
  - Solo project 49, todo 846
  - upstream issue filed 2026-07-07: https://github.com/stellar/stellar-docs/issues/2569
---

## Finding

The Algolia crawler for developers.stellar.org **strips code blocks**, so the
index carries the prose around commands but never the commands. The flagship
case: `/docs/tools/cli/install-cli` indexes as a single 720-char prose record
whose install methods are bare tab labels — "Install with Homebrew (macOS,
Linux, WSL):" with **nothing after the colon** — because each tab's content is
a code block the crawler dropped. It is not just this page's record being
thin: no record anywhere in the index contains any actual install command
(brew/cargo/winget/install-script). The consequence is categorical — any
consumer of the docs search index cannot answer "how do I install the Stellar
CLI", the canonical first question of every new developer, with real
commands. In the 2026-07-06 QA round the answering agent quoted the indexed
prose honestly and was graded partial; the commands were unretrievable from
the surface it searched.

## Evidence

Live probes on production, 2026-07-06, reproducible by querying the index for
the install-cli page and regex-checking the records:

- The page's one indexed content record (720 chars): "Install with script
  (macOS, Linux, WSL):\r\nInstall with Homebrew (macOS, Linux, WSL):\r\n
  Install with winget (Windows):\r\nInstall with cargo from source..." —
  regex checks on it: hasBrewCmd:false, hasCargoCmd:false, hasApt:false,
  hasAUR:false, hasDocker:false, hasSoroban:false.
- Index-wide: zero docs records contain `brew install stellar-cli` or
  `cargo install --locked stellar-cli`.
- Counterpoint proving the commands exist and are gateway-reachable
  elsewhere: raven `search("install stellar CLI setup")` ranks
  `skills.openzeppelin-stellar.setup-stellar-contracts` #1 (score 271), whose
  soroban-stellar-development-setup section contains the verbatim
  `curl -fsSL https://github.com/stellar/stellar-cli/raw/main/install.sh | sh`.

QA case q-tool-cli-install in the 2026-07-06 stamp; review triage in workflow
wf_01b3347d-1b8.

## Recommendation

Cheapest fix: configure the Docusaurus crawler to index code-block text —
add `code`/`pre` to the crawler's `recordProps`/content selectors — at least
on setup/install pages, where the code blocks ARE the content. Alternative if
crawler config is off-limits: duplicate the commands inline in prose on those
pages (one sentence per tab: "run `brew install stellar-cli`"), which also
helps human skimmers. Consumer-side workaround: skill-reading consumers can
recover — the bundled openzeppelin-stellar setup skill carries the verbatim
install-script command and this gateway already ranks it #1 for the install
query — but docs-index-only consumers have no workaround at all.
