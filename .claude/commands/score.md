# Command: /score

**Role:** @architect

## Phase 0 (condensed)

Before starting: run `node scripts/resolve-profiles.js` (Bash tool), then read
`resolved-context.md` (Read tool). Extract model rules for architect.
Inject into `{MODEL_RULES_INJECTED_BY_ORCHESTRATOR}`.

## Workflow

1. Review the current plan in the chat history.
2. Evaluate and assign a **Complexity Score (1-5)**.
3. Output using `.cursor/templates/score_template.md`, wrapped in the
   `score_format` from the resolved model profile.

## Gate Logic

- **Score 1-2:** Print `[AUTONOMOUS PROCEED]`. Continue to `/execute Task 1`.
- **Score 3-5:** Print `[AWAITING APPROVAL]`. Pause until user says "Approved" or "Proceed".

No model name is hardcoded — model identity comes from `resolved-context.md`.
