# Evidências — implementação local

G0: aprovado explicitamente pelo operador após entrega da spec/plano; início de implementação nesta conversa em 2026-11-12. Aprovação permite desenvolvimento local; não foi interpretada como gastos externos, publicação ou promoção de autonomia.

## Implementado e correspondência

- AC01: Better Auth, cadastro público bloqueado, sessões de banco, recuperação CLI e CSRF de mutações; smoke HTTP verifica 401/403 e login.
- AC02/03/05/06: schema estrito, valores em centavos e totals server-side, snapshots/versionamento, validade/revogação e GET sem efeito. Testes PostgreSQL.
- AC04: doze chamadas concorrentes do mesmo aceite criam uma decisão e OS; também race entre nova revisão e aceite. Transação serializada por lock do orçamento.
- AC07: PDF real gerado/baixado via HTTP e histórico de versões; snapshots e eventos protegidos por trigger. Conteúdo do PDF é gerado do snapshot, sem recurso remoto. Inspeção visual do PDF ainda não executada.
- AC08: HTTP testa sessão/CSRF, nega token falso, revogado e expirado; CSV formula-safe, React escapa texto. Rate limits de aplicação e Better Auth configurados. Auditoria de segurança completa não realizada.
- AC09: pg_dump custom restaurado em banco vazio `elos_restore_check`; comparados hash agregado de IDs/snapshot_hash/totais e counts de decisões/OS com igualdade. Artefato privado em backups/, fora do Git.
- AC10: Chromium real em 360 e 1280 pixels percorreu login→publicação→portal→aceite→OS; screenshots anexas em docs/evidence; sem pageerror/overflow. Tab alcança elemento focável, offline/reconexão recupera consulta sem repetir decisão. Falha durante POST possui mensagem/retry pela UI, mas não houve simulação específica de corte de rede após commit.
- AC11: seed demo executado com credencial aleatória em arquivo gitignored; reset local explícito e migrações reproduzidas também em banco de teste separado. Bootstrap de dependências executado; segundo checkout limpo ainda não ensaiado.

## Checks executados

15 testes Node/PostgreSQL; 11 testes unittest/Pydantic TSF; 17 checks HTTP; browser 360/1280. Build Next e typecheck aprovados (confirmar registro final no handoff). Node do sistema 20 não atende Kysely; Node 22 instalado localmente e documentado. Migration import inicial corrigido para export oficial `better-auth/db/migration`; typecheck usa skipLibCheck para declarações das dependências, mantendo strict no produto.

## TSF — fatos e feedback

Estrutura `.tsf/` versionada, state SQLite gitignored. JSON em arquivos `.yaml` é sintaxe YAML válida, lida sem dependência YAML. Contrato BuildOutput validado em Pydantic com campos extras proibidos, prompt correspondente e runner. ReviewOutput/PlanOutput definidos; executor de modelo/revisão não habilitado.

Testes comprovam task approval, cap por worker/dia, recusa de provedor desconhecido, envelope inválido, traversal, timeout, lease e retomada de run expirada, detecção de conteúdo/deleção fora da allowlist. Isso valida o simulador/deterministic runner, não cobrança real de API ou sandbox de um agente externo.

Primeira execução de verificação foi BLOQUEADA por alteração de `tsconfig.tsbuildinfo`, detectada pelo snapshot. Correção: typecheck sem incremental, sem relaxar permissões. Segunda execução chegou a READY FOR REVIEW. São runs de checks, não os dez ciclos de revisão humana do playbook. Feedback técnico não foi atribuído ao humano. Nenhuma promoção, chamada paga, daemon ou cron executado.

## Pendências explícitas

Revisão independente antes de release e aceite humano G1; host/TLS/backups cifrados/retention/monitoramento e gates G2/G3 antes de exposição; adapter LLM financeiramente limitado e baseline do gargalo para Near-the-loop; dez ciclos observados e cinco sucessos para proposta de promoção. Demo local implementada não prova vendas nem economia de tempo.
