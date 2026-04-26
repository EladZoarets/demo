# AI-SDLC Framework

> **Stop asking AI to write code. Start managing AI to build systems.**

A configuration-only template that turns any AI assistant into a structured engineering team. Drop it into your project, point it at your stack, and get a full SDLC pipeline — planning, scoring, execution, chaos testing, and review — with role-based agents that check each other's work.

Runs on **Claude Code**, **Cursor**, and **Amp**. No code changes needed to switch between them.

---

## How it works

The framework defines **6 roles** that run a **5-phase pipeline**:

```
[PLAN] → [SCORE] → [EXECUTE] → [CHAOS] → [REVIEW]
```

| Role | What it does |
|------|-------------|
| **Product** | Translates your request into user stories and acceptance criteria |
| **Architect** | Draws the file tree, Mermaid diagrams, and scores complexity |
| **Manager** | Breaks the design into atomic, PR-sized tasks |
| **Developer** | Implements code and tests on a feature branch |
| **Chaos** | Stress-tests the diff — only outputs [PASS] or [FAIL] |
| **Orchestrator** | Runs the full pipeline and enforces the gates |

**Two hard gates keep humans in the loop:**

- **Score gate** — if complexity ≥ 3 the pipeline pauses and waits for your approval before any code is written
- **Chaos gate** — if the Chaos agent returns [FAIL] the Developer must fix the issues before the pipeline can continue

Each agent runs on the model best suited to its role. The Architect and Developer use Sonnet (speed + quality), Chaos uses Opus (deep reasoning for failure analysis), Manager uses Haiku (fast task decomposition). This is configured via model profiles — one registry entry per model, no changes to agent files.

---

## Quickstart

### Claude Code

1. Copy this repo into your project (or clone it as a starting point)
2. Update `AGENTS.md` with your stack
3. Open Claude Code in the repo — `CLAUDE.md` loads automatically
4. Run:
   ```
   /orchestrate add a user authentication flow
   ```

That's it. Phase 0 runs the profile resolver automatically before any agent is spawned.

### Cursor

1. Copy `.cursor/` into your project root
2. Update `.cursor/project-context.md` with your stack
3. In Cursor, run:
   ```
   /plan add a user authentication flow
   ```

### Amp

1. Copy `.agents/` into your project root
2. Update `AGENTS.md` with your stack
3. In Amp:
   ```
   Load the sdlc-orchestrator skill, then orchestrate: add a user authentication flow
   ```

---

## The pipeline in detail

### Phase 0 — Profile loading (Claude Code only)

Before any agent runs, the orchestrator executes:

```bash
node scripts/resolve-profiles.js
```

This script reads each agent's `preferred_model`, looks it up in `.cursor/model-profiles/_registry.md`, merges any inherited profile rules, and writes `resolved-context.md`. Each agent then receives prompt rules tailored to the model executing it — XML tags and `<thinking>` blocks for Claude, plain numbered lists for GPT, markdown tables for Gemini.

Output confirms success:
```
[PROFILES LOADED: architect=claude-sonnet-4-6 | product=gpt-5.5 | manager=claude-haiku-4-5 | developer=claude-sonnet-4-6 | chaos=claude-opus-4-6]
```

### Phase 1 — Plan

Product, Architect, and Manager work together:
- Product writes the user story and acceptance criteria
- Architect draws the proposed file tree and a Mermaid sequence diagram
- Manager breaks the design into atomic tasks, each scoped to one PR

### Phase 2 — Score

The Architect evaluates the plan on a 1–5 complexity scale:
- **1–2** → pipeline continues automatically
- **3–5** → pipeline pauses. You must say "Approved" or "Proceed" before any code is written

### Phase 3 — Execute

The Developer creates a feature branch (`feature/task-[id]-[desc]`), implements the code and tests, and prepares a PR description. If a flaw in the plan is found during implementation, the Developer stops and alerts the Architect.

### Phase 4 — Chaos

The Chaos agent audits the diff. It maps the blast radius, tests failure scenarios (null inputs, DB failures, race conditions, auth edge cases), and produces a structured report. One verdict: **[PASS]** or **[FAIL]**. A [FAIL] sends the pipeline back to Phase 3.

### Phase 5 — Review

Architect and Developer verify the final code against the original design. Output is a PR summary with a clear "Ready for Merge" statement.

---

## Model profile system

Each agent declares a `preferred_model` in its frontmatter. The resolve script maps that to a profile file which defines how prompts should be structured for that model.

```
agent preferred_model → _registry.md → profile file → resolved-context.md
```

**Adding a new model takes 2 steps:**

1. Add one line to `_registry.md`:
   ```
   claude-opus-4-7: claude-opus.md
   ```
2. Add or reuse a profile file in `.cursor/model-profiles/`. If the new model is a variant of an existing one, use `extends`:
   ```yaml
   ---
   extends: claude.md
   chain_of_thought: extended-thinking
   ---
   ```

No changes to agent files, commands, or orchestrators.

**Test a profile change without writing files:**
```bash
node scripts/resolve-profiles.js --dry-run
```

---

## File structure

```
.claude/                        # Claude Code
  agents/                       # Sub-agent definitions (architect, product, etc.)
  commands/                     # Slash commands (/orchestrate, /plan, /score, …)
CLAUDE.md                       # Claude Code entry point — auto-loaded on session start

.cursor/                        # Cursor
  agents/                       # Agent definitions
  commands/                     # Slash commands
  templates/                    # Plan, score, chaos, and review templates
  project-context.md            # Your stack (Cursor reads this)

.agents/                        # Amp
  skills/                       # Skill definitions (sdlc-architect, sdlc-chaos, …)

model-profiles/                 # Shared across all platforms
  _registry.md                  # model-id → profile-filename map
  _schema.md                    # Profile field definitions
  claude.md                     # Base Claude profile
  claude-opus.md                # Extends claude.md
  claude-sonnet.md              # Extends claude.md
  claude-haiku.md               # Extends claude.md
  gpt-5.5.md                    # Standalone
  gemini.md                     # Standalone
  default.md                    # Safe fallback for unknown models

scripts/
  resolve-profiles.js           # Profile resolver (Node.js, zero dependencies)

AGENTS.md                       # Your stack (Amp and Claude Code read this)
resolved-context.md             # Generated — do not edit manually
```

---

## npm scripts

```bash
npm run sdlc:resolve      # resolve profiles and write resolved-context.md
npm run sdlc:resolve:dry  # preview resolved output without writing
```

---

## Platform mapping

| Concept | Claude Code | Cursor | Amp |
|---------|-------------|--------|-----|
| Agent definitions | `.claude/agents/` | `.cursor/agents/` | `.agents/skills/` |
| Slash commands | `.claude/commands/` | `.cursor/commands/` | Embedded in skill |
| Project context | `CLAUDE.md` + `AGENTS.md` | `.cursor/project-context.md` | `AGENTS.md` |
| Orchestrate | `/orchestrate` | `/orchestrate` | `Load sdlc-orchestrator skill` |
| Model routing | `model:` frontmatter field | `model:` frontmatter field | `preferred_model` + profiles |

---

*Originally developed by [@EladZoarets](https://github.com/EladZoarets) for Cursor. Ported to Amp by [@zuwasi](https://github.com/zuwasi). Extended to Claude Code with model-aware profiles.*
