"""Materialize preserved MIT registry sources into this audit fixture."""
import json
from pathlib import Path
HERE=Path(__file__).resolve().parent
CATALOG=HERE.parents[1]
for name in ['aurora','waves','dither-core']:
    registry=json.loads((CATALOG/f'assets/dithercn/{name}.json').read_text())
    for entry in registry['files']:
        target=HERE/'src'/entry['path']
        assert target.resolve().is_relative_to((HERE/'src').resolve())
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(entry['content'])
