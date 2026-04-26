---
prompt_style: plain-numbered
role_assignment: inline-you-are
chain_of_thought: none
output_format: markdown-sections
forbidden_patterns: none
---

# Default Profile

Safe fallback for unknown or unlisted models. Uses plain markdown with
numbered lists — the most universally compatible format across all models.

## Template Formats

### plan
# Plan: {feature}\nScore: {N} | Status: {status}\n## File Changes\n{tree}\n## Tasks\n{tasks}

### score
# Score: {feature}\nComplexity: {N}/5\nVerdict: STOP_FOR_HUMAN | PROCEED_AUTONOMOUSLY\nReasoning: {text}

### chaos
# Chaos Audit: {branch}\nVerdict: PASS | FAIL\n## Scenarios\n{scenarios}\n## Blocking Issues\n{issues}

### review
# PR Review: {feature}\nVerdict: READY_FOR_MERGE | CHANGES_REQUESTED\nArchitect: {result}\nCoverage: {pct}%
