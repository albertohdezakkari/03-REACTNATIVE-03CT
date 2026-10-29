const CONSTRUCTION = [
  {
    "n": 1,
    "slug": "caso-01",
    "db": "practica_c01",
    "code": "C01",
    "title": "Cursos y lecciones · 1:N",
    "initialApp": "import { Module, Controller, Get } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { DataSource } from \"typeorm\";\n@Controller(\"salud\")\nclass SaludController {\n  constructor(private readonly db: DataSource) {}\n  @Get() async salud() {\n    const rows = await this.db.query(\"SELECT current_database() AS base\");\n    return { estado: \"ok\", caso: \"C01\", base: rows[0].base };\n  }\n}\n@Module({\n  imports: [TypeOrmModule.forRoot({\n    type: \"postgres\", host: process.env.DB_HOST || \"localhost\",\n    port: Number(process.env.DB_PORT || 5432), username: process.env.DB_USER || \"postgres\",\n    password: process.env.DB_PASSWORD,\n    database: process.env.DB_NAME || \"practica_c01\",\n    autoLoadEntities: true,\n    synchronize: true, // Solo para estas bases locales de práctica.\n  })],\n  controllers: [SaludController],\n})\nexport class AppModule {}\n",
    "emptyModule": "import { Module } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { Curso } from \"./curso.entity\";\nimport { Leccion } from \"./leccion.entity\";\n\n@Module({\n  imports: [TypeOrmModule.forFeature([Curso, Leccion])],\n  controllers: [],\n  providers: [],\n})\nexport class AulaModule {}\n",
    "snapshots": [
      {
        "verb": "Get",
        "methodNames": [
          "cursos",
          "curso",
          "lecciones",
          "leccion"
        ],
        "added": [
          {
            "name": "cursos",
            "code": "async cursos() {\n    return this.cursoRepo.createQueryBuilder(\"curso\")\n      .select(\"curso\")\n      .leftJoinAndSelect(\"curso.lecciones\", \"leccion\")\n      .orderBy(\"curso.id\", \"ASC\")\n      .getMany();\n  }"
          },
          {
            "name": "curso",
            "code": "async curso(id: number) {\n    return this.cursoRepo.createQueryBuilder(\"curso\")\n      .select(\"curso\")\n      .leftJoinAndSelect(\"curso.lecciones\", \"leccion\")\n      .where(\"curso.id = :id\", { id })\n      .getOneOrFail();\n  }"
          },
          {
            "name": "lecciones",
            "code": "async lecciones(cursoId?: string, completada?: string) {\n    const consulta = this.leccionRepo.createQueryBuilder(\"leccion\")\n      .select(\"leccion\")\n      .leftJoinAndSelect(\"leccion.curso\", \"curso\");\n\n    if (cursoId !== undefined) {\n      consulta.andWhere(\"curso.id = :cursoId\", { cursoId: Number(cursoId) });\n    }\n    if (completada !== undefined) {\n      consulta.andWhere(\"leccion.completada = :completada\", { completada: completada === \"true\" });\n    }\n\n    return consulta.orderBy(\"leccion.id\", \"ASC\").getMany();\n  }"
          },
          {
            "name": "leccion",
            "code": "async leccion(id: number) {\n    return this.leccionRepo.createQueryBuilder(\"leccion\")\n      .select(\"leccion\")\n      .leftJoinAndSelect(\"leccion.curso\", \"curso\")\n      .where(\"leccion.id = :id\", { id })\n      .getOneOrFail();\n  }"
          }
        ],
        "routes": [
          "@Get(\"cursos\") cursos() { return this.aula.cursos(); }",
          "@Get(\"cursos/:id\") curso(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.curso(id); }",
          "@Get(\"lecciones\") lecciones(@Query(\"cursoId\") cursoId?: string, @Query(\"completada\") completada?: string) { return this.aula.lecciones(cursoId, completada); }",
          "@Get(\"lecciones/:id\") leccion(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.leccion(id); }"
        ],
        "service": "import { Injectable } from \"@nestjs/common\";\nimport { InjectRepository } from \"@nestjs/typeorm\";\nimport { Repository } from \"typeorm\";\nimport { Curso } from \"./curso.entity\";\nimport { Leccion } from \"./leccion.entity\";\n\n@Injectable()\nexport class AulaService {\n  constructor(\n    @InjectRepository(Curso) private readonly cursoRepo: Repository<Curso>,\n    @InjectRepository(Leccion) private readonly leccionRepo: Repository<Leccion>,\n  ) {}\n\n  async cursos() {\n    return this.cursoRepo.createQueryBuilder(\"curso\")\n      .select(\"curso\")\n      .leftJoinAndSelect(\"curso.lecciones\", \"leccion\")\n      .orderBy(\"curso.id\", \"ASC\")\n      .getMany();\n  }\n\n  async curso(id: number) {\n    return this.cursoRepo.createQueryBuilder(\"curso\")\n      .select(\"curso\")\n      .leftJoinAndSelect(\"curso.lecciones\", \"leccion\")\n      .where(\"curso.id = :id\", { id })\n      .getOneOrFail();\n  }\n\n  async lecciones(cursoId?: string, completada?: string) {\n    const consulta = this.leccionRepo.createQueryBuilder(\"leccion\")\n      .select(\"leccion\")\n      .leftJoinAndSelect(\"leccion.curso\", \"curso\");\n\n    if (cursoId !== undefined) {\n      consulta.andWhere(\"curso.id = :cursoId\", { cursoId: Number(cursoId) });\n    }\n    if (completada !== undefined) {\n      consulta.andWhere(\"leccion.completada = :completada\", { completada: completada === \"true\" });\n    }\n\n    return consulta.orderBy(\"leccion.id\", \"ASC\").getMany();\n  }\n\n  async leccion(id: number) {\n    return this.leccionRepo.createQueryBuilder(\"leccion\")\n      .select(\"leccion\")\n      .leftJoinAndSelect(\"leccion.curso\", \"curso\")\n      .where(\"leccion.id = :id\", { id })\n      .getOneOrFail();\n  }\n}\n",
        "controller": "import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from \"@nestjs/common\";\nimport { AulaService } from \"./aula.service\";\n\n@Controller()\nexport class AulaController {\n  constructor(private readonly aula: AulaService) {}\n\n  @Get(\"cursos\") cursos() { return this.aula.cursos(); }\n\n  @Get(\"cursos/:id\") curso(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.curso(id); }\n\n  @Get(\"lecciones\") lecciones(@Query(\"cursoId\") cursoId?: string, @Query(\"completada\") completada?: string) { return this.aula.lecciones(cursoId, completada); }\n\n  @Get(\"lecciones/:id\") leccion(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.leccion(id); }\n}\n"
      },
      {
        "verb": "Post",
        "methodNames": [
          "cursos",
          "curso",
          "crearCurso",
          "lecciones",
          "leccion",
          "crearLeccion"
        ],
        "added": [
          {
            "name": "crearCurso",
            "code": "async crearCurso(datos: Record<string, unknown>) {\n    const b = datos; return this.cursoRepo.save(this.cursoRepo.create({ nombre: String(b.nombre) }));\n  }"
          },
          {
            "name": "crearLeccion",
            "code": "async crearLeccion(datos: Record<string, unknown>) {\n    const b = datos;\n    const curso = await this.curso(Number(b.cursoId));\n    const item = await this.leccionRepo.save(this.leccionRepo.create({ titulo: String(b.titulo), curso }));\n    return this.leccion(item.id);\n  }"
          }
        ],
        "routes": [
          "@Post(\"cursos\") crearCurso(@Body() datos: Record<string, unknown>) { return this.aula.crearCurso(datos); }",
          "@Post(\"lecciones\") crearLeccion(@Body() datos: Record<string, unknown>) { return this.aula.crearLeccion(datos); }"
        ]
      },
      {
        "verb": "Patch",
        "methodNames": [
          "cursos",
          "curso",
          "crearCurso",
          "lecciones",
          "leccion",
          "crearLeccion",
          "editarLeccion"
        ],
        "added": [
          {
            "name": "editarLeccion",
            "code": "async editarLeccion(id: number, datos: Record<string, unknown>) {\n    const b = datos; const item = await this.leccion(id);\n    \n    if (b.titulo !== undefined) item.titulo = String(b.titulo);\n    if (b.completada !== undefined) item.completada = Boolean(b.completada);\n    await this.leccionRepo.save(item); return this.leccion(id);\n  }"
          }
        ],
        "routes": [
          "@Patch(\"lecciones/:id\") editar(@Param(\"id\", ParseIntPipe) id: number, @Body() datos: Record<string, unknown>) { return this.aula.editarLeccion(id, datos); }"
        ]
      },
      {
        "verb": "Delete",
        "methodNames": [
          "cursos",
          "curso",
          "crearCurso",
          "lecciones",
          "leccion",
          "crearLeccion",
          "editarLeccion",
          "borrarLeccion"
        ],
        "added": [
          {
            "name": "borrarLeccion",
            "code": "async borrarLeccion(id: number) { await this.leccion(id); await this.leccionRepo.delete(id); return { eliminado: id }; }"
          }
        ],
        "routes": [
          "@Delete(\"lecciones/:id\") borrar(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.borrarLeccion(id); }"
        ]
      }
    ],
    "readScreen": "import React, { useState } from \"react\";\nimport { ScrollView, Text, TextInput, Pressable, StyleSheet } from \"react-native\";\nexport default function App() {\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [ruta, setRuta] = useState(\"/lecciones\");\n  const [datos, setDatos] = useState<unknown>([]);\n  const [error, setError] = useState(\"\");\n  const [cargando, setCargando] = useState(false);\n  async function consultar() {\n    setError(\"\"); setCargando(true);\n    try {\n      const response = await fetch(api.replace(/\\/$/, \"\") + ruta);\n      const data = await response.json();\n      if (!response.ok) throw new Error(data.message || \"Error HTTP \" + response.status);\n      setDatos(data);\n    } catch (e) { setError(String(e)); }\n    finally { setCargando(false); }\n  }\n  return <ScrollView contentContainerStyle={s.page}>\n    <Text style={s.title}>Cursos y lecciones · 1:N · lectura</Text>\n    <Text>URL de la API: localhost en web; IP del ordenador en Expo Go.</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <Text>Ruta de consulta</Text>\n    <TextInput accessibilityLabel=\"Ruta de consulta\" style={s.input} value={ruta} onChangeText={setRuta} autoCapitalize=\"none\" />\n    <Pressable accessibilityRole=\"button\" style={s.button} disabled={cargando} onPress={() => void consultar()}>\n      <Text style={s.white}>{cargando ? \"Consultando…\" : \"Consultar\"}</Text>\n    </Pressable>\n    {!!error && <Text style={s.error}>{error}</Text>}\n    <Text selectable style={s.json}>{JSON.stringify(datos, null, 2)}</Text>\n  </ScrollView>;\n}\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 25, fontWeight: \"700\" }, input: { borderWidth: 1, borderColor: \"#91ac88\", padding: 12, borderRadius: 7, backgroundColor: \"white\" }, button: { padding: 14, backgroundColor: \"#225541\", borderRadius: 7 }, white: { color: \"white\" }, error: { color: \"#a22424\" }, json: { fontFamily: \"monospace\", fontSize: 12 } });\n",
    "frontendBlocks": [
      "import React, { useEffect, useState } from \"react\";\nimport { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from \"react-native\";\n// En web del propio ordenador, localhost sirve. En el móvil, escribe la IP LAN del ordenador.\nconst TITLE = \"Cursos y lecciones · 1:N\";\nconst FORMS: { title: string; method: string; route: string; fields: [string, string, string][] }[] = [{\"title\": \"Crear curso\", \"method\": \"POST\", \"route\": \"/cursos\", \"fields\": [[\"nombre\", \"Nombre del curso\", \"text\"]]}, {\"title\": \"Crear lección\", \"method\": \"POST\", \"route\": \"/lecciones\", \"fields\": [[\"titulo\", \"Título\", \"text\"], [\"cursoId\", \"ID del curso\", \"number\"]]}, {\"title\": \"Editar lección\", \"method\": \"PATCH\", \"route\": \"/lecciones/:id\", \"fields\": [[\"id\", \"ID de lección\", \"path\"], [\"titulo\", \"Nuevo título (opcional)\", \"optionalText\"], [\"completada\", \"true o false (opcional)\", \"optionalBoolean\"]]}, {\"title\": \"Eliminar lección\", \"method\": \"DELETE\", \"route\": \"/lecciones/:id\", \"fields\": [[\"id\", \"ID de lección\", \"path\"]]}];\nconst LISTS: [string, string][] = [[\"Cursos y lecciones\", \"/cursos\"], [\"Lecciones y su curso\", \"/lecciones\"], [\"Filtro combinado de ejemplo\", \"/lecciones?cursoId=1&completada=false\"]];\nexport default function App() {",
      "\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [view, setView] = useState<\"datos\" | \"acciones\">(\"datos\");\n  const [form, setForm] = useState(0);\n  const [values, setValues] = useState<Record<string, string>>({});\n  const [paths, setPaths] = useState<string[]>(LISTS.map(x => x[1]));\n  const [data, setData] = useState<unknown[]>([]);\n  const [errors, setErrors] = useState<string[]>([]);\n  const [message, setMessage] = useState(\"\");\n  const [busy, setBusy] = useState(false);",
      "\n  async function request(path: string, method = \"GET\", payload?: Record<string, unknown>) {\n    const base = api.trim().replace(/\\/$/, \"\");\n    if (!/^https?:\\/\\//.test(base)) throw new Error(\"API: escribe http://IP:3000\");\n    if (!path.startsWith(\"/\")) throw new Error(\"La ruta debe empezar por /\");\n    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);\n    try {\n      const response = await fetch(base + path, { method, signal: controller.signal,\n        headers: payload === undefined ? undefined : { \"Content-Type\": \"application/json\" },\n        body: payload === undefined ? undefined : JSON.stringify(payload) });\n      const raw = await response.text(); let result: any;\n      try { result = raw ? JSON.parse(raw) : null; } catch { throw new Error(\"La API no ha devuelto JSON\"); }\n      if (!response.ok) throw new Error(`${response.status}: ${result?.message || raw}`);\n      return result;\n    } finally { clearTimeout(timeout); }\n  }\n  async function load() {\n    const next: unknown[] = []; const failures: string[] = [];\n    for (let i = 0; i < paths.length; i++) {\n      try { next[i] = await request(paths[i]); failures[i] = \"\"; }\n      catch (e) { next[i] = null; failures[i] = String(e); }\n    }\n    setData(next); setErrors(failures);\n  }\n  useEffect(() => { void load(); }, []);\n  async function refresh() { setBusy(true); setMessage(\"\"); try { await load(); } finally { setBusy(false); } }",
      "\n  async function send() {\n    setBusy(true); setMessage(\"\");\n    try {\n      const action = FORMS[form]; let route = action.route; const payload: Record<string, unknown> = {};\n      for (const [name, label, kind] of action.fields) {\n        const value = (values[name] || \"\").trim();\n        if (kind.startsWith(\"optional\") && value === \"\") continue;\n        if (kind === \"path\" || kind === \"number\" || kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") {\n          if ((kind === \"nullableNumber\" && value === \"\") || ((kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") && value === \"null\")) { payload[name] = null; continue; }\n          const n = Number(value);\n          if (!value || !Number.isSafeInteger(n) || n <= 0) throw new Error(label + \": escribe un ID entero positivo\");\n          if (kind === \"path\") route = route.replace(\":\" + name, encodeURIComponent(String(n)));\n          else payload[name] = n;\n        } else if (kind === \"optionalBoolean\") {\n          if (value !== \"true\" && value !== \"false\") throw new Error(label + \": escribe true o false\");\n          payload[name] = value === \"true\";\n        } else {\n          if (!value) throw new Error(label + \": campo obligatorio\");\n          payload[name] = value;\n        }\n      }\n      const result = await request(route, action.method, action.method === \"DELETE\" ? undefined : payload);\n      setMessage(\"Operación correcta: \" + JSON.stringify(result));\n      await load(); // Resincroniza las listas tras POST, PATCH o DELETE.\n    } catch (e) { setMessage(\"Error: \" + String(e)); }\n    finally { setBusy(false); }\n  }",
      "\n  return <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps=\"handled\">\n    <Text style={s.title}>{TITLE}</Text><Text>PostgreSQL local · NestJS · TypeORM · React Native</Text>\n    <Text style={s.label}>URL de la API (editable para web o móvil)</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <View style={s.row}>{([\"datos\", \"acciones\"] as const).map(v => <Pressable accessibilityRole=\"button\" key={v} style={[s.button, view === v && s.active]} onPress={() => setView(v)}><Text style={s.buttonText}>{v === \"datos\" ? \"1 · Datos y filtros\" : \"2 · Crear y modificar\"}</Text></Pressable>)}</View>\n    {view === \"datos\" ? <>\n      <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void refresh()}><Text style={s.buttonText}>{busy ? \"Consultando…\" : \"Consultar / aplicar filtros\"}</Text></Pressable>\n      {LISTS.map(([label], i) => <View style={s.card} key={label}>\n        <Text style={s.heading}>{label}</Text><Text>Ruta y filtros editables: utiliza los IDs que devuelve tu API.</Text>\n        <TextInput accessibilityLabel={\"Ruta \" + label} style={s.input} value={paths[i]} onChangeText={v => setPaths(paths.map((p, j) => j === i ? v : p))} autoCapitalize=\"none\" />\n        {errors[i] ? <Text style={s.error}>{errors[i]}</Text> : <Text selectable style={s.json}>{JSON.stringify(data[i] ?? [], null, 2)}</Text>}\n      </View>)}\n    </> : <>\n      <View style={s.row}>{FORMS.map((a, i) => <Pressable accessibilityRole=\"button\" key={a.title} disabled={busy} style={[s.button, i === form && s.active]} onPress={() => { setForm(i); setValues({}); setMessage(\"\"); }}><Text style={s.buttonText}>{a.title}</Text></Pressable>)}</View>\n      <View style={s.card}><Text style={s.heading}>{FORMS[form].method} {FORMS[form].route}</Text>\n        {FORMS[form].fields.map(([name, label]) => <View key={name}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} style={s.input} value={values[name] || \"\"} onChangeText={v => setValues({ ...values, [name]: v })} autoCapitalize=\"none\" /></View>)}\n        <Text>En campos opcionales: vacío conserva el valor. Si admite relación opcional, escribe null para quitar la asociación. Revisa el ID antes de eliminar.</Text>\n        <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void send()}><Text style={s.buttonText}>{busy ? \"Enviando…\" : \"Ejecutar operación\"}</Text></Pressable>\n        {!!message && <Text selectable style={message.startsWith(\"Error\") ? s.error : s.json}>{message}</Text>}\n      </View>\n    </>}\n  </ScrollView>;\n}",
      "\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 28, fontWeight: \"700\", color: \"#183c35\" }, label: { marginTop: 8, fontWeight: \"600\" }, row: { flexDirection: \"row\", flexWrap: \"wrap\", gap: 8 }, button: { backgroundColor: \"#315b4c\", padding: 13, borderRadius: 8, marginVertical: 5 }, active: { backgroundColor: \"#14705c\" }, buttonText: { color: \"white\", fontWeight: \"600\" }, input: { borderWidth: 1, borderColor: \"#aabea7\", borderRadius: 7, padding: 12, marginVertical: 8, backgroundColor: \"white\" }, card: { backgroundColor: \"white\", padding: 18, borderRadius: 10, gap: 8 }, heading: { fontSize: 18, fontWeight: \"700\" }, json: { fontFamily: \"monospace\", fontSize: 12, color: \"#234a3a\", marginVertical: 8 }, error: { color: \"#a22424\", marginVertical: 8 } });\n"
    ],
    "collection": "/lecciones",
    "schema": [
      [
        "cursos",
        "id PK · nombre"
      ],
      [
        "lecciones",
        "id PK · titulo · completada · curso_id FK"
      ]
    ],
    "bash": "api=\"http://localhost:3000\"\nid_json() { node -e 'let s=\"\"; process.stdin.on(\"data\",c=>s+=c); process.stdin.on(\"end\",()=>{const id=JSON.parse(s).id;if(!Number.isInteger(id))process.exit(1);console.log(id)});'; }\ncurso=$(curl -fsS -X POST \"$api/cursos\" -H \"Content-Type: application/json\" -d '{\"nombre\":\"TypeORM\"}')\ncurso_id=$(printf '%s' \"$curso\" | id_json)\nprintf '%s\\n' \"$curso\"\nleccion=$(curl -fsS -X POST \"$api/lecciones\" -H \"Content-Type: application/json\" -d \"{\\\"titulo\\\":\\\"Entities\\\",\\\"cursoId\\\":${curso_id}}\")\nleccion_id=$(printf '%s' \"$leccion\" | id_json)\nprintf '%s\\n' \"$leccion\"\ncurl -fsS -X PATCH \"$api/lecciones/${leccion_id}\" -H \"Content-Type: application/json\" -d '{\"completada\":true}'\ncurl -fsS \"$api/lecciones?cursoId=${curso_id}&completada=true\"",
    "querySql": "-- cursos(): todos los cursos con sus lecciones.\nSELECT curso.*, leccion.*\nFROM cursos AS curso\nLEFT JOIN lecciones AS leccion ON leccion.curso_id = curso.id\nORDER BY curso.id ASC;\n\n-- curso(id): cambia 1 por el ID real de un curso.\nSELECT curso.*, leccion.*\nFROM cursos AS curso\nLEFT JOIN lecciones AS leccion ON leccion.curso_id = curso.id\nWHERE curso.id = 1;\n\n-- lecciones(): sin filtros.\nSELECT leccion.*, curso.*\nFROM lecciones AS leccion\nLEFT JOIN cursos AS curso ON curso.id = leccion.curso_id\nORDER BY leccion.id ASC;\n\n-- lecciones(cursoId, completada): ejemplo con ambos filtros.\n-- Si no llega un filtro, TypeORM no añade su condición.\nSELECT leccion.*, curso.*\nFROM lecciones AS leccion\nLEFT JOIN cursos AS curso ON curso.id = leccion.curso_id\nWHERE curso.id = 1\n  AND leccion.completada = true\nORDER BY leccion.id ASC;\n\n-- leccion(id): cambia 1 por el ID real de una lección.\nSELECT leccion.*, curso.*\nFROM lecciones AS leccion\nLEFT JOIN cursos AS curso ON curso.id = leccion.curso_id\nWHERE leccion.id = 1;"
  },
  {
    "n": 2,
    "slug": "caso-02",
    "db": "practica_c02",
    "code": "C02",
    "title": "Alumnos y talleres · N:M",
    "initialApp": "import { Module, Controller, Get } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { DataSource } from \"typeorm\";\n@Controller(\"salud\")\nclass SaludController {\n  constructor(private readonly db: DataSource) {}\n  @Get() async salud() {\n    const rows = await this.db.query(\"SELECT current_database() AS base\");\n    return { estado: \"ok\", caso: \"C02\", base: rows[0].base };\n  }\n}\n@Module({\n  imports: [TypeOrmModule.forRoot({\n    type: \"postgres\", host: process.env.DB_HOST || \"localhost\",\n    port: Number(process.env.DB_PORT || 5432), username: process.env.DB_USER || \"postgres\",\n    password: process.env.DB_PASSWORD,\n    database: process.env.DB_NAME || \"practica_c02\",\n    autoLoadEntities: true,\n    synchronize: true, // Solo para estas bases locales de práctica.\n  })],\n  controllers: [SaludController],\n})\nexport class AppModule {}\n",
    "emptyModule": "import { Module } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { Alumno } from \"./alumno.entity\";\nimport { Taller } from \"./taller.entity\";\n\n@Module({\n  imports: [TypeOrmModule.forFeature([Alumno, Taller])],\n  controllers: [],\n  providers: [],\n})\nexport class AulaModule {}\n",
    "snapshots": [
      {
        "verb": "Get",
        "methodNames": [
          "alumnos",
          "alumno",
          "talleres"
        ],
        "added": [
          {
            "name": "alumnos",
            "code": "async alumnos() {\n    return this.alumnoRepo.createQueryBuilder(\"alumno\")\n      .select(\"alumno\")\n      .leftJoinAndSelect(\"alumno.talleres\", \"taller\")\n      .orderBy(\"alumno.id\", \"ASC\")\n      .getMany();\n  }"
          },
          {
            "name": "alumno",
            "code": "async alumno(id: number) {\n    return this.alumnoRepo.createQueryBuilder(\"alumno\")\n      .select(\"alumno\")\n      .leftJoinAndSelect(\"alumno.talleres\", \"taller\")\n      .where(\"alumno.id = :id\", { id })\n      .getOneOrFail();\n  }"
          },
          {
            "name": "talleres",
            "code": "async talleres() {\n    return this.tallerRepo.createQueryBuilder(\"taller\")\n      .select(\"taller\")\n      .leftJoinAndSelect(\"taller.alumnos\", \"alumno\")\n      .orderBy(\"taller.id\", \"ASC\")\n      .getMany();\n  }"
          }
        ],
        "routes": [
          "@Get(\"alumnos\") alumnos() { return this.aula.alumnos(); }",
          "@Get(\"alumnos/:id\") alumno(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.alumno(id); }",
          "@Get(\"talleres\") talleres() { return this.aula.talleres(); }"
        ],
        "service": "import { Injectable } from \"@nestjs/common\";\nimport { InjectRepository } from \"@nestjs/typeorm\";\nimport { Repository } from \"typeorm\";\nimport { Alumno } from \"./alumno.entity\";\nimport { Taller } from \"./taller.entity\";\n\n@Injectable()\nexport class AulaService {\n  constructor(\n    @InjectRepository(Alumno) private readonly alumnoRepo: Repository<Alumno>,\n    @InjectRepository(Taller) private readonly tallerRepo: Repository<Taller>,\n  ) {}\n\n  async alumnos() {\n    return this.alumnoRepo.createQueryBuilder(\"alumno\")\n      .select(\"alumno\")\n      .leftJoinAndSelect(\"alumno.talleres\", \"taller\")\n      .orderBy(\"alumno.id\", \"ASC\")\n      .getMany();\n  }\n\n  async alumno(id: number) {\n    return this.alumnoRepo.createQueryBuilder(\"alumno\")\n      .select(\"alumno\")\n      .leftJoinAndSelect(\"alumno.talleres\", \"taller\")\n      .where(\"alumno.id = :id\", { id })\n      .getOneOrFail();\n  }\n\n  async talleres() {\n    return this.tallerRepo.createQueryBuilder(\"taller\")\n      .select(\"taller\")\n      .leftJoinAndSelect(\"taller.alumnos\", \"alumno\")\n      .orderBy(\"taller.id\", \"ASC\")\n      .getMany();\n  }\n}\n",
        "controller": "import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from \"@nestjs/common\";\nimport { AulaService } from \"./aula.service\";\n\n@Controller()\nexport class AulaController {\n  constructor(private readonly aula: AulaService) {}\n\n  @Get(\"alumnos\") alumnos() { return this.aula.alumnos(); }\n\n  @Get(\"alumnos/:id\") alumno(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.alumno(id); }\n\n  @Get(\"talleres\") talleres() { return this.aula.talleres(); }\n}\n"
      },
      {
        "verb": "Post",
        "methodNames": [
          "alumnos",
          "alumno",
          "crearAlumno",
          "talleres",
          "crearTaller",
          "asociar"
        ],
        "added": [
          {
            "name": "crearAlumno",
            "code": "async crearAlumno(datos: Record<string, unknown>) { const b = datos; return this.alumnoRepo.save(this.alumnoRepo.create({ nombre: String(b.nombre) })); }"
          },
          {
            "name": "crearTaller",
            "code": "async crearTaller(datos: Record<string, unknown>) { const b = datos; return this.tallerRepo.save(this.tallerRepo.create({ titulo: String(b.titulo) })); }"
          },
          {
            "name": "asociar",
            "code": "async asociar(alumnoId: number, datos: Record<string, unknown>) {\n    const b = datos; const tallerId = Number(b.tallerId);\n    const alumno = await this.alumno(alumnoId);\n    await this.tallerRepo.createQueryBuilder(\"taller\").select(\"taller\").where(\"taller.id = :id\", { id: tallerId }).getOneOrFail();\n    await this.alumnoRepo.createQueryBuilder().relation(Alumno, \"talleres\").of(alumnoId).add(tallerId);\n    return this.alumno(alumnoId);\n  }"
          }
        ],
        "routes": [
          "@Post(\"alumnos\") crearAlumno(@Body() datos: Record<string, unknown>) { return this.aula.crearAlumno(datos); }",
          "@Post(\"talleres\") crearTaller(@Body() datos: Record<string, unknown>) { return this.aula.crearTaller(datos); }",
          "@Post(\"alumnos/:id/talleres\") asociar(@Param(\"id\", ParseIntPipe) id: number, @Body() datos: Record<string, unknown>) { return this.aula.asociar(id, datos); }"
        ]
      },
      {
        "verb": "Patch",
        "methodNames": [
          "alumnos",
          "alumno",
          "crearAlumno",
          "editarAlumno",
          "talleres",
          "crearTaller",
          "asociar"
        ],
        "added": [
          {
            "name": "editarAlumno",
            "code": "async editarAlumno(id: number, datos: Record<string, unknown>) { const b = datos; const a = await this.alumno(id); a.nombre = String(b.nombre); await this.alumnoRepo.save(a); return this.alumno(id); }"
          }
        ],
        "routes": [
          "@Patch(\"alumnos/:id\") editar(@Param(\"id\", ParseIntPipe) id: number, @Body() datos: Record<string, unknown>) { return this.aula.editarAlumno(id, datos); }"
        ]
      },
      {
        "verb": "Delete",
        "methodNames": [
          "alumnos",
          "alumno",
          "crearAlumno",
          "editarAlumno",
          "borrarAlumno",
          "talleres",
          "crearTaller",
          "asociar",
          "desasociar"
        ],
        "added": [
          {
            "name": "desasociar",
            "code": "async desasociar(alumnoId: number, tallerId: number) {\n    const alumno = await this.alumno(alumnoId);\n    await this.alumnoRepo.createQueryBuilder().relation(Alumno, \"talleres\").of(alumnoId).remove(tallerId);\n    return this.alumno(alumnoId);\n  }"
          },
          {
            "name": "borrarAlumno",
            "code": "async borrarAlumno(id: number) { await this.alumno(id); await this.alumnoRepo.delete(id); return { eliminado: id }; }"
          }
        ],
        "routes": [
          "@Delete(\"alumnos/:id\") borrar(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.borrarAlumno(id); }",
          "@Delete(\"alumnos/:id/talleres/:tallerId\") quitar(@Param(\"id\", ParseIntPipe) id: number, @Param(\"tallerId\", ParseIntPipe) tallerId: number) { return this.aula.desasociar(id, tallerId); }"
        ]
      }
    ],
    "readScreen": "import React, { useState } from \"react\";\nimport { ScrollView, Text, TextInput, Pressable, StyleSheet } from \"react-native\";\nexport default function App() {\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [ruta, setRuta] = useState(\"/alumnos\");\n  const [datos, setDatos] = useState<unknown>([]);\n  const [error, setError] = useState(\"\");\n  const [cargando, setCargando] = useState(false);\n  async function consultar() {\n    setError(\"\"); setCargando(true);\n    try {\n      const response = await fetch(api.replace(/\\/$/, \"\") + ruta);\n      const data = await response.json();\n      if (!response.ok) throw new Error(data.message || \"Error HTTP \" + response.status);\n      setDatos(data);\n    } catch (e) { setError(String(e)); }\n    finally { setCargando(false); }\n  }\n  return <ScrollView contentContainerStyle={s.page}>\n    <Text style={s.title}>Alumnos y talleres · N:M · lectura</Text>\n    <Text>URL de la API: localhost en web; IP del ordenador en Expo Go.</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <Text>Ruta de consulta</Text>\n    <TextInput accessibilityLabel=\"Ruta de consulta\" style={s.input} value={ruta} onChangeText={setRuta} autoCapitalize=\"none\" />\n    <Pressable accessibilityRole=\"button\" style={s.button} disabled={cargando} onPress={() => void consultar()}>\n      <Text style={s.white}>{cargando ? \"Consultando…\" : \"Consultar\"}</Text>\n    </Pressable>\n    {!!error && <Text style={s.error}>{error}</Text>}\n    <Text selectable style={s.json}>{JSON.stringify(datos, null, 2)}</Text>\n  </ScrollView>;\n}\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 25, fontWeight: \"700\" }, input: { borderWidth: 1, borderColor: \"#91ac88\", padding: 12, borderRadius: 7, backgroundColor: \"white\" }, button: { padding: 14, backgroundColor: \"#225541\", borderRadius: 7 }, white: { color: \"white\" }, error: { color: \"#a22424\" }, json: { fontFamily: \"monospace\", fontSize: 12 } });\n",
    "frontendBlocks": [
      "import React, { useEffect, useState } from \"react\";\nimport { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from \"react-native\";\n// En web del propio ordenador, localhost sirve. En el móvil, escribe la IP LAN del ordenador.\nconst TITLE = \"Alumnos y talleres · N:M\";\nconst FORMS: { title: string; method: string; route: string; fields: [string, string, string][] }[] = [{\"title\": \"Crear alumno\", \"method\": \"POST\", \"route\": \"/alumnos\", \"fields\": [[\"nombre\", \"Nombre\", \"text\"]]}, {\"title\": \"Crear taller\", \"method\": \"POST\", \"route\": \"/talleres\", \"fields\": [[\"titulo\", \"Título\", \"text\"]]}, {\"title\": \"Asociar alumno a taller\", \"method\": \"POST\", \"route\": \"/alumnos/:id/talleres\", \"fields\": [[\"id\", \"ID de alumno\", \"path\"], [\"tallerId\", \"ID de taller\", \"number\"]]}, {\"title\": \"Editar alumno\", \"method\": \"PATCH\", \"route\": \"/alumnos/:id\", \"fields\": [[\"id\", \"ID de alumno\", \"path\"], [\"nombre\", \"Nuevo nombre\", \"text\"]]}, {\"title\": \"Quitar asociación\", \"method\": \"DELETE\", \"route\": \"/alumnos/:id/talleres/:tallerId\", \"fields\": [[\"id\", \"ID de alumno\", \"path\"], [\"tallerId\", \"ID de taller\", \"path\"]]}, {\"title\": \"Eliminar alumno\", \"method\": \"DELETE\", \"route\": \"/alumnos/:id\", \"fields\": [[\"id\", \"ID de alumno\", \"path\"]]}];\nconst LISTS: [string, string][] = [[\"Alumnos con talleres\", \"/alumnos\"], [\"Talleres con alumnos\", \"/talleres\"]];\nexport default function App() {",
      "\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [view, setView] = useState<\"datos\" | \"acciones\">(\"datos\");\n  const [form, setForm] = useState(0);\n  const [values, setValues] = useState<Record<string, string>>({});\n  const [paths, setPaths] = useState<string[]>(LISTS.map(x => x[1]));\n  const [data, setData] = useState<unknown[]>([]);\n  const [errors, setErrors] = useState<string[]>([]);\n  const [message, setMessage] = useState(\"\");\n  const [busy, setBusy] = useState(false);",
      "\n  async function request(path: string, method = \"GET\", payload?: Record<string, unknown>) {\n    const base = api.trim().replace(/\\/$/, \"\");\n    if (!/^https?:\\/\\//.test(base)) throw new Error(\"API: escribe http://IP:3000\");\n    if (!path.startsWith(\"/\")) throw new Error(\"La ruta debe empezar por /\");\n    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);\n    try {\n      const response = await fetch(base + path, { method, signal: controller.signal,\n        headers: payload === undefined ? undefined : { \"Content-Type\": \"application/json\" },\n        body: payload === undefined ? undefined : JSON.stringify(payload) });\n      const raw = await response.text(); let result: any;\n      try { result = raw ? JSON.parse(raw) : null; } catch { throw new Error(\"La API no ha devuelto JSON\"); }\n      if (!response.ok) throw new Error(`${response.status}: ${result?.message || raw}`);\n      return result;\n    } finally { clearTimeout(timeout); }\n  }\n  async function load() {\n    const next: unknown[] = []; const failures: string[] = [];\n    for (let i = 0; i < paths.length; i++) {\n      try { next[i] = await request(paths[i]); failures[i] = \"\"; }\n      catch (e) { next[i] = null; failures[i] = String(e); }\n    }\n    setData(next); setErrors(failures);\n  }\n  useEffect(() => { void load(); }, []);\n  async function refresh() { setBusy(true); setMessage(\"\"); try { await load(); } finally { setBusy(false); } }",
      "\n  async function send() {\n    setBusy(true); setMessage(\"\");\n    try {\n      const action = FORMS[form]; let route = action.route; const payload: Record<string, unknown> = {};\n      for (const [name, label, kind] of action.fields) {\n        const value = (values[name] || \"\").trim();\n        if (kind.startsWith(\"optional\") && value === \"\") continue;\n        if (kind === \"path\" || kind === \"number\" || kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") {\n          if ((kind === \"nullableNumber\" && value === \"\") || ((kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") && value === \"null\")) { payload[name] = null; continue; }\n          const n = Number(value);\n          if (!value || !Number.isSafeInteger(n) || n <= 0) throw new Error(label + \": escribe un ID entero positivo\");\n          if (kind === \"path\") route = route.replace(\":\" + name, encodeURIComponent(String(n)));\n          else payload[name] = n;\n        } else if (kind === \"optionalBoolean\") {\n          if (value !== \"true\" && value !== \"false\") throw new Error(label + \": escribe true o false\");\n          payload[name] = value === \"true\";\n        } else {\n          if (!value) throw new Error(label + \": campo obligatorio\");\n          payload[name] = value;\n        }\n      }\n      const result = await request(route, action.method, action.method === \"DELETE\" ? undefined : payload);\n      setMessage(\"Operación correcta: \" + JSON.stringify(result));\n      await load(); // Resincroniza las listas tras POST, PATCH o DELETE.\n    } catch (e) { setMessage(\"Error: \" + String(e)); }\n    finally { setBusy(false); }\n  }",
      "\n  return <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps=\"handled\">\n    <Text style={s.title}>{TITLE}</Text><Text>PostgreSQL local · NestJS · TypeORM · React Native</Text>\n    <Text style={s.label}>URL de la API (editable para web o móvil)</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <View style={s.row}>{([\"datos\", \"acciones\"] as const).map(v => <Pressable accessibilityRole=\"button\" key={v} style={[s.button, view === v && s.active]} onPress={() => setView(v)}><Text style={s.buttonText}>{v === \"datos\" ? \"1 · Datos y filtros\" : \"2 · Crear y modificar\"}</Text></Pressable>)}</View>\n    {view === \"datos\" ? <>\n      <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void refresh()}><Text style={s.buttonText}>{busy ? \"Consultando…\" : \"Consultar / aplicar filtros\"}</Text></Pressable>\n      {LISTS.map(([label], i) => <View style={s.card} key={label}>\n        <Text style={s.heading}>{label}</Text><Text>Ruta y filtros editables: utiliza los IDs que devuelve tu API.</Text>\n        <TextInput accessibilityLabel={\"Ruta \" + label} style={s.input} value={paths[i]} onChangeText={v => setPaths(paths.map((p, j) => j === i ? v : p))} autoCapitalize=\"none\" />\n        {errors[i] ? <Text style={s.error}>{errors[i]}</Text> : <Text selectable style={s.json}>{JSON.stringify(data[i] ?? [], null, 2)}</Text>}\n      </View>)}\n    </> : <>\n      <View style={s.row}>{FORMS.map((a, i) => <Pressable accessibilityRole=\"button\" key={a.title} disabled={busy} style={[s.button, i === form && s.active]} onPress={() => { setForm(i); setValues({}); setMessage(\"\"); }}><Text style={s.buttonText}>{a.title}</Text></Pressable>)}</View>\n      <View style={s.card}><Text style={s.heading}>{FORMS[form].method} {FORMS[form].route}</Text>\n        {FORMS[form].fields.map(([name, label]) => <View key={name}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} style={s.input} value={values[name] || \"\"} onChangeText={v => setValues({ ...values, [name]: v })} autoCapitalize=\"none\" /></View>)}\n        <Text>En campos opcionales: vacío conserva el valor. Si admite relación opcional, escribe null para quitar la asociación. Revisa el ID antes de eliminar.</Text>\n        <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void send()}><Text style={s.buttonText}>{busy ? \"Enviando…\" : \"Ejecutar operación\"}</Text></Pressable>\n        {!!message && <Text selectable style={message.startsWith(\"Error\") ? s.error : s.json}>{message}</Text>}\n      </View>\n    </>}\n  </ScrollView>;\n}",
      "\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 28, fontWeight: \"700\", color: \"#183c35\" }, label: { marginTop: 8, fontWeight: \"600\" }, row: { flexDirection: \"row\", flexWrap: \"wrap\", gap: 8 }, button: { backgroundColor: \"#315b4c\", padding: 13, borderRadius: 8, marginVertical: 5 }, active: { backgroundColor: \"#14705c\" }, buttonText: { color: \"white\", fontWeight: \"600\" }, input: { borderWidth: 1, borderColor: \"#aabea7\", borderRadius: 7, padding: 12, marginVertical: 8, backgroundColor: \"white\" }, card: { backgroundColor: \"white\", padding: 18, borderRadius: 10, gap: 8 }, heading: { fontSize: 18, fontWeight: \"700\" }, json: { fontFamily: \"monospace\", fontSize: 12, color: \"#234a3a\", marginVertical: 8 }, error: { color: \"#a22424\", marginVertical: 8 } });\n"
    ],
    "collection": "/alumnos",
    "schema": [
      [
        "alumnos",
        "id PK · nombre"
      ],
      [
        "talleres",
        "id PK · titulo"
      ],
      [
        "alumno_taller",
        "alumno_id PK/FK · taller_id PK/FK"
      ]
    ],
    "bash": "api=\"http://localhost:3000\"\nid_json() { node -e 'let s=\"\"; process.stdin.on(\"data\",c=>s+=c); process.stdin.on(\"end\",()=>{const id=JSON.parse(s).id;if(!Number.isInteger(id))process.exit(1);console.log(id)});'; }\nalumno=$(curl -fsS -X POST \"$api/alumnos\" -H \"Content-Type: application/json\" -d '{\"nombre\":\"Ana\"}')\nalumno_id=$(printf '%s' \"$alumno\" | id_json)\nprintf '%s\\n' \"$alumno\"\ntaller=$(curl -fsS -X POST \"$api/talleres\" -H \"Content-Type: application/json\" -d '{\"titulo\":\"SQL\"}')\ntaller_id=$(printf '%s' \"$taller\" | id_json)\nprintf '%s\\n' \"$taller\"\ncurl -fsS -X POST \"$api/alumnos/${alumno_id}/talleres\" -H \"Content-Type: application/json\" -d \"{\\\"tallerId\\\":${taller_id}}\"\ncurl -fsS \"$api/alumnos/${alumno_id}\"\ncurl -fsS -X DELETE \"$api/alumnos/${alumno_id}/talleres/${taller_id}\"",
    "querySql": "-- alumnos(): la N:M necesita pasar por alumno_taller.\nSELECT alumno.*, taller.*\nFROM alumnos AS alumno\nLEFT JOIN alumno_taller AS enlace ON enlace.alumno_id = alumno.id\nLEFT JOIN talleres AS taller ON taller.id = enlace.taller_id\nORDER BY alumno.id ASC;\n\n-- alumno(id): ejemplo con el alumno 1.\nSELECT alumno.*, taller.*\nFROM alumnos AS alumno\nLEFT JOIN alumno_taller AS enlace ON enlace.alumno_id = alumno.id\nLEFT JOIN talleres AS taller ON taller.id = enlace.taller_id\nWHERE alumno.id = 1;\n\n-- talleres(): recorrido inverso de la misma N:M.\nSELECT taller.*, alumno.*\nFROM talleres AS taller\nLEFT JOIN alumno_taller AS enlace ON enlace.taller_id = taller.id\nLEFT JOIN alumnos AS alumno ON alumno.id = enlace.alumno_id\nORDER BY taller.id ASC;"
  },
  {
    "n": 3,
    "slug": "caso-03",
    "db": "practica_c03",
    "code": "C03",
    "title": "Alumno y ficha · 1:1",
    "initialApp": "import { Module, Controller, Get } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { DataSource } from \"typeorm\";\n@Controller(\"salud\")\nclass SaludController {\n  constructor(private readonly db: DataSource) {}\n  @Get() async salud() {\n    const rows = await this.db.query(\"SELECT current_database() AS base\");\n    return { estado: \"ok\", caso: \"C03\", base: rows[0].base };\n  }\n}\n@Module({\n  imports: [TypeOrmModule.forRoot({\n    type: \"postgres\", host: process.env.DB_HOST || \"localhost\",\n    port: Number(process.env.DB_PORT || 5432), username: process.env.DB_USER || \"postgres\",\n    password: process.env.DB_PASSWORD,\n    database: process.env.DB_NAME || \"practica_c03\",\n    autoLoadEntities: true,\n    synchronize: true, // Solo para estas bases locales de práctica.\n  })],\n  controllers: [SaludController],\n})\nexport class AppModule {}\n",
    "emptyModule": "import { Module } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { Alumno } from \"./alumno.entity\";\nimport { Ficha } from \"./ficha.entity\";\n\n@Module({\n  imports: [TypeOrmModule.forFeature([Alumno, Ficha])],\n  controllers: [],\n  providers: [],\n})\nexport class AulaModule {}\n",
    "snapshots": [
      {
        "verb": "Get",
        "methodNames": [
          "alumnos",
          "fichas",
          "ficha"
        ],
        "added": [
          {
            "name": "alumnos",
            "code": "async alumnos() {\n    return this.alumnoRepo.createQueryBuilder(\"alumno\")\n      .select(\"alumno\")\n      .leftJoinAndSelect(\"alumno.ficha\", \"ficha\")\n      .orderBy(\"alumno.id\", \"ASC\")\n      .getMany();\n  }"
          },
          {
            "name": "fichas",
            "code": "async fichas() {\n    return this.fichaRepo.createQueryBuilder(\"ficha\")\n      .select(\"ficha\")\n      .leftJoinAndSelect(\"ficha.alumno\", \"alumno\")\n      .orderBy(\"ficha.id\", \"ASC\")\n      .getMany();\n  }"
          },
          {
            "name": "ficha",
            "code": "async ficha(id: number) {\n    return this.fichaRepo.createQueryBuilder(\"ficha\")\n      .select(\"ficha\")\n      .leftJoinAndSelect(\"ficha.alumno\", \"alumno\")\n      .where(\"ficha.id = :id\", { id })\n      .getOneOrFail();\n  }"
          }
        ],
        "routes": [
          "@Get(\"alumnos\") alumnos() { return this.aula.alumnos(); }",
          "@Get(\"fichas\") fichas() { return this.aula.fichas(); }",
          "@Get(\"fichas/:id\") ficha(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.ficha(id); }"
        ],
        "service": "import { Injectable } from \"@nestjs/common\";\nimport { InjectRepository } from \"@nestjs/typeorm\";\nimport { Repository } from \"typeorm\";\nimport { Alumno } from \"./alumno.entity\";\nimport { Ficha } from \"./ficha.entity\";\n\n@Injectable()\nexport class AulaService {\n  constructor(\n    @InjectRepository(Alumno) private readonly alumnoRepo: Repository<Alumno>,\n    @InjectRepository(Ficha) private readonly fichaRepo: Repository<Ficha>,\n  ) {}\n\n  async alumnos() {\n    return this.alumnoRepo.createQueryBuilder(\"alumno\")\n      .select(\"alumno\")\n      .leftJoinAndSelect(\"alumno.ficha\", \"ficha\")\n      .orderBy(\"alumno.id\", \"ASC\")\n      .getMany();\n  }\n\n  async fichas() {\n    return this.fichaRepo.createQueryBuilder(\"ficha\")\n      .select(\"ficha\")\n      .leftJoinAndSelect(\"ficha.alumno\", \"alumno\")\n      .orderBy(\"ficha.id\", \"ASC\")\n      .getMany();\n  }\n\n  async ficha(id: number) {\n    return this.fichaRepo.createQueryBuilder(\"ficha\")\n      .select(\"ficha\")\n      .leftJoinAndSelect(\"ficha.alumno\", \"alumno\")\n      .where(\"ficha.id = :id\", { id })\n      .getOneOrFail();\n  }\n}\n",
        "controller": "import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from \"@nestjs/common\";\nimport { AulaService } from \"./aula.service\";\n\n@Controller()\nexport class AulaController {\n  constructor(private readonly aula: AulaService) {}\n\n  @Get(\"alumnos\") alumnos() { return this.aula.alumnos(); }\n\n  @Get(\"fichas\") fichas() { return this.aula.fichas(); }\n\n  @Get(\"fichas/:id\") ficha(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.ficha(id); }\n}\n"
      },
      {
        "verb": "Post",
        "methodNames": [
          "alumnos",
          "crearAlumno",
          "fichas",
          "ficha",
          "crearFicha"
        ],
        "added": [
          {
            "name": "crearAlumno",
            "code": "async crearAlumno(datos: Record<string, unknown>) { const b = datos; return this.alumnoRepo.save(this.alumnoRepo.create({ nombre: String(b.nombre) })); }"
          },
          {
            "name": "crearFicha",
            "code": "async crearFicha(datos: Record<string, unknown>) {\n    const b = datos; const alumnoId = Number(b.alumnoId);\n    const alumno = await this.alumnoRepo.createQueryBuilder(\"alumno\").select(\"alumno\").where(\"alumno.id = :id\", { id: alumnoId }).getOneOrFail();\n    const ficha = await this.fichaRepo.save(this.fichaRepo.create({ alumno, telefono: String(b.telefono) }));\n    return this.ficha(ficha.id);\n  }"
          }
        ],
        "routes": [
          "@Post(\"alumnos\") crearAlumno(@Body() datos: Record<string, unknown>) { return this.aula.crearAlumno(datos); }",
          "@Post(\"fichas\") crearFicha(@Body() datos: Record<string, unknown>) { return this.aula.crearFicha(datos); }"
        ]
      },
      {
        "verb": "Patch",
        "methodNames": [
          "alumnos",
          "crearAlumno",
          "fichas",
          "ficha",
          "crearFicha",
          "editarFicha"
        ],
        "added": [
          {
            "name": "editarFicha",
            "code": "async editarFicha(id: number, datos: Record<string, unknown>) { const b = datos; const f = await this.ficha(id); f.telefono = String(b.telefono); await this.fichaRepo.save(f); return this.ficha(id); }"
          }
        ],
        "routes": [
          "@Patch(\"fichas/:id\") editar(@Param(\"id\", ParseIntPipe) id: number, @Body() datos: Record<string, unknown>) { return this.aula.editarFicha(id, datos); }"
        ]
      },
      {
        "verb": "Delete",
        "methodNames": [
          "alumnos",
          "crearAlumno",
          "fichas",
          "ficha",
          "crearFicha",
          "editarFicha",
          "borrarFicha"
        ],
        "added": [
          {
            "name": "borrarFicha",
            "code": "async borrarFicha(id: number) { await this.ficha(id); await this.fichaRepo.delete(id); return { eliminado: id }; }"
          }
        ],
        "routes": [
          "@Delete(\"fichas/:id\") borrar(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.borrarFicha(id); }"
        ]
      }
    ],
    "readScreen": "import React, { useState } from \"react\";\nimport { ScrollView, Text, TextInput, Pressable, StyleSheet } from \"react-native\";\nexport default function App() {\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [ruta, setRuta] = useState(\"/fichas\");\n  const [datos, setDatos] = useState<unknown>([]);\n  const [error, setError] = useState(\"\");\n  const [cargando, setCargando] = useState(false);\n  async function consultar() {\n    setError(\"\"); setCargando(true);\n    try {\n      const response = await fetch(api.replace(/\\/$/, \"\") + ruta);\n      const data = await response.json();\n      if (!response.ok) throw new Error(data.message || \"Error HTTP \" + response.status);\n      setDatos(data);\n    } catch (e) { setError(String(e)); }\n    finally { setCargando(false); }\n  }\n  return <ScrollView contentContainerStyle={s.page}>\n    <Text style={s.title}>Alumno y ficha · 1:1 · lectura</Text>\n    <Text>URL de la API: localhost en web; IP del ordenador en Expo Go.</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <Text>Ruta de consulta</Text>\n    <TextInput accessibilityLabel=\"Ruta de consulta\" style={s.input} value={ruta} onChangeText={setRuta} autoCapitalize=\"none\" />\n    <Pressable accessibilityRole=\"button\" style={s.button} disabled={cargando} onPress={() => void consultar()}>\n      <Text style={s.white}>{cargando ? \"Consultando…\" : \"Consultar\"}</Text>\n    </Pressable>\n    {!!error && <Text style={s.error}>{error}</Text>}\n    <Text selectable style={s.json}>{JSON.stringify(datos, null, 2)}</Text>\n  </ScrollView>;\n}\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 25, fontWeight: \"700\" }, input: { borderWidth: 1, borderColor: \"#91ac88\", padding: 12, borderRadius: 7, backgroundColor: \"white\" }, button: { padding: 14, backgroundColor: \"#225541\", borderRadius: 7 }, white: { color: \"white\" }, error: { color: \"#a22424\" }, json: { fontFamily: \"monospace\", fontSize: 12 } });\n",
    "frontendBlocks": [
      "import React, { useEffect, useState } from \"react\";\nimport { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from \"react-native\";\n// En web del propio ordenador, localhost sirve. En el móvil, escribe la IP LAN del ordenador.\nconst TITLE = \"Alumno y ficha · 1:1\";\nconst FORMS: { title: string; method: string; route: string; fields: [string, string, string][] }[] = [{\"title\": \"Crear alumno\", \"method\": \"POST\", \"route\": \"/alumnos\", \"fields\": [[\"nombre\", \"Nombre\", \"text\"]]}, {\"title\": \"Crear ficha\", \"method\": \"POST\", \"route\": \"/fichas\", \"fields\": [[\"alumnoId\", \"ID del alumno\", \"number\"], [\"telefono\", \"Teléfono\", \"text\"]]}, {\"title\": \"Editar ficha\", \"method\": \"PATCH\", \"route\": \"/fichas/:id\", \"fields\": [[\"id\", \"ID de ficha\", \"path\"], [\"telefono\", \"Nuevo teléfono\", \"text\"]]}, {\"title\": \"Eliminar ficha\", \"method\": \"DELETE\", \"route\": \"/fichas/:id\", \"fields\": [[\"id\", \"ID de ficha\", \"path\"]]}];\nconst LISTS: [string, string][] = [[\"Alumnos con su ficha\", \"/alumnos\"], [\"Fichas y alumno\", \"/fichas\"]];\nexport default function App() {",
      "\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [view, setView] = useState<\"datos\" | \"acciones\">(\"datos\");\n  const [form, setForm] = useState(0);\n  const [values, setValues] = useState<Record<string, string>>({});\n  const [paths, setPaths] = useState<string[]>(LISTS.map(x => x[1]));\n  const [data, setData] = useState<unknown[]>([]);\n  const [errors, setErrors] = useState<string[]>([]);\n  const [message, setMessage] = useState(\"\");\n  const [busy, setBusy] = useState(false);",
      "\n  async function request(path: string, method = \"GET\", payload?: Record<string, unknown>) {\n    const base = api.trim().replace(/\\/$/, \"\");\n    if (!/^https?:\\/\\//.test(base)) throw new Error(\"API: escribe http://IP:3000\");\n    if (!path.startsWith(\"/\")) throw new Error(\"La ruta debe empezar por /\");\n    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);\n    try {\n      const response = await fetch(base + path, { method, signal: controller.signal,\n        headers: payload === undefined ? undefined : { \"Content-Type\": \"application/json\" },\n        body: payload === undefined ? undefined : JSON.stringify(payload) });\n      const raw = await response.text(); let result: any;\n      try { result = raw ? JSON.parse(raw) : null; } catch { throw new Error(\"La API no ha devuelto JSON\"); }\n      if (!response.ok) throw new Error(`${response.status}: ${result?.message || raw}`);\n      return result;\n    } finally { clearTimeout(timeout); }\n  }\n  async function load() {\n    const next: unknown[] = []; const failures: string[] = [];\n    for (let i = 0; i < paths.length; i++) {\n      try { next[i] = await request(paths[i]); failures[i] = \"\"; }\n      catch (e) { next[i] = null; failures[i] = String(e); }\n    }\n    setData(next); setErrors(failures);\n  }\n  useEffect(() => { void load(); }, []);\n  async function refresh() { setBusy(true); setMessage(\"\"); try { await load(); } finally { setBusy(false); } }",
      "\n  async function send() {\n    setBusy(true); setMessage(\"\");\n    try {\n      const action = FORMS[form]; let route = action.route; const payload: Record<string, unknown> = {};\n      for (const [name, label, kind] of action.fields) {\n        const value = (values[name] || \"\").trim();\n        if (kind.startsWith(\"optional\") && value === \"\") continue;\n        if (kind === \"path\" || kind === \"number\" || kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") {\n          if ((kind === \"nullableNumber\" && value === \"\") || ((kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") && value === \"null\")) { payload[name] = null; continue; }\n          const n = Number(value);\n          if (!value || !Number.isSafeInteger(n) || n <= 0) throw new Error(label + \": escribe un ID entero positivo\");\n          if (kind === \"path\") route = route.replace(\":\" + name, encodeURIComponent(String(n)));\n          else payload[name] = n;\n        } else if (kind === \"optionalBoolean\") {\n          if (value !== \"true\" && value !== \"false\") throw new Error(label + \": escribe true o false\");\n          payload[name] = value === \"true\";\n        } else {\n          if (!value) throw new Error(label + \": campo obligatorio\");\n          payload[name] = value;\n        }\n      }\n      const result = await request(route, action.method, action.method === \"DELETE\" ? undefined : payload);\n      setMessage(\"Operación correcta: \" + JSON.stringify(result));\n      await load(); // Resincroniza las listas tras POST, PATCH o DELETE.\n    } catch (e) { setMessage(\"Error: \" + String(e)); }\n    finally { setBusy(false); }\n  }",
      "\n  return <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps=\"handled\">\n    <Text style={s.title}>{TITLE}</Text><Text>PostgreSQL local · NestJS · TypeORM · React Native</Text>\n    <Text style={s.label}>URL de la API (editable para web o móvil)</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <View style={s.row}>{([\"datos\", \"acciones\"] as const).map(v => <Pressable accessibilityRole=\"button\" key={v} style={[s.button, view === v && s.active]} onPress={() => setView(v)}><Text style={s.buttonText}>{v === \"datos\" ? \"1 · Datos y filtros\" : \"2 · Crear y modificar\"}</Text></Pressable>)}</View>\n    {view === \"datos\" ? <>\n      <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void refresh()}><Text style={s.buttonText}>{busy ? \"Consultando…\" : \"Consultar / aplicar filtros\"}</Text></Pressable>\n      {LISTS.map(([label], i) => <View style={s.card} key={label}>\n        <Text style={s.heading}>{label}</Text><Text>Ruta y filtros editables: utiliza los IDs que devuelve tu API.</Text>\n        <TextInput accessibilityLabel={\"Ruta \" + label} style={s.input} value={paths[i]} onChangeText={v => setPaths(paths.map((p, j) => j === i ? v : p))} autoCapitalize=\"none\" />\n        {errors[i] ? <Text style={s.error}>{errors[i]}</Text> : <Text selectable style={s.json}>{JSON.stringify(data[i] ?? [], null, 2)}</Text>}\n      </View>)}\n    </> : <>\n      <View style={s.row}>{FORMS.map((a, i) => <Pressable accessibilityRole=\"button\" key={a.title} disabled={busy} style={[s.button, i === form && s.active]} onPress={() => { setForm(i); setValues({}); setMessage(\"\"); }}><Text style={s.buttonText}>{a.title}</Text></Pressable>)}</View>\n      <View style={s.card}><Text style={s.heading}>{FORMS[form].method} {FORMS[form].route}</Text>\n        {FORMS[form].fields.map(([name, label]) => <View key={name}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} style={s.input} value={values[name] || \"\"} onChangeText={v => setValues({ ...values, [name]: v })} autoCapitalize=\"none\" /></View>)}\n        <Text>En campos opcionales: vacío conserva el valor. Si admite relación opcional, escribe null para quitar la asociación. Revisa el ID antes de eliminar.</Text>\n        <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void send()}><Text style={s.buttonText}>{busy ? \"Enviando…\" : \"Ejecutar operación\"}</Text></Pressable>\n        {!!message && <Text selectable style={message.startsWith(\"Error\") ? s.error : s.json}>{message}</Text>}\n      </View>\n    </>}\n  </ScrollView>;\n}",
      "\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 28, fontWeight: \"700\", color: \"#183c35\" }, label: { marginTop: 8, fontWeight: \"600\" }, row: { flexDirection: \"row\", flexWrap: \"wrap\", gap: 8 }, button: { backgroundColor: \"#315b4c\", padding: 13, borderRadius: 8, marginVertical: 5 }, active: { backgroundColor: \"#14705c\" }, buttonText: { color: \"white\", fontWeight: \"600\" }, input: { borderWidth: 1, borderColor: \"#aabea7\", borderRadius: 7, padding: 12, marginVertical: 8, backgroundColor: \"white\" }, card: { backgroundColor: \"white\", padding: 18, borderRadius: 10, gap: 8 }, heading: { fontSize: 18, fontWeight: \"700\" }, json: { fontFamily: \"monospace\", fontSize: 12, color: \"#234a3a\", marginVertical: 8 }, error: { color: \"#a22424\", marginVertical: 8 } });\n"
    ],
    "collection": "/fichas",
    "schema": [
      [
        "alumnos",
        "id PK · nombre"
      ],
      [
        "fichas",
        "id PK · telefono · alumno_id FK UNIQUE"
      ]
    ],
    "bash": "api=\"http://localhost:3000\"\nid_json() { node -e 'let s=\"\"; process.stdin.on(\"data\",c=>s+=c); process.stdin.on(\"end\",()=>{const id=JSON.parse(s).id;if(!Number.isInteger(id))process.exit(1);console.log(id)});'; }\nalumno=$(curl -fsS -X POST \"$api/alumnos\" -H \"Content-Type: application/json\" -d '{\"nombre\":\"Ana\"}')\nalumno_id=$(printf '%s' \"$alumno\" | id_json)\nprintf '%s\\n' \"$alumno\"\nficha=$(curl -fsS -X POST \"$api/fichas\" -H \"Content-Type: application/json\" -d \"{\\\"alumnoId\\\":${alumno_id},\\\"telefono\\\":\\\"600000000\\\"}\")\nficha_id=$(printf '%s' \"$ficha\" | id_json)\nprintf '%s\\n' \"$ficha\"\ncurl -fsS -X PATCH \"$api/fichas/${ficha_id}\" -H \"Content-Type: application/json\" -d '{\"telefono\":\"611111111\"}'\ncurl -fsS \"$api/alumnos\"",
    "querySql": "-- alumnos(): cada alumno con su ficha si existe.\nSELECT alumno.*, ficha.*\nFROM alumnos AS alumno\nLEFT JOIN fichas AS ficha ON ficha.alumno_id = alumno.id\nORDER BY alumno.id ASC;\n\n-- fichas(): cada ficha con su alumno.\nSELECT ficha.*, alumno.*\nFROM fichas AS ficha\nLEFT JOIN alumnos AS alumno ON alumno.id = ficha.alumno_id\nORDER BY ficha.id ASC;\n\n-- ficha(id): ejemplo con la ficha 1.\nSELECT ficha.*, alumno.*\nFROM fichas AS ficha\nLEFT JOIN alumnos AS alumno ON alumno.id = ficha.alumno_id\nWHERE ficha.id = 1;"
  },
  {
    "n": 4,
    "slug": "caso-04",
    "db": "practica_c04",
    "code": "C04",
    "title": "Inscripción con datos · N:M explícita",
    "initialApp": "import { Module, Controller, Get } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { DataSource } from \"typeorm\";\n@Controller(\"salud\")\nclass SaludController {\n  constructor(private readonly db: DataSource) {}\n  @Get() async salud() {\n    const rows = await this.db.query(\"SELECT current_database() AS base\");\n    return { estado: \"ok\", caso: \"C04\", base: rows[0].base };\n  }\n}\n@Module({\n  imports: [TypeOrmModule.forRoot({\n    type: \"postgres\", host: process.env.DB_HOST || \"localhost\",\n    port: Number(process.env.DB_PORT || 5432), username: process.env.DB_USER || \"postgres\",\n    password: process.env.DB_PASSWORD,\n    database: process.env.DB_NAME || \"practica_c04\",\n    autoLoadEntities: true,\n    synchronize: true, // Solo para estas bases locales de práctica.\n  })],\n  controllers: [SaludController],\n})\nexport class AppModule {}\n",
    "emptyModule": "import { Module } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { Alumno } from \"./alumno.entity\";\nimport { Taller } from \"./taller.entity\";\nimport { Inscripcion } from \"./inscripcion.entity\";\n\n@Module({\n  imports: [TypeOrmModule.forFeature([Alumno, Taller, Inscripcion])],\n  controllers: [],\n  providers: [],\n})\nexport class AulaModule {}\n",
    "snapshots": [
      {
        "verb": "Get",
        "methodNames": [
          "alumnos",
          "talleres",
          "inscripciones",
          "inscripcion"
        ],
        "added": [
          {
            "name": "alumnos",
            "code": "async alumnos() {\n    return this.alumnoRepo.createQueryBuilder(\"alumno\")\n      .select(\"alumno\")\n      .orderBy(\"alumno.id\", \"ASC\")\n      .getMany();\n  }"
          },
          {
            "name": "talleres",
            "code": "async talleres() {\n    return this.tallerRepo.createQueryBuilder(\"taller\")\n      .select(\"taller\")\n      .orderBy(\"taller.id\", \"ASC\")\n      .getMany();\n  }"
          },
          {
            "name": "inscripciones",
            "code": "async inscripciones(estado?: string, alumnoId?: string) {\n    const consulta = this.inscripcionRepo.createQueryBuilder(\"inscripcion\")\n      .select(\"inscripcion\")\n      .leftJoinAndSelect(\"inscripcion.alumno\", \"alumno\")\n      .leftJoinAndSelect(\"inscripcion.taller\", \"taller\");\n\n    if (estado !== undefined) {\n      consulta.andWhere(\"inscripcion.estado = :estado\", { estado });\n    }\n    if (alumnoId !== undefined) {\n      consulta.andWhere(\"alumno.id = :alumnoId\", { alumnoId: Number(alumnoId) });\n    }\n\n    return consulta.orderBy(\"inscripcion.id\", \"ASC\").getMany();\n  }"
          },
          {
            "name": "inscripcion",
            "code": "async inscripcion(id: number) {\n    return this.inscripcionRepo.createQueryBuilder(\"inscripcion\")\n      .select(\"inscripcion\")\n      .leftJoinAndSelect(\"inscripcion.alumno\", \"alumno\")\n      .leftJoinAndSelect(\"inscripcion.taller\", \"taller\")\n      .where(\"inscripcion.id = :id\", { id })\n      .getOneOrFail();\n  }"
          }
        ],
        "routes": [
          "@Get(\"alumnos\") alumnos() { return this.aula.alumnos(); }",
          "@Get(\"talleres\") talleres() { return this.aula.talleres(); }",
          "@Get(\"inscripciones\") inscripciones(@Query(\"estado\") estado?: string, @Query(\"alumnoId\") alumnoId?: string) { return this.aula.inscripciones(estado, alumnoId); }",
          "@Get(\"inscripciones/:id\") inscripcion(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.inscripcion(id); }"
        ],
        "service": "import { Injectable } from \"@nestjs/common\";\nimport { InjectRepository } from \"@nestjs/typeorm\";\nimport { Repository } from \"typeorm\";\nimport { Alumno } from \"./alumno.entity\";\nimport { Taller } from \"./taller.entity\";\nimport { Inscripcion } from \"./inscripcion.entity\";\n\n@Injectable()\nexport class AulaService {\n  constructor(\n    @InjectRepository(Alumno) private readonly alumnoRepo: Repository<Alumno>,\n    @InjectRepository(Taller) private readonly tallerRepo: Repository<Taller>,\n    @InjectRepository(Inscripcion) private readonly inscripcionRepo: Repository<Inscripcion>,\n  ) {}\n\n  async alumnos() {\n    return this.alumnoRepo.createQueryBuilder(\"alumno\")\n      .select(\"alumno\")\n      .orderBy(\"alumno.id\", \"ASC\")\n      .getMany();\n  }\n\n  async talleres() {\n    return this.tallerRepo.createQueryBuilder(\"taller\")\n      .select(\"taller\")\n      .orderBy(\"taller.id\", \"ASC\")\n      .getMany();\n  }\n\n  async inscripciones(estado?: string, alumnoId?: string) {\n    const consulta = this.inscripcionRepo.createQueryBuilder(\"inscripcion\")\n      .select(\"inscripcion\")\n      .leftJoinAndSelect(\"inscripcion.alumno\", \"alumno\")\n      .leftJoinAndSelect(\"inscripcion.taller\", \"taller\");\n\n    if (estado !== undefined) {\n      consulta.andWhere(\"inscripcion.estado = :estado\", { estado });\n    }\n    if (alumnoId !== undefined) {\n      consulta.andWhere(\"alumno.id = :alumnoId\", { alumnoId: Number(alumnoId) });\n    }\n\n    return consulta.orderBy(\"inscripcion.id\", \"ASC\").getMany();\n  }\n\n  async inscripcion(id: number) {\n    return this.inscripcionRepo.createQueryBuilder(\"inscripcion\")\n      .select(\"inscripcion\")\n      .leftJoinAndSelect(\"inscripcion.alumno\", \"alumno\")\n      .leftJoinAndSelect(\"inscripcion.taller\", \"taller\")\n      .where(\"inscripcion.id = :id\", { id })\n      .getOneOrFail();\n  }\n}\n",
        "controller": "import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from \"@nestjs/common\";\nimport { AulaService } from \"./aula.service\";\n\n@Controller()\nexport class AulaController {\n  constructor(private readonly aula: AulaService) {}\n\n  @Get(\"alumnos\") alumnos() { return this.aula.alumnos(); }\n\n  @Get(\"talleres\") talleres() { return this.aula.talleres(); }\n\n  @Get(\"inscripciones\") inscripciones(@Query(\"estado\") estado?: string, @Query(\"alumnoId\") alumnoId?: string) { return this.aula.inscripciones(estado, alumnoId); }\n\n  @Get(\"inscripciones/:id\") inscripcion(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.inscripcion(id); }\n}\n"
      },
      {
        "verb": "Post",
        "methodNames": [
          "alumnos",
          "crearAlumno",
          "talleres",
          "crearTaller",
          "inscripciones",
          "inscripcion",
          "crearInscripcion"
        ],
        "added": [
          {
            "name": "crearAlumno",
            "code": "async crearAlumno(datos: Record<string, unknown>) { const b = datos; return this.alumnoRepo.save(this.alumnoRepo.create({ nombre: String(b.nombre) })); }"
          },
          {
            "name": "crearTaller",
            "code": "async crearTaller(datos: Record<string, unknown>) { const b = datos; return this.tallerRepo.save(this.tallerRepo.create({ titulo: String(b.titulo) })); }"
          },
          {
            "name": "crearInscripcion",
            "code": "async crearInscripcion(datos: Record<string, unknown>) {\n    const b = datos; const alumnoId = Number(b.alumnoId); const tallerId = Number(b.tallerId);\n    const alumno = await this.alumnoRepo.createQueryBuilder(\"alumno\").select(\"alumno\").where(\"alumno.id = :id\", { id: alumnoId }).getOneOrFail();\n    const taller = await this.tallerRepo.createQueryBuilder(\"taller\").select(\"taller\").where(\"taller.id = :id\", { id: tallerId }).getOneOrFail();\n    const i = await this.inscripcionRepo.save(this.inscripcionRepo.create({ alumno, taller, fecha: String(b.fecha), estado: \"pendiente\" }));\n    return this.inscripcion(i.id);\n  }"
          }
        ],
        "routes": [
          "@Post(\"alumnos\") crearAlumno(@Body() datos: Record<string, unknown>) { return this.aula.crearAlumno(datos); }",
          "@Post(\"talleres\") crearTaller(@Body() datos: Record<string, unknown>) { return this.aula.crearTaller(datos); }",
          "@Post(\"inscripciones\") crear(@Body() datos: Record<string, unknown>) { return this.aula.crearInscripcion(datos); }"
        ]
      },
      {
        "verb": "Patch",
        "methodNames": [
          "alumnos",
          "crearAlumno",
          "talleres",
          "crearTaller",
          "inscripciones",
          "inscripcion",
          "crearInscripcion",
          "editarInscripcion"
        ],
        "added": [
          {
            "name": "editarInscripcion",
            "code": "async editarInscripcion(id: number, datos: Record<string, unknown>) {\n    const b = datos; const i = await this.inscripcion(id);\n    i.estado = String(b.estado);\n    await this.inscripcionRepo.save(i); return this.inscripcion(id);\n  }"
          }
        ],
        "routes": [
          "@Patch(\"inscripciones/:id\") editar(@Param(\"id\", ParseIntPipe) id: number, @Body() datos: Record<string, unknown>) { return this.aula.editarInscripcion(id, datos); }"
        ]
      },
      {
        "verb": "Delete",
        "methodNames": [
          "alumnos",
          "crearAlumno",
          "talleres",
          "crearTaller",
          "inscripciones",
          "inscripcion",
          "crearInscripcion",
          "editarInscripcion",
          "borrarInscripcion"
        ],
        "added": [
          {
            "name": "borrarInscripcion",
            "code": "async borrarInscripcion(id: number) { await this.inscripcion(id); await this.inscripcionRepo.delete(id); return { eliminado: id }; }"
          }
        ],
        "routes": [
          "@Delete(\"inscripciones/:id\") borrar(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.borrarInscripcion(id); }"
        ]
      }
    ],
    "readScreen": "import React, { useState } from \"react\";\nimport { ScrollView, Text, TextInput, Pressable, StyleSheet } from \"react-native\";\nexport default function App() {\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [ruta, setRuta] = useState(\"/inscripciones\");\n  const [datos, setDatos] = useState<unknown>([]);\n  const [error, setError] = useState(\"\");\n  const [cargando, setCargando] = useState(false);\n  async function consultar() {\n    setError(\"\"); setCargando(true);\n    try {\n      const response = await fetch(api.replace(/\\/$/, \"\") + ruta);\n      const data = await response.json();\n      if (!response.ok) throw new Error(data.message || \"Error HTTP \" + response.status);\n      setDatos(data);\n    } catch (e) { setError(String(e)); }\n    finally { setCargando(false); }\n  }\n  return <ScrollView contentContainerStyle={s.page}>\n    <Text style={s.title}>Inscripción con datos · N:M explícita · lectura</Text>\n    <Text>URL de la API: localhost en web; IP del ordenador en Expo Go.</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <Text>Ruta de consulta</Text>\n    <TextInput accessibilityLabel=\"Ruta de consulta\" style={s.input} value={ruta} onChangeText={setRuta} autoCapitalize=\"none\" />\n    <Pressable accessibilityRole=\"button\" style={s.button} disabled={cargando} onPress={() => void consultar()}>\n      <Text style={s.white}>{cargando ? \"Consultando…\" : \"Consultar\"}</Text>\n    </Pressable>\n    {!!error && <Text style={s.error}>{error}</Text>}\n    <Text selectable style={s.json}>{JSON.stringify(datos, null, 2)}</Text>\n  </ScrollView>;\n}\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 25, fontWeight: \"700\" }, input: { borderWidth: 1, borderColor: \"#91ac88\", padding: 12, borderRadius: 7, backgroundColor: \"white\" }, button: { padding: 14, backgroundColor: \"#225541\", borderRadius: 7 }, white: { color: \"white\" }, error: { color: \"#a22424\" }, json: { fontFamily: \"monospace\", fontSize: 12 } });\n",
    "frontendBlocks": [
      "import React, { useEffect, useState } from \"react\";\nimport { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from \"react-native\";\n// En web del propio ordenador, localhost sirve. En el móvil, escribe la IP LAN del ordenador.\nconst TITLE = \"Inscripción con datos · N:M explícita\";\nconst FORMS: { title: string; method: string; route: string; fields: [string, string, string][] }[] = [{\"title\": \"Crear alumno\", \"method\": \"POST\", \"route\": \"/alumnos\", \"fields\": [[\"nombre\", \"Nombre\", \"text\"]]}, {\"title\": \"Crear taller\", \"method\": \"POST\", \"route\": \"/talleres\", \"fields\": [[\"titulo\", \"Título\", \"text\"]]}, {\"title\": \"Crear inscripción\", \"method\": \"POST\", \"route\": \"/inscripciones\", \"fields\": [[\"alumnoId\", \"ID del alumno\", \"number\"], [\"tallerId\", \"ID del taller\", \"number\"], [\"fecha\", \"Fecha YYYY-MM-DD\", \"text\"]]}, {\"title\": \"Cambiar estado\", \"method\": \"PATCH\", \"route\": \"/inscripciones/:id\", \"fields\": [[\"id\", \"ID de inscripción\", \"path\"], [\"estado\", \"pendiente o confirmada\", \"text\"]]}, {\"title\": \"Eliminar inscripción\", \"method\": \"DELETE\", \"route\": \"/inscripciones/:id\", \"fields\": [[\"id\", \"ID de inscripción\", \"path\"]]}];\nconst LISTS: [string, string][] = [[\"Alumnos\", \"/alumnos\"], [\"Talleres\", \"/talleres\"], [\"Inscripciones con relaciones\", \"/inscripciones\"], [\"Confirmadas\", \"/inscripciones?estado=confirmada\"]];\nexport default function App() {",
      "\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [view, setView] = useState<\"datos\" | \"acciones\">(\"datos\");\n  const [form, setForm] = useState(0);\n  const [values, setValues] = useState<Record<string, string>>({});\n  const [paths, setPaths] = useState<string[]>(LISTS.map(x => x[1]));\n  const [data, setData] = useState<unknown[]>([]);\n  const [errors, setErrors] = useState<string[]>([]);\n  const [message, setMessage] = useState(\"\");\n  const [busy, setBusy] = useState(false);",
      "\n  async function request(path: string, method = \"GET\", payload?: Record<string, unknown>) {\n    const base = api.trim().replace(/\\/$/, \"\");\n    if (!/^https?:\\/\\//.test(base)) throw new Error(\"API: escribe http://IP:3000\");\n    if (!path.startsWith(\"/\")) throw new Error(\"La ruta debe empezar por /\");\n    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);\n    try {\n      const response = await fetch(base + path, { method, signal: controller.signal,\n        headers: payload === undefined ? undefined : { \"Content-Type\": \"application/json\" },\n        body: payload === undefined ? undefined : JSON.stringify(payload) });\n      const raw = await response.text(); let result: any;\n      try { result = raw ? JSON.parse(raw) : null; } catch { throw new Error(\"La API no ha devuelto JSON\"); }\n      if (!response.ok) throw new Error(`${response.status}: ${result?.message || raw}`);\n      return result;\n    } finally { clearTimeout(timeout); }\n  }\n  async function load() {\n    const next: unknown[] = []; const failures: string[] = [];\n    for (let i = 0; i < paths.length; i++) {\n      try { next[i] = await request(paths[i]); failures[i] = \"\"; }\n      catch (e) { next[i] = null; failures[i] = String(e); }\n    }\n    setData(next); setErrors(failures);\n  }\n  useEffect(() => { void load(); }, []);\n  async function refresh() { setBusy(true); setMessage(\"\"); try { await load(); } finally { setBusy(false); } }",
      "\n  async function send() {\n    setBusy(true); setMessage(\"\");\n    try {\n      const action = FORMS[form]; let route = action.route; const payload: Record<string, unknown> = {};\n      for (const [name, label, kind] of action.fields) {\n        const value = (values[name] || \"\").trim();\n        if (kind.startsWith(\"optional\") && value === \"\") continue;\n        if (kind === \"path\" || kind === \"number\" || kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") {\n          if ((kind === \"nullableNumber\" && value === \"\") || ((kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") && value === \"null\")) { payload[name] = null; continue; }\n          const n = Number(value);\n          if (!value || !Number.isSafeInteger(n) || n <= 0) throw new Error(label + \": escribe un ID entero positivo\");\n          if (kind === \"path\") route = route.replace(\":\" + name, encodeURIComponent(String(n)));\n          else payload[name] = n;\n        } else if (kind === \"optionalBoolean\") {\n          if (value !== \"true\" && value !== \"false\") throw new Error(label + \": escribe true o false\");\n          payload[name] = value === \"true\";\n        } else {\n          if (!value) throw new Error(label + \": campo obligatorio\");\n          payload[name] = value;\n        }\n      }\n      const result = await request(route, action.method, action.method === \"DELETE\" ? undefined : payload);\n      setMessage(\"Operación correcta: \" + JSON.stringify(result));\n      await load(); // Resincroniza las listas tras POST, PATCH o DELETE.\n    } catch (e) { setMessage(\"Error: \" + String(e)); }\n    finally { setBusy(false); }\n  }",
      "\n  return <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps=\"handled\">\n    <Text style={s.title}>{TITLE}</Text><Text>PostgreSQL local · NestJS · TypeORM · React Native</Text>\n    <Text style={s.label}>URL de la API (editable para web o móvil)</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <View style={s.row}>{([\"datos\", \"acciones\"] as const).map(v => <Pressable accessibilityRole=\"button\" key={v} style={[s.button, view === v && s.active]} onPress={() => setView(v)}><Text style={s.buttonText}>{v === \"datos\" ? \"1 · Datos y filtros\" : \"2 · Crear y modificar\"}</Text></Pressable>)}</View>\n    {view === \"datos\" ? <>\n      <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void refresh()}><Text style={s.buttonText}>{busy ? \"Consultando…\" : \"Consultar / aplicar filtros\"}</Text></Pressable>\n      {LISTS.map(([label], i) => <View style={s.card} key={label}>\n        <Text style={s.heading}>{label}</Text><Text>Ruta y filtros editables: utiliza los IDs que devuelve tu API.</Text>\n        <TextInput accessibilityLabel={\"Ruta \" + label} style={s.input} value={paths[i]} onChangeText={v => setPaths(paths.map((p, j) => j === i ? v : p))} autoCapitalize=\"none\" />\n        {errors[i] ? <Text style={s.error}>{errors[i]}</Text> : <Text selectable style={s.json}>{JSON.stringify(data[i] ?? [], null, 2)}</Text>}\n      </View>)}\n    </> : <>\n      <View style={s.row}>{FORMS.map((a, i) => <Pressable accessibilityRole=\"button\" key={a.title} disabled={busy} style={[s.button, i === form && s.active]} onPress={() => { setForm(i); setValues({}); setMessage(\"\"); }}><Text style={s.buttonText}>{a.title}</Text></Pressable>)}</View>\n      <View style={s.card}><Text style={s.heading}>{FORMS[form].method} {FORMS[form].route}</Text>\n        {FORMS[form].fields.map(([name, label]) => <View key={name}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} style={s.input} value={values[name] || \"\"} onChangeText={v => setValues({ ...values, [name]: v })} autoCapitalize=\"none\" /></View>)}\n        <Text>En campos opcionales: vacío conserva el valor. Si admite relación opcional, escribe null para quitar la asociación. Revisa el ID antes de eliminar.</Text>\n        <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void send()}><Text style={s.buttonText}>{busy ? \"Enviando…\" : \"Ejecutar operación\"}</Text></Pressable>\n        {!!message && <Text selectable style={message.startsWith(\"Error\") ? s.error : s.json}>{message}</Text>}\n      </View>\n    </>}\n  </ScrollView>;\n}",
      "\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 28, fontWeight: \"700\", color: \"#183c35\" }, label: { marginTop: 8, fontWeight: \"600\" }, row: { flexDirection: \"row\", flexWrap: \"wrap\", gap: 8 }, button: { backgroundColor: \"#315b4c\", padding: 13, borderRadius: 8, marginVertical: 5 }, active: { backgroundColor: \"#14705c\" }, buttonText: { color: \"white\", fontWeight: \"600\" }, input: { borderWidth: 1, borderColor: \"#aabea7\", borderRadius: 7, padding: 12, marginVertical: 8, backgroundColor: \"white\" }, card: { backgroundColor: \"white\", padding: 18, borderRadius: 10, gap: 8 }, heading: { fontSize: 18, fontWeight: \"700\" }, json: { fontFamily: \"monospace\", fontSize: 12, color: \"#234a3a\", marginVertical: 8 }, error: { color: \"#a22424\", marginVertical: 8 } });\n"
    ],
    "collection": "/inscripciones",
    "schema": [
      [
        "alumnos",
        "id PK · nombre"
      ],
      [
        "talleres",
        "id PK · titulo"
      ],
      [
        "inscripciones",
        "id PK · fecha · estado · alumno_id FK · taller_id FK · UNIQUE pareja"
      ]
    ],
    "bash": "api=\"http://localhost:3000\"\nid_json() { node -e 'let s=\"\"; process.stdin.on(\"data\",c=>s+=c); process.stdin.on(\"end\",()=>{const id=JSON.parse(s).id;if(!Number.isInteger(id))process.exit(1);console.log(id)});'; }\nalumno=$(curl -fsS -X POST \"$api/alumnos\" -H \"Content-Type: application/json\" -d '{\"nombre\":\"Ana\"}')\nalumno_id=$(printf '%s' \"$alumno\" | id_json)\nprintf '%s\\n' \"$alumno\"\ntaller=$(curl -fsS -X POST \"$api/talleres\" -H \"Content-Type: application/json\" -d '{\"titulo\":\"SQL\"}')\ntaller_id=$(printf '%s' \"$taller\" | id_json)\nprintf '%s\\n' \"$taller\"\ninscripcion=$(curl -fsS -X POST \"$api/inscripciones\" -H \"Content-Type: application/json\" -d \"{\\\"alumnoId\\\":${alumno_id},\\\"tallerId\\\":${taller_id},\\\"fecha\\\":\\\"2026-10-29\\\"}\")\ninscripcion_id=$(printf '%s' \"$inscripcion\" | id_json)\nprintf '%s\\n' \"$inscripcion\"\ncurl -fsS -X PATCH \"$api/inscripciones/${inscripcion_id}\" -H \"Content-Type: application/json\" -d '{\"estado\":\"confirmada\"}'\ncurl -fsS \"$api/inscripciones?estado=confirmada&alumnoId=${alumno_id}\"",
    "querySql": "-- alumnos() y talleres(): listas sin JOIN.\nSELECT alumno.* FROM alumnos AS alumno ORDER BY alumno.id ASC;\nSELECT taller.* FROM talleres AS taller ORDER BY taller.id ASC;\n\n-- inscripciones(): sin filtros.\nSELECT inscripcion.*, alumno.*, taller.*\nFROM inscripciones AS inscripcion\nLEFT JOIN alumnos AS alumno ON alumno.id = inscripcion.alumno_id\nLEFT JOIN talleres AS taller ON taller.id = inscripcion.taller_id\nORDER BY inscripcion.id ASC;\n\n-- inscripciones(estado, alumnoId): ejemplo con ambos filtros.\nSELECT inscripcion.*, alumno.*, taller.*\nFROM inscripciones AS inscripcion\nLEFT JOIN alumnos AS alumno ON alumno.id = inscripcion.alumno_id\nLEFT JOIN talleres AS taller ON taller.id = inscripcion.taller_id\nWHERE inscripcion.estado = 'confirmada'\n  AND alumno.id = 1\nORDER BY inscripcion.id ASC;\n\n-- inscripcion(id): ejemplo con la inscripción 1.\nSELECT inscripcion.*, alumno.*, taller.*\nFROM inscripciones AS inscripcion\nLEFT JOIN alumnos AS alumno ON alumno.id = inscripcion.alumno_id\nLEFT JOIN talleres AS taller ON taller.id = inscripcion.taller_id\nWHERE inscripcion.id = 1;"
  },
  {
    "n": 5,
    "slug": "caso-05",
    "db": "practica_c05",
    "code": "C05",
    "title": "Categorías · autorreferencia",
    "initialApp": "import { Module, Controller, Get } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { DataSource } from \"typeorm\";\n@Controller(\"salud\")\nclass SaludController {\n  constructor(private readonly db: DataSource) {}\n  @Get() async salud() {\n    const rows = await this.db.query(\"SELECT current_database() AS base\");\n    return { estado: \"ok\", caso: \"C05\", base: rows[0].base };\n  }\n}\n@Module({\n  imports: [TypeOrmModule.forRoot({\n    type: \"postgres\", host: process.env.DB_HOST || \"localhost\",\n    port: Number(process.env.DB_PORT || 5432), username: process.env.DB_USER || \"postgres\",\n    password: process.env.DB_PASSWORD,\n    database: process.env.DB_NAME || \"practica_c05\",\n    autoLoadEntities: true,\n    synchronize: true, // Solo para estas bases locales de práctica.\n  })],\n  controllers: [SaludController],\n})\nexport class AppModule {}\n",
    "emptyModule": "import { Module } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { Categoria } from \"./categoria.entity\";\n\n@Module({\n  imports: [TypeOrmModule.forFeature([Categoria])],\n  controllers: [],\n  providers: [],\n})\nexport class AulaModule {}\n",
    "snapshots": [
      {
        "verb": "Get",
        "methodNames": [
          "categorias",
          "categoria"
        ],
        "added": [
          {
            "name": "categorias",
            "code": "async categorias(padreId?: string) {\n    const consulta = this.categoriaRepo.createQueryBuilder(\"categoria\")\n      .select(\"categoria\")\n      .leftJoinAndSelect(\"categoria.padre\", \"padre\")\n      .leftJoinAndSelect(\"categoria.hijas\", \"hija\");\n\n    if (padreId === \"raiz\") {\n      consulta.where(\"categoria.padre_id IS NULL\");\n    } else if (padreId !== undefined) {\n      consulta.where(\"padre.id = :padreId\", { padreId: Number(padreId) });\n    }\n\n    return consulta.orderBy(\"categoria.id\", \"ASC\").getMany();\n  }"
          },
          {
            "name": "categoria",
            "code": "async categoria(id: number) {\n    return this.categoriaRepo.createQueryBuilder(\"categoria\")\n      .select(\"categoria\")\n      .leftJoinAndSelect(\"categoria.padre\", \"padre\")\n      .leftJoinAndSelect(\"categoria.hijas\", \"hija\")\n      .where(\"categoria.id = :id\", { id })\n      .getOneOrFail();\n  }"
          }
        ],
        "routes": [
          "@Get(\"categorias\") categorias(@Query(\"padreId\") padreId?: string) { return this.aula.categorias(padreId); }",
          "@Get(\"categorias/:id\") categoria(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.categoria(id); }"
        ],
        "service": "import { Injectable } from \"@nestjs/common\";\nimport { InjectRepository } from \"@nestjs/typeorm\";\nimport { Repository } from \"typeorm\";\nimport { Categoria } from \"./categoria.entity\";\n\n@Injectable()\nexport class AulaService {\n  constructor(\n    @InjectRepository(Categoria) private readonly categoriaRepo: Repository<Categoria>,\n  ) {}\n\n  async categorias(padreId?: string) {\n    const consulta = this.categoriaRepo.createQueryBuilder(\"categoria\")\n      .select(\"categoria\")\n      .leftJoinAndSelect(\"categoria.padre\", \"padre\")\n      .leftJoinAndSelect(\"categoria.hijas\", \"hija\");\n\n    if (padreId === \"raiz\") {\n      consulta.where(\"categoria.padre_id IS NULL\");\n    } else if (padreId !== undefined) {\n      consulta.where(\"padre.id = :padreId\", { padreId: Number(padreId) });\n    }\n\n    return consulta.orderBy(\"categoria.id\", \"ASC\").getMany();\n  }\n\n  async categoria(id: number) {\n    return this.categoriaRepo.createQueryBuilder(\"categoria\")\n      .select(\"categoria\")\n      .leftJoinAndSelect(\"categoria.padre\", \"padre\")\n      .leftJoinAndSelect(\"categoria.hijas\", \"hija\")\n      .where(\"categoria.id = :id\", { id })\n      .getOneOrFail();\n  }\n}\n",
        "controller": "import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from \"@nestjs/common\";\nimport { AulaService } from \"./aula.service\";\n\n@Controller()\nexport class AulaController {\n  constructor(private readonly aula: AulaService) {}\n\n  @Get(\"categorias\") categorias(@Query(\"padreId\") padreId?: string) { return this.aula.categorias(padreId); }\n\n  @Get(\"categorias/:id\") categoria(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.categoria(id); }\n}\n"
      },
      {
        "verb": "Post",
        "methodNames": [
          "categorias",
          "categoria",
          "crearCategoria"
        ],
        "added": [
          {
            "name": "crearCategoria",
            "code": "async crearCategoria(datos: Record<string, unknown>) {\n    const b = datos;\n    const padre = b.padreId === undefined || b.padreId === null ? null : await this.categoria(Number(b.padreId));\n    const c = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: String(b.nombre), padre }));\n    return this.categoria(c.id);\n  }"
          }
        ],
        "routes": [
          "@Post(\"categorias\") crear(@Body() datos: Record<string, unknown>) { return this.aula.crearCategoria(datos); }"
        ]
      },
      {
        "verb": "Patch",
        "methodNames": [
          "categorias",
          "categoria",
          "crearCategoria",
          "editarCategoria"
        ],
        "added": [
          {
            "name": "editarCategoria",
            "code": "async editarCategoria(id: number, datos: Record<string, unknown>) {\n    const b = datos; const item = await this.categoria(id);\n    if (b.nombre !== undefined) item.nombre = String(b.nombre);\n    if (b.padreId !== undefined) {\n      if (b.padreId === null) item.padre = null;\n      else {\n        item.padre = await this.categoria(Number(b.padreId));\n      }\n    }\n    await this.categoriaRepo.save(item); return this.categoria(id);\n  }"
          }
        ],
        "routes": [
          "@Patch(\"categorias/:id\") editar(@Param(\"id\", ParseIntPipe) id: number, @Body() datos: Record<string, unknown>) { return this.aula.editarCategoria(id, datos); }"
        ]
      },
      {
        "verb": "Delete",
        "methodNames": [
          "categorias",
          "categoria",
          "crearCategoria",
          "editarCategoria",
          "borrarCategoria"
        ],
        "added": [
          {
            "name": "borrarCategoria",
            "code": "async borrarCategoria(id: number) { await this.categoria(id); await this.categoriaRepo.delete(id); return { eliminado: id }; }"
          }
        ],
        "routes": [
          "@Delete(\"categorias/:id\") borrar(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.borrarCategoria(id); }"
        ]
      }
    ],
    "readScreen": "import React, { useState } from \"react\";\nimport { ScrollView, Text, TextInput, Pressable, StyleSheet } from \"react-native\";\nexport default function App() {\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [ruta, setRuta] = useState(\"/categorias\");\n  const [datos, setDatos] = useState<unknown>([]);\n  const [error, setError] = useState(\"\");\n  const [cargando, setCargando] = useState(false);\n  async function consultar() {\n    setError(\"\"); setCargando(true);\n    try {\n      const response = await fetch(api.replace(/\\/$/, \"\") + ruta);\n      const data = await response.json();\n      if (!response.ok) throw new Error(data.message || \"Error HTTP \" + response.status);\n      setDatos(data);\n    } catch (e) { setError(String(e)); }\n    finally { setCargando(false); }\n  }\n  return <ScrollView contentContainerStyle={s.page}>\n    <Text style={s.title}>Categorías · autorreferencia · lectura</Text>\n    <Text>URL de la API: localhost en web; IP del ordenador en Expo Go.</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <Text>Ruta de consulta</Text>\n    <TextInput accessibilityLabel=\"Ruta de consulta\" style={s.input} value={ruta} onChangeText={setRuta} autoCapitalize=\"none\" />\n    <Pressable accessibilityRole=\"button\" style={s.button} disabled={cargando} onPress={() => void consultar()}>\n      <Text style={s.white}>{cargando ? \"Consultando…\" : \"Consultar\"}</Text>\n    </Pressable>\n    {!!error && <Text style={s.error}>{error}</Text>}\n    <Text selectable style={s.json}>{JSON.stringify(datos, null, 2)}</Text>\n  </ScrollView>;\n}\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 25, fontWeight: \"700\" }, input: { borderWidth: 1, borderColor: \"#91ac88\", padding: 12, borderRadius: 7, backgroundColor: \"white\" }, button: { padding: 14, backgroundColor: \"#225541\", borderRadius: 7 }, white: { color: \"white\" }, error: { color: \"#a22424\" }, json: { fontFamily: \"monospace\", fontSize: 12 } });\n",
    "frontendBlocks": [
      "import React, { useEffect, useState } from \"react\";\nimport { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from \"react-native\";\n// En web del propio ordenador, localhost sirve. En el móvil, escribe la IP LAN del ordenador.\nconst TITLE = \"Categorías · autorreferencia\";\nconst FORMS: { title: string; method: string; route: string; fields: [string, string, string][] }[] = [{\"title\": \"Crear categoría\", \"method\": \"POST\", \"route\": \"/categorias\", \"fields\": [[\"nombre\", \"Nombre\", \"text\"], [\"padreId\", \"ID padre; vacío = raíz\", \"nullableNumber\"]]}, {\"title\": \"Editar categoría\", \"method\": \"PATCH\", \"route\": \"/categorias/:id\", \"fields\": [[\"id\", \"ID de categoría\", \"path\"], [\"nombre\", \"Nuevo nombre (opcional)\", \"optionalText\"], [\"padreId\", \"ID padre; null = raíz; vacío = no cambiar\", \"optionalNullableNumber\"]]}, {\"title\": \"Eliminar categoría\", \"method\": \"DELETE\", \"route\": \"/categorias/:id\", \"fields\": [[\"id\", \"ID de categoría\", \"path\"]]}];\nconst LISTS: [string, string][] = [[\"Categorías y relaciones\", \"/categorias\"], [\"Solo raíces\", \"/categorias?padreId=raiz\"], [\"Hijas de la categoría 1\", \"/categorias?padreId=1\"]];\nexport default function App() {",
      "\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [view, setView] = useState<\"datos\" | \"acciones\">(\"datos\");\n  const [form, setForm] = useState(0);\n  const [values, setValues] = useState<Record<string, string>>({});\n  const [paths, setPaths] = useState<string[]>(LISTS.map(x => x[1]));\n  const [data, setData] = useState<unknown[]>([]);\n  const [errors, setErrors] = useState<string[]>([]);\n  const [message, setMessage] = useState(\"\");\n  const [busy, setBusy] = useState(false);",
      "\n  async function request(path: string, method = \"GET\", payload?: Record<string, unknown>) {\n    const base = api.trim().replace(/\\/$/, \"\");\n    if (!/^https?:\\/\\//.test(base)) throw new Error(\"API: escribe http://IP:3000\");\n    if (!path.startsWith(\"/\")) throw new Error(\"La ruta debe empezar por /\");\n    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);\n    try {\n      const response = await fetch(base + path, { method, signal: controller.signal,\n        headers: payload === undefined ? undefined : { \"Content-Type\": \"application/json\" },\n        body: payload === undefined ? undefined : JSON.stringify(payload) });\n      const raw = await response.text(); let result: any;\n      try { result = raw ? JSON.parse(raw) : null; } catch { throw new Error(\"La API no ha devuelto JSON\"); }\n      if (!response.ok) throw new Error(`${response.status}: ${result?.message || raw}`);\n      return result;\n    } finally { clearTimeout(timeout); }\n  }\n  async function load() {\n    const next: unknown[] = []; const failures: string[] = [];\n    for (let i = 0; i < paths.length; i++) {\n      try { next[i] = await request(paths[i]); failures[i] = \"\"; }\n      catch (e) { next[i] = null; failures[i] = String(e); }\n    }\n    setData(next); setErrors(failures);\n  }\n  useEffect(() => { void load(); }, []);\n  async function refresh() { setBusy(true); setMessage(\"\"); try { await load(); } finally { setBusy(false); } }",
      "\n  async function send() {\n    setBusy(true); setMessage(\"\");\n    try {\n      const action = FORMS[form]; let route = action.route; const payload: Record<string, unknown> = {};\n      for (const [name, label, kind] of action.fields) {\n        const value = (values[name] || \"\").trim();\n        if (kind.startsWith(\"optional\") && value === \"\") continue;\n        if (kind === \"path\" || kind === \"number\" || kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") {\n          if ((kind === \"nullableNumber\" && value === \"\") || ((kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") && value === \"null\")) { payload[name] = null; continue; }\n          const n = Number(value);\n          if (!value || !Number.isSafeInteger(n) || n <= 0) throw new Error(label + \": escribe un ID entero positivo\");\n          if (kind === \"path\") route = route.replace(\":\" + name, encodeURIComponent(String(n)));\n          else payload[name] = n;\n        } else if (kind === \"optionalBoolean\") {\n          if (value !== \"true\" && value !== \"false\") throw new Error(label + \": escribe true o false\");\n          payload[name] = value === \"true\";\n        } else {\n          if (!value) throw new Error(label + \": campo obligatorio\");\n          payload[name] = value;\n        }\n      }\n      const result = await request(route, action.method, action.method === \"DELETE\" ? undefined : payload);\n      setMessage(\"Operación correcta: \" + JSON.stringify(result));\n      await load(); // Resincroniza las listas tras POST, PATCH o DELETE.\n    } catch (e) { setMessage(\"Error: \" + String(e)); }\n    finally { setBusy(false); }\n  }",
      "\n  return <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps=\"handled\">\n    <Text style={s.title}>{TITLE}</Text><Text>PostgreSQL local · NestJS · TypeORM · React Native</Text>\n    <Text style={s.label}>URL de la API (editable para web o móvil)</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <View style={s.row}>{([\"datos\", \"acciones\"] as const).map(v => <Pressable accessibilityRole=\"button\" key={v} style={[s.button, view === v && s.active]} onPress={() => setView(v)}><Text style={s.buttonText}>{v === \"datos\" ? \"1 · Datos y filtros\" : \"2 · Crear y modificar\"}</Text></Pressable>)}</View>\n    {view === \"datos\" ? <>\n      <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void refresh()}><Text style={s.buttonText}>{busy ? \"Consultando…\" : \"Consultar / aplicar filtros\"}</Text></Pressable>\n      {LISTS.map(([label], i) => <View style={s.card} key={label}>\n        <Text style={s.heading}>{label}</Text><Text>Ruta y filtros editables: utiliza los IDs que devuelve tu API.</Text>\n        <TextInput accessibilityLabel={\"Ruta \" + label} style={s.input} value={paths[i]} onChangeText={v => setPaths(paths.map((p, j) => j === i ? v : p))} autoCapitalize=\"none\" />\n        {errors[i] ? <Text style={s.error}>{errors[i]}</Text> : <Text selectable style={s.json}>{JSON.stringify(data[i] ?? [], null, 2)}</Text>}\n      </View>)}\n    </> : <>\n      <View style={s.row}>{FORMS.map((a, i) => <Pressable accessibilityRole=\"button\" key={a.title} disabled={busy} style={[s.button, i === form && s.active]} onPress={() => { setForm(i); setValues({}); setMessage(\"\"); }}><Text style={s.buttonText}>{a.title}</Text></Pressable>)}</View>\n      <View style={s.card}><Text style={s.heading}>{FORMS[form].method} {FORMS[form].route}</Text>\n        {FORMS[form].fields.map(([name, label]) => <View key={name}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} style={s.input} value={values[name] || \"\"} onChangeText={v => setValues({ ...values, [name]: v })} autoCapitalize=\"none\" /></View>)}\n        <Text>En campos opcionales: vacío conserva el valor. Si admite relación opcional, escribe null para quitar la asociación. Revisa el ID antes de eliminar.</Text>\n        <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void send()}><Text style={s.buttonText}>{busy ? \"Enviando…\" : \"Ejecutar operación\"}</Text></Pressable>\n        {!!message && <Text selectable style={message.startsWith(\"Error\") ? s.error : s.json}>{message}</Text>}\n      </View>\n    </>}\n  </ScrollView>;\n}",
      "\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 28, fontWeight: \"700\", color: \"#183c35\" }, label: { marginTop: 8, fontWeight: \"600\" }, row: { flexDirection: \"row\", flexWrap: \"wrap\", gap: 8 }, button: { backgroundColor: \"#315b4c\", padding: 13, borderRadius: 8, marginVertical: 5 }, active: { backgroundColor: \"#14705c\" }, buttonText: { color: \"white\", fontWeight: \"600\" }, input: { borderWidth: 1, borderColor: \"#aabea7\", borderRadius: 7, padding: 12, marginVertical: 8, backgroundColor: \"white\" }, card: { backgroundColor: \"white\", padding: 18, borderRadius: 10, gap: 8 }, heading: { fontSize: 18, fontWeight: \"700\" }, json: { fontFamily: \"monospace\", fontSize: 12, color: \"#234a3a\", marginVertical: 8 }, error: { color: \"#a22424\", marginVertical: 8 } });\n"
    ],
    "collection": "/categorias",
    "schema": [
      [
        "categorias",
        "id PK · nombre · padre_id FK opcional a categorias"
      ]
    ],
    "bash": "api=\"http://localhost:3000\"\nid_json() { node -e 'let s=\"\"; process.stdin.on(\"data\",c=>s+=c); process.stdin.on(\"end\",()=>{const id=JSON.parse(s).id;if(!Number.isInteger(id))process.exit(1);console.log(id)});'; }\nraiz=$(curl -fsS -X POST \"$api/categorias\" -H \"Content-Type: application/json\" -d '{\"nombre\":\"Programación\"}')\nraiz_id=$(printf '%s' \"$raiz\" | id_json)\nprintf '%s\\n' \"$raiz\"\nhija=$(curl -fsS -X POST \"$api/categorias\" -H \"Content-Type: application/json\" -d \"{\\\"nombre\\\":\\\"Backend\\\",\\\"padreId\\\":${raiz_id}}\")\nhija_id=$(printf '%s' \"$hija\" | id_json)\nprintf '%s\\n' \"$hija\"\ncurl -fsS \"$api/categorias?padreId=${raiz_id}\"\ncurl -fsS -X PATCH \"$api/categorias/${hija_id}\" -H \"Content-Type: application/json\" -d '{\"nombre\":\"API Backend\",\"padreId\":null}'",
    "querySql": "-- categorias(): todas, con padre e hijas.\nSELECT categoria.*, padre.*, hija.*\nFROM categorias AS categoria\nLEFT JOIN categorias AS padre ON padre.id = categoria.padre_id\nLEFT JOIN categorias AS hija ON hija.padre_id = categoria.id\nORDER BY categoria.id ASC;\n\n-- categorias(\"raiz\"): solo las que no tienen padre.\nSELECT categoria.*, padre.*, hija.*\nFROM categorias AS categoria\nLEFT JOIN categorias AS padre ON padre.id = categoria.padre_id\nLEFT JOIN categorias AS hija ON hija.padre_id = categoria.id\nWHERE categoria.padre_id IS NULL\nORDER BY categoria.id ASC;\n\n-- categorias(padreId): hijas del padre 1.\nSELECT categoria.*, padre.*, hija.*\nFROM categorias AS categoria\nLEFT JOIN categorias AS padre ON padre.id = categoria.padre_id\nLEFT JOIN categorias AS hija ON hija.padre_id = categoria.id\nWHERE padre.id = 1\nORDER BY categoria.id ASC;\n\n-- categoria(id): ejemplo con la categoría 1.\nSELECT categoria.*, padre.*, hija.*\nFROM categorias AS categoria\nLEFT JOIN categorias AS padre ON padre.id = categoria.padre_id\nLEFT JOIN categorias AS hija ON hija.padre_id = categoria.id\nWHERE categoria.id = 1;"
  },
  {
    "n": 6,
    "slug": "caso-06",
    "db": "practica_c06",
    "code": "C06",
    "title": "Incidencias · relación opcional",
    "initialApp": "import { Module, Controller, Get } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { DataSource } from \"typeorm\";\n@Controller(\"salud\")\nclass SaludController {\n  constructor(private readonly db: DataSource) {}\n  @Get() async salud() {\n    const rows = await this.db.query(\"SELECT current_database() AS base\");\n    return { estado: \"ok\", caso: \"C06\", base: rows[0].base };\n  }\n}\n@Module({\n  imports: [TypeOrmModule.forRoot({\n    type: \"postgres\", host: process.env.DB_HOST || \"localhost\",\n    port: Number(process.env.DB_PORT || 5432), username: process.env.DB_USER || \"postgres\",\n    password: process.env.DB_PASSWORD,\n    database: process.env.DB_NAME || \"practica_c06\",\n    autoLoadEntities: true,\n    synchronize: true, // Solo para estas bases locales de práctica.\n  })],\n  controllers: [SaludController],\n})\nexport class AppModule {}\n",
    "emptyModule": "import { Module } from \"@nestjs/common\";\nimport { TypeOrmModule } from \"@nestjs/typeorm\";\nimport { Tecnico } from \"./tecnico.entity\";\nimport { Incidencia } from \"./incidencia.entity\";\n\n@Module({\n  imports: [TypeOrmModule.forFeature([Tecnico, Incidencia])],\n  controllers: [],\n  providers: [],\n})\nexport class AulaModule {}\n",
    "snapshots": [
      {
        "verb": "Get",
        "methodNames": [
          "tecnicos",
          "incidencias",
          "incidencia"
        ],
        "added": [
          {
            "name": "tecnicos",
            "code": "async tecnicos() {\n    return this.tecnicoRepo.createQueryBuilder(\"tecnico\")\n      .select(\"tecnico\")\n      .orderBy(\"tecnico.id\", \"ASC\")\n      .getMany();\n  }"
          },
          {
            "name": "incidencias",
            "code": "async incidencias(sinAsignar?: string) {\n    const consulta = this.incidenciaRepo.createQueryBuilder(\"incidencia\")\n      .select(\"incidencia\")\n      .leftJoinAndSelect(\"incidencia.tecnico\", \"tecnico\");\n\n    if (sinAsignar === \"true\") {\n      consulta.where(\"incidencia.tecnico_id IS NULL\");\n    }\n\n    return consulta.orderBy(\"incidencia.id\", \"ASC\").getMany();\n  }"
          },
          {
            "name": "incidencia",
            "code": "async incidencia(id: number) {\n    return this.incidenciaRepo.createQueryBuilder(\"incidencia\")\n      .select(\"incidencia\")\n      .leftJoinAndSelect(\"incidencia.tecnico\", \"tecnico\")\n      .where(\"incidencia.id = :id\", { id })\n      .getOneOrFail();\n  }"
          }
        ],
        "routes": [
          "@Get(\"tecnicos\") tecnicos() { return this.aula.tecnicos(); }",
          "@Get(\"incidencias\") incidencias(@Query(\"sinAsignar\") sinAsignar?: string) { return this.aula.incidencias(sinAsignar); }",
          "@Get(\"incidencias/:id\") incidencia(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.incidencia(id); }"
        ],
        "service": "import { Injectable } from \"@nestjs/common\";\nimport { InjectRepository } from \"@nestjs/typeorm\";\nimport { Repository } from \"typeorm\";\nimport { Tecnico } from \"./tecnico.entity\";\nimport { Incidencia } from \"./incidencia.entity\";\n\n@Injectable()\nexport class AulaService {\n  constructor(\n    @InjectRepository(Tecnico) private readonly tecnicoRepo: Repository<Tecnico>,\n    @InjectRepository(Incidencia) private readonly incidenciaRepo: Repository<Incidencia>,\n  ) {}\n\n  async tecnicos() {\n    return this.tecnicoRepo.createQueryBuilder(\"tecnico\")\n      .select(\"tecnico\")\n      .orderBy(\"tecnico.id\", \"ASC\")\n      .getMany();\n  }\n\n  async incidencias(sinAsignar?: string) {\n    const consulta = this.incidenciaRepo.createQueryBuilder(\"incidencia\")\n      .select(\"incidencia\")\n      .leftJoinAndSelect(\"incidencia.tecnico\", \"tecnico\");\n\n    if (sinAsignar === \"true\") {\n      consulta.where(\"incidencia.tecnico_id IS NULL\");\n    }\n\n    return consulta.orderBy(\"incidencia.id\", \"ASC\").getMany();\n  }\n\n  async incidencia(id: number) {\n    return this.incidenciaRepo.createQueryBuilder(\"incidencia\")\n      .select(\"incidencia\")\n      .leftJoinAndSelect(\"incidencia.tecnico\", \"tecnico\")\n      .where(\"incidencia.id = :id\", { id })\n      .getOneOrFail();\n  }\n}\n",
        "controller": "import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from \"@nestjs/common\";\nimport { AulaService } from \"./aula.service\";\n\n@Controller()\nexport class AulaController {\n  constructor(private readonly aula: AulaService) {}\n\n  @Get(\"tecnicos\") tecnicos() { return this.aula.tecnicos(); }\n\n  @Get(\"incidencias\") incidencias(@Query(\"sinAsignar\") sinAsignar?: string) { return this.aula.incidencias(sinAsignar); }\n\n  @Get(\"incidencias/:id\") incidencia(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.incidencia(id); }\n}\n"
      },
      {
        "verb": "Post",
        "methodNames": [
          "tecnicos",
          "crearTecnico",
          "incidencias",
          "incidencia",
          "crearIncidencia",
          "tecnico"
        ],
        "added": [
          {
            "name": "crearTecnico",
            "code": "async crearTecnico(datos: Record<string, unknown>) { const b = datos; return this.tecnicoRepo.save(this.tecnicoRepo.create({ nombre: String(b.nombre) })); }"
          },
          {
            "name": "tecnico",
            "code": "async tecnico(id: number) { return this.tecnicoRepo.createQueryBuilder(\"tecnico\").select(\"tecnico\").where(\"tecnico.id = :id\", { id: id }).getOneOrFail(); }"
          },
          {
            "name": "crearIncidencia",
            "code": "async crearIncidencia(datos: Record<string, unknown>) {\n    const b = datos; const tecnico = b.tecnicoId === undefined || b.tecnicoId === null ? null : await this.tecnico(Number(b.tecnicoId));\n    const i = await this.incidenciaRepo.save(this.incidenciaRepo.create({ titulo: String(b.titulo), tecnico })); return this.incidencia(i.id);\n  }"
          }
        ],
        "routes": [
          "@Post(\"tecnicos\") crearTecnico(@Body() datos: Record<string, unknown>) { return this.aula.crearTecnico(datos); }",
          "@Post(\"incidencias\") crearIncidencia(@Body() datos: Record<string, unknown>) { return this.aula.crearIncidencia(datos); }"
        ]
      },
      {
        "verb": "Patch",
        "methodNames": [
          "tecnicos",
          "crearTecnico",
          "incidencias",
          "incidencia",
          "crearIncidencia",
          "tecnico",
          "editarIncidencia"
        ],
        "added": [
          {
            "name": "editarIncidencia",
            "code": "async editarIncidencia(id: number, datos: Record<string, unknown>) {\n    const b = datos; const i = await this.incidencia(id);\n    if (b.titulo !== undefined) i.titulo = String(b.titulo);\n    if (b.tecnicoId !== undefined) i.tecnico = b.tecnicoId === null ? null : await this.tecnico(Number(b.tecnicoId));\n    await this.incidenciaRepo.save(i); return this.incidencia(id);\n  }"
          }
        ],
        "routes": [
          "@Patch(\"incidencias/:id\") editar(@Param(\"id\", ParseIntPipe) id: number, @Body() datos: Record<string, unknown>) { return this.aula.editarIncidencia(id, datos); }"
        ]
      },
      {
        "verb": "Delete",
        "methodNames": [
          "tecnicos",
          "crearTecnico",
          "borrarTecnico",
          "tecnico",
          "incidencias",
          "incidencia",
          "crearIncidencia",
          "editarIncidencia",
          "borrarIncidencia"
        ],
        "added": [
          {
            "name": "borrarTecnico",
            "code": "async borrarTecnico(id: number) { await this.tecnico(id); await this.tecnicoRepo.delete(id); return { eliminado: id, efecto: \"Sus incidencias quedan sin asignar\" }; }"
          },
          {
            "name": "borrarIncidencia",
            "code": "async borrarIncidencia(id: number) { await this.incidencia(id); await this.incidenciaRepo.delete(id); return { eliminado: id }; }"
          }
        ],
        "routes": [
          "@Delete(\"tecnicos/:id\") borrarTecnico(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.borrarTecnico(id); }",
          "@Delete(\"incidencias/:id\") borrar(@Param(\"id\", ParseIntPipe) id: number) { return this.aula.borrarIncidencia(id); }"
        ]
      }
    ],
    "readScreen": "import React, { useState } from \"react\";\nimport { ScrollView, Text, TextInput, Pressable, StyleSheet } from \"react-native\";\nexport default function App() {\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [ruta, setRuta] = useState(\"/incidencias\");\n  const [datos, setDatos] = useState<unknown>([]);\n  const [error, setError] = useState(\"\");\n  const [cargando, setCargando] = useState(false);\n  async function consultar() {\n    setError(\"\"); setCargando(true);\n    try {\n      const response = await fetch(api.replace(/\\/$/, \"\") + ruta);\n      const data = await response.json();\n      if (!response.ok) throw new Error(data.message || \"Error HTTP \" + response.status);\n      setDatos(data);\n    } catch (e) { setError(String(e)); }\n    finally { setCargando(false); }\n  }\n  return <ScrollView contentContainerStyle={s.page}>\n    <Text style={s.title}>Incidencias · relación opcional · lectura</Text>\n    <Text>URL de la API: localhost en web; IP del ordenador en Expo Go.</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <Text>Ruta de consulta</Text>\n    <TextInput accessibilityLabel=\"Ruta de consulta\" style={s.input} value={ruta} onChangeText={setRuta} autoCapitalize=\"none\" />\n    <Pressable accessibilityRole=\"button\" style={s.button} disabled={cargando} onPress={() => void consultar()}>\n      <Text style={s.white}>{cargando ? \"Consultando…\" : \"Consultar\"}</Text>\n    </Pressable>\n    {!!error && <Text style={s.error}>{error}</Text>}\n    <Text selectable style={s.json}>{JSON.stringify(datos, null, 2)}</Text>\n  </ScrollView>;\n}\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 25, fontWeight: \"700\" }, input: { borderWidth: 1, borderColor: \"#91ac88\", padding: 12, borderRadius: 7, backgroundColor: \"white\" }, button: { padding: 14, backgroundColor: \"#225541\", borderRadius: 7 }, white: { color: \"white\" }, error: { color: \"#a22424\" }, json: { fontFamily: \"monospace\", fontSize: 12 } });\n",
    "frontendBlocks": [
      "import React, { useEffect, useState } from \"react\";\nimport { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from \"react-native\";\n// En web del propio ordenador, localhost sirve. En el móvil, escribe la IP LAN del ordenador.\nconst TITLE = \"Incidencias · relación opcional\";\nconst FORMS: { title: string; method: string; route: string; fields: [string, string, string][] }[] = [{\"title\": \"Crear técnico\", \"method\": \"POST\", \"route\": \"/tecnicos\", \"fields\": [[\"nombre\", \"Nombre\", \"text\"]]}, {\"title\": \"Crear incidencia\", \"method\": \"POST\", \"route\": \"/incidencias\", \"fields\": [[\"titulo\", \"Título\", \"text\"], [\"tecnicoId\", \"ID de técnico; vacío = sin asignar\", \"nullableNumber\"]]}, {\"title\": \"Editar o reasignar\", \"method\": \"PATCH\", \"route\": \"/incidencias/:id\", \"fields\": [[\"id\", \"ID de incidencia\", \"path\"], [\"titulo\", \"Nuevo título (opcional)\", \"optionalText\"], [\"tecnicoId\", \"ID; null = quitar; vacío = no cambiar\", \"optionalNullableNumber\"]]}, {\"title\": \"Eliminar técnico\", \"method\": \"DELETE\", \"route\": \"/tecnicos/:id\", \"fields\": [[\"id\", \"ID de técnico\", \"path\"]]}, {\"title\": \"Eliminar incidencia\", \"method\": \"DELETE\", \"route\": \"/incidencias/:id\", \"fields\": [[\"id\", \"ID de incidencia\", \"path\"]]}];\nconst LISTS: [string, string][] = [[\"Técnicos\", \"/tecnicos\"], [\"Incidencias con técnico\", \"/incidencias\"], [\"Sin asignar\", \"/incidencias?sinAsignar=true\"]];\nexport default function App() {",
      "\n  const [api, setApi] = useState(\"http://localhost:3000\");\n  const [view, setView] = useState<\"datos\" | \"acciones\">(\"datos\");\n  const [form, setForm] = useState(0);\n  const [values, setValues] = useState<Record<string, string>>({});\n  const [paths, setPaths] = useState<string[]>(LISTS.map(x => x[1]));\n  const [data, setData] = useState<unknown[]>([]);\n  const [errors, setErrors] = useState<string[]>([]);\n  const [message, setMessage] = useState(\"\");\n  const [busy, setBusy] = useState(false);",
      "\n  async function request(path: string, method = \"GET\", payload?: Record<string, unknown>) {\n    const base = api.trim().replace(/\\/$/, \"\");\n    if (!/^https?:\\/\\//.test(base)) throw new Error(\"API: escribe http://IP:3000\");\n    if (!path.startsWith(\"/\")) throw new Error(\"La ruta debe empezar por /\");\n    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);\n    try {\n      const response = await fetch(base + path, { method, signal: controller.signal,\n        headers: payload === undefined ? undefined : { \"Content-Type\": \"application/json\" },\n        body: payload === undefined ? undefined : JSON.stringify(payload) });\n      const raw = await response.text(); let result: any;\n      try { result = raw ? JSON.parse(raw) : null; } catch { throw new Error(\"La API no ha devuelto JSON\"); }\n      if (!response.ok) throw new Error(`${response.status}: ${result?.message || raw}`);\n      return result;\n    } finally { clearTimeout(timeout); }\n  }\n  async function load() {\n    const next: unknown[] = []; const failures: string[] = [];\n    for (let i = 0; i < paths.length; i++) {\n      try { next[i] = await request(paths[i]); failures[i] = \"\"; }\n      catch (e) { next[i] = null; failures[i] = String(e); }\n    }\n    setData(next); setErrors(failures);\n  }\n  useEffect(() => { void load(); }, []);\n  async function refresh() { setBusy(true); setMessage(\"\"); try { await load(); } finally { setBusy(false); } }",
      "\n  async function send() {\n    setBusy(true); setMessage(\"\");\n    try {\n      const action = FORMS[form]; let route = action.route; const payload: Record<string, unknown> = {};\n      for (const [name, label, kind] of action.fields) {\n        const value = (values[name] || \"\").trim();\n        if (kind.startsWith(\"optional\") && value === \"\") continue;\n        if (kind === \"path\" || kind === \"number\" || kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") {\n          if ((kind === \"nullableNumber\" && value === \"\") || ((kind === \"nullableNumber\" || kind === \"optionalNullableNumber\") && value === \"null\")) { payload[name] = null; continue; }\n          const n = Number(value);\n          if (!value || !Number.isSafeInteger(n) || n <= 0) throw new Error(label + \": escribe un ID entero positivo\");\n          if (kind === \"path\") route = route.replace(\":\" + name, encodeURIComponent(String(n)));\n          else payload[name] = n;\n        } else if (kind === \"optionalBoolean\") {\n          if (value !== \"true\" && value !== \"false\") throw new Error(label + \": escribe true o false\");\n          payload[name] = value === \"true\";\n        } else {\n          if (!value) throw new Error(label + \": campo obligatorio\");\n          payload[name] = value;\n        }\n      }\n      const result = await request(route, action.method, action.method === \"DELETE\" ? undefined : payload);\n      setMessage(\"Operación correcta: \" + JSON.stringify(result));\n      await load(); // Resincroniza las listas tras POST, PATCH o DELETE.\n    } catch (e) { setMessage(\"Error: \" + String(e)); }\n    finally { setBusy(false); }\n  }",
      "\n  return <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps=\"handled\">\n    <Text style={s.title}>{TITLE}</Text><Text>PostgreSQL local · NestJS · TypeORM · React Native</Text>\n    <Text style={s.label}>URL de la API (editable para web o móvil)</Text>\n    <TextInput accessibilityLabel=\"URL de la API\" style={s.input} value={api} onChangeText={setApi} autoCapitalize=\"none\" />\n    <View style={s.row}>{([\"datos\", \"acciones\"] as const).map(v => <Pressable accessibilityRole=\"button\" key={v} style={[s.button, view === v && s.active]} onPress={() => setView(v)}><Text style={s.buttonText}>{v === \"datos\" ? \"1 · Datos y filtros\" : \"2 · Crear y modificar\"}</Text></Pressable>)}</View>\n    {view === \"datos\" ? <>\n      <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void refresh()}><Text style={s.buttonText}>{busy ? \"Consultando…\" : \"Consultar / aplicar filtros\"}</Text></Pressable>\n      {LISTS.map(([label], i) => <View style={s.card} key={label}>\n        <Text style={s.heading}>{label}</Text><Text>Ruta y filtros editables: utiliza los IDs que devuelve tu API.</Text>\n        <TextInput accessibilityLabel={\"Ruta \" + label} style={s.input} value={paths[i]} onChangeText={v => setPaths(paths.map((p, j) => j === i ? v : p))} autoCapitalize=\"none\" />\n        {errors[i] ? <Text style={s.error}>{errors[i]}</Text> : <Text selectable style={s.json}>{JSON.stringify(data[i] ?? [], null, 2)}</Text>}\n      </View>)}\n    </> : <>\n      <View style={s.row}>{FORMS.map((a, i) => <Pressable accessibilityRole=\"button\" key={a.title} disabled={busy} style={[s.button, i === form && s.active]} onPress={() => { setForm(i); setValues({}); setMessage(\"\"); }}><Text style={s.buttonText}>{a.title}</Text></Pressable>)}</View>\n      <View style={s.card}><Text style={s.heading}>{FORMS[form].method} {FORMS[form].route}</Text>\n        {FORMS[form].fields.map(([name, label]) => <View key={name}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} style={s.input} value={values[name] || \"\"} onChangeText={v => setValues({ ...values, [name]: v })} autoCapitalize=\"none\" /></View>)}\n        <Text>En campos opcionales: vacío conserva el valor. Si admite relación opcional, escribe null para quitar la asociación. Revisa el ID antes de eliminar.</Text>\n        <Pressable accessibilityRole=\"button\" style={s.button} disabled={busy} onPress={() => void send()}><Text style={s.buttonText}>{busy ? \"Enviando…\" : \"Ejecutar operación\"}</Text></Pressable>\n        {!!message && <Text selectable style={message.startsWith(\"Error\") ? s.error : s.json}>{message}</Text>}\n      </View>\n    </>}\n  </ScrollView>;\n}",
      "\nconst s = StyleSheet.create({ page: { padding: 24, paddingTop: 55, gap: 14, backgroundColor: \"#f4f6ee\", flexGrow: 1 }, title: { fontSize: 28, fontWeight: \"700\", color: \"#183c35\" }, label: { marginTop: 8, fontWeight: \"600\" }, row: { flexDirection: \"row\", flexWrap: \"wrap\", gap: 8 }, button: { backgroundColor: \"#315b4c\", padding: 13, borderRadius: 8, marginVertical: 5 }, active: { backgroundColor: \"#14705c\" }, buttonText: { color: \"white\", fontWeight: \"600\" }, input: { borderWidth: 1, borderColor: \"#aabea7\", borderRadius: 7, padding: 12, marginVertical: 8, backgroundColor: \"white\" }, card: { backgroundColor: \"white\", padding: 18, borderRadius: 10, gap: 8 }, heading: { fontSize: 18, fontWeight: \"700\" }, json: { fontFamily: \"monospace\", fontSize: 12, color: \"#234a3a\", marginVertical: 8 }, error: { color: \"#a22424\", marginVertical: 8 } });\n"
    ],
    "collection": "/incidencias",
    "schema": [
      [
        "tecnicos",
        "id PK · nombre"
      ],
      [
        "incidencias",
        "id PK · titulo · tecnico_id FK opcional · SET NULL"
      ]
    ],
    "bash": "api=\"http://localhost:3000\"\nid_json() { node -e 'let s=\"\"; process.stdin.on(\"data\",c=>s+=c); process.stdin.on(\"end\",()=>{const id=JSON.parse(s).id;if(!Number.isInteger(id))process.exit(1);console.log(id)});'; }\ntecnico=$(curl -fsS -X POST \"$api/tecnicos\" -H \"Content-Type: application/json\" -d '{\"nombre\":\"Alex\"}')\ntecnico_id=$(printf '%s' \"$tecnico\" | id_json)\nprintf '%s\\n' \"$tecnico\"\nincidencia=$(curl -fsS -X POST \"$api/incidencias\" -H \"Content-Type: application/json\" -d \"{\\\"titulo\\\":\\\"Revisar API\\\",\\\"tecnicoId\\\":${tecnico_id}}\")\nincidencia_id=$(printf '%s' \"$incidencia\" | id_json)\nprintf '%s\\n' \"$incidencia\"\ncurl -fsS -X DELETE \"$api/tecnicos/${tecnico_id}\"\ncurl -fsS \"$api/incidencias/${incidencia_id}\"\ncurl -fsS \"$api/incidencias?sinAsignar=true\"",
    "querySql": "-- tecnicos(): lista de técnicos.\nSELECT tecnico.* FROM tecnicos AS tecnico ORDER BY tecnico.id ASC;\n\n-- incidencias(): todas, tengan o no técnico.\nSELECT incidencia.*, tecnico.*\nFROM incidencias AS incidencia\nLEFT JOIN tecnicos AS tecnico ON tecnico.id = incidencia.tecnico_id\nORDER BY incidencia.id ASC;\n\n-- incidencias(\"true\"): solo las que no tienen técnico.\nSELECT incidencia.*, tecnico.*\nFROM incidencias AS incidencia\nLEFT JOIN tecnicos AS tecnico ON tecnico.id = incidencia.tecnico_id\nWHERE incidencia.tecnico_id IS NULL\nORDER BY incidencia.id ASC;\n\n-- incidencia(id): ejemplo con la incidencia 1.\nSELECT incidencia.*, tecnico.*\nFROM incidencias AS incidencia\nLEFT JOIN tecnicos AS tecnico ON tecnico.id = incidencia.tecnico_id\nWHERE incidencia.id = 1;"
  }
];
