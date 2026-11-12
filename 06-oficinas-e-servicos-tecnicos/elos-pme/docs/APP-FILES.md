# Arquivos do aplicativo, protótipo e desenvolvimento

Inventário verificável: [app-files.json](app-files.json), com 78 arquivos e SHA-256. Não é bundle de node_modules, .next, ambientes, backups ou estado privado. Código e assets permanecem nos diretórios nativos; não duplicamos site em pasta paralela.

| Grupo | Fonte |
|---|---|
| Entrada, login e portal público | src/app/page.tsx, layout.tsx, login/page.tsx, p/[token]/page.tsx |
| App interno e estilos | src/app/dashboard.tsx, src/app/globals.css |
| Componentes de operação/ajuda | src/app/components/ |
| API e domínio | src/app/api/, src/lib/ |
| Banco e operação local | scripts/schema.sql, migrate.ts, seed.ts, backup/restore e compose.yaml |
| Testes e reprodução | tests/, scripts/*smoke.ts, version-comparison.ts, verified-build.ts |
| Harness TSF | .tsf/config.yaml, identity.json, engine/, harness/, prompts/, tests/, verify.py |
| Mídia versionada do piloto | public/training/clientes/v1/ e v2/ |
| HTML original fornecido | [prototype/brisa-oficina-reference.html](prototype/brisa-oficina-reference.html) |
| Referência funcional e decisões | docs/spec.md, changes/, ADR-0001.md e TSF-WORKFLOW.md |
| Continuidade do agente | [AGENTS.md](../AGENTS.md) |

O HTML foi copiado localmente do anexo do operador, com normalização apenas de espaços no fim das linhas para o diff público. Contém Tailwind/Lucide/fontes remotas e dados/ações simulados. Preservado para rastreabilidade; não é frontend integrado nem prova operacional. Abrir pode solicitar dependências externas; não o usar para dados privados.

Snapshot funcional A=225cdcc, B=21a3a3d; commits posteriores documentam/validam, sem mudar esses alvos. Manifesto identifica arquivos desta entrega; mídia antiga não se torna compatível por constar no inventário.
