/**
 * Host-owned timing context attached once to each execute result.
 *
 * `observedAt` is the time this host executed the request. It is deliberately
 * separate from any source record, publication, or event date in the result.
 * `catalogGeneratedAt`, when present, is the build time of the loaded catalog
 * snapshot rather than a claim about returned service data.
 */
export type ObservationContext = {
  observedAt: string;
  catalogGeneratedAt?: string;
};

/** Compact data-only rendering shared by MCP and playground execute results. */
export function observationContextBlock(context: ObservationContext | undefined): string {
  return context ? `\n\n--- OBSERVATION CONTEXT ---\n${JSON.stringify(context)}` : "";
}
