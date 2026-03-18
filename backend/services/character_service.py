from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "characters.json"


def load_characters() -> list[dict[str, Any]]:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def list_characters() -> list[dict[str, Any]]:
    return load_characters()


def get_character_by_name(name: str) -> dict[str, Any] | None:
    normalized_name = name.strip().casefold()
    return next(
        (character for character in load_characters() if character["name"].casefold() == normalized_name),
        None,
    )
