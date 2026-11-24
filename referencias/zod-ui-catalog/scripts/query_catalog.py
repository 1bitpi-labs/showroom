"""Read-only catalog lookup. Resolve metadata first; load one artifact explicitly."""
import argparse
import json
from pathlib import Path

TIERS=['S+','S','A','B','C','D','F']

def query(args):
    root=args.catalog.resolve()
    master=json.loads((root/'index/master-index.json').read_text())
    candidates=[]
    tiers=set(args.tier or ['S+','S','A'])
    if args.references:tiers.add('C')
    for quadrant,route in master['quadrants'].items():
        if args.quadrant and args.quadrant.lower() not in [quadrant.lower(),quadrant[:2].lower()]:continue
        index=json.loads((root/route['index']).read_text())
        for category,sections in index['sections'].items():
            if args.category and category!=args.category:continue
            for section,items in sections.items():
                if args.section and section!=args.section:continue
                for item in items:
                    if args.id:
                        if item['id']!=args.id:continue
                    elif item['tier'] not in tiers:continue
                    if args.stack and not any(args.stack.casefold() in s.casefold() for s in item['stack_compatibility']):continue
                    if args.tag and not all(tag.casefold() in [s.casefold() for s in item['style_tags']] for tag in args.tag):continue
                    if args.search and args.search.casefold() not in json.dumps([item['id'],item['source_site'],category,section,item['style_tags']],ensure_ascii=False).casefold():continue
                    candidates.append(item)
    candidates.sort(key=lambda i:(TIERS.index(i['tier']),i['id']))
    matches=len(candidates)
    selected=candidates[:args.limit]
    if args.artifact:
        for item in selected:
            target=(root/item['location']['file_path']).resolve()
            if not target.is_relative_to(root):raise ValueError('Artifact path outside catalog')
            item['artifact']=json.loads(target.read_text())['artifact']
    if args.json:
        print(json.dumps({'catalog':str(root),'matches':matches,'returned':len(selected),'items':selected},ensure_ascii=False,indent=2))
    else:
        print(f'{matches} matching item(s); showing {len(selected)}')
        for item in selected:
            loc=item['location']
            print(f"[{item['tier']}] {item['id']} | {loc['quadrant']}/{loc['category']}/{loc['section']}")
            print(f"  artifact: {root / loc['file_path']}")
            print(f"  source: {item.get('source_url',item['source_site'])}")
            if args.artifact:print(json.dumps(item['artifact'],ensure_ascii=False,indent=2))
    return 0

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--catalog',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--quadrant',help='Q1, Q2, Q3, Q4 or full quadrant name')
    parser.add_argument('--category')
    parser.add_argument('--section')
    parser.add_argument('--tier',action='append',choices=TIERS,help='Repeat to select tiers; default S+/S/A')
    parser.add_argument('--references',action='store_true',help='Also include C visual specs')
    parser.add_argument('--stack',help='Case-insensitive substring of compatibility entry')
    parser.add_argument('--tag',action='append',help='Exact tag, case-insensitive; repeat for AND')
    parser.add_argument('--search',help='Substring in ID, origin, category, section or tags; not full artifact text')
    parser.add_argument('--id',help='Exact ID lookup, including lower tiers for inspection')
    parser.add_argument('--artifact',action='store_true',help='Load artifact payload after index selection')
    parser.add_argument('--limit',type=int,default=10)
    parser.add_argument('--json',action='store_true')
    args=parser.parse_args()
    if args.limit<1:parser.error('--limit must be positive')
    if args.artifact and not args.id:parser.error('--artifact requires --id to keep lookup granular')
    raise SystemExit(query(args))
