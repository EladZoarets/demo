---
prompt_style: plain-numbered
role_assignment: inline-you-are
chain_of_thought: none
output_format: markdown-sections
forbidden_patterns: xml-tags, thinking-blocks, reasoning-primers, step-by-step-primers
---

# GPT-5.5 Profile

Use plain numbered lists for all instruction blocks. Do NOT use XML tags —
GPT-5.5's internal routing is disrupted by XML structure. Do NOT add
"think step by step" or similar CoT primers; the model has its own reasoning
router and explicit primers degrade output quality.

## Template Formats

### plan
## Plan: {feature}\n**Score:** {N} | **Status:** {status}\n### File Changes\n{tree}\n### Tasks\n{tasks}

### score
## Score: {feature}\n**Complexity:** {N}/5\n**Verdict:** STOP_FOR_HUMAN | PROCEED_AUTONOMOUSLY\n**Reasoning:** {text}

### chaos
## Chaos Audit: {branch}\n**Verdict:** PASS | FAIL\n### Scenarios\n{scenarios}\n### Blocking Issues\n{issues}

### review
## PR Review: {feature}\n**Verdict:** READY_FOR_MERGE | CHANGES_REQUESTED\n**Architect:** {result}\n**Coverage:** {pct}%

## Phase Overrides

- **score:** Present each complexity dimension as a numbered list item.
- **chaos:** Number each scenario. Do not use nested XML or bullet hierarchies.
- **plan:** List tech constraints as numbered items before the file tree.
