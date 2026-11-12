export const TOUR_VERSION = 1;
export const tours: Record<
  string,
  { title: string; steps: { title: string; text: string; target?: string }[] }
> = {
  quotes: {
    title: "Orçamentos",
    steps: [
      {
        title: "Prepare sua proposta",
        text: "Cadastre serviços e condições. Escolha um cliente existente ou informe um novo. Salvar rascunho permite continuar depois.",
        target: "quote-new",
      },
      {
        title: "Publique e compartilhe",
        text: "Publicar gera um link exibido nesta sessão. Copie e envie manualmente. Uma revisão substitui o link anterior.",
        target: "quotes-list",
      },
      {
        title: "Acompanhe a resposta",
        text: "Aprovação gera uma OS, sem cobrança ou agendamento automático. Uma solicitação de alteração aparece no histórico.",
        target: "quotes-list",
      },
    ],
  },
  orders: {
    title: "Ordens de serviço",
    steps: [
      {
        title: "Da aprovação à execução",
        text: "Cada orçamento aceito gera uma OS pendente com os dados da revisão aprovada.",
        target: "orders-panel",
      },
      {
        title: "Registre o andamento",
        text: "Use Iniciar serviço quando o trabalho começar e Concluir ao terminar. A agenda de visitas é organizada separadamente.",
        target: "orders-panel",
      },
      {
        title: "Preserve o histórico",
        text: "Cancelar uma OS exige motivo. Nenhuma transição confirma pagamento ou envia mensagens ao cliente.",
      },
    ],
  },
  clients: {
    title: "Clientes",
    steps: [
      {
        title: "Cadastre e confirme o salvamento",
        text: "Na carteira, use Adicionar cliente para abrir o cadastro. Informe nome e dados disponíveis. Clique em Salvar cliente e confira o resultado na carteira. O cadastro não envia mensagens.",
        target: "clients-list",
      },
      {
        title: "Busque e reconheça o registro",
        text: "Em Buscar clientes, digite o nome e confira o cliente encontrado antes de editar. Buscar não cria outro cadastro.",
        target: "clients-list",
      },
      {
        title: "Edite, salve e confira",
        text: "Use Editar cliente, altere os dados e salve. Confira a informação no mesmo registro. O cliente pode ser reutilizado em orçamentos; documentos já publicados preservam seus dados originais.",
        target: "clients-list",
      },
    ],
  },
  equipment: {
    title: "Equipamentos",
    steps: [
      {
        title: "Identifique cada aparelho",
        text: "Escolha o cliente e informe identificação, modelo e local do equipamento.",
        target: "equipment-form",
      },
      {
        title: "Registre o que conhece",
        text: "BTU, série e próxima manutenção são opcionais. Não invente dados ou intervalos técnicos; consulte o responsável pelo serviço.",
      },
      {
        title: "Consulte o histórico",
        text: "As visitas vinculadas aparecem em cada equipamento. O cadastro não é um laudo nem um plano PMOC.",
        target: "equipment-list",
      },
    ],
  },
  agenda: {
    title: "Agenda de visitas",
    steps: [
      {
        title: "Planeje uma visita",
        text: "Selecione cliente, técnico, data, horário e duração. A entrada usa o fuso do seu dispositivo; a lista mostra São Paulo.",
        target: "agenda-form",
      },
      {
        title: "Vincule o atendimento",
        text: "Escolha opcionalmente um equipamento e uma OS do mesmo cliente. Visitas sobrepostas para o mesmo técnico são recusadas.",
      },
      {
        title: "Atualize a agenda",
        text: "Conclua ou cancele a visita conforme o atendimento. Isso não conclui a OS, não envia lembretes e não sincroniza calendários externos.",
        target: "agenda-list",
      },
    ],
  },
  inbox: {
    title: "Caixa de entrada",
    steps: [
      {
        title: "Seus avisos em um só lugar",
        text: "Aqui ficam os registros dos guias concluídos por sua conta. O contador indica mensagens ainda não lidas.",
        target: "inbox-panel",
      },
      {
        title: "Leia e retome",
        text: "Marque um aviso como lido ou use Refazer guia para revisar o conteúdo. Refazer não duplica a notificação.",
      },
      {
        title: "Conclusão de leitura",
        text: "Concluir um guia registra sua declaração de leitura. Pular não é concluir; não se trata de certificação técnica ou prova prática.",
      },
    ],
  },
  settings: {
    title: "Configurações",
    steps: [
      {
        title: "Personalize a operação",
        text: "Atualize o nome e a cor da empresa para as próximas publicações.",
        target: "settings-panel",
      },
      {
        title: "Preserve documentos enviados",
        text: "As mudanças não reescrevem versões publicadas. O selo de demonstração permanece nesta instalação.",
      },
      {
        title: "Cuide do acesso e dos dados",
        text: "Backup e recuperação de acesso são tarefas do responsável pela instalação, conforme o manual de operação.",
      },
    ],
  },
  guide: {
    title: "Guia de uso",
    steps: [
      {
        title: "Revise quando precisar",
        text: "Este guia reúne o fluxo principal e respostas a dúvidas frequentes.",
        target: "guide-panel",
      },
      {
        title: "Ajuda próxima dos campos",
        text: "Os botões “?” explicam cada campo sem enviar formulários. Eles funcionam por teclado e toque.",
      },
      {
        title: "Treine novamente",
        text: "Use Ajuda nesta aba em qualquer aba para repetir este passo a passo. Suas conclusões ficam na caixa de entrada.",
      },
    ],
  },
};
