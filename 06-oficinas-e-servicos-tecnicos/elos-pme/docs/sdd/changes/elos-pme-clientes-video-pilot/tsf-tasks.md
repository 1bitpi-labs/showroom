# Tarefas TSF propostas — execução local supervisionada

Nenhuma issue/run criada. IDs abaixo são locais à proposta; reconciliar backlog antes de cadastrar issues. Sem modelo pago, cron, autonomia, push, deploy ou upload. Um executor por vez; cada tarefa recebe base/head, allowlist concreta, denylist, ACs e envelope do runner existente. Mudança em tests/harness/infra somente em manutenção explícita autorizada. Owners são sugestões, não delegações iniciadas.

| ID | Dependência | Owner proposto e limite | Entrega / aceite |
|---|---|---|---|
| CV-SPEC | nenhuma | Codex, planejamento apenas | Os quatro documentos consolidados e a revisão independente; operador revisa proposta, roteiro e política de término. Estado atual: pronto para revisão documental. |
| CV-CAP | revisão do operador e autorização de captura/ambiente | Operador ou executor local supervisionado | Ambiente sintético isolado; gravação/MP4/VTT/transcrição/poster e manifesto local. Allowlist só artefatos locais da captura; sem patch funcional. V01,V06,V07. |
| CV-MAINT | spec aprovada e autorização explícita de manutenção | Engenheiro de testes, worktree própria | Diff de testes focado em V02–V06; allowlist de arquivos de testes nominal definida no início. Não alterar harness/policy para aprovar produto. |
| CV-UI | mídia revisada, CV-MAINT e implementação autorizada | Codex ou mantenedor do produto em worktree exclusiva | training.tsx, training-content.ts, dashboard.tsx, referências necessárias em getting-started.tsx e estilos estritamente necessários e public/training/clientes/v1; fechar allowlist nominal após descoberta. API/schema/banco/lockfiles fora. V02–V06; sem editar README alheio. |
| CV-QA | CV-UI | Revisor local + operador | Typecheck/build e regressões aplicáveis; navegador 360/1280, mídia indisponível, duas contas, concorrência/replay e navegação das demais abas. Registrar V01–V07 com resultados reais, sem chamar green de homologação. |

Se a integração exigir persistir posição do vídeo, nova versão global ou migração: parar essa expansão e propor tarefa/spec específica; não introduzir pela CV-UI. Backend existente é reaproveitado, e seus testes de isolamento/idempotência devem continuar válidos.

Por run futura: task_id, acceptance_refs, base/head/diff, changed_files, comandos e exit codes, hashes/artefatos, limitações e status READY FOR REVIEW/FAILED/BLOCKED. Usar envelope validado pelo harness real, sem inventar prova de execução. Feedback humano registra approved/rejected/corrected; não promover autonomia nem G1 automaticamente. Tarefa de captura pode ser checklist supervisionado se não existir adapter seguro para captura no runner; declarar isso, sem ampliar permissões do harness.

Verificação desta entrega: leitura documental e inspeção estática do treinamento; sem build, testes do produto, browser ou gravação. Próximo passo único: revisão pelo operador da CV-SPEC, especialmente saída disponível desde o início, fim parado com retorno à operação, consulta textual alternativa e reinício após fechar.

CV-MAINT/CV-QA devem cobrir também capítulos sem autoplay, saída durante erro/pendência, resposta tardia versus nova abertura, preservação de campos/ID na mesma aba, foco e revisão editorial sem reabrir guias concluídos. Não prometer rascunho entre abas. CV-UI deve alinhar entrada, texto, término e FAQ com proposal.md; sem novo backend/migração. Evidência humana de recuperação da ajuda sem orientação do moderador é condição para propor replicação; falha crítica exige ajuste e reteste.
