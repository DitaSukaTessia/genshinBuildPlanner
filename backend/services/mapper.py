from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "enka_store"
AVATARS_PATH = DATA_DIR / "avatars.json"
CHARACTERS_PATH = DATA_DIR / "characters.json"
LOC_PATH = DATA_DIR / "loc.json"
ASSET_BASE_URL = "https://enka.network"
IMAGE_BASE_URL = "https://enka.network/ui"
PLACEHOLDER_IMAGE = "https://placehold.co/256x256/090B13/F8FAFC?text=Genshin+Character"


@lru_cache(maxsize=1)
def load_avatar_store() -> dict[str, dict[str, Any]]:
    with AVATARS_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


@lru_cache(maxsize=1)
def load_character_store() -> dict[str, dict[str, Any]]:
    with CHARACTERS_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


@lru_cache(maxsize=4)
def load_localization(locale: str = "en") -> dict[str, str]:
    with LOC_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)
    return data.get(locale, {})


@lru_cache(maxsize=256)
def resolve_text_map_hash(text_map_hash: Any, locale: str = "en") -> str | None:
    if text_map_hash in (None, "", 0, "0"):
        return None
    return load_localization(locale).get(str(text_map_hash))


@lru_cache(maxsize=512)
def get_character_entry(avatar_id: int | str) -> dict[str, Any] | None:
    avatar_id_str = str(avatar_id)
    return load_avatar_store().get(avatar_id_str) or load_character_store().get(avatar_id_str)


def _normalise_asset_path(asset_path: str | None) -> str | None:
    if not asset_path:
        return None
    cleaned = asset_path.removeprefix("/")
    if cleaned.startswith("http"):
        return cleaned
    return f"{ASSET_BASE_URL}/{cleaned}"


@lru_cache(maxsize=512)
def resolve_character_internal_name(avatar_id: int | str) -> str | None:
    character = get_character_entry(avatar_id)
    if not character:
        return None

    side_icon_name = character.get("SideIconName") or ""
    cleaned_name = side_icon_name.split("/")[-1].replace(".png", "")
    prefix = "UI_AvatarIcon_Side_"
    if cleaned_name.startswith(prefix):
        return cleaned_name.removeprefix(prefix)
    return None


@lru_cache(maxsize=512)
def resolve_character_name(avatar_id: int | str, locale: str = "en") -> str | None:
    character = get_character_entry(avatar_id)
    if not character:
        return None
    return resolve_text_map_hash(character.get("NameTextMapHash"), locale)


@lru_cache(maxsize=512)
def resolve_character_skill_order(avatar_id: int | str) -> list[int]:
    character = get_character_entry(avatar_id)
    if not character:
        return []
    return [int(skill_id) for skill_id in character.get("SkillOrder", [])]


@lru_cache(maxsize=512)
def resolve_character_constellation_icons(avatar_id: int | str) -> list[str]:
    character = get_character_entry(avatar_id)
    if not character:
        return []
    return [asset for asset in (_normalise_asset_path(icon) for icon in character.get("Consts", [])) if asset]


@lru_cache(maxsize=512)
def resolve_character_talent_icons(avatar_id: int | str) -> list[str]:
    character = get_character_entry(avatar_id)
    if not character:
        return []

    skills = character.get("Skills", {})
    skill_order = resolve_character_skill_order(avatar_id)
    icons: list[str] = []
    for skill_id in skill_order[:3]:
        icon = _normalise_asset_path(skills.get(str(skill_id)) or skills.get(skill_id))
        if icon:
            icons.append(icon)
    return icons


@lru_cache(maxsize=512)
def resolve_character_image(avatar_id: int | str, costume_id: int | str | None = None) -> str:
    character = get_character_entry(avatar_id)
    if not character:
        return PLACEHOLDER_IMAGE

    if costume_id is not None:
        costume = (character.get("Costumes") or {}).get(str(costume_id)) or (character.get("Costumes") or {}).get(costume_id)
        if costume:
            icon_path = costume.get("Icon") or costume.get("icon") or costume.get("SideIcon") or costume.get("sideIconName")
            resolved_costume = _normalise_asset_path(icon_path)
            if resolved_costume:
                return resolved_costume

    internal_name = resolve_character_internal_name(avatar_id)
    if not internal_name:
        return PLACEHOLDER_IMAGE
    return f"{IMAGE_BASE_URL}/UI_AvatarIcon_{internal_name}.png"


def resolve_icon_asset(icon_name: str | None) -> str:
    resolved = _normalise_asset_path(icon_name)
    return resolved or PLACEHOLDER_IMAGE


TEXT_HASH_KEYS = (
    "nameTextMapHash",
    "NameTextMapHash",
    "setNameTextMapHash",
    "SetNameTextMapHash",
    "reliquarySetNameTextMapHash",
)


def resolve_display_name(payload: dict[str, Any], locale: str = "en") -> str | None:
    if not isinstance(payload, dict):
        return None

    for key in TEXT_HASH_KEYS:
        resolved = resolve_text_map_hash(payload.get(key), locale)
        if resolved:
            return resolved

    for key in ("name", "setName", "weaponName", "displayName"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip() and not value.strip().isdigit():
            return value.strip()

    flat = payload.get("flat")
    if isinstance(flat, dict):
        return resolve_display_name(flat, locale)

    return None
