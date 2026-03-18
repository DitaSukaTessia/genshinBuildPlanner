from fastapi import APIRouter

from services.enka_service import fetch_and_parse_uid

router = APIRouter(prefix="/uid", tags=["uid"])


@router.get("/{uid}")
async def get_uid_analysis(uid: str) -> dict:
    return await fetch_and_parse_uid(uid)
