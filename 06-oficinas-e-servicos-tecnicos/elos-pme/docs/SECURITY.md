# Security — controles e limites

Autenticação Better Auth; cadastro público bloqueado. Sessão exigida em rotas internas; origem validada em mutações; Zod estrito recusa payloads extras. Identidade de treinamento vem da sessão. Tokens públicos aleatórios são armazenados como hash, com validade/revogação/revisão vigente. GET não decide. Rate limiting protege login/rotas públicas; não desativá-lo para fazer teste passar.

HTTP usa no-referrer, nosniff, DENY e no-store nas regras da aplicação. Snapshot gera PDF sem recursos remotos; React escapa conteúdo; CSV tem defesa contra formula injection no domínio. Sem upload/integração externa operacional. Escapes/integridade e concorrência têm testes; não equivale a pentest.

`.env.local`, `.tsf/state/`, dumps, sessões, cookies, tokens e senhas nunca entram em docs/logs versionados. Preferir resumo de erro a traces de request com cookie. Contas sintéticas também têm sessão e exigem redação de traces. Protótipo inclui dependências externas e fixtures: arquivar como referência; não executar como aplicativo de produção ou copiar `innerHTML` com dados livres.

Readiness/build deve falhar antes de Next quando banco indisponível; não suprimir logs de autenticação ou desativar checagem para obter verde. Bancos/worktrees exclusivos por entrega preservam trabalho do operador.

Antes de exposição: revisão independente, configuração de host/TLS, banco com permissões proporcionais, retenção acordada, backups cifrados/restore, logs redigidos, monitoramento e gates humanos. Não há política jurídica de retenção ratificada, auditoria WCAG completa ou G1 inferido. Sem autorização de push/deploy/custos/cron pela documentação.
