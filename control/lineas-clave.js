/* Referencias didácticas sin modificar el código que se copia. */
window.CodeLesson = (() => {
  const rules = [
    [/\.createQueryBuilder\(/,'FROM y alias','El Repository determina la tabla de origen. El argumento es su alias, igual que FROM lecciones AS leccion.'],
    [/\.select\(/,'SELECT','Selecciona las columnas de la Entity indicada por el alias.'],
    [/\.leftJoinAndSelect\(/,'LEFT JOIN','Une la relación y selecciona sus columnas. TypeORM obtiene la FK y la condición ON de las Entities.'],
    [/\.where\(/,'WHERE','Añade una condición SQL. Los parámetros como :id reciben su valor en el objeto que acompaña la condición.'],
    [/\.andWhere\(/,'AND','Añade una condición con AND; si es la primera, TypeORM genera WHERE. Cada filtro opcional añade su condición cuando llega.'],
    [/\.orderBy\(/,'ORDER BY','Ordena por la columna y el sentido indicados, igual que en SQL.'],
    [/\.getMany\(/,'Ejecutar: varias Entities','Ejecuta el SELECT y transforma las filas en una colección de Entities con sus relaciones.'],
    [/\.getOneOrFail\(/,'Ejecutar: una Entity','Ejecuta el SELECT para recuperar una Entity existente por su ID.'],
    [/TypeOrmModule\.forRoot\(/,'Conexión TypeORM','forRoot configura la conexión de NestJS con PostgreSQL.'],
    [/process\.env\.DB_HOST/,'Servidor local','El host se lee de .env; localhost apunta al equipo donde corre el backend.'],
    [/process\.env\.DB_PORT/,'Puerto y usuario','La configuración utiliza el puerto y usuario de PostgreSQL indicados en .env.'],
    [/password:.*process\.env\.DB_PASSWORD/,'Contraseña','La contraseña se lee del entorno: debe coincidir con la configurada en PostgreSQL.'],
    [/database:.*process\.env\.DB_NAME/,'Base de datos','DB_NAME selecciona la base local de este apartado.'],
    [/autoLoadEntities:/,'Cargar entidades','Recoge las entidades registradas mediante TypeOrmModule.forFeature.'],
    [/synchronize:/,'Crear el esquema','Sincroniza las tablas con las Entities en esta base local de práctica.'],
    [/TypeOrmModule\.forFeature\(/,'Registrar entidades','Registra las entidades y sus repositorios en el módulo de esta práctica.'],
    [/@InjectRepository\(/,'Inyectar Repository','El Service recibe el Repository de esta Entity para consultar y guardar datos.'],
    [/@PrimaryGeneratedColumn/,'Clave primaria','Declara el identificador generado por PostgreSQL.'],
    [/@Column/,'Columna persistente','Esta propiedad forma parte de la tabla; debe coincidir con lo que transporta la aplicación.'],
    [/@ManyToOne/,'Relación y FK','El lado ManyToOne contiene la clave foránea hacia la otra entidad.'],
    [/@OneToMany/,'Colección relacionada','Representa el lado inverso: una entidad tiene varias filas relacionadas.'],
    [/@OneToOne/,'Relación 1:1','La referencia única limita la asociación a una fila por entidad.'],
    [/@ManyToMany/,'Relación N:M','Vincula varias filas de cada lado mediante una tabla de asociaciones.'],
    [/@JoinTable/,'Tabla intermedia','Define el lado propietario y la tabla que conserva las asociaciones N:M.'],
    [/@JoinColumn/,'Nombre de la FK','Indica la columna de unión que aparece en PostgreSQL.'],
    [/constructor.*DataSource/,'Conexión inyectada','NestJS inyecta la conexión TypeORM para realizar la comprobación de salud.'],
    [/\.query\(.*SELECT current_database/,'Comprobación real','Esta consulta confirma qué base está usando realmente la conexión.'],
    [/@Get\(/,'Ruta GET','Declara el endpoint HTTP de lectura indicado por la ruta.'],
    [/@Post\(/,'Ruta POST','Recibe datos de creación en el body y llama al Service.'],
    [/@Patch\(/,'Ruta PATCH','Recibe un cambio parcial conservando los campos que no se envían.'],
    [/@Delete\(/,'Ruta DELETE','Recibe la eliminación de un registro o de una asociación.'],
    [/\.find(?:One|By|OneBy)?\(/,'Consultar','El Repository recupera filas de PostgreSQL; revisa filtros y relaciones.'],
    [/\.create\(/,'Preparar la Entity','create construye una instancia; todavía falta guardarla con save.'],
    [/\.save\(/,'Guardar','save escribe los cambios en PostgreSQL.'],
    [/\.delete\(/,'Eliminar','delete elimina filas persistentes; comprueba el efecto sobre las relaciones.'],
    [/await fetch\(/,'Petición desde pantalla','La interfaz envía una petición HTTP a la API.'],
    [/if \(!response\.ok\)/,'Comprobar HTTP','Revisa el estado HTTP antes de tratar la respuesta como correcta.'],
    [/controllers:.*\[/,'Registrar Controller','El módulo declara los controladores que atienden sus rutas.'],
    [/providers:.*\[/,'Registrar Service','El módulo registra los servicios que NestJS puede inyectar.']
  ];
  function additions(before,after) {
    if(typeof before!=='string')return new Set();
    const a=before.split('\n'),b=after.split('\n');
    const table=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));
    for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)table[i][j]=a[i]===b[j]?table[i+1][j+1]+1:Math.max(table[i+1][j],table[i][j+1]);
    const result=new Set();let i=0,j=0;
    while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;}else if(table[i+1][j]>=table[i][j+1])i++;else result.add(++j);}
    while(j<b.length)result.add(++j);
    return result;
  }
  function annotate(code,previous){
    const lines=code.split('\n'), notes=[], important=new Map(),seen=new Set();
    lines.forEach((line,i)=>{for(const [pattern,label,explanation] of rules){if(pattern.test(line)){if(!important.has(i+1))important.set(i+1,[]);important.get(i+1).push(explanation);if(!seen.has(label)){notes.push({line:i+1,label,explanation});seen.add(label);}}}});
    const changed=additions(previous,code);
    const meaningful=[...changed].filter(n=>lines[n-1]?.trim());
    if(meaningful.length)notes.unshift({line:meaningful[0],label:'Añadido en esta fase',explanation:'Las líneas con fondo resaltado se han añadido o cambiado respecto al archivo del paso anterior.'});
    return {notes,important,changed};
  }
  return {annotate};
})();
