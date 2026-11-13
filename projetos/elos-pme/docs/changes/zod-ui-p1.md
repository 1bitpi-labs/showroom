# Brisa — incremento Zod UI P1

2026-11-12. Continuação solicitada pelo operador após diagnóstico e blueprint. Branch local `codex/brisa-zod-p1`, checkout do showroom. Skill zod-ui-architect aplicada diretamente, sem novos agentes. Implementação local para revisão; sem commit, push ou deploy.

## Problema e comportamento entregue

Antes, uma proposta alterada era descartada ao mudar de aba e o cadastro de visita precedia a consulta da agenda. Agora as saídas internas do orçamento alterado abrem um diálogo com Continuar editando, Descartar alterações e, para proposta nova/rascunho, Salvar rascunho e sair. O salvamento valida campos e só segue após resposta da API. Revisão de orçamento publicado não oferece conversão em rascunho. Alterações também registram beforeunload; sem autosave ou recuperação após fechar a página.

A proteção cobre navegação desktop/mobile, resultados da busca global (incluindo orçamento por ID), notificações, replay de guia, Voltar, início de outra proposta e saída da conta. Navegar durante uma requisição em andamento é bloqueado. Formulário sem alterações não pede confirmação. Sucesso de publicar/salvar fecha normalmente o editor. O snapshot usado para comparar alterações é independente dos itens da lista.

Agenda abre na lista, com visitas agendadas em ordem cronológica antes dos registros encerrados. Agendar visita abre dialog nativo com título/foco e saída explícita. Salvar fecha e limpa apenas após confirmação da API; erro fica no diálogo, recebe foco e conserva campos. Fechar/Escape mantém o preenchimento na mesma aba e retorna ao acionador. Trocar de aba/recarregar não preserva um agendamento não salvo.

O modal de cliente associa título e descrição acessíveis, foca o título e oferece Fechar no topo. Os três diálogos possuem ciclo de Tab/Shift+Tab, Escape e retorno de foco. Cabeçalhos de cadastro mantêm saída disponível durante scroll. O resumo de primeiros passos fica fechado e após a lista/contagens; a lista de orçamentos vem primeiro e o cabeçalho deixa de repetir o nome da empresa.

## Proveniência e escopo

D01–D04 do [diagnóstico](../ZOD_UI_DESIGN_DIAGNOSIS.md), mais saída visível de D07. Contrato em [ZOD_UI_BLUEPRINT.md](../../ZOD_UI_BLUEPRINT.md). Componentes e helper de foco originais React/CSS; nenhuma cópia de registry, dependência nova ou alteração no catálogo/skills. O finalista A shadcn-dialog informa o contrato de interação; não foi importado. CSS, eventos e dialog nativos continuam a arquitetura do app. APIs, schema, centavos, revisão imutável e regras de aceite/OS permanecem existentes.

## Verificações executadas

- TypeScript sem emit/incremental: passou após alterações finais.
- Build real: `PATH="$PWD/node_modules/node/bin:$PATH" node --env-file=.env.local --import tsx scripts/verified-build.ts` passou, Webpack/Next 16.4.6. Banco próprio pronto e ativo durante todo o build; dev encerrado antes. Arquivo gerado next-env.d.ts sem diff final.
- 22 testes existentes de domínio/operacões/treinamento passaram em base própria `brisa_zod_p1_tests`, container `brisa-zod-audit-db`, porta 55448. Migração executada somente nessa base de testes antes da suíte. Não usar o npm test histórico, que aponta a outra instalação.
- Preview T3: desktop 1280×800 e mobile 360×800; Agenda também em 768×900. Sem overflow horizontal nos estados medidos, não em todas as combinações.
- Preencher orçamento → tentar trocar de aba → Escape/Continuar preserva campos; notificações → Salvar rascunho e sair grava e abre Inbox. API confirmou rascunho de R$180.
- Campo inválido → Salvar rascunho e sair mantém guard aberto, mensagem e entrada; descartar permite navegar.
- Busca global por orçamento enquanto há alterações abre guard; Continuar mantém editor. Voltar também pede descarte.
- Revisão publicada alterada abre guard sem botão Salvar rascunho. Não foi publicada uma nova revisão nessa verificação.
- Evento beforeunload sintético: limpo não cancela; alterado cancela. O diálogo nativo de reload/fechamento varia conforme navegador e não foi certificado em dispositivo físico.
- Tab/Shift+Tab exercitados nos limites dos três diálogos; Escape e retorno ao acionador conferidos. Um ensaio inicial com dialog apenas nativo permitiu foco sair para chrome do browser; helper de ciclo foi acrescentado e as verificações passaram. Não é auditoria completa com leitor de tela.
- Agenda: visita sintética com cliente/equipamento salva pela UI e exibida antes do histórico; tentativa sobreposta recusada; campos preservados ao fechar e reabrir. O input datetime-local foi preenchido por setter nativo e evento input, pois o comando de digitação da ferramenta não o preenche de forma confiável. Não inferir experiência de calendário/teclado físico desse preenchimento.
- Ajuda inicial aberta/fechada e ocultada; lista aparece antes do conteúdo de assistência. Título do dialog de cliente aparece nomeado na árvore acessível.
- Smoke na build de produção: preencher proposta → Sair da conta → Continuar preserva conteúdo; repetir e descartar encerra sessão e chega a /login sem novo aviso de descarte.
- `git diff --check`: passou. Não há designlang/verify_ui entre as ferramentas disponíveis; não foi alegada execução.

Capturas: [manifesto](../evidence/zod-ui-p1/manifest.json). Elas registram etapas do desenvolvimento; por exemplo agenda-editor-mobile antecede a redução do texto Fechar no cabeçalho, e agenda-conflict-mobile antecede o foco automático da mensagem. O resultado final foi verificado depois dessas correções, sem substituir retroativamente os registros. Screenshots não incluem traces/cookies ou tokens públicos.

## Estado e limites

Servidor dev, servidor de produção e banco desta entrega foram parados ao concluir as verificações. Container próprio e dados sintéticos preservados. Dependências/configuração local privada permanecem ignoradas pelo Git. Para rever: iniciar `brisa-zod-audit-db` e executar `PATH="$PWD/node_modules/node/bin:$PATH" npm run start -- --port 3028` nesta pasta. Não precisa seed ou build para abrir a build entregue. Nenhum processo/banco alheio foi alterado.

Backlog P2/P3 do blueprint permanece: tokens entre portal/operação, campos mobile, bordas/contraste, ação Revogar em rascunho, recuperação de link indisponível e melhorias da busca. Avisos de Dashboard agora são limpos ao navegar, como parte da proteção centralizada; isso não constitui revisão de todos os feedbacks do produto. Acesso com leitor de tela, Safari/iOS, zoom 200%, teclado virtual e perda de rede após commit ainda exigem validação própria. Sem salvamento automático de rascunho ou persistência do formulário entre abas. READY FOR REVIEW local, sem homologação humana inferida.
