import { ArtifactPanel } from './ArtifactPanel';
import { CharacterFocus } from './CharacterFocus';
import { StatsGrid } from './StatsGrid';
import { TalentPanel } from './TalentPanel';
import { WeaponCard } from './WeaponCard';

export function CharacterDetail({ character }) {
  if (!character) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <CharacterFocus character={character} />
      <div className="grid gap-4 sm:gap-5 xl:grid-cols-2">
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
