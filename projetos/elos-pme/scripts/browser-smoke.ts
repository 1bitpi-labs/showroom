import { skipTour } from "./skip-tour";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
async function main() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
  });
  const errors: string[] = [];
  try {
    for (const width of [1280, 360]) {
      const clientName = `BROWSER Demo ${width} ${Date.now()}`;
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://localhost:3017/login");
      await page
        .getByLabel("E-mail", { exact: true })
        .fill("operador@brisa.example");
      await page
        .getByLabel("Senha", { exact: true })
        .fill(process.env.DEMO_PASSWORD!);
      await page.getByRole("button", { name: "Entrar no painel" }).click();
      await page.waitForURL("http://localhost:3017/");
      await skipTour(page, "quotes");
      await page.getByRole("button", { name: "+ Novo orçamento" }).click();
      await page.getByLabel("Cliente", { exact: true }).fill(clientName);
      await page.getByRole("button", { name: "Publicar e gerar link" }).click();
      await page
        .getByRole("link", { name: "Abrir portal do cliente" })
        .waitFor();
      const link = await page.getByLabel("Link do orçamento").inputValue();
      await page.screenshot({
        path: `docs/evidence/dashboard-${width}.png`,
        fullPage: true,
      });
      const publicPage = await context.newPage();
      await publicPage.goto(link);
      await publicPage.getByLabel("Seu nome").fill("Pessoa Sintética");
      await publicPage.getByRole("checkbox").check();
      await publicPage
        .getByRole("button", { name: "Confirmar aprovação" })
        .click();
      await publicPage
        .getByRole("heading", { name: "Orçamento aprovado." })
        .waitFor();
      await publicPage.screenshot({
        path: `docs/evidence/portal-${width}.png`,
        fullPage: true,
      });
      assert.ok(
        await publicPage.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      );
      await page.reload();
      await page
        .getByRole("button", { name: "Ordens de serviço", exact: true })
        .click();
      await skipTour(page, "orders");
      await page.getByText(clientName, { exact: true }).waitFor();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      );
      // Exercise public network failure, keyboard focus, and recovery without resubmitting a decision.
      await publicPage.keyboard.press("Tab");
      assert.ok(
        await publicPage.evaluate(
          () => document.activeElement?.tagName !== "BODY",
        ),
      );
      await context.setOffline(true);
      await publicPage.reload().catch(() => {});
      await context.setOffline(false);
      await publicPage.goto(link);
      await publicPage
        .getByRole("heading", { name: "Orçamento aprovado." })
        .waitFor();
      await context.close();
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS: desktop 1280 e mobile 360, login → publicação → aceite → OS; sem overflow ou erros JS.",
    );
  } finally {
    await browser.close();
  }
}
mkdirSync("docs/evidence", { recursive: true });
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
