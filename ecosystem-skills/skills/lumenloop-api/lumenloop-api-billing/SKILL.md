---
name: lumenloop-api-billing
description: Manages budgets, metering, and top-ups for the LumenLoop REST API partner tier — reading research budgets and spend, adding prepaid credits, and asking an admin for more. Use when checking a LumenLoop account's research budget or spend, recovering from HTTP 402 on research calls, topping up credits with USDC on Stellar via x402, or requesting a quota increase.
user-invocable: true
---

# LumenLoop API Billing — Budgets, Metering, x402 Top-ups, Budget Requests

This skill covers the money side of the LumenLoop REST API
(`https://api.lumenloop.com/v1`). Browsing tools (the guest surface — directory,
semantic search, SCF data, content summaries) are **free within rate limits**.
**Partner research** (`request_research`) is **metered in USD**, and search calls
can draw a small **enhanced-ranking overage** past the free daily allowance.
What things cost:

| Metered item | Cost |
| --- | --- |
| Research, `output_format: "answer"` | **Flat $0.02** per run — completes in seconds |
| Research, `report` / `sources` / `structured` | **Variable** with depth and format; typical runs well under $2 |
| Enhanced ranking on search calls | **Free allowance** (~150 reranked calls/day on partner accounts; guests get ~30/day); beyond it, **$0.005 per call**, auto-billed |

Enhanced ranking is a server-side reranking pass that improves search result
ordering — it applies automatically, and when no allowance or budget is
available the call still succeeds with standard ranking (a graceful fallback);
search calls never 402.

Every partner billing account has up to **two budget dimensions**:

| Budget | What it is | When it is drawn |
| --- | --- | --- |
| **Monthly quota** | Recurring USD allowance, resets each calendar month | First — research spends against it until the month's allowance is exhausted |
| **Allocated credits** | Prepaid pool (topped up via x402 or granted by an admin) | After the monthly allowance is exhausted — or exclusively, if the account has no monthly quota |

Both research runs and enhanced-ranking overage draw on the same
quota-then-credits ladder. When **both are exhausted or absent** — or the
credential has no billing account at all — the research tools return
**HTTP 402** *before* running, so a 402'd call never costs anything (search
calls instead fall back to standard ranking and still succeed).

## When to use this skill

- A research call returned **HTTP 402 `payment_required`** and you need to recover.
- You want to **check budget and month-to-date spend** before a batch of research runs.
- You want to **top up credits autonomously** by paying USDC on Stellar via x402.
- You want to **request a quota increase** (or one-time credits) from a LumenLoop admin.
- You are unsure whether an error is **budget (402) or rate (429)**.

## Related skills

- Auth, base URL, response envelope, calling tools → `../lumenloop-api-connect/SKILL.md`
- What actually gets metered (the research tools and their output formats) →
  `../lumenloop-api-research/SKILL.md`
- Minting/rotating API keys — **all keys on an account share this one budget** →
  `../lumenloop-api-keys/SKILL.md`

---

## Reading your budget — `GET /v1/me`

```bash
curl -s https://api.lumenloop.com/v1/me \
  -H "Authorization: Bearer $LUMENLOOP_KEY" | jq .billing
```

Abridged `billing` object:

```json
{
  "billing_state": "attached",
  "account": "…",
  "research_quota_usd": 50,
  "month_spend_usd": 12.4,
  "credits_total_usd": 25,
  "credits_remaining_usd": 19.1,
  "research_enabled": true
}
```

- `research_quota_usd` is **null** when the account has no monthly quota (credits-only).
- `month_spend_usd` is month-to-date spend against the quota; it resets each calendar month.
- `credits_total_usd` / `credits_remaining_usd` track the prepaid pool.
- A `hint` field appears when the state needs action — read it.

### `billing_state` decision table

| `billing_state` | Meaning | Next step |
| --- | --- | --- |
| `attached` (+ `research_enabled: true`) | Billing account linked, budget available | Go — research calls will run |
| `no_account` | Credential has no billing account | Contact LumenLoop (https://lumenloop.com) to enable partner research |
| `no_budget` | Account exists but both budgets are exhausted or absent | Top up via x402, or file a budget request |
| `lookup_failed` | Transient lookup error | Retry; contact LumenLoop if it persists |

---

## 402 vs 429 — budget vs rate

These are different problems with different fixes. **429 is only ever about
request rate; it never means budget.**

| | HTTP 402 `payment_required` | HTTP 429 `rate_limited` |
| --- | --- | --- |
| About | **Budget** — no billing account, or both budgets exhausted/absent | **Request rate** — over the per-minute or per-day limit |
| Returned | Before the metered tool runs (nothing is charged) | On any tool when you exceed the limit |
| `Retry-After` header | Never | Always — wait that many seconds |
| Fix | Add budget (x402 top-up or budget request); waiting only helps if the monthly quota rolls over | Wait `Retry-After` seconds; pace off `X-RateLimit-Remaining` |

---

## Two ways to add budget

| | x402 top-up | Budget request |
| --- | --- | --- |
| Endpoint | `POST /v1/billing/topup?amount=N` | `POST /v1/me/budget-request` |
| Who acts | You — fully autonomous, no admin | A LumenLoop admin reviews and resolves it |
| Speed | Instant on payment settlement | Admin-mediated (human turnaround) |
| What it adds | Prepaid **allocated credits** | Raise the **recurring monthly quota** (`kind: "quota"`) or grant **one-time credits** (`kind: "credits"`) |
| Amount | $1–500 per call (default $10) | `amount_usd` up to 100000 |
| Payment | USDC on Stellar via the x402 protocol | None — granted server-side |
| Constraints | Credential must already have a billing account; 503 if payments are not enabled on the deployment | One open request at a time (409 if one is already open) |

Rule of thumb: an agent that hit `no_budget` mid-task should **top up** (instant);
a sustained increase in workload should go through a **`kind: "quota"` budget
request** so the recurring allowance matches reality.

---

## x402 top-up — pay USDC on Stellar

`POST /v1/billing/topup?amount=N` (bearer auth; `amount` is USD, 1–500, default
$10). The flow is the standard [x402 payment protocol](https://www.x402.org/) in
three steps:

**1. Challenge** — the first call returns HTTP 402 with the x402 payment
requirements (exact scheme, USDC on Stellar, LumenLoop's receiving address) in a
`payment-required` response header (base64 JSON):

```bash
curl -i -X POST "https://api.lumenloop.com/v1/billing/topup?amount=25" \
  -H "Authorization: Bearer $LUMENLOOP_KEY"
# HTTP/2 402
# payment-required: eyJ4NDAyVmVyc2lvbiI6…   ← base64 JSON payment requirements
```

**2. Pay** — settle the requested USDC payment on Stellar with any x402-capable
client.

**3. Retry** — repeat the same request with the `X-PAYMENT` header. On settlement
you get HTTP 200 with `{ "credited_usd": …, "account_id": "…" }`, and the
settlement transaction comes back in the `X-PAYMENT-RESPONSE` header.

An x402 client does steps 2–3 for you. Minimal JS with `@x402/fetch` plus a
Stellar signer:

```js
import { wrapFetchWithPayment } from "@x402/fetch";
import { stellarSignerFromSecret } from "./my-stellar-signer.js"; // your x402 Stellar signer adapter

const signer = stellarSignerFromSecret(process.env.STELLAR_SECRET_KEY);
const fetchWithPayment = wrapFetchWithPayment(fetch, signer);

const res = await fetchWithPayment(
  "https://api.lumenloop.com/v1/billing/topup?amount=25",
  { method: "POST", headers: { Authorization: `Bearer ${process.env.LUMENLOOP_KEY}` } },
);
const { credited_usd, account_id } = await res.json();
```

Notes:

- **Idempotent replays** — retrying with the same settlement credits the account
  exactly once; a duplicate retry returns success without double-crediting.
- **503** means payments are not enabled on this deployment — use a budget
  request instead.
- The credential must **already have a billing account** (`GET /v1/me` →
  `billing`); a top-up cannot create one.
- x402 is an open protocol, so any compliant client works — `@x402/fetch` is just
  one option.

**Full end-to-end worked example (decode the challenge, pay, verify settlement,
confirm credit) → `reference/x402-topup-walkthrough.md`.**

---

## Budget requests — ask a LumenLoop admin

When you need a bigger recurring allowance (or one-time credits without paying
on-chain), file a budget request. A LumenLoop admin reviews and resolves it.

```bash
curl -X POST https://api.lumenloop.com/v1/me/budget-request \
  -H "Authorization: Bearer $LUMENLOOP_KEY" \
  -H "Content-Type: application/json" \
  -d '{"kind": "quota", "amount_usd": 100, "note": "Scaling weekly digests to daily research runs"}'
```

Body fields: `kind` (`"quota"`, the default, or `"credits"`), `amount_usd`
(optional, up to 100000), `note` (optional — say why; it helps the review).
Returns `{ id, kind, amount_usd, note, status: "open", created_at, message }`.

- `kind: "quota"` — raise the **recurring monthly USD allowance** (resets each month).
- `kind: "credits"` — grant a **one-time allocation** added to the prepaid credit pool.

**One open request at a time** — a second `POST` while one is `open` returns 409.
Poll for resolution:

```bash
curl -s https://api.lumenloop.com/v1/me/budget-requests \
  -H "Authorization: Bearer $LUMENLOOP_KEY"
# → { "account_id": "…", "requests": [
#      { "id": "…", "kind": "quota", "amount_usd": 100, "note": "…",
#        "status": "open", "resolution_note": null, "resolved_at": null,
#        "created_at": "…" } ] }     # newest first
```

When resolved, `status` changes and `resolution_note` / `resolved_at` are set.
These self-service endpoints require **partner tier with a billing account**
(403 / 409 otherwise).

---

## Monitoring recipe — check headroom before batch research

Before commissioning a batch of research runs, compute your headroom from
`GET /v1/me` and compare it against the batch:

```bash
curl -s https://api.lumenloop.com/v1/me -H "Authorization: Bearer $LUMENLOOP_KEY" \
  | jq '.billing | {
      research_enabled,
      quota_headroom_usd: (if .research_quota_usd == null then 0
                           else (.research_quota_usd - .month_spend_usd) end),
      credits_remaining_usd
    }'
```

- **Headroom** = quota headroom + `credits_remaining_usd`. `answer` runs are a
  flat $0.02 each; for the other formats cost per run varies with depth and
  output format, but typical runs are well under $2 — use your own account's
  observed per-run cost as the planning number. Heavy search workloads add
  enhanced-ranking overage ($0.005 per reranked call past the ~150/day free
  allowance) on top.
- **Before a batch of N runs**: make sure headroom comfortably covers N times your
  observed per-run cost; otherwise top up or trim the batch.
- **Alert thresholds**: warn when headroom drops below roughly $5, or below twice
  the cost of your next planned batch — whichever is larger. Remember
  `month_spend_usd` resets each calendar month, so quota headroom recovers on the
  1st; credits do not refill on their own.
- `research_enabled: false` means stop and fix billing first — the next research
  call will 402.

---

## Pointers

- Live agent guide: `GET https://api.lumenloop.com/v1/docs`
- Your budget and tier: `GET https://api.lumenloop.com/v1/me`
- x402 protocol: https://www.x402.org/
- Full top-up walkthrough: `reference/x402-topup-walkthrough.md`
- Get a partner key or billing account: https://lumenloop.com
