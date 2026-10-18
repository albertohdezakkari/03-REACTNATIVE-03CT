# Preparación desde cero · Windows 10 + Git Bash

Este cuaderno parte de un equipo de aula sin herramientas de desarrollo preparadas.

## 1. Instala

1. Git para Windows: https://git-scm.com/download/win
2. Node.js LTS: https://nodejs.org/en/download
3. Visual Studio Code: https://code.visualstudio.com/Download
4. PostgreSQL para Windows: https://www.postgresql.org/download/windows/
5. Expo Go: https://expo.dev/go

Durante la instalación local de PostgreSQL usa:
- usuario: postgres
- contraseña de aula: postgres
- puerto: 5432

La contraseña es únicamente para el laboratorio local. No reutilizarla en servicios reales.

## 2. Verifica en Git Bash

```bash
git --version
node --version
npm --version
code --version
psql --version
npm install -g @nestjs/cli
nest --version
```

No continúes si algún comando falla.

## 3. Verifica PostgreSQL

```bash
psql -U postgres
```

Dentro de psql:

```sql
SELECT version();
\q
```

## 4. Bases del cuaderno

Cada ejercicio es una isla y utiliza su propia base:
databridge_e01 ... databridge_e10.

Puedes crearlas una a una cuando llegues al ejercicio o ejecutar `setup/crear-bases.sql`.

## 5. Diagnóstico

- command not found: instalación o PATH.
- password authentication failed: credenciales PostgreSQL.
- database does not exist: falta crear la base.
- ECONNREFUSED: servidor, host o puerto.
- 404: ruta o método.
- 500: backend; leer terminal.
- Network request failed desde Expo: IP, red, firewall o NestJS detenido.
