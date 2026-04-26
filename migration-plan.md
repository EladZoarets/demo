# Migration Plan: Model-Aware Prompt Adaptation for AI-SDLC Framework

**Status: NO IMPLEMENTATION HAS BEGUN — awaiting human approval.**

---

## Part 1 — Inventory Confirmation

The spec's section 1 describes the repo as having two surfaces. Here is the confirmed inventory against what actually exists, with discrepancies noted.

### Confirmed structure

```
.cursor/
  agents/          product.md, architect.md, manager.md, developer.md, chaos.md
  commands/        01-plan.md.md, 02-plan-score.md, 03-execute.md,
                   04-chaos.md, 05-code-review.md, orchestrate.md
  templates/       plan_template.md, score_template.md,
                   chaos_report.md, review_template.md
  project-context.md

.agents/
  skills/          sdlc-product/SKILL.md, sdlc-architect/SKILL.md,
                   sdlc-manager/SKILL.md, sdlc-developer/SKILL.md,
                   sdlc-chaos/SKILL.md, sdlc-orchestrator/SKILL.md

AGENTS.md
README.md
```

### Discrepancies from spec wording

1. **`.cursor/agents/` has 5 agents, not 6.** There is no `orchestrator.md` agent there. The orchestrator role lives in `.cursor/commands/orchestrate.md` (a command, not an agent). The `.agents/skills/` side does have `sdlc-orchestrator/SKILL.md`. This is consistent and correct — the spec itself groups them loosely as "6 roles" but the Cursor surface treats the orchestrator as a command. The migration plan accounts for this split.

2. **Typo confirmed.** `.cursor/commands/01-plan.md.md` has a double extension. See open question 4 below.

3. **`chaos_report.md` is classified as a template but is structured as a command.** Its header reads `# Command: /chaos` and describes a workflow rather than just a fill-in template. It is the richest and most detailed document in the repo. The migration plan treats it as both (command + template) and preserves its structure exactly, adding only a JSON section at the bottom.

---

## Part 2 — Open Questions: Recommended Answers

All five are treated as blocking. Each recommendation is one sentence with justification. A human must confirm or override each before implementation begins.

### Q1 — Validator language

**Recommendation: Python using `jsonschema` (PyPI).**

Justification: The project already specifies a Python/FastAPI/Pytest backend stack in both `project-context.md` and `AGENTS.md`; adding one `pip install jsonschema` keeps the dependency in the language the project owner already has. A single `validators/validate.py` script is portable, runs in any shell with Python 3.8+, and has no external service dependency.

Shell + `ajv` is a viable alternative if the owner prefers zero Python: `npm install -g ajv-cli` is similarly lightweight and keeps it in the Node/npm world. If approved, the plan just swaps the validator implementation file; the schema files and the role definitions are identical either way.

**Please confirm: Python or Node/ajv?**

---

### Q2 — Where does JSON output live at runtime?

**Recommendation: JSON embedded in a fenced code block in the role's response, with the orchestrator extracting it.**

Format:
```
<!-- sdlc:output:json -->
```json
{ ... }
```
<!-- /sdlc:output:json -->
```

Justification: This framework is configuration-only and must work in Cursor (chat), Amp (chat), Claude Code (chat), and custom orchestrators. Writing to a file path assumes the host environment can resolve relative paths and persist files between turns — not guaranteed in all surfaces. Extracting from a clearly-delimited fenced block works in any environment where the orchestrator can read its own context window. The sentinel comment tags (`<!-- sdlc:output:json -->`) prevent accidental collision with other fenced blocks.

If the owner wants file-based state (more robust for long multi-step pipelines), the alternative is: every role writes to `.sdlc/state/<stage>.json` and the orchestrator reads from there. The migration plan notes which role definitions change, but the schema files are identical either way.

**Please confirm: in-response fenced block or file-based `.sdlc/state/`?**

---

### Q3 — Initial set of model variants

**Recommendation: `claude` variant and `default` variant ship in iteration 1.**

Justification: The spec already names Claude as the executing environment (this repo was opened in Claude Code), and `default` covers the `model: inherit` case used today. GPT-5 and Gemini variants can be added later using the same structure; their absence does not break anything because the `default` variant produces sane output on any model.

**Please confirm: `claude` + `default` only, or also `gpt` and/or `gemini` in iteration 1?**

---

### Q4 — `01-plan.md.md` typo

**Recommendation: Rename to `01-plan.md` and add a one-line comment inside the file noting the rename, so any user who bookmarked the old path can find it.**

Justification: Leaving the double extension is a known footgun for any tool that parses by extension. Silently fixing it is better than a deprecation shim, but a one-line note ("formerly 01-plan.md.md") costs nothing and helps users who already reference it. No other file in the repo references `01-plan.md.md` by path, so the blast radius is zero.

**Please confirm: fix with comment, fix silently, or leave untouched?**

---

### Q5 — Language of new files

**Recommendation: English only.**

The entire repo is English. No new files should introduce Hebrew content.

**Please confirm: English only?**

---

## Part 3 — Migration Plan

### Overview of what changes

| Area | What is added | What is modified | What is not touched |
|---|---|---|---|
| `schemas/` (new dir) | 5 JSON Schema files | — | — |
| `validators/` (new dir) | 1 validator script | — | — |
| `.cursor/agents/*.md` | model variant sections | core role prose | frontmatter, role identity |
| `.cursor/commands/orchestrate.md` | JSON gate logic | scoring and chaos gate wording | pipeline stages, role assignments |
| `.cursor/templates/*.md` | `<!-- sdlc:output:json -->` block | nothing else | all existing template prose |
| `.agents/skills/*/SKILL.md` | model variant sections, JSON output block | scoring/chaos gate wording in orchestrator | all role identity prose |
| `README.md` | dual-output section, model-variant how-to | — | everything else |
| `AGENTS.md` | dual-output section | — | everything else |

### Step ordering rationale

Each step leaves the repo in a working state because:
- Steps 1–2 only add new directories; nothing reads them yet.
- Steps 3–5 update templates and role definitions to emit JSON; the orchestrator still reads prose until step 6.
- Step 6 switches the orchestrator to read JSON; by then all roles produce it.
- Steps 7–8 are documentation only; no functional change.
- Step 9 fixes the filename typo; no role logic depends on the path.

---

### Step 1 — Create `schemas/` directory with five JSON Schema files

**Files created:**
- `schemas/plan.schema.json`
- `schemas/score.schema.json`
- `schemas/execute.schema.json`
- `schemas/chaos.schema.json`
- `schemas/review.schema.json`

**What each schema captures:**

#### `schemas/plan.schema.json`
Required fields (consumed by the score stage):
```json
{
  "feature_name": "string",
  "status": "PENDING_APPROVAL | AUTONOMOUS_PROCEED",
  "requirements": {
    "user_story": "string",
    "acceptance_criteria": ["string"]
  },
  "file_changes": {
    "created": ["string"],
    "modified": ["string"],
    "deleted": ["string"]
  },
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "definition_of_done": "string"
    }
  ],
  "mermaid_diagram": "string | null"
}
```

#### `schemas/score.schema.json`
Required fields (consumed by the orchestrator gate):
```json
{
  "feature_name": "string",
  "complexity_score": "integer 1–5",
  "verdict": "STOP_FOR_HUMAN | PROCEED_AUTONOMOUSLY",
  "reasoning": {
    "technical_complexity": "string",
    "system_risk": "string",
    "confidence_level": "string"
  }
}
```
The `complexity_score` field is the machine-checkable replacement for parsing `**Final Complexity Score:** [1-5]` from prose.

#### `schemas/execute.schema.json`
Required fields (consumed by the chaos stage):
```json
{
  "task_id": "string",
  "branch_name": "string",
  "files_changed": ["string"],
  "tests_passing": "boolean",
  "pr_description": "string"
}
```

#### `schemas/chaos.schema.json`
Required fields (consumed by the review stage and by the orchestrator's chaos gate):
```json
{
  "branch": "string",
  "verdict": "PASS | FAIL",
  "scenarios_tested": "integer",
  "blocking_issues": ["string"],
  "on_call_risk": "P1 | P2 | P3 | NONE"
}
```
The `verdict` field is the machine-checkable replacement for parsing `**Verdict:** [PASS] / [FAIL]` from prose.

#### `schemas/review.schema.json`
Required fields:
```json
{
  "feature_name": "string",
  "verdict": "READY_FOR_MERGE | CHANGES_REQUESTED",
  "architect_review": "PASSED | COMMENTS",
  "chaos_verdict": "PASS | FAIL",
  "test_coverage": "string"
}
```

**How to verify this step:** `ls schemas/` shows 5 files; `python -m json.tool schemas/plan.schema.json` (or `node -e "require('./schemas/plan.schema.json')"`) exits without error.

---

### Step 2 — Create `validators/` directory with validation script

**Files created:**
- `validators/validate.py` (if Python approved) OR `validators/validate.js` (if Node/ajv approved)
- `validators/README.md` — one paragraph explaining usage (not a planning doc; just the command to run)

**What the validator does:**
1. Accepts two arguments: `<schema_file>` and `<json_file>` (or piped stdin).
2. Validates the JSON against the schema.
3. On success: exits 0, prints `VALID`.
4. On failure: exits 1, prints the first failing field name and the violated rule (e.g., `INVALID: verdict must be one of ["PASS","FAIL"], got "pass"`).

**Python implementation sketch** (to be implemented in step 2, not now):
```
pip install jsonschema
python validators/validate.py schemas/chaos.schema.json .sdlc/state/chaos.json
```

**How to verify this step:** Run the validator against a valid JSON object; it exits 0. Mutate a required field; it exits 1 with a named error.

---

### Step 3 — Add dual-output instruction and model-variant structure to `.cursor/agents/*.md`

**Files modified:** `architect.md`, `chaos.md`, `developer.md`, `manager.md`, `product.md`

**What changes in each file:**

Each agent file gains two sections appended after its existing content:

**Section A — Output Contract** (same for all variants of a role):
```
## Output Contract

Every invocation MUST produce two outputs in this order:

1. The filled-in markdown template (for human review).
2. A JSON object conforming to `schemas/<stage>.schema.json`, wrapped as:

<!-- sdlc:output:json -->
```json
{ ... }
```
<!-- /sdlc:output:json -->

The JSON is the source of truth for the next stage. The markdown is for humans.
If you cannot produce a valid JSON object, output a JSON error envelope:
{ "error": "reason", "stage": "<stage name>" }
and halt.
```

**Section B — Model Variants**:
```
## Model Variants

### claude (active when model: claude-*)
- Structure instructions with XML tags: <role>, <rules>, <output_contract>.
- State each rule as a contract: "You MUST ...", "You MUST NOT ...".
- Include an explicit <anti_patterns> block listing what the role refuses.
- Use imperative present tense throughout.

### default (active when model: inherit or unknown)
- Use terse markdown headings: ## Role, ## Rules, ## Output.
- No chain-of-thought primers.
- State rules as bullet points.
- Omit the anti_patterns block.
```

**What is NOT changed:** The frontmatter (`name`, `model`, `description`, `readonly`), the role identity prose, the responsibilities, and the guidelines. No existing content is removed or reordered.

**How to verify this step:** Open any agent file; confirm the existing role prose is intact and the two new sections appear at the bottom.

---

### Step 4 — Add dual-output instruction and model-variant structure to `.agents/skills/*/SKILL.md`

**Files modified:** All six SKILL.md files.

Same pattern as Step 3 but adapted to the Amp skill format (no frontmatter `model:` field). The Output Contract section uses the same sentinel tags. The model-variant section uses `inherit` as the fallback label instead of `default` to match Amp terminology.

**Additional change in `sdlc-chaos/SKILL.md`:** The existing chaos report template in this file is less detailed than the `.cursor/templates/chaos_report.md`. The Amp skill's chaos template is updated to match the Cursor version's structure exactly (the 5-step workflow: Input Resolution, Blast Radius Mapping, Scenario Collection, Chaos Execution, Generate Report). This is the only content change to a SKILL.md's core section; it's a sync, not a new behavior.

**How to verify this step:** The two surfaces (`.cursor/agents/` and `.agents/skills/`) now have identical output contract semantics.

---

### Step 5 — Add JSON output block to all four `.cursor/templates/`

**Files modified:** `plan_template.md`, `score_template.md`, `chaos_report.md`, `review_template.md`

Each template gains a closing section:

```markdown
---

## Machine Output

When this template is filled in, append the following block with all fields populated:

<!-- sdlc:output:json -->
```json
{
  "<field>": "<value>",
  ...
}
```
<!-- /sdlc:output:json -->

See `schemas/<stage>.schema.json` for the required fields and allowed values.
```

**What is NOT changed:** All existing template prose, section headings, table structures, and the chaos report's 5-step workflow. The JSON block is purely additive at the bottom.

**How to verify this step:** Each template renders identically to before when filled in as markdown; the JSON block is the only addition.

---

### Step 6 — Update orchestrator definitions to gate on JSON, not prose

**Files modified:**
- `.cursor/commands/orchestrate.md`
- `.agents/skills/sdlc-orchestrator/SKILL.md`

**Changes:**

**Score gate** — replace the current prose-parsing instruction:
> *current:* "Evaluate the plan and assign a Complexity Score (1-5). IF Score >= 3: PAUSE."

*new:*
```
After the Architect produces its score output, extract the JSON block delimited by
<!-- sdlc:output:json --> ... <!-- /sdlc:output:json -->.
Validate it against schemas/score.schema.json.
  - If validation fails: halt with "Pipeline error: score output invalid. [field] [rule]."
  - If complexity_score >= 3: PAUSE. Print the plan and score markdown. Wait for "Approved" or "Proceed".
  - If complexity_score <= 2: proceed to Phase 3 automatically.
Do NOT parse the prose "Final Complexity Score" line.
```

**Chaos gate** — replace:
> *current:* "If [FAIL], return to Phase 3."

*new:*
```
After the Chaos Agent produces its audit output, extract the JSON block.
Validate it against schemas/chaos.schema.json.
  - If validation fails: halt with "Pipeline error: chaos output invalid. [field] [rule]."
  - If verdict == "FAIL": return to Phase 3. List blocking_issues from the JSON.
  - If verdict == "PASS": proceed to Phase 5.
Do NOT parse the prose "[PASS]" / "[FAIL]" line.
```

**What is NOT changed:** The pipeline stage sequence, role assignments, branch naming convention, the human approval checkpoint description, Phase 1–5 structure.

**How to verify this step:** Walk through the orchestrator text; confirm both gates reference the JSON field names (`complexity_score`, `verdict`) and the schema files.

---

### Step 7 — Update `README.md` and `AGENTS.md`

**Files modified:** `README.md`, `AGENTS.md`

**Additions to README.md:**
1. A "Dual-Output Convention" section (after the pipeline section) explaining:
   - Every role produces markdown (for humans) and JSON (for the orchestrator).
   - The sentinel tag format.
   - Which schema covers which stage.
2. A "Adding a New Model Variant" section explaining:
   - Open the agent/skill file for the role.
   - Add a new named subsection under `## Model Variants`.
   - The core role identity, output contract, and schema are inherited.
3. A "Validation Failures" section explaining:
   - The error format (`Pipeline error: <stage> output invalid. <field> <rule>`).
   - How to recover: re-run the failed stage after fixing the output, or run the validator manually.

**Additions to AGENTS.md:**
- A "Dual-Output Convention" paragraph (2–3 sentences, consistent with README.md).

**What is NOT changed:** All existing README.md content (pillars description, skills table, pipeline overview, deployment instructions, structure tree, Cursor→Amp mapping table, credits). All existing AGENTS.md content (stack context, skills table, usage instructions).

**How to verify this step:** README.md renders the new sections between the existing pipeline and deployment sections; AGENTS.md has the new paragraph after the skills table.

---

### Step 8 — Fix `01-plan.md.md` filename typo (conditional on Q4 approval)

**File renamed:** `.cursor/commands/01-plan.md.md` → `.cursor/commands/01-plan.md`

**One line added inside the file** (top of file, after the `# Command: /plan` heading):
```
<!-- formerly named 01-plan.md.md; renamed to fix double extension -->
```

No other file in the repo references this path, so no cross-file updates are needed.

**How to verify this step:** `ls .cursor/commands/` shows `01-plan.md`, not `01-plan.md.md`.

---

## Part 4 — File Touch Summary

| File | Step | Change type |
|---|---|---|
| `schemas/plan.schema.json` | 1 | CREATE |
| `schemas/score.schema.json` | 1 | CREATE |
| `schemas/execute.schema.json` | 1 | CREATE |
| `schemas/chaos.schema.json` | 1 | CREATE |
| `schemas/review.schema.json` | 1 | CREATE |
| `validators/validate.py` (or `.js`) | 2 | CREATE |
| `validators/README.md` | 2 | CREATE |
| `.cursor/agents/architect.md` | 3 | MODIFY (append only) |
| `.cursor/agents/chaos.md` | 3 | MODIFY (append only) |
| `.cursor/agents/developer.md` | 3 | MODIFY (append only) |
| `.cursor/agents/manager.md` | 3 | MODIFY (append only) |
| `.cursor/agents/product.md` | 3 | MODIFY (append only) |
| `.agents/skills/sdlc-architect/SKILL.md` | 4 | MODIFY (append only) |
| `.agents/skills/sdlc-chaos/SKILL.md` | 4 | MODIFY (append + sync chaos template) |
| `.agents/skills/sdlc-developer/SKILL.md` | 4 | MODIFY (append only) |
| `.agents/skills/sdlc-manager/SKILL.md` | 4 | MODIFY (append only) |
| `.agents/skills/sdlc-orchestrator/SKILL.md` | 4 + 6 | MODIFY (append + gate logic) |
| `.agents/skills/sdlc-product/SKILL.md` | 4 | MODIFY (append only) |
| `.cursor/templates/plan_template.md` | 5 | MODIFY (append only) |
| `.cursor/templates/score_template.md` | 5 | MODIFY (append only) |
| `.cursor/templates/chaos_report.md` | 5 | MODIFY (append only) |
| `.cursor/templates/review_template.md` | 5 | MODIFY (append only) |
| `.cursor/commands/orchestrate.md` | 6 | MODIFY (gate logic replacement) |
| `README.md` | 7 | MODIFY (new sections appended) |
| `AGENTS.md` | 7 | MODIFY (new paragraph appended) |
| `.cursor/commands/01-plan.md.md` | 8 | RENAME + one-line comment |

**Files not touched by this migration:**
- `.cursor/commands/02-plan-score.md` (prose only; gate logic lives in orchestrator)
- `.cursor/commands/03-execute.md`
- `.cursor/commands/04-chaos.md`
- `.cursor/commands/05-code-review.md`
- `.cursor/project-context.md`
- `AGENTS.md` stack context section

---

## Part 5 — Acceptance Criteria Mapping

| Criterion | Covered by step(s) |
|---|---|
| 1. Every role has ≥2 variants (claude + default), shared core, docs on adding more | 3, 4, 7 |
| 2. Five schemas under `schemas/` covering all pipeline handoffs | 1 |
| 3. Orchestrator produces markdown + JSON at every stage | 3, 4, 5, 6 |
| 4. Mutating a required JSON field causes next stage to refuse | 2, 6 |
| 5. Score gate and chaos gate read from JSON | 6 |
| 6. README and AGENTS describe dual-output + model-variant procedure | 7 |
| 7. No existing role behavior changes in observable output | all (append-only or gate-logic replacement; no role identity changes) |

---

## Status

**NO IMPLEMENTATION HAS BEGUN.**

This document is a plan only. Zero files in the repository have been modified. Implementation begins only after the human approves:

- [ ] Q1: Validator language (Python or Node/ajv)
- [ ] Q2: JSON output location (fenced block or `.sdlc/state/` files)
- [ ] Q3: Model variants for iteration 1 (claude + default, or include gpt/gemini)
- [ ] Q4: Typo handling (fix with comment, fix silently, or leave)
- [ ] Q5: Language (English only — assumed yes, confirm)
- [ ] Overall plan approval

Once all five questions are answered and the plan is approved, implementation proceeds step by step in the order listed above.
