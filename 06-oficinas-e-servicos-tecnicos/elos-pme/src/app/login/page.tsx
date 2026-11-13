"use client";
import { BrisaBrand, BrisaIcon, BrisaMark } from "../components/brisa-identity";
import { useState } from "react";
export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <div className="demo">
        Empresa fictícia • demonstração • dados sintéticos
      </div>
      <div className="login-layout">
        <section className="login-story">
          <BrisaBrand />
          <div className="login-editorial">
            <span className="eyebrow">Gestão com leveza.</span>
            <h2>
              Cuidar de cada detalhe.
              <br />
              <em>Esse é o seu jeito.</em>
            </h2>
            <p>
              Clientes, propostas e serviços conectados em um espaço feito para
              a sua operação.
            </p>
            <div className="wind-signature" aria-hidden="true">
              <BrisaMark />
              <span>
                Precisão na operação.
                <br />
                Tranquilidade no dia a dia.
              </span>
            </div>
          </div>
          <span className="login-story-footer">
            BRISA OFICINA <span>Climatização & serviços</span>
          </span>
        </section>
        <main className="login">
          <span className="eyebrow">Bem-vindo ao seu espaço</span>
          <h1>Bom ter você aqui.</h1>
          <p className="muted">Entre para cuidar da sua operação.</p>
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
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
              />
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
              <BrisaIcon name="arrow" size={18} />
            </button>
          </form>
          <p className="muted">
            Acesso restrito ao operador. Precisa recuperar o acesso? Consulte o
            responsável pela instalação.
          </p>
        </main>
      </div>
    </>
  );
}
