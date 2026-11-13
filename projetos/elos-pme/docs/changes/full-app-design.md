# Evolução Brisa — aplicativo completo

2026-11-12. Operador autorizou implementar o app completo usando o HTML anexado como referência. Worktree exclusiva elos-pme-clientes-design; branch codex/clientes-design; base 225cdcc com piloto de ajuda. Sem alterações nos checkouts original/piloto.

## Resultado

Shell claro com navegação lateral, indicadores de não lidas reais, ícones decorativos e cabeçalho de workspace. Celular usa menu modal com fechamento/Escape e retorno de foco. Busca de abas e orçamentos por botão/Ctrl+K, com resultado vazio e seleção pelo ID exato. Tipografia de sistema, bordas, espaços, superfícies e ações comuns às oito abas; sem dependências ou CDNs novas.

Clientes prioriza carteira em cards e busca. Adicionar cliente abre modal; editar reutiliza o mesmo formulário/ID; foco no nome e retorno ao acionador. Ajuda disponível dentro do cadastro mantém campos intactos. Orçamentos têm filtros reais por estado, busca, contagens derivadas, edição de rascunho/publicação/revisão existentes e histórico/PDF em drawer. Resumo inicial recolhível reduz o deslocamento até a operação; guia completo continua disponível.

OS oferece lista e quadro agrupado por quatro estados, com as mesmas transições autenticadas; cancelamento conserva motivo/histórico. Equipamentos e Agenda recebem o padrão visual comum e destaque de informação técnica/horários, conservando cadastro/edição, vínculos e conflitos. Caixa mantém catálogo/progresso por conta e acrescenta barra calculada a partir das leituras concluídas, sem certificação. Configurações mostra prévia de identidade e persiste nas APIs existentes, sem reescrever snapshots. Guia/ajuda seguem consultáveis.

Não inclui PMOC, fotos/checklist técnico, faturamento, certificados ou sincronização externa. Não replica os dados fixos nem as promessas simuladas do HTML. A proposta de orçamento conserva o formulário completo em fluxo da página; não foi reduzida aos poucos campos do modal da referência. Equipamentos/Agenda conservam formulários em fluxo. Design adaptado à lógica real, sem alegar reprodução pixel a pixel.

## Ajuda e mídia

Passos textuais de Clientes passam a orientar Adicionar cliente. Versão de progresso não foi resetada; leitura continua distinta de prática. Vídeo histórico está explicitamente identificado como interface anterior, com orientação para iniciar por Adicionar cliente nesta versão; não foi regravado ou homologado para a nova composição. Regravação é etapa posterior.

## Validação

Ambiente sintético próprio: app 3019; PostgreSQL 55441 no container elos-clientes-design-db. Banco elos_design para QA; elos_design_tests separado para os 22 testes de domínio, todos aprovados. Credenciais criadas localmente, nenhum ambiente ou banco de outra worktree copiado/utilizado.

scripts/clientes-design-smoke.ts: cadastro → busca → edição → conferência após reload em 360/1280; ajuda com campos preenchidos, Tab/Escape e foco, busca vazia, sem overflow/pageerror. Passou após adaptação ao modal/menu.

scripts/full-design-smoke.ts: oito abas em 360/768/1280 sem overflow; filtros, histórico e link PDF, OS lista/quadro e transições persistidas, busca global e prévia/gravação de marca. Dados sintéticos preparados por API; não equivale a nova homologação integral de cadastro de equipamento/visita pelo navegador. Evidências em docs/evidence/full-design (capturas e resultado.json). Revisão visual local das capturas desktop/mobile efetuada.

Foi corrigido um achado real: resultado da paleta filtrava pelo número parcial e podia exibir vários orçamentos. Seleção agora restringe pelo ID, liberado ao editar busca, trocar filtro ou navegar. Ajustes de seletores e sincronização das fixtures foram necessários no script. Uma execução sobreposta falhou durante transição de OS; rodada subsequente completa passou. Evitar execuções simultâneas no mesmo runtime de QA.

TypeScript, build Webpack e diff --check verificados; checagem final após ajustes registrada na entrega. Limites: sem auditoria WCAG completa, aceite humano/G1, integração às instâncias existentes, push/merge/deploy ou novas migrações de produto. Os diffs de AGENTS/next-env são gerados pelo Next dev, separados da intenção visual.

## Revisão humana

Comparar composição com a referência, principalmente Clientes em cards/modal, clareza dos filtros/quadro e navegação no celular. Próximo passo único: operador revisar a evolução local antes de integrar ou ampliar funcionalidades de domínio.

Nota de execução final: o encerramento do container foi antecipado durante a geração do build, causando log de conexão interrompida apesar da saída 0. O banco próprio foi reiniciado e o build repetido antes do encerramento definitivo, para separar esse erro de infraestrutura da validação do código.

Resultado final do build repetido: compilação, TypeScript e geração de rotas concluíram, saída 0; Better Auth ainda registrou “Could not validate the database schema” nos workers de build. Portanto o build não é reportado como livre de avisos. Login e jornadas autenticadas foram comprovados no runtime de QA pelos smokes, mas a origem desse aviso de build permanece uma limitação a investigar antes de release. Container e app de QA encerrados ao final.
