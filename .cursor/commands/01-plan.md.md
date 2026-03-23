# Command: /plan [User Request]
**Role:** @product, @architect, @manager.

## 🔄 Workflow:
1. Analyze the request against `.cursor/project-context.md`.
2. **Product:** Define Jira-ready requirements and AC.
3. **Architect:** Draw the file tree and Mermaid logic flow.
4. **Manager:** Break the design into atomic, PR-sized tasks.
5. **MANDATORY:** Format the entire output using `.cursor/templates/plan_template.md`.

**Next Step:** Once the plan is generated, run `/score`.