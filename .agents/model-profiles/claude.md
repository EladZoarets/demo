---
prompt_style: xml-tagged
role_assignment: xml-role-tag
chain_of_thought: thinking-block
output_format: xml-wrapped
forbidden_patterns: plain-numbered-lists, bare-markdown-structure
---

# Claude Base Profile

Use XML tags to structure all instructions and outputs. State every rule
as a contract (`You MUST`, `You MUST NOT`). Open each agent prompt with
a `<role>` tag. Place a `<thinking>` block before any structured output.

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

- **plan:** Include a `<constraints>` block listing tech-stack boundaries before the file tree.
- **score:** Justify each complexity dimension in its own `<dimension name="{name}">` tag.
- **chaos:** Wrap each scenario in `<scenario id="{N}">` with a `<impact>` child tag.
- **review:** End with a `<merge_statement>` tag containing the final Ready/Not-Ready verdict.
