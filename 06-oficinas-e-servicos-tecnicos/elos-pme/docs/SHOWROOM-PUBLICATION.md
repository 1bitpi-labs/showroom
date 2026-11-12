# Inclusão pública no showroom

2026-11-12. Operador autorizou explicitamente código completo e documentação no repositório público 1bitpi-labs/showroom. Importação de snapshot 2833a4f, sem histórico Git privado, configurações de ambiente, bancos, dependências ou estado TSF. Referência HTML original incluída como protótipo; não é backend integrado.

Pacote: 06-oficinas-e-servicos-tecnicos/elos-pme/. Node/PostgreSQL são executados a partir dessa pasta; GitHub Pages não executa o app. Nenhum deploy/merge foi realizado na inclusão. A demonstração automotiva existente continua separada.

Ajustes de distribuição: senhas fixas de QA substituídas por DEMO_PASSWORD do ambiente nos scripts; manifesto de hashes atualizado para o pacote; espaços finais normalizados no HTML de referência e log textual, sem alterar comportamento. Credenciais de CI são fixtures efêmeras de banco/auth, sem acesso real. O workflow verifica somente o pacote ElosPME, com PostgreSQL temporário, Node22, tipos, domínio, harness e build.

Validação local do pacote importado: npm ci próprio; TypeScript; 22 testes domínio/PostgreSQL em banco elos_showroom_ci próprio/55441; 13 testes harness; links locais e 78 hashes; diff --check. Build final registrado na revisão. Scanner de padrões textuais não encontrou tokens/chaves privadas/cookies nos arquivos destinados ao commit; não equivale a auditoria completa de segurança.

Evidências sintéticas incluídas; traces de tentativas foram redigidos antes da importação. Nenhuma fonte audiovisual privada de pesquisa foi copiada. As mídias em public/training são os assets sintéticos versionados do próprio app, com nota de interface anterior. G1 e produtividade humana não foram inferidos.
