/**
 * Workflow archetypes for the Phase 1 discovery micro-map.
 *
 * Authored data, guarded at build time:
 * - `families` must be real catalog service families.
 * - every `steps[].id` must be an exact exposed manifest id.
 * - emitted prose is checked by the ADR-0003 text guards.
 *
 * Phase 2 will reuse this same file for workflow catalog cards; keep the
 * shapes compact and model-facing.
 */

export const SERVICE_FAMILY_PURPOSES = [
  {
    family: "lumenloop",
    label: "Lumenloop",
    line:
      "Community and editorial ecosystem intelligence: project directory/details, published research, documents, content search, AV passages, SCF submissions, related projects, and similar-project discovery.",
    authority:
      "Primary for project dossiers, funding or SCF context, editorial/community content, and ecosystem narratives; corroborate governance, standards, incident, and audit claims."
  },
  {
    family: "scout",
    label: "Scout",
    line:
      "Stellar Light/Scout ecosystem graph: projects, repos, builders, SDF people, hackathons and prior-art builds, audits, stablecoins, leaderboards, research, skills, partners, clusters, changelog, and status.",
    authority:
      "Primary for people, events, repos, partners, project discovery, and comparative ecosystem views; corroborate editorial/funding context with Lumenloop."
  },
  {
    family: "stellarDocs",
    label: "Stellar Docs",
    line:
      "Official Stellar documentation and meeting-note search: protocol concepts, SDK/CLI, smart contracts, RPC/Horizon, anchors, assets, wallets, dapps, and page sections.",
    authority:
      "Authority for protocol behavior, standards status, API shape, implementation reference, and current official wording."
  },
  {
    family: "skills",
    label: "Skills",
    line:
      "Pinned operational playbooks: tested build, integration, security, recovery, data, wallet, asset, standards, ZK, and agentic-payment procedures.",
    authority:
      "Authority for how-to workflows when read by section; pair with Stellar Docs for current reference truth and services for live ecosystem facts."
  }
];

export const FAMILY_LINE =
  "Families: lumenloop=community/editorial projects, research, content, SCF/funding; use for what's-been-said/editorial/freshness skims; scout=live ecosystem graph: projects, repos, people, hackathon builds, audits, stablecoins, partners; stellarDocs=official protocol/SDK/CLI/contracts/RPC/anchor/wallet docs; skills=tested build/integration/security playbooks.";

export const AUTHORITY_RULES = [
  "Use the family that can actually ground the claim, then add a corroborating family when the question crosses source boundaries.",
  "Treat Scout research items and Lumenloop articles/content as community-aggregated sources; protocol-governance, standards-authorship, incident, and audit claims stay unverified until corroborated by Stellar Docs or skills content.",
  "Official docs are authority for protocol, standards, API, and implementation claims; for ecosystem facts (funding/awards/amounts, program names, coverage/directories, who-builds-what, adoption), start Scout/Lumenloop even when docs mention the topic, then use docs only to corroborate standards mechanics."
];

export const WORKFLOW_ARCHETYPES = [
  {
    id: "project-funding-lookup",
    title: "Project/funding lookup",
    questionShape: "Who builds/funds project X, and which named SCF Build/Liquidity/Public-Goods award or grant program, award amount, or ecosystem context applies?",
    families: ["lumenloop", "scout"],
    steps: [
      { id: "lumenloop.search_directory", why: "find the canonical Lumenloop project row" },
      { id: "lumenloop.get_project", why: "read project detail, tags, links, and summary fields" },
      { id: "lumenloop.get_scf_submissions", why: "pull SCF/funding submission context" },
      { id: "scout.searchProjects", why: "cross-check the live Scout project graph" },
      { id: "scout.getBuilders", why: "tie projects to public builder profiles when relevant" }
    ]
  },
  {
    id: "editorial-community-content",
    title: "Editorial/community content",
    questionShape: "What has the ecosystem written or said about X?",
    families: ["lumenloop"],
    steps: [
      { id: "lumenloop.search_content_semantic", why: "start broad over community/editorial content" },
      { id: "lumenloop.find_content_about_project", why: "anchor content to one project when known" },
      { id: "lumenloop.search_documents", why: "find long-form documents and articles" },
      { id: "lumenloop.get_document", why: "read the selected source instead of answering from snippets" }
    ]
  },
  {
    id: "protocol-sdk-factual",
    title: "Protocol/SDK factual",
    questionShape: "What does Stellar officially say about protocol, SDK, CLI, or API behavior?",
    families: ["stellarDocs"],
    steps: [
      { id: "stellarDocs.search_protocol_concepts_docs", why: "route protocol terminology to official docs" },
      { id: "stellarDocs.search_sdk_cli_tools_docs", why: "route SDK and CLI usage to official docs" },
      { id: "stellarDocs.search_docs", why: "broaden when the exact docs category is unclear" },
      { id: "stellarDocs.get_doc_page_sections", why: "read the relevant page sections before citing details" }
    ]
  },
  {
    id: "build-integrate-implementation",
    title: "Design/build/integrate",
    questionShape: "How should I design a Stellar contract, dapp, SDK, protocol, or infrastructure component?",
    families: ["scout", "skills", "stellarDocs"],
    steps: [
      { id: "scout.searchProjects", why: "check existing prior art" },
      { id: "scout.searchRepos", why: "make one bounded repo pass" },
      { id: "skills.stellar-dev.smart-contracts", why: "use the contract playbook" },
      { id: "stellarDocs.search_soroban_contract_docs", why: "verify contract APIs" },
      { id: "skills.stellar-dev.dapp", why: "use dapp and client playbooks" },
      { id: "stellarDocs.search_wallet_dapp_docs", why: "verify wallet APIs" },
      { id: "stellarDocs.search_sdk_cli_tools_docs", why: "verify SDK APIs" },
      { id: "skills.stellar-dev.standards", why: "use the standards playbook" },
      { id: "stellarDocs.search_protocol_concepts_docs", why: "verify protocol concepts" },
      { id: "skills.stellar-dev.data", why: "use the data playbook" },
      { id: "stellarDocs.search_rpc_horizon_data_docs", why: "verify infrastructure APIs" }
    ]
  },
  {
    id: "implementation-debug",
    title: "Known-step implementation/debug",
    questionShape: "How do I implement, deploy, or debug one already-scoped Stellar step?",
    families: ["skills", "stellarDocs"],
    steps: [
      { id: "skills.stellar-dev.smart-contracts", why: "use the tested smart-contract workflow playbook" },
      { id: "stellarDocs.search_soroban_contract_docs", why: "verify current contract APIs and examples" },
      { id: "skills.stellar-dev.dapp", why: "use the frontend/wallet integration playbook" },
      { id: "stellarDocs.search_wallet_dapp_docs", why: "verify current wallet and dapp behavior" }
    ]
  },
  {
    id: "ecosystem-people-events",
    title: "Ecosystem people/events",
    questionShape: "Who participated, built, won, or showed up in a hackathon or ecosystem event?",
    families: ["scout", "lumenloop"],
    steps: [
      { id: "scout.getHackathons", why: "enumerate hackathon/event records" },
      { id: "scout.getHackathon", why: "read one event with projects and participants" },
      { id: "scout.searchHackathonBuilds", why: "search the cross-hackathon prior-art build index" },
      { id: "scout.getPeople", why: "resolve SDF staff, leadership, and board identities" },
      { id: "scout.getBuilders", why: "resolve builder identities and profiles" },
      { id: "lumenloop.search_directory", why: "cross-check project identity and ecosystem context" },
      { id: "lumenloop.search_content_semantic", why: "broaden open-world identity or event history after a narrow directory miss" },
      { id: "scout.searchResearch", why: "corroborate historical claims against cited research" }
    ]
  },
  {
    id: "evidence-poor-open-world-recovery",
    title: "Evidence-poor open-world recovery",
    questionShape: "Who or what is an obscure Stellar entity, what is its history, or what should I do when narrow lookups return empty or only adjacent candidates?",
    families: ["lumenloop", "scout", "stellarDocs"],
    steps: [
      { id: "lumenloop.search_content_semantic", why: "search broadly across dated community, editorial, event, and research content" },
      { id: "scout.searchResearch", why: "search the cited vector research corpus for history and primary-source leads" },
      { id: "scout.searchProjects", why: "test whether an unknown name resolves to a structured project identity" },
      { id: "stellarDocs.search_docs", why: "check official technical wording, authorship, or protocol history" },
      { id: "lumenloop.find_av_passages", why: "add spoken-material candidates only when the question needs talks or interviews" }
    ]
  },
  {
    id: "incident-audit-claim",
    title: "Incident/audit claim",
    questionShape: "Did an incident, exploit, audit finding, or governance claim happen?",
    families: ["scout", "lumenloop", "stellarDocs", "skills"],
    steps: [
      { id: "scout.listAudits", why: "enumerate structured ecosystem audit records" },
      { id: "lumenloop.search_content_semantic", why: "find community reports or discussion" },
      { id: "lumenloop.find_av_passages", why: "locate cited spoken/video source passages when present" },
      { id: "stellarDocs.search_docs", why: "corroborate official technical or governance facts" },
      { id: "skills.lumenloop.stellar-content-auditor", why: "apply the content-audit playbook before asserting the claim" }
    ]
  },
  {
    id: "asset-anchor-coverage",
    title: "Asset/anchor coverage",
    questionShape: "Which/how many assets, anchors, rails, or partners cover a payment/tokenization flow, including exhaustive directory or coverage listings?",
    families: ["scout", "lumenloop", "stellarDocs", "skills"],
    steps: [
      { id: "scout.getStablecoins", why: "start with the structured Stellar stablecoin directory" },
      { id: "scout.getPartners", why: "start with ecosystem partner and anchor directory coverage" },
      { id: "lumenloop.search_directory", why: "cross-check directory listings and project identity" },
      { id: "lumenloop.search_content_semantic", why: "pull editorial coverage and freshness context when listings are current or exhaustive" },
      { id: "stellarDocs.search_anchor_sep_docs", why: "ground anchor and SEP behavior in official docs" },
      { id: "stellarDocs.search_asset_token_docs", why: "ground asset/SAC token behavior in official docs" },
      { id: "skills.stellar-dev.assets", why: "apply the asset/trustline/SAC operational playbook" }
    ]
  },
  {
    id: "wallet-tooling-comparison",
    title: "Wallet/tooling comparison",
    questionShape: "Which wallet, SDK, repo, or tool should I compare or use?",
    families: ["stellarDocs", "skills", "scout"],
    steps: [
      { id: "stellarDocs.search_wallet_dapp_docs", why: "ground wallet and dapp integration constraints" },
      { id: "skills.stellar-dev.dapp", why: "apply the frontend/wallet integration playbook" },
      { id: "scout.searchRepos", why: "discover live repos and tooling projects" },
      { id: "scout.explainRepo", why: "inspect one repo's role before recommending it" }
    ]
  },
  {
    id: "data-rpc-indexing",
    title: "Data/RPC indexing",
    questionShape: "How do I read chain data, transactions, events, ledgers, or history?",
    families: ["stellarDocs", "skills"],
    steps: [
      { id: "stellarDocs.search_rpc_horizon_data_docs", why: "ground RPC/Horizon behavior in official docs" },
      { id: "skills.stellar-dev.data", why: "apply the data/query/indexing workflow playbook" },
      { id: "stellarDocs.get_doc_page_sections", why: "read exact sections for parameters and caveats" }
    ]
  },
  {
    id: "landscape-similarity",
    title: "Landscape/similarity scan",
    questionShape: "What projects are similar to X, adjacent to a category, or part of a landscape?",
    families: ["lumenloop", "scout"],
    steps: [
      { id: "lumenloop.find_similar_projects_semantic", why: "find semantically similar ecosystem projects from a known project" },
      { id: "scout.analyzeEcosystem", why: "compare the broader live ecosystem cluster" },
      { id: "scout.getClusters", why: "inspect Scout's cluster view when categories are fuzzy" }
    ]
  }
];
