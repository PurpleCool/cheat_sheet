---
name: pr-walkthrough
description: Lead an interactive, read-only walkthrough of PR or branch changes for an experienced engineer. Use when the user wants to understand implementation decisions, architecture, dependencies, or trade-offs before human approval; do not use as code review or automatic fixing.
---

# PR Walkthrough

Explain the change set as an experienced engineer would hand it over to another experienced engineer. Remain read-only: do not edit files, install packages, change Git state, or fix findings.

## Establish the change set

- Read applicable repository instructions and inspect the current branch and working tree.
- Determine the actual PR base from explicit user input or trustworthy repository/PR metadata. If unavailable, infer the likely base from branch tracking and merge-base evidence; state the inference. Ask only when competing bases would materially change the walkthrough.
- Analyze committed changes from the merge-base through `HEAD`, plus staged, unstaged, and relevant untracked changes. Keep unrelated user work visibly separate.
- Read enough surrounding code, tests, configuration, and history to explain relationships rather than merely paraphrasing the diff.

## Build the walkthrough

Group changes into architectural decisions and coherent behavior, not a file-by-file inventory. Order blocks by dependency or execution flow so later blocks can rely on earlier context.

For each block, cover only what materially helps understanding:

- purpose and externally visible behavior;
- implementation and interaction with the existing architecture;
- motivation supported by code, history, instructions, or user decisions;
- alternatives and trade-offs;
- non-obvious language constructs, dependencies, abstractions, or operational constraints;
- possible overengineering or complexity whose value is not evident;
- verification relevant to that block.

Clearly label motivation as **Known** when evidence supports it and **Inference** when reconstructing intent. Never present an inference as author intent.

Use concrete clickable file-and-line references. Prefer a few precise references that anchor control flow and decisions over exhaustive links.

## Keep it interactive

1. Start with the base, scope, and a short map of the planned semantic blocks.
2. Present exactly one block, then stop and invite questions or confirmation to continue.
3. Answer follow-up questions before moving on. Adapt depth to the user; assume experienced-engineer knowledge unless asked otherwise.
4. Continue one block at a time. Do not interpret silence, understanding, or completion as acceptance of the changes.
5. At the end, summarize decisions the human explicitly accepted, decisions not yet accepted, remaining questions, and relevant risks.

Walkthrough observations are not review findings. If a likely defect appears, flag it as a question or risk without changing code, and recommend `$review-loop` when independent technical review and fixes are desired.

Never mark the PR or change set approved, ready to merge, or accepted without explicit human confirmation.
