# Auditoria Zod UI — lote inicial

Executado em 2026-11-12. Escopo: os 19 domínios únicos da lista fornecida (a matriz os descrevia como 20). Foram examinadas 42 páginas públicas, com capturas em 1440×900 e 390×844. Não é um crawl exaustivo de todos os componentes de cada domínio.

Catálogo publicado: 20 itens — 2 Tier S e 18 Tier C.

## Código reutilizável auditado

Aurora e Waves foram baixados do registry oficial dithercn com dither-core e dither-tokens. Licença MIT preservada. O código original foi empacotado em fixture React isolada e renderizado nas duas larguras, sem erros JavaScript nem overflow horizontal. Comparação manual das superfícies confirmou geometria, cores e padrões; métricas de pixels estão nos arquivos comparison*.json. Desktop: área raster comum com diferença de um pixel de arredondamento na altura, sem redimensionar imagens. Mobile: superfícies de mesmo tamanho.

O Tier S considera código original, comparação da superfície, responsividade observada e necessidade apenas de integrar tokens/utilitários CSS no host. Não é certificação WCAG ou comprovação percentual da interface inteira. Não foram validados todos os estados animados, interações sobrepostas, fallback em dispositivo sem WebGL nem integração completa em Tailwind. Por isso nenhum item recebe S+.

## Referências Tier C

Os 18 itens C são visual_specs/receitas e links com capturas da fonte. Não são componentes originais reconstituídos. Para galerias, tokens e medidas DOM pertencem à galeria; capturas do produto são referências estáticas e não garantem responsividade do produto. Contratos de teclado/ARIA são recomendações para implementação, não testes de todos os sistemas externos listados. Constantes de mola/easing não foram inventadas.

As capturas mobile de Supaste/Cloudflare mostram a ficha da galeria; o navbar alvo não aparece no primeiro viewport. As referências mobile mostradas na ficha desktop não substituem teste do componente real. O ssshape abriu no estado inicial sem pontos desenhados; este item documenta a receita/fluxo do gerador, não uma forma gerada e auditada.

## Cobertura por fonte

| Fonte | Páginas examinadas | Itens publicados | Resultado / limite |
| --- | ---: | ---: | --- |
| dithercn.dev | 3 | 2 | 2 componentes MIT com código e render local. |
| fffuel.co | 4 | 2 | Somente receitas/specs. Licença atual restringe redistribuir imagens geradas. |
| fontshare.com | 3 | 2 | Referências públicas capturadas; limites específicos no artefato. |
| poly.pizza | 2 | 1 | Referências públicas capturadas; limites específicos no artefato. |
| ambientcg.com | 3 | 1 | Referências públicas capturadas; limites específicos no artefato. |
| landdding.com | 2 | 1 | Referências públicas capturadas; limites específicos no artefato. |
| recent.design | 2 | 1 | Referências públicas capturadas; limites específicos no artefato. |
| pixlpin.com | 1 | 0 | HTTP 403 / Cloudflare. Nenhum componente extraído. |
| designdetails.io | 2 | 1 | Referências públicas capturadas; limites específicos no artefato. |
| navbar.gallery | 3 | 2 | Referências públicas capturadas; limites específicos no artefato. |
| component.gallery | 3 | 2 | Referências públicas capturadas; limites específicos no artefato. |
| prettysites.io | 2 | 1 | Referências públicas capturadas; limites específicos no artefato. |
| mahero.supply | 2 | 1 | Hero da home catalogado; template Wonderful Hero permaneceu em carregamento. |
| mobbin.com | 1 | 1 | Somente hero de marketing. Nenhuma tela ou fluxo da biblioteca privada. |
| pageflows.com | 2 | 0 | Home e diretório público de onboarding capturados. Nenhum fluxo individual completo extraído. |
| refero.design | 1 | 0 | Home pública capturada, com imagens ausentes nesta sessão. Biblioteca interna e fluxos não extraídos. |
| spottedinprod.com | 2 | 0 | Home e ficha Abode capturadas. Nenhum clipe/fluxo completo extraído. |
| fontinlogo.com | 2 | 1 | Referências públicas capturadas; limites específicos no artefato. |
| 60fps.design | 2 | 1 | Referências públicas capturadas; limites específicos no artefato. |

## Licenças e ferramentas

fffuel: uso em projetos permitido, redistribuição de imagens restrita segundo a licença capturada. Nenhum SVG original foi incorporado. Poly Pizza City Kit: CC0 mostrado na ficha; nenhum mesh baixado. Fontshare: fontes não baixadas; conferir licença específica antes da instalação. Para outras galerias, conservar referência/spec própria sem tratar acesso público como autorização para copiar código.

As documentações oficiais de design-extract/designlang, ui-extractor, dembrandt e crawl4ai foram consultadas e registradas em tool-discovery/. Os CLIs/MCPs não estavam instalados/conectados e não foram executados. O fallback usado foi HTTP para registry/documentação e Playwright isolado para DOM e screenshots. Não foram acessadas sessões autenticadas nem comprados assets.

O preview compartilhado retornou viewport inconsistente após redimensionamentos; essas capturas foram descartadas e substituídas por Playwright com dimensões medidas. Nenhum login/cookie/storage-state foi salvo no catálogo.

## Evidências e reprodução

- `source-evidence/*/evidence.json`: URL, status HTTP, viewport, observações DOM e origem de cada captura.
- `../previews/`: screenshots por item e comparações dos shaders.
- `native-render-fixture/README.md`: reprodução local do código MIT.
- `../scripts/validate_catalog.py`: integridade dos índices.
- `../scripts/ingest_sources.py`: descoberta limitada das homes; as páginas internas deste lote estão enumeradas em coverage.json.

Limites da auditoria: verificações automatizadas de overflow e erro de runtime, mais inspeção visual. Não foram executados testes completos de contraste, teclado, leitor de tela, todos os assets remotos ou fluxos autenticados.
