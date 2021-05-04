# PUSH | Reach your goals togehter in competition

A dev project aming to create a competitive platform for achieving live and
habit goals together.

- DB: [MongoDB](https://www.mongodb.com/de)
- API: [Express.js](https://expressjs.com/)
- Frontend: [Nuxt.js](https://nuxtjs.org/)

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

This project is optimized for [VS Code](https://code.visualstudio.com/). You
can install the following extensions to make linting and formatting available:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)