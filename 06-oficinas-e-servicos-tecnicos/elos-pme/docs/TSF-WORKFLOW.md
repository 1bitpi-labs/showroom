# Desenvolvimento TSF — método aplicado e evolução

ElosPME foi construído com adaptação **local e supervisionada do Tiny Software Factory v2.0.0 (TSF/TFS)**. Fonte consultada: `/home/caueantonacci/GIT/Research_Construtor_Fluxos/pesquisas/playbooks/tiny-software-factory/PLAYBOOK_TFS.md`. Não se copia esse material externo para o produto; o contrato aplicado está em [tsf-plan.md](tsf-plan.md). [DEVELOPMENT.md](DEVELOPMENT.md) detalha implementação histórica.

## Fluxo efetivo

Pedido humano → descoberta do repo/regras/estado → spec/aceites/recorte aprovado → branch/worktree própria → implementação incremental → tipos/domínio/build e navegador → evidências/handoff → feedback humano → correção → nova verificação. Gate humano permanece separado de READY FOR REVIEW.

Nas primeiras rodadas, `.tsf/` validou tarefas/checks, snapshots/allowlists, timeout/lease, envelopes Pydantic e ledger simulado. Provider fake não escreveu o app por conta própria. Na rodada de design o código e QA foram executados diretamente pelo agente sob supervisão; não há nova run TSF completa comprovada para cada edição. Não houve cron/daemon/modelo pago ou promoção near/no-loop. A proposta do playbook de rotina sem presença humana não foi testada aqui.

## Arquivos utilizados

Planejamento/contratos: docs/spec.md, tsf-plan.md, changes/*.md e ADR-0001.md. Execução: .tsf/identity.json, config.yaml, prompts/governance.md, prompts/build.schema.json, harness/envelopes.py, harness/domain_tools.py, engine/runner.py, subagents/presets.yaml e crons/checks.yaml (configuração não prova ativação). Verificação: .tsf/verify.py, .tsf/tests/test_runner.py; scripts e tests do produto. Estado privado: .tsf/state/ (não empacotar ou expor). [Inventário](APP-FILES.md) localiza app/protótipo.

## Ganho observado e atribuição

Escopo cresceu por incrementos preservando núcleo; domínio passou historicamente de 15 para 22 cenários e harness de 11 para 13. Feedback editorial reduziu vídeo de 98,27s para 45,5s. Isolamento permitiu comparar snapshots com bancos próprios; harness comprovou bloqueios e retomada. Esses resultados são compatíveis com utilidade do processo, mas não medem efeito causal do TSF: não há grupo de controle, horas/custo confiáveis ou baseline humano. Não converter +46,7% de testes em +46,7% de produtividade.

## Melhorias propostas com evidência e aceite

| Achado | Mudança proposta | Aceite verificável |
|---|---|---|
| Readiness/encerramento de DB contaminou build | Preflight SELECT 1 e manter runtime até fim | Build limpo e teste negativo recusado sem suprimir auth; helper entregue |
| Guias assíncronos e carregamento interferiram no script | Esperar estado explícito/fechamento antes de interagir | Jornadas sequenciais passam e tentativas inválidas permanecem registradas |
| Traces podem conter cookie | Persistir somente resumo redigido | Artefatos sem sessão/token/credenciais |
| Primeira entrega visual abaixo do esperado | Amostra representativa com referência revisada antes de expandir | Operador revisa desktop/mobile da mesma tarefa |
| CSS/Dashboard acumulam responsabilidades | Extrair módulos e tokens por área quando autorizado | Mesmas APIs/fluxos, regressão de telas e ajuda |
| Métricas humanas inexistentes | Protocolo equivalente, ordem alternada, esforço/custo por rodada | Resultados reais e limites da amostra; CSV humano separado |
| Recibos TSF não cobrem todo código visual | Gerar manifesto base/head/diff, comandos e resultado por incremento | Cadeia requisito→mudança→verificação→decisão sem alegar autonomia |
| Vídeo defasado após design | Regravar somente após UI estabilizada | Rótulos/fluxos atuais; sem reset de progresso por inferência |

Prioridade imediata: comparação funcional reproduzível, documentação e revisão humana; depois medir trabalho humano/recorrência antes de propor automação. Dez ciclos humanos e cinco sucessos consecutivos requeridos pelo plano para proposta de promoção não foram demonstrados. Nenhuma promoção automática, novo gasto, cron ou alteração de política é autorizada por este texto.
