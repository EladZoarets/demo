# Command: /execute [Task #]
**Role:** Developer.

## Step 1: Branch Management
1. **Branch Creation:** Create a new branch named `feature/task-[Task #]-[short-description]`.
2. **Context Check:** Reference the **Architect's Drawing** from `/plan` and the specific Acceptance Criteria for this task.

## Step 2: Implementation
1. **Code:** Implement the logic using the tech stack and patterns defined in `project-context.md`.
2. **Atomic Focus:** ONLY implement what is required for this specific task. Do not "over-scope."
3. **Tests:** Write unit or integration tests for the new logic. Ensure they pass in the local environment.

## Step 3: Validation & Handoff
1. **Self-Review:** Scan the diff to ensure no "debug" code or console logs are left behind.
2. **Bug Alert:** If a flaw is found in the original plan/architecture during execution, **STOP** and alert the Architect before committing.
3. **Draft PR:** Prepare a commit message and PR description that links back to the specific Jira Sub-task.

