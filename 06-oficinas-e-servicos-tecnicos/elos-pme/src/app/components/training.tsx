"use client";
import { useEffect, useRef, useState } from "react";
import { clientVideo } from "@/lib/client-video";
import { TOUR_VERSION, tours } from "@/lib/training-content";
type Progress = {
  tour: string;
  version: number;
  status: "skipped" | "completed";
  completed_at: string | null;
};
type Notice = {
  id: string;
  title: string;
  body: string;
  tour: string;
  read_at: string | null;
  created_at: string;
};
export function useTraining(tab: string) {
  const [data, setData] = useState<{
    progress: Progress[];
    notifications: Notice[];
  }>();
  const [error, setError] = useState("");
  const [active, setActive] = useState<{
    tour: string;
    step: number;
    mode?: "choice" | "video" | "text";
    opening?: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const opening = useRef(0);
  const returnFocus = useRef<HTMLElement | null>(null);
  const lastClientField = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const remember = (event: FocusEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.matches(
          '[data-tour="clients-form"] input, [data-tour="clients-form"] textarea',
        )
      )
        lastClientField.current = target;
    };
    document.addEventListener("focusin", remember);
    return () => document.removeEventListener("focusin", remember);
  }, []);
  function restoreFocus() {
    requestAnimationFrame(() => {
      const target = returnFocus.current?.isConnected
        ? returnFocus.current
        : document.querySelector<HTMLElement>(
            '[data-tour="clients-form"] input',
          );
      target?.focus();
    });
  }
  const shown = useRef(new Set<string>());
  async function request(body?: unknown) {
    const r = await fetch(
      "/api/training",
      body
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {},
    );
    const b = await r.json();
    if (!r.ok) throw Error(b.error);
    return b;
  }
  async function load() {
    try {
      setData(await request());
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (
      data &&
      Object.hasOwn(tours, tab) &&
      !active &&
      !shown.current.has(tab) &&
      !data.progress.some((p) => p.tour === tab && p.version === TOUR_VERSION)
    ) {
      shown.current.add(tab);
      returnFocus.current = document.querySelector<HTMLElement>(
        '[data-tour="clients-form"] input',
      );
      setActive({
        tour: tab,
        step: 0,
        opening: ++opening.current,
        mode: tab === "clients" ? "choice" : "text",
      });
    }
  }, [tab, data, active]);
  function start(tour = tab, mode?: "video" | "text") {
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (tour === "clients" && lastClientField.current?.isConnected)
      returnFocus.current = lastClientField.current;
    if (!Object.hasOwn(tours, tour)) return;
    shown.current.add(tour);
    setError("");
    setActive({
      tour,
      step: 0,
      opening: ++opening.current,
      mode: mode ?? (tour === "clients" ? "choice" : "text"),
    });
  }
  async function finish(status: "skipped" | "completed") {
    if (!active || saving) return;
    const requestOpening = active.opening;
    setSaving(true);
    setError("");
    try {
      await request({
        tour: active.tour,
        version: TOUR_VERSION,
        status,
        step: active.step,
      });
      if (opening.current === requestOpening) {
        setActive(null);
        restoreFocus();
      }
      await load();
    } catch (e) {
      if (opening.current === requestOpening) setError((e as Error).message);
    } finally {
      if (opening.current === requestOpening) setSaving(false);
    }
  }
  async function read(id: string) {
    try {
      await request({ action: "read", id });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return {
    closeLocal: () => {
      ++opening.current;
      setActive(null);
      setSaving(false);
      setError(
        "Registro não confirmado. A ajuda pode reaparecer após recarregar.",
      );
      restoreFocus();
    },
    data,
    error,
    active,
    setActive,
    saving,
    start,
    finish,
    read,
    load,
    unread: data?.notifications.filter((n) => !n.read_at).length ?? 0,
  };
}
type Training = ReturnType<typeof useTraining>;
export function TrainingDialog({ training: t }: { training: Training }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mediaError, setMediaError] = useState(false);
  const [ended, setEnded] = useState(false);
  const [chapter, setChapter] = useState("");
  const pilot = t.active?.tour === "clients";
  const mode = t.active?.mode ?? "text";
  useEffect(() => {
    setMediaError(false);
    setEnded(false);
    setChapter("");
  }, [t.active?.opening]);
  function changeMode(next: "video" | "text") {
    video.current?.pause();
    t.setActive((a) => (a ? { ...a, mode: next } : null));
  }
  const definition = t.active ? tours[t.active.tour] : null;
  const step = definition && t.active ? definition.steps[t.active.step] : null;
  useEffect(() => {
    if (t.active) {
      if (!dialog.current?.open) dialog.current?.showModal();
    } else dialog.current?.close();
  }, [t.active]);
  useEffect(() => {
    if (!step?.target || (pilot && mode !== "text")) return;
    const target = document.querySelector(`[data-tour="${step.target}"]`);
    target?.classList.add("tour-target");
    target?.scrollIntoView({ block: "center", behavior: "instant" });
    return () => target?.classList.remove("tour-target");
  }, [step, pilot, mode]);
  return (
    <dialog
      ref={dialog}
      className={`training-dialog ${pilot ? "training-pilot" : ""}`}
      aria-labelledby="tour-title"
      aria-describedby="tour-description"
      onCancel={(e) => {
        e.preventDefault();
        video.current?.pause();
        void t.finish("skipped");
      }}
    >
      {definition && step && t.active && (
        <>
          <div className="row">
            <span className="eyebrow">
              {pilot && mode !== "text"
                ? "Ajuda em Clientes"
                : `Treinamento guiado · ${t.active.step + 1} de ${definition.steps.length}`}
            </span>
            <span className="badge">{definition.title}</span>
          </div>
          <h2 id="tour-title">
            {pilot && mode !== "text"
              ? "Clientes: cadastre e encontre seus contatos"
              : step.title}
          </h2>
          {pilot && (
            <>
              <div className="actions training-modes">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => changeMode("video")}
                  aria-pressed={mode === "video"}
                >
                  Ver exemplo · {clientVideo.durationLabel}
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => changeMode("text")}
                  aria-pressed={mode === "text"}
                >
                  Consultar passos
                </button>
                <button
                  type="button"
                  disabled={t.saving}
                  onClick={() => {
                    video.current?.pause();
                    void t.finish("skipped");
                  }}
                >
                  Voltar a Clientes
                </button>
              </div>
              <p id={mode !== "text" ? "tour-description" : undefined}>
                O vídeo mostra a interface anterior; nesta versão, comece por
                Adicionar cliente. Os passos textuais refletem a interface
                atual. Escolha como consultar. Você pode voltar a Clientes a
                qualquer momento, sem concluir o guia.
              </p>
              <div hidden={mode !== "video"}>
                {mediaError ? (
                  <p role="alert">
                    Vídeo indisponível. Consulte os passos ou volte a Clientes.
                  </p>
                ) : (
                  <video
                    ref={video}
                    controls
                    playsInline
                    preload="metadata"
                    poster={clientVideo.poster}
                    onEnded={() => setEnded(true)}
                    onError={() => setMediaError(true)}
                  >
                    <source
                      src={clientVideo.src}
                      type="video/mp4"
                      onError={() => setMediaError(true)}
                    />
                    <track
                      kind="captions"
                      src={clientVideo.captions}
                      srcLang="pt-BR"
                      label="Português brasileiro"
                      default
                    />
                  </video>
                )}
                {ended && (
                  <p role="status">
                    Exemplo encerrado. Volte a Clientes para usar o cadastro ou
                    consulte os passos.
                  </p>
                )}
                <nav aria-label="Capítulos do exemplo" className="actions">
                  {clientVideo.chapters.map((c) => (
                    <button
                      type="button"
                      className="secondary small"
                      key={c.title}
                      onClick={() => {
                        if (video.current) {
                          video.current.pause();
                          video.current.currentTime = c.seconds;
                          setChapter(c.title);
                          setEnded(false);
                        }
                      }}
                    >
                      {c.title}
                    </button>
                  ))}
                </nav>
                <p role="status" className="muted">
                  {chapter &&
                    `Capítulo ${chapter}. Use Reproduzir para continuar.`}
                </p>
                <details>
                  <summary>Transcrição e descrição das ações</summary>
                  <p>{clientVideo.transcript}</p>
                </details>
              </div>
            </>
          )}
          {pilot && t.error && (
            <p role="alert" className="notice error">
              {t.error}
            </p>
          )}
          <div hidden={pilot && mode !== "text"}>
            <p id={!pilot || mode === "text" ? "tour-description" : undefined}>
              {step.text}
            </p>
            <div className="tour-progress" aria-hidden="true">
              {definition.steps.map((_, i) => (
                <span key={i} className={i <= t.active!.step ? "filled" : ""} />
              ))}
            </div>
            <p className="muted">
              Você está conhecendo a aba. Nenhum dado de operação é alterado por
              este guia.
            </p>
            {t.error && (
              <p role="alert" className="notice error">
                {t.error}
              </p>
            )}
            <div className="actions">
              {!pilot && (
                <button
                  type="button"
                  className="secondary"
                  disabled={t.saving}
                  onClick={() => t.finish("skipped")}
                >
                  Ver depois
                </button>
              )}
              {t.active.step > 0 && (
                <button
                  type="button"
                  className="secondary"
                  disabled={t.saving}
                  onClick={() =>
                    t.setActive((a) => (a ? { ...a, step: a.step - 1 } : null))
                  }
                >
                  Voltar
                </button>
              )}
              {t.active.step < definition.steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    t.setActive((a) => (a ? { ...a, step: a.step + 1 } : null))
                  }
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="button"
                  disabled={t.saving}
                  onClick={() => t.finish("completed")}
                >
                  {t.saving ? "Registrando…" : "Concluir treinamento"}
                </button>
              )}
            </div>
          </div>
          {(t.error || t.saving) && (
            <button
              type="button"
              className="secondary small"
              onClick={() => {
                video.current?.pause();
                t.closeLocal();
              }}
            >
              Fechar sem confirmar registro
            </button>
          )}
        </>
      )}
    </dialog>
  );
}
export function TrainingInbox({
  training: t,
  onReplay,
}: {
  training: Training;
  onReplay: (tour: string, mode?: "video" | "text") => void;
}) {
  return (
    <section className="card" data-tour="inbox-panel">
      <div className="row">
        <h2>Caixa de entrada e treinamentos</h2>
        <span className="badge">{t.unread} não lidas</span>
      </div>
      <p className="muted">
        Avisos da sua conta. Concluir um guia registra leitura, sem certificar
        execução prática.
      </p>
      {!t.data ? (
        <p role="status">Carregando seus avisos…</p>
      ) : (
        <>
          <div className="training-summary">
            <label htmlFor="training-progress">
              Guias com leitura concluída:{" "}
              {
                Object.keys(tours).filter((key) =>
                  t.data!.progress.some(
                    (p) =>
                      p.tour === key &&
                      p.version === TOUR_VERSION &&
                      p.status === "completed",
                  ),
                ).length
              }{" "}
              de {Object.keys(tours).length}
            </label>
            <progress
              id="training-progress"
              max={Object.keys(tours).length}
              value={
                Object.keys(tours).filter((key) =>
                  t.data!.progress.some(
                    (p) =>
                      p.tour === key &&
                      p.version === TOUR_VERSION &&
                      p.status === "completed",
                  ),
                ).length
              }
            />
          </div>
          <h3>Treinamentos por aba</h3>
          <div className="training-register">
            {Object.entries(tours).map(([key, tour]) => {
              const p = t.data!.progress.find(
                (p) => p.tour === key && p.version === TOUR_VERSION,
              );
              return (
                <div className="training-row" key={key}>
                  <strong>
                    {tour.title}
                    <small className="training-format">
                      {key === "clients"
                        ? "Vídeo e passo a passo"
                        : "Passo a passo"}
                    </small>
                  </strong>
                  <span
                    className={`badge ${p?.status === "completed" ? "completed" : ""}`}
                  >
                    {p?.status === "completed"
                      ? "Concluído"
                      : p?.status === "skipped"
                        ? "Ver depois"
                        : "Não iniciado"}
                  </span>
                  <button
                    className="secondary small"
                    onClick={() => onReplay(key, "text")}
                  >
                    Consultar passos: {tour.title}
                  </button>
                  {key === "clients" && (
                    <button
                      type="button"
                      className="secondary small"
                      onClick={() => onReplay(key, "video")}
                    >
                      Ver exemplo: Clientes
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <h3>Notificações</h3>
          {t.data.notifications.length === 0 && (
            <p className="muted">
              Nenhum aviso. Ao concluir um treinamento, o registro aparece aqui.
            </p>
          )}
          {t.data.notifications.map((n) => (
            <article
              key={n.id}
              className={`inbox-message ${n.read_at ? "" : "unread"}`}
            >
              <div className="row">
                <h3>{n.title}</h3>
                <span className="badge">{n.read_at ? "Lida" : "Não lida"}</span>
              </div>
              <p>{n.body}</p>
              <p className="muted">
                {new Date(n.created_at).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })}
              </p>
              <div className="actions">
                {!n.read_at && (
                  <button
                    className="secondary small"
                    onClick={() => t.read(n.id)}
                  >
                    Marcar como lida
                  </button>
                )}
                <button
                  className="secondary small"
                  onClick={() => onReplay(n.tour)}
                >
                  Refazer guia
                </button>
              </div>
            </article>
          ))}
        </>
      )}
    </section>
  );
}
