---
prompt_style: markdown-sections
role_assignment: inline-you-are
chain_of_thought: none
output_format: markdown-table-hierarchy
forbidden_patterns: xml-tags, thinking-blocks
---

# Gemini Profile

Use hierarchical markdown with tables. Inject a condensed context block
immediately before each task description. No XML tags.

## Template Formats

### plan
# Plan: {feature}\n| Field | Value |\n|-------|-------|\n| Score | {N} |\n| Status | {status} |\n\n## File Changes\n{tree}\n\n## Tasks\n{tasks}

### score
# Score: {feature}\n| Dimension | Rating |\n|-----------|--------|\n| Technical | {tech} |\n| Risk | {risk} |\n| Confidence | {conf} |\n\n**Overall:** {N}/5 — {verdict}

### chaos
# Chaos Audit: {branch}\n| # | Scenario | Result |\n|---|----------|--------|\n{rows}\n\n**Verdict:** PASS | FAIL\n\n## Blocking Issues\n{issues}

### review
# PR Review: {feature}\n| Check | Status |\n|-------|--------|\n| Architect | {result} |\n| Coverage | {pct}% |\n\n**Verdict:** READY_FOR_MERGE | CHANGES_REQUESTED

## Phase Overrides

- **plan:** Inject a project-context summary table before the file tree.
- **score:** Use the scoring table format — Gemini responds well to tabular comparisons.
- **chaos:** Use a table for scenario rows; prose for blocking issues below.
