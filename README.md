# Docker Compose 3-Tier App

A 3-tier application (React + FastAPI + MySQL) containerized end-to-end with
Docker, built as a hands-on exercise for Docker and Docker Compose fundamentals —
multi-stage builds, service networking, healthchecks, volumes, and environment
variable management.

The app itself (a to-do list) is intentionally simple. The focus here is the
containerization and orchestration setup, not the application logic.

## Architecture

- **frontend** — React app, built in a Node stage and served via nginx in a
  separate, smaller final image (multi-stage build)
- **backend** — FastAPI app running on Uvicorn, connects to MySQL via SQLAlchemy
- **mysql** — official MySQL 8 image, data persisted via a named volume

## Project structure

Docker_compose_3_Tier_App/
├── backend/
│ ├── Dockerfile
│ ├── requirements.txt
│ └── ...
├── frontend/
│ ├── Dockerfile
│ ├── package.json
│ └── ...
├── docker-compose.yml
├── .env.example
└── .gitignore


## Docker setup

- Each service has its own `Dockerfile`, kept inside its own folder so the
  images build independently of each other.
- The frontend uses a **multi-stage build** — `node:20-alpine` to install deps
  and run `npm run build`, then the static output is copied into an
  `nginx:alpine` image for serving. Keeps the final image small and avoids
  shipping `node_modules` to production.
- The backend uses `python:3.12-slim` with system deps needed for
  `mysqlclient`/`cryptography`, installs from `requirements.txt`, and runs
  Uvicorn.
- `docker-compose.yml` wires all three services together on a shared network,
  services reach each other by **service name** (`mysql`, `backend`), not
  `localhost`.
- MySQL has a `healthcheck` (`mysqladmin ping`), and the backend uses
  `depends_on: condition: service_healthy` so it doesn't try to connect
  before MySQL is actually ready to accept connections — `depends_on` alone
  only waits for the container to start, not for the service inside to be
  ready.
- MySQL data is persisted with a named volume (`mysql_data`), so data
  survives `docker compose down` (removed only with `docker compose down -v`).
- `REACT_APP_API_URL` is passed as a **build arg** to the frontend, since
  Create React App bakes env vars in at build time, not runtime.
- All credentials/config are pulled from a `.env` file at the project root
  via `${VARIABLE}` substitution in `docker-compose.yml` — nothing hardcoded
  in the compose file itself.

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/thepratham21/Docker_compose_3_Tier_App.git
cd Docker_compose_3_Tier_App
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` if you want different credentials — defaults work fine for local use.

### 3. Build and run

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend (Swagger docs): http://localhost:8000/docs
- MySQL: `localhost:3306` (connect with any MySQL client if needed)

### 4. Tear down

```bash
docker compose down       # stop and remove containers
docker compose down -v    # also remove the MySQL volume
```