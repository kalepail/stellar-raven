/**
 * Skills store tests — bundle read, sectioned retrieval, exact-match
 * discipline, alias handling, deny enforcement.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, searchCatalog, type Catalog } from "../src/catalog/search.ts";
import { readSkill, sectionSlugsOf, type SkillBundle } from "../src/skills/store.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog: Catalog = loadManifest(
  JSON.parse(readFileSync(join(ROOT, "catalog", "manifest.json"), "utf8"))
);
const bundle: SkillBundle = JSON.parse(
  readFileSync(join(ROOT, "src", "skills", "bundle.json"), "utf8")
);

describe("skills bundle", () => {
  it("covers every file-transport skill/section path in the catalog", () => {
    const paths = new Set<string>();
    for (const e of catalog.entries) {
      if (e.transport?.type === "file" && typeof e.transport.path === "string") {
        paths.add(e.transport.path);
      }
    }
    expect(paths.size).toBeGreaterThan(25);
    for (const p of paths) {
      expect(bundle.files[p], `bundle missing ${p}`).toBeTypeOf("string");
    }
  });
});

describe("readSkill", () => {
  it("reads a whole skill by exact catalog id (frontmatter stripped)", () => {
    const r = readSkill(catalog, bundle, "skills.lumenloop.stellar-project-dossier");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.content).toBeTypeOf("string");
    expect(r.content).not.toMatch(/^---/);
    expect(r.availableSections.length).toBeGreaterThan(0);
  });

  it("reads selected ## sections by slug, matching catalog section ids", () => {
    const skillId = "skills.lumenloop.stellar-project-dossier";
    const sectionEntry = catalog.entries.find(
      (e) => e.kind === "skill-section" && e.id.startsWith(`${skillId}#`) && !e.id.includes("#file:")
    );
    expect(sectionEntry).toBeDefined();
    const slug = sectionEntry!.id.split("#")[1]!;
    const r = readSkill(catalog, bundle, skillId, { sections: [slug] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.sections).toHaveLength(1);
    expect(r.sections![0]!.content.startsWith("## ")).toBe(true);
    expect(r.content).toBeUndefined(); // partial read, not the whole skill
  });

  it("reads a section directly via its #-qualified id", () => {
    const sectionEntry = catalog.entries.find(
      (e) => e.kind === "skill-section" && e.id.includes("#") && !e.id.includes("#file:")
    );
    const r = readSkill(catalog, bundle, sectionEntry!.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.sections).toHaveLength(1);
  });

  it("reads file: sections (extra reference files)", () => {
    const fileEntry = catalog.entries.find((e) => e.id.includes("#file:"));
    expect(fileEntry).toBeDefined();
    const [skillId, key] = fileEntry!.id.split("#") as [string, string];
    const r = readSkill(catalog, bundle, skillId, { sections: [key] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.sections![0]!.content.length).toBeGreaterThan(0);
  });

  it("resolves the lumenloop.skill.* alias to the canonical mirror body (surviving skill)", () => {
    const r = readSkill(catalog, bundle, "lumenloop.skill.stellar-project-dossier");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.id).toBe("skills.lumenloop.stellar-project-dossier");
  });

  it("denies the alias for a retired onboarding skill (deny-list is data)", () => {
    // The 7 Lumenloop API-onboarding skills are retired: the alias resolves to
    // the deny-listed mirror entry, so the read returns denied on every path.
    const r = readSkill(catalog, bundle, "lumenloop.skill.lumenloop-api-billing");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error.kind).toBe("denied");
  });

  it("refuses unknown skills and unknown sections with exact-match messages", () => {
    const unknown = readSkill(catalog, bundle, "skills.lumenloop.stellar-project-dossie"); // near-miss
    expect(unknown.ok).toBe(false);
    if (unknown.ok) return;
    expect(unknown.error.message).toContain("exact catalog ids");

    const badSection = readSkill(catalog, bundle, "skills.lumenloop.stellar-project-dossier", {
      sections: ["not-a-real-section"]
    });
    expect(badSection.ok).toBe(false);
    if (badSection.ok) return;
    expect(badSection.error.message).toContain("Available:");
  });

  it("suggests the nearest valid id on unknown-skill misses (suggestion only, never resolution)", () => {
    const nearMiss = readSkill(catalog, bundle, "skills.lumenloop.stellar-project-dossie");
    expect(nearMiss.ok).toBe(false);
    if (nearMiss.ok) return;
    expect(nearMiss.error.message).toContain("exact catalog ids");
    expect(nearMiss.error.message).toContain('Did you mean "skills.lumenloop.stellar-project-dossier"?');

    const farMiss = readSkill(catalog, bundle, "totally.unrelated.thing");
    expect(farMiss.ok).toBe(false);
    if (farMiss.ok) return;
    expect(farMiss.error.message).not.toContain("Did you mean");
  });

  it("rejects unknown options instead of silently ignoring them (exact-match extends to option names)", () => {
    // `section` singular used to no-op into a whole-skill read.
    const singular = readSkill(catalog, bundle, "skills.lumenloop.stellar-project-dossier", {
      section: ["overview"]
    });
    expect(singular.ok).toBe(false);
    if (singular.ok) return;
    expect(singular.error.message).toContain('unknown option "section"');
    expect(singular.error.message).toContain('"sections"');

    const nonObject = readSkill(catalog, bundle, "skills.lumenloop.stellar-project-dossier", "overview");
    expect(nonObject.ok).toBe(false);
    if (nonObject.ok) return;
    expect(nonObject.error.message).toContain("options must be an object");
  });

  it("refuses sections passed both in a #-qualified id and via { sections }", () => {
    const sectionEntry = catalog.entries.find(
      (e) => e.kind === "skill-section" && e.id.includes("#") && !e.id.includes("#file:") && e.policy.allow
    );
    const r = readSkill(catalog, bundle, sectionEntry!.id, { sections: ["anything"] });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error.message).toContain("not both");
  });

  it("oversized whole-reads return the FULL body plus an advisory notice (content is never withheld)", () => {
    // skills.stellar-dev.standards is the known-largest body (~11k tokens,
    // design study todo 812 comment 2184). Sandbox scripts legally grep and
    // aggregate full bodies in-sandbox — the ~6k-token cap applies only to
    // what a script RETURNS (run.ts truncateForModel), never to data flowing
    // INTO the sandbox — so the content must be present; the notice is advice.
    const r = readSkill(catalog, bundle, "skills.stellar-dev.standards");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.content).toBeTypeOf("string");
    expect(r.content!.length).toBeGreaterThan(24_000); // full body, past the boundary
    expect(r.notice).toContain("tokens");
    expect(r.notice).toContain("availableSections");
    expect(r.availableSections.length).toBeGreaterThan(10);
  });

  it("a file: read of the largest companion file (~22.8k chars) carries the advisory notice", () => {
    // references/api-reference.md is ~22,835 chars ≈ 5.7k est tokens — over
    // the ~5000-token advisory threshold (the model boundary truncates the
    // SERIALIZED return, so raw-chars measurement warns with headroom).
    const key = "file:references/api-reference.md";
    const r = readSkill(catalog, bundle, "skills.stellar-light.stellar-scout", {
      sections: [key]
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.sections).toHaveLength(1);
    expect(r.sections![0]!.content.length).toBeGreaterThan(20_000); // full, untruncated
    expect(r.notice).toContain("tokens");
  });

  it("a small section read of an oversized skill returns full content with NO notice", () => {
    const whole = readSkill(catalog, bundle, "skills.stellar-dev.standards");
    if (!whole.ok) throw new Error("expected ok");
    const slug = whole.availableSections.find((s) => !s.startsWith("file:"))!;
    const r = readSkill(catalog, bundle, "skills.stellar-dev.standards", { sections: [slug] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.notice).toBeUndefined(); // below the advisory threshold: silence
    expect(r.sections).toHaveLength(1);
    expect(r.sections![0]!.content.startsWith("## ")).toBe(true);
    expect(r.sections![0]!.content.length).toBeGreaterThan(0);
  });

  it("an oversized body with zero ## sections reads whole, with the same advisory notice", () => {
    const id = "skills.test.sectionless";
    const path = "test/sectionless/SKILL.md";
    const synthetic: Catalog = {
      ...catalog,
      entries: [
        ...catalog.entries,
        {
          id,
          service: "skills",
          kind: "skill",
          description: "synthetic sectionless oversize fixture",
          inputSchema: null,
          outputSchema: null,
          transport: { type: "file", path },
          auth: "none",
          cost: "free",
          policy: { allow: true, denyReason: null },
          provenance: { source: "test", fetchedAt: "2026-01-01T00:00:00Z" }
        }
      ]
    };
    const body = `# Sectionless\n${"no heading here, just prose. ".repeat(1_200)}`; // ~35k chars > 24k budget
    const syntheticBundle: SkillBundle = {
      generatedAt: bundle.generatedAt,
      files: { ...bundle.files, [path]: body }
    };
    const r = readSkill(synthetic, syntheticBundle, id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.content).toBeDefined();
    expect(r.content!.length).toBeGreaterThan(24_000);
    expect(r.notice).toContain("tokens"); // advice applies uniformly, sectioned or not
    expect(r.availableSections).toEqual([]);
  });

  it("filters deny-listed section keys out of availableSections, matching search (reads stay denied)", () => {
    const skillId = "skills.lumenloop.stellar-project-dossier";
    const deniedSlugEntry = catalog.entries.find(
      (e) => e.kind === "skill-section" && e.id.startsWith(`${skillId}#`) && !e.id.includes("#file:")
    )!;
    const deniedFileEntry = catalog.entries.find(
      (e) => e.kind === "skill-section" && e.id.startsWith(`${skillId}#file:`)
    )!;
    const deniedKeys = [deniedSlugEntry, deniedFileEntry].map((e) => e.id.split("#")[1]!);
    const deniedCatalog: Catalog = {
      ...catalog,
      entries: catalog.entries.map((e) =>
        e.id === deniedSlugEntry.id || e.id === deniedFileEntry.id
          ? { ...e, policy: { allow: false, denyReason: "test: sensitive section" } }
          : e
      )
    };

    // Absent from readSkill's advertised list …
    const r = readSkill(deniedCatalog, bundle, skillId);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    for (const key of deniedKeys) expect(r.availableSections).not.toContain(key);
    expect(r.availableSections.length).toBeGreaterThan(0);

    // … absent from search hits' availableSections, and membership stays
    // identical across both surfaces WITH the denied entries present.
    const hit = searchCatalog(deniedCatalog, { query: skillId }).find((h) => h.id === skillId)!;
    expect(hit).toBeDefined();
    for (const key of deniedKeys) expect(hit.availableSections).not.toContain(key);
    expect([...hit.availableSections!].sort()).toEqual([...r.availableSections].sort());

    // Reading a denied key by exact name still returns the denied error.
    for (const key of deniedKeys) {
      const dr = readSkill(deniedCatalog, bundle, skillId, { sections: [key] });
      expect(dr.ok).toBe(false);
      if (dr.ok) continue;
      expect(dr.error.kind).toBe("denied");
    }
  });

  it("whole-read EXCISES a deny-listed ## section's body, leaving an explicit marker", () => {
    const skillId = "skills.lumenloop.stellar-project-dossier";
    const sectionEntry = catalog.entries.find(
      (e) => e.kind === "skill-section" && e.id.startsWith(`${skillId}#`) && !e.id.includes("#file:")
    )!;
    const slug = sectionEntry.id.split("#")[1]!;

    // A whole-body needle that lives ONLY inside the section we will deny.
    const wholeAllowed = readSkill(catalog, bundle, skillId);
    if (!wholeAllowed.ok || !wholeAllowed.content) throw new Error("expected ok whole read");
    const sectionRead = readSkill(catalog, bundle, skillId, { sections: [slug] });
    if (!sectionRead.ok) throw new Error("expected ok section read");
    const sectionBody = sectionRead.sections![0]!.content;
    const needle = sectionBody
      .split("\n")
      .slice(1) // skip the "## heading" line
      .map((l) => l.trim())
      .filter((l) => l.length > 15)
      .find((l) => wholeAllowed.content!.split(l).length === 2); // appears exactly once
    expect(needle, "section has a body line unique to it").toBeTruthy();
    expect(wholeAllowed.content).toContain(needle!); // present before denial

    const deniedCatalog: Catalog = {
      ...catalog,
      entries: catalog.entries.map((e) =>
        e.id === sectionEntry.id
          ? { ...e, policy: { allow: false, denyReason: "test: sensitive billing detail" } }
          : e
      )
    };

    const whole = readSkill(deniedCatalog, bundle, skillId);
    expect(whole.ok).toBe(true);
    if (!whole.ok) return;
    // Body excised …
    expect(whole.content).not.toContain(needle!);
    // … replaced by an explicit, reason-carrying marker …
    expect(whole.content).toContain("[section omitted: test: sensitive billing detail]");
    // … while OTHER sections survive and the denied key is unadvertised.
    expect(whole.content!.length).toBeGreaterThan(200);
    expect(whole.availableSections).not.toContain(slug);

    // Section-read of the denied slug still refuses outright.
    const sr = readSkill(deniedCatalog, bundle, skillId, { sections: [slug] });
    expect(sr.ok).toBe(false);
    if (sr.ok) return;
    expect(sr.error.kind).toBe("denied");
  });

  it("refuses denied skills (policy is data)", () => {
    const skill = catalog.entries.find((e) => e.kind === "skill" && e.service === "skills")!;
    const deniedCatalog: Catalog = {
      ...catalog,
      entries: catalog.entries.map((e) =>
        e.id === skill.id
          ? { ...e, policy: { allow: false, denyReason: "test: not exposed" } }
          : e
      )
    };
    const r = readSkill(deniedCatalog, bundle, skill.id);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error.kind).toBe("denied");
  });
});

describe("builder invariant: read-time sectionize agrees with build-catalog sections", () => {
  it("every ## section slug of every bundled skill has a matching skill-section catalog entry", () => {
    // Guards the fail-closed section policy: if build-catalog and read-time
    // sectionize could disagree, a ## section would exist with no catalog entry
    // and become silently unreadable. This must fail LOUDLY instead.
    const sectionIds = new Set(
      catalog.entries.filter((e) => e.kind === "skill-section").map((e) => e.id)
    );
    let skillsChecked = 0;
    for (const e of catalog.entries) {
      if (e.kind !== "skill" || e.service !== "skills") continue;
      if (!e.policy.allow) continue; // retired skills intentionally expose no sections
      if (e.transport?.type !== "file" || typeof e.transport.path !== "string") continue;
      const raw = bundle.files[e.transport.path];
      expect(raw, `bundle missing ${e.transport.path}`).toBeTypeOf("string");
      skillsChecked += 1;
      for (const slug of sectionSlugsOf(raw!)) {
        expect(
          sectionIds.has(`${e.id}#${slug}`),
          `no skill-section catalog entry for ${e.id}#${slug} (build/read sectioning drift)`
        ).toBe(true);
      }
    }
    expect(skillsChecked).toBe(18); // the exposed (allowed) mirror skills
  });
});
