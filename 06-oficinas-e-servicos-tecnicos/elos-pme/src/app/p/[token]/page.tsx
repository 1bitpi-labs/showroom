"use client";
import { use, useEffect, useRef, useState } from "react";
import { HelpField } from "@/app/components/help-field";
const brl = (v: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(v) / 100,
  );
export default function Portal({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [quote, setQuote] = useState<any>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [kind, setKind] = useState("accepted");
  const key = useRef("");
  useEffect(() => {
    key.current = crypto.randomUUID();
    fetch(`/api/public/${token}`)
      .then(async (r) => {
        const b = await r.json();
        if (!r.ok) throw Error(b.error);
        setQuote(b);
      })
      .catch((e) => setError(e.message));
  }, [token]);
  return (
    <>
      <div className="demo">
        Empresa fictícia • demonstração • dados sintéticos
      </div>
      <main
        className="public"
        style={{ "--teal": quote?.snapshot.brand.color } as React.CSSProperties}
      >
        <header>
          <div>
            <span className="eyebrow">Portal do cliente</span>
            <h1>{quote?.snapshot.brand.name ?? "Seu orçamento"}</h1>
          </div>
          <span className="badge">Conexão direta com a empresa</span>
        </header>
        {error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}
        {!quote && !error && <p role="status">Carregando orçamento…</p>}
        {quote && (
          <>
            <section className="card">
              <div className="row">
                <div>
                  <span className="eyebrow">
                    ORÇAMENTO {String(quote.code).padStart(3, "0")} / REVISÃO{" "}
                    {quote.number}
                  </span>
                  <h2>Olá, {quote.snapshot.client_name}.</h2>
                </div>
                <a href={`/api/pdf/${quote.id}?token=${token}`}>Baixar PDF</a>
              </div>
              <p className="muted">
                Confira os serviços e as condições antes de decidir. Aprovar não
                realiza pagamento nem agenda o serviço automaticamente.
              </p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Serviço</th>
                    <th>Qtd.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.snapshot.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td>
                        {item.description}
                        <br />
                        <small>{brl(item.unit_cents)} / unidade</small>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{brl(item.quantity * item.unit_cents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row">
                <span>Total do orçamento</span>
                <strong className="total">{brl(quote.total_cents)}</strong>
              </div>
              <p className="muted">
                Válido até{" "}
                {new Date(quote.valid_until).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })}
              </p>
              <h3>Condições do serviço</h3>
              <p className="detail muted">{quote.snapshot.conditions}</p>
            </section>
            {quote.kind || success ? (
              <section className="notice" role="status">
                <h2>
                  {(success || quote.kind) === "accepted"
                    ? "Orçamento aprovado."
                    : "Solicitação de alteração registrada."}
                </h2>
                <p>
                  Sua decisão foi salva para esta versão. Nenhum pagamento foi
                  realizado. Combine os próximos passos com a empresa.
                </p>
              </section>
            ) : (
              <form
                className="card"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  setBusy(true);
                  setError("");
                  try {
                    const r = await fetch(`/api/public/${token}`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        kind,
                        name: f.get("name"),
                        note: f.get("note") ?? "",
                        confirmed: f.get("confirmed") === "on",
                        idempotency_key: key.current,
                      }),
                    });
                    const b = await r.json();
                    if (!r.ok) throw Error(b.error);
                    setSuccess(b.status);
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <h2>Como deseja seguir?</h2>
                <HelpField
                  label="Sua decisão"
                  help="Aprovar registra sua concordância com esta revisão e gera uma ordem de serviço. Solicitar alteração envia uma observação para a empresa, sem aprovar nem alterar preços."
                >
                  <select
                    value={kind}
                    onChange={(e) => {
                      setKind(e.target.value);
                      key.current = crypto.randomUUID();
                    }}
                  >
                    <option value="accepted">Aprovar este orçamento</option>
                    <option value="change_requested">
                      Solicitar uma alteração
                    </option>
                  </select>
                </HelpField>
                <HelpField
                  label="Seu nome"
                  help="Informe o nome de quem está decidindo sobre a proposta. Ele ficará registrado com a revisão e a data da decisão. Não informe CPF ou dados bancários."
                >
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                  />
                </HelpField>
                {kind === "change_requested" && (
                  <HelpField
                    label="O que precisa mudar?"
                    help="Explique o ajuste desejado, como quantidade ou serviço. A empresa precisará publicar uma nova revisão e enviar outro link; este pedido não muda o orçamento automaticamente."
                  >
                    <textarea
                      name="note"
                      required
                      minLength={3}
                      maxLength={1000}
                    />
                  </HelpField>
                )}
                <label>
                  <input type="checkbox" name="confirmed" required />
                  Li a revisão {quote.number}, no total de{" "}
                  {brl(quote.total_cents)}, e confirmo a decisão selecionada.
                </label>
                <p className="muted">
                  Este registro é uma confirmação operacional. Não é uma
                  assinatura digital certificada.
                </p>
                <button disabled={busy}>
                  {busy
                    ? "Registrando…"
                    : kind === "accepted"
                      ? "Confirmar aprovação"
                      : "Enviar solicitação"}
                </button>
              </form>
            )}
          </>
        )}
        <footer className="muted">
          Brisa Oficina / demonstração ElosPME. Dados fictícios; este portal não
          cobra e não envia mensagens.
        </footer>
      </main>
    </>
  );
}
