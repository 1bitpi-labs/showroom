# Execução local do piloto TatuDoBem

2026-11-12. Operador aprovou a jornada consolidada: “aprovado, pode seguir com o piloto Cliente TatuDoBem”. Autorização aplicada à captura, integração local e manutenção de verificações delimitadas deste piloto. Não representa aceite G1 do resultado. TatuDoBem interpretado como cliente fictício da demonstração; empresa Brisa Oficina mantida.

Produto implementado em worktree exclusiva `<workspace>/elos-pme-clientes-video`, branch `codex/clientes-video-tatudobem`, base `dd7a3c5`. Nenhuma edição no checkout `<workspace>/elos-pme-portal-codex`; README alheio preservado. Banco separado em 55440, aplicação de revisão em 3018. Sem alterar instância 3017 ou seu banco.

Entregas reais: MP4 98,27s capturado da interface, cliente sintético TatuDoBem, legendas PT-BR, poster, transcrição, capítulos e manifesto; popup e catálogo existentes integrados; roteiro convertido em demonstração cadastrar/salvar/buscar/editar/conferir; sem alterar API, schema ou versão global de progresso.

Evidências e instruções no produto: `docs/CLIENTES-VIDEO-EVIDENCE.md` e `docs/changes/clientes-video-pilot.md`. Mídia em `public/training/clientes/v1/`. Smoke reproduzível em `scripts/clientes-video-smoke.ts`. Capturas e resultado local em `.tsf/state/artifacts/clientes-video/` (não versionados).

CV-CAP e CV-UI executadas manualmente de forma supervisionada, fora de adapter de modelo. CV-MAINT contém smoke focado. CV-QA: 22 testes PostgreSQL/domínio, 13 harness, build/TypeScript e navegador 360/1280 aprovados. Runner TSF existente verificou hashes finais e recibo de browser com envelope validado: READY FOR REVIEW, provider fake, sem modelo vivo. Esse recibo não afirma que o runner executou a implementação/captura nem concede aceite.

Limites: revisão humana integral de mídia e avaliação de fluidez pendentes; nenhum leitor de tela/auditoria WCAG completa; vídeo desktop no celular pode exigir tela cheia. Não há retomada persistente, rascunho entre abas, certificação ou expansão às demais abas. Nenhum push, deploy, gasto, cron, wiki ou upload externo.

Próximo passo único: operador assistir e testar o piloto isolado antes de aceitar ou replicar o padrão.

Commit local de entrega no produto: `76d306b`, branch `codex/clientes-video-tatudobem`. Arquivos preparados para revisão; sem push ou integração na branch original do operador.

## Feedback de ritmo e revisão v2

Operador solicitou uma demonstração mais fluida por considerar a duração excessiva para poucas ações. Reedição local concluída: 45,5s, com remoção de esperas, sequência e resultados preservados. Nova pasta public/training/clientes/v2, v1 mantida, player/catálogo atualizados com legendas, transcrição e capítulos sincronizados. Build/TypeScript, integridade/hashes e smoke 360/1280 passaram. Produto continua na branch isolada codex/clientes-video-tatudobem; evidências detalhadas no próprio produto. Sem push, deploy, alteração no checkout/banco do operador ou expansão às outras abas. Próximo passo: avaliação humana do ritmo da v2.
