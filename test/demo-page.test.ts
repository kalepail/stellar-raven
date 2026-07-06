/**
 * /demo page tests — pure rendering, plain Node.
 *
 * The load-bearing one is the CSP hash guard: DEMO_PAGE_HEADERS pins the
 * single inline <script> by sha256 (no 'unsafe-inline' for script). The hash
 * is hard-coded in src/demo/page.ts (Web Crypto is async; the headers are a
 * sync module const), so this test recomputes it from the rendered page —
 * any edit to the client script fails here with the new value to paste in.
 *
 * ADR-0003: the page is emitted text — it must not reference non-exposed
 * ops or retired skills. Checked against the real exclusion data in
 * scripts/exposure.mjs, never a hand-copied list.
 */
import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { demoPage, DEMO_PAGE_HEADERS } from "../src/demo/page";
// The reusable ADR-0003 leak guard (backed by scripts/exposure.mjs data) —
// the design requires running it over the rendered demo HTML.
import { assertNoNonExposedRefsInText } from "../scripts/emitted-text-guard.mjs";

const lockedHtml = demoPage({ authenticated: false });
const chatHtml = demoPage({ authenticated: true });

describe("demo page CSP", () => {
  it("pins the exact inline script by sha256 (no unsafe-inline for script)", () => {
    const scripts = [...chatHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    expect(scripts).toHaveLength(1);
    const hash = createHash("sha256").update(scripts[0]?.[1] ?? "", "utf8").digest("base64");
    const csp = DEMO_PAGE_HEADERS["content-security-policy"] ?? "";
    expect(csp).toContain(`script-src 'sha256-${hash}'`);
    expect(csp).not.toContain("unsafe-eval");
    expect(csp.includes("script-src 'unsafe-inline'")).toBe(false);
  });

  it("keeps the contract-required directives and headers", () => {
    const csp = DEMO_PAGE_HEADERS["content-security-policy"] ?? "";
    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("style-src 'unsafe-inline'");
    expect(csp).toContain("img-src 'self' data:");
    expect(DEMO_PAGE_HEADERS["cache-control"]).toBe("no-store");
    expect(DEMO_PAGE_HEADERS["x-robots-tag"]).toBe("noindex");
  });
});

describe("demo page states", () => {
  it("locked: sign-in link, static example trace, zero script", () => {
    expect(lockedHtml).toContain('href="/demo/login"');
    expect(lockedHtml).toContain("Example session");
    expect(lockedHtml).toContain("soroban smart contract deploy");
    expect(lockedHtml).not.toContain("<script>");
  });

  it("authenticated: composer + trace client wired to /demo/chat", () => {
    expect(chatHtml).toContain('id="composer-form"');
    expect(chatHtml).toContain('id="log"');
    expect(chatHtml).toContain('fetch("/demo/chat"');
    for (const t of ["token", "tool-start", "tool-result", "step", "done", "error"]) {
      expect(chatHtml).toContain(`"${t}"`);
    }
    expect(chatHtml).toContain("stalled"); // the no-result-by-done state
  });

  it("renders envelope kinds honestly — error and soft-empty only, never denied", () => {
    expect(chatHtml).toContain("soft-empty");
    expect(chatHtml).not.toMatch(/denied/i);
  });
});

describe("ADR-0003 — no non-exposed refs in emitted page text", () => {
  for (const [state, html] of [
    ["locked", lockedHtml],
    ["authenticated", chatHtml]
  ] as const) {
    it(`${state} page is clean`, () => {
      expect(() => assertNoNonExposedRefsInText(html, `rendered /demo HTML (${state})`)).not.toThrow();
    });
  }
});
