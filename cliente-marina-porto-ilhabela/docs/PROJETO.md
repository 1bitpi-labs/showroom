# Documentação do Projeto · Marina Porto Ilhabela

Documentação completa do **processo de desenvolvimento**, **entregáveis obtidos** e **avaliação técnica/visual** do protótipo editorial criado para a **Marina Porto Ilhabela** no padrão visual **Wally Yachts** (*Show, Don't Tell*).

---

## 1. Processo de Desenvolvimento (Ponta a Ponta)

O projeto seguiu uma esteira estruturada em cinco etapas, posteriormente consolidada como metodologia reutilizável na skill [`../../.claude/skills/client-cook-pipeline/SKILL.md`](../../.claude/skills/client-cook-pipeline/SKILL.md).

### Etapa 1: Pesquisa e Engenharia Reversa de Benchmarks (`cinematic-site-hunter`)
- Captura automatizada e auditoria de **7 referências internacionais** de clubes náuticos, marinas e estaleiros premiados no Awwwards e FWA (**OMAYA Yachts**, **Vanquish Yachts**, **Azimut Yachts**, **AB Yachts**, **Wally Yachts**, **Blue More Yachting** e **Riva Yacht**), totalizando 21 telas em [`../../benchmarks-nauticos/screens/`](../../benchmarks-nauticos/screens/) e consolidadas em [`../../benchmarks-nauticos/BENCHMARKS_NAUTICOS_AWWWARDS.md`](../../benchmarks-nauticos/BENCHMARKS_NAUTICOS_AWWWARDS.md).
- Escolha do benchmark **Wally Yachts** (`05_wally_1.png`, `05_wally_2.png`, `05_wally_3.png`) pela estética de minimalismo futurista, horizonte marítimo limpo, respiro editorial branco e cards com chanfros geométricos.

### Etapa 2: Viabilidade e Descoberta Multi-Cliente (`CLIENT_EVALUATION.md`)
- Auditoria comparativa em navegador headless de três marinas reais do Litoral Norte de São Paulo: **Marina Porto Ilhabela**, **Ilha Jet Club** e **Marina Igararecê**, registrada em [`../../CLIENT_EVALUATION.md`](../../CLIENT_EVALUATION.md).
- Critérios avaliados: autenticidade narrativa e ICP, riqueza de ativos reais extraíveis (vídeo, fotos em alta resolução, logos e contatos completos), gap visual do site atual e aderência ao estilo Wally.
- **Marina Porto Ilhabela** foi eleita vencedora com nota **9.5 / 10** frente a **5.5 / 10** (Ilha Jet Club) e **7.0 / 10 potencial / 4.0 / 10 ativos** (Marina Igararecê).

### Etapa 3: Espelhamento Offline de Ativos e Setup `$cook`
- Download local de todos os ativos reais da Marina Porto Ilhabela para `assets/img/` e `assets/video/` (sem depender de URLs externas de produção), convertendo dois PNGs brutos pesados em JPEGs otimizados (`2400px`, q92).
- Configuração da pasta [`cook/`](../cook/) em modo **same quality, own style** (barra de qualidade Wally com idioma, narrativa e ativos 100% reais do cliente):
  - [`cook/BRIEF.md`](../cook/BRIEF.md): meta `95+`, limite de tempo `1.5h` e *Slop Ban List* estrita (zero eyebrow labels, zero texto monospace uppercase decorativo, zero contadores `01 / 02 / 03`, zero glowing orbs, zero em dashes).
  - [`cook/SHOTS.md`](../cook/SHOTS.md): definição dos 3 enquadramentos fixos (`S01`, `S02`, `S03` em `1600x1000`) comparados a [`cook/refs/R01.png`](../cook/refs/R01.png)..`R03.png`.
  - [`cook/harness.mjs`](../cook/harness.mjs) e [`cook/color_check.py`](../cook/color_check.py): servidor HTTP local efêmero, captura automatizada, testes interativos de DOM/JS, composição lado a lado (`compare/rNN/all.jpg`) e telemetria objetiva HSV em grade 4x4.

### Etapa 4: Loop de Iteração Visual (`$cook` R01 a R04) e Calibração Cega
- **Rodada 01 (`R01`):** Arquitetura base completa (`index.html`, `styles.css`, `app.js`), três `<clipPath>` SVG chanfrados com cantos arredondados, 5 abas de serviços, menu fullscreen e modal concierge.
- **Rodada 02 (`R02`):** Substituição do hero para foto aérea do canal (`marina-vista-aerea.jpg`), troca da foto desbotada em `S02`, ampliação dos cards chanfrados para sangria limpa na borda inferior e purificação do tom azul-marinho no card `TEMPORADA ILHABELA 2026`.
- **Rodada 03 (`R03`) + Auditoria Cega:** Calibração sage-teal do hero (`S01`), remoção de guarda-sóis intrusivos nas bordas de `S01` e `S03` e suavização da curva Bézier em `wally-slant-sub-right`. Ao submeter `compare/r03/all.jpg` a um crítico Art Director sem contexto (`0ce01541b3bc9437e4f3ae2c4ae1e4be`), identificou-se um **desvio de calibração de `-18` pontos** entre autoavaliação (`92.8`–`93.0`) e nota cega real (`73.6`–`76.4`).
- **Rodada 04 (`R04`) Guiada pelo Crítico Cego:** Correção cirúrgica dos problemas reais apontados pelo crítico: header ampliado para `76px` com links `13.5px` (`letter-spacing: 0.30em`), remoção da seta `▾` em `VHF 38`, respiro branco ampliado em `S02` (`margin-bottom: 108px`, `padding-top: 46px`), dupla vinheta especular no hero (`S01`) e spotlight radial no card escuro (`S03`). Novo crítico zero-context (`79f4a7b66dc6de36f6771cd03d0ade62`) auditou `compare/r04/all.jpg`.

### Etapa 5: Consolidação Metodológica, Documentação e Versionamento
- Registro completo do fluxo na skill [`client-cook-pipeline`](../../.claude/skills/client-cook-pipeline/SKILL.md), higienização de artefatos temporários e criação da documentação executável e commit local no repositório `showroom`.

---

## 2. O que Obtivemos (Entregáveis e Capacidades)

### 2.1 Site Estático Autônomo de Alta Fidelidade
- **Stack:** HTML5, CSS3 moderno (Grid, custom properties, SVG `<clipPath clipPathUnits="objectBoundingBox">` com curvas quadráticas `Q`) e JavaScript ES6+ puro, sem dependências externas em runtime além da fonte `Plus Jakarta Sans` (com fallback local).
- **Arquivos principais:** [`index.html`](../index.html), [`styles.css`](../styles.css) e [`app.js`](../app.js).
- **Fluxos interativos entregues e testados:**
  1. **Header Adaptativo (`syncHeader`):** transparente sobre o hero e fixo com desfoque (`backdrop-filter: blur(12px)`) após `72vh` de rolagem.
  2. **Menu Fullscreen Wally (`setMenuOpen`):** navegação para todas as seções, coordenadas da Sala Rádio Delta 38 e fechamento por botão ou tecla `Escape`.
  3. **Alternador de Mídia no Hero (`[data-hero-mode]`):** troca em tempo real entre foto aérea tratada (`Marina`) e vídeo real 1080p em loop (`Canal ao vivo` em `assets/video/hero-sea.mp4`).
  4. **Explorador de Estrutura e Serviços (`SERVICES` + `renderService`):** 5 modalidades reais (`Vagas Cobertas 65'`, `Poitas 24h`, `Docagem`, `Diária Jet Ski`, `Lazer e Clube`) com especificações e link WhatsApp pré-preenchido.
  5. **Seção Histórica e Ecossistema:** narrativa verificada de Gunnar, Virginia, Marcos e Andrea Möller desde 1985 + 4 unidades (*Blue Charter*, *Marina Porto Yachts*, *Marina Porto Eventos*, *Paddle Club Ilhabela*).
  6. **FAQ Operacional (`#faq`) e Modal Concierge (`#concierge-modal`):** monta mensagem estruturada com nome/embarcação, serviço e porte para envio direto via WhatsApp (`+55 12 99634-2782`).

### 2.2 Acervo Real e Artefatos de Engenharia
- **Mídia offline do cliente (`assets/`):** 1 vídeo MP4 1080p (`hero-sea.mp4`), 17 fotografias reais da estrutura/operações e 5 logos oficiais.
- **Referências e trilho visual:** 21 telas de benchmarks em [`../../benchmarks-nauticos/screens/`](../../benchmarks-nauticos/screens/), 4 rodadas de stills (`cook/stills/r01..r04/`), 4 painéis comparativos (`cook/compare/r01..r04/all.jpg`) e ledger [`cook/ROUNDS.md`](../cook/ROUNDS.md).
- **Ferramental e Skills versionadas:** [`cinematic-site-hunter`](../../.claude/skills/cinematic-site-hunter/SKILL.md), [`cook`](../../.claude/skills/cook/SKILL.md) e [`client-cook-pipeline`](../../.claude/skills/client-cook-pipeline/SKILL.md).

---

## 3. Avaliação e Resultados Mensurados

### 3.1 Avaliação na Escolha do Cliente (`CLIENT_EVALUATION.md`)

| Candidato | Aderência Wally | Ativos Reais Extraíveis | Gap do Site Atual | Veredito |
|---|---:|---|---|---|
| **Marina Porto Ilhabela** | **9.5 / 10** | Vídeo MP4 1080p, 15+ fotos landscape, 5 logos, histórico desde 1985, VHF Delta 38, Tel/WhatsApp/Coordenadas | Alto (Wix 2021 com caixas azul-pastel e baixo contraste) | **Selecionada** |
| **Ilha Jet Club** | 5.5 / 10 | Sem vídeo; fotos mistas e `.heic`; banners com texto na imagem | Alto, porém nicho exclusivo de Jet Ski | Descartada |
| **Marina Igararecê** | 7.0 potencial / 4.0 ativos | Sem vídeo; imagens stock genéricas; sem telefone/WhatsApp/endereço no DOM | Crítico, mas inviabiliza protótipo honesto sem inventar dados | Descartada |

### 3.2 Avaliação Visual Calibrada (Crítico Zero-Context: R03 vs R04)

As notas abaixo refletem exclusivamente avaliações de subagentes Art Director sem contexto prévio sobre `cook/compare/rNN/all.jpg` (após eliminação do viés de autoavaliação):

| Enquadramento | R03 Cego (Baseline) | R04 Cego (Final) | Evolução | Notas por Critério em R04 (`Comp / Light / Color / Mat / Detail / Motion`) |
|---|---:|---:|---:|---|
| **S01 (Hero Marítimo)** | 73.6 | **86.0** | **+12.4** | `82 / 86 / 90 / 88 / 84 / 9/10` |
| **S02 (Editorial + Chanfros)** | 74.2 | **78.8** | **+4.6** | `80 / 74 / 78 / 86 / 76 / 9/10` |
| **S03 (Card Marinho + Foco)** | 76.4 | **83.0** | **+6.6** | `84 / 82 / 85 / 85 / 79 / 9/10` |

### 3.3 Telemetria Objetiva (HSV e Integridade Técnica em R04)
- **Color Check (`cook/color_check.py`, grade 4x4 contra `R01`–`R03`):**
  - `R01 vs S01`: saturation mean `+0.099` (worst cell `+0.235`) | brightness mean `-0.027` (worst cell `-0.118`)
  - `R02 vs S02`: saturation mean `+0.007` (worst cell `-0.230`) | brightness mean `+0.020` (worst cell `+0.303`)
  - `R03 vs S03`: saturation mean `+0.060` (worst cell `+0.340`) | brightness mean `-0.007` (worst cell `+0.097`)
- **Integridade de DOM, Mídia e HTTP:**
  - `Interactive check: {"errs":[],"tabCount":5}` em `1600x1000`.
  - `12 imgs (0 broken)`, `2 videos (1920px readyState 4)`, `EmDash: false`, `PageErrs: 0`.
  - Servidor HTTP local validado com status `200` em `/index.html`, `/styles.css`, `/app.js`, `/assets/video/hero-sea.mp4` e `/assets/img/marina-vista-aerea.jpg`.

### 3.4 Limites Conhecidos e Status Atual do Gate
- **Por que R04 ainda ficou abaixo da barra `95+` do `BRIEF.md`:** o projeto assumiu a restrição rígida de usar **exclusivamente fotografias reais extraídas do site do cliente** (píer com defensas, galpão fotografado ao meio-dia e várias lanchas na poita), em vez de renders/fotos de drone em *golden hour* com superiates isolados como no catálogo da Wally.
- **Status atual do Gate (`cook/ROUNDS.md`):** `stills approved [pending user gate]`. O protótipo está validado como prova de valor (*Show, Don't Tell*), porém ainda há refinamentos planejados para fechar o ciclo completo do `$cook`.

---

## 4. Próximos Passos Planejados

Os itens abaixo compõem o backlog planejado a partir de [`cook/BRIEF.md`](../cook/BRIEF.md), [`cook/ROUNDS.md`](../cook/ROUNDS.md) e [`../../.claude/skills/cook/references/ship.md`](../../.claude/skills/cook/references/ship.md):

1. **Rodada 05 (`R05`) de Refinamento Visual (`cook/ROUNDS.md` -> meta `90+` calibrada):**
   - **S01 (Header Lockup):** aumentar escala e centralização vertical do lockup central (`MARINA PORTO` + emblema de 3 velas) sobre o hero.
   - **S02 (Contraste e Luz Editorial, hoje `78.8` com `Light 74 / Detail 76`):** elevar contraste tonal e destaque dos dois cards chanfrados (`jetski-3.jpg` e `estrutura-1.jpg`) e do bloco editorial `Engenharia e Mar` até `90+`.
   - **S03 (Card `TEMPORADA ILHABELA 2026`):** inserir elemento gráfico / silhueta vetorial de embarcação mais destacado no centro do card escuro mantendo legibilidade das coordenadas `23º 47,9' S / 45º 21,9' W`.
   - **Reavaliação Cega:** rodar 2 críticos zero-context sobre `cook/compare/r05/all.jpg` e atualizar o ledger `cook/ROUNDS.md`.
2. **Cobertura Completa de Seções, Vídeo e Responsividade (`cook/harness.mjs`):**
   - Estender o harness para capturar e validar visualmente o modo `Canal ao vivo` (`hero-sea.mp4`), o `#menu-overlay`, o `#concierge-modal`, todas as seções abaixo da dobra (`#servicos` nas 5 abas, `#historia`, `#ecossistema`, `#faq`, `footer`) e o viewport mobile (`390x844`, sem overflow horizontal e com touch target `>= 44px`).
   - Tornar caminhos do `harness.mjs` portáveis (resolvendo diretório via `import.meta.url` em vez de caminho fixo).
3. **Auditoria Pré-Publicação (`ship.md`) e Gate Final:**
   - Executar varredura de privacidade/links (`git grep` para caminhos pessoais ou tokens), atualizar `docs/PROJETO.md` e `README.md` com os resultados finais de `R05` e aguardar aprovação do usuário no Gate para eventual PR/publicação.
4. **Produção Fotográfica Opcional (Pós-Aprovação Comercial):**
   - Caso o cliente contrate a versão final de produção, agendar sessão de drone/fotos em *golden hour* no Canal de São Sebastião para superar o teto fotográfico natural das imagens atuais e buscar a barra `95+`.

---

## 5. Arquitetura de Arquivos e Símbolos

| Arquivo | Papel | Principais Símbolos / Seções |
|---|---|---|
| [`index.html`](../index.html) | Estrutura semântica e `<clipPath>` SVG (`#wally-slant-*`) | `#site-header`, `#menu-overlay`, `#hero`, `#shot-s02`, `#shot-s03`, `#servicos`, `#historia`, `#ecossistema`, `#faq`, `#concierge-modal` |
| [`styles.css`](../styles.css) | Tokens (`#ffffff`, `#232628`, `#333738`), layout assimétrico e mídia | `.site-header`, `.hero-grade`, `.wally-grid-two`, `.chamfer-card`, `.event-card`, `.service-stage`, `.modal-backdrop` |
| [`app.js`](../app.js) | Dados das 5 modalidades e interatividade | `SERVICES`, `syncHeader`, `setMenuOpen`, `renderService`, `openConcierge`, `closeConcierge` |

### Dados Operacionais Verificados do Cliente
- **Endereço:** Av. Alm. Tamandaré, 304, Itaquanduba, Ilhabela, SP, `11630-000`
- **Coordenadas e Rádio:** `23º 47,9' S / 45º 21,9' W` · Sala Rádio `VHF Delta 38` (24h / 365 dias)
- **Canais oficiais:** Tel `(12) 3896-1243` · WhatsApp `+55 12 99634-2782` · `secretaria@marinaportoilhabela.com.br` · `@marinaportoilhabela`
