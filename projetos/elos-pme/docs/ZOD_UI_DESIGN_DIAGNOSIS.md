# Diagnóstico de design — Brisa Oficina

Data: 2026-11-12. Skill aplicada: zod-ui-architect. Revisão direta, sem agentes adicionais. Escopo exclusivamente diagnóstico/curadoria; nenhum componente de produção modificado.

## Ambiente e método

O aplicativo avaliado é o checkout ElosPME do showroom, não o HTML de referência. Instalação npm ci local; execução com o Node 22 distribuído como devDependency. O npm inicial usou o Node 20 do sistema e emitiu avisos de engine; o app, migração e seed executaram com Node 22. Banco novo `brisa-zod-audit-db`, porta 55448, base própria; servidor dev na porta 3028. Não foram usados bancos/servidores existentes nas portas 55439–55441/3017–3019. Configuração privada ignorada pelo Git, sem conteúdo incluído neste relatório.

A primeira migração ocorreu durante a inicialização do PostgreSQL e falhou por conexão; após pg_isready, migração e seed passaram. A primeira instância dev reteve a falha de schema e foi reiniciada depois da migração. Login e painel passaram a carregar. Esses erros de preparação não são defeitos visuais do produto. Não houve dev/build simultâneos nem alteração de schema/código para contornar o erro.

Browser usado: preview do T3, 1280×800 e 360×800; verificação complementar de Orçamentos em 768×900. Resize altera viewport CSS, não emula Safari, teclado virtual ou dispositivo físico. Snapshots visuais, árvore acessível, estilos computados e consultas de confirmação às APIs. As capturas em [evidence/zod-ui-audit/manifest.json](evidence/zod-ui-audit/manifest.json) não contêm traces, cookies ou links públicos recuperáveis. Algumas capturas foram feitas durante atualização da interface: confirmações posteriores por leitura de API são descritas separadamente. Não usar a posição de uma captura transitória como prova de estado persistido.

## Cobertura real

| Área | Inspeção / exercício | Resultado e limite |
| --- | --- | --- |
| Login | Página desktop; autenticação por chamada same-origin no browser | Resposta 200; preenchimento/submissão do formulário de login não testado |
| Orçamentos | Desktop/mobile/tablet; novo com cliente existente; salvar rascunho, editar e publicar | Orçamento 2, revisão 1, R$180; primeiro orçamento sintético do seed preservado |
| Portal público | Desktop/mobile; leitura, checkbox e aprovação pela UI | Confirmação persistida; uma OS retornada pela API. Não testados aceite concorrente, revisão expirada ou PDF nesta rodada |
| OS | Lista e quadro desktop; quadro mobile; iniciar serviço pela UI | Uma OS em andamento; não foi encerrada ou cancelada |
| Clientes | Carteira desktop/mobile, modal mobile, cadastro com nome longo, busca sem resultado | Novo cliente sintético persistido; Escape fecha e retorna foco; edição/reload não exercitados nesta rodada |
| Equipamentos | Formulário e histórico desktop/mobile; cadastro vinculado ao cliente | Um aparelho sintético persistido |
| Agenda | Formulário/lista desktop/mobile; visita, tentativa sobreposta, conclusão | Conflito recusado, inputs preservados; uma visita concluída e OS ainda em andamento |
| Configurações | Desktop/mobile, prévia e opções de cor | Nome/cor não alterados nem salvos; temas alternativos não auditados em runtime |
| Caixa de entrada | Desktop/mobile, progresso 0/8 e ausência de avisos | Sem concluir guia ou gerar notificação; leitura não tratada como certificação |
| Guia | Texto, instruções e treinamento em desktop | Guia completo em mobile e vídeo não reproduzidos |
| Falhas/estados | Loading textual observado; agenda em conflito; clientes sem resultado; portal inválido | Não simulados offline, timeout após commit ou falhas 500 de negócio |

## Achados priorizados

| ID / prioridade | Evidência observada | Impacto de uso | Contrato proposto |
| --- | --- | --- | --- |
| D01 / P1 | Novo orçamento recebeu `RASCUNHO NÃO SALVO AUDITORIA`; trocar para Clientes e voltar removeu editor e conteúdo, sem pergunta. `navigate()` também chama setForm(null) | Perda de trabalho durante consulta de dados do cliente | Proteger edição suja em todas as saídas; permanecer/descartar e opção salvar rascunho quando válido; nunca bloquear leitura sem saída |
| D02 / P1 | Modal de cliente aparece como dialog sem nome na árvore; DOM sem aria-label/aria-labelledby e título sem associação | Leitor de tela não recebe o contexto do cadastro | Associar h2 ao dialog; descrição opcional; foco inicial no título ou campo principal conforme conteúdo. Escape e retorno ao trigger já funcionaram e devem ser preservados |
| D03 / P1 | Em 360px, h2 “Agendar visita” começa em y=350; “Agenda de visitas” em y=1240, mesmo com apenas uma visita | Quem consulta compromissos atravessa cadastro antes da agenda | Próximas visitas/Hoje primeiro; Agendar abre editor. Consulta da primeira visita deve ocorrer antes do formulário fechado, sem exigir scroll por campos |
| D04 / P1 | Captura Orçamentos desktop: resumo inicial ocupa y≈266–590, seguido por métricas; no celular domina a primeira tela. Clientes: busca começa perto de y=650 mesmo sem resumo | Conteúdo de uso diário recebe menos prioridade que assistência e cabeçalho | Cabeçalho curto e orientado à tarefa; assistência recolhida, reabrível; busca/lista antes de resumo/métricas. Evitar novo modal obrigatório a cada área para usuário recorrente |
| D05 / P2 | Rascunho recém-salvo mostra “Revogar link”, apesar da mensagem de que ainda não há link público; código não filtra a ação por status | Ação sem objeto gera dúvida sobre o ciclo da proposta | Ocultar ação em rascunho sem publicação. Matriz por estado: rascunho editar/publicar; enviado histórico/revisar/revogar/cancelar; aprovado histórico/OS/revogar quando permitido |
| D06 / P2 | “Serviço iniciado. Conclua a OS...” permanece em Configurações, Clientes, Guia e Inbox | Aviso fora de contexto sugere ação ligada à tela errada | Vincular feedback à ação e entidade; limpar ao navegar ou apresentar notificação contextual com link à OS |
| D07 / P2 | Cadastro mobile: diálogo 680px alto com conteúdo 771px; “Voltar à carteira” em y=768 e fora do viewport do diálogo; foco inicial em “Ajuda nesta aba” | Saída e objetivo do formulário pouco evidentes para toque | Fechar sempre visível no cabeçalho, título associado; rodapé de ação visível sem ocultar último campo; testar teclado virtual. Preservar nome digitado ao consultar ajuda |
| D08 / P2 | Inputs autenticados em mobile com fonte 14px; selects da Agenda 13px; portal input 15px/43px de altura e submit 41px; checkbox visual 13px com label clicável | Leitura e toque inconsistentes entre operação e aceite | Campos mobile 16px, botões/área de toque ≥44px; expandir a área do label de confirmação. Não alegar falha de target size apenas pela caixa do checkbox |
| D09 / P2 | Portal inválido apresenta somente “Link indisponível” | Cliente não sabe como prosseguir | Orientar “Peça um novo link à empresa”; distinguir estados quando seguro, sem expor existência de registros ou dados privados |
| D10 / P2 | Paleta e fontes mudam entre :root e .brisa-app; caracteres Unicode compõem ícones | Inconsistência visual e manutenção frágil | Tokens semânticos comuns e SVGs simples com texto; conservar turquesa, superfícies claras e estados textuais |
| D11 / P3 | Busca Clientes sem resultado informa ausência, sem ação Limpar | Recuperação exige apagar o texto manualmente | Acrescentar Limpar busca e manter cadastro como ação secundária; não confundir filtro vazio com carteira vazia |

P1 significa prioridade de próxima implementação, não bloqueio de release já homologado. Não há medição humana de tempo ou ROI nesta análise.

## Qualidades a preservar

Turquesa contido, superfícies claras e badges com texto sustentam a identidade; o shell atual branco é coerente e difere das capturas antigas de sidebar escura. Filtros e alternativas lista/quadro já existem. A explicação do conflito é acionável e os campos foram preservados. Mensagens de publicação explicam compartilhamento manual e revisão; portal explicita ausência de cobrança/agendamento automático. Confirmação exibe revisão e valor. A lista mobile reorganiza o quadro sem overflow nos estados observados. Escape devolveu foco tanto ao abrir cliente quanto ao menu mobile.

## Curadoria e compatibilidade

Finalistas A: shadcn-button/badge/input/textarea/dialog/progress. Arquivos registry lidos integralmente; SHA-256 dos seis conferem com metadados do catálogo. Licença MIT local lida. Previews mobile dos seis examinados e também mobile-dialog-open: título, descrição, cancelar/salvar e foco visível. Auditorias desktop/mobile consultadas; não são ensaios nesta aplicação.

Button/badge usam class-variance-authority, cn e Slot do radix-ui; input/textarea usam cn; dialog usa radix-ui, lucide-react, Button e alias registry; progress usa radix-ui/cn. Todos dependem das classes Tailwind v4 para aparência. Brisa usa CSS próprio: integração direta não foi compilada. Recomendação é implementar variantes nativas compatíveis com tokens e a semântica existente; manter atribuição ao portar código. Não importar dependências só para obter uma primitiva visual.

Button do catálogo tem padrão h-9 (36px), abaixo do contrato mobile proposto; aumentar área de toque. Badge tem whitespace-nowrap: nomes de estado longos precisam caber ou quebrar com controle. Input não inclui label/erro de negócio: integrar HelpField e aria-describedby. Textarea tem field-sizing-content: limitar crescimento em overlays. Dialog precisa tradução de Close, nome, foco, limites de altura e reduced-motion explícitos. Progress usa transição e valor do host: usar quantidade concluída/total real, sem timer; o progress nativo existente pode ser suficiente.

Não há S/S+ aderente aos slots operacionais encontrados. Os shaders S/A não resolvem consulta ou decisão e ficam excluídos. Lacunas: tabela ERP acessível, shell operacional, calendário/agenda, seletor cliente/equipamento/OS, editor monetário, estados completos e fluxo de aceite. Não confundir primitivas A com jornadas prontas.

## Limites e próximos aceites

Esta é inspeção dirigida de design e jornadas, não suíte de regressão, auditoria WCAG completa ou homologação de produto. Foco circular completo, leitor de tela, zoom 200%, teclado virtual, iOS/Safari, reduced-motion em browser, contraste de todos os estados/temas e desempenho sustentado continuam pendentes. Layout 768px foi observado sem overflow, mas sem exercício completo das jornadas. Nomes longos testados em um cliente, sem lista extensa. Não houve build/typecheck nesta etapa, pois não há alteração de implementação.

Implementar em solicitação posterior: (1) proteger trabalho e nomear diálogos; (2) reorganizar consulta/assistência e Agenda; (3) unificar tokens, campos e feedback; (4) aplicar primitivas apenas onde houver ganho; (5) regressão das invariantes e verificações de acessibilidade. Blueprint na raiz é o contrato detalhado.

## Contraste pontual e encerramento

Cálculo sRGB das cores sólidas declaradas: turquesa #00777a sobre branco 5,36:1; muted #526174 sobre branco 6,32:1; foco turquesa sobre paper #f8fafc 5,12:1. Borda atual #c4d0dc sobre branco: 1,57:1, abaixo de 3:1 quando é a única pista visual do limite do campo. Fortalecer --input-border e verificar também estados hover/erro/disabled; isso é cálculo de pares, não medição de pixels nem auditoria completa. Sombra/contornos adicionais e contextos devem ser avaliados antes de classificar conformidade.

A aba de inspeção foi fechada e apenas servidor/banco desta auditoria foram parados. Container próprio preservado com dados sintéticos; dependências e configuração local privada ficaram disponíveis para reprodução. Para reiniciar: `docker start brisa-zod-audit-db` e `PATH="$PWD/node_modules/node/bin:$PATH" npm run dev -- --port 3028` a partir da raiz do ElosPME. Não executar novo seed para consultar estes dados. Nenhum banco/processo alheio foi alterado.
