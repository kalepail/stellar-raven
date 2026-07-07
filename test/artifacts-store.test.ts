import { describe, expect, it } from "vitest";
import {
  ARTIFACT_MAX_BYTES,
  ARTIFACT_TTL_MS,
  info,
  put,
  read,
  type ArtifactPutInput
} from "../src/artifacts/store.ts";

type Stored = {
  body: string;
  customMetadata: Record<string, string>;
  httpMetadata?: Headers | R2HTTPMetadata;
};

class MemoryR2Object {
  constructor(
    readonly key: string,
    private readonly body: string,
    readonly customMetadata: Record<string, string>,
    readonly httpMetadata?: Headers | R2HTTPMetadata
  ) {}

  async text(): Promise<string> {
    return this.body;
  }
}

class MemoryR2Bucket {
  readonly objects = new Map<string, Stored>();

  async put(key: string, body: string, options?: R2PutOptions): Promise<R2Object> {
    const customMetadata = options?.customMetadata ? { ...options.customMetadata } : {};
    this.objects.set(key, { body, customMetadata, httpMetadata: options?.httpMetadata });
    return new MemoryR2Object(key, body, customMetadata, options?.httpMetadata) as unknown as R2Object;
  }

  async get(key: string): Promise<R2ObjectBody | null> {
    const stored = this.objects.get(key);
    if (!stored) return null;
    return new MemoryR2Object(
      key,
      stored.body,
      stored.customMetadata,
      stored.httpMetadata
    ) as unknown as R2ObjectBody;
  }

  async head(key: string): Promise<R2Object | null> {
    const stored = this.objects.get(key);
    if (!stored) return null;
    return new MemoryR2Object(
      key,
      stored.body,
      stored.customMetadata,
      stored.httpMetadata
    ) as unknown as R2Object;
  }
}

function input(overrides: Partial<ArtifactPutInput> = {}): ArtifactPutInput {
  return {
    body: JSON.stringify({ rows: [{ id: 1, name: "Blend" }] }),
    mime: "application/json",
    requestId: "req-123",
    rayId: "ray-abc",
    capTokens: 6000,
    originalChars: 38,
    opLedger: [{ op: "scout.getProject", status: "ok", ms: 42 }],
    catalogGeneratedAt: "2026-07-07T00:00:00.000Z",
    now: new Date("2026-07-07T12:00:00.000Z"),
    ...overrides
  };
}

describe("artifact store", () => {
  it("roundtrips JSON, strings, undefined, and fallback text without guessing", async () => {
    const bucket = new MemoryR2Bucket() as unknown as R2Bucket;
    const owner = "oauth-peppered-subject";

    const jsonPut = await put(bucket, owner, input());
    if (!jsonPut.ok) throw new Error("unexpected skip");
    await expect(read(bucket, owner, jsonPut.artifact.id)).resolves.toMatchObject({
      ok: true,
      value: { rows: [{ id: 1, name: "Blend" }] }
    });

    const stringPut = await put(
      bucket,
      owner,
      input({ body: "plain string result", mime: "text/plain; charset=utf-8" })
    );
    if (!stringPut.ok) throw new Error("unexpected skip");
    await expect(read(bucket, owner, stringPut.artifact.id)).resolves.toMatchObject({
      ok: true,
      value: "plain string result"
    });

    const undefinedPut = await put(
      bucket,
      owner,
      input({ body: "undefined", mime: "application/x.raven.undefined" })
    );
    if (!undefinedPut.ok) throw new Error("unexpected skip");
    const undefinedRead = await read(bucket, owner, undefinedPut.artifact.id);
    if (!undefinedRead.ok) throw new Error("expected undefined artifact read");
    expect(undefinedRead.value).toBeUndefined();

    const fallbackPut = await put(
      bucket,
      owner,
      input({
        body: "[unserializable result: cyclic object value]",
        mime: "text/plain; charset=utf-8"
      })
    );
    if (!fallbackPut.ok) throw new Error("unexpected skip");
    await expect(read(bucket, owner, fallbackPut.artifact.id)).resolves.toMatchObject({
      ok: true,
      value: "[unserializable result: cyclic object value]"
    });
  });

  it("binds keys to the owner hash and never stores the raw owner", async () => {
    const bucket = new MemoryR2Bucket() as unknown as R2Bucket;
    const owner = "peppered-oauth-subject-123";
    const written = await put(bucket, owner, input());
    if (!written.ok) throw new Error("unexpected skip");

    expect(written.artifact.key).toMatch(/^art\/[0-9a-f]{16}\/[0-9a-f-]{36}$/);
    expect(written.artifact.key).not.toContain(owner);
    await expect(read(bucket, "different-peppered-subject", written.artifact.id)).resolves.toEqual({
      ok: false,
      error: { kind: "not-found" }
    });
  });

  it("treats expired artifacts as the same not-found result", async () => {
    const bucket = new MemoryR2Bucket() as unknown as R2Bucket;
    const createdAt = new Date("2026-07-07T12:00:00.000Z");
    const written = await put(bucket, "owner", input({ now: createdAt }));
    if (!written.ok) throw new Error("unexpected skip");

    const expiredAt = new Date(createdAt.getTime() + ARTIFACT_TTL_MS + 1);
    await expect(read(bucket, "owner", written.artifact.id, expiredAt)).resolves.toEqual({
      ok: false,
      error: { kind: "not-found" }
    });
    await expect(info(bucket, "owner", written.artifact.id, expiredAt)).resolves.toEqual({
      ok: false,
      error: { kind: "not-found" }
    });
  });

  it("rejects missing or empty owners", async () => {
    const bucket = new MemoryR2Bucket() as unknown as R2Bucket;
    await expect(put(bucket, undefined, input())).rejects.toThrow(
      "artifact owner must be a non-empty OAuth subject"
    );
    await expect(read(bucket, "", crypto.randomUUID())).rejects.toThrow(
      "artifact owner must be a non-empty OAuth subject"
    );
    await expect(info(bucket, "   ", crypto.randomUUID())).rejects.toThrow(
      "artifact owner must be a non-empty OAuth subject"
    );
  });

  it("skips oversize puts without throwing", async () => {
    const bucket = new MemoryR2Bucket() as unknown as R2Bucket;
    const result = await put(
      bucket,
      "owner",
      input({ body: "x".repeat(ARTIFACT_MAX_BYTES + 1), mime: "text/plain; charset=utf-8" })
    );

    expect(result).toEqual({
      ok: false,
      skipped: "size-cap",
      bytes: ARTIFACT_MAX_BYTES + 1,
      maxBytes: ARTIFACT_MAX_BYTES
    });
  });

  it("writes complete provenance metadata without reading the body", async () => {
    const bucket = new MemoryR2Bucket() as unknown as R2Bucket;
    const written = await put(bucket, "owner", input());
    if (!written.ok) throw new Error("unexpected skip");

    const metadata = await info(bucket, "owner", written.artifact.id);
    expect(metadata).toEqual({ ok: true, artifact: written.artifact });
    if (!metadata.ok) throw new Error("expected info");
    expect(metadata.artifact).toMatchObject({
      id: written.artifact.id,
      createdAt: "2026-07-07T12:00:00.000Z",
      expiresAt: "2026-07-14T12:00:00.000Z",
      bytes: input().body.length,
      mime: "application/json",
      requestId: "req-123",
      rayId: "ray-abc",
      capTokens: 6000,
      originalChars: 38,
      opLedger: JSON.stringify([{ op: "scout.getProject", status: "ok", ms: 42 }]),
      catalogGeneratedAt: "2026-07-07T00:00:00.000Z"
    });
    expect(metadata.artifact.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("makes missing, wrong-owner, expired, and invalid ids indistinguishable", async () => {
    const bucket = new MemoryR2Bucket() as unknown as R2Bucket;
    const written = await put(bucket, "owner", input());
    if (!written.ok) throw new Error("unexpected skip");
    const notFound = { ok: false, error: { kind: "not-found" } };

    await expect(read(bucket, "owner", crypto.randomUUID())).resolves.toEqual(notFound);
    await expect(read(bucket, "other-owner", written.artifact.id)).resolves.toEqual(notFound);
    await expect(
      read(bucket, "owner", written.artifact.id, new Date("2026-07-20T00:00:00.000Z"))
    ).resolves.toEqual(notFound);
    await expect(read(bucket, "owner", "../bad")).resolves.toEqual(notFound);
  });
});
