# Genshin Build Planner

A clean starter MVP for a **Genshin Account Analyzer** web app with a React + Tailwind frontend and a FastAPI backend.

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
    enka_store/
```

## Features

- Character dropdown selector with local starter build data
- UID-driven account analysis powered by Enka.Network
- Official Enka dataset mapping for readable English character names
- Dynamic character image URLs generated from Enka icon metadata
- Build scoring system for quick crit-based evaluation
- Responsive card-based UI with loading and error states

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

### Example UID analysis response

```json
{
  "uid": "618285856",
  "ttl": 300,
  "player": {
    "nickname": "Traveler",
    "signature": "Pyro supremacy",
    "level": 60,
    "world_level": 8
  },
  "characters": [
    {
      "name": "Hu Tao",
      "image": "https://enka.network/ui/UI_AvatarIcon_Hutao.png",
      "level": 90,
      "weapon": "Staff of Homa",
      "artifact_sets": ["Crimson Witch of Flames"],
      "stats": {
        "hp": 22000,
        "atk": 1240,
        "crit_rate": 65,
        "crit_dmg": 180,
        "energy_recharge": 120
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

- The backend fetches live account data from `GET https://enka.network/api/uid/{uid}`.
- Character names and icon internal names are resolved from the official Enka `store/characters.json` and `store/loc.json` files bundled in `backend/data/enka_store/`.
- Character images are generated in the format `https://enka.network/ui/UI_AvatarIcon_{CharacterName}.png`.
- The parser returns only cleaned frontend-ready data rather than the raw Enka payload.

## Future-ready extension ideas

- Add richer weapon/artifact metadata resolution from the full Enka store
- Replace heuristic scoring with per-character rules or AI recommendations
- Add auth routes and protected user build persistence when a database is introduced
