# Command: /chaos
**Role:** @chaos

## Input
Branch name, worktree path, or PR URL (any form accepted).
If running after `/code-review`, the resolved diff from Step 0 may be passed directly.

## Core Principle
Business logic must remain unchanged unless explicitly required by the task definition.
If business logic changes intentionally, the Chaos Report must explicitly list what
changed and what downstream behavior is now different — even if the change is correct.

---

## Workflow:

### Step 0 — Input Resolution
If diff is not already available, detect input type and extract:
- The full diff
- Branch name
- Associated PR/Jira link (if discoverable)

Fail fast with a clear error if the diff cannot be retrieved.

### Step 1 — Blast Radius Mapping
Read the full diff. For each changed function, module, or config:
- Trace its call graph to identify downstream consumers and dependent flows
- Flag shared utilities, middleware, auth layers, and data-access layers as high-risk
- Note any deleted or renamed exports that could silently break consumers

### Step 2 — Scenario Collection
Before generating test scenarios, collect from all available sources:
- Existing test cases that cover the changed code
- Acceptance Criteria from `/plan` (if available)
- Edge cases derived from the diff itself:
  - Null / undefined / empty inputs
  - Boundary values and off-by-one conditions
  - Concurrent or out-of-order calls
  - Partial failure states (e.g. DB write succeeds, cache invalidation fails)
  - Permission / auth edge cases

### Step 3 — Chaos Execution
For each scenario:
- State the input conditions
- Trace the expected behavior (based on pre-change logic)
- Trace the actual behavior (based on post-change logic)
- Classify the result: `PASS` / `FAIL` / `LATENT` (was broken before, now exposed)

Apply the "3am bar" throughout: would this failure wake someone up?

### Step 4 — Generate Chaos Report

```
## Chaos Report
**Branch:** [branch name]
**Verdict:** [PASS] / [FAIL]

## Core Principle Check
- [ ] Business logic is unchanged from pre-change baseline
- [ ] If business logic changed intentionally: changes are listed below

### Intentional Business Logic Changes (if any)
- [What changed] → [What downstream behavior is now different]

---

### Blast Radius
- **High-risk files/modules:** [list]
- **Downstream consumers affected:** [list]
- **Shared layers touched:** [auth / middleware / DB / cache / other]

---

### Scenarios Tested
| # | Scenario | Pre-change | Post-change | Result |
|---|----------|------------|-------------|--------|
| 1 | [description] | [expected] | [actual] | PASS / FAIL / LATENT |
| 2 | ... | ... | ... | ... |

---

### Breaking Scenarios (if FAIL)
For each failure:
- **Scenario:** [description]
- **Type:** REGRESSION (was working) / LATENT (was always broken, now exposed)
- **Reproduction steps:** [exact steps]
- **Expected:** [pre-change behavior]
- **Actual:** [post-change behavior]

---

### Regression Risks
Existing flows at risk even if not directly tested:
- [Flow] → [Risk] → [Type: REGRESSION / LATENT]

---

### On-call Risk
| Failure Mode | Impact | Detection Gap | Severity |
|---|---|---|---|
| [what breaks] | [who is affected, how bad] | [will alerting catch it?] | P1 / P2 / P3 |

---

### Verdict Rationale
- [Why PASS or FAIL in plain language]
- [Any conditional passes — things that need monitoring post-deploy]
```

---

## Post-Command
- If **PASS:** proceed to `/code-review` (or return Chaos Verdict to it if already running).
- If **FAIL:** run `/developer-fix`, then re-run `/chaos` before proceeding.
- If fixes are non-trivial, re-run full `/code-review` after `/chaos` passes.
