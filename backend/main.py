from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.characters import router as character_router
from routes.uid import router as uid_router

app = FastAPI(
    title="Genshin Build Planner API",
    description="Starter API for serving character build recommendations and UID analysis.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(character_router)
app.include_router(uid_router)


@app.get("/")
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "message": "Genshin Build Planner API is running."}
