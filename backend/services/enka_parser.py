from __future__ import annotations

from collections import Counter
from typing import Any

from services.mapper import (
    resolve_character_image,
    resolve_character_name,
    resolve_character_skill_order,
    resolve_display_name,
)
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

APPEND_PROP_LABELS = {
    "FIGHT_PROP_HP": "HP",
    "FIGHT_PROP_ATTACK": "ATK",
    "FIGHT_PROP_DEFENSE": "DEF",
    "FIGHT_PROP_HP_PERCENT": "HP%",
    "FIGHT_PROP_ATTACK_PERCENT": "ATK%",
    "FIGHT_PROP_DEFENSE_PERCENT": "DEF%",
    "FIGHT_PROP_CRITICAL": "CRIT Rate",
    "FIGHT_PROP_CRITICAL_HURT": "CRIT DMG",
    "FIGHT_PROP_CHARGE_EFFICIENCY": "Energy Recharge",
    "FIGHT_PROP_ELEMENT_MASTERY": "Elemental Mastery",
    "FIGHT_PROP_FIRE_ADD_HURT": "Pyro DMG",
    "FIGHT_PROP_WATER_ADD_HURT": "Hydro DMG",
    "FIGHT_PROP_ELEC_ADD_HURT": "Electro DMG",
    "FIGHT_PROP_WIND_ADD_HURT": "Anemo DMG",
    "FIGHT_PROP_ICE_ADD_HURT": "Cryo DMG",
    "FIGHT_PROP_ROCK_ADD_HURT": "Geo DMG",
    "FIGHT_PROP_GRASS_ADD_HURT": "Dendro DMG",
    "FIGHT_PROP_HEAL_ADD": "Healing Bonus",
}
PERCENT_APPEND_PROPS = {
    "FIGHT_PROP_HP_PERCENT",
    "FIGHT_PROP_ATTACK_PERCENT",
    "FIGHT_PROP_DEFENSE_PERCENT",
    "FIGHT_PROP_CRITICAL",
    "FIGHT_PROP_CRITICAL_HURT",
    "FIGHT_PROP_CHARGE_EFFICIENCY",
    "FIGHT_PROP_FIRE_ADD_HURT",
    "FIGHT_PROP_WATER_ADD_HURT",
    "FIGHT_PROP_ELEC_ADD_HURT",
    "FIGHT_PROP_WIND_ADD_HURT",
    "FIGHT_PROP_ICE_ADD_HURT",
    "FIGHT_PROP_ROCK_ADD_HURT",
    "FIGHT_PROP_GRASS_ADD_HURT",
    "FIGHT_PROP_HEAL_ADD",
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


def _format_append_prop(append_prop_id: str | None, stat_value: Any) -> str | None:
    if not append_prop_id:
        return None

    label = APPEND_PROP_LABELS.get(append_prop_id, append_prop_id.removeprefix("FIGHT_PROP_").replace("_", " ").title())
    numeric_value = _to_float(stat_value)
    if append_prop_id in PERCENT_APPEND_PROPS:
        numeric_value = numeric_value * 100 if numeric_value <= 10 else numeric_value
        return f"{label} {round(numeric_value, 1)}%"
    return f"{label} {round(numeric_value, 1)}"


def _parse_level(avatar: dict[str, Any]) -> int:
    level_info = avatar.get("propMap", {}).get("4001", {})
    return int(_to_float(level_info.get("val"), 0))


def _extract_weapon(equip_list: list[dict[str, Any]]) -> dict[str, Any]:
    for equip in equip_list:
        flat = equip.get("flat", {})
        if flat.get("itemType") != "ITEM_WEAPON":
            continue

        weapon_stats = flat.get("weaponStats") or []
        main_stat = None
        if weapon_stats:
            stat_source = weapon_stats[-1]
            main_stat = _format_append_prop(stat_source.get("appendPropId"), stat_source.get("statValue"))

        weapon_data = equip.get("weapon", {})
        level = weapon_data.get("level") or equip.get("level")

        return {
            "name": resolve_display_name(equip) or f"Weapon {equip.get('itemId', 'Unknown')}",
            "level": int(level) if level is not None else None,
            "main_stat": main_stat,
        }

    return {"name": "Unknown weapon", "level": None, "main_stat": None}


def _extract_artifact_sets(equip_list: list[dict[str, Any]]) -> list[dict[str, Any]]:
    artifact_sets: list[str] = []
    artifact_count = 0
    for equip in equip_list:
        flat = equip.get("flat", {})
        if flat.get("itemType") != "ITEM_RELIQUARY":
            continue
        artifact_count += 1
        artifact_sets.append(resolve_display_name(equip) or f"Set {equip.get('itemId', 'Unknown')}")

    counts = Counter(artifact_sets)
    return [{"name": name, "count": count} for name, count in counts.most_common()]


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


def _extract_talents(avatar: dict[str, Any]) -> dict[str, int | None]:
    skill_order = resolve_character_skill_order(avatar.get("avatarId"))
    skill_levels = avatar.get("skillLevelMap", {})

    values = []
    for skill_id in skill_order[:3]:
        level = skill_levels.get(str(skill_id), skill_levels.get(skill_id))
        values.append(int(level) if level is not None else None)

    while len(values) < 3:
        values.append(None)

    return {"normal_attack": values[0], "skill": values[1], "burst": values[2]}


def _parse_player(player_info: dict[str, Any], uid: str) -> dict[str, Any]:
    profile_picture = player_info.get("profilePicture", {})
    profile_avatar_id = profile_picture.get("avatarId")

    abyss_floor = player_info.get("towerFloorIndex")
    abyss_room = player_info.get("towerLevelIndex")
    abyss_label = f"Floor {abyss_floor}-{abyss_room}" if abyss_floor and abyss_room else "Not available"

    theater_value = (
        player_info.get("theaterModeIndex")
        or player_info.get("theaterActIndex")
        or player_info.get("theaterScheduleId")
    )
    theater_label = f"Act {theater_value}" if theater_value else "Not available"

    return {
        "uid": uid,
        "nickname": player_info.get("nickname"),
        "signature": player_info.get("signature"),
        "adventure_rank": player_info.get("level"),
        "world_level": player_info.get("worldLevel"),
        "profile_picture": resolve_character_image(profile_avatar_id),
        "spiral_abyss": abyss_label,
        "imaginarium_theater": theater_label,
    }


def parse_avatar(avatar: dict[str, Any]) -> dict[str, Any]:
    avatar_id = avatar.get("avatarId")
    equip_list = avatar.get("equipList", [])
    artifact_sets = _extract_artifact_sets(equip_list)
    parsed = {
        "name": resolve_character_name(avatar_id) or f"Character {avatar_id}",
        "image": resolve_character_image(avatar_id),
        "level": _parse_level(avatar),
        "constellation": len(avatar.get("talentIdList", [])),
        "weapon": _extract_weapon(equip_list),
        "artifact_sets": artifact_sets,
        "artifact_count": sum(set_info["count"] for set_info in artifact_sets),
        "stats": _extract_stats(avatar),
        "talents": _extract_talents(avatar),
    }
    parsed.update(score_build(parsed))
    return parsed


def parse_showcase(raw_data: dict[str, Any], uid: str) -> dict[str, Any]:
    player_info = raw_data.get("playerInfo", {})
    characters = [parse_avatar(avatar) for avatar in raw_data.get("avatarInfoList", [])]

    return {
        "uid": uid,
        "ttl": raw_data.get("ttl"),
        "player": _parse_player(player_info, uid),
        "characters": characters,
    }
