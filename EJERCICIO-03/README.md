# Ejercicio 03 · Pet Profile

## Objetivo
Path Param, @Param, ParseIntPipe, findOneBy() y 404.

## Base de datos
`databridge_e03`

## Endpoint protagonista
`GET /mascotas/:id`

## Antes de empezar
Recupera lo aprendido en los ejercicios anteriores. No avances hasta que Node, NestJS, PostgreSQL y la base de datos de esta isla funcionen.

## Solución base
La web docente muestra una versión base que permite aprender el concepto principal sin resolver todavía el reto.

## Modifícalo
Añadir nivelEnergia desde Entity hasta la ficha móvil.

## Pruebas mínimas
- curl -i http://localhost:3000/mascotas/1
- Entrar con `psql -U postgres -d databridge_e03`.
- Comprobar directamente las filas de la tabla.
- Reiniciar NestJS y confirmar que la persistencia sigue siendo coherente.
- Probar el frontend con Expo usando la IPv4 del PC.

## Recorrido
React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.
