# Design System — Brisa

Contrato atual: [composição visual](design/BRISA-VISUAL-DIRECTION.md), [blueprint](../ZOD_UI_BLUEPRINT.md) e [evidências](changes/brisa-visual-design.md). A linguagem visual é definida em src/app/brisa.css; globals.css mantém estrutura e comportamentos anteriores.

## Linguagem atual

Turquesa profundo #113e3b, canvas #f5f6f3 e superfícies brancas; texto #172e2b, secundário #566b65 e borda de campo #81968e. Acento --teal configurável preserva as cores e a identidade dos snapshots publicados. Marca e ícones SVG originais; fontes de sistema, sem CDN. Tipografia, sombras, estados e controles comuns ao login, operação e portal.

Desktop usa sidebar e listas com ações contextuais; mobile usa barra inferior e formulários empilhados. Editor de proposta tem resumo lateral no desktop e ações fixas no mobile. Campos de toque com fonte 16px e controles 44px. Layout respeita safe-area e reduced-motion. Foco visível e estados textuais permanecem critérios.

## Contratos preservados

Editor de orçamento compara alterações à abertura e protege saídas; beforeunload avisa sem autosave. Clientes e Agenda usam dialog nativo com nome, foco inicial, ciclo de teclado e retorno ao acionador. Equipamentos prioriza histórico/lista, com cadastro em disclosure. Guias, progresso e avisos continuam separados por usuário; leitura não é certificação. Portal mantém revisão exata, confirmação, total, validade, condições e ausência de cobrança.

O diagnóstico anterior é histórico; não representa capturas do desenho atual. Acessibilidade sistemática, leitor de tela e temas alternativos completos ainda exigem validação. O HTML original do protótipo continua sendo apenas referência, sem código ou funções simuladas promovidos a funcionalidades reais.
