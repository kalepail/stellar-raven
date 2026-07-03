/**
 * Catalog id helpers — shared so the "last id segment" rule has ONE
 * definition (F7 consolidation). The terminal segment is the high-weight
 * name field for search scoring (catalog/search.ts), the sandbox function
 * name per operation (executor/providers.ts), and the skill terminal-name
 * used by the read alias (skills/store.ts).
 *
 * Plain module, no I/O — importable under plain `node` type-stripping
 * (the eval CLI + vitest both load src/catalog/** directly).
 */

/**
 * The segment after the final "." of an id, ignoring any `#<section>` suffix.
 * `lumenloop.search_directory` → `search_directory`;
 * `skills.stellar-dev.soroban#storage` → `soroban`.
 */
export function lastIdSegment(id: string): string {
  const base = id.split("#")[0] ?? id;
  const segments = base.split(".");
  return segments[segments.length - 1] ?? id;
}
