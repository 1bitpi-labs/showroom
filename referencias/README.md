# Referências, Discovery & Design System (`referencias/`)

Materiais de apoio ao desenvolvimento de sites, protótipos e produtos no repositório `showroom` (mantidos separados da vitrine pública em `projetos/` e `verticais/`).

| Diretório / Arquivo | Finalidade | Ponto de Entrada |
| :--- | :--- | :--- |
| **`zod-ui-catalog/`** | Catálogo compartilhado de componentes, shaders e blueprints visuais classificados por quadrante e tier (`S+` a `F`) | [README](./zod-ui-catalog/README.md) · [Guia Operacional](./zod-ui-catalog/docs/OPERATING-GUIDE.md) |
| **`benchmarks-nauticos/`** | Capturas em alta resolução (`screens/`) e auditoria de 7 sites náuticos premiados (Awwwards / FWA) | [Relatório Comparativo](./benchmarks-nauticos/BENCHMARKS_NAUTICOS_AWWWARDS.md) |
| **`discovery/`** | Matrizes de avaliação de clientes reais e extratibilidade de ativos antes de iniciar o `$cook` | [Marina Porto Ilhabela Evaluation](./discovery/marina-porto-ilhabela-evaluation.md) |

## Skills Associadas (`.claude/skills/`)

- [`zod-ui-architect`](../.claude/skills/zod-ui-architect/SKILL.md) e [`zod-ui-cataloger`](../.claude/skills/zod-ui-cataloger/SKILL.md)
- [`cinematic-site-hunter`](../.claude/skills/cinematic-site-hunter/SKILL.md) · [`cook`](../.claude/skills/cook/SKILL.md) · [`client-cook-pipeline`](../.claude/skills/client-cook-pipeline/SKILL.md) · [`delivery-eval-docs`](../.claude/skills/delivery-eval-docs/SKILL.md)

## Validação Rápida do Catálogo Zod UI

```sh
python3 referencias/zod-ui-catalog/scripts/validate_catalog.py
```
