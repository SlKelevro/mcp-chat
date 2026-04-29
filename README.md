**This project is home assignment for MCPTotal fullstack developer position.**

### Stack:
- Backend: NestJS, TypeORM, PostgreSQL
- Frontend: Vite/React

### Installation requirements:
- NodeJS/NPM
- Existing PostgreSQL instance or Docker compose

### Running:
1. If there is no pre-existing PostgreSQL instance - run `docker compose up -d` to build & run PostgreSQL docker image
2. Copy `apps/api/.env.example` to `apps/api/.env`. Change var `DB_SYNC=true`, also when using provided docker compose config - set `DB_PORT=36432`
3. Run `npm run dev` to run both apps concurrently, or `npm run dev:api` and `npm run dev:web` in separate terminal tabs to for each app.

Default app url is `http://localhost:5173/`

Default login credentials are:
```
email=admin@mcp.chat
password=admin
```

Credentials can be added/modified in `apps/api/src/config/user.config.ts`.


App was built with heavy Codex usage.

Currently LLM responses are fakes from a predefined set of answers (like the Magic 8-Ball). Real APIs can be integrated using the interfaces and decorators from [LLM](/apps/api/src/llm) module.
