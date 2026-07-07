/**
 * Auth-bound R2 artifact store for oversized execute result payloads.
 *
 * Pure host module: no executor/server imports, no listing surface, no public
 * URLs. Callers pass the OAuth peppered subject as `owner`; admin/dev bypasses
 * should pass no owner and therefore get no artifact.
 */

export const ARTIFACT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const ARTIFACT_MAX_BYTES = 2 * 1024 * 1024;
export const ARTIFACT_KEY_PREFIX = "art";

const OWNER_HASH_HEX_CHARS = 16;
const ARTIFACT_NOT_FOUND = { ok: false as const, error: { kind: "not-found" as const } };
const UTF8 = "utf-8";

export type ArtifactMime = "application/json" | "text/plain; charset=utf-8" | "application/x.raven.undefined";

export type ArtifactStoredBody = {
  encoding: typeof UTF8;
  mime: ArtifactMime;
  /** Exact post-redaction serialized result string, encoded as UTF-8. */
  body: string;
};

export type ArtifactOperationSummary = {
  op: string;
  status: "ok" | "error" | "soft-empty";
  ms?: number;
};

export type ArtifactPutInput = {
  /**
   * Exact post-redaction serialized result string. This is the string that
   * would otherwise be truncated at the model boundary.
   */
  body: string;
  /**
   * Controls deterministic reconstruction on read. JSON bodies are parsed;
   * text bodies are returned as strings; undefined bodies return undefined.
   */
  mime: ArtifactMime;
  requestId?: string;
  rayId?: string;
  capTokens: number;
  originalChars: number;
  opLedger: ArtifactOperationSummary[] | string;
  catalogGeneratedAt: string;
  now?: Date;
};

export type ArtifactMetadata = {
  id: string;
  key: string;
  createdAt: string;
  expiresAt: string;
  bytes: number;
  sha256: string;
  mime: ArtifactMime;
  requestId: string;
  rayId: string;
  capTokens: number;
  originalChars: number;
  opLedger: string;
  catalogGeneratedAt: string;
};

export type ArtifactPutResult =
  | { ok: true; artifact: ArtifactMetadata }
  | { ok: false; skipped: "size-cap"; bytes: number; maxBytes: number };

export type ArtifactInfoResult = { ok: true; artifact: ArtifactMetadata } | typeof ARTIFACT_NOT_FOUND;

export type ArtifactReadResult =
  | { ok: true; artifact: ArtifactMetadata; value: unknown }
  | typeof ARTIFACT_NOT_FOUND
  | { ok: false; error: { kind: "error"; message: string } };

class ArtifactOwnerError extends Error {
  constructor() {
    super("artifact owner must be a non-empty OAuth subject");
    this.name = "ArtifactOwnerError";
  }
}

function requireOwner(owner: unknown): string {
  if (typeof owner !== "string" || owner.trim().length === 0) {
    throw new ArtifactOwnerError();
  }
  return owner;
}

function isArtifactId(id: unknown): id is string {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  );
}

function hex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(text: string): Promise<string> {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

async function ownerHash(owner: string): Promise<string> {
  return (await sha256Hex(owner)).slice(0, OWNER_HASH_HEX_CHARS);
}

async function keyFor(owner: string, id: string): Promise<string> {
  return `${ARTIFACT_KEY_PREFIX}/${await ownerHash(owner)}/${id}`;
}

function bytesOf(text: string): number {
  return new TextEncoder().encode(text).byteLength;
}

function metadataFromCustom(id: string, key: string, meta: Record<string, string> | undefined): ArtifactMetadata | null {
  if (!meta) return null;
  const {
    createdAt,
    expiresAt,
    bytes,
    sha256,
    mime,
    requestId = "",
    rayId = "",
    capTokens,
    originalChars,
    opLedger,
    catalogGeneratedAt
  } = meta;
  if (
    !createdAt ||
    !expiresAt ||
    !bytes ||
    !sha256 ||
    !mime ||
    !capTokens ||
    !originalChars ||
    !opLedger ||
    !catalogGeneratedAt
  ) {
    return null;
  }
  if (
    mime !== "application/json" &&
    mime !== "text/plain; charset=utf-8" &&
    mime !== "application/x.raven.undefined"
  ) {
    return null;
  }
  return {
    id,
    key,
    createdAt,
    expiresAt,
    bytes: Number(bytes),
    sha256,
    mime,
    requestId,
    rayId,
    capTokens: Number(capTokens),
    originalChars: Number(originalChars),
    opLedger,
    catalogGeneratedAt
  };
}

function customMetadata(input: ArtifactPutInput, id: string, key: string, createdAt: Date, bytes: number, sha256: string): ArtifactMetadata {
  const expiresAt = new Date(createdAt.getTime() + ARTIFACT_TTL_MS).toISOString();
  return {
    id,
    key,
    createdAt: createdAt.toISOString(),
    expiresAt,
    bytes,
    sha256,
    mime: input.mime,
    requestId: input.requestId ?? "",
    rayId: input.rayId ?? "",
    capTokens: input.capTokens,
    originalChars: input.originalChars,
    opLedger: typeof input.opLedger === "string" ? input.opLedger : JSON.stringify(input.opLedger),
    catalogGeneratedAt: input.catalogGeneratedAt
  };
}

function toR2Metadata(meta: ArtifactMetadata): Record<string, string> {
  return {
    createdAt: meta.createdAt,
    expiresAt: meta.expiresAt,
    bytes: String(meta.bytes),
    sha256: meta.sha256,
    mime: meta.mime,
    requestId: meta.requestId,
    rayId: meta.rayId,
    capTokens: String(meta.capTokens),
    originalChars: String(meta.originalChars),
    opLedger: meta.opLedger,
    catalogGeneratedAt: meta.catalogGeneratedAt
  };
}

function expired(meta: ArtifactMetadata, now: Date): boolean {
  const expiresAt = Date.parse(meta.expiresAt);
  return !Number.isFinite(expiresAt) || expiresAt <= now.getTime();
}

function reconstruct(stored: ArtifactStoredBody): unknown {
  if (stored.encoding !== UTF8) {
    throw new Error(`unsupported artifact encoding: ${stored.encoding}`);
  }
  if (stored.mime === "application/x.raven.undefined") return undefined;
  if (stored.mime === "application/json") return JSON.parse(stored.body);
  return stored.body;
}

export async function put(
  bucket: R2Bucket,
  owner: unknown,
  input: ArtifactPutInput
): Promise<ArtifactPutResult> {
  const subject = requireOwner(owner);
  const bytes = bytesOf(input.body);
  if (bytes > ARTIFACT_MAX_BYTES) {
    return { ok: false, skipped: "size-cap", bytes, maxBytes: ARTIFACT_MAX_BYTES };
  }

  const id = crypto.randomUUID();
  const key = await keyFor(subject, id);
  if (await bucket.head(key)) {
    throw new Error("artifact id collision");
  }

  const sha256 = await sha256Hex(input.body);
  const now = input.now ?? new Date();
  const meta = customMetadata(input, id, key, now, bytes, sha256);
  const stored: ArtifactStoredBody = { encoding: UTF8, mime: input.mime, body: input.body };
  await bucket.put(key, JSON.stringify(stored), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
    customMetadata: toR2Metadata(meta)
  });
  return { ok: true, artifact: meta };
}

export async function info(
  bucket: R2Bucket,
  owner: unknown,
  id: unknown,
  now = new Date()
): Promise<ArtifactInfoResult> {
  const subject = requireOwner(owner);
  if (!isArtifactId(id)) return ARTIFACT_NOT_FOUND;
  const key = await keyFor(subject, id);
  const object = await bucket.head(key);
  const meta = metadataFromCustom(id, key, object?.customMetadata);
  if (!meta || expired(meta, now)) return ARTIFACT_NOT_FOUND;
  return { ok: true, artifact: meta };
}

export async function read(
  bucket: R2Bucket,
  owner: unknown,
  id: unknown,
  now = new Date()
): Promise<ArtifactReadResult> {
  const subject = requireOwner(owner);
  if (!isArtifactId(id)) return ARTIFACT_NOT_FOUND;
  const key = await keyFor(subject, id);
  const object = await bucket.get(key);
  const meta = metadataFromCustom(id, key, object?.customMetadata);
  if (!object || !meta || expired(meta, now)) return ARTIFACT_NOT_FOUND;

  try {
    const stored = JSON.parse(await object.text()) as ArtifactStoredBody;
    return { ok: true, artifact: meta, value: reconstruct(stored) };
  } catch (e) {
    return {
      ok: false,
      error: { kind: "error", message: e instanceof Error ? e.message : String(e) }
    };
  }
}
