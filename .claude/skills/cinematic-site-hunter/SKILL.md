---
name: cinematic-site-hunter
description: Busca, audita e extrai benchmarks de sites premiados de altíssimo impacto estético, cinematográfico e imersivo (Awwwards, InspoMCP, FWA, Godly, Mobbin) para qualquer nicho, indústria ou tema solicitado (ex: Clube Náutico, Marinas, Hotéis Boutique, Superyachts, Arquitetura). Automatiza a captura de telas limpas (viewport cinema), engenharia reversa de motion/WebGL e gera tabelas comparativas com conclusões de design e conversão.
---

# Cinematic Site Hunter

Skill especializada em prospectar e analisar referências visuais de nível internacional para clientes ou projetos que exigem **estética sublime**, **direção de fotografia cinematográfica**, **sensação de exclusividade/luxo** e **animações fluidas (WebGL, Canvas, Scrollytelling, Shaders)**.

---

## 1. Fontes Canônicas de Extração

1. **Awwwards** (`https://www.awwwards.com`):
   - Foco: *Site of the Day (SOTD)*, *Developer Award*, *Site of the Month*, categorias *Luxury*, *Sports*, *Hospitality*, *Architecture*.
   - Queries de busca no terminal/web:
     `site:awwwards.com "<tema>" ("Site of the Day" OR "Honorable Mention" OR "Nominee")`
2. **InspoMCP** (`https://inspomcp.dev`):
   - Curadoria de 800+ sites em produção com DESIGN.md e capturas mobile/desktop.
   - Integração CLI / MCP: `npx -y inspo-mcp install` ou consulta via `https://inspomcp.dev/screens?q=<termo>`.
3. **The FWA** (`https://thefwa.com`):
   - Experiências imersivas em 3D, WebGL, Realidade Aumentada e interatividade extrema.
4. **Godly** (`https://godly.website`):
   - Melhor curadoria moderna de UI minimalista, tipografia cinética e micro-interações.

---

## 2. Critérios de Avaliação "Cinematográfica"

Para classificar um site como referência válida, ele deve atender a pelo menos 4 dos 6 pilares:

| Pilar | O que observar | Exemplo de Implementação |
|:---|:---|:---|
| **1. Direção de Fotografia / Drone** | Imagens e vídeos de altíssima resolução, iluminação natural dramática (golden hour, contraluz na água, névoa matinal). | Vídeo full-bleed com corte de drone voando rente à proa em velocidade. |
| **2. Scrollytelling & Pacing** | A rolagem da página conta uma história e conduz o olhar, sem pressa. | Efeito *curtain reveal*, sticky headers translúcidos, parallax suave de planos de fundo. |
| **3. WebGL / Canvas / 3D** | Elementos tridimensionais integrados à interface (Three.js, GLSL shaders). | Modelagem de iate/instalação navegável em 360°, reflexos dinâmicos de luz na água. |
| **4. Tipografia Monumental & Editorial** | Títulos amplos com fontes serifadas elegantes ou sans-serifs geométricas ultrarrefinadas. | Tipografia oversized (ex: *Syne*, *Canela*, *Italiana*, *Monument Extended*) que interage com o vídeo de fundo. |
| **5. Micro-Interações & Cursor Líquido** | Feedbacks táteis refinados que trazem a sensação de "tocar em um produto de luxo". | Cursor que vira botão "Drag / Explore", transições suaves de cor entre seções (dark mode para sunset). |
| **6. Discreção na Conversão (Quiet Luxury)** | Formulários e botões de contato discretos, transmitindo exclusividade em vez de urgência agressiva. | Botões *"Request Private Showing"*, *"Inquire Yacht"* com modais minimalistas em tela cheia. |

---

## 3. Script Automatizado de Captura (Puppeteer Headless)

A skill inclui o utilitário [`scripts/capture_sites.js`](file:///home/caueantonacci/.t3/userdata/providers/antigravity/7be9b928ae8cba283f02640839db79b9ad29c4740201527659e873129d9e1991/config/skills/cinematic-site-hunter/scripts/capture_sites.js) para capturar no mínimo 3 ângulos por site (Hero, Navegação e Detalhe de Serviço/Produto), eliminando automaticamente banners de consentimento e modais intrusivos:

```bash
TMPDIR=/tmp node <caminho_da_skill>/scripts/capture_sites.js --urls "https://site1.com,https://site2.com" --outDir "./screens"
```

---

## 4. Estrutura do Relatório de Benchmarks

Toda busca da skill deve gerar:
1. **Galeria de Capturas**: No mínimo 3 fotos por site selecionado, vinculadas e visualizáveis no ambiente.
2. **Tabela Comparativa Consolidada**:
   - Nome do Site / Marca
   - URL Oficial & Premiação
   - Efeito Visual / Tecnologia Chave
   - 3 Imagens de Amostra (Hero, Seção Média, Detalhe/CTA)
   - Conclusão / Lição de Design aplicável
3. **Recomendações Arquiteturais**: Diretrizes concretas para desenhar e codificar o novo projeto no padrão Awwwards.
