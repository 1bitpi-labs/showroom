# Manual de uso — ElosPME

[Voltar ao README](../README.md)

A demonstração Brisa Oficina representa uma empresa fictícia de climatização. Não realiza cobranças nem envia mensagens. Para instalar/rodar, siga o [README](../README.md#como-executar); este manual descreve a operação.

## Entrar e aprender

Entre com o operador preparado para a instalação. Na demo, o e-mail é `operador@brisa.example`; a senha fica no arquivo privado de ambiente. Cadastro público de usuários está desabilitado.

Cada aba apresenta um guia no primeiro acesso da conta. Use Próximo e Voltar para percorrer os passos; Ver depois ou Escape adiam a leitura. Concluir treinamento registra a conclusão e cria uma notificação. Refazer treinamento está no cabeçalho, e os guias também podem ser retomados na Caixa de entrada. Repetir não duplica avisos; adiar uma repetição não apaga uma conclusão anterior.

O registro corresponde à leitura declarada do guia, sem certificar competência técnica. O resumo de primeiros passos pode ser ocultado neste navegador; os treinamentos completos continuam disponíveis.

Os botões “?” explicam campos e consequências. Clique/toque ou use Enter/Space; Escape fecha e devolve o foco. Abrir uma ajuda não envia o formulário nem altera seu conteúdo.

## Clientes

1. Informe nome e, se necessário, contato, endereço e observações.
2. Salve e use a busca para localizar o cadastro.
3. Use Editar cliente para corrigir informações.
4. Ao montar um orçamento, selecione o cliente cadastrado para reutilizá-lo.

Não registre senhas ou dados bancários nas observações. Atualizar um cliente não reescreve snapshots de propostas já publicadas.

## Equipamentos

Escolha um cliente e dê uma identificação reconhecível ao aparelho, como “Split da recepção”. Marca/modelo, BTU, série, local e próxima manutenção são informações opcionais. Informe apenas dados conhecidos e datas definidas pelo responsável técnico.

O cliente de um equipamento cadastrado não pode ser trocado pela edição, preservando o vínculo do histórico. Visitas vinculadas ao aparelho aparecem em Histórico de visitas. Informar próxima manutenção não cria agendamento, lembrete, periodicidade ou plano PMOC.

## Orçamentos

### Preparar

Escolha um cliente existente ou informe um novo. Para um cadastro selecionado, os dados atuais são consultados no servidor ao publicar; corrija nome/contato pela aba Clientes. Informe descrição, quantidade inteira, preço unitário em reais, condições e validade de 1 a 90 dias.

O total é calculado no servidor em centavos. Salvar rascunho mantém a proposta interna, sem link público. Editar rascunho permite retomar e publicar depois.

### Publicar e compartilhar

Publicar fixa uma revisão com serviços, valores, condições e marca. Copie o link exibido e envie manualmente ao cliente. O endereço é mostrado nessa sessão, e o banco guarda somente o hash do token; não há recuperação do link original pelo painel.

Se perder o link de uma proposta ainda revisável, use Nova revisão e envie o novo endereço. O anterior deixa de funcionar. Confira os dados antes de publicar, pois o PDF preservará aquela revisão.

### Receber a decisão

O destinatário abre o portal, confere valores/condições e informa o nome para aprovar ou solicitar alteração. Ele confirma explicitamente a decisão sobre a revisão exibida.

| Status               | Significado e próximo passo                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| Rascunho             | Proposta interna; revise e publique.                                         |
| Enviado              | Aguarda decisão pelo link vigente.                                           |
| Alteração solicitada | Consulte a observação no histórico, prepare nova revisão e envie outro link. |
| Aprovado             | Decisão registrada e OS criada. Combine execução/pagamento diretamente.      |
| Expirado             | Prazo vencido; revise e publique nova revisão para renovar.                  |
| Cancelado            | Proposta encerrada; crie outro orçamento se for retomar.                     |

Propostas aprovadas não são sobrescritas; prepare outra proposta para novo escopo. Revogar link bloqueia o acesso público, preservando decisão e histórico. Cancelar uma proposta ainda não aceita também bloqueia seus links.

O aceite é um registro operacional; não realiza pagamento, não agenda visita e não é assinatura digital certificada.

## Ordens de serviço

O aceite gera uma OS pendente, vinculada à revisão exata aprovada. Comandos repetidos ou aceites concorrentes não devem criar uma segunda OS para o mesmo orçamento.

- **Iniciar serviço:** pendente → em andamento.
- **Concluir:** em andamento → concluído.
- **Cancelar OS:** permitido enquanto pendente ou em andamento, com motivo.

A Agenda trata de visitas; o status da OS deve ser atualizado nesta aba. Cancelar uma OS não apaga o orçamento ou a aprovação.

## Agenda

Escolha cliente, técnico, início e duração de 15 a 480 minutos. Equipamento e OS são opcionais, mas devem pertencer ao mesmo cliente; a OS precisa estar disponível para agendamento.

O formulário usa o fuso do dispositivo. A lista apresenta horário de São Paulo. Confira o fuso antes de salvar se estiver operando de outra região.

Uma visita agendada não pode se sobrepor a outra do mesmo técnico. A comparação usa o nome normalizado; mantenha o mesmo identificador para uma pessoa e diferencie pessoas de nomes iguais. A versão atual não possui cadastro completo de equipe.

Concluir ou cancelar a visita não altera o status da OS. Para mudar um horário, cancele a visita planejada e agende outra. Não há recorrência, lembrete, roteirização ou integração com calendário externo.

## Caixa de entrada

O quadro de treinamentos mostra Não iniciado, Ver depois ou Concluído para cada aba. As notificações de conclusão pertencem à conta autenticada e persistem entre sessões/navegadores.

Marcar como lida reduz o contador de não lidas; não remove a conclusão. Refazer guia reabre o treinamento da aba correspondente, sem duplicar a notificação existente. A caixa é interna ao aplicativo, sem envio de e-mail ou push externo.

## Configurações e documentos

Nome e cor alterados valem para as próximas publicações. Revisões já publicadas mantêm sua marca original; o selo demo permanece nesta instalação.

Histórico / PDF permite consultar versões e decisões. O cliente pode baixar o PDF enquanto seu link for válido; o operador usa o histórico autenticado. Exportar CSV baixa a lista de orçamentos. Esse arquivo não substitui o backup completo do banco.

Backup, restore e recuperação de acesso são tarefas administrativas descritas no [README](../README.md#operação-e-manutenção).

## Quando algo não funciona

- Se o link estiver indisponível, confira validade, revisão e revogação com o operador.
- Se uma ação falhar, leia a mensagem e confirme se houve persistência antes de tentar outro caminho. O portal mantém a chave de retry durante a mesma interação.
- Ao retornar ao painel ou trocar de aba, orçamentos e OS são atualizados para refletir decisões do portal.
- Se houver bloqueio por muitas tentativas de login, aguarde o intervalo informado.
- Se uma gravação de treinamento falhar, o app não deve informar conclusão; tente novamente ou feche sem registrar.

Nenhum botão de operação autoriza publicação do sistema, alterações de política ou execução autônoma de agentes.
