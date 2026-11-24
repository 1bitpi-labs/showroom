import { operator, jsonBody, failure } from "@/lib/http";
import {
  trainingState,
  recordTraining,
  readNotification,
} from "@/lib/training";
import { z } from "zod";
export async function GET(req: Request) {
  try {
    return Response.json(await trainingState(await operator(req)));
  } catch (e) {
    return failure(e);
  }
}
export async function POST(req: Request) {
  try {
    const user = await operator(req);
    const b = await jsonBody(req);
    if (b.action === "read") {
      const data = z
        .object({ action: z.literal("read"), id: z.uuid() })
        .strict()
        .parse(b);
      return Response.json(await readNotification(user, data.id));
    }
    return Response.json(await recordTraining(user, b));
  } catch (e) {
    return failure(e);
  }
}
