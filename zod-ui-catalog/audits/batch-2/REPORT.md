# Zod UI — extração e auditoria, lote 2

Concluído em 2026-11-12. O catálogo contém **53 itens: 14 S, 20 A e 19 C**. Este lote acrescentou 33 itens: 12 S, 20 A e uma referência C parcial. São componentes distintos registrados pelas fontes; dependências, variantes de cor e arquivos auxiliares não foram contados como novos itens.

## Componentes com código

Foram preservados 20 shaders adicionais do dithercn e 12 componentes do registry oficial new-york-v4 do shadcn/ui, com seus demos e dependências necessárias. Ambas as fontes têm licença MIT, cujas cópias estão em assets/dithercn/LICENSE e assets/shadcn/LICENSE. Snapshots dos registries e SHA-256 dos arquivos permitem verificar a origem do código.

Cada um dos 32 componentes foi renderizado em viewport desktop 1440×900 e mobile 390×844. Os 64 renders locais concluíram sem erro de JavaScript nem overflow horizontal. Há screenshots da fonte, da implementação local e das superfícies dos componentes, além de evidência dos estados interativos. O código dos registries foi mantido; o harness fornece tokens, container, aliases de imports e CSS utilitário.

## Critério de classificação

A atribuição foi manual após comparação visual desktop/mobile, leitura da origem/licença e inspeção dos estados testáveis. Os scores de pixels servem apenas como evidência auxiliar de superfície e não foram convertidos automaticamente em tier, percentual de qualidade ou percentual de fidelidade da interface inteira. Não há certificação WCAG nem Tier S+ neste lote.

Os 12 novos S têm estrutura, padrão e enquadramento coerentes com a referência; precisam de integração dos tokens e tamanho do container no host. Oito shaders são A porque exigem calibrar paleta, limiares ou parâmetros do demo original. Os 12 componentes shadcn são A devido à normalização de tema/fonte (Geist na fonte, Arial no harness), aliases e largura do host. Alguns scores de pixels são altos mesmo com essas adaptações pendentes; isso não promove o componente a S automaticamente.

Fontes e implementações foram comparadas na mesma viewport. Para primitivas fluidas shadcn cuja página oficial usa toda a largura, a comparação adicional normaliza apenas a largura do elemento na fonte para a largura do host local; a captura original é preservada em *-reference-surface-original.png. Não se esticam imagens. Diferenças de até dois pixels nas bordas de screenshots de elementos são acomodadas por crop da área raster comum. Essa limitação consta em audit.json.

Os shaders foram comparados no estado estático com reduced-motion. Não foram certificados GPU fallback, desempenho sustentado, animação completa ou contraste de conteúdo futuramente sobreposto. O código possui estados que ainda devem ser reavaliados no projeto consumidor.

## Verificações de comportamento

- Button: foco por teclado, hover e disabled.
- Input/Textarea: entrada de conteúdo e disabled.
- Checkbox/Switch: Espaço alterna aria-checked; disabled.
- Tabs: seta direita move foco e ativa outro painel.
- Accordion: Enter altera aria-expanded.
- Slider: seta direita altera aria-valuenow.
- Dialog: Enter abre; oito Tab mantêm o foco no diálogo; Escape fecha e devolve foco ao trigger; diálogo aberto comparado com a fonte.
- Progress: role progressbar observado; seu demo temporizado pode variar entre capturas.
- Badge/Card: apresentação estática. O card não implementa autenticação real.

As esperas de estado respeitam o render React e as animações de saída. Falhas iniciais de seletores/medição do harness foram corrigidas e os itens afetados foram reexecutados antes de publicar. Os dados finais de cada item estão em ../../previews/<id>/audit.json.

## Novos itens S/A

| ID | Tier | Trabalho necessário |
| --- | --- | --- |
| dithercn-dither-glow | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-mesh-gradient | A | Mesma composição de blobs; matriz de ruído e gradação diferem do demo. Calibrar paleta e matriz antes de uso fiel. |
| dithercn-noise-field | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-plasma | A | Campo e contornos preservados; a paleta padrão local introduz branco ausente no demo. Mapear palette explicitamente. |
| dithercn-starfield | A | Distribuição de estrelas preservada; padrão local usa estrelas brancas onde o demo usa azul. Mapear a paleta. |
| dithercn-halftone | A | Estrutura de manchas preservada; demo ciano versus paleta local azul. Ajustar palette e tonalidade. |
| dithercn-horizon | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-beams | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-eclipse | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-dither-orb | A | Esfera e limites preservados; intensidade e região de luz diferem. Conferir uniforms de iluminação e paleta. |
| dithercn-contours | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-ripples | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-retro-grid | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-silk | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-tunnel | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-smoke | A | Campo de fumaça preservado, mas densidade e distribuição tonal diferem do demo. Ajustar uniforms e palette. |
| dithercn-metaballs | A | Geometria de bolhas preservada; limiares e gradação tonal diferem do demo. Ajustar palette/thresholds. |
| dithercn-ridgelines | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-flow-field | S | Mapear tokens --dither-* e dimensionar o container no projeto host. |
| dithercn-voronoi | A | Malha celular preservada; o preenchimento local tem mais pontos nas células. Ajustar contraste e paleta. |
| shadcn-button | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-badge | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-card | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-input | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-textarea | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-checkbox | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-switch | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-tabs | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-accordion | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-dialog | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-progress | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |
| shadcn-slider | A | Importar tokens de tema e CSS Tailwind v4. Mapear o import cn para utilitário compatível clsx + tailwind-merge. Normalizar fonte Geist e dimensões do container. |

## Fontes pendentes revisitadas

- Pixlpin: continua retornando HTTP 403/Cloudflare. Nenhuma extração foi simulada.
- Refero: a busca pública de modais exibe exemplos iniciais e exige login para mais páginas; sem sessão autorizada, não foram extraídos código ou telas restritas.
- Page Flows: foi encontrada uma ficha individual do onboarding Revolut para iOS, versão julho de 2020. O sumário público e os primeiros frames foram capturados. As telas seguintes têm paywall. Publicado somente um visual_spec C parcial e histórico; nenhum vídeo ou tela premium foi redistribuído.
- Spotted in Prod: URL pública de clipe foi revisitada. Não foi obtido código original com licença reutilizável nem evidência suficiente de estados para um S/A; a captura permanece como evidência fora dos índices.
- Mahero: Wonderful Hero agora expõe detalhes do asset, mas permanece com preview em carregamento e acesso pago. Nenhum template premium foi extraído.

Os retries estão em pending-retries.json; URLs, status e capturas públicas em ../source-evidence/*retry*/. Não houve login, compra ou bypass de restrição.

## Taxonomia e reprodução

Foram acrescentadas seis seções aos índices e ao mapa do master: status-badges, authentication-cards, text-inputs, toggle-controls, progress-feedback e range-controls. Elas evitam registrar controles de formulário ou status em seções semanticamente incorretas. Nenhum quadrante foi removido. Detalhes em taxonomy-additions.json.

A publicação ocorreu sob lock exclusivo, com staging, backups e journal de recuperação. `python3 zod-ui-catalog/scripts/validate_catalog.py` valida contagens, unicidade, localização e correspondência índice/artefato. Evidências e dimensões foram verificadas separadamente.

Para reproduzir o render, siga fixture/README.md. O preparo --offline rematerializa o código dos snapshots, preservando o harness. Downloads de novos snapshots são separados da auditoria e da classificação manual.

## Limites remanescentes

Não se trata de extração exaustiva dos sites. A biblioteca está concentrada em atmosfera WebGL e primitivas React; blueprints de página, navegação real, fluxos completos e stacks não React ainda têm cobertura menor. Itens A exigem as adaptações registradas; os 19 C são referências/specs, sem promessa de código plug-and-play.
