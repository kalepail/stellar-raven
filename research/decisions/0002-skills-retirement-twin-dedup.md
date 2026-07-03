# ADR-0002: Retire the Lumenloop API-onboarding skills and de-dup the `lumenloop.skill.*` metadata twins

- Status: accepted (2026-07-03)
- Decision rule (user): the catalog exposes only surfaces that are correct *in this deployment* —
  a skill or entry that is redundant, unreadable, or actively misleading inside the sandbox is
  removed from exposure as **data in the manifest** (CLAUDE.md deny-list rule), never by prose or
  by code that inspects queries.

## Context

Two structural defects had accumulated in the generated catalog by 2026-07-02:

1. **Transport-onboarding skills leaked into a transport-less sandbox.** The mirrored Lumenloop
   `lumenloop-api` skill family (`connect`, `keys`, `billing`, `integrate`, `query`, `research`)
   plus `lumenloop-mcp-connect` teach *raw HTTP/REST access*: Bearer `llmcp_` auth, key
   minting/rotation, rate limits, the REST response envelope, connector installs. Inside
   `execute` a model reaches Lumenloop only through the wrapped `lumenloop.*` sandbox globals —
   no network, secrets stay host-side, and the result shape is the `{ ok, data }` envelope, not
   the REST shape those skills describe. The onboarding family was therefore both **redundant**
   (the wrapped ops already cover the capability) and **actively misleading** (it steers agents
   toward key management and `fetch()` the sandbox forbids). Evidence and the audience split are
   recorded in `improvements/skills/sk-005-onboarding-skills-audience-metadata.md`.

2. **Every Lumenloop-served skill was double-listed in search.** The Lumenloop API serves 14
   skills of its own; the catalog carried them as `lumenloop.skill.*` entries (metadata-only,
   `transport: null`) *in addition to* the canonical `skills.*` mirror entries that hold the real
   bodies. `src/skills/store.ts` already resolves a `lumenloop.skill.X` read straight to the
   `skills.*` body by exact terminal-name alias, so the metadata twin was never the read target —
   it only ever appeared as a second, unreadable hit in `search`, wasting a result slot (and
   often ranking the unreadable form first).

The driver was Solo todo 825 (2026-07-03).

## Decision

Both fixes are **deny-list-as-data**, applied by `scripts/build-catalog.mjs` (≈ lines 188–249):

1. **Retire the 7 onboarding skills from exposure.** `RETIRED_ONBOARDING_SKILLS` names them by
   upstream skill name; `mirrorSkillPolicy` deny-lists the matching `skills.*` mirror entries with
   `RETIRED_SKILL_DENY_REASON`. Bodies stay in the `ecosystem-skills/` mirror as the harvest
   source for operation-description enrichment — retired from *exposure*, not deleted.
2. **De-dup all 14 `lumenloop.skill.*` twins.** `lumenloopInventorySkillPolicy` deny-lists every
   inventory-side twin: the 7 that alias a retired onboarding skill carry the retirement reason,
   the 7 that alias a surviving playbook carry `DEDUP_SKILL_DENY_REASON`. The `store.ts` alias
   stays as back-compat read resolution — the collapse is a *search* de-dup, not a read change.
3. **Rename-guard the retirement.** The deny-list is pinned to upstream skill *names*, so an
   `ecosystem-skills` re-sync that renamed or removed a retired skill would silently un-retire it.
   `assertRetirementNamesResolve` fails the build loudly if any `RETIRED_ONBOARDING_SKILLS` name
   no longer resolves in the synced mirror, forcing a human to reconcile the deny-list.

The super spec (`build-super-spec.mjs`) copies `x-policy` from the manifest rather than
re-deriving it, so its skill index is policy-filtered by the same source of truth.

## Consequences

Catalog counts moved (before → after):

| Measure | Before (2026-07-02) | After (2026-07-03) |
|---|---|---|
| Total searchable entries | 374 | **299** |
| Exposed (readable) skills | 25 | **18** |
| Skill `##` sections | 278 | **203** |
| Denied entries | 4 | **25** |

- The 25 denied entries are **4 denied operations** (`lumenloop.request_research`,
  `scout.submitFeedback`, `scout.submitPartnerListing`, `scout.partnerAssistant`) **+ 7 retired
  mirror skills** (`skills.*`) **+ 14 deny-listed `lumenloop.skill.*` twins**.
- The 75-entry total drop (374 → 299) is entirely the retired skills' **sections**: the 7 retired
  skills' `##`-section entries are no longer emitted (278 → 203), while their skill-kind entries
  remain in the manifest as denied (see-but-not-call in `codemode.catalog()`).
- `search` never returns denied entries (`policy.allow === false` filtered before scoring), so the
  search-time skill-twin suppression branch that previously lived in `src/catalog/search.ts`
  became unreachable and was removed — twins are now handled purely by the build-time deny-list.
- Reads are unaffected: a retired skill's body is still in the bundle, and the `lumenloop.skill.*`
  alias still resolves — only *exposure in search* changed.

## Revisit triggers

- An upstream skill source adds a machine-readable audience/transport marker (sk-005's
  recommendation) — the content-derived split could then be replaced by a mechanical filter.
- A retired onboarding skill is rewritten upstream to be transport-agnostic — re-expose it.
- The routing/skills-lane gates (`eval/gates.json`, re-baselined this round — skills lane
  31 → 23 cases, 8 onboarding cases moved to `retiredCases`) move materially.
