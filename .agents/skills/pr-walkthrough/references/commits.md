# Local commit strategy

Read this before committing an approved walkthrough change. The approval covers implementation and local commits for that concrete scope; it does not authorize altering unrelated changes or publishing anything.

## Inspect before choosing

Inspect the current branch, HEAD, recent history, staged and unstaged diffs, untracked paths, and available remote refs. Record which changes were already present before implementation. Reinspect immediately before committing for concurrent user edits.

- Prefer a separate commit for an independent change. Combine only changes that form one coherent, independently testable unit.
- Use `--amend` only for the latest commit when the approved work logically extends it **and** reliable evidence proves it is local and unpublished. Existing local tracking refs are not proof if they may be stale. Use read-only remote metadata when authorized/available; if publication is uncertain, create a new commit.
- Never amend a commit known to be published, an earlier commit, or unrelated user work. No rebase, reset, force push, push, or merge without separate authorization.

## Preserve the index and working tree

- Do not use `git add .`, `git add -A`, or a plain commit that consumes a pre-existing unrelated index.
- When approved files contain only approved changes and pre-existing staged files are disjoint, a path-limited `git commit --only -- <approved paths>` can leave those other staged changes intact. Inspect the exact candidate and resulting commit; a path-limited commit still takes **all** working changes in those files.
- When a file contains mixed approved and unrelated edits, isolate the approved hunks without altering existing staged work. If that cannot be done confidently, mark `BLOCKED` and explain the overlap rather than committing unrelated content or stashing/resetting it away.
- Never include checkpoints, generated output, or extra review fixes that were not agreed. Do not create an empty commit when the proposal is already satisfied.

Checks and independent review must cover the candidate that will actually be committed. If isolation produces a candidate different from the tested working tree, verify that candidate in a temporary checkout before committing. A new failure stops the commit.

Afterward inspect the commit's file list and diff, and confirm unrelated working/index changes are preserved. Record the SHA and explain the structure in one or two sentences. A failed commit attempt means `BLOCKED`; retain the successful verification evidence and diagnose the failure before retrying. It is not `COMMITTED` until a commit exists. A verified no-op can return to `APPROVED` for the explicitly approved outcome, without inventing a commit or completed code change.
