import {digest} from './common.mjs';
export const REQUIREMENTS_VERSION='1N-5-7-10-v2';
export function blocks(c){const p=c.parent,ch=c.child,m=ch.metric;
 return [
  {id:'base',title:'Hasta 5 · Modelo, API de lectura y pantalla',maximum:5,items:[
   `Crea las Entities ${p.entity} y ${ch.entity}, con PK id autogenerada. ${p.entity} tiene nombre; ${ch.entity} tiene nombre y ${m} (entero).`,
   `Modela ambos lados de la relación 1:N. Cada registro de ${ch.entity} referencia un registro de ${p.entity}; la FK obligatoria ${ch.foreignKey} está en ${ch.table}.`,
   `Conecta con PostgreSQL local (${c.database}), registra las Entities y los Repository con TypeORM y registra Service y Controller en el módulo.`,
   `Implementa GET /${p.table} y GET /${ch.table}. El Controller delega en el Service y el Service consulta con Repository y QueryBuilder, siguiendo SELECT, LEFT JOIN y ORDER BY id ascendente. La colección dependiente incluye los datos de su principal.`,
   `Introduce con SQL al menos dos ${p.table} y tres ${ch.table}, repartidos entre ambos. Comprueba sus IDs, datos y FK y consulta esos mismos registros desde la API. En este bloque los datos se cargan con SQL.`,
   `En React Native consulta GET /${ch.table} y muestra la colección con nombre, ${ch.metricLabel.toLowerCase()} y nombre del principal relacionado. Incluye un botón Consultar que vuelva a pedir los datos a la API.`,
   `Aporta una captura de la pantalla, otra de los datos y FK en PostgreSQL y una petición GET desde Git Bash. Identifica tu caso, correo y sesión.`
  ]},
  {id:'medio',title:'Hasta 7 · Crear y relacionar desde la aplicación',maximum:7,items:[
   `Conserva el bloque anterior. Añade POST /${p.table}, que recibe nombre, y POST /${ch.table}, que recibe nombre, ${m} y ${ch.parentInput}.`,
   `En el Service resuelve ${ch.parentInput} a un registro principal existente y guarda la Entity dependiente con esa relación usando Repository. Comprueba que PostgreSQL conserva la FK correcta.`,
   `En React Native añade los dos formularios: crear ${p.entity} y crear ${ch.entity}. El formulario dependiente permite seleccionar el principal consultado desde la API.`,
   `Envía los formularios con fetch, guarda los datos en PostgreSQL y vuelve a consultar la colección tras cada alta. El nuevo dependiente debe mostrar el nombre del principal que seleccionaste.`,
   `Crea desde la aplicación al menos un principal nuevo y un dependiente asociado a él. Demuestra el mismo ID y FK en la respuesta de la API, la pantalla y SQL.`
  ]},
  {id:'completo',title:'Hasta 10 · Editar y eliminar',maximum:10,items:[
   `Conserva los bloques anteriores. Añade PATCH /${ch.table}/:id para modificar nombre y/o ${m}. Los campos no enviados conservan su valor.`,
   `Añade DELETE /${ch.table}/:id para eliminar un registro dependiente. El principal relacionado y los demás registros deben conservarse.`,
   `En React Native añade Editar y Eliminar a cada tarjeta. La edición permite cambiar nombre y ${ch.metricLabel.toLowerCase()}; al guardar o eliminar, vuelve a consultar la API para actualizar la pantalla.`,
   `Demuestra con peticiones y SQL una modificación parcial y una eliminación. Comprueba que el campo no modificado, la FK, el principal y los demás registros conservan sus valores.`,
   `Guarda capturas coherentes, peticiones de Git Bash, consultas SQL, historial de terminal y el SHA del commit de cierre. Explica al profesor el recorrido pantalla → Controller → Service → Repository → PostgreSQL y localiza la FK.`
  ]}
 ];
}
export async function caseFor(email,data){const id=data.assignments[await digest(email.trim().toLowerCase())];const c=data.cases.find(c=>c.id===id);if(!c)throw Error('Este correo no tiene una tarjeta asignada.');return c;}
