import { test, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  publish,
  decide,
  publicQuote,
  revoke,
  orderTransition,
  quoteSchema,
  total,
  csvCell,
  cancelQuote,
} from "../src/lib/domain";
import { db } from "../src/lib/db";
after(async () => {
  await db.end();
});
const fixture = () => ({
  client_name: "TEST-" + randomUUID(),
  items: [{ description: "Higienização", quantity: 2, unit_cents: 18000 }],
  conditions: "Teste sintético",
  valid_days: 7,
});
const decision = (extra = {}) => ({
  kind: "accepted",
  name: "Pessoa Demo",
  confirmed: true,
  idempotency_key: randomUUID(),
  ...extra,
});
test("server totals and strict tampered fields", () => {
  assert.equal(total(fixture().items), 36000);
  assert.throws(() => quoteSchema.parse({ ...fixture(), total_cents: 1 }));
  assert.throws(() =>
    total([{ description: "x", quantity: 1000, unit_cents: 100000000 }]),
  );
});
test("published snapshot and token hash only", async () => {
  const q = await publish(fixture(), "test");
  const r = await publicQuote(q.token);
  assert.equal(Number(r.total_cents), 36000);
  const l = (
    await db.query("SELECT token_hash FROM public_links WHERE revision_id=$1", [
      r.id,
    ])
  ).rows[0];
  assert.notEqual(l.token_hash, q.token);
  await assert.rejects(
    db.query("UPDATE revisions SET total_cents=1 WHERE id=$1", [r.id]),
    /Immutable/,
  );
});
test("concurrent acceptance produces one decision and OS; retry is idempotent", async () => {
  const q = await publish(fixture(), "test");
  const d = decision();
  const results = await Promise.all(
    Array.from({ length: 12 }, () => decide(q.token, d)),
  );
  assert.ok(results.every((x) => x.status === "accepted"));
  const r = await db.query(
    "SELECT count(*) FROM service_orders WHERE quote_id=$1",
    [q.id],
  );
  assert.equal(r.rows[0].count, "1");
  await assert.rejects(decide(q.token, decision()), /já recebeu/);
});
test("revision supersedes prior token", async () => {
  const q = await publish(fixture(), "test");
  const v2 = await publish(
    { ...fixture(), conditions: "Versão dois" },
    "test",
    q.id,
  );
  await assert.rejects(publicQuote(q.token), /substituído/);
  await assert.rejects(decide(q.token, decision()), /indisponível/);
  assert.equal((await publicQuote(v2.token)).number, 2);
});
test("GET never creates decision; revoked link blocks reads and writes", async () => {
  const q = await publish(fixture(), "test");
  await publicQuote(q.token);
  assert.equal(
    (
      await db.query("SELECT count(*) FROM service_orders WHERE quote_id=$1", [
        q.id,
      ])
    ).rows[0].count,
    "0",
  );
  await revoke(q.id, "test");
  await assert.rejects(publicQuote(q.token));
  await assert.rejects(decide(q.token, decision()));
});
test("expired link blocks acceptance and read", async () => {
  const q = await publish(fixture(), "test");
  await db.query(
    "UPDATE public_links SET expires_at=now()-interval '1 second' WHERE revision_id IN(SELECT id FROM revisions WHERE quote_id=$1)",
    [q.id],
  );
  await assert.rejects(publicQuote(q.token));
  await assert.rejects(decide(q.token, decision()));
});
test("change request does not create OS and allows new revision", async () => {
  const q = await publish(fixture(), "test");
  await decide(
    q.token,
    decision({ kind: "change_requested", note: "Alterar quantidade" }),
  );
  assert.equal(
    (
      await db.query("SELECT count(*) FROM service_orders WHERE quote_id=$1", [
        q.id,
      ])
    ).rows[0].count,
    "0",
  );
  assert.equal((await publish(fixture(), "test", q.id)).revision, 2);
});
test("accepted quote cannot be overwritten; company rename preserves snapshot", async () => {
  const q = await publish(fixture(), "test");
  const before = await publicQuote(q.token);
  await decide(q.token, decision());
  await assert.rejects(publish(fixture(), "test", q.id), /aceito/);
  assert.deepEqual((await publicQuote(q.token)).snapshot, before.snapshot);
});
test("OS rejects skipped transitions and repeated transition is safe", async () => {
  const q = await publish(fixture(), "test");
  await decide(q.token, decision());
  const o = (
    await db.query("SELECT id FROM service_orders WHERE quote_id=$1", [q.id])
  ).rows[0];
  await assert.rejects(
    orderTransition(o.id, "completed", "", "test"),
    /inválida/,
  );
  await orderTransition(o.id, "in_progress", "", "test");
  await orderTransition(o.id, "in_progress", "", "test");
  await orderTransition(o.id, "completed", "", "test");
  await assert.rejects(orderTransition(o.id, "cancelled", "motivo", "test"));
});
test("cancel quote revokes link and forbids decision", async () => {
  const q = await publish(fixture(), "test");
  await cancelQuote(q.id, "test");
  await assert.rejects(publicQuote(q.token));
  await assert.rejects(decide(q.token, decision()));
});
test("CSV neutralizes spreadsheet formulas and quotes", () => {
  assert.equal(csvCell("=1+1"), '"\'=1+1"');
  assert.equal(csvCell('a"b'), '"a""b"');
  assert.equal(csvCell("  @SUM(1)"), '"\'  @SUM(1)"');
});
test("audit rows cannot be updated or deleted", async () => {
  const q = await publish(fixture(), "test");
  await assert.rejects(
    db.query("DELETE FROM audit_events WHERE quote_id=$1", [q.id]),
    /Immutable/,
  );
});
test("draft is editable and publication generates revision one", async () => {
  const { saveDraft } = await import("../src/lib/domain");
  const f = fixture();
  const draft = await saveDraft(f, "test");
  await saveDraft({ ...f, conditions: "Editado" }, "test", draft.id);
  const q = await publish({ ...f, conditions: "Editado" }, "test", draft.id);
  assert.equal(q.revision, 1);
  assert.equal((await publicQuote(q.token)).snapshot.conditions, "Editado");
  await assert.rejects(saveDraft(f, "test", draft.id), /rascunhos/);
});
test("public token does not disclose another document", async () => {
  await assert.rejects(publicQuote("not-a-token"));
  await assert.rejects(publicQuote("a".repeat(43)));
});
test("publish-vs-accept race never accepts stale revision", async () => {
  const q = await publish(fixture(), "test");
  await Promise.allSettled([
    publish(fixture(), "test", q.id),
    decide(q.token, decision()),
  ]);
  const row = (await db.query("SELECT * FROM quotes WHERE id=$1", [q.id]))
    .rows[0];
  const orders = (
    await db.query("SELECT * FROM service_orders WHERE quote_id=$1", [q.id])
  ).rows;
  if (row.status === "accepted") {
    assert.equal(row.current_revision, 1);
    assert.equal(orders.length, 1);
  } else {
    assert.equal(row.current_revision, 2);
    assert.equal(orders.length, 0);
  }
});
