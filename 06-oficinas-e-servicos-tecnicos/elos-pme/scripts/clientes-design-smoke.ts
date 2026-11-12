import { chromium, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
async function main() {
  const dir = "docs/evidence/clientes-design";
  mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
  });
  const results = [];
  try {
    for (const width of [360, 1280]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://localhost:3019/login");
      await page
        .getByLabel("E-mail", { exact: true })
        .fill("operador@brisa.example");
      await page
        .getByLabel("Senha", { exact: true })
        .fill(process.env.DEMO_PASSWORD ?? "");
      await page.getByRole("button", { name: "Entrar no painel" }).click();
      await page.waitForURL("http://localhost:3019/");
      const dialog = page.locator("dialog.training-dialog");
      if (await dialog.isVisible())
        await dialog
          .getByRole("button", { name: "Ver depois", exact: true })
          .click();
      async function goClients() {
        if (width < 761)
          await page.getByRole("button", { name: "Abrir navegação" }).click();
        await page
          .getByRole("navigation")
          .filter({ visible: true })
          .getByRole("button", { name: "Clientes", exact: true })
          .click();
      }
      await goClients();
      if (await dialog.isVisible())
        await dialog
          .getByRole("button", { name: "Voltar a Clientes", exact: true })
          .click();
      await page.getByRole("button", { name: "Adicionar cliente" }).click();
      await expect(page.locator(".client-editor")).toBeVisible();
      const name = "Cliente TREINO DESIGN " + width + " " + Date.now();
      await page.getByLabel("Nome do cliente", { exact: true }).fill(name);
      await page
        .getByLabel("Contato do cliente", { exact: true })
        .fill("design@example.invalid");
      await page
        .locator(".client-editor")
        .getByRole("button", { name: "Ajuda nesta aba", exact: true })
        .click();
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Tab");
      expect(
        await page.evaluate(() => !!document.activeElement?.closest("dialog")),
      ).toBe(true);
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(
        page.getByLabel("Nome do cliente", { exact: true }),
      ).toHaveValue(name);
      await page
        .getByRole("button", { name: "Salvar cliente", exact: true })
        .click();
      await expect(
        page.getByRole("status").filter({ hasText: "Cliente salvo." }),
      ).toBeVisible();
      await page.getByLabel("Buscar clientes", { exact: true }).fill(name);
      const record = page.locator(".client-record").filter({ hasText: name });
      await expect(record).toHaveCount(1);
      await record
        .getByRole("button", { name: "Editar cliente", exact: true })
        .click();
      await expect(
        page.getByLabel("Nome do cliente", { exact: true }),
      ).toBeFocused();
      await page
        .getByLabel("Nome do cliente", { exact: true })
        .fill(name + " Editado");
      await page
        .getByRole("button", { name: "Salvar cliente", exact: true })
        .click();
      await expect(
        page.getByRole("status").filter({ hasText: "Cliente salvo." }),
      ).toBeVisible();
      await expect(record).toContainText(name + " Editado");
      await page.reload();
      await goClients();
      await page
        .getByLabel("Buscar clientes", { exact: true })
        .fill(name + " Editado");
      await expect(page.locator(".client-record")).toHaveCount(1);
      const geometry = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        columns: getComputedStyle(document.querySelector(".clients-workspace")!)
          .gridTemplateColumns,
      }));
      expect(geometry.width).toBe(width);
      expect(geometry.scrollWidth).toBeLessThanOrEqual(width);
      await page
        .locator(".clients-workspace")
        .screenshot({ path: dir + "/clientes-" + width + ".png" });
      await page
        .getByLabel("Buscar clientes", { exact: true })
        .fill("Nenhum resultado " + name);
      await expect(
        page.getByText("Nenhum cliente corresponde à busca."),
      ).toBeVisible();
      expect(errors).toEqual([]);
      results.push({
        width,
        geometry,
        checks: [
          "cadastro persistido",
          "busca",
          "edicao com foco",
          "persistencia apos reload",
          "ajuda preserva campos",
          "Tab contido no modal",
          "Escape fecha ajuda",
          "busca vazia",
          "sem overflow",
          "sem pageerror",
        ],
      });
      await context.close();
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
