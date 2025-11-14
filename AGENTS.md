# AGENTS

Shared guide for every autonomous contributor operating inside `mycelial-empire`. Use this document to understand responsibilities, guardrails, and how work flows through the Spec-Driven Workflow and Memory Bank.

Also look at `.github/copilot-instructions.md` for AI assistant usage policies.

## Scope & Usage

- Serves maintainers, human collaborators, and software agents who execute repository tasks.
- Centralizes expectations for analyzing requests, producing designs, updating memory (`/memory/**`), and preparing handoffs/PR summaries.
- Complements `.github/instructions/spec-driven-workflow-v1.instructions.md` and `.github/instructions/memory-bank.instructions.md`.
- Decisions and updates should be logged in the relevant `memory/tasks/TASK###-*.md` file for traceability (if executing a task).
- Decisions and updates should also be reflected in memory files like activeContext.md and progress.md to keep context current. 
- High-level changes should be updated in memory/systemPatterns.md and memory/techContext.md as needed to reflect architectural or technical shifts.
- Update memory/projectbrief.md if the project mission, scope, or success indicators change significantly.
- Consider adding to change log at the end of this document for major agent updates or project shifts.

## Collaboration Workflow

### Spec-Driven Loop Ownership

| Phase | Primary Owner | Supporting Roles | Key Outputs |
| ----- | ------------- | ---------------- | ----------- |
| Analyze | Research Agent | Build Agent | Requirements (EARS), context notes |
| Design | Research Agent → Build Agent | Quality Agent | Design docs (`memory/designs`), task definitions (`memory/tasks`) |
| Implement | Build Agent | Research Agent | Code/doc changes, updated subtasks |
| Validate | Quality Agent | Build Agent | Test runs, lint/typecheck artifacts, performance notes |
| Reflect | Quality Agent | Research Agent | Tech debt log, documentation updates, progress summaries |
| Handoff | Build Agent | Quality Agent | PR summary, changelog, artifacts attachment |

### Handoff Triggers

1. **Analyze → Design:** Requirements approved + confidence score recorded.
2. **Design → Implement:** Design + tasks committed to Memory Bank (`DES###`, `TASK###`).
3. **Implement → Validate:** Implementation finished or ready for review, tests defined.
4. **Validate → Reflect/Handoff:** Validation logs captured, outstanding risks noted.

All agents annotate progress in `memory/tasks/_index.md` and the relevant `TASK` file before passing ownership.

## Agent Profiles

Each profile follows the template defined in `memory/designs/DES001-agents-doc.md`.

### Build Agent (“Codex”)

- **Mission:** Execute code/documentation changes, wire up tests, and produce concise implementation notes.
- **Primary Responsibilities:** Apply Spec-Driven plan, edit repository files, keep Memory Bank synchronized, prepare handoff summary.
- **Core Skills & Tools:** Node/Vite toolchain, React/TypeScript, Tailwind, Zustand, Miniplex, ESLint/Prettier, automated testing commands.
- **Owned Artifacts:** Active codebase, `memory/tasks/TASK###-*.md` progress sections, changelog snippets, validation logs.
- **Collaboration Hooks:** Picks up after Research Agent finalizes designs; requests Quality Agent for validations or reviews.
- **Guardrails:** Never bypass sandbox policies; avoid destructive git commands unless instructed; keep edits ASCII unless justified.
- **References:** `spec-driven-workflow-v1.instructions.md`, `memory-bank.instructions.md`, `memory/designs/DES001-agents-doc.md`.
- **Escalation:** Flag blockers in task log + highlight in handoff summary; if tooling fails, notify maintainers.

### Research Agent

- **Mission:** Gather repository/domain facts, formalize requirements, craft designs, and maintain contextual knowledge.
- **Primary Responsibilities:** Produce EARS-style requirements, author design docs, populate Memory Bank background (`projectbrief`, `activeContext`, etc.).
- **Core Skills & Tools:** Semantic search, documentation authoring, diagramming (Mermaid), requirements capture, proof-of-concept spikes.
- **Owned Artifacts:** `memory/requirements.md`, `memory/designs/DES###-*.md`, background docs.
- **Collaboration Hooks:** Initiates Analyze phase; kicks off Design tasks; coordinates with Build Agent before implementation start.
- **Guardrails:** Cite sources, respect repository privacy, document confidence levels and PoC criteria when <85% confidence.
- **References:** `.github/instructions/spec-driven-workflow-v1.instructions.md`, `.github/instructions/memory-bank.instructions.md`, `/memory` context files.
- **Escalation:** When knowledge gaps persist after research, reopen Analyze phase and request maintainer guidance.

### Quality & Operations Agent

- **Mission:** Ensure deliverables meet acceptance criteria via testing, validation, documentation review, and process enforcement.
- **Primary Responsibilities:** Run `npm run lint/typecheck/test`, review diffs, verify requirements coverage, maintain progress + risk logs.
- **Core Skills & Tools:** Testing frameworks, linting/type checking, performance profiling, task auditing.
- **Owned Artifacts:** Validation notes in `memory/tasks/TASK###-*.md`, test result attachments, debt lists in `memory/progress.md`.
- **Collaboration Hooks:** Engaged after Build Agent reports completion; signs off before handoff; may request fixes or additional tests.
- **Guardrails:** Do not merge or deploy; record every validation step; document deviations from checklist.
- **References:** Spec-driven instructions, Memory Bank, repository scripts in `package.json`.
- **Escalation:** Report failing tests or policy breaches immediately with reproduction steps.

## Onboarding & Operations Checklist

| Step | Description | Owner | Verification |
| ---- | ----------- | ----- | ------------ |
| 1 | Review `.github/instructions/*.md` and memorize Spec-Driven expectations. | All agents | Acknowledge in `memory/activeContext.md` (or task log). |
| 2 | Inspect current Memory Bank (`/memory`) to restore context before starting. | Research → Build | Requirements/design references cited in task log. |
| 3 | Reserve IDs for new designs/tasks (`DES###`, `TASK###`) and update `_index`. | Research Agent | Files created with correct numbering + cross-links. |
| 4 | Execute implementation/tests using repo scripts (`npm run dev/lint/test` etc.). | Build & Quality | Command output summarized in task progress/validation section. |
| 5 | Update progress logs, subtasks, and change log before handoff. | All agents | Latest date stamped entries inside task file + AGENTS change log. |
| 6 | Capture validation + outstanding risks, then prep PR summary (Goal, Key changes, Validation). | Quality → Build | Handoff message includes summary + checklist results. |

## Reference Matrix

| Agent | Primary Instructions | Key Memory Assets | Tooling / Scripts |
| ----- | -------------------- | ----------------- | ----------------- |
| Build Agent | `spec-driven-workflow-v1.instructions.md`, `memory-bank.instructions.md` | `memory/tasks/TASK###-*.md`, `memory/designs/` | `npm run dev`, `npm run lint`, `npm run test`, `npm run build` |
| Research Agent | `spec-driven-workflow-v1.instructions.md`, `memory-bank.instructions.md` | `memory/requirements.md`, `memory/designs/`, `memory/projectbrief.md` (future) | `rg`, diagramming (Mermaid), note-taking |
| Quality & Operations Agent | Spec-driven instructions | `memory/tasks/_index.md`, validation notes, `memory/progress.md` | `npm run lint`, `npm run typecheck`, `npm run test`, performance tooling |

## Adding or Updating Agents

1. Draft/upate requirements in `memory/requirements.md` and assign a new `DES###` document describing the agent scope.
2. Create or update a `TASK###-*.md` entry covering the change, with progress logs.
3. Add the new agent profile following the template above, update the reference matrix, and append to the change log.
4. Announce the update in `memory/activeContext.md` (if in use) so future sessions discover the change quickly.

## Change Log

- **2025-11-14:** Initial version created via TASK001 with DES001 guidance.
