# Referência recebida — Brisa Oficina

2026-11-12. Fonte: anexo `brisa_oficina_erp_crm_de_climatiza_o.html`, 1.964 linhas. Leitura estática, sem executar scripts ou carregar CDNs. Referência visual e interativa local, sem integração demonstrada com Next/PostgreSQL. Este documento complementa diagnostico-direcao.md.

## Direção que o código concretiza

O HTML propõe superfícies claras, bordas suaves, sombras discretas, cantos arredondados, acento turquesa e iconografia Lucide. Inter é o texto de interface, Plus Jakarta Sans marca títulos e JetBrains Mono diferencia números. Há navegação lateral com recolhimento mobile, cabeçalho de workspace, filtros/busca em Orçamentos, OS em lista/quadro, cards de clientes, modal de orçamento e painel lateral de detalhes. Esses padrões são candidatos à adaptação, não componentes já integrados.

A composição separa melhor cabeçalho, ferramentas de consulta e registros. É uma direção concreta para reduzir a aparência de formulário contínuo e dar identidade ao produto. A avaliação de proporções, contraste real, truncamento e comportamento em celular ainda exige renderização; classes responsivas não comprovam usabilidade.

## Adotar, adaptar e corrigir

| Decisão proposta | Evidência da referência | Aplicação no produto |
|---|---|---|
| Adotar linguagem de superfícies e hierarquia | Configuração de fontes, sombras e cores no início do arquivo | Extrair tokens para componentes React/CSS; revisar custo de três famílias e legibilidade antes de fixá-las |
| Adaptar navegação mobile | toggleMobileSidebar, linha 775 | Manter acesso às oito abas; validar foco, fechar, retorno e seção ativa no celular |
| Adaptar filtros e detalhes de Orçamentos | renderOrcamentosView, linha 820; drawer, 1675 | Usar estados reais, revisão, total e histórico do backend; conservar edição de rascunho e publicação explícita |
| Completar Clientes antes de portar | renderClientesView, 1211: botão apenas mostra toast; cards sem busca/edição | Preservar cadastro, busca, edição e conferência do mesmo registro. Cards são opção visual, não substituto dessas tarefas |
| Rever títulos editoriais | “Relacionamento organizado.” em Clientes | Usar “Clientes” como identificação principal; frase editorial opcional e subordinada. A navegação deve corresponder ao título |
| Remover números sem fonte | approvedCount e serviceCount, 822–823, usam bases fixas | Mostrar somente agregados com definição e dados reais; não transportar contagens demonstrativas |
| Corrigir semântica de aprovação | handleCreateQuote, 1631: criação pode escolher Aprovado e gerar OS em memória | Preservar aceite explícito do destinatário sobre revisão vigente. Design não muda autoridade de decisão |
| Preservar cancelamento e histórico | cancelOS, 1612, remove item do array | Usar transição cancelada com motivo e histórico; não reproduzir desaparecimento como exclusão |
| Retirar promessas sem implementação | certificado técnico em updateOSStatus; PMOC/total faturado em Clientes | Não alegar certificação, gestão PMOC ou faturamento com base em orçamento aceito |
| Substituir simulações por estado observado | triggerSyncSimulation, 1812, usa temporizador; copyShareLink, 1755, monta URL fictícia | Exibir feedback de persistência real e link retornado pela publicação; não declarar sincronização por tempo decorrido |
| Preservar ajuda existente | tour próprio da referência | Reaproveitar treinamento por conta, catálogo e ajuda textual; compatibilizar visual sem perder retorno à operação nem campos na mesma aba |

## Critérios para adaptação

Primeira fatia proposta: Clientes, com cabeçalho claro, ação Adicionar cliente, busca visível, apresentação de registros e edição funcional preservada. Comparar lista e cards com nomes/endereço longos em 360 e 1280px; verificar acesso ao formulário sem navegação excessiva. Não incluir total faturado nem segmentações novas sem fonte e requisito.

Depois: Orçamentos, preservando rascunho → publicação → decisão → OS. Quadro de OS é uma opção secundária a avaliar após a lista; não precisa entrar na primeira fatia. Agenda deve manter vínculos, fuso e distinção visita/OS. Configurações não deve mudar snapshots antigos.

Modais, drawer e menu móvel precisam verificar foco inicial, contenção, Escape, nome acessível e devolução ao acionador. O listener global de Escape presente no HTML não comprova esses requisitos. Rever texto de 11–12px e altura de ações compactas; validar contraste de cada variante e alvo de toque. Não copiar innerHTML com dados de usuário para React nem dependências CDN sem versão; usar renderização e dependências do produto.

## Plano concreto

1. Revisar com o operador esta interpretação da referência e o recorte Clientes.
2. Com implementação autorizada, selecionar base do produto e criar worktree exclusiva; decidir explicitamente se o piloto de ajuda integra a base para evitar regressões.
3. Adaptar tokens e Clientes mantendo contratos; revisar visualmente em desktop/celular e por teclado com dados sintéticos em ambiente próprio.
4. Expandir padrões validados para Orçamentos/OS/Agenda e demais abas. Atualizar treinamentos somente após estabilizar a UI.

Nenhum produto foi modificado. Não há novo gate funcional concedido pelo anexo. Próximo passo único: revisão da direção e do recorte inicial Clientes com base nesta referência.
