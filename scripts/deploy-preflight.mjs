#!/usr/bin/env node
/**
 * Deploy preflight — runs as npm `predeploy`, before `wrangler deploy`.
 *
 * `wrangler deploy` bundles the WORKING TREE, not a commit. With several agents
 * committing path-scoped from one shared checkout, the tree is intermittently
 * equal to no commit at all: on 2026-07-30 the root briefly held a local commit
 * with four files reverted, and a deploy in that window would have shipped a
 * partial tree while appearing to ship main. The same shared-tree churn split
 * one change across two commits (9ccfeb4 / b8acfff), leaving main red between
 * them. This refuses to deploy anything that is not exactly the pushed commit.
 *
 * Override with DEPLOY_ALLOW_UNCLEAN=1 for a deliberate off-main deploy.
 */
import { spawnSync } from "node:child_process";

/**
 * Pure decision half, so the rules are testable without a git fixture.
 * @returns {string[]} human-readable failures; empty means safe to deploy.
 */
export function preflightFailures({ dirty, head, origin, fetchFailed }) {
  const failures = [];
  if (fetchFailed) {
    failures.push("could not reach origin — cannot prove HEAD matches the pushed commit");
  }
  if (dirty) {
    failures.push(`working tree is not clean; wrangler would bundle these changes:\n${dirty}`);
  }
  if (head && origin && head !== origin) {
    failures.push(`HEAD (${head.slice(0, 8)}) is not origin/main (${origin.slice(0, 8)})`);
  }
  return failures;
}

function git(...args) {
  const r = spawnSync("git", args, { encoding: "utf8" });
  return { ok: r.status === 0, out: (r.stdout ?? "").trim() };
}

// Executed only when run as a script, so the test can import the pure half.
if (process.argv[1] && process.argv[1].endsWith("deploy-preflight.mjs")) {
  if (process.env.DEPLOY_ALLOW_UNCLEAN === "1") {
    console.warn("deploy preflight SKIPPED (DEPLOY_ALLOW_UNCLEAN=1) — deploying the working tree as-is");
    process.exit(0);
  }
  const failures = preflightFailures({
    dirty: git("status", "--porcelain").out,
    head: git("rev-parse", "HEAD").out,
    origin: git("rev-parse", "origin/main").out,
    fetchFailed: !git("fetch", "--quiet", "origin", "main").ok
  });

  if (failures.length) {
    console.error("deploy preflight FAILED — refusing to deploy:\n");
    for (const f of failures) console.error(`  - ${f}`);
    console.error(
      "\nwrangler deploy bundles the working tree, not a commit. Commit and push, or" +
        "\ndeploy from a clean checkout pinned to the intended commit." +
        "\nDeliberate off-main deploy: DEPLOY_ALLOW_UNCLEAN=1 npm run deploy"
    );
    process.exit(1);
  }
  console.log("deploy preflight ok — tree clean and HEAD == origin/main");
}
