from __future__ import annotations

from collections import Counter
from typing import Any

from services.mapper import resolve_character_image, resolve_character_name, resolve_display_name
from services.scorer import score_build

FIGHT_PROP_MAP = {
    "20": "crit_rate",
    "22": "crit_dmg",
    "23": "energy_recharge",
    "28": "elemental_mastery",
    "2000": "hp",
    "2001": "atk",
    "2002": "def",
}


def _to_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


# Enka percentage-like stats are commonly represented as decimals such as 0.65 or 1.8.
def _parse_percent_stat(value: Any) -> float:
    raw_value = _to_float(value)
    return round(raw_value * 100, 2) if raw_value <= 10 else round(raw_value, 2)


def _parse_level(avatar: dict[str, Any]) -> int:
    level_info = avatar.get("propMap", {}).get("4001", {})
    return int(_to_float(level_info.get("val"), 0))


def _extract_weapon(equip_list: list[dict[str, Any]]) -> str:
    for equip in equip_list:
        flat = equip.get("flat", {})
        if flat.get("itemType") == "ITEM_WEAPON":
            return resolve_display_name(equip) or f"Weapon {equip.get('itemId', 'Unknown')}"
    return "Unknown weapon"


def _extract_artifact_sets(equip_list: list[dict[str, Any]]) -> list[str]:
    artifact_sets: list[str] = []
    for equip in equip_list:
        flat = equip.get("flat", {})
        if flat.get("itemType") != "ITEM_RELIQUARY":
            continue
        artifact_sets.append(resolve_display_name(equip) or f"Set {equip.get('itemId', 'Unknown')}")

    counts = Counter(artifact_sets)
    return [name for name, _count in counts.most_common()]


def _extract_stats(avatar: dict[str, Any]) -> dict[str, float]:
    stats: dict[str, float] = {}
    fight_prop_map = avatar.get("fightPropMap", {})

    for fight_prop_id, output_name in FIGHT_PROP_MAP.items():
        raw_value = fight_prop_map.get(fight_prop_id)
        if raw_value is None:
            continue

        if output_name in {"crit_rate", "crit_dmg", "energy_recharge"}:
            stats[output_name] = _parse_percent_stat(raw_value)
        else:
            stats[output_name] = round(_to_float(raw_value), 2)

    return stats


def parse_avatar(avatar: dict[str, Any]) -> dict[str, Any]:
    avatar_id = avatar.get("avatarId")
    equip_list = avatar.get("equipList", [])
    parsed = {
        "name": resolve_character_name(avatar_id) or f"Character {avatar_id}",
        "image": resolve_character_image(avatar_id),
        "level": _parse_level(avatar),
        "weapon": _extract_weapon(equip_list),
        "artifact_sets": _extract_artifact_sets(equip_list),
        "stats": _extract_stats(avatar),
    }
    parsed.update(score_build(parsed))
    return parsed


def parse_showcase(raw_data: dict[str, Any], uid: str) -> dict[str, Any]:
    player_info = raw_data.get("playerInfo", {})
    characters = [parse_avatar(avatar) for avatar in raw_data.get("avatarInfoList", [])]

    return {
        "uid": uid,
        "ttl": raw_data.get("ttl"),
        "player": {
            "nickname": player_info.get("nickname"),
            "signature": player_info.get("signature"),
            "level": player_info.get("level"),
            "world_level": player_info.get("worldLevel"),
        },
        "characters": characters,
    }
