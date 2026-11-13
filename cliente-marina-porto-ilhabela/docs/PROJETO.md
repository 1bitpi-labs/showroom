# Documentação do Projeto · Marina Porto Ilhabela

## 1. Contexto e Descoberta do Cliente

Este projeto materializa uma prova de valor (*Show, Don't Tell*) para a **Marina Porto Ilhabela**, selecionada após auditoria comparativa entre três marinas do Litoral Norte de São Paulo registrada em [`../../CLIENT_EVALUATION.md`](../../CLIENT_EVALUATION.md).

### Por que a Marina Porto Ilhabela foi escolhida

| Critério | Evidência verificada |
|---|---|
| Aderência ao benchmark Wally Yachts | `9.5 / 10`. DNA de engenharia náutica própria (rebocadores hidráulicos *Seahorse* e *Rino*, criados por Gunnar Möller) e operação até 65 pés alinhados ao princípio *form follows function*. |
| Ativos multimídia reais | Vídeo MP4 1080p nativo (`assets/video/hero-sea.mp4`), fotografias reais da estrutura, embarcações e família Möller, além dos selos das 4 unidades do ecossistema. |
| Gap comercial do site original | Site anterior em Wix (2021) com caixas azul-claro sobre imagens, baixo contraste tipográfico e rolagem fragmentada que ocultavam a tradição desde 1985. |
| Dados operacionais completos | Av. Alm. Tamandaré, 304, Itaquanduba, Ilhabela, SP; coordenadas `23º 47,9' S / 45º 21,9' W`; Sala Rádio `VHF Delta 38`; Tel `(12) 3896-1243`; WhatsApp `+55 12 99634-2782`; email `secretaria@marinaportoilhabela.com.br`. |

---

## 2. Direção de Arte e Sistema Visual (Wally Style)

A adaptação seguiu o modo **same quality, own style** a partir das referências [`cook/refs/R01.png`](../cook/refs/R01.png), [`R02.png`](../cook/refs/R02.png) e [`R03.png`](../cook/refs/R03.png) extraídas de `wally.com` (`benchmarks-nauticos/screens/05_wally_1..3.png`).

### Tokens e Paleta (`styles.css`)

- **Fundos editoriais:** `#ffffff` (`--bg-pure`), `#f5f7f8` (`--bg-soft`), `#101820` (`--bg-dark`), `#0e2238` (`--bg-navy`).
- **Tipografia:** `Plus Jakarta Sans` (`300` a `700`), com títulos display limpos e links espaçados no header (`13.5px`, `letter-spacing: 0.30em`).
- **Contraste e ações:** texto principal grafite `#232628` (`--ink-primary`), botões pílula `#333738` (`--btn-charcoal`) e barra superior translúcida `#989ea2` ao rolar após `72vh`.
- **Geometria assinatura:** três `<clipPath>` vetoriais SVG com `clipPathUnits="objectBoundingBox"` definidos em [`index.html`](../index.html#L17-L25) (`#wally-slant-tall-left`, `#wally-slant-sub-right`, `#wally-slant-focus-left`), criando trapézios chanfrados com vértices arredondados via curvas quadráticas `Q`.

---

## 3. Arquitetura Funcional

Todo o site roda sem dependências externas em runtime (exceto Google Fonts com fallback de sistema).

| Arquivo | Responsabilidade | Principais símbolos / seções |
|---|---|---|
| [`index.html`](../index.html) | Estrutura semântica, SVG clip-paths, seções editoriais e modais | `#site-header`, `#menu-overlay`, `#hero` (`S01`), `#shot-s02` (`S02`), `#shot-s03` (`S03`), `#servicos`, `#historia`, `#ecossistema`, `#faq`, `#concierge-modal` |
| [`styles.css`](../styles.css) | Design tokens, layout assimétrico 2 colunas, gradação sage-teal no hero, responsividade | `.site-header`, `.hero-grade`, `.wally-grid-two`, `.chamfer-card`, `.event-card`, `.service-stage`, `.heritage-grid`, `.modal-backdrop` |
| [`app.js`](../app.js) | Dados estruturados das 5 modalidades e lógica de interface | `SERVICES`, `syncHeader`, `setMenuOpen`, `renderService`, `openConcierge`, `closeConcierge` |

### Fluxos Interativos Implementados (`app.js`)

1. **Header Adaptativo (`syncHeader`):** transparente sobre o hero e fixo com desfoque (`backdrop-filter: blur(12px)`) após `72%` da altura do viewport.
2. **Menu Fullscreen Wally (`setMenuOpen`):** abre overlay com navegação para todas as seções, coordenadas da Sala Rádio Delta 38, fechamento por botão ou tecla `Escape`.
3. **Alternador de Mídia no Hero (`[data-hero-mode]`):** alterna entre fotografia aérea tratada (`Marina`) e vídeo real 1080p em loop (`Canal ao vivo` via `assets/video/hero-sea.mp4`).
4. **Explorador de Estrutura e Serviços (`SERVICES` + `renderService`):** 5 abas (`Vagas Cobertas 65'`, `Poitas 24h`, `Docagem`, `Diária Jet Ski`, `Lazer e Clube`) que atualizam foto, especificações técnicas e link pré-preenchido de WhatsApp.
5. **Acordeão Operacional (`#faq`):** perguntas e respostas sobre descida com rebocadores, poitas, estacionamento em São Sebastião e uso social no Jet Ski.
6. **Modal Concierge WhatsApp (`#concierge-modal`):** recebe nome/embarcação, modalidade pré-selecionada por `data-open-concierge`, porte da embarcação e observações, montando a mensagem direta para `wa.me/5512996342782`.

---

## 4. Evolução no Cook Loop (R01 a R04)

O desenvolvimento visual foi guiado pelo ciclo `build -> captura 1600x1000 -> telemetria HSV -> crítica cega -> correção`, documentado integralmente em [`cook/ROUNDS.md`](../cook/ROUNDS.md).

| Rodada | Foco principal | Critério de avaliação | S01 | S02 | S03 | HSV (`S01` sat/bri mean) |
|---|---|---|---|---|---|---:|
| **R01** | Arquitetura base, clip-paths SVG, 5 abas e modal | Autoavaliação inicial | 80.0 | 81.2 | 82.2 | `-0.034` / `+0.033` |
| **R02** | Troca de foto do hero, sangria dos cards S02, card marinho S03 | Autoavaliação | 87.0 | 88.2 | 88.2 | `+0.133` / `+0.010` |
| **R03** | Gradação sage-teal S01, suavização Bézier S02, recorte S03 | Crítico cego zero-context | 73.6 | 74.2 | 76.4 | `-0.045` / `-0.015` |
| **R04** | Header `76px`, remoção de seta `▾`, respiro branco S02, vinheta hero e spotlight S03 | Crítico cego zero-context | **86.0** | **78.8** | **83.0** | `+0.099` / `-0.027` |

**Resumo de calibração:** A auditoria cega do R03 revelou um desvio de `+18` pontos na autoavaliação frente a um Diretor de Arte sem contexto. Aplicando os ajustes apontados no R04, as notas cegas subiram `+12.4` pontos em `S01`, `+4.6` em `S02` e `+6.6` em `S03`, mantendo `Interactive check: {"errs":[],"tabCount":5}` e zero imagens quebradas.

---

## 5. Inventário de Ativos Reais (`assets/`)

- **Vídeo:** `assets/video/hero-sea.mp4` (`1080p`, Canal de São Sebastião).
- **Fotografias usadas em cena e serviços:** `marina-vista-aerea.jpg`, `hero-poster.jpg`, `jetski-3.jpg`, `estrutura-1.jpg`, `marina-canal.jpg`, `poitas-avulsas.jpg`, `vaga-seca-hangar.jpg`, `docagem-manutencao.jpg`, `estrutura-3.jpg`, `lazer-piscina.jpg`, `familia-moller.jpg`.
- **Fotografias extras do acervo local:** `deck-marina.jpg`, `embarcacao-mar.jpg`, `estrutura-2.jpg`, `jetski-1.jpg`, `jetski-2.jpg`, `vagas-cobertas.jpg`.
- **Marcas e selos oficiais:** `logo-blue-charter.jpg`, `logo-mpi-yachts.jpg`, `logo-mpi-eventos.png`, `logo-paddle-club.png`, `logo-mpi.jpg`.
