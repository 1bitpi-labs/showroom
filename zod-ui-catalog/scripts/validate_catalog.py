"""Check catalog counts, unique IDs, routing and artifact consistency."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
master = json.loads((root / 'index/master-index.json').read_text())
seen = set()
total = 0
for quadrant, route in master['quadrants'].items():
    index = json.loads((root / route['index']).read_text())
    count = 0
    assert index['quadrant'] == quadrant
    for category, sections in index['sections'].items():
        for section, items in sections.items():
            for item in items:
                assert item['id'] not in seen, 'Duplicate ID'
                seen.add(item['id'])
                location = item['location']
                assert (location['quadrant'], location['category'], location['section']) == (quadrant, category, section)
                expected = f"{quadrant}/{category}/{section}/{item['id']}.json"
                assert location['file_path'] == expected
                artifact = json.loads((root / expected).read_text())
                assert all(artifact[k] == v for k, v in item.items())
                assert item['tier'] in ['S+', 'S', 'A', 'B', 'C', 'D', 'F']
                count += 1
    assert count == index['count'] == route['count']
    total += count
assert total == master['total_items']
print(f'Catalog valid: {total} items')
