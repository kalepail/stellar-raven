import { describe, expect, it } from "vitest";
import { normalizeScoutStatus, parseServiceArg } from "../scripts/refresh-inventory.mjs";

describe("refresh-inventory service selection", () => {
  it("defaults to all and accepts the three isolated refresh lanes", () => {
    expect(parseServiceArg([])).toBe("all");
    expect(parseServiceArg(["--service", "lumenloop"])).toBe("lumenloop");
    expect(parseServiceArg(["--service", "stellar-light"])).toBe("stellar-light");
    expect(parseServiceArg(["--service", "stellar-docs"])).toBe("stellar-docs");
  });

  it("rejects unknown or malformed selectors before reading service credentials", () => {
    expect(() => parseServiceArg(["--service", "nope"])).toThrow(/unknown service/);
    expect(() => parseServiceArg(["stellar-light"])).toThrow(/usage/);
  });
});

describe("Scout status volatility normalization", () => {
  it("strips request telemetry and corpus churn from both observed field names", () => {
    const normalized = normalizeScoutStatus({
      generatedAt: "volatile",
      usage: { requests: 42 },
      version: "1.8.28",
      sources: [{ name: "projects", count: 100, lastUpdatedAt: "today", notes: "volatile" }],
      dataSources: [{ name: "repos", count: 200, lastUpdatedAt: "today", notes: "volatile" }]
    });
    expect(normalized).toEqual({
      version: "1.8.28",
      sources: [{ name: "projects" }],
      dataSources: [{ name: "repos" }]
    });
  });
});
