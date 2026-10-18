# Ejercicio 10 · Wander

## Objetivo
Transferencia Full Stack: Entity + DTO + Repository + CRUD + React Native.

## Base de datos
`databridge_e10`

## Endpoint protagonista
`CRUD /destinos`

## Antes de empezar
Recupera lo aprendido en los ejercicios anteriores. No avances hasta que Node, NestJS, PostgreSQL y la base de datos de esta isla funcionen.

## Solución base
La web docente muestra una versión base que permite aprender el concepto principal sin resolver todavía el reto.

## Modifícalo
Añadir una mejora propia coherente. Solución del profesor: prioridad + visitado.

## Pruebas mínimas
- Probar CRUD completo con curl y comprobar PostgreSQL.
- Entrar con `psql -U postgres -d databridge_e10`.
- Comprobar directamente las filas de la tabla.
- Reiniciar NestJS y confirmar que la persistencia sigue siendo coherente.
- Probar el frontend con Expo usando la IPv4 del PC.

## Recorrido
React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.
