# Command: /review

**Role:** @architect, @developer

## Phase 0 (condensed)

Before starting: run `node scripts/resolve-profiles.js` (Bash tool), then read
`resolved-context.md` (Read tool). Extract model rules for architect and developer.
Inject into each agent's `{MODEL_RULES_INJECTED_BY_ORCHESTRATOR}`.

## Workflow

1. **Design Audit (@architect):** Compare the final code against the original
   drawing in `plan_template.md`.
2. **Quality Check (@developer):** Confirm all Acceptance Criteria are met
   and tests are passing.
3. Generate the final PR summary using `.cursor/templates/review_template.md`,
   wrapped in the `review_format` from the resolved model profile.
4. Provide a clear **"Ready for Merge"** statement.

**Next Step:** The user can now merge the branch into main.
