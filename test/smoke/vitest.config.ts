/**
 * Smoke-lane vitest config (Solo todo 833) — runs test/smoke/ INSIDE workerd
 * via @cloudflare/vitest-pool-workers, with the real wrangler.jsonc bindings
 * (including the LOADER worker_loaders binding the executor needs).
 *
 * Deliberately a separate project from the root vitest.config.ts: the main
 * unit suite stays plain-Node and fast; this lane boots workerd. Run it with
 * `npm run test:smoke`.
 *
 * Offline by design: tests only exercise paths that never leave the worker —
 * sandbox wiring, envelope guard, policy refusals, route dispatch. Auth
 * values are test-only fakes injected via miniflare bindings (no .dev.vars
 * dependency, no real secrets).
 *
 * Note: pool-workers 0.18 (vitest 4) exposes `cloudflareTest` as a Vite
 * plugin — the old `defineWorkersConfig` / "/config" subpath is gone.
 */
import { fileURLToPath } from "node:url";
import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      // Absolute path: pool-workers resolves a relative configPath against
      // the process cwd, not this config file. (.href because @types/node 26
      // and lib es2022 disagree on the URL type itself.)
      wrangler: { configPath: fileURLToPath(new URL("../../wrangler.jsonc", import.meta.url).href) },
      // The demo's `ai` binding is remote-only; with the default
      // remoteBindings:true the pool opens a Cloudflare remote-proxy session
      // at startup, which needs credentials CI deliberately lacks (offline
      // lane). No smoke test calls the model — the /demo/chat tests stop at
      // the auth/origin gauntlet — so remote bindings stay off.
      remoteBindings: false,
      miniflare: {
        bindings: {
          // Test-only admin token so server dispatch tests can take the
          // admin bypass without .dev.vars or a real secret.
          MCP_ADMIN_TOKEN: "smoke-test-admin-token",
          // Fake key so the lumenloop adapter passes its config guard; the
          // only "upstream" it can reach is a test-local fetch stub.
          LUMENLOOP_API_KEY: "smoke-test-lumenloop-key",
          // Set so server.test.ts can assert the bypass's hostname second
          // factor AT THE ASSEMBLY LEVEL: honored on localhost, inert on the
          // public hostname (gate.ts logic itself is unit-tested).
          DEV_ALLOW_UNAUTHENTICATED: "true"
        },
        // Offline ENFORCED: any outbound fetch that escapes the tests' local
        // stubs hits this wall instead of the network. (pool-workers 0.18
        // dropped `fetchMock` from cloudflare:test — the vitest-4 rework —
        // so enforcement lives here and per-test mocking uses vi.stubGlobal;
        // tests run in the same isolate as the main worker, so global stubs
        // apply to host-side adapter fetches too.)
        outboundService() {
          return new Response("smoke lane is offline — unexpected outbound fetch", { status: 503 });
        }
      }
    })
  ],
  test: {
    // Scoped to the smoke dir — vitest's root is the process cwd (repo
    // root), so a bare glob would sweep in the plain-Node unit suite.
    include: ["test/smoke/**/*.test.ts"]
  }
});
