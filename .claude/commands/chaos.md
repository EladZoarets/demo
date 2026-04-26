# Command: /chaos

**Role:** @chaos

## Phase 0 (condensed)

Before starting: run `node scripts/resolve-profiles.js` (Bash tool), then read
`resolved-context.md` (Read tool). Extract model rules for chaos.
Inject into `{MODEL_RULES_INJECTED_BY_ORCHESTRATOR}`.

## Workflow

1. Audit the current code changes in the branch.
2. Generate the audit report following `.cursor/templates/chaos_report.md`,
   wrapped in the `chaos_format` from the resolved model profile.

## Verdict Logic

- **[PASS]:** Proceed to `/review`.
- **[FAIL]:** Return to `/execute`. List all blocking issues from the report.

The Developer must fix every blocking issue before re-running `/chaos`.
