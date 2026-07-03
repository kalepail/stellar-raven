/**
 * labels.mjs — pure corpus-label helpers shared by compile-routing.mjs and
 * self-test.mjs. No I/O (callers read files and pass text/arrays in).
 *
 * Two jobs:
 *   1. deriveExpectedAny — turn a case's `acceptable_cards` (corpus-authored
 *      "also-correct alternates that wouldn't be a routing miss") into a
 *      service-level accept-either set for grade.mjs's any1/any3/any5 fields.
 *      Cards on services outside this catalog (perplexity_*, parallel_*)
 *      contribute nothing — our search can't surface them.
 *   2. frontmatterRouting — extract the routing labels from a golden question
 *      file's YAML frontmatter (raven-next authoring format; vendored under
 *      eval/corpus/raven-next/). Handles inline `key: [a, b]` and block
 *      `key:\n  - a` list styles, with trailing `# comments` tolerated.
 */
import { splitCard } from "./grade.mjs";

/**
 * Service-level accept-either set from corpus acceptable_cards.
 * Returns a sorted array [expectedService, ...others] when at least one
 * acceptable card maps to a DIFFERENT catalog service; otherwise null
 * (no tolerance beyond the strict label — emit nothing).
 */
export function deriveExpectedAny(expectedService, acceptableCards) {
  if (!Array.isArray(acceptableCards) || acceptableCards.length === 0) return null;
  const services = new Set();
  for (const card of acceptableCards) {
    const { service } = splitCard(card);
    if (service && service !== expectedService) services.add(service);
  }
  if (services.size === 0) return null;
  return [expectedService, ...[...services].sort()];
}

/** Parse one frontmatter list value: inline `[a, b]` or block `\n  - a` style. */
export function parseFrontmatterList(txt, key) {
  const inline = txt.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, "m"));
  if (inline) {
    return inline[1]
      .split(",")
      .map((s) => s.replace(/#.*$/, "").trim())
      .filter(Boolean);
  }
  const block = txt.match(new RegExp(`^${key}:\\s*(?:#.*)?\\n((?:[ \\t]+-[^\\n]*\\n?)+)`, "m"));
  if (!block) return [];
  return block[1]
    .split("\n")
    .map((line) => line.replace(/^[ \t]+-\s*/, "").replace(/#.*$/, "").trim())
    .filter(Boolean);
}

/** Routing labels from a golden question file's YAML frontmatter. */
export function frontmatterRouting(txt) {
  const grab = (re) => txt.match(re)?.[1];
  return {
    expected_service: grab(/^expected_service:\s*([a-z_]+)/m),
    should_fire: grab(/^should_fire:\s*(true|false)/m) !== "false",
    expected_cards: parseFrontmatterList(txt, "expected_cards"),
    acceptable_cards: parseFrontmatterList(txt, "acceptable_cards"),
  };
}
