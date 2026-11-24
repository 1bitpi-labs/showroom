import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { z } from "zod";
import { db } from "@/lib/db";
import { money, DomainError, publicQuote } from "@/lib/domain";
import { operator, failure } from "@/lib/http";
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    let r;
    const token = new URL(req.url).searchParams.get("token");
    if (token) {
      r = await publicQuote(token);
      if (r.id !== id) throw new DomainError("Documento indisponível", 404);
    } else {
      await operator(req);
      r = (
        await db.query(
          "SELECT r.*,q.code,d.name AS decided_by,d.created_at AS decided_at FROM revisions r JOIN quotes q ON q.id=r.quote_id LEFT JOIN decisions d ON d.revision_id=r.id WHERE r.id=$1",
          [z.uuid().parse(id)],
        )
      ).rows[0];
    }
    if (!r) throw new DomainError("Não encontrado", 404);
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    let page = pdf.addPage();
    let y = 790;
    function line(text: string, size = 12) {
      const safe = text
        .normalize("NFKC")
        .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "-");
      let chunk = "";
      for (const word of safe.split(/\s+/)) {
        if (font.widthOfTextAtSize(chunk + " " + word, size) > 480 && chunk) {
          draw(chunk, size);
          chunk = word;
        } else chunk += (chunk ? " " : "") + word;
      }
      draw(chunk, size);
    }
    function draw(text: string, size: number) {
      if (y < 55) {
        page = pdf.addPage();
        y = 790;
      }
      page.drawText(text, {
        x: 48,
        y,
        size,
        font,
        color: rgb(0.07, 0.19, 0.28),
      });
      y -= size + 10;
    }
    line(r.snapshot.brand.name, 20);
    if (r.snapshot.brand.demo)
      line("EMPRESA FICTÍCIA - DEMONSTRAÇÃO - DADOS SINTÉTICOS", 10);
    line(`Orçamento ${r.code} / revisão ${r.number}`, 16);
    line(`Cliente: ${r.snapshot.client_name}`);
    line(
      `Validade: ${new Date(r.valid_until).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
    );
    for (const item of r.snapshot.items)
      line(
        `${item.quantity} x ${item.description} - ${money(item.unit_cents)} = ${money(item.quantity * item.unit_cents)}`,
      );
    line(`TOTAL: ${money(r.total_cents)}`, 18);
    line(r.snapshot.conditions);
    if (r.decided_by)
      line(
        `Decisão registrada por ${r.decided_by} em ${new Date(r.decided_at).toISOString()}`,
      );
    line(`Snapshot: ${r.snapshot_hash}`, 8);
    line(
      "Registro operacional; não constitui assinatura digital certificada.",
      9,
    );
    return new Response(Buffer.from(await pdf.save()), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="orcamento-${r.code}-v${r.number}.pdf"`,
      },
    });
  } catch (e) {
    return failure(e);
  }
}
