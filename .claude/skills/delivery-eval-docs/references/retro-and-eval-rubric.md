# Referência: Estrutura de Retrospectiva e Rubrica de Evals

## 1. Estrutura Padrão de `docs/EVALUATION-AND-RETROSPECTIVE.md`

```markdown
# Avaliação da entrega e retrospectiva — <Projeto>

<Data>. Avaliação do produto entregue, do processo de desenvolvimento e dos resultados de eval após aprovação do usuário para <escopo>. Distingue evidência técnica, observação visual e aprovação humana; não atribui certificação não testada nem ROI comercial.

## 1. Parecer sobre o produto entregue
(Parágrafo objetivo: o que foi entregue, o que o usuário aprovou, e o que permanece fora de escopo.)

| Dimensão | Estado | Evidência e limite |
| --- | --- | --- |
| Composição e identidade | ... | ... |
| Interatividade e lógica | ... | ... |
| Mobile e responsividade | ... | ... |
| Acessibilidade | ... | ... |
| Performance e autonomia offline | ... | ... |
| Governança de ativos e Slop Ban | ... | ... |
| Documentação e continuidade | ... | ... |

## 2. O que funcionou
- ...

## 3. Falhas do trabalho e melhorias de processo
| Ocorrência real | Consequência | Melhoria aplicada | Verificação / limite |
| --- | --- | --- | --- |

## 4. Skills e ferramentas avaliadas
- ...

## 5. Pendências priorizadas com aceite
1. **Item:** descrição objetiva + critério verificável de aceite.
```

---

## 2. Rubrica Ponderada Recomendada para Evals Web Estáticos / `$cook`

| Pilar | Peso típico | Verificações determinísticas |
|---|---:|---|
| 1. Ativos, Mídia e Autonomia Offline | 20% | Arquivos `<img>` / `<video>` / `SERVICES` locais existem e têm tamanho > 0; zero CDN JS/CSS obrigatória |
| 2. Semântica, Acessibilidade e Mobile | 20% | Viewport meta, landmarks, controle `Escape`/ARIA, contraste WCAG AA (>= 4.5:1) sobre tokens CSS, `@media` mobile, alvos >= 44px, `prefers-reduced-motion` |
| 3. Slop Ban, Dados Reais e Privacidade | 20% | Zero placeholders (`lorem`, `TBD`, `TODO`), zero em dashes (se banido), zero segredos ou `/home/`/`/Users/` nos entregáveis |
| 4. Convergência `$cook` e Telemetria | 20% | Stills e comparativos por rodada existem, checks interativos/mobile sem erros, deltas HSV medidos e nota cega reportada sem inflação |
| 5. Documentação e Consistência de Links | 20% | Zero links markdown relativos quebrados, status de gate alinhado entre ledger/docs/README |

### Regras de Pontuação Honesta
- Se um critério objetivo está ausente (ex.: `@media (prefers-reduced-motion: reduce)` ausente no CSS, ou mediana de críticos cegos abaixo da meta de referência), **desconte pontos proporcionalmente** no pilar correspondente e documente o motivo em `EVAL-REPORT.md`.
- O relatório gerado (`evals/saida/EVAL-REPORT.md`) deve registrar data/hora, comando executado, tabela por pilar, achados exatos e recomendações priorizadas.
