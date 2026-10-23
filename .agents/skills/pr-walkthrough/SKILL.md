---
name: pr-walkthrough
description: Guide incremental PR or branch walkthroughs for an experienced engineer, with discussion, explicit approval, local progress, and reviewed implementation of agreed changes. Use to understand and decide on changes or resume a walkthrough; technical review uses review-loop.
---

# PR Walkthrough

Explain and discuss one semantic block at a time. Discussion is read-only for product code and Git; checkpoint writes are allowed. Explicit approval of concrete changes authorizes their scoped implementation, independent review, verification, and local commits. Approval of a block is separate from final PR acceptance or merge.

## Establish or resume the change set

- Read applicable repository instructions and inspect the current branch and working tree.
- Determine the actual PR base from explicit user input or trustworthy PR metadata. A feature branch's upstream is not necessarily its PR base. Otherwise infer the likely base from repository history and merge-base evidence; state the inference and the limits of locally cached refs. Ask when competing bases materially change the walkthrough.
- Analyze committed changes from the merge-base through `HEAD`, plus staged, unstaged, and relevant untracked changes. Keep unrelated user work visibly separate.
- Read enough surrounding code, tests, configuration, and history to explain relationships rather than merely paraphrasing the diff.
- Read [checkpoint instructions](references/checkpoints.md) and load this PR's local checkpoint before planning blocks. Reconcile identity and Git drift before acting on saved approvals. Never infer a missing approval from a commit, clean tree, or test result.
- Reuse the existing block map and current position from a prior walkthrough. If there is no checkpoint, use explicit conversation evidence when available; otherwise start a new map without inventing earlier decisions.

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

## Discuss and decide incrementally

On a new walkthrough, first show a short map with base and scope; let the human choose the starting block. On resume, continue the current block. Explain at most one block per response, highlight concrete places to inspect, then stop for questions. Allow unlimited discussion turns. Do not repeat the full report or move on without an explicit navigation command.

Track each block with these statuses:

| Status | Meaning |
| --- | --- |
| `IN_PROGRESS` | Pending or under discussion; `current_block` selects the active block. |
| `APPROVED` | Explicitly accepted without changes. |
| `CHANGES_REQUESTED` | Concrete changes explicitly agreed by the human. |
| `IMPLEMENTING` | Performing the agreed changes. |
| `VERIFIED` | Implementation, independent review, and required checks succeeded. |
| `COMMITTED` | Verified changes committed locally. |
| `DEFERRED` | Explicitly postponed with open questions retained. |
| `BLOCKED` | A failure, conflict, or material decision prevents progress. |

Interpret natural-language controls in context:

- **«дальше» / «вернёмся к блоку 2»**: navigate only; retain the previous block's status and unresolved questions. Navigation does not approve or defer it.
- **«принимаю»**: accept current decisions as `APPROVED` if no change is pending. If it explicitly approves a clearly scoped proposed change, record `CHANGES_REQUESTED` and perform the approved-change flow below. Ambiguous assent needs clarification.
- **«исправь и закоммить»**: perform only concrete agreed changes; ask what to change if the scope is missing.
- **«отложим»**: record `DEFERRED` and the unresolved questions; stay until explicitly asked to navigate.
- **«статус»**: show compact progress, without implementation or navigation.
- **«продолжим walkthrough»**: load, reconcile with Git, and resume the checkpoint.

Questions, alternatives, corrections to an explanation, and silence are not authorization to edit. Record short evidence of explicit approval with each accepted decision. New or broader changes require their own approval. Flag likely defects for discussion; implementation still needs a concrete agreed scope.

## Apply an explicitly approved change

No additional implementation or local-commit confirmation is needed once the human explicitly approves concrete changes in this workflow.

1. Save `CHANGES_REQUESTED`, exact scope, and approval evidence. Inspect Git again; set `IMPLEMENTING` and implement only that scope.
2. Invoke the existing [$review-loop](../review-loop/SKILL.md), supplying the actual PR base, full diff including working changes, and approved fix boundaries. Preserve its independent read-only Reviewer, Developer, maximum three rounds, and escalation rules. Findings outside approved scope stay visible and require a human decision; they must not silently expand implementation.
3. Run relevant repository checks, including required typecheck, tests, build, and focused checks for config files outside the project typecheck. Fix in-scope failures and recheck. Unresolved findings, failed checks, unavailable independent review, or scope-changing fixes mean `BLOCKED`; do not commit.
4. After successful review and verification of the actual candidate, record `VERIFIED`. Read [commit strategy](references/commits.md) and commit only the approved changes. Preserve unrelated work and previously staged changes.
5. Verify the resulting commit and tree, then record `COMMITTED`, commit IDs, and check results. If checks confirm the approved outcome is already satisfied and no patch is needed, record `APPROVED` for that scope with the no-op explanation and verification evidence; do not claim changes were made or create an empty commit. A failed commit attempt means `BLOCKED`, retaining successful check evidence for a later retry.

Stay on this block after approval, implementation, or commit until the human explicitly requests another block. Do not push, merge, create a PR, rebase, reset, or force-push automatically.

## Persist and report progress

Save a minimal checkpoint after material decisions and transitions, following [checkpoint instructions](references/checkpoints.md). All state lives under `${XDG_STATE_HOME:-$HOME/.local/state}/codex/pr-walkthrough/`; never put state in the repository or edit `.gitignore` for it.

End each interaction with a short footer: current block/status, new decisions, agreed/completed changes, commits, and open questions. Omit unchanged explanations. At completion summarize accepted decisions and unresolved/deferred matters; acceptance and merge remain human decisions. Offer explicit cleanup of completed checkpoints and never delete unfinished sessions automatically.
