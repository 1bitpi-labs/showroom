# Desenvolvimento e design — processo corrente

O objetivo é entregar produto funcional e uma composição visual julgável, com evidências claras e continuidade. É um processo supervisionado, não execução autônoma do TSF. Escopo atual do usuário prevalece; esta página não cria gates, agentes ou autorização de publicação.

## Ciclo de trabalho

1. Definir o tipo de entrega: diagnóstico, correção de usabilidade, composição/redesign, implementação ou avaliação. Traduzir intenção visual em critérios observáveis, sem chamar higiene funcional de redesign completo.
2. Confirmar o aplicativo executável e a autoridade das fontes. Ler contrato local, stack, tokens, jornadas e estado; manter protótipo e apresentação separados do produto real.
3. Preparar execução isolada quando autorizada. Readiness de banco antes de migrar/subir app; origem/porta consistentes. Primeira conexão recusada não encerra a investigação se for possível preparar ambiente próprio.
4. Compor uma fatia representativa desktop/mobile cedo: consulta, edição e superfície externa relevante. Definir marca, tipo, densidade, grids, tokens, estados e comportamento por dispositivo. Revisar visualmente antes de propagar, sem transformar isso em confirmação genérica obrigatória.
5. Selecionar catálogo por função, licença e custo de adaptação. Primitiva A não é fluxo pronto; shader S não resolve tabela/agenda. Se a cobertura não servir, criar composição original com proveniência explícita.
6. Implementar preservando APIs/invariantes, foco e estados. Validar uma mudança real por vez; esperar resultado assíncrono antes de capturar ou afirmar persistência. Evitar acumular overrides e caminhos de ação não centralizados.
7. Verificar o que mudou: tipos/build/domínio quando aplicável, interações dos fluxos e amostras responsivas. Registrar viewport, estado, fonte da evidência e limites. Fonte minúscula, estado vazio ou tema alternativo não são aprovados por uma captura bonita.
8. Fechar a entrega com demonstração visual e docs atuais: entrada, execução, manual, direção, avaliação/backlog, evidências e inventário. Salvar no Git quando solicitado; não confundir commit local com push/deploy.

## Critérios de avaliação

Avaliar composição, leitura/densidade, navegação, mobile, formulários, estados, acessibilidade, negócio e manutenção como evidenciado/parcial/pendente. Cada conclusão deve apontar código, interação, imagem, teste ou feedback humano. Evitar notas numéricas de excelência ou ROI sem método. O parecer pode ser “composição aprovada visualmente e manutenção/acessibilidade ainda parciais”.

## Ferramentas e aprendizado aplicado

- Skill zod-ui-architect: catálogo/blueprint e direção/avaliação em referência de leitura progressiva. Foi melhorada por esta rodada; não foi instalado um novo framework de UI.
- `review_board.py` na skill: verifica o formato de cenas do Brisa e deduplica CSS com igualdade dos documentos reconstituídos. Sete testes de comportamento; não é sanitizador de HTML arbitrário.
- `scripts/project-docs.py`: inventário público e links relativos, com quatro testes de exclusão de arquivos privados/gerados, detecção de alteração e resolução de links.
- Preview do ambiente: inspeção real do aplicativo. Apresentação estática: revisão visual sem sessão/API. Uma não substitui a outra; capturas podem perder nitidez e devem ser complementadas sem alegações de interação inexistente.

A [retrospectiva](EVALUATION-AND-RETROSPECTIVE.md) registra por que essas mudanças foram adotadas neste projeto. Melhorias gerais só vão à skill pertinente quando mudam uma decisão; não converter cada dificuldade local em regra universal.
