// Ambient declaration for exposure.mjs (plain JS, no build step) so TS test
// files can import its exclusion data directly under `tsc --noEmit`. Keep in
// sync with the exported surface of exposure.mjs.
export const LUMENLOOP_ACCOUNT_OP_RE: RegExp;
export const EXCLUDED_LUMENLOOP_OPS: Set<string>;
export function lumenloopOpExcluded(tool: { name: string; metered?: boolean }): boolean;
export const EXCLUDED_SCOUT_OPS: Set<string>;
export const RETIRED_ONBOARDING_SKILLS: Set<string>;
export function scrubRetiredSkillRefs(text: string, context: string): string;
