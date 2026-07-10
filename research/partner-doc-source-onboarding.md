# Allowlisted partner documentation as a Raven source

_Todo 910 / GitHub issue #18 design-and-measure spike. Evidence fetched 2026-07-09 through
2026-07-10. Decision: retain a bounded harness and design; do not add a runtime adapter yet._

## Decision

Public partner Markdown is a credible fourth **authority class**, but arbitrary MCP federation is
not. Raven should admit named documentation sources through host-owned configuration, immutable
provenance, and the existing manifest/executor boundary. The model must never supply a URL, select
an unreviewed `llms.txt` child, inherit a partner MCP's tools, or receive partner credentials.

The spike found a strong retrieval signal: eight fixed partner-specific cases scored 7/64 (10.9%)
against one current Raven source call and 63/64 (98.4%) against the admitted first-party Markdown,
with zero fetch errors and a 172.4 ms p95 over eight candidate fetches. That result passes the
diagnostic retrieval-admission threshold. It does **not** pass the ship gate: the cases were
page-derived, the baseline was not an answering agent, reliability was sampled only once, and the
security/runtime contract has not been implemented or independently exercised. Land the harness
and this design; defer manifest and adapter code until the paired headline gate passes.

## What was evaluated

GitHub issue #18 correctly identifies two different gaps: Alchemy's new Stellar products were
absent from Raven, while OpenZeppelin was represented by periodically synced skills rather than a
live docs surface. The issue's suggestion to use partner MCPs is directionally useful but too broad
as an integration rule ([issue #18](https://github.com/kalepail/stellar-raven/issues/18)).

| Partner | Public docs surface | MCP surface | Finding |
| --- | --- | --- | --- |
| Alchemy | A small root [`llms.txt`](https://www.alchemy.com/docs/llms.txt) links section indexes; the [Data index](https://www.alchemy.com/docs/data/llms.txt) links direct Markdown for the Stellar overview and transfer/balance/NFT endpoints. | The hosted server currently documents 168 tools, OAuth 2.1, and eight account/app tools including `create_app`, `update_app`, `select_app`, and `update_allowlist` ([Alchemy MCP docs](https://www.alchemy.com/docs/alchemy-mcp-server)). | The Markdown is a bounded docs source. The MCP is a mixed authenticated operational surface and is not an acceptable docs proxy. |
| OpenZeppelin | A public [`llms.txt`](https://docs.openzeppelin.com/llms.txt) inventories Stellar Contracts and Relayer pages; rendered pages expose raw MDX from the public `OpenZeppelin/docs` repository ([Stellar suite](https://docs.openzeppelin.com/stellar-contracts), [source at measured commit](https://github.com/OpenZeppelin/docs/blob/f304ed55579dedf7ee0d2cc46982cca67c48e700/content/stellar-contracts/index.mdx)). | The hosted MCP advertises contract generation for Stellar and other languages, not documentation retrieval ([OpenZeppelin MCP](https://mcp.openzeppelin.com)). | The docs/MDX are the relevant source. The MCP would add a generation surface Raven did not ask for. |

Alchemy's docs make the gap concrete. Its [Stellar Data API overview](https://www.alchemy.com/docs/reference/stellar-data-api-overview.md)
states that indexed native, Classic, and Soroban data includes transfers, balances, and NFT
holdings with opaque `pageKey` pagination; its separate [Stellar RPC quickstart](https://www.alchemy.com/docs/reference/stellar-api-quickstart.md)
documents the provider JSON-RPC endpoint. The two products must not be conflated.

OpenZeppelin's live docs are broader than the three mirrored procedural skills. The current suite
index includes smart accounts, token families, governance, utilities, and fee abstraction; the
current [smart-account source](https://github.com/OpenZeppelin/docs/blob/f304ed55579dedf7ee0d2cc46982cca67c48e700/content/stellar-contracts/accounts/smart-account.mdx)
documents context rules, signers/verifiers, policies, and `AuthPayload`, while the
[RWA source](https://github.com/OpenZeppelin/docs/blob/f304ed55579dedf7ee0d2cc46982cca67c48e700/content/stellar-contracts/tokens/rwa/rwa.mdx)
covers the T-REX-derived compliance and identity modules. This is evidence for a docs source, not a
decision about whether Raven should keep whole skills; todo 890 owns that broader form-factor
question.

The open `stellar/stellar-docs#2573` corrects one stale paragraph in the official Indexers page and
links Alchemy's two first-party product pages ([PR #2573](https://github.com/stellar/stellar-docs/pull/2573),
[patch](https://patch-diff.githubusercontent.com/raw/stellar/stellar-docs/pull/2573.patch)). It is a
good upstream correction and eventual corroborating source. It does not solve the systemic cadence
problem, and until it merges, deploys, and is crawled it is not live Raven evidence.

## Authority and conflict handling

Authority is claim-scoped, never a global ranking:

1. Stellar Docs, protocol repositories, SEPs, and CAPs remain authoritative for protocol behavior,
   network status, standards, and official SDF recommendations.
2. A partner's first-party docs are authoritative for that partner's own products, endpoints,
   supported features, versions, and operational guidance.
3. Mirrored skills are procedural interpretation pinned to a source commit. They may help an agent
   use a product, but they do not override newer first-party reference docs.
4. Community services remain discovery/corroboration for ecosystem facts; they do not promote a
   partner claim into protocol truth.

Results must keep sources separate. If official Stellar Docs and a partner page disagree, return
both with dates/provenance and label the conflict; do not merge them into a synthetic fact or let a
newer timestamp silently win. A partner's marketing statement is still a first-party claim, not
independent verification.

## Admission contract

Admission is an owned repo change, not runtime discovery. A source declaration would contain:

```ts
type PartnerDocSource = {
  id: "alchemy-stellar" | "openzeppelin-stellar";
  authority: "partner-first-party";
  discoveryUrl: string;
  allowedOrigins: readonly string[];
  allowedPathPrefixes: readonly string[];
  admittedPages: readonly { id: string; canonicalUrl: string }[];
  owner: string;
  licenseOrTermsReview: { reviewedAt: string; cacheMode: "transient" | "snapshot-permitted" };
};
```

An admission change must satisfy all of these:

- public HTTPS GET/HEAD only; no OAuth, API key, cookies, POST, MCP, webhooks, or account context;
- exact origins and path prefixes; no caller URL and no arbitrary proxy behavior;
- `text/markdown` or `text/plain` UTF-8 only, with a per-document and per-call byte cap;
- named source owner, authority scope, license/terms review, and at least two representative
  positive cases plus one negative/conflict case;
- root discovery links are inventory candidates only. A new `llms.txt` child causes drift review;
  it never becomes reachable automatically;
- redirects are manual and every target must pass the same allowlist; IP literals, alternate
  ports, userinfo, origin changes, and percent-encoded pathnames fail closed;
- the declaration and generated inventory carry hashes. Raw GitHub content is resolved from a
  reviewed branch to a 40-character commit and fetched from that immutable revision before
  promotion. The measured OpenZeppelin commit was
  `f304ed55579dedf7ee0d2cc46982cca67c48e700`; the measured `alchemyplatform/docs` repository
  commit was `181f472af296f63ef608b6d04e7acc0a5a5706c2`.

The todo-910 harness implements the outer read-only subset now: fixed URLs, the two origins/path
families, redirect revalidation, UTF-8/type checks, 256 KiB cap, and no partner MCP/API calls. It
does not claim to be the production adapter.

## Provenance and result shape

Every returned page or hit needs enough provenance to reproduce the bytes:

```ts
type PartnerDocProvenance = {
  sourceId: string;
  pageId: string;
  canonicalUrl: string;
  discoveryUrl: string;
  fetchedAt: string;
  sha256: string;
  etag?: string;
  lastModified?: string;
  resolvedCommit?: string;
  cache: "fresh" | "revalidated" | "stale-if-error";
  authority: "partner-first-party";
};
```

The adapter must return bounded plain-text sections/snippets plus this object. It must never place
fetched prose in catalog descriptions, server instructions, tool error hints, or another trusted
control channel. URLs in results remain data-derived/untrusted under Raven's existing source-basis
rules.

## Fetch, cache, timeout, and drift policy

The measured documents were 786–24,040 bytes for the admitted case pages. Alchemy returned
`text/markdown` with `cache-control: public, max-age=3600`; OpenZeppelin raw GitHub returned
`text/plain` with `max-age=300` and an ETag. Single local fetches were 13–238 ms across repeated
diagnostic runs. These observations justify a short bounded host fetch, not an unbounded crawler.

Production proposal:

- 2 second deadline per fetch, at most one retry for timeout/network/5xx, never retry 4xx;
- at most three pages and 128 KiB total returned source text per operation; truncate by parsed
  section, never by permitting a larger model boundary;
- Cache API fresh TTL = the smaller of the upstream `max-age` and one hour; conditional
  revalidation with ETag/Last-Modified when available;
- a last-known-good body may be used for up to 24 hours on timeout/5xx only, explicitly marked
  `stale-if-error` with the original `fetchedAt`; never use stale content after an allowlist,
  content-type, hash-policy, or prompt-review failure;
- daily inventory fetches discovery indexes and admitted pages, records hash/link/status drift,
  and opens the existing live-drift workflow on any change. New/deleted links, redirects, source
  repo movement, and content-type changes require review. No auto-repair and no automatic
  manifest expansion.

## Prompt injection and supply-chain treatment

Partner docs are untrusted content even when the domain is first-party. Markdown/MDX is parsed as
data: frontmatter and executable MDX components are dropped, HTML is sanitized, code fences remain
quoted text, and embedded URLs are never fetched during a user request. Instruction-like text is
tagged for telemetry and review, but regex scanning is not the security boundary.

The actual boundaries are architectural:

- fetched content cannot change the manifest, operation args, adapter URL, headers, auth, or cache
  policy;
- the networkless Dynamic Worker still has `globalOutbound: null`; only the host adapter performs
  allowlisted reads;
- model-authored code receives inert strings and provenance, never a partner client or credential;
- `llms.txt` is not trusted as executable routing input. Its links are compared with an admitted
  inventory, and unknown links fail closed;
- immutable commit resolution, SHA-256 recording, size/type/redirect enforcement, and drift review
  address repository/domain compromise and unexpected generator changes;
- no content is committed or retained beyond the reviewed cache mode until redistribution/license
  terms are recorded.

The diagnostic scanner found zero narrow instruction-like signals in the eight measured pages.
That is an observation only; it is not evidence that future bytes are safe.

## Normalization: data, soft-empty, and error

The normal Raven envelope remains unchanged:

- `ok: true, data`: at least one admitted, relevant section was retrieved; data includes the
  provenance and cache state above;
- `soft-empty`: upstream retrieval succeeded and parsing succeeded, but the admitted corpus had no
  relevant hit. This is inconclusive and never evidence that the partner lacks the feature;
- `error`: timeout after bounded retry, DNS/TLS/5xx, 429, admitted-page 404/removal, invalid UTF-8,
  disallowed content type/redirect, size overflow, parse failure, or integrity/policy failure.

HTTP 404 on an admitted page is contract drift, not a soft-empty search answer. HTTP 4xx is not
retried. A stale-if-error success remains data but is visibly stale; it must not be normalized into
fresh data. Caller-supplied or unknown source/page ids fail argument validation before any fetch.

## Manifest exposure if the ship gate passes

Do not create a generic `fetch_url`, `call_partner_mcp`, or caller-selected endpoint. The smallest
useful surface is one host adapter with two manifest-authored operations whose source identities are
closure-captured, for example:

- `partnerDocs.search_alchemy_stellar_docs({ query, hitsPerPage? })`
- `partnerDocs.search_openzeppelin_stellar_docs({ query, hitsPerPage? })`

The manifest entries would expose query and bounded paging only. Their transport contains a
`sourceId`, never a URL. Build scripts must emit only admitted sources into the manifest, super
spec, providers, and micro-map; `assertNoNonExposedRefs` must cover rejected partner MCP/admin
surfaces. Exact operation and page ids remain mandatory. A page-detail operation is optional and,
if justified by measurement, accepts only page ids from the same generated inventory.

This is deliberately separate from skills. Partner docs provide current reference evidence;
todo 890 decides whether procedural skills stay whole, sectioned, become resources, or are retired.

## Measured A/B ship gate

The current harness is phase zero. A runtime change may ship only after every phase passes:

1. **Retrieval admission (deterministic):** expand the eight page-derived cases with at least four
   independent paraphrase/negative/conflict cases. On the same case set, candidate fact recall must
   improve by at least 20 percentage points, win at least three cases, regress zero cases, return
   only allowlisted cited URLs, and have zero fetch/policy errors. The 2026-07-10 run passes this
   phase on the original eight only (+87.5 points, eight wins, zero regressions).
2. **Reliability:** at least 100 read-only probes across cold/warm cache and both partners over a
   24-hour window: >=99% success, p95 live-fetch <=1 second, zero redirect/type/size violations,
   and verified 304/stale-if-error behavior. Not run.
3. **Paired headline QA:** same answering model, judge model, questions, and rubric for current
   Raven (A) versus the candidate manifest/adapter (B). Use at least 16 partner cases: positive,
   paraphrased, conflict/authority, absent-feature, source-failure, and prompt-injection cases.
   B must produce at least three net `wrong/partial -> correct` wins, zero new wrong answers, zero
   unsupported partner claims, and correct citations/provenance on every partner-specific claim.
   OpenZeppelin cases must show incremental value beyond the current skill/docs paths. Not run.
4. **Repo non-regression and security:** `eval:routing -- --gate`, baseline validation, generated
   artifact sync, explicit redirect/SSRF/size/type/cache/error tests, injected-instruction tests,
   secrets scan, and an independent security/design review. Not run.

The ship decision is therefore **no runtime adapter in todo 910**. The evidence supports continued
work through this bounded general mechanism, not a bespoke query hack and not partner MCP proxying.

## Sources

- [Raven issue #18](https://github.com/kalepail/stellar-raven/issues/18)
- [stellar/stellar-docs PR #2573](https://github.com/stellar/stellar-docs/pull/2573)
- [PR #2573 patch](https://patch-diff.githubusercontent.com/raw/stellar/stellar-docs/pull/2573.patch)
- [Alchemy root llms.txt](https://www.alchemy.com/docs/llms.txt)
- [Alchemy Data llms.txt](https://www.alchemy.com/docs/data/llms.txt)
- [Alchemy Stellar Data API overview](https://www.alchemy.com/docs/reference/stellar-data-api-overview.md)
- [Alchemy Stellar RPC quickstart](https://www.alchemy.com/docs/reference/stellar-api-quickstart.md)
- [Alchemy MCP server documentation](https://www.alchemy.com/docs/alchemy-mcp-server)
- [OpenZeppelin root llms.txt](https://docs.openzeppelin.com/llms.txt)
- [OpenZeppelin Stellar Contracts docs](https://docs.openzeppelin.com/stellar-contracts)
- [OpenZeppelin docs repository, measured commit](https://github.com/OpenZeppelin/docs/tree/f304ed55579dedf7ee0d2cc46982cca67c48e700/content/stellar-contracts)
- [OpenZeppelin MCP surface](https://mcp.openzeppelin.com)
