# 🤖 Amp AI-SDLC Framework: The Next Gen Workflow

> **Stop asking AI to write code. Start managing AI to build systems.**

This repository is a production-ready template for **Autonomous Software Development Life Cycle (SDLC)** within [Amp](https://ampcode.com). It transforms the AI from a "Chatbot" into a structured **Engineering Team**.

> 🔀 **Ampcode port** of the original [Cursor AI-SDLC Framework](https://github.com/EladZoarets/demo) by [@EladZoarets](https://github.com/EladZoarets).

## 🛠️ The Core Engine
This framework is built on three pillars:

1. **Role-Based Skills**: Specific personas (sdlc-architect, sdlc-chaos, etc.) with conflicting interests to ensure quality through tension.
2. **The Gatekeeper Logic**: A mandatory scoring system that prevents AI from executing complex tasks without human sign-off.
3. **Chaos Auditing**: A dedicated stage for destructive testing, ensuring no code is merged without an edge-case audit.

## 🕹️ Operational Skills
| Skill | Intent | Role |
| :--- | :--- | :--- |
| `sdlc-orchestrator` | Full SDLC pipeline | Orchestrator |
| `sdlc-product` | Requirements & User Stories | Product Manager |
| `sdlc-architect` | Architecture & Scoring | Architect |
| `sdlc-manager` | Task Decomposition & PRs | Engineering Manager |
| `sdlc-developer` | Implementation & Unit Tests | Developer |
| `sdlc-chaos` | Destructive Audit & Edge Cases | Chaos Agent |

## 🔄 The Pipeline

```
[PLAN] ➡️ [SCORE] ➡️ [EXECUTE] ➡️ [CHAOS] ➡️ [REVIEW]
```

1. **Plan** — Product defines requirements, Architect draws the solution, Manager breaks it into tasks.
2. **Score** — Architect scores complexity (1-5). Score ≥3 pauses for human approval.
3. **Execute** — Developer implements code and tests on a feature branch.
4. **Chaos** — Chaos Agent stress-tests the changes. [FAIL] sends it back to Execute.
5. **Review** — Architect and Developer verify design adherence and generate the PR summary.

## 🚀 Deployment

1. Copy the `.agents/` folder into your project root.
2. Update `AGENTS.md` with your project's stack and context.
3. In Amp, load the skill and start:
   ```
   Load the sdlc-orchestrator skill, then orchestrate: [your feature]
   ```

## 📁 Structure

```
.agents/
└── skills/
    ├── sdlc-orchestrator/    # Full pipeline orchestrator
    │   └── SKILL.md
    ├── sdlc-architect/       # Design & scoring
    │   └── SKILL.md
    ├── sdlc-chaos/           # Destructive testing
    │   └── SKILL.md
    ├── sdlc-developer/       # Implementation
    │   └── SKILL.md
    ├── sdlc-manager/         # Task decomposition
    │   └── SKILL.md
    └── sdlc-product/         # Requirements
        └── SKILL.md
AGENTS.md                     # Project context (your stack DNA)
```

## 🔄 Cursor ➡️ Amp Mapping

| Cursor Concept | Amp Equivalent |
|:---|:---|
| `.cursor/agents/*.md` | `.agents/skills/*/SKILL.md` |
| `.cursor/commands/*.md` | Workflows embedded in skill instructions |
| `.cursor/templates/*.md` | Templates embedded in skill `reference/` or inline |
| `.cursor/project-context.md` | `AGENTS.md` (root-level project context) |
| `@agent` mentions | `Load the [skill-name] skill` |
| `/command` slash commands | Skill triggers via description keywords |

---
*Originally developed by [@EladZoarets](https://github.com/EladZoarets) for Cursor. Ported to Amp by [@zuwasi](https://github.com/zuwasi).*
