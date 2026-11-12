# Especificação funcional v0.1

> Atualização 2026-11-12: G0 aprovado explicitamente pelo operador nesta conversa; implementação local autorizada. Status atual em STATUS.md. Texto abaixo preserva o planejamento original.

Status: proposta para aprovação. Referência: proposal.md. Instalação isolada por empresa, PT-BR, BRL, datas exibidas em America/Sao_Paulo e persistidas UTC.

## Atores e jornadas

Operador autenticado cadastra cliente mínimo, monta orçamento, publica versão, copia link, acompanha decisão e OS. Destinatário acessa só o documento autorizado pelo token, lê condições, aprova explicitamente ou solicita alteração. Solicitar alteração não aprova nem edita o documento. Administrador configura marca e exporta/restaura dados. MVP pode ter um único papel interno administrador; convites e equipes ficam fora.

## Requisitos

R01 Autenticação de operador por biblioteca mantida, sessões seguras, logout, limitação de tentativas e recuperação administrativa documentada; sem cadastro público. Segredos fora do Git. CSRF e autorização em cada mutação.
R02 Cliente com nome, contato opcional e referência de local; não exigir CPF/CNPJ. Minimizar dados no portal e logs.
R03 Orçamento com UUID, código legível, revisão, itens, quantidade inteira positiva, preço em centavos, descrição, validade, condições e total calculado exclusivamente no servidor; limites de tamanho/valor e proteção contra overflow. Descontos, parcelas e cálculo fiscal fora.
R04 Rascunho editável. Publicação cria snapshot imutável de itens, preços, condições e marca. Mudança cria nova revisão e revoga links anteriores; documentos aceitos nunca são reescritos. Alteração de orçamento aceito exige novo orçamento, com vínculo ao anterior.
R05 Token aleatório criptograficamente seguro com pelo menos 256 bits, armazenado como hash, revogável e com expiração. Sem IDs enumeráveis públicos. Não registrar token em logs; no-referrer, no-store e ausência de analytics de terceiros no portal. GET não altera estado nem conta como aceite.
R06 Estados: draft → sent; sent → accepted | change_requested | expired | cancelled. Nova revisão em change_requested gera novo sent; revisão anterior é superseded. Apenas revisão vigente, enviada, não expirada e não revogada aceita decisão. Expiração e concorrência verificadas transacionalmente no servidor.
R07 Aceite pede nome do responsável, confirmação explícita e referência à revisão/total visível. Gravar timestamp, revisão, hash do snapshot e identificador idempotente. Dois aceites simultâneos resultam em uma decisão e uma OS. Aceite de revisão antiga retorna conflito com instrução para obter novo link. Evidência operacional, sem promessa de assinatura certificada.
R08 Solicitação de alteração com texto limitado, escapado e sem anexos; conserva histórico. Revogação impede novas leituras/decisões públicas. Reabertura administrativa nunca apaga aceite.
R09 PDF reproduz snapshot e marca demo, código, validade e decisão correspondente. Sem recursos remotos ou conteúdo executável. Disponível ao operador; acesso público somente com token válido.
R10 Uma OS por orçamento aceito: pending → in_progress → completed; pending/in_progress → cancelled, com motivo. Serviço, cliente e total referenciam snapshot aceito. Repetição de comando não duplica OS.
R11 Histórico append-only na aplicação para publicações, revisões, decisões, revogações e transições; sem tokens, senhas ou conteúdo sensível desnecessário. Não alegar imutabilidade contra administrador do banco.
R12 CSV escapado contra formula injection, exportação administrativa e backup/restauração documentados. Política proposta: limpeza diária de tokens expirados, retenção dos documentos configurada pelo operador antes do piloto; não inventar prazo legal. Excluir cliente com dependências exige procedimento explícito de anonimização/retensão aprovado.
R13 UI responsiva a partir de 360px, teclado, foco visível, labels, erros associados, estados vazios/loading/falha, contraste AA a verificar. Não exibir sucesso sem persistência. Sem rede: informar falha e permitir repetir com mesma idempotência.
R14 Demo sintética reinicializável por comando local; reset indisponível em produção. Links e contatos demo não enviam mensagens. Ao instalar para cliente real, seed demo e selo só podem ser removidos por configuração explícita e revisão.

## Modelo proposto

CompanySettings; Operator; Client; Quote; QuoteRevision; QuoteItemSnapshot; PublicLink(token_hash,expires_at,revoked_at); Decision(revision_id UNIQUE); ServiceOrder(quote_id UNIQUE); AuditEvent. Toda revisão pertence a um orçamento e instalação. Banco isolado por instalação; sem alegação de RLS multi-tenant. Dinheiro em centavos; constraints e transações garantem unicidade, não apenas frontend.

## Aceites verificáveis

AC01 Login obrigatório e requisição anônima a todas as rotas internas negada.
AC02 Fixture 2×18000 gera 36000 no servidor/PDF; preço adulterado no request não altera snapshot.
AC03 Publicar revisão 2 invalida token da revisão 1; token vencido/revogado/aleatório não revela dados.
AC04 Aceites concorrentes e retry após timeout criam exatamente uma decisão e OS.
AC05 Solicitação de alteração não gera OS; orçamento aceito preserva snapshot mesmo após troca da marca.
AC06 Transições inválidas são rejeitadas; GET de pré-visualização não decide.
AC07 PDF corresponde à versão aceita; histórico permite reconstruir a jornada.
AC08 Escape de HTML/CSV, CSRF, acesso a outro documento, rate limiting e vazamento de token têm testes negativos.
AC09 Backup restaurado em banco vazio recupera orçamento/decisão/OS com totais e vínculos iguais.
AC10 Jornada completa em 360px e desktop via teclado, incluindo conflito, rede falha e link expirado; evidências capturadas com dados sintéticos.
AC11 Instalação limpa reproduz demo usando runbook; nenhum segredo/PII real no seed ou evidências.

## Fora do MVP

Multi-tenancy compartilhada, cobrança de assinatura, pagamentos integrados, WhatsApp API, e-mail transacional, ERP/conector, estoque, PMOC, fiscal/IA, agenda de equipes, uploads/fotos, app nativo/offline, assinatura certificada e construtor genérico de sites.

## Incremento aprovado: usabilidade e ajuda contextual

Em 2026-11-12, operador autorizou guia interno, ajuda “?” por campo, dicas iniciais e refinamento do fluxo existente. Requisitos UX01–UX07 e plano incremental em [usability-contextual-help.md](changes/usability-contextual-help.md). Complementa R13 sem ampliar integrações ou alterar regras de decisão. A homologação deste incremento permanece pendente.

## Incremento aprovado: treinamento e operações

Solicitação explícita do operador amplia o escopo com treinamento guiado por aba, caixa de entrada por usuário, clientes, equipamentos e agenda manual de visitas. Requisitos O01–O07 e limites em [guided-training-operations.md](changes/guided-training-operations.md). A antiga exclusão de agenda é substituída apenas pelo recorte de visitas manuais; equipes, recorrências, PMOC e integrações continuam fora.
