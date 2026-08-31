# To-Do List App (FastAPI + React + MySQL)

Two independent folders, meant to become two separate Docker images (plus a third
container for MySQL that you'll add yourself):

```
todo-app/
├── backend/     # FastAPI + SQLAlchemy + PyMySQL
└── frontend/    # React (Create React App) + axios
```

No Dockerfiles or docker-compose.yml are included on purpose — this is left for you
to write as practice. Below is what each service expects so your Dockerfiles line up.

## backend/

Reads DB connection info from environment variables (see `.env.example`):

- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`

When containerized, `DB_HOST` should be the MySQL container's **service name**
(e.g. `mysql`) since Docker containers on the same network resolve each other by
container/service name, not `localhost`.

On startup, the app calls `models.Base.metadata.create_all()`, which creates the
`tasks` table automatically — no manual migration needed. Note: if the backend
container starts before MySQL is ready to accept connections, it will fail on
startup. For real Docker Compose setups you'll want a healthcheck or a retry/wait
step (e.g. `depends_on: condition: service_healthy`, or a wait-for-it script).

Run locally without Docker (for testing before you containerize):
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export DB_HOST=localhost DB_USER=root DB_PASSWORD=password DB_NAME=tododb
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at `http://localhost:8000/docs` once running.

## frontend/

Reads the backend URL from `REACT_APP_API_URL` (defaults to `http://localhost:8000`
if unset). Since this is a build-time env var for Create React App, you'll need to
pass it as a build arg in your Dockerfile if you want it baked into the production
build, or just rely on the default and publish the backend on `localhost:8000`.

Run locally without Docker:
```bash
cd frontend
npm install
npm start
```

Opens at `http://localhost:3000`.

## MySQL

Create a database named `tododb` (or whatever you set `DB_NAME` to) — the backend
creates the `tasks` table itself on startup, so you don't need to create tables
manually, just the empty database/schema.

## API endpoints

| Method | Path          | Description       |
|--------|---------------|--------------------|
| GET    | /tasks        | List all tasks     |
| GET    | /tasks/{id}   | Get one task       |
| POST   | /tasks        | Create a task       |
| PUT    | /tasks/{id}   | Update a task       |
| DELETE | /tasks/{id}   | Delete a task       |
