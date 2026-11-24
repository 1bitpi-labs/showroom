# Roteiro PT-BR e captura futura

Proposta de 100–120 segundos; tempos editoriais estimados, não timestamps de mídia existente. Preferir legendas e transcrição completas; narração humana local opcional com o mesmo texto. Ajustar pausas à leitura e ao resultado da UI, nunca simular sucesso com montagem.

| Tempo | Cena e ação real | Narração / legenda proposta |
|---|---|---|
| 00–08 | Aba Clientes, selo demo visível | “Vamos cadastrar, salvar, buscar e editar um cliente fictício da Brisa Oficina.” |
| 08–35 | Mostrar formulário; preencher nome `TREINO VIDEO — Cliente Aurora`, Contato do cliente `aurora@example.invalid`, endereço `Rua de Demonstração, 100 — Sala A`, observação `Cadastro fictício para treinamento`. Campos confirmados no componente atual; reconferir versão antes da tomada. | “Preencha o nome e os dados de contato disponíveis. Endereço e observações ajudam a identificar o atendimento. Estes dados são fictícios. O cadastro não envia mensagens.” |
| 35–50 | Acionar “Salvar cliente”; aguardar confirmação e registro na lista; manter resultado legível | “Salve o cadastro e confira o resultado na lista. Se aparecer um erro, revise a mensagem antes de tentar novamente.” |
| 50–68 | Buscar por `TREINO VIDEO — Cliente Aurora`, mostrar resultado correspondente | “Use a busca para localizar o cliente pelo nome. Confira o registro antes de editar.” |
| 68–92 | Acionar “Editar cliente” do resultado; trocar observação por `Cadastro fictício — preferir atendimento à tarde`; salvar | “Clique em Editar, atualize a observação e salve a alteração. Você está alterando o mesmo cadastro.” |
| 92–105 | Reabrir registro e mostrar observação persistida; não criar outro | “Confira a informação salva. Alterar o cliente não muda os dados de orçamentos já publicados.” |
| 105–120 | Quadro final do próprio material, sem fingir uma integração ainda inexistente | “Você viu cadastro, salvamento, busca e edição. Agora pode usar Clientes e consultar esta ajuda quando precisar.” |

## Método local viável, não executado

Após autorização, selecionar worktree exclusiva do produto e ambiente local de captura com dados somente sintéticos, separado do banco do operador. Não apontar testes/seed ao banco corrente. Fixar commit e validar rótulos/validações do formulário antes da gravação. Login ocorre antes da captura, sem gravar credenciais; não ler/copiar .env.local para artefatos.

Preferir gravação local do viewport pelo Playwright instalado, com contexto recordVideo (1280×720 ou 1280×800), ações por rótulo/role e pausas legíveis após resultados reais. Essa captura mantém navegador/desktop externo fora da mídia. Alternativa manual: OBS já disponível, captura recortada da janela; não instalar ferramentas sem necessidade. Conferir disponibilidade local e espaço antes. Nenhuma dessas ferramentas foi executada nesta thread.

Gravar uma tomada contínua das quatro ações, incluindo respostas do app; evitar cortar carregamentos para fingir persistência. Em ambiente isolado autorizado, conferir recarga e mesmo ID antes/depois da edição. Não embutir ids internos ou ferramentas de desenvolvedor no vídeo. Se UI falhar, interromper e registrar falha separadamente; não ampliar tarefa para correção.

Guardar bruto e derivados locais em pasta de artefatos ignorada pelo Git; usar ffmpeg local, se disponível, para MP4 H.264/yuv420p, faststart, 25/30 fps e resolução legível. Sem áudio é aceitável com legendas; se narrado, áudio AAC local. Produzir poster sem desktop e WebVTT PT-BR revisado manualmente, mais transcrição .txt. Conferir com ffprobe duração/codecs e revisar vídeo completo (não apenas quadros), sincronização e legibilidade em celular. Validar reprodução no navegador alvo antes de integrar.

Manifesto deve registrar produto/base, fixture, resolução, ferramentas/versões efetivas, hashes e revisão humana. Não incluir senha, tokens, nomes reais ou telas de outras aplicações. Limpeza dos dados fica restrita ao ambiente descartável autorizado, nunca resetar banco do operador. Só copiar derivados aprovados para public/training em tarefa de integração; nada produzido agora.

## Alinhamento com a jornada consolidada

Não gravar CTAs fictícios dentro da interface. O diálogo integrado oferece saída “Voltar a Clientes” desde o início, inclusive no fim parado; texto é consulta alternativa, não continuação obrigatória. Definir tempos reais de quatro capítulos após edição; selecionar capítulo pausa sem autoplay. Testar legibilidade em 360px, zoom/tela cheia e legendas sem cobrir resultados. Manifesto inclui responsável por atualização, compatibilidade da UI, revisão editorial e capítulos reais. Conteúdo incompatível deve ser retirado da oferta de vídeo, preservando texto correto.
