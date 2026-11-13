# Brief: Marina Porto Ilhabela — Redesign Editorial Wally Style

Target: Construir um site web completo, navegável e autônomo em português do Brasil para a Marina Porto Ilhabela (`https://www.marinaportoilhabela.com.br/`), aplicando a linguagem arquitetônica minimalista, formas geométricas chanfradas e fotografia marítima de alto contraste do benchmark Wally Yachts. Stack: HTML5, CSS3 moderno (Grid, custom properties, clip-path geométrico com cantos suavizados via SVG/CSS) e JavaScript ES6+ sem dependências externas em runtime.

References: `cook/refs/R01.png` (`05_wally_1.png`), `cook/refs/R02.png` (`05_wally_2.png`), `cook/refs/R03.png` (`05_wally_3.png`), modo **same quality, own style** (mesma barra de qualidade visual, luz, contraste, respiro branco editorial, geometria chanfrada e rigor tipográfico em português do Brasil com os ativos reais da Marina Porto Ilhabela).

Bar:
- Composition (layout, espaçamento, assimetria, respiro, horizonte): 95+ / 100
- Light (direção, contraste tonal, atmosfera marítima e fundos puros `#FFFFFF`): 95+ / 100
- Color (paleta marítima profunda no hero + branco puro e grafite `#282A2B` no editorial, zero cinza lavado): 95+ / 100
- Typography / Materials (hierarquia bold geométrica, botões pílula grafite, bordas chanfradas assimétricas com cantos arredondados): 95+ / 100
- Detail density (ativos reais nítidos, micro-detalhes operacionais reais, sem poluição ou elementos vazios): 95+ / 100
- Motion / Interaction: 9/10 (menu overlay fullscreen Wally, seletor interativo de vagas/serviços, modal concierge WhatsApp, transições suaves)

Calibration offset: none yet (validado por críticos cegos zero-context + medição objetiva HSV por célula).

Rules:
- Ativos reais obrigatórios em `assets/` (vídeo 1080p `hero-sea.mp4`, fotos reais da marina, rebocadores Seahorse/Rino, poitas, piscina, família Möller e emblema oficial de 3 velas). Zero placeholders ou lorem ipsum.
- **Slop Ban List (Proibição Estrita):** ZERO eyebrow labels, ZERO texto monospace uppercase, ZERO fontes serifadas aleatórias, ZERO gradientes roxos, ZERO bege, ZERO contadores `01 / 02 / 03`, ZERO glowing orbs, ZERO shockwave rings, ZERO partículas decorativas, ZERO linhas decorativas longas e finas, ZERO em dashes (`—`).
- Dados reais verificáveis: Av. Alm. Tamandaré, 304 - Itaquanda, Ilhabela - SP | `23º 47,9' S - 45º 21,9' W` | VHF Delta 38 | Tel `(12) 3896-1243` | WhatsApp `+55 12 99634-2782` | `secretaria@marinaportoilhabela.com.br` | `@marinaportoilhabela`.

Time: hard cap 1.5h. Started: 2026-11-13 10:43 -03.
Deliverable: Site funcional local em `projetos/marina-porto-ilhabela/index.html` + stills S01-S03 e comparativos lado a lado validados em pelo menos 3 rodadas do Cook Loop.
Permissions: download real client assets yes (already saved locally), push no, publish no.
User's words: "same quality, own style em português do Brasil para o cliente vencedor, com Time: hard cap 1.5h, usando os ativos reais extraídos do cliente no lugar de placeholders."
