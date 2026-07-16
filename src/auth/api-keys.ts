import { timingSafeEqualBytes } from "./timing";

export const API_KEY_PREFIX = "raven:api-key:v1:";
export const API_KEY_NAME_PATTERN = /^[a-z][a-z0-9-]{0,31}$/;
export const API_KEY_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;

export function apiKeyKvKey(name: string): string {
  return `${API_KEY_PREFIX}${name}`;
}

export function parseApiKeyCredential(request: Request): { name: string; token: string } | undefined {
  const authorization = request.headers.get("authorization");
  if (!authorization) return undefined;
  const match = /^Bearer +([^:]+):([^:\s]+)$/i.exec(authorization);
  if (!match) return undefined;
  const [, name, token] = match;
  if (!name || !token || !API_KEY_NAME_PATTERN.test(name) || !API_KEY_TOKEN_PATTERN.test(token)) {
    return undefined;
  }
  return { name, token };
}

export async function authenticateApiKey(
  request: Request,
  env: Pick<Env, "OAUTH_KV">
): Promise<string | undefined> {
  const credential = parseApiKeyCredential(request);
  if (!credential) return undefined;
  try {
    const [stored, actual] = await Promise.all([
      env.OAUTH_KV.get(apiKeyKvKey(credential.name)),
      sha256Bytes(credential.token)
    ]);
    if (!stored || !DIGEST_PATTERN.test(stored)) return undefined;
    return timingSafeEqualBytes(hexBytes(stored), actual) ? credential.name : undefined;
  } catch {
    return undefined;
  }
}

async function sha256Bytes(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function hexBytes(value: string): Uint8Array {
  return Uint8Array.from(value.match(/../g) ?? [], (byte) => Number.parseInt(byte, 16));
}
