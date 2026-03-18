from __future__ import annotations

from collections import Counter
from typing import Any

from services.build_scoring import score_build

FIGHT_PROP_MAP = {
    "20": "crit_rate",
    "22": "crit_dmg",
    "23": "energy_recharge",
    "28": "elemental_mastery",
    "2001": "atk",
    "2002": "def",
    "2000": "hp",
}


def _to_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _parse_percent_stat(value: Any) -> float:
    raw_value = _to_float(value)
    if raw_value <= 10:
        return round(raw_value * 100, 2)
    return round(raw_value, 2)


def _parse_level(avatar: dict[str, Any]) -> int:
    prop_map = avatar.get("propMap", {})
    level_info = prop_map.get("4001", {})
    return int(_to_float(level_info.get("val"), 0))


def _best_name(source: dict[str, Any], fallback: str) -> str:
    if not isinstance(source, dict):
        return fallback

    direct_candidates = [
        source.get("name"),
        source.get("itemName"),
        source.get("avatarName"),
        source.get("setName"),
        source.get("weaponName"),
        source.get("displayName"),
    ]
    flat = source.get("flat", {}) if isinstance(source.get("flat"), dict) else {}
    flat_candidates = [
        flat.get("name"),
        flat.get("title"),
        flat.get("itemName"),
        flat.get("setName"),
        flat.get("artifactSetName"),
        flat.get("weaponName"),
    ]

    for candidate in [*direct_candidates, *flat_candidates]:
        if isinstance(candidate, str) and candidate.strip() and not candidate.strip().isdigit():
            return candidate.strip()

    return fallback


def _extract_weapon(equip_list: list[dict[str, Any]]) -> str:
    for equip in equip_list:
        flat = equip.get("flat", {})
        if flat.get("itemType") == "ITEM_WEAPON":
            item_id = equip.get("itemId") or flat.get("id") or "Unknown"
            return _best_name(equip, f"Weapon {item_id}")
    return "Unknown weapon"


def _extract_artifact_sets(equip_list: list[dict[str, Any]]) -> list[str]:
    artifact_names: list[str] = []
    for equip in equip_list:
        flat = equip.get("flat", {})
        if flat.get("itemType") != "ITEM_RELIQUARY":
            continue

        set_candidates = [
            flat.get("setName"),
            flat.get("artifactSetName"),
            flat.get("reliquarySetName"),
            equip.get("setName"),
        ]
        set_name = next(
            (
                candidate.strip()
                for candidate in set_candidates
                if isinstance(candidate, str) and candidate.strip() and not candidate.strip().isdigit()
            ),
            None,
        )

        if set_name is None:
            set_id = flat.get("setId") or equip.get("setId") or equip.get("itemId") or "Unknown"
            set_name = f"Set {set_id}"

        artifact_names.append(set_name)

    if not artifact_names:
        return []

    counts = Counter(artifact_names)
    return [name for name, _count in counts.most_common()]


def _extract_stats(avatar: dict[str, Any]) -> dict[str, float]:
    fight_prop_map = avatar.get("fightPropMap", {})
    stats: dict[str, float] = {}

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
    equip_list = avatar.get("equipList", [])
    character_id = avatar.get("avatarId") or "Unknown"

    parsed = {
        "name": _best_name(avatar, f"Character {character_id}"),
        "level": _parse_level(avatar),
        "weapon": _extract_weapon(equip_list),
        "artifact_sets": _extract_artifact_sets(equip_list),
        "stats": _extract_stats(avatar),
    }
    parsed.update(score_build(parsed))
    return parsed


def parse_showcase(raw_data: dict[str, Any], uid: str) -> dict[str, Any]:
    avatars = raw_data.get("avatarInfoList") or []
    parsed_characters = [parse_avatar(avatar) for avatar in avatars]

    return {
        "uid": uid,
        "ttl": raw_data.get("ttl"),
        "player": raw_data.get("playerInfo", {}),
        "characters": parsed_characters,
    }
