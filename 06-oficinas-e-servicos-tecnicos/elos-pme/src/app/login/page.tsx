"use client";
import { useState } from "react";
export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <div className="demo">
        Empresa fictícia • demonstração • dados sintéticos
      </div>
      <main className="login">
        <div className="brand">
          brisa oficina<small>CLIMATIZAÇÃO DEMO</small>
        </div>
        <h1>Seu trabalho, organizado.</h1>
        <p className="muted">
          Entre para acompanhar orçamentos e ordens de serviço.
        </p>
        <form
          className="card"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setBusy(true);
            const f = new FormData(e.currentTarget);
            try {
              const r = await fetch("/api/auth/sign-in/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: f.get("email"),
                  password: f.get("password"),
                }),
              });
              if (!r.ok)
                throw new Error(
                  "E-mail ou senha inválidos. Aguarde se houver muitas tentativas.",
                );
              window.location.href = "/";
            } catch (e) {
              setError((e as Error).message);
              setBusy(false);
            }
          }}
        >
          <label>
            E-mail
            <input type="email" name="email" autoComplete="username" required />
          </label>
          <label>
            Senha
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>
          {error && (
            <p role="alert" className="notice error">
              {error}
            </p>
          )}
          <button disabled={busy}>
            {busy ? "Entrando…" : "Entrar no painel"}
          </button>
        </form>
        <p className="muted">
          Acesso restrito ao operador. Precisa recuperar o acesso? Consulte o
          responsável pela instalação.
        </p>
      </main>
    </>
  );
}
