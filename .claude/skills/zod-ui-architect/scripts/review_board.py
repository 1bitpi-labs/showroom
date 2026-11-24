#!/usr/bin/env python3
"""Validate/compact the JSON-scene review-board format; never execute captured HTML."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path

MARKER = "__REVIEW_BOARD_SHARED_CSS__"

def declaration(text, name):
    match = re.search(r"\bconst\s+" + re.escape(name) + r"\s*=\s*", text)
    if not match:
        raise ValueError(f"Missing {name} JSON declaration")
    value, length = json.JSONDecoder().raw_decode(text[match.end():])
    return value, match.end(), match.end() + length

def scenes_from(text):
    scenes, start, end = declaration(text, "scenes")
    if not isinstance(scenes, dict) or not scenes:
        raise ValueError("Expected a nonempty scenes object")
    css = declaration(text, "sharedCSS")[0] if MARKER in text else None
    if css is not None and not isinstance(css, str):
        raise ValueError("Expected sharedCSS string")
    hydrated = {}
    for name, scene in scenes.items():
        if not isinstance(scene, dict) or not isinstance(scene.get("doc"), str):
            raise ValueError("Scene must contain an HTML doc")
        if any(type(scene.get(k)) is not int or not 200 <= scene[k] <= 3000 for k in ("width", "height")):
            raise ValueError("Scene dimensions must be integers between 200 and 3000")
        hydrated[name] = {**scene, "doc": scene["doc"].replace(MARKER, css) if css is not None else scene["doc"]}
    return hydrated, start, end

class CaptureCheck(HTMLParser):
    def __init__(self):
        super().__init__()
        self.problems = set()
        self.stack = []
        self.has_inert_root = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        inert = (self.stack[-1][1] if self.stack else False) or "inert" in attrs
        self.has_inert_root |= "inert" in attrs
        if tag in {"a", "button", "input", "select", "textarea", "form", "summary"} and not inert:
            self.problems.add("interactive scene content outside inert wrapper")
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append((tag, inert))
        if tag in {"script", "iframe", "object", "embed", "base", "link"}:
            self.problems.add("active or external document element")
        for key, value in attrs.items():
            if key.lower().startswith("on"):
                self.problems.add("event handler in scene")
            if key in {"src", "srcset", "action", "formaction", "href"} and value not in {None, "", "#"}:
                self.problems.add("active URL in scene")
        if tag == "input" and attrs.get("type", "").lower() in {"password", "hidden"} and attrs.get("value"):
            self.problems.add("sensitive input value")
        if tag == "input" and re.search(r"token|secret|password|csrf", attrs.get("name", ""), re.I) and attrs.get("value"):
            self.problems.add("sensitive named input")

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

def validate(text):
    scenes, _, _ = scenes_from(text)
    for scene in scenes.values():
        check = CaptureCheck()
        check.feed(scene["doc"])
        if not check.has_inert_root:
            check.problems.add("missing inert scene wrapper")
        if re.search(r"/p/[A-Za-z0-9_-]{32,}|[?&]token=|url\s*\(\s*['\"]?https?://", scene["doc"], re.I):
            check.problems.add("public token or external CSS URL")
        if check.problems:
            raise ValueError("Scene rejected: " + ", ".join(sorted(check.problems)))
    return scenes

def encode(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")

def compact(text):
    scenes = validate(text)
    if MARKER in text:
        return text
    styles = []
    for scene in scenes.values():
        match = re.search(r"<style>([\s\S]*?)</style>", scene["doc"])
        if not match:
            raise ValueError("Expected one inline style per scene")
        styles.append(match.group(1))
    if len(set(styles)) != 1:
        raise ValueError("CSS differs; keep scenes intact rather than guessing")
    css = styles[0]
    _, start, end = declaration(text, "scenes")
    docs = {name: {**scene, "doc": scene["doc"].replace(css, MARKER, 1)} for name, scene in scenes.items()}
    output = text[:start] + encode(docs) + text[end:]
    match = re.search(r"\bconst\s+scenes\s*=", output)
    output = output[:match.start()] + "const sharedCSS=" + encode(css) + ";\n" + output[match.start():]
    if "frame.srcdoc=scene.doc;" not in output:
        raise ValueError("Unsupported rendering template")
    output = output.replace("frame.srcdoc=scene.doc;", f"frame.srcdoc=scene.doc.replace('{MARKER}',sharedCSS);", 1)
    if validate(output) != scenes:
        raise ValueError("Compaction changed a hydrated scene")
    return output

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["check", "compact"])
    parser.add_argument("path", type=Path)
    parser.add_argument("--output", type=Path, help="Required for compact; refuses existing files")
    args = parser.parse_args()
    text = args.path.read_text()
    scenes = validate(text)
    if args.mode == "compact":
        if args.output is None:
            parser.error("compact requires --output; input is never overwritten")
        result = compact(text)
        with args.output.open("x") as file:
            file.write(result)
        print(f"Compacted {len(scenes)} scenes; {len(text.encode())} -> {len(result.encode())} bytes")
    else:
        print(f"Checked {len(scenes)} inert review scenes; no active URLs or populated sensitive inputs detected")

if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as error:
        raise SystemExit(str(error)) from None
