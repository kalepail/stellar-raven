import { describe, expect, test } from "vitest";
// @ts-expect-error — plain .mjs script, no type declarations
import { preflightFailures } from "../scripts/deploy-preflight.mjs";

const CLEAN = { dirty: "", head: "a".repeat(40), origin: "a".repeat(40), fetchFailed: false };

describe("deploy preflight", () => {
  test("passes only when the tree is clean and HEAD is the pushed commit", () => {
    expect(preflightFailures(CLEAN)).toEqual([]);
  });

  test("refuses a dirty tree — wrangler would bundle the uncommitted changes", () => {
    const failures = preflightFailures({ ...CLEAN, dirty: " M src/site.ts" });
    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain("src/site.ts");
  });

  test("refuses when HEAD is not origin/main, in either direction", () => {
    // Unpushed local commit: the deployed bundle would exist nowhere on the remote.
    expect(preflightFailures({ ...CLEAN, head: "b".repeat(40) })).toHaveLength(1);
    // Behind the remote: another agent pushed and this tree would ship stale code.
    expect(preflightFailures({ ...CLEAN, origin: "c".repeat(40) })).toHaveLength(1);
  });

  test("fails closed when origin is unreachable", () => {
    // Without a fetch, HEAD == origin/main proves nothing — the ref may be stale.
    const failures = preflightFailures({ ...CLEAN, fetchFailed: true });
    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain("origin");
  });

  test("reports every violation at once rather than stopping at the first", () => {
    expect(
      preflightFailures({ dirty: " M a.ts", head: "b".repeat(40), origin: "c".repeat(40), fetchFailed: true })
    ).toHaveLength(3);
  });
});
