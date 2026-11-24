import importlib.util
import json
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("review_board", Path(__file__).with_name("review_board.py"))
board = importlib.util.module_from_spec(spec)
spec.loader.exec_module(board)

def artifact(body="<p>Exemplo</p>", css="p{color:green}", dimensions=None):
    scene = {"width": 390, "height": 844, "doc": f"<style>{css}</style><div inert>{body}</div>"}
    scene.update(dimensions or {})
    return "<script>const scenes=" + json.dumps({"a": scene, "b": dict(scene)}) + "; frame.srcdoc=scene.doc;</script>"

class ReviewBoardTests(unittest.TestCase):
    def test_compaction_preserves_each_scene_and_is_idempotent(self):
        source = artifact(css="p{color:green}" * 100)
        result = board.compact(source)
        self.assertEqual(board.validate(source), board.validate(result))
        self.assertLess(len(result), len(source))
        self.assertEqual(board.compact(result), result)
    def test_active_urls_scripts_handlers_and_tokens_are_rejected(self):
        for body in ['<a href="/api/save">ir</a>', '<img src="https://example.com/x">', '<script>alert(1)</script>', '<p onclick="x()">x</p>', '<a href="/p/'+'a'*40+'">link</a>']:
            with self.subTest(body=body), self.assertRaises(ValueError):
                board.validate(artifact(body))
    def test_populated_secrets_rejected_but_empty_login_allowed(self):
        board.validate(artifact('<input type="password" value="">'))
        for body in ['<input type="password" value="private">', '<input type="hidden" value="csrf">', '<input name="access_token" value="private">']:
            with self.subTest(body=body), self.assertRaises(ValueError):
                board.validate(artifact(body))
    def test_controls_outside_inert_root_are_rejected(self):
        source = artifact().replace('<div inert>', '<div>')
        with self.assertRaises(ValueError):
            board.validate(source)
        source = artifact().replace('</div>', '</div><button>outside</button>')
        with self.assertRaises(ValueError):
            board.validate(source)
    def test_bad_dimensions_rejected(self):
        for value in [0, True, "390", 9000]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                board.validate(artifact(dimensions={"width": value}))
    def test_different_css_is_not_silently_merged(self):
        source = artifact()
        scenes, start, end = board.declaration(source, "scenes")
        scenes['b']['doc'] = scenes['b']['doc'].replace('color:green','color:blue')
        source = source[:start] + json.dumps(scenes) + source[end:]
        with self.assertRaises(ValueError):
            board.compact(source)
    def test_external_css_url_rejected(self):
        with self.assertRaises(ValueError):
            board.validate(artifact(css='p{background:url(https://example.com/pixel)}'))

if __name__ == "__main__":
    unittest.main()
