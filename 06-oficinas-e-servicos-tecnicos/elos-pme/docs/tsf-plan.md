# Plano de desenvolvimento e contrato TSF v0.1

> Atualização 2026-11-12: G0 aprovado explicitamente pelo operador nesta conversa; implementação local autorizada. Status atual em STATUS.md. Texto abaixo preserva o planejamento original.

Status: planejado, não executado. Fonte normativa metodológica: `/home/caueantonacci/GIT/Research_Construtor_Fluxos/pesquisas/playbooks/tiny-software-factory/PLAYBOOK_TFS.md` v2.0.0, seções 2–4; fluxo em `workflows/tiny-software-factory/workflow.yaml` no mesmo repositório. Manifesto PB08 no checkout principal Agent OS está draft; ausente desta base Git. Não copiar status operacional entre branches.

## 1. Auditoria real de elegibilidade (stage_1_audit)

- Missão única da fábrica: manter o fluxo orçamento→decisão→OS conforme spec, implementando UMA tarefa aprovada por execução. Não receber “construir toda a empresa” como missão.
- Recorrência: regressões e pequenos incrementos desse fluxo são recorrentes; o bootstrap inicial é projeto finito. Hipótese ainda sem histórico de runs.
- Base durável: change presente em Git; repo executável e `.tsf/state` ainda não criados. Parcial.
- Gargalo humano: horas de triagem/revisão ainda desconhecidas; medir baseline no primeiro ciclo, não presumir economia.
- Decisão binária: tarefa deve vincular ACs, diff, testes e artefato revisável; sem saída suficiente, resultado fail.
- Teto diário: proposta USD 1/dia e USD 0.25 por worker, ainda sem autorização de gasto.
  **Veredito: elegibilidade condicional; NÃO aprovada para daemon.** Confirmar recorrência, baseline, repo e orçamento em G0/G-TSF. `tsf audit` local tem respostas positivas fixas e não serve de evidência.

## 2. Decisões de implementação propostas

Repo dedicado `elos-pme-portal`, uma instalação por empresa. Uma aplicação Next.js/TypeScript com PostgreSQL, biblioteca de autenticação mantida a selecionar no spike e PDF por renderer server-side. Python apenas no harness TSF/Pydantic. Evitar API FastAPI separada no MVP para reduzir contratos e operação. Versões/dependências devem ser verificadas na documentação oficial ao iniciar, não fixadas por memória. Antes de escrever no destino, ler AGENTS/CLAUDE/STATUS/ADRs locais e inspecionar Git/owners/worktrees; selecionar worktree exclusiva.
Decisões ainda não ratificadas: stack final, host, auth/PDF, política de retenção e nome comercial. Sem necessidade de alterar shell/contratos do Agent OS.

## 3. Bootstrap durável (stage_2_init)

Estrutura alvo, não criada por este plano:
`.tsf/config.yaml`, `identity.json`, `crons/`, `subagents/presets.yaml`, `harness/envelopes.py`, `harness/domain_tools.py`, `engine/`, `state/factory.db`, `state/artifacts/`, `state/traces/`.
`init` existente só oferece scaffold. Não ativar seus exemplos de cron nem tomar YAML como enforcement. Excluir DB, traces, tokens e dados operacionais do Git; versionar schemas, prompts, migrações e configurações sem segredos.

Core Four:

- Context: spec/ACs e task atual como fontes; carregar contexto progressivo. Playbook propõe resumo a 200k e compactação a 500k; adapter deve provar compatibilidade e limite real. Se janela menor, compactar antes do limite efetivo, preservando spec, decisões, task e evidências; registrar desvio. Nunca prometer controle sobre compactação interna do provedor.
- Models: tiers scout/build/plan, com IDs e preços verificados na execução. Não vincular modelos obsoletos do scaffold. Nenhum tier autorizado a gastar nesta etapa.
- Prompts: governança imutável + papel + tarefa/ACs. Feedback da execução é dado não confiável, não pode sobrescrever regras.
- Tools: leitura/edição/testes/build somente no sandbox/worktree alvo. Paridade dentro da autorização do operador. Shell sem credenciais de produção; negar push/deploy, alterações de policy e arquivos protegidos. Ligar/desligar ferramentas dentro da allowlist não amplia autoridade.

## 4. Especialização (stage_3_configure)

Lists: spec, task aprovada, arquivos de produto e fixtures sintéticas, resultados de testes, diff e run anterior. Focus: patch pequeno e `READY FOR REVIEW` com links de evidência, nunca status DONE por autodeclaração.
Roster: Git, runtime Node/package manager, PostgreSQL de teste, Python/Pydantic, subprocess runner, browser de testes local quando implementado. `domain_tools.py` expõe leitura da tarefa, execução allowlisted de checks e escrita restrita de artefatos. Não lê vaults, clientes reais ou outros repos.

Contrato tríplice obrigatório: classe Pydantic com extra=forbid; mesmo schema/exemplo no prompt; validação no runner antes de persistir sucesso. EnvelopeBase contém status(success|fail), summary, artifacts, notes_for_next_agent; BuildOutput acrescenta changed_files, commit_message; ReviewOutput acrescenta findings e verdict; PlanOutput acrescenta tasks e acceptance_refs. Metadados do runner: run_id, task_id, parent_run_id, provider/model, hashes, timestamps, uso e custo, exit codes, versão dos schemas. Caminhos devem resolver dentro da worktree; rejeitar traversal. JSON inválido ou arquivos ausentes = fail, sem aprovação.

Governança: manifesto de hashes pré/pós inclui conteúdo rastreado, arquivos não rastreados, deleções, modos e symlinks, excluindo apenas state permitido. Comparar com allowlist da tarefa; denylist prevalece. Runner não aceita mudança em testes, config, lockfiles/infra ou harness por worker de produto. Criar testes/config é tarefa separada com owner/allowlist específica autorizada. Violação gera PermissionBreach e run bloqueada para revisão; preservar evidência sem resetar trabalho alheio. Snapshot pós-execução detecta alteração; sandbox sem segredos e permissões de processo limitam dano durante a execução.

## 5. Execução Near-the-loop (stage_4_near_loop)

Começar com run manual supervisionado. Worker único até prova do isolamento; limite absoluto quatro, cada um em worktree própria e tarefas sem arquivos concorrentes. Nenhum worker foi iniciado por esta documentação.
Preset proposto: cap USD 0.25, timeout 180s, síntese a 80% do custo ou 60% do tempo. Controlador global USD 1/dia, sem reset por retry. Todos os scouts/reviews/retries contam. Sem preços/usage confiáveis ou cancelamento comprovado: bloquear chamada, nunca inferir custo zero.
Hard cap exige reserva prévia do pior custo permitido (tokens, ferramentas tarifadas e chamadas em voo), limite de saída e bloqueio antes de exceder cap; contabilizar resposta final e falhas. Se adapter não puder garantir limite, provider inelegível. Testar com fake provider antes de qualquer teste pago; execução paga exige autorização própria.

Crons propostos, inicialmente disabled e autonomous=false, timezone America/Sao_Paulo: checks determinísticos às 07:00 em dias úteis; no máximo uma tarefa previamente aprovada às 08:00, respeitando teto/lock; resumo local às 18:00 sem LLM quando dados bastarem. Sem tarefa/budget/lock livre, skip com motivo, não inventar trabalho. Não instalar cron/timer neste planejamento.
SQLite: runs, steps, envelopes, artifacts, usage_ledger, feedback_loop, approvals e leases; migrações e locks transacionais. Restart recupera fila e marca run interrompida como interrupted; não repete ação com efeito externo. Lease impede sobreposição. Heartbeat vencido = UNKNOWN/sem telemetria, não sucesso.
Checks: primeiro lint/typecheck/testes determinísticos; agente recebe erros apenas quando falham, com no máximo 3 ciclos de reparo e orçamento agregado. Checks gastam recursos computacionais, embora não precisem de tokens de inferência. Build/test green não é aceite humano.
Artefato por run: missão/task/ACs, base/head/diff, hashes, comandos/exit codes, envelopes validados, custo real ou unavailable, arquivos, limitações e status READY FOR REVIEW/FAILED/BLOCKED. Nenhum commit/merge/deploy automático autorizado.

## 6. Feedback e promoção (stage_5_no_loop_promotion)

Primeiras dez execuções revisadas individualmente com approved/rejected/corrected e motivo no SQLite. Correção vira teste/guardrail por tarefa autorizada; guardrail passa no fixture que antes falhava. Após dez ciclos acompanhados E cinco execuções consecutivas sem ajustes e com todos os checks válidos, elaborar proposta de promoção por rotina e versão, com reversão. Não ativar autonomous=true automaticamente; humano ratifica dentro das políticas do repo. Qualquer falha/violação/custo indisponível suspende rotina e reinicia sequência de qualificação. Promoção nunca concede push/deploy/gastos novos.

## 7. Tarefas incrementais e evidências

| ID  | Dependência | Entrega e pronto quando                                                                                                            |
| --- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| T00 | G0          | Repo/worktree, ADR de stack, baseline comercial/operacional, orçamento e allowlists definidos                                      |
| T01 | T00         | Scaffold e ambiente reproduzível; instalação limpa e conexão DB verificadas                                                        |
| T02 | T00         | Harness/runner e fake provider; schema, permissões, custo, timeout, restart e locks testados; G-TSF                                |
| T03 | T01         | Autenticação, clientes mínimos e migrações; AC01 e negativos de autorização                                                        |
| T04 | T03         | Orçamento/snapshot/revisões; AC02/03/05/06                                                                                         |
| T05 | T04         | Portal público e decisão atômica; AC04/08 e teste real de concorrência                                                             |
| T06 | T05         | OS/histórico/PDF; AC07 e transições inválidas                                                                                      |
| T07 | T06         | Marca demo, responsividade e tratamento de falha; AC10/11                                                                          |
| T08 | T07         | Exportação, restore e instalação; AC09; runbook e pacote de licença/suporte                                                        |
| T09 | T02,T08     | Run supervisionada da fábrica: task→patch→checks→artefato→decisão registrada; evidência G1                                         |
| T10 | G1,G2       | Staging aprovado, smoke e rollback/restore demonstrados                                                                            |
| T11 | T10,G3      | Produção aprovada do mesmo artefato, observação e G4                                                                               |
| T12 | T09         | Dez ciclos observados, feedback como testes, cinco sucessos e proposta de promoção; sem bloquear demo local por esperar dez ciclos |

Cada tarefa referencia spec→AC→run→diff→evidência. Revisão independente é prevista antes da release, sem iniciar agentes adicionais agora. Reconciliar Linear antes de criar qualquer issue; nenhuma issue criada.

## 8. Estimativas e gates

Produto enxuto: 60–100 horas, hipótese anterior para desenvolvedor experiente e stack conhecida. Harness TSF completo NÃO estava incluído: reservar 24–48 horas adicionais para spike/controlador; reestimar após T02. Sem adapter reaproveitável, parar e propor revisão, não converter scaffold em alegação de conformidade. Produto + TSF: referência de planejamento 84–148 horas; calendário depende de disponibilidade e gates, não promessa de entrega em 16 minutos.

Execução 24/7 estritamente TSF depende de G-TSF. Desenvolvimento manual supervisionado pode produzir a demo após G0, mas deve ser rotulado assim até os controles passarem. Esta distinção impede anunciar conformidade operacional antes da evidência.
