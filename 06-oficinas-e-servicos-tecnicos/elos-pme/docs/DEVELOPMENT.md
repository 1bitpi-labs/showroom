# Desenvolvimento e construção — ElosPME

[Voltar ao README](../README.md)

## Objetivo e decisões

O produto começou como recorte do plano ElosPME: um portal de aprovação de orçamentos para climatização, entregue por instalação. O operador aprovou o escopo e depois solicitou ajuda contextual, treinamentos e abas operacionais. A arquitetura é uma aplicação Next.js com PostgreSQL; Python é usado apenas no harness TSF.

A [ADR-0001](ADR-0001.md) registra stack e isolamento. O [spec.md](spec.md) reúne requisitos e referências dos incrementos. O [STATUS.md](../STATUS.md) é a referência de estado; documentos iniciais de proposta/plano preservam o contexto histórico e não substituem esse status.

## Organização do código

| Área                                  | Responsabilidade                                                     |
| ------------------------------------- | -------------------------------------------------------------------- |
| `src/lib/domain.ts`                   | Orçamentos, versões, decisão pública, OS, cálculos e CSV.            |
| `src/lib/operations.ts`               | Clientes, equipamentos e agenda; coerência de vínculos/conflitos.    |
| `src/lib/training.ts`                 | Progresso e avisos por usuário; conclusão idempotente.               |
| `src/lib/training-content.ts`         | Conteúdo/versionamento dos oito guias.                               |
| `src/lib/auth.ts`, `db.ts`, `http.ts` | Autenticação, transações, sessão/origem e parsing de requests.       |
| `src/app/api/`                        | Entradas HTTP de domínio, documentos, autenticação e operação.       |
| `src/app/components/`                 | Ajuda, primeiros passos, treinamentos, caixa de entrada e operações. |
| `scripts/schema.sql`                  | Schema de negócio e alterações aditivas atuais.                      |
| `scripts/migrate.ts`                  | Migração Better Auth e aplicação do schema de negócio.               |
| `tests/`                              | Testes de integração com PostgreSQL/domínio.                         |
| `.tsf/`                               | Configuração, contratos Pydantic, runner e testes do harness.        |

Não há RLS multi-tenant ou API FastAPI neste produto. A separação de empresas é por instalação/banco. Treinamentos e notificações, dentro da instalação, são separados por usuário autenticado.

## Processo TSF aplicado

Fonte metodológica usada nesta máquina: `/home/caueantonacci/GIT/Research_Construtor_Fluxos/pesquisas/playbooks/tiny-software-factory/PLAYBOOK_TFS.md` v2.0.0 e workflow correspondente. A fonte não é empacotada neste repo; o contrato aplicado está documentado em [tsf-plan.md](tsf-plan.md).

| Etapa do playbook             | Evidência/estado no projeto                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Auditoria e missão específica | Escopo e aceites, com elegibilidade condicional para automação contínua; baseline comercial ainda não medido.             |
| Base durável                  | Repo/worktree exclusivos, `.tsf/`, contratos e SQLite local de runs.                                                      |
| Especialização                | Spec, prompts, allowlists e ferramentas determinísticas.                                                                  |
| Near-the-loop                 | Verificações supervisionadas reais; executor LLM/cron 24h não habilitado.                                                 |
| Feedback e promoção           | Feedback registrado e convertido em correções/testes; dez ciclos humanos qualificantes e promoção No-loop não realizados. |

O processo implementado não demonstra uma fábrica autônoma completa. O runner atual recusa provedores sem adapter validado. Reservas e limites de custo são testados com fake provider; falta comprovar preço, contabilização, cancelamento e limite efetivo de um provedor pago antes de ativá-lo.

### Ciclo de um incremento

1. Registrar pedido, problema, requisitos, aceites e arquivos permitidos.
2. Trabalhar em branch/worktree exclusiva, verificando status e ownership antes de editar.
3. Separar tarefas de produto de manutenção de testes/schema/infra protegidos.
4. Executar tarefa delimitada; comparar hashes/permissões pré/pós contra allowlist.
5. Validar saída pelo contrato Pydantic e executar testes por subprocessos.
6. Corrigir falhas dentro do escopo, registrar resultado/evidências e entregar `READY FOR REVIEW`.
7. Obter aceite humano aplicável; build/test verde não representa autorização de publicação.

O código de produto foi desenvolvido em `codex/quote-portal`; o Agent OS permanece separado. Nenhum runner recebe autoridade para superar gates de push/deploy ou liberar arquivos protegidos.

### Harness e artefatos

- `.tsf/config.yaml`: JSON válido como YAML; missão, permissões, budgets e flags desativadas.
- `.tsf/harness/envelopes.py`: contratos `EnvelopeBase`, `BuildOutput`, `ReviewOutput` e `PlanOutput`, com campos extras rejeitados.
- `.tsf/prompts/`: instruções e schema de saída.
- `.tsf/engine/runner.py`: aprovação da tarefa, lock/lease, reserva simulada, timeout, snapshot, validação e persistência.
- `.tsf/harness/domain_tools.py`: comandos determinísticos permitidos.
- `.tsf/state/`: banco, artefatos e traces locais, fora do Git.

`python3 .tsf/verify.py` registra uma tarefa de **checagem supervisionada**, executa testes/typecheck/TSF e valida seu envelope. A aprovação registrada por esse comando corresponde às checagens locais autorizadas; não é aceite humano do produto nem permissão de release.

Snapshots detectam alterações; não constituem, sozinhos, sandbox contra todo efeito externo de um processo. Há exclusões de diretórios gerados e estado local. Usar um agente externo exigirá validar isolamento e credenciais além dos testes atuais.

## Ambiente Python do harness

Crie o ambiente fora do checkout para não incluí-lo na varredura de arquivos do runner:

```bash
python3 -m venv "$HOME/.venvs/elos-pme-tsf"
. "$HOME/.venvs/elos-pme-tsf/bin/activate"
python3 -m pip install -r requirements-tsf.txt
npm run test:tsf
python3 .tsf/verify.py
```

Se o comando `venv` não estiver disponível, instale o suporte correspondente do Python do seu sistema. Não versione ambientes virtuais, state, dumps ou segredos. Para o app, prepare Node/Compose/variáveis conforme o [README](../README.md#como-executar).

## Verificar uma alteração

Escolha os checks aplicáveis à mudança, sem executar smokes destrutivos em dados reais:

```bash
npm run typecheck
npm test
npm run test:tsf
npm run build
```

`npm test` usa `elos_test` via Compose local, executa migração e os testes de domínio/integração. Não depende de Next estar ligado. Build e typecheck também não precisam de um servidor web ativo; não compartilhe `.next` entre dev/build concorrentes.

Os scripts `http-smoke.ts`, `browser-smoke.ts`, `usability-smoke.ts` e `training-operations-smoke.ts` precisam do servidor em `localhost:3017`. Os de navegador têm caminho de Chrome fixo e usam dados sintéticos. O script de treinamento cria contas temporárias e as remove; clientes, orçamentos, aparelhos e visitas sintéticos podem permanecer.

As capturas em [evidence/](evidence/) foram feitas pelo navegador durante esses smokes. Elas são evidência de execução e não devem ser confundidas com dados reais ou demonstração de receita.

## Segurança e integridade do domínio

- Validar sessão e origem em mutações internas; rejeitar campos extras nos schemas.
- Calcular valores em centavos no servidor; preservar snapshots publicados.
- Serializar aceite e revisão por lock do orçamento; garantir unicidade de decisão/OS.
- Armazenar hash do token público, aplicar expiração/revogação e evitar tokens em logs.
- Validar pertencimento de equipamento/OS ao cliente e conflito de agenda em transação.
- Obter identidade de treinamento/avisos pela sessão, sem aceitar user ID arbitrário no request.
- Manter `.env.local`, `.tsf/state/`, dumps e dados privados fora de commits e prompts.

Esses controles e testes não equivalem a uma auditoria independente de segurança. Antes de produção, revisar permissões do banco, infraestrutura, TLS, logs, retenção, backup cifrado, monitoramento e suporte.

## Histórico de construção e aprendizados

| Entrega funcional | Resultado                                                                            |
| ----------------- | ------------------------------------------------------------------------------------ |
| `745423c`         | Primeiro MVP local: orçamento, portal, decisão/OS, PDF/CSV e harness supervisionado. |
| `d1e0720`         | Ajuda contextual, guia interno e refinamentos desktop/mobile.                        |
| `3b5c62d`         | Treinamentos por aba/conta, caixa de entrada, clientes, equipamentos e agenda.       |

Problemas concretos produziram correções: a allowlist passou a respeitar caminhos literais com colchetes; typecheck deixou de gerar arquivo incremental durante a verificação; rótulos de selects ficaram independentes de suas opções; o painel passou a atualizar decisões ao trocar de aba/retomar foco; testes respeitam Retry-After, sem enfraquecer o login.

A conclusão técnica é que o recorte pode ser implementado e verificado em ambiente local, com persistência e integridade observáveis. Não foi demonstrado que a operação comercial é rentável, que um cliente real adotou o sistema ou que a execução é autônoma/24h. O próximo incremento deve partir da homologação e do piloto, preservando esses limites.
