# Ejercicio 08 · My Playlists

## Objetivo
OneToMany, ManyToOne, clave foránea y relations.

## Base de datos
`databridge_e08`

## Endpoint protagonista
`GET /playlists/:id`

## Antes de empezar
Recupera lo aprendido en los ejercicios anteriores. No avances hasta que Node, NestJS, PostgreSQL y la base de datos de esta isla funcionen.

## Solución base
La web docente muestra una versión base que permite aprender el concepto principal sin resolver todavía el reto.

## Modifícalo
Añadir una canción a una playlist concreta.

## Pruebas mínimas
- curl -i http://localhost:3000/playlists/1
- Entrar con `psql -U postgres -d databridge_e08`.
- Comprobar directamente las filas de la tabla.
- Reiniciar NestJS y confirmar que la persistencia sigue siendo coherente.
- Probar el frontend con Expo usando la IPv4 del PC.

## Recorrido
React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.
