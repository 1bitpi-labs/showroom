# Showroom — Dados de Negócio por Vertical (schema)

Cada arquivo `showroom/_data/<NN>-<slug>.json` substitui o catálogo genérico
(`EMBEDDED_CATALOG`, antes herdado do hub de ferramentas de IA) do site da vertical
correspondente. O script `tools/showroom/apply_business_data.py` injeta os dados no
HTML (`index.html` e cópia nomeada) de cada pasta.

> Todos os dados são **fictícios e demonstrativos** (empresas-modelo do showroom).
> Não representam clientes reais, preços oficiais ou telemetria real.

## Estrutura do arquivo

```json
{
  "vertical": "01",
  "count_label": "SUÍTES, EXPERIÊNCIAS & PROCESSOS",
  "panel_label": "PAINÉIS",
  "link_label": "Falar no WhatsApp ↗",
  "domain_chips": [
    { "id": "ALL", "label": "Tudo" },
    { "id": "PIA-EXP-07", "label": "..." },
    { "id": "PIA-SPE-02", "label": "..." },
    { "id": "PIA-ORC-03", "label": "..." },
    { "id": "PIA-MEM-02", "label": "..." },
    { "id": "PIA-GOV-02", "label": "..." },
    { "id": "PIA-EXE-01", "label": "..." }
  ],
  "items": [ /* exatamente 24 itens */ ]
}
```

## Item

| Campo | Regra |
|---|---|
| `entity_id` | ID estável, MAIÚSCULO, ex. `HOS-SUI-001` (prefixo da vertical + área + nº) |
| `tool_name` | Nome do item de negócio (produto, serviço, processo, ativo). ≤ 40 caracteres |
| `category_label` | Área de negócio exibida no topo do dossiê (ex. "Suítes & Bangalôs") |
| `summary` | 1–2 frases em pt-BR, concretas, com números/preços/prazos realistas para o Brasil (180–300 caracteres) |
| `block` | Um dos 6 IDs de `domain_chips` (exceto `ALL`) |
| `orbit` | Um dos 6 IDs de órbita da vertical — **exatamente 4 itens por órbita** |
| `emoji` | 1 emoji representativo |
| `metric` | Indicador curto do card (≤ 22 caracteres), ex. `R$ 2.890 / noite` |
| `score` | 0–100 |
| `score_label` | Rótulo curto do score (≤ 12 caracteres), ex. `Satisfação`, `Conformidade` |
| `status` | `OPERACIONAL`, `EM REVISÃO` ou `AGUARDANDO GATE` (use os três; maioria OPERACIONAL) |
| `tags` | 3–6 tags minúsculas |
| `gate_checklist` | Checklist do gate humano P6, curto (≤ 90 caracteres), ex. `fotos 8/8 · frigobar conferido · assinatura governanta` |
| `api_call` | Comando demonstrativo `curl` para `https://api.<marca>.1bitpi.com/v1/...` |
| `cta_text` | Texto pré-preenchido de WhatsApp (sem URL-encode) |
| `panels` | Exatamente 3 painéis: `{ "title": "...", "lines": ["...", "...", "..."] }`, títulos ≤ 26 caracteres, 3–4 linhas por painel, cada linha ≤ 46 caracteres. Sugestão: 1) Visão geral · 2) Indicadores · 3) Fluxo / Gate |
