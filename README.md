# PUSH | Reach your goals in competition

A dev project aming to create a competitive platform for achieving live and habit goals together.

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

To start a dev server for the api run `make docker-ssh-api` and then `npm start` from inside the api container.

Same goes for the frontend with `make docker-ssh-frontend` followed by `npm run dev` from inside the frontend container.

Run `exit` to leave containers and `make docker-stop` from project root to shut down docker containers after a dev session.
