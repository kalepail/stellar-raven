---
name: lumenloop-api-keys
description: Self-service API-key management for LumenLoop partner accounts over the REST API at https://api.lumenloop.com/v1 — list every credential on the account, mint new llmcp_ keys with labels and expiries, and revoke keys instantly with no admin round-trip. Use when minting or rotating LumenLoop API keys, listing the credentials on an account, revoking a leaked or stale key, or giving each agent or service its own key against a shared partner account.
user-invocable: true
---

# Manage Your LumenLoop API Keys (Partner Self-Service)

Partner accounts manage their own credentials directly over the API — list, mint,
and revoke keys yourself, **no admin round-trip**. A LumenLoop API key is a bearer
credential starting with `llmcp_`, sent on every request as
`Authorization: Bearer $LUMENLOOP_KEY`. The server stores only a hash of the key:
the plaintext is returned **exactly once** at creation, and a lost plaintext cannot
be recovered — you mint a replacement instead.

All keys on one account share the same **billing budget** and per-account
**research history** (`list_my_research` shows account-wide runs). That makes keys
cheap to mint and cheap to revoke: hand one labelled key to each agent or service,
and they all draw on the budget you already have.

## When to use this skill

- You need to **rotate** a key (scheduled hygiene, or it's about to expire).
- A key may have **leaked** — revoke it now, mint a replacement.
- You want **one key per agent/service** instead of a shared secret everywhere.
- You want to **audit** the credentials on the account and when each was last used.
- You lost a key's plaintext and need a working credential again.

## Related skills

- Auth basics, tiers, and `GET /v1/me` → `../lumenloop-api-connect/SKILL.md`
- The budget all these keys share (quota, credits, top-ups) → `../lumenloop-api-billing/SKILL.md`
- The account-wide research history they share → `../lumenloop-api-research/SKILL.md`

## Requirements

Every endpoint below requires a **partner-tier** credential that is attached to a
billing account:

- Non-partner credential → **403**.
- Partner credential with no billing account → **409** (contact LumenLoop to attach one).

---

## The three endpoints

### List credentials — `GET /v1/me/credentials`

Every key and OAuth grant on your account. `is_current` marks the credential
making the call — that is how you confirm which key a given deployment is using.

```bash
curl https://api.lumenloop.com/v1/me/credentials \
  -H "Authorization: Bearer $LUMENLOOP_KEY"
```

```json
{
  "account_id": "acc_7f3k2m",
  "keys": [
    {
      "id": "key_01j9x4",
      "label": "ci-pipeline",
      "key_prefix": "llmcp_a1b2c3",
      "created_at": "2026-03-02T09:14:00Z",
      "last_used_at": "2026-06-10T07:55:12Z",
      "expires_at": "2026-08-30T09:14:00Z",
      "revoked": false,
      "is_current": true
    },
    {
      "id": "key_01j2q8",
      "label": "research-agent",
      "key_prefix": "llmcp_d4e5f6",
      "created_at": "2026-01-15T18:02:00Z",
      "last_used_at": null,
      "expires_at": null,
      "revoked": false,
      "is_current": false
    }
  ],
  "oauth_grants": [ ... ]
}
```

`oauth_grants` lists OAuth tier grants on the account — these are **admin-managed
and read-only** here; you cannot mint or revoke them through self-service.

### Mint a key — `POST /v1/me/keys`

```bash
curl -X POST https://api.lumenloop.com/v1/me/keys \
  -H "Authorization: Bearer $LUMENLOOP_KEY" \
  -H "Content-Type: application/json" \
  -d '{"label": "drafter-agent", "expires_in_days": 90}'
```

```json
{
  "key": "llmcp_9XkP2vQ8rT4wY7zB...",
  "id": "key_01jb5n",
  "label": "drafter-agent",
  "key_prefix": "llmcp_9XkP2v",
  "scopes": ["partner"],
  "expires_at": "2026-09-08T10:30:00Z",
  "note": "Store this key now — it will not be shown again."
}
```

- **`key` is the full plaintext, returned exactly once.** Capture it into your
  secret store immediately; after this response only the hash exists server-side.
- `label` is optional but strongly recommended — it is how you tell keys apart
  later.
- `expires_in_days` is optional, **0–365, default 90**. Pass `0` for a key that
  **never expires**.
- Minted keys are **always partner-tier** (`scopes: ["partner"]`) — self-service
  can never raise a tier.
- Accounts are capped at **10 active keys**; minting at the cap returns **409**
  (revoke a stale key first).

### Revoke a key — `DELETE /v1/me/keys/{id}`

```bash
curl -X DELETE https://api.lumenloop.com/v1/me/keys/key_01j2q8 \
  -H "Authorization: Bearer $LUMENLOOP_KEY"
```

```json
{ "id": "key_01j2q8", "revoked": true }
```

Revocation is **immediate** — the next request with that key gets 401. Returns
**404** if the key is not on your account or is already revoked. You *can* revoke
the key you are currently using — don't, unless you hold another working key.

---

## Recipes

### 1. Key rotation without downtime

Mint first, revoke last — there is never a moment without a valid key.

```bash
# 1. Mint the replacement (capture "key" from the response NOW)
curl -X POST https://api.lumenloop.com/v1/me/keys \
  -H "Authorization: Bearer $LUMENLOOP_KEY" \
  -H "Content-Type: application/json" \
  -d '{"label": "ci-pipeline 2026-06", "expires_in_days": 90}'

# 2. Deploy the new plaintext to the service (replace $LUMENLOOP_KEY there)

# 3. Verify the deployment is on the NEW key
curl https://api.lumenloop.com/v1/me \
  -H "Authorization: Bearer $LUMENLOOP_KEY"          # sanity: auth works
curl https://api.lumenloop.com/v1/me/credentials \
  -H "Authorization: Bearer $LUMENLOOP_KEY"          # is_current = the new key id?

# 4. Only then revoke the old key
curl -X DELETE https://api.lumenloop.com/v1/me/keys/key_01j9x4 \
  -H "Authorization: Bearer $LUMENLOOP_KEY"
```

The `is_current` flag in step 3 is the proof: if the new key's entry shows
`is_current: true` when called from the deployed service, the swap took.

### 2. One key per agent or service

Mint a separately labelled key for each agent, script, and pipeline — they all
share the account's budget and research history, so there is no per-key billing
setup. Why bother:

- **Blast-radius isolation** — a leaked agent key is revoked alone; nothing else
  breaks.
- **Per-key audit** — `last_used_at` tells you which agent is actually calling
  (and which key is dead weight).
- **Independent rotation** — rotate the CI key without touching the research
  agent.

Mind the **10-active-key cap**: pick a labelling convention that makes pruning
easy, e.g. `<service>-<purpose>` (`drafter-agent`, `ci-pipeline`, `raph-laptop`)
or with a rotation date suffix (`ci-pipeline 2026-06`). Revoke superseded keys as
part of every rotation so the cap never bites mid-incident.

### 3. Leak response

A key landed in a log, a paste, or a public repo:

1. **Revoke it immediately** — `DELETE /v1/me/keys/{id}` (find the `id` via
   `GET /v1/me/credentials` by matching `key_prefix` against the leaked string).
2. **Mint a replacement** with the same label and redeploy.
3. **Check for unexpected use** — was `last_used_at` more recent than your own
   last legitimate call?
4. **Review spend** — `GET /v1/me` shows month-to-date spend; an attacker
   burning metered research shows up there.

Revocation is immediate, so steps 2–4 can happen calmly once step 1 is done.

---

## Failure modes

| Status | When | What to do |
|--------|------|------------|
| 403 | Credential is not partner tier | Self-service is partner-only — contact LumenLoop for partner access |
| 409 | No billing account on the credential, **or** minting at the 10-active-key cap | Contact LumenLoop to attach an account; or revoke a stale key, then mint |
| 404 | Revoking a key that isn't on your account or is already revoked | List `GET /v1/me/credentials` and recheck the `id` |
| 400 | `expires_in_days` outside 0–365 | Use 0 (never) through 365 |

## Security hygiene

- Keep keys in **environment variables or a secret manager**, never in source code.
- **Never log the full key.** `key_prefix` exists for exactly this — it is safe to
  log, reference in tickets, and match against leaks.
- Prefer **expiring keys** (the 90-day default) for unattended automation — an
  expiry is a rotation you cannot forget. If rotation genuinely costs more than
  the risk, pass `expires_in_days: 0` and set a calendar reminder instead.
- Treat the minting response as the only copy of the plaintext: capture `key`
  into your secret store in the same step that creates it.

## OAuth grants

OAuth tier grants (e.g. for OAuth-capable clients signing in via the LumenLoop
authorization server) are **admin-managed**: they appear read-only in
`GET /v1/me/credentials`, and self-service cannot create, modify, or revoke them.
To change an OAuth grant, contact LumenLoop (https://lumenloop.com).
