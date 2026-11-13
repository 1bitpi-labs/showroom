# Runbook — Brisa no showroom

## Instalação de revisão existente nesta máquina

Pasta: `/home/caueantonacci/showroom/06-oficinas-e-servicos-tecnicos/elos-pme`. Banco exclusivo `brisa-zod-audit-db` em 55448; aplicação em 3028; base de domínio/testes distinta `brisa_zod_p1_tests`. Configuração privada e dados não são parte do pacote Git. Não imprimir/copiar o ambiente para documentação.

```bash
cd /home/caueantonacci/showroom/06-oficinas-e-servicos-tecnicos/elos-pme
docker start brisa-zod-audit-db
docker exec brisa-zod-audit-db pg_isready -U brisa_audit
PATH="$PWD/node_modules/node/bin:$PATH" npm run start -- --port 3028
```

Executar start somente após readiness. Abrir http://localhost:3028, coerente com a origem da instalação privada. Não usar seed/reset para rever a demonstração. Se porta/container não corresponderem a esta instalação, identificar ownership antes de agir. Nenhum comando deste runbook autoriza interferir em outra instância.

## Desenvolvimento e build

Com o banco próprio pronto, usar Node >=22. `PATH="$PWD/node_modules/node/bin:$PATH" npm run dev -- --port 3028` inicia desenvolvimento. Encerrar apenas o processo próprio antes de `PATH="$PWD/node_modules/node/bin:$PATH" node --env-file=.env.local --import tsx scripts/verified-build.ts`. Manter o banco ativo até o build terminar. Start exige build existente; não executa backend no GitHub Pages.

## Instalação nova

Seguir o README a partir de “Instalação nova”. O exemplo versionado usa app 3017/banco 55439 e não é a configuração da revisão acima. Escolher portas/projeto/volume próprios em ambiente compartilhado; origem do Better Auth, URL do app e banco devem ser coerentes. Migração e seed apenas na nova base confirmada; seed não troca senha de usuário já existente.

## Verificar e encerrar

[TESTING.md](TESTING.md) diferencia domínio/build, browser, apresentação e documentação. `npm test` histórico aponta a outra instalação; não o usar por conveniência. Sem alterações de código, não repetir build só para atualizar docs.

Encerrar servidor próprio com Ctrl+C. `docker stop brisa-zod-audit-db` para somente esse banco, preservando os dados. Não remover volumes. Para backup da revisão, não usar scripts históricos que apontam a outro banco sem conferir seu conteúdo e alvo. Dumps/configuração permanecem privados fora do Git; restaurar deve ser ensaiado em banco vazio próprio.

## Preservação da revisão

Na consolidação de 2026-11-12 foi salvo um pg_dump custom da base sintética própria em `~/.local/state/brisa/backups/`, com dump/manifesto privados (0600), tamanho e SHA-256. O formato foi lido por pg_restore --list; não foi feito novo ensaio de restauração. Configuração privada permanece na instalação original, fora do Git. Somente o container desta revisão foi iniciado/parado para a cópia.
