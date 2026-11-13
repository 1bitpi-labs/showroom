import { db } from "../src/lib/db";
async function main() {
  if (
    process.env.DEMO_MODE !== "true" ||
    process.env.NODE_ENV === "production" ||
    process.argv[2] !== "--confirm-local-demo"
  )
    throw Error("Reset somente na demo local, com confirmação explícita");
  await db.query(
    "TRUNCATE audit_events,service_orders,decisions,public_links,revisions,quotes,clients RESTART IDENTITY CASCADE",
  );
  await db.end();
  console.log("Dados sintéticos removidos; execute demo:seed.");
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
