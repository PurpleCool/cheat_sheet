#!/usr/bin/env python3
"""Store compact walkthrough checkpoints outside the repository (stdlib only)."""

import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
import tempfile


STATUSES = frozenset({
    "IN_PROGRESS", "APPROVED", "CHANGES_REQUESTED", "IMPLEMENTING",
    "VERIFIED", "COMMITTED", "DEFERRED", "BLOCKED",
})
INPUT_FIELDS = {"blocks", "current_block", "completed"}
BLOCK_FIELDS = {
    "id", "title", "status", "decisions", "open_questions", "agreed_changes",
    "completed_changes", "commits", "verification",
}
GIT_FIELDS = {"branch", "base_ref", "base_revision", "merge_base", "head", "worktree_fingerprint"}
GENERATED_FIELDS = {"version", "pr_id", "repo_id", "git", "updated_at"}


class CheckpointError(Exception):
    pass


def fields(value, expected, label, optional=()):
    if (not isinstance(value, dict) or not expected.issubset(value)
            or set(value) - expected - set(optional)):
        suffix = f"; optional: {', '.join(optional)}" if optional else ""
        raise CheckpointError(f"{label}: expected {', '.join(sorted(expected))}{suffix}")


def string(value, label):
    if not isinstance(value, str) or not value.strip():
        raise CheckpointError(f"{label}: expected a nonempty string")


def string_list(value, label):
    if not isinstance(value, list):
        raise CheckpointError(f"{label}: expected an array")
    for item in value:
        string(item, label)


def validate_progress(data):
    fields(data, INPUT_FIELDS, "progress")
    if not isinstance(data["blocks"], list) or type(data["completed"]) is not bool:
        raise CheckpointError("blocks must be an array and completed a boolean")
    ids = set()
    for block in data["blocks"]:
        fields(block, BLOCK_FIELDS, "block", optional=("position",))
        for key in ("id", "title", "status"):
            string(block[key], key)
        if "position" in block:
            string(block["position"], "position")
        if block["id"] in ids or block["status"] not in STATUSES:
            raise CheckpointError("block ids must be unique and statuses supported")
        ids.add(block["id"])
        for key in ("open_questions", "agreed_changes", "completed_changes", "commits"):
            string_list(block[key], key)
        for key, keys in (("decisions", {"text", "evidence"}),
                          ("verification", {"check", "result", "evidence"})):
            if not isinstance(block[key], list):
                raise CheckpointError(f"{key}: expected an array")
            for item in block[key]:
                fields(item, keys, key)
                for field in keys:
                    string(item[field], field)
    current = data["current_block"]
    if current is not None and (not isinstance(current, str) or current not in ids):
        raise CheckpointError("current_block must be null or an existing block id")


def git(repo, *args):
    env = dict(os.environ, GIT_OPTIONAL_LOCKS="0")
    result = subprocess.run(
        ["git", "--no-pager", "-c", "core.fsmonitor=false", "-C", str(repo), *args],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env, check=False,
    )
    if result.returncode:
        # Do not echo Git diagnostics, which can contain arbitrary file contents.
        raise CheckpointError(f"Git query {args[0]} failed (exit {result.returncode})")
    return result.stdout


def digest_parts(*parts):
    digest = hashlib.sha256()
    for part in parts:
        digest.update(len(part).to_bytes(8, "big"))
        digest.update(part)
    return digest.hexdigest()


def worktree_fingerprint(root):
    """Hash index entries and file bytes, never emitting source or secret text."""
    digest = hashlib.sha256()

    def add(value):
        digest.update(len(value).to_bytes(8, "big"))
        digest.update(value)

    add(git(root, "ls-files", "--stage", "-z"))
    paths = git(root, "ls-files", "--cached", "--others", "--exclude-standard", "-z")
    for name in sorted(set(paths.split(b"\0")) - {b""}):
        add(name)
        path = root / os.fsdecode(name)
        try:
            mode = path.lstat().st_mode
        except FileNotFoundError:
            add(b"missing")
            continue
        add(str(stat.S_IFMT(mode)).encode())
        add(str(mode & 0o111).encode())
        if stat.S_ISLNK(mode):
            add(os.fsencode(os.readlink(path)))
        elif stat.S_ISREG(mode):
            content = hashlib.sha256()
            with path.open("rb") as stream:
                for chunk in iter(lambda: stream.read(65536), b""):
                    content.update(chunk)
            add(content.digest())
        elif stat.S_ISDIR(mode):
            # Initialized submodules/nested Git worktrees are directory entries.
            if (path / ".git").exists():
                add(git(path, "rev-parse", "--verify", "HEAD").strip())
                add(worktree_fingerprint(path).encode())
        else:
            raise CheckpointError("Unsupported special file in the working tree")
    return digest.hexdigest()


class Store:
    def __init__(self, repo):
        self.repo = Path(os.fsdecode(git(repo, "rev-parse", "--show-toplevel")).strip()).resolve()
        self.common = Path(os.fsdecode(git(
            self.repo, "rev-parse", "--path-format=absolute", "--git-common-dir",
        )).strip()).resolve()
        self.repo_id = digest_parts(os.fsencode(self.common))
        xdg = os.environ.get("XDG_STATE_HOME")
        state = Path(xdg) if xdg else Path.home() / ".local" / "state"
        if not state.is_absolute():
            raise CheckpointError("XDG_STATE_HOME must be absolute")
        self.root = (state / "codex" / "pr-walkthrough").resolve()
        worktrees = git(self.repo, "worktree", "list", "--porcelain", "-z").split(b"\0")
        forbidden = [self.repo, self.common]
        forbidden.extend(Path(os.fsdecode(line[9:])).resolve()
                         for line in worktrees if line.startswith(b"worktree "))
        if any(self.root.is_relative_to(path) for path in forbidden):
            raise CheckpointError("Checkpoint storage must resolve outside the repository")

    def path(self, pr_id):
        string(pr_id, "pr_id")
        key = digest_parts(os.fsencode(self.common), pr_id.encode("utf-8"))
        return self.root / f"{key}.json"

    def ensure_root(self):
        missing = []
        parent = self.root
        while not parent.exists():
            missing.append(parent)
            parent = parent.parent
        for directory in reversed(missing):
            directory.mkdir(mode=0o700, exist_ok=True)
        if not self.root.is_dir():
            raise CheckpointError("Checkpoint storage is not a directory")

    def snapshot(self, base):
        string(base, "base")
        if base.startswith("-"):
            raise CheckpointError("base cannot be a Git option")
        head = git(self.repo, "rev-parse", "--verify", "HEAD^{commit}").decode().strip()
        branch = git(self.repo, "rev-parse", "--abbrev-ref", "HEAD").decode().strip()
        base_commit = git(self.repo, "rev-parse", "--verify", f"{base}^{{commit}}").decode().strip()
        return {
            "branch": None if branch == "HEAD" else branch,
            "base_ref": base,
            "base_revision": base_commit,
            "merge_base": git(self.repo, "merge-base", head, base_commit).decode().strip(),
            "head": head,
            "worktree_fingerprint": worktree_fingerprint(self.repo),
        }

    def read(self, pr_id):
        path = self.path(pr_id)
        if path.is_symlink():
            raise CheckpointError("Checkpoint file cannot be a symlink")
        data = read_json(path)
        fields(data, INPUT_FIELDS | GENERATED_FIELDS, "checkpoint")
        if type(data["version"]) is not int or data["version"] != 1:
            raise CheckpointError("Unsupported checkpoint version")
        if data["pr_id"] != pr_id or data["repo_id"] != self.repo_id:
            raise CheckpointError("Checkpoint identity mismatch")
        string(data["updated_at"], "updated_at")
        fields(data["git"], GIT_FIELDS, "git")
        for key in GIT_FIELDS - {"branch"}:
            string(data["git"][key], key)
        if data["git"]["branch"] is not None:
            string(data["git"]["branch"], "branch")
        validate_progress({key: data[key] for key in INPUT_FIELDS})
        return data

    def probe(self):
        self.ensure_root()
        fd, name = tempfile.mkstemp(prefix=".probe-", dir=self.root)
        path = Path(name)
        try:
            with os.fdopen(fd, "wb") as stream:
                stream.write(b"pr-walkthrough probe\n")
            if path.read_bytes() != b"pr-walkthrough probe\n":
                raise CheckpointError("Storage probe read-back failed")
        finally:
            path.unlink(missing_ok=True)
        return {"root": str(self.root), "writable": True}

    def save(self, pr_id, base, progress, reconcile=False):
        validate_progress(progress)
        path = self.path(pr_id)
        snapshot = self.snapshot(base)
        if path.exists() or path.is_symlink():
            saved = self.read(pr_id)  # Never replace corrupt, incompatible, or foreign state.
            if saved["git"] != snapshot and not reconcile:
                raise CheckpointError("Git drift detected; load and reconcile before save (--reconcile)")
        data = dict(progress, version=1, pr_id=pr_id, repo_id=self.repo_id,
                    git=snapshot, updated_at=datetime.now(timezone.utc).isoformat())
        self.ensure_root()
        fd, name = tempfile.mkstemp(prefix=".checkpoint-", suffix=".tmp", dir=self.root)
        temporary = Path(name)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as stream:
                json.dump(data, stream, ensure_ascii=False, indent=2, allow_nan=False)
                stream.write("\n")
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, path)
        finally:
            temporary.unlink(missing_ok=True)
        return {"path": str(path)}

    def load(self, pr_id, base):
        data = self.read(pr_id)
        current = self.snapshot(base)
        drift = [{"field": key, "saved": data["git"][key], "current": current[key]}
                 for key in sorted(GIT_FIELDS) if data["git"][key] != current[key]]
        return {"checkpoint": data, "drift": drift}

    def delete(self, pr_id, confirm_complete=False):
        if not confirm_complete:
            raise CheckpointError("Deletion requires --confirm-complete")
        data = self.read(pr_id)
        if (not data["completed"] or data["current_block"] is not None
                or any(block["open_questions"] or block["status"] not in {"APPROVED", "COMMITTED"}
                       for block in data["blocks"])):
            raise CheckpointError("Checkpoint is not fully completed; deletion refused")
        path = self.path(pr_id)
        path.unlink()
        return {"deleted": str(path)}


def read_json(path):
    try:
        if path == "-":
            return json.load(sys.stdin)
        with Path(path).open(encoding="utf-8") as stream:
            return json.load(stream)
    except (ValueError, UnicodeError):
        raise CheckpointError("Invalid checkpoint JSON") from None


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ("probe", "path", "save", "load", "delete"):
        command = commands.add_parser(name)
        command.add_argument("--repo", required=True)
        if name != "probe":
            command.add_argument("--pr", required=True)
        if name in {"save", "load"}:
            command.add_argument("--base", required=True)
        if name == "save":
            command.add_argument("--input", required=True, help="Compact progress JSON file, or - for stdin")
            command.add_argument("--reconcile", action="store_true",
                                 help="Explicitly acknowledge Git drift after inspecting load output")
        if name == "delete":
            command.add_argument("--confirm-complete", action="store_true")
    args = parser.parse_args(argv)
    try:
        store = Store(args.repo)
        if args.command == "probe":
            result = store.probe()
        elif args.command == "path":
            result = {"path": str(store.path(args.pr))}
        elif args.command == "save":
            result = store.save(args.pr, args.base, read_json(args.input), args.reconcile)
        elif args.command == "load":
            result = store.load(args.pr, args.base)
        else:
            result = store.delete(args.pr, args.confirm_complete)
        print(json.dumps(result, ensure_ascii=False))
        return 0
    except (CheckpointError, OSError, UnicodeError) as error:
        print(json.dumps({"error": str(error)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
