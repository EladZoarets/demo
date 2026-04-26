# Model Profile Schema

Required fields for every profile file. Missing fields produce a warning
(not an error) when running `node scripts/resolve-profiles.js --dry-run`.

| Field | Type | Description |
|-------|------|-------------|
| `prompt_style` | enum | How to structure instruction blocks: `xml-tagged`, `plain-numbered`, `markdown-sections` |
| `role_assignment` | enum | How to declare agent persona: `xml-role-tag`, `inline-you-are` |
| `chain_of_thought` | enum | CoT trigger method: `thinking-block`, `extended-thinking`, `none` |
| `output_format` | enum | Preferred output wrapper: `xml-wrapped`, `markdown-sections`, `markdown-table-hierarchy` |
| `forbidden_patterns` | string | Comma-separated patterns NOT to use with this model |
| `extends` | string | Optional. Base profile filename. Inherits all fields; override by redeclaring. |

## Template Formats Section

Every profile must have a `## Template Formats` section with four
sub-sections: `### plan`, `### score`, `### chaos`, `### review`.

Each sub-section contains a single-line format string using `{placeholder}`
syntax. The orchestrator substitutes placeholders at prompt-assembly time.

## Adding a New Profile

1. Copy `default.md` to `<model-id>.md` in `.cursor/model-profiles/`.
2. Update field values for the new model.
3. Add an entry to `_registry.md`: `<model-id>: <filename>`.
4. Mirror both files to `.agents/model-profiles/`.
5. Run `node scripts/resolve-profiles.js --dry-run` to validate.
6. Update agent frontmatters to reference the new model ID where appropriate.
