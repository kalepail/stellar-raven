/**
 * Skill source — live retrieval of skill bodies from upstream, pinned.
 *
 * Skill markdown is NOT vendored into this repo and NOT shipped inside the
 * Worker bundle. Each catalog skill/section entry carries
 * `transport: { type: "file", url, sha }` where `url` is a
 * raw.githubusercontent.com URL at the commit pinned in
 * ecosystem-skills/MANIFEST.json and `sha` is that file's git blob hash from
 * the same pinned tree. This module turns that pair into text.
 *
 * Three properties the vendored copy used to give us, kept:
 *
 * 1. **Immutability.** The URL names a commit, never a branch, so upstream
 *    edits cannot change what this server serves. Re-pinning stays a reviewed,
 *    committed act (`ecosystem-skills/update.sh` + a catalog rebuild) — skills
 *    are prompt input, so an upstream edit must never reach the model without
 *    a human reading the diff.
 * 2. **Integrity.** Every fetched body is verified against the pinned git blob
 *    hash before it is decoded and served. Bytes that do not match the
 *    reviewed tree are refused, not served — so a compromised or
 *    mis-configured CDN cannot substitute prompt content.
 * 3. **Exposure hygiene.** The retired-skill scrub that used to run at bundle
 *    time now runs on every served body (same implementation the builders
 *    use), so a leak cannot ride in on live content.
 *
 * Caching: an in-isolate memo (same request and warm-isolate reuse) in front
 * of the colo-wide Cache API. Both are keyed by the commit-pinned URL, which
 * is immutable, so entries never need invalidating.
 */
import { scrubRetiredSkillRefs } from "./scrub.ts";

/** Resolves a pinned (url, sha) pair to verified, scrubbed markdown. Rejects
 *  on transport failure, hash mismatch, or a scrub drift-guard trip. */
export type SkillSource = (url: string, sha: string) => Promise<string>;

/** Upstream is small markdown over a CDN; a slow fetch is a failed fetch. */
const FETCH_TIMEOUT_MS = 8000;

/** Immutable by construction (commit-pinned URLs) — cache for a year. */
const CACHE_CONTROL = "public, max-age=31536000, immutable";

/** url -> in-flight or settled body. Bounded by the pinned file count (~30). */
const memo = new Map<string, Promise<string>>();

/** Test seam: drop memoized bodies so a test can observe fetch behavior. */
export function resetSkillSourceMemo(): void {
  memo.clear();
}

/** git blob hash of raw bytes — sha1("blob <len>\0" + content), the exact id
 *  ecosystem-skills/MANIFEST.json records per file. */
async function gitBlobSha(bytes: ArrayBuffer): Promise<string> {
  const header = new TextEncoder().encode(`blob ${bytes.byteLength}\0`);
  const framed = new Uint8Array(header.byteLength + bytes.byteLength);
  framed.set(header, 0);
  framed.set(new Uint8Array(bytes), header.byteLength);
  const digest = await crypto.subtle.digest("SHA-1", framed);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** The colo cache, or undefined outside a Workers runtime (unit tests). */
function edgeCache(): Cache | undefined {
  const c = (globalThis as { caches?: { default?: Cache } }).caches;
  return c?.default;
}

async function fetchVerified(
  url: string,
  sha: string,
  fetchImpl: typeof fetch
): Promise<{ text: string; bytes: ArrayBuffer }> {
  let lastError = "";
  // One retry: a single transient CDN blip should not cost the caller a turn.
  for (let attempt = 0; attempt < 2; attempt++) {
    let res: Response;
    try {
      res = await fetchImpl(url, {
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
    const actual = await gitBlobSha(bytes);
    if (actual !== sha) {
      throw new Error(
        `integrity check failed for ${url}: expected git blob ${sha}, got ${actual} — ` +
          `upstream bytes differ from the pinned tree; nothing was served`
      );
    }
    return { text: new TextDecoder().decode(bytes), bytes };
  }
  throw new Error(`could not fetch ${url}: ${lastError}`);
}

/**
 * The default source: memo -> Cache API -> upstream, verified and scrubbed.
 * `fetchImpl` is a test seam only; production always uses global fetch (a
 * host-side call — the execute sandbox itself still has no network).
 */
export function createSkillSource(fetchImpl: typeof fetch = fetch): SkillSource {
  return (url, sha) => {
    const hit = memo.get(url);
    if (hit) return hit;
    const pending = (async () => {
      const cache = edgeCache();
      const request = new Request(url, { headers: { accept: "text/plain" } });
      const cached = await cache?.match(request);
      if (cached) {
        // Cached bytes are re-verified: the cache is a transport, not a
        // trust boundary, and the check is a hash over ~20 KB.
        const bytes = await cached.arrayBuffer();
        if ((await gitBlobSha(bytes)) === sha) {
          return scrubRetiredSkillRefs(new TextDecoder().decode(bytes), url);
        }
      }
      const { text, bytes } = await fetchVerified(url, sha, fetchImpl);
      await cache?.put(
        request,
        new Response(bytes, {
          headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": CACHE_CONTROL }
        })
      );
      return scrubRetiredSkillRefs(text, url);
    })();
    // A failed fetch must not poison the isolate for the rest of its life.
    const wrapped = pending.catch((e: unknown) => {
      memo.delete(url);
      throw e;
    });
    memo.set(url, wrapped);
    return wrapped;
  };
}
