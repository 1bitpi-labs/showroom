import { z } from "zod";
import { db, transaction } from "./db";
import { DomainError } from "./domain";
import { tours, TOUR_VERSION } from "./training-content";
export async function trainingState(userId: string) {
  const progress = (
    await db.query(
      "SELECT tour,version,status,completed_at FROM training_progress WHERE user_id=$1",
      [userId],
    )
  ).rows;
  const notifications = (
    await db.query(
      "SELECT n.id,n.title,n.body,n.read_at,n.created_at,t.tour FROM notifications n JOIN training_progress t ON t.id=n.training_id WHERE n.user_id=$1 ORDER BY n.created_at DESC",
      [userId],
    )
  ).rows;
  return { progress, notifications };
}
export async function recordTraining(userId: string, input: unknown) {
  const b = z
    .object({
      tour: z.string(),
      version: z.literal(TOUR_VERSION),
      status: z.enum(["skipped", "completed"]),
      step: z.number().int().min(0),
    })
    .strict()
    .parse(input);
  const definition = Object.hasOwn(tours, b.tour) ? tours[b.tour] : null;
  if (!definition || b.step >= definition.steps.length)
    throw new DomainError("Treinamento desconhecido");
  if (b.status === "completed" && b.step !== definition.steps.length - 1)
    throw new DomainError("Percorra os passos antes de concluir");
  return transaction(async (c) => {
    const row = (
      await c.query(
        `INSERT INTO training_progress(user_id,tour,version,status,completed_at) VALUES($1,$2,$3,$4,CASE WHEN $4='completed' THEN now() ELSE NULL END) ON CONFLICT(user_id,tour,version) DO UPDATE SET status=CASE WHEN training_progress.status='completed' THEN 'completed' ELSE EXCLUDED.status END, completed_at=COALESCE(training_progress.completed_at,EXCLUDED.completed_at),updated_at=now() RETURNING *`,
        [userId, b.tour, b.version, b.status],
      )
    ).rows[0];
    if (b.status === "completed")
      await c.query(
        "INSERT INTO notifications(user_id,training_id,title,body) VALUES($1,$2,$3,$4) ON CONFLICT(training_id) DO NOTHING",
        [
          userId,
          row.id,
          `Guia concluído: ${definition.title}`,
          `Você concluiu a leitura do guia de ${definition.title.toLowerCase()}. Pode refazê-lo quando precisar. Este registro não é uma certificação técnica.`,
        ],
      );
    return { status: row.status };
  });
}
export async function readNotification(userId: string, id: string) {
  z.uuid().parse(id);
  const r = await db.query(
    "UPDATE notifications SET read_at=COALESCE(read_at,now()) WHERE id=$1 AND user_id=$2 RETURNING id",
    [id, userId],
  );
  if (!r.rowCount) throw new DomainError("Aviso não encontrado", 404);
  return { ok: true };
}
