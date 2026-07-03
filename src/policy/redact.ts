/**
 * Response redaction hook — scrub any accidental secret echo from data that
 * flows toward the sandbox/model (PLAN §4 result hygiene).
 *
 * Upstreams should never echo our keys, but "should" is not a control: this
 * is a cheap belt-and-braces pass over the SERIALIZED result. Values shorter
 * than 8 chars are ignored (would cause false-positive scrubbing).
 */

const MIN_SECRET_LENGTH = 8;
const REPLACEMENT = "[REDACTED]";

/**
 * Collect the redactable secret values from an env-like object. Every secret
 * the Worker holds is listed so an accidental upstream echo of ANY of them is
 * scrubbed before it reaches the sandbox/model (MCP_BEARER_TOKEN was retired
 * and is intentionally absent).
 *
 * ALGOLIA_APPLICATION_ID is DELIBERATELY absent: it is a semi-public app id
 * (appears in docs.stellar.org / hostnames by design), not a secret — the
 * refresh script even asserts it stays OUT of the generated inventory. Adding
 * it here would scrub a public identifier from legitimate results.
 */
const SECRET_ENV_NAMES = [
  "LUMENLOOP_API_KEY",
  "ALGOLIA_API_KEY",
  "MCP_ADMIN_TOKEN",
  "MCP_SERVER_SECRET",
  "WORKOS_API_KEY"
] as const;

export function secretsFromEnv(env: Record<string, unknown>): string[] {
  const out: string[] = [];
  for (const name of SECRET_ENV_NAMES) {
    const v = env[name];
    if (typeof v === "string" && v.length >= MIN_SECRET_LENGTH) out.push(v);
  }
  return out;
}

function scrubString(text: string, secrets: string[]): string {
  let out = text;
  for (const secret of secrets) {
    // split/join — no regex escaping worries for arbitrary key material.
    if (out.includes(secret)) out = out.split(secret).join(REPLACEMENT);
  }
  return out;
}

/**
 * Deep-redact a JSON-serializable value. Returns the value unchanged (same
 * reference) when no secret occurs anywhere in its serialization — the
 * common case stays allocation-free.
 */
export function redactSecrets<T>(value: T, secrets: string[]): T {
  if (secrets.length === 0) return value;
  if (typeof value === "string") {
    return scrubString(value, secrets) as unknown as T;
  }
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    return value; // non-serializable: nothing we can scan
  }
  if (serialized === undefined || !secrets.some((s) => serialized.includes(s))) return value;
  return JSON.parse(scrubString(serialized, secrets)) as T;
}
