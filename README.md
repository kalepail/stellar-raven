<p align="center">
  <img src="./public/Gemini_Generated_Image_v5uajdv5uajdv5ua.png" alt="stellar-raven — thermal neural interface" width="100%">
</p>

# Stellar Raven

Remote MCP server on Cloudflare Workers exposing two tools, `search` and `execute`, over a
unified catalog of Stellar ecosystem services and skills. Agents use `search` to discover
capabilities, then call `execute` with JavaScript that runs in a Dynamic Worker isolate with no
network access; service calls go through host-side adapters.

Design: [PLAN.md](./PLAN.md). Code-verified mechanics: [ARCHITECTURE.md](./ARCHITECTURE.md).

Deployed as the Cloudflare worker `stellar-raven-codemode` at https://raven.stellar.buzz — the
worker/service name deliberately keeps the `codemode` suffix even though the repo is `stellar-raven`.

## Quickstart

```
Server URL:   https://raven.stellar.buzz        (live since 2026-07-02; alias: https://agents.stellar.buzz still works)
MCP endpoint: POST https://raven.stellar.buzz/mcp   (streamable HTTP)  # or https://agents.stellar.buzz/mcp
Health:       GET  /health
```

Local dev: `npm ci`, populate `.dev.vars`, then `npm run dev` and point a client at
`http://localhost:8787/mcp`. Note: `wrangler dev` does NOT hot-reload `.dev.vars` edits —
restart it after changing them.

## Connect

Add `https://raven.stellar.buzz/mcp` in an MCP client that supports streamable HTTP and OAuth
(Claude, Cursor, or any compatible client). The Worker is its own OAuth authorization server and
hands sign-in to WorkOS AuthKit; clients should discover and complete that flow automatically.

Operational auth details live in [ARCHITECTURE.md](./ARCHITECTURE.md) and
[`research/auth-workos.md`](./research/auth-workos.md). Vulnerability reporting and researcher
scope live in [SECURITY.md](./SECURITY.md).

## Development

```
npm ci
npm run typecheck  # tsc
npm test           # vitest (offline; auth suite in test/auth.test.ts)
npm run typegen    # regenerate env.d.ts after wrangler.jsonc/.dev.vars changes
```

For local MCP testing, populate `.dev.vars`, run `npm run dev`, and point a client at
`http://localhost:8787/mcp`. Restart `wrangler dev` after editing `.dev.vars`.

## Observability

Structured JSON events (`src/observability.ts`) land in Workers Logs; traces are enabled with a
custom `codemode.execute` span around each sandbox run (the Worker Loader isolate is not
auto-instrumented). Both are queryable in the dash (Workers & Pages → Observability) or via the
telemetry query API. Survey of the whole surface — pricing, query API, OTel export, GraphQL
metrics: `research/observability-cloudflare.md`.

## License

[Apache-2.0](./LICENSE) © 2026 Tyler van der Hoeven — **except** vendored third-party content
(the `ecosystem-skills/skills/<source>/` mirrors and `src/catalog/vendor/`), which retains its
upstream licenses: see [`THIRD-PARTY-NOTICES.md`](./THIRD-PARTY-NOTICES.md). Notably, the
`openzeppelin-stellar` skills subtree is AGPL-3.0.
