# Ejercicio 05 · Travel Book

## Objetivo
PATCH, DTO opcional, merge() y save().

## Base de datos
`databridge_e05`

## Endpoint protagonista
`PATCH /viajes/:id`

## Antes de empezar
Recupera lo aprendido en los ejercicios anteriores. No avances hasta que Node, NestJS, PostgreSQL y la base de datos de esta isla funcionen.

## Solución base
La web docente muestra una versión base que permite aprender el concepto principal sin resolver todavía el reto.

## Modifícalo
Permitir editar también fecha y comprobar persistencia.

## Pruebas mínimas
- curl -i -X PATCH http://localhost:3000/viajes/1 ...
- Entrar con `psql -U postgres -d databridge_e05`.
- Comprobar directamente las filas de la tabla.
- Reiniciar NestJS y confirmar que la persistencia sigue siendo coherente.
- Probar el frontend con Expo usando la IPv4 del PC.

## Recorrido
React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.
