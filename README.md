# ai-chat
A basic chat app with some AI functionality

## Features

### Feature summary

- ✅ Two chat views. One for simple humans. One with an AI assistant.
- ✅ Realtime WebSocket updates between multiple "users"/browser tabs
- ✅ Persisted Chat Messages via Postgres
- ✅ Conversation-aware responses from the AI assistant.
- ✅ HTTPS/WSS encrypted communication between UI <-> Server <-> AI Assistant

### Feature Roadmap

- 🟨 Proper User Signup & Login
- 🟨 User Chatroom Creation & Management
- 🟨 Browser Notifications

### Development & Tooling Roadmap
- 🟨 Properly set up TypeScript for a monorepo. Having duplicate types and different TypeScript versions between the UI and API is really annoying. IDEs get quite-confused.
- 🟨 HTTPS for the UI
- 🟨 Proper logging system with different logging levels and output targets.

## Your way around the repo

### Repo Structure

A basic docker-compose structure, with a few containers

- UI - `~/packages/frontend`. This is our React UI. Access it on `localhost:${FRONTEND_PORT}`
- API - `~/packages/backend`. This is our Nest Backend. Access it on `localhost:${BACKEND_PORT}`
- postgres-db. A Postgres instance. Access it on port `${DB_PORT}`
- pgadmin - A Posgres Admin web UI. `localhost:${PGADMIN_PORT}`.

The `~/.env` file contains some port numbers and configuration

### How to run

- Install `docker` & `docker-compose`
- Set up HTTPS
  - Install `mkcert`. This will depend on your OS. Visit the [mkcert github](https://github.com/FiloSottile/mkcert) for instructions.
    ```shell
    mkcert -install               # Install a local Certificate Authority
    cd packages/backend/certs     # Navigate to where the keys are read from
    mkcert localhost              # Generate certificate keys
    ```
- Fill in your API key for the AI Assistant. This is read from `~/.secrets` file in the root of the repo.
    ```shell
    # From repo root:
    echo "AI_API_KEY=<your-api-key>" > .secrets
    ```

- Run the project
  
  ```shell
  # From repo root:
  docker-compose down -v && docker-compose up --build --remove-orphans
  ```

### Debugging

#### API

You can debug the Nest API with your favorite node debugger on the standard `localhost:9229` socket. The ports are piped into the container and the Nest app is started in debug mode so it should work seamlessly.

You can also change the start command for the API in the `~/packages/backend/Dockerfile` to something whatever suits you e.g. If you want to debug something during the API startup, you can use `npm run start:debug:brk`

#### UI

You can debug the UI directly in any browser dev tools.