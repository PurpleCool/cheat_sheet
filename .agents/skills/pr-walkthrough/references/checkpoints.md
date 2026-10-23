# Local checkpoints

Use the Python standard-library helper [checkpoint.py](../scripts/checkpoint.py). It stores one small JSON document per repository/PR under `${XDG_STATE_HOME:-$HOME/.local/state}/codex/pr-walkthrough/`. No state belongs in the checkout, `.git`, skill directory, or `.gitignore`.

## Identity and access

Use the canonical PR URL as `--pr` when available; this includes provider, repository, and number. Before a PR exists use `branch:<branch-name>` and clearly label that fallback. Do not invent a PR number. Repository identity comes from the canonical Git common directory, so linked worktrees share a PR checkpoint while different clones remain separate.

On first use run:

```sh
python3 .agents/skills/pr-walkthrough/scripts/checkpoint.py probe --repo "$PWD"
```

The probe actually creates, reads, and removes a unique temporary file in the chosen directory; it creates no session. Filesystem ownership alone does not prove the Codex sandbox allows writing. If the probe is denied, use the client's narrow approval mechanism for that command/directory and report the restriction. Never disable sandboxing, change global configuration or permissions, silently fall back inside the repository, or claim persistence succeeded. If access remains denied, explicitly report that progress can only remain in the conversation until access is resolved.

## Load and save

Here `PR_ID` is the established identifier and `BASE_REF` the actual PR target ref (not the feature branch upstream):

```sh
python3 .agents/skills/pr-walkthrough/scripts/checkpoint.py path --repo "$PWD" --pr "$PR_ID"
python3 .agents/skills/pr-walkthrough/scripts/checkpoint.py load --repo "$PWD" --pr "$PR_ID" --base "$BASE_REF"
python3 .agents/skills/pr-walkthrough/scripts/checkpoint.py save --repo "$PWD" --pr "$PR_ID" --base "$BASE_REF" --input /tmp/walkthrough-update.json
```

The input may also come from stdin with `--input -`. Any temporary input must stay outside the repository and be removed after saving. The helper adds PR/repository identity, current branch, base ref and resolved target revision, merge-base revision, HEAD, a working-tree fingerprint, and timestamp. It performs no Git mutations. Updates are atomic.

Agent-authored input has this shape; keep strings concise:

```json
{
  "blocks": [{
    "id": "1",
    "title": "Build foundation",
    "status": "IN_PROGRESS",
    "position": "vite.config.ts:4 — shared build/test configuration",
    "decisions": [],
    "open_questions": ["Should build configuration join typecheck?"],
    "agreed_changes": [],
    "completed_changes": [],
    "commits": [],
    "verification": []
  }],
  "current_block": "1",
  "completed": false
}
```

The optional `position` is a short file/line or discussion anchor within a partially covered block. Record decisions as `{ "text": "Keep node_modules", "evidence": "Human: keep node_modules" }`; only an actual explicit confirmation supports acceptance. Store agreed changes separately from completed ones, commit SHAs in `commits`, and verification as `{ "check": "corepack yarn test", "result": "PASSED", "evidence": "10 tests; candidate <sha or fingerprint>" }`. The helper validates structure, not the truth of approvals or check results; that remains the agent's responsibility.

Save after the map/current position changes, explicit decisions, deferral, implementation, verification, or commit. Never save full reports, source excerpts, conversation history, secrets, or speculative approvals. Update the existing document rather than creating a history log.

## Resume and reconcile

`load` returns the unchanged checkpoint plus a `drift` list comparing saved Git state with the current state, including dirty/untracked file contents. `save` refuses to overwrite Git drift unless passed `--reconcile`. Use that flag only after the human resolves unexplained differences, or to record changes just performed within this session's explicit approval. The flag never supplies approval by itself. Before overwriting a checkpoint or using its approvals:

1. Check identity, branch, base ref/target revision/merge-base, HEAD, working-tree drift, and whether recorded commits still exist and belong to the current history. Local refs may be stale; state that when relevant.
2. Distinguish changes just performed and verified by this agent from unexplained changes since the checkpoint. For unexplained drift inspect the affected diff, present the contradiction, and clarify which decisions still apply before carrying out or committing any saved change. Unaffected historical decisions remain records, not blanket approval of new code.
3. Do not silently save over the old snapshot merely to clear drift. A corrupt/unsupported checkpoint is an error to resolve, not a reason to discard it and manufacture approvals.
4. Resume the recorded block and position. An interrupted `IMPLEMENTING` or `VERIFIED` status does not prove work completed, checks remain valid, or a commit exists. Reconcile first; do not duplicate commits.

If a branch is renamed or a local branch identifier later acquires a PR URL, explicitly reconcile the old identity before adopting a new checkpoint. Do not automatically transfer approvals between sessions.

## Finish and clean up

Keep deferred/blocked work until the human resolves it. Set `completed: true` and `current_block: null` only after all blocks are explicitly accepted (`APPROVED`) or their approved changes are `COMMITTED`, with no unresolved questions. Completion of this walkthrough does not approve a merge.

Cleanup is a separate explicit request for this checkpoint:

```sh
python3 .agents/skills/pr-walkthrough/scripts/checkpoint.py delete --repo "$PWD" --pr "$PR_ID" --confirm-complete
```

The helper must refuse unfinished checkpoints, including deferred sessions. There is no automatic expiry or bulk cleanup of active work. Deleting a completed checkpoint removes its local progress record; it does not affect Git or commits.
