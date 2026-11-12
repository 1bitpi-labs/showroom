import { decide, publicQuote, hash } from "@/lib/domain";
import { sameOrigin, jsonBody, failure, limited } from "@/lib/http";
type C = { params: Promise<{ token: string }> };
export async function GET(_req: Request, ctx: C) {
  try {
    const { token } = await ctx.params;
    await limited(hash(token), 120);
    return Response.json(await publicQuote(token));
  } catch (e) {
    return failure(e);
  }
}
export async function POST(req: Request, ctx: C) {
  try {
    sameOrigin(req);
    const { token } = await ctx.params;
    await limited(hash(token), 20);
    return Response.json(await decide(token, await jsonBody(req)));
  } catch (e) {
    return failure(e);
  }
}
