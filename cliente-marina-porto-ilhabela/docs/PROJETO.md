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

### Etapa 4: Loop de Iteração Visual (`$cook` R01 a R05) e Calibração Cega
- **Rodada 01 (`R01`):** Arquitetura base completa (`index.html`, `styles.css`, `app.js`), três `<clipPath>` SVG chanfrados com cantos arredondados, 5 abas de serviços, menu fullscreen e modal concierge.
- **Rodada 02 (`R02`):** Substituição do hero para foto aérea do canal (`marina-vista-aerea.jpg`), troca da foto desbotada em `S02`, ampliação dos cards chanfrados para sangria limpa na borda inferior e purificação do tom azul-marinho no card `TEMPORADA ILHABELA 2026`.
- **Rodada 03 (`R03`) + Auditoria Cega:** Calibração sage-teal do hero (`S01`), remoção de guarda-sóis intrusivos nas bordas de `S01` e `S03` e suavização da curva Bézier em `wally-slant-sub-right`. Ao submeter `compare/r03/all.jpg` a um crítico Art Director sem contexto (`0ce01541b3bc9437e4f3ae2c4ae1e4be`), identificou-se um **desvio de calibração de `-18` pontos** entre autoavaliação (`92.8`–`93.0`) e nota cega real (`73.6`–`76.4`).
- **Rodada 04 (`R04`) Guiada pelo Crítico Cego:** Correção cirúrgica dos problemas reais apontados pelo crítico: header ampliado para `76px` com links `13.5px` (`letter-spacing: 0.30em`), remoção da seta `▾` em `VHF 38`, respiro branco ampliado em `S02` (`margin-bottom: 108px`, `padding-top: 46px`), dupla vinheta especular no hero (`S01`) e spotlight radial no card escuro (`S03`). Novo crítico zero-context (`79f4a7b66dc6de36f6771cd03d0ade62`) auditou `compare/r04/all.jpg`.
- **Rodada 05 (`R05`) + Cobertura Completa e Painel de 3 Críticos Cegos:** Lockup central ampliado e alinhado na baseline da navegação (`MARINA PORTO` `17px` + emblema `46x29px` em `#site-header` `86px`), barra sticky calibrada (`rgba(176, 180, 182, 0.88)`), contraste crepuscular e reenquadramento de `jetski-3.jpg` e `estrutura-1.jpg` com ritmo editorial `R02` em `S02`, silhueta vetorial top-down de embarcação e esteira em `.event-card` (`S03`), responsividade mobile `390x844` sem overflow e portabilidade completa de `cook/harness.mjs` com capturas em `cook/stills/r05/extra/`. Painel independente de **3 críticos zero-context** (`76cdf724`, `8259c1e2`, `b9d35222`) auditou `compare/r05/all.jpg`.

### Etapa 5: Consolidação Metodológica, Evals, Retrospectiva e Versionamento
- Registro do fluxo de discovery + `$cook` em [`client-cook-pipeline`](../../.claude/skills/client-cook-pipeline/SKILL.md) e criação da skill [`delivery-eval-docs`](../../.claude/skills/delivery-eval-docs/SKILL.md) para padronizar avaliação pós-aprovação, evals quantitativos e sincronização documental.
- Execução da retrospectiva honesta em [`EVALUATION-AND-RETROSPECTIVE.md`](EVALUATION-AND-RETROSPECTIVE.md), suíte [`evals/eval_marina_porto.py`](../evals/eval_marina_porto.py), testes [`tests/test_eval_marina_porto.py`](../tests/test_eval_marina_porto.py) e varredura de privacidade/links (`audit_docs_and_links.py`).

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

### 2.2 Acervo Real, Evals e Artefatos de Engenharia
- **Mídia offline do cliente (`assets/`):** 1 vídeo MP4 1080p (`hero-sea.mp4`), 17 fotografias reais da estrutura/operações e 5 logos oficiais.
- **Referências e trilho visual:** 21 telas de benchmarks em [`../../benchmarks-nauticos/screens/`](../../benchmarks-nauticos/screens/), 5 rodadas de stills (`cook/stills/r01..r05/`, incluindo 15 capturas em `cook/stills/r05/extra/`), 5 painéis comparativos (`cook/compare/r01..r05/all.jpg`) e ledger [`cook/ROUNDS.md`](../cook/ROUNDS.md).
- **Evals e Retrospectiva:** [`evals/eval_marina_porto.py`](../evals/eval_marina_porto.py), relatório [`evals/saida/EVAL-REPORT.md`](../evals/saida/EVAL-REPORT.md), suíte [`tests/test_eval_marina_porto.py`](../tests/test_eval_marina_porto.py) e [`docs/EVALUATION-AND-RETROSPECTIVE.md`](EVALUATION-AND-RETROSPECTIVE.md).
- **Ferramental e Skills versionadas:** [`cinematic-site-hunter`](../../.claude/skills/cinematic-site-hunter/SKILL.md), [`cook`](../../.claude/skills/cook/SKILL.md), [`client-cook-pipeline`](../../.claude/skills/client-cook-pipeline/SKILL.md) e [`delivery-eval-docs`](../../.claude/skills/delivery-eval-docs/SKILL.md).

---

## 3. Avaliação e Resultados Mensurados

### 3.1 Avaliação na Escolha do Cliente (`CLIENT_EVALUATION.md`)

| Candidato | Aderência Wally | Ativos Reais Extraíveis | Gap do Site Atual | Veredito |
|---|---:|---|---|---|
| **Marina Porto Ilhabela** | **9.5 / 10** | Vídeo MP4 1080p, 15+ fotos landscape, 5 logos, histórico desde 1985, VHF Delta 38, Tel/WhatsApp/Coordenadas | Alto (Wix 2021 com caixas azul-pastel e baixo contraste) | **Selecionada** |
| **Ilha Jet Club** | 5.5 / 10 | Sem vídeo; fotos mistas e `.heic`; banners com texto na imagem | Alto, porém nicho exclusivo de Jet Ski | Descartada |
| **Marina Igararecê** | 7.0 potencial / 4.0 ativos | Sem vídeo; imagens stock genéricas; sem telefone/WhatsApp/endereço no DOM | Crítico, mas inviabiliza protótipo honesto sem inventar dados | Descartada |

### 3.2 Avaliação Visual Calibrada (Crítico Zero-Context: R03 vs R04 vs R05)

As notas abaixo refletem exclusivamente avaliações de subagentes Art Director sem contexto prévio sobre `cook/compare/rNN/all.jpg`. Em `R05`, após diferença superior a 10 pontos entre os 2 primeiros críticos, adicionou-se um 3º crítico e calculou-se a **mediana por dimensão**:

| Enquadramento | R03 Cego (1x) | R04 Cego (1x) | R05 Mediana (3x Cegos) | Mediana por Critério em R05 (`Comp / Light / Color / Mat / Detail / Motion`) |
|---|---:|---:|---:|---|
| **S01 (Hero Marítimo)** | 73.6 | 86.0 | **65.4** | `72 / 65 / 58 / 68 / 64 / 9/10` |
| **S02 (Editorial + Chanfros)** | 74.2 | 78.8 | **63.6** | `76 / 56 / 64 / 62 / 60 / 9/10` |
| **S03 (Card Marinho + Foco)** | 76.4 | 83.0 | **70.0** | `78 / 66 / 68 / 70 / 68 / 9/10` |

### 3.3 Telemetria Objetiva (HSV, Vídeo, Seções, Mobile e Evals em R05)
- **Color Check (`cook/color_check.py`, grade 4x4 contra `R01`–`R03`):**
  - `R01 vs S01`: saturation mean `+0.090` (worst cell `+0.213`) | brightness mean `-0.017` (worst cell `-0.096`)
  - `R02 vs S02`: saturation mean `+0.023` (worst cell `-0.193`) | brightness mean `+0.004` (worst cell `+0.275`)
  - `R03 vs S03`: saturation mean `+0.065` (worst cell `+0.328`) | brightness mean `+0.007` (worst cell `+0.114`)
- **Integridade de DOM, Vídeo, Seções e Mobile (`cook/harness.mjs r05`):**
  - `Interactive check: {"errs":[],"tabCount":5}` em `1600x1000`.
  - `12 imgs (0 broken)`, `2 videos (1920px readyState 4)`, `videoCheck: {"isVideoMode":true,"readyState":4,"videoWidth":1920,"paused":false}`.
  - Todas as 5 abas de `#servicos` validadas (`active: true, imgLoaded: true`), `#menu-overlay`, `#concierge-modal`, `#historia`, `#ecossistema`, `#faq` e `footer` capturados em `cook/stills/r05/extra/`.
  - Viewport mobile `390x844`: `scrollWidth: 390`, `innerWidth: 390`, `overflowX: false`, `smallTouchTargets: []` (todos os controles `>= 44px`).
  - `EmDash: false`, `PageErrs: 0`, HTTP `200` / `206` (streaming `Range`) em todos os recursos locais.
- **Eval Quantitativo + Retrospectiva (`evals/eval_marina_porto.py`):**
  - Avaliação ponderada em 5 pilares (`Ativos 100`, `Acessibilidade/Mobile 80` com desconto transparente de `-20` por ausência de `prefers-reduced-motion`, `Slop Ban/Privacidade 100`, `$cook Visual 86.53` refletindo as medianas cegas reais, `Docs/Links 100`) consolidada em [`evals/saida/EVAL-REPORT.md`](../evals/saida/EVAL-REPORT.md) e [`docs/EVALUATION-AND-RETROSPECTIVE.md`](EVALUATION-AND-RETROSPECTIVE.md).

### 3.4 Limites Conhecidos e Status Atual do Gate
- **Limites documentados sem inflação:** (1) ao comparar pixel a pixel contra renders de estúdio/drone da Wally, os 3 críticos zero-context convergiram no teto fotográfico das fotos operacionais reais da marina; (2) `styles.css` ainda não declara `@media (prefers-reduced-motion: reduce)` e testes em Safari iOS físico/leitor de tela estão pendentes. Ver [`docs/EVALUATION-AND-RETROSPECTIVE.md`](EVALUATION-AND-RETROSPECTIVE.md).
- **Status atual do Gate (`cook/ROUNDS.md`):** `stills approved [approved for closure/presentation by user on 2026-11-13]`.

---

## 4. Status dos Próximos Passos Planejados

1. **Rodada 05 (`R05`) de Refinamento Visual (`cook/ROUNDS.md`) [concluída]:**
   - `S01` (header lockup), `S02` (contraste e reenquadramento), `S03` (silhueta vetorial com esteira) e reavaliação cega por 3 críticos concluídos.
2. **Cobertura Completa de Seções, Vídeo e Responsividade (`cook/harness.mjs`) [concluída]:**
   - Portabilidade via `import.meta.url` e 15 capturas extras (`Canal ao vivo`, overlays, 5 abas, seções e mobile `390x844`) validadas.
3. **Aprovação Final, Evals, Retrospectiva e Skill `delivery-eval-docs` [concluída]:**
   - Gate aprovado pelo usuário em `2026-11-13`, criada a retrospectiva [`EVALUATION-AND-RETROSPECTIVE.md`](EVALUATION-AND-RETROSPECTIVE.md), executados [`evals/eval_marina_porto.py`](../evals/eval_marina_porto.py) e [`tests/test_eval_marina_porto.py`](../tests/test_eval_marina_porto.py), e formalizada a skill [`delivery-eval-docs`](../../.claude/skills/delivery-eval-docs/SKILL.md).
4. **Evoluções Opcionais Pós-Apresentação (Backlog Comercial):**
   - Adicionar `@media (prefers-reduced-motion: reduce)` + auditoria com leitor de tela e Safari iOS físico; se aprovado em contrato, realizar sessão de drone/fotos em *golden hour* no Canal de São Sebastião.

---

## 5. Arquitetura de Arquivos e Símbolos

| Arquivo | Papel | Principais Símbolos / Seções |
|---|---|---|
| [`index.html`](../index.html) | Estrutura semântica e `<clipPath>` SVG (`#wally-slant-*`) | `#site-header`, `#menu-overlay`, `#hero`, `#shot-s02`, `#shot-s03`, `#servicos`, `#historia`, `#ecossistema`, `#faq`, `#concierge-modal` |
| [`styles.css`](../styles.css) | Tokens (`#ffffff`, `#232628`, `#333738`), layout assimétrico e mídia | `.site-header`, `.hero-grade`, `.wally-grid-two`, `.chamfer-card`, `.event-card`, `.service-stage`, `.modal-backdrop` |
| [`app.js`](../app.js) | Dados das 5 modalidades e interatividade | `SERVICES`, `syncHeader`, `setMenuOpen`, `renderService`, `openConcierge`, `closeConcierge` |
| [`evals/eval_marina_porto.py`](../evals/eval_marina_porto.py) | Eval quantitativo em 5 pilares (`EVAL-REPORT.md` + JSON) | `run_evaluation`, `contrast_ratio`, `run_color_check` |
| [`tests/test_eval_marina_porto.py`](../tests/test_eval_marina_porto.py) | Suíte pytest/unittest determinística dos contratos da entrega | `test_assets_and_offline_autonomy`, `test_wcag_contrast_and_mobile_contracts`, `test_documentation_consistency_and_links` |

### Dados Operacionais Verificados do Cliente
- **Endereço:** Av. Alm. Tamandaré, 304, Itaquanduba, Ilhabela, SP, `11630-000`
- **Coordenadas e Rádio:** `23º 47,9' S / 45º 21,9' W` · Sala Rádio `VHF Delta 38` (24h / 365 dias)
- **Canais oficiais:** Tel `(12) 3896-1243` · WhatsApp `+55 12 99634-2782` · `secretaria@marinaportoilhabela.com.br` · `@marinaportoilhabela`
