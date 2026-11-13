# Documentação do Brisa / ElosPME

Pacote executável no showroom. Uma empresa por instalação; dados de demonstração. [README](../README.md) e [STATUS](../STATUS.md) são as entradas correntes. Histórico permanece identificado abaixo, sem transformar snapshots em estado atual.

## Começar e revisar

- [Runbook](RUNBOOK.md): instalação de revisão 3028/55448, readiness, dev/build e encerramento seguro.
- [Manual de uso](USAGE.md): clientes, equipamentos, propostas, aceite, OS, agenda, ajuda e navegação mobile.
- [Handoff](REVIEW-HANDOFF.md): escopo atual e o que conferir.
- [Avaliação e retrospectiva](EVALUATION-AND-RETROSPECTIVE.md): qualidade, evidências, falhas do processo e backlog.
- [Composição navegável](../BRISA_VISUAL_COMPOSITION.html): cenas estáticas da build, sem sessão/API.

## Produto e implementação

- [PRD](PRD.md), [especificação](spec.md) e [regras do agente](../AGENTS.md).
- [Arquitetura](ARCHITECTURE.md), [banco](DATABASE.md), [segurança](SECURITY.md), [estilo de código](CODE-STYLE.md).
- [Design System](DESIGN-SYSTEM.md), [direção visual](design/BRISA-VISUAL-DIRECTION.md) e [blueprint](../ZOD_UI_BLUEPRINT.md).
- [Inventário](APP-FILES.md) e [hashes verificáveis](app-files.json).

## Desenvolvimento e validação

- [Processo de desenvolvimento e design](DESIGN-DEVELOPMENT-PROCESS.md).
- [Testing](TESTING.md): produto, browser, apresentação e manutenção documental.
- [Método TSF](TSF-WORKFLOW.md): execução supervisionada e limites de autonomia.
- [Histórico de construção](DEVELOPMENT.md) e [decisão de stack](ADR-0001.md).
- [Proteção de edição P1](changes/zod-ui-p1.md) e [entrega visual](changes/brisa-visual-design.md).
- [Capturas da build](evidence/brisa-visual/manifest.json), [capturas P1](evidence/zod-ui-p1/manifest.json) e [inspeção anterior ao redesign](evidence/zod-ui-audit/manifest.json).

## Fontes e histórico

- [Diagnóstico anterior à composição](ZOD_UI_DESIGN_DIAGNOSIS.md): evidências e hipóteses daquela inspeção, não o desenho atual.
- [HTML original](prototype/brisa-oficina-reference.html): referência estática com dependências externas e funções simuladas, não o app integrado.
- [Comparação A/B](COMPARISON-RESULTS.md), [protocolo humano](comparison/protocolo.md) e [CSV humano](comparison/resultados-humanos.csv): snapshots 225cdcc/21a3a3d; não medem a composição atual.
- [Evidência inicial](IMPLEMENTATION-EVIDENCE.md), [piloto de vídeo](CLIENTES-VIDEO-EVIDENCE.md), [evolução anterior](changes/full-app-design.md) e [build readiness](changes/build-readiness-comparison.md).
- [Inclusão pública do pacote](SHOWROOM-PUBLICATION.md): importação 2833a4f e exclusões; não é autorização de deploy/envio de mudanças novas.

Código/testes sustentam comportamento; spec/changes e autorização sustentam escopo; STATUS e evidências sustentam estado. Documentação não concede gates. Leitura de guias não certifica competência. Feedback visual não é resultado comercial ou auditoria WCAG integral.
