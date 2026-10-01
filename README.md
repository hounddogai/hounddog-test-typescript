# HoundDog.ai Test Repository: TypeScript

A healthcare app where doctors manage patients and their visits. It is a scan target for the
[HoundDog.ai](https://hounddog.ai) scanner, so its code deliberately leaks fake sensitive data. Do not deploy it or copy
its patterns.

## Tech stack

- `client/`: TypeScript, React 19, React Router 8 (framework mode), Vite, Tailwind CSS 4
- `server/`: JavaScript (ES modules) on Express 5, with patient data kept in memory
- Node.js 24 (see `.nvmrc`), npm, Biome

## Run

```sh
docker compose up -d --wait
```

Open <http://localhost:5173>; the API listens on <http://localhost:5174>. Set `CLIENT_PORT` and `SERVER_PORT` to use
other ports. To run without Docker, start `cd server && npm ci && npm run dev` and `cd client && npm ci && npm run dev`
in two terminals.

## Check

```sh
cd client && npm ci && npm run typecheck && npm run lint && npm run format:check && npm run build
cd server && npm ci && npm run lint && npm run format:check && npm test
```
