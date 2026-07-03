---
id: q-aas-publish-asset-metadata-toml
q: "After issuing a Stellar asset, how do I publish SEP-1 metadata in stellar.toml so wallets and explorers show its name, logo, and issuer information?"
category: assets-anchors-seps
subcategory: asset-metadata
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that the issuing account sets `home_domain` and the domain hosts `/.well-known/stellar.toml` under SEP-1.", weight: 5 }
  - { claim: "Mentions correct HTTPS hosting details for wallet/explorer discovery, including CORS/content-type or public accessibility concerns.", weight: 4 }
  - { claim: "Names relevant SEP-1 fields such as `SIGNING_KEY`, `DOCUMENTATION`, and `[[CURRENCIES]]` entries with code, issuer, display decimals, name, description, and image/logo metadata.", weight: 4 }
should_have:
  - { claim: "Notes that explorers or wallets may cache metadata and may apply their own verification/listing policies.", weight: 3 }
  - { claim: "Explains common disappearance causes: changed home domain, invalid TOML, unreachable file, missing issuer/code match, or bad image URL.", weight: 3 }
nice_to_have:
  - { claim: "Mentions GitHub Pages or other static hosting can work if HTTPS and path requirements are satisfied.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim issuing an asset alone makes it verified or visible in every wallet/explorer.", weight: 5 }
  - { claim: "Do NOT put the TOML fields on-chain except for the account `home_domain` pointer.", weight: 4 }
must_cite:
  - "SEP-1 or the Stellar docs page covering stellar.toml asset metadata."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0001.md"
  - "https://developers.stellar.org/docs/build/apps/example-application-tutorial/anchor-integration/sep1"
  - "https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against SEP-1 and official Stellar docs. Wallet/explorer cache timing remains venue-specific."
---

## Reference answer (gospel)

For asset metadata, the on-chain pointer is the issuer account's `home_domain`; the metadata itself is off-chain SEP-1 TOML. Set the issuing account's home domain to the domain you control, then host the file at `https://DOMAIN/.well-known/stellar.toml`. SEP-1 requires public accessibility at that path, CORS via `Access-Control-Allow-Origin: *`, recommends `content-type: text/plain`, and limits the file to 100KB.

In the TOML, include the organization/contact documentation you can support and a `[[CURRENCIES]]` entry matching the exact asset `code` and `issuer`. Relevant fields include `display_decimals`, `name`, `desc`, `image`, `conditions`, `is_asset_anchored`, `anchor_asset_type`, and reserve/collateral fields when applicable. General fields such as `SIGNING_KEY`, `ACCOUNTS`, and anchor endpoints are used when the issuer also offers SEP services.

If wallets or explorers do not show the asset, debug the chain in order: issuing account `home_domain` points to the expected domain; `/.well-known/stellar.toml` is reachable over HTTPS; CORS/content type are acceptable; TOML parses; `[[CURRENCIES]]` code and issuer match the asset; image/logo URLs are reachable; and the venue has refreshed cache or accepted the asset under its own display policy.

## Why these cards (routing rationale)

SEP-1 and asset metadata are primary Stellar standards/docs questions, so `stellar_docs_mcp` should fire. Scout is acceptable corroboration because it indexes SEP-1 and Stellar docs.

## Edge / traps

The main traps are treating wallet/explorer verification as automatic and confusing off-chain TOML metadata with on-chain asset state. Do not tell users to put TOML fields on-chain other than the account `home_domain` pointer.
