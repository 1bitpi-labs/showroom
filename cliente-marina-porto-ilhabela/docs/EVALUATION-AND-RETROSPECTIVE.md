# Avaliação da Entrega e Retrospectiva: Marina Porto Ilhabela

2026-11-13. Avaliação técnica e de processo após aprovação do usuário para fechamento e apresentação comercial do protótipo editorial `R05`. Este documento distingue **evidência técnica executada**, **observação visual/crítica cega** e **aprovação humana de apresentação**, sem declarar certificação WCAG integral, teste em hardware físico iOS/Android ou ROI comercial sem validação em campo.

---

## 1. Parecer sobre o Produto Entregue

O protótipo [`index.html`](../index.html) implementa integralmente a proposta editorial inspirada na **Wally Yachts** (*same quality, own style*) usando ativos reais e dados operacionais verificados da **Marina Porto Ilhabela**, aprovado pelo usuário em `2026-11-13` para fechamento e apresentação. A base técnica entrega autonomia offline (22 ativos locais em `assets/`, vídeo 1080p `hero-sea.mp4` com suporte HTTP `Range`), zero erros de runtime, 5 abas interativas em `#servicos`, overlay `#menu-overlay`, modal `#concierge-modal` integrado ao WhatsApp e responsividade validada em viewport mobile `390x844`.

Ao mesmo tempo, a auditoria cega rigorosa (`R05`) e os evals determinísticos apontam dois limites explícitos e documentados: (1) teto fotográfico natural das fotos operacionais reais da marina frente aos renders de estúdio/drone da Wally, e (2) ausência da media query `@media (prefers-reduced-motion: reduce)` em [`styles.css`](../styles.css) e de testes com leitor de tela ou Safari/iOS real.

| Dimensão | Estado | Evidência e limite |
| --- | --- | --- |
| Composição e identidade | Aprovada para apresentação (`R05`) | Lockup `MARINA PORTO`, 3 `<clipPath>` SVG chanfrados, card náutico `TEMPORADA ILHABELA 2026` e 18 capturas em [`cook/stills/r05/`](../cook/stills/r05/). Medianas cegas: `S01 65.4`, `S02 63.6`, `S03 70.0` (teto fotográfico dos ativos do cliente). |
| Interatividade e lógica | Evidenciada no navegador headless | `TMPDIR=/tmp node cook/harness.mjs r05`: `Interactive check: {"errs":[],"tabCount":5}`, modo vídeo `isVideoMode: true, readyState: 4, paused: false`, 5 abas com `active: true, imgLoaded: true`, modal e FAQ funcionais. |
| Mobile (`390x844`) | Evidenciada em viewport headless | `mobile390x844: {"scrollWidth":390,"innerWidth":390,"overflowX":false,"smallTouchTargets":[]}` e 3 capturas em `cook/stills/r05/extra/mobile-*.png`. Dispositivos físicos Safari/iOS e teclado virtual pendentes. |
| Acessibilidade | Parcial | Contrastes de texto e botões medidos acima de `4.5:1` (`#232628/#ffffff` = `15.1:1`, `#42484e/#ffffff` = `9.3:1`, `#ffffff/#333738` = `11.8:1`), `Escape` e `aria-hidden` implementados. Falta `@media (prefers-reduced-motion: reduce)` em `styles.css` e auditoria com leitor de tela. |
| Performance e autonomia | Evidenciada | `12` imagens (`0` quebradas), `2` vídeos (`1920px`, `readyState: 4`), zero frameworks JS/CSS externos em runtime; apenas fonte `Plus Jakarta Sans` opcional via Google Fonts com fallback local. |
| Slop Ban e privacidade | Conforme | `EmDash: false` em todo o entregável e docs; zero placeholders; zero tokens/chaves; único caminho absoluto histórico preservado apenas no brief inicial (`cook/BRIEF.md:23`). |
| Documentação e evals | Consolidada nesta entrega | [`cook/ROUNDS.md`](../cook/ROUNDS.md), [`docs/PROJETO.md`](PROJETO.md), [`README.md`](../README.md), suíte [`evals/eval_marina_porto.py`](../evals/eval_marina_porto.py) e [`tests/test_eval_marina_porto.py`](../tests/test_eval_marina_porto.py). |

---

## 2. O que Funcionou

- **Qualificação prévia multi-cliente (`CLIENT_EVALUATION.md`):** descartar candidatas sem ativos reais evitou inventar dados ou usar imagens genéricas de banco.
- **Espelhamento offline completo em `assets/`:** baixar todas as fotos e o MP4 1080p localmente (com conversão JPEG 2400px q92 para PNGs pesados) eliminou falhas de CDN durante as 5 rodadas de captura e apresentação.
- **Harness portável via `import.meta.url` + suporte HTTP `Range`:** reescrever [`cook/harness.mjs`](../cook/harness.mjs) permitiu rodar o mesmo script em worktrees isoladas, validar streaming `206` do vídeo ao vivo e cobrir 15 cenas extras além de `S01..S03`.
- **Calibração com críticos zero-context:** submeter apenas `compare/rNN/all.jpg` a subagentes sem histórico revelou o viés de `-18` pontos na autoavaliação de `R03`, guiando correções cirúrgicas em `R04` e `R05`.
- **Correção física do enquadramento em `S02`:** identificar que `jetski-3.jpg` em `16:9` tinha a altura travada por `object-fit: cover` dentro de um card retrato (`540x780`) permitiu elevar o recorte (`height: 112%; margin-top: -6%`) mantendo os barcos visíveis.

---

## 3. Falhas do Trabalho e Melhorias de Processo

| Ocorrência real | Consequência | Melhoria aplicada | Verificação / limite |
| --- | --- | --- | --- |
| Autoavaliação em `R01..R03` marcou `92–93` quando o crítico zero-context deu `73–76` | Risco de encerrar antes da hora por otimismo de autor | Adotado painel independente zero-context com 3º crítico tie-breaker em `R05` (medianas `65.4 / 63.6 / 70.0` registradas sem inflação) | Mitiga viés de autor; notas permanecem limitadas pelo acervo fotográfico do cliente |
| `cook/harness.mjs` inicial tinha caminhos absolutos da máquina local | Quebrava ao rodar em worktrees diferentes | Refatorado com `import.meta.url` e resolução dinâmica de `puppeteer`, Chrome e `side-by-side.mjs` | Validado em worktree `feat-marina-porto-r05` com `TMPDIR=/tmp` |
| Avaliação final, evals e atualização documental precisaram ser solicitados novamente no fechamento | Trabalho extra ao encerrar entrega aprovada | Criada a skill reutilizável [`delivery-eval-docs`](../../.claude/skills/delivery-eval-docs/SKILL.md) com auditor de links/privacidade/em-dash | Coberta por 3 testes unitários e aplicada nesta entrega |
| `styles.css` não declara `@media (prefers-reduced-motion: reduce)` | Pilar de acessibilidade fica incompleto para usuários sensíveis a movimento | Gap contabilizado explicitamente em [`eval_marina_porto.py`](../evals/eval_marina_porto.py) (`-20 pts` no Pilar 2) e movido ao backlog | Código visual congelado após aprovação do usuário para não invalidar os stills `R05` |

---

## 4. Skills e Ferramentas Avaliadas

- **`cinematic-site-hunter`:** entregou 21 capturas de 7 estaleiros/marinas Awwwards/FWA e guiou a escolha precisa da **Wally Yachts**.
- **`client-cook-pipeline` + `cook`:** estruturou discovery, espelhamento offline, telemetry HSV (`cook/color_check.py`) e painel de críticos zero-context. O limite observado foi a trava de profundidade de subagentes quando executada dentro de sessões já aninhadas; em sessões top-level (`R04` e `R05`), o fluxo funcionou integralmente.
- **`delivery-eval-docs` (criada nesta etapa):** formaliza em [`.claude/skills/delivery-eval-docs/SKILL.md`](../../.claude/skills/delivery-eval-docs/SKILL.md) o pacote obrigatório pós-aprovação (retrospectiva honesta + eval quantitativo + testes + sync documental + auditoria `audit_docs_and_links.py`).

---

## 5. Pendências Priorizadas com Critério de Aceite

1. **Acessibilidade (`prefers-reduced-motion` e leitor de tela):** adicionar bloco `@media (prefers-reduced-motion: reduce)` em [`styles.css`](../styles.css) e validar navegação por teclado (`Tab`, `Shift+Tab`, `Escape`) e leitor de tela no `#menu-overlay`, acordeão `#faq` e `#concierge-modal`. *Critério de aceite:* Pilar 2 do `eval_marina_porto.py` passa para `100/100` e checklist manual de leitor de tela sem bloqueios.
2. **Sessão fotográfica em golden hour (pós-aprovação comercial):** capturar fotos aéreas e de canal sem defensas/placas comerciais intrusivas para substituir os enquadramentos limitantes de `S01`, `S02` e `S03`. *Critério de aceite:* mediana zero-context `>= 90/100` mantendo `color_check.py` dentro de `±0.05` de brilho.
3. **Validação em hardware físico iOS/Android:** testar streaming MP4 `hero-sea.mp4` (`playsinline`, política de autoplay em modo economia de energia) e toque nos controles em Safari iOS e Chrome Android reais. *Critério de aceite:* vídeo inicia ou exibe `poster` sem layout shift e zero overflow horizontal.
