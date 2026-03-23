# 🤖 Cursor AI-SDLC Framework: The Next Gen Workflow

> **Stop asking AI to write code. Start managing AI to build systems.**

This repository is a production-ready template for **Autonomous Software Development Life Cycle (SDLC)** within Cursor. It transforms the AI from a "Chatbot" into a structured **Engineering Team**.

## 🛠️ The Core Engine
This framework is built on three pillars:

1. **Role-Based Agents**: Specific personas (@architect, @chaos, etc.) with conflicting interests to ensure quality through tension.
2. **The Gatekeeper Logic**: A mandatory scoring system that prevents AI from executing complex tasks without human sign-off.
3. **Chaos Auditing**: A dedicated stage for destructive testing, ensuring no code is merged without an edge-case audit.

## 🕹️ Operational Commands
| Command | Intent | Role |
| :--- | :--- | :--- |
| `/plan` | Architecture & Requirements | Product + Architect |
| `/score` | Complexity Guardrail (1-5) | Architect |
| `/execute` | Implementation & Unit Tests | Developer |
| `/chaos` | Destructive Audit & Edge Cases | Chaos Agent |
| `/review` | Final Sign-off & PR Generation | Architect |

## 🚀 Deployment
1. Clone this repo into your `.cursor` folder.
2. Update `project-context.md` with your stack.
3. Run `/orchestrate [feature]` and watch the machine work.

---
*Developed for Senior Engineering Managers and AI Guild Leads.*
