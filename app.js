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
 const singular=e.resource.endsWith("s")?e.resource.slice(0,-1):e.resource;
 const ClassName=singular.charAt(0).toUpperCase()+singular.slice(1);
 return [
  {name:singular+".entity.ts",path:"backend/src/"+e.resource+"/"+singular+".entity.ts",role:"Representa la entidad persistente.",code:'import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";\n\n@Entity()\nexport class '+ClassName+' {\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column()\n  nombre: string;\n}'},
  {name:e.resource+".service.ts",path:"backend/src/"+e.resource+"/"+e.resource+".service.ts",role:"Aplica la lógica y utiliza Repository.",code:'import { Injectable } from "@nestjs/common";\nimport { InjectRepository } from "@nestjs/typeorm";\nimport { Repository } from "typeorm";\nimport { '+ClassName+' } from "./'+singular+'.entity";\n\n@Injectable()\nexport class '+ClassName+'Service {\n  constructor(\n    @InjectRepository('+ClassName+')\n    private readonly repository: Repository<'+ClassName+'>,\n  ) {}\n\n  findAll() {\n    return this.repository.find();\n  }\n}'},
  {name:e.resource+".controller.ts",path:"backend/src/"+e.resource+"/"+e.resource+".controller.ts",role:"Recibe las peticiones HTTP y delega en Service.",code:'import { Controller, Get } from "@nestjs/common";\nimport { '+ClassName+'Service } from "./'+e.resource+'.service";\n\n@Controller("'+e.resource+'")\nexport class '+ClassName+'Controller {\n  constructor(private readonly service: '+ClassName+'Service) {}\n\n  @Get()\n  findAll() {\n    return this.service.findAll();\n  }\n}'},
  {name:"App.tsx",path:"frontend/App.tsx",role:"Solicita la API y representa el resultado.",code:'const API_URL = "http://TU_IP:3000";\n\nuseEffect(() => {\n  fetch(API_URL + "/'+e.resource+'")\n    .then(response => response.json())\n    .then(setDatos);\n}, []);'}
 ];
}
function exercise(e){
 const fs=codeFiles(e);
 return '<section class="hero"><div class="eyebrow">EJERCICIO '+String(e.id).padStart(2,"0")+' · '+e.focus.toUpperCase()+'</div><h1>'+e.icon+' '+e.title+'</h1><p>'+e.modify+'</p><div class="chips"><span class="chip">'+e.concept+'</span><span class="chip">'+e.route+'</span><span class="chip">'+e.db+'</span></div></section>'+
 '<div class="section-head"><small>FUNDAMENTOS</small><h2>Antes de tocar código</h2></div>'+
 '<div class="card recover"><h3>RECUPERAMOS</h3><p>HTTP, JSON, Controller y Service. Cada ejercicio conecta esos conocimientos con persistencia real.</p></div>'+
 '<div class="card concept"><h3>CONCEPTO NUEVO · '+e.concept+'</h3><p><b>Qué es:</b> la pieza técnica protagonista del ejercicio.</p><p><b>Qué problema resuelve:</b> '+e.focus.toLowerCase()+'.</p><p><b>Cómo encaja:</b> React Native nunca accede directamente a PostgreSQL. La comunicación pasa por la API y cada capa mantiene una responsabilidad.</p></div>'+
 '<div class="section-head"><small>LEE</small><h2>Qué vas a construir</h2></div><div class="grid2"><div class="card"><b>OBJETIVO</b><p>Construir y comprobar <code>'+e.route+'</code> utilizando datos persistidos en <code>'+e.db+'</code>.</p></div><div class="card"><b>CONCEPTO NUEVO</b><p>'+e.concept+'</p></div></div>'+
 '<div class="section-head"><small>PREPARA LA ISLA</small><h2>Todo empieza en su carpeta</h2></div><div class="lab"><div class="terminal">cd C02-DATABRIDGE-TYPEORM-POSTGRESQL/EJERCICIO-'+String(e.id).padStart(2,"0")+'\nnest new backend\ncd backend\nnpm install @nestjs/typeorm typeorm pg\nnest g module '+e.resource+'\nnest g controller '+e.resource+'\nnest g service '+e.resource+'</div><div class="tree">EJERCICIO-'+String(e.id).padStart(2,"0")+'/\n├── backend/\n├── frontend/\n└── README.md</div></div>'+
 '<div class="section-head"><small>FASE 1</small><h2>CONSTRUYE BACKEND</h2></div><div class="card backend phase"><div class="phase-no">1</div><div><h3>NestJS + TypeORM + PostgreSQL</h3><p>Crea la base <code>'+e.db+'</code>. Configura TypeORM, registra la Entity en el módulo, inyecta Repository en Service y expón la operación desde Controller.</p></div></div>'+
 '<div class="section-head"><small>FASE 2</small><h2>PRUEBA BACKEND</h2></div><div class="card backend"><div class="terminal">npm run start:dev\n\n'+e.route+'\n→ Controller\n→ Service\n→ Repository\n→ TypeORM\n→ PostgreSQL\n→ JSON</div><p><b>No continúes</b> hasta que la API responda correctamente.</p></div>'+
 '<div class="section-head"><small>FASE 3</small><h2>CREA FRONTEND</h2></div><div class="card frontend phase"><div class="phase-no">3</div><div><h3>React Native · Expo</h3><div class="terminal">cd ..\nnpx create-expo-app@latest frontend\ncd frontend\nnpx expo start</div></div></div>'+
 '<div class="section-head"><small>FASE 4</small><h2>CONECTA FRONTEND / BACKEND</h2></div><div class="card connection"><div class="flow"><span>React Native</span><b>→</b><span>HTTP</span><b>→</b><span>'+e.route+'</span><b>→</b><span>Controller</span><b>→</b><span>Service</span><b>→</b><span>Repository</span><b>→</b><span>PostgreSQL</span></div><p>En un móvil físico, <code>localhost</code> representa el propio móvil. Utiliza la IP local del ordenador que ejecuta NestJS.</p></div>'+
 '<section class="dark"><h2>OBSERVA LOS ARCHIVOS COMPLETOS</h2><p>Lee primero Entity → Service → Controller → App.tsx para seguir las responsabilidades.</p><div class="tabs">'+fs.map((f,i)=>'<button class="tab '+(i===0?"active":"")+'" data-tab="'+i+'">'+f.name+'</button>').join("")+'</div><div id="filePane" data-files="'+esc(JSON.stringify(fs))+'"></div></section>'+
 '<div class="section-head"><small>ENTIENDE</small><h2>Relaciona código y responsabilidad</h2></div><div class="card"><div class="under-row"><code>@InjectRepository(...)</code><span>Entrega al Service un Repository preparado para trabajar con esa Entity.</span></div><div class="under-row"><code>repository.find()</code><span>Solicita a TypeORM una colección de entidades recuperadas de PostgreSQL.</span></div><div class="under-row"><code>fetch(...)</code><span>React Native realiza una petición HTTP a la API; no accede a la base de datos directamente.</span></div></div>'+
 '<section class="card modify"><div class="mod-grid"><div><h2>MODIFÍCALO</h2><p><b>'+e.modify+'</b></p><div class="step"><b>1</b><span>Identifica qué capas debe atravesar el dato.</span></div><div class="step"><b>2</b><span>Modifica primero el backend y vuelve a probar la API.</span></div><div class="step"><b>3</b><span>Actualiza React Native y comprueba el recorrido completo.</span></div></div><div class="phone"><div class="screen"><small>'+e.title.toUpperCase()+'</small><h3>'+e.focus+'</h3><div class="mock"><b>'+e.icon+' '+e.mock+'</b><br><small>'+e.mock2+'</small></div><div class="mock">PostgreSQL conectado ✓</div></div></div></div></section>'+
 '<div class="section-head"><small>CHECKPOINTS</small><h2>Localiza problemas antes de seguir</h2></div><div class="card checks">☐ El proyecto arranca.<br>☐ PostgreSQL conecta.<br>☐ '+e.route+' responde.<br>☐ React Native recibe la respuesta.<br>☐ La modificación funciona.<br>☐ Puedo explicar el recorrido.</div>'+
 '<div class="section-head"><small>COMPRUEBA</small><h2>¿Lo entiendes?</h2></div><div class="card"><p><b>'+e.question+'</b></p><div class="quiz-options"><button class="quiz-option" data-correct="1">La opción coherente con Controller → Service → Repository y el recorrido trabajado.</button><button class="quiz-option">React Native accede directamente a PostgreSQL.</button><button class="quiz-option">Repository se encarga de dibujar la pantalla.</button><button class="quiz-option">Todas las capas tienen la misma responsabilidad.</button></div><p class="quiz-feedback"></p></div>'+
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
 const pane=$("#filePane");
 if(pane){
   const files=JSON.parse(pane.dataset.files);
   const show=i=>{const f=files[i];pane.innerHTML='<div class="code-meta"><b>RUTA</b> '+f.path+'<br><b>RESPONSABILIDAD</b> '+f.role+'</div><pre class="code">'+esc(f.code)+'</pre>';document.querySelectorAll(".tab").forEach((t,j)=>t.classList.toggle("active",j===i));};
   document.querySelectorAll(".tab").forEach((t,i)=>t.onclick=()=>show(i));show(0);
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