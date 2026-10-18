# Ejercicio 06 · My Library

## Objetivo
DELETE y sincronización entre PostgreSQL y estado React.

## Base de datos
`databridge_e06`

## Endpoint protagonista
`DELETE /libros/:id`

## Antes de empezar
Recupera lo aprendido en los ejercicios anteriores. No avances hasta que Node, NestJS, PostgreSQL y la base de datos de esta isla funcionen.

## Solución base
La web docente muestra una versión base que permite aprender el concepto principal sin resolver todavía el reto.

## Modifícalo
Añadir Marcar como leído mediante PATCH.

## Pruebas mínimas
- curl -i -X DELETE http://localhost:3000/libros/1
- Entrar con `psql -U postgres -d databridge_e06`.
- Comprobar directamente las filas de la tabla.
- Reiniciar NestJS y confirmar que la persistencia sigue siendo coherente.
- Probar el frontend con Expo usando la IPv4 del PC.

## Recorrido
React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.
