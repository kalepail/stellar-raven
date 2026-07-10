# Scripts ownership and generated artifacts

Top-level scripts are operator or CI entrypoints. Files under `scripts/lib/` are imported helpers;
`scripts/catalog-data/` is builder data; `scripts/git-hooks/` contains the installed hook. Keep an
entrypoint when it owns a distinct package command, CI gate, maintenance workflow, or generated
artifact. Delete one only after proving it has no package, workflow, documentation, or import caller.

## Generated-output entrypoints

| Command | Output | CI sync guard |
|---|---|---|
| `node scripts/build-catalog.mjs` | `catalog/manifest.json` | yes |
| `npm run micro-map:build` | `src/mcp/micro-map.ts` | yes |
| `npm run spec:build` | `specs/super-spec.json` | yes |
| `npm run skills:bundle` | `src/skills/bundle.json` | yes |
| `npm run site:globes` | `src/demo/globe.ts`, `src/consent-globe.ts` | yes |
| `npm run site:fonts` | `src/fonts.ts` | release/operator generated; source fonts are local-only |
| `npm run site:og` | `src/og.ts` | release/operator generated; requires ImageMagick and local fonts |
| `node eval/compile-routing.mjs` | `eval/routing-cases.json` | yes |
| `node eval/qa/compile-qa.mjs` | `eval/qa/cases.json` | yes |
| `node eval/plan/build-op-classes.mjs` | `eval/plan/op-classes.json` | yes |

Every CI-gated generator in the table uses `writeFileAtomic` from `scripts/lib/shared.mjs` so an
interrupted process cannot leave a truncated tracked artifact. Generated modules are never edited by
hand. Release/operator-only image and font generators are outside that offline CI contract.

## Typing convention

Scripts stay plain `.mjs` because they run directly under Node. A `.d.mts` sidecar exists only when
TypeScript source imports that JavaScript module and needs a declaration (`exposure.mjs` and
`emitted-text-guard.mjs`); it is not a visual-uniformity requirement for every script. Prefer runtime
tests for CLI-only scripts and add a declaration only at an actual TS import boundary.
