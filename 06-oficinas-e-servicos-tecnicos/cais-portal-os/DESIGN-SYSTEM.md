# 🎨 Cais OS — Design System & Tokens Specification

> **Norma Oficial de Governança:** [`PIA-DESIGN-STD-001`](../../docs/standards/PIA-DESIGN-STD-001.md)  
> **Padrão de Tokens:** W3C Design Tokens Community Group (DTCG)  
> **Script de Validação:** `python3 tools/design/check_tokens.py --css prototipos/cais-portal-os/tokens.css --json sdd/changes/portal-os-mobile-v1/ux/tokens.json`  
> **Status:** 110 Tokens Conferidos · **0 Divergências**

---

## 1. Princípios de Direção Visual (Luxury Marine / Enterprise)

1. **Atmosfera Obsidian Slate & Profundidade:**
   - Inspirado em interfaces de telemetria marítima de alto bordo (Raymarine Axiom, Garmin EmpirBus) e produtos como Linear e Tesla App.
   - Camadas de elevação sutil sobre preto naval profundo (`#060911` a `#13222E`), eliminando interfaces cinzentas genéricas.
2. **Glassmorphism Naval Controlado:**
   - Uso de superfícies translúcidas com `backdrop-filter: blur(16px)` para barras de topo e cartões métricos, com fallback opaco garantido para navegadores legados.
   - Bordas *hairline* de 1px com alta precisão (`--cais-border-hairline`).
3. **Tripla Hierarquia Tipográfica & Tabular Nums:**
   - **Inter:** Textos de interface, títulos e narrativa pericial.
   - **IBM Plex Mono / JetBrains Mono:** Números técnicos e financeiros com `font-variant-numeric: tabular-nums` (horímetro `342,4h`, temperatura `98,4°C`, RPM `3.200`, valores em R$ e hashes SHA-256).
4. **Legibilidade sob Luz Solar Intensa (Doca / Píer):**
   - No tema claro (padrão de píer), contraste de texto superior a **18:1** sobre fundo branco/areia.
   - Cores semânticas de alta saturação (Mint para Conforme, Coral para Crítico, Gold para Atenção).

---

## 2. Paleta Semântica de Tokens DTCG (110 Tokens)

### A. Superfícies & Fundo
- `--cais-bg`: Fundo principal da aplicação (`var(--cais-p-sand-50)` em light / `var(--cais-p-night-900)` em dark).
- `--cais-surface`: Fundo dos cards e contêineres (`var(--cais-p-white)` / `var(--cais-p-night-800)`).
- `--cais-surface-sunken`: Fundo rebaixado para caixas técnicas e checklists (`var(--cais-p-sand-100)` / `var(--cais-p-night-700)`).
- `--cais-scrim`: Overlay escurecido para modais (`rgba(16, 32, 43, 0.7)`).
- `--cais-overlay-glass`: Tag translúcida de tipo de embarcação (`rgba(255, 255, 255, 0.15)`).
- `--cais-overlay-subtle`: Fundo para itens de bento grid (`rgba(255, 255, 255, 0.1)`).

### B. Acentos & Cores de Estado
- `--cais-accent`: Azul náutico institucional (`#0B4F6C` em light / `#6CC4E6` em dark).
- `--cais-positive`: Verde menta de aprovação e peças conformes (`#14693F` / `#5FD08F`).
- `--cais-negative`: Vermelho coral para avarias críticas e 3 pás rompidas (`#A42318` / `#FF8A80`).
- `--cais-warning`: Âmbar dourado para atenção preventiva (`#7A4B00` / `#F2C14E`).
- `--cais-focus`: Azul de alta visibilidade para navegação por teclado (`#0A5BD6` / `#8AB4FF`).

### C. Dimensões & Acessibilidade Tátil
- `--cais-hit`: **`2.75rem` (44px)** — Alvo de toque mínimo universal para botões, toggles e modais conforme WCAG 2.2 AA.
- `--cais-radius-sm`: `6px`
- `--cais-radius-md`: `12px`
- `--cais-radius-lg`: `20px`
- `--cais-radius-pill`: `999px`

---

## 3. Regra de Ouro: Zero Raw Hex & Zero Raw RGBA

O arquivo `app.css` é auditado deterministicamente:
- **Zero `#hex` soltos:** Proibido o uso de `#ffffff`, `#000000`, etc. fora dos tokens.
- **Zero `rgba()` soltos:** Todas as transparências devem consumir variáveis semânticas como `var(--cais-scrim)` e `var(--cais-border-hairline)`.
