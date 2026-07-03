# Phase-2 Gospel Verification - Codex

Verifier: Solo process 2465 (`codex-phase2-verify`)  
Date: 2026-06-22  
Scope: adversarial factual/source spot-check of the 391 answered golden-battery files. No question files were edited.

## Method

- Resolved the cross-agent YieldBlox/Reflector inconsistency first, using Scout plus dated incident sources.
- Spot-checked 47 files across all 9 categories, weighted toward high-weight `must_have` / `must_avoid`, freshness-sensitive claims, and named Phase-2 corrections.
- Checked 30 source URLs with `curl -L -sI` and spot-read source bodies where facts were contested.

Sampled files:

- `assets-anchors-seps`: `q-sep-43-web-wallet-api.md`, `q-sep-45-contract-auth.md`, `q-sep-55-58-contract-build-verification` equivalent (`soroban/q-soroban-contract-build-verification.md`), `q-sep-7-uri.md`, `q-sep-8` coverage via `compliance/q-comp-sep8-regulated-assets-approval-server.md`, `q-asset-rwa-tokenized-freshness.md`
- `compliance-rwa-payments`: `q-comp-yieldblox-oracle-incident.md`, `q-comp-security-disclosure-programs.md`, `q-comp-sep8-regulated-assets-approval-server.md`, `q-rwa-wisdomtree-funds.md`, `q-pay-travel-rule-aid-flows.md`
- `defi-ecosystem`: `q-defi-reflector-content.md`, `q-eco-blend-audit-extract.md`, `q-defi-reflector-alternatives.md`, `q-defi-x402-on-stellar-what.md`, `q-defi-x402-projects-discovery.md`, `q-defi-streaming-payments-prior-art.md`, `q-defi-stellarx-what-is.md`, `q-defi-soroswap-vs-stellarx.md`, `q-eco-defi-market-map.md`, `q-defi-etherfuse-stablebonds.md`
- `edge-governance`: `q-edge-noinfo-sep-9999.md`, `q-edge-factcheck-soroswap-first-amm.md`, `q-edge-web-cbdc-vs-stablecoin.md`, `q-edge-deep-leave-no-stone-unturned-defi.md`
- `history-org-tokenomics`: `q-token-circle-usdc-on-stellar.md`, `q-hist-partnerships-timeline-list.md`, `q-hist-dtcc-tokenization.md`, `q-org-sdf-ceo-denelle-dixon.md`, `q-hist-ripple-fork-myth.md`
- `protocol-core`: `q-protocol-current-mainnet-version.md`, `q-protocol-tier1-org-list.md`, `q-protocol-network-passphrases.md`, `q-protocol-horizon-vs-rpc.md`, `q-protocol-cap-process.md`
- `scf-grants-builders`: `q-scf-funded-similar-oracle.md`, `q-scf-build-award-cap.md`, `q-scf-sdf-bug-bounty.md`, `q-scf-how-to-apply.md`
- `soroban`: `q-soroban-contract-build-verification.md`, `q-soroban-oracle-defensive-consumption.md`, `q-soroban-publish-events.md`, `q-soroban-check-auth-custom-account.md`, `q-soroban-auth-delegation-p27.md`
- `tooling-infra`: `q-infra-rpc-event-retention.md`, `q-infra-rpc-methods-list.md`, `q-infra-horizon-rpc-migration.md`, `q-tool-freighter-wallet.md`, `q-tool-go-sdk-ingest.md`, `q-infra-horizon-deprecated.md`

## Findings

[BLOCKER] `research/golden/defi-ecosystem/q-defi-reflector-content.md` - wrong YieldBlox/Reflector incident month.

- The notes and gospel say "May 2026 Blend USTRY oracle-manipulation".
- Authoritative/reputable dated incident sources converge on Feb. 22, 2026 UTC, with some framing as Feb. 21-22 due time zones / "over the weekend".
- Fix: replace "May 2026" with "Feb. 21-22, 2026 / Feb. 22 UTC"; keep the durable narrative: YieldBlox/Blend V2 pool, USTRY thin-liquidity SDEX price source, Reflector VWAP feed, pool/operator oracle-config failure, validators froze ~48M XLM.

[BLOCKER] `research/golden/defi-ecosystem/q-eco-blend-audit-extract.md` - wrong incident month and misleading "attempted" framing.

- The gospel says a "May 2026 attempted oracle-manipulation incident" and cites Lumen Loop week-of-May roundup.
- Incident-specific sources describe a completed Feb. 22, 2026 drain/loss, partially contained by validator freeze. "Attempted" understates the actual loss.
- Fix: either remove the incident aside from this audit question, or change it to "Feb. 2026 YieldBlox/Blend V2 oracle-manipulation incident; not a Blend core-contract audit finding." Do not rely on the Lumen Loop roundup for the incident date.

[BLOCKER] `research/golden/assets-anchors-seps/q-sep-45-contract-auth.md` - false SEP-43 denial contradicts live `stellar-protocol`.

- The file correctly identifies SEP-45 as "Stellar Web Authentication for Contract Accounts" and Draft.
- But notes and gospel also say "SEP-43 does not exist" / "registry skips from 41 to 45". That is false. `stellar/stellar-protocol` has `ecosystem/sep-0043.md`: "Standard Web Wallet API Interface", Status Draft, created 2024-04-11.
- Fix: remove the "no SEP-43" claim from notes, gospel, and source commentary. The contrast should be: contract-account auth is SEP-45, not SEP-10 and not SEP-43; SEP-43 exists but is a web-wallet API standard with unrelated scope.

[MAJOR] `research/golden/defi-ecosystem/q-defi-x402-projects-discovery.md` - one substituted repo slug is wrong and 404s.

- Scout confirms `402md/agentcard` and `emperorsixpacks/-bear-protocol`.
- The gospel writes `emperorsixpacks/bear-protocol` without the leading hyphen; `https://github.com/emperorsixpacks/bear-protocol` returns 404.
- Fix: change to `emperorsixpacks/-bear-protocol` and cite Scout repo search provenance for it. Consider adding `https://github.com/emperorsixpacks/-bear-protocol` to `sources:`.

[MINOR] `research/golden/defi-ecosystem/q-defi-x402-projects-discovery.md` - `scout_projects` is too narrow as the expected card for repo-heavy x402 discovery.

- `/api/projects/search?q=x402` returns project-level hits (`ApiCharge`, `Benkiko`), while repo-level hits require `scout_repos` or broader repo queries such as `streaming payments`, `agentcard`, or `bear-protocol`.
- Fix: make `expected_cards: [scout_projects, scout_repos]` or make `scout_repos` expected and `scout_projects` acceptable.

[MINOR] `research/golden/defi-ecosystem/q-defi-stellarx-what-is.md` - source list does not directly include the strongest sponsor source.

- The answer says StellarX is built by Ultra Stellar. Scout supports this via the `Ultra Stellar` project record, which explicitly lists StellarX and StellarTerm, while the file's `sources:` list has only `project/stellarx` and `stellarx.com`.
- Fix: add `https://stellarlight.xyz/project/ultra-stellar` (or an Ultra Stellar first-party page) to `sources:`.

## Confirmed Phase-2 Corrections

- SEP-55 / SEP-58: confirmed. `sep-0055.md` is "Contract Build Verification" (Draft), attestation-based; `sep-0058.md` is "Contract Build Reproducibility for Verification" (Draft), rebuild-based and complementary to SEP-55. Not SEP-49.
- SEP-43: confirmed to exist as "Standard Web Wallet API Interface", Draft. This is also the source of the blocker above.
- SEP-8: confirmed Active, "Regulated Assets", approval-server transaction flow.
- `getEvents` retention: confirmed bounded, not full history. Developer docs show `HISTORY_RETENTION_WINDOW = 120960`, about 7 days; golden files correctly gate on 24h default / ~7d max where stated.
- CCTP on Stellar: confirmed live via SDF "Circle CCTP is Live on Stellar"; Lumen Loop/SDF surfaces date it as May 19, 2026.
- StellarX: confirmed as a Stellar trading UI; not SDF-built. Ultra Stellar is the sponsor/source to include.
- x402: confirmed against developers.stellar.org. x402 is Coinbase-origin HTTP 402 per-request payments; on Stellar it uses Soroban auth entries, SEP-41 tokens with USDC default, compatible wallets, and facilitator options: Coinbase testnet facilitator and OpenZeppelin Relayer plugin on testnet/mainnet.
- Streaming-payment prior-art repos: confirmed in Scout for `luanlabs/fluxity-*`, `tosinshada/tide-streaming`, `Handilusa/Ferrule`, `winsznx/routedock`, and `davidmaronio/StellarPay402`.
- Reflector alternatives: confirmed via Scout oracle search. Reflector is not the only oracle; DIA, Band, Lightecho, RedStone, Orally, etc. are live/directory-visible.
- Protocol 26 / 27: confirmed. SDF says Yardstick Protocol 26 went live on mainnet May 6, 2026. Developer docs list Protocol 27 as Testnet June 18, 2026, with CAP-71 / Zipper release notes; the golden answer correctly forbids claiming P27 is mainnet-live.

## Source Hygiene

Checked 30 URLs. No fabricated source URLs found in the sample.

Notable details:

- `https://defillama.com/chain/Stellar` returned 403 to `curl -I`, likely bot/HEAD behavior rather than a fabricated URL. Do not treat as broken unless GET/browser also fails.
- `https://github.com/emperorsixpacks/bear-protocol` is not in `sources:` but appears as a bare repo name in the gospel and 404s. Use `https://github.com/emperorsixpacks/-bear-protocol`.
- The `ecosystem/README.md` source in `q-sep-45-contract-auth.md` is insufficient for "no SEP-43"; the raw repo listing and `sep-0043.md` prove the README table omission is not nonexistence.

## A. YieldBlox Incident Verdict

Canonical framing: the YieldBlox/Reflector incident occurred around Feb. 21-22, 2026, with the key on-chain attack time commonly given as 00:25 UTC on Feb. 22, 2026. It was a completed oracle-manipulation drain of a YieldBlox DAO-managed Blend V2 pool. The attacker manipulated thin USTRY/USDC liquidity on SDEX, causing the Reflector VWAP source to overvalue USTRY, then borrowed roughly 61.25M XLM plus about 1M USDC. Reported loss varies by source, roughly $10.2M to $10.97M. Validators froze/quarantined about 48M XLM, approximately $7.2M-$7.5M. The incident is best framed as pool/operator oracle-configuration and thin-liquidity RWA-pricing risk, not a Stellar protocol flaw, not a Blend core-contract exploit, and not a Reflector core bug.

Sources used:

- Scout YieldBlox record: `https://stellarlight.xyz/api/projects/search?q=YieldBlox`
- Halborn: `https://www.halborn.com/blog/post/explained-the-yieldblox-hack-february-2026`
- BlockSec: `https://blocksec.com/blog/yieldblox-dao-incident-on-stellar-oracle-misconfiguration-enabled-a-10m-drain`
- Protos: `https://protos.com/yieldblox-lending-pool-hit-by-10m-hack-on-stellar/`
- Rekt: `https://rekt.news/yieldblox-rekt`
- NomosLabs archive: `https://nomoslabs.io/archive/yieldblox-dao-2026`

Files to normalize:

- `research/golden/defi-ecosystem/q-defi-reflector-content.md`: replace May 2026 with Feb. 21-22 / Feb. 22 UTC.
- `research/golden/defi-ecosystem/q-eco-blend-audit-extract.md`: replace "May 2026 attempted" with Feb. 2026 completed/partially-contained incident, or remove the aside.

No need to loosen the date gate to "genuinely contested"; the May framing is a secondary-source chronology error, not a true source split.

## B. Counts

- [BLOCKER]: 3
- [MAJOR]: 1
- [MINOR]: 2

## C. Prioritized Fix List

1. `defi-ecosystem/q-defi-reflector-content.md`: change incident date/framing to Feb. 21-22, 2026 / Feb. 22 UTC; preserve durable thin-liquidity USTRY/Reflector/YieldBlox narrative.
2. `defi-ecosystem/q-eco-blend-audit-extract.md`: remove or correct the incident aside; do not describe it as May or merely attempted.
3. `assets-anchors-seps/q-sep-45-contract-auth.md`: delete the "SEP-43 does not exist / registry skips" claim; state SEP-43 exists but is unrelated.
4. `defi-ecosystem/q-defi-x402-projects-discovery.md`: fix `emperorsixpacks/bear-protocol` to `emperorsixpacks/-bear-protocol` and add/cite Scout repo provenance.
5. `defi-ecosystem/q-defi-x402-projects-discovery.md`: adjust routing to include `scout_repos` as expected for repo discovery.
6. `defi-ecosystem/q-defi-stellarx-what-is.md`: add Ultra Stellar source to support sponsor attribution.

## D. Overall Verdict

Overall quality is good enough to compile after the blockers are fixed. The named Phase-2 corrections mostly held under independent verification. The top pre-compile fixes are the YieldBlox date normalization and the SEP-43 contradiction, because both create direct false traps in high-weight gospel/rubric text. The x402 repo slug is narrower but should be fixed because it converts a real Scout hit into a 404 if followed literally.
