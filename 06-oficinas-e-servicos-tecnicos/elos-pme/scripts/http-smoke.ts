import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const base = process.env.BETTER_AUTH_URL!;
async function main() {
  let checks = 0;
  let cookies = "";
  async function request(
    path: string,
    body?: unknown,
    origin = base,
    authenticated = true,
  ) {
    const r = await fetch(base + path, {
      method: body ? "POST" : "GET",
      redirect: "manual",
      headers: {
        ...(authenticated ? { cookie: cookies } : {}),
        ...(body ? { "Content-Type": "application/json", origin } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return r;
  }
  for (const path of [
    "/api/quotes",
    "/api/export",
    "/api/quotes/" + randomUUID(),
    "/api/pdf/" + randomUUID(),
  ]) {
    assert.equal((await request(path, undefined, base, false)).status, 401);
    checks++;
  }
  const login = await request("/api/auth/sign-in/email", {
    email: "operador@brisa.example",
    password: process.env.DEMO_PASSWORD,
  });
  assert.equal(login.status, 200);
  cookies = login.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  assert.ok(cookies);
  checks++;
  assert.equal(
    (
      await request("/api/auth/sign-up/email", {
        name: "Invalid",
        email: "invalid@example.invalid",
        password: "password-12345",
      })
    ).status,
    400,
  );
  checks++;
  const f = {
    client_name: "SMOKE Demo",
    items: [
      {
        description: "Serviço <script> sintético",
        quantity: 2,
        unit_cents: 18000,
      },
    ],
    conditions: "Somente demonstração",
    valid_days: 7,
  };
  assert.equal(
    (await request("/api/quotes", f, "https://evil.invalid")).status,
    403,
  );
  checks++;
  const res = await request("/api/quotes", f);
  assert.equal(res.status, 201);
  const q = await res.json();
  checks++;
  const r = await request("/api/public/" + q.token, undefined, base, false);
  assert.equal(r.status, 200);
  const rev = await r.json();
  assert.equal(rev.total_cents, "36000");
  checks++;
  const pdf = await request(
    `/api/pdf/${rev.id}?token=${q.token}`,
    undefined,
    base,
    false,
  );
  assert.equal(pdf.status, 200);
  assert.ok(
    Buffer.from(await pdf.arrayBuffer())
      .subarray(0, 5)
      .toString() === "%PDF-",
  );
  checks++;
  const d = {
    kind: "accepted",
    name: "Pessoa Demo",
    confirmed: true,
    idempotency_key: randomUUID(),
  };
  assert.equal(
    (await request("/api/public/" + q.token, d, "https://evil.invalid", false))
      .status,
    403,
  );
  checks++;
  assert.equal(
    (await request("/api/public/" + q.token, d, base, false)).status,
    200,
  );
  assert.equal(
    (await request("/api/public/" + q.token, d, base, false)).status,
    200,
  );
  checks += 2;
  const csv = await request("/api/export");
  assert.equal(csv.status, 200);
  assert.match(await csv.text(), /SMOKE Demo/);
  checks++;
  const page = await request("/p/" + q.token, undefined, base, false);
  assert.equal(page.status, 200);
  checks++;
  const revoked = await request("/api/quotes/" + q.id, { action: "revoke" });
  assert.equal(revoked.status, 200);
  assert.equal(
    (await request("/api/public/" + q.token, undefined, base, false)).status,
    410,
  );
  checks += 2;
  console.log(
    JSON.stringify(
      {
        checks,
        status: "PASS",
        scope:
          "HTTP auth, CSRF, PDF, public decision, export, revocation; synthetic data only",
      },
      null,
      2,
    ),
  );
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
