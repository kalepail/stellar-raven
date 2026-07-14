import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { observationContextBlock } from "../src/policy/observation-context.ts";

const ROOT = join(import.meta.dirname, "..");

describe("host observation context", () => {
  it("is a compact data-only block", () => {
    expect(
      observationContextBlock({
        observedAt: "2026-07-14T15:30:00.000Z",
        catalogGeneratedAt: "2026-07-14T00:00:00.000Z"
      })
    ).toBe(
      '\n\n--- OBSERVATION CONTEXT ---\n{"observedAt":"2026-07-14T15:30:00.000Z","catalogGeneratedAt":"2026-07-14T00:00:00.000Z"}'
    );
  });

  it("does not leak the runtime result boundary into generated catalog or spec artifacts", () => {
    for (const path of ["catalog/manifest.json", "specs/super-spec.json", "src/mcp/micro-map.ts"]) {
      const artifact = readFileSync(join(ROOT, path), "utf8");
      expect(artifact).not.toContain("OBSERVATION CONTEXT");
      expect(artifact).not.toContain("observationContext");
    }
  });
});
