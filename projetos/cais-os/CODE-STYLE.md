# 📐 Cais OS — Code Style & Frontend Quality Standards

> **Norma Oficial de Governança:** [`PIA-DESIGN-STD-001`](../../docs/standards/PIA-DESIGN-STD-001.md)  
> **Acessibilidade:** W3C WCAG 2.2 Nível AA  
> **Viewport Mobile Canônico:** 390px (iPhone 14 / base móvel)

---

## 1. Regras Estritas de CSS (Zero Raw Hex & Zero Raw RGBA)

1. **Cores Hardcoded são Erros Críticos:**
   - Todo estilo em `app.css` deve utilizar exclusivamente variáveis semânticas `var(--cais-*)`.
   - Nenhuma declaração literal `#fff`, `#10202B` ou `rgba(0,0,0,.5)` é permitida em seletores de componentes.
2. **Área de Toque Mínima de 44px (`--cais-hit`):**
   - Qualquer elemento interativo móvel (botões, toggles, acionadores de modal, campos de input) deve garantir `min-height: var(--cais-hit)` ou área clicável equivalente.
3. **Respeito a `prefers-reduced-motion`:**
   - Todas as animações CSS (`cais-pulse`, `cais-ping`, transições) devem ser anuladas ou suavizadas para 0ms quando o usuário configurar redução de movimento no sistema operacional.

---

## 2. Padrões de JavaScript

1. **Sem Dependências Pesadas de Framework:**
   - Código vanilla limpo, modular e autônomo (zero dependência de React/Vue/Angular em runtime).
   - Renderização reativa determinística baseada no objeto global `state`.
2. **Proibição de `alert()`, `confirm()` ou `prompt()` Nativos:**
   - Todo feedback visual ao usuário deve usar o componente de notificação flutuante `showToast(msg)`.
3. **Resiliência de Clipboard:**
   - Toda operação de cópia (Part Numbers ou Pix) deve prever fallback caso a API moderna `navigator.clipboard.writeText` seja bloqueada pelo navegador móvel do usuário.
