import { operator, jsonBody, failure } from "@/lib/http";
import {
  operationsState,
  saveClient,
  saveEquipment,
  scheduleVisit,
  visitStatus,
} from "@/lib/operations";
import { z } from "zod";
const action = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("client"),
      id: z.uuid().optional(),
      input: z.unknown(),
    })
    .strict(),
  z
    .object({
      action: z.literal("equipment"),
      id: z.uuid().optional(),
      input: z.unknown(),
    })
    .strict(),
  z.object({ action: z.literal("visit"), input: z.unknown() }).strict(),
  z
    .object({
      action: z.literal("visit_status"),
      id: z.uuid(),
      status: z.enum(["completed", "cancelled"]),
    })
    .strict(),
]);
export async function GET(req: Request) {
  try {
    await operator(req);
    return Response.json(await operationsState());
  } catch (e) {
    return failure(e);
  }
}
export async function POST(req: Request) {
  try {
    const actor = await operator(req);
    const b = action.parse(await jsonBody(req));
    const result =
      b.action === "client"
        ? await saveClient(b.input, actor, b.id)
        : b.action === "equipment"
          ? await saveEquipment(b.input, actor, b.id)
          : b.action === "visit"
            ? await scheduleVisit(b.input, actor)
            : await visitStatus(b.id, b.status, actor);
    return Response.json(result);
  } catch (e) {
    return failure(e);
  }
}
