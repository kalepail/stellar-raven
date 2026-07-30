/**
 * Skill source — live retrieval of skill bodies from upstream, pinned.
 *
 * Skill markdown is NOT vendored into this repo and NOT shipped inside the
 * Worker bundle. Each catalog skill/section entry carries
 * `transport: { type: "file", url, sha, sha256 }` where `url` is a
 * raw.githubusercontent.com URL at the commit pinned in
 * ecosystem-skills/MANIFEST.json, `sha` is that file's git blob hash from the
 * same pinned tree, and `sha256` is a SHA-256 over the raw bytes recorded by
 * the catalog build. This module turns that into text.
 *
 * Three properties the vendored copy used to give us, kept:
 *
 * 1. **Immutability.** The URL names a commit, never a branch, so upstream
 *    edits cannot change what this server serves. Re-pinning stays a reviewed,
 *    committed act (`ecosystem-skills/update.sh` prints the body diff, and
 *    ecosystem-skills/PIN-REVIEW.md records the attestation) — skills are
 *    prompt input, so an upstream edit must never reach the model without a
 *    human reading the diff.
 * 2. **Integrity.** Every fetched body is verified before it is decoded and
 *    served. SHA-256 is the SECURITY check: git's SHA-1 has practical
 *    chosen-prefix collisions, so it is provenance (it ties bytes to the git
 *    object the reviewer saw), not an adversarial boundary. Both must match;
 *    bytes that fail either are refused, not served.
 * 3. **Exposure hygiene.** The retired-skill scrub that used to run at bundle
 *    time now runs on every served body (same implementation the builders
 *    use), so a leak cannot ride in on live content.
 *
 * Caching: an in-isolate memo keyed by (url, sha256) in front of the colo-wide
 * Cache API. Cached bytes are re-verified on every hit — the cache is a
 * transport, not a trust boundary — and cache WRITES are best-effort, so a
 * cache outage can never turn an already-verified body into a failed read.
 */
import { scrubRetiredSkillRefs } from "./scrub.ts";

/** The pinned identity of one file. `sha` is the git blob hash (provenance);
 *  `sha256` is the security digest over the same raw bytes. */
export type SkillPin = { url: string; sha: string; sha256: string };

/** Resolves a pin to verified, scrubbed markdown. Rejects on transport
 *  failure, either hash mismatch, or a scrub drift-guard trip. */
export type SkillSource = (pin: SkillPin) => Promise<string>;

/** Upstream is small markdown over a CDN; a slow fetch is a failed fetch. */
const FETCH_TIMEOUT_MS = 8000;

/**
 * Ceiling for everything one skill.read does, across every file it touches.
 * Deliberately under the executor's 60s wall clock: a slow upstream must fail
 * as a `skills` error envelope, never by killing the whole execute run.
 */
export const SKILL_READ_DEADLINE_MS = 20_000;

/** Immutable by construction (commit-pinned URLs) — cache for a year. */
const CACHE_CONTROL = "public, max-age=31536000, immutable";

/** "<url>\n<sha256>" -> in-flight or settled body. Keyed by the full verified
 *  identity, never the URL alone: a second entry pinning the same URL to
 *  different bytes must re-verify rather than inherit the first one's body. */
const memo = new Map<string, Promise<string>>();

const memoKey = (pin: SkillPin) => `${pin.url}\n${pin.sha256}`;

/** Test seam: drop memoized bodies so a test can observe fetch behavior. */
export function resetSkillSourceMemo(): void {
  memo.clear();
}

function hex(digest: ArrayBuffer): string {
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** git blob hash of raw bytes — sha1("blob <len>\0" + content), the exact id
 *  ecosystem-skills/MANIFEST.json records per file. Provenance only. */
async function gitBlobSha(bytes: ArrayBuffer): Promise<string> {
  const header = new TextEncoder().encode(`blob ${bytes.byteLength}\0`);
  const framed = new Uint8Array(header.byteLength + bytes.byteLength);
  framed.set(header, 0);
  framed.set(new Uint8Array(bytes), header.byteLength);
  return hex(await crypto.subtle.digest("SHA-1", framed));
}

/** Both digests must match the pin, or the bytes are not served. */
async function verify(bytes: ArrayBuffer, pin: SkillPin): Promise<void> {
  const sha256 = hex(await crypto.subtle.digest("SHA-256", bytes));
  if (sha256 !== pin.sha256) {
    throw new Error(
      `integrity check failed for ${pin.url}: expected sha256 ${pin.sha256}, got ${sha256} — ` +
        `upstream bytes differ from the pinned tree; nothing was served`
    );
  }
  const blob = await gitBlobSha(bytes);
  if (blob !== pin.sha) {
    throw new Error(
      `provenance check failed for ${pin.url}: expected git blob ${pin.sha}, got ${blob} — ` +
        `bytes match sha256 but not the pinned git object; nothing was served`
    );
  }
}

/** The colo cache, or undefined outside a Workers runtime (unit tests). */
function defaultCache(): Cache | undefined {
  return (globalThis as { caches?: { default?: Cache } }).caches?.default;
}

async function fetchVerified(
  pin: SkillPin,
  fetchImpl: typeof fetch
): Promise<{ text: string; bytes: ArrayBuffer }> {
  let lastError = "";
  // One retry: a single transient CDN blip should not cost the caller a turn.
  for (let attempt = 0; attempt < 2; attempt++) {
    let res: Response;
    try {
      res = await fetchImpl(pin.url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { accept: "text/plain" }
      });
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      continue;
    }
    if (!res.ok) {
      lastError = `HTTP ${res.status}`;
      // 4xx means the pin is wrong (moved/deleted upstream) — retrying an
      // immutable URL cannot fix that, so fail on the first answer.
      if (res.status < 500) break;
      continue;
    }
    const bytes = await res.arrayBuffer();
    await verify(bytes, pin);
    return { text: new TextDecoder().decode(bytes), bytes };
  }
  throw new Error(`could not fetch ${pin.url}: ${lastError}`);
}

export type SkillSourceDeps = {
  /** Test seam; production uses global fetch (host-side — the execute sandbox
   *  itself still has no network). */
  fetchImpl?: typeof fetch;
  /** Test seam; production uses `caches.default`. Returning undefined disables
   *  the colo cache entirely, which is what happens under plain Node. */
  cacheImpl?: () => Cache | undefined;
};

/**
 * The default source: memo -> Cache API -> upstream, verified and scrubbed.
 */
export function createSkillSource(deps: SkillSourceDeps = {}): SkillSource {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const getCache = deps.cacheImpl ?? defaultCache;
  return (pin) => {
    const key = memoKey(pin);
    const hit = memo.get(key);
    if (hit) return hit;
    const pending = (async () => {
      const cache = getCache();
      const request = new Request(pin.url, { headers: { accept: "text/plain" } });
      // Cache reads are best-effort AND untrusted: a hit is re-verified, and a
      // broken cache backend must not fail a read it could not have served.
      try {
        const cached = await cache?.match(request);
        if (cached) {
          const bytes = await cached.arrayBuffer();
          await verify(bytes, pin);
          return scrubRetiredSkillRefs(new TextDecoder().decode(bytes), pin.url);
        }
      } catch {
        // fall through to upstream
      }
      const { text, bytes } = await fetchVerified(pin, fetchImpl);
      // Cache writes are best-effort: bytes are already fetched and verified,
      // so a cache outage must never turn a good read into a failed one.
      try {
        await cache?.put(
          request,
          new Response(bytes, {
            headers: {
              "content-type": "text/markdown; charset=utf-8",
              "cache-control": CACHE_CONTROL
            }
          })
        );
      } catch {
        // best-effort
      }
      return scrubRetiredSkillRefs(text, pin.url);
    })();
    // A failed fetch must not poison the isolate for the rest of its life.
    const wrapped = pending.catch((e: unknown) => {
      memo.delete(key);
      throw e;
    });
    memo.set(key, wrapped);
    return wrapped;
  };
}
