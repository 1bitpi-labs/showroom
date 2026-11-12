import { z } from "zod";
import { orderTransition } from "@/lib/domain";
import { operator, jsonBody, failure } from "@/lib/http";
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await operator(req);
    const id = z.uuid().parse((await ctx.params).id);
    const b = z
      .object({
        status: z.enum(["in_progress", "completed", "cancelled"]),
        reason: z.string().max(1000).default(""),
      })
      .parse(await jsonBody(req));
    await orderTransition(id, b.status, b.reason, actor);
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
