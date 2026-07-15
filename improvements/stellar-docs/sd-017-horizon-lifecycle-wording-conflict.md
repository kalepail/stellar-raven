---
id: sd-017
service: stellar-docs
status: reported-upstream
discovered: 2026-07-10
upstreamTitle: Align Horizon lifecycle and deprecation wording
evidence:
  - APIs Overview and Stellar Lab surfaces describe Horizon as considered deprecated
  - Stellar Stack and the 2026 policy correction describe Horizon as nearing EOL/not yet deprecated
  - current Horizon endpoints remain operational and some have no direct RPC equivalent
  - Solo scratchpad 575 GT-32 primary 3281 and independent blind 3284
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2592
  - independent Docs-team audit 2026-07-14 found the most visible contradiction at docs/README.mdx, whose landing-page summary calls Horizon deprecated in the present tense: https://gist.githubusercontent.com/ElliotFriend/3b3641b929b4408a834b85bcb4e75449/raw/a90e6b453ee3505ef2525b4428eaa75752e3ae08/raven-audit-rebuttal.md
---

## Finding

Official Docs publish incompatible lifecycle labels for Horizon. Some surfaces
call it deprecated, while newer policy/stack material explicitly says it is not
yet deprecated and remains maintained in a legacy/no-new-features role. This
forces clients and evaluators to choose a polarity that another official page
then marks wrong. The contradiction includes the repository's docs landing page,
not only API and Lab pages.

## Recommendation

Publish one canonical Horizon lifecycle sentence and reuse it across the API
overview, stack, migration guide, Lab, and endpoint pages. Separately state the
durable behavior: Horizon remains available for parsed/curated resources and
historical/account-oriented endpoints; Stellar RPC is the forward live/current
state and smart-contract interface but is not a drop-in replacement. Date any
EOL/deprecation milestone and name endpoints without direct equivalents.
