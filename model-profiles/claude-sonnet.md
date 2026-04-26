---
extends: claude.md
chain_of_thought: extended-thinking
---

# Claude Sonnet Profile

Extends the base Claude profile. Extended thinking is active but should
be concise — favour speed over exhaustive reasoning. Preferred for the
Architect (design) and Developer (implementation) roles.

## Template Formats

### plan
<plan><score value="{score}">{reasoning}</score><file_tree>{tree}</file_tree><tasks>{tasks}</tasks></plan>

### score
<score_result><value>{N}</value><verdict>STOP_FOR_HUMAN|PROCEED_AUTONOMOUSLY</verdict><reasoning>{text}</reasoning></score_result>

### chaos
<chaos_report><scenario id="{N}">{text}</scenario><verdict>PASS|FAIL</verdict><issues>{blocking}</issues></chaos_report>

### review
<review><verdict>READY_FOR_MERGE|CHANGES_REQUESTED</verdict><architect>{result}</architect><coverage>{pct}%</coverage></review>
