# Command: /code-review
**Role:** @architect, @developer.

## 🔄 Workflow:
1. **Design Audit:** @architect compares the final code against the original drawing in the `plan_template.md`.
2. **Quality Check:** @developer confirms all Acceptance Criteria are met and tests are passing.
3. **Artifact:** Generate the final PR summary strictly following `.cursor/templates/review_template.md`.
4. **Final Verdict:** Provide a clear "Ready for Merge" statement.

**Next Step:** The user can now merge the branch into main.