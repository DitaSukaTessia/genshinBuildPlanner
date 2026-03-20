import { ArtifactPanel } from './ArtifactPanel';
import { CharacterFocus } from './CharacterFocus';
import { ConstellationPanel } from './ConstellationPanel';
import { ScoreBox } from './ScoreBox';
import { StatsGrid } from './StatsGrid';
import { TalentPanel } from './TalentPanel';
import { WeaponCard } from './WeaponCard';

export function CharacterDetail({ character }) {
  if (!character) {
    return null;
  }

  return (
    <div className="space-y-5">
      <CharacterFocus character={character} />
      <div className="grid gap-5 2xl:grid-cols-[1.2fr_0.8fr]">
        <ConstellationPanel constellations={character.constellations} />
        <ScoreBox analysis={character.analysis} score={character.score} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <WeaponCard weapon={character.weapon} />
        <TalentPanel talents={character.talents} />
      </div>
      <StatsGrid stats={character.stats} />
      <ArtifactPanel
        artifactCount={character.artifact_count}
        artifacts={character.artifacts}
        artifactSets={character.artifact_sets}
      />
    </div>
  );
}
