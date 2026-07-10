import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { writeFileAtomic } from "../scripts/lib/shared.mjs";

const roots = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("writeFileAtomic", () => {
  it("replaces the destination and leaves no temporary sibling", () => {
    const root = mkdtempSync(join(tmpdir(), "raven-atomic-"));
    roots.push(root);
    const destination = join(root, "artifact.json");
    writeFileAtomic(destination, "first\n");
    writeFileAtomic(destination, "second\n");
    expect(readFileSync(destination, "utf8")).toBe("second\n");
    expect(readdirSync(root)).toEqual(["artifact.json"]);
  });

  it("cleans the temporary file when replacement fails", () => {
    const root = mkdtempSync(join(tmpdir(), "raven-atomic-"));
    roots.push(root);
    const destination = join(root, "artifact.json");
    mkdirSync(destination);

    expect(() => writeFileAtomic(destination, "replacement\n")).toThrow();
    expect(statSync(destination).isDirectory()).toBe(true);
    expect(readdirSync(root)).toEqual(["artifact.json"]);
  });
});
