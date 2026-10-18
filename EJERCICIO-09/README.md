# Ejercicio 09 · Event Radar

## Objetivo
Query Params, @Query y filtros where.

## Base de datos
`databridge_e09`

## Endpoint protagonista
`GET /eventos?ciudad=Zaragoza`

## Antes de empezar
Recupera lo aprendido en los ejercicios anteriores. No avances hasta que Node, NestJS, PostgreSQL y la base de datos de esta isla funcionen.

## Solución base
La web docente muestra una versión base que permite aprender el concepto principal sin resolver todavía el reto.

## Modifícalo
Combinar ciudad + categoria en la misma consulta.

## Pruebas mínimas
- curl -i "http://localhost:3000/eventos?ciudad=Zaragoza"
- Entrar con `psql -U postgres -d databridge_e09`.
- Comprobar directamente las filas de la tabla.
- Reiniciar NestJS y confirmar que la persistencia sigue siendo coherente.
- Probar el frontend con Expo usando la IPv4 del PC.

## Recorrido
React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.
