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
 '<div class="section-head"><small>00 · PREPARACIÓN</small><h2>Prepara tu taller Full Stack</h2></div>'+
 '<div class="card concept"><h3>Partimos realmente desde cero</h3><p>Node.js ejecutará nuestro ecosistema TypeScript; NestJS construirá la API; PostgreSQL conservará los datos; TypeORM conectará objetos y tablas; Expo ejecutará la aplicación móvil.</p></div>'+
 '<div class="terminal">node -v\nnpm -v\nnpm install -g @nestjs/cli\nnest --version\ngit --version</div>'+
 '<div class="grid2"><div class="card"><h3>PostgreSQL local</h3><p>Distingue servidor, base de datos, tabla, fila y columna. Cada isla usará su propia base: <code>databridge_e01</code> … <code>databridge_e10</code>.</p></div><div class="card"><h3>Repositorio del alumno</h3><div class="tree">C02-DATABRIDGE-TYPEORM-POSTGRESQL/\n├── EJERCICIO-01/\n│   ├── backend/\n│   ├── frontend/\n│   └── README.md\n├── ...\n└── EJERCICIO-10/</div></div></div>'+
 '<div class="section-head"><small>PROGRESIÓN</small><h2>Los 10 ejercicios</h2></div><div class="exercise-list">'+EXERCISES.map(e=>'<div class="exercise-tile" data-page="e'+e.id+'"><b>'+String(e.id).padStart(2,"0")+' · '+e.icon+' '+e.title+'</b><small>'+e.focus+' · '+e.concept+'</small></div>').join("")+'</div>';
}
function codeFiles(e){
 const map={
  1:[
   ["app.module.ts","backend/src/app.module.ts","Configura la aplicación raíz y PostgreSQL.","code/e01/app.module.ts.txt"],
   ["videojuego.entity.ts","backend/src/videojuegos/videojuego.entity.ts","Describe cómo se guarda un videojuego.","code/e01/videojuego.entity.ts.txt"],
   ["videojuegos.module.ts","backend/src/videojuegos/videojuegos.module.ts","Agrupa el dominio y habilita Repository.","code/e01/videojuegos.module.ts.txt"],
   ["videojuegos.service.ts","backend/src/videojuegos/videojuegos.service.ts","Trabaja con Repository<Videojuego>.","code/e01/videojuegos.service.ts.txt"],
   ["videojuegos.controller.ts","backend/src/videojuegos/videojuegos.controller.ts","Expone GET /videojuegos.","code/e01/videojuegos.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Consume la API y representa la colección.","code/e01/App.tsx.txt"]
  ],
  2:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e02.","code/e02/app.module.ts.txt"],
   ["pelicula.entity.ts","backend/src/peliculas/pelicula.entity.ts","Define la película persistente.","code/e02/pelicula.entity.ts.txt"],
   ["peliculas.module.ts","backend/src/peliculas/peliculas.module.ts","Registra Entity, Controller y Service.","code/e02/peliculas.module.ts.txt"],
   ["peliculas.service.ts","backend/src/peliculas/peliculas.service.ts","Recupera la colección con find().","code/e02/peliculas.service.ts.txt"],
   ["peliculas.controller.ts","backend/src/peliculas/peliculas.controller.ts","Expone GET /peliculas.","code/e02/peliculas.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Muestra la cartelera recibida.","code/e02/App.tsx.txt"]
  ],
  3:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e03.","code/e03/app.module.ts.txt"],
   ["mascota.entity.ts","backend/src/mascotas/mascota.entity.ts","Define la mascota persistente.","code/e03/mascota.entity.ts.txt"],
   ["mascotas.module.ts","backend/src/mascotas/mascotas.module.ts","Registra el dominio mascotas.","code/e03/mascotas.module.ts.txt"],
   ["mascotas.service.ts","backend/src/mascotas/mascotas.service.ts","Busca un registro con findOneBy().","code/e03/mascotas.service.ts.txt"],
   ["mascotas.controller.ts","backend/src/mascotas/mascotas.controller.ts","Lee el Path Param :id.","code/e03/mascotas.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Muestra la ficha de una mascota.","code/e03/App.tsx.txt"]
  ],
  4:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e04.","code/e04/app.module.ts.txt"],
   ["restaurante.entity.ts","backend/src/restaurantes/restaurante.entity.ts","Define la Entity persistente.","code/e04/restaurante.entity.ts.txt"],
   ["create-restaurante.dto.ts","backend/src/restaurantes/create-restaurante.dto.ts","Describe el Body de creación.","code/e04/create-restaurante.dto.ts.txt"],
   ["restaurantes.module.ts","backend/src/restaurantes/restaurantes.module.ts","Registra el dominio restaurantes.","code/e04/restaurantes.module.ts.txt"],
   ["restaurantes.service.ts","backend/src/restaurantes/restaurantes.service.ts","Crea y guarda mediante Repository.","code/e04/restaurantes.service.ts.txt"],
   ["restaurantes.controller.ts","backend/src/restaurantes/restaurantes.controller.ts","Recibe POST y @Body().","code/e04/restaurantes.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Formulario que envía POST.","code/e04/App.tsx.txt"]
  ],
  5:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e05.","code/e05/app.module.ts.txt"],
   ["viaje.entity.ts","backend/src/viajes/viaje.entity.ts","Define la Entity Viaje.","code/e05/viaje.entity.ts.txt"],
   ["update-viaje.dto.ts","backend/src/viajes/update-viaje.dto.ts","Define campos opcionales de PATCH.","code/e05/update-viaje.dto.ts.txt"],
   ["viajes.module.ts","backend/src/viajes/viajes.module.ts","Registra el dominio viajes.","code/e05/viajes.module.ts.txt"],
   ["viajes.service.ts","backend/src/viajes/viajes.service.ts","Busca, mezcla cambios y guarda.","code/e05/viajes.service.ts.txt"],
   ["viajes.controller.ts","backend/src/viajes/viajes.controller.ts","Expone PATCH /viajes/:id.","code/e05/viajes.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Edita estado y fecha.","code/e05/App.tsx.txt"]
  ],
  6:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e06.","code/e06/app.module.ts.txt"],
   ["libro.entity.ts","backend/src/libros/libro.entity.ts","Define Libro.","code/e06/libro.entity.ts.txt"],
   ["libros.module.ts","backend/src/libros/libros.module.ts","Registra el dominio libros.","code/e06/libros.module.ts.txt"],
   ["libros.service.ts","backend/src/libros/libros.service.ts","Lee, elimina y marca como leído.","code/e06/libros.service.ts.txt"],
   ["libros.controller.ts","backend/src/libros/libros.controller.ts","Expone GET, DELETE y PATCH.","code/e06/libros.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Confirma DELETE y sincroniza estado.","code/e06/App.tsx.txt"]
  ],
  7:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e07.","code/e07/app.module.ts.txt"],
   ["sneaker.entity.ts","backend/src/sneakers/sneaker.entity.ts","Define Sneaker y stock.","code/e07/sneaker.entity.ts.txt"],
   ["create-sneaker.dto.ts","backend/src/sneakers/create-sneaker.dto.ts","Datos de creación.","code/e07/create-sneaker.dto.ts.txt"],
   ["update-sneaker.dto.ts","backend/src/sneakers/update-sneaker.dto.ts","Datos parciales de edición.","code/e07/update-sneaker.dto.ts.txt"],
   ["sneakers.module.ts","backend/src/sneakers/sneakers.module.ts","Registra el dominio.","code/e07/sneakers.module.ts.txt"],
   ["sneakers.service.ts","backend/src/sneakers/sneakers.service.ts","Implementa CRUD con Repository.","code/e07/sneakers.service.ts.txt"],
   ["sneakers.controller.ts","backend/src/sneakers/sneakers.controller.ts","Expone CRUD REST.","code/e07/sneakers.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Integra operaciones CRUD.","code/e07/App.tsx.txt"]
  ],
  8:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e08.","code/e08/app.module.ts.txt"],
   ["playlist.entity.ts","backend/src/playlists/playlist.entity.ts","Lado OneToMany.","code/e08/playlist.entity.ts.txt"],
   ["cancion.entity.ts","backend/src/playlists/cancion.entity.ts","Lado ManyToOne y clave foránea.","code/e08/cancion.entity.ts.txt"],
   ["create-cancion.dto.ts","backend/src/playlists/create-cancion.dto.ts","Datos para asociar una canción.","code/e08/create-cancion.dto.ts.txt"],
   ["playlists.module.ts","backend/src/playlists/playlists.module.ts","Registra ambas Entities.","code/e08/playlists.module.ts.txt"],
   ["playlists.service.ts","backend/src/playlists/playlists.service.ts","Carga relaciones y añade canciones.","code/e08/playlists.service.ts.txt"],
   ["playlists.controller.ts","backend/src/playlists/playlists.controller.ts","Expone detalle y alta de canción.","code/e08/playlists.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Muestra playlist y canciones.","code/e08/App.tsx.txt"]
  ],
  9:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e09.","code/e09/app.module.ts.txt"],
   ["evento.entity.ts","backend/src/eventos/evento.entity.ts","Define Evento.","code/e09/evento.entity.ts.txt"],
   ["eventos.module.ts","backend/src/eventos/eventos.module.ts","Registra el dominio eventos.","code/e09/eventos.module.ts.txt"],
   ["eventos.service.ts","backend/src/eventos/eventos.service.ts","Construye filtros where.","code/e09/eventos.service.ts.txt"],
   ["eventos.controller.ts","backend/src/eventos/eventos.controller.ts","Lee @Query ciudad/categoria.","code/e09/eventos.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Solicita una consulta filtrada.","code/e09/App.tsx.txt"]
  ],
  10:[
   ["app.module.ts","backend/src/app.module.ts","Conecta esta isla con databridge_e10.","code/e10/app.module.ts.txt"],
   ["destino.entity.ts","backend/src/destinos/destino.entity.ts","Define Destino.","code/e10/destino.entity.ts.txt"],
   ["create-destino.dto.ts","backend/src/destinos/create-destino.dto.ts","Datos de creación.","code/e10/create-destino.dto.ts.txt"],
   ["update-destino.dto.ts","backend/src/destinos/update-destino.dto.ts","Datos parciales de edición.","code/e10/update-destino.dto.ts.txt"],
   ["destinos.module.ts","backend/src/destinos/destinos.module.ts","Registra el dominio.","code/e10/destinos.module.ts.txt"],
   ["destinos.service.ts","backend/src/destinos/destinos.service.ts","CRUD completo con Repository.","code/e10/destinos.service.ts.txt"],
   ["destinos.controller.ts","backend/src/destinos/destinos.controller.ts","CRUD REST completo.","code/e10/destinos.controller.ts.txt"],
   ["App.tsx","frontend/App.tsx","Referencia móvil del challenge.","code/e10/App.tsx.txt"]
  ]
 };
 return (map[e.id]||[]).map(([name,path,role,source])=>({name,path,role,source}));
}
function conceptGuide(e){
 const guides={
  1:"<p><b>Persistencia:</b> los datos sobreviven al reinicio. <b>Entity:</b> describe la tabla. <b>Repository:</b> ofrece operaciones sobre esa Entity.</p>",
  2:"<p><b>find()</b> recupera una colección de entidades. No escribimos SELECT manualmente: Repository pide los registros y TypeORM realiza la consulta.</p>",
  3:"<p><b>Path Param:</b> el id forma parte de la URL. <b>findOneBy({ id })</b> busca una entidad que cumple esa condición. Si no existe, la API debe responder de forma controlada.</p>",
  4:"<p><b>POST</b> crea un recurso. <b>@Body()</b> recupera el JSON enviado. <b>DTO</b> describe los datos de entrada. <b>create()</b> construye la Entity y <b>save()</b> la persiste.</p>",
  5:"<p><b>PATCH</b> modifica parte de un recurso. Por eso UpdateViajeDto tiene propiedades opcionales: el cliente no está obligado a reenviar el objeto completo.</p>",
  6:"<p><b>DELETE</b> elimina el registro persistente, pero React Native conserva su estado en memoria. Después de borrar debemos sincronizar la interfaz.</p>",
  7:"<p><b>CRUD</b> reúne Create, Read, Update y Delete. Aquí no aparece un método HTTP nuevo: el reto consiste en integrar correctamente lo aprendido.</p>",
  8:"<p><b>OneToMany:</b> una Playlist contiene muchas Canciones. <b>ManyToOne:</b> cada Canción pertenece a una Playlist. El lado ManyToOne mantiene la clave foránea.</p>",
  9:"<p><b>Query Params</b> expresan filtros opcionales después de ?. Controller los recibe con @Query y Service construye el objeto <code>where</code> que TypeORM aplica en PostgreSQL.</p>",
  10:"<p><b>Transferencia:</b> ya conoces las piezas. Ahora debes decidir cómo combinarlas para construir un CRUD persistente completo con mayor autonomía.</p>"
 };
 return guides[e.id]||"";
}
function testGuide(e){
 const examples={
  1:"GET http://localhost:3000/videojuegos",
  2:"GET http://localhost:3000/peliculas",
  3:"GET http://localhost:3000/mascotas/1",
  4:"POST http://localhost:3000/restaurantes\nContent-Type: application/json\n\n{\n  \"nombre\": \"La Trattoria\",\n  \"tipo\": \"Italiano\",\n  \"ciudad\": \"Zaragoza\",\n  \"puntuacion\": 9,\n  \"precioMedio\": 25\n}",
  5:"PATCH http://localhost:3000/viajes/1\nContent-Type: application/json\n\n{ \"estado\": \"REALIZADO\", \"fecha\": \"2027-04-10\" }",
  6:"DELETE http://localhost:3000/libros/1",
  7:"GET /sneakers\nPOST /sneakers\nGET /sneakers/1\nPATCH /sneakers/1\nDELETE /sneakers/1",
  8:"GET http://localhost:3000/playlists/1\nPOST http://localhost:3000/playlists/canciones",
  9:"GET http://localhost:3000/eventos?ciudad=Zaragoza&categoria=Tecnologia",
  10:"GET /destinos\nGET /destinos/1\nPOST /destinos\nPATCH /destinos/1\nDELETE /destinos/1"
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
  6:[["@Delete(':id')","Asocia DELETE con un recurso concreto."],["repository.delete(id)","Elimina la fila persistente."],["filter(...)","Elimina también el libro del estado local de React."],["Alert.alert","Pide confirmación antes de una acción destructiva."]],
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
function exercise(e){
 const fs=codeFiles(e);
 return '<section class="hero"><div class="eyebrow">EJERCICIO '+String(e.id).padStart(2,"0")+' · '+e.focus.toUpperCase()+'</div><h1>'+e.icon+' '+e.title+'</h1><p>'+e.modify+'</p><div class="chips"><span class="chip">'+e.concept+'</span><span class="chip">'+e.route+'</span><span class="chip">'+e.db+'</span></div></section>'+
 '<div class="section-head"><small>FUNDAMENTOS</small><h2>Antes de tocar código</h2></div>'+
 '<div class="card recover"><h3>RECUPERAMOS</h3><p>HTTP, JSON, Controller y Service. Cada ejercicio conecta esos conocimientos con persistencia real.</p></div>'+
 '<div class="card concept"><h3>CONCEPTO NUEVO · '+e.concept+'</h3>'+conceptGuide(e)+'<p><b>Cómo encaja:</b> React Native no accede directamente a PostgreSQL. Controller recibe HTTP, Service coordina y Repository trabaja con las Entities.</p></div>'+
 '<div class="section-head"><small>LEE</small><h2>Qué vas a construir</h2></div><div class="grid2"><div class="card"><b>OBJETIVO</b><p>Construir y comprobar <code>'+e.route+'</code> utilizando datos persistidos en <code>'+e.db+'</code>.</p></div><div class="card"><b>CONCEPTO NUEVO</b><p>'+e.concept+'</p></div></div>'+
 '<div class="section-head"><small>PREPARA LA ISLA</small><h2>Todo empieza en su carpeta</h2></div><div class="lab"><div class="terminal">cd C02-DATABRIDGE-TYPEORM-POSTGRESQL/EJERCICIO-'+String(e.id).padStart(2,"0")+'\nnest new backend\ncd backend\nnpm install @nestjs/typeorm typeorm pg\nnest g module '+e.resource+'\nnest g controller '+e.resource+'\nnest g service '+e.resource+'</div><div class="tree">EJERCICIO-'+String(e.id).padStart(2,"0")+'/\n├── backend/\n├── frontend/\n└── README.md</div></div>'+
 '<div class="section-head"><small>FASE 1</small><h2>CONSTRUYE BACKEND</h2></div><div class="card backend phase"><div class="phase-no">1</div><div><h3>NestJS + TypeORM + PostgreSQL</h3><p>Crea la base <code>'+e.db+'</code>. Configura TypeORM, registra la Entity en el módulo, inyecta Repository en Service y expón la operación desde Controller.</p></div></div>'+
 '<div class="section-head"><small>FASE 2</small><h2>PRUEBA BACKEND</h2></div><div class="card backend"><p>Arranca NestJS y prueba exactamente la operación protagonista:</p><div class="terminal">npm run start:dev\n\n'+testGuide(e)+'</div><div class="flow"><span>Request</span><b>→</b><span>Controller</span><b>→</b><span>Service</span><b>→</b><span>Repository</span><b>→</b><span>PostgreSQL</span><b>→</b><span>JSON</span></div><p><b>No continúes</b> hasta que la API responda correctamente.</p></div>'+
 '<div class="section-head"><small>FASE 3</small><h2>CREA FRONTEND</h2></div><div class="card frontend phase"><div class="phase-no">3</div><div><h3>React Native · Expo</h3><div class="terminal">cd ..\nnpx create-expo-app@latest frontend --template blank-typescript\ncd frontend\nnpx expo start</div></div></div>'+
 '<div class="section-head"><small>FASE 4</small><h2>CONECTA FRONTEND / BACKEND</h2></div><div class="card connection"><div class="flow"><span>React Native</span><b>→</b><span>HTTP</span><b>→</b><span>'+e.route+'</span><b>→</b><span>Controller</span><b>→</b><span>Service</span><b>→</b><span>Repository</span><b>→</b><span>PostgreSQL</span></div><p>En un móvil físico, <code>localhost</code> representa el propio móvil. Utiliza la IP local del ordenador que ejecuta NestJS.</p></div>'+
 '<section class="dark"><h2>OBSERVA LOS ARCHIVOS COMPLETOS</h2><p>Primero observa el programa completo para familiarizarte con su estructura. Cada pestaña corresponde a UN archivo real.</p><div class="tabs">'+fs.map((f,i)=>'<button class="tab '+(i===0?"active":"")+'" data-tab="'+i+'">'+f.name+'</button>').join("")+'</div><div id="fileViewer"></div></section>'+
 '<div class="section-head"><small>ENTIENDE</small><h2>Relaciona el código nuevo con su responsabilidad</h2></div><div class="card">'+understandGuide(e)+'</div>'+
 '<section class="card modify"><div class="mod-grid"><div><h2>MODIFÍCALO</h2><p><b>'+e.modify+'</b></p><div class="step"><b>1</b><span>Identifica qué capas debe atravesar el dato.</span></div><div class="step"><b>2</b><span>Modifica primero el backend y vuelve a probar la API.</span></div><div class="step"><b>3</b><span>Actualiza React Native y comprueba el recorrido completo.</span></div></div><div class="phone"><div class="screen"><small>'+e.title.toUpperCase()+'</small><h3>'+e.focus+'</h3><div class="mock"><b>'+e.icon+' '+e.mock+'</b><br><small>'+e.mock2+'</small></div><div class="mock">PostgreSQL conectado ✓</div></div></div></div></section>'+
 '<div class="section-head"><small>CHECKPOINTS</small><h2>Localiza problemas antes de seguir</h2></div><div class="card checks">☐ NestJS arranca y PostgreSQL conecta.<br>'+checkpointGuide(e)+'<br>☐ Puedo explicar el recorrido del dato sin mirar el código.</div>'+
 '<div class="section-head"><small>COMPRUEBA</small><h2>¿Lo entiendes?</h2></div>'+(()=>{const q=quizGuide(e);return '<div class="card"><p><b>'+q[0]+'</b></p><div class="quiz-options"><button class="quiz-option" data-correct="1">'+q[1]+'</button><button class="quiz-option">'+q[2]+'</button><button class="quiz-option">'+q[3]+'</button><button class="quiz-option">'+q[4]+'</button></div><p class="quiz-feedback"></p></div>';})()+
 '<section class="card github"><h2>GITHUB</h2><div class="terminal">git add .\ngit commit -m "Ejercicio '+String(e.id).padStart(2,"0")+' - '+e.title+'"\ngit push</div><p>Antes de pasar al siguiente ejercicio, comprueba que <b>EJERCICIO-'+String(e.id).padStart(2,"0")+'</b> está subido.</p></section>'+
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
       const response=await fetch(file.source+'?v=20260929-1540');
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