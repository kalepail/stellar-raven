/**
 * Stellar Docs adapter — hand-rolled Algolia REST client
 * (research/services/stellar-docs-algolia.md: ~50-line fetch core, 4 hosts,
 * escalating timeout, retry on network/5xx ONLY — never 4xx, never 429).
 *
 * Each stellarDocs catalog entry carries its execute mapping in
 * `transport.algolia` (authored in specs/stellar-docs.json, Lane D):
 *  - paramMap           — model arg → Algolia param (exact names).
 *  - fixedParams        — op-pinned params (facetFilters, overfetch, …).
 *  - conditionalParams  — "arg=value" → param overrides (null deletes);
 *    may also disable the clientFilter (category=meetings).
 *  - clientFilter       — hierarchy.lvl0 is NOT facetable, so category ops
 *    overfetch (hitsPerPage 100) and keep hits whose url_without_anchor
 *    matches a URL prefix (placeholders {category}/{path} filled from args).
 *  - derivedQuery       — get_doc_page_sections has no query arg: the query
 *    is derived from the path's last segment (hyphens split), with a
 *    two-segment fallback when the page yields no records.
 *
 * `analytics:false` rides in baseParams on every entry (polite-tenant rule).
 * Zero hits after filtering → kind "soft-empty" ("not in the docs corpus" is
 * a meaningful signal on this index, per the research doc).
 */
import type { CatalogEntry } from "../catalog/types.ts";
import {
  errResult,
  okResult,
  caughtResult,
  type AdapterEnv,
  type AdapterResult,
  type FetchLike
} from "./types.ts";

const SERVICE = "stellarDocs";

type AlgoliaHit = {
  url?: string;
  url_without_anchor?: string;
  anchor?: string;
  type?: string;
  hierarchy?: Record<string, string | null>;
  content?: string;
  weight?: { position?: number };
  _snippetResult?: { content?: { value?: string } };
  [k: string]: unknown;
};

type AlgoliaResponse = {
  hits: AlgoliaHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS?: number;
  message?: string;
  status?: number;
};

type ClientFilter = {
  field: string;
  prefixesAnyOf?: string[];
  equals?: string;
};

type AlgoliaMapping = {
  paramMap?: Record<string, string>;
  fixedParams?: Record<string, unknown>;
  conditionalParams?: Record<string, Record<string, unknown>>;
  clientFilter?: ClientFilter | null;
  derivedQuery?: string;
  fallback?: string;
};

type DocsTransport = {
  index?: string;
  hosts?: string[];
  applicationIdEnv?: string;
  apiKeyEnv?: string;
  baseParams?: Record<string, unknown>;
  algolia?: AlgoliaMapping;
};

/** Fill `{name}` placeholders from args (category prefixes, page path). */
function fillPlaceholders(template: string, args: Record<string, unknown>): string {
  return template.replace(/\{([^}]+)\}/g, (_m, name: string) => String(args[name] ?? ""));
}

/**
 * Raw Algolia query with the documented retry ladder: try each host in order,
 * timeout 2s x attempt-number, retry ONLY on network error / HTTP 5xx.
 * 4xx (and 429) surface immediately — they fail identically on every host.
 */
async function algoliaQuery(
  hosts: string[],
  index: string,
  headers: Record<string, string>,
  params: Record<string, unknown>,
  fetchImpl: FetchLike
): Promise<{ ok: true; body: AlgoliaResponse } | { ok: false; message: string; status?: number }> {
  const path = `/1/indexes/${encodeURIComponent(index)}/query`;
  let lastError = "no algolia hosts configured";
  for (let attempt = 0; attempt < hosts.length; attempt++) {
    try {
      const res = await fetchImpl(`https://${hosts[attempt]}${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(2000 * (attempt + 1))
      });
      const body = (await res.json()) as AlgoliaResponse;
      if (res.status >= 500) {
        lastError = body.message ?? `algolia HTTP ${res.status}`;
        continue; // 5xx → next host
      }
      if (!res.ok) {
        // 4xx incl. 429: request error — do not retry hosts.
        return { ok: false, message: body.message ?? `algolia HTTP ${res.status}`, status: res.status };
      }
      return { ok: true, body };
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e); // network/timeout → next host
    }
  }
  return { ok: false, message: `all algolia hosts failed: ${lastError}` };
}

/** Flatten hierarchy lvl0..lvl6 into a " > " breadcrumb. */
function breadcrumb(hierarchy: Record<string, string | null> | undefined): string {
  if (!hierarchy) return "";
  const parts: string[] = [];
  for (let i = 0; i <= 6; i++) {
    const v = hierarchy[`lvl${i}`];
    if (typeof v === "string" && v.length > 0) parts.push(v);
  }
  return parts.join(" > ");
}

function shapeHit(hit: AlgoliaHit): Record<string, unknown> {
  const shaped: Record<string, unknown> = {
    url: hit.url,
    url_without_anchor: hit.url_without_anchor,
    anchor: hit.anchor,
    type: hit.type,
    breadcrumb: breadcrumb(hit.hierarchy)
  };
  const snippet = hit._snippetResult?.content?.value;
  if (snippet) shaped.snippet = snippet;
  if (typeof hit.content === "string") shaped.content = hit.content;
  return shaped;
}

/** Merge one conditionalParams override block; `null` deletes the param. */
function applyOverrides(
  params: Record<string, unknown>,
  overrides: Record<string, unknown>
): { clientFilterDisabled: boolean } {
  let clientFilterDisabled = false;
  for (const [k, v] of Object.entries(overrides)) {
    if (k === "clientFilter") {
      if (v === null) clientFilterDisabled = true;
      continue;
    }
    if (v === null) delete params[k];
    else params[k] = v;
  }
  return { clientFilterDisabled };
}

export async function callStellarDocs(
  entry: CatalogEntry,
  args: Record<string, unknown>,
  env: AdapterEnv,
  fetchImpl: FetchLike = fetch
): Promise<AdapterResult> {
  const transport = (entry.transport ?? {}) as DocsTransport;
  const mapping = transport.algolia;
  if (entry.transport?.type !== "algolia" || !mapping || !transport.index || !transport.hosts) {
    return errResult({
      service: SERVICE,
      kind: "error",
      message: `catalog entry ${entry.id} has no algolia transport mapping — cannot call it`
    });
  }

  const appId = env[(transport.applicationIdEnv ?? "ALGOLIA_APPLICATION_ID") as keyof AdapterEnv];
  const apiKey = env[(transport.apiKeyEnv ?? "ALGOLIA_API_KEY") as keyof AdapterEnv];
  if (!appId || !apiKey) {
    return errResult({
      service: SERVICE,
      kind: "error",
      message: "ALGOLIA_APPLICATION_ID / ALGOLIA_API_KEY are not configured on the host — docs search is unavailable"
    });
  }

  const hosts = transport.hosts.map((h) => h.replace("{ALGOLIA_APPLICATION_ID}", appId));
  const headers = {
    "X-Algolia-Application-Id": appId,
    "X-Algolia-API-Key": apiKey,
    "Content-Type": "application/json"
  };

  // --- assemble params: baseParams → fixedParams → mapped args → conditionals
  const params: Record<string, unknown> = {
    ...(transport.baseParams ?? {}),
    ...(mapping.fixedParams ?? {})
  };
  for (const [argName, paramName] of Object.entries(mapping.paramMap ?? {})) {
    const v = args[argName];
    if (v !== undefined && v !== null) params[paramName] = v;
  }

  let clientFilter: ClientFilter | null = mapping.clientFilter ?? null;
  for (const [condition, overrides] of Object.entries(mapping.conditionalParams ?? {})) {
    const eq = condition.indexOf("=");
    if (eq < 0) continue;
    const argName = condition.slice(0, eq);
    const expected = condition.slice(eq + 1);
    if (String(args[argName]) !== expected) continue;
    const { clientFilterDisabled } = applyOverrides(params, overrides);
    if (clientFilterDisabled) clientFilter = null;
  }

  // --- get_doc_page_sections: derived query + exact-URL client filter
  const isPageSections = typeof mapping.derivedQuery === "string" && typeof args.path === "string";
  let derivedQueries: string[] = [];
  if (isPageSections) {
    const segments = String(args.path).split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";
    const lastTwo = segments.slice(-2).join(" ");
    const tokens = (s: string) => s.split(/[-_]/).filter(Boolean).join(" ");
    derivedQueries = [tokens(last)];
    const fb = tokens(lastTwo);
    if (fb !== derivedQueries[0]) derivedQueries.push(fb); // documented fallback
    // Sections are sorted by weight.position — make sure it's retrieved.
    const retrieve = params.attributesToRetrieve;
    if (Array.isArray(retrieve) && !retrieve.includes("weight")) {
      params.attributesToRetrieve = [...retrieve, "weight"];
    }
    if (args.includeContent === false && Array.isArray(params.attributesToRetrieve)) {
      params.attributesToRetrieve = (params.attributesToRetrieve as string[]).filter(
        (a) => a !== "content"
      );
    }
  }

  const requestedHits =
    typeof args.hitsPerPage === "number" ? args.hitsPerPage : 5; // schema default

  try {
    if (isPageSections) {
      const target = clientFilter?.equals
        ? fillPlaceholders(clientFilter.equals, args)
        : `https://developers.stellar.org${String(args.path)}`;
      const field = clientFilter?.field ?? "url_without_anchor";
      let usedFallback = false;
      for (let qi = 0; qi < derivedQueries.length; qi++) {
        const res = await algoliaQuery(
          hosts,
          transport.index,
          headers,
          { ...params, query: derivedQueries[qi] },
          fetchImpl
        );
        if (!res.ok) {
          return errResult({
            service: SERVICE,
            kind: "error",
            message: res.message,
            ...(res.status !== undefined ? { status: res.status } : {})
          });
        }
        const records = res.body.hits.filter((h) => h[field] === target);
        if (records.length > 0) {
          records.sort((a, b) => (a.weight?.position ?? 0) - (b.weight?.position ?? 0));
          return okResult({
            page: target,
            sections: records.map(shapeHit),
            nbSections: records.length,
            ...(usedFallback ? { usedFallbackQuery: derivedQueries[qi] } : {})
          });
        }
        usedFallback = true;
      }
      return errResult({
        service: SERVICE,
        kind: "soft-empty",
        message: `no indexed sections found for ${String(args.path)} — the path is not in the docs index (check url_without_anchor from a search hit; auto-generated API-reference pages are not indexed)`
      });
    }

    // --- ordinary search ops (with optional URL-prefix client filter)
    const res = await algoliaQuery(hosts, transport.index, headers, params, fetchImpl);
    if (!res.ok) {
      return errResult({
        service: SERVICE,
        kind: "error",
        message: res.message,
        ...(res.status !== undefined ? { status: res.status } : {})
      });
    }
    const body = res.body;

    let hits = body.hits;
    let clientFiltered = false;
    if (clientFilter?.prefixesAnyOf) {
      const prefixes = clientFilter.prefixesAnyOf.map((p) => fillPlaceholders(p, args));
      const field = clientFilter.field;
      hits = hits.filter((h) => {
        const v = h[field];
        return typeof v === "string" && prefixes.some((p) => v.startsWith(p));
      });
      clientFiltered = true;
    }
    if (clientFiltered) hits = hits.slice(0, requestedHits);

    if (hits.length === 0) {
      return errResult({
        service: SERVICE,
        kind: "soft-empty",
        message:
          body.nbHits === 0
            ? "zero hits — this topic is not in the docs corpus (zero is a reliable negative on this index)"
            : "the index matched pages, but none in this operation's docs category — try stellarDocs.search_docs for a corpus-wide search",
        status: 200
      });
    }

    return okResult({
      hits: hits.map(shapeHit),
      nbHits: body.nbHits,
      nbPages: body.nbPages,
      page: body.page,
      ...(clientFiltered ? { clientFiltered: true } : {})
    });
  } catch (e) {
    return caughtResult(SERVICE, e);
  }
}
