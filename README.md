# PUSH | Reach your goals togehter in competition

A dev project aming to create a competitive platform for achieving live and
habit goals together.

- DB: Mongo
- API: Express.js
- Frontend: Nuxt.js

## Setup
You need to have docker installed on your system to run this project.

1. Clone repository
2. Run `make`
3. Run `make install-dependencies`

## Development
Run `make` to start docker containers.

To start the api server run `make docker-ssh-api` and then
`npm start` from inside the api container. This will start the server on
`localhost:3000`.

Same goes for the frontend with `make docker-ssh-frontend` followed by
`npm run dev` from inside the frontend container. This will start a dev server
on `localhost`.

Run `exit` to leave containers and `make docker-stop` in project root to
shut down docker containers after a dev session.
