#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resultStamp, writeResult } from "./lib.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));

const argValue = (flag) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
};

export function classifyMiss(oneShot, agent) {
  const oneShotSufficient = oneShot.familyHitAt3 && oneShot.usableOpAt5;
  if (oneShotSufficient) return "downstream";
  const agentRecovered = agent?.recoveredTogether ?? (agent?.familyHitAt3 && agent?.usableOpAt5);
  return agentRecovered ? "agent-behavior" : "retrieval";
}

export function aggregateAgentEvidence(candidates) {
  if (!candidates.length) return null;
  return {
    familyHitAt3: candidates.some((candidate) => candidate.familyHitAt3),
    usableOpAt5: candidates.some((candidate) => candidate.usableOpAt5),
    recoveredTogether: candidates.some((candidate) => candidate.familyHitAt3 && candidate.usableOpAt5),
    runs: candidates.length
  };
}

function main() {
  const oneShotPath = argValue("--one-shot");
  const agentPath = argValue("--agent");
  if (!oneShotPath || !agentPath) throw new Error("pass --one-shot <result.json> --agent <result.json>");
  const oneShot = JSON.parse(readFileSync(path.resolve(oneShotPath), "utf8"));
  const agent = JSON.parse(readFileSync(path.resolve(agentPath), "utf8"));
  const agentRows = agent.rows ?? [];
  const byCase = new Map();
  for (const row of agentRows) {
    const rows = byCase.get(row.id) ?? [];
    rows.push(row);
    byCase.set(row.id, rows);
  }

  const rows = (oneShot.cases ?? oneShot.rows ?? []).map((row) => {
    const candidates = byCase.get(row.id) ?? [];
    const agentBest = aggregateAgentEvidence(candidates);
    return {
      id: row.id,
      seed: row.seed ?? null,
      oneShot: { familyHitAt3: row.familyHitAt3, usableOpAt5: row.usableOpAt5 },
      agent: agentBest,
      cause: classifyMiss(row, agentBest),
      missing: {
        family: !row.familyHitAt3,
        usableOp: !row.usableOpAt5
      }
    };
  });
  const counts = Object.fromEntries(
    ["retrieval", "agent-behavior", "downstream"].map((cause) => [cause, rows.filter((row) => row.cause === cause).length])
  );
  const outPath = path.resolve(argValue("--out") ?? path.join(DIR, "results", `${resultStamp("miss-classification")}.json`));
  writeResult(outPath, {
    meta: {
      instrument: "discovery-miss-classification",
      oneShot: path.basename(oneShotPath),
      agent: path.basename(agentPath),
      rule: {
        downstream: "one-shot visibly surfaced both an expected family@3 and usable op@5",
        agentBehavior: "one-shot missed at least one metric; one <=3-search agent run recovered both",
        retrieval: "no <=3-search agent run recovered both visible metrics"
      }
    },
    summary: { n: rows.length, counts },
    rows
  });
  console.log(JSON.stringify({ outPath, counts }));
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    main();
  } catch (error) {
    console.error(`classify-misses failed: ${error.message}`);
    process.exit(1);
  }
}
