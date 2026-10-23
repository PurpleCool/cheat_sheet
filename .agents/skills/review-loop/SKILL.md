---
name: review-loop
description: Run an independent multi-agent code review and fix loop. Use for "review loop", "цикл ревью", code review with fixes, or explicit $review-loop invocation.
---

# Review & Fix Loop

Coordinate two independent subagents:

- **Reviewer**: read-only code review. Never modifies files.
- **Developer**: implements fixes and runs validation.

You are the orchestrator. Do not substitute your own review for an actual independent Reviewer subagent.

## 1. Establish scope

- Compare the working branch against its merge-base with `main`, unless another base is specified.
- Include committed, staged, unstaged and relevant untracked changes.
- Preserve unrelated user modifications.
- Read project instructions and identify available validation commands.
- If subagents are unavailable, report this and stop rather than pretending to use them.

## 2. Independent review

Start Reviewer and ask it to examine the full change set.

Prioritize:
- P0: Critical failures, security or data-loss risks.
- P1: Functional regressions, broken contracts or serious bugs.
- P2: Meaningful maintainability, accessibility, performance or test-coverage issues.

For frontend projects, also check:
- React rendering, hooks, effects and state management.
- TypeScript correctness and unsafe type assertions.
- Dependency compatibility and configuration.
- Routing, user interactions and accessibility.
- Build, deployment and runtime behavior.
- Missing tests and weak assertions.

Each finding must contain:
- Priority and file/line reference.
- Concrete problem and impact.
- Evidence or reproduction steps when possible.
- Proposed fix.

Avoid speculative and purely stylistic findings.

## 3. Fix and validate

Send actionable findings to Developer.

Developer must:
- Verify the reported problem.
- Apply the smallest justified fix.
- Add or update tests where appropriate.
- Run relevant typecheck, tests, lint and build.
- Report any rejected findings with reasoning.

Do not disable checks, weaken tests or suppress errors just to obtain a passing result.

## 4. Repeat

Run at most 3 review rounds.

After each fix round, Reviewer must inspect the updated FULL diff, not only the latest patch.

Stop early when:
- No actionable P0/P1/P2 findings remain.
- Required validation passes.

Stop and escalate when:
- 3 rounds have been completed.
- The same issue persists without progress.
- Agents fundamentally disagree.
- A fix requires a significant architectural decision.
- New regressions repeatedly appear.

Never loop indefinitely.

## 5. Safety

- Only Developer may modify code.
- Reviewer and Developer must not edit files concurrently.
- Do not push, merge, create PRs or deploy.
- Do not delete unrelated changes.
- Do not introduce unrelated refactoring.
- Do not claim checks passed unless executed.

## 6. Final report

Provide a concise summary containing:

1. Number of review rounds.
2. Findings discovered and resolved.
3. Remaining findings and disagreements.
4. Tests, typecheck, lint and build results.
5. Final status: READY FOR HUMAN REVIEW or NEEDS ATTENTION.

Even READY FOR HUMAN REVIEW does not mean the code is guaranteed bug-free.
