"""Publish the curated November 2026 evidence batch under an exclusive lock.
This is a fixed curated manifest, not an automatic classifier.
"""
import fcntl
import json
import os
import shutil
import tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
# Evidence key, ID, quadrant, category, section, original analytical specification.
MANIFEST=[
('navbar-gallery-supaste','navbar-supaste-static','Q1-structure-nav','navbars','minimal-sticky','Barra horizontal de marca e links em desktop, com referência mobile separada. O tipo Static vem da galeria; sticky não foi comprovado e deve ser decisão da implementação.'),
('navbar-gallery-cloudflare','navbar-cloudflare-mega-menu','Q1-structure-nav','navbars','mega-menu-enterprise','Menu amplo de produtos organizado em seis colunas, rodapé de atalhos e navegação mobile em lista. As capturas são referências estáticas: abertura, fechamento, foco e teclado precisam de implementação própria.'),
('landdding-com-bem','blueprint-bem-automation','Q1-structure-nav','page-blueprints','ai-product-launch','Referência de apresentação de produto de automação de trabalho. Usar hierarquia visual das imagens da ficha; métricas DOM pertencem à galeria, não ao site bem.ai. Não há código de origem do produto.'),
('designdetails-io-fern','blueprint-fern-developer-tools','Q1-structure-nav','page-blueprints','saas-dark-tech','Ficha visual de site de ferramentas para desenvolvedores. Referência de hierarquia e composição; tokens medidos na evidência são da galeria Design Details e não devem ser atribuídos ao Fern.'),
('mahero-supply-home','hero-mahero-craft','Q2-conversion-content','heroes','split-product-preview','Hero público com título em duas linhas, proposta de valor, CTA de templates e CTA explicativo. A ficha Wonderful Hero permaneceu em carregamento e seu template não foi extraído.'),
('prettysites-io-anatomy-atelier','hero-anatomy-atelier-reference','Q2-conversion-content','heroes','interactive-3d-hero','Referência pública da apresentação Anatomy Atelier, com exploração de órgãos em 3D descrita na ficha. Código premium, geometria, labels interativos e comportamento interno não foram extraídos; considerar apenas guia visual inicial.'),
('mobbin-com-home','hero-mobbin-design-library','Q2-conversion-content','heroes','split-product-preview','Hero de marketing público com tipografia em destaque, apresentação da biblioteca e dois caminhos de conversão. Não representa extração de telas ou fluxos privados do Mobbin.'),
('fffuel-co-nnnoise','texture-nnnoise-recipe','Q3-visual-atmosphere','svg-textures','noise-grain-overlays','Receita conceitual de textura SVG por feTurbulence e iluminação especular, com controles de frequência, opacidade e iluminação. Implementar receita própria. A licença consultada restringe redistribuição dos assets; nenhum SVG da fonte foi copiado para o catálogo.'),
('fffuel-co-ssshape','shape-ssshape-recipe','Q3-visual-atmosphere','svg-textures','geometric-grids-blobs','Fluxo de desenho de pontos para curva orgânica fechada, seguido por ajuste de escala, rotação e inclinação. Implementar geometria original; nenhum SVG de exemplo foi redistribuído.'),
('fontshare-com-satoshi','type-satoshi-reference','Q3-visual-atmosphere','typography-identity','display-sans-pairings','Família Satoshi como referência de sans para interface e títulos. Pesos, arquivos, cobertura de idioma e licença específica precisam ser confirmados antes de instalar no projeto; não há binários de fontes neste catálogo.'),
('fontshare-com-pairs','type-fontshare-pairs-reference','Q3-visual-atmosphere','typography-identity','display-sans-pairings','Galeria pública de pares tipográficos como ponto de seleção. Não é um par específico validado; escolher e testar contraste de tamanho, pesos, acentuação e carregamento antes do uso.'),
('poly-pizza-city-kit','3d-kenney-city-kit-reference','Q3-visual-atmosphere','3d-scenes-materials','low-poly-glb-models','City Kit de Kenney: conjunto de edifícios low-poly com 31 modelos, disponibilizado como CC0 na ficha. Downloads GLTF/FBX anunciados; meshes e integração WebGL não foram baixados ou auditados. Overflow da página da galeria não demonstra defeito do modelo.'),
('ambientcg-com-concrete049','pbr-concrete049-reference','Q3-visual-atmosphere','3d-scenes-materials','pbr-textures-hdri','Referência do material Concrete049. Selecionar resolução e conferir mapas albedo/normal/roughness antes de integração; este item é ficha visual e não contém texturas nem um material PBR renderizado localmente.'),
('fontinlogo-com-thunderbolts','brand-thunderbolts-type-reference','Q3-visual-atmosphere','typography-identity','brand-logotype-refs','Referência tipográfica da ficha Thunderbolts. Não atribuir equivalência exata entre uma fonte alternativa e lettering de marca; licença de fonte e direitos de marca são verificações separadas. Não foram copiados logos ou arquivos de fontes.'),
('component-gallery-tabs','ux-tabs-contract-reference','Q4-ux-motion','accessibility-specs','aria-keyboard-contracts','Referência de interface com painéis alternados. Contrato proposto para implementação: tablist/tab/tabpanel, aria-selected, relações por ID, foco gerenciado e setas/Home/End conforme orientação e modo de ativação escolhido. Este contrato é recomendação própria, não resultado de teste de todas as bibliotecas listadas.'),
('component-gallery-accordion','ux-accordion-contract-reference','Q4-ux-motion','accessibility-specs','aria-keyboard-contracts','Referência de seções expansíveis. Contrato proposto: botão semântico em heading, aria-expanded/controls, Enter/Espaço e ordem de tabulação natural. Verificar múltiplos painéis e foco em conteúdo fechado na implementação. Não se alega auditoria dos sistemas externos listados.'),
('recent-design-liquid-stepper','motion-liquid-stepper-reference','Q4-ux-motion','micro-interactions','spring-physics-presets','Referência de checkout com etapas em cápsulas, transição orgânica e cores por progresso. Constantes de mola, duração e easing não foram medidas. A seção spring-physics-presets é destino taxonômico; não há preset físico extraído. Oferecer alternativa reduced-motion na implementação.'),
('60fps-design-health-intro','motion-health-intro-reference','Q4-ux-motion','user-flows','onboarding-sequences','Referência de introdução com pilares temáticos, ícones e composição circular. Descrição e frame públicos disponíveis; não foram reconstruídos tempos, curvas ou sequência completa do vídeo. Não constitui fluxo interativo reproduzido nem acesso autenticado.')]

def dump(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')

def publish():
 master=json.loads((ROOT/'index/master-index.json').read_text())
 indexes={q:json.loads((ROOT/r['index']).read_text()) for q,r in master['quadrants'].items()}
 items=[]
 for key,ident,q,cat,section,spec in MANIFEST:
  evidence=ROOT/'audits/source-evidence'/key/'evidence.json'
  d=json.loads(evidence.read_text())
  assert d.get('http_status')==200 and all(v in d['views'] for v in ['desktop','mobile']),key
  location={'quadrant':q,'category':cat,'section':section,'file_path':f'{q}/{cat}/{section}/{ident}.json'}
  preview=ROOT/'previews'/ident;preview.mkdir(exist_ok=True)
  for view in ['desktop','mobile']:shutil.copyfile(evidence.parent/(view+'.png'),preview/(view+'.png'))
  license={'status':'reference_only_not_code_license','redistribution':'No source code or original downloadable assets included; screenshots are research evidence.'}
  if ident.startswith(('texture-','shape-')):license.update({'url':'https://www.fffuel.co/license/','restriction':'Generated images may be used in projects but redistribution is restricted; retain only specification and source link.'})
  if ident=='3d-kenney-city-kit-reference':license.update({'asset_license':'CC0','evidence':'Public Domain (CC0) shown on source detail page; no meshes included.'})
  audit={'visual_verified':True,'verification_scope':'source screenshots only; not local implementation fidelity','fidelity_type':'visual_spec','responsive_score':None,'audit_notes':['Tier C: reference/spec, not ready-to-use code.','Source DOM measurements may describe gallery chrome, not the referenced product.','Keyboard, contrast and animation timing not certified.'],'evidence':[str(evidence.relative_to(ROOT)),f'previews/{ident}/desktop.png',f'previews/{ident}/mobile.png'],'source_observations':{v:{'viewport':d['views'][v]['viewport'],'page_horizontal_overflow':d['views'][v]['horizontal_overflow'],'broken_images':d['views'][v]['broken_images']} for v in ['desktop','mobile']}}
  item={'id':ident,'location':location,'tier':'C','tier_audit':audit,'source_site':d['site'],'source_url':d['url'],'license':license,'stack_compatibility':['framework-agnostic-spec'],'style_tags':[section],'artifact':{'type':'visual_spec','spec':spec,'observed_headings':[h['text'] for h in d['views']['desktop']['headings'][:5]],'source_dom_evidence':str(evidence.relative_to(ROOT)),'states':{'desktop':'captured','mobile':'captured','hover':'not audited','focus':'not audited','active':'not audited','disabled':'not audited'}}}
  items.append(item)
 for name in ['aurora','waves']:
  ident='dithercn-'+name
  q='Q3-visual-atmosphere';cat='shaders-webgl';section='aurora-mesh-gradients' if name=='aurora' else 'ordered-dithering'
  comparison=json.loads((ROOT/f'previews/{ident}-local/comparison.json').read_text())
  mobile=json.loads((ROOT/f'previews/{ident}-local/comparison-mobile.json').read_text())
  audit=json.loads((ROOT/f'previews/{ident}-local/audit.json').read_text())
  assert all(not v['errors'] and not v['horizontal_overflow'] and v['http_status']==200 for v in audit.values())
  items.append({'id':ident,'location':{'quadrant':q,'category':cat,'section':section,'file_path':f'{q}/{cat}/{section}/{ident}.json'},'tier':'S','tier_audit':{'visual_verified':True,'fidelity_type':'native_registry_code_with_static_surface_comparison','responsive_score':None,'audit_notes':['Native MIT registry code preserved unchanged.','Manual comparison confirms static shader geometry, palette and dither pattern; desktop/mobile local render passes without JS errors or horizontal overflow.','Tier S requires host token and utility-CSS integration. No S+: full accessibility and animated-state audit not completed.','Pixel metrics describe the shader surface only and are supporting evidence, not an automatic tier formula.'],'comparison':comparison,'mobile_comparison':mobile,'evidence':[f'previews/{ident}-local/audit.json',f'previews/{ident}-local/comparison.json',f'previews/{ident}-local/comparison-mobile.json',f'assets/dithercn/{name}.json','assets/dithercn/LICENSE']},'source_site':'dithercn.dev','source_url':f'https://dithercn.dev/docs/backgrounds/{name}','license':{'spdx':'MIT','url':'https://github.com/opencoredev/dithercn/blob/main/LICENSE','local':'assets/dithercn/LICENSE'},'stack_compatibility':['React','TypeScript','Tailwind CSS','WebGL'],'style_tags':['dither','decorative','reduced-motion',section],'artifact':{'type':'registry_component','registry':f'assets/dithercn/{name}.json','dependencies':['assets/dithercn/dither-core.json','assets/dithercn/dither-tokens.json','React','shadcn cn utility (clsx + tailwind-merge)'],'integration':['Preserve MIT notice.','Supply Tailwind utility CSS or equivalent styles and --dither-* tokens.','Keep decorative surface aria-hidden and do not place interactive content inside it.','Validate overlaid text contrast and target device WebGL fallback.'],'local_audit_fixture':'audits/native-render-fixture'}})
 # Replace this batch by ID, preserving unrelated catalog entries.
 ids={i['id'] for i in items}
 for idx in indexes.values():
  for sections in idx['sections'].values():
   for section,existing in sections.items():sections[section]=[x for x in existing if x['id'] not in ids]
 for item in items:
  loc=item['location'];entry={k:v for k,v in item.items() if k!='artifact'}
  indexes[loc['quadrant']]['sections'][loc['category']][loc['section']].append(entry)
 for q,idx in indexes.items():
  idx['count']=sum(len(a) for c in idx['sections'].values() for a in c.values());master['quadrants'][q]['count']=idx['count']
 master['total_items']=sum(i['count'] for i in indexes.values())
 changes={i['location']['file_path']:i for i in items}
 changes.update({master['quadrants'][q]['index']:idx for q,idx in indexes.items()});changes['index/master-index.json']=master
 backup=ROOT/'audits/index-backup-before-batch';backup.mkdir(exist_ok=True)
 with tempfile.TemporaryDirectory(dir=ROOT,prefix='.publish-') as tmp:
  staged=Path(tmp)
  for rel,data in changes.items():
   dest=staged/rel;dest.parent.mkdir(parents=True,exist_ok=True);dump(dest,data)
  previous={rel:(ROOT/rel).read_bytes() if (ROOT/rel).exists() else None for rel in changes}
  for rel,raw in previous.items():
   if raw is not None:
    p=backup/rel;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(raw)
  try:
   for rel in changes:os.replace(staged/rel,ROOT/rel)
  except BaseException:
   for rel,raw in previous.items():
    if raw is None:(ROOT/rel).unlink(missing_ok=True)
    else:(ROOT/rel).write_bytes(raw)
   raise
 print(f'Published {len(items)} items; catalog total {master["total_items"]}')

if __name__=='__main__':
 with (ROOT/'.catalog.lock').open('w') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX)
  publish()
