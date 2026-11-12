# Comparação humana anterior × atual

Preparado em 2026-11-12. Não há resultados humanos coletados.

Versão A: 225cdcc, anterior ao design, preserva piloto de ajuda. Worktree elos-pme-comparison-before, porta proposta 3020, banco elos_compare_before.
Versão B: 21a3a3d, snapshot da evolução e helper de readiness. Worktree elos-pme-comparison-after, porta proposta 3021, banco elos_compare_after.
Ambos usam PostgreSQL próprio em 55441 e dependências instaladas separadamente com npm ci, sem symlink. Sem acesso aos bancos 55439/55440. Dados fictícios; sem enviar links para terceiros.

## Condições

Mesmos dispositivo, viewport e navegador; 1280×900 e 360×900. Começar autenticado, com seed equivalente, sem progresso prévio. Ajuda opcional durante tarefa; registrar uso e intervenção. Não medir velocidade de login como ganho do design. Vídeo B identifica interface anterior: registrar essa limitação e avaliar texto atual separadamente. Não alegar efeito causal do design sobre aprendizado.

Para uma pessoa: tratar como estudo de caso, alternar A→B em metade das tarefas e B→A na outra metade. Repetir no celular com ordem invertida, registrando aprendizagem. Não somar tarefas dependentes como amostras independentes. Para outros participantes, usar novos bancos/contas sintéticos; não apagar resultados anteriores para simular primeira visita.

## Tarefas e resultados esperados

1. Clientes (A→B): cadastrar “Cliente Comparação A/B”, contato teste@example.invalid e observação “Atender à tarde”; salvar, localizar e alterar observação para “Atender pela manhã”. Conferir o mesmo registro após recarregar. Resultado: um cadastro, ID preservado, observação persistida.
2. Orçamento (B→A): selecionar esse cliente, criar 2 unidades de serviço de R$180, salvar rascunho, localizar e publicar. Resultado: total R$360, revisão publicada e link real. Abrir portal local, aprovar explicitamente como responsável fictício. Não enviar o link a terceiros.
3. OS (A→B): localizar a OS gerada, iniciar e concluir. Resultado: uma OS ligada à revisão aceita, estado final persistido. Quadro de B é opcional; avaliar localização e compreensão, sem exigir usar recurso ausente em A.
4. Equipamento/Agenda (B→A): cadastrar Split Comparação, 12.000 BTU, local Sala; agendar visita futura de 60min com técnico fictício, cliente e aparelho corretos. Resultado: vínculos persistidos; concluir visita não deve mudar OS. Usar horários futuros equivalentes e registrar fuso.
5. Ajuda (A→B): começar novo cadastro sem salvar, consultar passos e voltar. Resultado: campos intactos na mesma aba e capacidade de continuar; não exigir vídeo. Não navegar entre abas e exigir rascunho que não foi prometido.
6. Localização (B→A): encontrar orçamento por número e consultar histórico/PDF. Permitir os caminhos oferecidos por cada versão. Resultado: orçamento/revisão corretos; distinguir localizar o PDF de auditar seu conteúdo.

## Medição

Iniciar tempo após ler a instrução e terminar quando o participante confirmar o resultado. Registrar duração em segundos, conclusão sem intervenção, erros recuperados/não recuperados, uso de ajuda, intervenções do moderador e comentário literal. Separar tempo esperando rede do tempo de interação quando observável. Não instruir onde clicar; se necessário, registrar a intervenção.

Resultado válido depende de persistência, não apenas toast. Após cada cenário, conferir estado com reload e registros. Incidente de ambiente invalida a medida daquela tentativa; preservar observação e repetir com justificativa.

Redução de tempo = (A − B) / A × 100. Calcular somente para pares completos sob condições equivalentes. Se uma versão falhar, registrar falha; não imputar tempo fictício. Não resumir tudo em nota arbitrária de qualidade. Reportar por tarefa e dispositivo antes de qualquer agregado; explicitar amostra e efeito de ordem.

Critério para decisão humana: nenhuma regressão de integridade ou tarefa essencial; ausência de overflow; resultados persistidos; ajuda recuperável; clareza dos próximos passos. Tempo menor é desejável, mas não compensa erro de negócio.

Próximo passo: operador executar a sessão moderada e preencher resultados.csv; nenhuma aprovação G1 foi inferida.
