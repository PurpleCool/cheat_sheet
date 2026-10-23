"""Run with python3 -B -m unittest discover -s <scripts-dir> -v."""

import copy
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

import checkpoint


def block(status="IN_PROGRESS", identifier="foundation"):
    return {
        "id": identifier, "title": "Build foundation", "status": status,
        "decisions": [{"text": "Keep node-modules", "evidence": 'User: "оставляем node-modules"'}],
        "open_questions": [], "agreed_changes": [], "completed_changes": [],
        "commits": [], "verification": [],
    }


def progress(status="IN_PROGRESS"):
    return {"blocks": [block(status)], "current_block": "foundation", "completed": False}


class CheckpointTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="walkthrough-test-", dir="/tmp")
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.repo = self.root / "repo"
        self.repo.mkdir()
        self.state = self.root / "state"
        # Remove inherited Git overrides; fixtures must never address the real repository.
        env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
        env.update(XDG_STATE_HOME=str(self.state), GIT_CONFIG_NOSYSTEM="1",
                   GIT_CONFIG_GLOBAL=os.devnull, GIT_TERMINAL_PROMPT="0")
        self.environment = patch.dict(os.environ, env, clear=True)
        self.environment.start()
        self.addCleanup(self.environment.stop)
        self.git("init", "-b", "main")
        self.git("config", "user.name", "Checkpoint test")
        self.git("config", "user.email", "checkpoint@example.invalid")
        (self.repo / "source.txt").write_text("initial\n", encoding="utf-8")
        self.commit("initial")
        self.git("switch", "-c", "feature")
        self.store = checkpoint.Store(self.repo)
        self.pr = "https://example.invalid/project/pull/42"

    def git(self, *args, repo=None):
        result = subprocess.run(
            ["git", "-c", "core.hooksPath=/dev/null", "-C", str(repo or self.repo), *args],
            check=True, capture_output=True,
        )
        return result.stdout.decode().strip()

    def commit(self, title):
        self.git("add", "--all")
        self.git("commit", "-m", title)
        return self.git("rev-parse", "HEAD")

    def cli(self, *args, stdin=None, success=True):
        result = subprocess.run(
            [sys.executable, "-B", str(Path(checkpoint.__file__).resolve()),
             *args, "--repo", str(self.repo)],
            input=stdin, capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 0 if success else 1, result.stderr)
        return json.loads(result.stdout if success else result.stderr)

    def save(self, data=None, reconcile=False):
        self.store.save(self.pr, "main", data if data is not None else progress(), reconcile)
        return self.store.path(self.pr)

    def drift(self, base="main"):
        return {item["field"] for item in self.store.load(self.pr, base)["drift"]}

    def rewrite(self, data):
        self.store.path(self.pr).write_text(json.dumps(data), encoding="utf-8")

    def test_roundtrip_all_statuses_and_compact_fields(self):
        data = {
            "blocks": [block(status, str(i)) for i, status in enumerate(sorted(checkpoint.STATUSES))],
            "current_block": "0", "completed": False,
        }
        data["blocks"][0].update(
            position="vite.config.ts:4",
            open_questions=["Why this abstraction?"], agreed_changes=["Move module script"],
            completed_changes=["Moved module script"], commits=["abc123"],
            verification=[{"check": "typecheck", "result": "passed", "evidence": "exit 0"}],
        )
        path = self.save(data)
        loaded = self.store.load(self.pr, "main")
        self.assertEqual(loaded["drift"], [])
        saved = loaded["checkpoint"]
        for field in checkpoint.INPUT_FIELDS:
            self.assertEqual(saved[field], data[field])
        self.assertEqual(saved["version"], 1)
        self.assertEqual(saved["pr_id"], self.pr)
        self.assertEqual(saved["repo_id"], self.store.repo_id)
        self.assertEqual(saved["git"]["branch"], "feature")
        self.assertEqual(saved["git"]["base_revision"], self.git("rev-parse", "main"))
        self.assertEqual(saved["git"]["merge_base"], self.git("merge-base", "main", "HEAD"))
        self.assertEqual(saved["git"]["head"], self.git("rev-parse", "HEAD"))
        self.assertEqual(stat.S_IMODE(path.stat().st_mode), 0o600)
        for directory in (self.state, self.state / "codex", self.store.root):
            self.assertEqual(stat.S_IMODE(directory.stat().st_mode), 0o700)

    def test_cli_stdin_file_path_load_delete(self):
        result = self.cli("path", "--pr", self.pr)
        self.assertEqual(result["path"], str(self.store.path(self.pr)))
        self.assertFalse(self.state.exists())
        data = progress("APPROVED")
        data.update(current_block=None, completed=True)
        self.cli("save", "--pr", self.pr, "--base", "main", "--input", "-", stdin=json.dumps(data))
        self.assertEqual(self.cli("load", "--pr", self.pr, "--base", "main")["drift"], [])
        input_path = self.root / "input.json"
        input_path.write_text(json.dumps(data), encoding="utf-8")
        self.cli("save", "--pr", self.pr, "--base", "main", "--input", str(input_path))
        self.cli("delete", "--pr", self.pr, success=False)
        self.assertTrue(self.store.path(self.pr).exists())
        self.cli("delete", "--pr", self.pr, "--confirm-complete")
        self.assertFalse(self.store.path(self.pr).exists())

    def test_probe_touches_only_its_temporary_file(self):
        path = self.save()
        before = path.read_bytes()
        result = self.cli("probe")
        self.assertEqual(result, {"root": str(self.store.root), "writable": True})
        self.assertEqual(list(self.store.root.iterdir()), [path])
        self.assertEqual(path.read_bytes(), before)

    def test_probe_without_checkpoint(self):
        self.store.probe()
        self.assertEqual(list(self.store.root.iterdir()), [])

    def test_fallback_state_directory(self):
        with patch.dict(os.environ, {"XDG_STATE_HOME": "", "HOME": str(self.root / "home")}):
            store = checkpoint.Store(self.repo)
            self.assertEqual(store.root, self.root / "home/.local/state/codex/pr-walkthrough")
            store.probe()
        self.assertFalse(self.state.exists())

    def test_relative_and_in_repo_storage_rejected_including_symlink(self):
        link = self.root / "state-link"
        link.symlink_to(self.repo, target_is_directory=True)
        for state in ("relative/state", str(self.repo / "state"), str(link)):
            with self.subTest(state=state), patch.dict(os.environ, {"XDG_STATE_HOME": state}):
                with self.assertRaises(checkpoint.CheckpointError):
                    checkpoint.Store(self.repo)

    def test_worktrees_share_identity_and_reject_primary_repo_storage(self):
        other = self.root / "linked"
        self.git("worktree", "add", "-b", "other", str(other))
        store = checkpoint.Store(other)
        self.assertEqual(store.repo_id, self.store.repo_id)
        self.assertEqual(store.path(self.pr), self.store.path(self.pr))
        self.save()
        self.assertIn("branch", {item["field"] for item in store.load(self.pr, "main")["drift"]})
        with patch.dict(os.environ, {"XDG_STATE_HOME": str(self.repo / "state")}):
            with self.assertRaises(checkpoint.CheckpointError):
                checkpoint.Store(other)

    def test_repository_and_pr_are_both_part_of_identity(self):
        self.assertNotEqual(self.store.path(self.pr), self.store.path("branch:feature"))
        other = self.root / "separate"
        other.mkdir()
        self.git("init", "-b", "main", repo=other)
        self.assertNotEqual(self.store.path(self.pr), checkpoint.Store(other).path(self.pr))

    def test_resume_head_branch_base_and_detached_head(self):
        self.save()
        (self.repo / "source.txt").write_text("next\n", encoding="utf-8")
        self.commit("next")
        self.assertIn("head", self.drift())
        self.git("branch", "-m", "renamed")
        self.assertIn("branch", self.drift())
        self.assertIn("base_ref", self.drift("HEAD"))
        self.assertIn("base_revision", self.drift("HEAD"))
        self.assertIn("merge_base", self.drift("HEAD"))
        self.git("branch", "-f", "main", "HEAD")
        self.assertIn("base_revision", self.drift())
        self.git("switch", "--detach")
        self.assertIsNone(self.store.snapshot("main")["branch"])

    def test_target_branch_advance_detected_with_unchanged_merge_base(self):
        fork = self.git("rev-parse", "main")
        (self.repo / "feature.txt").write_text("feature change\n", encoding="utf-8")
        feature_head = self.commit("feature work")
        path = self.save()
        before = path.read_bytes()
        self.git("switch", "main")
        (self.repo / "base.txt").write_text("independent main change\n", encoding="utf-8")
        base_head = self.commit("main work")
        self.git("switch", "feature")

        snapshot = self.store.snapshot("main")
        self.assertEqual(snapshot["head"], feature_head)
        self.assertEqual(snapshot["base_revision"], base_head)
        self.assertEqual(snapshot["merge_base"], fork)
        loaded = self.store.load(self.pr, "main")
        self.assertEqual(loaded["drift"], [
            {"field": "base_revision", "saved": fork, "current": base_head},
        ])
        self.assertEqual(path.read_bytes(), before)
        with self.assertRaises(checkpoint.CheckpointError):
            self.save()
        self.assertEqual(path.read_bytes(), before)
        self.save(reconcile=True)
        self.assertEqual(self.drift(), set())

    def test_dirty_staged_and_untracked_bytes_change_fingerprint(self):
        path = self.repo / "source.txt"
        path.write_text("working\n", encoding="utf-8")
        self.save()
        path.write_text("changed\n", encoding="utf-8")
        self.assertIn("worktree_fingerprint", self.drift())
        self.save(reconcile=True)
        self.git("add", "source.txt")
        self.assertIn("worktree_fingerprint", self.drift())
        self.save(reconcile=True)
        self.assertEqual(self.drift(), set())
        untracked = self.repo / "untracked.txt"
        untracked.write_text("AAAA", encoding="utf-8")
        self.assertIn("worktree_fingerprint", self.drift())
        self.save(reconcile=True)
        before = untracked.stat()
        untracked.write_text("BBBB", encoding="utf-8")
        os.utime(untracked, ns=(before.st_atime_ns, before.st_mtime_ns))
        self.assertIn("worktree_fingerprint", self.drift())
        self.save(reconcile=True)
        untracked.unlink()
        self.assertIn("worktree_fingerprint", self.drift())

    def test_ignored_files_and_external_symlink_contents_not_read(self):
        (self.repo / ".gitignore").write_text(".env\n", encoding="utf-8")
        self.commit("ignore local secrets")
        secret = self.repo / ".env"
        secret.write_text("TOKEN=SECRET", encoding="utf-8")
        external = self.root / "external"
        external.write_text("outside", encoding="utf-8")
        (self.repo / "link").symlink_to(external)
        self.save()
        secret.write_text("TOKEN=OTHER!", encoding="utf-8")
        external.write_text("modified", encoding="utf-8")
        self.assertEqual(self.drift(), set())
        loaded = self.cli("load", "--pr", self.pr, "--base", "main")
        self.assertNotIn("TOKEN", json.dumps(loaded))
        self.assertNotIn("SECRET", self.store.path(self.pr).read_text())

    def test_git_fsmonitor_hook_not_executed(self):
        self.git("config", "core.fsmonitor", "/definitely/not/a/hook")
        self.save()
        self.assertEqual(self.drift(), set())

    def test_load_drift_never_rewrites_saved_state(self):
        path = self.save()
        before = path.read_bytes()
        (self.repo / "source.txt").write_text("modified", encoding="utf-8")
        result = self.store.load(self.pr, "main")
        self.assertTrue(result["drift"])
        self.assertEqual(path.read_bytes(), before)

    def test_save_requires_explicit_reconcile_for_git_drift(self):
        path = self.save()
        before = path.read_bytes()
        (self.repo / "source.txt").write_text("modified", encoding="utf-8")
        args = ("save", "--pr", self.pr, "--base", "main", "--input", "-")
        result = self.cli(*args, stdin=json.dumps(progress()), success=False)
        self.assertIn("--reconcile", result["error"])
        self.assertEqual(path.read_bytes(), before)
        self.cli(*args, "--reconcile", stdin=json.dumps(progress("APPROVED")))
        self.assertEqual(self.drift(), set())
        self.assertEqual(self.store.read(self.pr)["blocks"][0]["status"], "APPROVED")

    def test_reconcile_never_bypasses_identity_validation(self):
        path = self.save()
        data = json.loads(path.read_text())
        data["pr_id"] = "foreign"
        self.rewrite(data)
        before = path.read_bytes()
        with self.assertRaises(checkpoint.CheckpointError):
            self.save(reconcile=True)
        self.assertEqual(path.read_bytes(), before)

    def test_schema_rejects_wrong_fields_types_and_missing_evidence(self):
        cases = []
        data = progress()
        data["transcript"] = "do not store"
        cases.append(data)
        data = progress()
        data["blocks"][0]["report"] = "do not store"
        cases.append(data)
        data = progress()
        data["blocks"][0]["decisions"][0].pop("evidence")
        cases.append(data)
        data = progress()
        data["blocks"][0]["decisions"][0]["evidence"] = ""
        cases.append(data)
        data = progress()
        data["blocks"].append(copy.deepcopy(data["blocks"][0]))
        cases.append(data)
        for field, value in (("completed", 1), ("current_block", "unknown"), ("blocks", {})):
            data = progress()
            data[field] = value
            cases.append(data)
        for field, value in (("status", "ACCEPTED"), ("commits", "abc"), ("position", 4),
                             ("position", ""),
                             ("verification", [{"check": "test", "result": True, "evidence": "exit 0"}])):
            data = progress()
            data["blocks"][0][field] = value
            cases.append(data)
        for data in cases:
            with self.subTest(data=data), self.assertRaises(checkpoint.CheckpointError):
                self.store.save(self.pr, "main", data)
        self.assertFalse(self.state.exists())

    def test_corrupt_incompatible_and_foreign_files_never_overwritten_or_deleted(self):
        path = self.save()
        original = json.loads(path.read_text())
        corruptions = ["invalid JSON", "\ufeff{}"]
        for field, value in (("version", 2), ("version", True), ("pr_id", "foreign"),
                             ("repo_id", "foreign"), ("git", {}), ("updated_at", None)):
            data = copy.deepcopy(original)
            data[field] = value
            corruptions.append(json.dumps(data))
        data = copy.deepcopy(original)
        data["transcript"] = "extra"
        corruptions.append(json.dumps(data))
        for text in corruptions:
            path.write_text(text, encoding="utf-8")
            for operation in (lambda: self.store.load(self.pr, "main"),
                              lambda: self.save(),
                              lambda: self.store.delete(self.pr, True)):
                with self.subTest(text=text), self.assertRaises(checkpoint.CheckpointError):
                    operation()
                self.assertEqual(path.read_text(), text)

    def test_symlink_checkpoint_not_followed_or_replaced(self):
        self.store.ensure_root()
        target = self.root / "other.json"
        target.write_text("{}", encoding="utf-8")
        self.store.path(self.pr).symlink_to(target)
        with self.assertRaises(checkpoint.CheckpointError):
            self.save()
        self.assertTrue(self.store.path(self.pr).is_symlink())
        self.assertEqual(target.read_text(), "{}")

    def test_delete_refuses_all_unfinished_states_and_questions(self):
        for status in checkpoint.STATUSES - {"APPROVED", "COMMITTED"}:
            data = progress(status)
            data.update(current_block=None, completed=True)
            path = self.save(data)
            with self.subTest(status=status), self.assertRaises(checkpoint.CheckpointError):
                self.store.delete(self.pr, True)
            self.assertTrue(path.exists())
        for completed, current, questions in ((False, None, []), (True, "foundation", []),
                                               (True, None, ["Still undecided"])):
            data = progress("APPROVED")
            data.update(completed=completed, current_block=current)
            data["blocks"][0]["open_questions"] = questions
            self.save(data)
            with self.assertRaises(checkpoint.CheckpointError):
                self.store.delete(self.pr, True)

    def test_delete_completed_approved_and_committed_only_leaves_other_pr(self):
        data = {"blocks": [block("APPROVED", "1"), block("COMMITTED", "2")],
                "current_block": None, "completed": True}
        path = self.save(data)
        self.store.save("another PR", "main", progress())
        with self.assertRaises(checkpoint.CheckpointError):
            self.store.delete(self.pr)
        self.store.delete(self.pr, True)
        self.assertFalse(path.exists())
        self.assertTrue(self.store.path("another PR").exists())

    def test_atomic_write_failure_preserves_old_checkpoint_and_cleans_temp(self):
        path = self.save()
        before = path.read_bytes()
        with patch.object(checkpoint.os, "replace", side_effect=PermissionError("test replace failure")):
            with self.assertRaises(PermissionError):
                self.save(progress("APPROVED"))
        self.assertEqual(path.read_bytes(), before)
        self.assertEqual(list(self.store.root.iterdir()), [path])

    def test_probe_failure_cleans_only_its_temp(self):
        path = self.save()
        with patch.object(checkpoint.Path, "read_bytes", side_effect=OSError("test read failure")):
            with self.assertRaises(OSError):
                self.store.probe()
        self.assertEqual(list(self.store.root.iterdir()), [path])

    def test_permission_failure_has_no_repo_fallback(self):
        if os.geteuid() == 0:
            self.skipTest("root bypasses directory permissions")
        self.store.ensure_root()
        self.store.root.chmod(0o500)
        try:
            result = self.cli("probe", success=False)
            self.assertIn("Permission denied", result["error"])
            self.assertEqual(list(self.store.root.iterdir()), [])
            self.assertEqual(self.git("status", "--porcelain"), "")
        finally:
            self.store.root.chmod(0o700)

    def test_missing_checkpoint_and_invalid_base_fail_without_creating_state(self):
        self.cli("load", "--pr", self.pr, "--base", "main", success=False)
        self.cli("save", "--pr", self.pr, "--base", "absent", "--input", "-",
                 stdin=json.dumps(progress()), success=False)
        with self.assertRaises(checkpoint.CheckpointError):
            self.store.snapshot("--help")
        self.assertFalse(self.state.exists())


if __name__ == "__main__":
    unittest.main()
