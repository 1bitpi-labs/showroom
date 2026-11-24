# Validação do app e avaliação do fluxo de desenvolvimento

2026-11-12. Avaliação retrospectiva baseada em Git, registros de execução, scripts e JSONs locais. Não é nova execução de testes nem homologação humana. Produto avaliado: ElosPME/Brisa Oficina, aplicação local sintética por instalação.

## Parecer

O trabalho evoluiu de um portal de orçamento/aceite/OS para uma operação com oito áreas, ajuda por conta e uma apresentação comum orientada pelo HTML. Há evidência de persistência e das principais regras de negócio. A versão atual é candidata à revisão humana local; não há evidência suficiente para declarar release homologada, ganho de produtividade ou aderência visual integral à referência.

## Rodadas e ganhos observáveis

| Rodada | Identificação | Entrega e efeito observável | Validação e limite |
|---|---|---|---|
| Núcleo operacional | 745423c | Autenticação; orçamento/rascunho/publicação, revisão e aceite; OS; PDF/CSV; marca | Registro histórico: 15 testes domínio, 11 harness, 17 checks HTTP; jornada 360/1280. Sem auditoria completa ou G1 inferido |
| Usabilidade | d1e0720 | Guia interno, ajuda de campo, primeiros passos ocultáveis e mensagens de recuperação | Registro histórico: 58 asserções Chromium 360/1280. Mais verificações não mede entendimento do usuário |
| Operação e treinamento | 3b5c62d | Clientes, equipamentos, agenda manual; oito guias; progresso e notificações por conta | 22 testes domínio e 13 harness registrados; conflitos, vínculos, concorrência e idempotência. Catálogo já existe nesta rodada |
| Piloto de demonstração | 76d306b | Uma tarefa real de Clientes em vídeo, capítulos, legendas, texto e volta à operação | Evidência histórica: domínio/harness e smoke 360/1280. Campos preservados na mesma aba; sem certificação prática |
| Ajuste de ritmo | 225cdcc | Vídeo reduzido após feedback humano, de 98,27s para 45,5s | Redução objetiva de mídia; aceite do ritmo v2 e efeito de aprendizado não demonstrados |
| Exploração de Clientes | diff local sobre 225cdcc | Primeiro refinamento de superfícies/cadastro e carteira; considerado conservador diante da referência | Smoke 360/1280 passou. Não foi um experimento A/B e não há baseline de tarefa cronometrada |
| Evolução global | diff local, codex/clientes-design | Menu móvel, busca global, filtros, Clientes em cards/modal, quadro OS, drawer, prévia de marca e progresso calculado | 22 testes domínio e smoke atual em três larguras. Testes Clientes e oito abas passaram; build conclui com mensagens de validação de schema do Better Auth |

Documentação dd7a3c5/38dbcbc organiza acesso e operação; não é contabilizada como ganho funcional independente.

## Quantificação sem extrapolação

- Testes de domínio: 15 → 22, acréscimo de 7 (+46,7%). Mede quantidade de cenários automatizados, não percentual de qualidade ou cobertura do código. A evolução visual conservou 22; não criou sete testes novos nessa rodada.
- Harness: 11 → 13 no histórico (+2; +18,2%). Não foi reexecutado na última rodada visual; não somar como sucesso atual.
- Vídeo: 98,27s → 45,5s, redução de 52,77s (53,7%). Hipótese: menos espera pode favorecer consulta. Não prova redução do tempo real de cadastrar/editar ou aumento de aprendizado.
- Validação visual/estrutural atual: 8 áreas × 3 larguras (360/768/1280) = 24 combinações observadas, sem overflow horizontal no JSON. Não equivale a 24 jornadas completas: Equipamentos/Agenda têm cenários vazios e seu CRUD não foi refeito integralmente pelo navegador na última rodada.
- Clientes atual: 10 categorias de verificação registradas × 2 larguras = 20 ocorrências de checks. Algumas são propriedades da mesma jornada; não são 20 usuários, testes independentes nem taxa de sucesso humana.
- A rodada global cobre as oito áreas existentes; 8/8 com estilo comum não significa crescimento de 100% das funcionalidades ou fidelidade de 100% ao HTML.
- Um defeito introduzido na busca global foi encontrado e corrigido: seleção por número parcial passou a usar ID exato. Não existe contagem completa e comparável de defeitos/rodada, nem taxa de regressão calculável.

Não há dados adequados para custo/rodada, lead time, retrabalho total, frequência de deploy, MTTR, cobertura por linhas, satisfação, tempo de tarefa, abandono ou ROI. Horários de commits e tamanho do diff não substituem essas medidas.

## Avaliação do fluxo utilizado

O processo efetivo foi supervisionado: pedido humano → descoberta/regras/spec → autorização de recorte → implementação em worktree própria → checks determinísticos e navegador → feedback → ajuste → handoff. Referência HTML orientou visual e experiência, enquanto APIs/regras reais continuaram como autoridade de persistência. TSF foi usado historicamente como harness de checks/recibos com provider fake; não houve executor autônomo de modelo nem implementação paga. A rodada visual foi feita diretamente e supervisionada, sem evidência de nova execução TSF. Não atribuir a TSF todo código escrito.

Pontos fortes: isolamento de worktrees e bancos; preservação do README do operador; G0 distinto de G1; dados sintéticos; testes de concorrência/imutabilidade e idempotência; medição do viewport real; feedback de ritmo aplicado; referência estática não usada para inventar receita, sincronização ou certificação.

Fragilidades observadas: a primeira adaptação visual entregou menos fidelidade que o operador esperava; faltou pactuar uma amostra visual representativa antes de expandir. Acúmulo de overrides em globals.css e crescimento do dashboard aumentam risco de manutenção; diff não é métrica de valor. Parte da validação foi feita enquanto build/dev ou outras execuções usavam o mesmo ambiente, gerando falha não reproduzida na rodada final. Houve encerramento prematuro do banco durante build. A repetição concluiu com mensagens Better Auth ainda pendentes, logo não existe build sem ressalvas comprovado ao final. A entrega atual permanece não commitada, com dependências por symlink; isso reduz reprodutibilidade do handoff. Vídeo anterior não acompanha a composição nova, embora esteja identificado.

## Estado por critério

| Critério | Parecer | Evidência / lacuna |
|---|---|---|
| Persistência e integridade | Demonstradas nos cenários executados | 22 testes domínio; Clientes salva/edita e confere após reload; OS persiste transições |
| Responsividade | Parcialmente validada | 24 combinações sem overflow; screenshots; não prova todos os estados e conteúdos longos |
| Acessibilidade | Parcialmente validada | Foco de edição, Tab/Escape da ajuda; sem auditoria completa, contraste sistemático ou leitor de tela |
| Fidelidade à referência | Adaptação implementada, aceite pendente | Mesmos conceitos visuais e padrões; diferenças intencionais nos formulários e tipografia; sem comparação formal de referência renderizada |
| Funcionalidades exibidas | Núcleo real e incrementos validados; paridade integral não demonstrada | PMOC, fotos/checklist, faturamento, certificação e sincronização externa não implementados |
| Qualidade de release | Não validada | Avisos Better Auth, checkout limpo não ensaiado nesta rodada, G1 não inferido; sem release/push/deploy |
| Produtividade do usuário | Não medida | Nenhum teste humano comparável antes/depois das mesmas tarefas |
| Efetividade do processo | Evidência de entrega e correção; eficiência não medida | Rodadas rastreáveis e feedback aplicado; sem esforço/custo/tempo confiáveis por rodada |

## Próxima rodada de avaliação

Primeiro resolver a ressalva de build/autenticação e reproduzir a versão em checkout limpo, preservando bancos alheios. Depois, na mesma sessão de homologação local, comparar versão anterior e atual com tarefas equivalentes e fixtures isoladas: cadastrar/buscar/editar cliente; publicar e localizar orçamento; acompanhar aceite e executar OS; cadastrar equipamento e agendar visita coerente; consultar ajuda e retomar campos. Registrar êxito sem intervenção, tempo, erros e necessidade de ajuda por participante, com ordem alternada quando possível. Apresentar valores individuais e limitações da amostra, sem taxa populacional com uma pessoa.

Fórmulas para uso futuro: redução de tempo = (tempo anterior − atual) / anterior; sucesso sem ajuda = tarefas concluídas sem intervenção / tarefas tentadas. Comparar mesmas tarefas, dados equivalentes e condições de medição. Se algum fluxo ganhar um clique, avaliar localização, recuperação de erro e clareza; menos cliques isoladamente não prova melhor UX.

Próximo passo único: preparar homologação comparável em versão reproduzível, começando pela pendência Better Auth/build.

## Fontes locais

- Produto: git log; docs/IMPLEMENTATION-EVIDENCE.md; STATUS.md; docs/changes/guided-training-operations.md; docs/changes/full-app-design.md; docs/evidence/full-design/resultado.json; docs/evidence/clientes-design/resultado.json; scripts/full-design-smoke.ts e scripts/clientes-design-smoke.ts.
- Planejamento: sdd/changes/elos-pme-clientes-video-pilot/execucao-piloto.md e sdd/changes/elos-pme-design-evolution/entrega-app-completo.md.
- Produto em <workspace>/elos-pme-clientes-design; branch codex/clientes-design. Relatório produzido na branch de planejamento t3/elos-pme-design-evolution, sem modificar o app nesta avaliação.

## Atualização após investigação autorizada

Ressalva de build resolvida no ambiente local ensaiado: builds limpos anterior/atual com PostgreSQL pronto/ativo, dependências próprias via npm ci e login autenticado passaram. Snapshot atual 21a3a3d; comparação preparada com protocolo e CSV humano vazio (em docs/comparison/ do showroom; o registro interno de ambientes não foi copiado). Isso substitui a pendência técnica de build desta avaliação, sem criar resultado de produtividade ou homologação humana.
