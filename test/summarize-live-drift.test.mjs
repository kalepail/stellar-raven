import { describe, expect, it } from "vitest";
import { classifyOpenapiOperations } from "../scripts/summarize-live-drift.mjs";

const spec = (operation) => ({ paths: { "/api/example": { get: operation } } });

describe("live drift OpenAPI classification", () => {
  it("classifies an x-routing-only change as routing text, not schema", () => {
    const oldSpec = spec({
      operationId: "getExample",
      summary: "Example",
      description: "Read an example",
      "x-routing": { useFor: ["old term"] }
    });
    const nextSpec = spec({
      operationId: "getExample",
      summary: "Example",
      description: "Read an example",
      "x-routing": { useFor: ["new term"] }
    });
    const result = classifyOpenapiOperations(oldSpec, nextSpec, "scout");
    expect(result.textChanged).toEqual(["scout.getExample (GET /api/example)"]);
    expect(result.schemaChanged).toEqual([]);
  });

  it("keeps schema-only changes in the schema bucket", () => {
    const oldSpec = spec({ operationId: "getExample", responses: { 200: { description: "ok" } } });
    const nextSpec = spec({ operationId: "getExample", responses: { 200: { description: "changed" } } });
    const result = classifyOpenapiOperations(oldSpec, nextSpec, "scout");
    expect(result.textChanged).toEqual([]);
    expect(result.schemaChanged).toEqual(["scout.getExample (GET /api/example)"]);
  });

  it("classifies an operationId rename as both surface and routing drift", () => {
    const oldSpec = spec({ operationId: "getExample" });
    const nextSpec = spec({ operationId: "readExample" });
    const result = classifyOpenapiOperations(oldSpec, nextSpec, "scout");
    expect(result.renamed).toEqual([
      "GET /api/example: scout.getExample -> scout.readExample"
    ]);
    expect(result.textChanged).toEqual(["scout.readExample (GET /api/example)"]);
  });
});
