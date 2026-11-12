"use client";
import { useEffect, useState, useRef } from "react";
import { HelpField } from "./components/help-field";
import { GettingStarted } from "./components/getting-started";
import { nextSteps, eventLabels } from "@/lib/usage-guide";
import {
  useTraining,
  TrainingDialog,
  TrainingInbox,
} from "./components/training";
import {
  OperationsPanel,
  ExistingClientPicker,
} from "./components/operations-panel";
type Item = { description: string; quantity: number; unit_cents: number };
type Quote = {
  contact: string;
  client_id: string;
  id: string;
  code: string;
  display_status: string;
  total_cents: string;
  current_revision: number;
  snapshot: { client_name: string; conditions: string; items: Item[] };
};
type Order = {
  id: string;
  code: string;
  status: string;
  snapshot: { client_name: string };
};
const labels: Record<string, string> = {
  draft: "Rascunho",
  sent: "Enviado",
  accepted: "Aprovado",
  change_requested: "Alteração solicitada",
  expired: "Expirado",
  cancelled: "Cancelado",
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluído",
};
const brl = (v: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(v) / 100,
  );
const initial = {
  client_id: undefined as string | undefined,
  client_name: "",
  contact: "",
  conditions:
    "Serviço sujeito à avaliação técnica. Valores e condições válidos pelo prazo indicado.",
  valid_days: 7,
  items: [
    {
      description: "Higienização de ar-condicionado",
      quantity: 1,
      unit_cents: 18000,
    },
  ],
};
export default function Dashboard() {
  const [data, setData] = useState<{
    quotes: Quote[];
    orders: Order[];
    settings: { name: string; demo: boolean; color: string };
  }>();
  const [tab, setTab] = useState("quotes");
  const training = useTraining(tab);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState("");
  const [quoteFocusId, setQuoteFocusId] = useState<string>();
  const [orderMode, setOrderMode] = useState("list");
  const [commandSearch, setCommandSearch] = useState("");
  const commandDialog = useRef<HTMLDialogElement>(null);
  const menuDialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [previewColor, setPreviewColor] = useState<string>();
  const [previewName, setPreviewName] = useState<string>();
  const navigation = [
    ["quotes", "Orçamentos", "▤"],
    ["orders", "Ordens de serviço", "✓"],
    ["clients", "Clientes", "◉"],
    ["equipment", "Equipamentos", "❄"],
    ["agenda", "Agenda", "▦"],
    ["inbox", "Caixa de entrada", "▱"],
    ["settings", "Configurações", "⚙"],
    ["guide", "Guia de uso", "?"],
  ];
  function navigate(key: string) {
    setTab(key);
    setQuoteFocusId(undefined);
    setForm(null);
    setMenuOpen(false);
    menuDialog.current?.close();
    commandDialog.current?.close();
  }
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        commandDialog.current?.showModal();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const renderNavigation = () =>
    navigation.map(([key, name, icon]) => (
      <button
        key={key}
        aria-current={tab === key ? "page" : undefined}
        className={tab === key ? "active" : ""}
        onClick={() => navigate(key)}
      >
        <span aria-hidden="true" className="nav-icon">
          {icon}
        </span>
        {name}
        {key === "inbox" && (
          <span className="nav-count">{training.unread}</span>
        )}
      </button>
    ));

  const titles: Record<string, string> = {
    quotes: "Orçamentos sem desencontro.",
    orders: "Do aceite à entrega.",
    clients: "Relacionamento organizado.",
    equipment: "Cada aparelho, seu histórico.",
    agenda: "Visitas com hora marcada.",
    inbox: "Seus avisos e treinamentos.",
    settings: "A identidade da sua operação.",
    guide: "Ajuda em cada etapa.",
  };
  const [form, setForm] = useState<typeof initial | null>(null);
  const [edit, setEdit] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [notice, setNotice] = useState("");
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      setShowIntro(localStorage.getItem("brisa-guide-hidden-v1") !== "true");
    } catch {
      setShowIntro(true);
    }
  }, []);
  function hideIntro() {
    setShowIntro(false);
    try {
      localStorage.setItem("brisa-guide-hidden-v1", "true");
    } catch {}
  }
  function startQuote() {
    setTab("quotes");
    setEdit(undefined);
    setForm(structuredClone(initial));
    setLink("");
    setNotice("");
  }
  const [filter, setFilter] = useState("");
  const [history, setHistory] = useState<any>();
  const dialog = useRef<HTMLDialogElement>(null);
  async function api(url: string, body?: unknown) {
    const r = await fetch(
      url,
      body
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {},
    );
    const b = await r.json();
    if (!r.ok) {
      if (r.status === 401) location.href = "/login";
      throw new Error(b.error);
    }
    return b;
  }
  const loadGeneration = useRef(0);
  async function load() {
    const generation = ++loadGeneration.current;
    try {
      const fresh = await api("/api/quotes");
      if (generation === loadGeneration.current) setData(fresh);
    } catch (e) {
      if (generation === loadGeneration.current) setError((e as Error).message);
    }
  }
  useEffect(() => {
    load();
  }, [tab]);
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") void load();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  async function action(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function revise(q: Quote) {
    setEdit(q.id);
    setForm({
      ...initial,
      client_id: q.client_id,
      client_name: q.snapshot.client_name,
      contact: q.contact,
      conditions: q.snapshot.conditions,
      items: q.snapshot.items,
    });
    setLink("");
  }
  return (
    <>
      <div className="demo">
        Empresa fictícia • demonstração • dados sintéticos • nenhuma cobrança
        real
      </div>
      <div
        className="shell brisa-app"
        style={{ "--teal": data?.settings.color } as React.CSSProperties}
      >
        <aside className="desktop-sidebar">
          <div className="brand">
            brisa oficina<small>CLIMATIZAÇÃO DEMO</small>
          </div>
          <nav>{renderNavigation()}</nav>
          <div className="aside-footer">
            ElosPME / Portal de serviços
            <br />
            Uma instalação. Seu fluxo.
            <br />
            <br />
            <button
              className="secondary small"
              onClick={() =>
                action(async () => {
                  await api("/api/auth/sign-out", {});
                  location.href = "/login";
                })
              }
            >
              Sair da conta
            </button>
          </div>
        </aside>
        <main>
          <div className="workspace-bar">
            <button
              ref={menuButton}
              className="secondary mobile-menu"
              aria-label="Abrir navegação"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen(true);
                menuDialog.current?.showModal();
              }}
            >
              ☰ <span>Menu</span>
            </button>
            <span className="workspace-name">
              {data?.settings.name ?? "Brisa Oficina"}
            </span>
            <button
              className="secondary command-trigger"
              onClick={() => commandDialog.current?.showModal()}
            >
              Buscar… <kbd>Ctrl K</kbd>
            </button>
          </div>
          <header>
            <div>
              <span className="eyebrow">
                {navigation.find(([key]) => key === tab)?.[1]}
              </span>
              <h1>{titles[tab]}</h1>
              <div className="muted">
                {data?.settings.name ?? "Carregando sua operação…"}
              </div>
            </div>
            <div className="actions">
              <button
                type="button"
                className="secondary small"
                onClick={() => training.start()}
              >
                Ajuda nesta aba
              </button>
              <button
                type="button"
                className="secondary small"
                onClick={() => {
                  setTab("inbox");
                  setForm(null);
                }}
                aria-label={`Notificações: ${training.unread} não lidas`}
              >
                Notificações ({training.unread})
              </button>
              {tab === "quotes" && !form && (
                <button data-tour="quote-new" onClick={startQuote}>
                  + Novo orçamento
                </button>
              )}
            </div>
          </header>
          {training.error && !training.active && (
            <p role="alert" className="notice error">
              Treinamento: {training.error}{" "}
              <button className="secondary small" onClick={training.load}>
                Tentar carregar treinamentos
              </button>
            </p>
          )}
          {(["clients", "equipment", "agenda"] as string[]).includes(tab) && (
            <OperationsPanel
              key={tab}
              onHelp={() => training.start()}
              tab={tab as "clients" | "equipment" | "agenda"}
            />
          )}
          {tab === "inbox" && (
            <TrainingInbox
              training={training}
              onReplay={(tour, mode) => {
                setTab(tour);
                setForm(null);
                training.start(tour, mode);
              }}
            />
          )}
          {notice && (
            <p role="status" className="notice">
              {notice}
            </p>
          )}
          {tab === "quotes" && !form && showIntro && data && (
            <GettingStarted onHide={hideIntro} onStart={startQuote} />
          )}
          {tab === "guide" && (
            <div data-tour="guide-panel">
              <GettingStarted full onStart={startQuote} />
            </div>
          )}
          {error && (
            <div role="alert" className="notice error">
              {error}{" "}
              <button className="secondary small" onClick={load}>
                Tentar novamente
              </button>
            </div>
          )}
          {link && tab === "quotes" && (
            <div className="notice" role="status">
              <strong>Orçamento publicado.</strong>
              <p>
                Copie o link e envie manualmente ao cliente. Ele só será exibido
                nesta sessão.
              </p>
              <a href={link} target="_blank" rel="noreferrer">
                Abrir portal do cliente
              </a>{" "}
              <button
                className="secondary small"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(link);
                    setNotice(
                      "Link copiado. Envie-o manualmente ao cliente pelo canal combinado.",
                    );
                  } catch {
                    setError(
                      "Não foi possível copiar. Selecione o link abaixo.",
                    );
                  }
                }}
              >
                Copiar link
              </button>
              <input
                readOnly
                value={link}
                aria-label="Link do orçamento"
                onFocus={(e) => e.currentTarget.select()}
              />
            </div>
          )}
          {form && (
            <form
              className="card"
              onSubmit={(e) => {
                e.preventDefault();
                action(async () => {
                  const out = await api(
                    edit ? `/api/quotes/${edit}` : "/api/quotes",
                    edit ? { action: "revise", input: form } : form,
                  );
                  setLink(`${location.origin}/p/${out.token}`);
                  setForm(null);
                });
              }}
            >
              <h2>{edit ? "Publicar nova revisão" : "Novo orçamento"}</h2>
              <p className="muted">
                A publicação gera uma versão fixa e um link exclusivo. Uma
                revisão invalida o link anterior.
              </p>
              <ExistingClientPicker
                value={form.client_id}
                onSelect={(c) =>
                  setForm({
                    ...form,
                    client_id: c?.id,
                    client_name: c?.name ?? "",
                    contact: c?.contact ?? "",
                  })
                }
              />
              {form.client_id && (
                <p className="muted">
                  Dados do cadastro selecionado. Para corrigir nome ou contato,
                  use a aba Clientes; os dados atuais serão consultados ao
                  publicar.
                </p>
              )}
              <div className="fields">
                <HelpField
                  label="Cliente"
                  help="Use o nome de quem receberá a proposta. Exemplo: Cliente Demonstração A. Confira antes de publicar: a versão enviada preserva esse nome."
                >
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    readOnly={!!form.client_id}
                    value={form.client_name}
                    onChange={(e) =>
                      setForm({ ...form, client_name: e.target.value })
                    }
                  />
                </HelpField>
                <HelpField
                  label="Contato (opcional)"
                  help="Anote um telefone ou e-mail para sua organização. Este campo não dispara mensagens e não aparece no portal público."
                >
                  <input
                    maxLength={160}
                    readOnly={!!form.client_id}
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                  />
                </HelpField>
              </div>
              <h3>Serviços e materiais</h3>
              {form.items.map((item, i) => (
                <div className="item" key={i}>
                  <HelpField
                    label="Descrição"
                    context={`item ${i + 1}`}
                    help="Descreva o serviço e o que está incluído. Exemplo: higienização de uma unidade split. Evite termos que o cliente não conhece."
                  >
                    <input
                      required
                      maxLength={200}
                      value={item.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          items: form.items.map((x, j) =>
                            j === i ? { ...x, description: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </HelpField>
                  <HelpField
                    label="Quantidade"
                    context={`item ${i + 1}`}
                    help="Informe um número inteiro de unidades, entre 1 e 1.000. Exemplo: 2 aparelhos. O subtotal é quantidade × valor unitário."
                  >
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      required
                      value={item.quantity}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          items: form.items.map((x, j) =>
                            j === i
                              ? { ...x, quantity: Number(e.target.value) }
                              : x,
                          ),
                        })
                      }
                    />
                  </HelpField>
                  <HelpField
                    label="Valor unitário (R$)"
                    context={`item ${i + 1}`}
                    help="Informe o preço de uma unidade em reais. Exemplo: 180,00 por aparelho. O total mostrado considera todos os itens; não há cobrança automática."
                  >
                    <input
                      type="number"
                      min={0}
                      max={1000000}
                      step="0.01"
                      required
                      value={item.unit_cents / 100}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          items: form.items.map((x, j) =>
                            j === i
                              ? {
                                  ...x,
                                  unit_cents: Math.round(
                                    Number(e.target.value) * 100,
                                  ),
                                }
                              : x,
                          ),
                        })
                      }
                    />
                  </HelpField>
                  <button
                    type="button"
                    className="secondary small"
                    disabled={form.items.length === 1}
                    onClick={() =>
                      setForm({
                        ...form,
                        items: form.items.filter((_, j) => i !== j),
                      })
                    }
                    aria-label={`Remover item ${i + 1}`}
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="secondary small"
                disabled={form.items.length >= 40}
                onClick={() =>
                  setForm({
                    ...form,
                    items: [
                      ...form.items,
                      { description: "", quantity: 1, unit_cents: 0 },
                    ],
                  })
                }
              >
                + Adicionar item
              </button>
              <div className="row">
                <HelpField
                  label="Validade (dias)"
                  help="Prazo de 1 a 90 dias a partir da publicação. Depois do vencimento, o cliente não pode usar o link para aprovar. Publique nova revisão para renovar."
                >
                  <input
                    required
                    type="number"
                    min={1}
                    max={90}
                    value={form.valid_days}
                    onChange={(e) =>
                      setForm({ ...form, valid_days: Number(e.target.value) })
                    }
                  />
                </HelpField>
                <strong className="total">
                  {brl(
                    form.items.reduce(
                      (sum, x) => sum + x.quantity * x.unit_cents,
                      0,
                    ),
                  )}
                </strong>
              </div>
              <HelpField
                label="Condições"
                help="Explique inclusões, exclusões e como combinar execução e pagamento. Exemplo: materiais adicionais sujeitos a novo orçamento. O cliente verá este texto."
              >
                <textarea
                  maxLength={2000}
                  value={form.conditions}
                  onChange={(e) =>
                    setForm({ ...form, conditions: e.target.value })
                  }
                />
              </HelpField>
              <div className="form-actions">
                <button
                  className="secondary"
                  type="button"
                  onClick={() => setForm(null)}
                >
                  Voltar
                </button>
                {(!edit ||
                  data?.quotes.find((q) => q.id === edit)?.display_status ===
                    "draft") && (
                  <button
                    type="button"
                    disabled={busy}
                    className="secondary"
                    onClick={() =>
                      action(async () => {
                        await api(
                          edit ? `/api/quotes/${edit}` : "/api/quotes",
                          { action: "draft", input: form },
                        );
                        setForm(null);
                        setNotice(
                          "Rascunho salvo. Ele ainda não possui link público; publique quando estiver pronto.",
                        );
                      })
                    }
                  >
                    Salvar rascunho
                  </button>
                )}
                <button disabled={busy}>
                  {busy ? "Publicando…" : "Publicar e gerar link"}
                </button>
              </div>
            </form>
          )}
          {!form && tab === "quotes" && (
            <>
              <div className="stats">
                {[
                  [
                    "Em aberto",
                    data?.quotes.filter((q) => q.display_status === "sent")
                      .length ?? 0,
                  ],
                  [
                    "Aprovados",
                    data?.quotes.filter((q) => q.display_status === "accepted")
                      .length ?? 0,
                  ],
                  [
                    "Em serviço",
                    data?.orders.filter(
                      (o) => !["completed", "cancelled"].includes(o.status),
                    ).length ?? 0,
                  ],
                ].map(([name, value]) => (
                  <div className="card" key={name}>
                    <span className="muted">{name}</span>
                    <div className="stat">{value}</div>
                  </div>
                ))}
              </div>
              <section className="card" data-tour="quotes-list">
                <div className="row">
                  <h2>Seus orçamentos</h2>
                  <a href="/api/export">Exportar CSV</a>
                </div>
                <label>
                  Buscar por cliente ou número
                  <input
                    type="search"
                    value={filter}
                    onChange={(e) => {
                      setQuoteFocusId(undefined);
                      setFilter(e.target.value);
                    }}
                    placeholder="Nome do cliente…"
                  />
                </label>
                <div
                  className="filter-chips"
                  aria-label="Filtrar orçamentos por status"
                >
                  {[
                    ["", "Todos"],
                    ...Object.entries(labels).filter(([key]) =>
                      [
                        "draft",
                        "sent",
                        "accepted",
                        "change_requested",
                        "expired",
                        "cancelled",
                      ].includes(key),
                    ),
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      className={quoteStatus === key ? "selected" : "secondary"}
                      aria-pressed={quoteStatus === key}
                      onClick={() => {
                        setQuoteStatus(key);
                        setQuoteFocusId(undefined);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {!data ? (
                  <p role="status">Carregando…</p>
                ) : (
                  data.quotes
                    .filter((q) => !quoteFocusId || q.id === quoteFocusId)
                    .filter(
                      (q) => !quoteStatus || q.display_status === quoteStatus,
                    )
                    .filter((q) =>
                      (q.snapshot.client_name + " " + q.code)
                        .toLowerCase()
                        .includes(filter.toLowerCase()),
                    )
                    .map((q) => (
                      <article className="quote" key={q.id}>
                        <div>
                          <span className="eyebrow">
                            ORÇAMENTO {String(q.code).padStart(3, "0")} / V
                            {q.current_revision}
                          </span>
                          <p>
                            <strong>{q.snapshot.client_name}</strong>
                          </p>
                          <span className={`badge ${q.display_status}`}>
                            {labels[q.display_status]}
                          </span>
                          <p className="next-step">
                            {nextSteps[q.display_status]}
                          </p>
                        </div>
                        <strong>{brl(q.total_cents)}</strong>
                        <div className="actions">
                          {q.current_revision > 0 && (
                            <button
                              className="secondary small"
                              onClick={() =>
                                action(async () => {
                                  const h = await api(`/api/quotes/${q.id}`);
                                  setHistory(h);
                                  dialog.current?.showModal();
                                })
                              }
                            >
                              Histórico / PDF
                            </button>
                          )}
                          {[
                            "draft",
                            "sent",
                            "change_requested",
                            "expired",
                          ].includes(q.display_status) && (
                            <button
                              className="secondary small"
                              onClick={() => revise(q)}
                            >
                              {q.display_status === "draft"
                                ? "Editar rascunho"
                                : "Nova revisão"}
                            </button>
                          )}
                          <button
                            disabled={busy}
                            className="secondary small"
                            onClick={() => {
                              if (
                                confirm(
                                  "Revogar todos os links deste orçamento?",
                                )
                              )
                                action(async () => {
                                  await api(`/api/quotes/${q.id}`, {
                                    action: "revoke",
                                  });
                                  setNotice(
                                    "Link revogado. O acesso público foi bloqueado; o histórico e as decisões foram preservados.",
                                  );
                                });
                            }}
                          >
                            Revogar link
                          </button>
                          {["sent", "change_requested", "expired"].includes(
                            q.display_status,
                          ) && (
                            <button
                              disabled={busy}
                              className="secondary small"
                              onClick={() => {
                                if (confirm("Cancelar este orçamento?"))
                                  action(async () => {
                                    await api(`/api/quotes/${q.id}`, {
                                      action: "cancel",
                                    });
                                    setNotice(
                                      "Orçamento cancelado. Seus links foram bloqueados.",
                                    );
                                  });
                              }}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </article>
                    ))
                )}
                {data &&
                  data.quotes.length > 0 &&
                  !data.quotes.some(
                    (q) =>
                      (!quoteStatus || q.display_status === quoteStatus) &&
                      (q.snapshot.client_name + " " + q.code)
                        .toLowerCase()
                        .includes(filter.toLowerCase()),
                  ) && (
                    <div className="empty-state">
                      <p>Nenhum orçamento encontrado para esta busca.</p>
                      <button
                        type="button"
                        className="secondary small"
                        onClick={() => {
                          setFilter("");
                          setQuoteStatus("");
                          setQuoteFocusId(undefined);
                        }}
                      >
                        Limpar busca
                      </button>
                    </div>
                  )}
                {data?.quotes.length === 0 && (
                  <p className="muted">
                    Seu primeiro orçamento começa aqui. Informe o cliente e os
                    serviços, confira o total e publique para gerar um link.
                  </p>
                )}
              </section>
            </>
          )}
          {tab === "orders" && (
            <section className="card" data-tour="orders-panel">
              <h2>Ordens de serviço</h2>
              <p className="muted">
                Geradas após o aceite da versão exata do orçamento.
              </p>
              <div className="row view-toolbar">
                <span className="muted">
                  {data ? `${data.orders.length} ordem(ns)` : "Carregando…"}
                </span>
                <div className="segmented" aria-label="Visualização das ordens">
                  <button
                    className={orderMode === "list" ? "selected" : "secondary"}
                    aria-pressed={orderMode === "list"}
                    onClick={() => setOrderMode("list")}
                  >
                    Lista
                  </button>
                  <button
                    className={orderMode === "board" ? "selected" : "secondary"}
                    aria-pressed={orderMode === "board"}
                    onClick={() => setOrderMode("board")}
                  >
                    Quadro
                  </button>
                </div>
              </div>
              <div
                className={orderMode === "board" ? "order-board" : "order-list"}
              >
                {(orderMode === "board"
                  ? ["pending", "in_progress", "completed", "cancelled"]
                  : ["all"]
                ).map((group) => (
                  <div
                    key={group}
                    className={orderMode === "board" ? "order-column" : ""}
                  >
                    {group !== "all" && (
                      <h3>
                        {labels[group]} ·{" "}
                        {data?.orders.filter((o) => o.status === group)
                          .length ?? 0}
                      </h3>
                    )}
                    {data?.orders
                      .filter((o) => group === "all" || o.status === group)
                      .map((o) => (
                        <article className="quote" key={o.id}>
                          <div>
                            <strong>OS / orçamento {o.code}</strong>
                            <p>{o.snapshot.client_name}</p>
                            <span className={`badge ${o.status}`}>
                              {labels[o.status]}
                            </span>
                            <p className="next-step">{nextSteps[o.status]}</p>
                          </div>
                          <div />
                          <div className="actions">
                            {o.status === "pending" && (
                              <button
                                disabled={busy}
                                className="small"
                                onClick={() =>
                                  action(async () => {
                                    await api(`/api/orders/${o.id}`, {
                                      status: "in_progress",
                                    });
                                    setNotice(
                                      "Serviço iniciado. Conclua a OS quando terminar o trabalho.",
                                    );
                                  })
                                }
                              >
                                Iniciar serviço
                              </button>
                            )}
                            {o.status === "in_progress" && (
                              <button
                                disabled={busy}
                                className="small"
                                onClick={() =>
                                  action(async () => {
                                    await api(`/api/orders/${o.id}`, {
                                      status: "completed",
                                    });
                                    setNotice(
                                      "Serviço concluído. O histórico continua disponível.",
                                    );
                                  })
                                }
                              >
                                Concluir
                              </button>
                            )}
                            {["pending", "in_progress"].includes(o.status) && (
                              <button
                                className="secondary small"
                                disabled={busy}
                                onClick={() => {
                                  const reason = prompt(
                                    "Motivo do cancelamento",
                                  );
                                  if (reason)
                                    action(async () => {
                                      await api(`/api/orders/${o.id}`, {
                                        status: "cancelled",
                                        reason,
                                      });
                                      setNotice(
                                        "OS cancelada com motivo registrado.",
                                      );
                                    });
                                }}
                              >
                                Cancelar OS
                              </button>
                            )}
                          </div>
                        </article>
                      ))}
                  </div>
                ))}
              </div>
              {data?.orders.length === 0 && (
                <p className="muted">
                  Nenhuma OS ainda. Um orçamento aprovado gera a primeira.
                </p>
              )}
            </section>
          )}
          {tab === "settings" && (
            <section className="card" data-tour="settings-panel">
              <h2>Marca e operação</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  action(async () => {
                    await api("/api/settings", {
                      name: f.get("name"),
                      color: f.get("color"),
                    });
                    setNotice(
                      "Marca salva. Os próximos documentos usarão esta configuração.",
                    );
                  });
                }}
              >
                <HelpField
                  label="Nome exibido nos próximos orçamentos"
                  help="A mudança vale para as próximas publicações. Documentos já publicados preservam o nome da empresa que existia naquela versão."
                >
                  <input
                    onChange={(e) => setPreviewName(e.target.value)}
                    name="name"
                    defaultValue={data?.settings.name}
                    required
                    minLength={2}
                    maxLength={120}
                  />
                </HelpField>
                <HelpField
                  label="Cor de destaque"
                  help="Escolha uma das cores disponíveis para botões e destaques dos próximos documentos. A mudança não altera versões já publicadas."
                >
                  <select
                    name="color"
                    onChange={(e) => setPreviewColor(e.target.value)}
                    defaultValue={data?.settings.color}
                  >
                    <option value="#00777a">Turquesa</option>
                    <option value="#285b8a">Azul</option>
                    <option value="#73437e">Ameixa</option>
                  </select>
                </HelpField>
                <p className="muted">
                  Documentos publicados preservam a identidade original. O selo
                  de demonstração permanece ativo nesta instalação.
                </p>
                <button disabled={busy}>Salvar configurações</button>
              </form>
              <div
                className="brand-preview"
                style={{ borderTopColor: previewColor ?? data?.settings.color }}
              >
                <span className="eyebrow">
                  Prévia de identidade · próximas publicações
                </span>
                <h3>{previewName ?? data?.settings.name}</h3>
                <p className="muted">Proposta de serviços · demonstração</p>
              </div>
              <hr />
              <p className="muted">
                Backup e restauração são feitos pelo administrador da instalação
                conforme o runbook. Nenhum pagamento ou envio automático é
                realizado.
              </p>
            </section>
          )}
          <dialog
            ref={menuDialog}
            className="mobile-nav-dialog"
            onClose={() => {
              setMenuOpen(false);
              menuButton.current?.focus();
            }}
          >
            <div className="row">
              <h2>Navegação</h2>
              <button
                className="secondary"
                onClick={() => menuDialog.current?.close()}
              >
                Fechar menu
              </button>
            </div>
            <nav>{renderNavigation()}</nav>
            <button
              className="secondary"
              onClick={() =>
                action(async () => {
                  await api("/api/auth/sign-out", {});
                  location.href = "/login";
                })
              }
            >
              Sair da conta
            </button>
          </dialog>
          <dialog ref={commandDialog} className="command-dialog">
            <div className="row">
              <h2>Buscar no aplicativo</h2>
              <button
                className="secondary"
                onClick={() => commandDialog.current?.close()}
              >
                Fechar busca
              </button>
            </div>
            <label>
              Buscar abas e orçamentos
              <input
                autoFocus
                type="search"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Cliente, número ou aba…"
              />
            </label>
            <div className="command-results">
              {navigation
                .filter(([, name]) =>
                  name.toLowerCase().includes(commandSearch.toLowerCase()),
                )
                .map(([key, name]) => (
                  <button
                    className="secondary"
                    key={key}
                    onClick={() => navigate(key)}
                  >
                    {name}
                    <span aria-hidden="true"> →</span>
                  </button>
                ))}
              {data?.quotes
                .filter(
                  (q) =>
                    commandSearch &&
                    (q.snapshot.client_name + " " + q.code)
                      .toLowerCase()
                      .includes(commandSearch.toLowerCase()),
                )
                .map((q) => (
                  <button
                    className="secondary"
                    key={q.id}
                    onClick={() => {
                      navigate("quotes");
                      setFilter(q.code);
                      setQuoteFocusId(q.id);
                      setQuoteStatus("");
                    }}
                  >
                    Orçamento {q.code} · {q.snapshot.client_name}
                  </button>
                ))}
              {commandSearch &&
                !navigation.some(([, name]) =>
                  name.toLowerCase().includes(commandSearch.toLowerCase()),
                ) &&
                !data?.quotes.some((q) =>
                  (q.snapshot.client_name + " " + q.code)
                    .toLowerCase()
                    .includes(commandSearch.toLowerCase()),
                ) && (
                  <p role="status">
                    Nenhum resultado. Busque uma aba, cliente de orçamento ou
                    número.
                  </p>
                )}
            </div>
          </dialog>
          <TrainingDialog training={training} />
          <dialog ref={dialog} className="history-drawer">
            <div className="row">
              <h2>Histórico do orçamento</h2>
              <button
                className="secondary small"
                onClick={() => dialog.current?.close()}
              >
                Fechar
              </button>
            </div>
            {history?.revisions.map((r: any) => (
              <p key={r.id}>
                <a href={`/api/pdf/${r.id}`}>Baixar PDF / revisão {r.number}</a>{" "}
                · {brl(r.total_cents)}
              </p>
            ))}
            {history?.decisions.map((d: any) => (
              <div className="notice" key={d.number}>
                {labels[d.kind]} / v{d.number} por {d.name}
                <p className="detail">{d.note}</p>
              </div>
            ))}
            {history?.events.map((e: any, i: number) => (
              <p key={i} className="muted">
                {new Date(e.created_at).toLocaleString("pt-BR")} ·{" "}
                {eventLabels[e.action] ?? "Atualização registrada"}
              </p>
            ))}
          </dialog>
        </main>
      </div>
    </>
  );
}
