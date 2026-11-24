# Evidências de planejamento

2026-11-12 — Entregues proposal.md, spec.md e tsf-plan.md na branch t3/review-tsf-saas-workflow, worktree exclusiva do Codex. Nenhum código de produto, logo, site, banco, daemon ou cron criado. Nenhuma publicação, contato comercial, gasto ou edição em worktree de terceiros.

Fontes lidas: playbook TSF v2.0.0 e workflow original em Research_Construtor_Fluxos; skill/CLI TSF inspecionadas na análise anterior; AGENTS e documentação de autoridade do Agent OS. Referências web primárias e data em proposal.md.

FATO: empresas pesquisadas exibem serviços e CTA/formulário de orçamento. INFERÊNCIA: fluxo semelhante pode servir a empresas do nicho. PROPOSTA: Brisa Oficina é identidade fictícia, não cliente conquistado nem marca comercial disponível comprovada.

Validação nesta entrega: conferir diff sem erros de whitespace, referências internas e presença dos onze ACs/cinco estágios TSF. Testes de produto e verificação visual não aplicáveis: somente documentos. G0 e G-TSF permanecem pendentes; proposta de orçamento não autoriza despesa.

Próximo passo único: revisar e ratificar G0 sobre esta change antes de criar o código do produto.

## Atualização de implementação — 2026-11-12
G0 aprovado explicitamente pelo operador na conversa. Código criado no repositório dedicado `<workspace>/elos-pme-portal`, worktree `<workspace>/elos-pme-portal-codex`, branch `codex/quote-portal`. Sem mudanças no aplicativo Agent OS ou em worktrees alheias.

MVP local supervisionado implementado: autenticação, rascunhos, revisão/publicação, token público revogável, decisão idempotente, OS, PDF, CSV, marca demo e backup/restore. Evidências e limites em `elos-pme-portal-codex/docs/IMPLEMENTATION-EVIDENCE.md`; runbook em README.md do produto.

15 testes PostgreSQL, 11 TSF, 17 checks HTTP, navegador 360/1280 e build passaram. Runner determinístico registrou READY FOR REVIEW; chamadas de modelo e crons desativados. Não equivale a operação TSF paga/24h. G1 humano, revisão independente de release e G2/G3/G4 pendentes. Próximo passo único: homologação local do operador.
