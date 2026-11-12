export const guideSteps = [
  {
    title: "Monte o orçamento",
    text: "Informe o cliente, os serviços e as condições. Salve um rascunho para continuar depois ou publique quando estiver pronto.",
  },
  {
    title: "Compartilhe o link",
    text: "Após publicar, copie o link exibido e envie manualmente pelo WhatsApp ou outro canal. O sistema não envia mensagens. Guarde o link: ele não é recuperável depois de sair desta sessão.",
  },
  {
    title: "Acompanhe a decisão",
    text: "O cliente aprova a revisão exata ou pede uma alteração. Uma nova revisão invalida o link anterior. Revogar apenas bloqueia o acesso; não apaga uma aprovação já registrada.",
  },
  {
    title: "Execute o serviço",
    text: "O aceite cria uma OS pendente. Em Ordens de serviço, inicie e depois conclua o trabalho. A aprovação não agenda nem confirma pagamento.",
  },
  {
    title: "Consulte e organize",
    text: "Em Histórico / PDF, consulte versões e decisões. Exporte a lista em CSV. Configurações alteram a marca apenas dos próximos documentos.",
  },
];
export const nextSteps: Record<string, string> = {
  draft:
    "Próximo passo: confira os dados e publique para gerar o link do cliente.",
  sent: "Aguarde a decisão do cliente. Se perdeu o link, publique uma nova revisão; ela invalida a anterior.",
  accepted:
    "Próximo passo: acompanhe a OS em Ordens de serviço. Aprovação não confirma pagamento.",
  change_requested:
    "Próximo passo: consulte o pedido no histórico e publique uma nova revisão com os ajustes.",
  expired:
    "Próximo passo: revise a validade e publique uma nova revisão para gerar outro link.",
  cancelled: "Orçamento cancelado. Crie um novo se quiser retomar a proposta.",
  pending:
    "Próximo passo: combine a execução com o cliente e inicie o serviço quando o trabalho começar.",
  in_progress:
    "Próximo passo: conclua a OS quando o serviço estiver finalizado.",
  completed:
    "Serviço concluído. O histórico do orçamento continua disponível para consulta.",
};
export const eventLabels: Record<string, string> = {
  published: "Versão publicada",
  draft_saved: "Rascunho salvo",
  accepted: "Orçamento aprovado",
  change_requested: "Alteração solicitada",
  link_revoked: "Link revogado",
  cancelled: "Orçamento cancelado",
  order_in_progress: "Serviço iniciado",
  order_completed: "Serviço concluído",
  order_cancelled: "OS cancelada",
  brand_updated: "Marca atualizada",
};
