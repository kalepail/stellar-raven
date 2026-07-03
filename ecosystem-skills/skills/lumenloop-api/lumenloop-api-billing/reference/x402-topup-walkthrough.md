# x402 Top-up Walkthrough — USDC on Stellar, End to End

A worked example of adding $25 of allocated credits to a LumenLoop billing
account via `POST /v1/billing/topup`, using the
[x402 payment protocol](https://www.x402.org/). x402 is an **open protocol** —
this walkthrough uses `@x402/fetch`, but **any x402-compliant client works**.

## Prerequisites

- A **partner-tier credential** in `$LUMENLOOP_KEY` whose account already has a
  **billing account** — check `GET /v1/me` → `billing.billing_state` is not
  `no_account`. A top-up cannot create a billing account.
- A **Stellar account holding USDC** and a signer for it (secret key, wallet, or
  custodial signer — whatever your x402 client supports).
- Node 18+ for the JS step (global `fetch`).

The flow in one line: **402 challenge → pay → retry with `X-PAYMENT`**.

---

## Step 1 — Trigger the 402 challenge

Call the endpoint with no payment attached. `amount` is USD, 1–500, default $10.

```bash
curl -i -X POST "https://api.lumenloop.com/v1/billing/topup?amount=25" \
  -H "Authorization: Bearer $LUMENLOOP_KEY"
```

```
HTTP/2 402
payment-required: eyJ4NDAyVmVyc2lvbiI6MSwiYWNjZXB0cyI6W3si…
```

This 402 is **not an error** — it is the x402 challenge. The
`payment-required` response header carries the payment requirements as
base64-encoded JSON.

## Step 2 — Decode the payment requirements

```bash
CHALLENGE=$(curl -si -X POST "https://api.lumenloop.com/v1/billing/topup?amount=25" \
  -H "Authorization: Bearer $LUMENLOOP_KEY" \
  | grep -i '^payment-required:' | cut -d' ' -f2 | tr -d '\r')

echo "$CHALLENGE" | base64 -d | jq .
```

You get an x402 requirements object — abridged and **illustrative** (field
values below are placeholders; the live header is the source of truth, and your
x402 client parses it for you):

```json
{
  "x402Version": 1,
  "accepts": [
    {
      "scheme": "exact",
      "network": "<stellar network identifier>",
      "asset": "<USDC asset identifier on Stellar>",
      "maxAmountRequired": "<$25 in the asset's smallest unit>",
      "payTo": "G…<LumenLoop's receiving address>",
      "resource": "https://api.lumenloop.com/v1/billing/topup?amount=25",
      "description": "LumenLoop credit top-up",
      "maxTimeoutSeconds": 300
    }
  ]
}
```

Read it as: pay **exactly** the requested amount of **USDC on Stellar** to
LumenLoop's receiving address (`payTo`), within the timeout, for this resource.

## Step 3 — Pay and retry with `@x402/fetch`

An x402 client automates steps 1–3: it sees the 402, reads the requirements,
signs the USDC payment with your Stellar signer, and retries the same request
with the `X-PAYMENT` header.

```js
// topup.mjs — top up LumenLoop credits with USDC on Stellar via x402.
// npm install @x402/fetch   (plus the Stellar signer adapter for your client)
import { wrapFetchWithPayment } from "@x402/fetch";

// The one environment-specific line: build a signer for the Stellar account
// that holds your USDC. Use the Stellar adapter your x402 client version
// ships or documents — any x402-compliant signer works.
import { stellarSignerFromSecret } from "./my-stellar-signer.js";
const signer = stellarSignerFromSecret(process.env.STELLAR_SECRET_KEY);

// Wrap fetch: on 402 it decodes payment-required, pays, retries with X-PAYMENT.
const fetchWithPayment = wrapFetchWithPayment(fetch, signer);

const res = await fetchWithPayment(
  "https://api.lumenloop.com/v1/billing/topup?amount=25",
  {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.LUMENLOOP_KEY}` },
  },
);

if (!res.ok) {
  throw new Error(`Top-up failed: ${res.status} ${await res.text()}`);
}

const { credited_usd, account_id } = await res.json();
console.log(`Credited $${credited_usd} to ${account_id}`);

// The settlement transaction is returned in a response header (base64 JSON).
const settlement = res.headers.get("x-payment-response");
console.log(
  "Settlement:",
  JSON.parse(Buffer.from(settlement, "base64").toString("utf8")),
);
```

```bash
LUMENLOOP_KEY=llmcp_… STELLAR_SECRET_KEY=S… node topup.mjs
# Credited $25 to <account_id>
```

## Step 4 — Verify the settlement

On success the response is HTTP 200 with body
`{ "credited_usd": 25, "account_id": "…" }`, and the **`X-PAYMENT-RESPONSE`**
header contains the settlement — base64-encoded JSON describing the settled
Stellar transaction that moved the USDC. Decode it (as in the script above) and
**store it as your receipt**; it ties the credit to an on-chain transaction.

**Idempotency**: replays of the same settlement are idempotent. If the
connection drops after payment and your client retries with the same
`X-PAYMENT`, the server recognizes the settlement and credits the account
exactly once — the retry returns success, never a double credit.

## Step 5 — Confirm the credit

```bash
curl -s https://api.lumenloop.com/v1/me \
  -H "Authorization: Bearer $LUMENLOOP_KEY" | jq .billing
```

`credits_total_usd` and `credits_remaining_usd` are both up by $25. A top-up
adds to the **allocated credits** pool only — it never changes
`research_quota_usd` (the recurring monthly quota) or `month_spend_usd`.
Remember the draw order: research spends the monthly quota first; credits are
drawn once the monthly allowance is exhausted (or exclusively, if the account
has no monthly quota).

---

## Errors

| Status | Meaning | What to do |
| --- | --- | --- |
| 402 **with** `payment-required` header | The normal x402 challenge — not an error | Pay and retry with `X-PAYMENT` (your x402 client does this) |
| 400 | Bad `amount` — outside 1–500 USD or not a number | Fix the `amount` query parameter |
| 401 | Missing, invalid, or expired credential | Check the `Authorization: Bearer` header |
| 402 **without** the challenge header (`payment_required` error envelope) | Your credential has no billing account | Contact LumenLoop (https://lumenloop.com) to enable partner research first |
| 409 | Conflict — the payment did not match the current billing state | Read the error `hint`; restart from a fresh 402 challenge |
| 503 | Payments are not enabled on this deployment | Use a budget request instead (`POST /v1/me/budget-request`) — see `../SKILL.md` |

## Notes

- x402 is an open standard (https://www.x402.org/) — nothing here is specific to
  `@x402/fetch`; any compliant client that can sign a Stellar USDC payment can
  complete this flow.
- Per-call range is $1–500; for larger or recurring needs, file a
  `kind: "quota"` budget request instead — see `../SKILL.md`.
- All API keys on the same account share the credited budget.
