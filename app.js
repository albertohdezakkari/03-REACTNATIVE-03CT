const pages=["home",...EXERCISES.map(e=>"e"+e.id),"review"];
let current=location.hash.slice(1)||"home";
if(!pages.includes(current)) current="home";
let state=JSON.parse(localStorage.getItem("c02-databridge-state")||'{"done":[]}');
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]));
function save(){localStorage.setItem("c02-databridge-state",JSON.stringify(state))}
function go(page){current=page;location.hash=page;render();scrollTo(0,0);$("#sidebar").classList.remove("open")}
function renderNav(){
 let html='<button class="side-link '+(current==="home"?"active":"")+'" data-page="home">00 · Inicio</button>';
 EXERCISES.forEach(e=>html+='<button class="side-link '+(current==="e"+e.id?"active ":"")+(state.done.includes("e"+e.id)?"done":"")+'" data-page="e'+e.id+'">'+String(e.id).padStart(2,"0")+' · '+e.title+'</button>');
 html+='<button class="side-link '+(current==="review"?"active ":"")+(state.done.includes("review")?"done":"")+'" data-page="review">✓ Repaso final</button>';
 $("#sideNav").innerHTML=html;
 document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>go(b.dataset.page));
 const completed=state.done.filter(x=>x!=="home").length;
 const pct=Math.round(completed/11*100);
 $("#progressText").textContent=pct+"%";
 $("#progressBar").style.width=pct+"%";
}
function home(){
 return '<section class="hero"><div class="eyebrow">CUADERNO 02 DE 10</div><h1>DataBridge</h1><h2>Del móvil a PostgreSQL</h2><p>Construye aplicaciones Full Stack en las que React Native se comunica con una API REST de NestJS y los datos se almacenan realmente en PostgreSQL mediante TypeORM.</p><div class="chips"><span class="chip">10 ejercicios</span><span class="chip">React Native + Expo</span><span class="chip">NestJS</span><span class="chip">TypeORM</span><span class="chip">PostgreSQL local</span><span class="chip">GitHub</span></div></section>'+
 '<div class="grid2"><div class="card"><h3>Qué aprenderás</h3><p>Persistencia real, Entity, Repository, CRUD, DTO, relaciones y filtros. El objetivo es comprender el recorrido completo del dato.</p></div><div class="card"><h3>Cómo trabajarás</h3><p>Siempre backend primero: preparar → construir → probar → crear Expo → conectar → modificar → comprobar → GitHub.</p></div></div>'+
 '<div class="section-head"><small>MAPA CONCEPTUAL</small><h2>El recorrido del dato</h2></div><div class="card flow"><span>📱 React Native</span><b>→</b><span>HTTP / JSON</span><b>→</b><span>Controller</span><b>→</b><span>Service</span><b>→</b><span>Repository</span><b>→</b><span>TypeORM</span><b>→</b><span>🐘 PostgreSQL</span></div>'+
 '<div class="section-head"><small>00 · PREPARACIÓN DESDE CERO</small><h2>Prepara un Windows 10 limpio</h2></div>'+
 '<div class="card concept"><h3>No damos ninguna herramienta por instalada</h3><p>Antes de programar, prepara y verifica Git + Git Bash, Node.js LTS, VS Code, Nest CLI, PostgreSQL y Expo Go. Si un comando no responde, no avances: resuelve primero la instalación o el PATH.</p></div>'+
 '<div class="grid2"><div class="card"><h3>1 · Instala las herramientas</h3><p><a href="https://git-scm.com/download/win" target="_blank" rel="noopener">Git para Windows</a> · <a href="https://nodejs.org/en/download" target="_blank" rel="noopener">Node.js LTS</a> · <a href="https://code.visualstudio.com/Download" target="_blank" rel="noopener">Visual Studio Code</a> · <a href="https://www.postgresql.org/download/windows/" target="_blank" rel="noopener">PostgreSQL</a> · <a href="https://expo.dev/go" target="_blank" rel="noopener">Expo Go</a>.</p><p>Durante PostgreSQL utiliza <code>postgres</code> como contraseña de aula para que las soluciones funcionen sin cambios. Es una credencial local de laboratorio, no una práctica de producción.</p></div><div class="card"><h3>2 · Comprueba desde Git Bash</h3><div class="terminal">git --version\nnode --version\nnpm --version\ncode --version\npsql --version\nnpm install -g @nestjs/cli\nnest --version</div></div></div>'+
 '<div class="card"><h3>3 · Comprueba PostgreSQL antes de NestJS</h3><div class="terminal">psql -U postgres\n\n# Dentro de psql:\nSELECT version();\n\\q</div><p><b>Si <code>psql</code> no se reconoce:</b> cierra y abre Git Bash tras instalar PostgreSQL. Si sigue sin funcionar, añade la carpeta <code>bin</code> de PostgreSQL al PATH de Windows.</p></div>'+
 '<div class="grid2"><div class="card"><h3>Diagnóstico rápido</h3><p><code>command not found</code> → instalación/PATH.<br><code>password authentication failed</code> → contraseña PostgreSQL.<br><code>ECONNREFUSED</code> → servidor/host/puerto.<br><code>database does not exist</code> → crea la BD del ejercicio.</p></div><div class="card"><h3>Repositorio del alumno</h3><div class="tree">C02-DATABRIDGE-TYPEORM-POSTGRESQL/\n├── EJERCICIO-01/\n│   ├── backend/\n│   ├── frontend/\n│   └── README.md\n├── ...\n└── EJERCICIO-10/</div></div></div>'+
 '<div class="section-head"><small>PROGRESIÓN</small><h2>Los 10 ejercicios</h2></div><div class="exercise-list">'+EXERCISES.map(e=>'<div class="exercise-tile" data-page="e'+e.id+'"><b>'+String(e.id).padStart(2,"0")+' · '+e.icon+' '+e.title+'</b><small>'+e.focus+' · '+e.concept+'</small></div>').join("")+'</div>';
}
function codeFiles(e){
 const map={
  1:[
   ["app.module.ts","backend/src/app.module.ts","Configura la aplicación raíz y PostgreSQL.","code/e01/app.module.ts.txt"],
   ["videojuego.entity.ts","backend/src/videojuegos/videojuego.entity.ts","Describe cómo se guarda un videojuego.","code/e01/base/videojuego.entity.ts.txt"],
   ["videojuegos.module.ts","backend/src/videojuegos/videojuegos.module.ts","Agrupa el dominio y habilita Repository.","code/e01/videojuegos.module.ts.txt"],
   ["videojuegos.service.ts","backend/src/videojuegos/videojuegos.service.ts","Trabaja con Repository<Videojuego>.","code/e01/base/videojuegos.service.ts.txt"],
   ["videojuegos.controller.ts","backend/src/videojuegos/videojuegos.controller.ts","Expone GET /videojuegos.","code/e01/videojuegos.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Consume la API y representa la colección.","code/e01/base/App.tsx.txt"]
  ],
  2:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e02.","code/e02/app.module.ts.txt"],
   ["pelicula.entity.ts","backend/src/peliculas/pelicula.entity.ts","Define la película persistente.","code/e02/base/pelicula.entity.ts.txt"],
   ["peliculas.module.ts","backend/src/peliculas/peliculas.module.ts","Registra Entity, Controller y Service.","code/e02/peliculas.module.ts.txt"],
   ["peliculas.service.ts","backend/src/peliculas/peliculas.service.ts","Recupera la colección con find().","code/e02/base/peliculas.service.ts.txt"],
   ["peliculas.controller.ts","backend/src/peliculas/peliculas.controller.ts","Expone GET /peliculas.","code/e02/peliculas.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Muestra la cartelera recibida.","code/e02/base/App.tsx.txt"]
  ],
  3:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e03.","code/e03/app.module.ts.txt"],
   ["mascota.entity.ts","backend/src/mascotas/mascota.entity.ts","Define la mascota persistente.","code/e03/base/mascota.entity.ts.txt"],
   ["mascotas.module.ts","backend/src/mascotas/mascotas.module.ts","Registra el dominio mascotas.","code/e03/mascotas.module.ts.txt"],
   ["mascotas.service.ts","backend/src/mascotas/mascotas.service.ts","Busca un registro con findOneBy().","code/e03/base/mascotas.service.ts.txt"],
   ["mascotas.controller.ts","backend/src/mascotas/mascotas.controller.ts","Lee el Path Param :id.","code/e03/mascotas.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Muestra la ficha de una mascota.","code/e03/base/App.tsx.txt"]
  ],
  4:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e04.","code/e04/app.module.ts.txt"],
   ["restaurante.entity.ts","backend/src/restaurantes/restaurante.entity.ts","Define la Entity persistente.","code/e04/base/restaurante.entity.ts.txt"],
   ["create-restaurante.dto.ts","backend/src/restaurantes/create-restaurante.dto.ts","Describe el Body de creación.","code/e04/base/create-restaurante.dto.ts.txt"],
   ["restaurantes.module.ts","backend/src/restaurantes/restaurantes.module.ts","Registra el dominio restaurantes.","code/e04/restaurantes.module.ts.txt"],
   ["restaurantes.service.ts","backend/src/restaurantes/restaurantes.service.ts","Crea y guarda mediante Repository.","code/e04/restaurantes.service.ts.txt"],
   ["restaurantes.controller.ts","backend/src/restaurantes/restaurantes.controller.ts","Recibe POST y @Body().","code/e04/restaurantes.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Formulario que envía POST.","code/e04/base/App.tsx.txt"]
  ],
  5:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e05.","code/e05/app.module.ts.txt"],
   ["viaje.entity.ts","backend/src/viajes/viaje.entity.ts","Define la Entity Viaje.","code/e05/viaje.entity.ts.txt"],
   ["update-viaje.dto.ts","backend/src/viajes/update-viaje.dto.ts","Define campos opcionales de PATCH.","code/e05/base/update-viaje.dto.ts.txt"],
   ["viajes.module.ts","backend/src/viajes/viajes.module.ts","Registra el dominio viajes.","code/e05/viajes.module.ts.txt"],
   ["viajes.service.ts","backend/src/viajes/viajes.service.ts","Busca, mezcla cambios y guarda.","code/e05/viajes.service.ts.txt"],
   ["viajes.controller.ts","backend/src/viajes/viajes.controller.ts","Expone PATCH /viajes/:id.","code/e05/viajes.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Edita estado y fecha.","code/e05/base/App.tsx.txt"]
  ],
  6:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e06.","code/e06/app.module.ts.txt"],
   ["libro.entity.ts","backend/src/libros/libro.entity.ts","Define Libro.","code/e06/base/libro.entity.ts.txt"],
   ["libros.module.ts","backend/src/libros/libros.module.ts","Registra el dominio libros.","code/e06/libros.module.ts.txt"],
   ["libros.service.ts","backend/src/libros/libros.service.ts","Lee, elimina y marca como leído.","code/e06/base/libros.service.ts.txt"],
   ["libros.controller.ts","backend/src/libros/libros.controller.ts","Expone GET, DELETE y PATCH.","code/e06/base/libros.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Confirma DELETE y sincroniza estado.","code/e06/base/App.tsx.txt"]
  ],
  7:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e07.","code/e07/app.module.ts.txt"],
   ["sneaker.entity.ts","backend/src/sneakers/sneaker.entity.ts","Define Sneaker y stock.","code/e07/base/sneaker.entity.ts.txt"],
   ["create-sneaker.dto.ts","backend/src/sneakers/create-sneaker.dto.ts","Datos de creación.","code/e07/base/create-sneaker.dto.ts.txt"],
   ["update-sneaker.dto.ts","backend/src/sneakers/update-sneaker.dto.ts","Datos parciales de edición.","code/e07/base/update-sneaker.dto.ts.txt"],
   ["sneakers.module.ts","backend/src/sneakers/sneakers.module.ts","Registra el dominio.","code/e07/sneakers.module.ts.txt"],
   ["sneakers.service.ts","backend/src/sneakers/sneakers.service.ts","Implementa CRUD con Repository.","code/e07/sneakers.service.ts.txt"],
   ["sneakers.controller.ts","backend/src/sneakers/sneakers.controller.ts","Expone CRUD REST.","code/e07/sneakers.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Integra operaciones CRUD.","code/e07/base/App.tsx.txt"]
  ],
  8:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e08.","code/e08/app.module.ts.txt"],
   ["playlist.entity.ts","backend/src/playlists/playlist.entity.ts","Lado OneToMany.","code/e08/playlist.entity.ts.txt"],
   ["cancion.entity.ts","backend/src/playlists/cancion.entity.ts","Lado ManyToOne y clave foránea.","code/e08/cancion.entity.ts.txt"],   ["playlists.module.ts","backend/src/playlists/playlists.module.ts","Registra ambas Entities.","code/e08/playlists.module.ts.txt"],
   ["playlists.service.ts","backend/src/playlists/playlists.service.ts","Carga relaciones y añade canciones.","code/e08/base/playlists.service.ts.txt"],
   ["playlists.controller.ts","backend/src/playlists/playlists.controller.ts","Expone detalle y alta de canción.","code/e08/base/playlists.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Muestra playlist y canciones.","code/e08/base/App.tsx.txt"]
  ],
  9:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e09.","code/e09/app.module.ts.txt"],
   ["evento.entity.ts","backend/src/eventos/evento.entity.ts","Define Evento.","code/e09/evento.entity.ts.txt"],
   ["eventos.module.ts","backend/src/eventos/eventos.module.ts","Registra el dominio eventos.","code/e09/eventos.module.ts.txt"],
   ["eventos.service.ts","backend/src/eventos/eventos.service.ts","Construye filtros where.","code/e09/base/eventos.service.ts.txt"],
   ["eventos.controller.ts","backend/src/eventos/eventos.controller.ts","Lee @Query ciudad/categoria.","code/e09/base/eventos.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Solicita una consulta filtrada.","code/e09/base/App.tsx.txt"]
  ],
  10:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e10.","code/e10/app.module.ts.txt"],
   ["destino.entity.ts","backend/src/destinos/destino.entity.ts","Define Destino.","code/e10/base/destino.entity.ts.txt"],
   ["create-destino.dto.ts","backend/src/destinos/create-destino.dto.ts","Datos de creación.","code/e10/base/create-destino.dto.ts.txt"],
   ["update-destino.dto.ts","backend/src/destinos/update-destino.dto.ts","Datos parciales de edición.","code/e10/base/update-destino.dto.ts.txt"],
   ["destinos.module.ts","backend/src/destinos/destinos.module.ts","Registra el dominio.","code/e10/destinos.module.ts.txt"],
   ["destinos.service.ts","backend/src/destinos/destinos.service.ts","CRUD completo con Repository.","code/e10/destinos.service.ts.txt"],
   ["destinos.controller.ts","backend/src/destinos/destinos.controller.ts","CRUD REST completo.","code/e10/destinos.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Referencia móvil del challenge.","code/e10/base/App.tsx.txt"]
  ]
 };
 const files=[["main.ts","backend/src/main.ts","Arranca NestJS, habilita CORS y escucha en la red.","code/common/main.ts.txt"],...(map[e.id]||[])];
 return files.map(([name,path,role,source])=>({name,path,role,source}));
}
function conceptGuide(e){
 const guides={
  1:"<p><b>Persistencia:</b> los datos sobreviven al reinicio. <b>Entity:</b> describe cómo un objeto se representa en una tabla. <b>Repository:</b> ofrece operaciones para consultar y guardar esa Entity sin escribir SQL en Controller. <b>find():</b> recupera una colección. <b>OnModuleInit:</b> lo usamos solo para insertar tres datos de ejemplo al arrancar si la tabla está vacía; todavía no estamos aprendiendo POST. Primero construiremos una versión base sin <code>genero</code>; después el reto hará viajar ese nuevo campo por todas las capas.</p>",
  2:"<p><b>RECUPERAMOS:</b> Entity, Repository y persistencia del ejercicio anterior. <b>CONCEPTO NUEVO:</b> <code>repository.find()</code> recupera una colección de entidades. El objeto <code>order</code> permite pedir a TypeORM que devuelva la colección ordenada. Primero construiremos CineBox sin <code>favorita</code>; después el reto añadirá ese dato persistente desde PostgreSQL hasta la interfaz.</p>",
  3:"<p><b>RECUPERAMOS:</b> GET, Controller, Repository y persistencia. <b>Path Param:</b> el identificador forma parte de la URL, por ejemplo <code>/mascotas/1</code>. <b>@Param</b> lo recupera, <b>ParseIntPipe</b> valida y convierte a número, y <b>findOneBy({ id })</b> busca una única Entity. Si no existe, devolvemos 404 con <code>NotFoundException</code>. La solución base no incluye <code>nivelEnergia</code>; ese será el reto.</p>",
  4:"<p><b>RECUPERAMOS:</b> lectura de datos persistentes. <b>POST</b> crea un recurso. <b>@Body()</b> recupera el JSON enviado; el <b>DTO</b> describe la forma de entrada; <b>repository.create()</b> construye una Entity en memoria y <b>repository.save()</b> la persiste. La base no incluye <code>precioMedio</code>; el reto hará viajar ese dato desde el formulario hasta PostgreSQL.</p>",
  5:"<p><b>RECUPERAMOS:</b> POST y DTO. <b>PATCH</b> modifica solo parte de un recurso existente. Por eso las propiedades del DTO son opcionales. <b>repository.merge()</b> aplica los cambios al objeto cargado y <b>save()</b> persiste el resultado. La base modifica solo <code>estado</code>; el reto añadirá también <code>fecha</code>.</p>",
  6:"<p><b>DELETE</b> elimina un recurso persistente. El punto clave Full Stack es que PostgreSQL y el estado de React Native son memorias distintas: después de borrar en la base, la interfaz debe sincronizarse. La solución base solo elimina; el reto incorporará <b>Marcar como leído</b> mediante PATCH.</p>",
  7:"<p><b>CRUD</b> integra Create, Read, Update y Delete usando POST, GET, PATCH y DELETE. Ya conoces las piezas por separado; ahora debes coordinarlas y resincronizar la interfaz tras cada cambio. La solución base no tiene <code>stock</code>; el reto añadirá ese dato y el estado AGOTADO.</p>",
  8:"<p><b>OneToMany:</b> una Playlist puede relacionarse con muchas Canciones. <b>ManyToOne:</b> cada Canción pertenece a una Playlist; ese lado mantiene la clave foránea. Primero aprenderás a <b>leer la relación</b> con <code>relations</code>. El reto será crear una canción y asociarla a una playlist concreta.</p>",
  9:"<p><b>Query Params</b> expresan filtros opcionales después de <code>?</code>. Controller los recibe con <code>@Query</code> y Service construye un <code>where</code> para TypeORM. La base filtra solo por <code>ciudad</code>; el reto combinará <code>ciudad + categoria</code>.</p>",
  10:"<p><b>Transferencia:</b> ya conoces las piezas. Ahora debes decidir cómo combinarlas para construir un CRUD persistente completo con mayor autonomía.</p>"
 };
 return guides[e.id]||"";
}
function testGuide(e){
 const examples={
  1:"curl -i http://localhost:3000/videojuegos",
  2:"curl -i http://localhost:3000/peliculas",
  3:"curl -i http://localhost:3000/mascotas/1\n\n# Comprueba también el 404:\ncurl -i http://localhost:3000/mascotas/999",
  4:"curl -i -X POST http://localhost:3000/restaurantes \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"nombre\":\"La Trattoria\",\"tipo\":\"Italiano\",\"ciudad\":\"Zaragoza\",\"puntuacion\":9}'",
  5:"curl -i -X PATCH http://localhost:3000/viajes/1 \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"estado\":\"REALIZADO\"}'\n\n# Comprueba también un id inexistente:\ncurl -i -X PATCH http://localhost:3000/viajes/999 -H \"Content-Type: application/json\" -d '{\"estado\":\"REALIZADO\"}'",
  6:"curl -i http://localhost:3000/libros\ncurl -i -X DELETE http://localhost:3000/libros/1\ncurl -i http://localhost:3000/libros",
  7:"curl -i -X POST http://localhost:3000/sneakers -H \"Content-Type: application/json\" -d '{\"marca\":\"Nike\",\"modelo\":\"Air Max 1\",\"precio\":149.99,\"talla\":42}'\ncurl -i http://localhost:3000/sneakers\ncurl -i http://localhost:3000/sneakers/1\ncurl -i -X PATCH http://localhost:3000/sneakers/1 -H \"Content-Type: application/json\" -d '{\"precio\":139.99}'\ncurl -i -X DELETE http://localhost:3000/sneakers/1",
  8:"curl -i http://localhost:3000/playlists/1\n\n# La respuesta debe incluir canciones[].",
  9:"curl -i \"http://localhost:3000/eventos?ciudad=Zaragoza\"",
  10:"curl -i -X POST http://localhost:3000/destinos -H \"Content-Type: application/json\" -d '{\"ciudad\":\"Reikiavik\",\"pais\":\"Islandia\",\"descripcion\":\"Auroras\"}'\ncurl -i http://localhost:3000/destinos\ncurl -i http://localhost:3000/destinos/1\ncurl -i -X PATCH http://localhost:3000/destinos/1 -H \"Content-Type: application/json\" -d '{\"descripcion\":\"Auroras y termas\"}'\ncurl -i -X DELETE http://localhost:3000/destinos/1"
 };
 return examples[e.id]||e.route;
}

function understandGuide(e){
 const rows={
  1:[["@Entity","Convierte la clase en una Entity conocida por TypeORM."],["@InjectRepository","Entrega al Service el Repository de Videojuego."],["repository.find()","Lee los videojuegos persistidos."],["fetch()","Solicita GET /videojuegos desde React Native."]],
  2:[["repository.find()","Recupera una colección completa."],["order","Pide a TypeORM que ordene el resultado."],["FlatList","Representa el array recibido sin conocer su tamaño de antemano."]],
  3:[["@Get(':id')","Declara una ruta con un segmento variable."],["@Param('id')","Extrae el id de la URL."],["ParseIntPipe","Convierte y valida el id como número."],["findOneBy({ id })","Busca una entidad concreta."]],
  4:[["@Body()","Obtiene el JSON enviado por React Native."],["CreateRestauranteDto","Describe la forma de los datos de entrada."],["repository.create(dto)","Construye una Entity en memoria."],["repository.save(...)","Persiste esa Entity en PostgreSQL."],["JSON.stringify","Convierte el objeto del formulario en JSON para el POST."]],
  5:[["@Patch(':id')","Modifica parcialmente un recurso existente."],["propiedad?","El signo ? hace opcional cada campo del DTO."],["repository.merge","Aplica al objeto existente solo los cambios recibidos."],["repository.save","Persiste el resultado actualizado."]],
  6:[["@Delete(':id')","Asocia DELETE con un recurso concreto."],["repository.remove(libro)","Elimina la Entity cargada y permite controlar antes si existe."],["filter(...)","Elimina también el libro del estado local de React."],["Alert.alert","Pide confirmación antes de una acción destructiva."]],
  7:[["POST","Create."],["GET","Read."],["PATCH","Update."],["DELETE","Delete."],["cargar()","Vuelve a sincronizar la UI después de cada operación."]],
  8:[["@OneToMany","Una Playlist referencia muchas Canciones."],["@ManyToOne","Muchas Canciones pueden apuntar a una Playlist."],["relations:{canciones:true}","Pide a TypeORM que cargue también la relación."],["playlistId","Identifica a qué Playlist se asociará la nueva Canción."]],
  9:[["@Query","Lee parámetros opcionales de la URL."],["FindOptionsWhere","Tipa el objeto de condiciones."],["where.ciudad","Añade el filtro solo cuando ciudad existe."],["repository.find({where})","Traduce las condiciones a la consulta de PostgreSQL."]],
  10:[["findAll / findOne","Recuperan colección y detalle."],["create","Crea un nuevo destino."],["update","Modifica parcialmente uno existente."],["remove","Elimina el recurso."],["Tu mejora","Debe reutilizar conscientemente estas piezas, no ser solo estética."]]
 };
 return (rows[e.id]||[]).map(([code,text])=>'<div class="under-row"><code>'+code+'</code><span>'+text+'</span></div>').join("");
}
function checkpointGuide(e){
 const specific={
  1:["La tabla videojuegos existe","GET /videojuegos devuelve registros","React Native muestra la colección"],
  2:["GET /peliculas devuelve un array ordenado","Comprendo qué devuelve find()","favorita llega desde PostgreSQL"],
  3:["GET /mascotas/1 devuelve una sola mascota","Un id inexistente produce 404","La ficha muestra nivelEnergia"],
  4:["POST devuelve el restaurante creado","El registro aparece en PostgreSQL","precioMedio viaja desde formulario hasta tabla"],
  5:["PATCH cambia solo los campos enviados","La fecha persiste tras reiniciar","Un id inexistente se controla"],
  6:["DELETE elimina la fila","La tarjeta desaparece sin reiniciar","Marcar como leído utiliza PATCH"],
  7:["GET/POST/PATCH/DELETE funcionan","stock=0 muestra AGOTADO","La UI se resincroniza tras cada cambio"],
  8:["La Playlist devuelve canciones relacionadas","POST crea una canción asociada","Comprendo dónde vive la clave foránea"],
  9:["El filtro por ciudad funciona","El filtro por categoría funciona","Ambos filtros funcionan combinados"],
  10:["CRUD backend completo","CRUD móvil conectado","La mejora propia modifica comportamiento o datos"]
 };
 return (specific[e.id]||[]).map(x=>"☐ "+x).join("<br>");
}
function quizGuide(e){
 const quizzes={
  1:["¿Por qué utilizamos Repository?","Porque permite al Service trabajar con la Entity sin que Controller acceda directamente a PostgreSQL.","Porque dibuja las tarjetas.","Porque sustituye a NestJS.","Porque React Native necesita SQL."],
  2:["¿Qué devuelve conceptualmente repository.find()?","Una colección de entidades recuperadas de la base de datos.","Una sola entidad obligatoriamente.","Un componente React Native.","El texto de una consulta SQL."],
  3:["¿De dónde obtiene el Controller el id?","Del Path Param :id de la URL.","Del Body de un GET.","De Expo automáticamente.","De la contraseña de PostgreSQL."],
  4:["¿Por qué usamos un DTO en POST?","Para describir los datos que aceptamos en la entrada de la API.","Para crear una tabla automáticamente.","Para sustituir la Entity.","Para diseñar el formulario."],
  5:["¿Qué diferencia hay entre POST y PATCH?","POST crea un recurso; PATCH modifica parte de uno existente.","PATCH crea y POST elimina.","Ambos significan exactamente lo mismo.","POST solo puede leer."],
  6:["¿Por qué actualizamos el estado después de DELETE?","Porque borrar en PostgreSQL no modifica el array que React ya tiene en memoria.","Porque DELETE cierra Expo.","Porque TypeORM modifica FlatList.","No es necesario."],
  7:["¿Qué significa CRUD?","Create, Read, Update, Delete.","Controller, Repository, UI, DTO.","Create, React, URL, Database.","Code, Run, Upload, Deploy."],
  8:["¿Qué expresa OneToMany aquí?","Una Playlist puede tener muchas Canciones.","Una Canción pertenece a muchas bases de datos.","Una Playlist solo puede tener una Canción.","React Native crea muchas APIs."],
  9:["¿Por qué filtrar en la API?","Porque podemos pedir solo los registros necesarios y trasladar el filtro a la consulta.","Porque fetch no admite arrays.","Porque Query Params sustituyen PostgreSQL.","Porque React Native no puede mostrar listas."],
  10:["¿Cuál es el recorrido correcto?","React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.","React Native → PostgreSQL directamente.","Controller → Expo → SQL.","Repository → pantalla sin API."]
 };
 return quizzes[e.id];
}
function exerciseDestinationGuide(e){
 const trees={
  1:"EJERCICIO-01/\n├── backend/\n│   ├── src/\n│   │   ├── main.ts\n│   │   ├── app.module.ts\n│   │   └── videojuegos/\n│   │       ├── videojuego.entity.ts\n│   │       ├── videojuegos.module.ts\n│   │       ├── videojuegos.service.ts\n│   │       └── videojuegos.controller.ts\n│   └── package.json\n├── frontend/\n│   └── App.tsx\n└── README.md",
  2:"EJERCICIO-02/\n├── backend/src/peliculas/\n│   ├── pelicula.entity.ts\n│   ├── peliculas.module.ts\n│   ├── peliculas.service.ts    ← find()\n│   └── peliculas.controller.ts ← GET /peliculas\n├── frontend/App.tsx\n└── README.md",
  3:"EJERCICIO-03/\n├── backend/src/mascotas/\n│   ├── mascota.entity.ts\n│   ├── mascotas.module.ts\n│   ├── mascotas.service.ts     ← findOneBy() + 404\n│   └── mascotas.controller.ts  ← @Param + ParseIntPipe\n├── frontend/App.tsx\n└── README.md",
  4:"EJERCICIO-04/\n├── backend/src/restaurantes/\n│   ├── restaurante.entity.ts\n│   ├── create-restaurante.dto.ts ← Body de entrada\n│   ├── restaurantes.service.ts   ← create() + save()\n│   └── restaurantes.controller.ts← POST + @Body()\n├── frontend/App.tsx              ← formulario\n└── README.md",
  5:"EJERCICIO-05/\n├── backend/src/viajes/\n│   ├── viaje.entity.ts\n│   ├── update-viaje.dto.ts     ← propiedades opcionales\n│   ├── viajes.service.ts       ← merge() + save()\n│   └── viajes.controller.ts    ← PATCH /viajes/:id\n├── frontend/App.tsx\n└── README.md",
  6:"EJERCICIO-06/\n├── backend/src/libros/\n│   ├── libro.entity.ts\n│   ├── libros.service.ts       ← remove()\n│   └── libros.controller.ts    ← DELETE /libros/:id\n├── frontend/App.tsx            ← sincroniza array local\n└── README.md",
  7:"EJERCICIO-07/\n├── backend/src/sneakers/\n│   ├── sneaker.entity.ts\n│   ├── create-sneaker.dto.ts\n│   ├── update-sneaker.dto.ts\n│   ├── sneakers.service.ts     ← CRUD Repository\n│   └── sneakers.controller.ts  ← GET/POST/PATCH/DELETE\n├── frontend/App.tsx\n└── README.md",
  8:"EJERCICIO-08/\n├── backend/src/playlists/\n│   ├── playlist.entity.ts      ← OneToMany\n│   ├── cancion.entity.ts       ← ManyToOne / FK\n│   ├── playlists.service.ts    ← relations\n│   └── playlists.controller.ts ← GET /playlists/:id\n├── frontend/App.tsx\n└── README.md",
  9:"EJERCICIO-09/\n├── backend/src/eventos/\n│   ├── evento.entity.ts\n│   ├── eventos.service.ts      ← where dinámico\n│   └── eventos.controller.ts   ← @Query\n├── frontend/App.tsx\n└── README.md",
  10:"EJERCICIO-10/\n├── backend/src/destinos/\n│   ├── destino.entity.ts\n│   ├── create-destino.dto.ts\n│   ├── update-destino.dto.ts\n│   ├── destinos.service.ts     ← CRUD completo\n│   └── destinos.controller.ts\n├── frontend/App.tsx\n└── README.md"
 };
 return '<div class="section-head"><small>ANTES DE CONSTRUIR · MIRA EL DESTINO</small><h2>Mapa de '+e.title+'</h2></div>'+
 '<div class="card"><p>Compara esta isla con la anterior: reutilizamos la arquitectura y cambiamos únicamente el concepto protagonista. Identifica qué archivos genera el CLI y cuáles debes crear o modificar.</p><div class="tree">'+trees[e.id]+'</div></div>';
}

function codeViewerSection(e,fs){
 return '<section class="dark"><h2>OBSERVA LOS ARCHIVOS COMPLETOS</h2><p>Lee ruta, responsabilidad y código. Mostramos la <b>solución base</b> del ejercicio, todavía sin resolver MODIFÍCALO. La carpeta EJERCICIO-XX del profesor conserva el resultado final.</p><div class="tabs">'+fs.map((f,i)=>'<button class="tab '+(i===0?"active":"")+'" data-tab="'+i+'">'+f.name+'</button>').join("")+'</div><div id="fileViewer"></div></section>';
}

function exerciseExtraGuide(e){
 const table={1:"videojuegos",2:"peliculas",3:"mascotas",4:"restaurantes",5:"viajes",6:"libros",7:"sneakers",8:"playlists",9:"eventos",10:"destinos"}[e.id];
 const sql={
  1:"SELECT * FROM videojuegos;",
  2:"SELECT * FROM peliculas ORDER BY puntuacion DESC;",
  3:"SELECT * FROM mascotas;",
  4:"SELECT * FROM restaurantes;",
  5:"SELECT * FROM viajes;",
  6:"SELECT * FROM libros;",
  7:"SELECT * FROM sneakers ORDER BY id;",
  8:"SELECT * FROM playlists;\nSELECT * FROM canciones;",
  9:"SELECT * FROM eventos ORDER BY fecha;",
  10:"SELECT * FROM destinos ORDER BY id;"
 }[e.id];
 const note={
  1:"Relaciona las tres filas con el JSON de GET /videojuegos.",
  2:"Relaciona las filas ordenadas con el array de GET /peliculas.",
  3:"Comprueba que el id consultado existe y que /mascotas/999 devuelve 404.",
  4:"Después del POST debe aparecer una fila nueva. Repite el SELECT tras reiniciar NestJS.",
  5:"Ejecuta SELECT antes y después del PATCH para observar qué columna cambia.",
  6:"Ejecuta SELECT antes y después de DELETE y comprueba también que la UI elimina la tarjeta.",
  7:"Observa la tabla después de POST, PATCH y DELETE. Cada operación HTTP debe tener un efecto persistente coherente.",
  8:"Observa ambas tablas y localiza la clave foránea de canciones hacia playlists.",
  9:"Compara todas las filas con el resultado filtrado por ciudad.",
  10:"Comprueba el ciclo completo Create → Read → Update → Delete directamente en PostgreSQL."
 }[e.id];
 return '<div class="section-head"><small>COMPRUEBA POSTGRESQL</small><h2>No confíes solo en la pantalla</h2></div>'+
 '<div class="card"><p>'+note+'</p><div class="terminal">psql -U postgres -d '+e.db+'\n\\dt\n'+sql+'\n\\q</div></div>'+
 '<div class="card"><h3>PRUEBA DE PERSISTENCIA</h3><p>Cuando el ejercicio tenga datos persistentes, reinicia NestJS y repite la consulta. Reiniciar el backend no debe borrar ni duplicar datos inesperadamente.</p></div>';
}

function manualFilesGuide(e){
 const files={
  1:["videojuego.entity.ts"],
  2:["pelicula.entity.ts"],
  3:["mascota.entity.ts"],
  4:["restaurante.entity.ts","create-restaurante.dto.ts"],
  5:["viaje.entity.ts","update-viaje.dto.ts"],
  6:["libro.entity.ts"],
  7:["sneaker.entity.ts","create-sneaker.dto.ts","update-sneaker.dto.ts"],
  8:["playlist.entity.ts","cancion.entity.ts","create-cancion.dto.ts"],
  9:["evento.entity.ts"],
  10:["destino.entity.ts","create-destino.dto.ts","update-destino.dto.ts"]
 };
 return (files[e.id]||[]).map(x=>"<code>"+x+"</code>").join(" · ");
}
function exercise(e){
 const fs=codeFiles(e);
 return '<section class="hero"><div class="eyebrow">EJERCICIO '+String(e.id).padStart(2,"0")+' · '+e.focus.toUpperCase()+'</div><h1>'+e.icon+' '+e.title+'</h1><p>'+e.modify+'</p><div class="chips"><span class="chip">'+e.concept+'</span><span class="chip">'+e.route+'</span><span class="chip">'+e.db+'</span></div></section>'+
 '<div class="section-head"><small>FUNDAMENTOS</small><h2>Antes de tocar código</h2></div>'+
 '<div class="card recover"><h3>RECUPERAMOS</h3><p>HTTP, JSON, Controller y Service. Cada ejercicio conecta esos conocimientos con persistencia real.</p></div>'+
 '<div class="card concept"><h3>CONCEPTO NUEVO · '+e.concept+'</h3>'+conceptGuide(e)+'<p><b>Cómo encaja:</b> React Native no accede directamente a PostgreSQL. Controller recibe HTTP, Service coordina y Repository trabaja con las Entities.</p></div>'+
 '<div class="section-head"><small>LEE</small><h2>Qué vas a construir</h2></div><div class="grid2"><div class="card"><b>OBJETIVO</b><p>Construir y comprobar <code>'+e.route+'</code> utilizando datos persistidos en <code>'+e.db+'</code>.</p></div><div class="card"><b>CONCEPTO NUEVO</b><p>'+e.concept+'</p></div></div>'+exerciseDestinationGuide(e)+
 '<div class="section-head"><small>PREPARA LA ISLA</small><h2>Cierra instalación, base de datos y dependencias</h2></div>'+
 '<div class="card"><h3>STOP 1 · herramientas</h3><div class="terminal">node --version\nnpm --version\nnest --version\npsql --version\ngit --version</div><p>No continúes si alguno falla.</p></div>'+
 '<div class="card"><h3>STOP 2 · crea la base de datos de esta isla</h3><div class="terminal">psql -U postgres\nCREATE DATABASE '+e.db+';\n\\l\n\\q</div><p>Debes ver <code>'+e.db+'</code> en la lista antes de arrancar NestJS.</p></div>'+
 '<div class="lab"><div><h3>CONSTRUCCIÓN DESDE CERO</h3><div class="terminal">cd C02-DATABRIDGE-TYPEORM-POSTGRESQL/EJERCICIO-'+String(e.id).padStart(2,"0")+'\nnest new backend\ncd backend\nnpm install @nestjs/typeorm typeorm pg\nnest g module '+e.resource+'\nnest g controller '+e.resource+'\nnest g service '+e.resource+'\n\n# Comprueba las librerías\nnpm list @nestjs/typeorm typeorm pg</div></div><div class="tree">EJERCICIO-'+String(e.id).padStart(2,"0")+'/\n├── backend/\n├── frontend/\n└── README.md</div></div>'+
 '<div class="card"><h3>SI ESTÁS PROBANDO LA SOLUCIÓN DEL PROFESOR</h3><div class="terminal">cd EJERCICIO-'+String(e.id).padStart(2,"0")+'/backend\nnpm install\nnpm run build\nnpm run start:dev</div><p>La solución guardada en este repositorio es un proyecto NestJS completo. <code>npm run build</code> debe terminar sin errores antes de probar la API.</p></div>'+
 '<div class="section-head"><small>FASE 1</small><h2>CONSTRUYE BACKEND</h2></div><div class="card backend phase"><div class="phase-no">1</div><div><h3>NestJS + TypeORM + PostgreSQL</h3><p>Crea la base <code>'+e.db+'</code>. Configura TypeORM, registra la Entity en el módulo, inyecta Repository en Service y expón la operación desde Controller.</p><p><b>El CLI no crea estos archivos por ti. Créalo(s) manualmente dentro del módulo:</b><br>'+manualFilesGuide(e)+'</p><p>Después compara tu estructura con las rutas que aparecen en <b>OBSERVA LOS ARCHIVOS COMPLETOS</b>.</p></div></div>'+(codeViewerSection(e,fs))+


 '<div class="section-head"><small>FASE 2</small><h2>PRUEBA BACKEND</h2></div><div class="card backend"><p>Arranca NestJS y prueba exactamente la operación protagonista:</p><div class="terminal">npm run start:dev\n\n'+testGuide(e)+'</div><div class="flow"><span>Request</span><b>→</b><span>Controller</span><b>→</b><span>Service</span><b>→</b><span>Repository</span><b>→</b><span>PostgreSQL</span><b>→</b><span>JSON</span></div><p><b>No continúes</b> hasta que la API responda correctamente.</p></div>'+
 exerciseExtraGuide(e)+
 '<div class="section-head"><small>FASE 3</small><h2>CREA Y PRUEBA FRONTEND</h2></div><div class="card frontend phase"><div class="phase-no">3</div><div><h3>React Native · Expo</h3><div class="terminal">cd ..\nnpx create-expo-app@latest frontend --template blank-typescript\ncd frontend\nnpx expo start</div><p>Instala Expo Go en el móvil y comprueba primero que la app base abre. Solo después conecta la API.</p><h4>Si pruebas la solución</h4><div class="terminal">cd frontend\nnpm install\nnpm start</div></div></div>'+
 '<div class="section-head"><small>FASE 4</small><h2>CONECTA FRONTEND / BACKEND</h2></div><div class="card connection"><div class="flow"><span>React Native</span><b>→</b><span>HTTP</span><b>→</b><span>'+e.route+'</span><b>→</b><span>Controller</span><b>→</b><span>Service</span><b>→</b><span>Repository</span><b>→</b><span>PostgreSQL</span></div><p>En un móvil físico, <code>localhost</code> es el propio móvil. En Windows ejecuta <code>ipconfig</code>, localiza la dirección IPv4 y sustituye <code>TU_IP_LOCAL</code> en <code>App.tsx</code>. PC y móvil deben estar en la misma red. Si Windows pregunta por Firewall para Node.js, permite el acceso en la red privada.</p><div class="terminal">ipconfig\n# Ejemplo: IPv4 192.168.1.37\n# App.tsx → http://192.168.1.37:3000</div></div>'+
 ("")+


 '<div class="section-head"><small>ENTIENDE</small><h2>Relaciona el código nuevo con su responsabilidad</h2></div><div class="card">'+understandGuide(e)+'</div>'+
 '<section class="card modify"><div class="mod-grid"><div><h2>MODIFÍCALO</h2><p><b>'+e.modify+'</b></p><div class="step"><b>1</b><span>Identifica qué capas debe atravesar el dato.</span></div><div class="step"><b>2</b><span>Modifica primero el backend y vuelve a probar la API.</span></div><div class="step"><b>3</b><span>Actualiza React Native y comprueba el recorrido completo.</span></div></div><div class="phone"><div class="screen"><small>'+e.title.toUpperCase()+'</small><h3>'+e.focus+'</h3><div class="mock"><b>'+e.icon+' '+e.mock+'</b><br><small>'+e.mock2+'</small></div><div class="mock">PostgreSQL conectado ✓</div></div></div></div></section>'+
 '<div class="section-head"><small>CHECKPOINTS</small><h2>Localiza problemas antes de seguir</h2></div><div class="card checks">☐ NestJS arranca y PostgreSQL conecta.<br>'+checkpointGuide(e)+'<br>☐ Puedo explicar el recorrido del dato sin mirar el código.</div>'+
 '<div class="section-head"><small>COMPRUEBA</small><h2>¿Lo entiendes?</h2></div>'+(()=>{const q=quizGuide(e);return '<div class="card"><p><b>'+q[0]+'</b></p><div class="quiz-options"><button class="quiz-option" data-correct="1">'+q[1]+'</button><button class="quiz-option">'+q[2]+'</button><button class="quiz-option">'+q[3]+'</button><button class="quiz-option">'+q[4]+'</button></div><p class="quiz-feedback"></p></div>';})()+
 '<section class="card github"><h2>GITHUB</h2><p>Ejecuta estos comandos desde la raíz del repositorio <code>C02-DATABRIDGE-TYPEORM-POSTGRESQL</code>, no desde <code>backend</code> ni desde <code>frontend</code>.</p><div class="terminal">git status\ngit add EJERCICIO-'+String(e.id).padStart(2,"0")+'\ngit commit -m "Ejercicio '+String(e.id).padStart(2,"0")+' - '+e.title+'"\ngit push</div><p>Abre GitHub y comprueba que <b>EJERCICIO-'+String(e.id).padStart(2,"0")+'/backend</b>, <b>frontend</b> y <b>README.md</b> están visibles antes de continuar.</p></section>'+
 '<section class="card success"><h2>HE APRENDIDO</h2><p>✓ '+e.focus+'<br>✓ '+e.concept+'<br>✓ seguir el dato entre móvil, API y PostgreSQL.</p><b>¿Podrías explicar este ejercicio sin mirar el código?</b></section>';
}
const reviewQuestions=[
"¿Qué problema resuelve la persistencia?","¿Qué diferencia existe entre un array en memoria y PostgreSQL?","¿Qué representa una Entity?","¿Qué responsabilidad tiene Repository?","¿Por qué Controller no debería acceder directamente a PostgreSQL?","¿Qué responsabilidad tiene Service?","¿Qué hace repository.find()?","¿Qué información transporta un Path Param?","¿Qué diferencia existe entre Entity y DTO?","¿Cuándo utilizarías POST?","¿Cuándo utilizarías PATCH?","¿Qué debe hacer la interfaz después de un DELETE?","¿Qué significa CRUD?","¿Qué expresa OneToMany?","¿Qué expresa ManyToOne?","¿Para qué sirven los Query Params?","¿Por qué localhost puede fallar desde un móvil físico?","¿Qué formato utilizamos habitualmente para intercambiar datos?","¿Qué pieza traduce operaciones sobre objetos a operaciones sobre PostgreSQL?","Explica el recorrido completo de un dato desde el móvil hasta PostgreSQL y de vuelta."
];
function review(){
 return '<section class="hero"><div class="eyebrow">REPASO FINAL</div><h1>Conecta las piezas</h1><p>20 preguntas para recuperar conceptos, leer arquitectura y localizar qué debes repasar. No es un examen.</p></section>'+
 '<div class="card flow"><span>React Native</span><b>→</b><span>HTTP</span><b>→</b><span>Controller</span><b>→</b><span>Service</span><b>→</b><span>Repository</span><b>→</b><span>TypeORM</span><b>→</b><span>PostgreSQL</span></div>'+
 reviewQuestions.map((q,i)=>'<div class="card"><b>'+(i+1)+'. '+q+'</b><div class="quiz-options"><button class="quiz-option" data-correct="1">Respuesta coherente con la arquitectura y los conceptos del cuaderno.</button><button class="quiz-option">React Native se conecta siempre directamente a PostgreSQL.</button><button class="quiz-option">Todas las responsabilidades pertenecen al Controller.</button><button class="quiz-option">No interviene HTTP.</button></div><p class="quiz-feedback"></p></div>').join("");
}
function wire(){
 document.querySelectorAll(".exercise-tile").forEach(x=>x.onclick=()=>go(x.dataset.page));
 const viewer=$("#fileViewer");
 if(viewer){
   const exerciseData=current.startsWith("e")
     ? EXERCISES[Number(current.slice(1))-1]
     : null;
   const files=codeFiles(exerciseData);

   const showFile=async(index)=>{
     const file=files[index];

     document.querySelectorAll(".tab").forEach((tab,i)=>{
       tab.classList.toggle("active",i===index);
     });

     viewer.innerHTML=
       '<div class="code-meta">'+
       '<b>NOMBRE</b> '+file.name+'<br>'+
       '<b>RUTA</b> '+file.path+'<br>'+
       '<b>RESPONSABILIDAD</b> '+file.role+
       '</div>'+
       '<pre class="code">Cargando archivo…</pre>';

     if(!file.source){
       viewer.querySelector(".code").textContent="Pendiente de auditoría.";
       return;
     }

     try{
       // Cada pestaña descarga UN archivo físico independiente.
       const response=await fetch(file.source+'?v=20260929-1605');
       if(!response.ok) throw new Error('No se pudo cargar el archivo');
       const code=await response.text();
       viewer.querySelector(".code").textContent=code;
     }catch(error){
       viewer.querySelector(".code").textContent=
         'Error al cargar '+file.name+'. Recarga la página.';
     }
   };

   document.querySelectorAll(".tab").forEach((tab,index)=>{
     tab.onclick=()=>showFile(index);
   });

   showFile(0);
 }
 document.querySelectorAll(".quiz-option").forEach(b=>b.onclick=()=>{const card=b.closest(".card");card.querySelectorAll(".quiz-option").forEach(x=>x.classList.remove("correct","wrong"));b.classList.add(b.dataset.correct?"correct":"wrong");card.querySelector(".quiz-feedback").textContent=b.dataset.correct?"✓ Correcto. Relaciona siempre cada capa con su responsabilidad.":"✕ Revisa el recorrido del dato y las responsabilidades.";});
}
function render(){
 renderNav();
 const idx=pages.indexOf(current);
 const e=current.startsWith("e")?EXERCISES[Number(current.slice(1))-1]:null;
 $("#content").innerHTML=current==="home"?home():current==="review"?review():exercise(e);
 $("#pageTitle").textContent=current==="home"?"C02 · DataBridge":current==="review"?"Repaso final":String(e.id).padStart(2,"0")+" · "+e.title;
 $("#prevBtn").disabled=idx===0;$("#nextBtn").disabled=idx===pages.length-1;
 $("#completeBtn").textContent=state.done.includes(current)?"✓ COMPLETADO":"MARCAR COMPLETADO";
 wire();renderNav();
}
$("#prevBtn").onclick=()=>{const i=pages.indexOf(current);if(i>0)go(pages[i-1])};
$("#nextBtn").onclick=()=>{const i=pages.indexOf(current);if(i<pages.length-1)go(pages[i+1])};
$("#completeBtn").onclick=()=>{if(!state.done.includes(current))state.done.push(current);save();render()};
$("#resetProgress").onclick=()=>{if(confirm("¿Reiniciar todo el progreso?")){state.done=[];save();render()}};
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(pages.includes(h)){current=h;render()}});
render();