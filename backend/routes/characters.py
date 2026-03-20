from fastapi import APIRouter, HTTPException

from services.character_service import get_character_by_name, list_characters

router = APIRouter(prefix="/characters", tags=["characters"])


@router.get("")
def get_characters() -> list[dict]:
    return list_characters()


@router.get("/{name}")
def get_character(name: str) -> dict:
    character = get_character_by_name(name)
    if character is None:
        raise HTTPException(status_code=404, detail=f"Character '{name}' not found")
    return character
