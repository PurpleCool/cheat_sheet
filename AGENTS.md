# Repository Guidance

This is a React 19 and TypeScript learning application built with Vite and Yarn 4. Examples are both executable and displayed from the same source files; preserve that single-source design. Sandpack provides optional editable playgrounds.

## Working agreements

- Preserve user changes and keep patches scoped. Do not commit, push, merge, deploy, or remove functionality unless the user explicitly authorizes it.
- Use the package manager and runtime pinned by `package.json` and `.nvmrc`. Run commands from the repository root.
- For product changes, preserve routing, accessibility, lesson behavior, Netlify SPA support, and the executable/displayed source relationship.
- Prefer the smallest justified implementation. Escalate material architecture choices and unresolved incompatibilities to the human.

## Change lifecycle

1. **Implementation:** an implementation agent makes the scoped change and adds meaningful tests where appropriate.
2. **Independent code review:** a different, read-only Reviewer examines the full diff against the correct base. Use `$review-loop` when iterative review and fixes are requested.
3. **Review/fix loop:** the implementation agent fixes substantiated findings; an independent Reviewer checks the updated full diff. Keep the iteration limit and unresolved findings visible as defined by the review skill.
4. **Human walkthrough:** use `$pr-walkthrough` to discuss one semantic block at a time. Discussion is read-only; explicit approval of concrete changes authorizes their scoped implementation, independent review, verification, and local commits. Detailed approval and progress rules live in the skill; final PR acceptance remains human.
5. **Verification:** run `corepack yarn typecheck`, `corepack yarn test`, and `corepack yarn build`; add focused smoke checks when the change warrants them. Never claim an unexecuted check passed.
6. **Human approval:** only the human decides whether changes are accepted and merged.

Detailed review and walkthrough procedures belong in their skills, not in this file.
