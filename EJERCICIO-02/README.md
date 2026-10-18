# Ejercicio 02 · CineBox

## Objetivo
Leer una colección persistente con `repository.find()` y representarla en React Native.

## Base de datos
`databridge_e02`

## Endpoint
`GET /peliculas`

## Concepto principal
`repository.find()` recupera una colección de entidades persistidas. En este ejercicio también observamos el uso de `order` para devolver la colección ordenada por puntuación.

## Modificación
Añadir el campo `favorita` a la Entity y mostrarlo como ♡ / ♥. El valor debe proceder de PostgreSQL.

## Comprensión
El recorrido es:
React Native → HTTP → Controller → Service → Repository → TypeORM → PostgreSQL.

## Pruebas
- `curl -i http://localhost:3000/peliculas`
- `SELECT * FROM peliculas ORDER BY puntuacion DESC;`
- Reiniciar NestJS y comprobar que los registros permanecen.
