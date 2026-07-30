#!/usr/bin/env node
/**
 * classify-canary.mjs — turn a `/health/skills` response into a drift enum.
 *
 * Lives in a file rather than inline in refresh.yml because logic embedded in
 * YAML cannot be tested, and the first draft of this classifier was a
 * `node -e` one-liner using top-level `return` — a SyntaxError that would have
 * crashed on every scheduled run. It failed closed, so nothing would have been
 * misreported; it also would never once have done its job. A workflow step that
 * silently never works is the most expensive kind of monitoring.
 *
 * Usage: node scripts/classify-canary.mjs <http-status> <body-file>
 * Prints one of: clean | failing | stale | error
 *
 * The distinction that matters, and the reason this is a four-state enum:
 *   clean   — a fresh, structurally valid, ok verdict.
 *   failing — a fresh, structurally valid, NOT-ok verdict. The only state that
 *             may claim production retrieval is broken.
 *   stale   — a verdict too old to describe now, whatever its boolean. Proves
 *             the DETECTOR stopped; says nothing about retrieval.
 *   error   — this check could not reach a verdict at all (unreachable
 *             endpoint, malformed record, no record yet, status/body
 *             disagreement). Says nothing about anything.
 * Only `failing` gets the outage heading. Collapsing the last three into it is
 * how a monitor cries wolf; collapsing them into `clean` is how it lies.
 */
import { readFileSync } from "node:fs";

/** Cron is hourly; three missed runs means the detector itself is down. */
export const STALE_AFTER_MS = 180 * 60 * 1000;

/**
 * @param {{ status: string, body: string, now: number }} input
 * @returns {"clean" | "failing" | "stale" | "error"}
 */
export function classifyCanary({ status, body, now }) {
  // Only the two statuses the endpoint actually returns are interpretable. A
  // 000 (curl failed), a 502 from the edge, or an HTML error page is this
  // check's problem, not evidence about production.
  if (status !== "200" && status !== "503") return "error";

  let verdict;
  try {
    verdict = JSON.parse(body);
  } catch {
    return "error";
  }
  if (!verdict || typeof verdict !== "object" || Array.isArray(verdict)) return "error";

  // A structurally invalid record proves nothing about production. In
  // particular the endpoint answers 503 with `{ok:false, reason:…}` when NO
  // verdict has ever been stored or the KV read threw — which is true on every
  // first deploy, before the first cron fires. Reading `ok !== true` as
  // "failing" therefore announced a live outage the moment this shipped.
  // Shape first, verdict second.
  if (typeof verdict.ok !== "boolean" || typeof verdict.checkedAt !== "string") return "error";
  const checkedAt = Date.parse(verdict.checkedAt);
  if (!Number.isFinite(checkedAt)) return "error";

  // The endpoint's own contract. Disagreement means something between the
  // Worker and here rewrote one of them, so neither is trustworthy.
  if ((status === "200") !== (verdict.ok === true)) return "error";

  // AGE BEFORE VERDICT, for both booleans. An old `ok:false` is not evidence
  // that retrieval is failing *now*, and an old `ok:true` is not evidence that
  // it is fine — both only prove the detector stopped. Conflating stale with
  // failing is what makes a monitor lie in the reassuring direction.
  const age = now - checkedAt;
  // A verdict from the future means clock skew or a garbled field; the age is
  // not usable, so do not derive a domain state from it. Small skew between
  // the Worker and the runner is ordinary and tolerated.
  if (age < -5 * 60 * 1000) return "error";
  if (age > STALE_AFTER_MS) return "stale";

  return verdict.ok ? "clean" : "failing";
}

// CLI: argv[2] = http status, argv[3] = path to the response body.
if (process.argv[1] && process.argv[1].endsWith("classify-canary.mjs")) {
  const status = process.argv[2] ?? "";
  const bodyPath = process.argv[3] ?? "";
  let body = "";
  try {
    body = readFileSync(bodyPath, "utf8");
  } catch {
    body = "";
  }
  console.log(classifyCanary({ status, body, now: Date.now() }));
}
