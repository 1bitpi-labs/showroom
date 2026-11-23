# Piloto Clientes — proposta para revisão

2026-11-12. Estado inicial: ESPECIFICADO; execução posteriormente autorizada pelo operador e registrada em [execucao-piloto.md](execucao-piloto.md). Aceite do resultado não inferido. Branch de planejamento: t3/piloto-video-clientes. Escopo único: vídeo cadastrar → salvar → buscar → editar na interface real da demo fictícia Brisa Oficina. Não estender às outras sete abas antes da avaliação deste piloto.

## Evidência e limites

Fontes lidas no produto `<workspace>/elos-pme-portal-codex`: AGENTS.md, README.md (alterado pelo operador), STATUS.md, docs/spec.md, docs/changes/guided-training-operations.md, componentes training.tsx e operations-panel.tsx e conteúdo/domínio training*. O README alheio foi preservado. START-HERE do Agent OS contém contexto histórico do programa; não substitui a solicitação atual.

Pesquisa local: `.tsf/state/artifacts/human-test-2026-11-12/relatorio-teste-humano.md`, `transcricao.md` e `transcricao.srt`, todos lidos. R1, 02:21–03:28: demonstração de preenchimento/salvar/buscar/editar; R2, 03:28–04:42: vídeo na primeira visita e etapas; R3, 04:42–05:16: refazer pelo catálogo. ASR Whisper small sem revisão humana de áudio: interpretação contextual, não citação ratificada. Vídeo fonte preservado em `<workspace>/.t3/userdata/attachments/<arquivo-fonte>.mp4`. Não reproduzido nem recortado nesta tarefa.

FATO: catálogo textual já existe na Caixa de entrada; não há bug funcional comprovado. Guias usam progresso por conta/versão, conclusão explícita e aviso idempotente. INFERÊNCIA: um exemplo prático pode facilitar a compreensão. PROPOSTA: ampliar o mesmo guia e catálogo, sem outro centro de treinamento. Nenhum teste funcional foi executado nesta especificação.

## Jornada consolidada após revisão Astra

Proposta revisável: na primeira visita elegível, o mesmo diálogo oferece “Ver exemplo · duração real”, “Consultar passos” e saída “Voltar a Clientes”. Saída disponível desde o início e em todos os modos. Sem autoplay; selecionar capítulo pausa e posiciona, sem iniciar reprodução. Quatro capítulos no mesmo vídeo: Cadastrar, Salvar, Buscar, Editar.

Ao terminar, quadro final parado: “Voltar a Clientes” como continuação principal, “Consultar passos” como alternativa e replay nos controles do player. Não fechar, avançar ou concluir automaticamente. Vídeo e texto são formas alternativas de consulta; nenhum deles é requisito para operar.

Texto em três passos: (1) cadastrar e confirmar salvamento; (2) buscar e reconhecer registro; (3) editar, salvar e conferir. Reutilização em orçamento permanece nota final. Concluir treinamento no último passo continua declaração explícita de leitura, sem certificar prática. Vídeo sozinho não conclui nem cria aviso.

Saída/Escape pausa e solicita skipped; fecha após confirmação, sem apagar completed anterior. Em falha ou pendência prolongada, permitir saída local sem alegar registro; manter retry aplicável. Resposta tardia não pode fechar nova abertura. Após saída local, não reabrir nesta montagem; após skipped persistido, não reabrir automaticamente na mesma versão. Não há lembrete agendado.

Alternar vídeo/texto conserva tempo e passo somente nesta abertura; fechar descarta ambos. Reabrir começa do início, com capítulos para consulta rápida. Ajuda na mesma aba preserva formulário/ID de edição e devolve foco ao campo anterior; na primeira visita pode focar Nome do cliente. Navegar ao catálogo pode desmontar o formulário: não prometer persistência entre abas e não orientar abandonar campos em andamento. Proteção de rascunho entre abas fica fora do piloto.

## Contrato de integração proposto

- Reutilizar o ID `clients` de Clientes presente em tours, o TrainingDialog e a linha existente da Caixa de entrada. Chave confirmada no código; não criar treinamento paralelo.
- Acrescentar metadado opcional de mídia ao conteúdo: id `clientes-fluxo-v1`, título, duração real medida, src local, poster local, track PT-BR WebVTT e transcrição textual. Paths finais propostos: `public/training/clientes/v1/`. Só anunciar vídeo após arquivos verificados; outras abas continuam identificadas como guia textual.
- Não incrementar TOUR_VERSION global pela simples inclusão de mídia: preservar conclusões e não reabrir as oito abas. Usuários já concluídos descobrem vídeo na entrada existente, com reprodução manual. Catálogo: “Clientes · Guia textual e vídeo”, ação Assistir vídeo e Refazer guia. Antes de mídia pronta, manter apenas guia textual.
- Reutilizar GET/POST de /api/training para skipped/completed, com identidade da sessão, versão e último passo válido, sem alterar contrato para declarar assistência. Conclusão continua somente no último passo. A reorganização dos três passos é revisão editorial, com revisão própria no manifesto, sem reinterpretar conclusões antigas como leitura do texto novo. API valida índice final, não comprova leitura de todos os passos. Replays não apagam completed nem produzem outro aviso; leitura de aviso é independente.
- Saída, retomada e falhas seguem a jornada consolidada acima. Fechar não altera dados de negócio. Falha de mídia mantém texto e saída utilizáveis; falha de persistência nunca exibe sucesso falso.
- Cabeçalho proposto “Ajuda nesta aba” abre a escolha de modos. Catálogo mantém treinamentos e avisos em seções identificadas; não duplicar Consultar passos e Refazer guia com o mesmo destino. Ajustar somente referências necessárias na FAQ.
- HTML video com controls, playsinline, preload metadata, sem autoplay; legenda PT-BR habilitada, transcrição acessível e descrição das ações visuais no texto. Reproduzir, pausar, volume e fechar via teclado/toque; Escape pausa, foco contido e devolvido ao disparador. Sem dois diálogos sobrepostos. Em 360px, player e controles sem overflow; opção tela cheia sem bloquear saída. Erro/arquivo ausente mantém etapas textuais utilizáveis e informa indisponibilidade.

## Aceites e testes previstos

V01: mídia mostra as quatro ações e resultados reais com dados sintéticos; busca e edição terminam no mesmo registro, sem cadastro duplicado. Reviewer confronta UI/roteiro e resultado após recarga no ambiente de captura autorizado.
V02: primeira visita elegível abre um único diálogo; nenhuma reprodução automática. Conta concluída não reabre por inclusão do vídeo; demais abas inalteradas.
V03: ended não fecha, avança ou conclui; saída direta disponível desde entrada/vídeo/texto, capítulos pausam sem autoplay, alternância conserva posição apenas nesta abertura; etapas funcionam sem mídia. Último passo + clique explícito é o único caminho de conclusão da UI.
V04: saída/Escape pausa, preserva completed anterior e não cria aviso; campos/ID de edição preservados na mesma aba, com foco de retorno. Erro/pendência permitem saída local e resposta tardia não fecha nova ajuda. Não há garantia de rascunho entre abas. Reabrir segue política de reinício declarada. Falha de persistência permite retry.
V05: refazer por catálogo/cabeçalho mostra Clientes correto; duas conclusões concorrentes e replay mantêm um único aviso por usuário/guia/versão. Conta B não vê estado/aviso de A.
V06: teclado e toque em 360/1280, foco, legenda sincronizada, transcrição, pausa/fechamento e mídia indisponível aprovados. Nenhum segredo/dado real/desktop privado na mídia.
V07: manifest local registra commit do produto, versão, duração, codecs, hashes dos arquivos, comandos/saídas, revisão editorial, capítulos reais, dono de manutenção, compatibilidade com a UI e limitações; nenhum upload, push ou alteração de política.

## Gate e próximo passo

Não há dúvida que impeça a proposta. Operador revisar roteiro e jornada consolidada acima; aprovação vinculada a este diff libera somente o escopo que declarar. Captura, implementação e manutenção de testes são tarefas futuras separadas; nenhuma iniciada. G1 do produto não é concedido por aprovar este roteiro.

## Revisão independente e replicação

A análise independente da versão anterior (revisão Astra) é documento interno e não faz parte desta cópia. Esta consolidação incorpora os achados; não constitui segunda revisão pelo Astra. O documento interno de evolução da experiência, que delimita piloto e futuro, também não faz parte desta cópia. Mídia incompatível deve deixar de ser oferecida, mantendo texto correto; novos derivados usam versão própria, sem sobrescrever silenciosamente o conjunto anterior. Replicar somente após evidência humana/técnica do piloto, com objetivos próprios de cada aba.

## Execução posterior autorizada

A aprovação do operador e o piloto local efetivamente entregue estão em [execucao-piloto.md](execucao-piloto.md). As seções de proposta acima preservam o contrato revisado; pendências de captura/implementação ali descritas referem-se à fase anterior à aprovação.
