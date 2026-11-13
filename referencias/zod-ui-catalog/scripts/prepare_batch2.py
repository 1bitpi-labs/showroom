"""Fetch bounded MIT registries and prepare their original sources for audit."""
import argparse
import concurrent.futures
import hashlib
import json
import urllib.request
from pathlib import Path
R=Path(__file__).resolve().parents[1]
B=R/'audits/batch-2'
DITHER=['dither-glow','mesh-gradient','noise-field','plasma','starfield','halftone','horizon','beams','eclipse','dither-orb','contours','ripples','retro-grid','silk','tunnel','smoke','metaballs','ridgelines','flow-field','voronoi']
SHADCN=['button','badge','card','input','textarea','checkbox','switch','tabs','accordion','dialog','progress','slider']

def download(job):
    kind,name,url=job
    dest=R/'assets'/kind/(name+('.json' if name!='LICENSE' else ''))
    try:
        with urllib.request.urlopen(url,timeout=25) as response:
            raw=response.read();status=response.status
        dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(raw)
        return {'source':kind,'name':name,'url':url,'http_status':status,'file':str(dest.relative_to(R)),'sha256':hashlib.sha256(raw).hexdigest()}
    except Exception as error:return {'source':kind,'name':name,'url':url,'error':str(error)}

def main(offline=False):
    B.mkdir(parents=True,exist_ok=True)
    jobs=[('dithercn',n,f'https://dithercn.dev/r/{n}.json') for n in DITHER]
    jobs += [('shadcn',n,f'https://ui.shadcn.com/r/styles/new-york-v4/{n}.json') for n in SHADCN]
    jobs += [('shadcn','label','https://ui.shadcn.com/r/styles/new-york-v4/label.json')]
    jobs += [('shadcn',n+'-demo',f'https://ui.shadcn.com/r/styles/new-york-v4/{n}-demo.json') for n in SHADCN]
    if offline:
        results=json.loads((B/'downloads.json').read_text())
    else:
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(download,jobs))
    (B/'downloads.json').write_text(json.dumps(results,indent=2)+'\n')
    fixture=B/'fixture';src=fixture/'src';src.mkdir(parents=True,exist_ok=True)
    for kind,names in [('dithercn',DITHER+['dither-core']),('shadcn',SHADCN+['label']+[n+'-demo' for n in SHADCN])]:
        for name in names:
            f=R/'assets'/kind/(name+'.json')
            if not f.exists():continue
            for entry in json.loads(f.read_text()).get('files',[]):
                path=entry['path']
                if kind=='shadcn':path=path.replace('registry/new-york-v4/ui/','components/ui/').replace('registry/new-york-v4/examples/','demos/')
                target=src/path
                assert target.resolve().is_relative_to(src.resolve())
                target.parent.mkdir(parents=True,exist_ok=True);target.write_text(entry['content'])
    print(json.dumps({'downloaded':sum('error' not in d for d in results),'failed':[r for r in results if 'error' in r]},indent=2))
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--offline',action='store_true',help='Materialize already downloaded snapshots without network')
    main(parser.parse_args().offline)
