# 🧪 Cais OS — Testing & Verification Strategy

> **Protocolo:** Estágio 3 (Adversarial Verify) do **PB-06 Lean 4-Stage Delivery (PIAOS)**  
> **Comando de Testes:** `pytest prototipos/cais-portal-os/tests/ -v`  
> **Harness de Avaliação:** `python3 evals/cais-portal-os/eval_visao2.py`  
> **Resultado Atual:** 19/19 Testes Green (0.13s) · **Score Global 100.0/100 A+**

---

## 1. Pirâmide de Testes Automatizados Determinísticos

A suíte em `prototipos/cais-portal-os/tests/` audita o sistema em menos de 200ms sem dependência de rede:

1. **`test_business_logic.py` (Lógica de Negócio e Cálculos):**
   - Cálculo exato de 30% do sinal Pix (R$ 1.245,00 sobre R$ 4.150,00).
   - Validação da integridade dos 12 pontos do checklist de píer.
   - Conformidade do payload Pix com a especificação EMVCo BR Code.
   - Trava imutável de versão pós-aprovação (`v1-approved`).
2. **`test_tokens_and_styles.py` (Design Tokens & WCAG 2.2 AA):**
   - Espelhamento de 110 tokens com 0 divergências (`check_tokens.py`).
   - Zero cores hexadecimais ou rgba soltos em `app.css`.
   - Cálculo matemático de taxa de contraste (texto primário > 18:1, texto secundário > 8:1, botão > 6:1).
3. **`test_markup_and_accessibility.py` (Semântica & Acessibilidade):**
   - Tag de viewport mobile-first `390px`.
   - Landmarks semânticos válidos (`<header>`, `<main>`, `role="dialog"`).
   - Acessibilidade de todos os botões (sem elementos órfãos).
   - Consumo universal da área de toque de 44px (`--cais-hit`).
   - Mídia query para `prefers-reduced-motion`.
4. **`test_visual_assets.py` (Capturas & Viewports Canônicos):**
   - Existência e dimensões físicas exatas das imagens de evidência (390px, 768px, 1440px).
5. **`test_eval_harness.py`:**
   - Execução do harness ponderado garantindo pontuação >= 95.0.

---

## 2. Harness de Avaliação Quantitativa (`eval_visao2.py`)

Gera relatórios determinísticos em `evals/cais-portal-os/saida/`:
- `EVAL-REPORT-VISAO2.md`
- `eval_results.json`

Pesos Ponderados:
- Acessibilidade & WCAG 2.2 AA: **20%**
- Governança de Tokens & Zero Raw Hex: **20%**
- UX, Micro-interações & Design Spells: **20%**
- Arquitetura de Conversão Mobile 390px: **15%**
- Performance & Eficiência de Runtime: **15%**
- Lógica de Negócio & Segurança Jurídica: **10%**
