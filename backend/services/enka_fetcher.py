from __future__ import annotations

from typing import Any

import httpx
from fastapi import HTTPException

ENKA_API_BASE_URL = "https://enka.network/api/uid"
REQUEST_HEADERS = {
    "User-Agent": "GenshinAccountAnalyzer/0.3 (+https://example.local)",
    "Accept": "application/json",
}
STATUS_CODE_DETAILS = {
    400: "Invalid UID format.",
    404: "UID not found on the game server or showcase is private.",
    424: "Enka.Network or the game servers appear to be under maintenance.",
    429: "Enka.Network rate limit reached. Please try again shortly.",
    500: "Enka.Network returned a server error.",
    503: "Enka.Network is temporarily unavailable.",
}


async def fetch_uid_showcase(uid: str) -> dict[str, Any]:
    normalized_uid = uid.strip()
    if not normalized_uid.isdigit() or len(normalized_uid) < 9:
        raise HTTPException(status_code=400, detail="UID must be a numeric value with at least 9 digits.")

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=10.0)) as client:
            response = await client.get(f"{ENKA_API_BASE_URL}/{normalized_uid}", headers=REQUEST_HEADERS)
    except httpx.TimeoutException as exc:
        raise HTTPException(status_code=504, detail="Timed out while contacting Enka.Network.") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Failed to contact Enka.Network.") from exc

    if response.status_code != 200:
        detail = STATUS_CODE_DETAILS.get(response.status_code, "Unexpected error returned from Enka.Network.")
        raise HTTPException(status_code=response.status_code, detail=detail)

    data = response.json()
    if not data.get("avatarInfoList"):
        raise HTTPException(
            status_code=404,
            detail="This UID has no public showcase data. The account may be private or empty.",
        )

    return data
