"use client";
import { useEffect, useState, useRef } from "react";
import { BrisaBrand, BrisaIcon } from "./components/brisa-identity";
import { cycleDialogFocus } from "./components/dialog-focus";
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
  function navigate(key: string, after?: () => void) {
    requestExit(() => {
      setTab(key);
      setQuoteFocusId(undefined);
      setForm(null);
      setNotice("");
      setError("");
      after?.();
    });
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
    navigation.map(([key, name]) => (
      <button
        key={key}
        aria-current={tab === key ? "page" : undefined}
        className={tab === key ? "active" : ""}
        onClick={() => navigate(key)}
      >
        <BrisaIcon name={key} className="nav-icon" />
        {name}
        {key === "inbox" && (
          <span className="nav-count">{training.unread}</span>
        )}
      </button>
    ));

  const titles: Record<string, string> = {
    quotes: "Orçamentos",
    orders: "Ordens de serviço",
    clients: "Clientes",
    equipment: "Equipamentos",
    agenda: "Agenda",
    inbox: "Caixa de entrada",
    settings: "Configurações",
    guide: "Guia de uso",
  };
  const descriptions: Record<string, string> = {
    quotes: "Propostas bem cuidadas. Próximos passos claros.",
    orders: "Do aceite à entrega, cada detalhe acompanhado.",
    clients: "O cuidado começa por conhecer cada cliente.",
    equipment: "Cada aparelho tem uma história. Mantenha-a por perto.",
    agenda: "Seu tempo organizado. Cada atendimento no lugar.",
    inbox: "Sua operação em dia, sem perder o contexto.",
    settings: "A identidade da sua empresa em cada experiência.",
    guide: "Tudo o que você precisa para trabalhar com clareza.",
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
  const quoteForm = useRef<HTMLFormElement>(null);
  const formBaseline = useRef("");
  const leaveDialog = useRef<HTMLDialogElement>(null);
  const pendingExit = useRef<(() => void) | null>(null);
  const exitTrigger = useRef<HTMLElement | null>(null);
  const dirty = form !== null && JSON.stringify(form) !== formBaseline.current;
  const canSaveDraft =
    !edit ||
    data?.quotes.find((q) => q.id === edit)?.display_status === "draft";
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function requestExit(next: () => void) {
    if (busy) return;
    exitTrigger.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setMenuOpen(false);
    menuDialog.current?.close();
    commandDialog.current?.close();
    if (!dirty) {
      next();
      return;
    }
    pendingExit.current = next;
    setError("");
    leaveDialog.current?.showModal();
  }
  function finishExit() {
    setForm(null);
    setError("");
    const next = pendingExit.current;
    pendingExit.current = null;
    leaveDialog.current?.close();
    next?.();
  }
  async function saveDraft() {
    await api(edit ? `/api/quotes/${edit}` : "/api/quotes", {
      action: "draft",
      input: form,
    });
    setForm(null);
    setNotice(
      "Rascunho salvo. Ele ainda não possui link público; publique quando estiver pronto.",
    );
  }
  function startQuote() {
    requestExit(() => {
      setTab("quotes");
      setEdit(undefined);
      const fresh = structuredClone(initial);
      formBaseline.current = JSON.stringify(fresh);
      setForm(fresh);
      setLink("");
      setNotice("");
    });
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
    const fresh = {
      ...initial,
      client_id: q.client_id,
      client_name: q.snapshot.client_name,
      contact: q.contact,
      conditions: q.snapshot.conditions,
      items: structuredClone(q.snapshot.items),
    };
    formBaseline.current = JSON.stringify(fresh);
    setForm(fresh);
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
          <BrisaBrand />
          <div className="sidebar-workspace">
            <span className="workspace-monogram">BO</span>
            <div>
              <strong>Brisa Oficina</strong>
              <small>Climatização · demonstração</small>
            </div>
          </div>
          <div className="nav-section-label">Seu espaço de trabalho</div>
          <nav aria-label="Navegação principal">{renderNavigation()}</nav>
          <div className="sidebar-note">
            <BrisaIcon name="shield" size={18} />
            <span>
              Uma operação.
              <br />
              <strong>Todos os detalhes.</strong>
            </span>
          </div>
          <div className="aside-footer">
            <div className="operator-profile">
              <span className="operator-avatar">OP</span>
              <span>
                <strong>Operador</strong>
                <small>Área de gestão</small>
              </span>
            </div>
            <button
              className="secondary small"
              onClick={() =>
                requestExit(
                  () =>
                    void action(async () => {
                      await api("/api/auth/sign-out", {});
                      location.href = "/login";
                    }),
                )
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
              <BrisaIcon name="menu" />
              <span className="sr-only">Menu</span>
            </button>
            <span className="workspace-name">
              <BrisaIcon name="equipment" size={18} />
              <span>{data?.settings.name ?? "Brisa Oficina"}</span>
              <span className="workspace-divider">/</span>
              <span className="workspace-section">{titles[tab]}</span>
            </span>
            <button
              className="secondary command-trigger"
              aria-label="Buscar no aplicativo"
              onClick={() => commandDialog.current?.showModal()}
            >
              <BrisaIcon name="search" size={17} />
              <span>Buscar no Brisa</span>
              <kbd>Ctrl K</kbd>
            </button>
          </div>
          <header className="page-heading">
            <div>
              <span className="eyebrow">
                {tab === "quotes"
                  ? "Relacionamento & negócios"
                  : tab === "agenda" || tab === "orders" || tab === "equipment"
                    ? "Gestão da operação"
                    : "Seu espaço de trabalho"}
              </span>
              <h1>{titles[tab]}</h1>
              <p className="page-description">{descriptions[tab]}</p>
            </div>
            <div className="actions">
              <button
                type="button"
                className="secondary small"
                aria-label="Ajuda nesta aba"
                onClick={() => training.start()}
              >
                <BrisaIcon name="guide" size={17} />
                <span>Ajuda</span>
              </button>
              <button
                type="button"
                className="secondary small"
                onClick={() => {
                  navigate("inbox");
                }}
                aria-label={`Notificações: ${training.unread} não lidas`}
              >
                <BrisaIcon name="bell" size={18} />
                <span className="notification-count">{training.unread}</span>
              </button>
              {tab === "quotes" && !form && (
                <button data-tour="quote-new" onClick={startQuote}>
                  <BrisaIcon name="plus" size={18} /> Novo orçamento
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
                navigate(tour, () => training.start(tour, mode));
              }}
            />
          )}
          {notice && (
            <p role="status" className="notice">
              {notice}
            </p>
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
              ref={quoteForm}
              className="card quote-editor"
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
              <div className="editor-layout">
                <div className="editor-content">
                  <h2 tabIndex={-1}>
                    {edit ? "Publicar nova revisão" : "Novo orçamento"}
                  </h2>
                  <p className="muted">
                    A publicação gera uma versão fixa e um link exclusivo. Uma
                    revisão invalida o link anterior.
                  </p>
                  <h3 className="editor-section">
                    <span>01</span> Cliente
                  </h3>
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
                      Dados do cadastro selecionado. Para corrigir nome ou
                      contato, use a aba Clientes; os dados atuais serão
                      consultados ao publicar.
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
                  <h3 className="editor-section">
                    <span>02</span> Serviços e materiais
                  </h3>
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
                                j === i
                                  ? { ...x, description: e.target.value }
                                  : x,
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
                  <h3 className="editor-section">
                    <span>03</span> Condições da proposta
                  </h3>
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
                          setForm({
                            ...form,
                            valid_days: Number(e.target.value),
                          })
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
                </div>
                <section
                  className="quote-summary"
                  aria-label="Resumo da proposta"
                >
                  <span className="eyebrow">Resumo da proposta</span>
                  <h3>{form.client_name || "Seu próximo atendimento"}</h3>
                  <p>Confira os detalhes antes de publicar.</p>
                  <dl>
                    <div>
                      <dt>Itens na proposta</dt>
                      <dd>{form.items.length}</dd>
                    </div>
                    <div>
                      <dt>Validade</dt>
                      <dd>{form.valid_days} dias</dd>
                    </div>
                  </dl>
                  <div className="summary-total">
                    <span>Valor total</span>
                    <strong>
                      {brl(
                        form.items.reduce(
                          (sum, item) => sum + item.quantity * item.unit_cents,
                          0,
                        ),
                      )}
                    </strong>
                  </div>
                  <p className="summary-assurance">
                    <BrisaIcon name="shield" size={18} /> Publicar preserva esta
                    revisão. Nenhuma cobrança é realizada.
                  </p>
                </section>
              </div>
              <div className="form-actions">
                <button
                  className="secondary"
                  type="button"
                  onClick={() => requestExit(() => setForm(null))}
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
                    onClick={() => {
                      if (quoteForm.current?.reportValidity())
                        void action(saveDraft);
                    }}
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
              <section
                className="operation-overview"
                aria-label="Resumo dos orçamentos e serviços"
              >
                <div>
                  <span className="overview-icon">
                    <BrisaIcon name="quotes" />
                  </span>
                  <div>
                    <span>Propostas em aberto</span>
                    <strong>
                      {brl(
                        data?.quotes
                          .filter((q) => q.display_status === "sent")
                          .reduce((sum, q) => sum + Number(q.total_cents), 0) ??
                          0,
                      )}
                    </strong>
                    <small>
                      {data?.quotes.filter((q) => q.display_status === "sent")
                        .length ?? 0}{" "}
                      aguardando decisão
                    </small>
                  </div>
                </div>
                <div>
                  <span className="overview-icon">
                    <BrisaIcon name="check" />
                  </span>
                  <div>
                    <span>Orçamentos aprovados</span>
                    <strong>
                      {data?.quotes.filter(
                        (q) => q.display_status === "accepted",
                      ).length ?? 0}
                      <small>propostas</small>
                    </strong>
                    <small>Decisões registradas</small>
                  </div>
                </div>
                <div>
                  <span className="overview-icon">
                    <BrisaIcon name="orders" />
                  </span>
                  <div>
                    <span>Serviços em andamento</span>
                    <strong>
                      {data?.orders.filter((o) => o.status === "in_progress")
                        .length ?? 0}
                      <small>ordens de serviço</small>
                    </strong>
                    <small>Execução iniciada</small>
                  </div>
                </div>
              </section>
              <section className="card quote-directory" data-tour="quotes-list">
                <div className="row">
                  <div>
                    <h2>Suas propostas</h2>
                    <p className="section-caption">
                      Uma visão clara de cada negociação.
                    </p>
                  </div>
                  <a className="export-link" href="/api/export">
                    <BrisaIcon name="download" size={16} /> Exportar CSV
                  </a>
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
                          <details className="quote-context">
                            <summary>
                              Próximo passo <BrisaIcon name="arrow" size={12} />
                            </summary>
                            <p className="next-step">
                              {nextSteps[q.display_status]}
                            </p>
                          </details>
                        </div>
                        <strong className="quote-value">
                          <span>Valor da proposta</span>
                          {brl(q.total_cents)}
                        </strong>
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
                          {q.current_revision > 0 && (
                            <details
                              className="record-more"
                              onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                  e.currentTarget.open = false;
                                  e.currentTarget
                                    .querySelector("summary")
                                    ?.focus();
                                }
                              }}
                            >
                              <summary
                                aria-label={`Mais ações do orçamento ${q.code}`}
                              >
                                <BrisaIcon name="more" />
                              </summary>
                              <div className="record-menu">
                                {" "}
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
                                {[
                                  "sent",
                                  "change_requested",
                                  "expired",
                                ].includes(q.display_status) && (
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
                            </details>
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
              {showIntro && data && (
                <GettingStarted onHide={hideIntro} onStart={startQuote} />
              )}
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
          <nav className="mobile-taskbar" aria-label="Navegação rápida">
            {[
              ["quotes", "Propostas"],
              ["orders", "Serviços"],
              ["agenda", "Agenda"],
              ["clients", "Clientes"],
            ].map(([key, label]) => (
              <button
                key={key}
                aria-current={tab === key ? "page" : undefined}
                onClick={() => navigate(key)}
              >
                <BrisaIcon name={key} />
                <span>{label}</span>
              </button>
            ))}
            <button
              aria-label="Mais áreas"
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen(true);
                menuDialog.current?.showModal();
              }}
            >
              <BrisaIcon name="menu" />
              <span>Mais</span>
            </button>
          </nav>
          <dialog
            ref={leaveDialog}
            onKeyDown={cycleDialogFocus}
            className="leave-editor-dialog"
            aria-labelledby="leave-editor-title"
            aria-describedby="leave-editor-description"
            onCancel={(event) => {
              if (busy) event.preventDefault();
            }}
            onClose={() => {
              pendingExit.current = null;
              const trigger = exitTrigger.current;
              if (trigger?.isConnected && trigger.getClientRects().length)
                trigger.focus();
              else quoteForm.current?.querySelector<HTMLElement>("h2")?.focus();
            }}
          >
            <h2 id="leave-editor-title">Salvar antes de sair?</h2>
            <p id="leave-editor-description">
              Há alterações não salvas neste orçamento. Continue editando ou
              descarte as alterações para sair.
            </p>
            {error && (
              <p role="alert" className="notice error">
                {error}
              </p>
            )}
            <div className="actions">
              <button
                autoFocus
                className="secondary"
                disabled={busy}
                onClick={() => leaveDialog.current?.close()}
              >
                Continuar editando
              </button>
              <button className="danger" disabled={busy} onClick={finishExit}>
                Descartar alterações
              </button>
              {canSaveDraft && (
                <button
                  disabled={busy}
                  onClick={() => {
                    if (!quoteForm.current?.checkValidity()) {
                      setError(
                        "Confira os campos obrigatórios do orçamento antes de salvar. Continue editando para corrigi-los.",
                      );
                      return;
                    }
                    void action(async () => {
                      await saveDraft();
                      finishExit();
                    });
                  }}
                >
                  {busy ? "Salvando…" : "Salvar rascunho e sair"}
                </button>
              )}
            </div>
          </dialog>
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
                requestExit(
                  () =>
                    void action(async () => {
                      await api("/api/auth/sign-out", {});
                      location.href = "/login";
                    }),
                )
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
                      navigate("quotes", () => {
                        setFilter(q.code);
                        setQuoteFocusId(q.id);
                        setQuoteStatus("");
                      });
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
