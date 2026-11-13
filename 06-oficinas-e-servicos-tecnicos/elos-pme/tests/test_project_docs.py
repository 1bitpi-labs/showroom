import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("project_docs", Path(__file__).resolve().parents[1] / "scripts/project-docs.py")
docs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(docs)

class ProjectDocsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for directory in ["src", "docs", ".tsf/state", "scripts"]:
            (self.root / directory).mkdir(parents=True)
    def test_inventory_excludes_private_generated_and_self_files(self):
        for name in ["src/app.ts", ".env.local", ".env.example", "docs/.env.capture", "docs/app-files.json", ".tsf/state/session.json", "scripts/__pycache__/cache.pyc"]:
            p = self.root / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text("fixture")
        previous = {"files": [{"path": ".tsf/state/session.json"}]}
        paths = {x["path"] for x in docs.inventory(self.root, previous)}
        self.assertEqual(paths, {"src/app.ts", ".env.example"})
    def test_size_and_hash_detect_modification(self):
        p = self.root / "src/app.ts"
        p.write_text("a")
        first = docs.inventory(self.root, {})
        p.write_text("different")
        second = docs.inventory(self.root, {})
        self.assertNotEqual(first[0]["sha256"], second[0]["sha256"])
        self.assertEqual(second[0]["bytes"], 9)
    def test_links_resolve_spaces_fragments_and_ignore_external_or_code(self):
        (self.root / "docs/My Note.md").write_text("# Target")
        (self.root / "README.md").write_text('[ok](<docs/My Note.md#target>) [encoded](docs/My%20Note.md) [web](https://example.invalid/no)\n```\n[fake](missing-code.md)\n```\n[broken](docs/missing.md)')
        self.assertEqual(docs.broken_links(self.root), ["README.md -> docs/missing.md"])
    def test_explicit_public_harness_only_and_no_symlink_content(self):
        (self.root / ".tsf/config.yaml").write_text("public")
        (self.root / ".tsf/private.json").write_text("private")
        outside = self.root / "private.txt"
        outside.write_text("not for export")
        (self.root / "docs/link.txt").symlink_to(outside)
        previous = {"files": [{"path": ".tsf/config.yaml"}, {"path": "../outside"}]}
        self.assertEqual([x["path"] for x in docs.inventory(self.root, previous)], [".tsf/config.yaml"])

if __name__ == "__main__":
    unittest.main()
