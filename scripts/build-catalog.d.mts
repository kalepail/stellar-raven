// Ambient declaration for build-catalog.mjs (plain JS, no build step) so
// test/catalog.test.ts can import its exported guard directly under
// `tsc --noEmit`. Keep in sync with the exported surface of build-catalog.mjs.
export function assertNoNonExposedRefs(entries: readonly unknown[]): void;
export function assertSideEffectingOpsExcluded(
  openapi: unknown,
  excluded?: ReadonlySet<string>
): void;
