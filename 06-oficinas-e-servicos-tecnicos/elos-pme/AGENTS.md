# ElosPME Portal
Este repo contém o produto, separado do Agent OS. Desenvolvimento TSF local supervisionado; branch de evolução codex/clientes-design (histórico original codex/quote-portal). Não editar outras worktrees. Escopo/ACs: docs/spec.md. G0 aprovado pelo operador na conversa; implementação local e testes autorizados. Sem push, deploy, gastos ou novos agentes sem autorização aplicável. Modelos pagos/crons desativados. `.env.local` contém segredos locais: não imprimir, copiar para docs ou commitar. Dados de demo são sintéticos. Testes determinísticos antes de revisão; testes/infra/harness só em tarefa de manutenção explícita. TSF pago falha fechado até adapter validado. Consulte STATUS.md e README.md.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Conhecimento do projeto e método

Leia [docs/INDEX.md](docs/INDEX.md), [docs/PRD.md](docs/PRD.md), [docs/TSF-WORKFLOW.md](docs/TSF-WORKFLOW.md) e STATUS antes de implementar. Consulte Design System, Architecture, Database, Security, Code Style e Testing pelo índice. A origem foi Tiny Software Factory v2.0.0, adaptado a execução supervisionada; provider fake/harness não representa agente autônomo. Sem cron, promoção, modelo pago ou novos gates por inferência.

Fluxo: descoberta → spec/aceites → autorização aplicável → worktree exclusiva → incremento → verificações → evidências → decisão humana. Fonte de negócio: spec/changes e código; HTML em docs/prototype é referência estática e contém funções simuladas. Inventário e hashes em docs/APP-FILES.md e docs/app-files.json. Atualize documentação/ajuda ao mudar fluxo.

Build validado com PostgreSQL pronto/ativo; use scripts/verified-build.ts sem desligar DB até término. Não rodar dev/build simultâneos na mesma .next. Scripts de QA têm alvos sintéticos específicos: leia docs/TESTING.md antes de executar. Não usar bancos/processos alheios ou registrar cookies/tokens, inclusive em traces sintéticos.

Comparação A=225cdcc e B=21a3a3d preserva snapshots. Resultados técnicos e método: docs/COMPARISON-RESULTS.md. Tempos robóticos não são produtividade humana; nenhum G1 ou ROI é inferido. Melhorias TSF propostas em docs/TSF-WORKFLOW.md não concedem autonomia.
