import { auth } from "./auth";
import { DomainError } from "./domain";
import { db } from "./db";
import { ZodError } from "zod";
export async function operator(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) throw new DomainError("Entre para continuar", 401);
  if (req.method !== "GET") sameOrigin(req);
  return session.user.id;
}
export function sameOrigin(req: Request) {
  const expected = new URL(process.env.BETTER_AUTH_URL!).origin;
  if (req.headers.get("origin") !== expected)
    throw new DomainError("Origem inválida", 403);
}
export async function jsonBody(req: Request) {
  const reader = req.body?.getReader();
  if (!reader) throw new DomainError("Corpo ausente");
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 24000) {
      await reader.cancel();
      throw new DomainError("Documento muito grande", 413);
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new DomainError("JSON inválido");
  }
}
export async function limited(key: string, max = 20) {
  const r = await db.query(
    "INSERT INTO request_limits(key,hits,reset_at) VALUES($1,1,now()+interval '1 minute') ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN request_limits.reset_at<now() THEN 1 ELSE request_limits.hits+1 END,reset_at=CASE WHEN request_limits.reset_at<now() THEN now()+interval '1 minute' ELSE request_limits.reset_at END RETURNING hits",
    [key],
  );
  if (r.rows[0].hits > max)
    throw new DomainError("Muitas tentativas. Aguarde um minuto.", 429);
}
export function failure(e: unknown) {
  if (e instanceof DomainError)
    return Response.json({ error: e.message }, { status: e.status });
  if (e instanceof ZodError)
    return Response.json(
      { error: "Confira os campos e valores do formulário." },
      { status: 400 },
    );
  return Response.json(
    { error: "Não foi possível concluir. Tente novamente." },
    { status: 500 },
  );
}
