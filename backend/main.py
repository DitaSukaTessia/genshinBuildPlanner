from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.characters import router as character_router
from routes.uid import router as uid_router

app = FastAPI(
    title="Genshin Account Analyzer API",
    description="API for starter build recommendations and cleaned Enka-based account analysis.",
    version="0.3.0",
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
    return {"status": "ok", "message": "Genshin Account Analyzer API is running."}
