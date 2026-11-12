# Architecture — implementação real

Next.js 16.4.6, React 19, TypeScript, PostgreSQL e Better Auth. Instalação por empresa; sem API externa operacional ou multi-tenancy compartilhada. [ADR de stack](ADR-0001.md).

## Fluxo de requisição

Navegador → páginas App Router → rotas API autenticadas → validação de sessão/origem/Zod → domínio/transaction → PostgreSQL. Resposta persistida atualiza UI. Portal `/p/[token]` acessa somente revisão permitida; decisão vai à API pública com confirmação e chave idempotente. PDF usa snapshot; CSV é exportação autenticada.

## Camadas e arquivos

- `src/app/page.tsx`: sessão no servidor e entrada do Dashboard; `login/page.tsx` autentica.
- `src/app/dashboard.tsx`: navegação, orçamentos, OS, busca, histórico e configurações.
- `src/app/components/operations-panel.tsx`: clientes/equipamentos/agenda; `training.tsx`, `help-field.tsx` e `getting-started.tsx`: assistência.
- `src/app/api/`: contratos HTTP. `src/lib/http.ts`: sessão/origem/falhas; `auth.ts`: autenticação; `db.ts`: pool/transação.
- `src/lib/domain.ts`: propostas/revisões/decisões/OS; `operations.ts`: cadastros/visitas; `training*.ts`: progresso/avisos/conteúdo.
- `scripts/schema.sql`, migrate/seed/backup/restore: administração explícita.
- `.tsf/`: harness separado. Não participa do request do cliente nem autoriza ações pela UI.

## Concorrência e autoridade

Lock transacional serializa aceite versus revisão; unicidade no banco impede duplicação de decisão/OS. Snapshots e eventos têm triggers de proteção. Estado visual não supera essas regras. Atualização em foco/troca de aba consulta o servidor; não há sincronização externa demonstrada.

## Operação e evolução

Build Webpack validado; readiness do banco deve anteceder build e o banco ficar ativo até o fim, pois Better Auth inicializa validação ao importar módulos. Não compartilhar `.next` entre build/dev nem rodadas de QA concorrentes. Depender de banco durante build é limitação atual, não motivo para desativar validação.

Propostas: extrair Dashboard/OperationsPanel em módulos por área e consolidar CSS após estabilização visual. Sem trocar arquitetura ou reescrever APIs só para imitar o HTML. Snapshot comparativo: A 225cdcc e B 21a3a3d; documentação posterior não altera esses alvos.
