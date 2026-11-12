# Build e comparação anterior/atual

2026-11-12. Autorização do operador: resolver ressalva do build e preparar comparação. Build repetido com banco próprio confirmado por pg_isready/consulta e mantido ativo até término: saída 0, sem ERROR/erro Better Auth. Não foi necessário alterar auth, schema, dependências ou desabilitar validação. Causa sustentada pela sequência observada: build iniciado durante readiness/encerramento do PostgreSQL; a mensagem era genérica e não provava mismatch de schema. Log em docs/evidence/build-readiness/build-ready.log.

Helper scripts/verified-build.ts verifica SELECT 1 com timeout antes de invocar Webpack e propaga código de saída. Executar: node --env-file=.env.local --import tsx scripts/verified-build.ts. Não inicia banco, migra ou libera homologação. Manter banco ativo até o processo terminar.

Comparação usa base anterior 225cdcc (piloto completo antes de design) versus snapshot commitado da evolução. Bancos sintéticos próprios e independentes, mesmas condições/seed. Não comparar com a instância do operador ou usar dados privados. Resultados humanos ainda não coletados.

Conclusão: reprodução em duas worktrees novas (225cdcc e 21a3a3d), com npm ci independente sem symlink, bancos novos e builds Webpack sem erros/avisos Better Auth. Login e consultas autenticadas passaram em ambas, com seed/progresso equivalentes. Build B foi executado pelo helper; teste negativo contra endpoint indisponível retornou 1 antes de invocar Next. Não se alterou auth ou se desativaram verificações. Serviços de comparação preparados em 3020/3021; roteiro e registro humano no planejamento sdd/changes/elos-pme-design-evolution/comparacao/. Sem resultados humanos ou G1 inferido.
