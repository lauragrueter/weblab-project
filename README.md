# fitlog - WEBLAB Projekt

Dieses Projekt wurde im Rahmen der Blockwoche „WEBLAB” des Bachelor-Studiengangs „Computer Science” der Hochschule Luzern für das Frühlingssemester 2026 erstellt.

# Start production

```shell
docker compose up --build
```

## URL

`http://localhost/`

# Dev

## run DB

in `infra`

```bash
docker compose up
```

## Compile and run the backend project

Vorher `.env` im `backend`-Ordner anlegen (siehe `.env.example`) oder die DB via `infra`-Docker-Compose starten.

in `backend`

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Compile and run the frontend project

in `frontend`

```bash
ng serve
```

## URL

fitlog Backend:

- http://localhost:3000/api/categories
- http://localhost:3000/api/workouts

Swagger: http://localhost:3000/api/swagger

fitlog app: http://localhost:4200/

## run tests

`frontend`

```bash
ng test
```

`backend`

```bash
npm test
```

## run e2e Tests

Terminal

```bash
npm run e2e
```

interaktiver Cypress-Runner

```bash
npm run cypress:open
```
