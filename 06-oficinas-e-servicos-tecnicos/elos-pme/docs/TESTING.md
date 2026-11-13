# Testing — reprodução e interpretação

## Verificações e alvos

- `npm run typecheck`: tipos do produto, sem emit/incremental na execução.
- `npm run build -- --webpack`: build real; banco configurado pronto e ativo até terminar. Preferir `node --env-file=.env.local --import tsx scripts/verified-build.ts` para preflight e código de saída propagado.
- `python3 -m unittest discover -s .tsf/tests -v`: harness em temporários/fake provider; 13 testes reexecutados na comparação. Não valida cobrança/API paga.
- `npm test`: script histórico aponta Compose/55439; **não executar sem confirmar alvo e ownership**. Para banco próprio: criar base separada, migrar nela e executar `DATABASE_URL=<alvo próprio> node --env-file=.env.local --import tsx --test tests/*.test.ts`. Não colar credenciais em evidências. Última rodada de domínio: 22 cenários passaram em elos_design_tests/55441.
- scripts `clientes-design-smoke.ts` e `full-design-smoke.ts`: 3019 e credenciais sintéticas próprias codificadas; não apontar para instalação real. Inspecionar antes de reproduzir. Scripts históricos usam 3017/3018; não executá-los contra processos alheios.
- `comparison-preflight.ts`: login/consultas iniciais de A3020/B3021; não é comparação humana.

## Comparação de versões

A=225cdcc, B=21a3a3d; builds em dependências próprias via npm ci e bancos próprios. Tarefas equivalentes no navegador, ID/persistência/total/links/PDF conferidos; tempos de automação incluem esperas e não representam tempo humano. Resultados, tentativas inválidas e protocolo são preservados na entrega da comparação. Não preencher CSV humano com execução robótica.

## Limites

Smoke sem overflow cobre estados visitados, não todas as combinações. Equipamento/agenda exigem CRUD real para declarar jornada, não apenas screenshot vazia. Download PDF confirma endpoint/tipo; auditoria visual do conteúdo é outra evidência. Testes aprovados não concedem G1, release ou ganho de produtividade.

Executar rodadas sequenciais; separar .next de dev/build e manter DB ativo. Logs devem remover cookies/tokens e detalhes privados. Uma falha do harness/sincronização invalida aquela medição; preservar resumo e corrigir sem mascarar falha real. Leitor de tela, contraste sistemático, perda de rede após commit e ambiente externo continuam limitados ao que foi explicitamente testado.

## Manutenção documental e apresentações

- `python3 scripts/project-docs.py`: compara caminhos/tamanhos/SHA-256 correntes com docs/app-files.json e verifica destinos relativos de links Markdown.
- `python3 scripts/project-docs.py --write`: regenera o inventário após fechar a documentação.
- `python3 -m unittest discover -s tests -p 'test_project_docs.py' -v`: quatro testes do inventário (exclusão privada, hashes, links e symlinks).
- No showroom, `python3 ../../.claude/skills/zod-ui-architect/scripts/review_board.py check BRISA_VISUAL_COMPOSITION.html`: verifica o formato de cenas da apresentação e rejeita URLs ativas, scripts de cena e preenchimentos sensíveis. Não executa o aplicativo nem é sanitizador universal.

Essas verificações não exigem banco ou servidor. As 22 verificações de domínio da entrega visual continuam evidência daquela rodada; não confundir testes documentais atuais com reexecução de domínio/build.
