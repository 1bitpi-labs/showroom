import tempfile
import unittest
from pathlib import Path

from audit_docs_and_links import audit_project


class AuditDocsAndLinksTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / "docs").mkdir()

    def test_valid_links_spaces_and_external_links_pass(self) -> None:
        (self.root / "docs" / "My Guide.md").write_text("# Target", encoding="utf-8")
        (self.root / "README.md").write_text(
            "[ok](<docs/My Guide.md#section>) [enc](docs/My%20Guide.md) "
            "[ext](https://example.com) [mail](mailto:contato@example.com)\n"
            "```md\n[ignored](missing-in-code-block.md)\n```\n",
            encoding="utf-8",
        )
        res = audit_project(self.root, check_em_dash=True)
        self.assertTrue(res["passed"])
        self.assertEqual(res["broken_links"], [])

    def test_detects_broken_link_em_dash_and_personal_path(self) -> None:
        (self.root / "README.md").write_text(
            "Texto com — travessao\nCaminho /home/devuser/projeto\n[falha](docs/missing.md)\n",
            encoding="utf-8",
        )
        res = audit_project(self.root, check_em_dash=True)
        self.assertFalse(res["passed"])
        self.assertEqual(res["broken_links"], [{"source": "README.md", "target": "docs/missing.md"}])
        self.assertEqual(len(res["em_dashes"]), 1)
        self.assertEqual(res["secrets_or_personal_paths"][0]["kind"], "personal_path")

    def test_allow_file_exempts_historical_file_from_pattern_scan(self) -> None:
        (self.root / "docs" / "HISTORICO.md").write_text("Caminho antigo /home/user/old — ok", encoding="utf-8")
        (self.root / "README.md").write_text("[Hist](docs/HISTORICO.md)\n", encoding="utf-8")
        res = audit_project(self.root, check_em_dash=True, allow_paths={"docs/HISTORICO.md"})
        self.assertTrue(res["passed"])


if __name__ == "__main__":
    unittest.main()
