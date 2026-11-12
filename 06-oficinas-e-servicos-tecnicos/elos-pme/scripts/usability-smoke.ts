import { skipTour } from "./skip-tour";
import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";

async function main() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
  });
  const errors: string[] = [];
  let assertions = 0;
  try {
    for (const width of [1280, 360]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      let posts = 0;
      page.on("request", (r) => {
        if (r.method() === "POST" && r.url().includes("/api/quotes")) posts++;
      });
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
      await expect(
        page.getByRole("region", { name: "Primeiros passos", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Ocultar primeiros passos" })
        .click();
      await page.reload();
      await expect(
        page.getByRole("region", { name: "Primeiros passos", exact: true }),
      ).toHaveCount(0);
      assertions += 2;
      await page
        .getByRole("button", { name: "Guia de uso", exact: true })
        .click();
      await skipTour(page, "guide");
      await expect(
        page.getByRole("region", { name: "Guia de uso", exact: true }),
      ).toBeVisible();
      await page.getByText("Revogar ou cancelar?", { exact: true }).click();
      await expect(
        page.getByText(
          "Revogar bloqueia o acesso público e preserva o histórico e decisões.",
          { exact: false },
        ),
      ).toBeVisible();
      assertions += 2;
      await page.getByRole("button", { name: "Criar meu orçamento" }).click();
      const help = page.getByRole("button", {
        name: "Ajuda: Cliente",
        exact: true,
      });
      await help.focus();
      await page.keyboard.press("Enter");
      await expect(help).toHaveAttribute("aria-expanded", "true");
      const input = page.getByLabel("Cliente", { exact: true });
      const descriptionId = await input.getAttribute("aria-describedby");
      assert.ok(descriptionId);
      assert.ok(
        await page.evaluate(
          (id) => !!document.getElementById(id!),
          descriptionId,
        ),
      );
      await page.keyboard.press("Escape");
      await expect(help).toHaveAttribute("aria-expanded", "false");
      await expect(help).toBeFocused();
      await page.keyboard.press("Space");
      await expect(help).toHaveAttribute("aria-expanded", "true");
      await help.click();
      await expect(help).toHaveAttribute("aria-expanded", "false");
      assert.equal(posts, 0);
      assert.equal(await input.inputValue(), "");
      assertions += 8;
      assert.equal(await page.locator("label button").count(), 0);
      const rect = await help.boundingBox();
      assert.ok(rect && rect.width >= 44 && rect.height >= 44);
      assertions += 2;
      await page.getByRole("button", { name: "+ Adicionar item" }).click();
      await expect(
        page.getByRole("button", {
          name: "Ajuda: Quantidade (item 2)",
          exact: true,
        }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Remover item 2", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Ajuda: Validade (dias)", exact: true })
        .click();
      await expect(
        page.getByRole("note").filter({ hasText: "Prazo de 1 a 90 dias" }),
      ).toBeVisible();
      assertions += 2;
      const clientName = `USABILITY ${width} ${Date.now()}`;
      await input.fill(clientName);
      await page.screenshot({
        path: `docs/evidence/usability-form-${width}.png`,
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Salvar rascunho", exact: true })
        .click();
      await expect(
        page.getByRole("status").filter({ hasText: "Rascunho salvo." }),
      ).toBeVisible();
      const draft = page.getByRole("article").filter({ hasText: clientName });
      await expect(draft.getByText("Rascunho", { exact: true })).toBeVisible();
      await draft.getByRole("button", { name: "Editar rascunho" }).click();
      await expect(input).toHaveValue(clientName);
      assertions += 3;
      await page.getByRole("button", { name: "Publicar e gerar link" }).click();
      await page
        .getByRole("link", { name: "Abrir portal do cliente" })
        .waitFor();
      const link = await page.getByLabel("Link do orçamento").inputValue();
      const publicPage = await context.newPage();
      publicPage.on("pageerror", (e) => errors.push(e.message));
      await publicPage.goto(link);
      const decisionHelp = publicPage.getByRole("button", {
        name: "Ajuda: Sua decisão",
        exact: true,
      });
      await decisionHelp.click();
      await expect(
        publicPage
          .getByRole("note")
          .filter({ hasText: "sem aprovar nem alterar preços" }),
      ).toBeVisible();
      await publicPage
        .getByLabel("Sua decisão", { exact: true })
        .selectOption("change_requested");
      await publicPage
        .getByRole("button", {
          name: "Ajuda: O que precisa mudar?",
          exact: true,
        })
        .click();
      await expect(
        publicPage
          .getByRole("note")
          .filter({ hasText: "não muda o orçamento automaticamente" }),
      ).toBeVisible();
      assertions += 2;
      await publicPage.screenshot({
        path: `docs/evidence/usability-portal-${width}.png`,
        fullPage: true,
      });
      await publicPage
        .getByLabel("Sua decisão", { exact: true })
        .selectOption("accepted");
      await publicPage
        .getByLabel("Seu nome", { exact: true })
        .fill("Pessoa Sintética");
      await publicPage.getByRole("checkbox").check();
      await publicPage
        .getByRole("button", { name: "Confirmar aprovação" })
        .click();
      await expect(
        publicPage.getByRole("heading", { name: "Orçamento aprovado." }),
      ).toBeVisible();
      assertions++;
      await page.reload();
      await page
        .getByRole("button", { name: "Ordens de serviço", exact: true })
        .click();
      await skipTour(page, "orders");
      const order = page.getByRole("article").filter({ hasText: clientName });
      await order.getByRole("button", { name: "Iniciar serviço" }).click();
      await expect(
        page.getByRole("status").filter({ hasText: "Serviço iniciado." }),
      ).toBeVisible();
      await order
        .getByRole("button", { name: "Concluir", exact: true })
        .click();
      await expect(
        page.getByRole("status").filter({ hasText: "Serviço concluído." }),
      ).toBeVisible();
      assertions += 2;
      await page
        .getByRole("button", { name: "Orçamentos", exact: true })
        .click();
      await page
        .getByLabel("Buscar por cliente ou número")
        .fill("no-match-" + Date.now());
      await expect(
        page.getByText("Nenhum orçamento encontrado para esta busca."),
      ).toBeVisible();
      await page.getByRole("button", { name: "Limpar busca" }).click();
      await expect(page.getByLabel("Buscar por cliente ou número")).toHaveValue(
        "",
      );
      assertions += 2;
      for (const p of [page, publicPage])
        assert.ok(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        );
      assertions += 2;
      await context.close();
    }
    // Storage unavailable must not make the guide or the app unusable.
    const context = await browser.newContext();
    await context.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new Error("Storage disabled");
      };
      Storage.prototype.setItem = () => {
        throw new Error("Storage disabled");
      };
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
    await expect(
      page.getByRole("region", { name: "Primeiros passos", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Ocultar primeiros passos" })
      .click();
    await expect(
      page.getByRole("region", { name: "Primeiros passos", exact: true }),
    ).toHaveCount(0);
    await context.close();
    assertions += 2;
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify(
        {
          status: "PASS",
          assertions,
          viewports: [1280, 360],
          pageErrors: errors.length,
        },
        null,
        2,
      ),
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
