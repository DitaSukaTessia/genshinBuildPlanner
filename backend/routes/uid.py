from fastapi import APIRouter

from services.enka_fetcher import fetch_uid_showcase
from services.enka_parser import parse_showcase

router = APIRouter(prefix="/uid", tags=["uid"])


@router.get("/{uid}")
async def get_uid_analysis(uid: str) -> dict:
    raw_data = await fetch_uid_showcase(uid)
    return parse_showcase(raw_data, uid)
