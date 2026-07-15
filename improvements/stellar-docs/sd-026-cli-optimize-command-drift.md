---
id: sd-026
service: stellar-docs
status: reported-upstream
discovered: 2026-07-11
upstreamTitle: Replace the deprecated stellar contract optimize workflow
evidence:
  - current documentation still demonstrates standalone stellar contract optimize
  - standalone optimize deprecation shipped in Stellar CLI v23.2.0 and remains present in CLI 27
  - contract build optimization is enabled by default; --optimize is redundant and --optimize=false disables it
  - Solo scratchpad 575 GT-48 primary 3333 and blind 3342
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2601
  - independent Docs-team audit 2026-07-14 verified hello-world.mdx still claims a 64KB maximum while live Mainnet contract_max_size_bytes is 131072 (128KB): https://gist.githubusercontent.com/ElliotFriend/3b3641b929b4408a834b85bcb4e75449/raw/a90e6b453ee3505ef2525b4428eaa75752e3ae08/raven-audit-rebuttal.md
---

## Finding

Current contract-build documentation still presents the standalone optimize
command as an active workflow even though CLI v23.2.0 deprecated it and current CLI performs
optimization during contract build by default.

## Recommendation

Teach default-on build optimization, document the explicit disable flag, and
remove or clearly label standalone contract optimize as deprecated. Keep code
size guidance tied to the target network's live contract_max_size_bytes rather
than the page's stale 64KB value; Mainnet reported 128KB during the 2026-07-14
audit.
