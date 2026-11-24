import { chromium, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
async function main() {
  const dir = "docs/evidence/full-design";
  mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
  });
  const results = [];
  try {
    for (const width of [360, 768, 1280]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const p = await ctx.newPage();
      p.setDefaultTimeout(15000);
      const errors: string[] = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto("http://localhost:3019/login");
      await p
        .getByLabel("E-mail", { exact: true })
        .fill("operador@brisa.example");
      await p
        .getByLabel("Senha", { exact: true })
        .fill(process.env.DEMO_PASSWORD ?? "");
      await p.getByRole("button", { name: "Entrar no painel" }).click();
      await p.waitForURL("http://localhost:3019/");
      async function dismiss() {
        const d = p.locator("dialog.training-dialog");
        if (await d.isVisible()) await p.keyboard.press("Escape");
      }
      async function tab(name: string) {
        await dismiss();
        if (width < 761)
          await p.getByRole("button", { name: "Abrir navegação" }).click();
        await p
          .getByRole("navigation")
          .filter({ visible: true })
          .getByRole("button", { name, exact: name !== "Caixa de entrada" })
          .click();
        await dismiss();
      }
      async function post(url: string, body: unknown) {
        return p.evaluate(
          async ({ url, body }) => {
            const r = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            const b = await r.json();
            if (!r.ok) throw Error(JSON.stringify(b));
            return b;
          },
          { url, body },
        );
      }
      await dismiss();
      const fixture = "TREINO VISUAL " + width + " " + Date.now();
      const quote = await post("/api/quotes", {
        client_name: fixture,
        contact: "qa@example.invalid",
        items: [
          { description: "Serviço sintético", quantity: 1, unit_cents: 18000 },
        ],
        conditions: "Demonstração sintética",
        valid_days: 7,
      });
      await post("/api/public/" + quote.token, {
        kind: "accepted",
        name: "Responsável fictício",
        confirmed: true,
        idempotency_key: crypto.randomUUID(),
      });
      await p.reload();
      await tab("Orçamentos");
      await p.getByLabel("Buscar por cliente ou número").fill(fixture);
      await p.getByRole("button", { name: "Aprovado", exact: true }).click();
      await expect(p.locator(".quote")).toHaveCount(1);
      await p
        .getByRole("button", { name: "Histórico / PDF", exact: true })
        .click();
      await expect(p.locator("dialog.history-drawer")).toBeVisible();
      await expect(p.getByRole("link", { name: /Baixar PDF/ })).toBeVisible();
      await p.keyboard.press("Escape");
      await p.getByRole("button", { name: "Todos", exact: true }).click();
      await p.getByLabel("Buscar por cliente ou número").fill("");
      const pages: Record<string, unknown>[] = [];
      for (const name of [
        "Orçamentos",
        "Ordens de serviço",
        "Clientes",
        "Equipamentos",
        "Agenda",
        "Caixa de entrada",
        "Configurações",
        "Guia de uso",
      ]) {
        await tab(name);
        await expect(p.locator("main h1")).toBeVisible();
        await expect(
          p.locator("main").getByText(/Carregando operação/),
        ).toHaveCount(0);
        const size = await p.evaluate(() => ({
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(size.scrollWidth).toBeLessThanOrEqual(width);
        pages.push({ name, ...size });
        await p.screenshot({
          path:
            dir +
            "/" +
            width +
            "-" +
            [
              "Orçamentos",
              "Ordens de serviço",
              "Clientes",
              "Equipamentos",
              "Agenda",
              "Caixa de entrada",
              "Configurações",
              "Guia de uso",
            ].indexOf(name) +
            ".png",
          fullPage: true,
        });
      }
      await tab("Ordens de serviço");
      await p.getByRole("button", { name: "Quadro", exact: true }).click();
      await expect(p.locator(".order-column")).toHaveCount(4);
      const os = p.locator(".quote").filter({ hasText: fixture });
      await os.getByRole("button", { name: "Iniciar serviço" }).click();
      await expect(os.locator(".badge")).toHaveText("Em andamento");
      await os.getByRole("button", { name: "Concluir", exact: true }).click();
      await expect(os.locator(".badge")).toHaveText("Concluído");
      await p.reload();
      await tab("Ordens de serviço");
      await expect(
        p.locator(".quote").filter({ hasText: fixture }).locator(".badge"),
      ).toHaveText("Concluído");
      await p.keyboard.press("Control+k");
      await expect(p.locator(".command-dialog")).toBeVisible();
      await p.getByLabel("Buscar abas e orçamentos").fill(fixture);
      await p.locator(".command-results button").click();
      await expect(p.locator(".quote")).toHaveCount(1);
      await tab("Configurações");
      await p
        .getByLabel("Nome exibido nos próximos orçamentos", { exact: true })
        .fill("Brisa Oficina — QA " + width);
      await expect(p.locator(".brand-preview")).toContainText("QA " + width);
      await p.getByRole("button", { name: "Salvar configurações" }).click();
      await expect(
        p.getByRole("status").filter({ hasText: "Marca salva." }),
      ).toBeVisible();
      expect(errors).toEqual([]);
      results.push({
        width,
        pages,
        checks: [
          "filtros reais",
          "historico/PDF",
          "oito abas sem overflow",
          "OS quadro e transicoes persistidas",
          "busca global",
          "previa e persistencia marca",
          "sem pageerror",
        ],
      });
      await ctx.close();
    }
    writeFileSync(dir + "/resultado.json", JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
