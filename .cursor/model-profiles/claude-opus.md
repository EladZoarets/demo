---
extends: claude.md
chain_of_thought: extended-thinking
phase_overrides: deep-reasoning-for-scoring
---

# Claude Opus Profile

Extends the base Claude profile. Extended thinking is active — place a
`<thinking>` block with exhaustive reasoning before every output.
Preferred for the Chaos role: deep failure-mode enumeration requires
sustained reasoning, not speed.

## Template Formats

### plan
<plan><score value="{score}">{reasoning}</score><file_tree>{tree}</file_tree><tasks>{tasks}</tasks></plan>

### score
<score_result><value>{N}</value><verdict>STOP_FOR_HUMAN|PROCEED_AUTONOMOUSLY</verdict><reasoning>{text}</reasoning></score_result>

### chaos
<chaos_report><scenario id="{N}">{text}</scenario><verdict>PASS|FAIL</verdict><issues>{blocking}</issues></chaos_report>

### review
<review><verdict>READY_FOR_MERGE|CHANGES_REQUESTED</verdict><architect>{result}</architect><coverage>{pct}%</coverage></review>

## Phase Overrides

- **score:** Use extended `<thinking>` to evaluate all five complexity dimensions
  before assigning a numeric value. Do not truncate reasoning.
- **chaos:** Enumerate all plausible failure paths in `<thinking>` before selecting
  the top three for the report. Each scenario needs an `<impact>` child tag.
