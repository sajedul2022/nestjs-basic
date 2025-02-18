

## Project setup

```bash
$ npm install --legacy-peer-deps
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker
```bash
$ docker compose up --build
```
#OR
```bash
docker compose build
docker compose up
```
# Get your container id 
```bash
$ docker exec -it container_id sh
```

## Create Module & Migration 

```bash
# Create Module
$ npm run generate:crud notes

# Create Migration Table File
$ npm run migration:generate --name="createNoticeTable"

# Migration Run
npm run migration:run
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

