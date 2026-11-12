# Zod UI — guia de extração, busca e reutilização

## O que cada skill faz

| Necessidade | Skill | Resultado |
| --- | --- | --- |
| Alimentar o catálogo com uma fonte, componente ou categoria | [zod-ui-cataloger](../../.claude/skills/zod-ui-cataloger/SKILL.md) | Artefato, licença, evidências, classificação e índices atualizados |
| Avaliar uma UI ou selecionar componentes para um projeto | [zod-ui-architect](../../.claude/skills/zod-ui-architect/SKILL.md) | Diagnóstico, seleção rastreável, tokens unificados e ZOD_UI_BLUEPRINT.md |
| Implementar a seleção quando isso fizer parte do pedido | zod-ui-architect | Componentes integrados e verificações do projeto |

A skill de arquitetura respeita o escopo pedido: uma revisão de UI entrega diagnóstico e blueprint; a implementação ocorre quando solicitada. Um tier alto não justifica aplicar um efeito que prejudica a tarefa do usuário.

As skills estão em `.claude/skills/` neste repositório. A descoberta automática depende do agente utilizado; não foram instaladas globalmente em todos os CLIs. Para outro projeto ou outra thread, forneça os caminhos absolutos da skill e do catálogo. A thread do Brisa recebeu esses caminhos explicitamente.

Neste ambiente:

- Raiz compartilhada: `/home/caueantonacci/showroom/zod-ui-catalog`.
- Skill 1: `/home/caueantonacci/showroom/.claude/skills/zod-ui-cataloger/SKILL.md`.
- Skill 2: `/home/caueantonacci/showroom/.claude/skills/zod-ui-architect/SKILL.md`.

Não copie o banco para cada projeto: consulte a raiz compartilhada e leve para o projeto somente o código selecionado, dependências necessárias, licença e contrato de adaptação.

## Como pedir uma extração

> Use a skill zod-ui-cataloger em /home/caueantonacci/showroom/.claude/skills/zod-ui-cataloger/SKILL.md. Extraia componentes de navegação da fonte X para o catálogo compartilhado /home/caueantonacci/showroom/zod-ui-catalog. Verifique origem e licença, renderize desktop/mobile, audite estados e publique apenas os itens com evidências. Registre os bloqueios e os ajustes necessários.

### Fluxo da extração

1. **Definir o lote:** URLs, tipos de componente e limite de páginas/itens. Descobrir rotas públicas reais e deduplicar; não tratar uma home de galeria como código do produto exposto nela.
2. **Verificar a fonte:** disponibilidade, licença do código e dos assets, atribuição e dependências. Uma imagem de galeria permite estudar uma composição; não prova licença para redistribuir código, fonte ou modelo.
3. **Escolher o método:** registry/API/documentação oficial quando disponível; DOM/CSS quando pertinente; imagem/vídeo como referência. Consulte o roteamento da Skill 1. Designlang, ui-extractor, dembrandt e crawl4ai são opções condicionadas à disponibilidade, não etapas que se pode afirmar ter executado sem evidência.
4. **Extrair sem perder origem:** preservar snapshot do registry/código permitido, URL e licença; registrar hash quando houver código. Manter dependências e demos separados do item contado. Não guardar sessões ou segredos no catálogo.
5. **Montar ambiente de teste:** integrar dependências, tokens e estilos do host. Preservar código de origem e documentar wrappers, aliases, fontes e ajustes. Não carregar tracking desnecessário no render local.
6. **Capturar fonte e implementação:** desktop 1440×900 e mobile 390×844, com conteúdo/estado compatíveis. Separar screenshots de viewport das superfícies dos componentes. Qualquer normalização de largura ou crop precisa constar na evidência; imagens não devem ser esticadas para fabricar semelhança.
7. **Auditar:** runtime, overflow, ativos, hierarquia, legibilidade, tokens e interações pertinentes. Testar foco, teclado, disabled e reduced-motion onde aplicável. Uma captura de galeria no mobile não comprova responsividade do componente original.
8. **Classificar manualmente:** ler o código e comparar os renders; registrar pendências. O script fornece evidências, não uma nota automática. Sem render ou evidência suficiente, manter o candidato fora da seleção de itens prontos.
9. **Persistir:** dar ID único, escolher Quadrante → Categoria → Seção, gravar artefato e evidências, atualizar o índice do quadrante e contadores do master sob lock, staging e recuperação de falha. Validar antes de concluir.

### Como executar os recursos existentes

Os comandos abaixo partem da raiz `/home/caueantonacci/showroom` e requerem Python 3. O validador e a busca usam somente a biblioteca padrão. Os renderizadores exigem Playwright, Pillow e Chromium em um ambiente Python isolado.

```sh
python3 zod-ui-catalog/scripts/validate_catalog.py
python3 zod-ui-catalog/scripts/visual_tier_grader.py --help
```

Exemplo de auditoria de uma URL local já disponível:

```sh
python3 zod-ui-catalog/scripts/visual_tier_grader.py \
  --url http://127.0.0.1:3000 \
  --output zod-ui-catalog/previews/novo-candidato
```

`--browser-executable` permite informar um Chromium existente; `--reference DIRETORIO` compara desktop.png/mobile.png. O renderer geral salva screenshots de página inteira, que podem exceder a altura da viewport. O lote 2 usa capturas de viewport fixas e superfícies separadas.

**Limites dos scripts:** `ingest_sources.py` descobre/captura uma lista fixa de homes; não é crawler universal. `prepare_batch2.py`, `audit_batch2.py` e `publish_batch2.py` são reprodução do lote 2, com manifesto fixo. Não use os publishers desses lotes para inserir automaticamente um site arbitrário. Para um lote novo, prepare manifesto, evidências e revisão específicos. A reprodução existente está em [fixture/README.md](../audits/batch-2/fixture/README.md).

## Como os componentes são categorizados

A fonte de verdade da taxonomia e das contagens é [master-index.json](../index/master-index.json). Os diretórios podem existir sem itens: pasta criada não significa componente disponível.

| Quadrante | Conteúdo | Índice | Exemplos presentes |
| --- | --- | --- | --- |
| Q1-structure-nav | Navegação, blueprints e shells | q1-structure-nav.json | navbar-cloudflare-mega-menu (C) |
| Q2-conversion-content | Heroes, conteúdo, formulários e overlays | q2-conversion-content.json | shadcn-input, shadcn-tabs, shadcn-dialog (A) |
| Q3-visual-atmosphere | Shaders, SVG, tipografia e materiais | q3-visual-atmosphere.json | dithercn-aurora (S), dithercn-plasma (A) |
| Q4-ux-motion | Fluxos, microinterações e contratos acessíveis | q4-ux-motion.json | shadcn-button, shadcn-slider (A) |

No lote 2 foram documentadas seis novas seções: `status-badges`, `authentication-cards`, `text-inputs`, `toggle-controls`, `progress-feedback` e `range-controls`. Novas seções devem ser justificadas e adicionadas tanto ao mapa do master quanto ao índice correspondente; não renomeie IDs existentes para esconder uma mudança de classificação.

## O que significa cada tier

| Tier | Uso esperado | Cuidados |
| --- | --- | --- |
| S+ | Pronto com evidência visual, responsividade, tokens e acessibilidade aprofundada | Nenhum item atual recebeu este tier |
| S | Alta aderência visual e código reutilizável; integração leve do host | Conferir tokens, container, dependências e limites da auditoria |
| A | Código e estrutura sólidos, com adaptação explícita | Ajustar tema, fonte, parâmetros, estados ou portabilidade registrados |
| B | Base que exige correções estruturais | Último recurso, com trabalho de correção no blueprint |
| C | Visual_spec, receita ou referência parcial | Não é código pronto nem prova de fluxo completo |
| D | Degradado | Excluído da seleção de implementação |
| F | Rejeitado/quarentena | Excluído da seleção de implementação |

Os intervalos percentuais da Skill 1 são referências de curadoria. Não converta score de pixels em “percentual de qualidade” ou fidelidade da página inteira. Sem uma medição definida, não invente um percentual. `visual_verified: true` deve ser lido junto de `fidelity_type`, escopo e notas: em um C pode indicar apenas que a fonte foi capturada e inspecionada. `responsive_score: null` significa que não foi calculado um score numérico.

## Onde ficam os artefatos reutilizáveis

```text
zod-ui-catalog/
  index/master-index.json                  # roteamento e contagem
  index/q*.json                            # metadados por seção
  Q*/<categoria>/<seção>/<id>.json          # contrato do item + payload artifact
  assets/<fonte>/*.json                    # snapshots de código/registry permitidos
  assets/<fonte>/LICENSE                   # atribuição e licença
  previews/<id>/                          # renders, superfícies e audit.json
  audits/                                 # relatórios, revisão, hashes e limites
  scripts/                                # busca, validação e ferramentas de auditoria
```

Para um item S/A, o JSON do quadrante aponta em `artifact.registry` para o snapshot com código. O campo `artifact.dependencies` identifica dependências; `artifact.demo_registry`, quando presente, aponta para o exemplo. O arquivo do item não é necessariamente um módulo pronto para importar diretamente.

Exemplo real: `shadcn-dialog` está em `Q2-conversion-content/forms-overlays/command-palettes-modals/shadcn-dialog.json`; seu registry é `assets/shadcn/dialog.json`, e o demo é `assets/shadcn/dialog-demo.json`. Examine os `files` do registry, dependências e licença antes de materializar no projeto. A fixture demonstra uma integração possível; não substitui a integração do produto.

## Como pedir a busca e o uso em um projeto

> Use a skill zod-ui-architect em /home/caueantonacci/showroom/.claude/skills/zod-ui-architect/SKILL.md para avaliar a UI do projeto /caminho/do/projeto. Consulte o catálogo /home/caueantonacci/showroom/zod-ui-catalog, inspecione desktop/mobile, selecione componentes aderentes e crie ZOD_UI_BLUEPRINT.md com justificativas, tokens e adaptações. Neste pedido, entregue diagnóstico e seleção.

Quando também quiser implementar, acrescente: “Implemente a seleção, preserve as regras locais e execute as verificações apropriadas do projeto.”

### Fluxo da busca

1. **Entender o produto e a stack:** ler instruções locais, documentação, package.json, estilos e tokens. Inspecionar a UI real quando o pedido for uma revisão visual; distinguir protótipo de aplicação.
2. **Decompor em slots:** por exemplo navegação, formulário, tabs, feedback de progresso e diálogo. A necessidade de uso vem antes do efeito visual.
3. **Ler o master:** localizar quadrantes e seções relevantes; abrir somente os índices correspondentes.
4. **Filtrar:** aderência funcional/visual, tier, stack, licença, evidências e custo de adaptação. Preferir S/S+, depois A; ler notas antes de escolher. C só como referência. Não preencher uma lacuna com um shader apenas porque ele é S.
5. **Ler os finalistas:** abrir o artefato completo, código/dependências e previews; confirmar o que foi de fato testado. Compatibilidade textual é uma pista, não um teste de build no projeto alvo.
6. **Criar contrato:** escrever ZOD_UI_BLUEPRINT.md na raiz do projeto alvo com tokens unificados e matriz `Slot | Quadrante/Categoria/Seção | ID Zod UI | Tier | Origem | Adaptação Necessária`. Registrar lacunas e candidatos descartados relevantes.
7. **Reutilizar quando solicitado:** integrar apenas os arquivos necessários, preservar licença, ajustar tokens e imports e validar build, mobile e estados do produto. Registrar no blueprint a origem e as alterações. Uma alteração local não promove o item no catálogo; para atualizar sua auditoria, voltar à Skill 1.

### Consultas reproduzíveis

A ferramenta de consulta é somente leitura e resolve o catálogo pela localização do próprio script. Assim, funciona mesmo quando chamada de outro projeto por caminho absoluto. Por padrão retorna apenas S+/S/A, ordenados por tier e ID.

```sh
# Controles de texto compatíveis com React
python3 zod-ui-catalog/scripts/query_catalog.py \
  --quadrant Q2 --category forms-overlays --section text-inputs --stack React

# Slots de microinteração, sem abrir os outros quadrantes
python3 zod-ui-catalog/scripts/query_catalog.py \
  --quadrant Q4 --category micro-interactions --tier A

# Referências de navbar também podem ser úteis, mas não são código pronto
python3 zod-ui-catalog/scripts/query_catalog.py \
  --quadrant Q1 --category navbars --references

# Abrir explicitamente o payload de um finalista
python3 zod-ui-catalog/scripts/query_catalog.py \
  --id shadcn-dialog --artifact --json
```

Use `--search termo` para procurar em ID, origem, categoria, seção e tags; isso não faz busca semântica nem lê todo o código. `--tag` aceita tags exatas e pode ser repetido (AND). `--catalog /outra/raiz` seleciona outro banco. `--limit` limita os resultados e a saída informa quantos candidatos existem. Consulta por `--id` pode mostrar qualquer tier para inspeção; isso não autoriza usar D/F. Resultado vazio é uma lacuna a documentar ou um pedido de nova extração, não motivo para inventar um ID.

## Processo executado e estado conhecido

Até os dois primeiros lotes: 53 itens, sendo 14 S, 20 A e 19 C. Esses números descrevem o estado documentado; consulte o master para o estado atual.

- **Lote 1:** 19 domínios e 42 páginas públicas examinados. Publicados 2 componentes MIT S e 18 referências C. Ferramentas preferenciais foram pesquisadas; a execução usou HTTP e Playwright, sem alegar execução de CLIs/MCPs ausentes.
- **Lote 2:** mais 20 shaders e 12 componentes shadcn com código MIT, em 64 renders locais, acompanhados por capturas da fonte, revisão manual e testes de estados. Publicados 12 S, 20 A e um C com sumário público histórico do onboarding Revolut.
- **Bloqueios preservados:** Pixlpin com 403; Refero com login; telas adicionais de Page Flows com paywall; Mahero com template pago. Não foram contados como extrações completas.
- **Restrição do fffuel:** a licença capturada permite uso em projetos, mas restringe redistribuição dos assets gerados. Foram guardadas receitas/specs e links, não SVGs originais redistribuídos.
- **Cobertura desigual:** há mais atmosfera WebGL e primitivas React do que shells, tabelas e fluxos de aplicação. A seleção de design deve reconhecer essa lacuna.

Leia [estado atual](../audits/REPORT.md), [relatório histórico do lote 1](../audits/REPORT-batch-1.md), [relatório do lote 2](../audits/batch-2/REPORT.md) e [revisão manual](../audits/batch-2/manual-review.json) para as evidências e limitações. O catálogo é persistido em arquivos versionáveis. Commits e PRs devem incluir skills, índices, artefatos permitidos, licenças, documentação e evidências, preservando os arquivos gerados e segredos fora do versionamento.

## Critério de conclusão de um lote

O lote está pronto quando IDs e caminhos são consistentes, todos os artefatos/evidências referenciados existem, licenças e dependências estão declaradas, os tiers têm justificativa, contagens e taxonomia fecham, e os bloqueios aparecem no relatório. `validate_catalog.py` verifica estrutura, contagens e correspondência índice/artefato; ele não executa browser, não comprova licença e não certifica acessibilidade.
