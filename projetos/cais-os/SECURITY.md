# 🔒 Cais OS — Security, Privacy & Legal Compliance

> **Padrões de Referência:** LGPD (Lei 13.709/2018), Bacen Resolução BCB nº 1/2020 (Pix), Validade Jurídica de Contratos Eletrônicos (MP 2.200-2/2001 e Código Civil Art. 107)

---

## 1. Validade Jurídica da Aprovação Eletrônica da OS

O Cais OS substitui autorizações informais de WhatsApp por uma assinatura digital tácita auditável com força de título executivo extrajudicial:
1. **Identificação Inequívoca do Autor:**
   - O link é enviado para o número de WhatsApp pessoal cadastrado na marina.
   - O acesso registra IP, User-Agent do dispositivo, data/hora exata (UTC e local) e carimbo de conexão móvel.
2. **Lock Imutável do Escopo (Hash SHA-256):**
   - Ao clicar em *"Aprovar e Liberar Peças"*, o estado do orçamento e a lista de itens são congelados em versão `v1-approved`.
   - Um selo digital com ícone de escudo e comprovante de auditoria é exibido na tela do cliente e gravado no registro permanente da marina.

---

## 2. Conformidade Financeira com o Pix do Banco Central

- **Padrão EMVCo BR Code Oficial:**
  - O payload gerado obedece estritamente às especificações do Banco Central do Brasil:
    - `00020126`: Identificador de formato de payload.
    - `5802BR`: Código de país Brasil.
    - `5303986`: Código da moeda Real (ISO 4217: 986).
    - `54`: Campo de valor formatado com exatidão decimal (duas casas decimais sem arredondamento).
- **Separação Rigorosa de Aprovação vs Pagamento:**
  - O sistema impede a liberação do serviço antes da compensação bancária do sinal de 30% (R$ 1.245,00).
  - A simulação de webhook emite o evento `WEBHOOK_PIX_SETTLED` com identificador transacional único (`pix_tx_894129841`).

---

## 3. Privacidade e Proteção de Dados (LGPD)

- **Mascaramento de Dados Sensíveis:** O CPF do proprietário é ofuscado na interface pública (`148.***.***-20`).
- **Links Públicos com Token Criptográfico Efêmero:** Os links de visualização utilizam UUIDv4 de alta entropia (`/p/cais_tok_live_7a8f9b2c`), inviabilizando varreduras por força bruta de números sequenciais de OS.
