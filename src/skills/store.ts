/**
 * Skills store — exact-match, partial retrieval over the bundled
 * ecosystem-skills mirror (PLAN §3).
 *
 * `codemode.skill.read(name, { sections? })` resolves through the CATALOG,
 * not the filesystem: `name` must be an exact catalog id (a `skills.*` skill
 * or skill-section id — the ids `search` returns), and content comes from
 * src/skills/bundle.json (built by scripts/bundle-skills.mjs; keys equal
 * each entry's transport.path). Exposure is decided at build time (ADR-0003):
 * everything in the catalog is readable; anything excluded simply has no
 * entry and fails exact-match resolution here.
 *
 * Exact-match discipline (ADR wrong-entity lesson, CLAUDE.md rules): no
 * fuzzy resolution and no aliases anywhere — unknown ids fail with a
 * suggestion, never a silent redirect.
 *
 * Section addressing matches the catalog builder's slugs: `##`-heading
 * sections by slug (or exact heading text), extra .md files as
 * `file:<relpath>`. Unknown sections fail the whole read and list what
 * exists — never a silent partial answer.
 */
import type { Catalog, CatalogEntry } from "../catalog/types.ts";
import { lastIdSegment } from "../catalog/id.ts";
import { DEFAULT_MAX_TOKENS, CHARS_PER_TOKEN } from "../policy/truncate.ts";

export type SkillBundle = { generatedAt: string; files: Record<string, string> };

export type SkillReadResult =
  | {
      ok: true;
      id: string;
      path: string;
      /**
       * Full SKILL.md body (frontmatter stripped). ALWAYS present on ok
       * whole-reads regardless of size — content is never withheld, so
       * sandbox scripts can grep/aggregate full bodies. Absent on section
       * reads (only the requested parts come back, in `sections`).
       */
      content?: string;
      sections?: { section: string; content: string }[];
      /**
       * Advisory size warning, never a withholding: attached (uniformly on
       * whole, section, and file: reads) when the returned content is large
       * enough that RETURNING it whole from a sandbox script would be
       * truncated at the model boundary. The content itself is still fully
       * present for in-sandbox use.
       */
      notice?: string;
      /**
       * Section keys readable on this skill (## slugs + file:<path> keys) —
       * same membership as search hits' availableSections (search.ts
       * sectionKeysOf).
       */
      availableSections: string[];
    }
  | { ok: false; error: { service: "skills"; kind: "error"; message: string } };

/**
 * Advisory-notice threshold, in estimated tokens (ceil chars/4) over the RAW
 * characters of the content actually being returned. The model boundary
 * (truncateForModel, DEFAULT_MAX_TOKENS = 6000) truncates the JSON-SERIALIZED
 * script return, which inflates raw chars by ~6–15% (escaped newlines,
 * quotes), so a raw-chars measurement needs headroom — warn from ~5000 est
 * tokens up rather than at the boundary itself.
 */
const NOTICE_THRESHOLD_TOKENS = 5000;

/** Advisory size notice for large reads; undefined when under threshold. */
function sizeNotice(id: string, chars: number): string | undefined {
  const estTokens = Math.ceil(chars / CHARS_PER_TOKEN);
  if (estTokens <= NOTICE_THRESHOLD_TOKENS) return undefined;
  return `this read of ${id} is ~${estTokens} tokens. The content is included in full for in-sandbox use (grep, slice, aggregate freely), but RETURNING it whole from your script will be truncated at the ~${DEFAULT_MAX_TOKENS}-token model boundary. To return skill material, request specific sections (keys in availableSections) or return in-script aggregates instead.`;
}

/** Same slugify as scripts/build-catalog.mjs — section ids must line up. */
function slugify(text: string): string {
  return (
    text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[`*]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function stripFrontmatter(content: string): string {
  if (!content.startsWith("---")) return content;
  const end = content.indexOf("\n---", 3);
  if (end === -1) return content;
  return content.slice(content.indexOf("\n", end + 1) + 1);
}

function err(message: string): SkillReadResult {
  return { ok: false, error: { service: "skills", kind: "error", message } };
}

/** Two-row Levenshtein — inputs are catalog ids (tens of chars, ~dozens of candidates). */
function editDistance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(
        (prev[j] ?? 0) + 1,
        (next[j - 1] ?? 0) + 1,
        (prev[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = next;
  }
  return prev[b.length] ?? 0;
}

/**
 * Nearest readable skill id for a failed lookup — a SUGGESTION appended to
 * the exact-match error, never a resolution (no fuzzy top-hit acceptance).
 * Terminal-segment equality wins (catches "skills.soroban" for
 * "skills.stellar-dev.soroban"); otherwise smallest edit distance within a
 * typo-sized bound.
 *
 * Exported for src/skills/run.ts (design §6/§11 row 9): skill.run's
 * unknown-id error reuses the same suggestion logic over the runnable subset
 * (run.ts passes a catalog narrowed to runnable entries). Behavior unchanged.
 */
export function nearestSkillId(catalog: Catalog, name: string): string | undefined {
  const candidates = catalog.entries.filter(
    (e) => e.kind === "skill" && e.transport?.type === "file"
  );
  const wanted = lastIdSegment(name);
  const terminal = candidates.filter((e) => lastIdSegment(e.id) === wanted);
  if (terminal.length === 1 && terminal[0]) return terminal[0].id;
  let best: CatalogEntry | undefined;
  let bestD = Infinity;
  for (const e of candidates) {
    const d = editDistance(name, e.id);
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  }
  return best && bestD <= Math.max(3, Math.floor(name.length / 4)) ? best.id : undefined;
}

type Section = { heading: string; content: string; start: number; end: number };

/** Split a SKILL.md body into `##` sections keyed by slug. `start`/`end` are
 *  the [heading, next-heading) line range. */
function sectionize(body: string): Map<string, Section> {
  const out = new Map<string, Section>();
  const lines = body.split("\n");
  let current: { heading: string; slugBase: string; start: number } | null = null;
  const used = new Set<string>();
  const flush = (endLine: number) => {
    if (!current) return;
    let slug = current.slugBase;
    for (let n = 2; used.has(slug); n++) slug = `${current.slugBase}-${n}`;
    used.add(slug);
    out.set(slug, {
      heading: current.heading,
      content: lines.slice(current.start, endLine).join("\n").trim(),
      start: current.start,
      end: endLine
    });
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (!line.startsWith("## ")) continue;
    flush(i);
    const heading = line.slice(3).trim();
    current = { heading, slugBase: slugify(heading), start: i };
  }
  flush(lines.length);
  return out;
}

/**
 * Section slugs of a raw SKILL.md (frontmatter stripped internally) — the
 * exact key set read-time sectionize produces. Exported so the builder-
 * invariant test can assert build-catalog's sectioning agrees with this one:
 * any drift would let a `##` section exist with no catalog entry, which
 * whole/section reads now treat as fail-closed.
 */
export function sectionSlugsOf(raw: string): string[] {
  return [...sectionize(stripFrontmatter(raw)).keys()];
}

/** All section entries (`id#…`) belonging to a skill id, from the catalog. */
function sectionEntriesOf(catalog: Catalog, skillId: string): CatalogEntry[] {
  return catalog.entries.filter(
    (e) => e.kind === "skill-section" && e.id.startsWith(`${skillId}#`)
  );
}

function resolveSkillEntry(catalog: Catalog, name: string): CatalogEntry | SkillReadResult {
  const direct = catalog.entries.find((e) => e.id === name);
  if (direct) return direct;
  const nearest = nearestSkillId(catalog, name);
  return err(
    `unknown skill "${name}" — names are exact catalog ids (e.g. "skills.stellar-dev.soroban"); discover them with codemode.search or the search tool (kind: "skill")${nearest ? `. Did you mean "${nearest}"?` : ""}`
  );
}

export function readSkill(
  catalog: Catalog,
  bundle: SkillBundle,
  name: unknown,
  opts?: unknown
): SkillReadResult {
  if (typeof name !== "string" || name.length === 0) {
    return err("skill name must be a non-empty string (an exact catalog id)");
  }

  // Options are exact-match like ids: unknown keys are refused, never
  // silently ignored (a `section` singular typo used to no-op into a whole
  // read and cost the caller a turn discovering why).
  if (opts !== undefined && opts !== null) {
    if (typeof opts !== "object" || Array.isArray(opts)) {
      return err(
        `options must be an object like { sections: ["<key>"] } — got ${Array.isArray(opts) ? "an array" : typeof opts}`
      );
    }
    const unknownKeys = Object.keys(opts).filter((k) => k !== "sections");
    if (unknownKeys.length > 0) {
      return err(
        `unknown option${unknownKeys.length > 1 ? "s" : ""} ${unknownKeys.map((k) => `"${k}"`).join(", ")} — the only option is "sections" (an array of section keys); nothing is silently ignored`
      );
    }
  }
  const optSections =
    opts !== null && typeof opts === "object" ? (opts as { sections?: unknown }).sections : undefined;

  // A section id (`skills.x.y#slug`) reads exactly that section.
  const hashIndex = name.indexOf("#");
  const requestedFromId = hashIndex >= 0 ? [name.slice(hashIndex + 1)] : null;
  const skillIdOrAlias = hashIndex >= 0 ? name.slice(0, hashIndex) : name;

  const resolved = resolveSkillEntry(catalog, skillIdOrAlias);
  if ("ok" in resolved) return resolved; // an error result
  const entry = resolved;

  if (entry.kind !== "skill") {
    return err(`"${entry.id}" is a ${entry.kind}, not a skill — pass the skill id (before the #) plus sections`);
  }
  const path = entry.transport?.type === "file" ? entry.transport.path : undefined;
  if (!path) {
    return err(`${entry.id} has no readable body on this server`);
  }
  const raw = bundle.files[path];
  if (raw === undefined) {
    return err(`${entry.id} is cataloged but its body is missing from the bundle (${path}) — rebuild with npm run skills:bundle`);
  }

  const body = stripFrontmatter(raw);
  const bySlug = sectionize(body);
  const sectionEntries = sectionEntriesOf(catalog, entry.id);
  const sectionEntryById = new Map(sectionEntries.map((e) => [e.id, e]));
  // Fail-closed: a ## slug is advertised (and readable) ONLY when it has a
  // catalog section entry. An un-cataloged slug (section indexing drift) is
  // neither advertised nor served — the builder-invariant test guards against
  // that ever happening for real data.
  const advertisedSlugs = [...bySlug.keys()].filter((slug) =>
    sectionEntryById.has(`${entry.id}#${slug}`)
  );
  const fileKeys = sectionEntries
    .map((e) => e.id.slice(entry.id.length + 1))
    .filter((k) => k.startsWith("file:"));
  const availableSections = [...advertisedSlugs, ...fileKeys];

  if (requestedFromId && optSections !== undefined) {
    return err(
      `"${name}" already names a section — pass sections either in the id (#<slug>) or via { sections }, not both`
    );
  }
  let requested = requestedFromId;
  if (!requested && optSections !== undefined) {
    if (!Array.isArray(optSections) || !optSections.every((s) => typeof s === "string")) {
      return err("sections must be an array of section keys (strings)");
    }
    requested = optSections as string[];
  }

  if (!requested || requested.length === 0) {
    // Whole-read: return the full body — notices are advice, content is never
    // withheld. The ~6k-token cap applies only to what a script RETURNS
    // (run.ts truncateForModel), never to data flowing INTO the sandbox, and
    // scripts legally grep/aggregate full bodies in-sandbox.
    const content = body.trim();
    const notice = sizeNotice(entry.id, content.length);
    return notice
      ? { ok: true, id: entry.id, path, content, notice, availableSections }
      : { ok: true, id: entry.id, path, content, availableSections };
  }

  const found: { section: string; content: string }[] = [];
  for (const want of requested) {
    if (want.startsWith("file:")) {
      const relPath = want.slice("file:".length);
      const sectionEntry = sectionEntries.find((e) => e.id === `${entry.id}#${want}`);
      const filePath = sectionEntry?.transport?.type === "file" ? sectionEntry.transport.path : undefined;
      const fileRaw = filePath ? bundle.files[filePath] : undefined;
      if (!sectionEntry || fileRaw === undefined) {
        return err(`unknown section "${want}" of ${entry.id}. Available: ${availableSections.join(", ")}`);
      }
      found.push({ section: want, content: stripFrontmatter(fileRaw).trim() });
      continue;
    }
    // ##-heading section: accept the slug (catalog id form) or exact heading text.
    let slug: string | undefined;
    if (bySlug.has(want)) slug = want;
    else if (bySlug.has(slugify(want))) slug = slugify(want);
    else {
      for (const [s, v] of bySlug) {
        if (v.heading === want) {
          slug = s;
          break;
        }
      }
    }
    const hit = slug ? bySlug.get(slug) : undefined;
    if (!slug || !hit) {
      return err(`unknown section "${want}" of ${entry.id}. Available: ${availableSections.join(", ")}`);
    }
    // Fail-closed: a ## section present in the body but ABSENT from the catalog
    // (build/read sectioning drift) is not served — default-deny, not
    // default-allow. The builder-invariant test asserts this never occurs.
    if (!sectionEntryById.has(`${entry.id}#${slug}`)) {
      return err(
        `section "${want}" of ${entry.id} has no catalog entry — not exposed (section indexing drift; rebuild the catalog)`
      );
    }
    found.push({ section: want, content: hit.content });
  }

  // Same advisory treatment as whole reads: large assembled section/file:
  // content still comes back in full, with a size notice.
  const notice = sizeNotice(
    entry.id,
    found.reduce((n, s) => n + s.content.length, 0)
  );
  return notice
    ? { ok: true, id: entry.id, path, sections: found, notice, availableSections }
    : { ok: true, id: entry.id, path, sections: found, availableSections };
}
