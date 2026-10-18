# Ejercicio 04 · Food Spots

## Objetivo
POST, @Body(), DTO, repository.create() y repository.save().

## Base de datos
`databridge_e04`

## Endpoint protagonista
`POST /restaurantes`

## Antes de empezar
Recupera lo aprendido en los ejercicios anteriores. No avances hasta que Node, NestJS, PostgreSQL y la base de datos de esta isla funcionen.

## Solución base
La web docente muestra una versión base que permite aprender el concepto principal sin resolver todavía el reto.

## Modifícalo
Añadir precioMedio desde el formulario hasta PostgreSQL.

## Pruebas mínimas
- curl -i -X POST http://localhost:3000/restaurantes ...
- Entrar con `psql -U postgres -d databridge_e04`.
- Comprobar directamente las filas de la tabla.
- Reiniciar NestJS y confirmar que la persistencia sigue siendo coherente.
- Probar el frontend con Expo usando la IPv4 del PC.

## Recorrido
React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.
