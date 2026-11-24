# ElosPME — diagnóstico e direção inicial

2026-11-12. Análise estática; proposta revisável, sem implementação nem homologação. Nova referência ainda não recebida. Não constitui redesenho da versão futura.

## Base e limites da evidência

Planejamento: branch exclusiva t3/elos-pme-design-evolution, base 6e5ee20, inicialmente limpa. START-HERE está datado de 03/11, com notas posteriores; não é evidência atual de runtime do ElosPME. Produto original observado em dd7a3c5, README alterado pelo operador e preservado. Piloto em 225cdcc, branch codex/clientes-video-tatudobem, node_modules não rastreado. Nenhum desses checkouts foi editado.

Leitura: AGENTS, STATUS, README, docs/spec.md, docs/changes/guided-training-operations.md, docs/USAGE.md, dashboard.tsx, operations-panel.tsx e globals.css do original; regras e diff do piloto. Índice do processo de vídeo consultado apenas como contexto. Não foram usados áudio ou transcrição como fonte de requisitos.

Portas observadas: 3018, 55439 e 55440 em escuta; 3017 ausente. Escuta não comprova saúde, checkout servido ou comportamento. Sem login, inspeção visual renderizada, mutações ou testes de banco nesta descoberta. Evidências históricas não validam redesign.

## Diagnóstico ligado ao trabalho real

| Área e fato no código | Hipótese de atrito a conferir visualmente | Direção proposta e critério |
|---|---|---|
| Navegação: shell de 220px no desktop; regra final abaixo de 760px usa oito abas em duas colunas | Cabeçalho e navegação podem empurrar formulário/lista para baixo no celular | Prioridade 1: avaliar navegação compacta com seção atual explícita e acesso às oito áreas; medir espaço até a primeira ação em 360px antes de escolher padrão |
| Clientes e Equipamentos: formulário e lista convivem; Clientes tem busca e edição | Cadastro pode competir com localizar/editar, tarefa recorrente | Prioridade 1: tornar busca/lista e modo novo/edição inequívocos; localizar cliente, editar e conferir o mesmo registro, sem depender da ajuda para entender o modo |
| Orçamentos: ações de rascunho/publicação, revisão, histórico e estados distintos | Peso visual semelhante pode dificultar perceber consequência da publicação | Prioridade 1: agrupar por consequência e estado; rascunho e publicação devem ter rótulos distintos e resultado persistido verificável; não alterar snapshots ou regras de aceite |
| CSS: paleta ink/teal/paper/line/muted, cards de 24px, corpo Arial 15px, títulos 30/20px, variante small 12px | Há base consistente, mas textos auxiliares, badges e ações pequenas podem perder leitura; espaçamentos acumulados podem alongar formulários | Prioridade 2: consolidar escala de espaços, texto e variantes sem trocar identidade por inferência; comparar formulário e lista com conteúdo curto/longo |
| Ajuda: campos com gatilho mínimo 44px, notas no fluxo, treinamento modal e catálogo existentes | Ajuda pode aumentar altura e competir com operação, especialmente no celular | Prioridade 1: preservar consulta e retorno rápido; conferir foco, Escape e campos intactos na mesma aba. Catálogo existente deve ser reaproveitado |
| Agenda e OS são operações separadas | Concluir visita pode ser entendido como concluir serviço | Prioridade 1: contexto e verbos explícitos para cada entidade; confirmação/resultados não devem sugerir mudança da outra |
| Botões primary/secondary/danger, badges de status e foco visível já existem | A distribuição de ênfase e feedback depende da composição renderizada | Prioridade 2: ação principal por contexto; destrutiva diferenciada; estado sempre nomeado em texto, sem depender só de cor |

## Direção a revisar com o operador

A operação deve guiar a composição: identificar onde estou, localizar o registro, executar a ação, conferir o resultado. Reutilizar paleta e componentes enquanto a referência não justificar outra direção. Evitar indicadores sem fonte, novas funcionalidades e decoração que aumente etapas. Não definir agora sidebar, fonte nova ou arquitetura de telas da versão futura.

Clientes é a amostra inicial sugerida: concentra formulário, busca, edição e ajuda sem depender de publicação pública. Depois avaliar Orçamentos e Agenda, com consequências mais complexas. Configurações deve deixar explícito o efeito sobre próximas publicações; Caixa de entrada deve separar catálogo de treinamento e notificações sem inventar novas categorias operacionais.

## Critérios verificáveis para a próxima rodada

- Em 360, 390, 768 e 1280px: sem corte de campos/ações nem rolagem horizontal da página; testar nomes longos, listas vazias e preenchidas. Registrar viewport real, não apenas configuração declarada da ferramenta.
- Em Clientes: reconhecer novo versus edição, salvar, localizar e conferir o mesmo registro; erro deve manter entrada e permitir recuperação. Não prometer persistência de rascunho entre abas.
- Em Orçamentos: distinguir salvar rascunho, publicar e revisar; total, revisão e status legíveis; feedback sem afirmar sucesso antes de persistência.
- Em Agenda: cliente/equipamento/OS coerentes e fuso visível; conflito compreensível; concluir visita não sugere concluir OS.
- Teclado: ordem de foco coerente, foco visível, labels e erros associados; modal contém foco e devolve ao acionador, Escape fecha; ajuda não submete formulário. Medir contraste na UI final e verificar alvos de toque, usando 44px como alvo de projeto.
- Consistência: mesma hierarquia de título, busca, ação principal, secundária, erro, vazio e carregamento nas oito abas. Conferir também portal público/PDF quando a mudança visual os atingir.
- Fluidez: comparar ações e interrupções das mesmas tarefas antes/depois; registrar observação humana, sem fabricar tempos ou alegar ganho não medido. Vídeo v2 histórico não tem aceite explícito de ritmo.

## Quando chegar a nova versão

Identificar caminho/versão e regras; mapear telas e tarefas para os contratos existentes; comparar referência com evidências renderizadas e classificar manter/adaptar/remover apenas como proposta. Entregar decisões por tela com justificativa e amostra revisável antes de implementação. Implementação futura exige worktree exclusiva do produto e escopo definido; nenhuma alteração de banco, publicação ou captura está autorizada por este documento.

Próximo passo único: confrontar a nova versão/referência fornecida pelo operador com este diagnóstico e escolher a primeira tarefa para revisão visual.
