# Alvo de evolução: aplicativo completo da referência

2026-11-12. Orientação do operador: alcançar o nível de desenvolvimento e as funcionalidades mostradas no HTML, além do recorte Clientes. A referência passa a orientar composição e experiência do produto inteiro. Não equivale a autorização para publicar, alterar banco ou implementar regras técnicas/comerciais não definidas.

## Correção de direção

A primeira entrega Clientes foi uma adaptação conservadora: superfícies e duas colunas sobre a estrutura antiga. Ela preserva operação e passou no smoke, mas ainda não reproduz a experiência da referência: carteira como conteúdo principal, ação Adicionar cliente, navegação compacta, tipografia e cabeçalho coordenados. Considerar essa entrega uma base funcional, não o alvo visual atingido.

## Correspondência por área

| Área | Alvo concreto da referência | Fonte/contrato para tornar real |
|---|---|---|
| Estrutura global | Sidebar agrupada, ícones, cabeçalho, menu móvel e identidade tipográfica consistente | Reutilizar sessão e oito abas; menu com foco/Escape/retorno. Sem status de sincronização fictício |
| Orçamentos | Busca, filtros, cards/resumos, ação Novo, modal, painel de detalhes/PDF | Estados reais e contagens calculadas; campos e itens completos; rascunho/publicação/revisão e aceite imutável preservados. Link real, não URL montada por ID |
| OS | Lista e quadro alternáveis, status e próxima ação evidentes | Mesmos registros nas duas visões; transições do servidor, cancelar com motivo e histórico; sem certificar checklist inexistente |
| Clientes | Carteira em cards, identificação visual, contato/local, Adicionar cliente | Busca/edição do produto devem continuar. Formulário em modo explícito com cancelamento e ajuda preservando entrada. Contagens reais; sem “faturado” derivado de aceite |
| Equipamentos | Lista técnica legível com identificação, capacidade, cliente/local e próxima manutenção | Preservar cadastro/edição e histórico de visitas. Gás e status técnico exigem dados e regras novos; data informada não comprova equipamento em dia |
| Agenda | Horário e duração em destaque, cliente e técnico, organização por dia | Datas reais, fuso claro, vínculos e proteção de conflito existentes; preservar agendar/concluir/cancelar. Não copiar data fixa ou alegar roteiro sincronizado |
| Caixa de entrada | Catálogo com estados/progresso e notificações legíveis | Progresso por conta, contagens reais, leitura e replay idempotentes. Remover “certificação técnica/prática” e percentual fixo |
| Configurações | Paletas selecionáveis e prévia de marca | Persistência real; prévia identificada; novas publicações usam marca atual e snapshots antigos permanecem intactos; não prometer atualização retroativa |
| Guia e ajuda | Conteúdo estruturado e acesso contextual rápido | Texto coerente com funções entregues; treinamento existente e consulta textual; vídeo precisa revisão após mudança da UI |
| Busca global | Paleta de comandos para navegar e localizar orçamentos | Identificar escopo da busca, estados vazios, teclado e foco; consultas autenticadas, sem fingir busca em módulos não implementados |

## Funcionalidades aparentes que precisam de definição

PMOC, fluido refrigerante, checklist técnico, fotos, termo assinado/certificado, faturamento e categorias de cliente aparecem em textos/fixtures. Não são provados pela demonstração. Para cada ampliação: definir dado, ação, resultado, permissões e critério de aceite antes de migrar schema ou prometer operação. Não confundir acabamento visual com implementação dessas capacidades.

## Ordem de execução proposta

1. Consolidar estrutura visual global e componentes da referência com navegação responsiva; reaproveitar lógica atual e evitar CDNs/fontes remotas em runtime.
2. Refazer composição de Clientes com carteira prioritária, busca e modos explícitos de novo/edição. Preservar os testes de persistência/ajuda e atualizar testes para o novo fluxo, sem forçar a UI ao roteiro antigo.
3. Aplicar Orçamentos e OS, incluindo filtros, detalhes e quadro com contratos reais.
4. Equipamentos e Agenda, depois Caixa de entrada, Configurações e Guia.
5. Validar jornadas entre módulos em desktop/celular, estados vazio/erro/carregamento, teclado e conteúdo longo. Revisar treinamento após estabilização visual.

Pronto significa: semelhança intencional de composição e hierarquia em relação à referência; ações visíveis executam fluxo real ou estão explicitamente indisponíveis; persistência e erros verificáveis; nenhuma funcionalidade existente perdida; sem métricas, certificações ou integrações simuladas apresentadas como reais.

Entrega atual: análise e direção registradas, não evolução global implementada. Próximo passo: especificar a estrutura global e a nova composição de Clientes como primeira fatia coerente da referência.
