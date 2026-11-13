# 🤖 Cais OS — Agent Guide (Contexto de Engenharia para IAs)

> **Instruções para Agentes:** Leia este documento antes de realizar qualquer alteração, refatoração ou extensão no código do **Cais OS**.

---

## 1. Origem e Missão do Projeto
- **Change de Origem:** `sdd/changes/portal-os-mobile-v1/`
- **Metodologia Canônica:** **PB-06 Lean 4-Stage Delivery (PIAOS)** ([ADR-0113](../../sdd/decisions/ADR-0113-pb06-lean-substitui-lifecycle-00-09.md))
- **Objetivo:** Portal de Ordem de Serviço e Orçamento Náutico com Laudo Pericial Fotográfico e Cobrança de Sinal Pix de 30%.
- **Cliente de Referência:** Marina Imperial (Caraguatatuba-SP • Rio Juqueriquerê).

---

## 2. Invariantes Sagradas (Regras Inquebráveis)
1. **Regra Zero Raw Hex & Zero Raw RGBA:**
   - NUNCA insira cores hexadecimais (`#...`) ou `rgba(...)` soltas em `app.css`.
   - Se precisar de uma nova cor, registre-a primeiro em `sdd/changes/portal-os-mobile-v1/ux/tokens.json` e espelhe em `tokens.css`.
   - Valide sempre rodando:
     ```bash
     python3 tools/design/check_tokens.py --css prototipos/cais-portal-os/tokens.css --json sdd/changes/portal-os-mobile-v1/ux/tokens.json
     ```
2. **Área de Toque Universal de 44px:**
   - Todo botão, link clicável ou toggle móvel deve respeitar `min-height: var(--cais-hit)` (44px).
3. **Valores Monetários em Centavos:**
   - Todos os cálculos de preço, totais e sinais no `app.js` devem ser feitos em centavos inteiros (`cents`).
   - A fixture oficial totaliza **415000 centavos** (R$ 4.150,00) com sinal de **124500 centavos** (R$ 1.245,00).
4. **Proibição de `alert()` Nativos:**
   - Toda comunicação de feedback deve usar `showToast(msg)`.
5. **Preservação dos 19 Testes:**
   - Nenhuma edição pode quebrar os 19 testes automatizados de regressão:
     ```bash
     pytest prototipos/cais-portal-os/tests/ -v
     ```
   - E o score do harness de eval deve permanecer em 100/100:
     ```bash
     python3 evals/cais-portal-os/eval_visao2.py
     ```

---

## 3. Mapa de Arquivos do Projeto

```
prototipos/cais-portal-os/
├── PRD.md                      # Product Requirements Document & Proposta de Valor
├── DESIGN-SYSTEM.md            # Especificação completa de tokens W3C DTCG
├── ARCHITECTURE.md             # Arquitetura reativa vanilla e máquina de estados
├── DATABASE.md                 # Modelagem de dados, centavos e imutabilidade
├── SECURITY.md                 # Segurança, LGPD, Bacen Pix e validade jurídica
├── CODE-STYLE.md               # Padrões de código e regras de acessibilidade
├── TESTING.md                  # Estratégia de testes e harness quantitativo
├── AGENT.md                    # Este guia de contexto para agentes
├── README.md                   # Documentação geral de uso do protótipo
├── index.html                  # Ponto de entrada com seletor de 4 visões
├── app.css                     # Estilos 100% governados por tokens semânticos
├── app.js                      # Motor reativo, Gêmeo Digital SVG e simulador Pix
├── cais06-200k.html            # Benchmark de engenharia visual de alto padrão
├── tokens.css                  # Folha CSS de tokens (110 tokens)
└── tests/                      # 19 testes determinísticos em pytest
```
