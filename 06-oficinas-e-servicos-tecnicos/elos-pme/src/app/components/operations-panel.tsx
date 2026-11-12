"use client";
import { useEffect, useState, useRef } from "react";
import { HelpField } from "./help-field";
type Client = {
  id: string;
  name: string;
  contact: string;
  address: string;
  notes: string;
  quote_count: string;
  equipment_count: string;
};
type Equipment = {
  id: string;
  client_id: string;
  client_name: string;
  label: string;
  brand_model: string;
  capacity_btu: number | null;
  serial: string;
  location: string;
  next_service: string | null;
};
type Visit = {
  id: string;
  client_id: string;
  client_name: string;
  equipment_id: string | null;
  equipment_label: string | null;
  order_id: string | null;
  quote_code: string | null;
  technician: string;
  starts_at: string;
  duration_minutes: number;
  status: string;
  notes: string;
};
type Data = {
  clients: Client[];
  equipment: Equipment[];
  appointments: Visit[];
  orders: { id: string; client_id: string; code: string; status: string }[];
};
const emptyClient = { name: "", contact: "", address: "", notes: "" };
const emptyEquipment = {
  client_id: "",
  label: "",
  brand_model: "",
  capacity_btu: "",
  serial: "",
  location: "",
  next_service: "",
};
const emptyVisit = {
  client_id: "",
  equipment_id: "",
  order_id: "",
  technician: "",
  starts_at: "",
  duration_minutes: 60,
  notes: "",
};
const formatDate = (value: string) =>
  new Date(value).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
const statusNames: Record<string, string> = {
  planned: "Agendada",
  completed: "Concluída",
  cancelled: "Cancelada",
};
export function OperationsPanel({
  tab,
  onHelp,
}: {
  tab: "clients" | "equipment" | "agenda";
  onHelp?: () => void;
}) {
  const [data, setData] = useState<Data>();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [client, setClient] = useState(emptyClient);
  const [clientId, setClientId] = useState<string>();
  const [, setClientEditorOpen] = useState(false);
  const clientEditor = useRef<HTMLDialogElement>(null);
  const addClientButton = useRef<HTMLButtonElement>(null);
  const editTrigger = useRef<HTMLElement | null>(null);
  function openClientEditor() {
    setClientEditorOpen(true);
    clientEditor.current?.showModal();
  }
  function closeClientEditor() {
    clientEditor.current?.close();
    setClientEditorOpen(false);
  }

  const [asset, setAsset] = useState(emptyEquipment);
  const [assetId, setAssetId] = useState<string>();
  const [visit, setVisit] = useState(emptyVisit);
  async function load() {
    const r = await fetch("/api/operations");
    const b = await r.json();
    if (!r.ok) throw Error(b.error);
    setData(b);
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);
  async function save(body: unknown, message: string, done = () => {}) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await fetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const b = await r.json();
      if (!r.ok) throw Error(b.error);
      done();
      setNotice(message);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {error && (
        <p role="alert" className="notice error">
          {error}{" "}
          <button
            className="secondary small"
            onClick={() =>
              load()
                .then(() => setError(""))
                .catch((e) => setError(e.message))
            }
          >
            Atualizar dados
          </button>
        </p>
      )}
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      {!data ? (
        <p role="status">Carregando operação…</p>
      ) : (
        <>
          {tab === "clients" && (
            <div className="clients-workspace directory-first">
              <div className="row client-toolbar">
                <p className="muted">
                  {data.clients.length} cliente(s) cadastrado(s)
                </p>
                <button
                  ref={addClientButton}
                  onClick={() => {
                    setClientId(undefined);
                    setClient(emptyClient);
                    editTrigger.current = null;
                    openClientEditor();
                  }}
                >
                  + Adicionar cliente
                </button>
              </div>
              <dialog
                ref={clientEditor}
                className="client-editor-dialog"
                onClose={() => {
                  setClientEditorOpen(false);
                  (editTrigger.current ?? addClientButton.current)?.focus();
                }}
              >
                <form
                  className="card client-editor"
                  data-tour="clients-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    save(
                      { action: "client", id: clientId, input: client },
                      "Cliente salvo.",
                      () => {
                        setClient(emptyClient);
                        setClientId(undefined);
                        closeClientEditor();
                      },
                    );
                  }}
                >
                  <div className="client-section-heading">
                    <div className="row">
                      <span className="eyebrow">Cadastro</span>
                      <button
                        type="button"
                        className="secondary small"
                        onClick={onHelp}
                      >
                        Ajuda nesta aba
                      </button>
                    </div>
                    <h2>{clientId ? "Editar cliente" : "Cadastrar cliente"}</h2>
                    <p className="muted">
                      Identifique o cliente para organizar orçamentos,
                      equipamentos e visitas.
                    </p>
                  </div>
                  <div className="fields">
                    <HelpField
                      label="Nome do cliente"
                      help="Use o nome para identificar o atendimento. Depois, selecione este cadastro em novos orçamentos, equipamentos e visitas."
                    >
                      <input
                        required
                        minLength={2}
                        maxLength={120}
                        value={client.name}
                        onChange={(e) =>
                          setClient({ ...client, name: e.target.value })
                        }
                      />
                    </HelpField>
                    <HelpField
                      label="Contato do cliente"
                      help="Telefone ou e-mail para sua equipe. O sistema não envia mensagens automaticamente."
                    >
                      <input
                        maxLength={160}
                        value={client.contact}
                        onChange={(e) =>
                          setClient({ ...client, contact: e.target.value })
                        }
                      />
                    </HelpField>
                  </div>
                  <HelpField
                    label="Endereço de atendimento"
                    help="Inclua apenas o endereço necessário para organizar o serviço. Os equipamentos também podem ter locais específicos."
                  >
                    <input
                      maxLength={300}
                      value={client.address}
                      onChange={(e) =>
                        setClient({ ...client, address: e.target.value })
                      }
                    />
                  </HelpField>
                  <HelpField
                    label="Observações do cliente"
                    help="Registre orientações de atendimento, sem senhas, documentos ou dados bancários."
                  >
                    <textarea
                      maxLength={2000}
                      value={client.notes}
                      onChange={(e) =>
                        setClient({ ...client, notes: e.target.value })
                      }
                    />
                  </HelpField>
                  <div className="actions">
                    <button disabled={busy}>Salvar cliente</button>
                    <button
                      type="button"
                      className="secondary"
                      disabled={busy}
                      onClick={closeClientEditor}
                    >
                      Voltar à carteira
                    </button>
                    {clientId && (
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => {
                          setClientId(undefined);
                          setClient(emptyClient);
                        }}
                      >
                        Cancelar edição
                      </button>
                    )}
                  </div>
                </form>
              </dialog>
              <section
                className="card client-directory"
                data-tour="clients-list"
              >
                <div className="client-section-heading">
                  <span className="eyebrow">Relacionamento</span>
                  <h2>Carteira de clientes</h2>
                  <p className="muted">
                    Localize um cadastro para consultar os dados ou editar.
                  </p>
                </div>
                <label>
                  Buscar clientes
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                {data.clients
                  .filter((c) =>
                    (c.name + " " + c.contact)
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  )
                  .map((c) => (
                    <article className="operation-row client-record" key={c.id}>
                      <div>
                        <div className="client-identity">
                          <span className="client-avatar" aria-hidden="true">
                            {c.name
                              .trim()
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                          <h3>{c.name}</h3>
                        </div>
                        <p>{c.contact || "Contato não informado"}</p>
                        <p className="muted">
                          {c.address || "Endereço não informado"}
                        </p>
                        <p className="muted">
                          {c.quote_count} orçamento(s) · {c.equipment_count}{" "}
                          equipamento(s)
                        </p>
                        {c.notes && <p className="detail">{c.notes}</p>}
                      </div>
                      <button
                        className="secondary client-edit-action"
                        onClick={(e) => {
                          editTrigger.current = e.currentTarget;
                          openClientEditor();
                          setClientId(c.id);
                          setClient({
                            name: c.name,
                            contact: c.contact,
                            address: c.address,
                            notes: c.notes,
                          });
                          document
                            .querySelector('[data-tour="clients-form"]')
                            ?.scrollIntoView({ block: "start" });
                          requestAnimationFrame(() =>
                            document
                              .querySelector<HTMLInputElement>(
                                '[data-tour="clients-form"] input',
                              )
                              ?.focus({ preventScroll: true }),
                          );
                        }}
                      >
                        Editar cliente
                      </button>
                    </article>
                  ))}
                {!data.clients.length && (
                  <p className="muted">
                    Cadastre seu primeiro cliente para organizar os próximos
                    atendimentos.
                  </p>
                )}
                {data.clients.length > 0 &&
                  !data.clients.some((c) =>
                    (c.name + " " + c.contact)
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  ) && (
                    <p className="muted">Nenhum cliente corresponde à busca.</p>
                  )}
              </section>
            </div>
          )}
          {tab === "equipment" && (
            <>
              <form
                className="card"
                data-tour="equipment-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  save(
                    {
                      action: "equipment",
                      id: assetId,
                      input: {
                        ...asset,
                        capacity_btu: asset.capacity_btu
                          ? Number(asset.capacity_btu)
                          : null,
                        next_service: asset.next_service || null,
                      },
                    },
                    "Equipamento salvo.",
                    () => {
                      setAsset(emptyEquipment);
                      setAssetId(undefined);
                    },
                  );
                }}
              >
                <h2>
                  {assetId ? "Editar equipamento" : "Cadastrar equipamento"}
                </h2>
                <div className="fields">
                  <HelpField
                    label="Cliente do equipamento"
                    help="Cada aparelho pertence a um cliente. O vínculo não pode ser trocado depois do cadastro para preservar o histórico."
                  >
                    <select
                      required
                      disabled={!!assetId}
                      value={asset.client_id}
                      onChange={(e) =>
                        setAsset({ ...asset, client_id: e.target.value })
                      }
                    >
                      <option value="">Selecione o cliente</option>
                      {data.clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </HelpField>
                  <HelpField
                    label="Identificação do aparelho"
                    help="Exemplo: Split da recepção. Use uma identificação que sua equipe reconheça no local."
                  >
                    <input
                      required
                      minLength={2}
                      maxLength={120}
                      value={asset.label}
                      onChange={(e) =>
                        setAsset({ ...asset, label: e.target.value })
                      }
                    />
                  </HelpField>
                  <label>
                    Marca e modelo
                    <input
                      maxLength={160}
                      value={asset.brand_model}
                      onChange={(e) =>
                        setAsset({ ...asset, brand_model: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Capacidade (BTU, opcional)
                    <input
                      type="number"
                      min={1}
                      max={1000000}
                      value={asset.capacity_btu}
                      onChange={(e) =>
                        setAsset({ ...asset, capacity_btu: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Número de série
                    <input
                      maxLength={120}
                      value={asset.serial}
                      onChange={(e) =>
                        setAsset({ ...asset, serial: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Local do aparelho
                    <input
                      maxLength={300}
                      value={asset.location}
                      onChange={(e) =>
                        setAsset({ ...asset, location: e.target.value })
                      }
                    />
                  </label>
                </div>
                <HelpField
                  label="Próxima manutenção (opcional)"
                  help="Informe somente uma data definida pelo responsável técnico. Não é gerado um plano PMOC, agendamento ou lembrete automático."
                >
                  <input
                    type="date"
                    value={asset.next_service}
                    onChange={(e) =>
                      setAsset({ ...asset, next_service: e.target.value })
                    }
                  />
                </HelpField>
                <div className="actions">
                  <button disabled={busy || !data.clients.length}>
                    Salvar equipamento
                  </button>
                  {assetId && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        setAssetId(undefined);
                        setAsset(emptyEquipment);
                      }}
                    >
                      Cancelar edição
                    </button>
                  )}
                </div>
                {!data.clients.length && (
                  <p className="muted">
                    Cadastre um cliente na aba Clientes primeiro.
                  </p>
                )}
              </form>
              <section className="card" data-tour="equipment-list">
                <h2>Equipamentos e histórico</h2>
                {data.equipment.map((e) => (
                  <article className="operation-row" key={e.id}>
                    <div>
                      <h3>{e.label}</h3>
                      <p>
                        {e.client_name} ·{" "}
                        {e.brand_model || "Modelo não informado"}
                      </p>
                      <p className="muted">
                        {e.capacity_btu ? `${e.capacity_btu} BTU · ` : ""}
                        {e.location || "Local não informado"} · Série:{" "}
                        {e.serial || "não informada"}
                      </p>
                      <p className="muted">
                        Próxima manutenção:{" "}
                        {e.next_service
                          ? e.next_service.split("-").reverse().join("/")
                          : "não definida"}
                      </p>
                      <details>
                        <summary>Histórico de visitas</summary>
                        {data.appointments
                          .filter((a) => a.equipment_id === e.id)
                          .map((a) => (
                            <p key={a.id}>
                              {formatDate(a.starts_at)} · {a.technician} ·{" "}
                              {statusNames[a.status]}
                              <br />
                              {a.notes}
                            </p>
                          ))}
                        {!data.appointments.some(
                          (a) => a.equipment_id === e.id,
                        ) && <p>Nenhuma visita vinculada.</p>}
                      </details>
                    </div>
                    <button
                      className="secondary small"
                      onClick={() => {
                        setAssetId(e.id);
                        setAsset({
                          client_id: e.client_id,
                          label: e.label,
                          brand_model: e.brand_model,
                          capacity_btu: e.capacity_btu?.toString() ?? "",
                          serial: e.serial,
                          location: e.location,
                          next_service: e.next_service ?? "",
                        });
                        document
                          .querySelector('[data-tour="equipment-form"]')
                          ?.scrollIntoView({ block: "start" });
                      }}
                    >
                      Editar equipamento
                    </button>
                  </article>
                ))}
                {!data.equipment.length && (
                  <p className="muted">Nenhum equipamento cadastrado.</p>
                )}
              </section>
            </>
          )}
          {tab === "agenda" && (
            <>
              <form
                className="card"
                data-tour="agenda-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  save(
                    {
                      action: "visit",
                      input: {
                        ...visit,
                        equipment_id: visit.equipment_id || null,
                        order_id: visit.order_id || null,
                        starts_at: new Date(visit.starts_at).toISOString(),
                      },
                    },
                    "Visita agendada. Combine o horário com o cliente; nenhuma mensagem foi enviada.",
                    () => setVisit(emptyVisit),
                  );
                }}
              >
                <h2>Agendar visita</h2>
                <p className="muted">
                  Preencha no fuso deste dispositivo:{" "}
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}. A lista
                  abaixo apresenta horário de São Paulo.
                </p>
                <div className="fields">
                  <label>
                    Cliente da visita
                    <select
                      aria-label="Cliente da visita"
                      required
                      value={visit.client_id}
                      onChange={(e) =>
                        setVisit({
                          ...visit,
                          client_id: e.target.value,
                          equipment_id: "",
                          order_id: "",
                        })
                      }
                    >
                      <option value="">Selecione o cliente</option>
                      {data.clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Equipamento da visita (opcional)
                    <select
                      aria-label="Equipamento da visita (opcional)"
                      value={visit.equipment_id}
                      onChange={(e) =>
                        setVisit({ ...visit, equipment_id: e.target.value })
                      }
                    >
                      <option value="">Sem equipamento vinculado</option>
                      {data.equipment
                        .filter((e) => e.client_id === visit.client_id)
                        .map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.label}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    OS vinculada (opcional)
                    <select
                      aria-label="OS vinculada (opcional)"
                      value={visit.order_id}
                      onChange={(e) =>
                        setVisit({ ...visit, order_id: e.target.value })
                      }
                    >
                      <option value="">Sem OS vinculada</option>
                      {data.orders
                        .filter((o) => o.client_id === visit.client_id)
                        .map((o) => (
                          <option key={o.id} value={o.id}>
                            Orçamento {o.code}
                          </option>
                        ))}
                    </select>
                  </label>
                  <HelpField
                    label="Técnico responsável"
                    help="Informe sempre o mesmo nome para a mesma pessoa. Visitas agendadas desse técnico não podem se sobrepor. Não há cadastro de equipe ou calendário externo."
                  >
                    <input
                      required
                      minLength={2}
                      maxLength={120}
                      value={visit.technician}
                      onChange={(e) =>
                        setVisit({ ...visit, technician: e.target.value })
                      }
                    />
                  </HelpField>
                  <label>
                    Início da visita
                    <input
                      required
                      type="datetime-local"
                      value={visit.starts_at}
                      onChange={(e) =>
                        setVisit({ ...visit, starts_at: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Duração (minutos)
                    <input
                      required
                      type="number"
                      min={15}
                      max={480}
                      value={visit.duration_minutes}
                      onChange={(e) =>
                        setVisit({
                          ...visit,
                          duration_minutes: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                </div>
                <label>
                  Observações da visita
                  <textarea
                    maxLength={2000}
                    value={visit.notes}
                    onChange={(e) =>
                      setVisit({ ...visit, notes: e.target.value })
                    }
                  />
                </label>
                <button disabled={busy || !data.clients.length}>
                  Salvar visita
                </button>
              </form>
              <section
                className="card agenda-directory"
                data-tour="agenda-list"
              >
                <h2>Agenda de visitas</h2>
                <p className="muted">
                  Horários de São Paulo. Atualizar uma visita não muda o status
                  da OS.
                </p>
                {data.appointments.map((a) => (
                  <article className="operation-row" key={a.id}>
                    <div>
                      <h3>
                        {formatDate(a.starts_at)} · {a.duration_minutes} min
                      </h3>
                      <p>
                        {a.client_name} · Técnico: {a.technician}
                      </p>
                      <p>
                        {a.equipment_label || "Sem equipamento vinculado"}
                        {a.quote_code
                          ? ` · OS do orçamento ${a.quote_code}`
                          : ""}
                      </p>
                      <p className="detail muted">{a.notes}</p>
                      <span className={`badge ${a.status}`}>
                        {statusNames[a.status]}
                      </span>
                    </div>
                    {a.status === "planned" && (
                      <div className="actions">
                        <button
                          className="secondary small"
                          disabled={busy}
                          onClick={() =>
                            save(
                              {
                                action: "visit_status",
                                id: a.id,
                                status: "completed",
                              },
                              "Visita concluída. A OS permanece com seu status próprio.",
                            )
                          }
                        >
                          Concluir visita
                        </button>
                        <button
                          className="secondary small"
                          disabled={busy}
                          onClick={() =>
                            save(
                              {
                                action: "visit_status",
                                id: a.id,
                                status: "cancelled",
                              },
                              "Visita cancelada.",
                            )
                          }
                        >
                          Cancelar visita
                        </button>
                      </div>
                    )}
                  </article>
                ))}
                {!data.appointments.length && (
                  <p className="muted">
                    Nenhuma visita agendada. Comece pelo formulário acima.
                  </p>
                )}
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}
export function ExistingClientPicker({
  onSelect,
  value,
}: {
  onSelect: (c: { id: string; name: string; contact: string } | null) => void;
  value?: string;
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch("/api/operations")
      .then(async (r) => {
        if (!r.ok) throw Error();
        setClients((await r.json()).clients);
      })
      .catch(() => setError(true));
  }, []);
  return (
    <>
      <label>
        Usar cliente cadastrado
        <select
          aria-label="Usar cliente cadastrado"
          value={value ?? ""}
          onChange={(e) =>
            onSelect(clients.find((c) => c.id === e.target.value) ?? null)
          }
        >
          <option value="">Informar novo cliente</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p className="muted">
          Não foi possível carregar o cadastro. Você ainda pode informar um novo
          cliente.
        </p>
      )}
    </>
  );
}
