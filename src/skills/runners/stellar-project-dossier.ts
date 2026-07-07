/**
 * skills.lumenloop.stellar-project-dossier — runnable core (design §4.1).
 *
 * Mechanizes the dossier playbook's data-gathering steps (1–4 + 6): exact
 * slug resolution, a parallel fan-out over the project row / SCF history /
 * coverage / similar projects, and a compact projection under the §9 output
 * budget. Judgment steps (pull-quote selection, optional connections) stay
 * with the model via codemode.skill.read — this module only gathers.
 *
 * House invariants honored here:
 *  - Exact-match resolution, never fuzzy: an ambiguous directory query fails
 *    AS DATA listing the candidates; zero hits soft-empties with the honesty
 *    hint. No top-hit acceptance. NOTE the fabrication-trap reality (design
 *    §4.1): live lumenloop.search_directory fuzzy-matches almost any string,
 *    so a nonexistent project name usually lands on the AMBIGUITY branch,
 *    not zero-hit — which is why the ambiguity hint ALSO carries the
 *    absence-is-not-evidence framing and warns against substituting a
 *    similar-sounding candidate (every ambiguity error is, by construction,
 *    a case where nothing matched exactly). The zero-hit rung fires when
 *    upstream itself soft-empties.
 *  - Defensive projection: when an upstream payload carries none of the
 *    expected keys, that section is treated as if its call errored (null) —
 *    fields are never guessed (design §4.2 note).
 *  - The runner never authors `calls` — the host ledger owns the audit trail.
 *  - Defaults are applied in the first lines of run(); the schema `default`
 *    keyword below is documentation for the model only.
 *
 * Live payload shapes this projection matches (captured 2026-07-06, fixtures
 * in test/fixtures/skill-runners/): directory rows carry array-valued links /
 * operating_region (joined ", " into the declared string fields); coverage is
 * a type-keyed map with per-type date fields; research rows have no url
 * (projected as null); similar-projects data is a bare array.
 */
import type { SkillRunner } from "./types.ts";

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const CONTENT_TYPES = ["articles", "av", "events", "research"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];

// ---- tiny shape helpers (shared style with the digest runner; duplicated
// deliberately — the §12 import lint forbids helper modules) ----------------
const rec = (v: unknown): Record<string, unknown> | null =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
const arr = (v: unknown): unknown[] | null => (Array.isArray(v) ? v : null);
const str = (v: unknown): string | null => (typeof v === "string" && v.length > 0 ? v : null);
const trunc = (v: unknown, max: number): string => {
  const s = typeof v === "string" ? v : "";
  return s.length > max ? s.slice(0, max) : s;
};
/** Upstream carries some prose fields as string OR string[] — join to the declared string. */
const joined = (v: unknown): string | null => {
  if (typeof v === "string") return v.length > 0 ? v : null;
  const items = arr(v)?.filter((x): x is string => typeof x === "string") ?? [];
  return items.length > 0 ? items.join(", ") : null;
};

type ErrEnvelope = {
  ok: false;
  error: { service: "skills"; kind: "error" | "soft-empty"; message: string; hint?: string };
};
const errData = (kind: "error" | "soft-empty", message: string, hint?: string): ErrEnvelope => ({
  ok: false,
  error: { service: "skills", kind, message, ...(hint ? { hint } : {}) }
});

/** Zero directory hits — the honesty path: absence of evidence, stated as such. */
const zeroHits = (project: string): ErrEnvelope =>
  errData(
    "soft-empty",
    `no directory project matched "${project}"`,
    "absence from the LumenLoop directory is not evidence the project does not exist — try alternate names via lumenloop.search_directory"
  );

// ---- projections (each returns null on unexpected shape — never guesses) ---
function projectProfile(data: unknown) {
  const row = rec(data);
  const title = row ? str(row["title"]) : null;
  if (!row || !title) return null;
  const links: Record<string, string> = {};
  const rawLinks = rec(row["links"]);
  if (rawLinks) {
    for (const [key, value] of Object.entries(rawLinks)) {
      const v = joined(value);
      if (v) links[key] = v;
    }
  }
  return {
    title,
    category: str(row["category"]) ?? "",
    tags: (arr(row["tags"]) ?? []).filter((t): t is string => typeof t === "string"),
    basedIn: joined(row["based_in"]),
    operatingRegion: joined(row["operating_region"]),
    links,
    description: trunc(row["description"], 400)
  };
}

function projectScf(data: unknown) {
  const row = rec(data);
  const rows = row ? arr(row["submissions"]) : null;
  if (!row || !rows) return null;
  const submissions = rows
    .slice(0, 10)
    .map(rec)
    .filter((s): s is Record<string, unknown> => s !== null)
    .map((s) => ({
      round: str(s["round"]) ?? "",
      awardType: str(s["award_type"]),
      title: str(s["title"]) ?? "",
      status: str(s["status"])
    }));
  const count = typeof row["count"] === "number" ? row["count"] : submissions.length;
  return { count, softEmpty: submissions.length === 0, submissions };
}

/** Per-type date field: articles publish, events start, av/research created. */
const itemDate = (row: Record<string, unknown>): string | null =>
  str(row["publishing_date"]) ?? str(row["start_at"]) ?? str(row["created_at"]);

function projectContent(data: unknown) {
  const row = rec(data);
  if (!row || !CONTENT_TYPES.some((t) => t in row)) return null;
  const items: { type: ContentType; title: string; url: string | null; date: string | null; summary: string }[] = [];
  for (const type of CONTENT_TYPES) {
    for (const raw of arr(row[type]) ?? []) {
      const r = rec(raw);
      if (!r) continue;
      items.push({
        type,
        title: str(r["title"]) ?? "",
        url: str(r["url"]),
        date: itemDate(r),
        summary: trunc(r["summary"], 200)
      });
    }
  }
  return { softEmpty: items.length === 0, items };
}

function projectSimilar(data: unknown) {
  // Live shape is a bare array; a wrapped {items|projects: [...]} is accepted
  // as the one anticipated alternative — anything else is drift, hence null.
  const wrapper = rec(data);
  const rows = arr(data) ?? (wrapper ? (arr(wrapper["items"]) ?? arr(wrapper["projects"])) : null);
  if (!rows) return null;
  const items = rows
    .map(rec)
    .filter((r): r is Record<string, unknown> => r !== null)
    .map((r) => ({
      slug: str(r["slug"]) ?? "",
      title: str(r["title"]) ?? "",
      category: str(r["category"]) ?? ""
    }));
  return { softEmpty: items.length === 0, items };
}

function directoryHits(data: unknown): { slug: string; title: string }[] | null {
  const row = rec(data);
  const rows = row ? arr(row["projects"]) : arr(data);
  if (!rows) return null;
  return rows
    .map(rec)
    .filter((r): r is Record<string, unknown> => r !== null)
    .map((r) => ({ slug: str(r["slug"]) ?? "", title: str(r["title"]) ?? "" }))
    .filter((h) => h.slug.length > 0);
}

export const stellarProjectDossier: SkillRunner = {
  ops: [
    "lumenloop.get_project",
    "lumenloop.search_directory",
    "lumenloop.get_scf_submissions",
    "lumenloop.find_content_about_project",
    "lumenloop.find_similar_projects_semantic"
  ],

  inputSchema: {
    type: "object",
    additionalProperties: false,
    required: ["project"],
    properties: {
      project: {
        type: "string",
        minLength: 1,
        description: 'Project name or directory slug (e.g. "blend", "LOBSTR").'
      },
      contentLimit: {
        type: "integer",
        minimum: 1,
        maximum: 20,
        default: 8,
        description: "Max coverage items per content type."
      },
      similarLimit: { type: "integer", minimum: 1, maximum: 10, default: 5 }
    }
  },

  outputSchema: {
    type: "object",
    additionalProperties: false,
    required: ["slug", "resolvedBy", "profile", "scf", "content", "similar", "calls"],
    properties: {
      slug: { type: "string" },
      resolvedBy: {
        type: "string",
        enum: ["input-slug", "exact-slug", "exact-title", "single-hit"],
        description: "How the input resolved to a directory slug — always exact-match, never fuzzy."
      },
      profile: {
        type: ["object", "null"],
        description:
          "null ⇔ the constituent call errored (see calls); softEmpty sections answered with nothing — a finding, not a failure.",
        additionalProperties: false,
        required: ["title", "category", "tags", "basedIn", "operatingRegion", "links", "description"],
        properties: {
          title: { type: "string" },
          category: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          basedIn: { type: ["string", "null"] },
          operatingRegion: { type: ["string", "null"] },
          links: { type: "object", description: "website/x/discord/… as the directory row carries them." },
          description: { type: "string", maxLength: 400 }
        }
      },
      scf: {
        type: ["object", "null"],
        additionalProperties: false,
        required: ["count", "softEmpty", "submissions"],
        properties: {
          count: { type: "integer", minimum: 0 },
          softEmpty: { type: "boolean" },
          submissions: {
            type: "array",
            maxItems: 10,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["round", "awardType", "title", "status"],
              properties: {
                round: { type: "string" },
                awardType: { type: ["string", "null"] },
                title: { type: "string" },
                status: { type: ["string", "null"] }
              }
            }
          }
        }
      },
      content: {
        type: ["object", "null"],
        additionalProperties: false,
        required: ["softEmpty", "items"],
        properties: {
          softEmpty: { type: "boolean" },
          items: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "url", "date", "summary"],
              properties: {
                type: { type: "string", enum: ["articles", "av", "events", "research"] },
                title: { type: "string" },
                url: { type: ["string", "null"] },
                date: { type: ["string", "null"] },
                summary: { type: "string", maxLength: 200 }
              }
            }
          }
        }
      },
      similar: {
        type: ["object", "null"],
        additionalProperties: false,
        required: ["softEmpty", "items"],
        properties: {
          softEmpty: { type: "boolean" },
          items: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["slug", "title", "category"],
              properties: {
                slug: { type: "string" },
                title: { type: "string" },
                category: { type: "string" }
              }
            }
          }
        }
      },
      calls: {
        type: "array",
        description: "Host-recorded constituent-call audit trail — attached by runSkill, never runner-authored.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["op", "ok", "ms"],
          properties: {
            op: { type: "string" },
            ok: { type: "boolean" },
            errorKind: { type: "string", enum: ["error", "soft-empty"] },
            ms: { type: "number", minimum: 0 }
          }
        }
      }
    }
  },

  async run(input, ops) {
    // Defaults first — the pipeline never injects schema defaults (design §4).
    const project = typeof input["project"] === "string" ? input["project"] : "";
    const contentLimit = typeof input["contentLimit"] === "number" ? input["contentLimit"] : 8;
    const similarLimit = typeof input["similarLimit"] === "number" ? input["similarLimit"] : 5;

    // Declared-ops-only accessor: a missing facade fn is a wiring/declaration
    // bug and throws (runSkill catches it into a runner-bug envelope).
    const call = (name: string, args: Record<string, unknown>) => {
      const fn = ops["lumenloop"]?.[name];
      if (!fn) throw new Error(`ops facade is missing lumenloop.${name} — undeclared op or wiring bug`);
      return fn(args);
    };

    // ---- step 1: slug resolution — exact-match, never fuzzy ---------------
    let slug: string | null = null;
    let resolvedBy: "input-slug" | "exact-slug" | "exact-title" | "single-hit" | null = null;
    if (SLUG_RE.test(project)) {
      // Cheap direct probe (compact ≈ 5% of the payload); the fan-out still
      // fetches the full row — one extra call beats dual-shape handling.
      const probe = await call("get_project", { slug: project, compact: true });
      if (probe.ok) {
        slug = project;
        resolvedBy = "input-slug";
      }
    }
    if (!slug) {
      const sr = await call("search_directory", { query: project, limit: 5 });
      if (!sr.ok) {
        if (sr.error.kind === "soft-empty") return zeroHits(project);
        return errData(
          "error",
          `project resolution failed — lumenloop.search_directory errored: ${sr.error.message}`
        );
      }
      const hits = directoryHits(sr.data);
      if (hits === null) {
        return errData(
          "error",
          "lumenloop.search_directory returned an unexpected payload shape — dossier resolution aborted (upstream drift?)"
        );
      }
      if (hits.length === 0) return zeroHits(project);
      const lower = project.toLowerCase();
      const bySlug = hits.find((h) => h.slug.toLowerCase() === lower);
      const byTitle = hits.find((h) => h.title.toLowerCase() === lower);
      if (bySlug) {
        slug = bySlug.slug;
        resolvedBy = "exact-slug";
      } else if (byTitle) {
        slug = byTitle.slug;
        resolvedBy = "exact-title";
      } else if (hits.length === 1 && hits[0]) {
        slug = hits[0].slug;
        resolvedBy = "single-hit";
      } else {
        // No candidate matched exactly (the exact-slug/title rungs above ran
        // first), so this doubles as the fabrication-trap honesty path: live
        // directory search fuzzy-matches nonexistent names into candidates.
        return errData(
          "error",
          `ambiguous project "${project}" — pass the exact slug`,
          `candidates (none matches "${project}" exactly): ${hits.map((h) => `${h.slug} — ${h.title}`).join("; ")}. If none of these IS the project, do not substitute a similar-sounding one — absence from the LumenLoop directory is not evidence the project does not exist.`
        );
      }
    }

    // ---- step 2: parallel fan-out (independent free reads) ----------------
    const [projR, scfR, contentR, similarR] = await Promise.all([
      call("get_project", { slug }),
      call("get_scf_submissions", { slug }),
      call("find_content_about_project", {
        slug,
        limit: contentLimit,
        types: [...CONTENT_TYPES],
        response_format: "concise"
      }),
      call("find_similar_projects_semantic", { slug, limit: similarLimit })
    ]);

    // Anchor: resolution + get_project. Its error kind propagates (design §6).
    if (!projR.ok) {
      return errData(
        projR.error.kind,
        `anchor lumenloop.get_project failed for "${slug}": ${projR.error.message}`,
        projR.error.hint
      );
    }
    const profile = projectProfile(projR.data);
    if (!profile) {
      return errData(
        "error",
        `lumenloop.get_project returned an unexpected payload shape for "${slug}" — dossier aborted (upstream drift?)`
      );
    }

    // Non-anchor sections degrade per-section: error → null; soft-empty →
    // present-but-empty with softEmpty: true (data ≠ soft-empty ≠ error).
    const scf = scfR.ok
      ? projectScf(scfR.data)
      : scfR.error.kind === "soft-empty"
        ? { count: 0, softEmpty: true, submissions: [] }
        : null;
    const content = contentR.ok
      ? projectContent(contentR.data)
      : contentR.error.kind === "soft-empty"
        ? { softEmpty: true, items: [] }
        : null;
    const similar = similarR.ok
      ? projectSimilar(similarR.data)
      : similarR.error.kind === "soft-empty"
        ? { softEmpty: true, items: [] }
        : null;

    // No `calls` key here — runSkill attaches the host ledger (design §6).
    return { slug, resolvedBy, profile, scf, content, similar };
  }
};
