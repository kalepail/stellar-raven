---
id: sls-050
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-11
evidence:
  - live re-check 2026-07-14: Vesseo/Vibrant search exposes structured identity aliases and a source URL; resolving PR https://github.com/Stellar-Light/stellarlight/pull/509
  - P4 H3 primary-source extraction cites current Stellar material as "the Vesseo app" while older directory/eval references use Vibrant; solo://proj/49/scratchpad/super-corpus-rebuild--585
  - P4 H3's wallet/recovery review treated the naming transition as a factual identity boundary requiring current-source verification
  - 2026-07-13 live re-check against Stellar Light 1.7.18: GET /api/projects/search?q=Vibrant and q=Vesseo returned the same canonical id/slug/name and identity={currentName:"Vesseo",aliases:["Vibrant"],renamedAt:null,sourceUrl:"https://vesseoapp.com/"}; inventory/stellar-light.json
---

## Finding

Scout directory identity handling does not make the Vibrant-to-Vesseo naming
continuity explicit. A consumer looking up one name can miss current recovery
material under the other, or merge them without a date/provenance basis.

## Evidence

P4 H3's 2026-07-11 primary-source extraction of Stellar key-management content
uses the Vesseo name, while prior directory-facing material uses Vibrant. The
candidate originally remained proposed pending a captured Scout record pair
that showed the alias miss or stale label directly.

Live re-check on 2026-07-13 after Scout 1.7.18 confirmed the upstream fix. Both
`GET /api/projects/search?q=Vibrant` and `q=Vesseo` returned canonical project id
`6a2d9ffe213eeb05b49585bc`, slug `vesseo`, name `Vesseo`, and the same structured
identity block: `currentName: "Vesseo"`, `aliases: ["Vibrant"]`,
`renamedAt: null`, `sourceUrl: "https://vesseoapp.com/"`. The null date is
explicitly allowed when the rename date is unknown; alias resolution and source
provenance are present rather than inferred by the consumer.

## Recommendation

Expose `currentName`, `aliases`, `renamedAt` when known, and a source URL on
wallet project records. Search both names to one canonical entity while
preserving the historical label and date in returned evidence.
