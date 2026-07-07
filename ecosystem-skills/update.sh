#!/usr/bin/env bash
#
# update.sh — sync the Stellar/Soroban ecosystem agent skills into ./skills.
#
# This mirrors the agents-docs/ machinery (resolve a commit, recursive tree,
# raw download, pinned MANIFEST.json, regenerate INDEX.md) but across MULTIPLE
# heterogeneous sources, each grouped under skills/<source>/<skill>/:
#
#   lumenloop            github  lumenloop/lumenloop-skills        (8 public skills)
#   openzeppelin-stellar github  OpenZeppelin/openzeppelin-skills  (3 Stellar skills, cherry-picked)
#   stellar-dev          github  stellar/stellar-dev-skill         (7 SDF skills)
#   stellar-light        github  Stellar-Light/stellar-scout       (1 skill, repo root)
#
# Public sources ONLY, no credentials. The lumenloop-api partner source (6
# partner skills from the private lumenloop-api-skills repo, fetched via the
# credentialed /v1/skills/archive/partner endpoint) was REMOVED 2026-07-06:
# the skills were retired from catalog exposure 2026-07-03 (Solo todo 825,
# RETIRED_ONBOARDING_SKILLS in scripts/exposure.mjs), their description
# harvest is complete, and partner-tier content must not live in this public
# repo. Do NOT re-add a credentialed source here — this script staying
# keyless is what guarantees future agent-run syncs can never pull
# partner-confidential content into the repo.
#
# Each GitHub source also vendors its upstream LICENSE/NOTICE files (fetched
# at the same pinned commit) into skills/<source>/ so redistribution notices
# survive every sync. stellar-light has no upstream license file — see
# THIRD-PARTY-NOTICES.md at the repo root.
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
# Requires: gh (authenticated), jq, node, curl, git. No API keys.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$SCRIPT_DIR/skills"
MANIFEST="$SCRIPT_DIR/MANIFEST.json"
CATALOG="$SCRIPT_DIR/catalog.json"

command -v gh    >/dev/null || { echo "error: gh CLI not found" >&2; exit 1; }
command -v jq    >/dev/null || { echo "error: jq not found" >&2; exit 1; }
command -v node  >/dev/null || { echo "error: node not found" >&2; exit 1; }
command -v curl  >/dev/null || { echo "error: curl not found" >&2; exit 1; }
command -v git   >/dev/null || { echo "error: git not found" >&2; exit 1; }

# Every source is public — the mirror is always complete. (The credentialed
# partner source and its ALLOW_PARTIAL escape hatch were removed 2026-07-06;
# see the header note.)
MIRROR_STATUS="complete"
MISSING_SOURCES="[]"

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

  # Vendor the upstream LICENSE/NOTICE files (repo root, same pinned commit)
  # into skills/<id>/ so redistribution notices ship with the mirrored content
  # and survive every sync. Which names exist varies per repo; absent files are
  # simply skipped (THIRD-PARTY-NOTICES.md at the repo root is the summary).
  local license_files="[]" notice_name
  for notice_name in LICENSE LICENSE.md LICENSE.txt LICENSE-APACHE LICENSE-MIT NOTICE NOTICE.md COPYING; do
    if echo "$tree" | jq -e --arg n "$notice_name" '.tree[] | select(.type=="blob" and .path==$n)' >/dev/null; then
      mkdir -p "$BUILD_DIR/$id"
      echo "  + $id/$notice_name (upstream license/notice)"
      curl -fsSL "https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${notice_name}" \
        -o "$BUILD_DIR/$id/$notice_name"
      license_files="$(echo "$license_files" | jq --arg n "$notice_name" '. + [$n]')"
    fi
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
    --argjson skills "$skills_json" --argjson license_files "$license_files" '
    { id:$id, type:"github", owner:$owner, repo:$repo, path:$path, ref:$ref,
      commit:$commit, commit_date:$commit_date,
      url:("https://github.com/"+$owner+"/"+$repo+"/tree/"+$commit+($path|if .=="" then "" else "/"+. end)),
      license_files:$license_files,
      skills:$skills }' > "$SRC_DIR/$id.json"

  echo "  pinned ${id} @ ${commit:0:12} ($(echo "$skills_json" | jq length) skills)."
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
