---
id: sd-011
service: stellar-docs
status: reported-upstream
discovered: 2026-07-10
upstreamTitle: Clarify unused SDEX offer effects and authoritative result XDR
evidence:
  - current stellar/stellar-horizon internal/db2/history/main.go comments out offer-created/updated/removed effect constants, while effects_processor.go contains no references to those effects
  - live successful manage-buy-offer operation 272376861589106689 returned zero effects while TransactionResult XDR contained the updated OfferEntry
  - removed offer 1848272936 returned 404 while its offer-trades endpoint retained two trades
  - rechecked 2026-07-14: current Effect Types docs still list the three offer effects, while current stellar/stellar-horizon keeps types 30/31/32 commented out
  - Solo scratchpad 575 GT-17 primary process 3247 and independent blind process 3248
  - upstream issue filed 2026-07-14: https://github.com/stellar/stellar-docs/issues/2604
  - ElliotFriend triage 2026-07-15 confirmed the finding against current stellar/stellar-horizon and warned that effect type 7 is marked unused but is emitted, so the fix must stay scoped to types 30/31/32: https://github.com/stellar/stellar-docs/issues/2604#issuecomment-4981548398
---

## Finding

The current Stellar documentation surface can lead a bot author to rely on
Horizon `offer_created`, `offer_updated`, and `offer_removed` effects for SDEX
offer lifecycle tracking. Current `stellar/stellar-horizon` comments out effect
types 30/31/32, and a live successful offer update returned no Horizon effects even
though its transaction result carried the updated `OfferEntry`.

The missing operational boundary is narrow: these effect types are not a
current lifecycle feed. Transaction result XDR/meta records the offer outcome,
while Horizon's open-offer and trade resources answer separate current-state
and history questions.

## Evidence

On 2026-07-10, manage-buy-offer operation `272376861589106689` successfully
updated offer `1847875879`. Its Horizon effects collection was empty, while
decoded TransactionResult XDR contained the updated offer entry. Separately,
offer `1848272936` returned 404 after fills while its offer-trades endpoint
returned two trades.

Current source corroborates the behavior:

- `stellar/stellar-horizon/internal/db2/history/main.go` comments out effect
  types 30/31/32, while `effects_processor.go` emits none of them;
- current `stellar/go-stellar-sdk` explains synthetic IDs for immediately
  filled offers; and
- stellar-core result XDR records CREATED/UPDATED/DELETED plus claimed offers.

This is a docs-content/behavior gap, not an Algolia ranking issue.

## Recommendation

In the Effect Types table, mark offer-created/updated/removed as unused rather
than listing them as emitted effects. Add one adjacent lifecycle note that
directs readers to transaction result XDR/meta for the operation outcome, and
to open-offer/trade resources for current state and retained trade history.
Do not generalize from an `unused` source comment: type 7 is still emitted;
scope the table correction to types 30/31/32.
