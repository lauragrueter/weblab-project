# Start production

```shell
docker compose up --build
```

# URL

`http://localhost/`

# Dev

## run DB

in `infra`

```bash
docker compose up -d
docker compose up
```

## Compile and run the backend project

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
