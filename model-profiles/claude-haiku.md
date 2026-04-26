---
extends: claude.md
chain_of_thought: none
---

# Claude Haiku Profile

Extends the base Claude profile. No chain-of-thought — output directly
without a `<thinking>` block. Preferred for the Manager role: fast,
cheap task decomposition with no multi-step reasoning required.

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

- **plan (manager tasks):** Output the task list directly. No reasoning preamble.
