# public/ — GitHub-facing assets only

This directory holds assets used by the repository's GitHub presentation (the README hero
banner). **The Worker serves nothing from here** — there is no `assets` binding in
`wrangler.jsonc`, and no request path maps to this directory. The live site's images and fonts
are *generated code*, not files here: `/og.png` is produced by `src/og.ts` and the OG/site fonts
by `src/fonts.ts` (rebuilt via `npm run site:og` / `npm run site:fonts`).

## Contents

- `Gemini_Generated_Image_v5uajdv5uajdv5ua.png` — the README hero banner (referenced from the
  repo `README.md`).
- `Gemini_Generated_Image_klv48lklv48lklv4.png` — retained intentionally (user decision,
  2026-07-03) as a reserved future asset. Currently unreferenced by any doc or code.
