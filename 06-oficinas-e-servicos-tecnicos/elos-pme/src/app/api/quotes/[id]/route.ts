import { z } from "zod";
import { db } from "@/lib/db";
import {
  publish,
  saveDraft,
  revoke,
  cancelQuote,
  DomainError,
} from "@/lib/domain";
import { operator, jsonBody, failure } from "@/lib/http";
type C = { params: Promise<{ id: string }> };
export async function GET(req: Request, ctx: C) {
  try {
    await operator(req);
    const id = z.uuid().parse((await ctx.params).id);
    const rows = (
      await db.query(
        "SELECT * FROM revisions WHERE quote_id=$1 ORDER BY number DESC",
        [id],
      )
    ).rows;
    if (!rows.length) throw new DomainError("Não encontrado", 404);
    const events = (
      await db.query(
        "SELECT action,detail,created_at FROM audit_events WHERE quote_id=$1 ORDER BY id",
        [id],
      )
    ).rows;
    const decisions = (
      await db.query(
        "SELECT d.kind,d.name,d.note,d.created_at,r.number FROM decisions d JOIN revisions r ON r.id=d.revision_id WHERE r.quote_id=$1",
        [id],
      )
    ).rows;
    return Response.json({ revisions: rows, events, decisions });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(req: Request, ctx: C) {
  try {
    const actor = await operator(req);
    const id = z.uuid().parse((await ctx.params).id);
    const body = await jsonBody(req);
    if (body.action === "draft")
      return Response.json(await saveDraft(body.input, actor, id));
    if (body.action === "revise")
      return Response.json(await publish(body.input, actor, id));
    if (body.action === "revoke") {
      await revoke(id, actor);
      return Response.json({ ok: true });
    }
    if (body.action === "cancel") {
      await cancelQuote(id, actor);
      return Response.json({ ok: true });
    }
    throw new DomainError("Ação inválida");
  } catch (e) {
    return failure(e);
  }
}
