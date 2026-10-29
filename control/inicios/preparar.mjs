import { cpSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const [major, minor, patch] = process.versions.node.split(".").map(Number);
if (major < 20 || (major === 20 && (minor < 19 || (minor === 19 && patch < 4)))) { console.error("Usa Node 22 para preparar las bases."); process.exit(1); }
const source = dirname(fileURLToPath(import.meta.url));
const target = resolve(source, "../../..", "DATABRIDGE-EN-CLASE");
mkdirSync(target, { recursive: true });
console.log("Preparación CON INTERNET. Se crearán bases SIN dominio en", target);
for (let n = 1; n <= 6; n++) {
  const slug = "caso-" + String(n).padStart(2, "0"), destination = join(target, slug);
  if (!existsSync(destination)) cpSync(join(source, slug), destination, { recursive: true });
  else console.log(slug, "ya existe: no se sobrescribe su código.");
  for (const part of ["backend", "frontend"]) {
    const cwd = join(destination, part);
    const result = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["ci", "--no-audit", "--no-fund"], { cwd, stdio: "inherit", shell: process.platform === "win32" });
    if (result.error || result.status !== 0) { console.error("No se pudo preparar", slug, part); process.exit(1); }
    if (part === "backend" && !existsSync(join(cwd, ".env"))) copyFileSync(join(cwd, ".env.example"), join(cwd, ".env"));
  }
}
console.log("Listo. No se han creado bases PostgreSQL ni añadido soluciones del dominio. Abre cada caso de DATABRIDGE-EN-CLASE y constrúyelo siguiendo el cuaderno.");
