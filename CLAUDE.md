# AI-SDLC Framework — Claude Code

## Project DNA

- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Backend:** Python (FastAPI), Pydantic, Uvicorn
- **Testing:** Vitest (frontend), Pytest (backend)

See `AGENTS.md` for full stack context.

## Active Model

```
ACTIVE_MODEL: claude-sonnet-4-6
```

## Phase 0: Model Profile Loading (ALWAYS RUN FIRST)

Before any pipeline phase, load model profiles:

1. **Run the resolve script** (Bash tool):
   ```
   node scripts/resolve-profiles.js
   ```
   If it fails: **STOP.** Print the error. Do not proceed to any pipeline phase.

2. **Read the output** (Read tool):
   ```
   resolved-context.md
   ```
   If the file is missing after the script runs: **STOP.** Print error. Do not proceed.

3. **Extract per-agent rules** from `resolved-context.md`:
   For each `[agent: {name} | model: {id}]` block, store:
   - `model_id` → pass as the `model` parameter when spawning the sub-agent **only if the value is not `none`**; if it is `none`, omit the `model` parameter entirely and let Claude Code choose
   - rules block text → inject into `{MODEL_RULES_INJECTED_BY_ORCHESTRATOR}` placeholder in the agent's prompt
   - `plan_format` / `score_format` / `chaos_format` / `review_format` → use when assembling phase output

4. **Confirm:**
   ```
   [PROFILES LOADED: architect=X | product=X | manager=X | developer=X | chaos=X]
   ```

5. Proceed to the requested phase.

## Pipeline Commands

| Command | Phase | Agents |
|---------|-------|--------|
| `/orchestrate` | Full pipeline (0 → 5) | All |
| `/plan` | Phase 1 — Planning | product, architect, manager |
| `/score` | Phase 2 — Scoring | architect |
| `/execute` | Phase 3 — Implementation | developer |
| `/chaos` | Phase 4 — Stress test | chaos |
| `/review` | Phase 5 — Code review | architect, developer |

Commands live in `.claude/commands/`.

## Model Profile System

Model profiles live in `model-profiles/`. Agent model assignments are declared
in `model-profiles/agents.md` — one line per agent, platform-neutral. The
resolve script maps each agent's model to a profile file via `_registry.md`
and writes per-agent rules to `resolved-context.md`.

Setting a model is optional. Leave the value blank in `agents.md` and the
orchestrator will **not** pass a `model` parameter when spawning that agent,
letting the platform pick the model.

To change an agent's model: edit `model-profiles/agents.md`.
To add a new model: add one line to `_registry.md` and one profile file.
No changes to agents, commands, or templates required.
