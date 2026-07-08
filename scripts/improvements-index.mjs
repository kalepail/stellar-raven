#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import path from "node:path";
import { IMPROVEMENTS_DIR, listFindingFiles, parseFinding, renderIndex } from "./improvements-lib.mjs";

const findings = listFindingFiles().map(parseFinding);
writeFileSync(path.join(IMPROVEMENTS_DIR, "INDEX.md"), renderIndex(findings));
console.log(`wrote improvements/INDEX.md (${findings.length} findings)`);
