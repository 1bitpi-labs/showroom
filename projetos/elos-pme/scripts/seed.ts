import { db } from "../src/lib/db";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";
import { publish } from "../src/lib/domain";
async function main() {
  if (process.env.DEMO_MODE !== "true" || process.env.NODE_ENV === "production")
    throw new Error("Seed apenas em demo local");
  const password = process.env.DEMO_PASSWORD;
  if (!password || password.length < 12)
    throw new Error("Defina DEMO_PASSWORD com pelo menos 12 caracteres");
  const exists = await db.query('SELECT id FROM "user" WHERE email=$1', [
    "operador@brisa.example",
  ]);
  if (!exists.rowCount) {
    const id = randomUUID();
    await db.query(
      'INSERT INTO "user"(id,name,email,"emailVerified","createdAt","updatedAt") VALUES($1,$2,$3,true,now(),now())',
      [id, "Operador Demo", "operador@brisa.example"],
    );
    await db.query(
      'INSERT INTO account(id,"accountId","providerId","userId",password,"createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,now(),now())',
      [randomUUID(), id, "credential", id, await hashPassword(password)],
    );
  }
  const count = await db.query("SELECT count(*) FROM quotes");
  if (count.rows[0].count === "0")
    await publish(
      {
        client_name: "Cliente Demonstração A",
        contact: "cliente@example.invalid",
        items: [
          {
            description: "Higienização de ar-condicionado",
            quantity: 2,
            unit_cents: 18000,
          },
        ],
        conditions:
          "Valores sintéticos. Serviço sujeito à avaliação técnica. Nenhuma cobrança real.",
        valid_days: 7,
      },
      "seed",
    );
  console.log(
    "Demo preparada. Entre como operador@brisa.example usando DEMO_PASSWORD.",
  );
  await db.end();
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
