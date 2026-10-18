# Ejercicio 07 · Sneaker Vault

## Objetivo
Integración GET, POST, PATCH y DELETE.

## Base de datos
`databridge_e07`

## Endpoint protagonista
`CRUD /sneakers`

## Antes de empezar
Recupera lo aprendido en los ejercicios anteriores. No avances hasta que Node, NestJS, PostgreSQL y la base de datos de esta isla funcionen.

## Solución base
La web docente muestra una versión base que permite aprender el concepto principal sin resolver todavía el reto.

## Modifícalo
Añadir stock y mostrar AGOTADO cuando stock = 0.

## Pruebas mínimas
- Probar POST → GET → PATCH → DELETE con curl.
- Entrar con `psql -U postgres -d databridge_e07`.
- Comprobar directamente las filas de la tabla.
- Reiniciar NestJS y confirmar que la persistencia sigue siendo coherente.
- Probar el frontend con Expo usando la IPv4 del PC.

## Recorrido
React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.
