# ai-chat
A basic chatroom with some AI functionality

## Your way around the repo

### How to run
```shell
docker-compose stop && docker-compose up --build --remove-orphans
```

### Repo Structure

We have a `.env` file. It contains some port numbers and configuration

We have a basic docker-compose structure, with a few containers

- UI - `packages/frontend/Dockerfile.local`. This is our React UI. Access it on `localhost:${BACKEND_PORT}`
- API - `packages/backend/Dockerfile.local`. This is our Nest Backend. Access it on `localhost:${FRONTEND_PORT}`
- postgres-db. A Postgres instance. Access it on port `${DB_PORT}`
- pgadmin - A Posgres Admin web UI. `localhost:${PGADMIN_PORT}`

### Debugging

You can debug the Nest API with your favorite node debugger on the standard `localhost:9229` socket. The ports are piped into the container and it should work seamlessly.

UI You can debug directly in any browser dev tools.