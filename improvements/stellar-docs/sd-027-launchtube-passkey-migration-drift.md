---
id: sd-027
service: stellar-docs
status: reported-upstream
discovered: 2026-07-11
evidence:
  - official OpenZeppelin Relayer page says LaunchTube is discontinued and directs users to OpenZeppelin
  - official Guestbook passkeys prerequisites page still instructs users to obtain and configure a LaunchTube JWT
  - archived LaunchTube source and current Zephyr/Mercury sources confirm submission versus indexing are separate roles
  - Solo scratchpad 575 GT-53 primary process 3372 and independent blind process 3378
  - 2026-07-14 combined review request on the green successor PR: https://github.com/stellar/stellar-docs/pull/2367#issuecomment-4971409358
---

## Finding

Current Stellar developer documentation gives incompatible greenfield guidance
for the passkey smart-wallet stack. The OpenZeppelin Relayer page says
LaunchTube is discontinued and replaced for transaction submission, while the
still-published Guestbook prerequisites page requires a LaunchTube JWT without
a legacy or migration warning.

The pages also leave the replacement boundary implicit: OpenZeppelin replaces
LaunchTube's submission/sponsorship role, not Mercury/Zephyr's indexing and
reverse-lookup role. Consumers can therefore follow a legacy credential path
or incorrectly remove the indexer when migrating the submitter.

## Recommendation

Mark the Guestbook LaunchTube path as historical or update it to a maintained
submitter. Add one migration table that separates client-side passkey signing,
transaction submission/fee sponsorship, and indexing/reverse lookup; name the
current maintained option for each role and date any hosted-service status.
Cross-link that table from both the Guestbook and OpenZeppelin Relayer pages.
