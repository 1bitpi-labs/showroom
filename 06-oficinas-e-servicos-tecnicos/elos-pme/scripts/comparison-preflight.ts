import { request } from "@playwright/test";
import { writeFileSync } from "node:fs";
async function main() {
  const results = [];
  for (const port of [3020, 3021]) {
    const base = `http://localhost:${port}`;
    const api = await request.newContext({
      baseURL: base,
      extraHTTPHeaders: { Origin: base },
    });
    const login = await api.post("/api/auth/sign-in/email", {
      data: {
        email: "operador@brisa.example",
        password: process.env.DEMO_PASSWORD ?? "",
      },
    });
    if (!login.ok()) throw Error(`Login ${port}: ${login.status()}`);
    const quotes = await api.get("/api/quotes");
    const operations = await api.get("/api/operations");
    const training = await api.get("/api/training");
    if (!quotes.ok() || !operations.ok() || !training.ok())
      throw Error("Falha de consulta autenticada");
    const q = await quotes.json(),
      o = await operations.json(),
      t = await training.json();
    results.push({
      port,
      login: login.status(),
      quotes: q.quotes.length,
      orders: q.orders.length,
      clients: o.clients.length,
      equipment: o.equipment.length,
      appointments: o.appointments.length,
      trainingProgress: t.progress.length,
      notifications: t.notifications.length,
    });
    await api.dispose();
  }
  writeFileSync(
    "/tmp/elos-comparison-preflight.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
