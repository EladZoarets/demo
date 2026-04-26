# Command: /plan [User Request]

**Role:** @product, @architect, @manager

## Phase 0 (condensed)

Before starting: run `node scripts/resolve-profiles.js` (Bash tool), then read
`resolved-context.md` (Read tool). Extract model rules for product, architect,
and manager. Inject into each agent's `{MODEL_RULES_INJECTED_BY_ORCHESTRATOR}`.

## Workflow

1. Analyze the request against `AGENTS.md`.
2. **Product:** Define Jira-ready requirements and Acceptance Criteria.
3. **Architect:** Draw the file tree and Mermaid logic flow.
4. **Manager:** Break the design into atomic, PR-sized tasks.
5. Format the entire output using `.cursor/templates/plan_template.md`,
   wrapped in the `plan_format` from the resolved model profile.

**Next Step:** Run `/score` once the plan is generated.
