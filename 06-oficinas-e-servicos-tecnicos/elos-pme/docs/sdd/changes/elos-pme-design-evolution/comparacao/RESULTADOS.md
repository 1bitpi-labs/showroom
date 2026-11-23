# Comparação executada — versões e método TSF

2026-11-12. Avaliação técnica automatizada em Chromium local, dados sintéticos e runtimes de produção separados. Não é estudo com usuários. A=225cdcc/3020, B=21a3a3d/3021; ambos com dependências próprias e bancos elos_compare_before/after em 55441. Execução sequencial A→B no celular, B→A no desktop; não houve reset de contas ou remoção de tentativas anteriores. Fixtures únicas por execução; conjuntos cresceram durante tentativas. Comparação não tem amostra estatística nem controle de volume idêntico no final.

## Resultado funcional

| Cenário | A 360 | B 360 | A 1280 | B 1280 |
|---|---|---|---|---|
| Cliente cadastrar/buscar/editar/mesmo ID após reload | passou | passou | passou | passou |
| Rascunho → publicação R$360 → aceite no portal/uma OS | passou | passou | passou | passou |
| Iniciar/concluir OS e conferir persistência | passou | passou | passou | passou |
| Equipamento 12.000 BTU → visita → concluir, preservando estado da OS | passou | passou | passou | passou |
| Ajuda textual preserva nome não salvo na mesma aba | passou | passou | passou | passou |
| Localizar orçamento e baixar PDF com HTTP200/application/pdf | passou | passou | passou | passou |

24/24 execuções aprovadas na rodada final. Sem pageerror/overflow nos estados visitados. Não equivale a ausência de bugs, auditoria completa de PDF, concorrência ou acessibilidade. A visita neste ensaio ocorreu após OS já concluída e sem vínculo opcional de OS: não comprova que visita mantenha OS pendente; essa separação tem testes de domínio prévios.

## Ganho de composição medido

Posição vertical absoluta do input Buscar clientes no documento, antes de iniciar cadastro, viewport de altura 900px. Medição DOM em navegação inicial, não tempo humano ou distância efetivamente percorrida por uma pessoa.

| Dispositivo | Anterior | Atual | Diferença | Redução relativa |
|---|---:|---:|---:|---:|
| Celular 360px | 1.308px | 660px | −648px | 49,5% |
| Desktop 1280px | 827px | 507px | −320px | 38,7% |

Causa compatível com código: cadastro saiu do fluxo inicial para modal e navegação móvel ficou compacta. Em contrapartida, criar cliente agora exige abrir Adicionar cliente; não declarar todos os fluxos mais rápidos. Houve preservação funcional e melhora mensurável da posição da busca. Filtros, paleta global, quadro OS e prévia de marca são capacidades de interface adicionais; não são novos módulos de negócio nem faturamento.

Durações de automação brutas estão no JSON apenas como diagnóstico. Incluem login fora das tarefas, esperas de rede/guia e seletores predefinidos; apenas uma rodada final, ordem alternada por dispositivo e volumes crescentes. Não calcular economia humana a partir delas.

## Qualidade da execução

Tentativas inválidas preservadas separadamente: consulta do DOM antes da carga; guia assíncrono interceptando clique; interrupção dos processos 3020/3021 durante a execução. Correções no script aguardam estado explícito e fecham guia por ação visível; runtimes próprios reiniciados. Não houve correção de produto para forçar sucesso da comparação. Erros persistidos foram redigidos para remover traces/cookies. CSV humano continua vazio.

Script: scripts/version-comparison.ts. Reprodução requer ambas as versões em execução, variável DATABASE_URL apontando banco sintético elos_compare_* em 55441 e DEMO_PASSWORD privado. Executar com env privado de uma worktree de comparação; não apontar para produção. Saída padrão docs/evidence/version-comparison; pode ajustar COMPARISON_OUTPUT. Script cria dados e progresso de adiamento, não destrói bancos. Preservar evidências; nova rodada gera fixtures adicionais.

## Avaliação do método/playbook

TSF v2 aplicado parcialmente e de forma supervisionada. Benefício comprovado: artefatos revisáveis, regras protegidas, worktrees/bancos isolados, snapshots comparáveis, checks e feedback convertido em ajuste. Harness reexecutado: 13/13 testes passaram (permissões, envelope, timeout, lease/restart e budget fake). Isso comprova controles, não execução autônoma da construção.

Histórico: domínio 15→22 cenários (+7/+46,7%); mídia 98,27→45,5s (−53,7%); build limpo reproduzido após readiness e instalação própria. Não atribuir causalmente esses ganhos só ao TSF: houve requisitos adicionais, design fornecido e trabalho supervisionado, sem grupo de controle nem horas/custos por rodada. Promessa de 80% sem humano ou entrega em 16min do playbook não foi validada e não é critério aceito para este produto.

Retrabalho observado: primeira adaptação visual conservadora precisou realinhamento; sync de guias/scripts exigiu ajustes; ambiente build/DB gerou falso sinal. Melhorias do processo registradas em TSF-WORKFLOW.md: amostra visual antes da expansão, readiness/environments, redação de traces, recibos por incremento e baseline humano antes de propor autonomia.

Parecer: método útil para rastreabilidade e contenção de risco no trabalho demonstrado; eficiência de desenvolvimento e ROI não quantificados. Produto preservou seis jornadas e melhorou acesso à busca; aceite humano permanece separado. Próximo passo: revisão humana com protocolo equivalente, mantendo tempo/erros/intervenções reais por tarefa.
