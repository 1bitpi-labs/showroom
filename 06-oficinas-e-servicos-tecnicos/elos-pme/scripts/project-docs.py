#!/usr/bin/env python3
"""Rebuild/check the explicit public project inventory and relative documentation links."""
import argparse
import hashlib
import json
import re
from datetime import date
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "docs/app-files.json"
DIRECTORIES = ("src", "public", "scripts", "tests", "docs")
ROOT_FILES = ("AGENTS.md", "README.md", "STATUS.md", "ZOD_UI_BLUEPRINT.md", "BRISA_VISUAL_COMPOSITION.html", "package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "next-env.d.ts", "compose.yaml", ".env.example", ".gitignore")

def inventory(root, previous):
    paths = {root / n for n in ROOT_FILES if (root / n).is_file()}
    for dirname in DIRECTORIES:
        paths.update(p for p in (root / dirname).rglob("*") if p.is_file() and "__pycache__" not in p.parts and not p.is_symlink())
    # Preserve only previously inventoried public harness paths; never sweep .tsf/state.
    for item in previous.get("files", []):
        rel = Path(item["path"])
        if rel.parts and rel.parts[0] == ".tsf" and "state" not in rel.parts and not rel.is_absolute() and ".." not in rel.parts:
            p = root / rel
            if p.is_file() and not p.is_symlink():
                paths.add(p)
    paths.discard(root / "docs/app-files.json")
    result = []
    for p in sorted(paths):
        rel = p.relative_to(root).as_posix()
        if any(part in {"node_modules", ".next", "backups", "test-results", "__pycache__"} for part in p.relative_to(root).parts):
            continue
        if p.name.startswith(".env") and p.name != ".env.example":
            continue
        blob = p.read_bytes()
        result.append({"path": rel, "bytes": len(blob), "sha256": hashlib.sha256(blob).hexdigest()})
    return result

def broken_links(root):
    problems = []
    for p in [root / "README.md", root / "AGENTS.md", root / "STATUS.md", root / "ZOD_UI_BLUEPRINT.md", *sorted((root / "docs").rglob("*.md"))]:
        if not p.is_file():
            continue
        text = re.sub(r"```[\s\S]*?```", "", p.read_text())
        for raw in re.findall(r"\]\((<[^>]+>|[^)\s]+)(?:\s+\"[^\"]*\")?\)", text):
            target = raw.strip("<>")
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path or parsed.path.startswith("/"):
                continue
            dest = p.parent / unquote(parsed.path)
            if not dest.exists():
                problems.append(f"{p.relative_to(root)} -> {target}")
    return problems

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="Rewrite the public inventory; never changes product files")
    args = parser.parse_args()
    previous = json.loads(MANIFEST.read_text())
    files = inventory(ROOT, previous)
    missing = broken_links(ROOT)
    if missing:
        raise SystemExit("Broken relative links:\n" + "\n".join(missing))
    if args.write:
        payload = {"generated": date.today().isoformat(), "scope": "current public source, assets, docs, evidence, scripts, tests, explicit harness paths; excludes private state, env, deps, build and this manifest", "publication_source": previous.get("publication_source", ""), "files": files}
        MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
        print(f"Inventoried {len(files)} public files")
    else:
        old = {x["path"]: x for x in previous["files"]}
        current = {x["path"]: x for x in files}
        changes = sorted(k for k in old.keys() | current.keys() if old.get(k) != current.get(k))
        if changes:
            raise SystemExit("Stale inventory paths:\n" + "\n".join(changes))
        print(f"Verified {len(files)} file hashes and sizes")
    print("Relative documentation targets exist (anchors and external URLs are not checked)")

if __name__ == "__main__":
    main()
