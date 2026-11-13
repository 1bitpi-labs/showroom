# Relatorio de Avaliacao Quantitativa (Eval): Marina Porto Ilhabela (R05)

> **Data da Avaliacao:** 2026-11-13 14:08:54  
> **Gate Atual:** `approved_for_closure_and_presentation`  
> **Score Global Ponderado:** **93.31 / 100** (A (Aprovado para Apresentacao Comercial com Limites Documentados))

---

## 1. Resumo por Pilar

| Pilar | Peso | Nota | Status |
|---|---:|---:|---|
| Integridade de Ativos & Autonomia Offline | 20% | **100.00** | Conforme |
| Acessibilidade, Semantica & Mobile 390px | 20% | **80.00** | Aprovado com limite conhecido |
| Slop Ban, Dados Reais & Privacidade | 20% | **100.00** | Conforme |
| Convergencia $cook & Telemetria Visual | 20% | **86.53** | Aprovado com limite conhecido |
| Documentacao, Gate & Consistencia de Links | 20% | **100.00** | Conforme |

---

## 2. Achados Objetivos e Limites Nao Inflados

- **Contraste WCAG AA calculado (`styles.css`):** texto primario `15.22:1`, corpo `9.26:1`, botao `12.04:1`, footer `18.55:1` (todos >= 4.5:1).
- **Reduced Motion (`prefers-reduced-motion`):** Ausente em styles.css (-20 pts no Pilar 2; item registrado no backlog).
- **Slop Ban e Privacidade:** `EmDash: false`, placeholders `0`, caminhos pessoais/segredos nos entregaveis `0`.
- **Telemetria HSV R05 (`color_check.py`):** S01 brilho `-0.017`, S02 brilho `0.004`, S03 brilho `0.007`.
- **Mediana de 3 criticos zero-context R05:** `S01 65.4`, `S02 63.6`, `S03 70.0` (teto fotografico das imagens operacionais reais do cliente frente ao catalogo Wally).
- **Links Markdown relativos:** `0` quebrados em `cliente-marina-porto-ilhabela/`.

*Relatorio gerado automaticamente por `evals/eval_marina_porto.py` seguindo a skill `delivery-eval-docs`.*
