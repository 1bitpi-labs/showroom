import { test, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import {
  saveClient,
  saveEquipment,
  scheduleVisit,
  visitStatus,
} from "../src/lib/operations";
import {
  trainingState,
  recordTraining,
  readNotification,
} from "../src/lib/training";
import { publish, saveDraft, publicQuote } from "../src/lib/domain";
const ids: string[] = [];
async function user() {
  const id = randomUUID();
  await db.query(
    'INSERT INTO "user"(id,name,email,"emailVerified","createdAt","updatedAt") VALUES($1,$2,$3,true,now(),now())',
    [id, "Teste", id + "@example.invalid"],
  );
  ids.push(id);
  return id;
}
const client = (name = "Cliente " + randomUUID()) =>
  saveClient(
    {
      name,
      contact: "contato@example.invalid",
      address: "Local sintético",
      notes: "Teste",
    },
    "test",
  );
const asset = (id: string) => ({
  client_id: id,
  label: "Split recepção",
  brand_model: "Modelo demo",
  capacity_btu: 12000,
  serial: "DEMO",
  location: "Recepção",
  next_service: "2027-04-10",
});
const visit = (id: string, technician = "Técnico " + randomUUID()) => ({
  client_id: id,
  equipment_id: null,
  order_id: null,
  technician,
  starts_at: "2027-06-10T12:00:00Z",
  duration_minutes: 60,
  notes: "Sintético",
});
after(async () => {
  for (const id of ids) await db.query('DELETE FROM "user" WHERE id=$1', [id]);
  await db.end();
});
test("training is per user, skip is distinct, early completion rejected", async () => {
  const a = await user(),
    b = await user();
  await recordTraining(a, {
    tour: "quotes",
    version: 1,
    status: "skipped",
    step: 0,
  });
  assert.equal((await trainingState(a)).progress[0].status, "skipped");
  assert.equal((await trainingState(a)).notifications.length, 0);
  assert.equal((await trainingState(b)).progress.length, 0);
  await assert.rejects(
    recordTraining(a, {
      tour: "quotes",
      version: 1,
      status: "completed",
      step: 0,
    }),
  );
  await assert.rejects(
    recordTraining(a, {
      tour: "__proto__",
      version: 1,
      status: "skipped",
      step: 0,
    }),
  );
  await assert.rejects(
    recordTraining(a, {
      tour: "quotes",
      version: 2,
      status: "skipped",
      step: 0,
    }),
  );
});
test("concurrent training completion is idempotent and notifications isolated", async () => {
  const a = await user(),
    b = await user();
  await Promise.all(
    Array.from({ length: 10 }, () =>
      recordTraining(a, {
        tour: "clients",
        version: 1,
        status: "completed",
        step: 2,
      }),
    ),
  );
  const state = await trainingState(a);
  assert.equal(state.progress.length, 1);
  assert.equal(state.notifications.length, 1);
  await assert.rejects(readNotification(b, state.notifications[0].id));
  await readNotification(a, state.notifications[0].id);
  assert.ok((await trainingState(a)).notifications[0].read_at);
  await recordTraining(a, {
    tour: "clients",
    version: 1,
    status: "skipped",
    step: 0,
  });
  assert.equal((await trainingState(a)).progress[0].status, "completed");
  assert.equal((await trainingState(a)).notifications.length, 1);
});
test("equipment has real customer ownership and preserves that link", async () => {
  const c = await client(),
    other = await client();
  const e = await saveEquipment(asset(c.id), "test");
  assert.equal(e.capacity_btu, 12000);
  await assert.rejects(saveEquipment(asset(other.id), "test", e.id), /trocado/);
  await assert.rejects(
    saveEquipment({ ...asset(c.id), capacity_btu: -1 }, "test"),
  );
  await assert.rejects(
    saveEquipment(asset(randomUUID()), "test"),
    /encontrado/,
  );
});
test("quote reuses customer record and ignores stale/tampered name", async () => {
  const c = await client();
  const count = Number(
    (await db.query("SELECT count(*) FROM clients WHERE name=$1", [c.name]))
      .rows[0].count,
  );
  const f = {
    client_id: c.id,
    client_name: "nome adulterado",
    contact: "",
    items: [{ description: "Teste", quantity: 1, unit_cents: 100 }],
    conditions: "Teste",
    valid_days: 7,
  };
  const draft = await saveDraft(f, "test");
  const q = await publish(f, "test", draft.id);
  assert.equal((await publicQuote(q.token)).snapshot.client_name, c.name);
  assert.equal(
    Number(
      (await db.query("SELECT count(*) FROM clients WHERE name=$1", [c.name]))
        .rows[0].count,
    ),
    count,
  );
  await saveClient(
    {
      name: "Nome corrigido",
      contact: c.contact,
      address: c.address,
      notes: c.notes,
    },
    "test",
    c.id,
  );
  assert.equal((await publicQuote(q.token)).snapshot.client_name, c.name);
});
test("visits validate customer/equipment/OS coherence", async () => {
  const c = await client(),
    other = await client(),
    e = await saveEquipment(asset(other.id), "test");
  await assert.rejects(
    scheduleVisit({ ...visit(c.id), equipment_id: e.id }, "test"),
    /pertence/,
  );
  await assert.rejects(
    scheduleVisit({ ...visit(c.id), order_id: randomUUID() }, "test"),
    /OS/,
  );
});
test("concurrent technician bookings reject overlaps, adjacency allowed", async () => {
  const c = await client();
  const v = visit(c.id);
  const results = await Promise.allSettled([
    scheduleVisit(v, "test"),
    scheduleVisit(
      { ...v, technician: " " + v.technician.toUpperCase() + " " },
      "test",
    ),
  ]);
  assert.equal(results.filter((x) => x.status === "fulfilled").length, 1);
  const second = await scheduleVisit(
    { ...v, starts_at: "2027-06-10T13:00:00Z" },
    "test",
  );
  assert.equal(second.status, "planned");
  await visitStatus(second.id, "cancelled", "test");
  await scheduleVisit({ ...v, starts_at: "2027-06-10T13:00:00Z" }, "test");
});
test("visit completion is idempotent, closed visit cannot change status", async () => {
  const c = await client(),
    v = await scheduleVisit(visit(c.id), "test");
  await visitStatus(v.id, "completed", "test");
  await visitStatus(v.id, "completed", "test");
  await assert.rejects(visitStatus(v.id, "cancelled", "test"), /encerrada/);
});
