/**
 * skill-markdown.mjs — the markdown helpers the skill builders MUST agree on.
 *
 * `build-catalog.mjs` and `build-super-spec.mjs` both turn pinned SKILL.md
 * bytes into section ids and descriptions, and those ids have to line up
 * exactly: the section key the catalog emits is the key `skill.read` resolves
 * and the super-spec advertises. They used to hold byte-identical private
 * copies of these three functions, each carrying a "MUST match
 * scripts/build-catalog.mjs" comment — a rule enforced by hope, where any edit
 * had to be made twice or section keys would silently drift apart. One
 * definition enforces it by construction.
 *
 * `src/skills/store.ts` deliberately keeps its own slugify: it is Worker
 * runtime code, a different tier from these build scripts, and an invariant
 * test asserts the two agree rather than importing across that boundary.
 */

/** Collapse whitespace, strip markdown links/emphasis/backticks for descriptions. */
export function plainText(markdown) {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Heading -> section slug. Empty input yields "section" so an id always exists. */
export function slugify(text) {
  return (
    plainText(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/** Minimal frontmatter parser — supports the flat `key: value` blocks skills use. */
export function parseFrontmatter(content) {
  if (!content.startsWith("---")) return { attrs: {}, body: content };
  const end = content.indexOf("\n---", 3);
  if (end === -1) return { attrs: {}, body: content };
  const block = content.slice(content.indexOf("\n") + 1, end);
  const body = content.slice(content.indexOf("\n", end + 1) + 1);
  const attrs = {};
  let currentKey = null;
  for (const line of block.split("\n")) {
    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s?(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      attrs[currentKey] = keyMatch[2].trim().replace(/^["']|["']$/g, "");
    } else if (currentKey && line.trim() !== "") {
      attrs[currentKey] = `${attrs[currentKey]} ${line.trim()}`.trim();
    }
  }
  return { attrs, body };
}
