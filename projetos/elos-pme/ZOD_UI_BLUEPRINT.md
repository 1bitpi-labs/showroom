# ZOD UI BLUEPRINT — Brisa Oficina

Contrato de curadoria, 2026-11-12. Escopo: diagnóstico e direção para implementação posterior. Nenhuma alteração de interface autorizada neste documento por si só.

## Alvo e evidência

ElosPME é o produto Next.js 16.4.6 / React 19 / TypeScript / PostgreSQL / Better Auth, uma empresa por instalação. App Router, APIs com validação Zod e domínio transacional. CSS global próprio; sem Tailwind, Radix, biblioteca de ícones ou motion declarados no package.json. Dashboard concentra navegação, propostas, OS e configurações; OperationsPanel concentra clientes, equipamentos e visitas.

Fontes lidas: AGENTS.md, README.md, STATUS.md, docs/INDEX.md, PRD.md, DESIGN-SYSTEM.md, ARCHITECTURE.md; globals.css, dashboard.tsx, portal público e OperationsPanel. O HTML docs/prototype/brisa-oficina-reference.html usa Tailwind CDN, Lucide e fontes remotas e contém simulações: é referência, não o executável nem prova de integração.

Inspeção atual concluída em instância isolada: porta 3028 e PostgreSQL próprio 55448, container brisa-zod-audit-db; npm ci, migração e seed locais. UI examinada no preview em 1280×800 e 360×800, com verificação adicional em 768×900. A indisponibilidade inicial de 3017 foi superada sem tocar instâncias alheias. Cobertura, achados e limites em [docs/ZOD_UI_DESIGN_DIAGNOSIS.md](docs/ZOD_UI_DESIGN_DIAGNOSIS.md); capturas em [docs/evidence/zod-ui-audit/manifest.json](docs/evidence/zod-ui-audit/manifest.json). As capturas antigas do README não são prova do estado atual. Não houve alteração de UI ou execução de build nesta etapa.

## Diagnóstico priorizado

| Prioridade | Evidência e certeza | Impacto | Direção e critério de aceite futuro |
| --- | --- | --- | --- |
| P1 | Reproduzido no browser mobile: preencher cliente em proposta nova, trocar de aba e voltar descarta conteúdo; navigate chama setForm(null) | Trocar aba descarta proposta em edição | Aviso de alterações não salvas, opção permanecer/descartar; testar orçamento preenchido e troca via menu e busca |
| P1 | globals.css :root usa Arial, ink #123047/paper #f4f8fa; .brisa-app usa Inter/system, ink #0f172a/paper #f8fafc | Login/portal e operação têm contratos distintos; manutenção favorece regressões | Aliases unificados em todas as superfícies, conservar variantes semânticas explícitas |
| P1 | Agenda atual mobile: formulário em y=350 e lista em y=1240; confirmado por DOM e captura | Consulta da próxima visita exige atravessar cadastro | Lista por dia primeiro, botão Agendar abre editor; preservar vínculos, fuso e campos em erro |
| P1 | Código do portal exige checkbox de decisão, servidor preserva revisão e total | Simplificar demais o aceite pode remover consentimento ou contexto | Total, revisão, validade, condições e decisão juntos; confirmação explícita; erro preserva entrada e retry mantém idempotência |
| P2 | dashboard usa confirm nativo em revogação/cancelamento | Explicação e recuperação inconsistentes | Diálogo contextual com identificação e consequência; cancelar como saída inicial, motivo onde domínio exige |
| P2 | Ícones da navegação são caracteres Unicode no dashboard | Peso e desenho variam por plataforma | Pequeno conjunto SVG original consistente com rótulos; ícones decorativos ocultos do leitor |
| P2 | Captura histórica desktop repete quatro ações por proposta; CSS atual ainda organiza .quote em grid | Competição visual entre consulta e ações excepcionais | Principal: abrir detalhe; histórico visível; secundárias agrupadas com teclado; cancelamento separado |
| P2 | Há role=status/alert e loading textual no código | Base acessível existente; não há prova de cobertura completa | Preservar anúncios, diferenciar vazio inicial/sem resultado/erro/carregando; retry mantém filtros |

## Direção visual e tokens

Identidade: oficina organizada, leve e confiável. Conservar turquesa e papel claro fundamentados no produto. Evitar aparência de landing page ou dashboard financeiro: não há caixa/faturamento implementado.

Contrato original Q1; não há shell aderente no catálogo. Aliases: --bg=#f8fafc (--paper), --fg=#0f172a (--ink), --primary=#00777a (--teal), --muted=#526174, --border=#e2e8f0 (--line), --surface=#ffffff, --input-border=#94a3b8, --focus=#00777a. Marca configurável azul #285b8a/ameixa #73437e requer validar todos os pares antes de liberar; snapshots anteriores preservam cor.

Semânticos propostos: success texto #166534/fundo #dcfce7; warning #854d0e/#fef9c3; danger #991b1b/#fee2e2; info #1e40af/#dbeafe. Sempre texto de status, nunca cor isolada. Verificar 4,5:1 para texto normal e 3:1 para componentes/foco na implementação; valores são proposta, não certificação.

Tipografia system-ui, Inter somente se localmente disponível; sem baixar fonte por decoração. Corpo 14px desktop/16px em campos mobile, auxiliar mínimo 12px, line-height 1.5, títulos 24/28px e seções 18/20px. Valores e horários tabular-nums; moeda alinhada à direita.

Espaçamento 4/8/12/16/24/32px. Sidebar 248px, conteúdo até 1440px, margem 32 desktop/16 mobile; grid 12 colunas desktop, 1 coluna abaixo de 760px. Formulário até 800px, pares de campos somente quando legíveis. Raio controle 10px, card 16px, modal 18px; sombra discreta só em sobreposição. Linha de tabela 56px e toque mínimo 44px. Cabeçalhos claros; não reduzir tipografia para aumentar densidade.

Hover: mudança suave de superfície; foco 3px com offset 3px e sem corte; active com texto/aria-current ou aria-pressed conforme semântica; disabled com razão textual se necessário. Erro junto ao campo com aria-describedby e resumo focável; não limpar valores. Salvando bloqueia duplicação e anuncia andamento; sucesso só após API. Skeleton apenas com dimensões estáveis, sem progressos fictícios. Motion 120–180ms em opacidade; reduced-motion remove deslocamentos e transições não essenciais.

## Slots e curadoria

Master e índices Q1/Q2/Q4 consultados diretamente no checkout raiz. 53 itens, 14 S, 20 A, 19 C conforme relatórios locais. S é qualidade do artefato, não adequação ao ERP. Q3 excluído por não haver necessidade observável de shaders. Nenhum C selecionado como código. Q1 dashboard-sidebars/mobile-drawers vazios: shell, tabela operacional, agenda e jornadas serão originais.

Preferir portar o contrato visual dos candidatos para CSS próprio e componentes nativos existentes. Copiar registry exige Tailwind v4, utilitário cn, clsx/tailwind-merge, e conforme componente radix-ui/class-variance-authority/lucide-react/tw-animate-css; não estão instalados. React/TS são compatíveis conceitualmente; nenhuma integração compilada foi verificada. Não adicionar toda a stack para obter uma borda ou badge.

| Slot | Quadrante/Categoria/Seção | ID Zod UI | Tier | Origem | Adaptação Necessária |
| --- | --- | --- | --- | --- | --- |
| Shell e navegação móvel | Q1/shells-footers/dashboard-sidebars; navbars/mobile-drawers | — | — | original | Manter dialog nativo, foco de retorno, menu nomeado, rota/aba ativa |
| Tabelas, agenda e editor de itens | Q1/estrutura operacional (lacuna) | — | — | original | HTML semântico; cards mobile com mesmos campos; não inventar categoria existente |
| Ações | Q4-ux-motion/micro-interactions/tactile-button-states | shadcn-button | A | https://ui.shadcn.com/view/new-york-v4/button-demo | Portar tokens para CSS próprio; preservar semântica; 44px e loading real |
| Status de proposta/OS | Q2-conversion-content/pricing-proof/status-badges | shadcn-badge | A | https://ui.shadcn.com/view/new-york-v4/badge-demo | Portar tokens para CSS próprio; preservar semântica; texto e paleta por estado |
| Campos e busca | Q2-conversion-content/forms-overlays/text-inputs | shadcn-input | A | https://ui.shadcn.com/view/new-york-v4/input-demo | Portar tokens para CSS próprio; preservar semântica; label, erro, inputmode e 16px mobile |
| Condições/observações | Q2-conversion-content/forms-overlays/text-inputs | shadcn-textarea | A | https://ui.shadcn.com/view/new-york-v4/textarea-demo | Portar tokens para CSS próprio; preservar semântica; altura inicial 96px e descrição associada |
| Cliente e confirmação | Q2-conversion-content/forms-overlays/command-palettes-modals | shadcn-dialog | A | https://ui.shadcn.com/view/new-york-v4/dialog-demo | Portar tokens para CSS próprio; preservar semântica; título, Escape, trap e retorno de foco; manter dialog nativo quando suficiente |
| Progresso de leitura | Q4-ux-motion/micro-interactions/progress-feedback | shadcn-progress | A | https://ui.shadcn.com/view/new-york-v4/progress-demo | Portar tokens para CSS próprio; preservar semântica; valor calculado da API; não usar timer do demo |

Licença dos seis candidatos: MIT, arquivo compartilhado assets/shadcn/LICENSE lido; preservar copyright ao copiar porções substanciais. Artefatos registry e audit.json consultados; previews desktop/mobile referenciados existem no catálogo, mas previews mobile dos seis e modal aberto examinados nesta continuação; revisão visual desktop individual ainda não repetida. O preview inicial mobile do dialog exibia só o gatilho; a continuação examinou também mobile-dialog-open.png, com título, descrição, foco e cancelar/salvar. O relatório registra teste de trap/Escape, sem substituir teste no Brisa. Hashes SHA-256 dos seis registries conferidos e código lido integralmente; adaptar altura padrão de 36px do Button para 44px, tradução Close e limites do modal. Não há promessa plug-and-play nem WCAG completa.

Descartes: tabs A não substitui navegação principal; switch A não representa aceite explícito; slider A inadequado para preço/BTU/duração precisos; card de autenticação A não entrega autenticação; accordion A opcional para guia, sem necessidade de migração agora. Referências C Supaste/Cloudflare/Fern/Bem são marketing/mega-menu, sem aderência ao fluxo. Shaders S/A, cenas 3D, ruído e scroll reveals aumentam distração sem resolver consulta, edição ou decisão; excluídos. Não reutilizar ativos C cuja licença é somente referência.

## Composição por tela

| Tela | Composição proposta e prioridades |
| --- | --- |
| Orçamentos | Cabeçalho + Novo; busca e filtros antes de métricas; lista código/cliente/status/revisão/total; editor cliente → itens → condições/validade → resumo; publicar explica revisão e compartilhamento manual |
| Portal público | Marca/selo demo, cliente e revisão, itens e total, validade/condições, decisão e checkbox explícito; estados expirado/revogado/decidido e retry claros; sem distrações de navegação interna |
| OS | Lista padrão e quadro opcional; cliente/código/status e próxima ação; início/conclusão/cancelamento com confirmação coerente; não confundir conclusão de visita |
| Clientes | Busca e carteira primeiro, Novo cliente, modal de edição; contato e contagens; vazio com cadastro, sem resultado com limpar busca |
| Equipamentos | Busca/cliente, identificação/modelo/BTU/local/manutenção; editor progressivo; histórico de visitas; data de manutenção informada não promete recorrência |
| Agenda | Hoje/próximas visitas por dia; cliente/técnico/horário/duração/status; Agendar em editor; fuso explícito; conflito próximo do campo e sem perder preenchimento |
| Caixa de entrada | Não lidas e progresso calculado; guias concluídos/repetir; sem equiparar leitura a certificação |
| Configurações | Nome/cor + prévia; salvar e feedback; avisar que documentos anteriores são preservados |
| Guia e treinamento | Ajuda contextual curta, guia acessível e vídeo opcional; saída sempre disponível; concluir leitura exige ação explícita |
| Login | Formulário simples, labels persistentes, credenciais incorretas recuperáveis, submit pendente; mesmos tokens do portal |

## Prioridades confirmadas após browser

P1: proteger edição não salva; nomear dialog de cliente com aria-labelledby; colocar consulta da Agenda antes do formulário; reduzir predominância do resumo/cabeçalho na rotina. P2: retirar Revogar link de rascunhos sem link; associar avisos à entidade/aba; saída visível dos modais; campos mobile 16px e alvos 44px; orientar recuperação de link indisponível. Evidências e aceites D01–D11 no diagnóstico.

Contrato do modal: dialog nativo mantém Escape/trap e retorno ao trigger, h2 com id associado, descrição curta, fechar no topo e rodapé acessível. Ajuda contextual não deve receber foco inicial por padrão. Não trocar dialog nativo por Radix como pré-requisito para corrigir semântica.

## Sequência executável posterior

1. Preparação concluída nesta inspeção; para reproduzir, usar instalação isolada com Node 22+, dependências e PostgreSQL próprios seguindo README/TESTING; configurar segredos privadamente. Não reutilizar bancos alheios nem executar seed por inferência.
2. Executar somente dev ou build/start por diretório .next. Abrir via preview e registrar jornadas em 360/768/1280: clientes → orçamento → publicação → aceite → uma OS; equipamento → visita → conflito → conclusão.
3. Revalidar hipóteses visuais com dados sintéticos longos e listas extensas, estados vazios/erro/loading, teclado Tab/Shift-Tab/Escape, zoom 200%, foco de retorno e reduced-motion. Não gravar tokens públicos ou cookies nas evidências.
4. Implementar P1 de proteção de edição e tokens; depois agenda/listas e confirmações P2, em solicitação própria. Preservar APIs, centavos, snapshots, idempotência e ausência de cobranças.
5. Conferir contraste de cada tema; testar aceites de domínio e build/typecheck somente após mudanças de implementação. Nenhum teste de aplicação/build foi executado nesta revisão documental.

Entrega com inspeção runtime dirigida realizada; cobertura e limitações no diagnóstico. Não constitui homologação humana, regressão completa ou certificação WCAG.

## Incremento P1 implementado

Continuação solicitada pelo operador após revisão: D01–D04. Branch local codex/brisa-zod-p1 no checkout desta entrega. Implementação original em React/CSS e dialog nativo: guard de saída de orçamento (continuar/descartar/salvar rascunho quando permitido e aviso beforeunload), nome/foco/fechar no modal de cliente, Agenda lista primeiro com editor modal e assistência inicial recolhida após a consulta. Nenhum registry foi copiado e nenhuma dependência adicionada; shadcn-dialog A serve como referência de contrato de interação, não como código importado. APIs e domínio permanecem os existentes. TypeScript e 22 testes de domínio passaram; inspeção dos fluxos afetados em desktop/mobile e Agenda em 768px realizada. Validação de build e limites em [docs/changes/zod-ui-p1.md](docs/changes/zod-ui-p1.md). D05–D11 continuam como backlog, salvo fechamento visível de D07 e limpeza de avisos ao navegar (D06) tratados junto à centralização das saídas. O diagnóstico preserva a fotografia anterior às mudanças.

## Composição visual Brisa — evolução solicitada

Pedido atual autoriza criar e implementar o desenho visual integrado. Direção: precisão operacional e requinte discreto. Turquesa profundo #113e3b, acento de marca #00777a configurável, papel #f5f6f3, superfície branca, bordas #dce3df, texto #172e2b, secundário #566b65. Tipografia system-ui/Inter local; títulos com peso 500–600 e tracking controlado. Monoespaçada apenas em referências/valores pequenos. Raios 10/16/24px; escala de espaços 4/8/12/16/24/32/48; controle ≥44px, fonte de campo mobile 16px. Motion 140–180ms sem deslocamentos em reduced-motion.

| Slot | Quadrante/Categoria/Seção | ID Zod UI | Tier | Origem | Adaptação Necessária |
| --- | --- | --- | --- | --- | --- |
| Shell de operação, sidebar e navegação inferior | Q1/shells-footers/dashboard-sidebars (lacuna) | — | — | original Brisa | Ícones SVG originais, aba ativa sem depender de cor, bottom nav com áreas de toque e safe-area |
| Lista de propostas e resumo compacto | Q1/estrutura operacional (lacuna) | — | — | original Brisa | Dados reais, densidade desktop, cards mobile, ações contextuais por estado |
| Editor de proposta e resumo lateral | Q2/forms-overlays/text-inputs | shadcn-input; shadcn-textarea | A | Referência MIT já examinada, implementação original | CSS próprio; sem importar Tailwind/Radix; labels, erro e foco preservados |
| Estados de proposta e controles | Q2/pricing-proof/status-badges; Q4/micro-interactions/tactile-button-states | shadcn-badge; shadcn-button | A | Referência MIT já examinada, implementação original | Semântica Brisa, contraste, foco e toque 44px; sem cópia de registry |
| Login e documento público | Q2/forms-overlays/authentication-cards (referência de primitiva) | — | — | original Brisa | Autenticação existente; marca/snapshot imutáveis, consentimento e ausência de cobranças preservados |

Master e candidato button revisitados no catálogo raiz. A seleção anterior permanece válida: não há shell/tabela/agenda aderentes prontos. Sem imagens externas, fontes remotas, bibliotecas adicionais, shaders ou gráficos com dados inventados. SVGs de marca e ícones produzidos diretamente no código. Novo arquivo brisa.css concentra o contrato visual; globals.css mantém estrutura/comportamentos legados. A composição abrange Orçamentos, OS, Clientes, Equipamentos, Agenda, Inbox, Configurações, Guia, Login e Portal. A proteção de edição P1 permanece.

Composição implementada: src/app/brisa.css e components/brisa-identity.tsx; componentes existentes adaptados. Build/TypeScript, 22 testes e jornadas dirigidas passaram. [Direção atual](docs/design/BRISA-VISUAL-DIRECTION.md), [entrega](docs/changes/brisa-visual-design.md) e [composição navegável](BRISA_VISUAL_COMPOSITION.html). Apresentação com cenas reais em HTML estático, sem sessão/API; produto executável contém os fluxos funcionais. Sem cópia de código de catálogo ou promoção de tier.
