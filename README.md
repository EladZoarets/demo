# 🚀 AI-Powered Fullstack Orchestrator

This repository is powered by a custom **AI-SDLC Framework**. It uses specialized AI Agents and structured Commands to ensure high-quality, architecturally sound code with automated "Chaos" testing.

## 🧠 The Framework (Agents)
- **@product**: Defines requirements and Acceptance Criteria.
- **@architect**: Designs the system, draws Mermaid diagrams, and scores complexity.
- **@manager**: Breaks down the design into atomic Jira-style tasks.
- **@developer**: Implements React (Vite/TS) and Python (FastAPI) code.
- **@chaos**: Stress-tests the implementation for edge cases and regressions.

## 🛠️ Custom Commands
Use these commands in the Cursor Chat to trigger the pipeline:

| Command | Action | Template Used |
| :--- | :--- | :--- |
| `/plan` | Generate requirements & drawings | `plan_template.md` |
| `/score` | Evaluate complexity (Gatekeeper) | `score_template.md` |
| `/execute` | Implement code & unit tests | (Dynamic) |
| `/chaos` | Audit code for bugs/edge cases | `chaos_report.md` |
| `/review` | Final PR summary & sign-off | `review_template.md` |
| `/orchestrate` | **Run the entire pipeline end-to-end** | All of the above |

## 🚀 Getting Started
1. **Initialize Workspace:**
   ```bash
   git init
   npm install # For React/Vite
   pip install -r requirements.txt # For Python