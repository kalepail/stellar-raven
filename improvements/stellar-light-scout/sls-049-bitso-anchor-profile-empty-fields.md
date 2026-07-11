---
id: sls-049
service: stellar-light-scout
status: fixed-upstream
discovered: 2026-07-11
evidence:
  - P4 Lane X observed scout.searchProjects(q="Bitso") describe a live Stellar anchor serving USDC/local-fiat LATAM corridors while embedded anchorProfile returned assets:[], seps:[], and rampTypes:[]; solo://proj/49/scratchpad/super-corpus-rebuild--585
  - sls-012's fixed structured coverage fields show the service can represent dated country/currency evidence, but they do not make empty capability arrays distinguishable from unknown
  - 2026-07-11 live re-check after Scout 1.7.15: scout.searchProjects(q=Bitso) returns anchorProfile.profileState=profiled with assets=[USDC] and on-ramp/off-ramp capability values
---

## Finding

Scout's Bitso project narrative claims live anchor/corridor activity while its
embedded `anchorProfile` returns empty arrays for assets, SEPs, and ramp types.
Consumers cannot tell whether empty means no capability, unknown/unverified,
or an incomplete profile, and can either infer unsupported SEP-31 support or
make a false negative claim.

## Evidence

P4 Lane X captured the contradictory project/profile envelope on 2026-07-11.
This is a successor completeness/empty-field-semantics gap after sls-012, not
the already fixed absence of all structured corridor fields.

## Recommendation

Populate sourced capability fields where verified and otherwise emit an explicit
unknown/not-profiled state with `asOf` and provenance. Never serialize an empty
array as an implicit negative claim when the narrative asserts live activity.
