/**
 * Policy guard — runs host-side BEFORE any adapter call (PLAN §4).
 *
 * Order matters and is deliberate:
 *  1. deny-list (policy.allow === false in the manifest — deny-list as DATA)
 *  2. metered gate (cost === "metered" refused with a clear message; the
 *     paid lumenloop.request_research stays off at launch, PLAN §8)
 *  3. arg validation against the entry's inputSchema
 *
 * All refusals come back as AdapterResult errors ({kind:"denied"} for policy,
 * {kind:"error"} for bad args) — nothing here ever throws to the sandbox.
 */
import type { CatalogEntry } from "../catalog/types.ts";
import { errResult, type AdapterResult } from "../adapters/types.ts";
import { validateArgs } from "./validate.ts";

export function guard(entry: CatalogEntry, args: unknown): AdapterResult | null {
  if (!entry.policy.allow) {
    return errResult({
      service: entry.service,
      kind: "denied",
      message: `${entry.id} is deny-listed: ${entry.policy.denyReason ?? "no reason recorded"}`
    });
  }

  if (entry.cost === "metered") {
    return errResult({
      service: entry.service,
      kind: "denied",
      message: `${entry.id} is a metered (paid) operation and is disabled on this server. No charge was made. Free alternatives: lumenloop.list_my_research (existing runs), lumenloop.search_content_semantic (corpus search).`
    });
  }

  const issues = validateArgs(entry.inputSchema, args);
  if (issues.length > 0) {
    return errResult({
      service: entry.service,
      kind: "error",
      message: `invalid arguments for ${entry.id} — no call was made`,
      details: issues,
      hint: "Fix the listed fields and retry; the operation's exact input schema is in its `search` hit signature."
    });
  }

  return null; // pass
}
