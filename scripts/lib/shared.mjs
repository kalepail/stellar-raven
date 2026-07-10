// shared.mjs — helpers shared by scripts/refresh-inventory.mjs and
// scripts/check-skills-drift.mjs. Plain Node 20+ (global fetch, node:fs only —
// no deps). Behavior is the canonical refresh-inventory.mjs implementation;
// both consumers must keep importing from here rather than re-growing local copies.

import { existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";

/**
 * Minimal .env parser (no dotenv dep): `KEY=value` lines, `#` comments,
 * optional single/double quotes around the value. Missing file → {}.
 */
export function parseEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
}

/**
 * JSON fetch with retries: 3 attempts, retrying network errors and 5xx with
 * escalating backoff; 4xx fails immediately. Final errors carry the label and
 * any err.cause detail (undici wraps DNS/socket errors there).
 */
export async function fetchJson(url, { headers = {}, label = url, method = "GET", body } = {}) {
  const attempts = 3;
  for (let attempt = 1; ; attempt += 1) {
    try {
      const res = await fetch(url, {
        method,
        headers,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(30_000)
      });
      if (res.status >= 500 && attempt < attempts) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) throw Object.assign(new Error(`${label}: HTTP ${res.status}`), { final: true });
      return await res.json();
    } catch (err) {
      if (err.final || attempt >= attempts) {
        throw new Error(`${label}: ${err.message}${err.cause ? ` (${err.cause.code ?? err.cause.message ?? err.cause})` : ""}`);
      }
      await new Promise((r) => setTimeout(r, 500 * attempt)); // transient network/5xx — retry
    }
  }
}

/** Recursively sort object keys (arrays keep order) for deterministic/canonical JSON. */
export function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = sortDeep(value[key]);
    return out;
  }
  return value;
}

/**
 * Write a generated artifact beside its destination, then atomically replace
 * the destination. This prevents an interrupted generator from leaving a
 * truncated tracked artifact for later commands or CI to consume.
 */
export function writeFileAtomic(path, data) {
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`;
  let failure;
  try {
    writeFileSync(temporary, data);
    renameSync(temporary, path);
  } catch (error) {
    failure = error;
    throw error;
  } finally {
    if (existsSync(temporary)) {
      try {
        unlinkSync(temporary);
      } catch (cleanupError) {
        if (!failure) throw cleanupError;
      }
    }
  }
}
