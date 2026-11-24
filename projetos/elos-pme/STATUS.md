# Estado da entrega

## Estado corrente — consolidação Brisa

Composição visual e P1 implementados no pacote do showroom; branch local codex/brisa-zod-p1. Operador aprovou visualmente a entrega (“ótimo”) e pediu preservar/evoluir processo, ferramentas e documentação. Salvamento realizado em commits locais nesta consolidação; consultar `git log` para os identificadores. Sem push/deploy.

[Entrada atual](README.md) · [Avaliação e retrospectiva](docs/EVALUATION-AND-RETROSPECTIVE.md) · [Processo](docs/DESIGN-DEVELOPMENT-PROCESS.md) · [Revisão](docs/REVIEW-HANDOFF.md). Inventário e links passam a ter verificação reproduzível. Acessibilidade integral, consolidação de CSS, temas e testes humanos continuam pendentes.

As seções abaixo preservam o histórico; branches, portas e próximos passos de rodadas antigas não substituem o runbook da entrega corrente.


2026-11-12 — Branch `codex/quote-portal`, worktree exclusiva `elos-pme-portal-codex`.

G0 aprovado pelo operador nesta conversa: implementação do escopo proposto. Entregue MVP local com autenticação Better Auth, PostgreSQL, rascunhos/publicação, revisões imutáveis, portal público, decisões concorrentes/idempotentes, OS, PDF, CSV e marca configurável com selo demo. Dados sintéticos, sem cliente real ou integração externa.

TSF: bootstrap e especialização presentes; runner determinístico supervisionado com SQLite, envelopes Pydantic, hashes/permissões, timeout/locks e orçamento fake testados. Chamadas LLM e crons desativados. Há execução READY FOR REVIEW real de checks locais; não é execução autônoma de modelo. Feedback humano dos dez ciclos e promoção não realizados. G-TSF para API paga depende de adapter com preço/usage/cancelamento comprováveis, não de uma flag.

Validação: quinze testes PostgreSQL, onze testes TSF, dezessete verificações HTTP, jornada Chromium desktop/mobile, TypeScript/build e restore em banco vazio. Evidência detalhada: docs/IMPLEMENTATION-EVIDENCE.md.

Limites: sem staging/produção, licença comercial final, política de retenção de dados reais ou revisão independente de release. Acessibilidade parcial: teclado/foco/labels/sem overflow e contraste de paleta; não é auditoria WCAG completa. Sem pagamentos/ERP/WhatsApp automático/IA fiscal/multi-tenancy.

Próximo passo único: operador homologar G1 na demo local. G2/G3/G4 permanecem pendentes, conforme plano aprovado.

## Incremento de usabilidade — 2026-11-12

Autorizado pelo operador. Guia de uso na navegação, resumo inicial ocultável com preferência local, ajuda contextual acessível nos campos internos/públicos, dicas por status, feedback de ações e busca vazia com recuperação. Requisitos UX01–UX07 em docs/changes/usability-contextual-help.md.

Validação do incremento: 58 asserções Chromium em 360/1280, incluindo Enter/Space/Escape/foco, sem submit ao abrir ajuda, persistência e storage indisponível, rascunho→publicação→aceite→OS. 15 testes PostgreSQL e 13 TSF aprovados; typecheck e build passaram. Nenhuma migração/dependência/integração nova.

Feedback do operador registrado no SQLite local; bloqueios técnicos e correções documentados. Operação segue supervisionada e sem modelo pago/cron. Incremento READY FOR REVIEW; próximo passo único: homologação do operador em http://localhost:3017.

## Treinamento guiado e operações — 2026-11-12

Solicitação anterior de usabilidade aceita pelo operador (“ok para as melhorias”). Novo incremento autorizado: treinamento modal na primeira visita às oito abas, opção Ver depois/Refazer e conclusão persistida por conta na Caixa de entrada, com aviso e contador de não lidas. Replays não duplicam avisos; pular não cria conclusão.

Entregues Clientes (cadastro/edição e seleção em orçamentos), Equipamentos (cadastro/edição, local, próxima manutenção informada e histórico de visitas) e Agenda (visita manual com técnico, vínculos coerentes e conflito de horários protegido em transação). Conclusão de visita e OS permanecem operações distintas. Orçamentos/OS recarregam ao trocar aba ou retomar foco.

Migração aditiva aplicada após backup local. 22 testes PostgreSQL, 13 TSF, build/typecheck e teste de navegador desktop/mobile aprovados; restauração em banco vazio comparou hashes de sete tabelas. Evidências e escopo O01–O07 em docs/changes/guided-training-operations.md. Contas temporárias do smoke removidas; dados de operação criados são sintéticos e identificados com TREINO.

Execução TSF supervisionada, com tarefas delimitadas e envelopes; sem modelo pago, cron, push ou deploy. Novo incremento READY FOR REVIEW, homologação humana pendente. Próximo passo único: testar o primeiro acesso às abas e a Caixa de entrada em http://localhost:3017.

## Revisão documental — 2026-11-12

README reorganizado como entrada completa do produto, com imagens reais da demonstração, funcionalidades, stack, instalação, execução/reinício, variáveis, operação, testes, processo TSF e conclusões. Acrescentados docs/USAGE.md e docs/DEVELOPMENT.md; proposta e plano originais preservados como contexto histórico. Esta revisão não altera comportamento do aplicativo nem concede novos gates. Resultados funcionais continuam referenciando a entrega 3b5c62d; a validação desta revisão cobre documentação e disponibilidade local.

## Piloto de vídeo Clientes TatuDoBem — 2026-11-12

Branch isolada codex/clientes-video-tatudobem, base dd7a3c5. Jornada consolidada após revisão Astra e execução autorizada pelo operador. Vídeo real de 98,27s com dados fictícios, legendas PT-BR, descrição, capítulos, poster e manifesto; integrado ao diálogo e catálogo existentes. Progresso/API/schema mantidos, saída desde início e em falha, fim sem conclusão automática e retorno com campos preservados na mesma aba. Sem retomada persistente nem rascunho entre abas.

Build/TypeScript, 22 testes de domínio/PostgreSQL, 13 harness e smoke novo em 360/1280 aprovados. Ver docs/CLIENTES-VIDEO-EVIDENCE.md para comandos, limitações e evidência. Execução manual supervisionada; runner verificou recibos/hashes finais, sem modelo vivo. Captura e banco separados do operador (app 3018, DB 55440); instância 3017 e README alheio preservados. READY FOR REVIEW; avaliação humana do vídeo e da jornada pendente. Sem push/deploy/gastos/cron/upload externo. Próximo passo: operador testar o piloto isolado antes de replicar.

Revisão editorial v2: após feedback do operador sobre lentidão, vídeo de Clientes reeditado para 45,5s, removendo esperas e mantendo quatro ações/resultados reais. Versão v1 preservada; player usa v2, legendas/transcrição/capítulos sincronizados. Build/TypeScript, integridade da mídia e smoke 360/1280 revalidados. Avaliação humana do ritmo final pendente.

## Design completo, build reproduzido e comparação — 2026-11-12

Evolução em worktree exclusiva elos-pme-clientes-design, branch codex/clientes-design; implementação visual congelada em 21a3a3d e documentação posterior. Versão anterior 225cdcc preservada. Original do operador e piloto em outras worktrees não foram substituídos. Builds reproduzidos com npm ci independente e banco próprio pronto/ativo, sem erro Better Auth; helper verified-build recusa banco indisponível antes de Next. Ressalva anterior resolvida no ambiente ensaiado, sem desativar validação.

Comparação automatizada: seis cenários × duas versões × dois viewports (360/1280), 24 execuções aprovadas na rodada final. Cliente com mesmo ID após edição/reload; rascunho/publicação R$360/aceite/uma OS; OS persistida; equipamento/visita concluída; ajuda textual preserva campos; PDF HTTP200/application/pdf. Sem pageerror/overflow nos estados observados. Tentativas de sincronização/runtime inválidas preservadas separadamente. Harness TSF reexecutado: 13/13 passaram.

Posição absoluta da busca Clientes: 1308→660px no celular (−49,5%); 827→507px no desktop (−38,7%). É ganho de composição, não tempo humano ou ROI. Detalhes e limites: docs/COMPARISON-RESULTS.md. TSF foi adaptação supervisionada, não fábrica autônoma; sem promoção, cron, modelo pago, push/deploy ou G1 inferido.

Documentação consolidada em docs/INDEX.md: PRD, Design System, Architecture, Database, Security, Code Style, Testing, TSF Workflow, arquivos do app/protótipo, manifesto e instruções AGENTS.md. HTML original arquivado localmente como referência estática; não comprova integrações ou funcionalidades simuladas. Próximo passo único: revisão humana das tarefas equivalentes usando protocolo e CSV, ainda sem resultados humanos.

## Zod UI P1 — proteção de edição e consulta diária

2026-11-12. Continuação autorizada após diagnóstico/curadoria. Branch local codex/brisa-zod-p1 no showroom. Orçamento alterado pede continuar/descartar/salvar rascunho quando permitido; beforeunload sem autosave. Agenda lista primeiro com cadastro modal; modal de cliente nomeado, foco/saída explícitos e ciclo de teclado. Lista de orçamentos antes de contagens e assistência recolhida. Implementação original React/CSS, sem dependências, migrações de produto ou alterações no catálogo.

TypeScript, build Webpack com preflight e banco próprio ativo, 22 testes em base própria, fluxos afetados no preview desktop/mobile e smoke de saída da conta na build de produção passaram. docs/changes/zod-ui-p1.md registra comandos, evidências e limites. Banco 55448 e app 3028 próprios, parados ao finalizar; dados sintéticos preservados. Sem commit/push/deploy ou G1 inferido. READY FOR REVIEW local; backlog P2/P3 permanece.

## Composição visual Brisa — implementação integrada

2026-11-12. Operador solicitou composição/desenho refinados para desktop e mobile. Entregues marca/ícones SVG, contrato visual brisa.css, sidebar, navegação inferior, propostas e ações contextuais, editor com resumo, equipamentos com cadastro recolhido, agenda e carteira, login e portal. Proteções P1 preservadas, sem dependências/schema novos. Aplicação funcional e apresentação BRISA_VISUAL_COMPOSITION.html com cenas estáticas da build real.

TypeScript, 22 testes em base própria, build Webpack/preflight e inspeções reais em 360/390/768/1440 passaram nos estados descritos em docs/changes/brisa-visual-design.md. Documentação de direção e capturas de produção preservadas. READY FOR REVIEW local; sem commit/push/deploy, G1 ou certificação WCAG inferidos.
