# Genshin Build Planner

A clean starter MVP for a **Genshin Account Analyzer** web app with a React + Tailwind frontend and a FastAPI backend.

## Project Structure

```text
frontend/
  src/
    components/
    pages/
backend/
  main.py
  routes/
  services/
  data/
    enka_store/
```

## Features

- UID-driven account analysis powered by Enka.Network
- Player header with profile image, UID, AR, WL, Spiral Abyss, and Imaginarium Theater
- Character-focus layout with a sidebar selector and one main detail panel
- Interactive constellations, talent icons, weapon hover details, and artifact detail modal
- Official Enka dataset mapping for readable English character names, icons, and fallback-safe image URLs
- Build scoring, weapon summary, artifact set summary, and readable stats

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
  "player": {
    "nickname": "Traveler",
    "uid": "618285856",
    "adventure_rank": 60,
    "world_level": 8,
    "profile_picture": "https://enka.network/ui/UI_AvatarIcon_Hutao.png",
    "spiral_abyss": "Floor 12-3",
    "imaginarium_theater": "Act 6"
  },
  "characters": [
    {
      "name": "Hu Tao",
      "image": "https://enka.network/ui/UI_AvatarIcon_Hutao.png",
      "level": 90,
      "constellation": 3,
      "constellations": [
        { "label": "C1", "icon": "...", "unlocked": true }
      ],
      "weapon": {
        "name": "Staff of Homa",
        "image": "https://enka.network/ui/UI_EquipIcon_Pole_Homa.png",
        "level": 90,
        "refinement": 5,
        "main_stat": "CRIT DMG 66.2%",
        "stats": ["Base ATK 608.0", "CRIT DMG 66.2%"]
      },
      "talents": [
        { "label": "Normal Attack", "level": 10, "icon": "..." }
      ],
      "artifacts": [
        { "slot": "Flower", "name": "Witch's Flower of Blaze", "main_stat": "HP 4780.0" }
      ],
      "score": 99
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
- Character names, skill order, constellation icons, and icon internal names are resolved from the official Enka `store/characters.json`, `store/loc.json`, and `store/gi/avatars.json` files bundled in `backend/data/enka_store/`.
- The parser returns UI-ready player and character detail data instead of a raw Enka payload.
