# Marina Porto Ilhabela · Protótipo Editorial Wally Style

Protótipo funcional, navegável e 100% autônomo desenvolvido para a **Marina Porto Ilhabela** (`marinaportoilhabela.com.br`), aplicando a direção de arte minimalista, o respiro editorial e a geometria chanfrada do benchmark **Wally Yachts** sobre ativos reais extraídos do cliente (vídeo MP4 1080p, fotografias da estrutura, história da família Möller e dados operacionais da Sala Rádio VHF Delta 38).

- **Aplicação principal:** [`index.html`](./index.html)
- **Documentação completa (processo, entregas e avaliação):** [`docs/PROJETO.md`](./docs/PROJETO.md)
- **Avaliação comparativa do cliente:** [`../CLIENT_EVALUATION.md`](../CLIENT_EVALUATION.md)
- **Diário visual do Cook Loop (R01 a R05):** [`cook/ROUNDS.md`](./cook/ROUNDS.md)

---

## Resumo do Processo, Entregas e Avaliação

1. **Processo adotado:** auditoria de 7 benchmarks náuticos Awwwards/FWA ([`BENCHMARKS_NAUTICOS_AWWWARDS.md`](../benchmarks-nauticos/BENCHMARKS_NAUTICOS_AWWWARDS.md)) -> seleção da **Wally Yachts** -> avaliação comparativa de 3 marinas brasileiras reais ([`CLIENT_EVALUATION.md`](../CLIENT_EVALUATION.md)) -> extração offline dos ativos da **Marina Porto Ilhabela** -> 5 rodadas visuais no `$cook` (`R01` a `R05`) com telemetria HSV e crítica cega zero-context. Todo o método foi formalizado em [`../.claude/skills/client-cook-pipeline/SKILL.md`](../.claude/skills/client-cook-pipeline/SKILL.md).
2. **O que obtivemos:** protótipo estático autônomo em português do Brasil sem dependências externas em runtime, com vídeo real 1080p (`hero-sea.mp4`), 22 ativos visuais locais, formas geométricas chanfradas via SVG `<clipPath>`, menu fullscreen, switcher `Marina / Canal ao vivo`, explorador de 5 modalidades de serviços, FAQ, modal Concierge WhatsApp com dados verificados (`VHF Delta 38`, `23º 47,9' S / 45º 21,9' W`) e responsividade mobile (`390x844` sem overflow horizontal e touch targets `>= 44px`).
3. **Avaliação obtida (`R05`):**
   - **Seleção do cliente:** `9.5 / 10` em aderência ao estilo Wally e riqueza de ativos reais.
   - **Qualidade visual (mediana de 3 críticos zero-context em `R05`):** `S01` **65.4** (`72/65/58/68/64`), `S02` **63.6** (`76/56/64/62/60`), `S03` **70.0** (`78/66/68/70/68`) e `9/10` em Motion/Interaction. Os 3 críticos convergiram que o layout estrutural está alinhado e o principal teto frente às fotos de estúdio Wally vem do uso estrito de fotografias operacionais reais extraídas do site do cliente.
   - **Saúde técnica, vídeo e mobile:** `Interactive check: {"errs":[],"tabCount":5}`, `12` imagens (`0` quebradas), vídeo 1080p ativo (`isVideoMode: true, readyState: 4, paused: false`), `mobile390x844: {"scrollWidth":390,"innerWidth":390,"overflowX":false,"smallTouchTargets":[]}`, `EmDash: false`, `PageErrs: 0`.
4. **Gate e evolução opcional:** protótipo pronto para aprovação do usuário na branch `feat/marina-porto-r05`; detalhes completos e roadmap fotográfico opcional em [`docs/PROJETO.md`](./docs/PROJETO.md#4-status-dos-pr%C3%B3ximos-passos-planejados).

---

## Como rodar o site localmente

O site é estático (HTML5, CSS3 e JavaScript ES6+ sem build step nem dependências externas em runtime). Sirva a pasta por HTTP local para garantir streaming adequado do vídeo `assets/video/hero-sea.mp4` (`Range` requests) e comportamento idêntico à produção.

### Opção 1: Python 3 (recomendado, nativo no Linux/macOS)

```bash
cd cliente-marina-porto-ilhabela
python3 -m http.server 8080 --bind 127.0.0.1
```

Abra no navegador: `http://127.0.0.1:8080/`

### Opção 2: Node.js (`serve`)

```bash
cd cliente-marina-porto-ilhabela
npx --yes serve -l 8080 .
```

Abra no navegador: `http://localhost:8080/`

### Opção 3: A partir da raiz do repositório

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Acesse: `http://127.0.0.1:8080/cliente-marina-porto-ilhabela/`

---

## Como rodar a verificação visual e de cor (`$cook` harness)

O projeto inclui um harness automatizado e portável (`cook/harness.mjs`, resolvido via `import.meta.url`) em Puppeteer que sobe um servidor HTTP temporário com suporte a `Range`, captura os 3 enquadramentos oficiais (`S01`, `S02`, `S03` em `1600x1000`), valida vídeo ao vivo (`Canal ao vivo`), `#menu-overlay`, `#concierge-modal`, todas as 5 abas de `#servicos`, seções abaixo da dobra (`#historia`, `#ecossistema`, `#faq`, `footer`) e viewport mobile `390x844` (overflow e touch targets), gera o comparativo lado a lado contra as referências `cook/refs/R01.png`..`R03.png` e executa a checagem objetiva HSV por grade 4x4.

### Pré-requisitos do harness

- Google Chrome ou Chromium (detectado via `CHROME_PATH`, `/usr/bin/google-chrome`, `/usr/bin/chromium`)
- Node.js com `puppeteer` (resolvido automaticamente ou via `PUPPETEER_PATH`)
- Python 3 com `numpy` e `Pillow` (`PIL`) para `cook/color_check.py`

### Executando uma rodada de captura

Use `TMPDIR=/tmp` para evitar o limite de ~107 bytes no caminho do socket `SingletonSocket` do Chromium:

```bash
cd cliente-marina-porto-ilhabela
TMPDIR=/tmp node cook/harness.mjs r05
```

Saídas geradas para a rodada informada (`r05` no exemplo):
- Stills oficiais: `cook/stills/r05/S01.png`, `S02.png`, `S03.png`
- Capturas extras (vídeo, modais, 5 abas de serviços, seções e mobile `390x844`): `cook/stills/r05/extra/`
- Comparativo lado a lado: `cook/compare/r05/all.jpg`
- Relatório no terminal com `Interactive check: {"errs":[],"tabCount":5}`, telemetria mobile/vídeo e deltas HSV

Para rodar isoladamente a análise de cor HSV entre uma referência e um still:

```bash
python3 cook/color_check.py cook/refs/R01.png cook/stills/r05/S01.png
```

---

## Estrutura de pastas

```text
cliente-marina-porto-ilhabela/
├── index.html            # Estrutura semântica e clipPaths SVG (<defs>)
├── styles.css            # Design system editorial Wally, grid assimétrico e responsividade
├── app.js                # Menu fullscreen, switcher Marina/Canal ao vivo, 5 abas, FAQ e modal WhatsApp
├── README.md             # Guia rápido de execução e verificação
├── docs/
│   └── PROJETO.md        # Documentação técnica, descoberta, sistema visual e evolução R01-R05
├── assets/
│   ├── img/              # 21 fotos reais e logos oficiais da Marina Porto Ilhabela
│   └── video/
│       └── hero-sea.mp4  # Vídeo 1080p nativo do Canal de São Sebastião
└── cook/
    ├── BRIEF.md          # Briefing técnico, métricas alvo e lista de proibições
    ├── SHOTS.md          # Definição dos 3 enquadramentos fixos (S01, S02, S03)
    ├── ROUNDS.md         # Registro de rodadas R01-R05, notas de críticos cegos e deltas HSV
    ├── harness.mjs       # Script Puppeteer portável + cobertura completa + side-by-side + color_check
    ├── color_check.py    # Telemetria HSV em grade 4x4
    ├── refs/             # Referências Wally Yachts (R01.png a R03.png)
    ├── stills/           # Capturas por rodada (r01 a r05 + r05/extra)
    └── compare/          # Montagens comparativas lado a lado (r01 a r05)
```
