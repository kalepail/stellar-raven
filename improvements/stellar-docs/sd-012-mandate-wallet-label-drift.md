---
id: sd-012
service: stellar-docs
status: verified
discovered: 2026-07-10
upstreamTitle: Align Lumens mandate account labels with the current SDF mandate
evidence:
  - current SDF mandate page uses the reorganized 2025+ bucket labels and named account mappings
  - Lumens documentation retains older wallet/bucket labels
  - live recheck 2026-07-14: the mandate page names SDF Development, Stellar Growth, Product and Innovation, and Assets and Liquidity, while the Lumens page still presents Direct Development, Developer Support, Currency Support, and other older account labels as current
  - Solo scratchpad 575 GT-27 primary 3270 and blind 3272
---

## Finding

Official Stellar documentation and the current SDF mandate page expose different
generations of SDF wallet/bucket labels. Consumers can mistake older labels for
the current mandate structure or mechanically combine accounts across mappings.

## Evidence

The current mandate page says the 2019 structure was updated in 2025 to four new
priority buckets and publishes the current account mapping. The Lumens page still
calls its older list a complete list of addresses currently associated with the
mandate, using the earlier labels and different hot-account mappings.

## Recommendation

Update the Lumens/transparency documentation to the current mandate taxonomy or
explicitly mark historical labels with dates and link the live mandate page as
the ownership/mapping authority. Preserve account mappings and balances as dated,
non-exhaustive disclosures.
