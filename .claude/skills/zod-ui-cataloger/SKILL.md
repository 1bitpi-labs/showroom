---
name: zod-ui-cataloger
description: Extrai e cataloga referências UI/UX no Zod UI, com auditoria desktop/mobile e classificação S+ a F. Use para alimentar ou auditar o catálogo.
---

# Zod UI — extração e curadoria

Localize `zod-ui-catalog/` na raiz do workspace. Se o projeto alvo estiver em outro diretório, use o caminho compartilhado informado pelo usuário; neste ambiente é `/home/caueantonacci/showroom/zod-ui-catalog`. Não inicialize um catálogo vazio para substituir o compartilhado. Leia `index/master-index.json` para a taxonomia completa; não invente categorias silenciosamente.

## Roteamento

- dithercn.dev, fffuel.co, fontshare.com, poly.pizza, ambientcg.com: prefira registry, manifests, llms-full.txt, APIs, CSS e receitas SVG disponíveis. Destino Q3.
- landdding.com, recent.design, pixlpin.com, designdetails.io: design-extract/designlang para layouts, tokens e blueprints; Q1/Q4.
- navbar.gallery, component.gallery, prettysites.io, mahero.supply: ui-extractor/uix_learn para componentes DOM/CSS, specs e código; Q1/Q2.
- mobbin.com, pageflows.com, refero.design, spottedinprod.com, fontinlogo.com, 60fps.design: dembrandt para sessões e fluxos; Q2/Q3/Q4.
- Descoberta em lote: firecrawl ou crawl4ai, sitemap e fila deduplicada com rate limits.

Esses nomes são rotas preferenciais, não prova de ferramentas instaladas. Antes de executar, consulte documentação oficial atual, disponibilidade, opções CLI e endpoints reais. Nunca invente comandos ou resultados. Use sessão existente autorizada; guarde storage-state fora do repositório. Registre licença e atribuição; acesso público não implica licença para copiar código. Sem licença conhecida, mantenha apenas referência/spec própria e marque a limitação.

## Extração e auditoria

1. Extraia artefato, origem, licença, tokens e estados. Preserve dependências CSS usadas; remova tracking e scripts desnecessários sem destruir o componente.
2. Renderize em ambiente isolado. Use `scripts/visual_tier_grader.py` com URL local e diretório de saída para capturas 1440x900 e 390x844. Compare referências da mesma viewport, conteúdo e estado; registre diferenças de fontes e animação.
3. Inspecione grid, overflow, legibilidade, contraste, teclado, foco, estados e tokens. Screenshots e similaridade de pixels não comprovam acessibilidade ou fidelidade semântica.
4. Atribua S+ (>98%), S (92–98%), A (85–<92%), B (75–<85%) somente com comparação documentada; estes percentuais são critérios de curadoria, não o score de pixels do script. S+ exige também código semântico, responsividade, tokens e evidência de acessibilidade AA. C é visual_spec de imagem/vídeo sem código; D tem degradação; F falha de render ou licença incompatível. Sem evidência, registre auditoria pendente e não atribua tier alto.
5. Grave `<quadrant>/<category>/<section>/<id>.json` contendo id, location (quadrant/category/section/file_path), tier, tier_audit (visual_verified, fidelity_type, responsive_score, audit_notes, evidence), source_site, license, stack_compatibility, style_tags e artifact/spec/tokens. Use IDs únicos. Previews: `previews/<id>/desktop.png` e `mobile.png`.
6. Atualize a lista da seção no índice correspondente e contadores do master. Prepare arquivos temporários e substitua com rename sob lock exclusivo; mantenha backup e recupere falhas entre renames antes de liberar o catálogo. Execute `scripts/validate_catalog.py`. Nunca indexe como verificado um item não renderizado. D/F ficam em quarentena lógica e nunca são candidatos de implementação.

## Referência operacional

Para exemplos de invocação, persistência, limites dos scripts e reprodução dos lotes, consulte `zod-ui-catalog/docs/OPERATING-GUIDE.md` na raiz compartilhada. Os scripts de lote têm manifestos fixos; não são ingestores genéricos de URLs. Dependências, demos e variantes não contam como novos componentes.
