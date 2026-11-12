import { db } from "@/lib/db";
import { publish, saveDraft } from "@/lib/domain";
import { operator, jsonBody, failure } from "@/lib/http";
export async function GET(req: Request) {
  try {
    await operator(req);
    const quotes = (
      await db.query(
        `SELECT q.*,c.name AS client_name,c.contact,COALESCE(r.snapshot,jsonb_build_object('client_name',q.draft->'client_name','conditions',q.draft->'conditions','items',q.draft->'items')) AS snapshot,COALESCE(r.total_cents,0) AS total_cents,r.valid_until,CASE WHEN q.status='sent' AND r.valid_until<now() THEN 'expired' ELSE q.status END AS display_status FROM quotes q JOIN clients c ON c.id=q.client_id LEFT JOIN revisions r ON r.quote_id=q.id AND r.number=q.current_revision ORDER BY q.created_at DESC`,
      )
    ).rows;
    const orders = (
      await db.query(
        "SELECT o.*,q.code,r.snapshot FROM service_orders o JOIN quotes q ON q.id=o.quote_id JOIN revisions r ON r.id=o.revision_id ORDER BY o.created_at DESC",
      )
    ).rows;
    const settings = (
      await db.query("SELECT * FROM company_settings WHERE id=1")
    ).rows[0];
    for (const q of quotes) {
      if (q.display_status === "draft")
        q.total_cents = q.snapshot.items.reduce(
          (sum: number, x: { quantity: number; unit_cents: number }) =>
            sum + x.quantity * x.unit_cents,
          0,
        );
    }
    return Response.json({ quotes, orders, settings });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(req: Request) {
  try {
    const actor = await operator(req);
    const b = await jsonBody(req);
    return Response.json(
      b.action === "draft"
        ? await saveDraft(b.input, actor)
        : await publish(b, actor),
      { status: 201 },
    );
  } catch (e) {
    return failure(e);
  }
}
