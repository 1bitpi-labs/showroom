# Marina Porto Ilhabela · Protótipo Editorial Wally Style

Protótipo funcional, navegável e 100% autônomo desenvolvido para a **Marina Porto Ilhabela** (`marinaportoilhabela.com.br`), aplicando a direção de arte minimalista, o respiro editorial e a geometria chanfrada do benchmark **Wally Yachts** sobre ativos reais extraídos do cliente (vídeo MP4 1080p, fotografias da estrutura, história da família Möller e dados operacionais da Sala Rádio VHF Delta 38).

- **Aplicação principal:** [`index.html`](./index.html)
- **Documentação completa do projeto:** [`docs/PROJETO.md`](./docs/PROJETO.md)
- **Avaliação comparativa do cliente:** [`../CLIENT_EVALUATION.md`](../CLIENT_EVALUATION.md)
- **Diário visual do Cook Loop (R01 a R04):** [`cook/ROUNDS.md`](./cook/ROUNDS.md)

---

## Como rodar o site localmente

O site é estático (HTML5, CSS3 e JavaScript ES6+ sem build step nem dependências externas em runtime). Sirva a pasta por HTTP local para garantir streaming adequado do vídeo `assets/video/hero-sea.mp4` (`Range` requests) e comportamento idêntico à produção.

### Opção 1: Python 3 (recomendado, nativo no Linux/macOS)

```bash
cd /home/caueantonacci/showroom/cliente-marina-porto-ilhabela
python3 -m http.server 8080 --bind 127.0.0.1
```

Abra no navegador: `http://127.0.0.1:8080/`

### Opção 2: Node.js (`serve`)

```bash
cd /home/caueantonacci/showroom/cliente-marina-porto-ilhabela
npx --yes serve -l 8080 .
```

Abra no navegador: `http://localhost:8080/`

### Opção 3: A partir da raiz do Showroom

Se você subir o servidor a partir de `/home/caueantonacci/showroom`:

```bash
cd /home/caueantonacci/showroom
python3 -m http.server 8080 --bind 127.0.0.1
```

Acesse: `http://127.0.0.1:8080/cliente-marina-porto-ilhabela/`

---

## Como rodar a verificação visual e de cor (`$cook` harness)

O projeto inclui um harness automatizado em Puppeteer que sobe um servidor HTTP temporário, captura os 3 enquadramentos oficiais (`S01`, `S02`, `S03` em `1600x1000`), valida os estados interativos (menu fullscreen + 5 abas de serviços com zero erros de console/DOM), gera o comparativo lado a lado contra as referências `cook/refs/R01.png`..`R03.png` e executa a checagem objetiva HSV por grade 4x4.

### Pré-requisitos do harness

- Google Chrome instalado em `/usr/bin/google-chrome`
- Node.js com `puppeteer` (no ambiente atual apontado em `cook/harness.mjs` via `@mermaid-js/mermaid-cli`)
- Python 3 com `numpy` e `Pillow` (`PIL`) para `cook/color_check.py`

### Executando uma rodada de captura

Use `TMPDIR=/tmp` para evitar o limite de ~107 bytes no caminho do socket `SingletonSocket` do Chromium:

```bash
cd /home/caueantonacci/showroom/cliente-marina-porto-ilhabela
TMPDIR=/tmp node cook/harness.mjs r04
```

Saídas geradas para a rodada informada (`r04` no exemplo):
- Stills capturados: `cook/stills/r04/S01.png`, `S02.png`, `S03.png`
- Comparativo lado a lado: `cook/compare/r04/all.jpg`
- Relatório no terminal com `Interactive check: {"errs":[],"tabCount":5}` e deltas de saturação/brilho HSV

Para rodar isoladamente a análise de cor HSV entre uma referência e um still:

```bash
python3 cook/color_check.py cook/refs/R01.png cook/stills/r04/S01.png
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
│   └── PROJETO.md        # Documentação técnica, descoberta, sistema visual e evolução R01-R04
├── assets/
│   ├── img/              # 21 fotos reais e logos oficiais da Marina Porto Ilhabela
│   └── video/
│       └── hero-sea.mp4  # Vídeo 1080p nativo do Canal de São Sebastião
└── cook/
    ├── BRIEF.md          # Briefing técnico, métricas alvo e lista de proibições
    ├── SHOTS.md          # Definição dos 3 enquadramentos fixos (S01, S02, S03)
    ├── ROUNDS.md         # Registro de rodadas R01-R04, notas de críticos cegos e deltas HSV
    ├── harness.mjs       # Script Puppeteer + side-by-side + color_check
    ├── color_check.py    # Telemetria HSV em grade 4x4
    ├── refs/             # Referências Wally Yachts (R01.png a R03.png)
    ├── stills/           # Capturas por rodada (r01 a r04)
    └── compare/          # Montagens comparativas lado a lado (r01 a r04)
```
