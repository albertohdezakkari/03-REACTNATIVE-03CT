// Comprueba el estado inicial del repositorio antes de distribuirlo para clase.
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(fileURLToPath(import.meta.url));
const only = process.argv[2];
for (let n = 1; n <= 6; n++) {
  const number = String(n).padStart(2, "0"); if (only && only !== number) continue;
  const folder = join(root, "caso-" + number);
  assert.equal(existsSync(join(folder, "backend/src/aula")), false, "La base contiene código del dominio");
  assert.deepEqual(readdirSync(join(folder, "backend/src")).sort(), ["app.module.ts", "main.ts"]);
  const app = readFileSync(join(folder, "backend/src/app.module.ts"), "utf8");
  assert.equal(/AulaModule|InjectRepository|@Entity/.test(app), false);
  const screen = readFileSync(join(folder, "frontend/App.tsx"), "utf8");
  assert.equal(/FORMS|crearLeccion|inscripciones|incidencias/.test(screen), false);
  const env = readFileSync(join(folder, "backend/.env.example"), "utf8");
  assert.ok(env.includes("DB_USER=postgres") && env.includes("DB_PASSWORD=123456"));
  assert.ok(existsSync(join(folder,"frontend/package-lock.json")));
  assert.ok(existsSync(join(folder,"backend/package-lock.json")));
  console.log("OK: caso-" + number + " contiene solo el proyecto base.");
}
