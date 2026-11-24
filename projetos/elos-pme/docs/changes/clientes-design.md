# Clientes — adaptação visual Brisa

2026-11-12. Autorização: operador pediu seguir com Clientes usando o HTML fornecido como referência, preservando funcionalidades. Branch codex/clientes-design, worktree elos-pme-clientes-design, base 225cdcc (inclui piloto de ajuda). Não integrado à instância original nem ao piloto em execução.

Alterações: composição cadastro/carteira em duas colunas a partir de 1180px; sequência única abaixo disso; superfícies arredondadas, cabeçalhos com descrição, busca destacada, iniciais decorativas e ação de edição com alvo mínimo de 44px. Edição leva foco ao nome. Cadastro sempre disponível, preservando roteiro e seletores de treinamento; campos, validação, busca, contagens reais, observações e chamadas de API existentes mantidos. CSS restrito a Clientes. Sem fontes/CDNs/dependências novas, métricas fictícias ou alterações de banco.

Validação: TypeScript passou; build Webpack terminou com código 0. Sem ambiente copiado: build emitiu avisos de URL/segredo de autenticação ausentes; isso não valida login ou runtime. git diff --check passou e Prettier aplicado. Nenhum banco ou processo alheio acessado. Dependências reutilizadas por symlink local, não versionado.

Pendente: validar composição renderizada em 360/1280, teclado, cadastro → busca → edição → conferência e ajuda com campos intactos, em runtime sintético próprio. Testes históricos não substituem esta validação. Nenhum aceite visual inferido. Não foram gravados vídeos.

## Validação desktop/celular — 2026-11-12

Ambiente próprio: app 3019; container elos-clientes-design-db, PostgreSQL 55441, banco elos_design. Ambiente e credenciais sintéticas novos, sem copiar .env de outras instâncias. Migração/seed apenas neste banco vazio. Ao concluir, app e container de validação foram parados; dados sintéticos preservados no container para retomada.

Preview T3 confirmou acesso e viewport mobile real após resize/preset. Interação automatizada falhou com seletor inválido e timeout; continuação local em Chromium/Playwright. Script reproduzível: scripts/clientes-design-smoke.ts (exige runtime próprio na 3019 e conta sintética de QA; não executar contra outras instâncias). Credencial de QA é exclusiva de ambiente descartável, sem acesso real.

Passaram em 360×900 e 1280×900: cadastro com contato, busca do registro, edição com foco no nome, salvar e conferir após reload; busca sem resultados; abrir ajuda com nome preenchido, Tab contido no modal, Escape e preservação do nome. Sem pageerror. scrollWidth igual a innerWidth (360 e 1280). Grid observado: uma coluna de 324px no celular; duas de 418,5px e 511,5px no desktop. Resultado JSON e capturas locais em docs/evidence/clientes-design/. TypeScript e diff --check passaram.

Revisão das capturas: nomes longos quebram linha, contato/contagens e editar permanecem legíveis. Celular conserva formulário antes da carteira e exige rolagem; oportunidade de refinamento futuro, não falha funcional demonstrada. Capturas são recortes do módulo real com dados sintéticos. Não representam auditoria WCAG completa nem aceite humano/G1. Vídeo antigo permanece disponível, mas não foi refeito nem declarado visualmente compatível com a nova composição.

Next dev gerou automaticamente bloco de instruções em AGENTS.md e referências de tipos dev em next-env.d.ts; esses diffs são separados da implementação visual e não foram aplicados a outras worktrees. Nenhum push/merge/deploy.

Próximo passo único: revisão visual do operador sobre Clientes antes de expandir o padrão a outras telas.
