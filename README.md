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

- Character dropdown selector with local starter build data
- Recommended weapon, artifact set, and main stat priority display
- FastAPI REST API backed by JSON files
- UID analysis endpoint backed by Enka.Network
- Build scoring system for quick crit-based evaluation
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
- `GET /uid/{uid}`

### UID analysis response shape

```json
{
  "uid": "618285856",
  "ttl": 300,
  "characters": [
    {
      "name": "Hu Tao",
      "level": 90,
      "weapon": "Staff of Homa",
      "artifact_sets": ["Crimson Witch"],
      "stats": {
        "crit_rate": 65,
        "crit_dmg": 180,
        "atk": 1240
      },
      "score": 99,
      "analysis": [
        "Good CRIT Rate range",
        "CRIT DMG is in a healthy range",
        "CRIT ratio is far from the 1:2 target",
        "ATK is acceptable"
      ]
    }
  ]
}
```

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://127.0.0.1:5173`.

### Optional frontend env

If your backend runs on a different host or port, create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Notes on Enka integration

- The backend uses `GET https://enka.network/api/uid/{uid}` with an async `httpx` client.
- It handles invalid UIDs, missing showcases, timeouts, and common upstream Enka status codes.
- The parser is intentionally modular so you can later swap in richer character metadata or AI-driven scoring.

## Future-ready extension ideas

- Add a frontend API client layer shared across pages/components
- Add richer stat and artifact parsing from Enka metadata assets
- Replace heuristic scoring with per-character build rules or AI recommendations
- Add auth routes and protected user build persistence when a database is introduced
