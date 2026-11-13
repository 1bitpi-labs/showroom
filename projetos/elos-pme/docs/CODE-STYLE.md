# Code Style — convenções vigentes

TypeScript strict, módulos ES, JSX React, alias `@/*` para src. Componentes interativos usam `use client`; acesso ao banco fica no servidor. React renderiza dados escapados, sem transpor templates innerHTML do protótipo. Hooks no topo, estados locais coerentes e efeitos com limpeza; respostas antigas não devem sobrescrever consulta recente.

Prettier para TS/TSX/CSS. Não há script ESLint configurado nem regra de lint fictícia. `npm run typecheck` usa `--noEmit --incremental false`; skipLibCheck é opção existente de dependências, não tipagem garantida dessas bibliotecas. Novos contratos devem preferir tipos explícitos; `any` histórico em histórico/PDF é dívida de manutenção, não padrão recomendado.

Valores financeiros em centavos; schemas Zod estritos; domínio em src/lib, HTTP apenas valida contexto/traduz erros. Transações para invariantes. Componentes de ajuda usam labels, type=button e foco. Usar APIs existentes antes de criar endpoints/dados só por exigência visual.

CSS da área autenticada é delimitado por `.brisa-app`; evitar vazamento ao portal público. Consolidar overrides históricos em tokens/componentes é melhoria proposta. Não criar nova dependência ou migrar framework por preferência pessoal.

Uma branch/worktree por entrega; inspecionar Git antes de editar. Não mudar trabalho não commitado alheio, stash/reset/clean. Commits descrevem escopo final; nunca incluir `.env`, node_modules, `.next`, dumps ou traces de sessão. Testar comportamento afetado, sem duplicar implementação em testes triviais. Alteração de fluxo deve atualizar ajuda textual; mídia incompatível deve ser identificada/revisada.
