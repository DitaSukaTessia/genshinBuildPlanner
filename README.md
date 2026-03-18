# Genshin Build Planner

A clean starter MVP for a **Genshin Build Planner** web app with a React + Tailwind frontend and a FastAPI backend.

## Project Structure

```text
frontend/
  src/
    components/
    pages/
    data/
backend/
  main.py
  routes/
  services/
  data/
```

## Features

- Character dropdown selector
- Recommended weapon, artifact set, and main stat priority display
- FastAPI REST API backed by JSON files
- Extension-friendly structure for future Enka API, AI recommendation, and auth work

## Run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### Backend endpoints

- `GET /`
- `GET /characters`
- `GET /characters/{name}`

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://127.0.0.1:5173`.

## Future-ready extension ideas

- Add a frontend API client layer to consume FastAPI instead of local JSON
- Create `backend/services/enka_service.py` for Enka.Network UID lookups
- Add an AI recommendation service module with prompt and scoring logic
- Add auth routes and protected user build persistence when a database is introduced
