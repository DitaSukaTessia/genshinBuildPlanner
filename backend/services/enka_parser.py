from __future__ import annotations

from collections import Counter
from typing import Any

from services.mapper import (
    resolve_character_constellation_icons,
    resolve_character_image,
    resolve_character_name,
    resolve_character_skill_order,
    resolve_character_talent_icons,
    resolve_display_name,
    resolve_icon_asset,
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
    "FIGHT_PROP_BASE_ATTACK": "Base ATK",
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
ARTIFACT_SLOT_LABELS = {
    "EQUIP_BRACER": "Flower",
    "EQUIP_NECKLACE": "Plume",
    "EQUIP_SHOES": "Sands",
    "EQUIP_RING": "Goblet",
    "EQUIP_DRESS": "Circlet",
}
TALENT_LABELS = ("Normal Attack", "Elemental Skill", "Elemental Burst")
LOCKED_CONSTELLATION_ICON = "https://enka.network/ui/UI_Common_LockIcon.png"


def _to_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


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

        weapon_stats = []
        for stat in flat.get("weaponStats") or []:
            formatted = _format_append_prop(stat.get("appendPropId"), stat.get("statValue"))
            if formatted:
                weapon_stats.append(formatted)

        main_stat = weapon_stats[-1] if weapon_stats else None
        weapon_data = equip.get("weapon", {})
        level = weapon_data.get("level") or equip.get("level")
        affix_map = weapon_data.get("affixMap") or equip.get("affixMap") or {}
        refinement_seed = next(iter(affix_map.values()), None)
        refinement = int(refinement_seed) + 1 if refinement_seed is not None else None

        return {
            "name": resolve_display_name(equip) or f"Weapon {equip.get('itemId', 'Unknown')}",
            "image": resolve_icon_asset(flat.get("icon")),
            "level": int(level) if level is not None else None,
            "refinement": refinement,
            "main_stat": main_stat,
            "stats": weapon_stats,
        }

    return {
        "name": "Unknown weapon",
        "image": resolve_icon_asset(None),
        "level": None,
        "refinement": None,
        "main_stat": None,
        "stats": [],
    }


def _extract_artifacts(equip_list: list[dict[str, Any]]) -> list[dict[str, Any]]:
    artifacts: list[dict[str, Any]] = []
    for equip in equip_list:
        flat = equip.get("flat", {})
        if flat.get("itemType") != "ITEM_RELIQUARY":
            continue

        substats = []
        for stat in flat.get("reliquarySubstats") or []:
            formatted = _format_append_prop(stat.get("appendPropId"), stat.get("statValue"))
            if formatted:
                substats.append(formatted)

        main_stat = None
        reliquary_main_stat = flat.get("reliquaryMainstat") or {}
        if reliquary_main_stat:
            main_stat = _format_append_prop(
                reliquary_main_stat.get("mainPropId") or reliquary_main_stat.get("appendPropId"),
                reliquary_main_stat.get("statValue"),
            )

        artifacts.append(
            {
                "name": resolve_display_name(equip) or f"Artifact {equip.get('itemId', 'Unknown')}",
                "set_name": resolve_display_name({"setNameTextMapHash": flat.get("setNameTextMapHash")})
                or resolve_display_name(equip),
                "slot": ARTIFACT_SLOT_LABELS.get(flat.get("equipType"), flat.get("equipType", "Artifact")),
                "image": resolve_icon_asset(flat.get("icon")),
                "level": int(equip.get("reliquary", {}).get("level") or equip.get("level") or 0),
                "main_stat": main_stat,
                "substats": substats,
            }
        )

    return artifacts


def _extract_artifact_sets(artifacts: list[dict[str, Any]]) -> list[dict[str, Any]]:
    counts = Counter(artifact["set_name"] for artifact in artifacts if artifact.get("set_name"))
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


def _extract_talents(avatar: dict[str, Any]) -> list[dict[str, Any]]:
    skill_order = resolve_character_skill_order(avatar.get("avatarId"))
    skill_levels = avatar.get("skillLevelMap", {})
    talent_icons = resolve_character_talent_icons(avatar.get("avatarId"))

    talents: list[dict[str, Any]] = []
    for index, skill_id in enumerate(skill_order[:3]):
        level = skill_levels.get(str(skill_id), skill_levels.get(skill_id))
        talents.append(
            {
                "label": TALENT_LABELS[index],
                "level": int(level) if level is not None else None,
                "icon": talent_icons[index] if index < len(talent_icons) else resolve_icon_asset(None),
            }
        )

    while len(talents) < 3:
        talents.append({"label": TALENT_LABELS[len(talents)], "level": None, "icon": resolve_icon_asset(None)})

    return talents


def _extract_constellations(avatar: dict[str, Any]) -> list[dict[str, Any]]:
    unlocked_count = len(avatar.get("talentIdList", []))
    icons = resolve_character_constellation_icons(avatar.get("avatarId"))
    constellations = []
    for index in range(6):
        constellations.append(
            {
                "label": f"C{index + 1}",
                "icon": icons[index] if index < len(icons) else LOCKED_CONSTELLATION_ICON,
                "unlocked": index < unlocked_count,
            }
        )
    return constellations


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
    artifacts = _extract_artifacts(avatar.get("equipList", []))
    artifact_sets = _extract_artifact_sets(artifacts)
    parsed = {
        "name": resolve_character_name(avatar_id) or resolve_display_name(avatar) or f"Unknown Character ({avatar_id})",
        "image": resolve_character_image(avatar_id, avatar.get("costumeId")),
        "level": _parse_level(avatar),
        "constellation": len(avatar.get("talentIdList", [])),
        "constellations": _extract_constellations(avatar),
        "weapon": _extract_weapon(avatar.get("equipList", [])),
        "artifact_sets": artifact_sets,
        "artifact_count": len(artifacts),
        "artifacts": artifacts,
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
