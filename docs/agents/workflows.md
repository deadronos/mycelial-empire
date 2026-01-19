# Collaboration Workflows

Shared guide for collaboration and task execution within `mycelial-empire`.

## Spec-Driven Loop Ownership

| Phase     | Primary Owner                | Supporting Roles | Key Outputs                                                       |
| --------- | ---------------------------- | ---------------- | ----------------------------------------------------------------- |
| Analyze   | Research Agent               | Build Agent      | Requirements (EARS), context notes                                |
| Design    | Research Agent → Build Agent | Quality Agent    | Design docs (`memory/designs`), task definitions (`memory/tasks`) |
| Implement | Build Agent                  | Research Agent   | Code/doc changes, updated subtasks                                |
| Validate  | Quality Agent                | Build Agent      | Test runs, lint/typecheck artifacts, performance notes            |
| Reflect   | Quality Agent                | Research Agent   | Tech debt log, documentation updates, progress summaries          |
| Handoff   | Build Agent                  | Quality Agent    | PR summary, changelog, artifacts attachment                       |

## Handoff Triggers

1. **Analyze → Design:** Requirements approved + confidence score recorded.
2. **Design → Implement:** Design + tasks committed to Memory Bank (`DES###`, `TASK###`).
3. **Implement → Validate:** Implementation finished or ready for review, tests defined.
4. **Validate → Reflect/Handoff:** Validation logs captured, outstanding risks noted.

All agents annotate progress in `memory/tasks/_index.md` and the relevant `TASK` file before passing ownership.

## Onboarding & Operations Checklist

| Step | Description                                                                                   | Owner            | Verification                                                   |
| ---- | --------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------- |
| 1    | Review `.github/instructions/*.md` and memorize Spec-Driven expectations.                     | All agents       | Acknowledge in `memory/activeContext.md` (or task log).        |
| 2    | Inspect current Memory Bank (`/memory`) to restore context before starting.                   | Research → Build | Requirements/design references cited in task log.              |
| 3    | Reserve IDs for new designs/tasks (`DES###`, `TASK###`) and update `_index`.                  | Research Agent   | Files created with correct numbering + cross-links.            |
| 4    | Execute implementation/tests using repo scripts (`npm run dev/lint/test` etc.).               | Build & Quality  | Command output summarized in task progress/validation section. |
| 5    | Update progress logs, subtasks, and change log before handoff.                                | All agents       | Latest date stamped entries inside task file.                  |
| 6    | Capture validation + outstanding risks, then prep PR summary (Goal, Key changes, Validation). | Quality → Build  | Handoff message includes summary + checklist results.          |

## Adding or Updating Agents

1. Draft/update requirements in `memory/requirements.md` and assign a new `DES###` document describing the agent scope.
2. Create or update a `TASK###-*.md` entry covering the change, with progress logs.
3. Add the new agent profile in [profiles.md](./profiles.md), update the reference matrix, and append to the `AGENTS.md` change log.
4. Announce the update in `memory/activeContext.md` (if in use) so future sessions discover the change quickly.
