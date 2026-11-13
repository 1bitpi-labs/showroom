#!/usr/bin/env python3
"""
Portable documentation, relative link, slop-ban, and privacy leak auditor.
Designed for reuse across showroom and Cook Loop deliveries.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote

IGNORE_DIRS = {
    ".git",
    "node_modules",
    "__pycache__",
    ".pytest_cache",
    ".venv",
    "venv",
    ".next",
    "dist",
    "build",
}

TEXT_EXTENSIONS = {
    ".md",
    ".html",
    ".css",
    ".js",
    ".mjs",
    ".py",
    ".json",
    ".txt",
}

SECRET_PATTERNS = [
    ("openai_key", re.compile(r"sk-[A-Za-z0-9]{16,}")),
    ("google_api_key", re.compile(r"AIza[0-9A-Za-z\-_]{20,}")),
    ("github_pat", re.compile(r"ghp_[0-9A-Za-z]{20,}")),
    ("private_key", re.compile(r"BEGIN [A-Z ]*PRIVATE KEY")),
    ("personal_path", re.compile(r"(/home/[A-Za-z0-9_.-]+|/Users/[A-Za-z0-9_.-]+)")),
]

PLACEHOLDER_PATTERNS = [
    ("lorem_ipsum", re.compile(r"\blorem\s+ipsum\b", re.IGNORECASE)),
    ("placeholder_marker", re.compile(r"\b(TBD|XXX_PLACEHOLDER)\b")),
]

FENCED_BLOCK_RE = re.compile(r"```.*?```", re.DOTALL)
MD_LINK_RE = re.compile(r"!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+\"[^\"]*\")?\)")


def iter_project_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in sorted(root.rglob("*")):
        if any(part in IGNORE_DIRS for part in path.parts):
            continue
        if path.is_file() and path.suffix.lower() in TEXT_EXTENSIONS:
            files.append(path)
    return files


def strip_fenced_code(markdown: str) -> str:
    return FENCED_BLOCK_RE.sub("", markdown)


def find_broken_links(root: Path, md_files: list[Path] | None = None) -> list[dict[str, str]]:
    broken: list[dict[str, str]] = []
    targets = md_files if md_files is not None else [p for p in iter_project_files(root) if p.suffix.lower() == ".md"]
    for md_path in targets:
        content = strip_fenced_code(md_path.read_text(encoding="utf-8", errors="replace"))
        for match in MD_LINK_RE.finditer(content):
            raw_target = match.group(1).strip()
            if raw_target.startswith("<") and raw_target.endswith(">"):
                raw_target = raw_target[1:-1].strip()
            if (
                not raw_target
                or raw_target.startswith("#")
                or raw_target.startswith(("http://", "https://", "mailto:", "tel:", "data:", "javascript:"))
            ):
                continue
            path_part = unquote(raw_target.split("#", 1)[0].split("?", 1)[0]).strip()
            if not path_part:
                continue
            resolved = (md_path.parent / path_part).resolve()
            if not resolved.exists():
                broken.append(
                    {
                        "source": str(md_path.relative_to(root)),
                        "target": raw_target,
                    }
                )
    return broken


def scan_patterns(
    root: Path,
    files: list[Path],
    check_em_dash: bool = False,
    allow_paths: set[str] | None = None,
) -> dict[str, list[dict[str, object]]]:
    allow = allow_paths or set()
    secrets: list[dict[str, object]] = []
    placeholders: list[dict[str, object]] = []
    em_dashes: list[dict[str, object]] = []

    for fpath in files:
        rel = str(fpath.relative_to(root))
        text = fpath.read_text(encoding="utf-8", errors="replace")
        for idx, line in enumerate(text.splitlines(), start=1):
            if rel not in allow:
                for label, rx in SECRET_PATTERNS:
                    if rx.search(line):
                        secrets.append({"file": rel, "line": idx, "kind": label})
                for label, rx in PLACEHOLDER_PATTERNS:
                    if rx.search(line):
                        placeholders.append({"file": rel, "line": idx, "kind": label})
                if check_em_dash and "—" in line:
                    em_dashes.append({"file": rel, "line": idx})

    return {
        "secrets_or_personal_paths": secrets,
        "placeholders": placeholders,
        "em_dashes": em_dashes,
    }


def audit_project(
    root: Path,
    check_em_dash: bool = False,
    allow_paths: set[str] | None = None,
) -> dict[str, object]:
    root = root.resolve()
    files = iter_project_files(root)
    md_files = [p for p in files if p.suffix.lower() == ".md"]
    broken_links = find_broken_links(root, md_files)
    scans = scan_patterns(root, files, check_em_dash=check_em_dash, allow_paths=allow_paths)
    passed = (
        len(broken_links) == 0
        and len(scans["secrets_or_personal_paths"]) == 0
        and len(scans["placeholders"]) == 0
        and (not check_em_dash or len(scans["em_dashes"]) == 0)
    )
    return {
        "root": str(root),
        "files_scanned": len(files),
        "markdown_files": len(md_files),
        "broken_links": broken_links,
        **scans,
        "passed": passed,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Audit markdown links, placeholders, privacy leaks, and em dashes.")
    parser.add_argument("root", nargs="?", default=".", help="Project root directory to audit.")
    parser.add_argument("--no-em-dash", action="store_true", help="Fail if em dash character (—) is found.")
    parser.add_argument(
        "--allow-file",
        action="append",
        default=[],
        help="Relative file path to exclude from pattern scans (e.g. historical cook/BRIEF.md).",
    )
    args = parser.parse_args(argv)
    result = audit_project(
        Path(args.root),
        check_em_dash=args.no_em_dash,
        allow_paths=set(args.allow_file),
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    sys.exit(main())
