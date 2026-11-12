"""Publish only manually reviewed batch-2 items with passing evidence."""
import fcntl,hashlib,json,os,re,shutil,tempfile
from pathlib import Path
from prepare_batch2 import DITHER,SHADCN,R,B

UI_ROUTES={
'button':('Q4-ux-motion','micro-interactions','tactile-button-states'),
'badge':('Q2-conversion-content','pricing-proof','status-badges'),
'card':('Q2-conversion-content','forms-overlays','authentication-cards'),
'input':('Q2-conversion-content','forms-overlays','text-inputs'),
'textarea':('Q2-conversion-content','forms-overlays','text-inputs'),
'checkbox':('Q4-ux-motion','accessibility-specs','aria-keyboard-contracts'),
'switch':('Q4-ux-motion','micro-interactions','toggle-controls'),
'tabs':('Q2-conversion-content','feature-grids','interactive-tabs-showcase'),
'accordion':('Q4-ux-motion','accessibility-specs','aria-keyboard-contracts'),
'dialog':('Q2-conversion-content','forms-overlays','command-palettes-modals'),
'progress':('Q4-ux-motion','micro-interactions','progress-feedback'),
'slider':('Q4-ux-motion','micro-interactions','range-controls')}

def dump(p,data):p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def path(root,rel):
    target=(root/rel).resolve();assert target.is_relative_to(root.resolve()),rel;return target

def publish():
    reviewed=json.loads((B/'manual-review.json').read_text())
    master=json.loads((R/'index/master-index.json').read_text())
    indexes={q:json.loads((R/v['index']).read_text()) for q,v in master['quadrants'].items()}
    items=[];taxonomy=[]
    for kind,names in [('dithercn',DITHER),('shadcn',SHADCN)]:
        assert 'MIT License' in (R/f'assets/{kind}/LICENSE').read_text()
        for name in names:
            ident=kind+'-'+name;review=reviewed['items'][ident]
            assert review['tier'] in ['S','A'] and review['manually_inspected']==['desktop','mobile']
            audit_path=R/f'previews/{ident}/audit.json';audit=json.loads(audit_path.read_text())
            for view in ['desktop','mobile']:
                v=audit['views'][view]
                assert not v.get('error') and v.get('runtime_errors')==[],(ident,view,v.get('error'))
                assert v['source_http_status']==v['local_http_status']==200
                assert not v['horizontal_overflow'] and v['state_checks']
                assert v['viewport']=={'width':1440 if view=='desktop' else 390,'height':900 if view=='desktop' else 844}
                assert v['comparison']['comparable'],(ident,view,'comparison unavailable')
                for suffix in ['.png','-source.png','-reference-surface.png','-local-surface.png']:
                    assert (audit_path.parent/(view+suffix)).exists()
            if kind=='dithercn':
                q,cat='Q3-visual-atmosphere','shaders-webgl'
                section=review['section']
                dependencies=['assets/dithercn/dither-core.json','assets/dithercn/dither-tokens.json','React','TypeScript','Tailwind CSS v4','clsx','tailwind-merge']
                compatibility=['React','TypeScript','Tailwind CSS v4','WebGL']
            else:
                q,cat,section=UI_ROUTES[name]
                required=set();packages={'React','TypeScript','Tailwind CSS v4','tw-animate-css'}
                queue=[name,name+'-demo']
                while queue:
                    dep=queue.pop()
                    if dep in required:continue
                    required.add(dep)
                    registry=json.loads((R/f'assets/shadcn/{dep}.json').read_text())
                    for entry in registry.get('files',[]):
                        content=entry['content']
                        queue.extend(re.findall(r'@/(?:registry/new-york-v4/ui|components/ui)/([a-z-]+)',content))
                        for imported in re.findall(r'from "([^"\n]+)"',content):
                            if imported=='cn':packages.update(['clsx','tailwind-merge'])
                            elif not imported.startswith(('@/', './', '../')):packages.add(imported)
                dependencies=sorted(packages)+[f'assets/shadcn/{n}.json' for n in sorted(required)]
                compatibility=['React','TypeScript','Tailwind CSS v4','Radix UI']
            assert cat in indexes[q]['sections'],(q,cat)
            if section not in indexes[q]['sections'][cat]:
                indexes[q]['sections'][cat][section]=[];master['quadrants'][q]['sections'][cat].append(section);taxonomy.append({'quadrant':q,'category':cat,'section':section})
                (R/q/cat/section).mkdir(parents=True,exist_ok=True)
            location={'quadrant':q,'category':cat,'section':section,'file_path':f'{q}/{cat}/{section}/{ident}.json'}
            source_path=R/f'assets/{kind}/{name}.json'
            dependencies_file=[d for d in dependencies if d.startswith('assets/')]
            assert all((R/p).exists() for p in dependencies_file)
            tier_audit={'visual_verified':True,'fidelity_type':'original_MIT_registry_code_with_source_and_local_surface_review','responsive_score':None,'audit_notes':review['notes']+['Grade is curator assessment of code, comparison and required adaptation; pixel similarity alone does not assign tier.','No full WCAG certification; no claim of whole-page percentage fidelity.'],'evidence':[str(audit_path.relative_to(R)),'audits/batch-2/manual-review.json',f'previews/{ident}/desktop.png',f'previews/{ident}/mobile.png',f'assets/{kind}/LICENSE'],'viewports':['1440x900','390x844'],'state_checks':{v:audit['views'][v]['state_checks'] for v in ['desktop','mobile']}}
            item={'id':ident,'location':location,'tier':review['tier'],'tier_audit':tier_audit,'source_site':'dithercn.dev' if kind=='dithercn' else 'ui.shadcn.com','source_url':audit['source_url'],'license':{'spdx':'MIT','local':f'assets/{kind}/LICENSE','url':'https://github.com/opencoredev/dithercn/blob/main/LICENSE' if kind=='dithercn' else 'https://github.com/shadcn-ui/ui/blob/main/LICENSE.md'},'stack_compatibility':compatibility,'style_tags':[section,kind,'native-source'],'artifact':{'type':'registry_component','registry':str(source_path.relative_to(R)),'sha256':hashlib.sha256(source_path.read_bytes()).hexdigest(),'demo_registry':f'assets/shadcn/{name}-demo.json' if kind=='shadcn' else None,'dependencies':dependencies,'fixture':'audits/batch-2/fixture','adaptation_required':review['adaptation_required'],'tokens':list(audit['views']['desktop'].get('inherited_tokens',{})) if kind=='dithercn' else ['--background','--foreground','--primary','--primary-foreground','--border','--input','--ring','--radius'],'states_tested':tier_audit['state_checks']}}
            items.append(item)
    # Public, historical flow outline is a separate C spec, never a reconstructed premium flow.
    ident='pageflows-revolut-onboarding-public-outline';q='Q4-ux-motion';cat='user-flows';section='onboarding-sequences'
    evidence=R/'audits/source-evidence/pageflows-com-retry-individual-flow/evidence.json';source=json.loads(evidence.read_text())
    out=R/'previews'/ident;out.mkdir(exist_ok=True)
    for view in ['desktop','mobile']:shutil.copyfile(evidence.parent/(view+'.png'),out/(view+'.png'))
    items.append({'id':ident,'location':{'quadrant':q,'category':cat,'section':section,'file_path':f'{q}/{cat}/{section}/{ident}.json'},'tier':'C','tier_audit':{'visual_verified':True,'fidelity_type':'public_partial_visual_spec','responsive_score':None,'audit_notes':['Public introductory frames and public chapter outline only. Subsequent screens require signup; no authentication bypass.','Historical recording version July 2020, not evidence of current Revolut UI.','Browser viewports describe the Page Flows page, not the original iPhone recording.'],'evidence':[str(evidence.relative_to(R)),f'previews/{ident}/desktop.png',f'previews/{ident}/mobile.png']},'source_site':'pageflows.com','source_url':source['url'],'license':{'status':'reference_only','restriction':'No source code or premium recording redistributed.'},'stack_compatibility':['framework-agnostic-spec'],'style_tags':['onboarding','finance','historical','partial-reference'],'artifact':{'type':'visual_spec','spec':'Separar introdução, verificação de contato, perfil/endereço, identificação e financiamento inicial em etapas com feedback explícito. O índice público sugere esta estrutura; implementar fluxo próprio e validar requisitos atuais. Não se trata de código ou de reprodução das 29 telas.','recording_version':'July 2020','access_status':'partial_public_outline; premium screens pending authorized session'}})
    ids={i['id'] for i in items}
    for idx in indexes.values():
        for sections in idx['sections'].values():
            for key,existing in sections.items():sections[key]=[i for i in existing if i['id'] not in ids]
    for item in items:
        l=item['location'];indexes[l['quadrant']]['sections'][l['category']][l['section']].append({k:v for k,v in item.items() if k!='artifact'})
    for q,idx in indexes.items():
        idx['count']=sum(len(s) for cat in idx['sections'].values() for s in cat.values());master['quadrants'][q]['count']=idx['count']
    master['total_items']=sum(v['count'] for v in indexes.values());assert master['total_items']>=50
    changes={i['location']['file_path']:i for i in items}
    changes.update({master['quadrants'][q]['index']:idx for q,idx in indexes.items()});changes['index/master-index.json']=master
    backup=B/'publication-backup';backup.mkdir(exist_ok=True)
    before={rel:path(R,rel).read_bytes() if path(R,rel).exists() else None for rel in changes}
    journal=R/'.catalog-transaction.json'
    for rel,raw in before.items():
        if raw is not None:
            p=path(backup,rel);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(raw)
    dump(journal,{'backup':str(backup.relative_to(R)),'files':{rel:raw is not None for rel,raw in before.items()}})
    try:
        with tempfile.TemporaryDirectory(dir=R,prefix='.publish-') as temp:
            for rel,data in changes.items():
                p=path(Path(temp),rel);p.parent.mkdir(parents=True,exist_ok=True);dump(p,data)
            for rel in changes:os.replace(path(Path(temp),rel),path(R,rel))
    except BaseException:
        for rel,raw in before.items():
            if raw is None:path(R,rel).unlink(missing_ok=True)
            else:path(R,rel).write_bytes(raw)
        raise
    else:journal.unlink()
    dump(B/'taxonomy-additions.json',taxonomy)
    dump(B/'published-items.json',[{'id':i['id'],'tier':i['tier'],'file':i['location']['file_path']} for i in items])
    print(json.dumps({'published':len(items),'catalog_total':master['total_items'],'taxonomy_sections_added':taxonomy},ensure_ascii=False))

if __name__=='__main__':
    with (R/'.catalog.lock').open('w') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX)
        journal=R/'.catalog-transaction.json'
        if journal.exists():
            recovery=json.loads(journal.read_text());backup=path(R,recovery['backup'])
            for rel,existed in recovery['files'].items():
                if existed:shutil.copyfile(path(backup,rel),path(R,rel))
                else:path(R,rel).unlink(missing_ok=True)
            journal.unlink()
        publish()
