# Design System — Brisa

Fonte executável: [globals.css](../src/app/globals.css); componentes React são a implementação. Referência: [HTML original](prototype/brisa-oficina-reference.html). Não existe pacote independente de componentes ou alegação de fidelidade pixel a pixel.

## Tokens e composição

Área autenticada `.brisa-app`: ink #0f172a, paper #f8fafc, line #e2e8f0, muted #526174. Acento `--teal` vem das configurações persistidas (turquesa #00777a, azul #285b8a ou ameixa #73437e). Texto usa Inter se disponível e fallback ui-sans-serif/system-ui; não se baixa fonte/CDN na aplicação. O HTML de referência usa três fontes remotas, não adotadas como dependência.

Cards brancos, borda fina, raio de 18px e sombra leve; ações com raio 10px e mínimo 44px na área autenticada; foco visível. H1 responsivo 25–34px, H2 20px; texto auxiliar não substitui label. Badges sempre têm texto. Espaços recorrentes: 8/12/16/20/24/28/36px. Tokens ainda convivem com overrides históricos no CSS; consolidação em módulos é melhoria proposta.

## Componentes e estados

Shell/sidebar/cabeçalho; menu modal em celular; busca global; filtros com aria-pressed; lista/card; formulário; modal de cliente; drawer histórico; quadro OS; notice/status/alert; vazio/loading/retry. HelpField associa label e explicação, gatilho type=button e Escape. TrainingDialog mantém escolha texto/vídeo e leitura distinta de prática. TrainingInbox mantém avisos privados e progresso real.

Clientes prioriza carteira/busca e modal novo/edição. Orçamentos conserva formulário completo em fluxo e usa drawer para histórico. Equipamentos/Agenda conservam cadastro em fluxo; não possuem todas as ações hipotéticas do protótipo.

## Responsividade e interação

760px: troca da sidebar pelo botão/menu modal. 1150px: quadro ajusta colunas e ações de orçamento quebram. Cards de Clientes e catálogo passam a uma coluna no celular. Testar 360/768/1280 reais, nomes longos, muitos registros e formulário/erro aberto. Sem rolagem horizontal da página; quadro se reorganiza.

Tab/Escape/foco de retorno são critérios, não decoração. Redução de movimento respeitada. Validação parcial de acessibilidade; contraste sistemático, leitor de tela e auditoria WCAG completa continuam pendentes. Conteúdo/cor dinâmica exige revalidação.
