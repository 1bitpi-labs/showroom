# Composição e avaliação de uma entrega visual

Use em redesigns, pedidos de acabamento visual ou retrospectivas. A experiência Brisa motivou estes critérios; paleta, arquitetura e ferramentas não são universais.

## Antes da composição

Distinguir escopo: diagnóstico, correção funcional, composição visual, implementação ou revisão de entrega. Redesign precisa de direção e composição; resolver perda de formulário e foco não encerra um pedido visual. Quando a ambição for “premium/SOTA”, traduzir em decisões observáveis: legibilidade, densidade, hierarquia, marca, acabamento e interação por dispositivo. Não prometer aceitação comercial nem usar efeitos como substituto de qualidade.

Produzir cedo uma fatia representativa desktop/mobile com dados plausíveis explicitamente sintéticos: consulta principal, edição e estado público quando existir. Inspecionar a renderização dessa fatia antes de expandir; essa revisão não cria um pedido extra de aprovação. Conservar diferenças de produto: protótipo, app executável e apresentação estática não são equivalentes.

## Evidência e execução

Primeira falha de conexão é um achado de ambiente. Quando autorizado, verificar dependências, runtime, portas e banco próprios e tentar preparar a execução antes de concluir que a inspeção é inviável. Não reutilizar processos/dados alheios. Aguardar readiness de infraestrutura e estado explícito de UI após mutações; não confundir captura transitória com persistência. Em Next, dev e build nunca compartilham a saída simultaneamente.

Separar evidências: código/documentação, inspeção visual, interação, confirmação da API, testes automatizados e avaliação humana. Informar lacunas sem convertê-las em falhas comprovadas ou certificações. Tier de catálogo e comparação de pixels não avaliam o fluxo final. Requisitos de toque, foco e contraste precisam de verificação no tema/estado do projeto, inclusive rótulos minúsculos e barras fixas.

Se captura tiver baixa nitidez, apresentação de HTML/CSS extraído pode complementar a evidência. Ela permanece estática e inerte: não prova as interações do produto. Remover sessão, tokens, URLs ativas e preenchimentos sensíveis; validar antes de compartilhar. Seguir as regras de browser e de apresentação do ambiente. O helper `scripts/review_board.py` verifica o formato de cenas JSON usado no Brisa e pode deduplicar CSS; não é sanitizador universal de HTML não confiável.

## Avaliação sem nota inventada

Descrever cada dimensão como evidenciado, parcial ou pendente, acompanhada de fonte e próxima ação. Avaliar composição, navegação, densidade, mobile, estados, formulários, acessibilidade, integridade de negócio, manutenção e documentação. Diferenciar “usuário gostou do desenho” de homologação funcional, certificação ou aceite de terceiros. Não atribuir nota SOTA/100 ou ROI sem método/dados.

Retrospectiva: problema observado → decisão que o causou → melhoria aplicada à ferramenta/processo → evidência da melhoria → lacuna restante. Não promover preferência de um caso a regra global. Atualizar apenas a skill/ferramenta pertinente e já autorizada; não criar uma cadeia obrigatória de novas skills, agentes ou gates.

Antes de encerrar, preparar continuidade: documentação corrente distinta do histórico, inventário verificável, testes e limites com origem, artefato visual reabrível, mudanças salvas no Git quando solicitado. Commit local e envio remoto são ações diferentes.
