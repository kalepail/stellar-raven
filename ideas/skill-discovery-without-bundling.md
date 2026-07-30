# Skill discovery without a bundled skill corpus

_Status: PARTIALLY RESOLVED 2026-07-30 — see "What actually shipped" below. The remaining open
questions (metadata-only discovery, dropping section entries, live upstream directories as the
source of admission) are still open exploration, not a product decision._

## What actually shipped (2026-07-30)

Legal asked that upstream skill files not be copied into this repository. The change that
answered it took the **content-ownership** half of this document and left the **discovery** half
untouched:

- `ecosystem-skills/skills/**` (604 KiB) and `src/skills/bundle.json` (380 KiB) are gone.
  `ecosystem-skills/MANIFEST.json` — commit SHA per source, git blob hash per file — is now the
  whole artifact.
- `codemode.skill.read` fetches each file from `raw.githubusercontent.com` at the pinned commit
  and verifies it against the pinned blob hash before serving (`src/skills/source.ts`), behind an
  in-isolate memo and the colo Cache API. The builders use the same pins and the same check.
- Section entries were NOT dropped: they lost their body excerpts and body-derived keywords
  (heading + pinned address only, −155 KiB of catalog) but remain exact-readable. The searchable
  projection is byte-identical to before, so routing did not move — this was explicitly not a
  discovery experiment.
- Commit-pinning, not HEAD-following, is what keeps this safe: an upstream edit still cannot reach
  the model until a human re-pins and reads the diff.

What this did NOT settle: whether Raven should own skill metadata at all (M1/M2 below), whether
204 section entries earn their place, or whether upstream directories should drive admission.
Those remain measurable, and the machinery to test them is now smaller.

## Question

Should Stellar Raven own, pin, clone, section, index, bundle, and serve Stellar skill content at
all? Or should Raven expose the ecosystem's skill directories and load selected instructions from
their official or maintainer-owned sources only when an agent needs them?

Current hypothesis: **skill discovery belongs in Raven more clearly than skill ownership does**.
Raven may only need to own normalized metadata, source authority, admission policy, and
provenance. Upstream maintainers can own the bytes.

This is deliberately narrower than “remove skills.” Four separate questions have been conflated:

1. Should Raven help agents discover relevant skills?
2. Should Raven load skill instructions into an `execute` run on demand?
3. Should Raven store and index copies of those instructions?
4. Should Raven execute workflows derived from skills?

Existing evidence supports (1), gives partial support to (2), does not establish (3), and treats
(4) as a separate first-party runner decision.

## Why revisit this now

Raven currently mirrors 19 public skills from four repositories, exposes 18 whole skills, retains
204 exact-readable sections, and bundles 30 Markdown files into the Worker. In the current tree:

- `ecosystem-skills/` occupies about 588 KiB;
- `src/skills/bundle.json` is 380,016 bytes;
- `catalog/manifest.json` is 666,114 bytes, with 18 searchable whole-skill entries and 204
  non-searchable section entries.

That machinery buys deterministic builds, reviewed/pinned content, exact section reads, drift
checks, and build-time scrubbing. It also makes Raven a second distributor and lifecycle owner for
content already published by SDF, Stellar Light, Lumenloop, and OpenZeppelin. The mirror's presence
has become easy to mistake for evidence that local ownership is necessary.

Current official surfaces now make a different shape plausible:

- [skills.stellar.org](https://skills.stellar.org/) publishes SDF's seven official skills as direct
  Markdown and provides an agent-readable [llms.txt](https://skills.stellar.org/llms.txt). Its
  source repository says the site and `llms.txt` are generated from the same sibling skill files;
  community entries are links, not copied content
  ([site source](https://github.com/stellar/stellar-dev-skill/tree/main/site)).
- [Stellar Light's skills directory](https://stellarlight.xyz/skills) and
  [`GET /api/skills`](https://stellarlight.xyz/api/skills) provide a broader live catalog covering
  skills, MCP servers, SDKs, a CLI, and tools.
- The [Agent Skills standard](https://agentskills.io/) itself uses progressive disclosure: load
  name and description for discovery, load `SKILL.md` only on activation, then load referenced
  resources only when needed. Its cloud-agent guidance explicitly names APIs, remote registries,
  and bundled assets as alternative locations
  ([client implementation guide](https://agentskills.io/client-implementation/adding-skills-support)).

Raven currently implements progressive disclosure, but only after copying the full corpus into
this repository. The open question is whether Raven can keep the disclosure model while dropping
content ownership.

## Prior work, resurfaced

### Scoped retirement and exposure classification

- Solo todo 825 retired seven Lumenloop transport/onboarding skills that were misleading inside
  Raven's networkless sandbox and removed duplicate `lumenloop.skill.*` search entries. The durable
  rationale is [ADR-0002](../research/decisions/0002-skills-retirement-twin-dedup.md).
- Solo todo 852 reviewed the broader historical inventory rather than assuming every mirrored
  file should ship. It produced
  [the 44-row exposure inventory](../research/skill-exposure-inventory.md) and
  [retired-skill guidance](../research/retired-skill-guidance.md): 18 exposed, two
  internal-guidance, seven removed, seven duplicate source classes, and ten operational/out-of-scope
  classes at that time.
- Solo todo 968 later rejected automatic mirror expansion for several community/vendor skills.
  License, reference-tree, policy, and relevance costs were not justified merely because a skill
  appeared in a directory.

These decisions establish that “available upstream” is not the same as “belongs in Raven.”

### The 2026-07-13 skills-form program

Solo todo 890 (`solo://proj/49/todo/revisit-skills--890`) and archived scratchpad 608
(`solo://proj/49/scratchpad/skills-program-how-r--608`) ran the main skills program. The durable
record is [ADR-0005](../research/decisions/0005-skills-form-sections-out-of-search.md), with results
in [eval/README.md](../eval/README.md#skills-form-ab-2026-07-13-todo-890-sections-leave-search--shipped).

Four search representations were considered:

- A: whole skills plus 204 searchable section cards;
- B: whole skills searchable, sections exact-readable but out of search;
- C: all skills out of search, while exact-ID read/run stayed available;
- D: section vocabulary distilled into whole-skill metadata.

B won and shipped. Paid QA produced 41 correct / 42 partial / 7 wrong for B versus
39 / 42 / 9 for A, with stable wins 3–1. The load-bearing OpenZeppelin case remained correct in
all six observations through whole-skill discovery. C produced a striking offline routing gain
(+30/−1 versus A) but intentionally killed the skills routing lane and was not advanced to paid
answer-quality testing.

This evidence proves:

- 204 independent section search cards were harmful;
- whole-skill metadata can trigger useful instruction reads;
- exact section reads are a useful follow-up shape once content is available.

It does **not** prove that Raven must clone or bundle skill bodies. Every arm held the bundle and
read path constant. Even C removed skills from search only; exact-ID reads/runs and bundled bytes
remained. The “live directory as serving path” arm was excluded because it crossed the existing
ADR-0003 authority boundary and changed transport, freshness, trust, and availability at once. It
was a policy exclusion, not a measured loss against local mirroring.

### Allowlisted live Markdown research

Solo todo 910 explored live first-party Markdown for partner documentation. The result,
[Allowlisted partner documentation as a Raven source](../research/partner-doc-source-onboarding.md),
did not ship a runtime adapter, but it supplies a directly reusable design:

- model chooses a source/page ID, never a URL;
- HTTPS GET/HEAD only against exact origins and path prefixes;
- bounded type, size, redirect, timeout, and retry behavior;
- branch-to-commit resolution and SHA-256 provenance;
- transient cache with explicit freshness/stale state;
- remote text remains data and cannot mutate manifest, auth, endpoints, or policy;
- directory or `llms.txt` link drift opens review; it never expands exposure automatically.

Its diagnostic improved fixed-source fact recall from 7/64 to 63/64 with zero fetch errors and
172.4 ms p95, but correctly stopped before runtime work because paired QA, reliability, and
security gates had not run. This is stronger prior art for remote skill loading than inventing a
new generic fetch mechanism.

## Current source landscape

Evidence below was rechecked live on 2026-07-15.

| Surface | What it currently provides | Authority and limitation |
| --- | --- | --- |
| [skills.stellar.org](https://skills.stellar.org/) | Seven SDF skills, direct `SKILL.md`/companion Markdown URLs, installation instructions, and five community links. | Canonical SDF distribution for its seven official skills. The site explicitly says community skills are independently maintained and not reviewed, endorsed, or warranted by SDF. |
| [skills.stellar.org/llms.txt](https://skills.stellar.org/llms.txt) | Agent-readable metadata and exact Markdown links for the seven official skills, including companion files; links to OpenZeppelin, DeFindex, Soroswap, Trustless Work, and Agent Browser WebAuthn community skills. | Good discovery input. Community links point at mutable maintainer branches and carry different licenses/trust. The index is inventory, not automatic admission. |
| [stellarlight.xyz/skills](https://stellarlight.xyz/skills) | Human marketplace across skills and adjacent agent tools. | Useful ecosystem directory, not canonical authority for every third-party entry. |
| [`GET /api/skills`](https://stellarlight.xyz/api/skills) | At the checked response: 30 entries — 16 `skill-md`, two MCP servers, nine SDKs, one CLI, and two tools; source/install/repository/docs metadata and source/kind filters. | Best existing machine discovery surface. Fifteen of its sixteen `skill-md` entries overlap Raven's exposed SDF/Lumenloop/Scout set; it also exposes long-tail tools Raven deliberately does not mirror. |
| [`GET /api/skills/{name}`](https://stellarlight.xyz/api/skills/smart-contracts) | Metadata plus content for known entries when the directory has a body. Live probes returned 9,000 characters for SDF `smart-contracts` and 26,601 for [`stellar-scout`](https://stellarlight.xyz/api/skills/stellar-scout). | Not a complete universal content loader. [`lumenloop-integration-finder`](https://stellarlight.xyz/api/skills/lumenloop-integration-finder) returned metadata with `content: null`; community skill bodies are not represented as `skill-md` entries there. |
| Maintainer GitHub/raw URLs | Canonical source trees for community and vendor skills, including references/scripts/assets. | Mutable branch URLs are not reproducible. A single raw `SKILL.md` may omit required sibling resources. Source admission and license review remain per maintainer. |

No one directory is complete and authoritative for every skill. Source authority must remain
per-entry:

- SDF bytes: `stellar/stellar-dev-skill` / `skills.stellar.org`;
- Stellar Light bytes: `Stellar-Light/stellar-scout` / its raw skill URL;
- Lumenloop bytes: `lumenloop/lumenloop-skills`;
- OpenZeppelin bytes: `OpenZeppelin/openzeppelin-skills`;
- other community bytes: their named maintainer repositories.

Stellar Light can normalize discovery across them. It should not silently become the authority for
third-party instructions.

## Candidate product shapes

### M0 — Current bundled corpus (control)

Keep the mirror, whole-skill search entries, exact section reads, bundle, drift checks, and
scrubbing. This remains the production baseline until another arm wins.

Strength: deterministic, reviewed, network-independent reads. Cost: duplicate storage and lifecycle
ownership, delayed freshness, a large generated surface, and permanent per-source sync policy.

### M1 — Directory and install/source handoff only

Remove Raven's `skills.*` catalog/read surface. Keep `scout.listSkills` and `scout.getSkill` so an
agent can discover available skills, installation commands, repositories, and whatever content
Scout already returns. Add no new runtime capability.

This is the cheapest falsification arm because Raven already exposes both Scout operations and the
builder can still generate old arm C as a routing precursor. A valid M1 answer-quality arm must go
farther than old C: remove the local read surface and rewrite dangling skill guidance so the model
is not told to call an unavailable `skills.*` ID. It still adds no new runtime capability. It tests
whether Raven's real job is navigation rather than instruction delivery.

Likely ceiling: agents running inside Raven cannot follow an arbitrary source URL because the
Dynamic Worker has no network. Scout currently returns `content: null` for some known skill
entries. M1 may therefore be enough for install/recommendation questions but lose build tasks that
need the actual instructions during the same turn.

### M2 — Metadata catalog plus allowlisted on-demand load

Keep only normalized skill metadata in Raven search. When an agent activates one exact skill,
load its admitted `SKILL.md` or named companion file from the maintainer's official source through
a host-owned read adapter. Do not clone bodies, generate section cards from bodies, or commit a
content bundle.

This most closely matches the Agent Skills progressive-disclosure model. Raven owns the catalog
and safety boundary; maintainers own content.

Minimum contract:

```ts
type SkillSource = {
  id: string;
  authority: "sdf-official" | "maintainer-first-party" | "community";
  discoveryUrl: string;
  files: readonly { id: string; canonicalUrl: string }[];
  allowedOrigins: readonly string[];
  allowedPathPrefixes: readonly string[];
  licenseOrTermsReviewedAt: string;
};
```

The model calls an exact skill/file ID, never supplies a URL. Result includes canonical URL,
resolved commit when available, fetched time, ETag/Last-Modified, SHA-256, authority, and cache
state. Reuse todo 910's fetch/admission rules rather than creating a generic proxy.

Remote Markdown is not inert at the model layer: an activated skill is intentionally meant to
change model behavior. The hard boundary is narrower—remote prose cannot change Raven's manifest,
network destinations, arguments, auth, or host policy. Source admission, provenance, targeted QA,
and conflict handling still carry the risk of incorrect or hostile procedural advice.

V1 should load Markdown only. It should not execute remote scripts, expand arbitrary relative
paths, fetch images/assets, install a skill into a client, or follow new directory links
automatically. Agent Skills folders may contain all of those resources; a Markdown loader is not a
general skill installer and must not claim to be one.

### M3 — Official-live, community-link hybrid

Load bodies only where a reviewed official source already offers stable direct Markdown:

- SDF skills from `skills.stellar.org` or immutable `stellar-dev-skill` commits;
- Stellar Scout from its maintainer source;
- community/vendor skills remain metadata and install/source links until separately admitted.

This reduces trust scope but creates two behaviors. Use only if M2's all-admitted-source design is
blocked by licensing, incomplete resources, or mutable-source reliability.

## Preferred experiment sequence

Stop at first rung that answers the question.

### Phase 0 — Inventory and observed use, no runtime change

1. Generate a current overlap matrix: Raven mirror ↔ Scout directory ↔ SDF `llms.txt` ↔ canonical
   maintainer source. Record which entries have complete content, companion files, licenses, and
   immutable refs.
2. Query privacy-safe production aggregates for `sandbox.skillRead` and `sandbox.skillRun` before
   paying for another large eval. Current telemetry records whether a run read skill content and
   how many runners were invoked, but does not identify every ordinary skill read; decide whether
   aggregate adoption is sufficient before adding fields.
3. Classify existing QA and discovery cases by what they require: discovery metadata, instruction
   body, companion reference, or first-party runner.

### Phase 1 — Reuse existing surfaces

Run current M0 versus M1 with no new adapter:

- current headline QA and routing lanes;
- all direct-skill cases, not only aggregate score;
- discovery cases asking what skill/tool exists and how to install it;
- failure analysis separating “could not discover” from “discovered but body unavailable.”

If M1 is non-inferior, local skill storage has no measured job and can be removed without building
M2. If M1 loses only because bodies are unavailable, proceed.

### Phase 2 — Bounded loader diagnostic

Build a read-only harness, not a production adapter, using todo 910's admitted-source machinery.
Test at minimum:

- one SDF multi-file skill;
- Stellar Scout;
- one Lumenloop skill whose Scout detail currently returns `content: null`;
- OpenZeppelin's load-bearing setup/security case;
- one unadmitted community link that must fail closed;
- branch movement, 404, redirect, oversize, wrong content type, timeout, and injected instruction
  fixtures.

Resolve mutable GitHub refs to commits for measurement. For `skills.stellar.org`, record response
hash plus ETag/Last-Modified and compare the bytes with the canonical repository commit when
possible.

### Phase 3 — Paid paired decision

Advance at most one challenger: M1 if it already carries answer quality, otherwise M2. Compare it
with M0 using counterbalanced paired blocks.

Pre-register these blockers:

- no new wrong answer on any direct-skill/build-safety case;
- no unsupported claim caused by remote instructions;
- no loss of source authority or exact provenance;
- routing and live-data guardrails pass;
- at least 100 source probes over 24 hours meet todo 910's >=99% success and <=1 second p95 target;
- all allowlist, redirect, size, type, hash, cache, prompt-injection, and secret gates pass;
- an independent reviewer verifies that the shipped artifact is the measured artifact.

If answer quality ties, prefer the simpler owned surface. M1 wins a tie over M0 because it deletes
the corpus and adds nothing. M2 wins a tie only if its loader/admission machinery is materially
smaller and easier to operate than the mirror/bundle/drift machinery it replaces.

## Boundary if on-demand loading wins

Raven owns:

- discovery routing and normalized metadata;
- exact source/file IDs and claim-scoped authority;
- admission, allowlists, hashes, cache state, and provenance;
- bounded delivery of admitted Markdown without granting it host authority;
- first-party host runners that independently earn their place.

Upstream maintainers own:

- skill prose and companion references;
- release cadence and source repository;
- install instructions and client compatibility;
- scripts/assets that Raven does not execute.

Raven does not own:

- a cloned skill corpus;
- body-derived section search entries or routing keywords;
- arbitrary URL fetching or recursive `llms.txt` crawling;
- automatic admission of new directory entries;
- execution of remote scripts/assets;
- claims that a directory listing implies endorsement or authority.

## Runnable skills are a separate decision

The current ecosystem-digest runner is reviewed first-party TypeScript over Raven's existing
service operations. Its measured value does not prove that Raven must store the upstream skill
body. Conversely, removing the content bundle does not automatically justify removing the runner.

Keep runner retention as an independent A/B. If the skill namespace disappears, decide later
whether the runner remains under its current exact ID, becomes an ordinary Raven workflow, or is
retired. Do not rename or generalize it as part of the content-source experiment.

## What a winning change could delete

Only after M1 or M2 wins:

- `ecosystem-skills/` bodies and sync/update machinery;
- `src/skills/bundle.json` and bundle generation;
- 204 `skill-section` manifest entries and body-derived keyword extraction;
- mirror-content drift checks and source-specific scrubbing;
- local section parsing/read invariants and super-spec body index;
- documentation that calls the local mirror Raven's canonical serving layer.

Source admission, authority, and provenance checks replace those mechanisms only where required.
This should be a deletion-shaped change. If remote loading adds more policy and maintenance than it
removes, keep M0.

## Sources

Local evidence:

- [ADR-0002: retire onboarding skills and twins](../research/decisions/0002-skills-retirement-twin-dedup.md)
- [ADR-0005: skill sections leave search](../research/decisions/0005-skills-form-sections-out-of-search.md)
- [Skills-form A/B results](../eval/README.md#skills-form-ab-2026-07-13-todo-890-sections-leave-search--shipped)
- [Skill exposure inventory](../research/skill-exposure-inventory.md)
- [Retired skill guidance](../research/retired-skill-guidance.md)
- [Allowlisted partner-document source design](../research/partner-doc-source-onboarding.md)
- Solo todo 890 and archived scratchpad 608

External primary evidence, checked 2026-07-15:

- [Stellar Skills](https://skills.stellar.org/)
- [Stellar Skills llms.txt](https://skills.stellar.org/llms.txt)
- [stellar/stellar-dev-skill](https://github.com/stellar/stellar-dev-skill)
- [skills.stellar.org site source](https://github.com/stellar/stellar-dev-skill/tree/main/site)
- [Stellar “Building with AI” documentation](https://developers.stellar.org/docs/build/building-with-ai)
- [Stellar Light skills marketplace](https://stellarlight.xyz/skills)
- [Stellar Light skills API](https://stellarlight.xyz/api/skills)
- [Stellar Light SDF skill detail](https://stellarlight.xyz/api/skills/smart-contracts)
- [Stellar Light Scout skill detail](https://stellarlight.xyz/api/skills/stellar-scout)
- [Stellar Light Lumenloop metadata-only detail](https://stellarlight.xyz/api/skills/lumenloop-integration-finder)
- [Agent Skills overview](https://agentskills.io/)
- [Agent Skills specification](https://agentskills.io/specification)
- [Agent Skills client implementation guide](https://agentskills.io/client-implementation/adding-skills-support)
