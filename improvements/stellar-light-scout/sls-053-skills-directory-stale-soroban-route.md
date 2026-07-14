---
id: sls-053
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-12
evidence:
  - live re-check 2026-07-14: /api/skills exposes smart-contracts and no legacy soroban entry; resolving PR https://github.com/Stellar-Light/stellarlight/pull/508
  - live check 2026-07-12 (coverage review, solo://proj/49/scratchpad/first-principles-sta--607): GET https://stellarlight.xyz/api/skills (30 entries) carries a `soroban` skill-md entry, and https://skills.stellar.org/skills/soroban/SKILL.md serves a full legacy skill (frontmatter `name: soroban`, ~200-page scope)
  - the authoritative site source (stellar/stellar-dev-skill, site/src/data/skills.ts) contains zero references to `skills/soroban/` — its SKILL_CARD_SOURCES list the successor `smart-contracts` card instead; https://skills.stellar.org/llms.txt likewise lists smart-contracts and not soroban
  - the directory does NOT list `smart-contracts` (verified in the same live fetch), so the directory's only smart-contract skill pointer is the superseded one
  - live re-check 2026-07-13: https://stellarlight.xyz/api/skills lists smart-contracts and no soroban entry, so the stale directory route no longer reproduces
---

## Finding

The Scout ecosystem-skills directory (`GET /api/skills`) still advertises the
legacy `soroban` skill, which stellar-dev-skill has superseded with the
`smart-contracts` skill: the current site data and llms.txt no longer
reference `skills/soroban/` at all, yet its URL still serves the old content
and the directory still routes consumers to it. Meanwhile the successor
`smart-contracts` skill is absent from the directory. Any consumer that
trusts the directory (this gateway snapshots it as its "what exists in the
ecosystem" map) is steered to a frozen, unmaintained variant of the
ecosystem's most important skill while the maintained one is invisible.

## Evidence

Reproducible live: fetch `https://stellarlight.xyz/api/skills` and observe
the `soroban` slug with no `smart-contracts` sibling; fetch
`https://skills.stellar.org/skills/soroban/SKILL.md` (still 200) and compare
against `site/src/data/skills.ts` in stellar/stellar-dev-skill, which lists
`skills/smart-contracts/SKILL.md` and never `skills/soroban/`.

## Recommendation

Repoint or retire the `soroban` directory entry: either replace it with a
`smart-contracts` entry sourced from the current stellar-dev-skill card, or
remove it and add the successor. Consider whether skills.stellar.org should
also stop serving the orphaned `/skills/soroban/SKILL.md` route (or redirect
it) so stale deep links converge on the maintained skill.
