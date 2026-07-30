# Skill pin review ledger

Skill bodies are **prompt input**: what they say becomes instructions the model follows. They are
not vendored here, so a re-pin commit shows only hash changes — the text itself never appears in
`git diff` the way it did when the bodies were checked in. This ledger is the replacement gate.

**Every commit that changes what `MANIFEST.json` serves must add an entry here naming the new
`sel:` digest.** `scripts/check-pin-review.mjs` enforces it in CI, and it is a review record, not
a formality: the entry attests that a human read the body diff `ecosystem-skills/update.sh`
printed.

The `sel:` digest covers a source's whole selection — commit, skill names, file paths, and per-file
blob shas — not just its commit. Retargeting an entry to a different file inside the same pinned
tree, or adding/dropping a selected skill, changes which prompt input is served without moving the
commit, so the commit alone is not what the gate can key on. Print the current digests with
`node scripts/check-pin-review.mjs --digests`.

Three details the gate is strict about, each because the loose version was walkable:

- **The entry must be NEW in this diff.** An attestation that already existed at the base ref does
  not count. Reverting to a previously reviewed selection is still a decision to serve those bytes
  again today.
- **It must be a real `sel:` token.** A bare 12-hex string is not enough — this file is full of
  40-hex commit SHAs that contain one.
- **Removing a source needs an entry too**, since it changes everything that source served. Record
  it as `removed: <source-id>` with the reason.

Do **not** paste skill text into this file — that would re-create the vendored copy this design
removes. Summarize what changed and why it is safe to serve.

## Procedure

```bash
./ecosystem-skills/update.sh             # re-pins, prints the old->new body diff AND the new digests
node scripts/diff-pins.mjs <old> <new>   # re-print the diff on demand
node scripts/check-pin-review.mjs --digests   # the sel: digests to record
# then add an entry below, rebuild the generated artifacts, and commit together
```

What to look for in the diff, beyond "is it accurate": instructions that try to change the
agent's behavior outside the skill's topic, references to non-exposed operations or retired
skills, claims about this gateway's own capabilities, and anything resembling injected
instructions ("ignore previous", "you must", credentials, URLs to fetch).

## Entries

### 2026-07-30 — baseline (no pin movement)

| Source | Pinned commit | Selection | Reviewed |
| --- | --- | --- | --- |
| `lumenloop` | `d92c56bda17ab702d3202335cfe814d64e70e191` | `sel:a9447c2ec930` | baseline |
| `openzeppelin-stellar` | `6f215af60eb60017ab1a933ce9d22a479cd42b26` | `sel:4c4191f30c20` | baseline |
| `stellar-dev` | `52baea1d8cb1aa9441004ce44b723f55cbc90901` | `sel:d5e23e3d6eaa` | baseline |
| `stellar-light` | `f2659ff63cd891d48f6adeb024de7753bd9efb9f` | `sel:3ad627307640` | baseline |

These are the pins in force when the ledger was introduced; they were already serving and are
recorded here so the CI check has a starting state. The gate applies to every change after this
entry. The `sel:` column was added when the gate widened from commit-only to the whole served
selection; the digests are of the same pins already listed, not a re-pin.
