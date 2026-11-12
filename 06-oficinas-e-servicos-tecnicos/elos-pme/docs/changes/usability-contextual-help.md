# U01 — Usabilidade e ajuda contextual

Autorização: operador aprovou explicitamente este incremento na conversa. Estado inicial: 745423c, worktree codex/quote-portal limpa. Execução local supervisionada; não é aprovação de release nem de autonomia TSF.

Missão única: orientar o usuário no fluxo existente orçamento → decisão → OS, sem mudar regras de negócio, banco ou integrações. Feedback recebido: faltavam explicações, guia interno e ajuda perto dos campos.

## Requisitos e aceites

- UX01: guia interno acessível pela navegação, com cinco passos, explicação de status, revisão/revogação, PDF/CSV e limites de pagamento/envio manual. Disponível novamente após ocultar resumo inicial.
- UX02: resumo de primeiros passos pode ser ocultado; preferência local persiste quando armazenamento está disponível. Sem rastrear uso, gravar PII ou declarar passos concluídos por inferência.
- UX03: botões “?” próximos aos campos internos e do portal; rótulo acessível único por campo/item, sem botão dentro de label. Clique/toque/Enter/Space abre explicação com exemplo. Escape fecha e mantém foco no acionador; segundo clique fecha. Ajuda ocupa espaço próprio sem sobrepor formulário ou alterar valores/submeter formulário.
- UX04: rótulos de campos continuam associados; textos auxiliares ligados por aria-describedby quando visíveis. Instruções essenciais de revisão/validade/aceite permanecem visíveis sem abrir ajuda.
- UX05: dicas por status explicam próximo passo real. Filtro sem resultados oferece limpar busca. Publicação/cópia/rascunho/configuração e transição de OS apresentam feedback correto somente após sucesso.
- UX06: portal explica aprovação vs alteração e ausência de cobrança automática; não promete assinatura certificada, horário agendado ou envio de WhatsApp.
- UX07: navegador 360/1280 verifica ajuda pelo teclado, ausência de submit ao abrir, persistência/retorno ao guia e jornada orçamento→aceite→OS. Typecheck/build e testes de domínio/TSF continuam passando.

## Tarefas TSF

U01 documentar feedback/spec e allowlists (este arquivo e adendo da spec).
U02 implementar uma tarefa de produto delimitada com runner e hashes pré/pós. Allowlist: src/app/components/help-field.tsx, src/app/components/getting-started.tsx, src/lib/usage-guide.ts, src/app/dashboard.tsx, src/app/p/[token]/page.tsx, src/app/globals.css. Arquivos protegidos/infra fora desta tarefa. Envelope BuildOutput identifica exatamente os arquivos modificados.
U03 manutenção de testes e documentação explicitamente necessária aos aceites: scripts/usability-smoke.ts e docs/changes/usability-contextual-help.md, STATUS.md, evidências. Executar checks por subprocessos; capturar evidência sintética. Subtarefas supervisionadas, sem novo agente, modelo pago ou cron.
U04 entregar READY FOR REVIEW com diff e resultados. O feedback do operador inicia este incremento; não equivale aos dez ciclos de aprovação/promoção do playbook.

### Feedback técnico de execução

A execução U02 aplicou o patch, mas foi BLOCKED pelo runner ao interpretar `[token]` como padrão glob na allowlist. Manutenção corretiva U03: aceitar igualdade literal de caminho antes do glob; teste de regressão inclui rejeição de outro caminho. A proteção não foi removida nem ampliada para a pasta inteira. Verificação final do incremento deve registrar o bloqueio e a correção; não equivale a feedback humano de promoção.

## Evidência final

O build e TypeScript passaram. Browser smoke registrou 58 asserções em 360/1280 sem pageerror: persistência de ocultação e acesso ao guia, armazenamento indisponível, ajudas por Enter/Space/Escape com foco devolvido, nenhum POST/alteração de valor ao abrir ajuda, rascunho/publicação/aceite/OS, feedback e filtro sem resultado. Screenshots em docs/evidence/usability-*.png. Navegação mobile usa duas colunas e ações de formulário empilhadas.

A checagem TSF foi inicialmente executada ao mesmo tempo que a gravação de screenshots e bloqueou a escrita concorrente em docs/evidence. Reexecução sequencial passou. Não foram adicionadas exceções de permissão para imagens ou documentos. A suite determinística inclui 15 testes de domínio/PostgreSQL e 13 do runner. Feedback inicial do operador foi vinculado a run anterior no SQLite e aos aceites UX01–UX07; a homologação deste incremento não foi inferida.

Não há autorização de push/deploy ou promoção de autonomia. Não foram alterados banco, autenticação ou regras de orçamento/aceite. Limite: testes de acessibilidade cobrem os comportamentos descritos; não constituem auditoria WCAG completa.
