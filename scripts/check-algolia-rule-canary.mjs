#!/usr/bin/env node
/**
 * Fail-loud behavioral guard for load-bearing Stellar Docs Algolia rules.
 *
 * Read-only by construction: this script uses only the search endpoint and the
 * dedicated search key. Every request sets analytics:false and compares rules
 * enabled with enableRules:false. It never reads rule metadata and never
 * creates or modifies indexes, settings, rules, synonyms, events, or tasks.
 *
 * Exit codes:
 *   0 = assertions pass, or credentials are absent in default inconclusive mode
 *   1 = a named behavioral assertion failed (drift)
 *   2 = configuration/request/check error
 */
import { resolve } from "node:path";
import { parseEnvFile } from "./lib/shared.mjs";
import {
  PRIMARY_INDEX,
  RULE_CANARY_CASES,
  buildRuleCanaryParams,
  evaluateRuleCanary,
  rankLabel,
} from "./lib/algolia-rule-canary.mjs";

function parseArgs(argv) {
  const args = { envFile: undefined, requireEnv: false, selfTestDrift: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--env-file") {
      const path = argv[++i];
      if (!path || path.startsWith("--")) throw new Error("--env-file requires a path");
      args.envFile = path;
    } else if (arg === "--require-env") args.requireEnv = true;
    else if (arg === "--self-test-drift") args.selfTestDrift = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function readAuth(args) {
  const fileEnv = args.envFile ? parseEnvFile(resolve(args.envFile)) : {};
  const env = { ...fileEnv, ...process.env };
  const missing = ["ALGOLIA_APPLICATION_ID_DOCS", "ALGOLIA_API_KEY_DOCS"].filter((name) => !env[name]);
  if (missing.length) return { missing };
  return {
    applicationId: env.ALGOLIA_APPLICATION_ID_DOCS,
    apiKey: env.ALGOLIA_API_KEY_DOCS,
    missing: [],
  };
}

async function search({ applicationId, apiKey }, params) {
  const hosts = [
    `${applicationId}-dsn.algolia.net`,
    `${applicationId}-1.algolianet.com`,
    `${applicationId}-2.algolianet.com`,
    `${applicationId}-3.algolianet.com`,
  ];
  let lastError;
  for (let attempt = 0; attempt < hosts.length; attempt += 1) {
    try {
      const response = await fetch(
        `https://${hosts[attempt]}/1/indexes/${encodeURIComponent(PRIMARY_INDEX)}/query`,
        {
          method: "POST",
          headers: {
            "X-Algolia-Application-Id": applicationId,
            "X-Algolia-API-Key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
          signal: AbortSignal.timeout(4_000 * (attempt + 1)),
        },
      );
      if (response.status >= 500) {
        lastError = new Error(`HTTP ${response.status} from search host ${attempt + 1}`);
        continue;
      }
      if (!response.ok) {
        throw Object.assign(new Error(`HTTP ${response.status} from Algolia search`), { final: true });
      }
      const body = await response.json();
      if (!Array.isArray(body.hits)) {
        throw Object.assign(new Error("Algolia search response has no hits array"), { final: true });
      }
      return body.hits;
    } catch (error) {
      if (error && typeof error === "object" && error.final) throw error;
      lastError = error;
    }
  }
  throw new Error(`all Algolia search hosts failed: ${lastError?.message ?? "unknown error"}`);
}

async function run(auth) {
  const results = [];
  for (const testCase of RULE_CANARY_CASES) {
    const [rulesOnHits, rulesOffHits] = await Promise.all([
      search(auth, buildRuleCanaryParams(testCase, true)),
      search(auth, buildRuleCanaryParams(testCase, false)),
    ]);
    results.push(evaluateRuleCanary(testCase, rulesOnHits, rulesOffHits));
  }
  return results;
}

function printResults(results) {
  const assertions = results.flatMap((result) => result.assertions);
  for (const result of results) {
    console.log(
      `${result.id}: rules-on ${rankLabel(result.rulesOnRank)}; rules-off ${rankLabel(result.rulesOffRank)}`,
    );
    for (const assertion of result.assertions) {
      console.log(
        `${assertion.ok ? "PASS" : "FAIL"} [${assertion.name}] ${assertion.actual}; expected ${assertion.expected}`,
      );
    }
  }
  const failed = assertions.filter((assertion) => !assertion.ok);
  if (failed.length) {
    console.error(
      `algolia rule canary: DRIFT (${failed.length}/${assertions.length} named assertions failed; read-only; analytics=false)`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `algolia rule canary: PASS (${assertions.length} named assertions; read-only; analytics=false)`,
    );
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTestDrift) {
    const unrelated = [{ url_without_anchor: "https://developers.stellar.org/docs/unrelated" }];
    printResults(
      RULE_CANARY_CASES.map((testCase) => evaluateRuleCanary(testCase, unrelated, unrelated)),
    );
    return;
  }
  const auth = readAuth(args);
  if (auth.missing.length) {
    const message = `missing host credentials ${auth.missing.join(", ")}`;
    if (args.requireEnv) throw new Error(message);
    console.log(`algolia rule canary: INCONCLUSIVE (${message}; no requests made)`);
    return;
  }
  printResults(await run(auth));
}

main().catch((error) => {
  console.error(`algolia rule canary: ERROR (${error instanceof Error ? error.message : String(error)})`);
  process.exit(2);
});
