import { z } from "zod";
import { createHash, randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { db, transaction } from "./db";
export class DomainError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export const itemSchema = z
  .object({
    description: z.string().trim().min(1).max(200),
    quantity: z.number().int().min(1).max(1000),
    unit_cents: z.number().int().min(0).max(100000000),
  })
  .strict();
export const quoteSchema = z
  .object({
    client_id: z.uuid().optional(),
    client_name: z.string().trim().min(2).max(120),
    contact: z.string().trim().max(160).default(""),
    items: z.array(itemSchema).min(1).max(40),
    conditions: z.string().trim().max(2000),
    valid_days: z.number().int().min(1).max(90),
  })
  .strict();

async function quoteClient(
  c: PoolClient,
  data: z.infer<typeof quoteSchema>,
  existingId?: string,
) {
  if (data.client_id) {
    if (existingId && existingId !== data.client_id)
      throw new DomainError("O cliente de uma revisão não pode ser trocado");
    const client = (
      await c.query(
        "SELECT id,name,contact FROM clients WHERE id=$1 FOR SHARE",
        [data.client_id],
      )
    ).rows[0];
    if (!client) throw new DomainError("Cliente não encontrado", 404);
    data.client_name = client.name;
    data.contact = client.contact;
    return client;
  }
  if (existingId) {
    await c.query("UPDATE clients SET name=$1,contact=$2 WHERE id=$3", [
      data.client_name,
      data.contact,
      existingId,
    ]);
    return { id: existingId };
  }
  return (
    await c.query(
      "INSERT INTO clients(name,contact) VALUES($1,$2) RETURNING id",
      [data.client_name, data.contact],
    )
  ).rows[0];
}

export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const money = (cents: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(cents) / 100,
  );
export function total(items: z.infer<typeof itemSchema>[]) {
  const value = items.reduce((sum, x) => sum + x.quantity * x.unit_cents, 0);
  if (!Number.isSafeInteger(value) || value > 1000000000)
    throw new DomainError("Total excede o limite");
  return value;
}
export async function event(
  c: PoolClient,
  id: string | null,
  actor: string,
  action: string,
  detail: object = {},
) {
  await c.query(
    "INSERT INTO audit_events(quote_id,actor,action,detail) VALUES($1,$2,$3,$4)",
    [id, actor, action, JSON.stringify(detail)],
  );
}
export async function publish(input: unknown, actor: string, quoteId?: string) {
  const data = quoteSchema.parse(input);
  return transaction(async (c) => {
    let q;
    if (quoteId) {
      q = (
        await c.query("SELECT * FROM quotes WHERE id=$1 FOR UPDATE", [quoteId])
      ).rows[0];
      if (!q) throw new DomainError("Orçamento não encontrado", 404);
      if (!["sent", "change_requested", "draft", "expired"].includes(q.status))
        throw new DomainError(
          "Crie outro orçamento para alterar um documento aceito/cancelado",
          409,
        );
      await quoteClient(c, data, q.client_id);
    } else {
      const client = await quoteClient(c, data);
      q = (
        await c.query(
          "INSERT INTO quotes(client_id,status) VALUES($1,'draft') RETURNING *",
          [client.id],
        )
      ).rows[0];
    }
    const brand = (
      await c.query("SELECT name,demo,color FROM company_settings WHERE id=1")
    ).rows[0];
    const snapshot = {
      brand,
      client_name: data.client_name,
      items: data.items,
      conditions: data.conditions,
    };
    const sum = total(data.items);
    const number = q.current_revision + 1;
    const rev = (
      await c.query(
        "INSERT INTO revisions(quote_id,number,snapshot,total_cents,snapshot_hash,valid_until) VALUES($1,$2,$3,$4,$5,now()+$6*interval '1 day') RETURNING *",
        [
          q.id,
          number,
          JSON.stringify(snapshot),
          sum,
          hash(JSON.stringify(snapshot)),
          data.valid_days,
        ],
      )
    ).rows[0];
    await c.query(
      "UPDATE public_links SET revoked_at=now() WHERE revision_id IN(SELECT id FROM revisions WHERE quote_id=$1) AND revoked_at IS NULL",
      [q.id],
    );
    const token = randomBytes(32).toString("base64url");
    await c.query(
      "INSERT INTO public_links(revision_id,token_hash,expires_at) VALUES($1,$2,$3)",
      [rev.id, hash(token), rev.valid_until],
    );
    await c.query(
      "UPDATE quotes SET current_revision=$1,status='sent' WHERE id=$2",
      [number, q.id],
    );
    await event(c, q.id, actor, "published", {
      revision: number,
      total_cents: sum,
    });
    return { id: q.id, token, revision: number };
  });
}
export async function publicQuote(token: string) {
  if (!/^[\w-]{43}$/.test(token))
    throw new DomainError("Link indisponível", 404);
  const row = (
    await db.query(
      `SELECT r.*,q.code,q.status,q.current_revision,l.revoked_at,l.expires_at,d.kind,d.name AS decided_by,d.created_at AS decided_at FROM public_links l JOIN revisions r ON r.id=l.revision_id JOIN quotes q ON q.id=r.quote_id LEFT JOIN decisions d ON d.revision_id=r.id WHERE l.token_hash=$1`,
      [hash(token)],
    )
  ).rows[0];
  if (
    !row ||
    row.revoked_at ||
    new Date(row.expires_at) <= new Date() ||
    row.number !== row.current_revision ||
    row.status === "cancelled"
  )
    throw new DomainError(
      "Link expirado, revogado ou substituído. Solicite um novo orçamento.",
      410,
    );
  return row;
}
export const decisionSchema = z
  .object({
    kind: z.enum(["accepted", "change_requested"]),
    name: z.string().trim().min(2).max(120),
    note: z.string().trim().max(1000).default(""),
    idempotency_key: z.uuid(),
    confirmed: z.literal(true),
  })
  .strict();
export async function decide(token: string, input: unknown) {
  const data = decisionSchema.parse(input);
  if (data.kind === "change_requested" && data.note.length < 3)
    throw new DomainError("Descreva a alteração desejada");
  return transaction(async (c) => {
    // Quote lock serializes decisions against publishing and revocation.
    const found = (
      await c.query(
        "SELECT r.quote_id FROM public_links l JOIN revisions r ON r.id=l.revision_id WHERE l.token_hash=$1",
        [hash(token)],
      )
    ).rows[0];
    if (!found) throw new DomainError("Link indisponível", 404);
    const q = (
      await c.query("SELECT * FROM quotes WHERE id=$1 FOR UPDATE", [
        found.quote_id,
      ])
    ).rows[0];
    const r = (
      await c.query(
        "SELECT r.*,l.revoked_at,l.expires_at FROM public_links l JOIN revisions r ON r.id=l.revision_id WHERE l.token_hash=$1",
        [hash(token)],
      )
    ).rows[0];
    if (
      r.revoked_at ||
      new Date(r.expires_at) <= new Date() ||
      r.number !== q.current_revision ||
      q.status === "cancelled"
    )
      throw new DomainError("Versão indisponível. Solicite novo link.", 409);
    const prior = (
      await c.query("SELECT * FROM decisions WHERE revision_id=$1", [r.id])
    ).rows[0];
    if (prior) {
      if (
        prior.kind === data.kind &&
        prior.idempotency_key === data.idempotency_key
      )
        return { status: prior.kind };
      throw new DomainError("Esta versão já recebeu uma decisão", 409);
    }
    if (q.status !== "sent")
      throw new DomainError("Orçamento indisponível", 409);
    await c.query(
      "INSERT INTO decisions(revision_id,kind,name,note,snapshot_hash,idempotency_key) VALUES($1,$2,$3,$4,$5,$6)",
      [
        r.id,
        data.kind,
        data.name,
        data.note,
        r.snapshot_hash,
        data.idempotency_key,
      ],
    );
    await c.query("UPDATE quotes SET status=$1 WHERE id=$2", [data.kind, q.id]);
    if (data.kind === "accepted")
      await c.query(
        "INSERT INTO service_orders(quote_id,revision_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
        [q.id, r.id],
      );
    await event(c, q.id, "public", data.kind, { revision: r.number });
    return { status: data.kind };
  });
}
export async function revoke(id: string, actor: string) {
  return transaction(async (c) => {
    const q = (
      await c.query("SELECT * FROM quotes WHERE id=$1 FOR UPDATE", [id])
    ).rows[0];
    if (!q) throw new DomainError("Não encontrado", 404);
    await c.query(
      "UPDATE public_links SET revoked_at=now() WHERE revision_id IN(SELECT id FROM revisions WHERE quote_id=$1)",
      [id],
    );
    await event(c, id, actor, "link_revoked");
  });
}
export async function cancelQuote(id: string, actor: string) {
  return transaction(async (c) => {
    const q = (
      await c.query("SELECT * FROM quotes WHERE id=$1 FOR UPDATE", [id])
    ).rows[0];
    if (
      !q ||
      !["sent", "change_requested", "draft", "expired"].includes(q.status)
    )
      throw new DomainError("Transição inválida", 409);
    await c.query("UPDATE quotes SET status='cancelled' WHERE id=$1", [id]);
    await c.query(
      "UPDATE public_links SET revoked_at=now() WHERE revision_id IN(SELECT id FROM revisions WHERE quote_id=$1)",
      [id],
    );
    await event(c, id, actor, "cancelled");
  });
}
export async function orderTransition(
  id: string,
  status: string,
  reason: string,
  actor: string,
) {
  return transaction(async (c) => {
    const row = (
      await c.query("SELECT * FROM service_orders WHERE id=$1 FOR UPDATE", [id])
    ).rows[0];
    if (!row) throw new DomainError("OS não encontrada", 404);
    if (row.status === status) return;
    if (
      !(
        {
          pending: ["in_progress", "cancelled"],
          in_progress: ["completed", "cancelled"],
        } as Record<string, string[]>
      )[row.status]?.includes(status)
    )
      throw new DomainError("Transição inválida", 409);
    if (status === "cancelled" && reason.trim().length < 3)
      throw new DomainError("Informe o motivo");
    await c.query("UPDATE service_orders SET status=$1,reason=$2 WHERE id=$3", [
      status,
      reason.slice(0, 1000),
      id,
    ]);
    await event(c, row.quote_id, actor, "order_" + status);
  });
}
export function csvCell(v: unknown) {
  const text = String(v ?? "");
  return (
    '"' +
    (/^[\s]*[=+@-]/.test(text) ? "'" : "") +
    text.replaceAll('"', '""') +
    '"'
  );
}
export async function saveDraft(input: unknown, actor: string, id?: string) {
  const data = quoteSchema.parse(input);
  total(data.items);
  return transaction(async (c) => {
    let q;
    if (id) {
      q = (await c.query("SELECT * FROM quotes WHERE id=$1 FOR UPDATE", [id]))
        .rows[0];
      if (!q || q.status !== "draft")
        throw new DomainError("Somente rascunhos podem ser editados", 409);
      await quoteClient(c, data, q.client_id);
      await c.query("UPDATE quotes SET draft=$1 WHERE id=$2", [
        JSON.stringify(data),
        id,
      ]);
    } else {
      const client = await quoteClient(c, data);
      q = (
        await c.query(
          "INSERT INTO quotes(client_id,status,draft) VALUES($1,'draft',$2) RETURNING *",
          [client.id, JSON.stringify(data)],
        )
      ).rows[0];
    }
    await event(c, q.id, actor, "draft_saved");
    return { id: q.id };
  });
}
