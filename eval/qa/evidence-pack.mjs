const EVIDENCE_PACK_MAX_CHARS = 12000;
export const PACK_VERSION = "p3";
const MAX_CANONICAL_URLS = 8;
const INITIAL_MAX_ITEMS = 18;
const INITIAL_MAX_FACTS = 28;
const INITIAL_MAX_CLAIM_SNIPPETS = 12;
const INITIAL_SUMMARY_CHARS = 520;
const MIN_SUMMARY_CHARS = 180;
const INITIAL_CLAIM_SNIPPET_CHARS = 520;
const MIN_CLAIM_SNIPPET_CHARS = 260;

function stripAnsi(value) {
  return String(value ?? "").replace(/\u001b\[[0-9;]*m/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termMatchRegExp(term, flags = "gi") {
  const escaped = escapeRegExp(term);
  if (isNumericLikeClaimTerm(term)) {
    return new RegExp(`(?<![\\p{L}\\p{N},.])${escaped}(?![\\p{L}\\p{N},.])`, flags.includes("u") ? flags : `${flags}u`);
  }
  return new RegExp(escaped, flags);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, maxChars) {
  const text = cleanText(value);
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(0, maxChars - 3))}...`;
}

function truncateAroundTerm(value, term, maxChars) {
  const text = cleanText(value);
  if (text.length <= maxChars) return text;
  const match = termMatchRegExp(term, "i").exec(text);
  if (!match) return truncate(text, maxChars);
  const room = Math.max(0, maxChars - 6);
  const before = Math.floor((room - match[0].length) / 2);
  const start = Math.max(0, match.index - Math.max(0, before));
  const end = Math.min(text.length, start + room);
  return `${start > 0 ? "..." : ""}${text.slice(start, end)}${end < text.length ? "..." : ""}`;
}

function sanitizeUrl(raw) {
  if (!raw) return "";
  try {
    const url = new URL(String(raw));
    if (url.protocol !== "https:") return "";
    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";
    return url.href;
  } catch {
    return "";
  }
}

function sanitizeUrlsInText(value) {
  return String(value ?? "").replace(/https?:\/\/[^\s"'<>\\]+/g, (raw) => sanitizeUrl(raw) || "");
}

export function extractEvidenceTerms({ candidateAnswer = "", golden }) {
  const text = `${candidateAnswer}\n${golden?.answer ?? ""}\n${(golden?.keyFacts ?? []).join("\n")}\n${(golden?.avoid ?? []).join("\n")}\n${golden?.notes ?? ""}`;
  const terms = [];

  for (const match of text.matchAll(/`([^`\n]{3,80})`/g)) terms.push(match[1]);
  for (const match of text.matchAll(/\b[a-z]+[A-Z][A-Za-z0-9_]{2,}\b/g)) terms.push(match[0]);
  for (const match of text.matchAll(/\b[A-Z][A-Za-z0-9]+(?:[- ][A-Z0-9][A-Za-z0-9]+){0,5}\b/g)) {
    const term = cleanText(match[0]);
    if (
      term.length >= 4 &&
      !/^(The|This|That|When|Where|Which|What|With|Source|Sources|Grade|Golden|Question|Candidate|Answer)$/i.test(term)
    ) {
      terms.push(term);
    }
  }
  for (const match of text.matchAll(/\b(?:status|asOf|source|url|amount|round|date|version|limit|summary|title|rank|count|window)\b/gi)) {
    terms.push(match[0]);
  }

  return unique(terms)
    .sort((a, b) => b.length - a.length || a.localeCompare(b))
    .slice(0, 90);
}

function orderedUnique(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    const cleaned = cleanText(value);
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return out;
}

function claimTermPriority(term) {
  if (/^\$\s?\d/i.test(term)) return 5;
  if (/%$/.test(term)) return 4;
  if (/\b(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)\b/i.test(term)) return 4;
  if (/^\d/.test(term)) return 3;
  return 2;
}

export const GENERIC_CANDIDATE_CLAIM_STOP_RE =
  /^(?:The|This|That|Source|Sources|Article|Articles|Event|Events|Most|Recent|Overall|Net|Question|Answer|Candidate|Golden)$/i;

function isNumericLikeClaimTerm(value) {
  return /^\$?\s?\d/i.test(value) || /\d/.test(value) && /(?:%|[KMB]\b|seconds?|minutes?|hours?|days?|weeks?|months?|years?)$/i.test(value);
}

function isProperNounPhrase(value) {
  return /\b[A-Z][A-Za-z0-9]+(?:[- ][A-Z0-9][A-Za-z0-9]+)+\b/.test(value);
}

function literalCaseContext({ question = "", golden }) {
  return cleanText(
    `${question}\n${golden?.answer ?? ""}\n${(golden?.keyFacts ?? []).join("\n")}\n${(golden?.avoid ?? []).join("\n")}`
  );
}

function appearsLiterallyInQuestionOrGoldenEntity(term, contextText) {
  if (!isProperNounPhrase(term)) return false;
  return contextText.includes(term);
}

function extractCandidateClaimTerms({ candidateAnswer = "", question = "", golden } = {}) {
  const text = String(candidateAnswer ?? "");
  const contextText = literalCaseContext({ question, golden });
  const found = [];
  const addMatches = (regex) => {
    for (const match of text.matchAll(regex)) {
      const value = match[0];
      found.push({ value, index: match.index ?? 0, priority: claimTermPriority(value) });
    }
  };

  addMatches(/\$\s?\d[\d,]*(?:\.\d+)?\s?(?:[KMB])?\b/gi);
  addMatches(/\b\d+(?:\.\d+)?%\b/g);
  addMatches(/\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|thirty|sixty|ninety|\d+(?:\.\d+)?)\s*[- ]\s*(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)\b/gi);
  addMatches(/\b\d{2,}[\d,]*(?:\.\d+)?\s?(?:[KMB])?\b/g);
  addMatches(/\b[A-Z][A-Za-z0-9]+(?:[- ][A-Z0-9][A-Za-z0-9]+){0,6}\b/g);

  return orderedUnique(
    found
      .filter((term) => {
        const value = cleanText(term.value);
        if (value.length < 2 || value.length > 90) return false;
        if (/^(?:19|20)\d{2}$/.test(value)) return false;
        if (/^0\d/.test(value)) return false;
        if (/^\d[\d,]*(?:\.\d+)?\s?(?:[KMB])?$/i.test(value)) {
          const numeric = Number(value.replace(/,/g, "").replace(/[KMB]$/i, ""));
          if (Number.isFinite(numeric) && numeric < 100 && !/[KMB]$/i.test(value)) return false;
        }
        if (GENERIC_CANDIDATE_CLAIM_STOP_RE.test(value)) return false;
        return !appearsLiterallyInQuestionOrGoldenEntity(value, contextText);
      })
      .sort((a, b) => b.priority - a.priority || a.index - b.index || a.value.localeCompare(b.value))
      .map((term) => term.value)
  ).slice(0, 80);
}

function shouldIncludeTranscriptEvidence(tags = {}) {
  return tags.freshness !== "stable";
}

function executeEntries(transcript) {
  return (Array.isArray(transcript) ? transcript : []).filter(
    (entry) =>
      (String(entry.tool ?? "").endsWith("execute") ||
        /^mcp__.+__(?:lumenloop|scout|stellarDocs)_/.test(String(entry.tool ?? ""))) &&
      typeof entry.result === "string"
  );
}

function tryParseJsonPrefix(result) {
  const stripped = stripAnsi(result);
  const footerIndex = stripped.indexOf("\n--- TRUNCATED ---");
  const jsonText = footerIndex >= 0 ? stripped.slice(0, footerIndex) : stripped;
  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

function sourceTitle(value) {
  return cleanText(value?.title ?? value?.name ?? value?.label ?? value?.slug ?? "");
}

function sourceDate(value) {
  return cleanText(value?.date ?? value?.publishing_date ?? value?.created_at ?? value?.updated_at ?? value?.asOf ?? "");
}

function sourceSummary(value) {
  return cleanText(
    value?.summary ??
      value?.description ??
      value?.excerpt ??
      value?.snippet ??
      value?.contentSummary ??
      value?.text ??
      ""
  );
}

function maybeSourceItem(value, path, entryIndex) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const title = sourceTitle(value);
  const url = sanitizeUrl(value.url ?? value.sourceUrl ?? value.source ?? value.href);
  const summary = sourceSummary(value);
  const date = sourceDate(value);
  if (!title && !url && !summary) return null;
  if (!title && summary.length < 24) return null;
  return {
    title,
    url,
    date,
    summary,
    type: cleanText(value.type ?? value.kind ?? value.domain ?? value.channel ?? ""),
    fields: scalarFactsForObject(value),
    path,
    entryIndex
  };
}

function scalarFactsForObject(value) {
  const skip = new Set([
    "title",
    "name",
    "label",
    "slug",
    "url",
    "sourceUrl",
    "source",
    "href",
    "externalUrl",
    "githubUrl",
    "demoUrl",
    "videoUrl",
    "summary",
    "description",
    "excerpt",
    "snippet",
    "contentSummary",
    "text"
  ]);
  const facts = [];
  for (const [key, raw] of Object.entries(value)) {
    if (skip.has(key) || raw === null || raw === undefined || typeof raw === "object") continue;
    const rendered = cleanText(raw);
    if (!rendered || rendered.length > 100) continue;
    facts.push({ key, value: rendered, priority: scalarFieldPriority(key) });
  }
  return facts
    .sort((a, b) => b.priority - a.priority || a.key.localeCompare(b.key))
    .slice(0, 8)
    .map((fact) => `${fact.key}=${JSON.stringify(fact.value)}`);
}

function scalarFieldPriority(key) {
  return /rank|placement|winner|count|date|status|round|amount|total|source|award|prize/i.test(key) ? 2 : 1;
}

function walkSourceItems(value, path, entryIndex, out) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkSourceItems(item, `${path}[${index}]`, entryIndex, out));
    return;
  }
  const item = maybeSourceItem(value, path, entryIndex);
  if (item) out.push(item);
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === "object") walkSourceItems(child, path ? `${path}.${key}` : key, entryIndex, out);
  }
}

function scanBalancedObjectAt(text, start) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === "\"") inString = false;
      continue;
    }
    if (ch === "\"") inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return "";
}

function scanSourceItemsFromText(result, entryIndex) {
  const text = stripAnsi(result);
  const out = [];
  const seenStarts = new Set();
  for (const marker of ["\"title\"", "\"name\""]) {
    let index = 0;
    while ((index = text.indexOf(marker, index)) >= 0) {
      const start = text.lastIndexOf("{", index);
      index += marker.length;
      if (start < 0 || seenStarts.has(start)) continue;
      seenStarts.add(start);
      const objectText = scanBalancedObjectAt(text, start);
      if (!objectText) continue;
      try {
        const parsed = JSON.parse(objectText);
        const item = maybeSourceItem(parsed, "visible-json-fragment", entryIndex);
        if (item) out.push(item);
      } catch {
        // Ignore partial/truncated fragments.
      }
    }
  }
  return out;
}

function dedupeItems(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = `${item.url || item.title}|${item.date}|${item.summary.slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function termHits(text, terms) {
  const haystack = text.toLowerCase();
  const hits = [];
  for (const term of terms) {
    if (term.length < 3) continue;
    if (haystack.includes(term.toLowerCase())) hits.push(term);
  }
  return unique(hits);
}

function snippetAround(text, index, length, radius) {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + length + radius);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";
  return cleanText(sanitizeUrlsInText(`${prefix}${text.slice(start, end)}${suffix}`));
}

function sourceItemText(item) {
  return cleanText(`${item.title} ${item.date} ${item.url} ${item.type} ${item.fields.join(" ")} ${item.summary}`);
}

function overlapsSourceItem(snippet, rankedItemsForDedupe) {
  const normalized = cleanText(snippet).toLowerCase();
  if (normalized.length < 80) return false;
  return rankedItemsForDedupe.some((item) => {
    const text = sourceItemText(item).toLowerCase();
    if (!text) return false;
    const sample = normalized.slice(0, Math.min(180, normalized.length));
    return text.includes(sample) || normalized.includes(text.slice(0, Math.min(180, text.length)));
  });
}

function collectClaimSnippets(entries, claimTerms, rankedItemsForDedupe) {
  const snippets = [];
  const seen = new Set();
  const seenRangesByEntry = new Map();
  for (const [termIndex, term] of claimTerms.entries()) {
    const re = termMatchRegExp(term, "gi");
    for (const [entryIndex, entry] of entries.entries()) {
      const text = stripAnsi(entry.result);
      let match;
      let perTermEntryMatches = 0;
      while ((match = re.exec(text))) {
        const start = Math.max(0, match.index - 360);
        const end = Math.min(text.length, match.index + match[0].length + 360);
        const ranges = seenRangesByEntry.get(entryIndex) ?? [];
        if (ranges.some((range) => Math.max(start, range.start) < Math.min(end, range.end))) {
          perTermEntryMatches += 1;
          if (perTermEntryMatches >= 2) break;
          continue;
        }
        const rawSnippet = snippetAround(text, match.index, match[0].length, 360);
        const key = rawSnippet.slice(0, 220).toLowerCase();
        if (!seen.has(key) && !overlapsSourceItem(rawSnippet, rankedItemsForDedupe)) {
          seen.add(key);
          ranges.push({ start, end });
          seenRangesByEntry.set(entryIndex, ranges);
          snippets.push({
            term,
            termIndex,
            entryIndex,
            matchIndex: match.index,
            tool: cleanText(entry.tool ?? `entry#${entryIndex + 1}`),
            resultChars: entry.resultChars ?? text.length,
            snippet: rawSnippet
          });
        }
        perTermEntryMatches += 1;
        if (perTermEntryMatches >= 2) break;
      }
    }
  }
  return snippets.sort(
    (a, b) =>
      a.termIndex - b.termIndex ||
      a.entryIndex - b.entryIndex ||
      a.matchIndex - b.matchIndex ||
      a.term.localeCompare(b.term)
  );
}

function scoreItem(item, terms) {
  const titleHits = termHits(item.title, terms);
  const summaryHits = termHits(item.summary, terms);
  const metaHits = termHits(`${item.date} ${item.url} ${item.type}`, terms);
  return titleHits.length * 6 + summaryHits.length * 4 + metaHits.length + Math.min(2, Math.floor(item.summary.length / 240));
}

function rankedItems(items, terms) {
  return items
    .map((item, originalIndex) => ({
      ...item,
      originalIndex,
      score: scoreItem(item, terms),
      hits: termHits(`${item.title} ${item.summary} ${item.date} ${item.url}`, terms).slice(0, 8)
    }))
    .sort((a, b) => b.score - a.score || a.entryIndex - b.entryIndex || a.originalIndex - b.originalIndex);
}

function collectSourceItems(entries) {
  const items = [];
  entries.forEach((entry, entryIndex) => {
    const parsed = tryParseJsonPrefix(entry.result);
    if (parsed) walkSourceItems(parsed, "", entryIndex, items);
    for (const item of scanSourceItemsFromText(entry.result, entryIndex)) items.push(item);
  });
  return dedupeItems(items);
}

function collectRelevantFactsFromParsed(value, terms, path = "", out = []) {
  if (!value || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectRelevantFactsFromParsed(item, terms, `${path}[${index}]`, out));
    return out;
  }
  for (const [key, raw] of Object.entries(value)) {
    const nextPath = path ? `${path}.${key}` : key;
    if (raw && typeof raw === "object") {
      collectRelevantFactsFromParsed(raw, terms, nextPath, out);
      continue;
    }
    if (raw === undefined) continue;
    const rendered = cleanText(raw);
    if (!rendered || rendered.length > 120) continue;
    const score = termHits(`${key} ${rendered}`, terms).length + (scalarFieldPriority(key) > 1 ? 1 : 0);
    if (score > 0) out.push({ path: nextPath, value: rendered, score });
  }
  return out;
}

function collectRelevantFacts(entries, terms) {
  const facts = [];
  entries.forEach((entry, entryIndex) => {
    const parsed = tryParseJsonPrefix(entry.result);
    if (!parsed) return;
    for (const fact of collectRelevantFactsFromParsed(parsed, terms)) facts.push({ ...fact, entryIndex });
  });
  const seen = new Set();
  return facts
    .sort((a, b) => b.score - a.score || a.entryIndex - b.entryIndex || a.path.localeCompare(b.path))
    .filter((fact) => {
      const key = `${fact.path}=${fact.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function shapeLine(entries, sourceCount) {
  const totalChars = entries.reduce((sum, entry) => sum + (entry.resultChars ?? String(entry.result ?? "").length), 0);
  const truncated = entries.filter((entry) => String(entry.result ?? "").includes("--- TRUNCATED ---")).length;
  const errored = entries.filter((entry) => entry.isError || /^Execution failed:/i.test(String(entry.result ?? ""))).length;
  return `executeResults=${entries.length}; resultChars=${totalChars}; truncated=${truncated}; errors=${errored}; sourceItems=${sourceCount}`;
}

function callsLine(entries) {
  if (!entries.length) return "none";
  return entries
    .map((entry, index) => {
      const chars = entry.resultChars ?? String(entry.result ?? "").length;
      const outcome = entry.isError || /^Execution failed:/i.test(String(entry.result ?? "")) ? "error" : "ok";
      return `execute#${index + 1}=${outcome}/${chars} chars`;
    })
    .join("; ");
}

function canonicalUrlsLine(items, limit) {
  const urls = unique(items.map((item) => item.url)).slice(0, limit);
  if (!urls.length) return "none (data-derived/untrusted; https-only after sanitization)";
  return `data-derived/untrusted; ${urls.join("; ")}${items.filter((item) => item.url).length > urls.length ? ` (+${items.filter((item) => item.url).length - urls.length} more)` : ""}`;
}

function truncationLine(entries) {
  const footers = [];
  for (const [index, entry] of entries.entries()) {
    const result = stripAnsi(entry.result);
    const footerIndex = result.indexOf("--- TRUNCATED ---");
    if (footerIndex >= 0) footers.push(`execute#${index + 1}: ${truncate(result.slice(footerIndex), 360)}`);
  }
  return footers.join(" | ");
}

function serializePack({
  entries,
  ranked,
  facts,
  claimSnippets,
  itemLimit,
  factLimit,
  claimSnippetLimit,
  summaryChars,
  claimSnippetChars,
  urlLimit
}) {
  const shown = ranked.slice(0, itemLimit);
  const shownFacts = facts.slice(0, factLimit);
  const shownClaimSnippets = claimSnippets.slice(0, claimSnippetLimit);
  const lines = [
    "--- TRANSCRIPT SOURCE BASIS ---",
    `shape: ${shapeLine(entries, ranked.length)}`,
    `calls: ${callsLine(entries)}`,
    `canonicalUrls: ${canonicalUrlsLine(ranked, urlLimit)}`,
    `fields: ${shownFacts.length ? shownFacts.map((fact) => `${truncate(fact.path, 90)}=${JSON.stringify(truncate(fact.value, 80))}`).join("; ") : "none"}`,
    "claimSnippets: candidate-claim anchored snippets from execute result text only; omitted snippets are not proof of absence"
  ];
  if (!shownClaimSnippets.length) {
    lines.push("- none extracted");
  } else {
    shownClaimSnippets.forEach((snippet, index) => {
      lines.push(
        `${index + 1}. term="${truncate(snippet.term, 80)}" entry=${snippet.entryIndex + 1} tool="${truncate(snippet.tool, 80)}" resultChars=${snippet.resultChars}`
      );
      lines.push(`   snippet: ${truncateAroundTerm(snippet.snippet, snippet.term, claimSnippetChars)}`);
    });
  }
  lines.push(
    "sourceItems: data-derived/untrusted; ranked by overlap with candidate/golden terms; omitted fields are not proof of absence"
  );
  if (!shown.length) {
    lines.push("- none extracted");
  } else {
    shown.forEach((item, index) => {
      const meta = [
        `title="${truncate(item.title || "(untitled)", 140)}"`,
        item.date ? `date="${truncate(item.date, 40)}"` : "",
        item.url ? `url="${truncate(item.url, 180)}"` : "",
        item.type ? `type="${truncate(item.type, 40)}"` : "",
        item.fields.length ? `fields="${truncate(item.fields.join(", "), 180)}"` : "",
        item.hits.length ? `matched="${truncate(item.hits.join(", "), 180)}"` : ""
      ]
        .filter(Boolean)
        .join(" ");
      lines.push(`${index + 1}. ${meta}`);
      if (item.summary) lines.push(`   summary: ${truncate(item.summary, summaryChars)}`);
    });
  }
  const truncation = truncationLine(entries);
  if (truncation) lines.push(`truncation: ${truncation}`);
  return lines.join("\n");
}

export function buildTranscriptEvidencePack({
  transcript = [],
  candidateAnswer = "",
  question = "",
  golden,
  tags,
  maxChars = EVIDENCE_PACK_MAX_CHARS
}) {
  if (!shouldIncludeTranscriptEvidence(tags)) return "";
  const entries = executeEntries(transcript);
  if (!entries.length) return "";

  const terms = extractEvidenceTerms({ candidateAnswer, golden });
  const items = collectSourceItems(entries);
  const ranked = rankedItems(items, terms);
  const facts = collectRelevantFacts(entries, terms);
  const claimTerms = extractCandidateClaimTerms({ candidateAnswer, question, golden });
  const claimSnippets = collectClaimSnippets(entries, claimTerms, ranked);

  let itemLimit = Math.min(ranked.length, INITIAL_MAX_ITEMS);
  let factLimit = Math.min(facts.length, INITIAL_MAX_FACTS);
  let claimSnippetLimit = Math.min(claimSnippets.length, INITIAL_MAX_CLAIM_SNIPPETS);
  let summaryChars = INITIAL_SUMMARY_CHARS;
  let claimSnippetChars = INITIAL_CLAIM_SNIPPET_CHARS;
  let urlLimit = MAX_CANONICAL_URLS;
  for (;;) {
    const text = serializePack({
      entries,
      ranked,
      facts,
      claimSnippets,
      itemLimit,
      factLimit,
      claimSnippetLimit,
      summaryChars,
      claimSnippetChars,
      urlLimit
    });
    if (text.length <= maxChars) return text;
    if (itemLimit > 2) {
      itemLimit -= 1;
      continue;
    }
    if (summaryChars > MIN_SUMMARY_CHARS) {
      summaryChars = Math.max(MIN_SUMMARY_CHARS, summaryChars - 80);
      continue;
    }
    if (factLimit > 8) {
      factLimit -= 1;
      continue;
    }
    if (urlLimit > 4) {
      urlLimit -= 1;
      continue;
    }
    if (claimSnippetChars > MIN_CLAIM_SNIPPET_CHARS) {
      claimSnippetChars = Math.max(MIN_CLAIM_SNIPPET_CHARS, claimSnippetChars - 80);
      continue;
    }
    if (claimSnippetLimit > 0) {
      claimSnippetLimit -= 1;
      continue;
    }
    return text.length <= maxChars ? text : `${text.slice(0, Math.max(0, maxChars - 3))}...`;
  }
}

export { EVIDENCE_PACK_MAX_CHARS };
