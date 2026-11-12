# ElosPME — Portal de orçamentos e OS

> Atualização 2026-11-12: G0 aprovado explicitamente pelo operador nesta conversa; implementação local autorizada. Status atual em STATUS.md. Texto abaixo preserva o planejamento original.

Data: 2026-11-12. Status: proposta de especificação; implementação não iniciada.
Autorização nesta conversa: pesquisar referência, definir demo, especificar e planejar. Não autoriza gastos, daemon, publicação, merge ou contato comercial.

## Problema e resultado

Entregar uma versão padronizada por instalação que permita a uma empresa de climatização criar um orçamento, compartilhar o link, registrar a decisão sobre uma versão imutável e acompanhar uma OS simples. Hipótese: reduzir retrabalho e ambiguidade da aprovação. Demanda e ganho de tempo ainda não medidos.

## Referência real e identidade de demonstração

Pesquisa em 2026-11-12:

- https://italoar.com.br/ — catálogo público de instalação, manutenção, higienização e outros serviços, atuação na Grande Florianópolis e CTA de orçamento via WhatsApp. Referência principal de domínio.
- https://www.arcomfort.com.br/orcamento — formulário de nome/e-mail/telefone/mensagem e opção WhatsApp. Referência secundária de captação.
  Observações limitadas às páginas públicas. Não inferir ausência de CRM, faturamento, tamanho da equipe, dificuldades internas ou intenção de compra. Nenhuma empresa foi contatada ou se tornou cliente.

Identidade criada: **Brisa Oficina — Climatização Demo**. Nome de trabalho fictício, sem pesquisa de disponibilidade de marca/domínio e sem registro comercial. Não copiar logotipos, fotos, depoimentos, textos ou dados pessoais das referências. Exibir “Empresa fictícia • demonstração • dados sintéticos” no painel, portal e PDFs. Contato demo: atendimento@brisa.example; nenhum telefone real ou disparo de mensagem.

Tom: claro, profissional, próximo. Paleta proposta: azul profundo #123047, turquesa #007F82, fundo #F4F8FA, destaque #F2BA49; validar contraste antes de implementação. Identidade tipográfica com fonte do sistema; símbolo pode ser composto em SVG próprio na implementação. Não há logo ou telas produzidos nesta etapa.

Cenário: orçamento DEMO-001 para “Cliente Demonstração A”, higienização de dois aparelhos, R$ 180 por unidade, total R$ 360. Valores exclusivamente sintéticos, sem referência de preço de mercado. Segunda versão com um item adicional permite demonstrar revisão e invalidação do link antigo. OS gerada somente após aceite da versão vigente.

## Comercial e limites

Hipótese: R$ 2.490 por licença da versão + implantação padronizada; operação/hospedagem paga pelo comprador ou parceiro. Licença, suporte e responsabilidades ainda precisam de contrato. Sem promessa de hospedagem vitalícia. Evolução para SaaS compartilhado será outra decisão arquitetural.

## Local de entrega

Esta pasta guarda apenas a change de planejamento do Agent OS. Código futuro: repositório dedicado `elos-pme-portal` (nome proposto), com worktree por executor. Não modificar shell, navegação ou runtime do Agent OS. Não foi criado repositório de produto.

## Gates

G0: aprovar spec e decisões de arquitetura, fixar destino do código e orçamento autorizado. Pedido de planejamento não é aprovação da implementação.
G-TSF: comprovar controles do runner antes de qualquer chamada autônoma paga.
G1: aceitar incremento local com evidências. G2: autorizar staging e seus custos. G3: autorizar produção com backup/rollback. G4: aceite da entrega e operação definida.
A validação comercial é recomendada antes de investimento completo; ausência de cliente não impede demo sintética local após autorização de implementação.
