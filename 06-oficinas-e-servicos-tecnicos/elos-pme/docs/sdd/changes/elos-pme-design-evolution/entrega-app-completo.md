# Handoff local — implementação Brisa

2026-11-12. Autorização do operador: implementar aplicativo completo usando HTML de referência. Código na worktree exclusiva `<workspace>/elos-pme-clientes-design`, branch `codex/clientes-design`, base `225cdcc`. Alterações locais ainda não commitadas/publicadas; não integradas ao original nem ao piloto 3018.

Registro detalhado: `docs/changes/full-app-design.md` no produto. Inclui estrutura comum das oito áreas, menu móvel, busca global, filtros, Clientes carteira/modal, OS lista/quadro, drawer histórico, prévia de marca, progresso real por conta e guia recolhível. APIs/regras/snapshots preservados; sem schema novo.

Evidências: 22 testes de domínio em banco próprio; smoke Clientes 360/1280; smoke oito abas e ações novas 360/768/1280, todos concluídos. JSON/capturas no produto `docs/evidence/full-design/`. TypeScript/build Webpack verificados. Nenhum bug funcional de produto foi inferido a partir dos dados estáticos; achado da nova busca global corrigido usando ID exato.

Vídeo antigo identificado como interface anterior, passos textuais adaptados, sem reset global do treinamento. Capturas são app real com dados sintéticos, não mock integrado. Revisão visual humana e G1 não inferidos. Sem push/merge/deploy, serviços externos ou dados de outros bancos.

Próximo passo único: revisão visual do operador sobre a implementação local antes de integração.
