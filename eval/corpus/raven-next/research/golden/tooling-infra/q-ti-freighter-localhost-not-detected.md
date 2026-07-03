---
id: q-ti-freighter-localhost-not-detected
q: "Freighter works on live dApps but `window.freighterApi` is undefined on localhost — what causes this (SSL/CORS) and how do I get it to connect in local dev?"
category: tooling-infra
subcategory: wallets-keys
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Directs developers to use the supported @stellar/freighter-api package/functions rather than relying on a hardcoded window.freighterApi global.", weight: 5 }
  - { claim: "Explains local debugging steps: verify the extension is installed/enabled on the browser profile, call isConnected/requestAccess/getAddress, check site permissions, network selection, and extension console/errors.", weight: 4 }
  - { claim: "Distinguishes browser-extension injection/site-permission issues from Stellar RPC/Horizon/CORS issues; wallet detection happens before chain API calls.", weight: 4 }
  - { claim: "Gives a local-dev fallback: use http://localhost/127.0.0.1 or an HTTPS tunnel/dev cert if the extension/browser requires a secure context for the exact flow.", weight: 3 }
should_have:
  - { claim: "Mentions that the Freighter API signs transactions and auth entries but should not expose secret keys to the dApp.", weight: 2 }
nice_to_have:
  - { claim: "Mentions testing in a clean browser profile to isolate conflicting extensions.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet, faucet, provider, SDK, explorer, or infrastructure behavior without a current source.", weight: 5 }
  - { claim: "Do NOT diagnose this as a Stellar RPC CORS problem before checking wallet API installation/permissions.", weight: 5 }
  - { claim: "Do NOT require users to export/paste a Freighter secret key into local dev code.", weight: 5 }
must_cite:
  - "Freighter/API docs or Stellar dApp docs showing @stellar/freighter-api usage."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/build/guides/dapps/frontend-guide#interacting-with-the-stellar-network"
  - "https://developers.stellar.org/docs/build/guides/freighter/prompt-to-sign-tx"
  - "https://developers.stellar.org/docs/build/guides/dapps/state-archival#prerequisites"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Verified current `@stellar/freighter-api` package metadata on 2026-06-29. Exact localhost/secure-context behavior can still depend on browser-extension release and browser-origin policy, so the rubric keeps this as fallback guidance rather than a hard browser-behavior guarantee."
---

## Reference answer (gospel)

Do not build against a brittle `window.freighterApi` assumption. Stellar's current dApp docs import functions from `@stellar/freighter-api` such as `isConnected`, `setAllowed`/access, `getAddress`, and `signTransaction` [1]; Freighter signing docs likewise point JS dApps to the `@stellar/freighter-api` client library [2]. Install the package, call the detection/access functions, and handle the returned error state.

If it works on live dApps but not local dev, debug extension injection/permissions first: same browser profile, Freighter installed/enabled, dApp origin allowed, wallet unlocked, correct Testnet/Mainnet network, no content-script errors, and no conflicting extension/profile. This is usually separate from RPC/Horizon CORS; wallet detection happens before your app calls Stellar RPC.

If the browser/extension refuses a non-secure origin for your flow, try `http://localhost`/`127.0.0.1`, an HTTPS dev certificate, or a tunnel such as a temporary HTTPS preview. Do not work around detection by exporting the wallet secret key into local code; Freighter is meant to sign for the dApp.

## Why these cards (routing rationale)

`stellar_docs_mcp` is primary because official dApp/Freighter docs define the supported API package and methods. `parallel_search` is acceptable for current Freighter issue threads if Phase 3 wants to reproduce a browser-specific localhost regression.

## Edge / traps

The likely wrong diagnosis is "RPC CORS" when the injected wallet API is missing before any RPC request. Another bad workaround is asking the user to paste a wallet secret key into local code. The answer should stay on supported Freighter API and browser-origin troubleshooting.
