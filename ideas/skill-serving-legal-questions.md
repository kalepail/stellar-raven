# Open legal questions on serving third-party skills

_Status: OPEN, raised 2026-07-30 by adversarial review of the pinned-fetch change. These are
questions for counsel, not engineering decisions, and nothing in this repository should be read as
answering them. `THIRD-PARTY-NOTICES.md` states mechanism only and points here._

## Why this exists

Legal asked that third-party skill files not be copied into this repository. That ask was
implemented (bodies are no longer vendored or bundled; the repo commits pinned addresses and
digests, and the Worker fetches at read time). Independent review then argued the implementation
answers a narrower question than the one that actually matters, and that the original notices
asserted a conclusion the code contradicted. The notices were corrected; the questions remain.

## The facts counsel should reason from

Verifiable in this repo, no interpretation:

1. This Worker fetches each skill file from `raw.githubusercontent.com` at a pinned commit and
   returns its content to the caller. Delivery to the end user is performed by this service.
2. The returned bytes are **modified** before delivery: `scrubRetiredSkillRefs` deletes markdown
   list items (currently affecting 8 of 30 served files), frontmatter is stripped from whole
   reads, and section reads return excerpts.
3. Transient copies are held: a gitignored build cache, the Cloudflare colo Cache API, and an
   in-isolate memo. Nothing is committed or published.
4. No license text is attached to API responses. This was equally true when bodies were vendored.
5. Sources and licenses: lumenloop MIT, stellar-dev Apache-2.0, stellar-light MIT,
   **openzeppelin-stellar AGPL-3.0**.

## The questions

1. **Is fetch-and-serve materially different from vendoring?** If runtime delivery is conveyance,
   the change reduced repository exposure without changing distribution posture. Was reducing the
   repository copy the actual ask, or a proxy for something else?
2. **What exactly did legal want?** Three very different asks were never disambiguated:
   (a) nothing third-party in git; (b) AGPL specifically; (c) any redistribution is fine with
   notices. The smallest design differs sharply per answer — (c) would have permitted simply
   re-vendoring MIT/Apache sources with their `LICENSE` files, which is what the repo did before.
3. **AGPL-3.0 / OpenZeppelin.** Given facts 1–4, do AGPL obligations attach to serving these three
   skills through a network service, and does the scrub constitute modification for that purpose?
   If yes, options are: drop OpenZeppelin from the served surface, obtain a grant or dual license,
   or serve with a counsel-approved compliance pack (notice + source offer).
4. **Should license text ride with served content?** Cheap to add (a `license` field on catalog
   entries, or a notice appended to `skill.read` results). Not done, because doing it implies a
   conclusion about obligation that counsel has not given.

## Engineering options already scoped

- Drop `openzeppelin-stellar` from the catalog serve surface (3 of 18 skills; routing impact
  measurable via the skills lane).
- Attach license metadata/notice to `skill.read` responses.
- Re-vendor MIT/Apache sources with their `LICENSE` files and keep live fetch only where a license
  makes vendoring awkward.
- Move the served bytes to owned durable storage (R2) instead of depending on `raw.githubusercontent.com`
  (also the fix for the availability regression — see `ARCHITECTURE.md` §6).

## Sources

- Adversarial review 2026-07-30: Solo todos 1275 (Sol), 1276 (Grok), 1277 (Kimi/author),
  1278 (Fable); scratchpad `skills-live-fetch-ad--741`.
- `THIRD-PARTY-NOTICES.md` — the mechanism statement these questions hang off.
