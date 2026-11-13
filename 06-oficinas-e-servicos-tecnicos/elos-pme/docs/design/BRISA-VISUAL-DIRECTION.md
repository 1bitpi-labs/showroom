# Brisa — composição visual implementada

Direção solicitada: elevar o acabamento do aplicativo de gestão com uma linguagem de produto coerente em desktop, mobile e portal público. A referência a uma empresa de alto valor orienta o nível de cuidado, não constitui validação comercial ou promessa de aceite por cliente.

## Linguagem

Turquesa profundo na navegação, papel claro no workspace, superfícies brancas e acentos suaves de vegetação. A marca Brisa foi desenhada em SVG: linhas de fluxo de ar, geometria simples e assinatura tipográfica limpa. Ícones próprios com traço uniforme substituem caracteres Unicode renderizados. Não há fonte remota, imagem de banco, shader ou biblioteca adicional.

Tipografia: Inter quando disponível localmente, com sistema como fallback; títulos de peso 500, tracking discreto e escala por tamanho de tela. Texto operacional e valores usam hierarquia clara; referências usam monoespaçada. Espaços, campos, badges, raios, sombras, foco e transições compartilham contrato em src/app/brisa.css. A família de cor base é própria do produto; cores configuradas da marca continuam aplicadas nos controles/portal e snapshots.

| Token | Valor / uso |
| --- | --- |
| --bg / --paper | #f5f6f3, canvas |
| --fg / --ink | #172e2b, texto |
| --deep | #113e3b, navegação e ações principais |
| --primary | --teal, marca configurável |
| --muted | #566b65, texto secundário |
| --border / --line | #dce3df, separadores/superfícies |
| --input-border | #81968e, limites dos campos |
| Raios | 10px controles, 16–18px painéis, 20px diálogos |
| Espaços | 4/8/12/16/24/32/48px |
| Interação | foco 3px e offset 3px; controles de toque 44px; campos mobile 16px |
| Motion | transições discretas 160ms; reduced-motion elimina transições/animações |

Pares sRGB calculados: texto/canvas 13,24:1; secundário/branco 5,70:1; seleção de navegação 9,92:1; borda de input/branco 3,14:1; referências/branco 5,25:1. São pares sólidos, sem certificação de todos os estados ou temas alternativos.

## Composição por área

- Shell: sidebar persistente em desktop, identificação do workspace, busca global, perfil de operador e separação entre navegação e conteúdo. A informação de demonstração permanece visível.
- Mobile: cinco destinos na navegação inferior — Propostas, Serviços, Agenda, Clientes, Mais — com área segura. O menu completo continua acessível no topo. Durante edição de proposta a barra de navegação dá lugar às ações fixas de voltar/salvar/publicar; a navegação superior continua protegida pelo guard P1.
- Propostas: resumo compacto com dados reais de abertos/aprovados/OS iniciadas, busca, filtros em abas horizontais, valor alinhado, status textual e próximo passo sob demanda. Histórico/edição ficam à mão; revogar/cancelar entram em Mais ações, com Escape. Rascunho sem revisão não oferece revogar link.
- Editor: três seções numeradas — cliente, serviços e condições — e resumo lateral de cliente, itens, validade e total que acompanha o cálculo. Em mobile, conteúdo empilha e ações permanecem ao alcance do polegar. Persistência, revisão e centavos usam os contratos existentes.
- Clientes: carteira com avatar de iniciais, contatos e contagens; modal nomeado, foco e ajuda preservados. Busca sem resultado oferece limpar.
- Equipamentos: lista e histórico antes do formulário; Cadastrar abre disclosure. Editar abre e preenche o mesmo formulário com seu ID.
- Agenda: lista primeiro, data em bloco visual para varredura, horário e vínculos, status e ações de visita. Cadastro continua no modal acessível do incremento P1.
- OS: lista/quadro com superfícies e cores semânticas comuns; transições existentes e distinção entre OS e visita preservadas.
- Inbox, Guia e Configurações: componentes comuns, organização de leitura e prévia de identidade. Resumos de FAQ do Guia permanecem acessíveis.
- Login: composição editorial em duas áreas, marca, ilustração vetorial discreta e formulário direto; em mobile, apresentação compacta acima do login.
- Portal público: documento de proposta com identidade do snapshot, itens e subtotais, total destacado, validade/condições, PDF e decisão explícita. Aprovar não significa cobrança ou agendamento. Link indisponível orienta pedir outro à empresa.

## Implementação e proveniência

Skill zod-ui-architect, catálogo raiz e blueprint consultados. Primitivas A shadcn já examinadas informam estados e contratos. Implementação original em React, SVG e CSS: nenhum registry copiado e nenhuma dependência adicionada. Sem ativos de licença incerta ou itens C usados como código. Catálogo/skills compartilhadas não alterados. brisa.css concentra a linguagem nova; globals.css conserva a estrutura histórica e os contratos prévios de componentes.

## Verificação

Preview real em 360×800, 390×844, 768×960 e 1440×960; sem overflow da página nos estados medidos. O devtools sobrepôs o primeiro botão da barra mobile durante um ensaio em dev; a verificação final usa build de produção, sem esse botão. Controle visível sem nome não foi encontrado nas páginas mobile verificadas. Inspeção dirigida, não auditoria WCAG ou em dispositivo físico.

Jornada executada pela UI: selecionar cliente → editar descrição/quantidade/preço → total R$960 → salvar rascunho → editar → publicar → ler/confirmar aceite no portal mobile → OS gerada. PDF respondeu 200/application/pdf. Dados e nomes são fictícios no banco próprio da auditoria; três propostas de demonstração adicionais foram criadas pelas APIs existentes para avaliar composição com registros reais, sem métricas inventadas. Dados anteriores preservados.

Proteção de edição foi exercitada usando a barra inferior; descartar permitiu navegar. Equipamento existente abriu/preencheu o formulário. Mais ações abriu e fechou por Escape. Áreas Clientes/OS/Agenda/Configurações/Inbox/Guia visitadas em mobile; edição também conferida em 768px. Não houve gravação de vídeo ou trace com sessão/token.

Os 22 testes existentes passaram em base própria brisa_zod_p1_tests/55448; TypeScript sem emit passou. Build final e capturas de produção registrados no relatório de entrega e manifesto de evidências. Nenhuma homologação humana inferida. Permanecem pendentes leitor de tela, teclado virtual/iOS, zoom 200%, temas alternativos completos e situações extensas de perda de rede. Não há API nova, migração de produto, pagamento, multiempresa ou integração externa.
