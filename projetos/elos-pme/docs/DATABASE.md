# Database — modelo e invariantes

Fonte do schema de negócio: [scripts/schema.sql](../scripts/schema.sql); Better Auth cria suas tabelas via `getMigrations(auth.options)` em [migrate.ts](../scripts/migrate.ts). Não duplicar schema de auth manualmente. PostgreSQL é autoridade para persistência; uma base por instalação.

| Entidade | Relações / finalidade |
|---|---|
| company_settings | singleton id=1; nome, demo, cor |
| clients | nome/contato/endereço/observações; UUID |
| quotes | cliente, código identity único, estado, revisão atual, rascunho JSON |
| revisions | orçamento+number único; snapshot JSON, total centavos, hash, validade |
| public_links | revisão, hash único do token, expiração/revogação |
| decisions | uma por revisão; kind, responsável, hash e chave idempotente |
| service_orders | uma por orçamento; revisão aceita, estado e motivo |
| audit_events | append-only na aplicação/trigger; eventos sem segredos |
| equipment | cliente, identificação/modelo/BTU/série/local, data informada |
| appointments | cliente, equipamento/OS opcionais, técnico, início/duração e estado |
| training_progress | usuário da sessão + tour + versão; skipped/completed |
| notifications | usuário e conclusão; leitura privada/idempotência |
| request_limits | contadores e janela de limitação |
| user/account/session etc. | geridas por Better Auth, conforme migração vigente |

Total sempre em centavos no servidor. Snapshot/revisão publicada e eventos protegidos por triggers; administrador do banco não é adversário coberto por promessa de imutabilidade absoluta. Visitas persistem instantes UTC; UI explicita fuso. Próxima manutenção é data informada, sem periodicidade/certificação automática. Conflitos de visitas verificam técnico normalizado e intervalo em transação; não há cadastro de equipe.

Guia concluído é leitura declarada por conta, não execução certificada. Alterar mídia não reseta versão do progresso automaticamente.

Backup/restore: seguir README e scripts administrativos com banco alvo explícito. Evidência histórica de restore não aprova mutação de banco alheio. Sem reset/destruição automática durante QA. Comparação: bancos próprios elos_compare_before/after em 55441; instâncias do operador 55439/55440 não são alvo.
