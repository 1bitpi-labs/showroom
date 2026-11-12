import { z } from "zod";
import { transaction } from "@/lib/db";
import { event } from "@/lib/domain";
import { operator, jsonBody, failure } from "@/lib/http";
export async function POST(req: Request) {
  try {
    const actor = await operator(req);
    const b = z
      .object({
        name: z.string().trim().min(2).max(120),
        color: z.enum(["#00777a", "#285b8a", "#73437e"]),
      })
      .strict()
      .parse(await jsonBody(req));
    await transaction(async (c) => {
      await c.query("UPDATE company_settings SET name=$1,color=$2 WHERE id=1", [
        b.name,
        b.color,
      ]);
      await event(c, null, actor, "brand_updated");
    });
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
