// Build local com pré-condição explícita; não altera schema ou desativa validações.
import { Pool } from "pg";
import { spawnSync } from "node:child_process";
async function main() {
  if (!process.env.DATABASE_URL)
    throw Error("DATABASE_URL ausente: configure o ambiente privado de build.");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
  });
  try {
    await pool.query("SELECT 1");
  } catch {
    throw Error(
      "Banco indisponível. Aguarde readiness antes do build e mantenha-o ativo até o fim.",
    );
  } finally {
    await pool.end();
  }
  const result = spawnSync("npm", ["run", "build", "--", "--webpack"], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
