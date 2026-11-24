import { chromium, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
async function main() {
  if (
    !process.env.DATABASE_URL?.includes(":55441/elos_compare_") ||
    !process.env.DEMO_PASSWORD
  )
    throw Error(
      "Exige ambiente sintético de comparação em 55441 e DEMO_PASSWORD privado.",
    );
  const out =
    process.env.COMPARISON_OUTPUT ?? "docs/evidence/version-comparison";
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
  });
  const results: any[] = [];
  try {
    for (const [width, side] of [
      [360, "A"],
      [360, "B"],
      [1280, "B"],
      [1280, "A"],
    ] as const) {
      const current = side === "B",
        port = current ? 3021 : 3020;
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const p = await ctx.newPage();
      p.setDefaultTimeout(15000);
      const errors: string[] = [];
      p.on("pageerror", (e) => errors.push(e.message));
      const row: any = {
        version: side,
        commit: current ? "21a3a3d" : "225cdcc",
        width,
        tasks: [],
        errors,
      };
      results.push(row);
      await p.goto(`http://localhost:${port}/login`);
      await p
        .getByLabel("E-mail", { exact: true })
        .fill("operador@brisa.example");
      await p
        .getByLabel("Senha", { exact: true })
        .fill(process.env.DEMO_PASSWORD!);
      await p.getByRole("button", { name: "Entrar no painel" }).click();
      await p.waitForURL(`http://localhost:${port}/`);
      const dialog = p.locator("dialog.training-dialog");
      async function dismiss() {
        await p.bringToFront();
        try {
          await dialog.waitFor({ state: "visible", timeout: 1500 });
        } catch {
          return;
        }
        const back = dialog.getByRole("button", {
          name: "Voltar a Clientes",
          exact: true,
        });
        if (await back.isVisible()) await back.click();
        else
          await dialog
            .getByRole("button", { name: "Ver depois", exact: true })
            .click();
        await expect(dialog).not.toBeVisible();
      }
      async function nav(name: string) {
        await dismiss();
        if (current && width < 761)
          await p.getByRole("button", { name: "Abrir navegação" }).click();
        await p
          .getByRole("navigation")
          .filter({ visible: true })
          .getByRole("button", { name, exact: true })
          .click();
        await p.waitForLoadState("networkidle");
        await dismiss();
      }
      async function get(url: string) {
        const r = await p.request.get(`http://localhost:${port}` + url);
        expect(r.ok()).toBe(true);
        return r.json();
      }
      async function task(name: string, fn: () => Promise<void>) {
        const start = performance.now();
        try {
          await fn();
          row.tasks.push({
            name,
            status: "pass",
            automation_ms: Math.round(performance.now() - start),
          });
        } catch (e) {
          row.tasks.push({
            name,
            status: "fail",
            error: String(e).split("Call log:")[0].trim(),
            automation_ms: Math.round(performance.now() - start),
          });
          throw e;
        }
      }
      await dismiss();
      const name = `COMPARACAO ${width} ${side} ${Date.now()}`;
      let clientId = "",
        quoteId = "",
        equipmentId = "";
      await task("Clientes", async () => {
        await nav("Clientes");
        row.layout = await p.evaluate(() => {
          const search = [...document.querySelectorAll("input")].find(
            (e) => e.type === "search",
          )!;
          return {
            width: innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            searchDocumentY: Math.round(
              search.getBoundingClientRect().top + scrollY,
            ),
            addClientButton: !![...document.querySelectorAll("button")].find(
              (b) => b.textContent?.includes("Adicionar cliente"),
            ),
          };
        });
        await p.screenshot({
          path: `${out}/${side}-${width}-clientes.png`,
          fullPage: true,
        });
        if (current)
          await p.getByRole("button", { name: "Adicionar cliente" }).click();
        await p.getByLabel("Nome do cliente", { exact: true }).fill(name);
        await p
          .getByLabel("Contato do cliente", { exact: true })
          .fill("teste@example.invalid");
        await p
          .getByLabel("Observações do cliente", { exact: true })
          .fill("Atender à tarde");
        await p
          .getByRole("button", { name: "Salvar cliente", exact: true })
          .click();
        await expect(
          p.getByRole("status").filter({ hasText: "Cliente salvo." }),
        ).toBeVisible();
        clientId = (await get("/api/operations")).clients.find(
          (c: any) => c.name === name,
        ).id;
        await p.getByLabel("Buscar clientes").fill(name);
        await p
          .locator("article")
          .filter({ hasText: name })
          .getByRole("button", { name: "Editar cliente" })
          .click();
        await p
          .getByLabel("Observações do cliente", { exact: true })
          .fill("Atender pela manhã");
        await p
          .getByRole("button", { name: "Salvar cliente", exact: true })
          .click();
        await expect(
          p.getByRole("status").filter({ hasText: "Cliente salvo." }),
        ).toBeVisible();
        await p.reload();
        await nav("Clientes");
        const found = (await get("/api/operations")).clients.filter(
          (c: any) => c.name === name,
        );
        expect(found).toHaveLength(1);
        expect(found[0].id).toBe(clientId);
        expect(found[0].notes).toBe("Atender pela manhã");
      });
      await task("Orçamento e aceite", async () => {
        await nav("Orçamentos");
        await p
          .getByRole("button", { name: "+ Novo orçamento", exact: true })
          .click();
        await p
          .getByLabel("Usar cliente cadastrado", { exact: true })
          .selectOption({ label: name });
        await p.getByLabel("Quantidade", { exact: true }).fill("2");
        await p
          .getByRole("button", { name: "Salvar rascunho", exact: true })
          .click();
        await expect(
          p.getByRole("status").filter({ hasText: "Rascunho salvo." }),
        ).toBeVisible();
        await p.getByLabel("Buscar por cliente ou número").fill(name);
        await p
          .locator("article")
          .filter({ hasText: name })
          .getByRole("button", { name: "Editar rascunho" })
          .click();
        await p.getByRole("button", { name: "Publicar e gerar link" }).click();
        await expect(p.getByLabel("Link do orçamento")).toBeVisible();
        const link = await p.getByLabel("Link do orçamento").inputValue();
        const q = (await get("/api/quotes")).quotes.find(
          (q: any) => q.client_id === clientId,
        );
        quoteId = q.id;
        expect(Number(q.total_cents)).toBe(36000);
        const pub = await ctx.newPage();
        await pub.goto(link);
        await pub
          .getByLabel("Seu nome", { exact: true })
          .fill("Responsável fictício");
        await pub.getByRole("checkbox").check();
        await pub.getByRole("button", { name: "Confirmar aprovação" }).click();
        await expect(
          pub.getByRole("heading", { name: "Orçamento aprovado." }),
        ).toBeVisible();
        await pub.close();
        expect(
          (await get("/api/quotes")).orders.filter(
            (o: any) => o.quote_id === quoteId,
          ),
        ).toHaveLength(1);
      });
      await task("OS", async () => {
        await nav("Ordens de serviço");
        const os = p.locator("article").filter({ hasText: name });
        await os.getByRole("button", { name: "Iniciar serviço" }).click();
        await expect(os.locator(".badge")).toHaveText("Em andamento");
        await os.getByRole("button", { name: "Concluir", exact: true }).click();
        await expect(os.locator(".badge")).toHaveText("Concluído");
        await p.reload();
        await nav("Ordens de serviço");
        expect(
          (await get("/api/quotes")).orders.find(
            (o: any) => o.quote_id === quoteId,
          ).status,
        ).toBe("completed");
      });
      await task("Equipamento e agenda", async () => {
        await nav("Equipamentos");
        await p
          .getByLabel("Cliente do equipamento", { exact: true })
          .selectOption({ label: name });
        await p
          .getByLabel("Identificação do aparelho", { exact: true })
          .fill("Split " + name);
        await p
          .getByLabel("Capacidade (BTU, opcional)", { exact: true })
          .fill("12000");
        await p
          .getByRole("button", { name: "Salvar equipamento", exact: true })
          .click();
        await expect(
          p.getByRole("status").filter({ hasText: "Equipamento salvo." }),
        ).toBeVisible();
        equipmentId = (await get("/api/operations")).equipment.find(
          (e: any) => e.client_id === clientId,
        ).id;
        await nav("Agenda");
        await p
          .getByLabel("Cliente da visita", { exact: true })
          .selectOption({ label: name });
        await p
          .getByLabel("Equipamento da visita (opcional)", { exact: true })
          .selectOption(equipmentId);
        await p
          .getByLabel("Técnico responsável", { exact: true })
          .fill("Técnico " + name);
        await p
          .getByLabel("Início da visita", { exact: true })
          .fill("2027-07-18T09:00");
        await p
          .getByRole("button", { name: "Salvar visita", exact: true })
          .click();
        await expect(
          p.getByRole("status").filter({ hasText: "Visita agendada." }),
        ).toBeVisible();
        const visit = p.locator("article").filter({ hasText: name });
        await visit.getByRole("button", { name: "Concluir visita" }).click();
        await expect(
          visit.getByText("Concluída", { exact: true }),
        ).toBeVisible();
        const v = (await get("/api/operations")).appointments.find(
          (v: any) => v.client_id === clientId,
        );
        expect(v.equipment_id).toBe(equipmentId);
        expect(v.status).toBe("completed");
        expect(
          (await get("/api/quotes")).orders.find(
            (o: any) => o.quote_id === quoteId,
          ).status,
        ).toBe("completed");
      });
      await task("Ajuda preserva campos", async () => {
        await nav("Clientes");
        if (current)
          await p.getByRole("button", { name: "Adicionar cliente" }).click();
        await p
          .getByLabel("Nome do cliente", { exact: true })
          .fill("Rascunho não salvo");
        await (current ? p.locator(".client-editor") : p)
          .getByRole("button", { name: "Ajuda nesta aba", exact: true })
          .click();
        await expect(dialog).toBeVisible();
        await dialog
          .getByRole("button", { name: "Consultar passos", exact: true })
          .click();
        await p.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(
          p.getByLabel("Nome do cliente", { exact: true }),
        ).toHaveValue("Rascunho não salvo");
        if (current)
          await p.getByRole("button", { name: "Voltar à carteira" }).click();
      });
      await task("Localização e PDF", async () => {
        await nav("Orçamentos");
        await p.getByLabel("Buscar por cliente ou número").fill(name);
        await p
          .locator("article")
          .filter({ hasText: name })
          .getByRole("button", { name: "Histórico / PDF" })
          .click();
        const d = p.locator("dialog[open]");
        await expect(d.getByRole("link", { name: /Baixar PDF/ })).toBeVisible();
        const href = await d
          .getByRole("link", { name: /Baixar PDF/ })
          .first()
          .getAttribute("href");
        const pdf = await p.request.get(`http://localhost:${port}` + href);
        expect(pdf.status()).toBe(200);
        expect(pdf.headers()["content-type"]).toContain("application/pdf");
        await p.keyboard.press("Escape");
      });
      row.overflow = await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      expect(errors).toEqual([]);
      await ctx.close();
    }
  } finally {
    writeFileSync(
      out + "/resultados-tecnicos.json",
      JSON.stringify(
        { kind: "automated-comparison-not-human-study", results },
        null,
        2,
      ),
    );
    await browser.close();
  }
  console.log(JSON.stringify(results));
}
main().catch((e) => {
  console.error(String(e).split("Call log:")[0]);
  process.exitCode = 1;
});
