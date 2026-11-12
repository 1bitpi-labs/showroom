# ⚓ Cais OS — PRD (Product Requirements Document) & Visão Geral

> **Status:** Documento Oficial de Requisitos de Produto e Governança Técnica  
> **Metodologia de Engenharia:** [1Bitpi Agent OS (PIAOS)](../../registry/workflows/README.md)  
> **Workflow de Execução:** **PB-06 Lean 4-Stage Delivery** ([ADR-0113](../../sdd/decisions/ADR-0113-pb06-lean-substitui-lifecycle-00-09.md))  
> **Change de Origem:** [`sdd/changes/portal-os-mobile-v1/`](../../sdd/changes/portal-os-mobile-v1/)  
> **Pull Request:** [1bitpi-labs/agent-os#31](https://github.com/1bitpi-labs/agent-os/pull/31)

---

## 1. Visão Geral do Produto (Executive Summary)

O **Cais OS** é um Sistema Operacional Web voltado para o setor náutico e oficinas técnicas premium (marinas, centros náuticos, garagens de lanchas e iates). Ele resolve o maior gargalo operacional do setor: **a demora e o atrito na aprovação de orçamentos e na cobrança de sinais para compra de peças genuínas**.

### A Dor Real de Mercado (Auditoria Marina Imperial - Caraguatatuba)
1. **Desconfiança Técnica:** Clientes de alto poder aquisitivo recebem mensagens confusas de WhatsApp e desconfiam da necessidade de substituição de componentes caros (ex: rotores de borracha ressecados, rabetas com emulsão de óleo salino).
2. **Pátio Travado:** Embarcações de R$ 500k a R$ 3M ocupam boxes mecânicos e elevadores de 12t por dias aguardando autorizações verbais.
3. **Inadimplência de Peças:** A marina encomenda peças de distribuidores oficiais (Mercury, Volvo Penta) sem receber antecipadamente, assumindo o risco financeiro.

### A Solução Cais OS
O Cais OS provê uma esteira digital de 4 visões especializadas operando sem instalação de aplicativo:
- **Visão 1 (WhatsApp):** Notificação oficial com card técnico e link seguro único (`/p/[token]`).
- **Visão 2 (App Mobile do Cliente - 390px):** Laudo pericial com Gêmeo Digital SVG (Digital Twin), comparador Antes x Depois, discriminação transparente de mão de obra vs peças e botão de aprovação em 1 toque com cobrança de **Sinal Pix de 30%** (EMVCo BR Code).
- **Visão 3 (Tablet do Mecânico no Píer - 768px):** Ficha técnica de entrada e checklist obrigatório de 12 pontos com registro fotográfico pericial.
- **Visão 4 (Balcão / Command Center - 1440px):** Régua de telemetria da maré/canal em tempo real, monitoramento da presença do cliente (*"Dr. Roberto abriu o laudo há 42s"*) e gestão do pátio e elevador.

---

## 2. Mapa dos Documentos Canônicos de Engenharia

| Documento | Caminho no Repositório | Descrição e Finalidade |
| :--- | :--- | :--- |
| **PRD & Requisitos de Produto** | [`prototipos/cais-portal-os/PRD.md`](file:///home/caueantonacci/.t3/worktrees/agent-os/t3-0643ba8f-39b9c19afb02c891/prototipos/cais-portal-os/PRD.md) | Este documento: requisitos funcionais/não funcionais, escopo, proposta de valor e governança do produto. |
| **Agent Guide** | [`prototipos/cais-portal-os/AGENT.md`](file:///home/caueantonacci/.t3/worktrees/agent-os/t3-0643ba8f-39b9c19afb02c891/prototipos/cais-portal-os/AGENT.md) | Guia completo para agentes autônomos sobre como o projeto foi construído e como evoluí-lo. |
| **Design System & Tokens** | [`prototipos/cais-portal-os/DESIGN-SYSTEM.md`](file:///home/caueantonacci/.t3/worktrees/agent-os/t3-0643ba8f-39b9c19afb02c891/prototipos/cais-portal-os/DESIGN-SYSTEM.md) | 110 tokens semânticos W3C DTCG, paleta Obsidian Slate, tipografia e WCAG 2.2 AA. |
| **Arquitetura de Software** | [`prototipos/cais-portal-os/ARCHITECTURE.md`](file:///home/caueantonacci/.t3/worktrees/agent-os/t3-0643ba8f-39b9c19afb02c891/prototipos/cais-portal-os/ARCHITECTURE.md) | Arquitetura reativa vanilla, DAG do PB-06, Gêmeo Digital e integridade de estado. |
| **Modelo de Dados (Database)** | [`prototipos/cais-portal-os/DATABASE.md`](file:///home/caueantonacci/.t3/worktrees/agent-os/t3-0643ba8f-39b9c19afb02c891/prototipos/cais-portal-os/DATABASE.md) | Esquema dos dados da OS, checklist de 12 pontos, cálculo em centavos e imutabilidade. |
| **Segurança & Jurídico** | [`prototipos/cais-portal-os/SECURITY.md`](file:///home/caueantonacci/.t3/worktrees/agent-os/t3-0643ba8f-39b9c19afb02c891/prototipos/cais-portal-os/SECURITY.md) | Assinatura imutável v1, carimbo de IP, hash SHA-256 e conformidade EMVCo Pix. |
| **Guia de Estilo (Code Style)** | [`prototipos/cais-portal-os/CODE-STYLE.md`](file:///home/caueantonacci/.t3/worktrees/agent-os/t3-0643ba8f-39b9c19afb02c891/prototipos/cais-portal-os/CODE-STYLE.md) | Regra Zero Raw Hex/RGBA, pureza semântica, touch target 44px e padrões JS/CSS. |
| **Estratégia de Testes** | [`prototipos/cais-portal-os/TESTING.md`](file:///home/caueantonacci/.t3/worktrees/agent-os/t3-0643ba8f-39b9c19afb02c891/prototipos/cais-portal-os/TESTING.md) | Suíte de 19 testes automatizados (`pytest`) e harness quantitativo (`eval_visao2.py`). |

---

## 3. Matriz de Rastreabilidade do Método PB-06 Lean

- **Estágio 1 (Intake & Spec Lock):** Delimitação em `SPEC-LOCK.md` e `VALUE-DECISION.md` aprovados formalmente pelo decisor Caue em 2026-11-11.
- **Estágio 2 (Isolated Build Loop):** Construção autônoma em HTML5/CSS3/JavaScript vanilla em `prototipos/cais-portal-os/`.
- **Estágio 3 (Adversarial Verify):** Validação determinística de tokens (`check_tokens.py`), testes de contraste e regressão visual.
- **Estágio 4 (Governed Release):** PR [#30](https://github.com/1bitpi-labs/agent-os/pull/30) e PR [#31](https://github.com/1bitpi-labs/agent-os/pull/31) vinculados e auditados.
