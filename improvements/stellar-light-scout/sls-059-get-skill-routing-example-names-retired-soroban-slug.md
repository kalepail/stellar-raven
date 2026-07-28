---
id: sls-059
service: stellar-light-scout
status: reported-upstream
discovered: 2026-07-28
upstreamTitle: Get-one-skill routing example and keywords still name the retired 'soroban' slug
evidence:
  - 2026-07-28 live production scout.getSkill({ name "soroban" }) returned 404 "unknown skill: soroban" (served as a soft-empty miss with a discover-the-slug hint)
  - 2026-07-28 live production scout.listSkills({ source "sdf" }) returned exactly seven SDF skills — agentic-payments, assets, dapp, data, smart-contracts, standards, zk-proofs — with no 'soroban' entry and each row carrying its install command (smart-contracts installs via "npx skills add stellar/smart-contracts"); generatedAt 2026-07-28T20:52:37Z
  - inventory/stellar-light.json (synced upstream OpenAPI): the get-one-skill operation carries three exact-slug 'soroban' references — x-routing exampleQuestions "How do I install the soroban skill?", x-routing keyword "soroban skill", and the path-parameter description "Skill slug (e.g. 'soroban', ...)"
  - filed upstream 2026-07-28: https://github.com/Stellar-Light/stellarlight/issues/746
  - 2026-07-28 adversarial review (ADV-4) tightened this finding's scope before filing: exact-slug references separated from topical 'Soroban' vocabulary, and the successor claim softened to what the probes established
  - discovered during the 2026-07-28 consistency-register clustering pass (Solo todo 1253 Lane B observation, promoted via todo 1256); the eval corpus itself was corrected the same day (q-gap-scout-list-skill-directory now date-scopes the retired slug)
  - upstream issue filed 2026-07-28: https://github.com/Stellar-Light/stellarlight/issues/746
---

## Finding

The Scout OpenAPI's get-one-skill operation still advertises the retired
`soroban` skill slug in three places: the `x-routing` `exampleQuestions`
include "How do I install the soroban skill?", the `x-routing` `keywords`
include "soroban skill", and the path-parameter description offers `soroban`
as its leading slug example ("Skill slug (e.g. 'soroban', …)"). Calling the
operation with that exact name fails: `getSkill({ name: "soroban" })` returns
404 "unknown skill: soroban". The current SDF skill roster has seven entries
with no `soroban` slug; the roster covers the topic via the `smart-contracts`
slug (install `npx skills add stellar/smart-contracts`). Whether
`smart-contracts` is a formal rename of `soroban` was not separately
established — what the probes establish is that the advertised slug is gone
and the topic's current slug is different.

`x-routing` metadata is routing-load-bearing text: consumers (including this
MCP's catalog scorer and any agent reading the spec) use the example questions
and keywords to decide when to call the operation. An example that names a slug
the operation itself rejects steers a caller directly into a miss on the
operation's own showcase question.

## Evidence

All probes are free production operations observed 2026-07-28.

```js
await scout.getSkill({ name: "soroban" });
// → 404 "unknown skill: soroban" (soft-empty miss)
await scout.listSkills({ source: "sdf" });
// → 7 skills: agentic-payments, assets, dapp, data, smart-contracts,
//   standards, zk-proofs — no 'soroban'; generatedAt 2026-07-28T20:52:37Z
```

The stale references live on the get-one-skill operation in the upstream spec
(mirrored verbatim in this repo's synced `inventory/stellar-light.json`):
`x-routing.exampleQuestions[1] = "How do I install the soroban skill?"`,
`x-routing.keywords` containing `"soroban skill"`, and the path parameter's
`description` beginning "Skill slug (e.g. 'soroban', …)".

Prevalence: three exact-slug references to the retired `soroban` slug, all on
this one operation. The list-skills operation's `useWhen` line ("is there a
skill for soroban / anchors / payments") uses Soroban as topical vocabulary
alongside other topics rather than as an exact slug, and is not counted. The
current `smart-contracts` slug appears nowhere in the operation's routing
metadata or examples.

## Recommendation

Update all three references on the get-one-skill operation: replace the
example question with one that names a current slug (e.g. "How do I install
the smart-contracts skill?"), swap the `"soroban skill"` keyword for
`"smart-contracts skill"` (or drop it), and change the path-parameter
description's leading example to a current slug. More durably, consider
generating the example slugs from the live skill roster at spec-publish time
so a future slug retirement cannot leave the spec pointing at a 404 again.

Consumer-side note: the operation's own 404 behavior is good (this repo serves
it as a soft-empty with a discover-the-slug hint), so the cost is a wasted
round-trip plus routing-signal pollution, not a hard failure.
