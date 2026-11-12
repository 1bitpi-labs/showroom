import { z } from "zod";
import { db, transaction } from "./db";
import { DomainError, event } from "./domain";
const client = z
  .object({
    name: z.string().trim().min(2).max(120),
    contact: z.string().trim().max(160).default(""),
    address: z.string().trim().max(300).default(""),
    notes: z.string().trim().max(2000).default(""),
  })
  .strict();
const equipment = z
  .object({
    client_id: z.uuid(),
    label: z.string().trim().min(2).max(120),
    brand_model: z.string().trim().max(160).default(""),
    capacity_btu: z.number().int().min(1).max(1000000).nullable(),
    serial: z.string().trim().max(120).default(""),
    location: z.string().trim().max(300).default(""),
    next_service: z.iso.date().nullable(),
  })
  .strict();
const visit = z
  .object({
    client_id: z.uuid(),
    equipment_id: z.uuid().nullable(),
    order_id: z.uuid().nullable(),
    technician: z.string().trim().min(2).max(120),
    starts_at: z.iso.datetime({ offset: true }),
    duration_minutes: z.number().int().min(15).max(480),
    notes: z.string().trim().max(2000).default(""),
  })
  .strict();
export async function operationsState() {
  return {
    clients: (
      await db.query(
        `SELECT c.*,(SELECT count(*) FROM quotes q WHERE q.client_id=c.id) AS quote_count,(SELECT count(*) FROM equipment e WHERE e.client_id=c.id) AS equipment_count FROM clients c ORDER BY c.name,c.id`,
      )
    ).rows,
    equipment: (
      await db.query(
        `SELECT e.*,c.name AS client_name,to_char(e.next_service,'YYYY-MM-DD') AS next_service FROM equipment e JOIN clients c ON c.id=e.client_id ORDER BY e.created_at DESC`,
      )
    ).rows,
    appointments: (
      await db.query(
        `SELECT a.*,c.name AS client_name,e.label AS equipment_label,q.code AS quote_code FROM appointments a JOIN clients c ON c.id=a.client_id LEFT JOIN equipment e ON e.id=a.equipment_id LEFT JOIN service_orders o ON o.id=a.order_id LEFT JOIN quotes q ON q.id=o.quote_id ORDER BY CASE WHEN a.status='planned' THEN 0 ELSE 1 END,a.starts_at ASC`,
      )
    ).rows,
    orders: (
      await db.query(
        `SELECT o.id,o.status,q.code,q.client_id FROM service_orders o JOIN quotes q ON q.id=o.quote_id WHERE o.status IN ('pending','in_progress') ORDER BY q.code DESC`,
      )
    ).rows,
  };
}
export async function saveClient(input: unknown, actor: string, id?: string) {
  const b = client.parse(input);
  if (id) z.uuid().parse(id);
  return transaction(async (c) => {
    const r = id
      ? await c.query(
          "UPDATE clients SET name=$1,contact=$2,address=$3,notes=$4 WHERE id=$5 RETURNING *",
          [b.name, b.contact, b.address, b.notes, id],
        )
      : await c.query(
          "INSERT INTO clients(name,contact,address,notes) VALUES($1,$2,$3,$4) RETURNING *",
          [b.name, b.contact, b.address, b.notes],
        );
    if (!r.rowCount) throw new DomainError("Cliente não encontrado", 404);
    await event(c, null, actor, id ? "client_updated" : "client_created", {
      id: r.rows[0].id,
    });
    return r.rows[0];
  });
}
export async function saveEquipment(
  input: unknown,
  actor: string,
  id?: string,
) {
  const b = equipment.parse(input);
  if (id) z.uuid().parse(id);
  return transaction(async (c) => {
    if (
      !(await c.query("SELECT id FROM clients WHERE id=$1", [b.client_id]))
        .rowCount
    )
      throw new DomainError("Cliente não encontrado", 404);
    if (id) {
      const prior = (
        await c.query("SELECT * FROM equipment WHERE id=$1 FOR UPDATE", [id])
      ).rows[0];
      if (!prior) throw new DomainError("Equipamento não encontrado", 404);
      if (prior.client_id !== b.client_id)
        throw new DomainError(
          "O cliente de um equipamento cadastrado não pode ser trocado; preserve o histórico",
          409,
        );
    }
    const args = [
      b.client_id,
      b.label,
      b.brand_model,
      b.capacity_btu,
      b.serial,
      b.location,
      b.next_service,
    ];
    const r = id
      ? await c.query(
          "UPDATE equipment SET client_id=$1,label=$2,brand_model=$3,capacity_btu=$4,serial=$5,location=$6,next_service=$7 WHERE id=$8 RETURNING *",
          [...args, id],
        )
      : await c.query(
          "INSERT INTO equipment(client_id,label,brand_model,capacity_btu,serial,location,next_service) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
          args,
        );
    await event(
      c,
      null,
      actor,
      id ? "equipment_updated" : "equipment_created",
      { id: r.rows[0].id },
    );
    return r.rows[0];
  });
}
export async function scheduleVisit(input: unknown, actor: string) {
  const b = visit.parse(input);
  return transaction(async (c) => {
    if (
      !(await c.query("SELECT id FROM clients WHERE id=$1", [b.client_id]))
        .rowCount
    )
      throw new DomainError("Cliente não encontrado", 404);
    if (
      b.equipment_id &&
      !(
        await c.query("SELECT id FROM equipment WHERE id=$1 AND client_id=$2", [
          b.equipment_id,
          b.client_id,
        ])
      ).rowCount
    )
      throw new DomainError("Equipamento não pertence ao cliente");
    if (
      b.order_id &&
      !(
        await c.query(
          `SELECT o.id FROM service_orders o JOIN quotes q ON q.id=o.quote_id WHERE o.id=$1 AND q.client_id=$2 AND o.status IN ('pending','in_progress') FOR UPDATE OF o`,
          [b.order_id, b.client_id],
        )
      ).rowCount
    )
      throw new DomainError("OS indisponível para este cliente");
    await c.query("SELECT pg_advisory_xact_lock(hashtext(lower(trim($1))))", [
      b.technician,
    ]);
    const clash = await c.query(
      `SELECT id FROM appointments WHERE status='planned' AND lower(trim(technician))=lower(trim($1)) AND starts_at<$2::timestamptz+$3*interval '1 minute' AND starts_at+duration_minutes*interval '1 minute'>$2::timestamptz`,
      [b.technician, b.starts_at, b.duration_minutes],
    );
    if (clash.rowCount)
      throw new DomainError(
        "Técnico já tem uma visita nesse horário. Escolha outro horário ou técnico.",
        409,
      );
    const r = await c.query(
      "INSERT INTO appointments(client_id,equipment_id,order_id,technician,starts_at,duration_minutes,notes) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        b.client_id,
        b.equipment_id,
        b.order_id,
        b.technician,
        b.starts_at,
        b.duration_minutes,
        b.notes,
      ],
    );
    await event(c, null, actor, "visit_scheduled", { id: r.rows[0].id });
    return r.rows[0];
  });
}
export async function visitStatus(
  id: string,
  status: "completed" | "cancelled",
  actor: string,
) {
  z.uuid().parse(id);
  return transaction(async (c) => {
    const row = (
      await c.query("SELECT * FROM appointments WHERE id=$1 FOR UPDATE", [id])
    ).rows[0];
    if (!row) throw new DomainError("Visita não encontrada", 404);
    if (row.status === status) return { ok: true };
    if (row.status !== "planned")
      throw new DomainError("Visita já encerrada", 409);
    await c.query("UPDATE appointments SET status=$1 WHERE id=$2", [
      status,
      id,
    ]);
    await event(c, null, actor, "visit_" + status, { id });
    return { ok: true };
  });
}
