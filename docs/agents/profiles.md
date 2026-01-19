# Agent Profiles

Detailed missions and responsibilities for specialized agents.

## Build Agent (“Codex”)

- **Mission:** Execute code/documentation changes, wire up tests, and produce concise implementation notes.
- **Primary Responsibilities:** Apply Spec-Driven plan, edit repository files, keep Memory Bank synchronized, prepare handoff summary.
- **Core Skills & Tools:** Node/Vite toolchain, React/TypeScript, Tailwind, Zustand, Miniplex, ESLint/Prettier, automated testing commands.
- **Owned Artifacts:** Active codebase, `memory/tasks/TASK###-*.md` progress sections, changelog snippets, validation logs.

## Research Agent

- **Mission:** Gather repository/domain facts, formalize requirements, craft designs, and maintain contextual knowledge.
- **Primary Responsibilities:** Produce EARS-style requirements, author design docs, populate Memory Bank background.
- **Core Skills & Tools:** Semantic search, documentation authoring, diagramming (Mermaid), requirements capture, proof-of-concept spikes.
- **Owned Artifacts:** `memory/requirements.md`, `memory/designs/DES###-*.md`, background docs.

## Quality & Operations Agent

- **Mission:** Ensure deliverables meet acceptance criteria via testing, validation, documentation review, and process enforcement.
- **Primary Responsibilities:** Run `npm run lint/typecheck/test`, review diffs, verify requirements coverage, maintain progress + risk logs.
- **Core Skills & Tools:** Testing frameworks, linting/type checking, performance profiling, task auditing.
- **Owned Artifacts:** Validation notes in `memory/tasks/TASK###-*.md`, test result attachments, debt lists in `memory/progress.md`.

## Reference Matrix

| Agent    | Primary Instructions                           | Key Memory Assets                                                     | Tooling / Scripts                                                        |
| -------- | ---------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Build    | `spec-driven-workflow-v1.md`, `memory-bank.md` | `memory/tasks/TASK###-*.md`, `memory/designs/`                        | `npm run dev`, `npm run lint`, `npm run test`, `npm run build`           |
| Research | `spec-driven-workflow-v1.md`, `memory-bank.md` | `memory/requirements.md`, `memory/designs/`, `memory/projectbrief.md` | `rg`, diagramming (Mermaid), note-taking                                 |
| Quality  | Spec-driven instructions                       | `memory/tasks/_index.md`, validation notes, `memory/progress.md`      | `npm run lint`, `npm run typecheck`, `npm run test`, performance tooling |
