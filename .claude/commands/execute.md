# Command: /execute [Task #]

**Role:** @developer

## Phase 0 (condensed)

Before starting: run `node scripts/resolve-profiles.js` (Bash tool), then read
`resolved-context.md` (Read tool). Extract model rules for developer.
Inject into `{MODEL_RULES_INJECTED_BY_ORCHESTRATOR}`.

## Step 1: Branch Management

1. Create branch: `feature/task-[Task #]-[short-description]`.
2. Reference the Architect's design and the specific Acceptance Criteria.

## Step 2: Implementation

1. Implement the logic using the stack defined in `AGENTS.md`.
2. ONLY implement what is required for this task. Do not over-scope.
3. Write unit or integration tests. Ensure they pass locally.

## Step 3: Validation & Handoff

1. Scan the diff — no debug code, no console logs.
2. If a flaw is found in the plan, **STOP** and alert the Architect before committing.
3. Draft a PR description linking to the specific task.
