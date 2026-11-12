# PRD — ElosPME / Brisa Oficina

## Problema e público

Organizar clientes, aparelhos e visitas e conduzir uma proposta até aceite e execução, mantendo a revisão acordada e o histórico. Operador interno autenticado administra uma instalação; destinatário público consulta/decide apenas a revisão autorizada por token. Público de referência: operação pequena de climatização; necessidades de cliente real ainda não homologadas.

## Jornadas entregues

Cliente → orçamento com itens e condições → rascunho ou publicação → link compartilhado manualmente → decisão explícita → uma OS. Cliente → equipamento → visita manual com técnico, duração e vínculos coerentes. Ajuda por campo/aba e catálogo/progresso de leitura por conta apoiam operação.

Oito áreas: Orçamentos, OS, Clientes, Equipamentos, Agenda, Caixa de entrada, Configurações e Guia. Incremento visual: menu móvel, busca de abas/orçamentos, filtros reais, carteira/modal, quadro OS, drawer histórico/PDF, prévia de marca e progresso de leitura calculado. O vídeo de Clientes mostra interface anterior, identificado como tal; texto foi adaptado.

## Aceites essenciais

- Persistência após reload; mensagens de sucesso somente após confirmação da API.
- Valores em centavos calculados no servidor; snapshots publicados preservados.
- Aceite concorrente/retry gera uma decisão/OS; nova revisão invalida link antigo.
- Agenda rejeita sobreposição para técnico normalizado; equipamento/OS coerentes com cliente.
- Concluir visita não conclui OS. Atualizar marca não reescreve documentos antigos.
- Busca não cadastra; editar preserva ID. Ajuda não submete e preserva campos na mesma aba.
- 360px e desktop, foco/labels e recuperação de erro; sem depender só de cor.

Detalhes normativos: [spec.md](spec.md), [operações/treinamento](changes/guided-training-operations.md) e [design](changes/full-app-design.md).

## Fora do escopo atual

Multiempresa compartilhada, financeiro/faturamento, pagamentos, WhatsApp/e-mail automático, equipe/roteirização, recorrência, PMOC, checklist/fotos, certificado técnico, assinatura certificada, autonomia paga/cron. Textos/fixtures do protótipo não implementam essas funções.

## Indicadores e validação

Resultado técnico: persistência/integridade e jornadas especificadas. Valor humano: concluir tarefas sem intervenção, erros, uso de ajuda e tempo comparável. Não há baseline humano ou ROI medido. Aprovação de implementação não é G1/release. Melhorias devem preservar núcleo antes de ampliar domínio.
