# O01 — Treinamento por aba e operação de climatização

Autorizado pelo operador nesta conversa: pop-ups na primeira visita às abas, conclusão visível em caixa de entrada/notificações e ampliação das operações úteis. Base d1e0720, branch codex/quote-portal isolada e limpa.

Pesquisa primária em 2026-11-12: https://www.auvo.com/software-climatizacao-refrigeracao e https://www.auvo.com/auvo-service descrevem clientes, equipamentos e agenda; https://help.produttivo.com.br/pt-BR/articles/11987544-como-executar-manutencao-corretiva-no-app-do-produttivo descreve vincular equipamento ao atendimento. São evidências da oferta do setor, não prova de necessidade de um cliente nosso.

## Escopo e aceites

O01. Guias modais sequenciais nas oito abas (orçamentos, OS, clientes, equipamentos, agenda, caixa de entrada, configurações e guia). Primeiro acesso por usuário/versão inicia automaticamente, com Pular/Ver depois, Voltar e Próximo. Escape equivale a ver depois. Refazer disponível. Modal com foco contido, título, progresso e alvo indicado quando disponível; teclado e toque.
O02. Registro PostgreSQL vinculado à sessão; identidade nunca vem do request. Ver depois não é concluído. Concluir só após percorrer passos da UI; é declaração de leitura do guia, sem certificação de competência. Recarregar/outro navegador preserva estado. Falha de gravação não exibe sucesso e mantém opção de retry. Usuário que já concluiu e pula replay conserva conclusão.
O03. Caixa de entrada persistente por usuário com notificações de conclusão, não duplicadas por replay ou requisições concorrentes. Badge não lidas, marcar lida por ID do próprio usuário e refazer guia pela notificação. Sem e-mail, push externo ou notificação de pagamento.
O04. Clientes: cadastro/edição de nome, contato, endereço e observação; busca e contagem de orçamentos/equipamentos. Escolher cliente existente no orçamento evita duplicação e usa cadastro server-side, preservando snapshots existentes.
O05. Equipamentos: cadastro/edição vinculado a cliente, identificação, marca/modelo, capacidade BTU opcional, série, local e próxima manutenção opcional. Histórico de visitas ligado ao equipamento. Não gerar laudo PMOC ou sugerir periodicidade técnica.
O06. Agenda: visita manual com cliente, equipamento opcional coerente, OS opcional do mesmo cliente, técnico informado por nome, início, duração e observações. Recusa sobreposição de visitas agendadas do mesmo técnico inclusive em concorrência. Concluir/cancelar visita não altera OS nem envia mensagem. Datas persistidas UTC; entrada explicita fuso do dispositivo e lista mostra horário de São Paulo. Não há equipe, recorrência, roteirização ou sincronização externa.
O07. Mutações autenticadas com CSRF, schemas estritos, integridade referencial e histórico básico. Migração aditiva; backup antes de aplicar no banco demo. Testes de isolamento entre usuários, concorrência/idempotência, vínculos incoerentes e jornada 360/1280.

## Execução TSF supervisionada

O-A especificação e manutenção autorizada de migração/tests (arquivos protegidos, tarefa de manutenção separada); O-B backend restrito a src/lib/operations.ts, src/lib/training*.ts, src/app/api/operations e src/app/api/training; O-C componentes/integração UI com allowlist explícita; O-D checks determinísticos, envelope, evidências e revisão humana. Nenhum modelo pago, cron ou promoção de autonomia. Cada execução tem uma responsabilidade; alterações de manutenção são declaradas, não liberam testes/infra ao worker de produto.

Expande o MVP por solicitação explícita do operador; substitui a exclusão de agenda somente para visitas manuais acima. Financeiro, estoque, PMOC, pagamentos, multiempresa e gestão completa de técnicos permanecem fora.

## Feedback de implementação

O navegador encontrou duas integrações corrigidas antes da entrega: rótulos dos selects passaram a ser explícitos (independentes do texto das opções) e Orçamentos/OS agora recarregam ao trocar aba ou retomar foco, exibindo a aprovação feita no portal sem precisar recarregar a página manualmente. Respostas antigas de carga não sobrescrevem uma consulta mais recente.

O teste de re-login encontrou HTTP 429 na sequência de autenticações; o smoke respeita Retry-After com no máximo três tentativas, sem alterar a proteção do aplicativo. Um teste de domínio inicialmente contava toda a tabela de clientes em paralelo com outra suite; foi corrigido para contar somente o cliente da própria fixture, preservando o teste de não duplicação.

## Evidências e limites da entrega

- 22 testes PostgreSQL: quinze existentes e sete novos para progresso por usuário, conclusão concorrente idempotente, notificações privadas, reaproveitamento de cliente, equipamento/coerência e choque de agenda.
- 13 testes do harness TSF e build/TypeScript aprovados. Tarefas O-B, O-C1 a O-C5 passaram pelo runner com allowlists específicas e envelopes; manutenção de schema/testes foi executada separadamente, conforme autorização do incremento.
- Navegador real em 360 e 1280 percorreu oito treinamentos, persistência em contexto novo, notificações/leitura/replay, cliente → equipamento → orçamento → aprovação → OS → visita e histórico. Nenhum pageerror. Screenshots training-popup, training-inbox e operations-agenda em docs/evidence. A caixa de entrada não mostra o link de publicação de orçamento de outra aba.
- pg_dump/restore em banco vazio: hashes iguais para clients, equipment, appointments, training_progress, notifications, quotes e revisions. Artefatos privados em backups/ e .tsf/state/artifacts/operations-restore.json, fora do Git. As contas de treinamento são temporárias; em produção, um guia concluído é declaração de leitura, sem certificação técnica.

Modelo de implantação continua uma empresa por instalação. Nome normalizado do técnico é a chave de conflito, sem gestão de equipe. Nenhum cadastro público de usuários, pagamento, envio de mensagem, recorrência automática ou PMOC foi introduzido. Autonomia paga/24h permanece desabilitada. Aceite humano deste incremento ainda não foi inferido.
