/**
 * Leaf module — no imports — so both src/auth/gate.ts (admin token) and
 * src/demo/auth.ts (demo-cookie MAC) can share the comparator without the
 * cycle workos.ts → demo/auth.ts → gate.ts → workos.ts that a gate.ts import
 * from demo code would create.
 */

/**
 * Constant-time equality over equal-length digests. Uses the Workers-native
 * `crypto.subtle.timingSafeEqual` when present; plain Node (vitest) lacks
 * it, so fall back to a branch-free XOR fold — safe here because both
 * inputs are fixed-length SHA-256 digests, never raw secrets.
 */
export function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  const subtle = crypto.subtle as SubtleCrypto & {
    timingSafeEqual?: (a: ArrayBufferView, b: ArrayBufferView) => boolean;
  };
  if (typeof subtle.timingSafeEqual === "function") return subtle.timingSafeEqual(a, b);
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}
