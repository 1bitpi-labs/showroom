# Revisão da entrega Brisa / ElosPME

## Problema e resultado

A referência HTML apresentava uma operação visualmente mais organizada que o app anterior. A implementação adapta as oito áreas ao domínio real: navegação responsiva e busca de abas/orçamentos; filtros; carteira/modal de Clientes; lista/quadro OS; drawer histórico/PDF; prévia de marca e progresso real de leitura. Formulários completos, persistência, snapshots e cancelamento com histórico foram preservados.

A documentação consolida PRD, Design System, arquitetura, banco, segurança, estilo, testes, fluxo TSF e inventário. O HTML original permanece referência estática, incluindo dados/ações simulados que não foram anunciados como capacidades do backend.

## Base e alvos

Repositório do produto separado do Agent OS. Branch codex/clientes-design. Histórico inclui MVP 745423c, usabilidade d1e0720, operações 3b5c62d e piloto 76d306b/225cdcc; evolução visual 21a3a3d e documentação posterior. Comparação A225cdcc/B21a3a3d permanece fixada; commits documentais não alteram esses resultados. Não foi aplicado merge às worktrees do operador ou do piloto.

Sem remote configurado na preparação inicial; a URL/base do PR deve ser o repositório de produto indicado pelo operador. Não usar agent-os como destino do app nem apresentar CI inexistente como aprovado. Não criar branch main artificial para mascarar o histórico.

## Evidências e verificação

- Domínio: 22 cenários PostgreSQL aprovados na rodada isolada anterior.
- Comparação técnica: seis cenários × A/B × 360/1280 = 24 execuções aprovadas na rodada final; JSON e screenshots em evidence/version-comparison/.
- Harness TSF: 13 testes reexecutados e aprovados, provider fake e estado temporário.
- Builds A/B com dependências próprias via npm ci: concluídos sem erros Better Auth após readiness do banco. Helper falha antes de Next quando banco indisponível.
- TypeScript, links locais, hashes de 78 arquivos e diff --check verificados. Revalidar conforme novos commits alterem essas entradas.

Comandos locais: npm run typecheck; python3 -m unittest discover -s .tsf/tests -v; git diff --check. Build: node --env-file=.env.local --import tsx scripts/verified-build.ts, com DB próprio ativo. Não executar npm test por conveniência: o script histórico aponta Compose/55439; confirmar ownership e usar base própria conforme TESTING.md.

## Limites materiais

Sem PMOC, faturamento, certificado, checklist/fotos ou sincronização externa. Vídeo de Clientes identifica interface anterior; texto adaptado. Sem auditoria WCAG completa ou inspeção visual integral de PDF. Posição da busca melhorou na comparação; tempo humano, ROI e efeito causal do TSF não foram medidos. Protocolo/CSV humano preparados, sem preenchimento robótico. Aprovação de PR não será confundida com G1/release. Sem merge/deploy automático.

## Como revisar

Conferir contratos e transições preservados; menu/modal e retorno de foco; filtros/paleta com ID exato; CSS autenticado sem afetar portal; leitura distinta de prática; dados reais em contagens; novos documentos coerentes com código. Revisão humana funcional deve seguir comparison/protocolo.md em ambiente próprio. PR/checks remotos dependem do destino e configurações efetivas do GitHub.
