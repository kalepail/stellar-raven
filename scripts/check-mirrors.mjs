#!/usr/bin/env node
// check-mirrors.mjs — validate the ecosystem-skills/ mirror in THIS repo.
//
// Adapted from stellar-raven-next/scripts/check-mirrors.mjs; the agents-docs
// checks were dropped (that mirror is not lifted here). Kept: the skills-mirror
// validation — manifest completeness, files-on-disk, skill_count, group
// coverage (no duplicates, no ungrouped skills), catalog.json presence.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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
    for (const skill of source.skills) {
      const id = `${source.id}/${skill.name}`;
      skillIds.add(id);
      for (const file of skill.files) {
        assertFile(
          `ecosystem-skills/skills/${id}/${file.path}`,
          `ecosystem-skills manifest lists missing file: ${id}/${file.path}`,
        );
      }
    }
    // Vendored upstream LICENSE/NOTICE files (redistribution notices) —
    // THIRD-PARTY-NOTICES.md depends on these being present, so a manifest
    // entry with no file on disk must fail just like a missing skill file.
    for (const file of source.license_files ?? []) {
      assertFile(
        `ecosystem-skills/skills/${source.id}/${file}`,
        `ecosystem-skills manifest lists missing license/notice file: ${source.id}/${file}`,
      );
    }
    if ((source.license_files ?? []).length === 0) {
      fail(
        `ecosystem-skills source "${source.id}" vendors no upstream LICENSE/NOTICE — ` +
          `every mirrored source must carry its redistribution notice (see THIRD-PARTY-NOTICES.md)`,
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

checkEcosystemSkills();

if (failures.length) {
  console.error("mirror checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("mirror checks ok");
