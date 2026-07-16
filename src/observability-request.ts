import { hashPrefix } from "./observability";

export type McpAuthMode = "oauth" | "api-key" | "dev-bypass";

export type McpRequestObservability = {
  accessMode: McpAuthMode;
  apiKeyName?: string;
  subjectHash: string | null;
  clientHash: string | null;
  rayId: string | null;
};

type McpAuthProps = {
  subject?: unknown;
  clientId?: unknown;
};

const CLIENT_HASH_MESSAGE_PREFIX = "raven:mcp-client:v1:";

export function authSubjectFromProps(props: unknown): string | undefined {
  if (props === null || typeof props !== "object") return undefined;
  const subject = (props as McpAuthProps).subject;
  return typeof subject === "string" && subject.length > 0 ? subject : undefined;
}

function authClientIdFromProps(props: unknown): string | undefined {
  if (props === null || typeof props !== "object") return undefined;
  const clientId = (props as McpAuthProps).clientId;
  if (typeof clientId !== "string") return undefined;
  const normalized = clientId.trim();
  return normalized.length > 0 ? normalized : undefined;
}

/** Cloudflare joins use the Ray id without the trailing colo (for example, `abc123`, not `abc123-ATL`). */
export function normalizeRayId(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;
  return normalized.split("-", 1)[0] || null;
}

/**
 * Privacy-safe client join key. OAuth/CIMD client ids can be public URLs, so
 * use a secret-keyed, versioned, domain-separated HMAC rather than a bare hash.
 */
export async function telemetryClientHash(
  clientId: string | undefined,
  serverSecret: string | undefined
): Promise<string | null> {
  if (!clientId || !serverSecret) return null;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(serverSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${CLIENT_HASH_MESSAGE_PREFIX}${clientId}`)
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

export async function buildMcpRequestObservability(input: {
  accessMode: McpAuthMode;
  apiKeyName?: string;
  props?: unknown;
  rayId?: string | null;
  serverSecret?: string;
}): Promise<McpRequestObservability> {
  const subject = authSubjectFromProps(input.props);
  const clientId = authClientIdFromProps(input.props);
  return {
    accessMode: input.accessMode,
    ...(input.apiKeyName ? { apiKeyName: input.apiKeyName } : {}),
    // Keep this identical to artifact ownerHash and playground subjectHash.
    subjectHash: subject ? await hashPrefix(subject) : null,
    clientHash: await telemetryClientHash(clientId, input.serverSecret),
    rayId: normalizeRayId(input.rayId)
  };
}
