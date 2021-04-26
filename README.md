# PUSH | Reach your goals togehter in competition

A dev project aming to create a competitive platform for achieving live and
habit goals together.

- DB: Mongo
- API: Express.js
- Frontend: Nuxt.js

## Setup
You need to have Docker installed on your system to run this project.

1. Clone repository
2. Run `make` to start Docker containers
3. Run `make install-dependencies` to install dependencies inside containers

## Development
Run `make` to start Docker containers.

To start the api server run `make docker-attach-api` to attach your shell to the
api container and then `npm start` from inside the container. This will start a
server on `localhost:3000`.

Same goes for the frontend with `make docker-attach-frontend` followed by
`npm run dev` from inside the container. This will start a dev server
on `localhost`.

Run `exit` to leave containers and `make docker-stop` in project root to
shut down all docker containers after a dev session.
