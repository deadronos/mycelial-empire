# Requirements — AGENTS.md

1. WHEN a maintainer or contributor needs to understand automation roles, THE SYSTEM SHALL describe each agent’s mission, core skills, and ownership boundaries inside `AGENTS.md`.  
   **Acceptance:** Every agent entry lists name, goal, scope, and supporting capabilities.

2. WHEN agents must coordinate work, THE SYSTEM SHALL document the collaboration workflow, including handoff triggers and shared artifacts.  
   **Acceptance:** `AGENTS.md` includes a section detailing inter-agent communication patterns and dependency management.

3. WHEN referencing repository knowledge, THE SYSTEM SHALL link each agent to the relevant instruction or memory resources they rely on.  
   **Acceptance:** Agent entries cite files/instructions they consume or update.

4. WHEN onboarding a new agent, THE SYSTEM SHALL provide operating guidelines (tool access, commands, guardrails) to ensure consistent behavior.  
   **Acceptance:** `AGENTS.md` contains a standardized checklist/table covering setup prerequisites, allowed actions, and escalation paths.

5. WHEN the Spec-Driven workflow demands a stable project overview, THE SYSTEM SHALL maintain `projectbrief.md` with mission, scope, success indicators, and boundaries.  
   **Acceptance:** Document summarizes the colony simulation’s purpose, key goals, and measurable outcomes referencing the README’s objectives.

6. WHEN stakeholders request product context, THE SYSTEM SHALL provide `productContext.md` capturing problems solved, user journeys, and experience goals.  
   **Acceptance:** Document outlines target personas, pain points, and acceptance checks for the main scenarios described in the current UI wires.

7. WHEN engineers need architectural clarity, THE SYSTEM SHALL keep `systemPatterns.md` describing the layered stack, data flow, and recurring patterns.  
   **Acceptance:** File maps stores, ECS, renderer, and UI layers while listing the pattern(s) that coordinate them (central store, ECS sync, toasts as events).

8. WHEN developers need technical guardrails, THE SYSTEM SHALL maintain `techContext.md` with the stack, build workflow, automation commands, and constraints.  
   **Acceptance:** File lists tooling (`npm run dev`, typecheck, etc.), environment assumptions (Node version, Vite + React 19), and known constraints (no backend, local storage).  

9. WHEN contributors are picking up new work, THE SYSTEM SHALL include `activeContext.md` and `progress.md` to share priorities, working assumptions, and outstanding issues.  
   **Acceptance:** Both files highlight current focus, recent decisions, what’s working, what’s pending, and risk areas so onboarding stays efficient.
