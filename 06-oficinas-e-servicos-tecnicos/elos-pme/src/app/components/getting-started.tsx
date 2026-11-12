"use client";
import { guideSteps } from "@/lib/usage-guide";
export function GettingStarted({
  full = false,
  onHide,
  onStart,
}: {
  full?: boolean;
  onHide?: () => void;
  onStart: () => void;
}) {
  return (
    <section
      className={`card getting-started ${full ? "full-guide" : "compact-guide"}`}
      aria-label={full ? "Guia de uso" : "Primeiros passos"}
    >
      <div className="row">
        <div>
          <span className="eyebrow">Seu guia de operação</span>
          <h2>{full ? "Guia de uso" : "Primeiros passos, sem mistério."}</h2>
        </div>
        {onHide && (
          <button type="button" className="secondary small" onClick={onHide}>
            Ocultar primeiros passos
          </button>
        )}
      </div>
      <p className="muted">
        Do orçamento ao serviço, com uma decisão registrada em cada etapa. Use
        os botões “?” junto aos campos sempre que precisar.
      </p>
      <details open={full ? true : undefined}>
        <summary>Ver o caminho do orçamento ao serviço</summary>
        <ol className="guide-steps">
          {guideSteps.map((step, i) => (
            <li key={step.title}>
              <span className="step-number" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p className="muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </details>
      <button type="button" onClick={onStart}>
        Criar meu orçamento
      </button>
      {!full && (
        <p className="muted guide-footnote">
          Este resumo pode ser ocultado. O conteúdo continua disponível em Guia
          de uso.
        </p>
      )}
      {full && (
        <>
          <h3 className="guide-section-title">Dúvidas frequentes</h3>
          <details>
            <summary>Como organizo clientes, aparelhos e visitas?</summary>
            <p>
              Cadastre o cliente em Clientes e vincule seus aparelhos em
              Equipamentos. Na Agenda, selecione cliente, aparelho e, se houver,
              uma OS do mesmo cliente. Informe técnico, horário e duração. A
              lista mostra São Paulo; a entrada usa o fuso do dispositivo.
            </p>
          </details>
          <details>
            <summary>Visita concluída também conclui a OS?</summary>
            <p>
              Não. A Agenda organiza os atendimentos. Atualize a OS em Ordens de
              serviço quando o trabalho estiver concluído. Nenhuma etapa envia
              mensagens ou confirma pagamento.
            </p>
          </details>
          <details>
            <summary>Onde vejo meus treinamentos?</summary>
            <p>
              Cada aba apresenta um guia na primeira visita. Concluir registra a
              leitura em Caixa de entrada, na sua conta. Ver depois não conta
              como conclusão. Use Ajuda nesta aba ou o botão da notificação para
              repetir.
            </p>
          </details>
          <details>
            <summary>Rascunho, publicação e revisão: qual a diferença?</summary>
            <p>
              Rascunhos podem ser editados e ainda não têm link público.
              Publicar fixa uma versão dos serviços e condições. Para modificar
              um orçamento enviado, publique uma nova revisão e envie o novo
              link. Orçamentos aprovados permanecem preservados: crie outro
              orçamento para uma nova proposta.
            </p>
          </details>
          <details>
            <summary>Perdi o link. E agora?</summary>
            <p>
              O link é exibido após publicar e não pode ser recuperado no banco.
              Para um orçamento ainda não aprovado, use Nova revisão e
              compartilhe o novo link. O anterior deixa de funcionar.
            </p>
          </details>
          <details>
            <summary>Revogar ou cancelar?</summary>
            <p>
              Revogar bloqueia o acesso público e preserva o histórico e
              decisões. Cancelar encerra uma proposta ainda não aprovada e
              bloqueia seus links. Uma OS pode ser cancelada separadamente, com
              motivo, enquanto pendente ou em andamento.
            </p>
          </details>
          <details>
            <summary>A aprovação cobra ou agenda automaticamente?</summary>
            <p>
              Não. Ela registra a decisão sobre aquela revisão e cria uma OS
              pendente. Combine execução e pagamento diretamente com o cliente.
              Este registro não é uma assinatura digital certificada.
            </p>
          </details>
          <details>
            <summary>Onde encontro PDF, exportação e backup?</summary>
            <p>
              Histórico / PDF mostra documentos publicados e decisões. Exportar
              CSV baixa a lista de orçamentos. Backup e recuperação de acesso
              são feitos pelo responsável pela instalação conforme o manual de
              operação; não são realizados pelo CSV.
            </p>
          </details>
        </>
      )}
    </section>
  );
}
