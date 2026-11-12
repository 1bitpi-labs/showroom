# Documentação do projeto ElosPME

Atualizada em 2026-11-12. Produto local sintético Brisa Oficina; uma empresa por instalação. Construído por adaptação local e supervisionada do **Tiny Software Factory (TSF/TFS) v2.0.0**, combinada com especificação, incrementos e revisão humana. Não é fábrica autônoma nem release homologada.

- [PRD](PRD.md): objetivos, usuários, escopo e aceites.
- [Design System](DESIGN-SYSTEM.md): componentes, tokens e comportamento responsivo.
- [Architecture](ARCHITECTURE.md): camadas e fluxo real.
- [Database](DATABASE.md): entidades, relações e invariantes.
- [Security](SECURITY.md): controles e lacunas de release.
- [Code Style](CODE-STYLE.md): convenções e manutenção.
- [Testing](TESTING.md): comandos, ambientes e limites da evidência.
- [Método TSF e melhorias](TSF-WORKFLOW.md): playbook, fluxo efetivo e proposta de evolução.
- [Arquivos do app e protótipo](APP-FILES.md): mapa e manifesto de hashes.
- [Histórico técnico](DEVELOPMENT.md), [especificação funcional](spec.md), [manual de operação](USAGE.md).
- [Regras dos agentes](../AGENTS.md), [estado da entrega](../STATUS.md), [execução/instalação](../README.md).

O HTML em [prototype/brisa-oficina-reference.html](prototype/brisa-oficina-reference.html) é a referência estática original, não uma versão funcional integrada. As promessas simuladas nele não ampliam o escopo implementado. Documentos novos consolidam fontes existentes, sem apagar requisitos ou decisões históricas.

Autoridade: código/testes para comportamento; spec/changes e autorizações para escopo; STATUS e evidências para estado. Planos não concedem gates. Guias não certificam competência prática. Dados de demonstração não comprovam resultados comerciais.

Comparação e continuidade: [resultados técnicos e avaliação TSF](COMPARISON-RESULTS.md), [protocolo humano](comparison/protocolo.md), [CSV humano ainda vazio](comparison/resultados-humanos.csv). Evidências brutas de automação em evidence/version-comparison/; não preencher CSV humano com robô.

## Revisão da entrega

- [Guia de revisão e validações](REVIEW-HANDOFF.md): escopo final, limites, snapshots e comandos seguros.
- [Comparação executada](COMPARISON-RESULTS.md): resultados reais e tentativas inválidas separadas.
- [Readiness do build](changes/build-readiness-comparison.md): investigação resolvida no ambiente ensaiado.

Servidores locais de comparação são temporários; conclusão de um processo não apaga commits/evidências. Consultar configuração privada da worktree antes de reiniciar. PR é revisão de código/documentação, sem homologação humana ou autorização de deploy implícitas.

## Pacote no showroom

Código completo em `06-oficinas-e-servicos-tecnicos/elos-pme/`, importado do snapshot local 2833a4f. Configuração privada, bancos, dependências e estado TSF não fazem parte do pacote. Os scripts de QA exigem DEMO_PASSWORD no ambiente; não há senha local incorporada nesta distribuição. O backend exige execução Node/PostgreSQL própria; inclusão no GitHub não executa o app.

[Inclusão pública no showroom](SHOWROOM-PUBLICATION.md): autorização, snapshot, exclusões e verificações de distribuição. A importação não executa backend nem publica a aplicação.
