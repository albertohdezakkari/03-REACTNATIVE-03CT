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
 if(e.id===1){
  return [
   {name:"app.module.ts",path:"backend/src/app.module.ts",role:"Configura TypeORM y conecta NestJS con PostgreSQL.",code:`import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideojuegosModule } from './videojuegos/videojuegos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'TU_PASSWORD_POSTGRES',
      database: 'databridge_e01',
      autoLoadEntities: true,
      synchronize: true,
    }),
    VideojuegosModule,
  ],
})
export class AppModule {}`},
   {name:"videojuego.entity.ts",path:"backend/src/videojuegos/videojuego.entity.ts",role:"Define la entidad persistente y las columnas de la tabla videojuegos.",code:`import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('videojuegos')
export class Videojuego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  plataforma: string;

  @Column('decimal', { precision: 3, scale: 1 })
  puntuacion: number;
}`},
   {name:"videojuegos.module.ts",path:"backend/src/videojuegos/videojuegos.module.ts",role:"Registra Videojuego para que TypeORM pueda proporcionar su Repository.",code:`import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Videojuego } from './videojuego.entity';
import { VideojuegosController } from './videojuegos.controller';
import { VideojuegosService } from './videojuegos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Videojuego])],
  controllers: [VideojuegosController],
  providers: [VideojuegosService],
})
export class VideojuegosModule {}`},
   {name:"videojuegos.service.ts",path:"backend/src/videojuegos/videojuegos.service.ts",role:"Utiliza Repository<Videojuego> para leer PostgreSQL e inserta datos iniciales si la tabla está vacía.",code:`import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videojuego } from './videojuego.entity';

@Injectable()
export class VideojuegosService implements OnModuleInit {
  constructor(
    @InjectRepository(Videojuego)
    private readonly repository: Repository<Videojuego>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      await this.repository.save([
        this.repository.create({
          titulo: 'Hollow Knight',
          plataforma: 'Nintendo Switch',
          puntuacion: 9.4,
        }),
        this.repository.create({
          titulo: 'Zelda: Tears of the Kingdom',
          plataforma: 'Nintendo Switch',
          puntuacion: 9.8,
        }),
        this.repository.create({
          titulo: 'Forza Horizon 5',
          plataforma: 'Xbox',
          puntuacion: 9.1,
        }),
      ]);
    }
  }

  findAll(): Promise<Videojuego[]> {
    return this.repository.find({
      order: { puntuacion: 'DESC' },
    });
  }
}`},
   {name:"videojuegos.controller.ts",path:"backend/src/videojuegos/videojuegos.controller.ts",role:"Recibe GET /videojuegos y delega la operación en VideojuegosService.",code:`import { Controller, Get } from '@nestjs/common';
import { Videojuego } from './videojuego.entity';
import { VideojuegosService } from './videojuegos.service';

@Controller('videojuegos')
export class VideojuegosController {
  constructor(
    private readonly videojuegosService: VideojuegosService,
  ) {}

  @Get()
  findAll(): Promise<Videojuego[]> {
    return this.videojuegosService.findAll();
  }
}`},
   {name:"App.tsx",path:"frontend/App.tsx",role:"Solicita GET /videojuegos, guarda el JSON en estado y muestra una colección visual.",code:`import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Videojuego = {
  id: number;
  titulo: string;
  plataforma: string;
  puntuacion: number;
};

const API_URL = 'http://TU_IP_LOCAL:3000';

export default function App() {
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarVideojuegos() {
      try {
        const respuesta = await fetch(`${API_URL}/videojuegos`);

        if (!respuesta.ok) {
          throw new Error('La API no ha respondido correctamente');
        }

        const datos: Videojuego[] = await respuesta.json();
        setVideojuegos(datos);
      } catch {
        setError(
          'No se ha podido conectar con NestJS. Revisa la IP y el puerto.',
        );
      } finally {
        setCargando(false);
      }
    }

    cargarVideojuegos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>GAME VAULT</Text>
        <Text style={styles.title}>Mi colección</Text>
        <Text style={styles.subtitle}>
          Datos reales recuperados desde PostgreSQL
        </Text>
      </View>

      {cargando && (
        <ActivityIndicator size="large" style={styles.center} />
      )}

      {error !== '' && (
        <Text style={styles.error}>{error}</Text>
      )}

      {!cargando && error === '' && (
        <FlatList
          data={videojuegos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.gameIcon}>
                <Text style={styles.gameEmoji}>🎮</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.gameTitle}>{item.titulo}</Text>
                <Text style={styles.platform}>{item.plataforma}</Text>
              </View>

              <View style={styles.score}>
                <Text style={styles.scoreText}>
                  ★ {Number(item.puntuacion).toFixed(1)}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: '#94A3B8',
    marginTop: 6,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameEmoji: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
  },
  gameTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  platform: {
    color: '#94A3B8',
    marginTop: 4,
  },
  score: {
    backgroundColor: '#0F766E',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scoreText: {
    color: '#CCFBF1',
    fontWeight: '800',
  },
  center: {
    marginTop: 80,
  },
  error: {
    color: '#FCA5A5',
    paddingHorizontal: 24,
    marginTop: 30,
    textAlign: 'center',
  },
});`}
  ];
 }
 const singular=e.resource.endsWith("s")?e.resource.slice(0,-1):e.resource;
 return [{name:singular+".entity.ts",path:"backend/src/"+e.resource+"/"+singular+".entity.ts",role:"Pendiente de auditoría tras aprobar E01.",code:"Este ejercicio se completará después de aprobar E01."}];
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
 '<section class="dark"><h2>OBSERVA LOS ARCHIVOS COMPLETOS</h2><p>Lee primero Entity → Service → Controller → App.tsx para seguir las responsabilidades.</p><div class="tabs">'+fs.map((f,i)=>'<button class="tab '+(i===0?"active":"")+'" data-tab="'+i+'">'+f.name+'</button>').join("")+'</div><div id="filePane"></div></section>'+
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
   const e=current.startsWith("e")?EXERCISES[Number(current.slice(1))-1]:null; const files=codeFiles(e);
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