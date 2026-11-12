import { chromium, expect, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import assert from "node:assert/strict";
import { db } from "../src/lib/db";
import { mkdirSync } from "node:fs";
const base = "http://localhost:3017";
async function main() {
  if (process.env.DEMO_MODE !== "true") throw Error("Synthetic demo only");
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
  });
  const users: string[] = [];
  let checks = 0;
  const errors: string[] = [];
  async function login(page: Page, email: string, password: string) {
    for (let attempt = 0; attempt < 3; attempt++) {
      await page.goto(base + "/login");
      await page.getByLabel("E-mail", { exact: true }).fill(email);
      await page.getByLabel("Senha", { exact: true }).fill(password);
      const [response] = await Promise.all([
        page.waitForResponse(
          (r) =>
            r.url().includes("/api/auth/sign-in/email") &&
            r.request().method() === "POST",
        ),
        page.getByRole("button", { name: "Entrar no painel" }).click(),
      ]);
      console.log("stage: login HTTP " + response.status());
      if (response.status() === 429) {
        const retry = Number(response.headers()["retry-after"] ?? 11);
        await page.waitForTimeout(
          Math.min(
            30000,
            Math.max(1000, (Number.isFinite(retry) ? retry : 11) * 1000 + 250),
          ),
        );
        continue;
      }
      if (!response.ok()) throw Error("Login HTTP " + response.status());
      await page.waitForURL(base + "/", { timeout: 10000 });
      return;
    }
    throw Error("Authentication retry limit reached");
  }
  async function complete(page: Page) {
    const modal = page.locator("dialog.training-dialog");
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Próximo", exact: true }).click();
    await modal.getByRole("button", { name: "Próximo", exact: true }).click();
    await modal
      .getByRole("button", { name: "Concluir treinamento", exact: true })
      .click();
    await expect(modal).not.toBeVisible();
    checks++;
  }
  async function tab(page: Page, name: string) {
    console.log("stage: tab " + name);
    await page
      .getByRole("navigation")
      .getByRole("button", { name, exact: true })
      .click();
  }
  try {
    for (const width of [1280, 360]) {
      const id = randomUUID(),
        email = id + "@example.invalid",
        password = randomUUID() + "A!";
      users.push(id);
      await db.query(
        'INSERT INTO "user"(id,name,email,"emailVerified","createdAt","updatedAt") VALUES($1,$2,$3,true,now(),now())',
        [id, "Pessoa de teste", email],
      );
      await db.query(
        'INSERT INTO account(id,"accountId","providerId","userId",password,"createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,now(),now())',
        [randomUUID(), id, "credential", id, await hashPassword(password)],
      );
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        timezoneId: "America/Sao_Paulo",
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      await login(page, email, password);
      const modal = page.locator("dialog.training-dialog");
      await expect(modal).toBeVisible();
      // Native showModal provides focus containment without a custom focus trap.
      await page.keyboard.press("Tab");
      assert.ok(
        await page.evaluate(
          () => !!document.activeElement?.closest("dialog.training-dialog"),
        ),
      );
      checks++;
      await page.screenshot({
        path: `docs/evidence/training-popup-${width}.png`,
        fullPage: true,
      });
      await page.keyboard.press("Escape");
      await expect(modal).not.toBeVisible();
      let state = await (
        await page.request.get(new URL("/api/training", page.url()).href)
      ).json();
      assert.equal(
        state.progress.find((p: any) => p.tour === "quotes").status,
        "skipped",
      );
      assert.equal(state.notifications.length, 0);
      checks += 2;
      await page
        .getByRole("button", { name: "Refazer treinamento", exact: true })
        .click();
      await complete(page);
      state = await (
        await page.request.get(new URL("/api/training", page.url()).href)
      ).json();
      assert.equal(state.notifications.length, 1);
      checks++;
      await page.reload();
      await page
        .getByRole("button", { name: "Refazer treinamento", exact: true })
        .waitFor();
      await expect(modal).not.toBeVisible();
      checks++;
      await tab(page, "Clientes");
      await complete(page);
      const clientName = "TREINO Cliente " + id.slice(0, 8);
      await page
        .getByLabel("Nome do cliente", { exact: true })
        .fill(clientName);
      await page
        .getByLabel("Contato do cliente", { exact: true })
        .fill("contato@example.invalid");
      await page
        .getByLabel("Endereço de atendimento", { exact: true })
        .fill("Endereço sintético");
      await page
        .getByRole("button", { name: "Salvar cliente", exact: true })
        .click();
      await expect(
        page.getByRole("status").filter({ hasText: "Cliente salvo." }),
      ).toBeVisible();
      checks++;
      await tab(page, "Equipamentos");
      await complete(page);
      await page
        .getByLabel("Cliente do equipamento", { exact: true })
        .selectOption({ label: clientName });
      await page
        .getByLabel("Identificação do aparelho", { exact: true })
        .fill("Split recepção " + id.slice(0, 8));
      await page
        .getByLabel("Marca e modelo", { exact: true })
        .fill("Modelo sintético");
      await page
        .getByLabel("Capacidade (BTU, opcional)", { exact: true })
        .fill("12000");
      await page
        .getByRole("button", { name: "Salvar equipamento", exact: true })
        .click();
      await expect(
        page.getByRole("status").filter({ hasText: "Equipamento salvo." }),
      ).toBeVisible();
      checks++;
      await tab(page, "Orçamentos");
      await page
        .getByRole("button", { name: "+ Novo orçamento", exact: true })
        .click();
      await page
        .getByLabel("Usar cliente cadastrado", { exact: true })
        .selectOption({ label: clientName });
      await expect(page.getByLabel("Cliente", { exact: true })).toHaveValue(
        clientName,
      );
      await page.getByRole("button", { name: "Publicar e gerar link" }).click();
      await page.getByLabel("Link do orçamento").waitFor();
      const link = await page.getByLabel("Link do orçamento").inputValue();
      const pub = await context.newPage();
      await pub.goto(link);
      await pub
        .getByLabel("Seu nome", { exact: true })
        .fill("Pessoa sintética");
      await pub.getByRole("checkbox").check();
      await pub.getByRole("button", { name: "Confirmar aprovação" }).click();
      await expect(
        pub.getByRole("heading", { name: "Orçamento aprovado." }),
      ).toBeVisible();
      await pub.close();
      checks += 2;
      await tab(page, "Ordens de serviço");
      await complete(page);
      await expect(
        page.getByRole("article").filter({ hasText: clientName }),
      ).toBeVisible();
      checks++;
      await tab(page, "Agenda");
      await complete(page);
      await page
        .getByLabel("Cliente da visita", { exact: true })
        .selectOption({ label: clientName });
      await page
        .getByLabel("Equipamento da visita (opcional)", { exact: true })
        .selectOption({ label: "Split recepção " + id.slice(0, 8) });
      const osSelect = page.getByLabel("OS vinculada (opcional)", {
        exact: true,
      });
      await osSelect.selectOption({ index: 1 });
      await page
        .getByLabel("Técnico responsável", { exact: true })
        .fill("Técnico " + id.slice(0, 8));
      await page
        .getByLabel("Início da visita", { exact: true })
        .fill("2027-07-18T09:00");
      await page
        .getByRole("button", { name: "Salvar visita", exact: true })
        .click();
      await expect(
        page.getByRole("status").filter({ hasText: "Visita agendada." }),
      ).toBeVisible();
      await page.screenshot({
        path: `docs/evidence/operations-agenda-${width}.png`,
        fullPage: true,
      });
      const visit = page.getByRole("article").filter({ hasText: clientName });
      await visit
        .getByRole("button", { name: "Concluir visita", exact: true })
        .click();
      await expect(visit.getByText("Concluída", { exact: true })).toBeVisible();
      checks += 2;
      await tab(page, "Equipamentos");
      const asset = page
        .getByRole("article")
        .filter({ hasText: "Split recepção " + id.slice(0, 8) });
      await asset.locator("summary").click();
      await expect(
        asset.getByText("Concluída", { exact: false }),
      ).toBeVisible();
      checks++;
      for (const name of ["Configurações", "Guia de uso"]) {
        await tab(page, name);
        await complete(page);
      }
      await page.getByRole("button", { name: /^Notificações:/ }).click();
      await complete(page);
      state = await (
        await page.request.get(new URL("/api/training", page.url()).href)
      ).json();
      assert.equal(
        state.progress.filter((p: any) => p.status === "completed").length,
        8,
      );
      assert.equal(state.notifications.length, 8);
      checks += 2;
      await page
        .locator(".inbox-message")
        .first()
        .getByRole("button", { name: "Marcar como lida", exact: true })
        .click();
      await expect(
        page
          .locator(".inbox-message")
          .first()
          .getByText("Lida", { exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Refazer guia: Orçamentos", exact: true })
        .click();
      await complete(page);
      state = await (
        await page.request.get(new URL("/api/training", page.url()).href)
      ).json();
      assert.equal(state.notifications.length, 8);
      checks += 2;
      await page.getByRole("button", { name: /^Notificações:/ }).click();
      await expect(page.getByLabel("Link do orçamento")).not.toBeVisible();
      checks++;
      await page.screenshot({
        path: `docs/evidence/training-inbox-${width}.png`,
        fullPage: true,
      });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      checks++;
      // A fresh browser context must retain server-side completion.
      console.log("stage: fresh context");
      const other = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const p2 = await other.newPage();
      await login(p2, email, password);
      await p2
        .getByRole("button", { name: "Refazer treinamento", exact: true })
        .waitFor();
      await expect(p2.locator("dialog.training-dialog")).not.toBeVisible();
      const persisted = await (
        await p2.request.get(base + "/api/training")
      ).json();
      assert.equal(
        persisted.progress.filter(
          (p: { status: string }) => p.status === "completed",
        ).length,
        8,
      );
      checks++;
      checks++;
      // New endpoints reject missing authentication and foreign origins.
      assert.equal(
        (
          await other.request.post(base + "/api/training", {
            headers: { Origin: "https://foreign.invalid" },
            data: { tour: "quotes", version: 1, status: "completed", step: 2 },
          })
        ).status(),
        403,
      );
      checks++;
      await other.close();
      await context.close();
    }
    console.log("stage: anonymous access checks");
    const anonymous = await browser.newContext();
    assert.equal(
      (await anonymous.request.get(base + "/api/training")).status(),
      401,
    );
    assert.equal(
      (await anonymous.request.get(base + "/api/operations")).status(),
      401,
    );
    await anonymous.close();
    checks += 2;
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify(
        {
          status: "PASS",
          checks,
          viewports: [1280, 360],
          pageErrors: 0,
          scope:
            "fresh user accounts, tours, persistence, inbox, clients, equipment, quotes and visits",
        },
        null,
        2,
      ),
    );
  } finally {
    console.log("stage: cleanup");
    await browser.close();
    for (const id of users)
      await db.query('DELETE FROM "user" WHERE id=$1', [id]);
    await db.end();
  }
}
mkdirSync("docs/evidence", { recursive: true });
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
