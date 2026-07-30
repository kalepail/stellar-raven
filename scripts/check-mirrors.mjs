#!/usr/bin/env node
// check-mirrors.mjs — validate the ecosystem-skills/ PIN SET in THIS repo.
//
// Skill bodies are not vendored here (they are fetched from upstream at the
// pinned commit and hash-verified — see ecosystem-skills/README.md), so this
// validates the pin metadata rather than files on disk: manifest completeness,
// a resolvable commit + blob sha per file, skill_count, group coverage (no
// duplicates, no ungrouped skills), catalog.json presence.
//
// Offline by default. With --fetch it additionally retrieves every pinned file
// and verifies it against its blob sha — the end-to-end check that the pins the
// Worker serves from still resolve upstream.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readSkillFile } from "./lib/skill-mirror.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const failures = [];

function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT, path), "utf8"));
}

function fail(message) {
  failures.push(message);
}

function assertFile(path, message = `${path} is missing`) {
  if (!existsSync(join(ROOT, path))) fail(message);
}

function collectGroupMembers(groupsPath) {
  const { groups } = readJson(groupsPath);
  const members = [];
  for (const group of groups) {
    for (const member of group.members ?? []) {
      members.push({ member, group: group.id ?? group.title ?? "<unknown>" });
    }
  }
  return members;
}

function checkNoDuplicateMembers(label, members) {
  const seen = new Map();
  for (const { member, group } of members) {
    if (seen.has(member)) {
      fail(`${label}: ${member} is listed in both ${seen.get(member)} and ${group}`);
    }
    seen.set(member, group);
  }
}

function checkEcosystemSkills() {
  const manifest = readJson("ecosystem-skills/MANIFEST.json");
  if (manifest.status !== "complete") {
    fail(`ecosystem-skills mirror is ${manifest.status}; expected complete`);
  }

  const skillIds = new Set();
  for (const source of manifest.sources) {
    // A pin is only usable if it names an immutable commit: everything
    // downstream (transport URLs, integrity checks) is derived from it.
    if (!/^[0-9a-f]{40}$/.test(source.commit ?? "")) {
      fail(`ecosystem-skills source "${source.id}" has no full commit SHA (got "${source.commit}")`);
    }
    for (const skill of source.skills) {
      const id = `${source.id}/${skill.name}`;
      skillIds.add(id);
      for (const file of skill.files) {
        // The blob sha IS the integrity contract with upstream — a file
        // without one could be fetched but never verified.
        if (!/^[0-9a-f]{40}$/.test(file.sha ?? "")) {
          fail(`ecosystem-skills manifest lists ${id}/${file.path} without a git blob sha`);
        }
      }
    }
    // Upstream license/notice names are recorded as provenance (nothing is
    // redistributed) — THIRD-PARTY-NOTICES.md maps each source to its license,
    // so a source with none recorded means the map cannot be verified.
    if ((source.license_files ?? []).length === 0) {
      fail(
        `ecosystem-skills source "${source.id}" records no upstream LICENSE/NOTICE — ` +
          `every source must carry its license provenance (see THIRD-PARTY-NOTICES.md)`,
      );
    }
  }

  if (manifest.skill_count !== skillIds.size) {
    fail(`ecosystem-skills skill_count is ${manifest.skill_count}, but manifest contains ${skillIds.size} skills`);
  }

  const members = collectGroupMembers("ecosystem-skills/groups.json");
  const memberIds = new Set(members.map(({ member }) => member));
  checkNoDuplicateMembers("ecosystem-skills/groups.json", members);

  for (const { member, group } of members) {
    if (!skillIds.has(member)) {
      fail(`ecosystem-skills/groups.json lists ${member} in ${group}, but it is not in MANIFEST.json`);
    }
  }

  const uncategorized = [...skillIds].filter((id) => !memberIds.has(id));
  if (uncategorized.length) {
    fail(`ecosystem-skills has uncategorized skills: ${uncategorized.join(", ")}`);
  }

  assertFile("ecosystem-skills/catalog.json");
  assertFile("ecosystem-skills/INDEX.md");
}

/** --fetch: prove every pin still resolves upstream and hashes as recorded. */
async function checkPinsResolve() {
  const manifest = readJson("ecosystem-skills/MANIFEST.json");
  const jobs = [];
  for (const source of manifest.sources) {
    for (const skill of source.skills) {
      for (const file of skill.files) {
        jobs.push(
          readSkillFile(source, skill.name, file).catch((e) =>
            fail(`ecosystem-skills pin unusable: ${source.id}/${skill.name}/${file.path} — ${e.message}`),
          ),
        );
      }
    }
  }
  await Promise.all(jobs);
  console.log(`fetched + verified ${jobs.length} pinned skill files`);
}

checkEcosystemSkills();
if (process.argv.includes("--fetch")) await checkPinsResolve();

if (failures.length) {
  console.error("mirror checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("mirror checks ok");
