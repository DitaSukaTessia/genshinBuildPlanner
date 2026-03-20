from __future__ import annotations

from typing import Any


def clamp_score(value: float) -> int:
    return max(0, min(100, round(value)))


def score_build(character_data: dict[str, Any]) -> dict[str, Any]:
    """Score a build using a simple crit-based heuristic.

    This stays intentionally modular so it can be replaced by a richer
    recommendation engine or AI evaluator later.
    """

    stats = character_data.get("stats", {})
    crit_rate = float(stats.get("crit_rate", 0))
    crit_dmg = float(stats.get("crit_dmg", 0))
    atk = float(stats.get("atk", 0))

    score = 100.0
    analysis: list[str] = []

    if crit_rate < 60:
        penalty = min(25, (60 - crit_rate) * 0.9)
        score -= penalty
        analysis.append("CRIT Rate is below the ideal 60–80 range")
    elif crit_rate > 80:
        penalty = min(18, (crit_rate - 80) * 0.7)
        score -= penalty
        analysis.append("CRIT Rate is above the ideal 60–80 range")
    else:
        score += 4
        analysis.append("Good CRIT Rate range")

    if crit_dmg < 150:
        penalty = min(25, (150 - crit_dmg) * 0.18)
        score -= penalty
        analysis.append("CRIT DMG is below the ideal 150–250 range")
    elif crit_dmg > 250:
        penalty = min(15, (crit_dmg - 250) * 0.08)
        score -= penalty
        analysis.append("CRIT DMG is above the ideal 150–250 range")
    else:
        score += 4
        analysis.append("CRIT DMG is in a healthy range")

    ideal_crit_dmg = crit_rate * 2
    ratio_gap = abs(crit_dmg - ideal_crit_dmg)
    if crit_rate <= 0 or crit_dmg <= 0:
        score -= 20
        analysis.append("Missing CRIT stats for a meaningful ratio check")
    elif ratio_gap <= 20:
        score += 8
        analysis.append("Good CRIT balance")
    elif ratio_gap <= 45:
        score -= 6
        analysis.append("CRIT ratio is a bit off from the 1:2 target")
    else:
        score -= min(24, ratio_gap * 0.18)
        analysis.append("CRIT ratio is far from the 1:2 target")

    if atk >= 1200:
        analysis.append("ATK is acceptable")
    else:
        analysis.append("ATK is on the lower side")

    return {
        "score": clamp_score(score),
        "analysis": analysis,
    }
