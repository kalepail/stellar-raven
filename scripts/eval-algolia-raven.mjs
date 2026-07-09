#!/usr/bin/env node
/**
 * Probe Algolia strategies for Raven-facing Stellar Docs retrieval.
 *
 * This is intentionally read-only: it never creates indexes, rules, synonyms,
 * events, or crawler tasks. Use it before changing Raven routing or Algolia
 * settings so the known improvements-derived cases have a repeatable baseline.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const PRIMARY_INDEX = "crawler_Stellar Docs - Docusaurus";
const MARKDOWN_INDEX = "crawler_markdown-index";
const DOCS_FACET = [["docusaurus_tag:docs-default-current"]];
const MEETINGS_FACET = [["docusaurus_tag:-docs-default-current"]];

const CASES = [
  {
    id: "sd-006-cli-curl-command",
    finding: "sd-006",
    query: "curl -fsSL github stellar-cli",
    expectUrlIncludes: "/docs/tools/cli/install-cli",
    note: "Command-shaped install query should reach the canonical CLI install page."
  },
  {
    id: "sd-006-cli-install-intent",
    finding: "sd-006",
    query: "stellar cli install command",
    expectUrlIncludes: "/docs/tools/cli/install-cli",
    note: "Natural install intent should not lose to unrelated install-command snippets."
  },
  {
    id: "sd-001-protocol-24",
    finding: "sd-001",
    query: "Protocol 24",
    expectUrlIncludes: "/meetings/",
    note: "Protocol-version query should not collapse into SEP-24 anchor pages."
  },
  {
    id: "sd-003-gettransactions-limits",
    finding: "sd-003",
    query: "getTransactions pagination limit default 50 max 200",
    expectUrlIncludes: "/docs/data/apis/rpc/",
    note: "RPC pagination facts should surface from indexed config/structure pages or a supplement."
  }
];

const STRATEGIES = [
  {
    id: "primary-docs-default",
    index: PRIMARY_INDEX,
    params: { facetFilters: DOCS_FACET }
  },
  {
    id: "primary-strict-exact",
    index: PRIMARY_INDEX,
    params: { facetFilters: DOCS_FACET, removeWordsIfNoResults: "none", queryType: "prefixNone", typoTolerance: false }
  },
  {
    id: "primary-tools-filtered",
    index: PRIMARY_INDEX,
    params: { facetFilters: DOCS_FACET, hitsPerPage: 100 },
    clientFilter: { field: "url_without_anchor", prefixesAnyOf: ["https://developers.stellar.org/docs/tools/cli"] }
  },
  {
    id: "primary-meetings-filtered",
    index: PRIMARY_INDEX,
    params: { facetFilters: MEETINGS_FACET, hitsPerPage: 100 }
  },
  {
    id: "markdown-default",
    index: MARKDOWN_INDEX,
    params: {}
  }
];

function parseArgs(argv) {
  const out = { hitsPerPage: 10, json: false, envFile: undefined };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") out.json = true;
    else if (arg === "--env-file") out.envFile = argv[++i];
    else if (arg === "--hits") out.hitsPerPage = Number(argv[++i]);
    else throw new Error(`unknown argument: ${arg}`);
  }
  return out;
}

function loadDotEnv(path) {
  if (!path || !existsSync(path)) return {};
  const env = {};
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function envCandidates(explicit) {
  return [
    explicit,
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "..", "stellar-raven-codemode", ".env")
  ].filter(Boolean);
}

function requireAlgoliaEnv(args) {
  const fileEnv = Object.assign({}, ...envCandidates(args.envFile).map(loadDotEnv));
  const applicationId = process.env.ALGOLIA_APPLICATION_ID || fileEnv.ALGOLIA_APPLICATION_ID;
  const apiKey = process.env.ALGOLIA_API_KEY || fileEnv.ALGOLIA_API_KEY;
  if (!applicationId || !apiKey) {
    throw new Error("ALGOLIA_APPLICATION_ID / ALGOLIA_API_KEY are required; pass --env-file if .env is elsewhere");
  }
  return { applicationId, apiKey };
}

function breadcrumb(hit) {
  const h = hit.hierarchy ?? {};
  const parts = [];
  for (let i = 0; i <= 6; i++) {
    if (typeof h[`lvl${i}`] === "string" && h[`lvl${i}`]) parts.push(h[`lvl${i}`]);
  }
  return parts.join(" > ");
}

function shapeHit(hit, rank) {
  return {
    rank,
    url: hit.url_without_anchor || hit.url,
    anchor: hit.anchor,
    breadcrumb: breadcrumb(hit) || [hit.title, hit.heading].filter(Boolean).join(" > "),
    snippet: hit._snippetResult?.content?.value || hit._snippetResult?.text?.value || hit.content?.slice(0, 220) || hit.text?.slice(0, 220) || ""
  };
}

async function algoliaQuery({ applicationId, apiKey }, index, params) {
  const res = await fetch(`https://${applicationId}-dsn.algolia.net/1/indexes/${encodeURIComponent(index)}/query`, {
    method: "POST",
    headers: {
      "X-Algolia-Application-Id": applicationId,
      "X-Algolia-API-Key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(8000)
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${index}: ${body.message || `HTTP ${res.status}`}`);
  return body;
}

function applyClientFilter(hits, clientFilter) {
  if (!clientFilter?.prefixesAnyOf) return hits;
  return hits.filter((hit) => {
    const value = hit[clientFilter.field];
    return typeof value === "string" && clientFilter.prefixesAnyOf.some((prefix) => value.startsWith(prefix));
  });
}

function rankExpected(hits, expected) {
  const index = hits.findIndex((hit) => hit.url?.includes(expected));
  return index < 0 ? null : index + 1;
}

async function runCase(auth, testCase, strategy, hitsPerPage) {
  const requestedHits = Math.max(hitsPerPage, strategy.params.hitsPerPage ?? hitsPerPage);
  const body = await algoliaQuery(auth, strategy.index, {
    analytics: false,
    query: testCase.query,
    hitsPerPage: requestedHits,
    attributesToRetrieve: ["url", "url_without_anchor", "anchor", "hierarchy", "type", "content"],
    attributesToSnippet: ["content:24"],
    highlightPreTag: "**",
    highlightPostTag: "**",
    ...strategy.params
  });
  const filtered = applyClientFilter(body.hits ?? [], strategy.clientFilter).slice(0, hitsPerPage);
  const hits = filtered.map(shapeHit);
  return {
    strategy: strategy.id,
    index: strategy.index,
    nbHits: body.nbHits,
    returned: hits.length,
    expectedRank: rankExpected(hits, testCase.expectUrlIncludes),
    topUrl: hits[0]?.url ?? null,
    hits
  };
}

function summarize(results) {
  return results.map((item) => {
    const best = item.results
      .filter((r) => r.expectedRank !== null)
      .sort((a, b) => a.expectedRank - b.expectedRank)[0];
    const defaultRank = item.results.find((r) => r.strategy === "primary-docs-default")?.expectedRank ?? null;
    return {
      id: item.id,
      finding: item.finding,
      query: item.query,
      defaultRank,
      bestStrategy: best?.strategy ?? null,
      bestRank: best?.expectedRank ?? null,
      recommendation:
        best && best.expectedRank <= 3
          ? "Raven-side query strategy/client filter can cover this; do not mutate Algolia settings yet."
          : "Needs supplement records or upstream indexing/rules; query strategy alone did not reach the target."
    };
  });
}

function printHuman(results) {
  for (const item of results) {
    console.log(`\n## ${item.id} (${item.finding})`);
    console.log(`query: ${item.query}`);
    console.log(`target: ${item.expectUrlIncludes}`);
    for (const result of item.results) {
      const rank = result.expectedRank === null ? "miss" : `#${result.expectedRank}`;
      console.log(`- ${result.strategy}: ${rank}; top=${result.topUrl ?? "none"}; nbHits=${result.nbHits}`);
    }
  }
  console.log("\n## Summary");
  for (const row of summarize(results)) {
    console.log(`- ${row.id}: default=${row.defaultRank ?? "miss"}, best=${row.bestStrategy ?? "none"} ${row.bestRank ? `#${row.bestRank}` : ""} — ${row.recommendation}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const auth = requireAlgoliaEnv(args);
  const results = [];
  for (const testCase of CASES) {
    const caseResults = [];
    for (const strategy of STRATEGIES) {
      caseResults.push(await runCase(auth, testCase, strategy, args.hitsPerPage));
    }
    results.push({ ...testCase, results: caseResults });
  }
  if (args.json) console.log(JSON.stringify({ generatedAt: new Date().toISOString(), cases: results, summary: summarize(results) }, null, 2));
  else printHuman(results);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
