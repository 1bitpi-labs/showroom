import { getMigrations } from "better-auth/db/migration";
import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";
import { readFileSync } from "node:fs";
async function main() {
  const m = await getMigrations(auth.options);
  await m.runMigrations();
  await db.query(readFileSync("scripts/schema.sql", "utf8"));
  await db.end();
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
