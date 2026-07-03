/**
 * Structured event logging for Workers Logs (observability.enabled in
 * wrangler.jsonc). One JSON line per event via console.log; the platform
 * groups lines by invocation, so every event of one /mcp request — auth mode,
 * tool call, each sandbox op — reads as a single correlated trace in the
 * dashboard (Workers → Logs) or `wrangler tail`.
 *
 * Discipline:
 *  - `evt` names the event; keep the rest FLAT and SMALL (previews, counts,
 *    durations — never whole payloads).
 *  - Never log secret values. Model-authored text (queries, execute code) is
 *    fine and is the point: it's what future eval/debugging needs. Adapter
 *    results are already secret-redacted before they reach any logging site.
 *
 * Second channel: trace spans (observability.traces in wrangler.jsonc).
 * Handler + host-side fetches are auto-instrumented; the sandbox boundary has
 * a custom span in src/executor/run.ts (Worker Loader isn't auto-traced).
 * Rule of thumb: logEvent for facts to query later (what happened), spans for
 * timing attribution (where the time went). Same no-payload discipline; spans
 * bill from the same event quota as logs (research/observability-cloudflare.md).
 */

/** Truncation caps — previews, not payloads. */
export const CODE_LOG_MAX = 4_000;
export const PREVIEW_LOG_MAX = 300;

export function logEvent(evt: string, fields: Record<string, unknown>): void {
  try {
    console.log(JSON.stringify({ evt, ...fields }));
  } catch {
    // Never let telemetry break the request path.
  }
}

export function preview(text: string, max = PREVIEW_LOG_MAX): string {
  return text.length > max ? `${text.slice(0, max)}…[+${text.length - max} chars]` : text;
}
