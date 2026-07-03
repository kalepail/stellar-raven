#!/usr/bin/env bash
#
# update.sh — sync the Stellar/Soroban ecosystem agent skills into ./skills.
#
# This mirrors the agents-docs/ machinery (resolve a commit, recursive tree,
# raw download, pinned MANIFEST.json, regenerate INDEX.md) but across MULTIPLE
# heterogeneous sources, each grouped under skills/<source>/<skill>/:
#
#   lumenloop            github  lumenloop/lumenloop-skills        (8 public skills)
#   lumenloop-api        api     api.lumenloop.com partner archive (6 partner skills)
#   openzeppelin-stellar github  OpenZeppelin/openzeppelin-skills  (3 Stellar skills, cherry-picked)
#   stellar-dev          github  stellar/stellar-dev-skill         (7 SDF skills)
#   stellar-light        github  Stellar-Light/stellar-scout       (1 skill, repo root)
#
# It also snapshots the stellarlight.xyz/api/skills DIRECTORY (≈30 ecosystem
# entries across sources/kinds) into catalog.json + MANIFEST.catalog — the
# "what exists in the ecosystem" map, NOT downloaded as skills.
#
# Each source pins its own commit/ref + synced_at in MANIFEST.json. INDEX.md is
# regenerated via build-index.mjs.
#
# Usage:
#   ./update.sh            # sync every source at its default branch
#
# Requires: gh (authenticated), jq, node, curl, unzip, git.
# For the lumenloop-api partner archive: LUMENLOOP_API_KEY in the environment
#   (or a sibling ../.env / ../.dev.vars with LUMENLOOP_API_KEY=...). If absent,
#   the script fails closed (see below).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$SCRIPT_DIR/skills"
MANIFEST="$SCRIPT_DIR/MANIFEST.json"
CATALOG="$SCRIPT_DIR/catalog.json"

command -v gh    >/dev/null || { echo "error: gh CLI not found" >&2; exit 1; }
command -v jq    >/dev/null || { echo "error: jq not found" >&2; exit 1; }
command -v node  >/dev/null || { echo "error: node not found" >&2; exit 1; }
command -v curl  >/dev/null || { echo "error: curl not found" >&2; exit 1; }
command -v unzip >/dev/null || { echo "error: unzip not found" >&2; exit 1; }
command -v git   >/dev/null || { echo "error: git not found" >&2; exit 1; }

# LUMENLOOP_API_KEY resolution:
#   - var UNSET            -> fall back to ../.env, then ../.dev.vars (dev convenience).
#   - var set but EMPTY    -> treat as an explicit "no key" and do NOT fall back,
#                             so `LUMENLOOP_API_KEY= ./update.sh` reliably exercises
#                             the fail-closed path even in a repo that has .env.
#   - var set & non-empty  -> use it as-is.
if [ -z "${LUMENLOOP_API_KEY+set}" ]; then
  for env_file in "$SCRIPT_DIR/../.env" "$SCRIPT_DIR/../.dev.vars"; do
    if [ -f "$env_file" ]; then
      LUMENLOOP_API_KEY="$(grep -E '^LUMENLOOP_API_KEY=' "$env_file" | head -1 | cut -d= -f2- || true)"
      [ -n "$LUMENLOOP_API_KEY" ] && break
    fi
  done
fi

# Fail CLOSED. The lumenloop-api partner archive REQUIRES a key; without it the
# mirror is incomplete (19 of 25 skills). Validate creds BEFORE touching anything
# on disk. A partial refresh is only allowed when explicitly requested via
# ALLOW_PARTIAL=1, in which case MANIFEST.status is marked "partial" so it can
# never be mistaken for a complete mirror.
MIRROR_STATUS="complete"
MISSING_SOURCES="[]"
PARTNER_ENABLED=1
if [ -z "${LUMENLOOP_API_KEY:-}" ]; then
  if [ "${ALLOW_PARTIAL:-0}" = "1" ]; then
    echo "warning: LUMENLOOP_API_KEY missing — ALLOW_PARTIAL=1 set, producing a PARTIAL mirror (no lumenloop-api/*)." >&2
    PARTNER_ENABLED=0
    MIRROR_STATUS="partial"
    MISSING_SOURCES='["lumenloop-api"]'
  else
    echo "error: LUMENLOOP_API_KEY not set (env, ../.env, or ../.dev.vars) — required for the lumenloop-api partner archive." >&2
    echo "       Set the key, or re-run with ALLOW_PARTIAL=1 to accept an explicitly-marked partial mirror." >&2
    echo "       Nothing on disk was modified." >&2
    exit 1
  fi
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
SRC_DIR="$WORK/sources"   # one <id>.json per synced source
# BUILD_DIR is the staging tree. Every source writes here; we only swap it into
# place (skills/) AFTER all sources + the manifest succeed, so a mid-run failure
# never leaves a clobbered or partial skills/ tree.
BUILD_DIR="$WORK/skills"
MANIFEST_TMP="$WORK/MANIFEST.json"
CATALOG_TMP="$WORK/catalog.json"
mkdir -p "$SRC_DIR" "$BUILD_DIR"

NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# ---------------------------------------------------------------------------
# sync_github <id> <owner> <repo> <src_path> <ref> [skill ...]
#
#   src_path  ""            -> the repo root is ONE skill (named by the 6th arg)
#             "skills" etc. -> each child dir under it is a skill
#   skill...  optional allow-list of skill names to cherry-pick (subdir mode)
#             OR, when src_path is "", the single skill name for the repo root.
# Downloads every *.md blob under the selected skill(s) at the pinned commit.
# ---------------------------------------------------------------------------
sync_github() {
  local id=$1 owner=$2 repo=$3 src_path=$4 ref=$5; shift 5
  local pick=("$@")
  local prefix=""; [ -n "$src_path" ] && prefix="$src_path/"
  echo "Syncing ${id}: ${owner}/${repo}${src_path:+/$src_path} @ ${ref} ..."

  local cq="repos/${owner}/${repo}/commits?sha=${ref}&per_page=1"
  [ -n "$src_path" ] && cq="${cq}&path=${src_path}"
  local commit commit_date
  commit="$(gh api "$cq" --jq '.[0].sha')"
  commit_date="$(gh api "$cq" --jq '.[0].commit.committer.date')"

  local tree
  tree="$(gh api "repos/${owner}/${repo}/git/trees/${commit}?recursive=1")"

  # Per-file rows: { skill, relpath (within the skill), size, sha, src (raw path) }.
  local pick_json files
  pick_json="$(printf '%s\n' ${pick[@]+"${pick[@]}"} | jq -R . | jq -s 'map(select(length>0))')"
  if [ -z "$src_path" ]; then
    # Root mode: the whole repo is one skill; its name is the single pick entry.
    local root_skill; root_skill="$(echo "$pick_json" | jq -r '.[0]')"
    files="$(echo "$tree" | jq --arg s "$root_skill" '
      [ .tree[]
        | select(.type=="blob")
        | select(.path|endswith(".md"))
        | { skill: $s, relpath: .path, size: .size, sha: .sha, src: .path } ]
      | sort_by(.relpath)')"
  else
    files="$(echo "$tree" | jq --arg p "$prefix" --argjson pick "$pick_json" '
      [ .tree[]
        | select(.type=="blob")
        | select(.path|startswith($p))
        | select(.path|endswith(".md"))
        | { rel: (.path|ltrimstr($p)), size: .size, sha: .sha, src: .path }
        | . + { skill: (.rel|split("/")[0]) }
        | select(($pick|length)==0 or (.skill as $s | $pick|index($s)))
        | { skill, relpath: (.rel|sub("^[^/]+/";"")), size, sha, src } ]
      | sort_by(.skill+"/"+.relpath)')"
  fi

  # Download each blob at the pinned commit.
  echo "$files" | jq -r '.[] | [.skill, .relpath, .src] | @tsv' \
  | while IFS=$'\t' read -r skill relpath src; do
      local dest="$BUILD_DIR/$id/$skill/$relpath"
      mkdir -p "$(dirname "$dest")"
      echo "  + $id/$skill/$relpath"
      curl -fsSL "https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${src}" -o "$dest"
    done

  # Group flat file rows into per-skill objects.
  local skills_json
  skills_json="$(echo "$files" | jq '
    group_by(.skill)
    | map({ name: .[0].skill,
            files: (map({path: .relpath, size, sha}) | sort_by(.path)) })')"

  jq -n \
    --arg id "$id" --arg owner "$owner" --arg repo "$repo" \
    --arg path "$src_path" --arg ref "$ref" \
    --arg commit "$commit" --arg commit_date "$commit_date" \
    --argjson skills "$skills_json" '
    { id:$id, type:"github", owner:$owner, repo:$repo, path:$path, ref:$ref,
      commit:$commit, commit_date:$commit_date,
      url:("https://github.com/"+$owner+"/"+$repo+"/tree/"+$commit+($path|if .=="" then "" else "/"+. end)),
      skills:$skills }' > "$SRC_DIR/$id.json"

  echo "  pinned ${id} @ ${commit:0:12} ($(echo "$skills_json" | jq length) skills)."
}

# ---------------------------------------------------------------------------
# sync_lumenloop_archive <id> <set>   (set = public|partner)
# Downloads the zip archive of skill folders from the LumenLoop API.
#
# The partner repo (lumenloop-api-skills) is NOT public, so its provenance is
# NOT git-commit-reproducible the way the GitHub sources are: the API exposes
# only a short (7-char) commit ref behind a mutable, credentialed archive
# endpoint. To make a run independently checkable we record a source-level
# SHA256 of the exact downloaded zip plus the API version metadata, and label
# the reproducibility model honestly. Caller guarantees the key is present.
# ---------------------------------------------------------------------------
sync_lumenloop_archive() {
  local id=$1 set=$2
  echo "Syncing ${id}: api.lumenloop.com /v1/skills/archive/${set} ..."

  local meta commit repo version_json
  meta="$(curl -fsS -H "Authorization: Bearer ${LUMENLOOP_API_KEY}" "https://api.lumenloop.com/v1/skills")"
  commit="$(echo "$meta" | jq -r --arg s "$set" '.data.versions[$s].commit // "unknown"')"
  repo="$(echo "$meta" | jq -r --arg s "$set" '.data.versions[$s].repo // "lumenloop-skills"')"
  version_json="$(echo "$meta" | jq --arg s "$set" '.data.versions[$s] // {}')"

  local zip="$WORK/${id}.zip" ex="$WORK/${id}-x"
  curl -fsS -H "Authorization: Bearer ${LUMENLOOP_API_KEY}" \
    "https://api.lumenloop.com/v1/skills/archive/${set}" -o "$zip"

  # Source-level digest of the exact bytes served for this run.
  local archive_sha256 archive_bytes
  archive_sha256="$( { shasum -a 256 "$zip" 2>/dev/null || sha256sum "$zip"; } | awk '{print $1}')"
  archive_bytes="$(wc -c < "$zip" | tr -d ' ')"

  rm -rf "$ex"; mkdir -p "$ex"
  unzip -q "$zip" -d "$ex"

  # Lay out <build>/<id>/<skill>/... and build the per-skill file index.
  mkdir -p "$BUILD_DIR/$id"
  cp -R "$ex"/. "$BUILD_DIR/$id/"

  local rows="[]"
  while IFS= read -r f; do
    local rel="${f#$ex/}"
    local skill="${rel%%/*}"
    local relpath="${rel#*/}"
    local size sha
    size="$(wc -c < "$f" | tr -d ' ')"
    sha="$(git hash-object "$f")"
    rows="$(echo "$rows" | jq --arg sk "$skill" --arg rp "$relpath" --argjson sz "$size" --arg sha "$sha" \
      '. + [{skill:$sk, path:$rp, size:$sz, sha:$sha}]')"
  done < <(find "$ex" -type f -name '*.md' | sort)

  local skills_json
  skills_json="$(echo "$rows" | jq '
    group_by(.skill)
    | map({ name: .[0].skill, files: (map({path, size, sha}) | sort_by(.path)) })')"

  jq -n --arg id "$id" --arg set "$set" --arg commit "$commit" --arg repo "$repo" \
    --arg sha256 "$archive_sha256" --argjson bytes "$archive_bytes" \
    --argjson version "$version_json" --arg now "$NOW" \
    --argjson skills "$skills_json" '
    { id:$id, type:"lumenloop-archive", set:$set, repo:("lumenloop/"+$repo),
      reproducibility:"api-versioned+archive-digested",
      commit_ref:$commit, commit_ref_note:"short ref reported by the API for a PRIVATE repo — not an independently-verifiable git SHA",
      api_version:$version,
      archive_sha256:$sha256, archive_bytes:$bytes, archive_fetched_at:$now,
      endpoint:("https://api.lumenloop.com/v1/skills/archive/"+$set),
      url:("https://api.lumenloop.com/v1/skills"), skills:$skills }' > "$SRC_DIR/$id.json"

  echo "  ${id}: api ref ${commit} · zip sha256 ${archive_sha256:0:16}… ($(echo "$skills_json" | jq length) skills)."
}

# ---------------------------------------------------------------------------
# fetch_catalog — snapshot the stellarlight.xyz ecosystem directory.
# ---------------------------------------------------------------------------
fetch_catalog() {
  echo "Fetching catalog: stellarlight.xyz/api/skills ..."
  local raw
  raw="$(curl -fsS "https://stellarlight.xyz/api/skills")" || {
    echo "warning: could not fetch stellarlight catalog — keeping previous catalog.json." >&2
    [ -f "$CATALOG" ] && cp "$CATALOG" "$CATALOG_TMP"
    return 0
  }
  echo "$raw" | jq --arg now "$NOW" '
    { source: "https://stellarlight.xyz/api/skills",
      fetched_at: $now,
      counts: .meta.counts,
      validKinds: .meta.validKinds,
      entries: ( .skills
        | map({ name: (.slug // .name), title: .name, source, kind,
                tagline, install, repository, homepage })
        | sort_by(.source+"/"+.name) ) }' > "$CATALOG_TMP"
  echo "  catalog: $(jq '.entries|length' "$CATALOG_TMP") entries across $(jq -r '.counts.bySource|keys|join(", ")' "$CATALOG_TMP")."
}

# ===========================================================================
# Run every source into the staging tree. With `set -e`, any failure here aborts
# BEFORE the swap below, so skills/ + MANIFEST.json are never left clobbered.
# ===========================================================================
sync_github lumenloop            lumenloop   lumenloop-skills    skills main
[ "$PARTNER_ENABLED" = "1" ] && sync_lumenloop_archive lumenloop-api partner
sync_github openzeppelin-stellar OpenZeppelin openzeppelin-skills skills main \
            setup-stellar-contracts upgrade-stellar-contracts develop-secure-contracts
sync_github stellar-dev          stellar     stellar-dev-skill   skills main
sync_github stellar-light        Stellar-Light stellar-scout     ""     main stellar-scout

fetch_catalog

# Assemble MANIFEST.json (staged) from every per-source object + catalog summary.
SOURCES="$(jq -s 'sort_by(.id)' "$SRC_DIR"/*.json)"
CAT_SUMMARY="$(jq '{source, fetched_at, counts, entries:(.entries|map({name,source,kind}))}' "$CATALOG_TMP" 2>/dev/null || echo 'null')"
TOTAL_SKILLS="$(echo "$SOURCES" | jq '[.[].skills|length]|add')"

jq -n --arg now "$NOW" --arg status "$MIRROR_STATUS" --argjson missing "$MISSING_SOURCES" \
      --argjson sources "$SOURCES" --argjson catalog "$CAT_SUMMARY" --argjson total "$TOTAL_SKILLS" '
  { synced_at:$now, status:$status, missing_sources:$missing,
    skill_count:$total, sources:$sources, catalog:$catalog }' > "$MANIFEST_TMP"

# --- Atomic swap: only now do we touch the real skills/, MANIFEST, catalog. ---
rm -rf "$SKILLS_DIR"
mv "$BUILD_DIR" "$SKILLS_DIR"
mv "$MANIFEST_TMP" "$MANIFEST"
[ -f "$CATALOG_TMP" ] && mv "$CATALOG_TMP" "$CATALOG"

if [ "$MIRROR_STATUS" = "partial" ]; then
  echo "Synced ${TOTAL_SKILLS} skills across $(echo "$SOURCES" | jq length) sources — PARTIAL (missing: $(echo "$MISSING_SOURCES" | jq -r 'join(", ")'))."
else
  echo "Synced ${TOTAL_SKILLS} skills across $(echo "$SOURCES" | jq length) sources — complete."
fi

# Regenerate the themed index (reads the now-final skills/ + MANIFEST.json).
node "$SCRIPT_DIR/build-index.mjs"

echo "Done. Manifest: $MANIFEST (status: ${MIRROR_STATUS})"
