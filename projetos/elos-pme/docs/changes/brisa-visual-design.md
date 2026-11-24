# Entrega — composição visual Brisa

2026-11-12. Continuação solicitada pelo operador para composição e desenho refinados do aplicativo. Implementação local na branch codex/brisa-zod-p1, preservando o incremento de proteção de edição. Sem novos agentes, commit, push ou deploy.

## Resultado

Marca e ícones SVG próprios, tipografia e tokens unificados, sidebar em turquesa profundo e workspace claro. Desktop tem resumo operacional compacto, listas de propostas com ações contextuais, cards de cliente e agenda com datas para varredura. Mobile tem navegação inferior com áreas seguras; no editor, ações fixas substituem a barra de navegação. Editor com três seções e resumo lateral, login editorial e documento público com identidade, total e decisão explícita.

Equipamentos passa a priorizar consulta e histórico; cadastro é disclosure e editar abre/preenche o formulário existente. Busca de cliente vazia oferece limpar. Rascunho sem publicação não apresenta revogação. FAQ mantém resumo acessível. Aplicação usa as APIs existentes; sem schema, bibliotecas ou ativos externos novos. SVGs/CSS são originais. Referências de primitivas A do catálogo informam estados; não foram copiadas.

- [Direção e tokens](../design/BRISA-VISUAL-DIRECTION.md)
- [Apresentação navegável](../../BRISA_VISUAL_COMPOSITION.html)
- [Manifesto das capturas](../evidence/brisa-visual/manifest.json)
- [Blueprint e proveniência](../../ZOD_UI_BLUEPRINT.md)

A apresentação contém 10 cenas extraídas do HTML/CSS da build real e selecionáveis por abas. É um artefato estático para revisão visual, sem chamadas a APIs, cookies ou tokens; não simula que os controles internos são o aplicativo. O aplicativo executável contém a implementação funcional. Os PNGs registram a build; a apresentação usa HTML para conservar a nitidez da tipografia ao dimensionar as telas.

## Verificação executada

- TypeScript sem emit/incremental: passou após alterações finais de implementação.
- 22 testes existentes de domínio, operações e treinamento: passaram na base própria brisa_zod_p1_tests, porta 55448. Não foi executado npm test histórico contra outra instalação.
- Build real com scripts/verified-build.ts e Webpack: passou, incluindo TypeScript, páginas e traces de build. Banco próprio permaneceu ativo; dev encerrado antes da build.
- Preview da apresentação em 728px: sem mensagens de console; conteúdo verificado visualmente. O artefato usa HTML e CSS locais, sem servidor próprio para sua visualização.
- Browser real: Orçamentos e editor em desktop/mobile/tablet; Agenda, Clientes, OS/quadro, Equipamentos, Configurações, Inbox e Guia em mobile; login e portal em desktop/mobile. Viewports exercitados: 360×800, 390×844, 768×960 e 1440×960. Não houve overflow da página nos estados medidos.
- Selecionar cliente e alterar itens → resumo R$960 → salvar rascunho → retomar/publicar → confirmar aprovação no portal mobile → OS visível. PDF respondeu HTTP200/application/pdf. Uma OS por proposta aceita confirmada pela leitura do painel; concorrência coberta pela suíte de domínio.
- Barra inferior aciona a proteção de edição: trocar de área com formulário alterado mostra guard; descartar executa navegação. No editor mobile, ações fixas cabem na largura e a barra inferior fica recolhida. Busca e ajuda com ícones mantêm nomes acessíveis.
- Mais ações da proposta abre e fecha por Escape; rascunhos não exibem esse menu. Equipamento existente abre o formulário preenchido. Nenhum botão visível sem nome foi encontrado nas páginas mobile medidas.
- Capturas finais da produção não contêm Next devtools. Um timeout de clique em dev ocorreu por sobreposição do devtools ao primeiro destino mobile; contornado pelo menu e ausente na build de produção.
- Pares sólidos de contraste calculados no documento de direção; borda de campo/branco 3,14:1. Sem alegar auditoria WCAG completa ou auditoria dos três temas.
- git diff --check e links locais verificados. designlang/verify_ui não disponível entre as ferramentas; nenhuma execução alegada.

## Reprodução e limites

Container próprio brisa-zod-audit-db, app 3028, base de demonstração e base de testes separadas. Dados adicionais são fictícios: Clínica Costa Verde, Casa do Bosque e Ateliê Oliveira. Três propostas foram criadas nas APIs existentes para compor/testar listas; outra proposta foi criada na UI para exercer publicação e aceite. Nenhum dado anterior foi apagado nem processo/banco alheio utilizado.

Para abrir a build local, nesta pasta:

```bash
docker start brisa-zod-audit-db
PATH="$PWD/node_modules/node/bin:$PATH" npm run start -- --port 3028
```

Não executar seed/reset para consultar. Configuração privada permanece em arquivo ignorado pelo Git. O servidor e o banco desta execução foram parados ao terminar; container, dados e build preservados.

Leitor de tela, teclado virtual/Safari/iOS, zoom 200%, temas alternativos completos e falhas extensas de rede continuam pendentes. As caixas nativas de confirmação de ações destrutivas existentes permanecem; o agrupamento dessas ações foi redesenhado. Não foram introduzidos financeiro, pagamentos, multiempresa, recorrência ou integrações simuladas. Identidade visual refinada não substitui homologação com o público comprador.
