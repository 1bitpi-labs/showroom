# 🗄️ Cais OS — Database & Data Schema Specification

> **Estratégia de Dados:** Tipagem Estrita, Valores Financeiros em Centavos Inteiros e Imutabilidade de Versão  
> **Persistência do Protótipo:** LocalStorage Seguro com Inicialização Determinística (`INITIAL_DATA`)

---

## 1. Princípios de Modelagem Financeira & Operacional

1. **Valores Monetários em Centavos (`cents`):**
   - Para eliminar qualquer erro de arredondamento de ponto flutuante em JavaScript, todos os preços de serviços, peças, totais e sinais Pix são armazenados como inteiros:
     - Total da OS: `415000` (representa R$ 4.150,00).
     - Sinal Pix de 30%: `124500` (representa R$ 1.245,00).
2. **Imutabilidade pós-aprovação (`versionLock`):**
   - Uma vez aprovada pelo cliente, a ordem de serviço recebe a marcação `v1-approved`, impedindo qualquer edição retroativa de itens ou acréscimo de valores sem a emissão de uma nova versão (ex: v2 com aditivo).
3. **Auditoria Transacional (`auditLogs`):**
   - Todas as transações (abertura, geração de token, aprovação pelo cliente com IP e confirmação do webhook Pix) são anexadas em uma lista de append-only com timestamp e ator.

---

## 2. Esquema da Entidade Principal: `ServiceOrder`

```json
{
  "id": "OS-2026-089",
  "version": 1,
  "versionLock": "v1-approved",
  "publicToken": "cais_tok_live_7a8f9b2c",
  "assetName": "Lancha Schaefer Phantom 303",
  "engineModel": "Mercury MerCruiser 350 MAG MPI 5.7L V8 (300 HP)",
  "driveModel": "Rabeta Bravo Three DuoProp (Hélices em Inox)",
  "hoursMeter": "342,4 horas",
  "fuelLevel": "65% (Gasolina Náutica Podium)",
  "berthLocation": "Box G-14 (Elevador 12t)",
  "registrationNumber": "381-098273-1",
  "clientName": "Roberto de Albuquerque Silveira",
  "clientCpf": "148.***.***-20",
  "clientPhone": "(11) 98144-3210",
  "reportedIssue": "Proprietário relatou alarme sonoro de alta temperatura de água ao ultrapassar 3.200 RPM...",
  "status": "IN_PROGRESS",
  "approvalStatus": "APPROVED",
  "paymentStatus": "SIGNAL_PAID",
  "approvedAt": "11/11/2026 09:12:45",
  "approvedIp": "189.120.44.12 (Conexão 5G Claro / Caraguatatuba)",
  "totalCents": 415000,
  "signalCents": 124500,
  "checklist": [
    { "item": "Nível e Viscosidade do Óleo do Cárter", "status": "OK", "note": "25W-40 Synthetic Blend" },
    { "item": "Óleo da Rabeta Bravo Three", "status": "ALERTA", "note": "High Performance 90W com micro-sal" },
    { "item": "Rotor da Bomba de Água Salgada", "status": "CRITICO", "note": "3 pás partidas e ressecamento" }
  ],
  "items": [
    {
      "id": "it-1",
      "category": "Mão de Obra Especializada",
      "code": "MO-SRV-08",
      "desc": "Desmontagem da rabeta Bravo Three e bomba d'água",
      "qty": "4,0 horas",
      "priceCents": 160000
    },
    {
      "id": "it-2",
      "category": "Peça Genuína Quicksilver",
      "code": "PART-47-862232A02",
      "desc": "Kit completo de rotor e anéis de vedação da bomba d'água",
      "qty": "1 un",
      "priceCents": 125000
    }
  ]
}
```
