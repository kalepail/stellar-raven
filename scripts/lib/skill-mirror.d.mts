// Ambient declaration for skill-mirror.mjs (plain JS, no build step) so tests
// and typechecked callers can import it directly under `tsc --noEmit`.
// Keep in sync with the exported surface of skill-mirror.mjs.
type ManifestFile = { path: string; size: number; sha: string };
type ManifestSource = {
  id: string;
  owner: string;
  repo: string;
  path: string;
  commit: string;
  skills: { name: string; files: ManifestFile[] }[];
};
type SkillsManifest = { sources: ManifestSource[] };

export function upstreamPath(source: ManifestSource, skillName: string, filePath: string): string;
export function skillFileUrl(source: ManifestSource, skillName: string, filePath: string): string;
export function gitBlobSha(buffer: Uint8Array): string;
export function sha256(buffer: Uint8Array): string;
export function readSkillFile(
  source: ManifestSource,
  skillName: string,
  file: ManifestFile,
  options?: { noCache?: boolean }
): Promise<string>;
export function readSkillFileWithDigest(
  source: ManifestSource,
  skillName: string,
  file: ManifestFile,
  options?: { noCache?: boolean }
): Promise<{ text: string; sha256: string }>;
export function loadSkillTexts(
  manifest: SkillsManifest,
  opts?: { skip?: (skillName: string) => boolean }
): Promise<Map<string, { text: string; sha256: string }>>;
