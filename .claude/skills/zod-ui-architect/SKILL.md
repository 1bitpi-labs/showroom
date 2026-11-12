---
name: zod-ui-architect
description: Consulta o catálogo Zod UI por quadrante e tier, unifica tokens, escreve ZOD_UI_BLUEPRINT.md e implementa sites, redesigns e componentes com rastreabilidade.
---

# Zod UI — arquitetura de interfaces

Siga o escopo solicitado: em revisão/curadoria, entregue diagnóstico e blueprint; execute a implementação quando fizer parte do pedido. Para outro projeto, use o catálogo compartilhado informado, neste ambiente `/home/caueantonacci/showroom/zod-ui-catalog`, sem criar uma cópia vazia local. O guia de uso é `docs/OPERATING-GUIDE.md` dentro dessa raiz.

1. Leia package.json quando existir, configurações CSS, estrutura e tokens do projeto alvo. Identifique framework, ícones e motion disponíveis.
2. Antes de escrever UI, decomponha o pedido em slots e consulte `zod-ui-catalog/index/master-index.json` na raiz do workspace. Abra apenas quadrantes necessários: Q1 estrutura/nav, Q2 conversão/conteúdo, Q3 atmosfera, Q4 UX/motion. Navegue categoria/seção; leia artefatos dos candidatos.
3. Selecione por aderência ao produto e ao slot; um efeito decorativo S não substitui um controle funcional necessário. Prefira S+/S verificados, depois A. B exige correção estrutural; C serve apenas como especificação para implementação própria. Exclua D/F. Verifique licença, evidências e stack; documente portabilidade fiel quando necessária. Se o catálogo estiver vazio ou sem aderência, informe a lacuna no blueprint e implemente a partir do pedido com proveniência `original`, sem inventar IDs ou tiers.
4. Antes de criar arquivos de interface, escreva `ZOD_UI_BLUEPRINT.md` na raiz do projeto alvo e apresente resumo. Normalize cores (--bg, --fg, --primary, --muted, --border), tipografia, espaçamento e raios sob o blueprint Q1 escolhido; se ausente, defina contrato original explícito. Confirme ativos e licenças, mobile/desktop, hover/focus/active/disabled quando aplicáveis, teclado e reduced-motion. Inclua tabela `Slot | Quadrante/Categoria/Seção | ID Zod UI | Tier | Origem | Adaptação Necessária` e lacunas/evidências pendentes. O blueprint é contrato de execução, não pedido adicional de aprovação.
5. Implemente segundo o contrato, execute build/typecheck disponíveis. Se designlang/verify_ui estiver disponível, confirme o comando e valide contra URL local. Caso indisponível, registre a limitação e realize verificações possíveis sem alegar auditoria inexistente. Respeite as regras de browser do ambiente.

Consulta opcional e somente leitura: `python3 /home/caueantonacci/showroom/zod-ui-catalog/scripts/query_catalog.py --quadrant Q2 --stack React`. Use `--id <id> --artifact --json` para ler o payload do finalista. Os filtros não substituem a inspeção de licença, previews, dependências e notas de auditoria.
