#!/usr/bin/env node
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ARTIFACT_PATH, MODEL, POLICY, REPO, buildCatalogCards, cardSetHash, sha256 } from "./frontier-config.mjs";
import { embedDocuments } from "./embedder.mjs";
import { writeResult } from "../discovery/lib.mjs";

function encodeFloat32(vectors) {
  const bytes = Buffer.alloc(vectors.length * MODEL.dimensions * Float32Array.BYTES_PER_ELEMENT);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;
  for (const vector of vectors) {
    if (vector.length !== MODEL.dimensions) {
      throw new Error(`expected ${MODEL.dimensions} dimensions, got ${vector.length}`);
    }
    for (const value of vector) {
      view.setFloat32(offset, value, true);
      offset += Float32Array.BYTES_PER_ELEMENT;
    }
  }
  return bytes.toString("base64");
}

async function main() {
  const manifest = JSON.parse(readFileSync(path.join(REPO, "catalog", "manifest.json"), "utf8"));
  const cards = buildCatalogCards(manifest);
  console.log(`embedding ${cards.length} exposed catalog routing cards with ${MODEL.id}@${MODEL.revision.slice(0, 12)} ${MODEL.dtype}`);
  const vectors = await embedDocuments(cards.map((card) => card.text));
  const encoded = encodeFloat32(vectors);
  const artifact = {
    schemaVersion: 1,
    generatedAt: "2026-07-10",
    purpose: "pinned local reference artifact for the Cloudflare Vectorize frontier experiment",
    model: MODEL,
    policy: POLICY,
    catalog: {
      generatedAt: manifest.generatedAt,
      entryCount: cards.length
    },
    cards: cards.map((card) => ({
      id: card.id,
      service: card.service,
      kind: card.kind,
      textSha256: sha256(card.text)
    })),
    cardSetSha256: cardSetHash(cards),
    encoding: { type: "float32-base64", byteOrder: "little-endian", dimensions: MODEL.dimensions },
    vectors: encoded,
    vectorsSha256: sha256(Buffer.from(encoded, "base64"))
  };
  mkdirSync(path.dirname(ARTIFACT_PATH), { recursive: true });
  writeResult(ARTIFACT_PATH, artifact);
  console.log(`artifact -> ${ARTIFACT_PATH} (${Math.round(encoded.length / 1024)} KiB base64)`);
}

main().catch((error) => {
  console.error(`build-artifact failed: ${error.message}`);
  process.exit(1);
});
