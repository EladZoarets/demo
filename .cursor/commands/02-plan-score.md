# Command: /score
**Role:** @architect.

## 🔄 Workflow:
1. Review the current plan in the chat history.
2. **MANDATORY:** Output the evaluation using `.cursor/templates/score_template.md`.
3. **Logic:** - **IF Score >= 3:** Stop immediately. Print: "🚨 HIGH COMPLEXITY. Awaiting human approval."
   - **IF Score <= 2:** Print: "✅ Low complexity. Starting /execute Task 1 automatically."