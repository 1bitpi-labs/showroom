# Evidências — piloto Clientes TatuDoBem

2026-11-12. READY FOR REVIEW. Aprovação de execução recebida na conversa após revisão Astra e consolidação da jornada. Não constitui homologação G1 ou aceite da mídia final.

## Entrega

Vídeo local H.264 1280×900, 30 fps, 98,27 segundos, sem áudio; legendas PT-BR, descrição textual, poster, quatro capítulos e manifesto com hashes em public/training/clientes/v1. Captura contínua da interface real pelo preview T3, autenticada antes de gravar, sem desktop/segredos. Brisa Oficina fictícia; cliente TatuDoBem — TREINO VIDEO. Cadastro, salvar, buscar, editar e conferir a observação persistida; uma única linha do cliente confirmada pela API. Banco de captura separado do operador.

O diálogo de Clientes oferece vídeo ou passos, saída desde início, capítulos sem autoplay, fim parado e conclusão textual explícita. Alternar modos preserva posição nesta abertura; fechar reinicia. Catálogo existente identifica formatos; nenhuma oferta fictícia nas outras abas. Progresso de conta/versão 1 e API/schema mantidos. Resposta tardia não fecha nova abertura. Formulário é preservado na mesma aba; navegação entre abas não persiste rascunho.

## Validação executada

- `npm run build -- --webpack`: passou. Webpack usado porque Turbopack não resolve node_modules compartilhado por symlink entre worktrees. Não houve alteração de lockfile/config para contornar isso.
- `npm run typecheck`: passou, incluindo o smoke novo.
- 22 testes existentes de domínio/PostgreSQL passaram em banco elos_pilot_test do container isolado, com DATABASE_URL em loopback 55440. Não usado test-local.sh, pois fixa porta/banco do checkout do operador.
- `npm run test:tsf`: 13 testes passaram; não equivale a execução autônoma.
- `node --env-file=.env.local --import tsx scripts/clientes-video-smoke.ts`: passou em 360 e 1280. Contas sintéticas independentes; primeira visita, saída, vídeo parado, capítulo sem autoplay, foco com Tab, Escape, sem overflow, preservação de campos, conclusão, replay, POST falho e atrasado, resposta antiga versus nova abertura, persistência após recarga. Resultado e capturas locais em .tsf/state/artifacts/clientes-video/.
- Preview T3 adicional: carregamento de MP4/VTT e track habilitada, duração real, fim real via playback dos últimos frames sem conclusão automática, catálogo abrindo vídeo correto, falha de mídia com texto/saída disponíveis. Simulações em sessão de teste, sem patch de API.
- `ffmpeg -v error -i public/training/clientes/v1/clientes.mp4 -f null -`: decodificação integral sem erro. ffprobe validou duração e codecs; quadros inspecionados, captura acompanhada durante execução. Não houve revisão humana integral da mídia nem auditoria WCAG/leitor de tela.
- `git diff --check`: passou.

Limitações da ferramenta: preview_resize não aplicou 360/preset; innerWidth permaneceu 1280 em duas tentativas. Validação mobile concluída com Playwright local já instalado. Uma asserção exploratória de passos foi executada antes do render e refeita após render; o smoke final aguarda estado visível. Primeiro smoke tinha seletor dialog ambíguo e foi corrigido para dialog.training-dialog, sem mudança funcional motivada por esses erros do teste.

## Ambiente e operação para revisão

Branch codex/clientes-video-tatudobem, base dd7a3c5; checkout /home/caueantonacci/1bitpi-labs/elos-pme-clientes-video. Servidor local de revisão em http://localhost:3018, banco separado elos-clientes-video-db na porta 55440. .env.local privado criado para este ambiente; credencial não documentada nem commitada. node_modules é symlink local reutilizando dependências instaladas, não parte da entrega. Para reprodução em outro checkout: instalar dependências pelo lockfile e preparar ambiente isolado conforme runbook existente, usando os endereços corretos deste piloto.

O banco do operador em 55439 e README não commitado em elos-pme-portal-codex não foram alterados. Os dados/contas deste ambiente de revisão são somente sintéticos. Nenhum push, deploy, modelo pago, cron, upload, wiki ou agente adicional. Manter instância de revisão local até avaliação do operador; não substituir a instalação 3017 por inferência.

## Próximo passo e aceite

Operador assistir ao piloto e testar Clientes na instância isolada. Avaliar clareza, legibilidade no celular/tela cheia e consulta pontual antes de replicar. Material desktop reduzido no celular pode exigir tela cheia; texto acessível permanece alternativa. Nomeação do mantenedor de mídia e revisão integral humana pendentes. Não anunciar treinamento assistido, competência ou homologação por passar checks.

## Revisão de ritmo v2 — 2026-11-12

Operador solicitou melhorar a fluidez por excesso de tempo para poucas ações. Revisão visual temporal da captura identificou longas esperas entre preenchimento, salvamento, busca e edição. Nova mídia em public/training/clientes/v2: 45,5 segundos, cortes de esperas, preservando ordem das ações e resultados reais, sem acelerar cliques ou substituir respostas do aplicativo. Original v1 mantido. Nove segmentos de origem documentados no manifesto, com hash da fonte.

Atualizados vídeo, poster, VTT com frases curtas, descrição textual, duração e quatro capítulos. Cadastrar 0s; Salvar 16,6s; Buscar 23,3s; Editar 27,5s. Player/catálogo agora referenciam v2; nenhuma mudança de progresso, API ou banco. A redução é do fluxo completo demonstrado, não expansão às outras abas.

Validação: inspeção visual sequencial por quadros a cada 2s, reprodução local no navegador, decodificação integral ffmpeg, hashes/manifesto e build/TypeScript passaram. Smoke 360/1280 reexecutado para a mídia nova; ver resultado local. Teste de capítulo passou a usar timestamp do conteúdo para tolerar revisão editorial. Testes de domínio/TSF anteriores não foram repetidos porque não houve alteração dessas camadas. A edição continua sem áudio; legendas e descrição estão no treinamento. Avaliação humana de fluidez da v2 pendente.
