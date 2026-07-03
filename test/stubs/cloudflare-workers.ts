/**
 * Plain-Node stand-in for the `cloudflare:workers` runtime module (wired via
 * vitest.config.ts alias). workers-oauth-provider only uses WorkerEntrypoint
 * for `handler.prototype instanceof WorkerEntrypoint` — our handlers are all
 * plain objects with fetch, so an empty class is sufficient.
 */
export class WorkerEntrypoint {}
