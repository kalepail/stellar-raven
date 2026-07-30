# Skill pin review ledger

Skill bodies are **prompt input**: what they say becomes instructions the model follows. They are
not vendored here, so a re-pin commit shows only hash changes — the text itself never appears in
`git diff` the way it did when the bodies were checked in. This ledger is the replacement gate.

**Every commit that moves a pin in `MANIFEST.json` must add an entry here naming the new commit
SHA.** `scripts/check-pin-review.mjs` enforces it in CI, and it is a review record, not a
formality: the entry attests that a human read the body diff `ecosystem-skills/update.sh` printed.

Do **not** paste skill text into this file — that would re-create the vendored copy this design
removes. Summarize what changed and why it is safe to serve.

## Procedure

```bash
./ecosystem-skills/update.sh        # re-pins AND prints the old->new body diff; read it
node scripts/diff-pins.mjs <old> <new>   # re-print the diff on demand
# then add an entry below, rebuild the generated artifacts, and commit together
```

What to look for in the diff, beyond "is it accurate": instructions that try to change the
agent's behavior outside the skill's topic, references to non-exposed operations or retired
skills, claims about this gateway's own capabilities, and anything resembling injected
instructions ("ignore previous", "you must", credentials, URLs to fetch).

## Entries

### 2026-07-30 — baseline (no pin movement)

| Source | Pinned commit | Reviewed |
| --- | --- | --- |
| `lumenloop` | `d92c56bda17ab702d3202335cfe814d64e70e191` | baseline |
| `openzeppelin-stellar` | `6f215af60eb60017ab1a933ce9d22a479cd42b26` | baseline |
| `stellar-dev` | `52baea1d8cb1aa9441004ce44b723f55cbc90901` | baseline |
| `stellar-light` | `f2659ff63cd891d48f6adeb024de7753bd9efb9f` | baseline |

These are the pins in force when the ledger was introduced; they were already serving and are
recorded here so the CI check has a starting state. The gate applies to every pin change after
this entry.
