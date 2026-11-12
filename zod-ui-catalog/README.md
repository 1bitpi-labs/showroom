# Zod UI

Catálogo compartilhado pelas skills `.claude/skills/zod-ui-cataloger` e `.claude/skills/zod-ui-architect`.

Estado atual: **53 itens — 14 S, 20 A e 19 C**. S/A têm código MIT e evidência de render local; C contém referências/specs com limites explícitos. Leia [o relatório](audits/REPORT.md) antes de tratar qualquer tier como garantia para um projeto específico.

O [guia operacional](docs/OPERATING-GUIDE.md) documenta o uso das skills, o processo executado, a categorização, os artefatos salvos e os fluxos de extração e busca.

Comece por `index/master-index.json` e leia apenas os quadrantes necessários. Cada item declara origem, licença, compatibilidade, adaptações e evidências. As seções estão no mapa do master. Os índices não contam dependências ou variantes como componentes novos.

```sh
python3 zod-ui-catalog/scripts/validate_catalog.py
```

Para reproduzir os novos componentes e a auditoria: [fixture do lote 2](audits/batch-2/fixture/README.md). O renderer geral `scripts/visual_tier_grader.py` aceita `--url`, `--output`, `--reference` e `--browser-executable`. Instale `playwright` e `Pillow` em ambiente Python isolado e disponibilize Chromium.

Scores de pixels não determinam tiers nem certificam acessibilidade. Consulte os audit.json e a revisão manual. Não copie código ou assets de uma referência C sem verificar a licença correspondente.

Consulta somente leitura (por padrão S+/S/A):

```sh
python3 zod-ui-catalog/scripts/query_catalog.py --quadrant Q2 --stack React
python3 zod-ui-catalog/scripts/query_catalog.py --id shadcn-dialog --artifact --json
```
