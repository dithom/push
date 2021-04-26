# PUSH | Reach your goals in competition

A dev project aming to create a competitive platform for achieving live and habit goals together.

- DB: Mongo
- API: Express.js
- Frontend: Nuxt.js

## Setup
1. Clone repository
2. run `make`
3. run `make install-dependencies`

## Development
To start a dev server for the api run `make docker-ssh-api` and then `npm start` from inside the api container.

Same goes for the frontend with `make docker-ssh-frontend` followed by `npm run dev` from inside the frontend container.
