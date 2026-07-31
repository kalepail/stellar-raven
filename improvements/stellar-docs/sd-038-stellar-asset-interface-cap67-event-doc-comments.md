---
id: sd-038
service: stellar-docs
status: fixed-upstream
discovered: 2026-07-27
upstreamTitle: Update StellarAssetInterface event doc-comments to the CAP-67 shapes
evidence:
  - live read 2026-07-27 of soroban-sdk/src/token.rs on stellar/rs-soroban-sdk main - the StellarAssetInterface clawback doc-comment reads topics ["clawback", admin: Address, to: Address], retaining the admin topic CAP-67 removed and naming the second topic to although the function parameter is from
  - live read 2026-07-27 - the StellarAssetInterface mint doc-comment reads topics ["mint", to: Address] and set_authorized reads topics ["set_authorized", id: Address], both omitting the trailing sep0011_asset topic CAP-67 specifies for SAC events
  - CAP-0067 semantics section "Remove the admin from the SAC mint, clawback, and set_authorized events" specifies clawback as topics ["clawback", from:Address, sep0011_asset:String], mint as ["mint", to:Address, sep0011_asset:String], and set_authorized as ["set_authorized", id:Address, sep0011_asset:String]
  - live read 2026-07-27 of docs/tokens/stellar-asset-contract.mdx on stellar/stellar-docs main - the page embeds a verbatim copy of the same StellarAssetInterface block, so it reproduces the identical stale shapes
  - calibration 2026-07-27 - TokenInterface transfer already documents the CAP-67 muxed data map, and TokenInterface mint/burn shapes are correct for the generic SEP-41 interface; the defect is confined to the SAC-specific StellarAssetInterface doc-comments
  - surfaced by docs maintainer triage on stellar/stellar-docs#2593 (ElliotFriend, 2026-07-21), which identified the SDK copy as the re-drift source for the docs-side fix
  - upstream issue filed 2026-07-27: https://github.com/stellar/rs-soroban-sdk/issues/1955
  - docs-side counterpart remains https://github.com/stellar/stellar-docs/issues/2593; the calibrated per-function scope was posted there 2026-07-27: https://github.com/stellar/stellar-docs/issues/2593#issuecomment-5091974420
  - resolved by https://github.com/stellar/rs-soroban-sdk/pull/1956, merged 2026-07-27; the embedded docs copy was re-synced by https://github.com/stellar/stellar-docs/pull/2704, merged 2026-07-28
  - author-side live recheck 2026-07-31 of soroban-sdk/src/token.rs on rs-soroban-sdk main: set_authorized reads ["set_authorized", id: Address, sep0011_asset: String], mint reads ["mint", to: Address, sep0011_asset: String], and clawback reads ["clawback", from: Address, sep0011_asset: String] — the removed admin topic is gone and the address topic is renamed to match the parameter; generic TokenInterface was correctly left unchanged
  - independent adversarial reviewer (gpt-5.6-sol xhigh, Solo 4137, 2026-07-31) confirmed both halves against CAP-0067's normative shapes, pinned at rs-soroban-sdk 3715435b and stellar-docs c933da48: solo://proj/49/scratchpad/sol-review-2026-07-3--746
  - correction not to carry into a receipt: this record's Finding section loosely says CAP-67 "appended" the trailing asset topic. It did not — the asset topic predates CAP-67, which removed the admin topic and changed other event semantics. sd-018 states the history correctly.
  - RETIREMENT BLOCKED: dated live result + commit-pinned snapshot not yet posted on rs-soroban-sdk issue 1955 (zero comments) or stellar-docs issue 2593; active sd-018 names this finding as the SDK-side owner, so that relationship must be preserved or updated first
---

## Finding

The `StellarAssetInterface` doc-comments in `soroban-sdk/src/token.rs` describe
pre-CAP-67 Stellar Asset Contract event shapes. CAP-0067 removed the admin
topic from the SAC `mint`, `clawback`, and `set_authorized` events and appended
a trailing SEP-11 asset topic to each. The SDK's doc-comments were not updated:

- `clawback` documents `["clawback", admin: Address, to: Address]`. CAP-67
  specifies `["clawback", from: Address, sep0011_asset: String]`. The comment
  keeps the removed `admin` topic *and* labels the remaining address topic `to`
  even though the function parameter is `from`.
- `mint` documents `["mint", to: Address]`, omitting `sep0011_asset`.
- `set_authorized` documents `["set_authorized", id: Address]`, omitting
  `sep0011_asset`.

This matters beyond the SDK because `docs/tokens/stellar-asset-contract.mdx` on
`stellar/stellar-docs` embeds a verbatim copy of the same interface block. A
docs-only correction would silently re-drift the next time that block is synced
from the SDK, which is why the docs maintainer flagged the SDK as the true
owner during triage of stellar/stellar-docs#2593.

Scope is deliberately narrow. The generic `TokenInterface` doc-comments are
**not** part of this finding: its `transfer` already documents the CAP-67 muxed
data map (`{ to_muxed_id: Option<u64>, amount: i128 }`) with the legacy shape
called out, and its `mint`/`burn` topic lists are correct for a generic SEP-41
token, which has no SEP-11 asset to append.

## Evidence

Read live on 2026-07-27 from `stellar/rs-soroban-sdk` `main`,
`soroban-sdk/src/token.rs`:

- `pub trait TokenInterface` begins at line 90; `pub trait StellarAssetInterface`
  at line 252. The three defective comments are inside the latter.
- `mint` — "Emits an event with topics `["mint", to: Address], data = amount: i128`".
- `clawback` — "Emits an event with topics `["clawback", admin: Address, to: Address], data = amount: i128`".
- `set_authorized` — "Emits an event with topics `["set_authorized", id: Address], data = [authorize: bool]`".

Normative source, CAP-0067, section *Remove the admin from the SAC `mint`,
`clawback`, and `set_authorized` events*:

```
contract: asset, topics: ["mint", to:Address, sep0011_asset:String], data: amount:i128
contract: asset, topics: ["clawback", from:Address, sep0011_asset:String], data: amount:i128
contract: asset, topics: ["set_authorized", id:Address, sep0011_asset:String], data: authorize:bool
```

The mirrored docs copy is `docs/tokens/stellar-asset-contract.mdx` on
`stellar/stellar-docs` `main`, which reproduces the same `set_authorized` and
`set_admin` comment text verbatim.

## Recommendation

Update the three `StellarAssetInterface` doc-comments in
`soroban-sdk/src/token.rs` to the CAP-67 shapes: drop `admin` from `clawback`,
rename its address topic to `from` to match the parameter, and append the
`sep0011_asset: String` topic to `mint`, `clawback`, and `set_authorized`.

Leave `TokenInterface` unchanged — it is the generic SEP-41 interface and its
current comments are correct.

Once the SDK is corrected, the embedded copy in
`docs/tokens/stellar-asset-contract.mdx` can be re-synced from it, which closes
the docs-side half of stellar/stellar-docs#2593 without leaving a re-drift path.
