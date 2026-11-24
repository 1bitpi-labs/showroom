import { db } from "@/lib/db";
import { csvCell } from "@/lib/domain";
import { operator, failure } from "@/lib/http";
export async function GET(req: Request) {
  try {
    await operator(req);
    const rows = (
      await db.query(
        "SELECT q.code,r.snapshot->>'client_name' AS client,q.status,r.number,r.total_cents FROM quotes q JOIN revisions r ON r.quote_id=q.id AND r.number=q.current_revision ORDER BY q.code",
      )
    ).rows;
    const csv =
      "\uFEFF" +
      [
        ["Orçamento", "Cliente", "Status", "Revisão", "Centavos"],
        ...rows.map((r) => [
          r.code,
          r.client,
          r.status,
          r.number,
          r.total_cents,
        ]),
      ]
        .map((r) => r.map(csvCell).join(";"))
        .join("\r\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="orcamentos.csv"',
      },
    });
  } catch (e) {
    return failure(e);
  }
}
