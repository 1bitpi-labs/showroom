import { db } from "../src/lib/db";
async function main() {
  await db.query("DELETE FROM public_links WHERE expires_at<now()");
  await db.query(
    "DELETE FROM request_limits WHERE reset_at<now()-interval '1 day'",
  );
  await db.end();
  console.log(
    "Links expirados e contadores antigos removidos; documentos e decisões preservados.",
  );
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
