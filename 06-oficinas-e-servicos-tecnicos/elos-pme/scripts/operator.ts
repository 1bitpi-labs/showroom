import { db } from "../src/lib/db";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";
async function main() {
  const email = process.env.OPERATOR_EMAIL;
  const password = process.env.OPERATOR_PASSWORD;
  if (!email || !email.includes("@") || !password || password.length < 12)
    throw Error(
      "Defina OPERATOR_EMAIL e OPERATOR_PASSWORD (mínimo 12 caracteres)",
    );
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    let user = (
      await client.query('SELECT id FROM "user" WHERE email=$1', [email])
    ).rows[0];
    if (!user) {
      user = { id: randomUUID() };
      await client.query(
        'INSERT INTO "user"(id,name,email,"emailVerified","createdAt","updatedAt") VALUES($1,$2,$3,true,now(),now())',
        [user.id, "Operador", email],
      );
      await client.query(
        'INSERT INTO account(id,"accountId","providerId","userId",password,"createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,now(),now())',
        [
          randomUUID(),
          user.id,
          "credential",
          user.id,
          await hashPassword(password),
        ],
      );
    } else {
      await client.query(
        'UPDATE account SET password=$1,"updatedAt"=now() WHERE "userId"=$2 AND "providerId"=$3',
        [await hashPassword(password), user.id, "credential"],
      );
      await client.query('DELETE FROM session WHERE "userId"=$1', [user.id]);
    }
    await client.query("COMMIT");
    console.log("Operador preparado; sessões anteriores revogadas.");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
    await db.end();
  }
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
