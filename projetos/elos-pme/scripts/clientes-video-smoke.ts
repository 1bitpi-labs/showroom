// CV-MAINT: focused regression, synthetic isolated pilot only.
import { chromium, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { clientVideo } from "../src/lib/client-video";
import { db } from "../src/lib/db";
import { mkdirSync, writeFileSync } from "node:fs";
async function main() {
  const base = "http://localhost:3018";
  if (!process.env.DATABASE_URL?.includes(":55440/"))
    throw Error("Requires isolated pilot DB");
  const artifact = ".tsf/state/artifacts/clientes-video";
  mkdirSync(artifact, { recursive: true });
  const checks: string[] = [];
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
  });
  try {
    for (const width of [360, 1280]) {
      const id = randomUUID(),
        password = randomUUID() + "!a",
        email = id + "@example.invalid";
      await db.query(
        'INSERT INTO "user"(id,name,email,"emailVerified","createdAt","updatedAt") VALUES($1,$2,$3,true,now(),now())',
        [id, "Teste sintético Clientes", email],
      );
      await db.query(
        'INSERT INTO account(id,"accountId","providerId","userId",password,"createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,now(),now())',
        [randomUUID(), id, "credential", id, await hashPassword(password)],
      );
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const p = await ctx.newPage();
      const errors: string[] = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto(base + "/login");
      await p.getByLabel("E-mail", { exact: true }).fill(email);
      await p.getByLabel("Senha", { exact: true }).fill(password);
      await p.getByRole("button", { name: "Entrar no painel" }).click();
      await p.waitForURL(base + "/");
      const dialog = p.locator("dialog.training-dialog");
      await expect(dialog).toBeVisible();
      await dialog
        .getByRole("button", { name: "Ver depois", exact: true })
        .click();
      await expect(dialog).not.toBeVisible();
      await p
        .getByRole("navigation")
        .getByRole("button", { name: "Clientes", exact: true })
        .click();
      await expect(dialog).toBeVisible();
      await expect(
        dialog.getByRole("button", { name: "Voltar a Clientes" }),
      ).toBeVisible();
      await dialog.getByRole("button", { name: /Ver exemplo/ }).click();
      const v = dialog.locator("video");
      await expect
        .poll(() => v.evaluate((v: HTMLVideoElement) => v.readyState))
        .toBeGreaterThanOrEqual(2);
      await expect
        .poll(() => v.evaluate((v: HTMLVideoElement) => v.paused))
        .toBe(true);
      if (
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )
      )
        throw Error("Horizontal overflow " + width);
      await p.screenshot({
        path: artifact + "/player-" + width + ".png",
        fullPage: true,
      });
      await p.keyboard.press("Tab");
      if (
        !(await p.evaluate(() => !!document.activeElement?.closest("dialog")))
      )
        throw Error("Focus escaped");
      await dialog.getByRole("button", { name: "Editar", exact: true }).click();
      await expect
        .poll(() => v.evaluate((v: HTMLVideoElement) => v.currentTime))
        .toBeGreaterThan(
          clientVideo.chapters.find((c) => c.title === "Editar")!.seconds - 0.2,
        );
      if (!(await v.evaluate((v: HTMLVideoElement) => v.paused)))
        throw Error("Chapter autoplay");
      await p.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await p
        .getByLabel("Nome do cliente", { exact: true })
        .fill("RASCUNHO " + width);
      await p
        .getByRole("button", { name: "Ajuda nesta aba", exact: true })
        .click();
      await dialog
        .getByRole("button", { name: "Consultar passos", exact: true })
        .click();
      await expect(
        dialog.getByRole("heading", {
          name: "Cadastre e confirme o salvamento",
        }),
      ).toBeVisible();
      await dialog.getByRole("button", { name: "Voltar a Clientes" }).click();
      await expect(dialog).not.toBeVisible();
      await expect(
        p.getByLabel("Nome do cliente", { exact: true }),
      ).toHaveValue("RASCUNHO " + width);
      await p
        .getByRole("button", { name: "Ajuda nesta aba", exact: true })
        .click();
      await dialog
        .getByRole("button", { name: "Consultar passos", exact: true })
        .click();
      await dialog
        .getByRole("button", { name: "Próximo", exact: true })
        .click();
      await dialog
        .getByRole("button", { name: "Próximo", exact: true })
        .click();
      await dialog
        .getByRole("button", { name: "Concluir treinamento", exact: true })
        .click();
      await expect(dialog).not.toBeVisible();
      await p
        .getByRole("button", { name: "Ajuda nesta aba", exact: true })
        .click();
      await p.route("**/api/training", async (route) => {
        if (route.request().method() === "POST")
          await route.fulfill({
            status: 503,
            contentType: "application/json",
            body: JSON.stringify({ error: "Falha simulada CV-QA" }),
          });
        else await route.continue();
      });
      await dialog.getByRole("button", { name: "Voltar a Clientes" }).click();
      await expect(
        dialog.getByText("Falha simulada CV-QA", { exact: true }).first(),
      ).toBeVisible();
      await dialog
        .getByRole("button", { name: "Fechar sem confirmar registro" })
        .click();
      await expect(dialog).not.toBeVisible();
      await p.unroute("**/api/training");
      // Delayed response must not close a newer opening.
      let release!: () => void;
      const gate = new Promise<void>((r) => (release = r));
      await p.route("**/api/training", async (route) => {
        if (route.request().method() === "POST") {
          await gate;
          await route.continue();
        } else await route.continue();
      });
      await p
        .getByRole("button", { name: "Ajuda nesta aba", exact: true })
        .click();
      await dialog.getByRole("button", { name: "Voltar a Clientes" }).click();
      await dialog
        .getByRole("button", { name: "Fechar sem confirmar registro" })
        .click();
      await p
        .getByRole("button", { name: "Ajuda nesta aba", exact: true })
        .click();
      release();
      await p.waitForResponse(
        (r) =>
          r.url().endsWith("/api/training") && r.request().method() === "POST",
      );
      await expect(dialog).toBeVisible();
      await p.unroute("**/api/training");
      await p.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      const state = await p.evaluate(() =>
        fetch("/api/training").then((r) => r.json()),
      );
      if (
        state.progress.find((t: any) => t.tour === "clients").status !==
          "completed" ||
        state.notifications.filter((n: any) => n.tour === "clients").length !==
          1
      )
        throw Error("Progress replay regression");
      if (state.notifications.some((n: any) => n.body.includes("RASCUNHO")))
        throw Error("Unexpected business data");
      await p.reload();
      await p
        .getByRole("navigation")
        .getByRole("button", { name: "Clientes", exact: true })
        .click();
      await expect(dialog).not.toBeVisible();
      if (errors.length) throw Error(errors.join("\n"));
      checks.push(
        `${width}: first visit, video, captions resource, chapter, keyboard, layout, draft, completion, failure, delayed response, replay, reload`,
      );
      await ctx.close();
    }
    writeFileSync(
      artifact + "/browser-checks.json",
      JSON.stringify({ status: "passed", checks }, null, 2),
    );
    console.log(JSON.stringify({ status: "passed", checks }));
  } finally {
    await browser.close();
    await db.end();
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
