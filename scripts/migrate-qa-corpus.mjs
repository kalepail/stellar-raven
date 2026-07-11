#!/usr/bin/env node
/**
 * One-shot migration from the compiled, post-override QA view to the owned
 * super-corpus. This script is intentionally independent from compile-qa.mjs:
 * C3/C4 remain inert until the C5 compiler cutover.
 */
import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QA_DIR = path.join(ROOT, "eval/qa");
const OUTPUT_ROOT = path.join(QA_DIR, "corpus");
const BATTERY_ROOT = path.join(OUTPUT_ROOT, "battery");
const LIVE_ROOT = path.join(OUTPUT_ROOT, "live");
const MIGRATION_DATE = "2026-07-11";
const GT_SOURCE = "solo://proj/49/scratchpad/truth-maintenance-20--575";
const EXPECTED_IDS_SHA256 = "7acd51ab9e11b989d3a7ff429a966f080af351eb4cb8e1f55b8a2579ef660e6c";

const CATEGORY_MAP = new Map([
  ["protocol-core", "protocol-core"],
  ["soroban", "soroban"],
  ["tooling-infra", "tooling-infra"],
  ["assets-anchors-seps", "assets-anchors-seps"],
  ["defi-ecosystem", "defi-ecosystem"],
  ["scf-grants-builders", "scf-grants-builders"],
  ["compliance-rwa-payments", "compliance-rwa-payments"],
  ["history-org-tokenomics", "history-org-tokenomics"],
  ["edge-governance", "edge-behavior"]
]);
const ALL_CATEGORIES = [...new Set([...CATEGORY_MAP.values(), "retail-consumer"])].sort();

const SKILL_SURFACES = new Map([
  ["q-defi-agentic-payment-standards-compare", "skills.stellar-dev.agentic-payments"],
  ["q-defi-x402-on-stellar-what", "skills.stellar-dev.agentic-payments"],
  ["q-soroban-x402-auth-entry-signing", "skills.stellar-dev.agentic-payments"],
  ["q-soroban-zk-bls12-381", "skills.stellar-dev.zk-proofs"],
  ["q-soroban-zk-bn254-poseidon", "skills.stellar-dev.zk-proofs"],
  ["q-soroban-zk-groth16-verifier", "skills.stellar-dev.zk-proofs"],
  ["q-soroban-oz-token", "skills.openzeppelin-stellar.develop-secure-contracts"],
  ["q-soroban-oz-upgradeable-macro", "skills.openzeppelin-stellar.upgrade-stellar-contracts"],
  ["q-ti-bindings-to-nextjs-integration", "skills.stellar-dev.dapp"],
  ["q-ti-connect-wallet-button-code", "skills.stellar-dev.dapp"],
  ["q-soroban-fuzz-testing", "skills.stellar-dev.smart-contracts"],
  ["q-soroban-vuln-classes", "skills.stellar-dev.smart-contracts"],
  ["q-sor-recurring-escrow-patterns", "skills.stellar-dev.smart-contracts"]
]);

const SURFACE_RULES = [
  ["scout", /\brfp|sponsor brief|open for submission|which .*round is (?:currently )?open/i, ["scout.getRfps"]],
  ["scout", /compare.*hackathon|hackathon.*(?:versus|\bvs\b)/i, ["scout.compareHackathons"]],
  ["scout", /hackathon/i, ["scout.getHackathons", "scout.getHackathon"]],
  ["scout", /\bbuilders?\b.*(?:hire|find|recruit|located|region|profile)|developers? (?:in|from|located)|teammate|passport/i, ["scout.getBuilders"]],
  ["scout", /leaderboard|most.?active|most.?starred|top (?:stellar )?projects|dev(?:eloper)? activity|active developers|electric capital/i, ["scout.getLeaderboard"]],
  ["scout", /crowded|underbuilt|whitespace|saturat|clusters?|market map|how many projects/i, ["scout.getClusters"]],
  ["scout", /total (?:scf|prize|funding)|mean award|ecosystem.?wide|built vs abandoned|overall state/i, ["scout.analyzeEcosystem"]],
  ["scout", /partner|anchor.*(?:directory|list|find)|audit firm|auditor|on.?\/?off.?ramp|service provider/i, ["scout.getPartners", "scout.matchPartners"]],
  ["scout", /\bskills?\b.*(?:install|list|catalog|available|mcp server)|skill\.md|skills\.stellar\.org/i, ["scout.listSkills", "scout.getSkill"]],
  ["scout", /repos?\b|github|source code|reference implementation|boilerplate|template|starter/i, ["scout.searchRepos"]],
  ["scout", /where is .*defined|how does .*implemented|internals|stellar-core.*(?:code|source)|deep ?wiki/i, ["scout.explainRepo"]],
  ["scout", /audit|incident|post.?mortem|exploit|vulnerab|whitepaper|scp\b|travel rule|fatf|kyc|aml|sanction|scf|sdf\b|enterprise fund|governance|ambassador|history|supply|tokenomics|unhcr/i, ["scout.searchResearch"]],
  ["scout", /who (?:has )?built|is there a\b|which (?:wallets|projects|dexes|anchors|protocols|marketplaces)|directory|funded project|competitor|prior art|explorer/i, ["scout.searchProjects"]],
  ["scout", /how fresh|as of when|endpoints? exist|api surface|changelog/i, ["scout.getStatus", "scout.getChangelog"]],
  ["lumenloop", /scf|community fund|submission|proposal|award|funded|grant/i, ["lumenloop.get_scf_submissions", "lumenloop.find_similar_scf_submissions"]],
  ["lumenloop", /talk|video|podcast|spaces|said|interview|episode|recording|speaker/i, ["lumenloop.find_av_passages"]],
  ["lumenloop", /mention|entity|coverage of|content (?:about|mentioning)/i, ["lumenloop.find_content_by_entity"]],
  ["lumenloop", /what is [A-Z]|who builds|project.*(?:profile|details|slug)|directory|based in|region|category of/i, ["lumenloop.search_directory", "lumenloop.get_project"]],
  ["lumenloop", /similar (?:projects?|to)|projects? like/i, ["lumenloop.find_similar_projects_semantic"]],
  ["lumenloop", /mentioned projects|projects.*mention/i, ["lumenloop.get_related_projects"]],
  ["lumenloop", /vocabulary|controlled|categories list|which regions|tag list/i, ["lumenloop.get_categories", "lumenloop.get_project_tags_vocabulary", "lumenloop.get_tags_vocabulary", "lumenloop.get_regions"]],
  ["lumenloop", /article|latest news|recent (?:news|articles)|events? (?:in|coming)|upcoming|browse/i, ["lumenloop.list_documents", "lumenloop.search_documents", "lumenloop.get_document"]],
  ["lumenloop", /lumenloop.*(?:research|report|editorial)|research (?:piece|draft|library)/i, ["lumenloop.list_research"]],
  ["lumenloop", /what.*(?:said|written|published|covered)|content about|news about|what's new|recent|coverage|narrative|sentiment|theme/i, ["lumenloop.search_content_semantic"]],
  ["lumenloop", /content about [A-Z]|coverage of [A-Z]|articles about/i, ["lumenloop.find_content_about_project"]],
  ["stellarDocs", /anchor|sep-?(?:1|6|10|12|24|31|38)\b|deposit|withdraw|disbursement|kyc|stellar\.toml/i, ["stellarDocs.search_anchor_sep_docs"]],
  ["stellarDocs", /asset|token|trustline|clawback|issuer|stablecoin|sac\b|sep-?41|authorization flag|regulated/i, ["stellarDocs.search_asset_token_docs"]],
  ["stellarDocs", /soroban|contract|rust|storage|ttl|state archival|auth|wasm|host function|cross-contract|testutils|fuzz/i, ["stellarDocs.search_soroban_contract_docs"]],
  ["stellarDocs", /\brpc\b|horizon|getledgerentries|simulatetransaction|hubble|galexie|indexer|bigquery|pagination|streaming|ingest/i, ["stellarDocs.search_rpc_horizon_data_docs"]],
  ["stellarDocs", /\bsdk\b|stellar-cli|stellar cli|\bcli\b|lab\b|quickstart|scaffold|docker|npm|python sdk|js sdk/i, ["stellarDocs.search_sdk_cli_tools_docs"]],
  ["stellarDocs", /wallet|dapp|passkey|webauthn|payment app|freighter|frontend/i, ["stellarDocs.search_wallet_dapp_docs"]],
  ["stellarDocs", /ledger|account|sequence number|base reserve|fee|operation|transaction|consensus|scp\b|xlm\b|multisig|threshold|claimable|path payment|sdex|amm|xdr\b|testnet|futurenet|mainnet/i, ["stellarDocs.search_protocol_concepts_docs"]],
  ["stellarDocs", /meeting|cap-?\d+.*(?:discuss|vote|decid)|protocol (?:upgrade|version).*(?:vote|when|introduc)/i, ["stellarDocs.search_meeting_notes"]]
];

const DEFAULT_SURFACE = {
  stellarDocs: ["stellarDocs.search_docs"],
  scout: ["scout.searchResearch"],
  lumenloop: ["lumenloop.search_directory"],
  none: []
};

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function sortedIdsSha256(cases) {
  return sha256(cases.map((c) => c.id).sort().join("\n") + "\n");
}

function sourceClass(ref) {
  const value = String(ref);
  if (/developers\.stellar\.org|stellar\.org|communityfund\.stellar\.org|stellar\.gitbook\.io/i.test(value)) return "A";
  if (/github\.com\/stellar(?:\/|-)|stellar-protocol|stellar-core|soroban|eval\/corpus/i.test(value)) return "B";
  if (/stellarlight|lumenloop|scout\.|live production|live (?:api|probe|execute|network)/i.test(value)) return "C";
  if (/\b(?:cli|test|simulation|probe|execution|empirical|blind|re-deriv)/i.test(value)) return "F";
  return "D";
}

function observedAt(value, fallback = MIGRATION_DATE) {
  const dates = String(value).match(/20\d\d-\d\d-\d\d/g) ?? [];
  return dates.filter((date) => date <= MIGRATION_DATE).sort().at(-1) ?? fallback;
}

function inferSources(goldenSources, fallbackRef) {
  const refs = (goldenSources ?? []).map((source) =>
    typeof source === "string" ? { ref: source } : source
  );
  if (refs.length === 0) refs.push({ ref: fallbackRef });
  return refs.map(({ ref, note }) => ({
    class: sourceClass(ref),
    ref,
    note: [note, "class inferred at migration"].filter(Boolean).join("; ")
  }));
}

function classEvidence(text) {
  const value = String(text);
  const prefix = value.match(/^([A-F](?:(?:\+|\/)[A-F])*)\s*:/i)?.[1];
  const classes = prefix ? prefix.toUpperCase().split(/[+\/]/) : [sourceClass(value)];
  return [...new Set(classes)].map((klass) => ({
    class: klass,
    ref: value,
    observedAt: observedAt(value),
    note: "verbatim legacy evidence descriptor imported at migration"
  }));
}

function loadNormalization() {
  const table = readJson("scripts/qa-corpus-verdict-normalization.json");
  return new Map(table.rows.map((row) => [row.source, row.normalized]));
}

function normalizeCorroboration(rows, normalization) {
  return (rows ?? []).map((row) => {
    const verdict = normalization.get(row.verdict);
    if (!verdict) throw new Error(`unmapped corroboration verdict: ${row.verdict}`);
    const legacyNote = verdict === row.verdict ? undefined : `Legacy verdict: ${row.verdict}.`;
    return {
      claim: row.claim,
      verdict,
      evidence: row.classes.flatMap(classEvidence),
      ...([row.notes, legacyNote].filter(Boolean).length
        ? { note: [row.notes, legacyNote].filter(Boolean).join(" ") }
        : {})
    };
  });
}

function truthStatus(corroboration) {
  const verdicts = new Set(corroboration.map((row) => row.verdict));
  if (verdicts.has("disputed")) return "disputed";
  if (verdicts.has("unverifiable")) {
    return [...verdicts].some((v) => !["unverifiable", "contradicted"].includes(v))
      ? "mixed"
      : "unverifiable";
  }
  return "confirmed";
}

function normalizedDomain(value) {
  if (value === "real-world" || value === "corpus-grounded" || value === "mixed") return value;
  const text = String(value).toLowerCase();
  if (text.includes("mixed") || (text.includes("corpus") && !text.startsWith("corpus-grounded"))) return "mixed";
  if (text.startsWith("corpus-grounded")) return "corpus-grounded";
  return "real-world";
}

function reverifyBy(horizon, id) {
  const watchlist = new Set([
    "q-asset-rwa-tokenized-freshness",
    "q-defi-blend-scf-funding",
    "q-scf-history-blend",
    "q-eco-stellar-rwa-stablecoin-volume",
    "q-scf-history-soroswap",
    "q-ti-run-tune-own-horizon",
    "q-ti-scaffold-stellar",
    "q-ti-sdk-package-rename"
  ]);
  if (watchlist.has(id)) return "2026-08-01";
  if (["realtime", "weekly"].includes(horizon)) return "2026-08-01";
  if (["monthly", "scf-round"].includes(horizon)) return "2026-09-01";
  if (["annual", "yearly"].includes(horizon)) return "2027-07-01";
  return "2026-10-01";
}

function surfacesFor(c) {
  const skill = SKILL_SURFACES.get(c.id);
  if (skill) return [skill];
  const text = `${c.question}\n${c.graderNotes ?? c.golden?.notes ?? ""}`;
  const hits = SURFACE_RULES
    .filter(([service, regex]) => service === c.tags.service && regex.test(text))
    .flatMap(([, , surfaces]) => surfaces);
  return [...new Set(hits.length ? hits : DEFAULT_SURFACE[c.tags.service] ?? [])].sort();
}

function goldenFor(c) {
  return {
    answer: c.golden.answer,
    keyFacts: c.golden.keyFacts,
    avoid: c.golden.avoid,
    ...(c.graderNotes ? { notes: c.graderNotes } : {})
  };
}

function migrateBatteryCase(c, override, cluster, sourceFile, normalization) {
  const category = CATEGORY_MAP.get(c.tags.category);
  if (!category) throw new Error(`category ${c.tags.category} has no design mapping (${c.id})`);
  const freshness = c.tags.liveData ? "live" : c.tags.freshness ? "scheduled" : "stable";
  const corroboration = override
    ? normalizeCorroboration(override.corroboration, normalization)
    : [];
  const status = override ? truthStatus(corroboration) : "confirmed";
  const sourceFallback = `eval/corpus/raven-next/${sourceFile ?? `research/golden/${c.id}.md`}`;
  const evidence = override?.evidence ?? [GT_SOURCE];
  const domain = normalizedDomain(override?.truthDomain ?? cluster.truthDomain);
  const truth = {
    domain,
    status,
    ...((freshness !== "stable" || status !== "confirmed")
      ? { asOf: observedAt([c.golden.answer, c.graderNotes, ...evidence].join("\n")) }
      : {}),
    ...(freshness === "scheduled"
      ? { reverifyBy: reverifyBy(c.tags.freshnessHorizon, c.id) }
      : {}),
    sources: inferSources(c.golden.sources, sourceFallback),
    ...(corroboration.length ? { corroboration } : {}),
    verified: {
      date: observedAt(evidence.join("\n")),
      by: override
        ? `Golden-truth sweep import — ${override.why}`
        : `${cluster.cluster} accepted in Solo scratchpad 575 rev 291`,
      evidence,
      ...(override ? { rootCause: override.rootCause } : {})
    },
    origin: `raven-next ${c.id}`
  };
  if (["q-ti-run-tune-own-horizon", "q-ti-scaffold-stellar", "q-ti-sdk-package-rename"].includes(c.id)) {
    truth.verified.note = "GT-53 final state imported from process 3153; near-term re-verification retained by design.";
  }
  const service = SKILL_SURFACES.has(c.id) ? "skills" : c.tags.service;
  const migrated = {
    id: c.id,
    question: c.question,
    surface: surfacesFor({ ...c, tags: { ...c.tags, service } }),
    golden: goldenFor(c),
    tags: {
      category,
      service,
      freshness,
      ...(c.tags.trap ? { trap: c.tags.trap } : {})
    },
    truth
  };
  return migrated;
}

function liveSurface(c) {
  const exact = {
    "q-live-rfps-open-now": ["scout.getRfps"],
    "q-live-rfps-passkey-smart-account": ["scout.getRfps"],
    "q-live-hackathon-recent-winners": ["scout.getHackathon"],
    "q-live-zk-repos-current": ["scout.searchRepos"],
    "q-live-oracle-repo-triage": ["scout.searchRepos"],
    "q-live-leaderboard-active-projects": ["scout.getLeaderboard"],
    "q-live-ecosystem-crowded-underbuilt": ["scout.getClusters"],
    "q-live-ll-scf-latest-round": ["lumenloop.get_scf_submissions"],
    "q-live-ll-regions-vocab": ["lumenloop.get_regions"],
    "q-live-trap-market-price": [],
    "q-live-digest-rwa-recent": ["skills.lumenloop.stellar-ecosystem-digest"],
    "q-live-digest-blend-coverage": ["skills.lumenloop.stellar-ecosystem-digest"]
  };
  return exact[c.id] ?? surfacesFor(c);
}

function migrateLiveFile(inputPath, outputName, contract) {
  const input = readJson(inputPath);
  const cases = input.cases.map((c) => {
    const category = CATEGORY_MAP.get(c.tags.category);
    if (!category) throw new Error(`live category ${c.tags.category} has no design mapping (${c.id})`);
    return {
      id: c.id,
      question: c.question,
      surface: liveSurface(c),
      golden: goldenFor(c),
      tags: {
        category,
        service: c.tags.service,
        freshness: "live",
        ...(c.tags.trap ? { trap: c.tags.trap } : {})
      },
      truth: {
        domain: c.tags.service === "none" ? "real-world" : "mixed",
        status: "confirmed",
        asOf: input.authoredAt,
        sources: inferSources(c.golden.sources, inputPath),
        verified: {
          date: input.authoredAt,
          by: `${input.contract} behavioral contract migrated mechanically to v2`,
          evidence: [inputPath]
        },
        origin: `${input.contract} ${c.id}`
      }
    };
  });
  const membership = cases.map((c) => c.id);
  const digest = sha256(JSON.stringify(cases));
  const output = {
    $comment: input.$comment
      .replaceAll(input.contract, contract)
      .replaceAll("eval/qa/live-cases.json", "eval/qa/corpus/live/live-cases.json")
      .replaceAll(
        "eval/qa/live-digest-supplement-cases.json",
        "eval/qa/corpus/live/live-digest-supplement-cases.json"
      ),
    contract,
    membership,
    contractProvenance: {
      ...input.contractProvenance,
      membership: `Ordered membership pinned explicitly in ${contract}.`,
      content: `Case bodies schema-migrated mechanically from ${input.contract}; judge-visible projection unchanged.`,
      caseContentDigest: `sha256(JSON.stringify(cases))=${digest}`
    },
    authoredAt: input.authoredAt,
    cases
  };
  writeJson(path.join(LIVE_ROOT, outputName), output);
}

function writeJson(file, value) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function clearGeneratedJson() {
  for (const category of ALL_CATEGORIES) {
    const dir = path.join(BATTERY_ROOT, category);
    mkdirSync(dir, { recursive: true });
    for (const name of readdirSync(dir)) {
      if (name.endsWith(".json")) rmSync(path.join(dir, name));
    }
  }
  mkdirSync(LIVE_ROOT, { recursive: true });
}

function main() {
  const compiled = readJson("eval/qa/cases.json");
  const cases = compiled.cases;
  if (cases.length !== 469) throw new Error(`expected 469 compiled cases, found ${cases.length}`);
  const idHash = sortedIdsSha256(cases);
  if (idHash !== EXPECTED_IDS_SHA256) {
    throw new Error(`compiled case checksum drift: expected ${EXPECTED_IDS_SHA256}, found ${idHash}`);
  }
  const actualCategories = [...new Set(cases.map((c) => c.tags.category))].sort();
  const unknownCategories = actualCategories.filter((category) => !CATEGORY_MAP.has(category));
  if (unknownCategories.length) {
    throw new Error(`STOP: current categories do not map mechanically: ${unknownCategories.join(", ")}`);
  }

  const overrides = readJson("eval/qa/golden-overrides.json").overrides;
  const clustersFile = readJson("scripts/qa-corpus-gt-clusters.json");
  if (clustersFile.sortedActiveIdsSha256 !== idHash || clustersFile.source !== GT_SOURCE) {
    throw new Error("GT cluster import metadata does not match the frozen compiled corpus");
  }
  const clusterById = new Map();
  for (const cluster of clustersFile.clusters) {
    for (const id of cluster.caseIds) {
      if (clusterById.has(id)) throw new Error(`duplicate GT cluster assignment: ${id}`);
      clusterById.set(id, cluster);
    }
  }
  const missingClusters = cases.map((c) => c.id).filter((id) => !clusterById.has(id));
  if (missingClusters.length || clusterById.size !== cases.length) {
    throw new Error(`GT cluster assignment mismatch: missing=${missingClusters.join(",")} assigned=${clusterById.size}`);
  }

  const normalization = loadNormalization();
  const sourceRows = readJson("eval/corpus/raven-next/research/golden/compiled/golden.json");
  const sourceFiles = new Map(sourceRows.map((row) => [row.id, row.sourceFile]));
  clearGeneratedJson();

  const ledger = [];
  for (const c of cases) {
    const migrated = migrateBatteryCase(
      c,
      overrides[c.id],
      clusterById.get(c.id),
      sourceFiles.get(c.id),
      normalization
    );
    writeJson(path.join(BATTERY_ROOT, migrated.tags.category, `${migrated.id}.json`), migrated);
    ledger.push({
      sourceId: c.id,
      source: "battery-2026-07",
      disposition: "carry",
      destination: [c.id],
      reason: overrides[c.id]?.why ?? `Carried unchanged after ${clusterById.get(c.id).cluster} verification.`
    });
  }
  writeJson(path.join(OUTPUT_ROOT, "migration-ledger.json"), {
    $comment: "Permanent losslessness ledger for the owned QA super-corpus; seeded mechanically from the frozen 469-case battery.",
    schema: "qa-migration-ledger-v1",
    sourceIdsSha256: idHash,
    rows: ledger
  });

  migrateLiveFile(
    "eval/qa/live-cases.json",
    "live-cases.json",
    "live-data-canonical-v2"
  );
  migrateLiveFile(
    "eval/qa/live-digest-supplement-cases.json",
    "live-digest-supplement-cases.json",
    "live-digest-supplement-v2"
  );

  console.log(`migrated ${cases.length} battery cases`);
  console.log(`battery ids sha256 ${idHash}`);
  console.log(`ledger rows ${ledger.length}`);
  console.log("live contracts 10 + 2");
}

main();
